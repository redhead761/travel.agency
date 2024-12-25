import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const [tourTypes, setTourTypes] = useState([]);
    const [transferTypes, setTransferTypes] = useState([]);
    const [hotelTypes, setHotelTypes] = useState([]);

    const navigate = useNavigate();

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

        fetchEnums();
    }, [localStorage.getItem('token')]);

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
            await axios.post(`${API_BASE_URL}/vouchers`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Voucher created successfully!');
            navigate('/vouchers');
        } catch (error) {
            console.error('Error creating voucher:', error);
            alert('Failed to create voucher.');
        }
    };

    return (
        <div>
            <h1>Create Voucher</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Tour Type:</label>
                    <select name="tourType" value={formData.tourType} onChange={handleChange} required>
                        <option value="">Select Tour Type</option>
                        {tourTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Transfer Type:</label>
                    <select name="transferType" value={formData.transferType} onChange={handleChange} required>
                        <option value="">Select Transfer Type</option>
                        {transferTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Hotel Type:</label>
                    <select name="hotelType" value={formData.hotelType} onChange={handleChange} required>
                        <option value="">Select Hotel Type</option>
                        {hotelTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Arrival Date:</label>
                    <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Eviction Date:</label>
                    <input type="date" name="evictionDate" value={formData.evictionDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Hot:</label>
                    <input type="checkbox" name="hot" checked={formData.hot} onChange={handleChange} />
                </div>
                <button type="submit">Create Voucher</button>
                <button type="button" onClick={() => navigate('/vouchers')}>Back to Vouchers</button>
            </form>
        </div>
    );
};

export default VoucherCard;
