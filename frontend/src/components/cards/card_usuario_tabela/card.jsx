"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Card_dashboard_usuario_table({ cargo, rm }) {

    const [pools, setPools] = useState([]);
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/servicos`)
            .then(async (res) => {
                const data = await res.json();
                setServicos(data.servicos);
            })
    }, [])

    useEffect(() => {

        fetch(`http://localhost:8080/pool/usuario/${rm}`, {
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
                    data.sort((a, b) => b - a);
                    setPools(data.slice(-3));
                }
                else {
                    setPools('');
                }
            })

        // fetch(`http://localhost:8080/servicos`)
        //     .then(async (res) => {
        //         const data = await res.json();
        //         const achaServiso = data.servicos.find(data => data.id === pools.)
        //         setServicos(achaServiso)
        //     });

    }, [rm])



    const [form, setForm] = useState({
        id: '',
        patrimonio: '',
        titulo: '',
        tipoServico: '',
        descricao: '',
        estado: '',
        imagem: '',
        criado_em: '',
        criado_por: '',
        outro: ''
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(form)

        const response = await fetch(`http://localhost:8080/pool/${form.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patrimonio: form.patrimonio,
                titulo: form.titulo,
                tipo: form.tipoServico,
                descricao: form.descricao,
                estado: form.estado,
                imagem: form.imagem,
                criado_em: form.criado_em,
                criado_por: form.criado_por,
                outro: form.outro,
                tipo1: form.tipoServico == 1
            }),
            credentials: 'include'
        });

        const result = await response.json();
        alert(result.message);

    };

    const handleSet = async (chamado) => {
        try {
            setForm({
                id: chamado.id,
                patrimonio: chamado.patrimonio,
                titulo: chamado.titulo,
                tipoServico: chamado.tipo,
                descricao: chamado.descricao,
                estado: chamado.estado,
                imagem: chamado.fotoURL,
                criado_em: chamado.criado_em,
                criado_por: chamado.criado_por,
                outro: chamado.outro
            })
        }
        catch (error) {

        }
    }

    return (
        <>
            {pools
                ? (
                    <>
                        {pools.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="card mt-5">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">

                                            <h5 className="card-title">Titulo: {item.titulo}</h5>
                                            <h6 className="card-subtitle mb-2 text-body-secondary">Descrição: {item.descricao}</h6>
                                            <h6 className="card-subtitle mb-2">
                                                Tipo: {servicos.id == item.tipo ? (
                                                    <>
                                                        {servicos.nome}
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.tipo}
                                                    </>
                                                )}</h6>
                                            <h6 className="card-subtitle mb-2">
                                                Tecnico: {item.tecnico ? (
                                                    <>
                                                        {item.tecnico}
                                                    </>
                                                ) : (
                                                    <>
                                                        Sem tecnico
                                                    </>
                                                )}</h6>
                                            <h6 className="card-subtitle mb-2">Estado: {item.estado}</h6>
                                            <h6 className="card-subtitle mb-2">Criado em: {item.criado_em}</h6>
                                            <h6 className="card-subtitle mb-2">Atualizado em: {item.atualizado_em}</h6>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                onClick={() => handleSet(item)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className="modal fade"
                                        id="exampleModal"
                                        tabIndex={-1}
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                                        Editar chamado
                                                    </h1>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    />
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <label className="form-label">Nº do patrimônio</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="patrimonio"
                                                                    value={item.patrimonio}
                                                                    onChange={handleChange}
                                                                    required
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Tipo de serviço</label>
                                                                <select
                                                                    className="form-select"
                                                                    name="tipoServico"
                                                                    value={form.tipoServico}
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
                                                        {form.tipoServico == 1 && (
                                                            <div className="mb-3 fade-in">
                                                                <label className="form-label">Descreva o tipo de serviço</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="outro"
                                                                    value={form.outro}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="mb-3">
                                                            <label className="form-label">Titulo</label>
                                                            <textarea
                                                                className="form-control"
                                                                rows="1"
                                                                name="titulo"
                                                                value={form.titulo}
                                                                onChange={handleChange}

                                                            ></textarea>
                                                        </div>


                                                        <div className="mb-3">
                                                            <label className="form-label">Descrição (opcional)</label>
                                                            <textarea
                                                                className="form-control"
                                                                rows="4"
                                                                name="descricao"
                                                                value={form.descricao}
                                                                onChange={handleChange}

                                                            ></textarea>
                                                        </div>
                                                        <div className="d-flex flex-row-reverse">
                                                            <button type="submit" className="btn  botao-vermelhao d-flex justify-content-center w-100 fw-bold">
                                                                Criar Chamado
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })}
                    </>
                )
                : (
                    <>

                    </>
                )}

        </>
    );
}