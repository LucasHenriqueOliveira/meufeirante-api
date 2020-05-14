const Produto = require('./Produto');

class ListaDeProdutos{

    #produtos = [];

    add(produto){
        if(!(produto instanceof Produto)){
            throw new TypeError("Produto não é uma instância correta");
        }
        this.#produtos.push(produto);
    }

    get produtos(){
        return [...this.#produtos];
    }

}

module.exports = ListaDeProdutos;