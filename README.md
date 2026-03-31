# 🧪 Automação de Testes – Blog do Agi

Projeto de automação de testes E2E (End-to-End) para a funcionalidade de **pesquisa de artigos** do [Blog do Agi](https://blogdoagi.com.br), desenvolvido com [Playwright](https://playwright.dev) e TypeScript.

---

## 📋 Índice

- [Cenários de Teste](#-cenários-de-teste)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando os Testes](#-executando-os-testes)
- [Relatório de Testes](#-relatório-de-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pipeline CI/CD](#-pipeline-cicd)

---

## 🎯 Cenários de Teste

A funcionalidade de pesquisa (ícone de lupa no canto superior direito) foi analisada e os seguintes cenários foram levantados:

### Cenários Principais

| ID   | Cenário | Critério de Aceite |
|------|---------|-------------------|
| CT01 | **Busca com termo válido** | Devem ser exibidos artigos relevantes ao termo pesquisado |
| CT02 | **Busca com termo inválido/inexistente** | Deve ser exibida mensagem de "nenhum resultado encontrado" |

### Cenários Complementares

| ID   | Cenário | Critério de Aceite |
|------|---------|-------------------|
| CT03 | **URL reflete o termo pesquisado** | A URL da página de resultados deve conter o parâmetro `?s=<termo>` |
| CT04 | **Busca com campo vazio** | A aplicação deve tratar a busca vazia de forma previsível e controlada |

### Justificativa da Escolha dos Cenários

Os **CT01 e CT02** foram selecionados como cenários principais por representarem o **fluxo feliz** e o **fluxo alternativo** mais críticos da funcionalidade de pesquisa — eles validam diretamente a experiência do usuário ao encontrar ou não encontrar conteúdo. São os cenários de maior impacto e relevância para o negócio.

---

## 🛠 Tecnologias Utilizadas

- **[Playwright](https://playwright.dev/)** `v1.44+` — Framework de automação E2E moderno, com suporte nativo a Chromium, Firefox e WebKit
- **[TypeScript](https://www.typescriptlang.org/)** `v5.4+` — Tipagem estática para maior confiabilidade do código
- **[Node.js](https://nodejs.org/)** `v20+` — Ambiente de execução
- **[GitHub Actions](https://github.com/features/actions)** — Pipeline de CI/CD para execução automática dos testes

### Por que Playwright?

- Suporte nativo a múltiplos browsers (Chromium, Firefox, Safari/WebKit)
- Execução em modo headless e headed
- Auto-wait integrado (reduz flakiness)
- Relatórios HTML embutidos
- Integração fácil com CI/CD
- Compatível com Windows, Linux e macOS

---

## ✅ Pré-requisitos

- **Node.js** `>= 20.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` (incluído com o Node.js)
- Conexão com a internet (os testes acessam `https://blogdoagi.com.br`)

Para verificar as versões instaladas:

```bash
node --version
npm --version
```

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/felipenoite/agi-blog-tests.git
cd agi-blog-tests
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os browsers do Playwright

```bash
npx playwright install
```

> Caso queira instalar apenas o Chromium (mais leve):
> ```bash
> npx playwright install chromium
> ```

---

## ▶️ Executando os Testes

### Todos os testes (todos os browsers)

```bash
npm test
```

### Apenas no Chromium

```bash
npm run test:chromium
```

### Apenas no Firefox

```bash
npm run test:firefox
```

### Apenas no WebKit (Safari)

```bash
npm run test:webkit
```

### Modo visual (com browser visível)

```bash
npm run test:headed
```

### Modo debug (passo a passo)

```bash
npm run test:debug
```

---

## 📊 Relatório de Testes

Após a execução, o Playwright gera um relatório HTML interativo:

```bash
npm run test:report
```

O relatório será aberto automaticamente no navegador. Ele inclui:
- Status de cada cenário (passou/falhou)
- Screenshots em caso de falha
- Vídeo das execuções com falha
- Trace viewer para análise detalhada

---

## 📁 Estrutura do Projeto

```
agi-blog-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml       # Pipeline CI/CD (GitHub Actions)
├── pages/
│   └── BlogPage.ts              # Page Object Model (POM) do Blog
├── tests/
│   └── search.spec.ts           # Cenários de teste da pesquisa
├── playwright.config.ts         # Configuração do Playwright
├── tsconfig.json                # Configuração do TypeScript
├── package.json
├── .gitignore
└── README.md
```

### Padrão Page Object Model (POM)

O projeto utiliza o padrão **Page Object Model** para organizar os seletores e ações da página em uma classe separada (`BlogPage.ts`), garantindo:

- **Reutilização** — seletores centralizados, sem duplicação
- **Manutenibilidade** — alterações na UI afetam apenas o POM
- **Legibilidade** — os testes descrevem comportamentos, não detalhes de implementação

---

## 🔄 Pipeline CI/CD

O projeto inclui um workflow do **GitHub Actions** configurado em `.github/workflows/playwright.yml`.

### Disparadores

- Push para `main` ou `master`
- Pull Request para `main` ou `master`
- Execução manual via `workflow_dispatch`

### O que o pipeline faz

1. Checkout do código
2. Configura Node.js 20
3. Instala as dependências com `npm ci`
4. Instala o Chromium do Playwright
5. Executa os testes
6. Faz upload do relatório HTML como artefato (disponível por 30 dias)

### Verificando a execução

Acesse a aba **Actions** no repositório do GitHub para visualizar o histórico de execuções e baixar os relatórios gerados.

---

## 👤 Autor

Desenvolvido como parte do processo seletivo para a vaga de QA na **Mirante**.
