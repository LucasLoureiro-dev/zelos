"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Card_dashboard_usuario_table({ cargo, rm }) {

    var cor_fundo = null

    const [pools, setPools] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [modal, setModal] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnico, setTecnico] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8080/servicos`)
            .then(async (res) => {
                const data = await res.json();
                setServicos(data.servicos);
            })
    }, [])

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
                if (data) {
                    setPools(data.sort((a, b) => b - a));
                }
                else {
                    setPools('');
                }
            })
    }, [rm]);

    const handleClick = async (modal) => {
        try {
            setModal(modal);
            fetch(`http://localhost:8080/dashboard/tecnico/${modal.tipo}`)
                .then((res) => {
                    return res.json()
                })
                .then((json) => {
                    setTecnicos(json.result);
                })


            setForm({ ...form, chamado: modal.id })
        }
        catch (error) {
            console.log('!!!')
        }
    }

    const [form, setForm] = useState({
        tecnico: '',
        chamado: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            fetch(`http://localhost:8080/chamadas`, {
                method: 'POST',
                body: JSON.stringify({
                    chamado: form.chamado,
                    tecnico: form.tecnico,
                    usuario: modal.criado_por
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            fetch(`http://localhost:8080/pool/${modal.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    patrimonio: modal.patrimonio,
                    titulo: modal.titulo,
                    descricao: modal.descricao,
                    tipo: modal.tipo,
                    estado: "em andamento",
                    fotoURL: modal.fotoURL,
                    criado_em: modal.criado_em,
                    criado_por: modal.criado_por
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            window.location.href = "/admin/dashboard";
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleConcluir = async () => {
        try {
            fetch(`http://localhost:8080/pool/${modal.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    patrimonio: modal.patrimonio,
                    titulo: modal.titulo,
                    descricao: modal.descricao,
                    tipo: modal.tipo,
                    estado: "concluida",
                    fotoURL: modal.fotoURL,
                    criado_em: modal.criado_em,
                    criado_por: modal.criado_por
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
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
                                            <h6 className="card-subtitle mb-2">Tipo: {item.tipo}</h6>
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
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                onClick={() => handleClick(item)}
                                            >
                                                Ver detalhes
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
                                                    <div className="roW">
                                                        <h4>{modal.titulo}</h4>
                                                    </div>
                                                    <div className="row">
                                                        <h6>{modal.descricao}</h6>
                                                    </div>
                                                    <div className="row">
                                                        <h5>Numero patrimonio:</h5>
                                                        <h6>{modal.patrimonio}</h6>
                                                    </div>
                                                    <div className="row">
                                                        <h5>Criado por:</h5>
                                                        <h6>{modal.criado_por}</h6>
                                                    </div>
                                                    <div className="row">
                                                        <h5>Area:</h5>
                                                        <h6>{modal.tipo}</h6>
                                                    </div>
                                                    <div className="row">
                                                        {modal.estado == 'em andamento' || modal.estado == 'concluida' ? (
                                                            <button type="button" onClick={handleConcluir} className="btn  botao-vermelhao d-flex justify-content-center w-25 fw-bold">
                                                                Concluir chamado
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <h5>
                                                                    Atribuir técnico:
                                                                </h5>
                                                                <form onSubmit={handleSubmit}>

                                                                    <select
                                                                        list="patrimonios"
                                                                        className="form-control"
                                                                        name="tecnico"
                                                                        value={form.tecnico}
                                                                        onChange={handleChange}
                                                                        required
                                                                    >
                                                                        <option value="" disabled>Selecione um tecnico</option>
                                                                        {tecnicos
                                                                            ? (
                                                                                <>
                                                                                    {tecnicos.map((tecnico, index) => {
                                                                                        return (
                                                                                            <option key={index} value={tecnico.id} >{tecnico.nome}</option>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            )
                                                                            : (
                                                                                <>
                                                                                    <h1>Carregando</h1>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </select>
                                                                    <button type="submit" className="btn  botao-vermelhao d-flex justify-content-center w-25 fw-bold">
                                                                        Atribuir técnico
                                                                    </button>
                                                                </form>
                                                            </>
                                                        )}
                                                    </div>
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