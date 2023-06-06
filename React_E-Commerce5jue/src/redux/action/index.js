// For Add Item to Cart
export const addCart = (product) => {
	return {
		type: 'ADDITEM',
		payload: product,
	};
};

// For Delete Item to Cart
export const delCart = (product) => {
	return {
		type: 'DELITEM',
		payload: product,
	};
};

export const clearCart = () => {
	return {
		type: 'CLEARCART',
		payload: [],
	};
};
export const addCategory = (data) => {
	return {
		type: 'ADD_CATEGORY',
		payload: data,
	};
};
export const addAllCourse = (data) => {
	return {
		type: 'ADD_COURSES',
		payload: data,
	};
};
export const subValue = (data) => {
	return {
		type: 'TOTAL',
		payload: data,
	};
};
