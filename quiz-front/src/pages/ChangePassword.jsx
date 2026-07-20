import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (password.length < 6) {
            return alert("A senha deve ter pelo menos 6 caracteres.");
        }

        if (password !== passwordConfirmation) {
            return alert("As senhas não conferem.");
        }

        setLoading(true);
        try {
            await api.post('/user/change-password', {
                password: password,
                password_confirmation: passwordConfirmation
            });

            alert("Senha atualizada com sucesso! Agora você tem acesso total.");
            
            const user = JSON.parse(localStorage.getItem('@QuizIgreja:user'));
            user.must_change_password = false;
            localStorage.setItem('@QuizIgreja:user', JSON.stringify(user));

            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'super_admin') {
                navigate('/super/dashboard');
            } else {
                navigate('/acolito/dashboard');
            }
        } catch {
            alert("Erro ao atualizar senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

   // Substitua o seu return por este exatamente:
return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between items-center" translate="no">
        <div className="flex-1 flex items-center justify-center p-4 w-full">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-200">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Segurança da Conta</h1>
                <p className="text-gray-500 mt-2 text-sm">Este é seu primeiro acesso. Por favor, defina uma senha definitiva.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Nova Senha</label>
                    <input 
                        type="password" 
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-slate-500 outline-none"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Confirmar Nova Senha</label>
                    <input 
                        type="password" 
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-slate-500 outline-none"
                        placeholder="••••••••"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 text-base flex items-center justify-center gap-2 ${
                        loading ? 'bg-slate-500 cursor-not-allowed opacity-85' : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                        </>
                    ) : 'Definir Senha e Entrar'}
                </button>
            </form>
            </div>
        </div>
        <Footer />
    </div>
);
}
