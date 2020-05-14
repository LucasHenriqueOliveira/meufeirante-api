const Feirante = require("./Feirante");
const Email = require("./Email");
const TelefoneFactory = require("./telefone/TelefoneFactory");
const ListaTelefonesCelulares = require("./telefone/ListaTelefonesCelulares");
const Produto = require("./produto/Produto");
const ListaDeProdutos = require("./produto/ListaDeProdutos");
const TipoDeProduto = require("./tipoDeProduto/TipoDeProduto");
const ListaDeTiposDeProdutos = require("./tipoDeProduto/ListaDeTiposDeProdutos");
const Bairro = require("./bairro/Bairro");
const ListaDeBairros = require("./bairro/ListaDeBairros");
const Endereco = require("./Endereco");
const Senha = require("./Senha");

class FeiranteFactory {
  static async fromObject(objeto) {
    const nomeDaBarraca = objeto.nomeDaBarraca;

    const email = new Email(objeto.email);

    const telefonePrincipal = TelefoneFactory.criar(objeto.telefonePrincipal);

    const telefonesWhatsapp = new ListaTelefonesCelulares();
    objeto.telefonesWhatsapp.forEach((numero) => {
      telefonesWhatsapp.add(TelefoneFactory.criar(numero));
    });

    const produtos = new ListaDeProdutos();
    objeto.produtos.forEach((nome) => {
      produtos.add(new Produto(nome));
    });

    const tiposDeProdutos = new ListaDeTiposDeProdutos();
    objeto.tiposDeProdutos.forEach((nome) => {
      tiposDeProdutos.add(new TipoDeProduto(nome));
    });

    const bairrosDeEntrega = new ListaDeBairros();
    objeto.bairrosDeEntrega.forEach((nome) => {
      bairrosDeEntrega.add(new Bairro(nome));
    });

    //const enderecoLocalDeAtendimento = new Endereco(objeto.enderecoLocalDeAtendimento);
    const enderecoLocalDeAtendimento = objeto.enderecoLocalDeAtendimento;

    const dados = {
      nomeDaBarraca,
      email,
      telefonePrincipal,
      telefonesWhatsapp,
      produtos,
      tiposDeProdutos,
      bairrosDeEntrega,
      enderecoLocalDeAtendimento,
    };

    if (objeto.senha) {
      const senha = new Senha(objeto.senha);
      await senha.criptografar();
      dados.senha = senha;
    }

    const feirante = new Feirante(dados);

    return feirante;
  }
}

module.exports = FeiranteFactory;
