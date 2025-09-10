"use client"

import Image from "next/image";
import Link from "next/link";
import SideBar from "@/components/sideBar/sidebar";
import Card_dashboard_usuario_table from "@/components/cards/card_usuario_tabela/card";
import Card_dashboard_usuario from "@/components/cards/card_dashboard_usuario/card";
import Card_dashboard_grafico from "@/components/cards/card_dashboard_grafico/card";
import '@/app/usuario/dashboard/styleUsuario.css';
import Chat_bot from "@/components/bot/ChatBot";
import "./styleUsuario.css";

import { useEffect, useState } from 'react';


export default function dashboardUsuario() {

  const [usuario, setUsuario] = useState([]);
  const [pools, setPools] = useState([]);
  const [numeroChamadas, setNumeroChamadas] = useState(0);
  const [contPendente, setContPendente] = useState(null)
  const [contEmAndamento, setContEmAndamento] = useState(null)
  const [contConcluido, setContConcluido] = useState(null)

  var cont_pendente = null
  var cont_emAndamento = null
  var cont_concluido = null

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
    fetch(`http://localhost:8080/pool/usuario/${usuario.rm}`, {
      credentials: 'include'
    })
      .then((response) => {

        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 404) {
            setPools([]);
            return [];
          }
          else {
            throw new Error('Erro ao buscar chamadas do usuário');
          }
        }
      })
      .then((data) => {
        data.map((item, index) => {
          if (item.estado == "pendente") {
            cont_pendente = cont_pendente + 1
          }
          else if (item.estado == "em andamento") {
            cont_emAndamento = cont_emAndamento + 1
          }
          else if (item.estado == "concluida") {
            cont_concluido = cont_concluido + 1
          }
          setContPendente(cont_pendente)
          setContEmAndamento(cont_emAndamento)
          setContConcluido(cont_concluido)

        })

        data.sort((a, b) => b.id - a.id)

        setPools(data)
        console.log(pools)

        setNumeroChamadas(data.length);
      })
  }, [usuario.rm])

  return (
    <>
      <div className={`container-fluid d-flex flex-column flex-sm-row p-0 m-0 dashboard-usuario`}>
        <SideBar nome={usuario.nome} cargo={usuario.cargo} />
        <div className="d-flex flex-row me-0 w-100 main-content">

          <div className="fundo-paginas d-flex flex-column flex-md-row w-100 justify-content-center p-md-4 p-2">
            <div className="d-flex flex-column row-gap-3 w-100 w-md-75">
              <div className="d-flex justify-content-between">
                <h4>Dashboard do Usuário</h4>
              </div>

              {/* GRID (CHART + USER CARD) */}
              <div className="dashboard-grid d-flex flex-wrap w-100">
                <div className="card-dashboard w-100">
                  <h5>Bem-vindo: {usuario.nome} ({usuario.cargo}) </h5>
                  <p>
                    Visualize o progresso das suas atividades em tempo real.
                  </p>
                </div>
              </div>

              {/* OVERVIEW */}
              <div className="overview">
                <div className="overview-card">
                  <h3>Total Chamadas Feitas</h3>
                  <span>{numeroChamadas}</span>
                </div>
                <div className="overview-card">
                  <h3>Suas Chamadas Pendentes</h3>
                  <span>{contPendente ? contPendente : 0}</span>
                </div>
                <div className="overview-card">
                  <h3>Suas Chamadas Em Andamento</h3>
                  <span>{contEmAndamento ? contEmAndamento : 0}</span>
                </div>
                <div className="overview-card">
                  <h3>Suas Chamadas Concluídas</h3>
                  <span>{contConcluido ? contConcluido : 0}</span>
                </div>
              </div>


              <div className="card-transition">
                <div className="pt-3 d-md-flex">
                  <Card_dashboard_grafico
                    numero_pendente={contPendente}
                    numero_emAndamento={contEmAndamento}
                    numero_concluida={contConcluido}
                  />
                </div>
              </div>


              {/* TABELA */}
              <div className="card-transition">
                <div className="table-card p-0 p-md-4">
                  <h4 className="dark-mode-table p-4 p-md-0">Últimas Chamadas</h4>
                  <table>
                    <thead className="table-dashboard">
                      <tr>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Criado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pools ? (
                        <>
                          {pools.map((item, index) => {
                            const data = new Date(item.criado_em);
                            const dia = String(data.getDate()).padStart(2, "0");
                            const mes = String(data.getMonth() + 1).padStart(2, "0");
                            const ano = data.getFullYear();

                            return (
                              <tr key={index}>
                                <td data-th="Título">{item.titulo}</td>
                                <td data-th="Descrição">{item.descricao}</td>
                                {item.estado == "pendente" ? (
                                  <td data-th="Estado">
                                    <span className="status status-pendente">
                                      {item.estado}
                                    </span>
                                  </td>
                                ) : (
                                  <></>
                                )}
                                {item.estado == "em andamento" ? (
                                  <td data-th="Status">
                                    <span className="status status-andamento">
                                      {item.estado}
                                    </span>
                                  </td>
                                ) : (
                                  <></>
                                )}
                                {item.estado == "concluida" ? (
                                  <td data-th="Status">
                                    <span className="status status-concluido">
                                      {item.estado}
                                    </span>
                                  </td>
                                ) : (
                                  <></>
                                )}
                                <td data-th="Criado em">{`${dia}/${mes}/${ano}`}</td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>
                              Não há chamados
                            </td>
                          </tr>

                        </>
                      )}

                    </tbody>
                  </table>
                  {pools.length === 0 && (
                    <p className="text-center mt-3 texto-muted">
                      Nenhum chamado encontrado.
                    </p>
                  )}
                </div>
              </div>
              <div className="">
                <Chat_bot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}