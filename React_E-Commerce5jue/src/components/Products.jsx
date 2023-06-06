import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAllCourse, addCart } from '../redux/action';
import { addCategory } from '../redux/action';
import NotAvailable from './NotAvailable';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MOODLE_URL, NODE_API_URL, getFromLocal } from '../Services/storage';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import { useSelector } from 'react-redux';
import { FaPencilAlt, FaEye } from 'react-icons/fa';
const Products = () => {
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState(data);
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState();
	const [currentProduct, setCurrentProduct] = useState();
	const token = getFromLocal('token');
	const user = getFromLocal('user');
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	let allState = useSelector((state) => state);
	let componentMounted = true;
	console.log('start', user);
	const dispatch = useDispatch();
	const addProduct = (product) => {
		setCurrentProduct(() => product);
		// if (allState?.handleCart.length == allState?.handleCart.length) {
		// 	alert('product already addedd');
		// }
		let forAlert = allState?.handleCart?.filter(
			(curr) => curr?.moodle_course_id === product?.moodle_course_id
		);
		if (forAlert.length > 0) {
			// alert('already in cart!');
			toast.error('already in cart!', {
				position: 'top-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
			});
		} else {
			dispatch(addCart(product));

			// toast.success('already in cart!!', {
			// 	position: 'top-center',
			// 	autoClose: 5000,
			// 	hideProgressBar: true,
			// 	closeOnClick: true,
			// 	pauseOnHover: false,
			// 	draggable: true,
			// });
			// alert('item added in cart');
			toast.success('item added in cart !', {
				position: 'top-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
			});
		}
	};

	// async function GetCategories() {
	// 	let dt = await axios.get(`${NODE_API_URL}/categories`).then((res) => res);
	// 	if (dt) {
	// 		dispatch(addCategory(dt));
	// 	}
	// 	return dt;
	// }
	// console.log('compare', 1 == '1');

	useEffect(() => {
		const getProducts = async () => {
			setLoading(true);

			let headers = {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			};

			const courses = await axios
				.get(NODE_API_URL + '/fetch-courses', { headers })
				.then((response) => {
					setData(response.data.result);

					setFilter(() => response.data.result);
					return response;
				})
				.catch((err) => err);

			if (courses?.data) {
				dispatch(addAllCourse(courses?.data?.result));
			}

			setLoading(false);

			let axiosConfig = {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			};

			if (user) {
				const userEnrolledCourses = await axios
					.post(NODE_API_URL + '/enrolled-courses', {
						moodle_user_id: user?.moodle_user_id,
					})
					.then((res) => res?.data)
					.catch((err) => {
						console.log('AXIOS ERROR: ', err);
					});
				console.log('enrolled Couse', userEnrolledCourses?.result);
				setEnrolledCourses(userEnrolledCourses?.result);
			}

			return () => {
				componentMounted = false;
			};
		};

		getProducts();
		async function GetCategories() {
			let dt = await axios.get(`${NODE_API_URL}/categories`).then((res) => {
				return res;
			});
			if (dt) {
				dispatch(addCategory(dt?.data));
			}
			setCategories(() => dt);
		}
		GetCategories();
	}, []);
	// console.log('categories123', allState);

	const Loading = () => {
		return (
			<>
				<div className="col-12 py-5 text-center">
					<Skeleton height={40} width={560} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
				<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
					<Skeleton height={592} />
				</div>
			</>
		);
	};

	const filterProduct = (cat) => {
		if (cat.length) {
			setFilter(() => cat);
		} else {
			console.log('category', cat, data);
			const updatedList = data?.filter((item) => item?.category === cat + '');
			setFilter(() => updatedList);
		}
	};

	console.log('filter', filter);
	// console.log('filteredDAta', filter);
	const viewCourse = (moodle_course_id) =>
		window.open(
			MOODLE_URL + '/course/view.php?id=' + moodle_course_id,
			'_blank'
		);
	console.log('dfkdkfkdk', data);
	const ShowProducts = () => {
		return (
			<>
				{data?.length > 0 && (
					<div className="buttons text-center py-5 ">
						<button
							className="btn btn-outline-dark btn-sm m-2"
							onClick={() => filterProduct(data)}
						>
							All
						</button>

						{allState?.Course_Reducer?.category.map((curr, i, arr) => {
							return (
								<button
									className="btn btn-outline-dark btn-sm m-2"
									onClick={() => filterProduct(curr?.id)}
								>
									{curr?.name}
								</button>
							);
						})}
					</div>
				)}

				{filter?.map((product, i, arr) => {
					const enroll =
						enrolledCourses &&
						enrolledCourses?.find((e) => e.id === product.moodle_course_id);

					console.log('enrolledCourse', enrolledCourses);

					return (
						<div
							id={product.id}
							key={product.id}
							className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
						>
							<div className="card text-center h-100" key={product.id}>
								<img
									className="card-img-top p-3"
									src={product.image_url ? product.image_url : './card.jpg'}
									alt="Card"
									height={300}
								/>
								<div className="card-body">
									<h5 className="card-title">
										{/* {product.title.substring(0, 12)}... */}
										{product.title}
									</h5>
									<p className="card-text">
										{/* {product.description.substring(0, 90)}... */}
										{/* {product.description} */}
									</p>
								</div>
								<ul className="list-group list-group-flush">
									<li className="list-group-item lead">$ {product.price}</li>
								</ul>
								<div className="card-body">
									{!enroll ? (
										<>
											{/* <Link
												to={'/product/' + product._id}
												className="btn btn-dark m-1"
											>
												Buy Now
											</Link> */}
											<button
												className="btn btn-dark m-1"
												onClick={() => addProduct(product)}
											>
												Add to Cart
											</button>
											{user?.roleid === 2 && (
												<Link
													to="/create-courses"
													state={{
														moodle_course_id: product?.moodle_course_id,
														category: product?.category,
													}}
													className="btn btn-dark m-1"
													// onClick={() => addProduct(product)}
												>
													Edit Course &nbsp; <FaPencilAlt />
												</Link>
											)}
										</>
									) : (
										<>
											<button
												className="btn btn-success m-1"
												onClick={() => viewCourse(product?.moodle_course_id)}
											>
												View Course &nbsp;
												<FaEye />
											</button>

											<ProgressBar
												bgcolor="orange"
												progress={enroll?.progress || 0}
												height={20}
											/>
										</>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</>
		);
	};
	return (
		<>
			<div className="container my-3 py-3">
				<div className="row">
					<div className="col-12">
						<h2 className="display-5 text-center">Latest Courses</h2>
						<hr />
					</div>
				</div>
				<div className="row justify-content-center ">
					{loading ? (
						<Loading />
					) : !loading ? (
						<>
							<ShowProducts />
							{/* {filter.length == 0 && <NotAvailable data={data} />} */}
						</>
					) : (
						''
					)}
				</div>
			</div>
			{/* <NotAvailable /> */}
			<ToastContainer />
		</>
	);
};

export default Products;
