# mini-ecommerce-ui

Pacotes compartilhados entre o [shell](https://github.com/Ruan-Diego/mini-ecommerce-shell) e os microfrontends do **Mini E-commerce**.

| Pacote | Conteúdo |
| --- | --- |
| `@ruan-diego/mini-design-system` | Tokens (cores, tipografia, espaçamento) e componentes React |
| `@ruan-diego/mini-event-contracts` | Tipos dos eventos entre MFEs, `PropsRemoto` e `criarEventBus` |

## Desenvolvimento

```bash
pnpm install
pnpm test
pnpm build
pnpm changeset   # registra mudança num pacote
```

## Design system

Importe os tokens uma vez (no shell ou no `bootstrap` standalone do MFE) e use os componentes:

```tsx
import '@ruan-diego/mini-design-system/tokens.css';
import { Button, Input, Card, Pill, Chip, Modal, QuantityStepper, ProductObject } from '@ruan-diego/mini-design-system';
```

| Componente | Uso | Acessibilidade |
| --- | --- | --- |
| `Button` | variantes `primario`, `secundario`, `ghost`; `pequeno`, `bloco` | `type="button"` por padrão, alvo de 44px |
| `Input` | `label` obrigatório, `erro` opcional | label ligado ao campo; erro em `aria-describedby` e `aria-invalid` |
| `Card` | superfície; `como="section" \| "article" \| ...` | elemento semântico à escolha |
| `Pill` | `tom`: `neutro`, `destaque`, `aviso`, `erro`, `sucesso` | texto puro, não interativo |
| `Chip` | filtro com `ativo` | `aria-pressed` |
| `Modal` | `aberto`, `titulo`, `aoFechar` | `role="dialog"`, foco preso, Esc fecha, foco volta para quem abriu |
| `QuantityStepper` | `valor`, `aoMudar`, `min`, `max` | grupo rotulado, botões nomeados, valor em `aria-live` |
| `ProductObject` | `forma` (esfera, anel, capsula, bloco) e `material` | com `rotulo` vira `role="img"`; sem, é decorativo |

Tokens além das cores e fontes: raios (`--r-sm`, `--r-md`, `--r-lg`, `--r-pill`), espaçamento em escala de 4px (`--sp-1` a `--sp-7`) e `--alvo` (44px, tamanho mínimo de alvo clicável).

Os testes rodam o axe em cada componente. Como o jsdom não calcula contraste, `contraste.test.ts` confere a razão WCAG (≥ 4.5:1) dos pares de cores usados nas telas.

## Consumindo nos microfrontends

Os pacotes são publicados no GitHub Packages. O registry npm do GitHub exige autenticação mesmo para pacote público.

**No repositório** (commitado), um `.npmrc` só com o registry do escopo, **sem token**:

```
@ruan-diego:registry=https://npm.pkg.github.com
```

O pnpm 10 ignora token com `${VARIAVEL}` num `.npmrc` de projeto (proteção contra vazar segredo para um registry malicioso). O token vai num `.npmrc` de usuário:

- **Na sua máquina:** o `gh` precisa do escopo `read:packages` (`gh auth refresh -h github.com -s read:packages`, uma vez). Depois, no seu `~/.npmrc`, adicione `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}` e, antes do `pnpm install`, rode `$env:GITHUB_TOKEN = gh auth token` no PowerShell.
- **No CI do MFE:** `actions/setup-node` com `registry-url: https://npm.pkg.github.com` e `scope: "@ruan-diego"` cria esse `.npmrc` de usuário; o passo de install recebe `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` e o workflow precisa de `permissions: packages: read`. Se o install falhar com 403, libere o repositório do MFE em Package settings → Manage Actions access, na página de cada pacote.

## Versionamento e publicação

Changesets versiona os dois pacotes; a publicação segue o ADR-0004 (nada roda em `dev`/`feat`).

1. Numa feature que muda um pacote: `pnpm changeset`, escolha os pacotes e o tipo (patch, minor, major) e commite o arquivo de `.changeset/`.
2. No fim da fase, na `dev`: `pnpm versionar` sobe as versões, escreve os `CHANGELOG.md` e atualiza o lockfile. Commite e abra o PR da fase para a `main`.
3. Depois do merge, crie uma release no GitHub a partir da `main` (tag `fase-N`, por exemplo). O workflow `publicar.yml` testa, builda e roda `changeset publish`, que publica só as versões que ainda não estão no registry.

## Event contracts

```ts
import { criarEventBus, emit, on } from '@ruan-diego/mini-event-contracts';

// Dentro de um MFE, use o eventBus que o shell passa em PropsRemoto:
eventBus.emit('carrinho:adicionar-item', { produtoId: 'orbe-cromo', quantidade: 1 });
const sair = eventBus.on('carrinho:atualizado', ({ quantidadeTotal }) => atualizarBadge(quantidadeTotal));

// emit/on avulsos (sobre window, ou um EventTarget passado como 3º argumento) e criarEventBus(alvo)
// servem para o shell e para o modo standalone.
```

| Evento | Payload | Quem emite → quem ouve |
| --- | --- | --- |
| `carrinho:adicionar-item` | `{ produtoId, quantidade }` | catálogo, conta → carrinho |
| `carrinho:atualizado` | `{ quantidadeTotal, subtotal }` | carrinho → shell (badge) |
| `carrinho:limpo` | `{}` | checkout → carrinho |
| `carrinho:abrir` | `{}` | shell → carrinho (drawer) |
| `auth:alterado` | `{ autenticado, nome?, papeis }` | shell → todos |
| `navegar` | `{ rota }` | qualquer MFE → shell |

Payload errado, campo a mais ou nome de evento inexistente não compilam.

## Regras

- Mudança incompatível num evento exige um novo nome de evento, não uma nova versão do mesmo. O `pnpm typecheck` garante isso: `src/contrato-congelado.ts` guarda os payloads publicados e a compilação falha se um evento for apagado, perder um campo, trocar um tipo ou ganhar um campo obrigatório. Adicionar campo opcional é permitido.
- Os componentes seguem as telas do canvas de design e passam em checagem de acessibilidade.
