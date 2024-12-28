import {useEffect, useState} from 'react';import axios from 'axios';import {useNavigate} from 'react-router-dom';export function VoucherItem(props) {    const {        id,        title,        description,        price,        arrivalDate,        evictionDate,        tourType,        transferType,        hotelType,        status,        hotStatus,        role,        onActionSuccess,        onRefreshVouchers    } = props;    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;    const [statusOptions, setStatusOptions] = useState([]);    const [currentStatus, setCurrentStatus] = useState(status);    const [isHot, setIsHot] = useState(hotStatus === "true");    const navigate = useNavigate();    useEffect(() => {        const fetchStatusOptions = async () => {            try {                const response = await axios.get(`${API_BASE_URL}/enums/status`, {                    headers: {                        Authorization: `Bearer ${localStorage.getItem('token')}`,                    },                });                setStatusOptions(response.data);            } catch (error) {                console.error('Error fetching status options:', error);            }        };        fetchStatusOptions();    }, [API_BASE_URL]);    const handleStatusChange = async (newStatus) => {        const result = confirm('Are you sure?');        if (result) {            try {                await axios.patch(                    `${API_BASE_URL}/vouchers/${id}/status`,                    {},                    {                        headers: {                            Authorization: `Bearer ${localStorage.getItem('token')}`,                        },                        params: {status: newStatus},                    }                );                setCurrentStatus(newStatus);                onActionSuccess(id, {status: newStatus});            } catch (error) {                console.error('Error changing status:', error);            }        }    };    const toggleHotStatus = async () => {        const result = confirm('Are you sure?');        if (result) {            try {                const newHotStatus = !isHot;                await axios.patch(                    `${API_BASE_URL}/vouchers/${id}/hot`,                    {},                    {                        headers: {                            Authorization: `Bearer ${localStorage.getItem('token')}`,                        },                        params: {status: newHotStatus},                    }                );                setIsHot(newHotStatus);                onActionSuccess(id, {hot: newHotStatus});                props.onRefreshVouchers();            } catch (error) {                console.error('Error changing hot status:', error);            }        }    };    const handleDelete = () => {        const result = confirm('Are you sure?');        if (result) {            axios                .delete(`${API_BASE_URL}/vouchers/${id}`, {                    headers: {                        Authorization: `Bearer ${localStorage.getItem('token')}`,                    },                })                .then(() => onActionSuccess(id, null))                .catch((error) => console.error('Error deleting voucher:', error));        }    };    const handleOrder = () => {        const result = confirm('Are you sure?');        if (result) {            axios                .patch(`${API_BASE_URL}/vouchers/${id}/order?userId=${localStorage.getItem('id')}`, {}, {                    headers: {                        Authorization: `Bearer ${localStorage.getItem('token')}`,                    },                })                .then(() => onActionSuccess(id, {ordered: true}))                .catch((error) => console.error('Error ordering voucher:', error));        }    };    return (        <li className="voucher__item voucher-item">            <h3 className="voucher-item__name">{title}</h3>            <p className="voucher-item__description">{description}</p>            <div className="voucher-item__price">{price}</div>            <div className="voucher-item__date-wrapper">                <div>{arrivalDate}</div>                <div>-</div>                <div>{evictionDate}</div>            </div>            <div className="voucher-item__type">                <p>Tour:</p>                <p>{tourType}</p>            </div>            <div className="voucher-item__type">                <p>Transfer:</p>                <p>{transferType}</p>            </div>            <div className="voucher-item__type">                <p>Hotel:</p>                <p>{hotelType}</p>            </div>            <div className="voucher-item__type">            </div>            <div className="voucher-item__type">                <p>Hot:</p>                <p>{isHot ? 'Yes' : 'No'}</p>            </div>            {role === 'ADMIN' && (                <div className="voucher-item__actions">                    <p>Status:</p>                    <select                        value={currentStatus}                        onChange={(e) => handleStatusChange(e.target.value)}                        className="voucher-item__status-select"                    >                        {statusOptions.map((option, idx) => (                            <option key={idx} value={option}>                                {option}                            </option>                        ))}                    </select>                    <button onClick={toggleHotStatus} className="button">                        Toggle Hot                    </button>                    <button onClick={handleDelete} className="button">                        Delete                    </button>                    <button                        className="button button--add"                        onClick={() => navigate('/voucher-card', {state: {voucherId: id}})}                    >                        Update Voucher                    </button>                </div>            )}            {role === 'MANAGER' && (                <div className="voucher-item__actions">                    <p>Status:</p>                    <select                        value={currentStatus}                        onChange={(e) => handleStatusChange(e.target.value)}                        className="voucher-item__status-select"                    >                        {statusOptions.map((option, idx) => (                            <option key={idx} value={option}>                                {option}                            </option>                        ))}                    </select>                    <button onClick={toggleHotStatus} className="button">                        Toggle Hot                    </button>                </div>            )}            {role === 'USER' && (                <div className="voucher-item__actions">                    <button onClick={handleOrder} className="button">                        Order                    </button>                </div>            )}        </li>    );}