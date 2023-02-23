import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import EventList from "./EventList";

const Event = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="List"
        motherMenu="Acara"
        pageContent="List"
      />
      <div className="row">
        <EventList />
      </div>
    </Fragment>
  );
};

export default Event;