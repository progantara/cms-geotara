import React,{useState, useContext, useEffect} from 'react';
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

///Images
import pic5 from './../../images/card/Untitled-16.jpg';
import pic6 from './../../images/card/Untitled-15.jpg';


//Import
import { ThemeContext } from "../../context/ThemeContext";
import VisitorChart from '../components/Dashboard/Dashboard/VisitorChart';
import TopArticle from '../components/Dashboard/Dashboard/TopArticle';
import TrendingWisata from '../components/Dashboard/Dashboard/TrendingWisata';
import DistributionMap from '../components/Dashboard/Dashboard/DistributionMap';
import TopWisata from '../components/Dashboard/Dashboard/TopWisata';


const Home = () => {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);
	const [value, onChange] = useState(new Date());
	return(
		<>
			<div className="row">
				<div className="col-xl-3 col-sm-6">
					<div className="card gradient-1 card-bx">
						<div className="card-body d-flex align-items-center">
							<div className="me-auto text-white">
								<h2 className="text-white">9</h2>
								<span className="fs-18">Total Wisata</span>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="white" viewBox="0 0 576 512"><path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="card gradient-2 card-bx">
						<div className="card-body d-flex align-items-center">
							<div className="me-auto text-white">
								<h2 className="text-white">87</h2>
								<span className="fs-18">Total Acara</span>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="white" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>

						</div>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="card gradient-3 card-bx">
						<div className="card-body d-flex align-items-center">
							<div className="me-auto text-white">
								<h2 className="text-white">53</h2>
								<span className="fs-18">Total Artikel</span>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="white" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="card gradient-4 card-bx">
						<div className="card-body d-flex align-items-center">
							<div className="me-auto text-white">
								<h2 className="text-white">32</h2>
								<span className="fs-18">Total Kemitraan</span>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="white" viewBox="0 0 640 512"><path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L550.2 352H592c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48H516h-4-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48H48c-26.5 0-48 21.5-48 48V304c0 26.5 21.5 48 48 48H156.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123z"/></svg>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-4 col-xxl-5">
					<div className="row">
						<DistributionMap />
						<TopWisata />
					</div>
				</div>
				<div className="col-xl-8 col-xxl-7">
					<div className="card">
						<div className="card-header border-0 d-sm-flex d-block">
							<div className="me-auto mb-sm-0 mb-3">
								<h4 className="card-title mb-2">Statistik Kunjungan</h4>
								<span>Lorem ipsum dolor sit amet</span>
							</div>
							<div className="d-flex justify-content-between">
								<div className="d-flex me-5">
									<h3 className="mb-0 me-2">102</h3>
									<span>Hari ini</span>
								</div>
								<div className="d-flex me-3">
									<h3 className="mb-0 me-2">4030</h3>
									<span>Minggu ini</span>
								</div>
							</div>
						</div>
						<div className="card-body">
							<div id="reservationChart" className="reservationChart">
								<VisitorChart />
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="card">
						<div className="card-body booking-calender">
							{/* <input type='text' className="form-control d-none" id='datetimepicker' /> */}
							<Calendar onChange={onChange} value={value}  />
						</div>
						<div className="card-body py-0">
							<div className="d-flex justify-content-between mb-3">
								<h4 className="card-title">Acara Terdekat</h4>
								<Link to={"#"} className="btn-link">More</Link>
							</div>
							<div className="row">								
								<div className="col-xl-6 col-sm-6">
									<div className="dz-image-bx rounded">
										<div className="dz-media active me-3">
											<img className="rounded" src={pic5} alt="" />
										</div>
										<div className="dz-info">
											<h5>Konser Amal Telkomsel</h5>
											<span className="text-primary">8 Februari 2023</span>
											<div className="d-flex flex-wrap mt-3">
												<span className="me-auto pe-3">Gratis</span>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-6 col-sm-6">
									<div className="dz-image-bx rounded">
										<div className="dz-media me-3">
											<img className="rounded" src={pic6} alt="" />
										</div>
										<div className="dz-info">
											<h5>Nobar Bola</h5>
											<span className="text-primary">15 Februari 2023</span>
											<div className="d-flex flex-wrap mt-3">
												<span className="me-auto pe-3">Rp25.000/orang</span>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-6 col-sm-6">
									<div className="dz-image-bx rounded">
										<div className="dz-media me-3">
											<img className="rounded" src={pic5} alt="" /> 
										</div>
										<div className="dz-info">
											<h5>Konser Islami</h5>
											<span className="text-primary">20 Februari 2023</span>
											<div className="d-flex flex-wrap mt-3">
												<span className="me-auto pe-3">Rp50.000/orang</span>
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">
							<TrendingWisata />
						</div>
						<div className="col-xl-12">
							<TopArticle />
						</div>
					</div>
				</div>
				
				
			</div>	
		</>
	)
}
export default Home;