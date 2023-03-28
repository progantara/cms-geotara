import React, { useContext, useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

/// React router dom
import { Switch, Route, useLocation } from 'react-router-dom';

/// Css
import './index.css';
import './chart.css';
import './step.css';

/// Layout
import Nav from './layouts/nav';
import Footer from './layouts/Footer';

/// Dashboard
import Home from './pages/Dashboard';

import DashboardDark from './components/Dashboard/DashboardDark';
import GuestList from './components/Dashboard/GuestList';
import GuestDetail from './components/Dashboard/GuestDetail';
import Concierge from './components/Dashboard/Concierge';
import Room from './components/Dashboard/Room';
import Reviews from './components/Dashboard/Reviews';
import Task from './components/Dashboard/Task';

/// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import LockScreen from './pages/LockScreen';
import Error400 from './pages/Error400';
import Error403 from './pages/Error403';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';
import Error503 from './pages/Error503';
import { ThemeContext } from '../context/ThemeContext';
import Section from './components/Section';
import { useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../store/store';

// Profil
const Profil = React.lazy(() => import('./components/Profil/Profil'));

// Wisata
const Wisata = React.lazy(() => import('./components/Wisata/Wisata'));
const WisataForm = React.lazy(() => import('./components/Wisata/WisataForm'));

// Kota
const Kota = React.lazy(() => import('./components/Lokasi/Kota/Kota'));
const KotaForm = React.lazy(() => import('./components/Lokasi/Kota/KotaForm'));

// Virtual Tour
const VirtualTourViewEditor = React.lazy(() => import('./components/VirtualTour/VirtualTourViewEditor'));
const VirtualTourViewList = React.lazy(() => import('./components/VirtualTour/VirtualTourViewList'));

// Publikasi
const Article = React.lazy(() => import('./components/Article/Article'));
const ArticleForm = React.lazy(() => import('./components/Article/ArticleForm'));
const ArticleDetail = React.lazy(() => import('./components/Article/ArticleDetail'));

const Event = React.lazy(() => import('./components/Event/Event'));
const EventForm = React.lazy(() => import('./components/Event/EventForm'));

// Kemitraan
const Accomodation = React.lazy(() => import('./components/Accomodation/Accomodation'));
const AccomodationForm = React.lazy(() => import('./components/Accomodation/AccomodationForm'));

const Attraction = React.lazy(() => import('./components/Attraction/Attraction'));
const AttractionForm = React.lazy(() => import('./components/Attraction/AttractionForm'));

const Merchant = React.lazy(() => import('./components/Merchant/Merchant'));
const MerchantForm = React.lazy(() => import('./components/Merchant/MerchantForm'));

const Restaurant = React.lazy(() => import('./components/Restaurant/Restaurant'));
const RestaurantForm = React.lazy(() => import('./components/Restaurant/RestaurantForm'));

const Tour = React.lazy(() => import('./components/Tour/Tour'));
const TourForm = React.lazy(() => import('./components/Tour/TourForm'));

// Autentikasi
const User = React.lazy(() => import('./components/User/User'));
const UserForm = React.lazy(() => import('./components/User/UserForm'));

const Markup = () => {
	const { menuToggle } = useContext(ThemeContext);
	const routes = [
		{ url: 'section', component: Section },
		/// Dashboard
		{ url: '', component: Home },
		{ url: 'dashboard', component: Home },
		{ url: 'dashboard-dark', component: DashboardDark },
		{ url: 'guest-list', component: GuestList },
		{ url: 'guest-detail', component: GuestDetail },
		{ url: 'concierge', component: Concierge },
		{ url: 'room-list', component: Room },
		{ url: 'reviews', component: Reviews },
		{ url: 'task', component: Task },

		/// Profil
		{ url: 'profil', component: Profil },

		/// Wisata
		{ url: 'wisata', component: Wisata },
		{ url: 'wisata/tambah', component: WisataForm },
		{ url: 'wisata/edit/:id', component: WisataForm },

		/// Lokasi
		{ url: 'kota', component: Kota },
		{ url: 'kota/tambah', component: KotaForm },
		{ url: 'kota/edit/:id', component: KotaForm },

		/// Virtual Tour
		{ url: 'virtual-tour/editor', component: VirtualTourViewEditor },
		{ url: 'virtual-tour/view', component: VirtualTourViewList },

		/// Publikasi
		{ url: 'artikel', component: Article },
		{ url: 'artikel/tambah', component: ArticleForm },
		{ url: 'artikel/edit/:id', component: ArticleForm },
		{ url: 'artikel/detail/:id', component: ArticleDetail },
		{ url: 'acara', component: Event },
		{ url: 'acara/tambah', component: EventForm },
		{ url: 'acara/edit/:id', component: EventForm },

		/// Kemitraan
		{ url: 'accomodation', component: Accomodation },
		{ url: 'accomodation/tambah', component: AccomodationForm },
		{ url: 'accomodation/edit/:id', component: AccomodationForm },

		{ url: 'attraction', component: Attraction },
		{ url: 'attraction/tambah', component: AttractionForm },
		{ url: 'attraction/edit/:id', component: AttractionForm },

		{ url: 'merchant', component: Merchant },
		{ url: 'merchant/tambah', component: MerchantForm },
		{ url: 'merchant/edit/:id', component: MerchantForm },

		{ url: 'restaurant', component: Restaurant },
		{ url: 'restaurant/tambah', component: RestaurantForm },
		{ url: 'restaurant/edit/:id', component: RestaurantForm },

		{ url: 'tour', component: Tour },
		{ url: 'tour/tambah', component: TourForm },
		{ url: 'tour/edit/:id', component: TourForm },

		/// Autentikasi
		{ url: 'pengguna', component: User },
		{ url: 'pengguna/tambah', component: UserForm },
		{ url: 'pengguna/edit/:id', component: UserForm },

		/// pages
		{ url: 'page-lock-screen', component: LockScreen },
		{ url: 'page-login', component: Login },
		{ url: 'page-forgot-password', component: ForgotPassword },
		{ url: 'page-error-400', component: Error400 },
		{ url: 'page-error-403', component: Error403 },
		{ url: 'page-error-404', component: Error404 },
		{ url: 'page-error-500', component: Error500 },
		{ url: 'page-error-503', component: Error503 },
	];
	let path = window.location.pathname;
	path = path.split('/');
	path = path[path.length - 1];

	let pagePath = path.split('-').includes('page');

	const { progress, show } = useSelector((state) => state.loadingBar);

	return (
		<>
			<ConnectedRouter history={history}>
				<div id={`${!pagePath ? 'main-wrapper' : ''}`} className={`${!pagePath ? 'show' : 'vh-100'}  ${menuToggle ? 'menu-toggle' : ''}`}>
					{!pagePath && <Nav />}
					<div className={`${!pagePath ? 'content-body' : ''}`}>
						<div className={`${!pagePath ? 'container-fluid' : ''}`} style={{ minHeight: window.screen.height - 60 }}>
							{show && <LoadingBar color="#f11946" progress={progress} />}
							<Switch>
								{routes.map((data, i) => (
									<Route
										key={i}
										exact
										path={`/${data.url}`}
										component={data.component}
									/>
								))}
							</Switch>
						</div>
					</div>
					{!pagePath && <Footer />}
				</div>
			</ConnectedRouter>
		</>
	);
};

export default Markup;
