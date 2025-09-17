import { criarUsuario, buscarAdm, buscarTecnico, listarTecnico } from "../models/Dashboard.js";
import {compare} from '../config/database.js';

const criarUsuarioController = async (req, res) => {
    try {

        const usuario = req.body;
        const result = await criarUsuario(usuario);
        res.status(201).json({ message: "Usuário criado com sucesso", data: result });
    } catch (error) {
        console.error("Erro criando usuário:", error);
        res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
    }
}

const buscarAdmController = async (req, res) => {
    try {
        const usuario = req.body;
        const result = await buscarAdm(usuario.username);
        if (result.length > 0) {
            const senhaCorreta = await compare(usuario.password, result[0].senha)
            if (!senhaCorreta) {
                return res.status(401).json({ message: "Senha incorreta" });
            }
            else {
               req.logIn(usuario.username, (loginErr) => {
                    if (loginErr) {
                        console.error('Erro ao criar sessão:', loginErr);
                        return res.status(500).json({ error: 'Erro ao criar sessão' });
                    }
                    req.session.userId = result[0].rm
                    req.session.userName = result[0].nome
                    req.session.isLogged = true
                    res.status(200).json({
                        message: 'Autenticado com sucesso',
                        result
                    });
                });
            }
        } else {
            res.status(404).json({ message: "Administrador não encontrado" });
        }
    } catch (error) {
        console.error("Erro buscando aministrador:", error);
        res.status(500).json({ message: "Erro ao buscar administrador", error: error.message });
    }
}


const buscarTecnicoController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await buscarTecnico(username);
        if (result.length > 0) {
            const senhaCorreta = await compare( password, result[0].senha)
            if (!senhaCorreta) {
                return res.status(401).json({ message: "Senha incorreta" });
            }
            else {
                req.logIn(username, (loginErr) => {
                    if (loginErr) {
                        console.error('Erro ao criar sessão:', loginErr);
                        return res.status(500).json({ error: 'Erro ao criar sessão' });
                    }
                    req.session.userId = result[0].rm
                    req.session.userName = result[0].nome
                    req.session.isLogged = true
                    res.status(200).json({
                        message: 'Autenticado com sucesso',
                        result
                    });
                });
            }
        } else {
            res.status(404).json({ message: "Técnico não encontrado" });
        }
    } catch (error) {
        console.error("Error buscando técnico:", error);
        res.status(500).json({ message: "Erro ao buscar administrador", error: error.message });
    }
}

const listarTecnicosController = async (req, res) => {
    try {
        const area = req.params.area;
        const result = await listarTecnico(area);
        res.status(200).json({ result });
    }
    catch {
        console.error("Erro listando técnicos:", error);
        res.status(500).json({ message: "Erro ao listar técnico", error: error.message });
    }
}

export { criarUsuarioController, buscarAdmController, buscarTecnicoController, listarTecnicosController };
