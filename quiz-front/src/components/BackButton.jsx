import { useNavigate } from 'react-router-dom';

export function BackButton({ to = -1, text = "Voltar" }) {
    const navigate = useNavigate();
    
    return (
        <button 
            onClick={() => navigate(to)}
            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-4 transition-all"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold text-sm">{text}</span>
        </button>
    );
}