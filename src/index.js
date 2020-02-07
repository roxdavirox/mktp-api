/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

console.log(`[mktp] servindo no diretório: ${__dirname}`);
console.log('[mktp] configurando react-views');
app.set('views', path.resolve(__dirname, 'app', 'views'));
app.set('view engine', 'jsx');
const engine = require('express-react-views').createEngine();

app.engine('jsx', engine);

require('dotenv').config();

console.log('[mktp] iniciando rotas');
require('./app/controllers/index')(app);

const port = process.env.PORT || 3001;

console.log('[mktp] online na porta: ', port);
app.listen(port);
