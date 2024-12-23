import {useEffect, useState} from 'react';
import axios from 'axios';

const Vouchers = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [vouchers, setVouchers] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/vouchers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setVouchers(response.data.results))
            .catch(error => console.error('Ошибка при загрузке ваучеров:', error));
    }, []);

    const renderByRole = () => {
        if (role === "USER") {
            return vouchers.map(voucher => (
                <section className="voucher">
                    <div className="container">
                        <ul className="voucher__list">
                            <li className="voucher__item voucher-item">
                                <h3 className="voucher-item__name">{voucher.title}</h3>
                                <p className="voucher-item__description">{voucher.description}</p>

                                <div className="voucher-item__price">{voucher.price}</div>

                                <div className="voucher-item__date-wrapper">
                                    <div>{voucher.arrivalDate}</div>
                                    <div>-</div>
                                    <div>{voucher.evictionDate}</div>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Tour Type:</p>
                                    <p>{voucher.tourType}</p>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Transfer Type:</p>
                                    <p>{voucher.transferType}</p>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Hotel Type:</p>
                                    <p>{voucher.hotelType}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            ));
        } else if (role === "ADMIN") {
            return vouchers.map(voucher => (
                <section className="voucher">
                    <div className="container">
                        <ul className="voucher__list">
                            <li className="voucher__item voucher-item">
                                <h3 className="voucher-item__name">{voucher.title}</h3>
                                <p className="voucher-item__description">{voucher.description}</p>

                                <div className="voucher-item__price">{voucher.price}</div>

                                <div className="voucher-item__date-wrapper">
                                    <div>{voucher.arrivalDate}</div>
                                    <div>-</div>
                                    <div>{voucher.evictionDate}</div>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Tour Type:</p>
                                    <p>{voucher.tourType}</p>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Transfer Type:</p>
                                    <p>{voucher.transferType}</p>
                                </div>

                                <div className="voucher-item__type">
                                    <p>Hotel Type:</p>
                                    <p>{voucher.hotelType}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            ));
        }
        return <p>Доступ запрещен.</p>;
    };

    return (
        <div>
            {renderByRole()}
        </div>
    );
};

export default Vouchers;
