const TelefoneCelular = require('./TelefoneCelular');
const TelefoneFixo = require('./TelefoneFixo');

class TelefoneFactory {

    static criar(valor){
        const string = String(valor);
        const regexDDDNumero = /(\d{2})(\d+)/;
        const matchDDDNumero = regexDDDNumero.exec(valor);
        const ddd = matchDDDNumero[1];
        const numero = matchDDDNumero[2];
        if(numero.length===9){
            return new TelefoneCelular(ddd, numero);
        }
        else if(numero.length===8){
            return new TelefoneFixo(ddd, numero);
        }
        else{
            throw new TelefoneFactory.erros.TelefoneComTamanhoInvalido("Número de telefone com tamanho inválido");
        }
    }

}

class TelefoneComTamanhoInvalido extends Error{

    code = "ERRO_TELEFONE_COM_TAMANHO_INVALIDO";

    constructor(valor){
        super("Número de telefone com tamanho inválido");
        this.valor = valor;
    }
}

TelefoneFactory.erros = {TelefoneComTamanhoInvalido};

module.exports = TelefoneFactory;