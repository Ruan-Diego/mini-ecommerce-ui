# Changesets

Cada arquivo `.md` aqui descreve uma mudança num pacote e o tipo de versão (patch, minor ou major).

- Ao terminar uma feature que muda um pacote: `pnpm changeset` e commite o arquivo gerado junto.
- No fim da fase, na `dev`: `pnpm versionar` consome os arquivos, sobe as versões e escreve os `CHANGELOG.md`.
- Depois do merge na `main`, crie uma release no GitHub: o workflow `publicar.yml` publica no GitHub Packages.

Fluxo completo no README da raiz.
