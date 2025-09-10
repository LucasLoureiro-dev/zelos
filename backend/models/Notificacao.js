import { create, read, readAll, update } from '../config/database.js';

const listarNotificacoes = async () => {
    try {
        return await readAll('notificacao');
    }
    catch (error) {
        console.error('Erro listando as notificações:', error);
        throw new Error('Falha ao listar ntoificações');
    }
}

const listarNotificacoesPorRM = async (rm) => {
    try {
        return await read('notificacao', `rm = ${rm}`);
    }
    catch (error) {
        console.error('Erro listando as notificações por RM:', error);
        throw new Error('Falha ao listar ntoificações por RM');
    }
}

const listarNotificacoesPorArea = async (area) => {
    try {
        return await read('notificacao', `area = ${area}`);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

const criarNotificacao = async (data) => {
    try {
        return await create('notificacao', data);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

const notificacoesVistas = async (rm) => {
    try {
        return await read('notificacao_usuario', `rm = ${rm}`);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

const conflito = async (id, rm, cargo) => {
    try {
        return await read('notificacao_usuario', `notificacao = ${id} and rm = ${rm} and cargo = '${cargo}'`);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

const atualizarNotificacoesVistas = async (rm) => {
    try {
        return await update('notificacao_usuario', `rm = ${rm}`);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

const inserirUsuario = async (data) => {
    try {
        return await create('notificacao_usuario', data);
    }
    catch (error) {
        console.error('Erro ao listar notificação por area:', error);
        throw new Error('Falha ao listar ntoificações por area');
    }
}

export { listarNotificacoes, conflito, listarNotificacoesPorArea, listarNotificacoesPorRM, criarNotificacao, notificacoesVistas, atualizarNotificacoesVistas, inserirUsuario }