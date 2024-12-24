import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import axios from "axios";
import './header.scss';

function Header({onAuthChange, isAuthenticated}) {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const {i18n} = useTranslation();
	const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "ua");

	useEffect(() => {
		i18n.changeLanguage(currentLang);

		const axiosInterceptor = axios.interceptors.request.use((config) => {
			config.headers["Accept-Language"] = currentLang;
			return config;
		});

		return () => {
			axios.interceptors.request.eject(axiosInterceptor);
		};
	}, [currentLang, i18n]);

	const handleLanguageChange = (event) => {
		const lang = event.target.value;
		setCurrentLang(lang);
		localStorage.setItem("lang", lang);
	};

	const handleLogout = async () => {
		try {
			const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.status === 200) {
				localStorage.removeItem("token");
				onAuthChange(false);
				window.location.href = "/";
			} else {
				console.error("Failed to logout");
			}
		} catch (error) {
			console.error("An error occurred during logout", error);
		}
	};

	return (
		<header className="header">
			<div className="container">
				<div className="header__body">
					<div className="header-select-language">
						<select name="site-language"
								id="site-language"
								value={currentLang}
								onChange={handleLanguageChange}>
							<option value="en">English</option>
							<option value="ua">Українська</option>
						</select>
					</div>

					<div className="header__title">{i18n.t("header.title")}</div>

					<div className="header__actions">
						{isAuthenticated ? (
							<>
								<a className="button" href="/cabinet">{i18n.t("header.cabinet")}</a>
								<button className="button" onClick={handleLogout}>{i18n.t("header.logout")}</button>
							</>
						) : (
							<>
								<a className="button" href="/">{i18n.t("header.login")}</a>
								<a className="button" href="/register">{i18n.t("header.register")}</a>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

Header.propTypes = {
	onAuthChange: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
};

export default Header;
