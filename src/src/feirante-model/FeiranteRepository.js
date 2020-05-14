const Feirante = require("./Feirante");
const Banco = require("./infra/Banco");
const ObjectID = require("mongodb").ObjectID;
const FeiranteFactory = require("./FeiranteFactory");

const { MongoClient } = require("mongodb");

class FeiranteRepository {
  static async gravar(feirante) {
    if (!(feirante instanceof Feirante)) {
      throw new TypeError("Feirante não é uma instância correta");
    }
    const docs = await Banco.encontrarDocumentos("feirantes", {
      email: String(feirante.email),
    });
    if (docs.length) {
      throw new FeiranteRepository.erros.ErroConstaFeiranteComEmailInformado();
    }
    await Banco.gravarDocumento("feirantes", feirante.document);
  }

  static async atualizar(id, feirante) {
    if (!(feirante instanceof Feirante)) {
      throw new TypeError("Feirante não é uma instância correta");
    }

    const objId = new ObjectID(id);

    return await Banco.atualizarDocumento(
      "feirantes",
      { _id: objId },
      feirante.document
    );
  }

  static async buscarPorId(id) {
    id = String(id).trim();
    if (!id) {
      throw new TypeError("Id não informado");
    }
    const objId = new ObjectID(id);
    const docs = await Banco.encontrarDocumentos(
      "feirantes",
      { _id: objId },
      { senha: 0 }
    );

    if (docs.length > 1) {
      throw new FeiranteRepository.erros.ErroIdRetornouMaisDeUmFeirante();
    }

    return docs;
  }

  static async buscarPorIdBairro(idBairro) {
    idBairro = String(idBairro).trim();

    if (!idBairro) {
      throw new TypeError("idBairro não informado");
    }
    const docs = await Banco.encontrarDocumentos(
      "feirantes",
      { bairrosDeEntrega: idBairro },
      { senha: 0 }
    );

    const feirantes = [];
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];

      //delete doc.senha; // PREOCUPAÇÃO: ter que deletar a senha todo lugar que consultar... se esquecer pode acabar retornando a senha para o front
      // não seria melhor criar um model que não tivesse a senha?

      //const feirante = await FeiranteFactory.fromObject(doc);
      //feirantes.push(feirante);
      feirantes.push(doc);
    }
    return feirantes;
  }

  static async pesquisa(dados) {
    let client;
    let docs;
    try {
      client = await MongoClient.connect(Banco.uri);
    } catch (e) {
      throw new Banco.erros.ErroNaConexaoDoBanco(e);
    }
    try {
      const collection = client.db(Banco.dbName).collection("feirantes");

      let parametros = [{ status: "ativo" }];

      if (dados.municipio) {
        parametros.push({ "bairrosDeEntrega.municipio": dados.municipio });
      }

      if (dados.bairros) {
        parametros.push({ "bairrosDeEntrega._id": { $in: dados.bairros } });
      }

      if (dados.produtos) {
        parametros.push({ "produtos._id": { $in: dados.produtos } });
      }

      if (dados.tiposDeProdutos) {
        parametros.push({
          "tiposDeProdutos._id": { $in: dados.tiposDeProdutos },
        });
      }

      //console.log(parametros);

      const cursor = collection.aggregate([
        {
          $match: { $and: [{ status: "ativo" }] },
        },
        {
          $lookup: {
            from: "produtos",
            localField: "produtos",
            foreignField: "_id",
            as: "produtos",
          },
        },
        {
          $lookup: {
            from: "tiposProdutos",
            localField: "tiposDeProdutos",
            foreignField: "_id",
            as: "tiposDeProdutos",
          },
        },
        {
          $lookup: {
            from: "bairros",
            localField: "bairrosDeEntrega",
            foreignField: "_id",
            as: "bairrosDeEntrega",
          },
        },
        {
          $match: {
            $and: parametros,
          },
        },
        {
          $project: { senha: 0 },
        },
      ]);
      docs = await cursor.toArray();
    } catch (e) {
      //console.log(e);
      throw new Banco.erros.ErroNaConsultaAoBanco(e);
    }
    await client.close();
    if (!(docs instanceof Array)) {
      throw new TypeError("Docs de retorno não é uma Array");
    }

    const feirantes = [];
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      feirantes.push(doc);
    }
    return feirantes;
  }
}

class ErroConstaFeiranteComEmailInformado extends Error {
  code = "ERRO_CONSTA_FEIRANTE_COM_O_EMAIL_INFORMADO";

  constructor() {
    super("Já consta feirante com o email informado");
  }
}

class ErroIdRetornouMaisDeUmFeirante extends Error {
  code = "ERRO_ID_RETORNOU_MAIS_DE_UM_FEIRANTE";

  constructor() {
    super("Id retornou mais de um feirante");
  }
}

FeiranteRepository.erros = {
  ErroConstaFeiranteComEmailInformado,
  ErroIdRetornouMaisDeUmFeirante,
};

module.exports = FeiranteRepository;
