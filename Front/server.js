//Install express server
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();
const appName = 'OctaEventos';

const outputPath = `${__dirname}/dist/${appName}`;

// Serve only the static files form the dist directory
app.use(express.static(outputPath));

app.get('/*', (req, res) => {
    res.sendFile(`${outputPath}/index.html`);
  });

// Start the app by listening on the default Heroku port
app.listen(PORT, () => {
  console.log('Servidor iniciado na porta' + PORT);
});
