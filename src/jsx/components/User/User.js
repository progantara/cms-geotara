import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import UserList from "./UserList";

const User = () => {
	return (
		<Fragment>
			<PageTitle
				activeMenu="Daftar"
				motherMenu="Pengguna"
				pageContent="Daftar"
			/>
			<div className="row">
				<UserList />
			</div>
		</Fragment>
	);
};

export default User;
