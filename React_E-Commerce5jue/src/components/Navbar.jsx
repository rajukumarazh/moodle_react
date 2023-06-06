import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getFromLocal, removeFromLocal } from '../Services/storage';

const Navbar = () => {
	const state = useSelector((state) => state.handleCart);
	const auth = getFromLocal('user');
	const navigate = useNavigate();

	const LogOut = () => {
		removeFromLocal('user');
		removeFromLocal('token');
		navigate('/');
	};
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
			<div className="container">
				<NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
					{' '}
					React Ecommerce
				</NavLink>
				<button
					className="navbar-toggler mx-2"
					type="button"
					data-toggle="collapse"
					data-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav m-auto my-2 text-center">
						<li className="nav-item">
							<NavLink className="nav-link" to="/">
								Home{' '}
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/product">
								Courses
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/about">
								About
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/contact">
								Contact
							</NavLink>
						</li>
						<li className="nav-item">
							{auth && (
								<NavLink className="nav-link underline" to="/reports">
									Reports
								</NavLink>
							)}
						</li>
					</ul>
					<div className="buttons text-center">
						{auth ? (
							<>
								<span
									onClick={() => LogOut()}
									className="btn btn-outline-dark m-2"
								>
									<i className="fa fa-sign-in-alt mr-1"></i> Logout
								</span>
							</>
						) : (
							<>
								<NavLink to="/login" className="btn btn-outline-dark m-2">
									<i className="fa fa-sign-in-alt mr-1"></i> Login
								</NavLink>
								<NavLink to="/register" className="btn btn-outline-dark m-2">
									<i className="fa fa-user-plus mr-1"></i> Register
								</NavLink>
							</>
						)}

						{auth && auth.roleid === 2 && (
							<NavLink
								to="/create-courses"
								className="btn btn-outline-dark m-2"
							>
								<i className="fa fa-user-plus mr-1"></i> Create Courses
							</NavLink>
						)}

						<NavLink to="/cart" className="btn btn-outline-dark m-2">
							<i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}){' '}
						</NavLink>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
