import React from 'react';
import '@/components/NotFound/not-found.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="page-404 d-flex flex-column row-gap-3 justify-content-center align-items-center">
        
        <h1 className="oops-title">Oops!</h1>
        <p className="subtitle m-0">Página não foi encontrada... :/</p>
    
        <img src="/img/404.png" className='img-modo-claro'/>
        <img src="/img/404-White.png" className='img-modo-escuro'/>

        <div className='voltar text-decoration-none mb-4'>
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

