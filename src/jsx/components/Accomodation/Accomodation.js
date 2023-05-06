import React, { Fragment } from 'react';
import PageTitle from '../../layouts/PageTitle';
import AccomodationList from './AccomodationList';

const Accomodation = () => {
	return (
		<Fragment>
			<PageTitle activeMenu="Daftar" motherMenu="Accomodation" pageContent="Daftar" />
			<div id="accomodation-page" className="row">
				<AccomodationList />
			</div>
		</Fragment>
	);
};

export default Accomodation;
