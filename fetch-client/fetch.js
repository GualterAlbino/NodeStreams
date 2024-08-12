var index = 0;
let db; // Referência global para o IndexedDB

export async function buscarEDividirDados() {
  const opcoes = {
    method: 'GET',
    headers: {
      Authorization:
        'Bearer ' +
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUZWstU3lzdGVtIEluZm9ybVx1MDBFMXRpY2EgTHRkYS4gTUUiLCJzdWIiOiJTQUMiLCJpYXQiOjE3MjE3MzA3MzksImV4cCI6MTcyMTc1OTUzOSwiUGFyYW1zIjoiQjU4NkFCNEFFNDFCRDhBQkI0ODc5QjlDODRFNjdCRkY2M0NEQUJCMkEyODk5MzkxOTQ5QTgwOTJFRTYxQzZBQkJDQjhBREI0QjRCQ0EyQjlBMDg2RTY0QjJDMzQwNzYyRDUxQURDMTNENDEyMjJERTE1NjZGMTQ1Qzk1QUNDQkZCQThEQUM1RjgzQTc0RUVDMEUyMzE0MUYxMDAwNzNDRUExNDRGQzIxQzQ3QkI5NEEzRDI2MDY2QUM3Qjg3QkExNTZFOTBEM0YzMDNCM0EzNzA4MkNDQjY0OTlBQjQxRjc2RjgxQjI3NDhDQTk5QTg1RTQ0MDMzMkJGMTBBM0YzMDNCMEMxMDA1NkJGQzZFRTA0NTI2MDI2QUYxNjJDOUE3OEE5Mzk5OEJFOTcyRTk3REUxNUVDRTQwMjgzQzNFRDE1NEM5QTg4QjlEODNGNDIzIn0.v-eUEIRfL8c6HmKXViPgjJv7kEVhTO5P_-BFj1StJ9g',
      'Content-Type': 'application/json',
      'cache-control': 'no-cache'
    }
  };

  // Usando fetch para buscar o código do último processamento
  let codigo = await fetch('https://192.168.72.140:8099/TSMCadDW_Temas.CodigoUltimoDataWarehouseProcessado?CodigoTemaDW=-2', opcoes)
    .then((response) => response.text())
    .catch((error) => {
      console.error('Erro ao buscar o código de processamento: ', error);
      return null;
    });

  if (!codigo) return;

  // Usando fetch para buscar os dados processados
  const response = await fetch(`https://192.168.72.140:8099/TSMCadDW_Temas.DataWarehouseProcessado?CodigoProcessamento=${codigo}`, opcoes);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let jsonChunk = '';
  let concluido = false;

  while (!concluido) {
    const { done, value } = await reader.read();
    concluido = done;

    jsonChunk += decoder.decode(value, { stream: true });

    // Encontra e processa JSONs completos
    let startIndex = jsonChunk.indexOf('{');
    let endIndex = jsonChunk.indexOf('}', startIndex);

    while (startIndex !== -1 && endIndex !== -1 && !done) {
      const jsonData = jsonChunk.substring(startIndex, endIndex + 1);
      processarChunk(jsonData.trim()); // Processa o JSON encontrado

      // Remove o JSON processado da string
      jsonChunk = jsonChunk.substring(endIndex + 1).trim();

      // Encontra o próximo JSON completo
      startIndex = jsonChunk.indexOf('{');
      endIndex = jsonChunk.indexOf('}', startIndex);
    }
  }

  if (concluido) {
    processarChunk(jsonChunk);
  }
}

export function processarChunk(chunk) {
  try {
    const dados = JSON.parse(chunk);
    atualizarDashboard(dados); // Atualiza o dashboard com os dados
    armazenarNoIndexedDB(dados); // Armazena os dados no IndexedDB
  } catch (error) {
    console.error('Erro ao processar o chunk: ', error);
  }
}

export function atualizarDashboard(dados) {
  if (!Array.isArray(dados)) {
    dados = [dados];
  }

  for (const item of dados) {
    const p = document.getElementById('info');
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = `Cliente: ${item.cliente} - ${++index}`; // Exibindo apenas a propriedade "cliente"
    fragment.appendChild(div);
    p.appendChild(fragment);
  }
}

export function inicializarIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('dashboardDB', 1);
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains('dataStore')) {
        db.createObjectStore('dataStore', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('IndexedDB pronto');
      resolve();
    };
    request.onerror = (event) => {
      console.error('Erro ao abrir o IndexedDB', event.target.error);
      reject(event.target.error);
    };
  });
}

export function armazenarNoIndexedDB(dados) {
  const transaction = db.transaction('dataStore', 'readwrite');
  const store = transaction.objectStore('dataStore');
  store.add({ dados: dados });
  transaction.oncomplete = () => {
    console.log('Dados armazenados com sucesso no IndexedDB');
  };
  transaction.onerror = (event) => {
    console.error('Erro ao armazenar os dados no IndexedDB', event.target.error);
  };
}

export function limparIndexedDB() {
  const request = indexedDB.deleteDatabase('dashboardDB');
  request.onsuccess = () => {
    console.log('IndexedDB limpo com sucesso');
  };
  request.onerror = () => {
    console.error('Erro ao limpar o IndexedDB');
  };
}

// Função inicial para verificar e limpar o IndexedDB e iniciar a busca e processamento de dados
export async function inicializarApp() {
  try {
    await inicializarIndexedDB();
    limparIndexedDB(); // Limpa o IndexedDB antes de iniciar
    await buscarEDividirDados(); // Busca e processa os dados
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
  }
}

inicializarApp();
