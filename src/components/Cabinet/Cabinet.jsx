import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './cabinet.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { VoucherItem } from '../Vouchers/VoucherItem.jsx';

export default function Cabinet() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [vouchers, setVouchers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const fetchCurrentUser = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCurrentUser(data.results[0]);
        } catch (err) {
            console.error(t('cabinet.error_fetching_user'), err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: { page: currentPage },
            });
            setUsers(data.results);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/vouchers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: { userId, page: currentPage },
            });
            setVouchers(data.results);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/users/${userId}/role`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    params: { role: newRole },
                }
            );
            alert(t('cabinet.role_changed'));
            fetchUsers();
        } catch (err) {
            console.error(t('cabinet.error_changing_role'), err);
            alert(t('cabinet.error_changing_role'));
        }
    };

    const handleChangeStatus = async (userId, newStatus) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/users/${userId}/status`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    params: { accountStatus: newStatus },
                }
            );
            alert(t('cabinet.status_changed'));
            fetchUsers();
        } catch (err) {
            console.error(t('cabinet.error_changing_status'), err);
            alert(t('cabinet.error_changing_status'));
        }
    };

    if (loading) return <p>{t('cabinet.loading')}</p>;
    if (error) return <p>{t('cabinet.error')}: {error}</p>;

    const renderCurrentUserInfo = () => (
        currentUser && (
            <div className="current-user-info">
                <h2>{t('cabinet.current_user')}</h2>
                <p>{t('cabinet.username')}: {currentUser.username}</p>
                <p>{t('cabinet.phone')}: {currentUser.phoneNumber}</p>
                <p>{t('cabinet.balance')}: {currentUser.balance}</p>
                <p>{t('cabinet.role')}: {currentUser.role}</p>
                <p>{t('cabinet.account_status')}: {currentUser.accountStatus ? 'true' : 'false'}</p>
            </div>
        )
    );

    const renderPagination = () => (
        <div className="voucher__pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                {t('cabinet.previous')}
            </button>
            <span>{t('cabinet.page')} {currentPage} {t('cabinet.of')} {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('cabinet.next')}
            </button>
        </div>
    );

    if (role === 'ADMIN') {
        return (
            <div className="container">
                {renderCurrentUserInfo()}
                <button className="button danger" onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
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
                            <td>{user.accountStatus ? 'true' : 'false'}</td>
                            <td>
                                <button className="button" onClick={() => handleChangeStatus(user.id, !user.accountStatus)}>
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
                    {renderCurrentUserInfo()}
                    <button className="button danger" onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
                    <h2>{t('cabinet.welcome')}, {localStorage.getItem('username')}</h2>
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
                <button className="button danger" onClick={() => navigate('/vouchers')}>{t('cabinet.back_to_vouchers')}</button>
                {renderCurrentUserInfo()}
            </div>
        );
    }

    return null;
}
