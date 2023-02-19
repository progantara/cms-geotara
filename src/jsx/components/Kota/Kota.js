import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import KotaList from "./KotaList";

const Kota = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="List"
        motherMenu="Kota"
        pageContent="List"
      />
      <div className="row">
        <KotaList />
      </div>
    </Fragment>
  );
};

export default Kota;