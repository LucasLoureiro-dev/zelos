import { criarPool, lerTodasPools, poolPorId, lerPoolPorTipo, atualizarPool, lerPatrimonio, buscarPoolPorUsuario } from "../models/Pool.js";

const criarPoolController = async (req, res) => {
  try {
    const { patrimonio, titulo, descricao, tipoServico, servico } = req.body;
    let set_patrimonio;

    if(!patrimonio){
      set_patrimonio = ''
    }
    else{
      set_patrimonio = patrimonio
    }

    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 19).replace('T', ' ');

    let outro

    if (!servico) {
      outro = '';
    }
    else {
      outro = servico
    }

    const data = {
      patrimonio: set_patrimonio,
      titulo: titulo,
      descricao: descricao,
      tipo: tipoServico,
      estado: 'pendente',
      criado_em: datetime,
      atualizado_em: datetime,
      criado_por: req.session.userId,
      outro: outro
    }

    const pool = await criarPool(data);
    res.status(201).json({ message: 'Pool criada com sucesso', id: pool });
  } catch (error) {
    console.error('Erro ao criar Pool:', error);
    res.status(500).json({ message: 'Falha ao criar Pool' });
  }
};

const poolPorIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPorId(id);

    res.status(200).json({ pool });
  }
  catch (error) {
    console.error('Erro ao criar Pool:', error);
    res.status(500).json({ message: 'Falha ao criar Pool' });
  }
}

const lerPoolPorTipoController = async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const pools = await lerPoolPorTipo(tipo);
    if (pools) {
      res.status(200).json(pools);
    } else {
      res.status(404).json({ message: 'Nenhuma Pool encontrada para este tipo' });
    }
  }
  catch (error) {
    console.error('Erro ao ler Pool por tipo:', error);
    res.status(500).json({ message: 'Erro ao ler Pool por tipo' });
  }
}

const lerPatrimonioController = async (req, res) => {
  try {
    const patrimonio = req.params.patrimonio;
    const pool = await lerPatrimonio(patrimonio);
    if (pool.length > 0) {
      res.status(200).json(pool);
    }
    else {
      res.status(404).json({ message: 'Patrimônio não encontrado' });
    }
  }
  catch (error) {
    console.error('Erro ao ler Patrimônio:', error);
    res.status(500).json({ message: 'Erro ao ler Patrimônio' });
  }
}

const lerTodasPoolsController = async (req, res) => {
  try {
    const pools = await lerTodasPools();
    res.status(200).json(pools);
  } catch (error) {
    console.error('Erro ao listar Pools:', error);
    res.status(500).json({ message: 'Erro ao listar Pools' });
  }
};

const atualizarPoolController = async (req, res) => {
  try {
    const poolId = req.params.id;
    const { patrimonio, titulo, descricao, tipo, estado, criado_por, criado_em, outro, tipo1 } = req.body;
    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 19).replace('T', ' ');
    const criado = new Date(criado_em);
    let outroServico

    if (tipo1) {
      outroServico = outro;
    }
    else {
      outroServico = '';
    }

    const data = {
      patrimonio: patrimonio,
      titulo: titulo,
      descricao: descricao,
      tipo: tipo,
      estado: estado,
      atualizado_em: datetime,
      criado_por: criado_por,
      criado_em: criado,
      outro: outroServico
    }

    const pool = await atualizarPool(poolId, data);
    res.status(200).json({ message: 'Pool atualizada com sucesso' });
  }
  catch (error) {
    console.error('Erro ao atualizar Pool:', error);
    res.status(500).json({ message: 'Erro ao atualizar Pool' });
  }
};

const buscarPoolPorUsuarioController = async (req, res) => {
  try {
    const usuario = req.params.rm;
    const pools = await buscarPoolPorUsuario(usuario);
    if (pools) {
      res.status(200).json(pools);
    } else {
      res.status(404).json({ message: 'Nenhuma Pool encontrada para este usuário' });
    }
  }
  catch (error) {
    console.error('Erro ao buscar Pool por usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar Pool por usuário' });
  }
}

export {
  criarPoolController,
  lerTodasPoolsController,
  atualizarPoolController,
  lerPatrimonioController,
  buscarPoolPorUsuarioController,
  lerPoolPorTipoController,
  poolPorIdController
};