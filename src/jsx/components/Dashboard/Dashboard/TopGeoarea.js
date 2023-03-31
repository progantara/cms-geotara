import React from "react";

export default function TopGeoarea() {
	return (
		<div className="col-xl-12 col-sm-6">
			<div className="card">
				<div className="card-header border-0 pb-0">
					<h4 className="card-title">Wisata Terbanyak Berdasar Desa</h4>
				</div>
				<div className="card-body">
					<div className="progress mb-4" style={{ height: "13px" }}>
						<div
							className="progress-bar gradient-5 progress-animated"
							style={{ width: "60%", height: "13px" }}
						>
							<span className="sr-only">60% Geosite</span>
						</div>
					</div>
					<div className="progress mb-4" style={{ height: "13px" }}>
						<div
							className="progress-bar gradient-6 progress-animated"
							style={{ width: "20%", height: "13px" }}
						>
							<span className="sr-only">20% Geosite</span>
						</div>
					</div>
					<div className="progress default-progress" style={{ height: "13px" }}>
						<div
							className="progress-bar gradient-7 progress-animated"
							style={{ width: "20%", height: "13px" }}
						>
							<span className="sr-only">20% Geosite</span>
						</div>
					</div>
					<div className="d-flex mt-4 progress-bar-legend align-items-center justify-content-between">
						<div className="d-flex">
							<span className="marker gradient-5"></span>
							<div>
								<p className="status">Ciletuh</p>
								<span className="result">60</span>
							</div>
						</div>
						<div className="d-flex">
							<span className="marker gradient-6"></span>
							<div>
								<p className="status">Ciemas</p>
								<span className="result">20</span>
							</div>
						</div>
						<div className="d-flex">
							<span className="marker gradient-7"></span>
							<div>
								<p className="status">Citepus</p>
								<span className="result">20</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
