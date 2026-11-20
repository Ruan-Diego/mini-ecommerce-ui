// Importa o dist/index.js de um pacote com o Node puro (ESM), como faz um consumidor fora do Vite.
// Pega, por exemplo, import relativo sem extensão ".js", que o Vite resolve mas o Node não.
// Uso: node ../../scripts/verificar-dist.mjs   (rodado de dentro do pacote, depois do tsc)
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const entrada = resolve(process.cwd(), 'dist/index.js');
try {
  const modulo = await import(pathToFileURL(entrada).href);
  console.log(`dist ok: ${Object.keys(modulo).length} exportações em ${entrada}`);
} catch (erro) {
  console.error(`dist quebrado: o Node não consegue importar ${entrada}`);
  console.error(erro.message);
  process.exit(1);
}
