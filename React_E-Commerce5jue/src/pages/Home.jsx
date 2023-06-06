import { Navbar, Main, Product, Footer } from '../components';
import axios from 'axios';
import { NODE_API_URL } from '../Services/storage';
import { useEffect, useState } from 'react';
import { addCategory } from '../redux/action';
import { useDispatch, useSelector } from 'react-redux';

function Home() {
	const [categories, setCategories] = useState();
	const dispatch = useDispatch();
	const allState = useSelector((state) => state);
	useEffect(() => {
		async function GetCategories() {
			let dt = await axios.get(`${NODE_API_URL}/categories`).then((res) => {
				return res;
			});
			if (dt) {
				dispatch(addCategory(dt?.data));
			}
			setCategories(() => dt?.data);
		}
		GetCategories();
	}, []);
	console.log('catHome', categories);
	return (
		<>
			<Main />
			<Product />
		</>
	);
}

export default Home;
