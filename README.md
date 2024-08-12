# Node Streams

<h1 align="center">
  Repositório dedicado a exemplos de processamento sob demanda de dados utilizando Node.js Streams
</h1>

<p align="center">
  <a href="https://www.linkedin.com/in/gualter/">
    <img alt="Feito por: " src="https://img.shields.io/badge/Feito%20por%3A%20-Gualter%20Albino-%231158c7">
  </a>
  <a href="https://github.com/GualterAlbino/NodeStreams/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/GualterAlbino/NodeStreams">
  </a>
</p>

## :dart: Sobre

Este repositório conta com alguns exemplos simples de processamento de dados utilizando Node.js Streams. O objetivo é demonstrar como podemos processar dados de forma eficiente e escalável, sem a necessidade de carregar todos os dados em memória.

## :rocket: Exemplos até o momento

## :wrench:client-server

Neste exemplo temos um servidor que prove dados sob demanda para um cliente. O servidor provê dados através de uma generator function (função geradora) que gera números aleatórios. As funções geradores possuem o recurso "yield" que permite a pausa e retomada da execução da função. O cliente consome os dados através de uma stream de leitura e imprime os dados no console.

-- Para rodar o servidor:

```
  npm run server
```

-- Para rodar o cliente:

```
  npm run client
```

## :wrench:fetch-client

Neste exemplo temos um cliente que consome dados de uma API de forma assíncrona usando o recurso API Fetch nativo do JS. O cliente consome os dados através de uma stream de leitura processando chunk a chunk da requisição que devovle uma coleção de JSONs. No exemplo em questão ele valida se o JSON é valido (completo), o renderiza na tela e o descarta caso não seja para que seja processado no próximo chunk.

Obs: Está utilizando uma API privada apenas para fins de demonstração.
