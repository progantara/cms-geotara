import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import ArticleList from "./ArticleList";

const DataArticle = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Data Artikel"
        motherMenu="Artikel"
        pageContent="Daftar Artikel"
      />
      <div className="row">
        <ArticleList />
      </div>
    </Fragment>
  );
};

export default DataArticle;