import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/action';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	RAZORPAY_KEY_ID,
	getFromLocal,
	NODE_API_URL,
} from '../Services/storage';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
const Checkout = () => {
	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [resp, setResp] = useState();
	const state = useSelector((state) => state.handleCart);
	console.log('states', state);
	const user = getFromLocal('user');
	const location = useLocation();
	const [stateData, setStateData] = useState({});
	const [totalItems, setTotalItems] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	// let allSTate = useSelector((state) => state);

	let buyedCourse = state?.map((curr) => {
		return { course_id: curr._id, title: curr.title, price: curr.price };
	});
	console.log('checkoutCartState', buyedCourse);
	//Handle Form Data
	const handleChange = (e) => {
		const { value, id } = e.target;

		setStateData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	//Update Total price and quantity
	console.log('user', user);
	console.log('locationss', location);
	// console.log('resp', resp);
	useEffect(() => {
		let total = 0;

		let items = 0;

		state.map((item) => {
			return (total += item.price * item.qty);
		});

		setSubtotal(total);

		state.map((item) => {
			return (items += item.qty);
		});

		setTotalItems(items);

		setStateData(user);
	}, []);
	// console.log('resp', typeof resp.created_at);
	const payment = async (e) => {
		e.preventDefault();

		let axiosConfig = {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		};

		const params = {
			amount: subtotal,
			currency: 'INR',
			user: user,
		};

		const orderResp = await axios.post(
			NODE_API_URL + '/payment-process',
			params,
			axiosConfig
		);

		const { amount, id, currency } = orderResp?.data;
		setResp(() => orderResp?.data);
		console.log('verifyOrder', orderResp.data);
		const options = {
			key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
			amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: currency,
			name: 'PALINFO COM PVT. LTD.',
			description: 'Test Transaction',
			image: '',
			order_id: id,

			handler: async function (response) {
				let handlerRespParams = {
					razorpay_order_id: response.razorpay_order_id,
					razorpay_payment_id: response.razorpay_payment_id,
					razorpay_signature: response.razorpay_signature,
					moodle_course_ids: state?.map((e) => e.moodle_course_id),
					user: user,
				};
				const verifyOrder = await axios.post(
					NODE_API_URL + '/verify-order',
					handlerRespParams,
					axiosConfig
				);
				console.log('datasfor Payment', verifyOrder?.data);
				if (verifyOrder.data?.success) {
					axios.post(NODE_API_URL + '/payment_details', {
						course: buyedCourse,
						user_id: user._id,
						order_id: id,
						amount: subtotal,
						date: orderResp.data.created_at,
					});

					// alert('Your order successfully completed');
					toast.success('Your order successfully completed !', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 2000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: true,
					});
					dispatch(clearCart());
					navigate('/');
				}
			},
			prefill: {
				name: `${stateData?.firstname} ${stateData?.lastname}`,
				email: stateData?.email,
				contact: 8699660863,
			},
			modal: {
				ondismiss: function () {
					console.log('Checkout form closed');
				},
			},
			theme: {
				color: '#3399cc',
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};
	// useEffect(() => {
	// 	fetch('http://localhost:5000/stripe-payment', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ price: subtotal }),
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			console.log('stripeResponse', data);
	// 			// setClientSecret(data.clientSecret); // <-- setting the client secret here
	// 		});
	// }, []);

	const EmptyCart = () => {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12 py-5 bg-light text-center">
						<h4 className="p-3 display-5">No item in Cart</h4>
						<Link to="/" className="btn btn-outline-dark mx-4">
							<i className="fa fa-arrow-left"></i> Continue Buy Courses
						</Link>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{/* <ToastContainer /> */}
			<div className="container my-3 py-3">
				<h1 className="text-center">Checkout</h1>
				<hr />
				{state.length ? (
					<div className="container py-5">
						<div className="row my-4">
							<div className="col-md-5 col-lg-4 order-md-last">
								<div className="card mb-4">
									<div className="card-header py-3 bg-light">
										<h5 className="mb-0">Order Summary</h5>
									</div>
									<div className="card-body">
										<ul className="list-group list-group-flush">
											<li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
												Products ({totalItems})
												<span>${Math.round(subtotal)}</span>
											</li>

											<li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
												<div>
													<strong>Total amount</strong>
												</div>
												<span>
													<strong>${Math.round(subtotal)}</strong>
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-md-7 col-lg-8">
								<div className="card mb-4">
									<div className="card-header py-3">
										<h4 className="mb-0">Billing address</h4>
									</div>
									<div className="card-body">
										<form className="needs-validation">
											<div className="row g-3">
												<div className="col-sm-6 my-1">
													<label for="firstName" className="form-label">
														First name
													</label>
													<input
														type="text"
														className="form-control"
														id="firstName"
														placeholder=""
														name="firstName"
														onChange={handleChange}
														value={stateData['firstname']}
													/>
													<div className="invalid-feedback">
														Valid first name is required.
													</div>
												</div>

												<div className="col-sm-6 my-1">
													<label for="lastName" className="form-label">
														Last name
													</label>
													<input
														type="text"
														className="form-control"
														id="lastName"
														placeholder=""
														onChange={handleChange}
														required
														value={stateData['lastName']}
													/>
													<div className="invalid-feedback">
														Valid last name is required.
													</div>
												</div>

												<div className="col-12 my-1">
													<label for="email" className="form-label">
														Email
													</label>
													<input
														type="email"
														className="form-control"
														id="email"
														placeholder="you@example.com"
														onChange={handleChange}
														required
														value={stateData['email']}
													/>
													<div className="invalid-feedback">
														Please enter a valid email address for shipping
														updates.
													</div>
												</div>

												<div className="col-12 my-1">
													<label for="address" className="form-label">
														Address
													</label>
													<input
														type="text"
														className="form-control"
														id="address"
														placeholder="1234 Main St"
														onChange={handleChange}
														required
													/>
													<div className="invalid-feedback">
														Please enter your shipping address.
													</div>
												</div>

												<div className="col-md-5 my-1">
													<label for="country" className="form-label">
														Country
													</label>
													<br />
													<select
														className="form-select"
														id="country"
														onChange={handleChange}
														required
													>
														<option value="">Choose...</option>
														<option>India</option>
													</select>
													<div className="invalid-feedback">
														Please select a valid country.
													</div>
												</div>

												<div className="col-md-4 my-1">
													<label for="state" className="form-label">
														State
													</label>
													<br />
													<select
														className="form-select"
														id="state"
														onChange={handleChange}
														required
													>
														<option value="">Choose...</option>
														<option>Punjab</option>
													</select>
													<div className="invalid-feedback">
														Please provide a valid state.
													</div>
												</div>

												{/* <div className="col-md-3 my-1">
													<label for="zip" className="form-label">
														Zip
													</label>
													<input
														type="text"
														className="form-control"
														id="zip"
														placeholder=""
														onChange={handleChange}
														required
													/>
													<div className="invalid-feedback">
														Zip code required.
													</div>
												</div> */}
											</div>

											<hr className="my-4" />

											<h4 className="mb-3">Payment</h4>

											<hr className="my-4" />

											<Link
												to="/gostripe"
												className="w-100 btn btn-primary "
												// type="submit"
												// onClick={payment}
											>
												Continue to checkout
											</Link>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<EmptyCart />
				)}
			</div>
			<ToastContainer />
		</>
	);
};

export default Checkout;
