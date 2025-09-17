import { listarPatrimonio } from '../models/Equipamento.js';

const listarPatrimoniosController = async (req, res) => {
    try {
        const pesquisa = req.params.pesquisa;

        const result = await listarPatrimonio(pesquisa);

        if (result.length > 0) {
            res.status(200).json({ result });
        }
        else {
            res.status(404).json({ message: "Não foi encontrado nenhum patrimônio com este nome" });
        }

    }
    catch (error) {
        console.error('Erro listando patrimônios:', error);
        throw new Error('Erro ao listar patrimônios');
    }
}

export { listarPatrimoniosController }