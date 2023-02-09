import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import AccomodationList from "./AccomodationList";

const Accomodation = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="List"
        motherMenu="Accomodation"
        pageContent="List"
      />
      <div className="row">
        <AccomodationList />
      </div>
    </Fragment>
  );
};

export default Accomodation;