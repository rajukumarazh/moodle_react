const data = {
	category: [],
	courses: [],
};

const Course_Reducer = (state = data, action) => {
	// const product = action.payload;
	switch (action.type) {
		case 'ADD_CATEGORY':
			// Check if product already in cart
			return { ...state, category: action.payload };
		case 'ADD_COURSES':
			return {
				...state,
				courses: action.payload,
			};
		default:
			return state;
	}
};

export default Course_Reducer;
