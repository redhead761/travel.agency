import {useEffect, useState} from 'react';
import axios from 'axios';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1.0/vouchers', {
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
                <div key={voucher.id}>
                    <h3>{voucher.title}</h3>
                    <p>{voucher.description}</p>
                    <p>Price: {voucher.price}</p>
                </div>
            ));
        } else if (role === "ADMIN") {
            return vouchers.map(voucher => (
                <div key={voucher.id}>
                    <h3>{voucher.title} (ID: {voucher.id})</h3>
                    <p>{voucher.description}</p>
                    <p>Price: {voucher.price}</p>
                    <p>Type: {voucher.tourType}</p>
                    <button>Approve</button>
                </div>
            ));
        }
        return <p>Доступ запрещен.</p>;
    };

    return (
        <div>
            <h1>Vouchers</h1>
            {renderByRole()}
        </div>
    );
};

export default Vouchers;
