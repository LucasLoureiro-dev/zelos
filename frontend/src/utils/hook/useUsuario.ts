"use client";
// hooks/useUsuario.ts
import { useEffect, useState } from "react";

export default function useUsuario() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/dashboard", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Usuário não logado");
        return res.json();
      })
      .then((data) => setUsuario(data));
  }, []);

  return usuario;
}
    