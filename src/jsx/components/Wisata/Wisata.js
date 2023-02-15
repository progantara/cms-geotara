import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import WisataList from "./WisataList";

const Wisata = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="List"
        motherMenu="Wisata"
        pageContent="List"
      />
      <div className="row">
        <WisataList />
      </div>
    </Fragment>
  );
};

export default Wisata;