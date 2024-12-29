import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useTranslation} from "react-i18next";
import "./form.scss";

export default function Register() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        username: "",
        phoneNumber: "",
        password: ""
    });
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData({
            ...formData,
            [id.replace("form-", "")]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/users/register`, formData);
            alert(response.data.statusMessage || t("registration.success"));
            navigate("/");
        } catch (err) {
            const errorMessages = Object.entries(err.response.data)
                .filter(([, value]) => Array.isArray(value))
                .map(([key, messages]) => `${t(`fields.${key}`)}:\n${messages.join("\n")}`)
                .join("\n\n");
            alert(errorMessages || t("registration.failure"));
        }
    };

    return (
        <section className="form-section">
            <div className="container">
                <div className="form-section__body">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form__row">
                            <label className="form__label" htmlFor="form-username">
                                {t("fields.username")}
                            </label>
                            <input
                                type="text"
                                id="form-username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form__row">
                            <label className="form__label" htmlFor="form-phoneNumber">
                                {t("fields.phoneNumber")}
                            </label>
                            <input
                                type="number"
                                id="form-phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form__row">
                            <label className="form__label" htmlFor="form-password">
                                {t("fields.password")}
                            </label>
                            <input
                                type="password"
                                id="form-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form__row">
                            <button className="button" type="submit">
                                {t("registration.submit")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
