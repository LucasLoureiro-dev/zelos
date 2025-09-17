import { listarAcomoanhamentoPorID, listarAcompanhamentos, criarAcompanhamento, atualizarAcompanhamento } from "../models/Acompanhamentos.js";

const listarAcomoanhamentoPorIDController = async (req, res) => {
    try {
        const chamado_id = req.params.id;
        const acompanhamentos = await listarAcomoanhamentoPorID(chamado_id);
        res.status(200).json({ acompanhamentos });
    }
    catch (error) {
        console.error("Erro buscando acompanhamento por ID:", error);
        res.status(500).json({ message: "Erro ao buscar acompanhamento por ID", error: error.message });
    }
}

const listarAcompanhamentosController = async (req, res) => {
    try {
        const acompanhamentos = await listarAcompanhamentos();
        res.status(200).json({ acompanhamentos });
    }
    catch (error) {
        console.error("Erro buscando acompanhamentos:", error);
        res.status(500).json({ message: "Erro ao buscar acompanhamentos", error: error.message });
    }
}

const criarAcompanhamentoController = async (req, res) => {
    try {
        const { chamado_id } = req.body;

        const currentdate = new Date();
        const datetime = currentdate.toISOString().slice(0, 19).replace('T', ' ');

        const data = {
            chamado_id,
            comeco: datetime
        }
        const acompanhamentos = await criarAcompanhamento(data);
        res.status(200).json({ acompanhamentos });
    }
    catch (error) {
        console.error("Erro criando acompanhamento:", error);
        res.status(500).json({ message: "Erro ao criar acompanhamento", error: error.message });
    }
}

const atualizarAcompanhamentoController = async (req, res) => {
    try {
        const { chamado_id, comeco, fim, comentario } = req.body
        const id = req.params.id;

        let comentario_ola

        if(comentario){
            comentario_ola = comentario
        }
        else{
            comentario_ola = ''
        }
        
        const data = {
            chamado_id: chamado_id,
            comeco: new Date(comeco),
            fim: new Date(fim),
            comentario: comentario_ola
        }

        const acompanhamentos = await atualizarAcompanhamento(data, id);
        res.status(200).json({ mensagem: 'acompanhamento atualziado com sucesso' });
    }
    catch (error) {
        console.error("Erro atualizando acompanhamento:", error);
        res.status(500).json({ message: "Erro ao atualizar acompanhamento", error: error.message });
    }
}

export { criarAcompanhamentoController, listarAcomoanhamentoPorIDController, listarAcompanhamentosController, atualizarAcompanhamentoController }