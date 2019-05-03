const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('ok');
});

require('./app/controllers/index')(app);

const port = process.env.PORT || 3000;

app.listen(port);
