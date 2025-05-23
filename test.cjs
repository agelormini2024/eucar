process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const https = require('https');
const fs = require('fs');

const url = 'https://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/ICL2024.xls';

const file = fs.createWriteStream('ICL2024.xls');
https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Descarga OK y archivo guardado como ICL2024.xls');
  });
}).on('error', (err) => {
  fs.unlink('ICL2024.xls', () => {});
  console.error('Error:', err.message);
});