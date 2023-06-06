import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { getFromLocal } from '../Services/storage';
import { NODE_API_URL } from '../Services/storage';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
function PaymentsReports() {
	const [reports, setReports] = useState();
	const [isOpen, setIsOpen] = React.useState(false);
	let allState = useSelector((state) => state);
	let [rowData, setRowData] = useState();
	console.log('allState', allState);
	const user = getFromLocal('user');
	const print = useRef();
	console.log('user', user?._id);

	const showModal = () => {
		setIsOpen(true);
	};

	const hideModal = () => {
		setIsOpen(false);
	};
	const handlePrint = useReactToPrint({ content: () => print.current });
	useEffect(() => {
		async function getData() {
			let dt = await axios
				.post(NODE_API_URL + '/reports', { user_id: user?._id })
				.then((res) => res);
			// let dt2= dt?.data?.map((curr)=>{

			// })
			setReports(() => dt?.data.filter((curr) => curr.user_id == user?._id));
			console.log(dt);
		}
		getData();
	}, []);
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var date = new Date(1678968551 * 1000);
	console.log('ddddddddd', date.toUTCString());
	today = mm + '/' + dd + '/' + yyyy;
	console.log('reports', reports);

	function handleModalPrint(row) {
		showModal();
		console.log('rowData', row);
		setRowData(row);
	}
	return (
		<div className="mt-5">
			{reports?.reports?.length !== 0 &&
			allState?.Course_Reducer?.courses.length > 0 ? (
				<div className="card">
					<div className="card-body">
						<div className="container mb-5 mt-3">
							<div className="row d-flex align-items-baseline">
								<div className="col-xl-9">
									{/* <p style={{ color: '#7e8d9f', fontSize: '20px' }}>
										Invoice <strong>IDdd: {user._id}</strong>
									</p> */}
									{/* <p>
									Invoice <strong>ID: #123-123</strong>
								</p> */}
								</div>
								<div className="col-xl-3 float-left">
									<button
										onClick={() => handlePrint()}
										className="btn btn-light text-capitalize border-0"
										data-mdb-ripple-color="dark"
									>
										<i className="fa fa-print text-danger"></i> Print
									</button>
									{/* <a
									className="btn btn-light text-capitalize"
									data-mdb-ripple-color="dark"
								>
									<i className="fa fa-print text-danger"></i> Export
								</a> */}
								</div>
								<hr />
							</div>

							<div className="container" ref={print}>
								<div className="col-md-12">
									<div className="text-center">
										{/* <i
										className="fab fa-mdb fa-4x ms-0"
										style={{ color: '#5d9fc5' }}
									></i> */}
										<img src={'./pict2.png'} style={{ width: '80px' }} />
										<p className="pt-0">Palinfocom Technologies pvt ltd</p>
									</div>
								</div>

								<div className="row">
									<div className="col-xl-8">
										<ul className="list-unstyled">
											<li className="text-muted">
												To:{' '}
												<span style={{ color: '#5d9fc5' }}>{`${
													user.firstname + ' ' + user.lastname
												}`}</span>
											</li>
											<li className="text-muted">Street, City</li>
											<li className="text-muted">State, Country</li>
											<li className="text-muted">
												<i className="fas fa-phone"></i> 123-456-789
											</li>
										</ul>
									</div>
									<div className="col-xl-4">
										<p className="text-muted">Invoice</p>
										<ul className="list-unstyled">
											{/* <li className="text-muted">
												<i
													className="fas fa-circle"
													style={{ color: '#84B0CA' }}
												></i>{' '}
												<span className="fw-bold">ID:</span>
												{' ' + user._id}
											</li> */}
											<li className="text-muted">
												<i
													className="fas fa-circle"
													style={{ color: '#84B0CA' }}
												></i>{' '}
												<span className="fw-bold">Creation Date: </span>
												{today}
											</li>
											<li className="text-muted">
												<i
													className="fas fa-circle"
													style={{ color: '#84B0CA' }}
												></i>{' '}
												<span className="me-1 fw-bold">Status:</span>
												<span className="badge bg-danger text-white fw-bold">
													Paid
												</span>
											</li>
										</ul>
									</div>
								</div>

								<div className="row my-2 mx-1 justify-content-center">
									<table className="table table-striped table-borderless">
										<thead
											style={{ backgroundColor: '#84B0CA ' }}
											className="text-white"
										>
											<tr>
												<th scope="col">#</th>
												<th scope="col">order_id</th>
												<th scope="col">Course's</th>
												<th scope="col">Qty</th>
												{/* <th scope="col">Unit Price</th> */}
												<th scope="col">Amount</th>
												<th scope="col">Time</th>
												<th scope="col">Print</th>
											</tr>
										</thead>
										<tbody>
											{reports?.map((curr, i, arr) => {
												return (
													<tr>
														<th scope="row">{i + 1}</th>
														<td>{curr?.order_id}</td>
														<td>
															{curr?.course?.map((c, i, arr) => {
																return (
																	<div>
																		<p>
																			{i + 1}. &nbsp;{c.title}
																		</p>
																	</div>
																);
															})}
														</td>
														{/* <td>{curr?.course_id?.length}</td> */}
														<td>1</td>
														<td>{curr.amount}</td>
														<td>{curr.date}</td>
														<td>
															<div className="col-xl-3 float-left">
																<button
																	onClick={() => handleModalPrint(curr)}
																	className="btn btn-light text-capitalize border-0"
																	data-mdb-ripple-color="dark"
																>
																	<i className="fa fa-print text-danger"></i>{' '}
																</button>
															</div>
														</td>
													</tr>
												);
											})}
											{/* <tr>
											<th scope="row">2</th>
											<td>Web hosting</td>
											<td>1</td>
											<td>$10</td>
											<td>$10</td>
										</tr> */}
											{/* <tr>
											<th scope="row">3</th>
											<td>Consulting</td>
											<td>1 year</td>
											<td>$300</td>
											<td>$300</td>
										</tr> */}
										</tbody>
									</table>
								</div>
								{/* <div className="row">
								<div className="col-xl-8">
									<p className="ms-3">
										Add additional notes and payment information
									</p>
								</div>
								<div className="col-xl-3">
									<ul className="list-unstyled">
										<li className="text-muted ms-3">
											<span className="text-black me-4">SubTotal</span>$1110
										</li>
										<li className="text-muted ms-3 mt-2">
											<span className="text-black me-4">Tax(15%)</span>$111
										</li>
									</ul>
									<p className="text-black float-start">
										<span className="text-black me-3"> Total Amount</span>
										<span style={{ fontSize: '25px' }}>$1221</span>
									</p>
								</div>
							</div> */}
								<hr />
								<div className="row">
									<div className="col-xl-10">
										<p>Thank you for your purchase</p>
									</div>
									{/* <div className="col-xl-2">
									<button
										type="button"
										className="btn btn-primary text-capitalize"
										style={{ backgroundColor: '#60bdf3' }}
									>
										Paid
									</button>
								</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p className="text-danger text-center ">
					<i
						class="fa fa-exclamation-triangle fa-xl p-2"
						aria-hidden="true"
					></i>
					No purchase history !
				</p>
			)}

			<Modal show={isOpen} onHide={hideModal} size="lg">
				{/* <Modal.Header>
					<Modal.Title>Hi</Modal.Title>
				</Modal.Header> */}
				<Modal.Body>
					<div className="card">
						<div className="card-body">
							<div className="container mb-5 mt-3">
								<div className="row d-flex align-items-baseline">
									<div className="col-xl-9">Order History</div>
									<div className="col-xl-3 float-left">
										<button
											onClick={() => handlePrint()}
											className="btn btn-light text-capitalize border-0"
											data-mdb-ripple-color="dark"
										>
											<i className="fa fa-print text-danger"></i> Print
										</button>
									</div>
									<hr />
								</div>

								<div className="container" ref={print}>
									<div className="col-md-12">
										<div className="text-center">
											<img src={'./pict2.png'} style={{ width: '80px' }} />
											<p className="pt-0">Palinfocom Technologies pvt ltd</p>
										</div>
									</div>

									<div className="row">
										<div className="col-xl-8">
											<ul className="list-unstyled">
												<li className="text-muted">
													To:{' '}
													<span style={{ color: '#5d9fc5' }}>{`${
														user.firstname + ' ' + user.lastname
													}`}</span>
												</li>
												<li className="text-muted">Street, City</li>
												<li className="text-muted">State, Country</li>
												<li className="text-muted">
													<i className="fas fa-phone"></i> 123-456-789
												</li>
											</ul>
										</div>
										<div className="col-xl-4">
											<p className="text-muted">Invoice</p>
											<ul className="list-unstyled">
												<li className="text-muted">
													<i
														className="fas fa-circle"
														style={{ color: '#84B0CA' }}
													></i>{' '}
													<span className="fw-bold">Creation Date: </span>
													{today}
												</li>
												<li className="text-muted">
													<i
														className="fas fa-circle"
														style={{ color: '#84B0CA' }}
													></i>{' '}
													<span className="me-1 fw-bold">Status:</span>
													<span className="badge bg-danger text-white fw-bold">
														Paid
													</span>
												</li>
											</ul>
										</div>
									</div>

									<div className="row my-2 mx-1 justify-content-center">
										<table className="table table-striped table-borderless">
											<thead
												style={{ backgroundColor: '#84B0CA ' }}
												className="text-black"
											>
												<tr>
													<th scope="col">#</th>
													<th scope="col">order_id</th>
													<th scope="col">Course's</th>
													<th scope="col">Qty</th>
													{/* <th scope="col">Unit Price</th> */}
													<th scope="col">Amount</th>
													<th scope="col">Time</th>
													{/* <th scope="col">Print</th> */}
												</tr>
											</thead>
											<tbody>
												<tr>
													<th scope="row">1.</th>
													<td>{rowData?.order_id}</td>
													<td>{rowData?.course[0]?.title}</td>
													{/* <td>{curr?.course_id?.length}</td> */}
													<td>{rowData?.course?.length}</td>
													<td>${rowData?.course[0]?.price}</td>
													<td>{rowData?.date}</td>
													<td>
														{/* <div className="col-xl-3 float-left">
															<button
																onClick={() => showModal()}
																className="btn btn-light text-capitalize border-0"
																data-mdb-ripple-color="dark"
															>
																<i className="fa fa-print text-danger"></i>{' '}
															</button>
														</div> */}
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<hr />
									<div className="row">
										<div className="col-xl-10">
											<p>Thank you for your purchase</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
				{/* <Modal.Footer>
					<button onClick={() => hideModal()}>Cancel</button>
					<button>Save</button>
				</Modal.Footer> */}
			</Modal>
		</div>
	);
}

export default PaymentsReports;
