import React, { useState, useEffect } from 'react';
import {
	RAZORPAY_KEY_ID,
	getFromLocal,
	NODE_API_URL,
} from '../Services/storage';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../App.css';
import { clearCart } from '../redux/action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const user = getFromLocal('user');

export const StripeCheckOut = () => {
	const state = useSelector((state) => state.handleCart);
	const [succeeded, setSucceeded] = useState(false);
	const [stateData, setStateData] = useState({});
	const [totalItems, setTotalItems] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState('');
	const [currentUser, setCurrentUser] = useState('');
	const [buyed, setBuyed] = useState();
	let buyedCourse = state?.map((curr) => {
		return { course_id: curr._id, title: curr.title, price: curr.price };
	});
	console.log('buyedCourse', buyed);

	let dispatch = useDispatch();
	let navigate = useNavigate();
	// console.log('buyeddddStripe', buyedCourse);
	let enrolluser = state?.map((e) => e.moodle_course_id);
	useEffect(() => {
		let localStor = localStorage.getItem('user');
		let ob = JSON.parse(localStor);
		console.log('getuser', ob);
		setCurrentUser(() => ob);

		let total = 0;
		let items = 0;
		state.map((item) => {
			return (total += item.price * item.qty);
		});

		setSubtotal(total);
		function goStripe(prc) {
			console.log('prc', prc);
			fetch(NODE_API_URL + '/stripe-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					price: prc * 100,
					currency: 'usd',
					// moodle_course_ids: state?.map((e) => e.moodle_course_id),
					// user: user,
				}),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setClientSecret(data.clientSecret);
				});
		}
		goStripe(total);

		state.map((item) => {
			return (items += item.qty);
		});

		setTotalItems(items);

		// setStateData(user);
	}, []);
	// useEffect(() => {
	// 	if (buyedCourse !== undefined) {
	// 		setBuyed(() => buyedCourse);
	// 	}
	// }, []);
	const stripe = useStripe();
	const elements = useElements();
	console.log('totaLStripeAmount', subtotal);

	const cardStyle = {
		style: {},
	};

	// handle input errors
	const handleChange = async (event) => {
		// setDisabled(event.empty);
		setError(event.error ? event.error.message : '');
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		// setProcessing(true);
		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});

		if (payload && payload?.paymentIntent?.status === 'succeeded') {
			console.log('buyedEmail', buyedCourse[0]?.title);
			axios.post(NODE_API_URL + '/enroll_user', {
				moodle_course_ids: enrolluser,
				user: currentUser?.moodle_user_id,
			});
			axios.post(NODE_API_URL + '/payment_details', {
				course: buyedCourse,
				user_id: currentUser?._id,
				order_id: payload?.paymentIntent?.id,
				amount: subtotal,
				date: payload?.paymentIntent?.created,
			});

			// axios.post(NODE_API_URL + '/send-email', {
			// 	email: 'jaspreet.dev@palinfocom.com',
			// 	name: currentUser?.firstname + ' ' + currentUser?.lastname,
			// 	Title: buyedCourse[0] && buyedCourse?.title,
			// 	user_id: currentUser?._id,
			// 	orderNumber: payload?.paymentIntent?.id,
			// 	Total: subtotal,
			// 	Quantity: buyedCourse?.length,
			// 	// email: currentUser?.email,
			// 	// message: `
			// 	// Hi,
			// 	// ${currentUser?.firstname + ' ' + currentUser?.lastname}\n
			// 	// your order is successfully placed with order_id: ${
			// 	// 	payload?.paymentIntent?.id
			// 	// } and amount $ ${subtotal} USD\n happy learning`,
			// });
			toast.success('payment successfully completed !', {
				position: 'top-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
			});
			setTimeout(() => {
				navigate('/');
			}, 2000);
		}

		// if (enrolledData !== undefined) {
		// 	navigate('/');
		// }
		// console.log('payload', payload?.paymentIntent?.status);

		// axios.post(NODE_API_URL + '/payment_details', {
		// 	course: buyedCourse,
		// 	user_id: user?._id,
		// 	order_id: payload?.paymentIntent?.id,
		// 	amount: subtotal,
		// 	date: payload?.paymentIntent?.created,
		// });

		// axios.post(NODE_API_URL + '/send-email', {
		// 	// email: 'jaspreet.dev@palinfocom.com',
		// 	email: user?.email,
		// 	message: `your order is successfully placed with order_id: ${payload?.paymentIntent?.id} and amount ${subtotal} USD\n happy learning`,
		// });

		// alert('Your order successfully completed');
		dispatch(clearCart());
		// navigate('/');

		// else {
		// 	setError(`Payment failed ${payload.error.message}`);
		// 	setProcessing(false);
		// 	// setError(null);
		// 	// setProcessing(false);
		// 	// setSucceeded(true);

		// }
	};
	console.log('currentUser', currentUser);
	return (
		<div>
			<form id="payment-form" onSubmit={handleSubmit}>
				<p className="text-danger">
					Demo
					<br />
					Card Number: &nbsp;4242424242424242
				</p>
				<CardElement
					id="card-element"
					// options={cardStyle}
					options={{ hidePostalCode: true }}
					onChange={handleChange}
				/>
				<button id="submit">
					<span id="button-text">
						{processing ? (
							<div className="spinner" id="spinner"></div>
						) : (
							'Pay now'
						)}
					</span>
				</button>
				{error && (
					<div className="card-error" role="alert">
						{error}
					</div>
				)}
				{/* <p className={succeeded ? 'result-message' : 'result-message hidden'}>
				Payment succeeded, see the result in your
				<a href={`https://dashboard.stripe.com/test/payments`}>
					{' '}
					Stripe dashboard.
				</a>{' '}
				Refresh the page to pay again.
			</p> */}
			</form>
			<ToastContainer />
		</div>
	);
};
