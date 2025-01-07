import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import './cabinet.scss';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {VoucherItem} from '../Vouchers/VoucherItem.jsx';

export default function Cabinet() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const {t} = useTranslation();
    const navigate = useNavigate();

    const [vouchers, setVouchers] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentUser, setCurrentUser] = useState(null);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('id');

    useEffect(() => {
        fetchCurrentUser();
        if (role === 'ADMIN') {
            fetchUsers();
        } else if (role === 'USER') {
            fetchVouchers();
        }
    }, [role, currentPage]);

    const handleApiError = (error) => {
        const message = error.response?.data?.message || error.message;
        alert(message);
    };

    const handleApiSuccess = (response) => {
        const message = response?.data?.statusMessage;
        alert(message);
    };

    const fetchCurrentUser = async () => {
        try {
            const {data} = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });
            setCurrentUser(data.results[0]);
        } catch (err) {
            handleApiError(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const {data} = await axios.get(`${API_BASE_URL}/users`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                params: {page: currentPage},
            });
            setUsers(data.results);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            handleApiError(err);
        }
    };

    const fetchVouchers = async () => {
        try {
            const {data} = await axios.get(`${API_BASE_URL}/vouchers`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                params: {userId, page: currentPage},
            });
            setVouchers(data.results);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${userId}/role`,
                {},
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                    params: {role: newRole},
                }
            );
            handleApiSuccess(response);
            fetchUsers();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleChangeStatus = async (userId, newStatus) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${userId}/status`,
                {},
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                    params: {accountStatus: newStatus},
                }
            );
            handleApiSuccess(response);
            fetchUsers();
        } catch (error) {
            handleApiError(error);
        }
    };

    const balanceTopUp = async () => {
        let userInput;
        let amount;

        do {
            userInput = prompt(t('cabinet.amount.input'));
            if (userInput === null) {
                return;
            }

            amount = parseFloat(userInput);
            if (isNaN(amount) || amount <= 0) {
                alert(t('cabinet.amount.invalid'));
            }
        } while (isNaN(amount) || amount <= 0);

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${localStorage.getItem('id')}/top_up`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    params: { amount: amount },
                }
            );
            handleApiSuccess(response);
            window.location.reload();
        } catch (error) {
            handleApiError(error);
        }
    };

    const renderCurrentUserInfo = () => (
        currentUser && (
            <div className="current-user-info">
                <h2>{t('cabinet.current_user')}</h2>
                <div>
                    <p>{t('cabinet.username')}: <span> {currentUser.username}</span></p>
                </div>
                <div>
                    <p>{t('cabinet.phone')}: <span>{currentUser.phoneNumber}</span></p>
                </div>
                <div className='balance-wrapper'>
                    <p>{t('cabinet.balance')}: <span>{currentUser.balance}</span></p>
                    {role === 'USER' && <button className='button' onClick={balanceTopUp}>Add money</button>}
                </div>
                <div>
                    <p>{t('cabinet.role')}: <span>{currentUser.role}</span></p>
                </div>
                <div>
                    <p>{t('cabinet.account_status')}: <span>{currentUser.accountStatus ? t('cabinet.active') : t('cabinet.disabled')}</span>
                    </p>
                </div>
            </div>
        )
    );

    const renderPagination = () => (
        <div className="voucher__pagination">
            <button className={'button'} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}>
                {t('cabinet.previous')}
            </button>
            <span>{t('cabinet.page')} {currentPage} {t('cabinet.of')} {totalPages}</span>
            <button className={'button'} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}>
                {t('cabinet.next')}
            </button>
        </div>
    );

    if (role === 'ADMIN') {
        return (
            <div className="container">
                <div className="cabinet-top">
                    {renderCurrentUserInfo()}
                    <button className="button danger"
                            onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
                </div>
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>{t('cabinet.username')}</th>
                        <th>{t('cabinet.phone')}</th>
                        <th>{t('cabinet.balance')}</th>
                        <th>{t('cabinet.role')}</th>
                        <th>{t('cabinet.account_status')}</th>
                        <th>{t('cabinet.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.balance}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="MANAGER">MANAGER</option>
                                </select>
                            </td>
                            <td>{user.accountStatus ? t('cabinet.active') : t('cabinet.disabled')}</td>
                            <td>
                                <button className="button"
                                        onClick={() => handleChangeStatus(user.id, !user.accountStatus)}>
                                    {t('cabinet.change_status')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {renderPagination()}
            </div>
        );
    }

    if (role === 'USER') {
        return (
            <section className="voucher">
                <div className="container">
                    <div className='cabinet-top'>
                        {renderCurrentUserInfo()}
                        <button className="button danger"
                                onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
                    </div>
                    <ul className="voucher__list">
                        {vouchers.map((voucher, idx) => (
                            <VoucherItem key={idx} {...voucher} />
                        ))}
                    </ul>
                    {renderPagination()}
                </div>
            </section>
        );
    }

    if (role === 'MANAGER') {
        return (
            <div className="container">
                <div className='cabinet-top'>
                    {renderCurrentUserInfo()}
                    <button className="button danger"
                            onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
                </div>
            </div>
        );
    }
    return null;
}
