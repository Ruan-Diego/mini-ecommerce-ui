---
"@ruan-diego/mini-design-system": patch
---

Corrige os imports internos do dist sem extensão `.js`, que quebravam o carregamento em Node ESM (por exemplo, no vitest dos microfrontends). O build agora importa o `dist` com o Node para pegar isso.
