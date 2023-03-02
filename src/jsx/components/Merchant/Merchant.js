import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import MerchantList from "./MerchantList";

const Merchant = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Daftar"
        motherMenu="Merchant"
        pageContent="Daftar"
      />
      <div className="row">
        <MerchantList />
      </div>
    </Fragment>
  );
};

export default Merchant;