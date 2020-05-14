const bcrypt = require("bcryptjs");

class Senha {
  #valor;
  #valorEncriptado;

  constructor(valor) {
    if (typeof valor !== "string") {
      throw new TypeError("Valor não é uma instância correta");
    }
    const tamanhoValido = /^[a-zA-Z0-9]{8}$/.test(valor);
    const temLetras = /[a-zA-Z]/.test(valor);
    const temNumeros = /[0-9]/.test(valor);

    const valido = true; //tamanhoValido && temLetras && temNumeros;

    if (!valido) {
      throw new Senha.erros.SenhaInvalida();
    }

    this.#valor = valor;
  }

  async criptografar() {
    if (!this.#valorEncriptado) {
      const hash = await bcrypt.hash(this.#valor, 8);
      this.#valorEncriptado = hash;
    }
  }

  get criptografada() {
    if (!this.#valorEncriptado) {
      throw new Senha.erros.ErroSenhaNaoCriptografada();
    }
    return this.#valorEncriptado;
  }

  valueOf() {
    return this.criptografada;
  }

  toString() {
    return this.criptografada;
  }

  toJSON() {
    return this.criptografada;
  }
}

class SenhaInvalida extends Error {
  code = "ERRO_SENHA_INVALIDA";

  constructor() {
    super("Senha inválida");
  }
}

class ErroSenhaNaoCriptografada extends Error {
  code = "ERRO_SENHA_NAO_CRIPTOGRAFADA";

  constructor() {
    super(
      "Senha não criptografada. Executar a função criptografar antes de requisitar o valor."
    );
  }
}

Senha.erros = { SenhaInvalida, ErroSenhaNaoCriptografada };

module.exports = Senha;
