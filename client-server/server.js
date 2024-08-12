import http from 'http';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

function* run() {
  for (let i = 0; i <= 99; i++) {
    const data = { id: randomUUID(), name: `Gualter_${i}` };
    yield data;
  }
}

//readable - Fonte de dados (Gera,inicializa ,Tudo que chega, é gerada uma stream de dados)
//transform - Modifica os dados (Lê, modifica, resulta, Tudo que chega, é modificado e passado adiante)
//writable - Destino dos dados (Lê, resulta, finaliza Tudo que sai, a última etapa do pipelane)

//readable - request
//writable - response
async function handler(request, response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log('Enviando dados', data);
        this.push(JSON.stringify(data) + '\n');
      } //A cada chamada push ele cai no pipe e manda para o cliente final

      //Para informar que os dados acabaram
      this.push(null);
    }
  });

  //Pipe - Quem gerencia os dados (Cano em portguês)
  readable.pipe(response);
}

http
  .createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Servidor rodando na porta 3000'));
