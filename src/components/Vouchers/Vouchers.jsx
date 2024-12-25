import {useEffect, useState} from 'react';
import {VoucherItem} from './voucherItem.jsx';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './voucher.scss';

const Vouchers = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [vouchers, setVouchers] = useState([]);
    const [hotelType, setHotelType] = useState(['ONE_STAR']);
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
            .then(response => setHotelType(response.data))
            .catch(error => console.error('Ошибка при загрузке hotel:', error));

        axios.get(`${API_BASE_URL}/enums/tour`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setTourType(response.data))
            .catch(error => console.error('Ошибка при загрузке tour:', error));

        axios.get(`${API_BASE_URL}/enums/transfer`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => setTransferType(response.data))
            .catch(error => console.error('Ошибка при загрузке transfer:', error));
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
            })
            .catch(error => console.error('Ошибка при загрузке ваучеров:', error));
    };

    useEffect(() => {
        setVouchers([]);
        fetchVouchers(getFilterParams());
    }, [currentPage]);

    const handleActionSuccess = (id, changes) => {
        setVouchers((prevVouchers) =>
            prevVouchers.map((voucher) =>
                voucher.id === id ? {...voucher, ...changes} : voucher
            )
        );
    };

    const refreshVouchers = () => {
        fetchVouchers(getFilterParams());
    };

    const handleFilter = () => {
        setCurrentPage(1);
        setVouchers([]);
        fetchVouchers(getFilterParams());
    };

    const renderByRole = () => {
        return vouchers.map((voucher, idx) => {
            if (role === 'ADMIN') {
                return (
                    <VoucherItem
                        key={idx}
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
            } else if (role === 'USER') {
                return (
                    <VoucherItem
                        key={idx}
                        title={voucher.title}
                        price={voucher.price}
                        arrivalDate={voucher.arrivalDate}
                        evictionDate={voucher.evictionDate}
                        hotelType={voucher.hotelType}
                    />
                );
            }
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
                            Add Voucher
                        </button>
                    </div>
                )}

                <div className="voucher__top">
                    <div className="voucher__sort-item">
                        <label htmlFor="filter-hotel-type">Hotel Type</label>
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
                        <label htmlFor="filter-tour-type">Tour Type</label>
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
                        <label htmlFor="filter-transfer-type">Transfer Type</label>
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
                            <label htmlFor="filter-min-price">Min Price</label>
                            <input
                                type="number"
                                id="filter-min-price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <div>-</div>

                            <label htmlFor="filter-max-price">Max Price</label>
                            <input
                                type="number"
                                id="filter-max-price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="button" onClick={handleFilter}>Apply Filters</button>
                </div>

                <ul className="voucher__list">
                    {renderByRole()}
                </ul>

                <div className="voucher__pagination">
                    <button
                        className="button"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="button"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Vouchers;
