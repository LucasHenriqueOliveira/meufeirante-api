class Endereco {

    constructor(dados){
        this.logradouro = dados.logradouro;
        this.numero = dados.numero;
        this.bairro = dados.bairro;
        this.municipio = dados.municipio;
        this.uf = dados.uf;
    }

}

module.exports = Endereco;