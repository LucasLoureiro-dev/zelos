"use client";
import "@/components/sideBar/sidebar.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/darkmode/themetoggle";
import { Poppins } from "next/font/google";

export default function SideBar() {
  const [aberto, setAberto] = useState(false);
  var logoSrc = "/img/zelos-logo.png";
  var profileSrc = "/img/perfil.png";
  var inboxCount = 12;

  const [usuario, setUsuario] = useState('');
  const [notificacoes, setNotificacoes] = useState(0);
  const [visto, setVisto] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [dashboard, setDashboard] = useState("");
  const [notificacao, setNotificacao] = useState("")
  const [chamados, setChamados] = useState("")

  useEffect(() => {
    fetch('http://localhost:8080/dashboard', {
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();

        } else {
          throw new Error('Usuário não logado');
        }
      })
      .then((data) => {
        setUsuario(data);
      });
  }, [])

  console.log(usuario)



  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/notificacoes/vista/${usuario.rm}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar notificações');
          }
        })
        .then((data) => {
          setVisto(data.length);
        })
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      if (usuario.cargo == 'comum') {
        fetch(`http://localhost:8080/notificacoes/rm/${usuario.rm}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Erro buscando notificações');
            }
          })
          .then((data) => {
            setNotificacoes(data.length)
          })
      }
      else if (usuario.cargo == 'tecnico') {
        fetch(`http://localhost:8080/notificacoes/area/${usuario.area}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Erro buscando notificações');
            }
          })
          .then((data) => {
            setNotificacoes(data.notificacao.length)
          })
      }
      else {
        fetch(`http://localhost:8080/notificacoes`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Erro buscando notificações');
            }
          })
          .then((data) => {
            setNotificacoes(data.length)
          })
      }

    }
  }, [usuario])

  useEffect(() => {
    if (usuario.cargo == "adm") {
      setDashboard("/admin/dashboard");
      setNotificacao("/notificacoes/adm");
      setChamados("/admin/chamados");
    }
    else if (usuario.cargo == "tecnico") {
      setDashboard("/tecnico/dashboard");
      setNotificacao("/notificacoes/tecnico");
    }
    else if (usuario.cargo == "comum") {
      setDashboard("/usuario/dashboard");
      setNotificacao("/notificacoes/usuario");
      setChamados("/usuario/chamados");
    }
  }, [usuario])

  useEffect(() => {
    if (notificacoes) {
      setNotificationsCount(notificacoes - visto)
    }
  }, [notificacoes, visto])

  function handleLogout() {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usuario.rm,
      }),
      credentials: 'include'
    })
      .then(window.location.href = '/')
  }

  function handleLogout() {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usuario.rm,
      }),
      credentials: 'include'
    })
      .then(window.location.href = '/')
  }

  return (
    <>
      <div className="d-none d-sm-flex d-md-flex flex-column nav-usuario pt-2">
        <img
          src={logoSrc}
          className="img-fluid mt-2 d-md-block sidebar-logo"
          alt="logo"
        />
        {/*principal */}
        <div className="menu px-2 flex-grow-1 mt-4">
          <div className="menu-card p-3">
            <ul className="list-unstyled mb-0">
              <li className="mb-2 d-flex flex-wrap">
                <Link href={`${dashboard}`} className="menu-link menu-link-active d-flex flex-wrap align-items-center gap-2">
                  <i className="bi bi-columns-gap"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href={`${notificacao}`} className="menu-link menu-link-active d-flex flex-wrap">
                  <div className="d-flex align-items-center flew-wrap gap-2" >
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-regular fa-bell"></i>
                      <span>Notificações</span>
                    </div>
                    {notificationsCount > 0
                      ? (
                        <span className="badge-count">
                          {notificationsCount}+
                        </span>

                      ) : (
                        <>
                        </>
                      )}
                  </div>
                </Link>
              </li>

              {usuario.cargo == 'tecnico'
                ? (
                  <li className="mb-2 d-flex">
                    <Link href="/tecnico/apontamentos" className="menu-link menu-link-active">
                      <i className="fa-solid fa-list-check"></i>
                      <span>Apontamentos</span>
                    </Link>
                  </li>
                ) : (
                  <li className="mb-2 d-flex">
                    <Link href={`${chamados}`} className="menu-link menu-link-active">
                      <i className="fa-solid fa-list-check"></i>
                      <span>Chamados</span>
                    </Link>
                  </li>
                )}
            </ul>
            <ThemeToggle />
          </div>
        </div>

        {/* Footer perfil */}

        <div className="sidebar-footer px-3 py-3 d-flex flex-column align-items-start justify-content-between gap-2">
          <div className="d-flex justify-content-between align-items-center">
            <img alt="profile" src={profileSrc} className="profile-pic" />
            <div className="profile-info">
              {usuario ? (
                <>
                  <div className="fw-semibold">{usuario.nome}</div>
                  <small className="muted">{usuario.cargo}</small>
                </>
              ) : (
                <>
                  <div className="fw-semibold">Indisponível</div>
                  <small className="muted">Indisponível</small>
                </>
              )}
            </div>
          </div>
          <div className="menu-logout d-flex align-self-center">
            <button onClick={() => handleLogout()} className="btn logout-btn">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>


      {/* ///////////////////MOBILE////////////////// */}
      <div className="flex-collumn index d-md-none d-sm-none justify-content-around align-items-center">
        <div className="div-drop-nav mb-3">
          <button
            onClick={() => setAberto(!aberto)}
            className="btn drop-nav-usuario text-white d-flex justify-content-between align-items-center ms-2 mt-2"
            style={{
              padding: "1rem",
              borderBottomRightRadius: aberto ? 0 : "5px",
              borderBottomLeftRadius: aberto ? 0 : "5px",
            }}
          >
            <i className="bi bi-list fs-5 nav-buguer"></i>
          </button>

          {aberto && (
            <div className="d-flex flex-column nav-usuario ms-2 w-75 position-absolute">
              <div className="menu px-2 flex-grow-1 mt-4">
                <div className="menu-card p-1">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <Link href={dashboard} className="menu-link menu-link-active d-flex align-items-center">
                        <i className="bi bi-columns-gap"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>

                    <li className="mb-2">
                      <Link href={notificacao} className="menu-link menu-link-active d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <div className="d-flex align-items-center">
                            <i className="fa-regular fa-bell"></i>
                            <span>Notificações</span>
                          </div>
                          <span className="badge-count">{notificationsCount}+</span>
                        </div>
                      </Link>
                    </li>

                    {usuario.cargo == 'tecnico'
                      ? (
                        <li className="mb-2 d-flex">
                          <Link href="/tecnico/apontamentos" className="menu-link menu-link-active">
                            <i className="fa-solid fa-list-check"></i>
                            <span>Apontamentos</span>
                          </Link>
                        </li>
                      ) : (
                        <li className="mb-2 d-flex">
                          <Link href={`${chamados}`} className="menu-link menu-link-active">
                            <i className="fa-solid fa-list-check"></i>
                            <span>Chamados</span>
                          </Link>
                        </li>
                      )}
                  </ul><ThemeToggle />
                </div>
              </div>
              {/* Footer perfil */}

              <div className="sidebar-footer px-3 py-3 d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex justify-content-between align-items-center">
                  <img alt="profile" src={profileSrc} className="profile-pic" />
                  <div className="profile-info">
                    {usuario ? (
                      <>
                        <div className="fw-semibold">{usuario.nome}</div>
                        <small className="muted">{usuario.cargo}</small>
                      </>
                    ) : (
                      <>
                        <div className="fw-semibold">Indisponivel</div>
                        <small className="muted">Indosponivel</small>
                      </>
                    )}

                  </div>
                </div>
              </div>
            <div className="menu-logout d-flex align-self-center">
                  <button onClick={() => handleLogout()} className="btn logout-btn">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 