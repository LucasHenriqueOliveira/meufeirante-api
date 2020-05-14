const { FeiranteFactory, FeiranteRepository } = require("../feirante-model");

const bcrypt = require("bcryptjs");

class FeiranteController {
  async gravar(req, res) {
    try {
      const feirante = await FeiranteFactory.fromObject(req.body);
      await FeiranteRepository.gravar(feirante);
      return res.status(201).send();
    } catch (e) {
      if (
        e instanceof
        FeiranteRepository.erros.ErroConstaFeiranteComEmailInformado
      ) {
        return res.status(403).json({ message: e.message });
      }
      if (e instanceof TypeError) {
        return res.status(400).json({ message: e.message });
      }
      return res.status(500).send({ message: e.message });
    }
  }

  async ler(req, res) {
    const { idFeirante } = req.params;
    try {
      const feirante = await FeiranteRepository.buscarPorId(idFeirante);
      return res.status(200).json(feirante);
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  }

  async atualizar(req, res) {
    try {
      if (req.id !== req.body._id) {
        return res
          .status(500)
          .send({ message: "Token Inválido para a operação desejada" });
      }

      const feirante = await FeiranteFactory.fromObject(req.body);

      await FeiranteRepository.atualizar(req.id, feirante);
      const feiranteAtualizado = await FeiranteRepository.buscarPorId(req.id);

      return res.status(200).send({
        ok: true,
        message: "Operação concluída com sucesso",
        dados: feiranteAtualizado,
      });
    } catch (e) {
      if (e.message == "Nenhum campo foi alterado!") {
        return res.status(200).send({ ok: false, message: e.message });
      }

      return res.status(500).send({ message: e.message });
    }
  }

  async listarPorBairro(req, res) {
    const { idBairro } = req.params;
    try {
      const feirantes = await FeiranteRepository.buscarPorIdBairro(idBairro);
      return res.status(200).json(feirantes);
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  }

  async pesquisa(req, res) {
    const dados = req.body;

    try {
      const feirantes = await FeiranteRepository.pesquisa(dados);
      return res.status(200).json(feirantes);
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  }
}

module.exports = new FeiranteController();
