---
name: bug-hunter
description: Caça bugs no Devit CRM (dev, nunca prod) e confirma cada um navegando de verdade com Playwright antes de reportar, incluindo validação de valor contra o banco (devit-api) e consistência entre telas que mostram o mesmo dado. Use quando o usuário pedir "achar bugs", "caçar bugs no sistema", "testar o app procurando problema", "confirmar bug com playwright", "teste completo no sistema", "conferir se os valores batem com o banco" ou invocar /bug-hunter.
---

# Bug Hunter — Devit

Achar bug suspeito lendo código não basta. Toda suspeita vira bug reportado só depois de reproduzida ao vivo no navegador via `mcp__playwright__*`. Sem repro confirmada = não reporta como bug, reporta como "suspeita não confirmada".

Este skill cobre três frentes de caça, sempre com repro ao vivo:
1. **Bug de código** — hipótese lendo código, confirmada navegando (seção "Passo a passo").
2. **Bug de valor** — tela mostra número/dado que não bate com o que o banco (devit-api / Postgres) realmente tem (seção "Validação contra o banco").
3. **Bug de inconsistência entre telas** — duas telas que deveriam mostrar o mesmo dado mostram valores diferentes (seção "Consistência entre telas").

## Ambiente — regra dura

- Rodar **só contra dev local**: frontend `devit-web` (`npm run dev`, Vite, `http://localhost:5173`) contra backend `devit-api` (`npm run dev`, LoopBack, geralmente `http://127.0.0.1:3006` — ver `VITE_APP_BASE_API_URL` em `.env.local`). Nunca contra produção — checar a URL alvo antes de navegar.
- Login com `admin@devit.com` / `admin123` (credenciais de dev do `CLAUDE.md`). Não inventar outro usuário nem criar conta nova sem perguntar.
- Banco de dev é Postgres, string de conexão em `../devit-api/.env` (`DATABASE_URL`). Ler o arquivo só pra obter host/porta/db, nunca reproduzir a senha no relatório final.
- **Nunca rodar comando git.** Nunca alterar dado em produção. Nunca matar processo já em andamento (dev server de outra sessão, seja `devit-web` ou `devit-api`) sem perguntar.

## Passo a passo

1. **Servidores de pé**: checar se `devit-web` (porta 5173) e `devit-api` (porta 3006) já estão rodando; se não, subir cada um com `run_in_background` na sua pasta. Não subir um segundo servidor se já tem um de pé.
2. **Levantar hipóteses lendo código**, priorizando áreas de risco real (ver `CLAUDE.md` do projeto pras convenções esperadas):
   - Forms com `react-hook-form` + `zod` — campo `Select` que não usa `Controller` (deveria), `Input` que não usa `register`, validação client não bate com o schema do backend.
   - Hooks de página tipo `usePropertyCommercialForm`/`use*Form` em `pages/**/hooks` — estado de draft não sincronizado, `reset` do RHF limpando campo que devia persistir.
   - Chamadas via `src/api/generated` (orval) + `axios` — erro não tratado com `getErrorMessageFromRequest`, `toastPromise` usado como se fosse async (não é), `onSuccess`/`onError` faltando.
   - Fluxos com TanStack Query — cache não invalidado após mutation, loading/erro não tratado na UI.
   - Datas — parse manual com `new Date()` ou concatenação de string em vez de `dayjs(value)` (quebra quando API devolve data pura vs ISO com timezone).
   - Textos visíveis ao usuário que vazaram em inglês em vez de italiano/português (ver regra de i18n do `CLAUDE.md`).
   - Componentes fora de `./components` reimplementando algo que já existe lá.
3. Para cada hipótese, **reproduzir ao vivo**:
   - `mcp__playwright__browser_navigate` até a tela (`http://localhost:5173/...`).
   - Login se a tela exigir sessão (rotas do CRM, não o site público em `Site/**`).
   - `mcp__playwright__browser_snapshot` pra ver estado real da página (preferir snapshot de acessibilidade a screenshot pra achar seletor).
   - Interagir como usuário real: `browser_click`, `browser_type`, `browser_select_option`, `browser_fill_form` — nunca pular etapa (não vale afirmar bug sem ter clicado/preenchido de fato).
   - Conferir `mcp__playwright__browser_console_messages` (erro no console) e `browser_network_requests` (status HTTP, payload de erro vindo de `devit-api`) como evidência extra.
   - Se a hipótese não reproduzir, descartar — não forçar bug que não existe.
4. **Confirmar antes de reportar**: um bug só entra no relatório se você viu o efeito (erro visível, dado errado salvo, crash, requisição falhando) na sessão do Playwright, não só no código.
5. Não corrigir nada por conta própria. Reportar; se o usuário pedir fix, aí sim editar seguindo as convenções do `CLAUDE.md` (sem `any`/`unknown`/`never`/`object`, `Controller` pra `Select` e `register` pra `Input`, `npx tsc -b` depois, arquivo ≤300 linhas, função ≤40 linhas, labels em italiano/português).

## Validação contra o banco

Tela pode renderizar sem erro de console e ainda mostrar número/dado errado (query errada no backend, filtro de data errado, soma que ignora algo, registro duplicado etc.). Ler código não pega isso — só comparar valor exibido com valor real no Postgres pega.

1. **Escolher a tela/métrica alvo** (ex: preço/valuta de um imóvel em `Imoveis/Scheda`, totais em `Statistiche`, status de uma proposta em `Proposte`).
2. **Calcular o valor esperado direto no banco de dev** (nunca prod — confirmar que `DATABASE_URL` de `devit-api/.env` aponta pra host/db local antes de rodar qualquer query, mesmo `SELECT`), com `psql "$DATABASE_URL" -c "..."` ou client equivalente:
   - Entender a regra de negócio antes de escrever a query — ver o endpoint correspondente em `devit-api/src` (controller/repository) pra achar a regra real, não assumir.
   - Rodar `SELECT` equivalente à lógica esperada, anotando o valor e os filtros usados (id do registro, período, status).
3. **Ler o valor mostrado na tela** via Playwright (`browser_snapshot` ou `browser_evaluate` pra extrair o texto renderizado), logado como o mesmo usuário/contexto da query, ou conferir o payload da resposta em `browser_network_requests`.
4. **Comparar**. Se diferente:
   - Checar se é diferença de regra (ex: UI formata/arredonda diferente, ou usa um campo calculado distinto) antes de reportar — validar contra o código do endpoint em `devit-api` e do componente em `devit-web` qual regra deveria valer.
   - Se a tela ou a API realmente divergem da regra correta → bug confirmado, com evidência (valor do banco + query usada + valor da tela/resposta da API + print).
5. Nunca fazer `INSERT`/`UPDATE`/`DELETE` no banco pra "testar" — só leitura.

## Consistência entre telas

Várias telas do Devit repetem o mesmo dado (ex: dados de um imóvel aparecem em `Imoveis` (lista) e em `Imoveis/Scheda` (detalhe); um cliente pode aparecer em `Clientes` e vinculado numa `Proposte`; totais podem aparecer em `Statistiche` e em widgets da `Home`). Se duas telas mostram o mesmo conceito com valores diferentes, é bug — mesmo que cada uma isoladamente "pareça" certa.

1. **Mapear pares/grupos de telas que exibem o mesmo dado**: grep por hooks/componentes compartilhados em `src/pages/**/hooks` e `src/api/generated` (mesmo hook usado em dois lugares é bom sinal de que deveria bater; se cada tela busca o dado com chamada própria, é onde diverge mais fácil) e também perguntar ao usuário se não tiver certeza de quais telas se sobrepõem.
2. Para cada grupo:
   - Navegar pra tela A, capturar o valor exibido (snapshot/texto).
   - Navegar pra tela B (mesmo usuário logado, sem trocar de sessão no meio), capturar o valor exibido.
   - Comparar valor a valor (mesmo registro, mesmo período/status — atenção a rótulos: "valor" numa tela pode significar campo diferente de "valor" na outra, isso já é um achado a relatar mesmo que ambos os números estejam "certos" pra sua própria definição).
3. Se os valores divergem sem justificativa de negócio clara, reportar como bug de inconsistência, citando os dois arquivos de componente/hook responsáveis por cada tela e os dois valores vistos.
4. Se a divergência é porque as duas telas usam definições diferentes de propósito e isso não está claro pro usuário final (rótulo ambíguo, sem tooltip/legenda), reportar como problema de UX/clareza, não só como bug técnico.

## Relatório

Classificar cada bug confirmado como um dos três tipos: **código**, **valor divergente do banco**, **inconsistência entre telas**.

Por bug confirmado:
- **Tipo**: código / valor / inconsistência entre telas.
- **Onde**: rota/tela + arquivo do componente (nos dois casos, se for inconsistência entre telas).
- **Como reproduzir**: **lista numerada, passo a passo**, um passo por linha, cada um citando a tool/ação exata (ex: "1. `browser_navigate` → `/imoveis/123`", "2. `browser_click` no botão X", "3. `psql`: `select ...`"). **Nunca resumir em prosa corrida** ("cliquei em X, verifiquei Y") — se não dá pra reescrever a lista numerada só copiando o que você já fez, é sinal de que o passo a passo não foi registrado enquanto rodava; refaça a reprodução anotando cada ação, não invente a posteriori.
- **Evidência**: print (`browser_take_screenshot`), erro de console, request/response, ou valor do banco vs valor da tela.
- **Efeito**: o que devia acontecer vs o que aconteceu.

Antes de mandar o relatório, **checar cada bug confirmado contra essa lista** (não pular):
- [ ] Tem passo a passo numerado (não prosa)?
- [ ] Cada passo tem tool/comando explícito, reproduzível por outra pessoa sem adivinhar seletor/URL?
- [ ] Tem query SQL literal (não "consultei o banco") quando envolve validação de valor?
- [ ] Evidência anexada (print, log de console, ou par valor-banco vs valor-tela) pra cada item, não só pro primeiro?
Bug sem passar nessa checklist não entra no relatório como "confirmado" — volta pra reprodução.

Hipóteses que não confirmaram: listar à parte, uma linha, motivo de descarte — essa lista também não pode desaparecer do relatório final; se uma hipótese foi levantada na seção 2 do "Passo a passo" e não apareceu nem como bug nem aqui, é sinal de que foi esquecida no meio da caçada — revisar a lista de hipóteses original antes de fechar o relatório.
