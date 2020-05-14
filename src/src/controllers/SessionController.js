const Banco = require("../infra/Banco");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class SessionController {
  async store(req, res) {
    const { email, senha } = req.body;

    let docs;
    try {
      docs = await Banco.encontrarDocumentos(
        "feirantes",
        { email: email },
        null
      );
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
    if (!docs.length) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    if (docs.length > 1) {
      // TODO: Seria bom logar no sentry
      // Este código repete o do FeiranteController. Talvez fosse melhor ter um Repository
      console.error("Email retornou mais de um feirante", email);
      return res.status(500).send({ message: e.message });
    }

    const feirante = docs[0];

    let senhaConfere;
    try {
      const hashDaSenha = await bcrypt.hash(senha, 8);
      senhaConfere = await bcrypt.compare(senha, feirante.senha);
    } catch (e) {
      // TODO: Seria bom logar no sentry
      // Erro no bcrypt pode acontecer.
      // Retornar 401 Credenciais inválidas mascarando o erro é uma boa ideia?
      // mascarando o erro pode dificultar explorarem os erros
      // mas tb nos impedem de sermos notificados por um usuário. (mas seria melhor um Sentry)
      const message = "Erro ao verificar a senha";
      console.error(e, message);
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    if (!senhaConfere) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    delete feirante.senha;

    const dadosDoToken = { email: feirante.email, id: feirante._id };

    const token = jwt.sign(dadosDoToken, "covid6712635");

    return res.status(200).json({
      token: token,
      dados: feirante,
    });
  }
}

module.exports = new SessionController();
