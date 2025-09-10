import express from 'express';
import { listarNotificacoesController, verNotificacaoController, listarNotificacoesPorAreaController, listarNotificacoesPorRMController, notificacaoVistaController, criarNotificacaoController } from '../controllers/NotificacaoController.js';

const router = express.Router();

router.get('/', listarNotificacoesController);
router.get('/area/:area', listarNotificacoesPorAreaController);
router.get('/rm/:rm', listarNotificacoesPorRMController);
router.get('/vista/:rm', notificacaoVistaController);
router.post('/', criarNotificacaoController);
router.post('/vista', verNotificacaoController);

export default router;