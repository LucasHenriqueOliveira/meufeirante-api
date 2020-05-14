const Bairro = require('./Bairro');

class ListaDeBairros{

    #bairros = [];

    add(bairro){
        if(!(bairro instanceof Bairro)){
            throw new TypeError("Bairro não é uma instância correta");
        }
        this.#bairros.push(bairro);
    }

    get bairros(){
        return [...this.#bairros];
    }

}

module.exports = ListaDeBairros;