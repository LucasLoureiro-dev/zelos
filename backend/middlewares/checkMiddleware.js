import { read } from '../config/database.js';

const checkMiddleware = async (req, res, next) => {
  if (!req.session.isLogged) {
    return res.status(401).json({ mensagem: 'Não autorizado: Usuário não está logado' });
  }

  try {
    const usuario = await read('usuarios', `rm = ${req.session.userId}`);
    if (usuario.length > 0) {
      req.session.tipo = usuario[0].cargo;
      if (usuario[0].cargo) {
        req.session.area = usuario[0].area;
      }
    }
    else {
      req.session.tipo = 'comum';
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};

export default checkMiddleware;