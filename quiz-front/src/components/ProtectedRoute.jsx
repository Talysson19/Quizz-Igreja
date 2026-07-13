import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('@QuizIgreja:token');
    const userString = localStorage.getItem('@QuizIgreja:user');

    if (!token || !userString) {
        return <Navigate to="/" />;
    }

    const user = JSON.parse(userString);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'super_admin') {
            return <Navigate to="/super/dashboard" />;
        } else if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        } else {
            return <Navigate to="/acolito/dashboard" />;
        }
    }

    return children;
};