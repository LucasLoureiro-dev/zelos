"use client";

import { useState, useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import ThemeToggle from "@/components/darkmode/themetoggle.jsx"
import "./login/styleLogin.css";

export default function Home() {
  const [admin, setAdmin] = useState("aba");
  const [tecnico, setTecnico] = useState("aba");
  const [usuario, setUsuario] = useState("aba ativa");
  const [mensagem, setMensagem] = useState("");
  const [form, setForm] = useState({ RM: "", senha: "" });
  const [index, setIndex] = useState(3);
  const [aba, setAba] = useState("usuário")

  function handleClick({ index }) {
    if (index === 1) {
      setIndex(1); setAdmin("aba ativa"); setTecnico("aba"); setUsuario("aba");
      setAba("administrador")
    } else if (index === 2) {
      setIndex(2); setAdmin("aba"); setTecnico("aba ativa"); setUsuario("aba");
      setAba("técnico")
    } else if (index === 3) {
      setIndex(3); setAdmin("aba"); setTecnico("aba"); setUsuario("aba ativa");
      setAba("usuário")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urls = {
      3: "http://localhost:8080/auth/login",
      2: "http://localhost:8080/auth/loginTecnico",
      1: "http://localhost:8080/auth/loginAdm",
    };

    const dashboards = {
      3: "http://localhost:3000/usuario/dashboard",
      2: "http://localhost:3000/tecnico/dashboard",
      1: "http://localhost:3000/admin/dashboard",
    }

    fetch(urls[index], {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.RM, password: form.senha }),
      credentials: "include",
    }).then((res) => {
      if (res.status == 200) {
        window.location.href = dashboards[index]
      }
      else if (res.status == 404 || res.status == 401) {
        setMensagem("Usuário, senha ou tipo incorretos")
      }
    })
      .catch((error) => {
        console.error("Erro inesperado: ", error);
        setMensagem(error.message);
      });
  };


  // Para editar a aparência
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {

    background: {
      color: {
        value: "transparent",
      },
    },
    // Limite de FPS para otimizar a performance
    fpsLimit: 120,
    // Interatividade ao passar o mouse
    interactivity: {
      events: {
        onHover: {
          enable: false, //Ativa os bgl
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 100, // Distância da repulsão
          duration: 0.4,
        },
      },
    },
    particles: {
      // Cor principal das partículas
      color: { value: "#C00000" },
      // Configuração das linhas que conectam 
      links: { color: "#C00000", distance: 150, enable: true, opacity: 0.3, width: 1 },
      // Configuração do movimento das partículas 
      move: { enable: true, random: true, speed: 2, straight: false },
      // Número de partículas na tela NAO MUDAR PARA MUITO PQ TRAVA TUDO
      number: { density: { enable: true, area: 800 }, value: 80 },
      // Opacidade das partículas
      opacity: { value: 0.3 },
      // Formato das partículas TEM OUtRAS FORMAS GEOMETRICAS
      shape: { type: "circle" },
      // Tamanho das partículas 
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (

    <div className="relative w-screen h-screen overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="pipipi d-flex justify-content-end p-2"> <ThemeToggle /></div>
      <div className="relative z-10 login-page-wrapper d-flex justify-content-center align-items-center min-vh-100">
        <div className="d-flex justify-content-center mb-5">
          <div className="login-box mb-5">
            <div className="logo-login">
              <img src="/img/zelos-logo.png" alt="Logo Zelos" className="img-fluid" />
            </div>
            <p className="texto-login">Selecione seu perfil e faça login.</p>

            <div className="abas-perfil d-flex justify-content-between mb-3 border-bottom">
              <button className={usuario} onClick={() => handleClick({ index: 3 })}>Usuário</button>
              <button className={tecnico} onClick={() => handleClick({ index: 2 })}>Técnico</button>
              <button className={admin} onClick={() => handleClick({ index: 1 })}>Admin</button>
            </div>

            <form className="form-login" onSubmit={handleSubmit}>
              <input type="number" className="campo" name="RM" value={form.RM} placeholder={`RM do ${aba}`} onChange={handleChange} required />
              <input type="password" className="campo" name="senha" placeholder="Senha" onChange={handleChange} required />
              <button type="submit" className="botao-entrar d-block text-decoration-none">Entrar</button>
            </form>
            <p className="d-flex justify-content-center pt-3">{mensagem}</p>
          </div>
        </div>
      </div>
    </div>
  );
}