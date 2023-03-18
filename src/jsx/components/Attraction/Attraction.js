import React, { Fragment } from 'react';
import PageTitle from '../../layouts/PageTitle';
import AttractionList from './AttractionList';

const Attraction = () => {
	return (
		<Fragment>
			<PageTitle activeMenu="Daftar" motherMenu="Attraction" pageContent="Daftar" />
			<div className="row">
				<AttractionList />
			</div>
		</Fragment>
	);
};

export default Attraction;
