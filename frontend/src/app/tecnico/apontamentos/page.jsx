"use client";

import "@/app/tecnico/apontamentos/apontamentos.css";
import SideBar from "@/components/sideBar/sidebar";
import { Poppins } from "next/font/google";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState, useEffect } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export default function Chamadas() {
  const tableRef = useRef(null);

  const [editarChamado, setEditarChamado] = useState(null);
  const [visualizarChamado, setVisualizarChamado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [chamadas, setChamadas] = useState('');
  const [usuario, setUsuario] = useState('');
  const [pools, setPools] = useState('');
  const [apontamentos, setApontamentos] = useState('');
  const [historico, setHistorico] = useState('');
  const [duracao, setDuracao] = useState('');
  const [inicio, setInicio] = useState('');
  const [autor, setAutor] = useState('');
  const [apontamento, setApontamento] = useState('');

  // use ffect de dashboard e pools adicinionado

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
    if (usuario.area) {
      fetch(`http://localhost:8080/chamadas/tecnico/${usuario.rm}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.length > 0) {
            setChamadas(data);
          }
          else {
            setChamadas('');
          }
        })
    }
  }, [usuario])

  useEffect(() => {
    if (chamadas.length > 0) {
      const poolPromises = chamadas.map((chamada) =>
        fetch(`http://localhost:8080/pool/${chamada.chamado}`)
          .then((response) => response.json())
          .then((data) => data.pool)
          .catch((error) => {
            console.error(
              `Erro ao buscar pool para o chamado ${chamada.chamado}:`,
              error
            );
            return null;
          })
      )
      Promise.all(poolPromises).then((results) => {
        const allPools = results.flat().filter(pool => pool !== null);
        setPools(allPools);
      });
    }
  }, [chamadas]);

  useEffect(() => {
    if (chamadas) {
      fetch(`http://localhost:8080/acompanhamentos`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data)
          if (data.acompanhamentos.length > 0) {
            setApontamentos(data.acompanhamentos);
          }
          else {
            setApontamentos('');
          }
        })
    }
  }, [chamadas])


  const salvarEdicao = (id) => {
    fetch(`http://localhost:8080/notificacoes`, {
      method: 'POST',
      body: JSON.stringify({
        rm: usuario.rm,
        texto: `Comentário adicionado no aponatmento: ${apontamento.id}`,
        area: '',
        cargo: 'tecnico',
        id_pool: apontamento.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    fetch(`http://localhost:8080/acompanhamentos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        chamado_id: apontamento.chamado_id,
        comentario: comentario,
        comeco: apontamento.comeco,
        fim: apontamento.fim
      }),
    })
      .then(window.location.href = '/tecnico/apontamentos')

    setEditarChamado(null);
    setComentario("");
    setStatusSelecionado("");
  };

  function handleHistorico(id) {

    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null
    if (apontamento) {
      const convertido = new Date(apontamento.comeco);

      const agora = new Date();

      const diffMS = agora.getTime() - convertido.getTime();

      if (diffMS <= 86400000) {
        return (
          <>
            Criado hoje
          </>
        )
      }
      else if (diffMS <= 172800000) {
        return (
          <>
            Criado Ontem
          </>
        )
      }
      else {
        const dias = Math.floor(diffMS / 86400000)
        return (
          <>
            Criado {dias} dias atrás
          </>
        )
      }
    }

  }

  function handleFim(estado, id) {

    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null

    if (apontamento) {
      if (estado != 'concluida') {
        let convertido = new Date(apontamento.comeco)

        const day = convertido.getDate().toString().padStart(2, '0');
        const month = (convertido.getMonth() + 1).toString().padStart(2, '0');
        const year = convertido.getFullYear();

        const formatted = `${day}/${month}/${year}`;
        return (
          <>
            {formatted} - Não concluido
          </>
        )
      }
      else {

        let convertido = new Date(apontamento.comeco)

        const day = convertido.getDate().toString().padStart(2, '0');
        const month = (convertido.getMonth() + 1).toString().padStart(2, '0');
        const year = convertido.getFullYear();

        const formatted = `${day}/${month}/${year}`;

        let convertido_fim = new Date(apontamento.comeco)

        const day_fim = convertido_fim.getDate().toString().padStart(2, '0');
        const month_fim = (convertido_fim.getMonth() + 1).toString().padStart(2, '0');
        const year_fim = convertido_fim.getFullYear();

        const formatted_fim = `${day_fim}/${month_fim}/${year_fim}`;
        return (
          <>
            {formatted} - {formatted_fim}
          </>
        )
      }
    }
  }

  function handleDuracao(estado, id) {

    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null

    if (apontamento) {
      const inicio = new Date(apontamento.comeco);

      if (estado != 'concluida') {
        const agora = new Date();

        const diffMs = agora - inicio;

        const ms_em_hora = 1000 * 60 * 60;
        const ms_em_dia = ms_em_hora * 24;

        const dias = Math.floor(diffMs / ms_em_dia);
        const horas = Math.floor((diffMs % ms_em_dia) / ms_em_hora) + 3;

        return (
          <>
            {dias > 0 ?
              (<>
                {dias} Dia(s) {horas} Hora(s)
              </>)
              : (<>
                {horas} Hora(s)
              </>)}
          </>
        )
      }
      else {
        const fim = new Date(apontamento.fim);

        const diffMs = fim - inicio;

        const ms_em_hora = 1000 * 60 * 60;
        const ms_em_dia = ms_em_hora * 24;

        const dias = Math.floor(diffMs / ms_em_dia);
        const horas = Math.floor((diffMs % ms_em_dia) / ms_em_hora);

        return (
          <>
            {dias > 0 ?
              (<>
                {dias} Dia(s) {horas} Hora(s)
              </>)
              : (<>
                {horas} Hora(s)
              </>)}
          </>
        )
      }
    }
  }

  function handleComentario(id) {
    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null

    if (apontamento) {
      if (apontamento.comentario) {
        const comentario = apontamento.comentario
        return (
          <>
            {comentario}
          </>
        )
      }
      else {
        return (
          <>
            ---
          </>
        )
      }
    }
  }

  const handle_comentario = (id) => {
    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null

    if (apontamento) {
      if (apontamento.comentario) {
        const comentario = apontamento.comentario
        setComentario(comentario)
      }
      else {
        setComentario('')
      }
    }
  }

  function handleEditar(estado, id) {

    const chamada = chamadas.find(chamada => chamada.chamado == id)

    const apontamento = Array.isArray(apontamentos)
      ? apontamentos.find(apontamento => apontamento.chamado_id == chamada.id)
      : null
    if (apontamento) {
      setApontamento(apontamento)
      const convertido = new Date(apontamento.comeco);

      const agora = new Date();

      const diffMS = agora.getTime() - convertido.getTime();

      if (diffMS <= 86400000) {
        setHistorico(`Criado hoje`)
      }
      else if (diffMS <= 172800000) {
        setHistorico(`Criado ontem`)
      }
      else {
        const dias = Math.floor(diffMS / 86400000)
        setHistorico(`Criado ${dias} atrás`)
      }

      if (estado != 'concluida') {
        const day = convertido.getDate().toString().padStart(2, '0');
        const month = (convertido.getMonth() + 1).toString().padStart(2, '0');
        const year = convertido.getFullYear();

        const formatted = `${day}/${month}/${year}`;
        setInicio(`${formatted} - Não concluido`)
      }
      else {
        const day = convertido.getDate().toString().padStart(2, '0');
        const month = (convertido.getMonth() + 1).toString().padStart(2, '0');
        const year = convertido.getFullYear();

        const formatted = `${day}/${month}/${year}`;

        let convertido_fim = new Date(apontamento.comeco)

        const day_fim = convertido_fim.getDate().toString().padStart(2, '0');
        const month_fim = (convertido_fim.getMonth() + 1).toString().padStart(2, '0');
        const year_fim = convertido_fim.getFullYear();

        const formatted_fim = `${day_fim}/${month_fim}/${year_fim}`;
        setInicio(`${formatted} - ${formatted_fim}`)
      }

      if (estado != 'concluida') {
        const agora = new Date();

        const diffMs = agora - convertido;

        const ms_em_hora = 1000 * 60 * 60;
        const ms_em_dia = ms_em_hora * 24;

        const dias = Math.floor(diffMs / ms_em_dia);
        const horas = Math.floor((diffMs % ms_em_dia) / ms_em_hora) + 3;

        if (dias > 0) {
          setDuracao(`${dias} dia(s) ${horas} hora(s)`)
        }
        else {
          setDuracao(`${horas} hora(s)`)
        }
      }
      else {
        const fim = new Date(apontamento.fim);

        const diffMs = fim - convertido;

        const ms_em_hora = 1000 * 60 * 60;
        const ms_em_dia = ms_em_hora * 24;

        const dias = Math.floor(diffMs / ms_em_dia);
        const horas = Math.floor((diffMs % ms_em_dia) / ms_em_hora);

        if (dias > 0) {
          setDuracao(`${dias} dia(s) ${horas} hora(s)`)
        }
        else {
          setDuracao(`${horas} hora(s)`)
        }
      }
    }
  }

  return (
    <div className="acompanhamentos-tudo d-flex flex-column flex-sm-row p-0 m-0 dashboard-admin">
      <SideBar />
      <div className="container-fluid p-0 m-0 d-flex main">

        <div className="fundo-paginas d-flex flex-column w-100 row-gap-3">
          <div className="d-flex flex-column border-2 p-4 w-100 w-md-75">
            {/* Cabeçalho */}
            <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between w-100 mb-4">
              <h4>Apontamentos dos Chamados</h4>
            </div>


            {/* Tabela */}
            <div className="shadow-sm rounded-circle bg-white table-card" ref={tableRef}>
              <table className="tabela-chamadas">
                <thead>
                  <tr>
                    <th>Chamado</th>
                    <th>Status</th>
                    <th>Histórico</th>
                    <th>Horário de início/término</th>
                    <th>Duração</th>
                    <th>Comentário</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pools
                    ?
                    (<>
                      {pools.map((pool, index) => {
                        return (
                          <tr key={index}>
                            <td data-th="Chamado">{pool.titulo}</td>
                            <td data-th="Status">
                              <span
                                className={`badge ${pool.estado === "pendente"
                                  ? "status-pendente"
                                  : pool.estado === "concluida"
                                    ? "status-ativo"
                                    : "status-bloqueado"
                                  }`}
                              >
                                {pool.estado}
                              </span>
                            </td>
                            <td data-th="Histórico">{handleHistorico(pool.id)}</td>
                            <td data-th="Início/Término">
                              {handleFim(pool.estado, pool.id)}
                            </td>
                            <td data-th="Comentário">
                              {handleDuracao(pool.estado, pool.id)}
                            </td>
                            <td data-th="Comentário">
                              {handleComentario(pool.id)}
                            </td>
                            <td data-th="Ações">
                              {/* Ícone de olho (visualizar) */}
                              {/* <i
                                  className="bi bi-eye acao-icon"
                                  onClick={() => setVisualizarChamado(pool)}
                                ></i> */}
                              {/* Ícone de lápis (editar) */}
                              <i
                                className="bi bi-pencil-square acao-icon"
                                onClick={() => {
                                  handleEditar(pool.estado, pool.id)
                                  setEditarChamado(pool);
                                  handle_comentario(pool.id);
                                  setStatusSelecionado(pool.estado);
                                }}
                              ></i>
                            </td>
                          </tr>
                        )
                      })}
                    </>)
                    : (<>
                      <tr>
                        <td>
                          <h6>Não há nenhuma chamada</h6>
                        </td>
                      </tr>
                    </>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>


      {/* MODAL - Editar Chamado */}
      {editarChamado && (
        <div className="modal-overlay">
          <div className="modal-content dark-mode">
            {/* Header */}
            <div className="modal-header">
              <h4 className="fw-bold">Editar Chamado - {editarChamado.tecnico}</h4>
              <button
                type="button"
                className="close-btn"
                onClick={() => setEditarChamado(null)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item"><b>Chamado:</b> {editarChamado.id}</div>
                <div className="info-item"><b>Patrimônio:</b> {editarChamado.patrimonio
                  ? (
                    <>
                      {editarChamado.patrimonio}
                    </>
                  ) : (<>
                    Não especificado
                  </>)
                }</div>
                <div className="info-item"><b>Título:</b> {editarChamado.titulo}</div>
                <div className="info-item"><b>Duração:</b> {duracao}</div>
                <div className="info-item"><b>Autor:</b> {editarChamado.criado_por}</div>
              </div>

              {/* Comentários */}
              <div className="comments-section">
                {editarChamado.comentarios?.length > 0 ? (
                  editarChamado.comentarios.map((c, idx) => (
                    <div
                      key={idx}
                      className={`comment-card ${c.tipo === "tecnico" ? "tecnico" : "usuario"}`}
                    >
                      <div className="comment-author">{c.autor}</div>
                      <div className="comment-text">{c.texto}</div>
                    </div>
                  ))
                ) : (
                  <p className="sem-comentarios">Nenhum comentário ainda.</p>
                )}
              </div>

              {/* Input de novo comentário */}
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Escreva um comentário..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
                <button
                  className="btn-send"
                  onClick={() => salvarEdicao(apontamento.id)}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>


          </div>
        </div>
      )}

    </div>
  );
}