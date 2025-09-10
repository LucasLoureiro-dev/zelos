"use client"

import SideBar from "@/components/sideBar/sidebar";
import '@/app/admin/dashboard/styleAdmin.css';
import { useEffect, useState } from 'react';
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DashboardAdmin() {

    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [chamadosRecentesFiltrados, setChamadosRecentesFiltrados] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [chamadosRecentes, setChamadosRecentes] = useState([]);
    const [totalChamados, setTotalChamados] = useState(0);
    const [chamadosPendentes, setChamadosPendentes] = useState([]);
    const [chamadosEmAndamento, setChamadosEmAndamento] = useState([]);
    const [chamadosConcluidos, setChamadosConcluidos] = useState([]);

    useEffect(() => {
        // Dados do usuário logado
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
            .then(data => setUsuario(data))
    }, []);

    useEffect(() => {
        if (usuario.cargo) {
            if (usuario.cargo != 'adm') {
                window.location.href = '/'
            }
        }
    }, [usuario])

    useEffect(() => {
        // Buscar todos chamados
        fetch('http://localhost:8080/pool', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setTotalChamados(data.length);
                if (data.length != 0) {
                    const pendentes = data.filter(ch => ch.estado === 'pendente');
                    setChamadosPendentes(pendentes);
                    const andamento = data.filter(ch => ch.estado === 'em andamento');
                    setChamadosEmAndamento(andamento);
                    const concluidos = data.filter(ch => ch.estado === 'concluida');
                    setChamadosConcluidos(concluidos);
                    const ultimosChamados = data.slice(-5).reverse();
                    setChamadosRecentes(ultimosChamados);
                    setChamadosRecentesFiltrados(ultimosChamados);
                }


            });
    }, []);

    useEffect(() => {
        if (filtroStatus === "todos") {
            setChamadosRecentesFiltrados(chamadosRecentes);
        } else {
            const filtrados = chamadosRecentes.filter(
                (ch) => ch.estado === filtroStatus
            );
            setChamadosRecentesFiltrados(filtrados);
        }
    }, [filtroStatus, chamadosRecentes]);

    async function exportarRelatorio() {
        const doc = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4",
        });

        // 📌 Cabeçalho
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(
            "Relatório de Chamados e Atividades Técnicas",
            doc.internal.pageSize.getWidth() / 2,
            50,
            { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Veja as ultimas chamadas pendentes, em andamento ou concluidas, assim como a atividade dos tecnicos", doc.internal.pageSize.getWidth() / 2, 70, {
            align: "center",
        });

        const ultimas5_pendente = chamadosPendentes
            .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())
            .slice(0, 5);
        const ultimas5_em_andamento = chamadosEmAndamento
            .sort((a, b) => new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime())
            .slice(0, 5);
        const ultimas5_concluido = chamadosConcluidos
            .sort((a, b) => new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime())
            .slice(0, 5);

        const chamados_pendente = ultimas5_pendente.map((aberto) => {
            const data = new Date(aberto.criado_em);
            const dia = String(data.getDate()).padStart(2, "0");
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const ano = data.getFullYear();

            return [
                aberto.patrimonio,
                aberto.titulo,
                `${dia}/${mes}/${ano}`,
                aberto.criado_por,
            ];
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Ultimas chamadas pendentes", doc.internal.pageSize.getWidth() / 2, 90, {
            align: "center",
        });
        autoTable(doc, {
            head: chamados_pendente.length > 0 ? [["N° de patrimonio", "titulo", "criado em", "criado por"]] : [["Informação"]],
            body: chamados_pendente.length > 0 ? chamados_pendente : [["Não há chamados em andamento"]],
            startY: 100,
            styles: { fontSize: 11, halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });


        const chamados_em_andamento = ultimas5_em_andamento.map((aberto) => {
            const data = new Date(aberto.criado_em);
            const dia = String(data.getDate()).padStart(2, "0");
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const ano = data.getFullYear();

            return [
                aberto.patrimonio,
                aberto.titulo,
                `${dia}/${mes}/${ano}`,
                aberto.criado_por,
            ];
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Ultimas chamadas em andamento", doc.internal.pageSize.getWidth() / 2, 290, {
            align: "center",
        });
        autoTable(doc, {
            head: chamados_em_andamento.length > 0 ? [["N° de patrimonio", "titulo", "criado em", "criado por"]] : [["Informação"]],
            body: chamados_em_andamento.length > 0 ? chamados_em_andamento : [["Não há chamados em andamento"]],
            startY: 300,
            styles: { fontSize: 11, halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        const chamados_concluido = ultimas5_concluido.map((aberto) => {
            const data = new Date(aberto.criado_em);
            const dia = String(data.getDate()).padStart(2, "0");
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const ano = data.getFullYear();

            return [
                aberto.patrimonio,
                aberto.titulo,
                `${dia}/${mes}/${ano}`,
                aberto.criado_por,
            ];
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Ultimas chamadas concluidas", doc.internal.pageSize.getWidth() / 2, 490, {
            align: "center",

        });
        autoTable(doc, {
            head: chamados_concluido.length > 0 ? [["N° de patrimonio", "titulo", "criado em", "criado por"]] : [["Informação"]],
            body: chamados_concluido.length > 0 ? chamados_concluido : [["Não há chamados concluidos"]],
            startY: 500,
            styles: { fontSize: 11, halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });


        doc.setFontSize(10);
        doc.text(
            "Gerado em: " + new Date().toLocaleString(),
            40,
            doc.internal.pageSize.getHeight() - 30
        );

        doc.save("relatorio.pdf");
    };

    return (
        <div className="d-flex flex-column flex-sm-row p-0 m-0 dashboard-admin">
            <SideBar nome={usuario.nome} cargo={usuario.cargo} />

            <div className="fundo-paginas d-flex flex-column main p-2 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                    <h4>Dashboard Administrativo</h4>
                    <button className="btn btn-success" onClick={exportarRelatorio}> <i className="bi bi-download me-1"></i> Exportar Relatório </button>
                </div>
                <div className="d-flex flex-column gap-3">
                    <div className="saudacao">
                        <h5>Bem-vindo: <span className="fw-bold">{usuario.nome}</span> ({usuario.cargo})</h5>
                        <p className="mb-0">Aqui está o resumo do sistema.</p>
                    </div>
                    {/* CARDS - 4 alinhados */}
                    <div className="overview d-flex flex-column flex-md-row gap-3">
                        <div className="overview-card flex-fill">
                            <h3>Chamados em Andamento</h3>
                            <span className="display-6">{chamadosEmAndamento.length}</span>
                        </div>

                        <div className="overview-card flex-fill">
                            <h3>Chamados Pendentes</h3>
                            <span className="display-6">{chamadosPendentes.length}</span>
                        </div>

                        <div className="overview-card flex-fill">
                            <h3>Chamados Concluídos</h3>
                            <span className="display-6">{chamadosConcluidos.length}</span>
                        </div>

                        <div className="overview-card flex-fill">
                            <h3>Total de Chamados</h3>
                            <span className="display-6">{totalChamados}</span>
                        </div>

                    </div>
                </div>

                {/* TABELA ADMIN IGUAL AO TÉCNICO */}
                <div className="card-transition">
                    <div className="table-card">
                        <h3>Últimos Chamados</h3>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Título</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chamadosRecentesFiltrados.length > 0 ? (
                                    chamadosRecentesFiltrados.map((ch, index) => (
                                        <tr key={index}>
                                            <td data-th="N°">{index + 1}</td>
                                            <td data-th="Título">{ch.titulo}</td>
                                            <td data-th="Status">
                                                {ch.estado === "pendente" && (
                                                    <span className="status status-pendente">{ch.estado}</span>
                                                )}
                                                {ch.estado === "em andamento" && (
                                                    <span className="status status-andamento">{ch.estado}</span>
                                                )}
                                                {ch.estado === "concluida" && (
                                                    <span className="status status-concluido">{ch.estado}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center td-chamados">
                                            Nenhum chamado encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div >

    );
}
