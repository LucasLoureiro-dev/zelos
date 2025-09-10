"use client"

import Image from "next/image";
import Link from "next/link";
import SideBar from "@/components/sideBar/sidebar";
import Card_dashboard_usuario_table from "@/components/cards/card_tecnico_tabela/card";
import Card_dashboard_usuario from "@/components/cards/card_dashboard_tecnico/card";
import Card_dashboard_grafico from "@/components/cards/card_dashboard_grafico/card";
import '@/app/tecnico/dashboard/styleTecnico.css';
import { useEffect, useState } from 'react';

export default function dashboardUsuario() {

    const [usuario, setUsuario] = useState([]);
    const [pools, setPools] = useState([]);
    const [numeroChamadas, setNumeroChamadas] = useState('');
    const [area, setArea] = useState('');
    const [visualizarChamado, setVisualizarChamado] = useState('');

    const [pendente, setPendente] = useState(0);
    const [andamento, setAndamento] = useState(0);
    const [concluido, setConcluido] = useState(0);

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
        fetch(`http://localhost:8080/servicos`)
            .then(async (res) => {
                const data = await res.json();
                setArea(data.servicos);
            })
    }, [])

    useEffect(() => {
        if (usuario) {
            fetch(`http://localhost:8080/pool/tipo/${usuario.area}`, {
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
                    if (data) {

                        const sortedData = [...data].sort((a, b) => {

                            const dateA = new Date(a.criado_em);
                            const dateB = new Date(b.criado_em);

                            return dateB.getTime() - dateA.getTime();
                        });
                        setPools(sortedData);
                        setNumeroChamadas(data.length);
                    }
                    else {
                        setPools('');
                    }
                })
        }
    }, [usuario]);

    useEffect(() => {
        if (pools) {
            let pendente_contador = 0, andamento_contador = 0, concluido_contador = 0
            pools.forEach(pool => {
                if (pool.estado == "pendente") {
                    pendente_contador++
                }
                else if (pool.estado == "em andamento") {
                    andamento_contador++
                }
                else if (pool.estado == "concluida") {
                    concluido_contador++
                }
            });
            setPendente(pendente_contador)
            setAndamento(andamento_contador)
            setConcluido(concluido_contador)
        }
    }, [pools])

    // useEffect(() => {
    //     if (pools) {
    //         setAndamento(pools.filter((pool) => pool.estado == 'em andamento'))
    //     }
    // }, [pools]);

    function handleData(data) {

        let convertido = new Date(data)

        const day = convertido.getDate().toString().padStart(2, '0');
        const month = (convertido.getMonth() + 1).toString().padStart(2, '0');
        const year = convertido.getFullYear();

        const formatted = `${day}/${month}/${year}`;
        return (
            <>
                {formatted}
            </>
        )


    }


    async function handleClick(chamado) {
        fetch(`http://localhost:8080/notificacoes`, {
            method: 'POST',
            body: JSON.stringify({
                rm: usuario.rm,
                texto: `O técnico ${uuario.rm} se atribiu ao chamado do patrimônio ${chamado.patrimonio}`,
                area: chamado.tipo,
                cargo: 'tecnico',
                id_pool: chamado.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        fetch(`http://localhost:8080/pool/${chamado.id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                tipo: chamado.tipo,
                patrimonio: chamado.patrimonio,
                outro: chamado.outro,
                estado: 'em andamento',
                criado_em: chamado.criado_em,
                criado_por: chamado.criado_por
            })
        })

        fetch(`http://localhost:8080/chamadas`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                chamado: chamado.id,
                tecnico: usuario.rm,
                usuario: chamado.criado_por
            })
        })
            .then((feito) => {
                return feito.json()
            })
            .then((res) => {
                fetch(`http://localhost:8080/acompanhamentos`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        chamado_id: res.dataId
                    })
                })
            })
            .then(window.location.href = '/tecnico/dashboard')


    }

    return (
        <>

            <div className="container-fluid dashboard-tecnico d-flex p-0 m-0 ">
                <SideBar nome={usuario.nome} cargo={usuario.cargo} />
                <div className="d-flex flex-row me-0 w-100">

                    {/* MAIN */}
                    <div className="fundo-paginas d-flex flex-column flex-md-row w-100 main-content justify-content-center p-md-4 p-2">
                        <div className="d-flex flex-column row-gap-3 w-100 w-md-75">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Dashboard Técnico</h4>
                            </div>

                            {/* GRID (CHART + USER CARD) */}
                            <div className="dashboard-grid w-100">
                                <div className="card-dashboard">
                                    <h5>Bem-vindo: <span className="fw-bold">{usuario.nome}</span> ({usuario.cargo})</h5>
                                    <p>Acompanhe em tempo real o sistema para assegurar uma funcionamento eficaz.</p>
                                </div>
                            </div>

                            {/* OVERVIEW */}
                            <div className="overview">
                                <div className="overview-card">
                                    <h3>Total de Chamadas</h3>
                                    <span>{numeroChamadas}</span>
                                </div>
                                <div className="overview-card">
                                    <h3>Chamadas Pendentes</h3>
                                    <span>{pendente}</span>
                                </div>
                                <div className="overview-card">
                                    <h3>Chamadas Em Andamento</h3>
                                    <span>{andamento}</span>
                                </div>
                                <div className="overview-card">
                                    <h3>Chamadas Concluídas</h3>
                                    <span>{concluido}</span>
                                </div>
                            </div>


                            {/* TABELA */}
                            <div className="card-transition">
                                <div className="table-card">
                                    <h3>Últimas Chamadas</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th data-th="Título">Título</th>
                                                <th data-th="Descrição">Descrição</th>
                                                <th data-th="Status">Status</th>
                                                <th data-th="Criado em">Criado em</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pools
                                                ? (
                                                    <>
                                                        {pools.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td data-th="Título">{item.titulo}</td>
                                                                    <td data-th="Descrição">{item.descricao}</td>
                                                                    {item.estado == 'pendente'
                                                                        ? (
                                                                            <td data-th="Status"><span className='status status-pendente'>{item.estado}</span></td>
                                                                        ) : (
                                                                            <>
                                                                            </>
                                                                        )}
                                                                    {item.estado == 'em andamento'
                                                                        ? (
                                                                            <td data-th="Status"><span className="status status-andamento">{item.estado}</span></td>
                                                                        ) : (
                                                                            <>
                                                                            </>
                                                                        )}
                                                                    {item.estado == 'concluida'
                                                                        ? (
                                                                            <td data-th="Status"><span className="status status-concluido">{item.estado}</span></td>
                                                                        ) : (
                                                                            <>
                                                                            </>
                                                                        )}
                                                                    <td data-th="Criado em">{handleData(item.criado_em)}</td>

                                                                    {/* Ícone de olho (visualizar) */}
                                                                    <td data-th="Visualizar">
                                                                        <i
                                                                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                                            className="bi bi-eye acao-icon"
                                                                            onClick={() => setVisualizarChamado(item)}
                                                                        ></i>
                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}
                                                    </>
                                                )
                                                : (
                                                    <></>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/*  Modal*/}
                    <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content custom-modal p-0">
                                <div className="modal-header d-flex flex-row justify-content-between">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        {visualizarChamado.titulo}
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-fechar border-0"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {visualizarChamado.estado === "pendente" && (
                                        <p className="modal-description">
                                            Este chamado está disponível para atribuição. Clique no botão abaixo para se atribuir.
                                        </p>
                                    )}
                                    {visualizarChamado.estado === "em andamento" && (
                                        <p className="modal-description">
                                            Este chamado não está disponível para atribuição, pois um técnico já está providenciando este pedido.
                                        </p>
                                    )}
                                    {visualizarChamado.estado === "concluida" && (
                                        <p className="modal-description">
                                            Este chamado já está concluído.
                                        </p>
                                    )}
                                </div>
                                <div className="modal-footer border-0">
                                    {visualizarChamado.estado === "pendente" && (
                                        <button
                                            type="button"
                                            onClick={() => handleClick(visualizarChamado)}
                                            className="btn btn-atribuir"
                                        >
                                            Se atribuir
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}