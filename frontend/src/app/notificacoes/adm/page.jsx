"use client"

import "@/app/notificacoes/adm/notificacoes.css";
import SideBar from "@/components/sideBar/sidebar";
import { useState, useEffect } from "react";
import Chat_bot from "@/components/bot/ChatBot";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [visto, setVisto] = useState('')
  const [pool, setPool] = useState('')
  const [servicos, setServicos] = useState("")


  useEffect(() => {
    fetch('http://localhost:8080/dashboard', {
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();

        } else {
          window.location.href = '/'
        }
      })
      .then((data) => {
        setUsuario(data);
      });
  }, [])

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar notificações');
          }
        })
        .then((data) => {
          console.log(data)
          setNotificacoes(data);
        })
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes/vista/${usuario.rm}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar notificações');
          }
        })
        .then((data) => {
          setVisto(data);
        })
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario.cargo) {
      if (usuario.cargo != 'adm') {
        window.location.href = '/'
      }
    }
  }, [usuario])

  async function handleVer(pool) {
    try {
      fetch(`http://localhost:8080/pool/${pool.id_pool}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setPool(data.pool[0])
        })
        console.log(pool)

      fetch(`http://localhost:8080/servicos`)
        .then(async (res) => {
          const data = await res.json();
          const achaServico = data.servicos.find(data => data.id === pool.area)
          console.log(achaServico)
          setServicos(achaServico.nome);
        });

      fetch(`http://localhost:8080/notificacoes/vista`, {
        method: 'POST',
        body: JSON.stringify({
          id: pool.id,
          rm: usuario.rm,
          notificacao: pool.id,
          cargo: 'comum'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

    }
    catch (error) {
      console.log(error)
    }
  }


  function handleVisto(id) {
    let achou
    if (visto) {
      achou = visto.find((item) => item.notificacao == id)
    }

    if (achou) {
      return "tabela-tecnico"
    }
    else {
      return "tabela-tecnico-visto"
    }
  }



  return (
    <>
      <div className="container-fluid d-flex d-flex flex-column flex-sm-row p-0 m-0 notificacoes">
        <SideBar />
        <div className="d-flex flex-row me-0 w-100 main">

          <div className="fundo-paginas d-flex flex-column w-100 row-gap-3">
            <div className="d-flex flex-column p-4 w-100 w-md-75">
              <h4 className="mb-4">Notificações</h4>
              <div className="tabela-container w-100 m-0 p-3">
                <table className="tabela-adm w-100 ">
                  <thead>
                    <tr className="p-3">
                      <th className="col p-3">Título</th>
                      <th className="col p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificacoes
                      ? (
                        <>
                          {notificacoes.map((item, index) => {
                            return (
                              <tr key={index} className="p-5">
                                <td data-th="titulo" className={handleVisto(item.id)}>{item.texto}</td>
                                <td data-th="ação" className="p-2">
                                  <button onClick={() => handleVer(item)} type="button" className="btn btn-vermais" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
                                    Ver mais
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </>
                      )
                      : (
                        <>
                          <h1>Está tão vazio aqui</h1>
                        </>
                      )}
                  </tbody>
                </table>
              </div>
            </div>


          </div>

        </div>


        <Chat_bot />
      </div>
      <div className="ver-detalhes modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="tudo-modal modal-content">
            <div className="modal-header d-flex flex-row justify-content-between">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{pool ? pool.titulo : "Carregando..."}</h1>
              <button type="button" className="btn-fechar" data-bs-dismiss="modal" onClick={() => setPool(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className=" modal-body">
              {pool ? (
                <>
                  <p><b>Numero de patrimonio:</b> {pool.patrimonio}</p>
                  <p><b>Descrição:</b> {pool.descricao}</p>
                  <p><b>Estado do chamado:</b> {pool.estado}</p>
                  {pool.outro ? (
                    <p><b>Tipo:</b> {pool.outro}</p>
                  ) : (
                    // Supondo que 'servicos' venha do mesmo objeto `pool`
                    <p><b>Tipo:</b> {servicos}</p>
                  )}
                </>
              ) : (
                <p>Carregando detalhes...</p>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
