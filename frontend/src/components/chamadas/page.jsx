"use client";
import SideBar from "@/components/sideBar/sidebar";
import { Poppins } from "next/font/google";
//import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export default function Chamadas() {
  const [mostrar, setMostrar] = useState(false);
  // const tableRef = useRef(null);

  // // Função para gerar o PDF
  // const gerarPDF = async () => {
  //   const tableElement = tableRef.current; // Obtém a referência do elemento
  //   if (tableElement) {
  //     // Remove temporariamente o atributo 'hidden' para que o html2canvas possa capturá-lo
  //     tableElement.removeAttribute("hidden");

  //     try {
  //       const canvas = await html2canvas(tableElement, {
  //         useCORS: true, // Importante se houver imagens de outras origens (ex: /assinatura.png)
  //       });
  //       const imgData = canvas.toDataURL("image/png"); // Formato PNG para melhor qualidade

  //       const doc = new jsPDF({
  //         orientation: "p",
  //         unit: "mm",
  //         format: "a4",
  //       });
  //       const largura = doc.internal.pageSize.getWidth(); // Largura total da página do PDF
  //       const altura = (canvas.height * largura) / canvas.width; // Calcula a altura proporcional

  //       // Adiciona a imagem capturada do HTML ao PDF
  //       doc.addImage(imgData, "PNG", 0, 0, largura, altura);

  //       doc.save("relatorioLancamentos.pdf");
  //     } catch (error) {
  //       console.error("Erro ao gerar PDF:", error);
  //     } finally {
  //     }
  //   } else {
  //     console.error("Elemento da tabela para PDF não encontrado.");
  //   }
  // };

  const [form, setForm] = useState({
    patrimonio: "",
    tipoServico: "",
    descricao: "",
    outroTipoServico: "",
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

    const tipoFinal =
      form.tipoServico === "Outro" ? form.outroTipoServico : form.tipoServico;

    const formData = new FormData();
    formData.append("patrimonio", form.patrimonio);
    formData.append("tipoServico", tipoFinal);
    formData.append("descricao", form.descricao);
    if (file) {
      formData.append("anexo", file);
    }

    const response = await fetch("/api/novo-chamado", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <>
      <div className="container-fluid p-0 m-0">
        <div className="d-flex flex-row me-0">
          <div className="col-md-3">
            <SideBar />
          </div>
          <div className="w-100">
            <div className="d-flex flex-wrap justify-content-between p-4 w-100">
              <h1 className="fw-bold">Chamadas</h1>

              <div className="d-flex flex-row flex-wrap gap-2">
                <button
                  className="d-flex p-2 gap-2 border-0 align-items-center btn-nova-chamada"
                  onClick={() => setMostrar(!mostrar)}
                >
                  <i className="fa-solid fa-plus"></i>
                  <p className={`m-0 ${poppins.className}`}>Nova Chamada</p>
                </button>
                <button
                  className="btn rounded-0 text-white d-flex gap-2 d-flex align-items-center botao-vermelhao"
                  onClick={gerarPDF}
                >
                  <i className="bi bi-file-earmark-ruled-fill"></i>
                  <p className="m-0">Gerar relatório</p>
                </button>
              </div>
            </div>
            <div className="p-3">
              <button className="bg-transparent p-2 d-flex align-items-center gap-2 btn-adicionar-filtro">
                <i className="fa-solid fa-plus icone-filtro"></i>
                <p className="m-0 fw-semibold p-adicionar-filtro">Adicionar Filtro</p>
              </button>
            </div>
            <div className="m-3" ref={tableRef}>
              <table className="table border p-2">
                <thead>
                  <tr className="">
                    <th className="">Assunto</th>
                    <th>Status</th>
                    <th>Histórico</th>
                    <th>Prioridade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-th="Assunto" className="p-3 ps-4">
                      Sala 1b
                    </td>
                    <td data-th="Status">
                      <div className="bg-warning w-100 m-0 p-2">Pendente</div>
                    </td>
                    <td data-th="Hstórico">Criado há 3 horas</td>
                    <td data-th="Prioridade">Alta</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center">
              {mostrar && (
                <div className="container p-3 modal-forms-chamada w-50 border rounded-2 m-2">
                  <div className="d-flex flex-row justify-content-between">
                    <h4 className="fw-bold mb-2">Novo Chamado</h4>
                    <button
                      type="button"
                      className="p-0 m-0 bg-transparent border-0 mb-1"
                      data-bs-dismiss="modal"
                      onClick={() => setMostrar(!mostrar)}
                    >
                      <i className="fs-3 p-0 bi bi-x botao-fechar m-0"></i>
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Nº do patrimônio</label>
                        <input
                          type="text"
                          className="form-control"
                          name="patrimonio"
                          value={form.patrimonio}
                          onChange={handleChange}
                          required
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
                          <option value="" disabled>
                            Selecione um tipo
                          </option>
                          <option value="Manutenção">Manutenção</option>
                          <option value="Instalação">Instalação</option>
                          <option value="Suporte Técnico">
                            Suporte Técnico
                          </option>
                          <option value="Atualização">Atualização</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div
                      className={`mb-3 fade-in ${
                        form.tipoServico === "Outro" ? "show" : ""
                      }`}
                    >
                      <label className="form-label">
                        Descreva o tipo de serviço
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="outroTipoServico"
                        value={form.outroTipoServico}
                        onChange={handleChange}
                        required={form.tipoServico === "Outro"}
                      />
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

                    <div className="mb-3">
                      <label className="form-label">Anexo (opcional)</label>
                      <input
                        type="file"
                        className="form-control"
                        name="anexo"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="d-flex flex-row-reverse">
                      <button
                        type="submit"
                        className="btn border botao-vermelhao d-flex justify-content-center w-100 fw-bold text-white"
                      >
                        Criar Chamado
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
