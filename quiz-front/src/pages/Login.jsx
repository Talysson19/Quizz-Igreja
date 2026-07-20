import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import logoImg from '../logo-igreja.png';
import Footer from '../components/Footer';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            
            const { access_token, name, role, must_change_password, message } = response.data;

            localStorage.setItem('@QuizIgreja:token', access_token);

            const userData = {
                name: name,
                email: email,
                role: role,
                must_change_password: must_change_password
            };
            localStorage.setItem('@QuizIgreja:user', JSON.stringify(userData));

            alert(message || "Login realizado com sucesso!");

            // Lógica de Redirecionamento Corrigida
            if (role === 'super_admin') {
                navigate('/super/dashboard');
            } else if (role === 'admin') {
                if (must_change_password) {
                    navigate('/change-password');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                if (must_change_password) {
                    navigate('/change-password');
                } else {
                    navigate('/acolito/dashboard');
                }
            }

        } catch (err) {
            console.error("Erro detalhado:", err.response?.data);
            alert('Falha no login. Verifique se o e-mail e senha estão corretos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between items-center" translate="no">
            {/* Espaçador para centralizar o card verticalmente */}
            <div className="flex-1 flex items-center justify-center p-4 w-full">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                    
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain mb-3" />
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Servir</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Quiz Litúrgico</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider italic">
                                E-mail de Acesso
                            </label>
                            <input 
                                type="email" 
                                required
                                className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-slate-500 focus:bg-white focus:outline-none transition-all shadow-sm"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider italic">
                                Senha
                            </label>
                            <input 
                                type="password" 
                                required
                                className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-slate-500 focus:bg-white focus:outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 ${
                                loading ? 'bg-slate-500 cursor-not-allowed opacity-85' : 'bg-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </>
                            ) : 'Entrar no Portal'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}