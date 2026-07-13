import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminAcolitos from './pages/AdminAcolitos';
import ChangePassword from './pages/ChangePassword';
import SuperDashboard from './pages/SuperDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminPerguntas from './pages/AdminPerguntas';
import AdminConfig from './pages/AdminConfig';
import AcolitoDashboard from './pages/AcolitoDashboard';
import AcolitoQuiz from './pages/AcolitoQuiz';
import AcolitoRanking from './pages/AcolitoRanking';
import AdminRanking from './pages/AdminRanking';
import AdminDetalhamentoAcolito from './pages/AdminDetalhamentoAcolito'; // ADICIONADO

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Login />} />

                
                {/* Rota de Troca de Senha (Protegida) */}
                <Route 
                    path="/change-password" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'acolyte']}>
                            <ChangePassword />
                        </ProtectedRoute>
                    } 
                />

                {/* Rotas do Administrador (Protegidas) */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/acolitos" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminAcolitos />
                        </ProtectedRoute>
                    } 
                />
                {/* ROTA DE DETALHAMENTO ADICIONADA AQUI */}
                <Route 
                    path="/admin/acolitos/:id/progress" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDetalhamentoAcolito />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/perguntas" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPerguntas />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/config" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminConfig />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/ranking" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                             <AdminRanking />
                        </ProtectedRoute>
                    } 
                />

                {/* Rotas do Administrador Geral (Protegidas) */}
                <Route 
                    path="/super/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['super_admin']}>
                            <SuperDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Rotas do Acólito (Protegidas) */}
                <Route 
                    path="/acolito/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['acolyte']}>
                            <AcolitoDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/acolito/quiz/:level" 
                    element={
                        <ProtectedRoute allowedRoles={['acolyte']}>
                            <AcolitoQuiz />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/acolito/ranking" 
                    element={
                        <ProtectedRoute allowedRoles={['acolyte']}>
                            <AcolitoRanking />
                        </ProtectedRoute>
                    } 
                />



                {/* Fallback para evitar 404 - Sempre no final */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
