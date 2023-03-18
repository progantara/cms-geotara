import React, { Fragment } from 'react';
import PageTitle from '../../layouts/PageTitle';
import TourList from './TourList';

const Tour = () => {
	return (
		<Fragment>
			<PageTitle activeMenu="Daftar" motherMenu="Tour" pageContent="Daftar" />
			<div className="row">
				<TourList />
			</div>
		</Fragment>
	);
};

export default Tour;
