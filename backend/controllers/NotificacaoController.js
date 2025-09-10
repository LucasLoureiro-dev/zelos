import { listarNotificacoes, listarNotificacoesPorArea, conflito, listarNotificacoesPorRM, inserirUsuario, criarNotificacao, atualizarNotificacoesVistas, notificacoesVistas } from "../models/Notificacao.js";

const listarNotificacoesController = async (req, res) => {
    try {
        const notificacao = await listarNotificacoes();
        res.status(200).json(notificacao);
    }
    catch (error) {
        console.error('Erro listando notificações:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações' });
    }
}


const listarNotificacoesPorAreaController = async (req, res) => {
    try {
        const area = req.params.area;
        const notificacao = await listarNotificacoesPorArea(area);
        res.status(200).json({ notificacao });
    }
    catch (error) {
        console.error('Erro listando notificações por area:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações por area' });
    }
}


const listarNotificacoesPorRMController = async (req, res) => {
    try {
        const rm = req.params.rm
        const notificacao = await listarNotificacoesPorRM(rm);
        res.status(200).json(notificacao);
    }
    catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações' });
    }
}

const notificacaoVistaController = async (req, res) => {
    try {
        const rm = req.params.rm;
        const notificacao = await notificacoesVistas(rm);
        res.status(200).json(notificacao);
    }
    catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações' });
    }
}

const criarNotificacaoController = async (req, res) => {
    try {
        const { rm, texto, area, cargo, id_pool } = req.body;
        const data = {
            rm: rm,
            texto: texto,
            area: area,
            cargo: cargo,
            id_pool: id_pool
        }
        const notificacao = await criarNotificacao(data);
        res.status(200).json(notificacao);
    }
    catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações' });
    }
}

const verNotificacaoController = async (req, res) => {
    try {

        const { id, rm, notificacao, cargo } = req.body;

        const repetido = await conflito(id, rm, cargo);

        if (repetido.length == 0) {
            const data = {
                rm: rm,
                notificacao: notificacao,
                cargo: cargo
            }
            const visto = await inserirUsuario(data);
            return res.status(200).json(visto);
        }
    }
    catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).json({ mensagem: 'Erro ao listar notificações' });
    }
}

export { listarNotificacoesController, listarNotificacoesPorAreaController, listarNotificacoesPorRMController, verNotificacaoController, criarNotificacaoController, notificacaoVistaController };



