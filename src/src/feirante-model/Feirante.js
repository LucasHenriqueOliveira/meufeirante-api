const Email = require("./Email");
const Telefone = require("./telefone/Telefone");
const ListaTelefonesCelulares = require("./telefone/ListaTelefonesCelulares");
const ListaDeProdutos = require("./produto/ListaDeProdutos");
const ListaDeTiposDeProdutos = require("./tipoDeProduto/ListaDeTiposDeProdutos");
const ListaDeBairros = require("./bairro/ListaDeBairros");
const Endereco = require("./Endereco");
const Senha = require("./Senha");

class Feirante {
  #nomeDaBarraca;
  #email;
  #telefonePrincipal;
  #telefonesWhatsapp;
  #listaDeProdutos;
  #listaDeTiposDeProdutos;
  #bairrosDeEntrega;
  #enderecoLocalDeAtendimento;
  #senha;
  #status = "ativo";

  constructor(dados) {
    this.#setNomeDaBarraca(dados.nomeDaBarraca);
    this.#setEmail(dados.email);
    this.#setTelefonePrincipal(dados.telefonePrincipal);
    this.#setTelefonesWhatsapp(dados.telefonesWhatsapp);
    this.#setListaDeProdutos(dados.produtos);
    this.#setTiposDeProdutos(dados.tiposDeProdutos);
    this.#setBairrosDeEntrega(dados.bairrosDeEntrega);
    this.#setEnderecoLocalDeAtendimento(dados.enderecoLocalDeAtendimento);
    if (dados.senha) {
      this.#setSenha(dados.senha);
    }
  }

  // NomeDaBarraca =====================================>

  #setNomeDaBarraca = function (nome) {
    if (!nome || typeof nome !== "string") {
      throw new TypeError("Nome não é uma string");
    }

    nome = nome.trim();

    if (!nome || !nome.length > 5) {
      throw new TypeError("O nome precisa ter no mínimo 5 letras");
    }

    this.#nomeDaBarraca = nome;
  };

  get nomeDaBarraca() {
    return this.#nomeDaBarraca;
  }

  // Email ==============================================>

  #setEmail = function (email) {
    if (!(email instanceof Email)) {
      throw new TypeError("Email não é uma instância correta");
    }
    this.#email = email;
  };

  get email() {
    return this.#email;
  }

  // TelefonePrincipal ==================================>

  #setTelefonePrincipal = function (telefone) {
    if (!(telefone instanceof Telefone)) {
      throw new TypeError("Telefone não é uma instância correta");
    }
    this.#telefonePrincipal = telefone;
  };

  get telefonePrincipal() {
    return this.#telefonePrincipal;
  }

  // TelefonesWhatsapp ==================================>

  #setTelefonesWhatsapp = function (listaTelefones) {
    if (!(listaTelefones instanceof ListaTelefonesCelulares)) {
      throw new TypeError("ListaTelefones não é uma instância correta");
    }
    this.#telefonesWhatsapp = listaTelefones;
  };

  get telefonesWhatsapp() {
    return this.#telefonesWhatsapp.telefones;
  }

  // Produtos ===========================================>

  #setListaDeProdutos = function (listaDeProdutos) {
    if (!(listaDeProdutos instanceof ListaDeProdutos)) {
      throw new TypeError("ListaDeProdutos não é uma instância correta");
    }
    this.#listaDeProdutos = listaDeProdutos;
  };

  get produtos() {
    return this.#listaDeProdutos.produtos;
  }

  // TiposDeProdutos =====================================>

  #setTiposDeProdutos = function (tipos) {
    if (!(tipos instanceof ListaDeTiposDeProdutos)) {
      throw new TypeError("Tipos não é uma instância correta");
    }
    this.#listaDeTiposDeProdutos = tipos;
  };

  get tiposDeProdutos() {
    return this.#listaDeTiposDeProdutos.tiposDeProdutos;
  }

  // Bairros =============================================>

  #setBairrosDeEntrega = function (bairros) {
    if (!(bairros instanceof ListaDeBairros)) {
      throw new TypeError("ListaDeBairros não é uma instância correta");
    }
    this.#bairrosDeEntrega = bairros;
  };

  get bairrosDeEntrega() {
    return this.#bairrosDeEntrega.bairros;
  }

  // EnderecoLocalDeAtendimento ===========================>

  #setEnderecoLocalDeAtendimento = function (endereco) {
    // if(!(endereco instanceof Endereco)){
    //   throw new TypeError('Endereço não é uma instância correta');
    //}
    this.#enderecoLocalDeAtendimento = endereco;
  };

  get enderecoLocalDeAtendimento() {
    return this.#enderecoLocalDeAtendimento;
  }

  // TemLocalDeAtendimento ================================>

  get temLocalDeAtendimento() {
    return !!this.#enderecoLocalDeAtendimento;
  }

  // Senha ==============================================>

  #setSenha = function (senha) {
    if (!(senha instanceof Senha)) {
      throw new TypeError("Senha não é uma instância correta");
    }
    this.#senha = senha;
  };

  get senha() {
    if (this.#senha) {
      return this.#senha.criptografada;
    }
  }

  // Status =============================================>

  get status() {
    return this.#status;
  }

  toJSON() {
    return {
      nomeDaBarraca: this.nomeDaBarraca,
      email: this.email,
      telefonePrincipal: this.telefonePrincipal,
      telefonesWhatsapp: this.telefonesWhatsapp,
      produtos: this.produtos,
      tiposDeProdutos: this.tiposDeProdutos,
      bairrosDeEntrega: this.bairrosDeEntrega,
      temLocalDeAtendimento: this.temLocalDeAtendimento,
      enderecoLocalDeAtendimento: this.enderecoLocalDeAtendimento,
      senha: this.senha,
      status: this.status,
    };
  }

  // Retornar um objeto literal com os valores para o npm do mongodb conseguir gravar
  // por algum motivo ao passar o objeto criado pela classe ele parece não gravar
  get document() {
    return JSON.parse(JSON.stringify(this));
  }
}

module.exports = Feirante;
