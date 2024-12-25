import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import './cabinet.scss'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Cabinet() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const {t} = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users from the server
        axios.get(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(response => {
                setUsers(response.data.results);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleChangeRole = (userId) => {
        axios.post(`/users/${userId}/change-role`)
            .then(response => {
                alert(t('cabinet.role_changed'));
            })
            .catch(err => {
                console.error(err);
                alert(t('cabinet.error_changing_role'));
            });
    };

    const handleChangeStatus = (userId) => {
        axios.post(`/users/${userId}/change-status`)
            .then(response => {
                alert(t('cabinet.status_changed'));
            })
            .catch(err => {
                console.error(err);
                alert(t('cabinet.error_changing_status'));
            });
    };

    if (loading) return <p>{t('cabinet.loading')}</p>;
    if (error) return <p>{t('cabinet.error')}: {error}</p>;

    return (
        <div>
            <button type="button" onClick={() => navigate('/vouchers')}>Back to Vouchers</button>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.username')}
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.phone')}
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.balance')}
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.role')}
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.account_status')}
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4'}}>
                        {t('cabinet.actions')}
                    </th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} style={{border: '1px solid #ddd', padding: '8px'}}>
                        <td>{user.username}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.balance}</td>
                        <td>{user.role}</td>
                        <td>{user.accountStatus}</td>
                        <td>
                            <button onClick={() => handleChangeRole(user.id)}>{t('cabinet.change_role')}</button>
                            <button onClick={() => handleChangeStatus(user.id)}>{t('cabinet.change_status')}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
