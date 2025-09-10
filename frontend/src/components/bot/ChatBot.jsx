"use client";
import { useState, useRef, useEffect } from "react";
import "../bot/chatBot.css";

const SENAI_LOGO_URL = "/favicon.ico"; // Mantenha o nome da constante para sua logo

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! 👋" },
    { role: "assistant", content: "Sou o assistente virtual ZELOS, pronto para te ajudar." },
    { role: "assistant", content: "Por favor, aguarde enquanto identifico seu perfil..." } // Mensagem inicial para aguardar identificação do perfil
  ]);
  const [input, setInput] = useState("");
  const [userRole, setUserRole] = useState(null); // Estado para armazenar o perfil do usuário
  const messagesEndRef = useRef(null);

  // Efeito para buscar o perfil do usuário quando o componente carrega
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('http://localhost:8080/dashboard', {
          credentials: 'include'
        });
        if (!res.ok) {
          // Se não estiver logado ou erro, defina um perfil padrão (ex: 'visitante')
          setUserRole('visitante');
          setMessages(prev => [...prev.slice(0, 2), { role: "assistant", content: "Não foi possível identificar seu perfil. Como visitante, posso te ajudar com:\n1. Informações gerais sobre o sistema\n2. Falar com um atendente" }]);
          return;
        }
        const data = await res.json();
        let role = 'visitante';
        if (data && data.cargo) {
          if (data.cargo === 'comum') role = 'usuario';
          else if (data.cargo === 'tecnico') role = 'tecnico';
          else if (data.cargo === 'adm') role = 'admin';
        }
        setUserRole(role);
        // Mensagem de boas-vindas específica após identificar o perfil
        let welcomeMessage = "Seja bem-vindo(a)! Como posso te ajudar hoje?";
        let initialOptions = "";

        if (role === 'usuario') {
          initialOptions = "\n1. Abrir um novo chamado\n2. Verificar status dos meus chamados\n3. Como usar o painel do usuário";
        } else if (role === 'tecnico') {
          initialOptions = "\n1. Ver chamados disponíveis\n2. Ver meus chamados em andamento\n3. Como me atribuir a um chamado\n4. Como finalizar um chamado\n5. Como usar o painel do técnico";
        } else if (role === 'admin') {
          initialOptions = "\n1. Gerar Relatório de Chamados\n2. Verificar visão geral do sistema\n3. Como criar/editar um chamado\n4. Como atribuir um técnico a um chamado\n5. Como usar o painel do administrador";
        } else { // Visitante
          initialOptions = "\n1. Informações gerais sobre o sistema\n2. Falar com um atendente";
        }
        setMessages(prev => [...prev.slice(0, 2), { role: "assistant", content: `${welcomeMessage}${initialOptions}` }]);

      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        setUserRole('visitante'); // Fallback para visitante em caso de erro
        setMessages(prev => [...prev.slice(0, 2), { role: "assistant", content: "Não foi possível identificar seu perfil. Como visitante, posso te ajudar com:\n1. Informações gerais sobre o sistema\n2. Falar com um atendente" }]);
      }
    };
    fetchUserRole();
  }, []); // Executa apenas uma vez ao montar o componente

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || !userRole) return; // Não envia se o perfil não foi identificado

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, cargo: userRole }) // Inclui o cargo na requisição
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ocorreu um erro no servidor.");

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: `Desculpe, ocorreu um erro: ${err.message}` }]);
    }
  };

  const downloadConversation = () => {
    const formattedText = messages
      .map(msg => {
        const prefix = msg.role === 'user' ? 'Você' : 'Assistente ZELOS';
        return `${prefix}:\n${msg.content}`;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conversa-assistente-zelos.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-danger rounded-circle position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center shadow-lg"
        style={{ width: "60px", height: "60px", fontSize: "24px" }}
        aria-label="Abrir chat"
      >
        <i className="bi bi-chat-left-dots-fill"></i>
      </button>
    );
  }

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className="position-fixed bottom-0 end-0 m-4 shadow-lg rounded d-flex flex-column chat-bot-body"
        style={{ zIndex: 1050 }}
      >
        <div className="cabecalho-chat text-white p-3 rounded-top d-flex flex-column flex-md-row justify-content-between gap-2">
          <h5 className="m-0">Assistente ZELOS</h5>
          <div className="d-flex gap-3">
            <button
              onClick={downloadConversation}
              className="btn btn-sm btn-light"
              title="Baixar conversa"
            >
              <i className="bi bi-download"></i>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-light fw-bold"
              title="Fechar chat"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="flex-grow-1 overflow-auto p-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex flex-column flex-md-row row-gap-2 mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              {msg.role === "assistant" && (
                <img
                  src={SENAI_LOGO_URL}
                  alt="Logo ZELOS"
                  className="rounded-circle me-2"
                  style={{ width: "32px", height: "32px" }}
                />
              )}
              <div
                className={`p-2 rounded shadow-sm ${msg.role === "user"
                  ? "bg-vermelho text-white rounded-end"
                  : "bg-light text-dark rounded-start"
                  }`}
                style={{ maxWidth: "75%" }}
              >
                <div
                  style={{ whiteSpace: "pre-line", fontSize: "0.875em" }} // 0.875em ≈ <small>
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                ></div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="p-3 border-top">
          <div className="input-group input-enviar-chat">
            <input
              type="text"
              className="form-control"
              placeholder="Digite sua opção..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!userRole} // Desabilita o input até o perfil ser carregado
            />
            <button
              className="btn btn-enviar-chat"
              type="button"
              onClick={sendMessage}
              disabled={!userRole} // Desabilita o botão até o perfil ser carregado
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}