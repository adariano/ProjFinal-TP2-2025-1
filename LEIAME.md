# Projeto de disciplina de Técnicas de Programação 2
## Para rodar o projeto
1. Deve-se primeiro instalar o gerenciador de pacotes [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Depois, em seu terminal, dê `cd` até a raiz do projeto, `./supermercado-app`;
3. Então execute `npm install`, e logo `npm` instalará todas as depêndencias definidas.
4. Finalmente, execute `npm run dev`, para rodar o site em sua máquina.

## Comandos úteis
Todos os comandos são scripts definidos em [package.json](/projfinal_tp2/package.json)
### Verificador de cobertura
É utilizado a biblioteca `Jest`, junto com alguns outros plugins.
1. Execute `npm run test:coverage`
2. Será gerado na raiz do projeto uma pasta `/coverage`, com os relatórios do teste em diversos formatos.
### Suite de testes
É utilizado a biblioteca `Jest`.
Execute `npm run test`
### Verificador estático
É utilizado ESLint.
Execute `npm run lint`

## Caminhos
### Para documentação
- Diagramas estão contidos nas pastas `./docs/diagramas_*`
- Os relatórios de tempo estão em `./timetable`
- [O link do repositório do GitHub](https://github.com/adariano/ProjFinal-TP2-2025-1)
