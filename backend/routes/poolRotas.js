import express from 'express';
import { criarPoolController, poolPorIdController, lerPoolPorTipoController, lerTodasPoolsController, atualizarPoolController, lerPatrimonioController, buscarPoolPorUsuarioController } from '../controllers/PoolController.js';

const router = express.Router();

router.post('/', criarPoolController);

router.get('/tipo/:tipo', lerPoolPorTipoController);

router.get('/patrimonio/:patrimonio', lerPatrimonioController);

router.get('/usuario/:rm', buscarPoolPorUsuarioController);

router.get('/', lerTodasPoolsController);

router.get('/:id', poolPorIdController);

router.put('/:id', atualizarPoolController);


export default router;