import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const criarChamadas = async (data) => {
    try {
        return await create('chamados', data);
    }
    catch (error) {
        console.error('Erro ao criar Chamada:', error);
        throw error;
    }
}

const listarChamadas = async () => {
    try {
        return await readAll('chamados');
    }
    catch (error) {
        console.error('Erro ao listar Chamadas:', error);
        throw error;
    }
}

const listarChamadaPorTitulo = async (titulo) => {
    try {
        return await read('chamados', `titulo = ${titulo}`)
    }
    catch (error) {
        console.error('Erro ao obter Chamada por ID:', error);
        throw error;
    }
}


const listarChamadaPorTecnico = async (id) => {
    try {
        return await read('chamados', `tecnico_id = ${id}`)
    }
    catch (error) {
        console.error('Erro ao obter Chamada por ID:', error);
        throw error;
    }
}

const listarChamadaPorId = async (id) => {
    try {
        return await read('chamados', `id = ${id}`)
    }
    catch (error) {
        console.error('Erro ao obter Chamada por ID:', error);
        throw error;
    }
}

const atualizarChamada = async (id, data) => {
    try {
        return await update('chamados', data, `id = ${id}`)
    }
    catch (error) {
        console.error('Erro ao obter Usuário por ID:', error);
        throw error;
    }
}

export {
    criarChamadas,
    listarChamadas,
    listarChamadaPorTitulo,
    listarChamadaPorId,
    atualizarChamada,
    listarChamadaPorTecnico
}