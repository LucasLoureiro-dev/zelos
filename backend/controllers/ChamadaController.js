import { criarChamadas, listarChamadas, listarChamadaPorTitulo, listarChamadaPorTecnico, listarChamadaPorId, atualizarChamada } from '../models/Chamadas.js'

const criarChamadasControler = async (req, res) => {
    try {
        const { chamado, tecnico, usuario } = req.body

        const data = {
            chamado: chamado,
            tecnico_id: tecnico,
            usuario_id: usuario
        }

        const dataId = await criarChamadas(data);
        res.status(201).json({ mensagem: 'Chamada criada com sucesso', dataId });
    }
    catch (error) {
        console.error('Erro ao criar Chamada:', error);
        res.status(500).json({ mensagem: 'Erro ao criar Chamada' });
    }
}

const listarChamadaPorTecnicoController = async (req, res) => {
    try {
        const id = req.params.tecnico;
        const dataId = await listarChamadaPorTecnico(id);
        res.status(200).json(dataId);
    }
    catch (error) {
        console.error('Erro listando Chamada por técnico:', error);
        res.status(500).json({ mensagem: 'Erro ao listar Chamada' });
    }
}

const listarChamadasController = async (req, res) => {
    try {
        const chamadas = await listarChamadas();
        res.status(200).json(chamadas);
    }
    catch (error) {
        console.error('Erro listando chamadas:', error);
        res.status(500).json({ mensagem: 'Erro ao listar chamadas' });
    }
}

const listarChamadasPorIdController = async (req, res) => {
    try {
        const { id } = req.body

        const chamadas = await listarChamadaPorId(id);
        res.status(200).json({ chamadas });
    }
    catch (error) {
        console.error('Erro listando chamadas por ID:', error);
        res.status(500).json({ mensagem: 'Erro ao listar chamadas por ID' });
    }
}

const listarChamadasPorTituloController = async (req, res) => {
    try {
        const { titulo } = req.body

        const chamadas = await listarChamadaPorId(titulo);
        res.status(200).json({ chamadas });
    }
    catch (error) {
        console.error('Erro lsitando chamadas por título:', error);
        res.status(500).json({ mensagem: 'Erro ao listar chamadas por título' });
    }
}

const atualizarChamadaController = async (req, res) => {
    try {

        const id = req.params.id
        const { chamado, tecnico, usuario } = req.body

        const data = {
            chamado: chamado,
            tecnico_id: tecnico,
            usuario_id: usuario
        }

        const dataId = await atualizarChamada(id, data);
        res.status(201).json({ mensagem: 'Chamada atualizada com sucesso', dataId });
    }
    catch (error) {
        console.error('Erro atualizando Chamada:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar Chamada' });
    }
}

export { criarChamadasControler, listarChamadaPorTecnicoController, listarChamadasPorTituloController, listarChamadasController, listarChamadasPorIdController, atualizarChamadaController };