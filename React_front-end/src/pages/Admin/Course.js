import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { NODE_API_URL } from '../../Services/storage';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// const token = getFromLocal('token');
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Course() {
	const locate = useLocation();
	console.log('locate', locate);
	const [state, setState] = useState({});
	const [selectedCourse, setSelectedCourse] = useState();
	const [currentCategory, setCurrentCategory] = useState();
	const [categoryCourse, setCategoryCourse] = useState();
	const allState = useSelector((state) => state);
	const [recentCourse, setRecentCourse] = useState();
	const [enble, dsbl] = useState(true);
	let currentRouteCoures = allState?.Course_Reducer?.courses?.filter(
		(curr) => curr?.moodle_course_id == locate?.state?.moodle_course_id
	);
	console.log('currentC', currentRouteCoures);
	const [updateData, setUpadateData] = useState({});
	// let categoryCourse = allState?.Course_Reducer?.courses.filter(
	// 	(curr, i, arr) => {
	// 		if (curr.category == state?.category) {
	// 			return curr;
	// 		}
	// 	}
	// );
	let allMongoDCourse =
		allState &&
		allState?.Course_Reducer?.courses?.map((curr) => {
			return curr.moodle_course_id;
		});
	console.log('allMongoDCourse', allMongoDCourse);
	async function categoryCoursess() {
		let dt = await axios
			.post(NODE_API_URL + '/category_course', {
				value: state?.category,
			})
			.then((res) => {
				return res;
			});
		let dt2 = dt?.data?.courses?.filter(
			(curr) => curr.categoryid == state.category
		);

		setCategoryCourse(() => dt2);
	}

	console.log('moodleCourseId', typeof +state.moodle_course_id);
	function getRecentsCourse() {
		// let headers = {
		// 	Authorization: `Bearer ${token}`,
		// 	'Content-Type': 'application/json',
		// };
		axios
			.get(NODE_API_URL + '/fetch-courses')
			.then((response) => {
				console.log('res123', response);
				setRecentCourse(() => response?.data?.result);

				// setFilter(() => response.data.result);
				// return response;
			})
			.catch((err) => err);
	}
	useEffect(() => {
		if (locate?.state) {
			setUpadateData((prevState) => ({
				...prevState,
				category: locate.state?.category,
				moodle_course_id: locate?.state?.moodle_course_id,
			}));
		}
		categoryCoursess();
		getRecentsCourse();
	}, [state.category]);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		// var selectedOption = e.target.selectedOptions[0];
		// console.log('kkkkk222', selectedOption.text);
		setState((prevState) => ({
			...prevState,
			[name]: value,
			// title: selectedCourse ? selectedCourse?.title : value,
		}));
		setUpadateData((prevState) => ({
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
		if (
			state?.hasOwnProperty('title') === true &&
			state?.hasOwnProperty('moodle_course_id') === true &&
			state?.hasOwnProperty('price') === true
		) {
			axios
				.post(
					NODE_API_URL +
						`${locate?.state == null ? '/create-course' : '/update-course'}`,

					locate?.state === null ? state : updateData
				)
				.then((res) => {
					console.log('RESPONSE RECEIVED: ', res);
					if (res.data) {
						toast.success(
							`${
								locate?.state !== null
									? 'course updated Successfully!'
									: 'course  created Successfully!'
							}`,
							{
								position: toast.POSITION.TOP_RIGHT,
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: false,
								draggable: true,
							}
						);
					} else {
						console.log('nooooooo');
					}
				})
				.catch((err) => {
					console.log('AXIOS ERROR: ', err);
				});
		} else if (
			state?.hasOwnProperty('price') === true &&
			locate?.state !== null
		) {
			axios
				.post(
					NODE_API_URL +
						`${locate?.state == null ? '/create-course' : '/update-course'}`,

					locate?.state === null ? state : updateData
				)
				.then((res) => {
					console.log('RESPONSE RECEIVED: ', res);
					if (res.data) {
						toast.success(
							`${
								locate?.state !== null
									? 'course updated Successfully!'
									: 'course  created Successfully!'
							}`,
							{
								position: toast.POSITION.TOP_RIGHT,
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: false,
								draggable: true,
							}
						);
					}
				})
				.catch((err) => {
					console.log('AXIOS ERROR: ', err);
				});
		} else {
			// alert('please fill all details');
			toast.error('please fill all details !', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
			});
		}
	};
	console.log('state', state);
	const handleCourse = (e) => {
		const { name, value } = e.target;
		var selectedOption = e.target.selectedOptions[0];
		console.log('kkkkk', selectedOption.text);
		setState((prevState) => ({
			...prevState,
			title: selectedOption?.text,
			moodle_course_id: value,
		}));

		// console.log('AXIOS ERROR: ', name, value);
	};
	console.log('filteredRecentsCourse', recentCourse);
	let newRecents =
		recentCourse &&
		recentCourse.filter(
			(curr) => curr.moodle_course_id == +state?.moodle_course_id
		);
	console.log('newRecents', newRecents);

	async function getUpadate() {
		let updatedData = await axios
			.post(NODE_API_URL + '/update_coures', {
				state,
			})
			.then((res) => {
				return res;
			});
		console.log('updateResponse', updatedData);
	}
	console.log('categoryCourse', categoryCourse);
	// let dt =
	// 	allMongoDCourse &&
	// 	allMongoDCourse?.includes(curr?.moodle_course_id) === true
	// 		? true
	// 		: false;

	// console.log('dt', dt);
	return (
		<>
			<div className="container my-3 py-3">
				{locate?.state == null ? (
					<h1 className="text-center">Create Course</h1>
				) : (
					<h1 className="text-center">Upadate Course</h1>
				)}
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<form onSubmit={submitForm}>
							{locate?.state !== null ? (
								<p className="">
									Current course:&nbsp;
									{currentRouteCoures[0]?.title}
								</p>
							) : (
								<div>
									<div className="form  my-3">
										<select onChange={handleChange} name="category">
											<option>Please choose category</option>

											{allState?.Course_Reducer?.category?.map(
												(curr, i, arr) => {
													return (
														<option value={curr.id} key={curr.id}>
															{curr.name}
														</option>
													);
												}
											)}
										</select>
									</div>
									<div className="form  my-3">
										<select name="title" onChange={handleCourse}>
											{console.log('categoryCourse', categoryCourse)}
											<option>Courses</option>

											{categoryCourse &&
												categoryCourse?.map((curr, i, arr) => {
													return (
														<option
															value={curr.id}
															key={i}
															name={curr.fullname}
															disabled={
																allMongoDCourse?.includes(curr?.id) === true
																	? true
																	: false
															}
														>
															{curr.fullname}
														</option>
													);
												})}
										</select>
									</div>
								</div>
							)}
							{/* {locate?.state !== null && (
								<div className="form my-3">
									<label htmlFor="title">Course Name</label>
									<input
										type="text"
										className="form-control"
										id="title"
										name="title"
										placeholder="Enter Your Course Name"
										onChange={handleChange}
									/>
								</div>
							)} */}
							{/* {locate?.state !== null && (
								<div className="form my-3">
									<label htmlFor="description">Course Description</label>
									<textarea
										className="h-100 w-100"
										name="description"
										onChange={handleChange}
										placeholder="Enter course description"
									/>
								</div>
							)} */}
							{/* <div className="form my-3">
								<label htmlFor="image_url">Course Image Url</label>
								<input
									type="text"
									className="form-control"
									id="image_url"
									name="image_url"
									placeholder="Paste Moodle Image Link Here"
									onChange={handleChange}
								/>
							</div> */}
							{/* {locate?.state !== null && ( */}
							<div className="form my-3">
								<label htmlFor="price">Price</label>
								<input
									type="text"
									className="form-control"
									id="price"
									placeholder="Enter course price"
									name="price"
									onChange={handleChange}
								/>
							</div>
							{/* )} */}
							{/* <div className="form  my-3">
								<select onChange={handleChange} name="category">
									<option>Please choose one option</option>
									<option value={'javascript'}>Javascript</option>
									<option value={'agriculture'}>Agriculture</option>
									<option value={'education'}>Education</option>
								</select>
							</div> */}

							<div className="text-center">
								{locate?.state == null ? (
									<button
										className="my-2 mx-auto btn btn-dark"
										type="submit"
										onClick={submitForm}
									>
										Create
									</button>
								) : (
									<button
										className="my-2 mx-auto btn btn-dark "
										type="submit"
										onClick={submitForm}
									>
										updated Course
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
			<ToastContainer />
		</>
	);
}
