require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const IFeiraWS = require('./src/IFeiraWS');

const porta = process.env.PORT || 3000;

const iFeiraWS = new IFeiraWS();
iFeiraWS.ouvir(porta);

console.log(`Ouvindo na porta ${porta}`);