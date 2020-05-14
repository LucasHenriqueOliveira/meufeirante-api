const TelefoneCelular = require('./TelefoneCelular');

class ListaTelefonesCelulares{

    #telefonesCelulares = [];

    add(telefone){
        if(!(telefone instanceof TelefoneCelular)){
            throw new TypeError("Telefone não é uma instância correta");
        }
        this.#telefonesCelulares.push(telefone);
    }

    get telefones(){
        return [...this.#telefonesCelulares];
    }

}

module.exports = ListaTelefonesCelulares;