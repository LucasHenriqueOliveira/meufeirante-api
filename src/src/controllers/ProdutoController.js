const Banco = require("../infra/Banco");

class ProdutoController {
  async listar(req, res) {
    try {
      const docs = await Banco.encontrarDocumentosFind(
        "produtos",
        {},
        { descricao: 1 }
      );
      return res.json(docs);
    } catch (e) {
     // console.log(e);
      return res.status(500).send({ message: e.message });
    }
  }
}

module.exports = new ProdutoController();
