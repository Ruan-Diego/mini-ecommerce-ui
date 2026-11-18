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
```

## Consumindo nos microfrontends

Os pacotes vão para o GitHub Packages (issue "Publicação dos pacotes no GitHub Packages via Actions"). Para instalar, cada repositório precisa de um `.npmrc`:

```
@ruan-diego:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Regras

- Mudança incompatível num evento exige um novo nome de evento, não uma nova versão do mesmo.
- Os componentes seguem as telas do canvas de design e passam em checagem de acessibilidade.
