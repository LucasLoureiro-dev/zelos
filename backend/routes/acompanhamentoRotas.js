import { listarAcomoanhamentoPorIDController, listarAcompanhamentosController, criarAcompanhamentoController, atualizarAcompanhamentoController } from "../controllers/AcompanhamentoController.js";
import express from 'express';
const router = express.Router();

router.get('/', listarAcompanhamentosController);
router.get('/:id', listarAcomoanhamentoPorIDController);
router.post('/', criarAcompanhamentoController);
router.put('/:id', atualizarAcompanhamentoController)

export default router