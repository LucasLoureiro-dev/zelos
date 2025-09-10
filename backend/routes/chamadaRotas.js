import express from 'express';
import { listarChamadasController, listarChamadaPorTecnicoController , listarChamadasPorTituloController, criarChamadasControler, atualizarChamadaController } from '../controllers/ChamadaController.js';

const router = express.Router();


router.get('/', listarChamadasController);
router.get('/tecnico/:tecnico', listarChamadaPorTecnicoController);
router.get('/:titulo', listarChamadasPorTituloController);
router.post('/', criarChamadasControler);
router.put('/:id', atualizarChamadaController);

export default router;