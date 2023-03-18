import React, { Fragment } from 'react';
import PageTitle from '../../layouts/PageTitle';
import RestaurantList from './RestaurantList';

const Restaurant = () => {
	return (
		<Fragment>
			<PageTitle activeMenu="Daftar" motherMenu="Restaurant" pageContent="Daftar" />
			<div className="row">
				<RestaurantList />
			</div>
		</Fragment>
	);
};

export default Restaurant;
