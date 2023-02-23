import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import ViewList from "./ViewList";

const view360 = () => {
    return (
        <Fragment>
            <PageTitle
                activeMenu="view-list"
                motherMenu="360 Media"
                pageContent="view-list"
            />
            <div className="row">
                <ViewList />
            </div>
        </Fragment>
    );
}

export default view360;
