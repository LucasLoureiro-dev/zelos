"use client"

import "@/app/notificacoes/usuario/notificacoes.css";
import SideBar from "@/components/sideBar/sidebar";
import { useState, useEffect } from "react";

import Chat_bot from "@/components/bot/ChatBot";

export default function Notificacoes(nome, cargo) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [pool, setPool] = useState('')
  const [servicos, setServicos] = useState('');
  const [visto, setVisto] = useState('');


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
    if (usuario.cargo) {
      if (usuario.cargo != 'comum') {
        window.location.href = '/'
      }
    }
  }, [usuario])

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes/rm/${usuario.rm}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar notificações');
          }
        })
        .then((data) => {
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
          const achaServiso = data.servicos.find(data => data.id === id_servico)
          setServicos(achaServiso.nome);
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
  const data = new Date(pool.criado_em);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();


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
        <SideBar nome={usuario.nome} cargo={usuario.cargo} />
        <div className="d-flex flex-row me-0 w-100 main">

          <div className="fundo-paginas d-flex flex-column w-100 row-gap-3" style={{ height: "100%" }}>
            <div className="d-flex flex-column p-4 w-100 w-md-75">
              <h4 className="mb-4">Notificações</h4>
              <div className="tabela-container p-3">
                <Chat_bot />
                <table className="tabela-usuarios w-100 rounded-3 ">
                  <thead className="rounded border-bottom">
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
                            { console.log(item) }
                            return (
                              <tr key={index} className="p-5">
                                <td data-th="titulo" className={handleVisto(item.id)}>{item.texto}</td>
                                <td data-th="ação" className="conteudo p-2 ">
                                  <button onClick={() => handleVer({ index: item.id, id_pool: item.id_pool, id_servico: item.area })} type="button" className="btn btn-vermais" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
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
      </div>
      <div className="ver-detalhes modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="tudo-modal modal-content">
            {pool ? (
              <>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">{pool.titulo}</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="ver-mais modal-body">
                  {pool ? (
                    <>
                      <p><b>Numero de patrimonio:</b>  {pool.patrimonio} </p>
                      <p><b>Descrição:</b> {pool.descricao} </p>
                      <p><b>Status do chamado:</b>  {pool.estado} </p>
                      <p><b>Criado em:</b>  {`${dia}/${mes}/${ano}`} </p>
                      {pool.outro ? (
                        <>
                          <p> <b>Tipo:</b> {pool.outro} </p>
                        </>
                      ) : (
                        <>
                          <p> <b>Tipo:</b> {servicos} </p>
                        </>
                      )}
                    </>
                  ) : (
                    <>

                    </>
                  )}

                </div>
              </>
            ) : (
              <>
                Carregando...
              </>
            )
            }
          </div>

        </div>

      </div>

    </>
  );
}
