import express from 'express';
import { criarUsuarioController, buscarTecnicoController, listarTecnicosController } from '../controllers/dashboardController.js';
import checkMiddleware from '../middlewares/checkMiddleware.js';

const router = express.Router();

router.get('/tecnico/:area', listarTecnicosController);

router.get('/', checkMiddleware, (req, res) => {
    if (req.session.isLogged) {
        if (req.session.area) {
            res.status(200).json({
                rm: req.session.userId,
                nome: req.session.userName,
                cargo: req.session.tipo,
                area: req.session.area
            });
        }
        else {
            res.status(200).json({
                rm: req.session.userId,
                nome: req.session.userName,
                cargo: req.session.tipo
            });
        }
    }
    else {
        res.status(401).json({
            mensagem: "Usuário não logado",
        });
    }
});
router.post('/', criarUsuarioController);

export default router;