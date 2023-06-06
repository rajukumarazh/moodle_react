import React from 'react';

const Footer = () => {
	return (
		<div className="">
			<footer
				className="text-center text-lg-start text-black "
				// style="background-color: #45526e"
				style={{ backgroundColor: '#eeeeee', marginTop: '40px' }}
			>
				<div className="container p-4 pb-0">
					<section className="">
						<div className="row">
							<div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
								<h6 className="text-uppercase mb-4 font-weight-bold">
									Palinfocom Pvt Ltd
								</h6>
								<p>
									The eLearning has acquired a new dimension with the ever
									growing Internet availability and Smartphones in the world.
									This has also led to increased expectation of the users from
									the eLearning service organizations.
								</p>
							</div>

							<hr className="w-100 clearfix d-md-none" />

							<div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
								<h6 className="text-uppercase mb-4 font-weight-bold">
									Products
								</h6>
								<p>
									<a className="text-black">PHP</a>
								</p>
								<p>
									<a className="text-black">WordPress</a>
								</p>
								<p>
									<a className="text-black">React</a>
								</p>
								<p>
									<a className="text-black"> Moodle</a>
								</p>
								<p>
									<a className="text-black"> MERN</a>
								</p>
							</div>

							<hr className="w-100 clearfix d-md-none" />

							<div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
								<h6 className="text-uppercase mb-4 font-weight-bold">
									Useful links
								</h6>
								<p>
									<a className="text-black">Your Account</a>
								</p>
								<p>
									<a className="text-black">Become an Affiliate</a>
								</p>
								<p>
									<a className="text-black">Products</a>
								</p>
								<p>
									<a className="text-black">Help</a>
								</p>
							</div>

							<hr className="w-100 clearfix d-md-none" />

							<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
								<h6 className="text-uppercase mb-4 font-weight-bold">
									Contact
								</h6>
								<p>
									<i className="fas fa-home mr-3"></i> 8b Mohali Punjab India
								</p>
								<p>
									<i className="fas fa-envelope mr-3"></i> info@gmail.com
								</p>
								<p>
									<i className="fas fa-phone mr-3"></i> +9199999999
								</p>
								<p>
									<i className="fas fa-print mr-3"></i> + 01 234 567 89
								</p>
							</div>
						</div>
					</section>

					<hr className="my-3" />

					<section className="p-3 pt-0">
						<div className="row d-flex align-items-center">
							<div className="col-md-7 col-lg-8 text-center text-md-start">
								<div className="p-3">
									© 2023 Copyright:
									<a className="text-black" href="#">
										PAL Infocom Technologies Pvt Ltd
									</a>
								</div>
							</div>

							<div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
								<a
									className="btn btn-outline-light btn-floating m-1 text-black"
									//  className="text-black"
									role="button"
								>
									<i className="fab fa-facebook-f"></i>
								</a>

								<a
									className="btn btn-outline-light btn-floating m-1 text-black"
									//  className="text-black"
									role="button"
								>
									<i className="fab fa-twitter"></i>
								</a>

								<a
									className="btn btn-outline-light btn-floating m-1 text-black"
									//  className="text-black"
									role="button"
								>
									<i className="fab fa-google"></i>
								</a>

								<a
									className="btn btn-outline-light btn-floating m-1 text-black"
									//  className="text-black"
									role="button"
								>
									<i className="fab fa-instagram"></i>
								</a>
							</div>
						</div>
					</section>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
