import axios from 'axios';
import { write } from 'fs';
import { Transform, Writable } from 'stream';

const CBASE_URL = 'http://localhost:3000';

async function consume() {
  const response = await axios({
    method: 'get',
    url: CBASE_URL,
    responseType: 'stream'
  });

  return response.data;
}

const stream = await consume();
stream

.pipe(
  new Transform({
    transform(chunk, encoding, callback) {
      const data = JSON.parse(chunk);

      //Tratar os dados conforme a necessidade...
      console.log('Recebendo dados', data);
      callback(null, JSON.stringify(data));
    }
  })
)

.pipe(
  new Writable({
    write(chunk, encoding, callback) {
      console.log('Escrevendo dados', chunk);
      callback();
    }
  })
)
