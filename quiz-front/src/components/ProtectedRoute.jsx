import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('@QuizIgreja:token');

    // Se não tiver token, manda de volta para o login
    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};