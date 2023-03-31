import React,{ useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import {Dropdown, Tab, Nav} from 'react-bootstrap';

//import pic11 from './../../../images/hotel/pic11.jpg';
import GuestCarousel from '../Room/GuestCarousel';

const DropdownBlog = () =>{
	return(
		<>
			<Dropdown className="dropdown">
				<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown" aria-expanded="false">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</Dropdown.Toggle>
				<Dropdown.Menu className="dropdown-menu">
					<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
					<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}

const TrendingWisata = () =>{
	const [data, setData] = useState(
		document.querySelectorAll("#room_wrapper tbody tr")
	);
	const sort = 10;
	const activePag = useRef(0);
	const [test, settest] = useState(0);

	// Active data
	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};
   // use effect
   useEffect(() => {
      setData(document.querySelectorAll("#room_wrapper tbody tr"));
      //chackboxFun();
	}, [test]);
	return(
		<>
      <div className="card">
				<div className="card-header border-0">
					<h4 className="card-title">Trending Wisata</h4>
					<Dropdown className="dropdown">
						<Dropdown.Toggle as="div" className="btn-link i-false" >
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
								<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
								<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
							</svg>
						</Dropdown.Toggle>
						<Dropdown.Menu className="dropdown-menu">
							<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
							<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
        <Tab.Container defaultActiveKey="All">
          <div className="row">
            <div className="col-xl-12">
              <div className="d-flex mb-4 justify-content-between align-items-center flex-wrap">
                <div className="card-tabs mt-3 mt-sm-0 mb-xxl-0 mb-4">
                  <Nav as="ul" className="nav nav-tabs" role="tablist">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link className="nav-link" eventKey="All">Populer</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link className="nav-link" eventKey="Available">Banyak Dilihat</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <Tab.Content>	
                <Tab.Pane eventKey="All">
                  <div className="table-responsive">
                    <div id="room_wrapper" className="dataTables_wrapper no-footer">
                      <table className="table card-table display mb-4 dataTablesCard booking-table room-list-tbl dataTable no-footer">
                        <tbody>
                          <tr role="row" className="odd">
                            <td>
                              <div className="guest-bx">
                                <div id="carouselExampleControls" className="carousel slide me-3" >
                                  <div className="carousel-inner">
                                    <GuestCarousel />
                                  </div>	
                                </div>	
                                <div>
                                  <span className="text-primary"><i className="fa fa-map-marker"></i> Arcamanik, Ciletuh</span>
                                  <h4 className="mb-0 mt-1"><Link  className="text-black" to={"./guest-detail"}>Curug Sodong</Link></h4>
                                </div>
                              </div>
                            </td>
                            <td><DropdownBlog /></td>
                          </tr>
                          <tr className="even">
                            <td>
                              <div className="guest-bx">
                                <div id="carouselExampleControls" className="carousel slide me-3" >
                                  <div className="carousel-inner">
                                    <GuestCarousel />
                                  </div>	
                                </div>	
                                <div>
                                  <span className="text-primary"><i className="fa fa-map-marker"></i> Antapani, Ciletuh</span>
                                  <h4 className="mb-0 mt-1"><Link className="text-black" to={"./guest-detail"}>Pantai Citepus</Link></h4>
                                </div>
                              </div>	
                            </td>
                            <td><DropdownBlog /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Available">
                  <div className="table-responsive">
                    <div id="" className="dataTables_wrapper no-footer">
                      <table className="table card-table display mb-4 dataTablesCard booking-table room-list-tbl dataTable no-footer">
                        <tbody>										
                          <tr className="odd">
                            <td>
                              <div className="guest-bx">
                                <div id="carouselExampleControls" className="carousel slide me-3">
                                  <div className="carousel-inner">
                                    <GuestCarousel />
                                  </div>	
                                </div>	
                                <div>
                                  <span className="text-primary"><i className="fa fa-map-marker"></i> Ciwaruga, Ciletuh</span>
                                  <h4 className="mb-0 mt-1"><Link className="text-black" to={"./guest-detail"}>Curug Sodong</Link></h4>
                                </div>
                              </div>	
                            </td>
                            <td><DropdownBlog /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>	
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>			
      </div>		
		</>
	)
}
export default TrendingWisata;