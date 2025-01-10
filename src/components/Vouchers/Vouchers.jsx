import {useEffect, useState} from 'react';
import {VoucherItem} from './voucherItem.jsx';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './voucher.scss';
import {useTranslation} from "react-i18next";

const Vouchers = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const {t} = useTranslation();
    const [vouchers, setVouchers] = useState([]);
    const [hotelType, setHotelType] = useState([]);
    const [tourType, setTourType] = useState([]);
    const [transferType, setTransferType] = useState([]);

    const [selectedHotelType, setSelectedHotelType] = useState('');
    const [selectedTourType, setSelectedTourType] = useState('');
    const [selectedTransferType, setSelectedTransferType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/enums/hotel`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setHotelType(response.data));

        axios.get(`${API_BASE_URL}/enums/tour`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setTourType(response.data));

        axios.get(`${API_BASE_URL}/enums/transfer`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setTransferType(response.data));
    }, []);

    const getFilterParams = () => {
        const params = {};
        if (selectedHotelType) params.hotelType = selectedHotelType;
        if (selectedTourType) params.tourType = selectedTourType;
        if (selectedTransferType) params.transferType = selectedTransferType;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        params.page = currentPage;
        return params;
    };

    const fetchVouchers = (filterParams = {}) => {
        axios.get(`${API_BASE_URL}/vouchers`, {
            params: filterParams,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                setVouchers(response.data.results);
                setTotalPages(response.data.totalPages || 1);
            });
    };

    useEffect(() => {
        setVouchers([]);
        fetchVouchers(getFilterParams());
    }, [currentPage]);

    const handleActionSuccess = async () => {
        refreshVouchers();
    };

    const refreshVouchers = () => {
        fetchVouchers(getFilterParams());
    };

    const handleFilter = () => {
        setCurrentPage(1);
        setVouchers([]);
        fetchVouchers(getFilterParams());
    };

    const render = () => {
        return vouchers.map((voucher) => {
            return (
                <VoucherItem
                    key={voucher.id}
                    id={voucher.id}
                    title={voucher.title}
                    description={voucher.description}
                    price={voucher.price}
                    arrivalDate={voucher.arrivalDate}
                    evictionDate={voucher.evictionDate}
                    tourType={voucher.tourType}
                    transferType={voucher.transferType}
                    hotelType={voucher.hotelType}
                    status={voucher.status}
                    hotStatus={voucher.hot}
                    onActionSuccess={handleActionSuccess}
                    role={role}
                    onRefreshVouchers={refreshVouchers}
                />
            );
        });
    };

    return (
        <section className="voucher">
            <div className="container">

                {role === 'ADMIN' && (
                    <div className="voucher__top">
                        <button
                            className="button button--add"
                            onClick={() => navigate('/voucher-card')}
                        >
                            {t('vouchers.add_voucher')}
                        </button>
                    </div>
                )}

                <div className="voucher__top">
                    <div className="voucher__sort-item">
                        <label htmlFor="filter-hotel-type">{t('vouchers.hotel_type')}</label>
                        <select
                            id="filter-hotel-type"
                            value={selectedHotelType}
                            onChange={(e) => setSelectedHotelType(e.target.value)}
                        >
                            <option value="">All</option>
                            {hotelType.map((item, idx) => (
                                <option key={idx} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="voucher__sort-item">
                        <label htmlFor="filter-tour-type">{t('vouchers.tour_type')}</label>
                        <select
                            id="filter-tour-type"
                            value={selectedTourType}
                            onChange={(e) => setSelectedTourType(e.target.value)}
                        >
                            <option value="">All</option>
                            {tourType.map((item, idx) => (
                                <option key={idx} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="voucher__sort-item">
                        <label htmlFor="filter-transfer-type">{t('vouchers.transfer_type')}</label>
                        <select
                            id="filter-transfer-type"
                            value={selectedTransferType}
                            onChange={(e) => setSelectedTransferType(e.target.value)}
                        >
                            <option value="">All</option>
                            {transferType.map((item, idx) => (
                                <option key={idx} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="voucher__sort-item">
                        <div className="voucher__sort-item-price">
                            <label htmlFor="filter-min-price">{t('vouchers.min_price')}</label>
                            <input
                                type="number"
                                id="filter-min-price"
                                value={minPrice}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (Number(value) > 0 && !isNaN(value))) {
                                        setMinPrice(e.target.value)
                                    }
                                }}
                            />
                            <div>-</div>

                            <label htmlFor="filter-max-price">{t('vouchers.max_price')}</label>
                            <input
                                type="number"
                                id="filter-max-price"
                                value={maxPrice}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (Number(value) > 0 && !isNaN(value))) {
                                        setMaxPrice(value);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <button className="button" onClick={handleFilter}>{t('vouchers.apply_filters')}</button>
                </div>

                <ul className="voucher__list">
                    {render()}
                </ul>

                <div className="voucher__pagination">
                    <button
                        className="button"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {t('cabinet.previous')}
                    </button>
                    <span>{t('cabinet.page')} {currentPage} {t('cabinet.of')} {totalPages}</span>
                    <button
                        className="button"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {t('cabinet.next')}
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Vouchers;
