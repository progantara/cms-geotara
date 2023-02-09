import React from "react";

import Usa from "@svg-maps/usa";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";

const DistributionMap = () => {
  return (
    <div className="col-xl-12 col-sm-6">
      <div className="card text-center">
        <div className="card-header border-0">
					<h4 className="card-title">Peta Sebaran</h4>
				</div>
        <div className="card-body mb-2" style={{ height: "100%" }}>
          <div id="usa" style={{ height: "100%" }}>
            <SVGMap map={Usa} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionMap;
