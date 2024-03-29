/// Menu
import Metismenu from 'metismenujs';
import React, { Component, useContext, useEffect } from 'react';
/// Scroll
import PerfectScrollbar from 'react-perfect-scrollbar';
/// Link
import { Link } from 'react-router-dom';
import useScrollPosition from 'use-scroll-position';
import { ThemeContext } from '../../../context/ThemeContext';

class MM extends Component {
	componentDidMount() {
		this.$el = this.el;
		this.mm = new Metismenu(this.$el);
	}
	componentWillUnmount() {}
	render() {
		return (
			<div className="mm-wrapper">
				<ul className="metismenu" ref={(el) => (this.el = el)}>
					{this.props.children}
				</ul>
			</div>
		);
	}
}

const SideBar = () => {
	const { iconHover, sidebarposition, headerposition, sidebarLayout } = useContext(ThemeContext);
	useEffect(() => {
		var btn = document.querySelector('.nav-control');
		var aaa = document.querySelector('#main-wrapper');
		function toggleFunc() {
			return aaa.classList.toggle('menu-toggle');
		}
		btn.addEventListener('click', toggleFunc);
	}, []);
	let scrollPosition = useScrollPosition();
	/// Path
	let path = window.location.pathname;
	path = path.split('/');
	path = path[path.length - 1];
	/// Active menu
	let dashboard = ['', 'dashboard', 'dashboard-dark'],
		wisata = ['wisata'],
		email = ['email-compose', 'email-inbox', 'email-read'],
		shop = ['ecom-product-grid', 'ecom-product-list', 'ecom-product-list', 'ecom-product-order', 'ecom-checkout', 'ecom-invoice', 'ecom-customers', 'ecom-product-detail'],
		charts = ['chart-rechart', 'chart-flot', 'chart-chartjs', 'chart-chartist', 'chart-sparkline', 'chart-apexchart'],
		bootstrap = [
			'ui-accordion',
			'ui-badge',
			'ui-alert',
			'ui-button',
			'ui-modal',
			'ui-button-group',
			'ui-list-group',
			'ui-media-object',
			'ui-card',
			'ui-carousel',
			'ui-dropdown',
			'ui-popover',
			'ui-progressbar',
			'ui-tab',
			'ui-typography',
			'ui-pagination',
			'ui-grid',
		],
		plugins = ['uc-select2', 'uc-nestable', 'uc-sweetalert', 'uc-toastr', 'uc-noui-slider', 'map-jqvmap', 'uc-lightgallery'],
		redux = ['redux-form', 'redux-wizard', 'todo'],
		widget = ['widget-basic'],
		forms = ['form-element', 'form-wizard', 'form-editor-summernote', 'form-pickers', 'form-validation-jquery'],
		table = ['table-bootstrap-basic', 'table-datatable-basic'],
		pages = ['page-register', 'page-login', 'page-lock-screen', 'page-error-400', 'page-error-403', 'page-error-404', 'page-error-500', 'page-error-503'],
		error = ['page-error-400', 'page-error-403', 'page-error-404', 'page-error-500', 'page-error-503'];
	return (
		<div className={`deznav ${iconHover} ${sidebarposition.value === 'fixed' && sidebarLayout.value === 'horizontal' && headerposition.value === 'static' ? (scrollPosition > 120 ? 'fixed' : '') : ''}`}>
			<PerfectScrollbar className="deznav-scroll">
				<MM className="metismenu" id="menu">
					<li className={`${dashboard.includes(path) ? 'mm-active' : ''}`}>
						<Link className="ai-icon" to="/dashboard">
							<i className="flaticon-025-dashboard"></i>
							<span className="nav-text">Dashboard</span>
						</Link>
					</li>
					<li className={`${wisata.includes(path) ? 'mm-active' : ''}`}>
						<Link className="ai-icon" to="/wisata">
							<i className="fa fa-map-marked"></i>
							<span className="nav-text">Wisata</span>
						</Link>
					</li>
					<li className={`${charts.includes(path) ? 'mm-active' : ''}`}>
						<Link id="publikasi-btn" className="has-arrow ai-icon" to="#">
							<i className="fa fa-bullhorn"></i>
							<span className="nav-text">Publikasi</span>
						</Link>
						<ul>
							<li>
								<Link
									id="artikel-link-btn"
									className={`${path === 'artikel' ? 'mm-active' : ''}`}
									to="/artikel"
								>
									Artikel
								</Link>
							</li>
							<li>
								<Link className={`${path === 'acara' ? 'mm-active' : ''}`} to="/acara">
									Acara
								</Link>
							</li>
							<li>
								<Link
									className={`${path === 'entertaiment' ? 'mm-active' : ''}`}
									to="/entertaiment"
								>
									Entertaiment
								</Link>
							</li>
						</ul>
					</li>
					<li className={`${bootstrap.includes(path) ? 'mm-active' : ''}`}>
						<Link id="kemitraan-tab" className="has-arrow ai-icon" to="#">
							<i className="fa fa-handshake"></i>
							<span className="nav-text">Kemitraan</span>
						</Link>
						<ul>
							<li>
								<Link
									id="akomodasi-menu"
									className={`${path === 'accomodation' ? 'mm-active' : ''}`}
									to="/accomodation"
								>
									Akomodasi
								</Link>
							</li>
							<li>
								<Link
									className={`${path === 'attraction' ? 'mm-active' : ''}`}
									to="/attraction"
								>
									Atraksi
								</Link>
							</li>
							<li>
								<Link
									id="merchant-menu"
									className={`${path === 'merchant' ? 'mm-active' : ''}`}
									to="/merchant"
								>
									Merchant dan Souvernir
								</Link>
							</li>
							<li>
								<Link
									id="restaurant-menu"
									className={`${path === 'restaurant' ? 'mm-active' : ''}`}
									to="/restaurant"
								>
									Restoran
								</Link>
							</li>
							<li>
								<Link className={`${path === 'tour' ? 'mm-active' : ''}`} to="/tour">
									Tur dan Travel
								</Link>
							</li>
						</ul>
					</li>
					<li className={`${plugins.includes(path) ? 'mm-active' : ''}`}>
						<Link className="has-arrow ai-icon" to="#">
							<i className="fa fa-lock"></i>
							<span className="nav-text">Manajemen</span>
						</Link>
						<ul>
							<li>
								<Link className={`${path === 'pengguna' ? 'mm-active' : ''}`} to="/pengguna">
									Pengguna
								</Link>
							</li>
						</ul>
					</li>
				</MM>
			</PerfectScrollbar>
		</div>
	);
};

export default SideBar;
