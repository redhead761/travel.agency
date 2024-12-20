import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./Auth.css";
import { useTranslation } from "react-i18next";

const Auth = () => {
    const { t } = useTranslation();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/v1.0/auth/login", credentials, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 202 && response.data.results && response.data.results[0]?.token) {
                const token = response.data.results[0].token;
                localStorage.setItem("token", token);

                const decoded = jwt_decode(token);
                if (decoded.role) {
                    localStorage.setItem("role", decoded.role);
                }

                navigate("/cabinet");
            } else {
                setMessage(t("login.error"));
            }
        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            setMessage(t("login.exception"));
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">{t("login.username")}:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">{t("login.password")}:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{t("login.enter")}</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Auth;
