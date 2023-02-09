import React, { useState } from "react";
import { Link } from "react-router-dom";

///Images
import profile05 from "../../../../images/profile/5.jpg";
import profile06 from "../../../../images/profile/6.jpg";
import profile07 from "../../../../images/profile/7.jpg";

const TopArticle = () => {
	return (
		<>
			<div className="card">
				<div className="card-header border-0">
					<h4 className="card-title">Artikel Paling Banyak Dilihat</h4>
				</div>
				<div className="card-body pt-3">
					<div className="profile-news">
						<div className="media pt-3 pb-3">
							<img src={profile05} alt="" className="me-3 rounded" width={75} />
							<div className="media-body">
								<h5 className="m-b-5">
									<Link to="/post-details" className="text-black">
                    Menyusuri di Curug Plateu Gawir Jampang
									</Link>
								</h5>
								<p className="mb-0">
									I shared this on my fb wall a few months back, and I thought.{" "}
								</p>
							</div>
						</div>
						<div className="media pt-3 pb-3">
							<img src={profile06} alt="" className="me-3 rounded" width={75} />
							<div className="media-body">
								<h5 className="m-b-5">
									<Link to="/post-details" className="text-black">
                    Mengungkap Fenomena Subduksi Purba
									</Link>
								</h5>
								<p className="mb-0">
									I shared this on my fb wall a few months back, and I thought.
								</p>
							</div>
						</div>
						<div className="media pt-3 ">
							<img src={profile07} alt="" className="me-3 rounded" width={75} />
							<div className="media-body">
								<h5 className="m-b-5">
									<Link to="/post-details" className="text-black">
                    Menyelusuri Jejak Fosil Tektonik Ciletuh
									</Link>
								</h5>
								<p className="mb-0">
									I shared this on my fb wall a few months back, and I thought.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default TopArticle;
