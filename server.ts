import fs from 'node:fs/promises'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { randomUUID } from 'crypto';

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    if (url === '') {
      res.redirect(randomUUID());
      return;
    }

    let template
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
    } else {
      template = templateHtml
    }

    res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})


const server = createServer(app)
const io = new Server(server);

// Create a Map to store the track data for each room
const roomData = new Map();

io.on('connection', socket => {
  // When a user joins a room
  socket.on('joinRoom', room => {
    socket.join(room);

    // Send the current track data for the room to the user
    const trackData = roomData.get(room) || [];
    socket.emit('roomJoined', trackData);
  });

  // When a user sends track data
  socket.on('track', ({ room, data }) => {
    // Add the track data to the room's data
    const trackData = roomData.get(room) || [];
    trackData.push(data);
    roomData.set(room, trackData);

    // Broadcast the track data to the other users in the room
    socket.to(room).emit('track', data);
  });

  // When a user sends an undo command
  socket.on('undo', room => {
    // Remove the last piece of track data from the room's data
    const trackData = roomData.get(room);
    if (trackData) {
      trackData.pop();
      roomData.set(room, trackData);
    }

    // Broadcast the undo command to the other users in the room
    socket.to(room).emit('undo');
  });
});

server.listen(port)
if (! isProduction) console.log(`Serving app at http://localhost:${port}`);
