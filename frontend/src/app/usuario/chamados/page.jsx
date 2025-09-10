"use client";

import SideBar from "@/components/sideBar/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./chamados.css";
import Link from "next/link";

export default function Chamados() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [pools, setPools] = useState([]);
  const [equipamentos, setEquipamentos] = useState()
  const [servicos, setServicos] = useState()
  const [poolModal, setPoolModal] = useState([])
  const [tipo, setTipo] = useState([])


  const [form, setForm] = useState({
    patrimonio: '',
    titulo: '',
    tipoServico: '',
    descricao: '',
    outroTipoServico: '',
  });
  const [file, setFile] = useState(null);

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

    console.log(form.patrimonio)

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
      window.location.href = '/usuario/chamados'


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
    fetch(`http://localhost:8080/pool/usuario/${usuario.rm}`, {
      credentials: 'include'
    })
      .then((response) => {
        console.log(response)
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
        setPools(data)
      })
  }, [usuario])

  async function show_modal({ id }) {
    const id_pool = id;
    const achar_pool = pools.find(pool => pool.id === id_pool)
    setPoolModal(achar_pool)
    const tipo = servicos.find(tipo_pool => tipo_pool.id === achar_pool.tipo)
    setTipo(tipo)
    setModalView(true)
  }

  const data = new Date(poolModal.criado_em);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return (
    <div className="container-fluid d-flex p-0 m-0 w-100 chamados">
      <SideBar />
      <div className="d-flex flex-column me-0 w-100 main">

        <div className="fundo-paginas d-flex  flex-column w-100 p-4 p-md-4 p-2">
          <div className="d-flex flex-row d-md-column flex-wrap justify-content-between align-items-center mb-4">
            <h4>Acompanhamento de Chamados</h4>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary d-flex flex-row p-3"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                <p className="m-0">Novo Chamado</p>
              </button>
            </div>

          </div>

          {/* Modal para criação de chamado */}
          {showModal && (
            <div className="modal-overlay">
              <div
                className="modal-forms-chamada p-4 rounded shadow-lg position-fixed top-50 start-50 translate-middle"
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold">Abrir Novo Chamado</h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-fechar"
                  ><i className="bi bi-x-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Nº do patrimônio</label>
                      <input
                        list="patrimonios"
                        type="text"
                        className="form-control bg-transparent"
                        name="patrimonio"
                        onChange={handleChange}
                        required
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
                      className="form-control bg-transparent"
                      name="outroTipoServico"
                      onChange={handleChange}
                      required={form.tipoServico === 'Outro'}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Titulo</label>
                    <textarea
                      className="form-control bg-transparent"
                      rows="1"
                      name="titulo"
                      onChange={handleChange}

                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control bg-transparent"
                      rows="4"
                      name="descricao"
                      onChange={handleChange}

                    ></textarea>
                  </div>

                  {/* Campo extra para designar técnico (somente admin) */}
                  {usuario?.cargo === "admin" && (
                    <div className="mb-3">
                      <label className="form-label">Designar Técnico</label>
                      <input
                        type="text"
                        name="tecnico"
                        onChange={handleChange}
                        className="form-control bg-transparent"
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

          {modalView && (
            <div className="modal-overlay">
              <div
                className="modal-forms-chamada p-4 rounded shadow-lg position-fixed top-50 start-50 translate-middle"
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold">Visualizar chamado</h4>
                  <button
                    onClick={() => setModalView(false)}
                    className="btn btn-fechar"
                  ><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="modal-body">
                  {poolModal ? (
                    <>
                      <p><b>N° de patrimonio:</b> {poolModal.patrimonio}</p>
                      <p><b>Título:</b> {poolModal.titulo}</p>

                      {/* Novo campo: Tipo de serviço */}
                      <p><b>Tipo de serviço:</b> {tipo ? tipo.nome : "Não informado"}</p>

                      {/* Novo campo: Descrição */}
                      <p><b>Descrição:</b> {poolModal.descricao ? poolModal.descricao : "Sem descrição."}</p>

                      <b>Estado:</b> {poolModal.estado === "pendente" && (
                        <b data-th="Estado" className="p-3">
                          <span className="status status-pendente">
                            {poolModal.estado}
                          </span>
                        </b>
                      )}

                      {poolModal.estado === "em andamento" && (
                        <b data-th="Estado" className="p-3">
                          <span className="status status-andamento">
                            {poolModal.estado}
                          </span>
                        </b>
                      )}

                      {poolModal.estado === "concluida" && (
                        <b data-th="Estado" className="p-3">
                          <span className="status status-concluido">
                            {poolModal.estado}
                          </span>
                        </b>
                      )}

                      <p><b>Criado em:</b> {`${dia}/${mes}/${ano}`}</p>
                    </>
                  ) : (
                    <>Carregando...</>
                  )}
                </div>



              </div>
            </div>
          )
          }

          {/* Tabela de Chamados */}
          <div className="tabela-container w-100 m-0 p-3">
            <table className="tabela-chamados  w-100">
              <thead>
                <tr>
                  <th className="p-3">Patrimônio</th>
                  <th className="p-3">Título</th>
                  <th className="p-3">Descrição</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Criado em</th>
                  {usuario?.cargo === "admin" && <th>Técnico</th>}
                  <th className="p-3">Ação</th>
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
                          <td
                            data-th="Título"
                            className="p-3 text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {item.patrimonio}
                          </td>
                          <td
                            data-th="Título"
                            className="p-3 text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {item.titulo}
                          </td>

                          <td
                            data-th="Descrição"
                            className="p-3 text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {item.descricao}
                          </td>



                          {item.estado === "pendente" && (
                            <td data-th="Estado" className="p-3">
                              <span className="status status-pendente">
                                {item.estado}
                              </span>
                            </td>
                          )}

                          {item.estado === "em andamento" && (
                            <td data-th="Estado" className="p-3">
                              <span className="status status-andamento">
                                {item.estado}
                              </span>
                            </td>
                          )}

                          {item.estado === "concluida" && (
                            <td data-th="Estado" className="p-3">
                              <span className="status status-concluido">
                                {item.estado}
                              </span>
                            </td>
                          )}

                          <td data-th="Criado em" className="p-3">
                            {`${dia}/${mes}/${ano}`}
                          </td>
                          <td data-th="Ação" className="p-3">
                            <button type="button" onClick={() => show_modal({ id: item.id })}>Ver mais</button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
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
      </div >
    </div >
  );
}