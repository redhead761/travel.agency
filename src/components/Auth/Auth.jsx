import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {useTranslation} from "react-i18next";
import PropTypes from 'prop-types';

const Auth = ({onAuthChange}) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const {t} = useTranslation();
    const [credentials, setCredentials] = useState({username: "", password: ""});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prevState) => ({...prevState, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
                headers: {"Content-Type": "application/json"},
            });
            const token = response.data.results[0].token;
            localStorage.setItem("token", token);

            const decoded = jwt_decode(token);
            localStorage.setItem("role", decoded.role);
            localStorage.setItem("id", decoded.id);

            onAuthChange(true);
            navigate("/vouchers");

        } catch (error) {
            const {message: backendMessage} = error.response.data || {};
            setMessage(backendMessage);
        }
    };
    return (
        <section className="form-section">
            <div className="container">
                <div className="form-section__body">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form__row">
                            <label className="form__label" htmlFor="form-name">{t("auth.username")}</label>
                            <input type="text" id="form-name" name="username" value={credentials.username}
                                   onChange={handleChange}/>
                        </div>

                        <div className="form__row">
                            <label className="form__label" htmlFor="form-password">{t("auth.password")}</label>
                            <input type="password" id="form-password" name="password" value={credentials.password}
                                   onChange={handleChange}/>
                        </div>

                        <div className="form__row">
                            <button className="button" type="submit">{t("auth.login")}</button>
                        </div>
                    </form>
                </div>
                {message && <p style={{textAlign: "center", color: "red", marginTop: "10px"}}>{message}</p>}
            </div>
        </section>
    );
};

Auth.propTypes = {
    onAuthChange: PropTypes.func.isRequired,
};

export default Auth;
