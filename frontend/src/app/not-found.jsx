import React from 'react';
import '@/components/NotFound/not-found.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="page-404 mt-3">
        
        <h1 className="oops-title">Oops!</h1>

        {/* Subtítulo */}
        <p className="subtitle">Página não foi encontrada... :/</p>
    
        <img src="./img/404.png" className='img'/>

        {/* Botão Voltar para home */}
        <div className='voltar text-decoration-none'>
          <Link href={"/"} >
            <button
              className="home-button text-decoration-none"
            >
              VOLTAR PARA HOME
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
     
    </>
  );
}

