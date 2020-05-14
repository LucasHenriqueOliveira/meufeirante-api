class TipoDeProduto{

    #nome;

    constructor(nome){

        if(typeof nome !== 'string'){
            throw new TypeError('Nome informado não é uma string');
        }
        
        const nomeTrim = nome.trim();

        if(nomeTrim.length <= 3){
            throw new TypeError('Nome do TipoDeProduto deve ser ter mais de três letras');
        }

        this.#nome = nomeTrim;

    }

    get nome(){
        return this.#nome;
    }

    valueOf(){
        return this.#nome;
    }

    toString(){
        return this.#nome;
    }

    toJSON(){
        return this.#nome;
    }

}

module.exports = TipoDeProduto;