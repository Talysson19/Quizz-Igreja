import React from 'react';

export default function Footer() {
    return (
        <footer className="py-6 text-center text-xs text-slate-400 border-t border-gray-100 bg-white w-full mt-auto" translate="no">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p>© 2026 Servir - Quiz Litúrgico. Todos os direitos reservados.</p>
                <p>
                    Desenvolvido por{' '}
                    <a 
                        href="https://ragetechlab.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-slate-500 hover:text-slate-700 transition-colors hover:underline"
                    >
                        Rage Tech
                    </a>
                </p>
            </div>
        </footer>
    );
}
