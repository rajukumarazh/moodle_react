import React, { useState } from 'react';
import { Footer, Navbar } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { saveToLocal, MOODLE_URL, NODE_API_URL } from '../Services/storage';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
	const [state, setState] = useState({});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const submitForm = async (e) => {
		e.preventDefault();

		let axiosConfig = {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		};

		axios
			.post(NODE_API_URL + '/register', state, axiosConfig)
			.then((res) => {
				console.log('RESPONSE RECEIVED: ', res);
				if (res.data.success) {
					saveToLocal('user', res.data.user);
					saveToLocal('token', res.data.token);
					window.open(
						`${MOODLE_URL}/login/custom_auto_login.php?user_id=${res.data.user.moodle_user_id}`,
						'_top'
					);
					navigate('/');
				} else {
					// alert(res.data.error);
					toast.error(`${res.data.error}`, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: true,
					});
				}
			})
			.catch((err) => {
				console.log('AXIOS ERROR: ', err);
			});
	};

	return (
		<>
			<div className="container my-3 py-3">
				<h1 className="text-center">Register</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<form onSubmit={submitForm}>
							<div className="form my-3">
								<label for="firstname">First Name</label>
								<input
									type="text"
									className="form-control"
									id="firstname"
									name="firstname"
									placeholder="Enter Your firsttname"
									onChange={handleChange}
								/>
							</div>
							<div className="form my-3">
								<label for="lastname">Last Name</label>
								<input
									type="text"
									className="form-control"
									id="lastname"
									name="lastname"
									placeholder="Enter Your lastname"
									onChange={handleChange}
								/>
							</div>
							<div className="form my-3">
								<label for="username">Username</label>
								<input
									type="text"
									className="form-control"
									id="username"
									name="username"
									placeholder="Enter Your Username"
									onChange={handleChange}
								/>
							</div>
							<div className="form my-3">
								<label for="Email">Email address</label>
								<input
									type="email"
									className="form-control"
									id="Email"
									placeholder="name@example.com"
									name="email"
									onChange={handleChange}
								/>
							</div>
							<div className="form  my-3">
								<label for="Password">Password</label>
								<input
									type="password"
									className="form-control"
									id="Password"
									placeholder="Password"
									name="password"
									onChange={handleChange}
								/>
								<span className="text-danger">
									Password Hint:
									<br />
									Must be 8 charecter
									<br />
									it include 1: Number, Uppercase,Lower case,Alphanumeric,Non
									alphaneumeric
								</span>
							</div>
							<div className="my-3">
								<p>
									Already has an account?{' '}
									<Link
										to="/login"
										className="text-decoration-underline text-info"
									>
										Login
									</Link>{' '}
								</p>
							</div>
							<div className="text-center">
								<button
									class="my-2 mx-auto btn btn-dark"
									type="submit"
									onClick={submitForm}
								>
									Register
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};

export default Register;
