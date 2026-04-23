import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

            navigate('/dashboard');
        } catch (err) {
            alert("Erro ao atualizar senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

   // Substitua o seu return por este exatamente:
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" translate="no">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-purple-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Segurança da Conta</h1>
                <p className="text-gray-500 mt-2 text-sm">Este é seu primeiro acesso. Por favor, defina uma senha definitiva.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Nova Senha</label>
                    <input 
                        type="password" 
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none"
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
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none"
                        placeholder="••••••••"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg disabled:bg-gray-400 active:scale-95 text-base"
                >
                    {loading ? 'Salvando...' : 'Definir Senha e Entrar'}
                </button>
            </form>
        </div>
    </div>
);
}