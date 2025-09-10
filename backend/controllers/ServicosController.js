import { listarServicoPorNome, listarServicos, criarServico } from "../models/Servicos.js";

const criarServicoController = async (req, res) => {
    try {
        const nome = req.body.nome;
        const servico = await criarServico(nome);
        res.status(201).json(servico);
    }
    catch (error) {
        console.error('Erro ao criar serviço:', error);
        res.status(500).json({ message: 'Erro ao criar serviço' });
    }
}

const listarServicoPorNomeController = async (req, res) => {
    try {
        const nome = req.params.nome;
        const servico = await listarServicoPorNome(nome);
        res.status(200).json(servico);
    }
    catch (error) {
        console.error('Erro ao listar serviço:', error);
        res.status(500).json({ message: 'Erro ao listar serviço' });
    }
}

const listarServicosController = async (req, res) => {
    try {
        const servicos = await listarServicos();
        res.status(200).json({ servicos });
    }
    catch (error) {
        console.error('Erro ao listar serviços:', error);
        res.status(500).json({ message: 'Erro ao listar serviços' });
    }
}

export { criarServicoController, listarServicoPorNomeController, listarServicosController };