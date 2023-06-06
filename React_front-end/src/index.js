import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateComponent from './components/PrivateComponent';
import RoleBasedComponent from './components/RoleBasedComponent';
import Course from './pages/Admin/Course';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckOut } from './pages/StripeCheckOut';
import {
	Home,
	Product,
	Products,
	AboutPage,
	ContactPage,
	Cart,
	Login,
	Register,
	Checkout,
	PageNotFound,
} from './pages';

import { Footer, Navbar } from './components';
import PaymentsReports from './pages/PaymentsReports';
import { loadStripe } from '@stripe/stripe-js';
import ResetPassword from './pages/ResetPassword';
const root = ReactDOM.createRoot(document.getElementById('root'));
const stripePromise = loadStripe(
	'pk_test_51LJuX6SHMCr56R0SHodUFGJ5IOaLnZo7YygZHqYADZwIzVv1LYsRHQedPB8DhfzXm9shaFUTb2H0sACO5ejMQmp300OPkOGIw1'
);
root.render(
	<BrowserRouter>
		<Elements stripe={stripePromise}>
			<Provider store={store}>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route element={<PrivateComponent />}>
						<Route path="/product" element={<Products />} />
						<Route path="/product/:id" element={<Product />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/contact" element={<ContactPage />} />
						<Route path="/cart" element={<Cart />} />

						<Route path="/checkout" element={<Checkout />} />
						<Route path="*" element={<PageNotFound />} />
						<Route path="/product/*" element={<PageNotFound />} />
					</Route>

					<Route element={<RoleBasedComponent />}>
						<Route path="/create-courses" element={<Course />} />
					</Route>

					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					{<Route path="/reports" element={<PaymentsReports />} />}
					<Route path="/gostripe" element={<StripeCheckOut />} />
					<Route path="/resetpassword" element={<ResetPassword />} />
				</Routes>
				<Footer />
			</Provider>
		</Elements>
	</BrowserRouter>
);
