import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./voycher-card.scss";
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VoucherCard = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        tourType: '',
        transferType: '',
        hotelType: '',
        arrivalDate: '',
        evictionDate: '',
        hot: false,
    });

    const { t } = useTranslation();
    const [tourTypes, setTourTypes] = useState([]);
    const [transferTypes, setTransferTypes] = useState([]);
    const [hotelTypes, setHotelTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const voucherId = location.state?.voucherId;

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const [tourResponse, transferResponse, hotelResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/enums/tour`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                    axios.get(`${API_BASE_URL}/enums/transfer`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                    axios.get(`${API_BASE_URL}/enums/hotel`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                ]);

                setTourTypes(tourResponse.data);
                setTransferTypes(transferResponse.data);
                setHotelTypes(hotelResponse.data);
            } catch (error) {
                console.error('Error fetching enum data:', error);
            }
        };

        const fetchVoucher = async () => {
            if (voucherId) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/vouchers/${voucherId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    setFormData(response.data.results[0]);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Error fetching voucher data:', error);
                }
            }
        };

        fetchEnums();
        fetchVoucher();
    }, [voucherId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const response = await axios.put(`${API_BASE_URL}/vouchers/${voucherId}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert(response.data.statusMessage);
            } else {
                const response = await axios.post(`${API_BASE_URL}/vouchers`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert(response.data.statusMessage);
            }
            navigate('/vouchers');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className={'voucher-card'}>
            <div className={'container'}>
                <h1 className={'voucher-card__name'}>{isEditing ? t('voucher.edit') : t('voucher.create')}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='input-title'>{t('voucher.title')}:</label>
                        <input type="text" name="title" id='input-title' value={formData.title} onChange={handleChange}
                               />
                    </div>
                    <div>
                        <label>{t('voucher.description')}:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div>
                        <label>{t('voucher.price')}:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} />
                    </div>
                    <div>
                        <label>{t('voucher.tourType')}:</label>
                        <select name="tourType" value={formData.tourType} onChange={handleChange} >
                            <option value="">{t('voucher.select_tour_type')}</option>
                            {tourTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t('voucher.transferType')}:</label>
                        <select name="transferType" value={formData.transferType} onChange={handleChange} >
                            <option value="">{t('voucher.select_transfer_type')}</option>
                            {transferTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t('voucher.hotelType')}:</label>
                        <select name="hotelType" value={formData.hotelType} onChange={handleChange} >
                            <option value="">{t('voucher.select_hotel_type')}</option>
                            {hotelTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t('voucher.arrivalDate')}:</label>
                        <input type="date"
                               name="arrivalDate"
                               value={formData.arrivalDate}
                               onChange={handleChange}
                               />
                    </div>
                    <div>
                        <label>{t('voucher.evictionDate')}:</label>
                        <input type="date"
                               name="evictionDate"
                               value={formData.evictionDate}
                               onChange={handleChange}
                               />
                    </div>
                    <div className='row-checkbox'>
                        <label>{t('voucher.hot')}:</label>
                        <input type="checkbox" name="hot" checked={formData.hot} onChange={handleChange}/>
                    </div>
                    <div className="voucher-card__buttons">
                        <button type="submit"
                                className='button'>{isEditing ? t('voucher.edit') : t('voucher.create')}</button>
                        <button type="button" className='button danger' onClick={() => navigate('/vouchers')}>Back to
                            Vouchers
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoucherCard;
