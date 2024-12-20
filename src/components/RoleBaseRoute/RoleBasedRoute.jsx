import 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

RoleBasedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
};

export default RoleBasedRoute;
