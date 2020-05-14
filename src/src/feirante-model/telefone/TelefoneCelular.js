const Telefone = require('./Telefone');

class TelefoneCelular extends Telefone{

    constructor(ddd, numero){
        super(ddd, numero);

        if(!TelefoneCelular.validarNumero(numero)){
            throw new Telefone.erros.NumeroInvalido(numero);
        }
    }

    static validarNumero(numero){
        const somenteNumeros = /^\d{9}$/.test(numero);
        const comecaComNove = /^9/.test(numero);
        return somenteNumeros && comecaComNove;
    }

}

module.exports = TelefoneCelular;