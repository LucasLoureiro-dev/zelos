import { read, readAll, create, update } from '../config/database.js';

const poolPorId = async (id) => {
  try {
    return await read('pool', `id = ${id}`);
  }
  catch (error) {
    console.error('Erro lendo Pool:', error);
    throw new Error('Falha ao ler Pool');
  }
}

const criarPool = async (data) => {
  try {
    return await create('pool', data);
  }
  catch (error) {
    console.error('Erro criando Pool:', error);
    throw new Error('Falha ao criar Pool');
  }
}

const lerPoolPorTipo = async (tipo) => {
  try {
    return await read('pool', `tipo = '${tipo}' or tipo = 1`);
  }
  catch (error) {
    console.error('Erro lendo Pool por tipo:', error);
    throw new Error('Falha ao ler Pool por tipo');
  }
}

const lerPatrimonio = async (patrimonio) => {
  try {
    console.log(patrimonio)
    return await read('pool', `patrimonio = ${patrimonio}`);
  } catch (error) {
    console.error('Erro lendo Pool:', error);
    throw new Error('Falha ao ler Pool');
  }
}

const lerTodasPools = async () => {
  try {
    return await readAll('pool');
  } catch (error) {
    console.error('Erro lendo todas Pools:', error);
    throw new Error('Falha ao ler todas Pools');
  }
}

const atualizarPool = async (id, data) => {
  try {
    return await update('pool', data, `id = ${id}`);
  } catch (error) {
    console.error('Erro atualizando Pool:', error);
    throw new Error('Falha ao atualizar Pool');
  }
}

const buscarPoolPorUsuario = async (usuario) => {
  try {
    return await read('pool', `criado_por = '${usuario}'`);
  }
  catch (error) {
    console.error('Erro buscando Pool por usuário:', error);
    throw new Error('Falha ao buscar Pool por usuário');
  }
}

export { criarPool, poolPorId, lerPoolPorTipo, lerTodasPools, lerPatrimonio, atualizarPool, buscarPoolPorUsuario };