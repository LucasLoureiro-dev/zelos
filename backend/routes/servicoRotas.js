import express from 'express';
import { criarServicoController, listarServicoPorNomeController, listarServicosController } from '../controllers/ServicosController.js';

const router = express.Router();

router.post('/', criarServicoController);

router.get('/:nome', listarServicoPorNomeController);

router.get('/', listarServicosController);

export default router;