import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.get('/layers', async (req, res) => {
  const url = 'http://localhost:8080/geoserver/rest/layers.xml';
  const auth = 'Basic ' + Buffer.from('admin:geoserver').toString('base64');

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': auth,
        'Accept': 'application/xml'
      }
    });
    const data = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(data);
  } catch (err) {
    res.status(500).send('Error al obtener capas');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server corriendo en http://localhost:${PORT}`);
});
