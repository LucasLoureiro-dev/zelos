"use client";

import SideBar from "@/components/sideBar/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./chamados.css";
import Link from "next/link";

import Chat_bot from "@/components/bot/ChatBot";

export default function Chamados() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pools, setPools] = useState([]);
  const [equipamentos, setEquipamentos] = useState('')
  const [servicos, setServicos] = useState('')
  const [tecnicos, setTecnicos] = useState('')
  const [pool, setPool] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [chamadas, setChamadas] = useState('');
  const [clicou, setClicou] = useState(false);


  const [form, setForm] = useState({
    patrimonio: '',
    titulo: '',
    tipoServico: 1,
    descricao: '',
    outroTipoServico: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/servicos`)
      .then(async (res) => {
        const data = await res.json();
        setServicos(data.servicos);
      });
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    fetch(`http://localhost:8080/equipamentos/${value}`)
      .then(async (res) => {
        const data = await res.json();
        setEquipamentos(data.result);
      })
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('patrimonio', form.patrimonio);
    formData.append('titulo', form.titulo);
    formData.append('tipoServico', form.tipoServico);
    formData.append('descricao', form.descricao);

    if (form.tipoServico == 1) {
      formData.append('outro', true);
      formData.append('servico', form.outroTipoServico);
    } else {
      formData.append('outro', false);
    }



    if (form.patrimonio) {
      const check = await fetch(`http://localhost:8080/pool/patrimonio/${form.patrimonio}`);

      if (check.status == 200) {
        return alert('Patrimônio já cadastrado');
      }
      else {

        let tipoId = servicos.find(servico => servico.nome === form.tipoServico)?.id;
        if (!tipoId) {
          tipoId = 0
        }

        const response = await fetch('http://localhost:8080/pool', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: {
            "content-type": "application/json"
          },
          credentials: 'include'
        })

        const result = await response.json();
        window.location.href = '/admin/chamados'
      }




      fetch(`http://localhost:8080/notificacoes`, {
        method: 'POST',
        body: JSON.stringify({
          rm: usuario.rm,
          texto: `Foi criado um chamado do patrimônio: ${form.patrimonio}`,
          area: form.tipoServico,
          cargo: usuario.cargo,
          id_pool: result.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  };


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
      if (usuario.cargo != 'adm') {
        window.location.href = '/'
      }
    }
  }, [usuario])


  useEffect(() => {
    fetch(`http://localhost:8080/pool`, {
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
        const sortedData = [...data].sort((a, b) => {

          const dateA = new Date(a.criado_em);
          const dateB = new Date(b.criado_em);

          return dateB.getTime() - dateA.getTime();
        });

        setPools(sortedData);
      })
  }, [usuario])

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


  function criarChamado() {

    fetch(`http://localhost:8080/notificacoes`, {
      method: 'POST',
      body: JSON.stringify({
        rm: usuario.rm,
        texto: `O técnico ${tecnico} foi atribuido para o chamado do patrimônio ${pool.patrimonio}`,
        area: pool.tipo,
        cargo: 'tecnico',
        id_pool: pool.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    fetch(`http://localhost:8080/pool/${pool.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        id: pool.id,
        titulo: pool.titulo,
        descricao: pool.descricao,
        tipo: pool.tipo,
        patrimonio: pool.patrimonio,
        outro: pool.outro,
        estado: 'em andamento',
        criado_em: pool.criado_em,
        criado_por: pool.criado_por
      })
    })

    fetch(`http://localhost:8080/chamadas`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        chamado: pool.id,
        tecnico: tecnico,
        usuario: pool.criado_por
      })
    })
      .then((feito) => {
        return feito.json()
      })
      .then((res) => {
        return fetch(`http://localhost:8080/acompanhamentos`, {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            chamado_id: res.dataId
          })
        })
      })
      .then((res) => window.location.href = '/admin/chamados')
  }
  function handleConcluir(pool) {
    let patrimonio;
    if (!pool.patrimonio) {
      patrimonio = ' não especificado '
    }
    else {
      patrimonio = pool.patrimonio
    }
    fetch(`http://localhost:8080/notificacoes`, {
      method: 'POST',
      body: JSON.stringify({
        rm: usuario.rm,
        texto: `O chamado do patrimônio ${patrimonio} foi concluído`,
        area: pool.tipo,
        cargo: 'tecnico',
        id_pool: pool.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let apontamento_id
    if (pool) {
      fetch(`http://localhost:8080/pool/${pool.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: pool.id,
          titulo: pool.titulo,
          descricao: pool.descricao,
          tipo: pool.tipo,
          patrimonio: pool.patrimonio,
          outro: pool.outro,
          estado: 'concluida',
          criado_em: pool.criado_em,
          criado_por: pool.criado_por
        })
      })
      fetch(`http://localhost:8080/chamadas`)
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          console.log(pool.id)
          return data.find((chamado) => chamado.chamado == pool.id);
        })
        .then((data) => {
          fetch(`http://localhost:8080/chamadas/${data.id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              chamado: data.chamado,
              tecnico: data.tecnico_id,
              usuario: data.usuario_id
            })
          })
          apontamento_id = data.id
        })
        .then(
          fetch(`http://localhost:8080/acompanhamentos`)
            .then((res) => {
              return res.json()
            })
            .then((data) => {
              const apontamento = data.acompanhamentos.find((ola) => ola.chamado_id == apontamento_id);
              const currentdate = new Date();
              const datetime1 = currentdate.toISOString().slice(0, 19).replace('T', ' ');
              const atualizar_apontamento = {
                chamado_id: apontamento.chamado_id,
                comentario: apontamento.comentario,
                comeco: apontamento.comeco,
                fim: datetime1
              }
              return fetch(`http://localhost:8080/acompanhamentos/${apontamento.id}`, {
                method: "PUT",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify(atualizar_apontamento)
              })
            })
            .then(() => window.location.href = '/admin/chamados')
        )
    }
  }

  return (
    <div className="container-fluid d-flex flex-column flex-sm-row p-0 m-0 chamados">
      <SideBar />
      <div className="d-flex flex-column me-0 w-100 main">

        <div className="fundo-paginas d-flex flex-column w-100 p-4 justify-content-center p-md-4 p-2">
          <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between w-100 w-md-75 mb-4">
            <h4>Acompanhamento de Chamados</h4>
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary d-flex flex-row p-3"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                <p className="m-0">Novo Chamado</p>
              </button>
            </div>
          </div>


          <div className="container-modal w-50 d-flex flex-column justify-content-center">
            {showModal && (
              <div className="modal-overlay">
                <div
                  className="modal-forms-chamada p-4 rounded shadow-lg position-fixed top-50 start-50 translate-middle"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">Abrir Novo Chamado</h4>
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn-fechar"
                    ><i className="bi bi-x-lg fw-bold"></i></button>
                  </div>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Nº do patrimônio (Deixe em branco caso não saiba)</label>
                        <input
                          list="patrimonios"
                          type="text"
                          className="form-control"
                          name="patrimonio"
                          onChange={handleChange}
                        />
                        <datalist id="patrimonios">
                          {equipamentos
                            ? (
                              <>
                                {equipamentos.map((item, index) => {
                                  return (
                                    <option key={index} value={item.patrimonio}>
                                      {item.equipamento}
                                    </option>
                                  )
                                })}
                              </>
                            ) : (
                              <>

                              </>
                            )}
                        </datalist>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tipo de serviço</label>
                        <select
                          className="form-select"
                          name="tipoServico"
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>Selecione um tipo</option>
                          {servicos
                            ? (
                              <>
                                {servicos.map((servico) => (
                                  <option key={servico.id} value={servico.id}>
                                    {servico.nome}
                                  </option>
                                ))}
                              </>
                            )
                            : (
                              <><option>:(</option></>
                            )}
                        </select>
                      </div>
                    </div>

                    {/* Campo extra se "Outro" for selecionado */}
                    <div className={`mb-3 fade-in ${form.tipoServico == 1 ? 'show' : ''}`}>
                      <label className="form-label">Descreva o tipo de serviço</label>
                      <input
                        type="text"
                        className="form-control"
                        name="outroTipoServico"
                        onChange={handleChange}
                        required={form.tipoServico === 'Outro'}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Titulo</label>
                      <textarea
                        className="form-control"
                        rows="1"
                        name="titulo"
                        onChange={handleChange}

                      ></textarea>
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Descrição (opcional)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        name="descricao"
                        onChange={handleChange}

                      ></textarea>
                    </div>

                    {usuario?.cargo === "admin" && (
                      <div className="mb-3">
                        <label className="form-label">Designar Técnico</label>
                        <input
                          type="text"
                          name="tecnico"
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Ex.: Carlos Silva"
                        />
                      </div>
                    )}

                    <button type="submit" className="btn btn-success w-100">
                      Criar Chamado
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="card p-3 shadow-sm tabela-container">
            <table className="chamados-adm">
              <thead>
                <tr>
                  <th className="p-3">Patrimonio</th>
                  <th className="p-3">Título</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Criado em</th>
                  {usuario?.cargo === "admin" && <th>Técnico</th>}
                  <th className="p-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool) => (
                  <tr key={pool.id} style={{ cursor: "pointer" }}>
                    <td data-th="Patrimonio" className="p-2">{pool.patrimonio
                      ? (
                        <>
                          {pool.patrimonio}
                        </>
                      )
                      : (<>
                        Não especificado
                      </>)}</td>
                    <td data-th="Título" className="p-2">{pool.titulo}</td>
                    <td data-th="Estado" className="p-2">
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            pool.estado?.toLowerCase() === "pendente"
                              ? "#4d4dff"
                              : pool.estado?.toLowerCase() === "concluido"
                                ? "#28a745"
                                : pool.estado?.toLowerCase() === "em andamento"
                                  ? "#ffc107"
                                  : "#28a745", // fallback azul
                          color:
                            pool.estado?.toLowerCase() === "em andamento"
                              ? "#fff" // preto para contraste no amarelo
                              : "#fff", // branco nos outros
                        }}
                      >
                        {pool.estado}
                      </span>
                    </td>
                    <td className="p-2" data-th="Criado em">{handleData(pool.criado_em)}</td>
                    {usuario?.cargo === "admin" && (
                      <td className="p-2">
                        {pool.tecnico || (
                          <span className="text-muted">Não designado</span>
                        )}
                      </td>
                    )}
                    <td data-th="Ações">
                      {pool.estado == 'pendente'
                        ? (
                          <>
                            <i
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              className="bi bi-pencil-square acao-icon"
                              onClick={() => {
                                setPool(pool)
                                fetch(`http://localhost:8080/dashboard/tecnico/${pool.tipo}`, {
                                  credentials: "include",
                                })
                                  .then((res) => res.json())
                                  .then((data) => {
                                    setTecnicos(data.result);
                                  });
                              }}
                            ></i>
                          </>
                        ) : (
                          <>
                          </>
                        )}

                      {pool.estado == 'em andamento'
                        ? (
                          <>
                            <i
                              data-bs-toggle="modal"
                              data-bs-target="#concluir"
                              className="bi bi-pencil-square acao-icon"
                              onClick={() => {
                                setPool(pool)
                                handleConcluir(pool)
                              }}
                            ></i>
                          </>
                        ) : (
                          <>
                          </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pools.length === 0 && (
              <p className="text-center mt-3 chamados-p">
                Nenhum chamado encontrado.
              </p>
            )}
          </div>
          <Chat_bot />

          {/* MODAL - Editar Chamado */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex flex-row justify-content-between">
                  <h1 className="modal-title fs-5" id="exampleModalLabel"> Designar um técnico
                  </h1>
                  <button
                    type="button"
                    className="btn-close btn-fechar"
                    data-bs-dismiss="modal"
                  >
                  </button>
                </div>
                <div className="modal-body">
                  <div className="w-100">
                    <label className="form-label">Selecione um técnico para o chamado</label>
                    <select
                      className="form-select"
                      name="tipoServico"
                      value={tecnico}
                      onChange={(e) => setTecnico(e.target.value)}
                      required
                    >
                      <option value="" disabled>Selecione um técnico</option>
                      {tecnicos
                        ? (<>
                          {tecnicos.map((tecnico, index) => {
                            return (
                              <option key={tecnico.id} value={tecnico.rm} >{tecnico.nome}</option>
                            )
                          })}
                        </>)
                        : (<>
                        </>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" onClick={() => criarChamado()} className="btn btn-primary">
                    Salvar mudanças
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div
            className="modal fade"
            id="concluir"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content custom-modal">
                <div className="modal-header border-0">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {pool.titulo}
                  </h1>
                  <button
                    type="button"
                    className="btn-close "
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <p className="modal-description">
                    Este chamado está disponível para conclusão. Clique no botão abaixo
                    para concluir.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-atribuir"
                    onClick={() => handleConcluir(pool)}
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}