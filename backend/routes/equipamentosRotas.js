import express from 'express';
import { listarPatrimoniosController } from '../controllers/EquipamentoController.js';
const router = express.Router();

router.get('/:pesquisa', listarPatrimoniosController);

export default router;