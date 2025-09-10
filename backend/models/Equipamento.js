import { read } from '../config/database.js';

const listarPatrimonio = async (pesquisa) => {
    try {
        return await read('equipamentos', `patrimonio like '${pesquisa}%' or equipamento like '${pesquisa}%'`);
    }
    catch (error) {
        console.error('Erro listando as notificações:', error);
        throw new Error('Falha ao listar ntoificações');
    }
}

export { listarPatrimonio } 