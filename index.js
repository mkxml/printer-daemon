const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const { print, getPrinterName } = require('./printer');

const privateKey = fs.readFileSync(
  path.join(__dirname, 'certs/key.pem'),
  'utf8'
);
const certificate = fs.readFileSync(
  path.join(__dirname, 'certs/cert.pem'),
  'utf8'
);
const credentials = { key: privateKey, cert: certificate };

const { PORT = 9222 } = process.env;

(async function server() {
  const corsOptions = {
    origin: 'https://mkxml.github.io/web-zpl-printer-daemon',
    optionsSucessStatus: 200,
  };

  const app = express();

  app.use(compression());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  app.get('/status', (req, res) => {
    res.json({ healthy: true, printerName: getPrinterName() });
  });

  app.post('/print', async (req, res) => {
    const { zpl } = req.body;
    await print(zpl);
    res.status(200).send();
  });

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT);
})();
