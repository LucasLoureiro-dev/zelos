import { read, readAll, create } from '../config/database.js';

const listarServicoPorNome = async (nome) => {
  try {
    const servicos = await read('servicos', `nome = ${nome}`);
    return servicos;
  } catch (error) {
    console.error('Erro ao listar serviço:', error);
    throw error;
  }
};


const listarServicos = async () => {
  try {
    const servicos = await readAll('servicos');
    return servicos;
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    throw error;
  }
};

const criarServico = async (servico) => {
  try {
    const novoServico = await create('servicos', servico);
    return novoServico;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

export { listarServicoPorNome, listarServicos, criarServico };