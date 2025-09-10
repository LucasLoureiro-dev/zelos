"use client";
import SideBar from "@/components/sideBar/sidebar";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";
// import "@/app/usuarios/usuarios.css"
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";



const [usuario, setUsuario] = useState('');



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



const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});


export default function Usuarios() {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <div className="container-fluid p-0 m-0">
        <div className="d-flex flex-row me-0">
          <div className="col-md-3">
            <SideBar />
          </div>
          <div className="w-100">
            <div className="fundo-paginas d-flex flex-wrap justify-content-between p-3">
              <h1 className="fw-bold">Gerenciar Usuários</h1>

              <div className="d-flex flex-row flex-wrap gap-2">
                <button
                  className="d-flex p-2 gap-2 border-0 align-items-center btn-novo-usuario"
                  onClick={() => setMostrar(!mostrar)}
                >
                  <i className="fa-solid fa-plus"></i>
                  <p className={`m-0 ${poppins.className}`}>Novo usuário</p>
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="dropdown">
                <button
                  className="btn btn-secondary rounded-0 border-0 dropdown-toggle dropdown-usuarios"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Tipos de usuários
                </button>
                <ul className="dropdown-menu dropdown-menu rounded-0">
                  <li className="dropdown-item">
                    Selecionar usuário
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Técnico
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Funcionário
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Admnistrador
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
            <div className="m-3">
              <table className="table border p-2">
                <thead>
                  <tr className="">
                    <th>ID</th>
                    <th>Usuário</th>
                    <th>Função</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-th="ID" className="p-3 ps-4">032</td>
                    <td data-th="Usuário">Nome</td>
                    <td data-th="Função">Técnico</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center">
              {mostrar && (
                <div className="container p-3 modal-forms-chamada w-50 border border-secondary rounded-2 m-2">
                  <div className="d-flex flex-row justify-content-between">
                    <h2 className="fw-bold">Criar Usuário</h2>
                    <button
                      type="button"
                      className="p-0 m-0 bg-transparent border-0 mb-1 btn-fechar"
                      data-bs-dismiss="modal"
                      onClick={() => setMostrar(mostrar == false)}
                    >
                      <i className="fs-3 p-0 bi bi-x btn-fechar m-0"></i>
                    </button>
                  </div>
                  <form encType="multipart/form-data">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Nome do Usuário</label>
                        <input
                          placeholder="Nome do usuário..."
                          type="text"
                          className="form-control"
                          name="patrimonio"
                          placeholder="Nome do usuário..."
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Função</label>
                        <select className="form-select" name="tipoServico">
                          <option value="" disabled>
                            Selecione um tipo
                          </option>
                          <option value="Manutenção">Técnico</option>
                          <option value="Instalação">Usuário</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex flex-row-reverse">
                      <button
                        type="submit"
                        className="btn border botao-vermelhao d-flex justify-content-center text-wrap w-100 w-md-25 fw-bold text-white"
                        style={{ backgroundColor: "#e30613" }}
                      >
                        Criar Usuário
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
