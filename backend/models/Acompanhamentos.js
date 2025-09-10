import { read, readAll, create, update } from '../config/database.js';

const listarAcompanhamentos = async () => {
    try {
        return await readAll('apontamentos');
    }
    catch (error) {

    }
}

const listarAcomoanhamentoPorID = async (id) => {
    try {
        return await read('apontamentos', `id_chamado = ${id}`);
    }
    catch (error) {
        console.error('Erro ao listar Chamadas:', error);
        throw error;
    }
}

const criarAcompanhamento = async (data) => {
    try {
        return await create('apontamentos', data);
    }
    catch (error) {
        console.error('Erro ao listar Chamadas:', error);
        throw error;
    }
}

const atualizarAcompanhamento = async (data, id) => {
    try {
        return await update('apontamentos', data, `id = ${id}`)
    }
    catch (error) {
        console.error('Erro ao atualizar Chamada:', error);
        throw error;
    }
}

export { listarAcomoanhamentoPorID, listarAcompanhamentos, criarAcompanhamento, atualizarAcompanhamento }