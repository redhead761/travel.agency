import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { useState, useEffect } from "react";
import i18n from "./i18n";
import "./style.scss";

import Header from "./components/Header/Header.jsx";
import Auth from "./components/Auth/Auth.jsx";
import Cabinet from "./components/Cabinet/Cabinet.jsx";
import Register from "./components/Register/Register.jsx";
import VoucherCard from "./components/VoucherCard/VoucherCard.jsx";
import Vouchers from "./components/Vouchers/Vouchers.jsx";
import RoleBasedRoute from "./components/RoleBaseRoute/RoleBasedRoute.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const handleAuthChange = (authStatus) => {
        setIsAuthenticated(authStatus);
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
        } catch (error) {
            console.error(error);
            return true;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("lang");
            localStorage.removeItem("id");
            localStorage.removeItem("role");
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <div className="wrapper">
                <Router>
                    <Header onAuthChange={handleAuthChange} isAuthenticated={isAuthenticated} />
                    <main className="main">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    isAuthenticated ? (
                                        <Navigate to="/vouchers" replace />
                                    ) : (
                                        <Auth onAuthChange={handleAuthChange} />
                                    )
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    isAuthenticated ? (
                                        <Navigate to="/vouchers" replace />
                                    ) : (
                                        <Register />
                                    )
                                }
                            />
                            <Route
                                path="/cabinet"
                                element={
                                    isAuthenticated ? (
                                        <RoleBasedRoute allowedRoles={["USER", "ADMIN", "MANAGER"]}>
                                            <Cabinet />
                                        </RoleBasedRoute>
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            />
                            <Route
                                path="/voucher-card"
                                element={
                                    isAuthenticated && localStorage.getItem("role") === "ADMIN" ? (
                                        <VoucherCard />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            />
                            <Route
                                path="/vouchers"
                                element={
                                    isAuthenticated ? (
                                        <RoleBasedRoute allowedRoles={["USER", "ADMIN", "MANAGER"]}>
                                            <Vouchers />
                                        </RoleBasedRoute>
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </Router>
            </div>
        </I18nextProvider>
    );
}

export default App;
