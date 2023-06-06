import handleCart from './handleCart';
import { combineReducers } from 'redux';
import Course_Reducer from './Course_Reducer';
const rootReducers = combineReducers({
	handleCart,
	Course_Reducer,
});
export default rootReducers;
