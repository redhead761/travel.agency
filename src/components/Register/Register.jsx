import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './form.scss';

export default function Register() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        username: "",
        phoneNumber: "",
        password: ""
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData({
            ...formData,
            [id.replace("form-", "")]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register");
            }

            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="form-section">
            <div className="container">
                <div className="form-section__body">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form__row">
                            <label className="form__label" htmlFor="form-username">Username</label>
                            <input
                                type="text"
                                id="form-username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form__row">
                            <label className="form__label" htmlFor="form-phoneNumber">Phone Number</label>
                            <input
                                type="number"
                                id="form-phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form__row">
                            <label className="form__label" htmlFor="form-password">Password</label>
                            <input
                                type="password"
                                id="form-password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        {error && <div className="form__error">{error}</div>}

                        <div className="form__row">
                            <button className="button" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
