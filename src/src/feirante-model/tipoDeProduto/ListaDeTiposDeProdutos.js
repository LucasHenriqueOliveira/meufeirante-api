const TipoDeProduto = require('./TipoDeProduto');

class ListaDeTiposDeProdutos{

    #tiposDeProdutos = [];

    add(tipoDeProduto){
        if(!(tipoDeProduto instanceof TipoDeProduto)){
            throw new TypeError("TipoDeProduto não é uma instância correta");
        }
        this.#tiposDeProdutos.push(tipoDeProduto);
    }

    get tiposDeProdutos(){
        return [...this.#tiposDeProdutos];
    }

}

module.exports = ListaDeTiposDeProdutos;