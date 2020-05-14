class Telefone{

    #ddd;
    #numero;

    constructor(ddd, numero){
        if(this.constructor.name === 'Telefone'){
            throw new Error("Telefone é uma classe abstrata");
        }
        if(!Telefone.validarDDD(ddd)){
            throw new Telefone.erros.DddInvalido(ddd);
        }
        this.#ddd = ddd;
        this.#numero = numero;
    }

    get ddd(){
        return this.#ddd;
    }

    get numero(){
        return this.#numero;
    }

    static validarDDD(ddd){
        return /^\d{2}$/.test(ddd);
    }

    toString(){
        return this.#ddd + this.#numero;
    }

    toJSON(){
        return this.toString();
    }

    valueOf(){
        return this.toString();
    }

}

class DddInvalido extends Error{
    
    code  = "ERROR_DDD_INVALIDO";
    
    constructor(valor){
        super("DDD inválido");
        this.valor = valor;
    }

}

class NumeroInvalido extends Error{

    code  = "ERROR_NUMERO_INVALIDO";

    constructor(valor){
        super("Numero inválido");
        this.valor = valor;
    }

}

Telefone.erros = {DddInvalido, NumeroInvalido};

module.exports = Telefone;