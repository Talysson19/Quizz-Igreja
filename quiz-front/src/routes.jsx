import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminAcolitos from './pages/AdminAcolitos';
import ChangePassword from './pages/ChangePassword';
import RegisterChurch from './pages/RegisterChurch';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminPerguntas from './pages/AdminPerguntas';
import AdminConfig from './pages/AdminConfig';
import AcolitoDashboard from './pages/AcolitoDashboard';
import AcolitoQuiz from './pages/AcolitoQuiz';
import AcolitoRanking from './pages/AcolitoRanking';
import AdminRanking from './pages/AdminRanking';
import AdminDetalhamentoAcolito from './pages/AdminDetalhamentoAcolito'; // ADICIONADO
import AcolitoManuais from './pages/AcolitoManuais';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/register-church" element={<RegisterChurch />} />
                
                {/* Rota de Troca de Senha (Protegida) */}
                <Route 
                    path="/change-password" 
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    } 
                />

                {/* Rotas do Administrador (Protegidas) */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/acolitos" 
                    element={
                        <ProtectedRoute>
                            <AdminAcolitos />
                        </ProtectedRoute>
                    } 
                />
                {/* ROTA DE DETALHAMENTO ADICIONADA AQUI */}
                <Route 
                    path="/admin/acolitos/:id/progress" 
                    element={
                        <ProtectedRoute>
                            <AdminDetalhamentoAcolito />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/perguntas" 
                    element={
                        <ProtectedRoute>
                            <AdminPerguntas />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/config" 
                    element={
                        <ProtectedRoute>
                            <AdminConfig />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/ranking" 
                    element={
                        <ProtectedRoute>
                             <AdminRanking />
                        </ProtectedRoute>
                    } 
                />

                {/* Rotas do Acólito (Protegidas) */}
                <Route 
                    path="/acolito/dashboard" 
                    element={
                        <ProtectedRoute>
                            <AcolitoDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/acolito/quiz/:level" 
                    element={
                        <ProtectedRoute>
                            <AcolitoQuiz />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/acolito/ranking" 
                    element={
                        <ProtectedRoute>
                            <AcolitoRanking />
                        </ProtectedRoute>
                    } 
                />

                <Route path="/acolito/manuais" element={<AcolitoManuais />} />

                {/* Fallback para evitar 404 - Sempre no final */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}