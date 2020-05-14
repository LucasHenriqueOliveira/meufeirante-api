const { MongoClient } = require("mongodb");

class Banco {
  static uri =
    "mongodb://ifeirauser:covid2020ifeira@3.88.222.220:27017/ifeira?authSource=ifeira&readPreference=primary&appname=MongoDB%20Compass&ssl=false";

  static dbName = "ifeira";

  static async encontrarDocumentosFind(collectionName, filtro = {}) {
    if (typeof collectionName !== "string" || !collectionName) {
      throw new TypeError("Collectionstring não informada corretamente");
    }
    if (typeof filtro !== "object") {
      throw new TypeError("Filtro informado não é um objeto");
    }

    let client;
    let docs;
    try {
      client = await MongoClient.connect(Banco.uri);
    } catch (e) {
      throw new Banco.erros.ErroNaConexaoDoBanco(e);
    }
    try {
      const collection = client.db(Banco.dbName).collection(collectionName);
      const cursor = collection.find(filtro);
      docs = await cursor.toArray();
    } catch (e) {
      throw new Banco.erros.ErroNaConsultaAoBanco(e);
    }
    await client.close();
    if (!(docs instanceof Array)) {
      throw new TypeError("Docs de retorno não é uma Array");
    }
    return docs;
  }

  static async encontrarDocumentos(
    collectionName,
    filtro = {},
    project = null
  ) {
    if (typeof collectionName !== "string" || !collectionName) {
      throw new TypeError("Collectionstring não informada corretamente");
    }
    if (typeof filtro !== "object") {
      throw new TypeError("Filtro informado não é um objeto");
    }

    if (!project) {
      project = {
        _id: 1,
        nomeDaBarraca: 1,
        email: 1,
        telefonePrincipal: 1,
        telefonesWhatsapp: 1,
        produtos: 1,
        tiposDeProdutos: 1,
        bairrosDeEntrega: 1,
        temLocalDeAtendimento: 1,
        enderecoLocalDeAtendimento: 1,
        senha: 1,
        status: 1,
      };
    }

    let client;
    let docs;
    try {
      client = await MongoClient.connect(Banco.uri);
    } catch (e) {
      throw new Banco.erros.ErroNaConexaoDoBanco(e);
    }
    try {
      const collection = client.db(Banco.dbName).collection(collectionName);
      const cursor = collection.aggregate([
        {
          $match: filtro,
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
          $project: project,
        },
      ]);
      docs = await cursor.toArray();
    } catch (e) {
      throw new Banco.erros.ErroNaConsultaAoBanco(e);
    }
    await client.close();
    if (!(docs instanceof Array)) {
      throw new TypeError("Docs de retorno não é uma Array");
    }
    return docs;
  }

  static async gravarDocumento(collectionName, documento) {
    if (typeof collectionName !== "string" || !collectionName) {
      throw new TypeError("Collectionstring não informada corretamente");
    }
    if (typeof documento !== "object") {
      throw new TypeError("Documento informado não é um objeto");
    }

    let client;
    try {
      client = await MongoClient.connect(Banco.uri);
    } catch (e) {
      throw new Banco.erros.ErroNaConexaoDoBanco(e);
    }

    let retorno;
    try {
      const collection = client.db(Banco.dbName).collection(collectionName);
      retorno = await collection.insertOne(documento);
    } catch (e) {
      throw new Banco.erros.ErroAoGravarNoBanco(e);
    }

    if (retorno.insertedCount !== 1) {
      throw new Banco.erros.ErroQuantidadeDeGravadosIncorreta(
        1,
        retorno.insertedCount
      );
    }

    await client.close();
  }

  static async atualizarDocumento(collectionName, chave, documento) {
    if (typeof collectionName !== "string" || !collectionName) {
      throw new TypeError("Collectionstring não informada corretamente");
    }
    if (typeof chave !== "object") {
      throw new TypeError("Chave informado não é um objeto");
    }
    if (typeof documento !== "object") {
      throw new TypeError("Documento informado não é um objeto");
    }

    let client;
    try {
      client = await MongoClient.connect(Banco.uri);
    } catch (e) {
      throw new Banco.erros.ErroNaConexaoDoBanco(e);
    }

    let retorno;
    try {
      const collection = client.db(Banco.dbName).collection(collectionName);
      retorno = await collection.updateOne(chave, { $set: documento });
    } catch (e) {
      throw new Banco.erros.ErroAoAtualizarBanco(e);
    }

    if (retorno.modifiedCount !== 1) {
      throw new Banco.erros.ErroQuantidadeDeAtualizadosIncorreta(
        1,
        retorno.insertedCount
      );
    }

    await client.close();
  }
}

class ErroNaConexaoDoBanco extends Error {
  code = "ERRO_NA_CONEXAO_DO_BANCO";

  constructor(erro) {
    super("Erro ao conectar no banco de dados");
    this.erro = erro;
  }
}

class ErroNaConsultaAoBanco extends Error {
  code = "ERRO_NA_CONSULTA_AO_BANCO";

  constructor(erro) {
    super("Erro na consulta ao banco de dados");
    this.erro = erro;
  }
}

class ErroAoGravarNoBanco extends Error {
  code = "ERRO_AO_GRAVAR_NO_BANCO";

  constructor(erro) {
    super("Erro ao gravar no banco de dados");
    this.erro = erro;
  }
}

class ErroQuantidadeDeGravadosIncorreta extends Error {
  code = "ERRO_QUANTIDADE_DE_GRAVADOS_INCORRETA";

  constructor(qtdEsperada, qtdConfiramada) {
    super("Erro de registros gravados confirmados pelo banco está incorreta");
    this.qtdEsperada = qtdEsperada;
    this.qtdConfiramada = qtdConfiramada;
  }
}

class ErroAoAtualizarBanco extends Error {
  code = "ERRO_AO_ATUALIZAR_BANCO";

  constructor(erro) {
    super("Erro ao atualizar registro no banco de dados");
    this.erro = erro;
  }
}

class ErroQuantidadeDeAtualizadosIncorreta extends Error {
  code = "ERRO_QUANTIDADE_DE_ATUALIZADOS_INCORRETA";

  constructor(qtdEsperada, qtdConfiramada) {
    super(
      "Erro de registros atualizados confirmados pelo banco está incorreta"
    );
    this.qtdEsperada = qtdEsperada;
    this.qtdConfiramada = qtdConfiramada;
  }
}

Banco.erros = {
  ErroNaConexaoDoBanco,
  ErroNaConsultaAoBanco,
  ErroAoGravarNoBanco,
  ErroQuantidadeDeGravadosIncorreta,
  ErroAoAtualizarBanco,
  ErroQuantidadeDeAtualizadosIncorreta,
};

module.exports = Banco;
