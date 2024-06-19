require('dotenv').config();

const path = require('path');
// connect o express no projeto
const express = require('express');
const app = express();


// utilizando o Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname,'public'));

// Configurando o EJS
app.set('views',path.resolve(__dirname + 'src', 'views'));
app.set('view engine', 'ejs');

// conectando o banco de dados com o mongoose
const mongoose = require('mongoose');
const connectDB = process.env.CONNECTION_STRING;

mongoose.connect(connectDB)
    .then(()=>{ app.emit('conectado')})
    .catch((err)=>console.log(err));

// apos pegar o emit "Connect ele aparece a mensagem de conectado e o link do localhost"
app.on('conectado',()=> {
    app.listen(3000, ()=> {
        console.log(`Banco de Dados conectado `);
        console.log( `Acessar pelo link http://localhost:3000/`)
    });
})

// Conexao de metodos junto ao banco de dados para salvar cookies, flash mensage  e sessoes.
const session = require('express-session');// chavar o cookies do cliente no proprio computador do cliente
const flash = require('connect-flash');// Enviar mensagem de feedback ou de erro, salvos em session
const connectMongo = require('connect-mongo');// salva as sessoes na base de dados em vez do servidor porque pode consumir a memoria muito rapido

const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    store: connectMongo.create({mongoUrl:process.env.CONNECTION_STRING}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7, // salvar o cokkie por 7 dias
        httpOnly: true,
    }
});
app.use(flash());
app.use(sessionOptions)

// Buscando o arquivo de rotas
const router = require('./routers/router');
app.use(router) // usando o arquivo de rotas

// Helmet
const helmet = require('helmet');
app.use(helmet());

// CSURF
const csrf = require('csurf');
app.use(csrf());



