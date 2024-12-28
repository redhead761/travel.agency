import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import './cabinet.scss';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {VoucherItem} from '../Vouchers/VoucherItem.jsx';

export default function Cabinet() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const {t} = useTranslation();
    const [vouchers, setVouchers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('id');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (role === 'ADMIN') {
            fetchUsers();
            fetchCurrentUser();
        } else if (role === 'USER') {
            fetchVouchers();
            fetchCurrentUser();
        }
    }, [role, currentPage]);

    const fetchCurrentUser = () => {
        axios
            .get(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                setCurrentUser(response.data.results[0]); // Сохраняем данные текущего пользователя
            })
            .catch(err => console.error('Ошибка загрузки данных текущего пользователя:', err));
    };

    const fetchUsers = () => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {page: currentPage}
            })
            .then(response => {
                setUsers(response.data.results);
                setTotalPages(response.data.totalPages || 1);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const fetchVouchers = () => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/vouchers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {userId, page: currentPage}
            })
            .then(response => {
                setVouchers(response.data.results);
                setTotalPages(response.data.totalPages || 1);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleChangeRole = (userId, newRole) => {
        axios
            .patch(
                `${API_BASE_URL}/users/${userId}/role`, // URL запроса
                {}, // Пустое тело запроса
                {
                    headers: { // Заголовки запроса
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    params: { // Параметры строки запроса
                        role: newRole
                    }
                }
            )
            .then(() => {
                alert(t('cabinet.role_changed'));
                fetchUsers(); // Обновление списка пользователей
            })
            .catch(err => {
                console.error(err);
                alert(t('cabinet.error_changing_role'));
            });
    };

    const handleChangeStatus = (userId, newStatus) => {
        axios
            .patch(
                `${API_BASE_URL}/users/${userId}/status?accountStatus=${newStatus}`,
                {accountStatus: newStatus},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            .then(() => {
                alert(t('cabinet.status_changed'));
                fetchUsers(); // Обновляем список пользователей
            })
            .catch(err => {
                console.error(err);
                alert(t('cabinet.error_changing_status'));
            });
    };

    if (loading) return <p>{t('cabinet.loading')}</p>;
    if (error) return <p>{t('cabinet.error')}: {error}</p>;

    if (role === 'ADMIN') {
        return (
            <div className="container">

                {currentUser && (
                    <div className="current-user-info">
                        <h2>{t('cabinet.current_user')}</h2>
                        <p>{t('cabinet.username')}: {currentUser.username}</p>
                        <p>{t('cabinet.phone')}: {currentUser.phoneNumber}</p>
                        <p>{t('cabinet.balance')}: {currentUser.balance}</p>
                        <p>{t('cabinet.role')}: {currentUser.role}</p>
                        <p>{t('cabinet.account_status')}: {currentUser.accountStatus ? 'true' : 'false'}</p>
                    </div>
                )}

                <button className="button danger" onClick={() => navigate('/vouchers')}>Back to Vouchers</button>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
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
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.balance}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={e => handleChangeRole(user.id, e.target.value)}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="MANAGER">MANAGER</option>
                                </select>
                            </td>
                            <td>{user.accountStatus ? 'true' : 'false'}</td>
                            <td className={'table-actions'}>
                                <button className={'button'} onClick={() => handleChangeStatus(user.id, !user.accountStatus)}>
                                    {t('cabinet.change_status')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="voucher__pagination">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        );
    }

    if (role === 'USER') {
        return (
            <section className="voucher">
                <div className="container">

                    {currentUser && (
                        <div className="current-user-info">
                            <h2>{t('cabinet.current_user')}</h2>
                            <p>{t('cabinet.username')}: {currentUser.username}</p>
                            <p>{t('cabinet.phone')}: {currentUser.phoneNumber}</p>
                            <p>{t('cabinet.balance')}: {currentUser.balance}</p>
                            <p>{t('cabinet.role')}: {currentUser.role}</p>
                            <p>{t('cabinet.account_status')}: {currentUser.accountStatus ? 'true' : 'false'}</p>
                        </div>
                    )}

                    <h2>{t('cabinet.welcome')}, {localStorage.getItem('username')}</h2>
                    <ul className="voucher__list">
                        {vouchers.map((voucher, idx) => (
                            <VoucherItem key={idx} {...voucher} />
                        ))}
                    </ul>
                    <div className="voucher__pagination">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
