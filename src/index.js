const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.set('views', `${__dirname}/views`);
app.set('view engine', 'jsx');
const engine = require('express-react-views').createEngine();

app.engine('jsx', engine);

require('dotenv').config();

require('./app/controllers/index')(app);

const port = process.env.PORT || 3001;

app.listen(port);
