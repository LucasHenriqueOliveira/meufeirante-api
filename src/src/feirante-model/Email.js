class Email {

    #local;
    #domain;
    //de acordo com: https://en.wikipedia.org/wiki/Email_address
    #regex = /([a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]+)@([a-zA-Z0-9-.]+)/;

    constructor(valor) {
        valor = valor.trim();
        const match = this.#regex.exec(valor)
        if (!match) {
            throw new Email.erros.EmailInvalidoError(valor);
        }
        this.#local = match[1];
        this.#domain = match[2];
    }

    get local(){
        return this.#local;
    }

    get domain(){
        return this.#domain;
    }

    get completo() {
        return this.#local + '@' + this.#domain;
    }

    static validar(valor) {
        return this.#regex.test(valor);
    }

    toString() {
        return this.completo;
    }

    toJSON(){
        return this.completo;
    }

    valueof(){
        return this.completo;
    }

}

class EmailInvalidoError extends Error{

    code = "ERR_EMAIL_INVALIDO";

    constructor(valor) {
        super("Email inválido");
        this.valor = valor;
    }

}

Email.erros = { EmailInvalidoError };

module.exports = Email;