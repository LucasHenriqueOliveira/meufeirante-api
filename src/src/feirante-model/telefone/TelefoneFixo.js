const Telefone = require('./Telefone');

class TelefoneFixo extends Telefone{

    constructor(ddd, numero){
        super(ddd, numero);

        if(!TelefoneFixo.validarNumero(numero)){
            throw new Telefone.erros.NumeroInvalido(numero);
        }
    }

    static validarNumero(numero){
        const somenteNumeros = /^\d{8}$/.test(numero);
        const naoComecaComNove = !(/^[9]/.test(numero));
        return somenteNumeros && naoComecaComNove;
    }

}

module.exports = TelefoneFixo;