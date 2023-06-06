import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer, Navbar } from '../components';
import axios from 'axios';
import { saveToLocal, MOODLE_URL, NODE_API_URL } from '../Services/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
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
			.post(NODE_API_URL + '/login', state, axiosConfig)
			.then((res) => {
				console.log('RESPONSE RECEIVED: ', res);
				if (res.data.success) {
					saveToLocal('user', res.data.user);
					saveToLocal('token', res.data.token);

					if (res.data.user.roleid !== 2)
						window.open(
							`${MOODLE_URL}/login/custom_auto_login.php?user_id=${res.data.user.moodle_user_id}`,
							'_top'
						);
					else navigate('/');
				} else {
					// alert(res.data.error);
					toast.success(`${res.data.error}`, {
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
				<h1 className="text-center">Login</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<form onSubmit={submitForm}>
							<div className="my-3">
								<label for="display-4">Email address</label>
								<input
									type="email"
									className="form-control"
									id="floatingInput"
									name="email"
									placeholder="name@example.com"
									onChange={handleChange}
								/>
							</div>
							<div className="my-3">
								<label for="floatingPassword display-4">Password</label>
								<input
									type="password"
									className="form-control"
									id="floatingPassword"
									placeholder="Password"
									name="password"
									onChange={handleChange}
								/>
							</div>
							<div className="my-1 d-flex justify-content-between ">
								<p>
									New Here?
									<Link
										to="/register"
										className="text-decoration-underline text-info"
									>
										Register
									</Link>
								</p>
								<p>
									<Link
										to="/resetpassword"
										className="text-decoration-underline text-info"
									>
										Forgot password
									</Link>
								</p>
							</div>
							<div className="text-center">
								<button
									class="my-2 mx-auto btn btn-dark"
									type="submit"
									onClick={submitForm}
								>
									Login
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

export default Login;
