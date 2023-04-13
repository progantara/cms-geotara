import React, { Fragment } from 'react';
import PageTitle from '../../layouts/PageTitle';
import EntertaimentList from './EntertaimentList';

const Entertaiment = () => {
	return (
		<Fragment>
			<PageTitle activeMenu="Daftar" motherMenu="Entertaiment" pageContent="Daftar" />
			<div className="row">
				<EntertaimentList />
			</div>
		</Fragment>
	);
};

export default Entertaiment;
