import React from 'react';
import { useSelector } from 'react-redux';

function NotAvailable(props) {
	let allState = useSelector((state) => state);
	console.log('AllStateNotAvailable', allState);

	return (
		<div className="d-flex justify-content-center">
			<div className="row">
				<div className="col-md-12">
					<div className="error-template">
						{/* <h1>Oops!</h1> */}
						{/* <h2>No course available on selected categories</h2> */}
						{props?.data?.data?.length > 0 ? (
							<div>
								<h3>
									<i
										class="fa fa-exclamation-triangle fa-xl p-2"
										aria-hidden="true"
									></i>
									No course available with selected category
								</h3>
								{/* <h2>Something Wrong with moodle courses</h2> */}
							</div>
						) : (
							<div>
								<p className="text-danger ">
									<i
										class="fa fa-exclamation-triangle fa-xl p-2"
										aria-hidden="true"
									></i>
									Something went wrong with moodle courses
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default NotAvailable;
