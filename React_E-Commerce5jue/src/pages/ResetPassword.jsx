import React, { useEffect } from 'react';
import axios from 'axios';
import { NODE_API_URL } from '../Services/storage';
import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ResetPassword() {
	const [currentUser, setCurrentUser] = useState('');
	const [userData, setUserData] = useState({
		email: '',
		password: '',
		conf_password: '',
	});
	let location = useLocation();
	let dt = location.search.replace(/\?/g, '');
	console.log('localhost', dt);
	async function verfiyRequest() {
		if (dt.length > 0) {
			let verify = await axios
				.post(NODE_API_URL + '/matchrequest', { token: dt, user: userData })
				.then((res) => res);
			// console.log('ressss', verify);

			if (verify?.data?.data?.modifiedCount) {
				let removed = await axios
					.post(NODE_API_URL + '/remove_reset_token', { token: dt })
					.then((res) => res);
				console.log('removedToken', removed);
			}
			return verify;
		}
	}
	useEffect(() => {
		let localStor = localStorage.getItem('user');
		let ob = JSON.parse(localStor);
		console.log('op', ob);
		console.log('getuser', ob);
		setCurrentUser(() => ob);
		// verfiyRequest();
	}, []);

	let navigate = useNavigate();
	// console.log('userData', userData);
	// console.log('refvalue', inputRef.current?.email.value);
	async function updatePassword(e) {
		e.preventDefault();
		console.log('userData', userData);
		const passwordPattern =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (
			userData?.password === userData?.conf_password &&
			passwordPattern.test(userData?.conf_password) == true
		) {
			let dt = await axios.post(NODE_API_URL + '/forgot_password', {
				user: userData,
			});

			console.log('dddt', dt?.data);
			if (dt?.data?.data?.modifiedCount > 0) {
				toast.success('password updated successfully !', {
					position: 'top-right',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
				});
				setTimeout(() => {
					navigate('/login');
				}, 1000);
			}
		} else {
			{
				toast.error('try again with correct input fields !', {
					position: 'top-right',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
				});
			}
		}
	}
	/// password reset mail
	async function handlePasswordResetMail(e) {
		e.preventDefault();
		if (!location.search.length) {
			let mail = await axios.post(NODE_API_URL + '/reset-mail', {
				email: 'raju.kumar@palinfocom.com',
				name: currentUser?.firstname + ' ' + currentUser?.lastname,
				Title: 'Password Reset',
				// user_id: currentUser?._id,
				// orderNumber: payload?.paymentIntent?.id,
				// Total: subtotal,
				// Quantity: buyedCourse?.length,
				// email: currentUser?.email,
				message: `
				Hi user,\n
				click the Link for reset your password: ${`http://34.67.169.193/resetpassword`} \n  \n happy learning`,
			});
			console.log('mailSEndt', mail);
			if (mail?.data?.success) {
				toast.success('mail sent succesfully !', {
					position: 'top-right',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
				});
			} else {
				if (mail?.data?.success) {
					toast.error('something went wrong  !', {
						position: 'top-right',
						autoClose: 2000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: true,
					});
				}
			}
		} else {
			let dt = await verfiyRequest();
			console.log('ddtt', dt);
			if (dt?.data?.data?.modifiedCount > 0) {
				toast.success('password reset successfully !', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
				});
				setTimeout(() => navigate('/login'), 2000);
			}
		}
	}

	return (
		<div className="container">
			{/* <div className="card text-center" style={{ width: '600px' }}>
				<div className="card-header h5 text-white bg-primary">
					Password Reset
				</div>
				<div className="card-body px-5">
					<div className="form-outline">
						<input
							onChange={(e) =>
								setUserData({ ...userData, email: e.target.value })
							}
							// ref={(el) => (inputRef.current.email = el)}
							type="email"
							id="typeEmail"
							className="form-control my-3"
							placeholder="your email"
							name="email"
						/>
						<input
							onChange={(e) =>
								setUserData({ ...userData, password: e.target.value })
							}
							type="text"
							id="pass"
							className="form-control my-3"
							placeholder="new password"
							name="pass"
						/>
						<input
							onChange={(e) =>
								setUserData({ ...userData, conf_password: e.target.value })
							}
							type="text"
							id="pass"
							className="form-control my-3"
							placeholder="re-enter password"
							name="conf_pass"
						/>
					</div>
					<button className="btn btn-primary w-100" onClick={updatePassword}>
						Reset password
					</button>
					<div className="d-flex justify-content-between mt-4">
						<Link className="" to="/login">
							Login
						</Link>
						<Link className="" to="/register">
							Register
						</Link>
					</div>
				</div>
			</div> */}

			<div className="row ">
				<div className="row d-flex justify-content-center">
					<div className="col-md-4 col-md-offset-4">
						<div className="panel panel-default">
							<div className="panel-body">
								<div className="text-center">
									<h3>
										<i className="fa fa-lock fa-4x"></i>
									</h3>
									<h2 className="text-center">Reset Password?</h2>
									<p>You can reset your password here.</p>
									<div className="panel-body">
										<form className="form" onSubmit={handlePasswordResetMail}>
											<fieldset>
												<div className="form-group">
													{!location?.search.length && (
														<div className="input-group p-2">
															<span className="input-group-addon">
																<i className="glyphicon glyphicon-envelope color-blue"></i>
															</span>

															<input
																onChange={(e) =>
																	setUserData({
																		...userData,
																		email: e.target.value,
																	})
																}
																id="emailInput"
																placeholder="email address"
																className="form-control"
																type="email"
																//oninvalid="setCustomValidity('Please enter a valid email address!')"
																required=""
															/>
														</div>
													)}
													{location?.search?.length > 0 && (
														<div className="input-group p-2">
															<span className="input-group-addon">
																<i className="glyphicon glyphicon-envelope color-blue"></i>
															</span>

															<input
																onChange={(e) =>
																	setUserData({
																		...userData,
																		password: e.target.value,
																	})
																}
																id="emailInput"
																placeholder="Password"
																className="form-control"
																type="text"
																//oninvalid="setCustomValidity('Please enter a valid email address!')"
																required=""
															/>
														</div>
													)}
													{location?.search?.length > 0 && (
														<div className="input-group p-2">
															<span className="input-group-addon">
																<i className="glyphicon glyphicon-envelope color-blue"></i>
															</span>

															<input
																onChange={(e) =>
																	setUserData({
																		...userData,
																		conf_password: e.target.value,
																	})
																}
																id="emailInput"
																placeholder="Re-enter password"
																className="form-control"
																type="text"
																//oninvalid="setCustomValidity('Please enter a valid email address!')"
																required=""
															/>
														</div>
													)}
												</div>

												<div className="form-group">
													<input
														className="btn btn-lg btn-primary btn-block"
														value="Reset Password"
														type="submit"
													/>
												</div>
											</fieldset>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ToastContainer />
		</div>
	);
}

export default ResetPassword;
