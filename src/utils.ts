// A helper function to select dom elements
export const $ = (s: string) => {
	let a = document.querySelectorAll(s);
	return a.length > 1 ? a : a[0];
};

