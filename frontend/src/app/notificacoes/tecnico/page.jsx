"use client"

import "@/app/notificacoes/tecnico/notificacoes.css";
import SideBar from "@/components/sideBar/sidebar";
import { useState, useEffect } from "react";

import Chat_bot from "@/components/bot/ChatBot";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [visto, setVisto] = useState('');
  const [pool, setPool] = useState(null);
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
      })
  }, [])

  useEffect(() => {
    if (usuario.cargo) {
      if (usuario.cargo != 'tecnico') {
        window.location.href = '/'
      }
    }
  }, [usuario])

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes/area/${usuario.area}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar notificações');
          }
        })
        .then((data) => {
          setNotificacoes(data.notificacao);
        })
    }
  }, [usuario]);

  async function handleVer({ index, id_pool, id_servico }) {
    try {

      fetch(`http://localhost:8080/pool/${id_pool}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setPool(data.pool[0])
        })

      fetch(`http://localhost:8080/servicos`)
        .then(async (res) => {
          const data = await res.json();
          const achaServico = data.servicos.find(data => data.id === id_servico)
          console.log(achaServico)
          setServicos(achaServico.nome);
        });

      fetch(`http://localhost:8080/notificacoes/vista`, {
        method: 'POST',
        body: JSON.stringify({
          id: index,
          rm: usuario.rm,
          notificacao: index,
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
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes/vista/${usuario.rm}`)
        .then((response) => {
          if (response.ok) {
            return response.json();

          } else {
            window.location.href = '/'
          }
        })
        .then((data) => {
          setVisto(data);
        })
    }
  }, [usuario]);

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
      <div className="container-fluid d-flex d-flex flex-column flex-sm-row p-0 m-0 w-100 notificacoes">
        <SideBar />
        <div className="d-flex flex-row me-0 w-100">

          <div className="d-flex flex-column w-100 row-gap-3 main">
            <div className="d-flex flex-column p-4 w-100 w-md-75">
              <h4 className="mb-4">Notificações</h4>

              <div className="tabela-container w-100 m-0 p-3">
                <table className="tabela-tecnico bo w-100">
                  <thead>
                    <tr>
                      <th className="light-black col p-3">Título</th>
                      <th className="light-black col p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificacoes
                      ? (
                        <>
                          {notificacoes.map((item, index) => {
                            console.log(item)
                            return (
                              <tr key={item.id}>
                                <td data-th="titulo" className={handleVisto(item.id)}>{item.texto}</td>
                                <td data-th="ação" className="p-2">
                                  <button
                                    onClick={() => handleVer({ index: item.id, id_pool: item.id_pool, id_servico: usuario.area })}
                                    type="button"
                                    className="btn btn-vermais"
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop"
                                  >
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
                          <p>Nenhuma notificação encontrada</p>
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
          <div className="tudo-modal modal-content p-0">
            <div className="modal-header d-flex flex-row justify-content-between">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{pool ? pool.titulo : "Carregando..."}</h1>
              <button type="button" className="btn-fechar" data-bs-dismiss="modal" aria-label="Close" onClick={() => setPool(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="ver-mais modal-body">
              {pool ? (
                <>
                  <p><b>Numero de patrimonio:</b> {pool.patrimonio}</p>
                  <p><b>Descrição:</b> {pool.descricao}</p>
                  <p><b>Estado do chamado:</b> {pool.estado}</p>
                  {pool.outro ? (
                    <p><b>Tipo:</b> {pool.outro}</p>
                  ) : (
                    // Supondo que 'servicos' venha do mesmo objeto `pool`
                    <p><b>Tipo:</b> {servicos || 'Não especificado'}</p>
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
