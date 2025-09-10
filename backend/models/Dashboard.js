import { read, create } from '../config/database.js';

const criarUsuario = async (usuario) => {
    try {
        return await create('usuarios', usuario);
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

const buscarAdm = async (id) => {
    try {
        return await read('usuarios', `rm = ${id} and cargo = 'adm'`);
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

const buscarTecnico = async (id) => {
    try {
        return await read('usuarios', `rm = ${id} and cargo = 'tecnico'`);
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

const listarTecnico = async (area) => {
    try {
        if (area == 1) {
            return await read('usuarios', `cargo = 'tecnico'`);
        }
        else {
            return await read('usuarios', `cargo = 'tecnico' and area = ${area}`);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export { criarUsuario, buscarAdm, buscarTecnico, listarTecnico };