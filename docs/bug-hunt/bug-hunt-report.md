# Bug Hunt Report

## Correções aplicadas (sessão de fix, 2026-10-03) — todas verificadas ao vivo (Playwright e/ou curl), não só por leitura de código
- **#3 FIXED** — `usePersonForm.ts`: `birthDate` agora convertido com `toISODateOrNull` (como Proposte já fazia). Verificado na UI: editei data de nascimento de cliente real, `psql` confirma `birth_date = 1985-03-20`.
- **#7 FIXED** — mesma causa raiz do #41: `reset()` manual perdia o registro dos campos do RHF sob React.StrictMode. `usePersonForm.ts` passou a usar a prop `values` nativa do RHF. Verificado: editei nota + telefone na Scheda do cliente, `psql` confirma os valores gravados (antes iam `null`).
- **#41 FIXED** — `useBannerForm.ts`: mesma troca (`values` em vez de `reset(..., {keepFieldsRef:true})`). Verificado: abri a edição do banner "12321313", campos Titolo/Ordine aparecem preenchidos (antes vazios).
- **#11 FIXED** — `usePropertyLocations.ts`: coordenada (0,0) tratada como ausente. Verificado: vista mapa de Proprietà não baixa mais tiles do ponto (0,0)/Golfo da Guiné.
- **#38 FIXED** — `bannerSchema.ts` (zod) + `home-banner.model.ts` (API, `pattern`/`minimum`). Verificado via API: `PATCH targetLink=javascript:alert(1)` → 422 com mensagem clara.
- **#24 FIXED** — `property-status.helpers.ts`; `SaleController`/`RentalContractController` atualizam `properties.status` (sold/rented/available) e gravam `property_status_history`. Verificado via API: criei venda `status:sold`, `psql` confirma `properties.status = sold`.
- **#35 FIXED** — índice único `users_email_unique_index` (migration rodada em dev). Verificado via API: `POST /users` com e-mail já existente → 422 "Esiste già un utente con questa e-mail." (antes criava duplicata).
- **#36 FIXED** — índice único `branches_name_unique_index` (migration rodada). Verificado via API: `POST /branches` com nome existente → 422 "Esiste già una filiale con questo nome."
- **#37 FIXED** (achado durante o fix de #36, mesma família de bug) — `property-category.controller.ts` + novo helper `foreign-key-constraint-error.ts`: excluir categoria em uso devolvia 500 "Internal Server Error" em inglês. Verificado via API: `DELETE` na categoria "Terreno" (em uso por 4 imóveis) → 422 "Questa categoria è in uso da uno o più immobili e non può essere eliminata."
- **#39 FIXED nos controllers mais sensíveis** — novo helper `audit-log.ts`. Instrumentado create/update/delete em: **User, Branch, HomeBanner, PropertyCategory, Person, Property, Sale, RentalContract** (8 controllers). Verificado via API: venda criada gerou linha em `audit_logs` (`action=create, entity=Sale`). **Ainda faltam**: Zone/Neighborhood e PurchaseProposal — não instrumentados por limite de tempo.
- **#5 FIXED parcialmente** — novo helper `address-cleanup.ts` (só apaga o endereço se nenhuma outra pessoa/imóvel/filial/evento ainda o referencia). Aplicado em **Person e Property** (os dois casos originalmente reportados) e em HomeBanner (anexo órfão, via deleção direta do attachment). **Não aplicado** em Branch e no fluxo de falha de criação (endereço criado antes do POST de pessoa falhar) — ficou de fora por tempo.
- **#12 / #15 / #20 FIXED** — novos hooks `usePersonSearchOptions`/`usePropertySearchOptions` (busca server-side com debounce, garantindo que o valor já selecionado apareça mesmo fora da página atual). `SearchableSelect` ganhou `onSearchChange`/`isLoading` opcionais, mantendo os ~17 usos existentes intactos. Aplicado em Proprietà (owner), Proposte (immobile/acquirente), Vendite (immobile/venditore/acquirente) e Locazioni (immobile).
- **#1 FIXED** — `useCalendarEventList.ts`: `buildWhere()` passou a incluir `{ createdById: null }` no `or`, então eventos com criador nulo voltam a aparecer na Agenda.
- **#2 FIXED** — `calendarEventSchema.ts` (zod `superRefine`, ignora quando `allDay`) + `calendar-event.helpers.ts`/`calendar-event.controller.ts` (`assertEndAfterStart`, validado em create e update). Dupla camada front+API.
- **#4 FIXED** — `PersonFormModal.tsx`: `useEffect` reseta o form para `emptyPersonValues` (ou os dados da pessoa) sempre que o modal abre.
- **#6 FIXED** — `Clientes/Scheda/index.tsx`: `usePersonControllerFindById` agora passa `filter: { include: ['address'] }`.
- **#8 FIXED** — `leadSchema.ts`: `superRefine` com `MIN_MAX_PAIRS` rejeita mínimo > máximo (orçamento, área, quartos, banheiros).
- **#9 FIXED** — `formatRange.ts`: trata `0` como "não informado" antes de formatar, então não aparece mais "≤ 0".
- **#10 FIXED** — `usePropertyList.ts`: filtro de preço agora respeita `filters.purpose` (rent usa só `rentPrice`, sale só `salePrice`, senão `or` dos dois).
- **#14 FIXED** — `PropertyCodeField.tsx`: busca todos os códigos (`limit: 20000`) e calcula o máximo numérico via `reduce`, em vez de confiar na ordenação textual `code DESC`.
- **#16 FIXED** — `usePropertyForm.ts`: `reValidateMode: 'onChange'` adicionado ao `useForm`.
- **#17 FIXED** — `PropertyLocationTab.tsx`: campo "Città" trocado de lista fixa (`ControlledSelectField`) para `SearchableSelect` com `creatable`, aceitando qualquer cidade já salva fora da lista de 8.
- **#18 FIXED** — `usePropertyForm.ts`: `invalidateList()` agora também invalida as query keys de `PropertyPriceHistory` e `PropertyStatusHistory`.
- **#19 FIXED** — `useDuplicateProperty.ts`: `toNumberOrUndefined()` aplicado em `rentPrice`/`salePrice`/`condoFee`/`areaSqm` antes do POST.
- **#21 FIXED** — `proposalSchema.ts`: `superRefine` rejeita `validUntil < proposalDate`.
- **#22 FIXED** — `createdById: this.currentUser?.id` gravado em `PersonController`, `PropertyController` e `PurchaseProposalController` (único repositório onde o model tem essa coluna).
- **#23 FIXED** — `operazioni.json` (it): `deedDateLabel` trocado de "Data di escritura" para "Data atto".
- **#25 FIXED** — `sale.helpers.ts`/`sale.controller.ts`: `assertSalePartiesExist` agora rejeita `buyerId === sellerId` e exige que o vendedor conste em `PropertyOwner` do imóvel. Testes unitários atualizados (`sale.helpers.unit.ts`, 10/10 passando).
- **#26 FIXED** — `rental-contract.model.ts` (`dueDay` 1-31, `noticeDays` ≥0 via `jsonSchema`) + `rental-contract.helpers.ts`/`rental-contract.controller.ts` (`assertEndAfterStart` em create/update) + `rentalContractSchema.ts` (zod `superRefine` espelhando as mesmas regras no front).
- **#27 FIXED** — novo util `formatPercent.ts`; `GeneratedAdjustmentsTable.tsx` usa ele em vez de `${indexPercent}%` cru (a coluna Postgres `numeric(6,3)` vinha como string `"3.500"` do driver).
- **#28 FIXED** — label "Scadenza" → "Scadenza rinnovo" (it/pt) para diferenciar da data de fim do contrato; `useUpcomingRenewals.ts` e o endpoint `upcoming-renewals` agora rejeitam/ignoram `days <= 0`.
- **#29 FIXED** — `useContractRegistrations.ts`: filtro agora exige `situation: 'active'`, então contratos rescindidos/encerrados saem da lista "Da registrare".
- **#30 FIXED** — label do card "Totale" → "Totale (ultimi 30 giorni)" (it/pt), deixando a janela fixa explícita.
- **#31 FIXED** — nova coluna `subject` em `communication_logs` (migration `alter` rodada em dev); `MarketingCampaignController` grava o assunto do e-mail (ou um resumo do texto puro para WhatsApp); `StoricoTab.tsx` mostra `subject` em vez do UUID da campanha.
- **#32 FIXED** — `communicationTemplateSchema.ts`: `superRefine` exige assunto quando o canal é e-mail e rejeita corpo HTML "vazio" (só tags, sem texto). Mesma regra replicada no backend (`communication-template.controller.ts` + `jsonSchema.minLength` no model).
- **#33 FIXED** — `useSendCampaign.ts`: busca de imóvel passou a usar `or: [{title...}, {code...}]`.
- **#34 FIXED** — `WhatsappConnectionCard.tsx`: polling de status cai de 4s para 30s assim que `connected: true` (função em `refetchInterval`).
- **#39 FIXED (completo)** — `logAudit()` aplicado também em `Zone`, `Neighborhood` e `PurchaseProposal` (os três que faltavam da rodada anterior). Agora cobre os 11 controllers sensíveis do sistema.
- **#40 FIXED** — `OwnerAccessFormModal.tsx`: troca do filtro `role: PersonRole.owner` pelo `usePersonSearchOptions` (busca por nome em todas as pessoas), já que a maioria dos proprietários reais está cadastrada como `contact`.
- **#42 FIXED** — `Site/PropertyDetail/index.tsx`: trata `isError` (404 da API) mostrando o componente `NotFound`, em vez de ficar em branco para sempre (`isSuccess` nunca vira `true` nesse caso).
- **#43 FIXED** — `Site/ZoneDetail/index.tsx`: zona inexistente agora mostra mensagem "Zona non trovata" com link de volta, em vez do texto genérico de lista vazia.
- **#44 FIXED** — `richiesteSchema.ts`: `superRefine` rejeita `maxBudget <= 0` (só quando `requestType === 'search'`, evitando erro "travado" ao trocar para "valutazione" sem limpar o campo); mensagem de erro agora é exibida na tela; mesma validação replicada em `public-lead.controller.ts`.
- **#5 FIXED (completo)** — `deleteAddressIfOrphan` aplicado também em `BranchController` (faltava); `usePersonForm.ts` agora desfaz (`DELETE /addresses/{id}`) o endereço recém-criado se o POST/PATCH de Person falhar depois, evitando o endereço órfão por falha não-transacional.
- **#13 NÃO CORRIGIDO (decisão de produto)** — autosave ao clicar "Avanti" no wizard do imóvel seguiu como estava; pode ser intencional (salvar por etapa) e mudar esse comportamento é uma decisão de UX, não um bug claro de código.

Verificação: `cd devit-api && npm run build` limpo (rodado repetidamente ao longo da sessão, nunca mais de uma vez em sequência); `cd devit-web && npx tsc -b` limpo; migration (`npm run migrate`) rodada em dev sem erro (incluindo a nova coluna `communication_logs.subject`); client orval regenerado após mudanças de contrato da API; backend de dev reiniciado para carregar o build novo.


Base: http://localhost:5174 (CRM em /gestionale), API 127.0.0.1:3006, DB local devit_api (só SELECT)

## Bugs confirmados

### #1 — Agenda não mostra eventos sem criador (created_by_id NULL), Home mostra
- **Tipo**: inconsistência entre telas
- **Onde**: `/gestionale/agenda` x `/gestionale` (widget "Impegni di oggi"). Arquivos: `src/pages/Agenda/hooks/useCalendarEventList.ts:75` (filtra `createdById inq visibleUserIds`), Home (`src/pages/Home/hooks/useDashboardReports.ts`/widget de impegni, sem esse filtro)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/login`; login `admin@devit.com` / `admin123`
  2. Na Bacheca (`/gestionale`), widget "Impegni di oggi" = 1: "Teste Recorrencia 07:00 · Visita immobile"
  3. `browser_navigate` → `http://localhost:5174/gestionale/agenda` (vista Mese, ottobre 2026) e `browser_snapshot`
  4. Célula "3 ottobre 2026" sem nenhum evento; nenhum evento "Teste Recorrencia" no mês inteiro
  5. `browser_network_requests` (filter `calendar`): GET `/calendar-events?filter=...{"createdById":{"inq":["6694b530-9db1-11f1-91e8-7dfd4cef846b"]}}` → 200
  6. `psql`: `select id, created_by_id, title, start_at from calendar_events where start_at between '2026-09-28' and '2026-11-09' order by start_at` → 12 linhas, todas com `created_by_id` NULL (inclui `6d8d1590-a616-11f1-97b3-97ee21d9ccba`, 2026-10-03 07:00-03)
  7. `psql`: `select count(*) total, count(created_by_id) com_criador from calendar_events` → total 21833, com criador 21782 (51 órfãos)
- **Evidência**: `.playwright-mcp/bug1-agenda-sem-evento-3-ottobre.png`; request do passo 5; queries dos passos 6-7
- **Efeito**: o mesmo evento devia aparecer nas duas telas; Home mostra, Agenda esconde (filtro por criador exclui NULL). Evento vira invisível na Agenda e não dá para editar/excluir por ali. Causa provável: FK `ON DELETE SET NULL` em `created_by_id` quando o criador é removido.

### #2 — Agenda aceita evento com hora fim anterior à hora início
- **Tipo**: código (validação)
- **Onde**: `/gestionale/agenda` → modal "Nuovo impegno" (`src/pages/Agenda/schemas/*`, sem `refine` de horário)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/agenda` (logado)
  2. `browser_click` na célula `[aria-label="7 ottobre 2026"]` (vista Mese) → abre "Nuovo impegno" (início 09:00, fim 10:00)
  3. `browser_fill_form`: Titolo = `BUGHUNT teste agenda`; Ora fine = `08:00`
  4. `browser_click` no botão "Salva"
  5. Toast "Impegno creato con successo!" e chip aparece no dia 7
  6. `psql`: `select id, title, start_at, end_at from calendar_events where title like 'BUGHUNT%'` → `start_at 2026-10-07 09:00-03`, `end_at 2026-10-07 08:00-03` (id f50b32c0-bf40-11f1-b086-7f3146326fef)
- **Evidência**: `.playwright-mcp/agenda-fim-antes-inicio.png` + resultado do SELECT
- **Efeito**: devia bloquear com erro de validação (fim > início); gravou intervalo negativo.

### #3 — Não dá para criar cliente com "Data di nascita" (API devolve 422)
- **Tipo**: código (contrato front x API)
- **Onde**: `/gestionale/clienti` → "Nuovo cliente". Front: `src/pages/Clientes/hooks/usePersonForm.ts:141` (envia `birthDate` como `YYYY-MM-DD`), `src/pages/Clientes/schemas/personSchema.ts:36` (`z.string()`). API: `devit-api/src/models/person.model.ts:120-125` (`type: 'date'` → JSON schema `format: date-time`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/clienti` (logado)
  2. `browser_click` botão "Nuovo cliente"
  3. `browser_fill_form`: Nome = `BUGHUNT Cliente`; E-mail = `bughunt@test.com`; Data di nascita (`input[type=date]`) = `1990-05-10`
  4. `browser_click` em `[role=dialog] button:has-text("Salva")`
  5. Toast vermelho: "Il campo '/birthDate' ha un formato non valido." e modal permanece aberto
  6. `browser_network_requests` (filter `/people`): `POST /people => 422`
  7. `browser_network_request` index do POST, `request-body`: `{"name":"BUGHUNT Cliente","role":"contact","email":"bughunt@test.com",...,"birthDate":"1990-05-10",...}`; `response-body`: `{"error":{"statusCode":422,...,"details":[{"path":"/birthDate","code":"format","message":"Il campo '/birthDate' ha un formato non valido.","info":{"format":"date-time"}}]}}`
  8. `psql`: `select id,name from people where name like 'BUGHUNT%'` → 0 linhas
- **Evidência**: `.playwright-mcp/clienti-birthdate-422.png`; request/response do passo 7
- **Efeito**: devia salvar o cliente; qualquer cadastro com data de nascimento preenchida falha. (Testado também com 2099-01-01, mesmo 422.) Falta conferir se a edição na Scheda tem o mesmo problema.

### #4 — Modal "Nuovo cliente" mantém dados da tentativa anterior depois de "Annulla"
- **Tipo**: código (estado do form / UX; confirmar se draft é intencional)
- **Onde**: `/gestionale/clienti` → "Nuovo cliente" (`src/pages/Clientes/hooks/usePersonForm.ts`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/clienti` (logado)
  2. `browser_click` "Nuovo cliente"; `browser_fill_form` Nome=`BUGHUNT Cliente`, Data di nascita=`1990-05-10`
  3. `browser_click` `[role=dialog] button:has-text("Annulla")`
  4. `browser_click` "Nuovo cliente" de novo
  5. `browser_evaluate` lendo inputs do dialog → `Mario Rossi=BUGHUNT Cliente`, `date=1990-05-10`, `Milano=Napoli`
- **Evidência**: saída do `browser_evaluate` do passo 5
- **Efeito**: modal de novo cadastro devia abrir vazio; reabre com dados antigos. Efeito colateral: a data de nascimento "fantasma" fez o salvamento seguinte falhar com 422 (#3) sem o usuário ter digitado data.

### #5 — Endereço órfão criado quando o POST /people falha
- **Tipo**: código (fluxo não transacional)
- **Onde**: `/gestionale/clienti` → "Nuovo cliente" (`src/pages/Clientes/hooks/usePersonForm.ts`: cria `POST /addresses` e depois `POST /people`)
- **Como reproduzir**:
  1. Repetir passos de #3 (nascimento preenchido) e preencher também Città = `Napoli`
  2. `browser_click` "Salva"
  3. `browser_network_requests` (filter `POST|/people$|addresses`): `POST /addresses => 200`, em seguida `POST /people => 422`
  4. `psql`: `select a.id, a.city, (select count(*) from people p where p.address_id=a.id) pessoas, (select count(*) from properties p where p.address_id=a.id) imoveis from addresses a order by a.created_at desc limit 1` → `678c8d80-bf41-11f1-b086-7f3146326fef | Napoli | 0 | 0`
  5. Segunda forma do mesmo problema (exclusão): `/gestionale/clienti` → buscar `BUGHUNT` → `tbody tr:first-child button` nth(1) (lixeira) → `[role=dialog] button:has-text("Elimina")`
  6. `psql`: `select id from addresses where id in ('78f86440-bf41-11f1-b086-7f3146326fef','678c8d80-bf41-11f1-b086-7f3146326fef')` → as 2 linhas continuam (cliente `people` removido: `select count(*) from people where name like 'BUGHUNT%'` → 0)
  7. Terceira forma (imóvel): excluir imóvel pela lista (`/gestionale/proprieta`, vista grade, `button:has(svg.lucide-trash-2)` → "Elimina"); `psql`: `select count(*) from addresses where id='8a14a980-bf43-11f1-b086-7f3146326fef'` → `1` (o imóvel `BH-0001` foi removido, o endereço ficou; também sem `property_price_histories`, que têm cascade)
  8. Quarta forma (banner): criar banner com imagem e excluí-lo em `/gestionale/amministrazione/banner`; `psql`: `select id, original_name from attachments order by created_at desc limit 1` → `fcc0abd0-… | banner-novo-salva.png` e `select count(*) from home_banners` → 3 (o anexo, com `body_base64` dentro do Postgres, ficou sem dono)
- **Evidência**: lista de requests do passo 3 + SELECT do passo 4 + SELECT do passo 6 + SELECT do passo 7 + SELECT do passo 8
- **Efeito**: falha no cadastro, ou exclusão do cliente, devia não deixar lixo; fica um endereço sem dono (não removido: regra de só leitura no banco). Endereços de teste órfãos no dev: `678c8d80-…` e `78f86440-…`.

### #6 — Scheda do cliente (aba Dati) mostra endereço vazio mesmo com endereço no banco
- **Tipo**: código (+ valor divergente do banco)
- **Onde**: `/gestionale/clienti/:id` → `src/pages/Clientes/Scheda/index.tsx:29` (`usePersonControllerFindById(personId, undefined, …)` sem `include: address`) → `src/pages/Clientes/hooks/usePersonForm.ts:personToFormValues` lê `person.address?.*`
- **Como reproduzir**:
  1. `psql`: `select p.id, p.name, a.street, a.city from people p join addresses a on a.id=p.address_id where a.street is not null limit 1` → `b414a1e2-abd9-11f1-8675-f59a3b58db99 | Nebbioso Pasqualina | via san giacomo dei capri | 4708`
  2. `browser_navigate` → `http://localhost:5174/gestionale/clienti/b414a1e2-abd9-11f1-8675-f59a3b58db99` (logado); `browser_wait_for` 2s
  3. `browser_evaluate` lendo os inputs → `Via Roma=` (vazio), `Milano=` (vazio), `Italia=`, `Lombardia=`, `20121=`, `12=` (todos vazios; só placeholders)
  4. `browser_network_requests`: `GET /people/{id}` sem parâmetro `filter` (a lista usa `include: address`, a Scheda não); resposta traz só `addressId`, sem objeto `address`
- **Evidência**: `.playwright-mcp/cliente-scheda-endereco-vazio.png`; saída do passo 3; SELECT do passo 1. Mesmo efeito no cliente criado por mim (`78fa11f0-bf41-11f1-b086-7f3146326fef`, Città=Napoli no banco, vazia na Scheda)
- **Efeito**: devia exibir o endereço salvo; mostra vazio. Risco: o usuário acha que o endereço sumiu e pode regravar/duplicar ao salvar.

### #7 — Scheda do cliente (aba Dati): "Salva modifiche" mostra sucesso mas NÃO grava as alterações
- **Tipo**: código (perda silenciosa de dados)
- **Onde**: `/gestionale/clienti/:id` → `src/pages/Clientes/Scheda/components/SchedaDati.tsx` + `src/pages/Clientes/hooks/usePersonForm.ts` (o mesmo hook, via modal da lista, grava normalmente). Causa raiz não identificada; suspeita: `useEffect(() => form.reset(...), [person, form])` em `usePersonForm.ts:97-99` ou desacoplamento entre inputs e estado do RHF na Scheda
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/clienti/78fa11f0-bf41-11f1-b086-7f3146326fef` (logado); `browser_wait_for` 3s
  2. `browser_type` (fill) em `textarea` (Note) = `nota bughunt`; `browser_type` em `input[placeholder="+39 333 1234567"]` (1º) = `3331234567`
  3. `browser_evaluate` → `{notes:"nota bughunt", phone:"3331234567"}` (campos preenchidos na tela)
  4. `browser_click` `button:has-text("Salva modifiche")` → toast "Cliente aggiornato con successo!"
  5. `browser_network_requests` (filter `people/`): `PATCH /people/{id} => 204`; `browser_network_request` `request-body`: `{"name":"BUGHUNT Cliente","role":"contact","email":"bughunt@test.com","phone":null,"secondaryPhone":null,"documentType":null,"documentNumber":null,"birthDate":null,"notes":null,"active":true,"addressId":"78f86440-…"}` (phone/notes/birthDate = null)
  6. `psql`: `select notes, phone, birth_date, updated_at from people where id='78fa11f0-bf41-11f1-b086-7f3146326fef'` → `notes` e `phone` vazios, `birth_date` vazio (só `updated_at` mudou)
  7. Mesmo resultado digitando a data com teclado (`pressSequentially('10051990')`, input mostrou `1990-05-10`) e `birthDate:null` no payload
  8. Contraprova: `/gestionale/clienti` → buscar `BUGHUNT` → lápis (modal) → Note=`nota via modal` → "Salva"; `psql` mesma query → `notes = nota via modal` (grava)
- **Evidência**: payload do passo 5 vs valores do passo 3; SELECT do passo 6 vs passo 8
- **Efeito**: devia gravar o que o usuário digitou; grava tudo vazio com toast de sucesso. Também pode apagar dados existentes (os campos vão null no PATCH). Interação com #3: não dá para cadastrar nascimento nem na criação (422) nem na Scheda (perdido).

### #8 — Richieste (Leads) aceita intervalos invertidos (mínimo > máximo) em orçamento e quartos
- **Tipo**: código (validação)
- **Onde**: `/gestionale/clienti/richieste` → "Nuova richiesta" (`src/pages/Clientes/Leads/*`, schema do lead sem checagem min ≤ max)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/clienti/richieste` (logado)
  2. `browser_click` `button:has-text("Nuova richiesta")`
  3. `browser_fill_form`: `[role=dialog] input[name=name]`=`BUGHUNT Lead`; `input[name=minBudget]`=`500000`; `input[placeholder=a][name=maxBudget]`=`100000`; `input[name=minRooms]`=`5`; `input[name=maxRooms]`=`2`
  4. `browser_click` `[role=dialog] button:has-text("Salva")`
  5. `psql`: `select name, status, min_budget, max_budget, min_rooms, max_rooms from leads where name like 'BUGHUNT%'` → `BUGHUNT Lead | new | 500000.00 | 100000.00 | 5 | 2`
- **Evidência**: SELECT do passo 5 (id `2d98ee60-bf42-11f1-b086-7f3146326fef`)
- **Efeito**: devia bloquear com erro de validação; grava faixa impossível (o casamento lead x imóvel por faixa nunca vai achar nada). Sem erro visível ao usuário. Provável mesmo comportamento em área (`minAreaSqm/maxAreaSqm`), quartos e banheiros: não testados individualmente.

### #9 (UX) — Card de lead mostra "Prezzo richiesto (€): ≤ 0" quando o orçamento é 0
- **Tipo**: valor / clareza
- **Onde**: `/gestionale/clienti/richieste`, cards da coluna "Nuovo"
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/clienti/richieste`
  2. `browser_evaluate` `document.querySelector('main').innerText` → cards como `Fidato Vittorio … Prezzo richiesto (€): ≤ 0`, `Aletto Giuseppe … ≤ 0`, `Bifolco … ≤ 0`
  3. `psql`: `select name, max_budget from leads where name in ('Fidato Vittorio','Aletto Giuseppe','Bifolco')` → `0.00` nos três
  4. `psql`: `select count(*) filter (where max_budget=0) zero, count(*) filter (where max_budget is null) nulos, count(*) filter (where max_budget>0) positivos from leads` → `40 | 7 | 98`
- **Evidência**: texto do passo 2 + SELECT dos passos 3-4
- **Efeito**: 0 significa "sem orçamento informado" (40 de 145 leads), mas aparece como teto de "≤ 0 €". Devia ocultar a linha (como faz com null) ou mostrar "—".

### #10 — Proprietà: filtro "Prezzo da/a" usa só `salePrice`; imóveis de aluguel nunca aparecem
- **Tipo**: valor divergente do banco / código
- **Onde**: `/gestionale/proprieta` (`src/pages/Imoveis/hooks/*` que monta o `where` com `salePrice gte/lte`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta` (logado)
  2. `browser_click` filtro "Finalità" → `[role=option][aria-selected]` texto "Affitto" (lista passa a 941 resultados)
  3. `browser_type` em `input[placeholder="Prezzo da"]` = `500`; `browser_wait_for` 3s
  4. `browser_evaluate` → `Pagina 1 di 1 · 0 risultati` / "Nessun immobile trovato."
  5. `browser_network_requests` (filter `properties/count`): `GET /properties/count?where={"and":[{"purpose":"rent"},{"salePrice":{"gte":500}}]}` (usa `salePrice`, não `rentPrice`)
  6. `psql`: `select count(*) from properties where purpose='rent' and rent_price>=500` → `602`
  7. `psql`: `select count(*) filter (where purpose='rent' and sale_price is null) rent_sem_sale, count(*) filter (where purpose='rent' and rent_price is not null) rent_com_rent from properties` → `941 | 940`
- **Evidência**: `.playwright-mcp/proprieta-affitto-prezzo-0.png`; request do passo 5; SELECTs 6-7
- **Efeito**: devia filtrar aluguéis por `rentPrice` (e "vendita e affitto" por ambos); mostra 0 de 602. Qualquer faixa de preço esconde todos os imóveis de aluguel mesmo sem filtro de Finalità (ex.: `Prezzo da 1000000` mostra 102, só vendas).

### #11 — Mapa de imóveis plota em (0,0) imóveis sem coordenada real (6323 de 8811)
- **Tipo**: valor divergente do banco / código
- **Onde**: `/gestionale/proprieta` (vista mapa). `src/pages/Imoveis/hooks/usePropertyLocations.ts` (só descarta `null`, aceita `0`) + `src/pages/Imoveis/components/PropertyMapView.tsx` (`fitBounds` nos pontos)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta` (logado)
  2. `browser_type` em `input[placeholder="Cerca per codice, titolo o descrizione..."]` = `R-7497`
  3. `browser_evaluate` clicando o 3º botão do grupo de vistas (ícone de mapa)
  4. `browser_take_screenshot` → mapa só com fundo azul (oceano), nenhum pin de Napoli/Portici, sem a mensagem "nessun immobile sul mapa"
  5. `browser_network_requests` (static, filter `tile`): tiles `https://tile.openstreetmap.org/16/32767/32768.png` (zoom 16 no ponto 0°N 0°E) depois de zoom 12 sobre Napoli
  6. `psql`: `select l.latitude, l.longitude from properties p left join property_location_details l on l.property_id=p.id where p.code='R-7497'` → `0.0000000 | 0.0000000`
  7. `psql`: `select count(*) filter (where latitude=0 and longitude=0) zero_zero, count(*) filter (where latitude is null) nulos, count(*) filter (where latitude<>0) validos from property_location_details` → `6323 | 2434 | 54`
- **Evidência**: `.playwright-mcp/proprieta-map.png`; tiles do passo 5; SELECTs 6-7
- **Efeito**: imóvel sem localização devia ser ignorado (e mostrar o aviso de mapa vazio); vai para (0,0) e o mapa pula para o oceano. Só 54 imóveis têm coordenada válida. Causa dupla: dados gravados como 0 em vez de null + front sem guarda para (0,0).

### #12 — Scheda do imóvel: campo "Proprietario" aparece vazio ("Seleziona un proprietario") para quase todos os imóveis
- **Tipo**: valor divergente do banco / código
- **Onde**: `/gestionale/proprieta/:id` → aba 1 "Generale" (`src/pages/Imoveis/Scheda/components/DettagliMainFields.tsx` e o select de proprietário). A lista de opções vem de `GET /people?filter={"order":["name ASC"],"limit":200}`: só 200 das 21.339 pessoas; o dono do imóvel não está entre elas e o select mostra placeholder
- **Como reproduzir**:
  1. `psql`: `select p.owner_id, o.name from properties p join people o on o.id=p.owner_id where p.code='R-7497'` → `b43dd4c6-abd9-11f1-8675-f59a3b58db99 | palumbo maria corso garibaldi parco crimi`
  2. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/be512d40-abd9-11f1-86c3-d9570c3397d4` (logado); `browser_wait_for` 3s
  3. `browser_take_screenshot` → campo Proprietario mostra o placeholder "Seleziona un proprietario" (campo obrigatório `*`)
  4. `browser_evaluate` → `[...document.querySelectorAll('button')]` com texto "proprietario" = `["Seleziona un proprietario","Seleziona un proprietario"]`; nenhum input com o id do dono
  5. `browser_network_requests` (filter `/people`): `GET /people?filter={"order":["name ASC"],"limit":200}` (única chamada)
  6. Lista de imóveis (`/gestionale/proprieta`) mostra o mesmo imóvel com Proprietario "palumbo maria corso garibaldi parco crimi" (campo `owner` incluído na listagem)
- **Evidência**: `.playwright-mcp/imovel-scheda-1.png`; request do passo 5; SELECT do passo 1
- **Efeito**: devia mostrar o dono atual (ou buscar o dono pelo id); mostra vazio, parece que o imóvel não tem proprietário e o usuário não consegue ver nem confirmar quem é. O PATCH preserva o `ownerId` (payload verificado), então não apaga o dado, mas induz a trocar o proprietário por engano. Também afeta qualquer dono fora dos 200 primeiros por nome.

### #15 — Busca do campo "Proprietario" só filtra 200 pessoas; não acha quem está fora dos 200 primeiros
- **Tipo**: código (mesma raiz do #12)
- **Onde**: `/gestionale/proprieta/nuovo` (e Scheda) → select "Proprietario" e "Proprietari aggiuntivi"
- **Como reproduzir**:
  1. `psql`: `select name from people where name ilike '%Devivo%'` → `Devivo Maria` (21.339 pessoas no total)
  2. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/nuovo` (logado); `browser_wait_for` 2s
  3. `browser_click` `button:has-text("Seleziona un proprietario") >> nth=0`
  4. `browser_type` em `input[placeholder="Cerca un cliente..."]` = `Devivo`; `browser_wait_for` 2s
  5. `browser_evaluate` listando `[role=option]` (exceto as categorias) → `[]` (nenhum resultado)
  6. `browser_network_requests` (filter `/people`): só `GET /people?filter={"order":["name ASC"],"limit":200}` da abertura da página; nenhuma chamada nova ao digitar
- **Evidência**: `.playwright-mcp/imovel-owner-busca-vazia.png`; SELECT do passo 1; lista de requests do passo 6
- **Efeito**: devia buscar no servidor (`name ilike`); só os 200 primeiros por nome (códigos/símbolos, "... luigi via moretti") ficam disponíveis. Praticamente impossível cadastrar/editar imóvel com a maioria dos 21.339 proprietários.

### #17 — Scheda do imóvel: campo "Città" aparece vazio ("Seleziona un comune") quando a cidade não está na lista fixa de 8 comuni
- **Tipo**: valor divergente do banco / código
- **Onde**: `/gestionale/proprieta/:id` → aba 3 "Localizzazione" (`src/pages/Imoveis/components/PropertyLocationTab.tsx` usa `PROPERTY_CITY_OPTIONS` de `src/constants/cities.ts`, 8 cidades)
- **Como reproduzir**:
  1. `psql`: `select p.id, p.code, a.city from properties p join addresses a on a.id=p.address_id where a.city='San Sebastiano al Vesuvio' limit 1` → `bec265a4-abd9-11f1-86c3-d9570c3397d4 | R-56772003 | San Sebastiano al Vesuvio`
  2. `psql`: `select count(*) from properties p join addresses a on a.id=p.address_id where a.city not in ('Napoli','Portici','San Giorgio a Cremano','Ercolano','Torre del Greco','Pozzuoli','Arzano','Massa Lubrense')` → `329`
  3. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/bec265a4-abd9-11f1-86c3-d9570c3397d4`; `browser_wait_for` 3s
  4. `browser_click` `[role=tab]:has-text("Localizzazione")`
  5. `browser_evaluate` nos `[role=combobox]` visíveis → `["Italia","Seleziona un comune"]`
  6. Contraprova de que o dado não se perde: "Avanti" → `PATCH /addresses/…` com `"city":"San Sebastiano al Vesuvio"`; `psql` mantém a cidade
- **Evidência**: `.playwright-mcp/imovel-cidade-fora-lista.png`; resultado do passo 5; payload do passo 6
- **Efeito**: devia mostrar a cidade salva; mostra placeholder em 329 imóveis (4% do portfólio: San Sebastiano al Vesuvio 214, Pollena Trocchia 22, Cercola 18, …). Dado não é apagado, mas o usuário não vê a cidade. O filtro "Comune" e o formulário só oferecem 8 de 41 cidades existentes.

### #19 — "Duplicar imóvel" falha com 422 em qualquer imóvel que tenha preço
- **Tipo**: código (tipo numérico: API devolve `numeric` do Postgres como string, front reenvia a string)
- **Onde**: `/gestionale/proprieta` (vista grade, botão copiar) → `src/pages/Imoveis/hooks/useDuplicateProperty.ts:26-40` (repassa `property.salePrice/rentPrice/condoFee/areaSqm` direto)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta`; `browser_type` busca = `BH-0001` (imóvel com `sale_price = 150000.00`); trocar para vista grade (2º botão do grupo de vistas)
  2. `browser_click` `button:has(svg.lucide-copy)`
  3. `browser_network_requests` (filter `POST|properties$`): `POST /properties => 422`
  4. `browser_network_request` `request-body`: `{"code":"BH-0001-COPIA","title":"BUGHUNT Immobile (copia)",…,"salePrice":"150000.00",…}` e `response-body`: `{"error":{"statusCode":422,…,"details":[{"path":"/salePrice","code":"type","message":"Il campo '/salePrice' deve essere di tipo number,null."}]}}`
  5. `psql`: `select id, code from properties where code like 'BH-0001%'` → só o original (nada criado)
- **Evidência**: request/response do passo 4; `.playwright-mcp/imovel-duplicar-422.png`
- **Efeito**: duplicar devia criar a cópia e abrir a Scheda; dá erro para todo imóvel com preço (só funciona se o preço for null). Obs: a duplicata reaproveita o mesmo `addressId` (comentário `ponytail` no código indica que é intencional), então editar o endereço de um muda o outro.

### #18 — Scheda do imóvel: aba "Storico" não mostra a alteração de preço recém-feita (cache não invalidado)
- **Tipo**: código (TanStack Query sem invalidação após mutation)
- **Onde**: `/gestionale/proprieta/:id` → aba 12 "Storico" (`src/pages/Imoveis/Scheda/components/PropertyStoricoTab.tsx` + hook de `property-price-histories`)
- **Como reproduzir**:
  1. Criar imóvel `BH-0001` (ver #14/#16) até o passo 3 → abre `/gestionale/proprieta/8a1dd140-bf43-11f1-b086-7f3146326fef`
  2. `browser_click` `[role=tab]:has-text("Prezzo")`; `browser_type` (lento) em "Prezzo di vendita" = `15000000` (máscara vira `150.000,00`); clicar o "Avanti" visível
  3. `psql`: `select previous_price, new_price, changed_at from property_price_histories where property_id='8a1dd140-bf43-11f1-b086-7f3146326fef'` → `NULL | 150000.00 | 2026-10-03 13:00:32`
  4. `browser_click` `[role=tab]:has-text("Storico")`; `browser_evaluate` do painel → `Storico prezzo — Nessuna modifica registrata.`
  5. `browser_navigate` (recarregar a mesma URL) → aba Storico → `— → 150.000,00 € · 03/10/2026 13:00`
- **Evidência**: textos dos passos 4 e 5 + SELECT do passo 3
- **Efeito**: o histórico devia aparecer logo; só aparece depois de recarregar a página.

### #16 (UX) — Wizard do imóvel: mensagens de erro continuam visíveis depois de corrigir o campo
- **Tipo**: código (validação / UX)
- **Onde**: `/gestionale/proprieta/nuovo`, aba Generale (`src/pages/Imoveis/hooks/usePropertyForm.ts:105`, `useForm` sem `reValidateMode` e validação por etapa via botão "Avanti")
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/nuovo` (logado)
  2. `browser_click` `button:has-text("Avanti") >> nth=0` com tudo vazio → erros em Codice, Titolo, Categoria, Proprietario
  3. `browser_fill_form`: `input[name=code]`=`BH-0001`, `input[name=title]`=`BUGHUNT Immobile`
  4. `browser_click` `#base-ui-_r_n_` (Categoria) → opção "Residenziale"
  5. `browser_press_key` Escape; `browser_evaluate` → `values: {code:"BH-0001", title:"BUGHUNT Immobile"}` e textos `["Inserisci almeno 3 caratteri","Seleziona una categoria","Seleziona un proprietario"]` ainda na tela
- **Evidência**: `.playwright-mcp/imovel-owner-busca-vazia.png` (Titolo "BUGHUNT Immobile" com o erro "Inserisci almeno 3 caratteri"; Categoria "Residenziale" com "Seleziona una categoria")
- **Efeito**: erro devia sumir ao corrigir; o usuário vê mensagem falsa ("mín. 3 caracteres" com 16 digitados) até clicar Avanti outra vez.

### #20 — Nuova proposta: selects "Immobile" e "Acquirente" (e filtros da lista) só carregam 200 registros; busca não acha o resto
- **Tipo**: código (mesma raiz do #15)
- **Onde**: `/gestionale/proposte` → "Nuova proposta" (selects de imóvel `GET /properties?filter={"order":["code ASC"],"limit":200}` e acquirente `GET /people?filter={"order":["name ASC"],"limit":200}`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proposte` (logado); `browser_click` "Nuova proposta"
  2. `browser_click` `[role=dialog] button:has-text("Seleziona un immobile")`
  3. `browser_evaluate` → 200 `[role=option]`, primeiros: `000002 · 1232133`, `000002 · 22222`, `000002 · 1234`
  4. `browser_type` em `input[placeholder="Cerca per codice o titolo..."]` = `R-7497` (imóvel que existe: `select code from properties where code='R-7497'` → 1 linha)
  5. `browser_take_screenshot` → "Nessun risultato."
  6. `browser_network_requests` (filter `/properties|/people`): só os GET com `limit:200`, nenhum GET novo ao digitar
- **Evidência**: `.playwright-mcp/proposte-imovel-busca.png`; requests do passo 6
- **Efeito**: 8.626 dos 8.826 imóveis (e a maioria dos 21.339 clientes) não podem ser escolhidos numa proposta; só aparecem os 200 primeiros por código/nome (na prática, imóveis de teste `000002`). Devia buscar no servidor.

### #21 — Proposta aceita "Valida fino al" anterior à "Data proposta"
- **Tipo**: código (validação)
- **Onde**: `/gestionale/proposte` → "Nuova proposta" (`src/pages/Proposte/schemas/*`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proposte`; `browser_click` "Nuova proposta"
  2. `browser_fill_form`: `[role=dialog] input[name=number]`=`BH-P1`; `input[name=proposalDate]`=`2026-10-03`; `input[name=validUntil]`=`2026-09-01`; `browser_type` (lento) em `input[name=proposalAmount]` = `10000000` (máscara → 100.000,00)
  3. Escolher imóvel (busca `1234` → `000002 · 1234`) e acquirente (1ª opção); `browser_click` `[role=dialog] button:has-text("Salva")`
  4. `psql`: `select number, proposal_date, valid_until from purchase_proposals where number like 'BH-%'` → `BH-P1 | 2026-10-03 | 2026-09-01`
- **Evidência**: SELECT do passo 4; linha `BH-P1 … 03/10/2026 … Ricevuta` na lista
- **Efeito**: devia bloquear (validade ≥ data da proposta); grava proposta já vencida na criação.

### #22 — Coluna "Creata da" sempre "—": a API nunca grava `createdById` (propostas, clientes, imóveis, leads)
- **Tipo**: código (backend) / valor
- **Onde**: `/gestionale/proposte` coluna "Creata da"; `devit-api/src/controllers/purchase-proposal.controller.ts` (sem `createdById`; só `calendar-event.controller.ts:152-155` usa `this.currentUser?.id`)
- **Como reproduzir**:
  1. Criar a proposta `BH-P1` (passos de #21)
  2. `browser_evaluate` nas linhas da tabela → `BH-P1 | 000002 | … | 03/10/2026 | Ricevuta | No | — | — | — | — |` (coluna "Creata da" = `—`)
  3. `psql`: `select count(*) total, count(created_by_id) com_criador from purchase_proposals` → `4 | 0`
  4. `psql`: `select count(created_by_id) from people` → 12.794 de 21.339 (clientes novos criados pela UI ficam NULL; ver #6/#3 nos testes)
- **Evidência**: saída do passo 2 + SELECT do passo 3
- **Efeito**: a coluna existe mas nunca é preenchida; o usuário não sabe quem criou a proposta (e o filtro "Solo le mie" não pode filtrar por criador).

### #24 — Venda marcada como "Venduta" não muda o status do imóvel (continua "Disponibile")
- **Tipo**: inconsistência entre telas / regra de negócio
- **Onde**: `/gestionale/operazioni/vendite` (venda) x `/gestionale/proprieta` (imóvel). `devit-api` (controller de `sales`) não atualiza `properties.status`; o front também não
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/vendite` (logado); "Nuova vendita"
  2. Passo 1: `input[name=number]`=`BH-V1`, `input[name=saleDate]`=`2026-10-03`; imóvel (busca `1234` → `000002 · 1234`), venditore e acquirente (opções do select); passo 2 "Pagamento": `input[name=finalAmount]` (lento) `10000000` → `100.000,00`; "Salva"
  3. Reabrir a venda (lápis) → passo "Pagamento" → Stato → "Venduta" → "Salva"
  4. `psql`: `select s.number, s.status, p.code, p.status from sales s join properties p on p.id=s.property_id where s.number='BH-V1'` → `BH-V1 | sold | 000002 | available`
  5. `psql`: `select count(*) from property_status_history where property_id = '47fc4c00-adec-11f1-abfb-11bc3f94ddb5'` → `0` (sem histórico de status)
  6. `psql`: `select status, count(*) from properties group by 1` → só `available | 8826`, embora exista a venda `S1` com status `sold`
  7. Mesma coisa com locação: criar contrato (ver #26) em `000002 · 1234` com `situation = active`; `psql`: `select p.code, p.status, rc.situation from rental_contracts rc join properties p on p.id=rc.property_id where rc.number in ('BH-L1','RC2')` → `T1 | available | active` e `000002 | available | active` (devia ser `rented`/"Affittato")
- **Evidência**: SELECTs 4-7
- **Efeito**: imóvel vendido continua disponível na lista, nos filtros "Stato", na Home e no site público; "Venduto" nunca é atingido. Devia virar `sold` (e gravar `property_status_history`) ao concluir a venda.

### #25 — Venda aceita vendedor que não é o proprietário do imóvel (e vendedor = comprador)
- **Tipo**: código (validação / integridade)
- **Onde**: `/gestionale/operazioni/vendite` → "Nuova vendita"
- **Como reproduzir**:
  1. Mesmos passos 1-2 do #24 com venditore = `... luigi via moretti` e acquirente = `.... nicola via salvo d'acquisto`
  2. `psql`: `select sl.name seller, p.owner_id=s.seller_id seller_is_owner from sales s join properties p on p.id=s.property_id join people sl on sl.id=s.seller_id where s.number='BH-V1'` → `... luigi via moretti | f`
  3. `psql`: `select s.number, sl.name, b.name from sales s join people sl on sl.id=s.seller_id join people b on b.id=s.buyer_id where s.number in ('V000002','V000003')` → `Luca Bianchi | Luca Bianchi` (vendedor = comprador em 2 vendas existentes)
- **Evidência**: SELECTs 2-3
- **Efeito**: o formulário não sugere nem exige que o vendedor seja o dono do imóvel e não impede vendedor = comprador. Dados de venda incoerentes com o cadastro do imóvel.

### #26 — Contrato de locação aceita dia de vencimento 45, fim anterior ao início e aviso negativo (front e API)
- **Tipo**: código (validação em front e backend)
- **Onde**: `/gestionale/operazioni/locazioni` → "Nuovo contratto" (`src/pages/Operazioni/Locazioni/schemas/*`); `devit-api` `RentalContract` (sem `minimum/maximum` em `dueDay`/`noticeDays` e sem regra de datas)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/locazioni` (logado); `browser_click` `button:has-text("Nuov")`
  2. `browser_fill_form`: `input[name=number]`=`BH-L1`; `startDate`=`2026-10-10`; `endDate`=`2026-10-01`; `dueDay`=`45`; `noticeDays`=`-5`
  3. `browser_click` Salva → só 4 erros (imóvel, proprietário, inquilino, valor); nenhum sobre data/dia/aviso
  4. Escolher imóvel (busca `1234`), proprietário e inquilino (opções dos selects); `input[name=rentAmount]` (lento) `80000` → `800,00`; Salva
  5. `browser_network_requests` (filter `rental-contracts`): `POST /rental-contracts => 200`
  6. `psql`: `select number, start_date, end_date, due_day, notice_days from rental_contracts where number='BH-L1'` → `BH-L1 | 2026-10-10 | 2026-10-01 | 45 | -5`
- **Evidência**: request do passo 5 + SELECT do passo 6
- **Efeito**: devia recusar (dia 1-31, fim ≥ início, aviso ≥ 0); cria contrato impossível (a API também não valida, então qualquer cliente HTTP grava lixo). Os cálculos de vencimento/reajuste/scadenziario partem desses campos.

### #27 (UX) — Adeguamento canone: percentual exibido como "3.500%" (lê-se 3500% em italiano)
- **Tipo**: valor / formatação
- **Onde**: `/gestionale/operazioni/adeguamenti-canone`, tabela "Ultimi adeguamenti generati", coluna "Indice %" (`src/pages/Operazioni/Locazioni/Adeguamenti/index.tsx` e componente da tabela)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/adeguamenti-canone` (logado, italiano); `browser_wait_for` 3s
  2. `browser_evaluate` `document.body.innerText` → linhas `RC2 3.500% 1200,00 € 1242,00 € 31/08/2026`, `RC1 5.000% 1000,00 € 1050,00 € 21/08/2026`
  3. `psql`: `select rc.number, ra.index_percent, ra.old_amount, ra.new_amount from rental_adjustments ra join rental_contracts rc on rc.id=ra.rental_contract_id order by ra.effective_date desc` → `3.500`, `5.000` (3,5% e 5%)
- **Evidência**: texto do passo 2 + SELECT do passo 3
- **Efeito**: o valor do banco (`numeric(6,3)`) é impresso cru com 3 casas, enquanto os € usam formato italiano (`1242,00`). Em italiano "3.500" é três mil e quinhentos. Devia ser "3,5%" / "5%".

### #28 (UX) — "Scadenza" no Scadenziario é a data de rinnovo (fim − aviso), não a data de fim mostrada em Locazioni
- **Tipo**: inconsistência entre telas (rótulo ambíguo)
- **Onde**: `/gestionale/operazioni/scadenziario` (coluna "Scadenza") x `/gestionale/operazioni/locazioni` (coluna "Al")
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/scadenziario`; `browser_fill_form` `input[type=number]` (Finestra di giorni) = `500`; `browser_wait_for` 2s
  2. `browser_evaluate` nas linhas → `RC2 Casa teste este Owner este Owner 01/09/2027 1242,00 €`
  3. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/locazioni`; `browser_evaluate` → `RC2 | … | 31/12/2025 | 30/11/2027 | Attivo | Sì`
  4. `psql`: `select number, end_date, notice_days, renewal_due_date from rental_contracts where number='RC2'` → `RC2 | 2027-11-30 | 90 | 2027-09-01`
- **Evidência**: textos dos passos 2-3 + SELECT do passo 4
- **Efeito**: o mesmo contrato mostra "Scadenza 01/09/2027" numa tela e "Al 30/11/2027" na outra; o primeiro é `renewal_due_date`. Sem legenda/tooltip o usuário acha que há divergência. Devia chamar "Rinnovo entro"/"Disdetta entro" ou explicar. Extra: a "Finestra di giorni" aceita `-30` (`GET /reports/rentals/upcoming-renewals?days=-30 => 200`) e só mostra lista vazia, sem validação.

### #29 — Registrazioni lista contrato rescindido (RC1) como "Da registrare"
- **Tipo**: inconsistência entre telas / regra de negócio
- **Onde**: `/gestionale/operazioni/registrazioni` x `/gestionale/operazioni/locazioni`
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/registrazioni`; `browser_wait_for` 3s
  2. `browser_evaluate` nas linhas → `RC1 — Da registrare 31/12/2025 – — T1 este Owner` e `RC2 01/09/2027 Da registrare 31/12/2025 – 30/11/2027 T1 este Owner`
  3. `browser_navigate` → `/gestionale/operazioni/locazioni`; linha RC1 → situação "Rescisso"
  4. `psql`: `select number, situation, registered_at from rental_contracts` → `RC1 | terminated | NULL`, `RC2 | active | NULL`
- **Evidência**: textos dos passos 2-3 + SELECT do passo 4
- **Efeito**: contrato encerrado não precisa ser registrado, mas entra na fila de registro com "Da registrare" (e sem data de scadenza). A coluna "Scadenza" aqui também é `renewal_due_date` (ver #28).

### #30 (UX/valor) — Marketing › Bacheca: "Totale 28" sem período; o banco tem 36 comunicações (as de 30 dias, sem pendentes)
- **Tipo**: valor divergente do banco / clareza
- **Onde**: `/gestionale/marketing` aba Bacheca › E-mail Marketing (`GET /reports/communications/by-channel-status`, sem parâmetro → janela de 30 dias)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/marketing` (logado); `browser_wait_for` 3s
  2. `browser_evaluate` do texto → `Totale 28 · Fallito 13 · Inviato 15`
  3. `browser_network_request` (index do `by-channel-status`), `response-body` → `[{"channel":"email","status":"failed","total":13},{"channel":"email","status":"sent","total":15}]`
  4. `psql`: `select channel, status, count(*) from communication_logs group by 1,2 order by 1,2` → `email failed 14`, `email pending 4`, `email sent 18` (total 36)
  5. `psql`: mesma query com `where created_at > now() - interval '30 days'` → `failed 13`, `sent 15` (28)
- **Evidência**: `.playwright-mcp/marketing-bacheca.png`; passos 3-5
- **Efeito**: o cartão "Totale" não diz que é "últimos 30 dias" (a página Statistiche diz). O usuário compara com Storico/banco e vê 36. Os 4 pendentes nunca aparecem em nenhum cartão. Devia rotular o período e incluir "In attesa".

### #31 (UX) — Marketing › Storico mostra o UUID da campanha na coluna "Campagna"
- **Tipo**: valor / clareza
- **Onde**: `/gestionale/marketing` aba Storico; `GET /marketing-campaigns` devolve só `campaignId` (não existe tabela de campanhas nem campo de nome)
- **Como reproduzir**:
  1. `browser_navigate` → `/gestionale/marketing`; `browser_click` `[role=tab]:has-text("Storico")`
  2. `browser_evaluate` nas linhas → `c19778ae-710a-49a1-887c-0cdf733e87d6 E-mail 10/09/2026 1 1 0 1`, `219f7816-3b94-42f4-b87e-d5e754cf6dbf E-mail 10/09/2026 7 7 0 1`, …
  3. `psql`: `\dt` (nenhuma tabela de campanhas) e `select campaign_id, count(*) from communication_logs where campaign_id is not null group by 1` → 7 UUIDs (totais 8, 7, 7, 5, 1, 1, 1; batem com a tabela)
- **Evidência**: saída do passo 2 + SELECT do passo 3 (números batem)
- **Efeito**: a campanha é identificada só por UUID; ilegível para o usuário. Devia ter nome/assunto (ex.: assunto do e-mail ou nome dado em "Invia campagna").

### #32 — Marketing › Modelli: modelo de e-mail é salvo sem conteúdo e sem assunto ("Corpo *" obrigatório satisfeito pelo HTML vazio do editor)
- **Tipo**: código (validação)
- **Onde**: `/gestionale/marketing` aba Modelli → "Nuovo modello" (campos Nome *, Canale *, Categoria *, Oggetto, Corpo *)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/marketing`; `browser_click` `[role=tab]:has-text("Modelli")`; `browser_click` "Nuovo modello"
  2. `browser_fill_form` `[role=dialog] input[name=name]` = `BUGHUNT Modello` (não preencher mais nada)
  3. `browser_click` `[role=dialog] button:has-text("Salva")` → o diálogo fecha sem erro
  4. `psql`: `select name, channel, subject, length(body) from communication_templates where name='BUGHUNT Modello'` → `BUGHUNT Modello | email | NULL | 4998`
  5. `psql`: remover tags/CSS do `body` (`regexp_replace(... '<[^>]+>' ...)`) → texto visível vazio (`96` sobra do CSS)
- **Evidência**: SELECTs 4-5
- **Efeito**: devia exigir conteúdo (e assunto para e-mail); grava modelo vazio que depois pode ser usado numa campanha e enviar e-mail em branco.

### #33 — Marketing › Invia campagna: "Cerca immobile…" não acha imóvel pelo código (só pelo título)
- **Tipo**: código
- **Onde**: `/gestionale/marketing` aba "Invia campagna" › "Immobili da allegare"; `GET /properties?filter={"where":{"title":{"ilike":"%…%"}},"order":["title ASC"],"limit":50}`
- **Como reproduzir**:
  1. `browser_navigate` → `/gestionale/marketing`; `browser_click` `[role=tab]:has-text("Invia campagna")`
  2. Na lista cada imóvel aparece como `código · título` (ex.: `000002 · 1234`, `R-1111465145512084 · Acciaroli`)
  3. `browser_type` em `input[placeholder="Cerca immobile..."]` = `R-7497` (código que existe: `select code from properties where code='R-7497'` → 1 linha)
  4. `browser_evaluate` → mensagem `Nessun immobile trovato`
  5. `browser_network_requests` (filter `/properties`): `GET /properties?filter={"where":{"title":{"ilike":"%R-7497%"}},…}` (filtra só `title`)
- **Evidência**: texto do passo 4 + request do passo 5
- **Efeito**: o usuário vê o código na lista e naturalmente busca por ele; não encontra. Devia filtrar `code` OU `title` (como a lista de Proprietà). Observação positiva: a busca de pessoas aqui é no servidor (`name ilike`), ao contrário dos selects de #15/#20.

### #34 (desempenho) — Marketing consulta `GET /marketing/whatsapp/status` em loop em todas as abas (≈38 chamadas em ~2,5 min)
- **Tipo**: código (polling sem necessidade)
- **Onde**: `/gestionale/marketing` (qualquer aba, incluindo Bacheca E-mail, Invia campagna, Storico, Modelli, Rimozioni)
- **Como reproduzir**:
  1. `browser_navigate` → `/gestionale/marketing`; navegar pelas abas Bacheca, Invia campagna, Storico, Modelli, Rimozioni durante ~2 min
  2. `browser_network_requests` (filter `whatsapp`) → `GET /marketing/whatsapp/status => 200` repetido (índices 4382…4474, ~38 requisições); `response-body` → `{"connected":true}`
- **Evidência**: lista de requests do passo 2
- **Efeito**: polling contínuo (~a cada 4 s) mesmo quando a aba WhatsApp não está visível; carga desnecessária no backend/WhatsApp. Devia consultar só na aba WhatsApp (ou parar com a aba oculta).

### #35 — Amministrazione › Utenti: aceita criar usuário com e-mail já existente (sem índice único)
- **Tipo**: código (backend / integridade)
- **Onde**: `/gestionale/amministrazione/utenti` → "Nuovo utente"; `devit-api` `User` (sem `unique` em `email`; `pg_indexes` de `users` só tem `users_pkey`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/utenti` (logado como admin); `browser_click` `button:has-text("Nuovo")`
  2. `browser_fill_form`: `[role=dialog] input[name=fullName]`=`BUGHUNT User`; `input[name=email]`=`admin@devit.com` (já existe); `input[name=password]`=`1` → "La password deve contenere almeno 6 caratteri" (validação ok)
  3. Trocar a senha para `123456`; escolher "Livello di accesso" = "Agente"; `browser_click` "Salva" → sem erro
  4. `psql`: `select full_name, email, access_level from users where email='admin@devit.com' or full_name like 'BUGHUNT%'` → duas linhas: `BUGHUNT User | admin@devit.com | broker` e `Administrador HeaderTest | admin@devit.com | admin`
  5. `psql`: `select indexname from pg_indexes where tablename='users'` → só `users_pkey`
  6. `browser_evaluate` com `fetch('/auth/login')` para `admin@devit.com`: senha `123456` → `401`; `admin123` → `200` (token do admin original)
- **Evidência**: SELECTs 4-5 e respostas do passo 6
- **Efeito**: devia responder 409/422 "e-mail já cadastrado". O login resolve para a 1ª conta, então o novo usuário nunca consegue entrar e dois cadastros disputam o mesmo e-mail (lista de Utenti, recuperação de senha, logs de auditoria ficam ambíguos).

### #36 — Amministrazione › Filiali: aceita nome de filial duplicado (sem índice único)
- **Tipo**: código (backend / integridade)
- **Onde**: `/gestionale/amministrazione/filiali` → "Nuova filiale"; `devit-api` `Branch` (só `branches_pkey`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/filiali`; `browser_click` `button:has-text("Nuova")`
  2. `browser_fill_form` `[role=dialog] input[name=name]` = `Agenzia di Napoli` (já existe); `browser_click` "Salva" → sem erro
  3. `psql`: `select id, name from branches order by created_at` → duas linhas `Agenzia di Napoli` (`ac91b120-…` e `a1af1290-…`); a lista mostra 2 linhas idênticas
  4. `psql`: `select indexname from pg_indexes where tablename in ('branches','property_categories','neighborhoods')` → só os `_pkey`
- **Evidência**: SELECTs 3-4
- **Efeito**: devia recusar duplicidade; duas filiais idênticas na lista e nos selects de usuário (impossível distinguir). A UI não deixa distinguir a original da cópia (precisei renomear para identificar antes de excluir). Mesmo gap sem índice em categorias (`name`/`slug`) e zonas (`neighborhoods.name`).
- Observação: o modal de filial só tem "Nome" e "Attiva"; telefone, e-mail, coordenadas e endereço existem na tabela `branches` mas não têm campo na UI.

### #37 — Excluir categoria em uso devolve 500 "Internal Server Error" (em inglês) em vez de mensagem clara
- **Tipo**: código (backend + mensagem de erro)
- **Onde**: `/gestionale/amministrazione/categorie` → lixeira; `DELETE /property-categories/{id}`; `devit-api` (sem tratar a FK `properties.category_id`)
- **Como reproduzir**:
  1. `psql`: `select count(*) from properties p join property_categories c on c.id=p.category_id where c.name='Terreno'` → `4`
  2. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/categorie` (logado)
  3. `browser_click` `tr:has-text("Terreno") button:has(svg.lucide-trash-2)`; `browser_click` `[role=dialog] button:has-text("Elimina")`
  4. `browser_network_requests` (filter `property-categories`): `DELETE /property-categories/bd645c40-… => [500] Internal Server Error`; `response-body`: `{"error":{"statusCode":500,"message":"Internal Server Error"}}`
  5. `browser_take_screenshot` → toast vermelho "Internal Server Error"; a categoria continua na lista e no banco
- **Evidência**: `.playwright-mcp/categorie-delete-uso.png`; passo 4
- **Efeito**: devia ser 409/422 com texto do tipo "Categoria in uso da 4 immobili" (italiano/português). Hoje o usuário vê um erro técnico em inglês (regra do projeto: textos em italiano/português). Provável o mesmo em Zone (bairros/propriedades) e Filiali com usuários.

### #38 — Banner aceita link `javascript:` e ordem negativa (sem validação em front nem API)
- **Tipo**: código (validação / segurança)
- **Onde**: `/gestionale/amministrazione/banner/nuovo` (`targetLink`, `displayOrder`); `devit-api` `HomeBanner`
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/banner/nuovo` (logado)
  2. `browser_fill_form`: `input[name=title]`=`BUGHUNT Banner`; `input[name=targetLink]`=`javascript:alert(1)`; `input[name=displayOrder]`=`-5`
  3. `browser_click` `text="Clicca per caricare"` (1º) + `browser_file_upload` com um PNG; `browser_click` `button[type=submit]:has-text("Salva")` (sem imagem a validação funciona: "Seleziona un'immagine per il banner")
  4. `psql`: `select title, target_link, display_order, active from home_banners where title like 'BUGHUNT%'` → `BUGHUNT Banner | javascript:alert(1) | -5 | t`
  5. `browser_navigate` → `http://localhost:5174/` e procurar `a[href^="javascript:"]` → nenhum (o site público não pede banners: requests só de `/public/zones`, `/public/properties*`, `/public/branches`)
- **Evidência**: SELECT do passo 4; lista de requests do passo 5
- **Efeito**: devia aceitar só `http(s)://` (ou caminho interno) e ordem ≥ 0. Se o consumidor dos banners (site/app) renderizar `<a href={targetLink}>`, vira XSS armazenado por qualquer admin. Observação: o site público do devit-web não consome `home_banners` (não achei uso em `src/pages/Site`); confirmar qual cliente os consome, senão "Gestisci i banner della home" não tem efeito visível. Label "Immagine desktop" também não tem `*` embora seja obrigatória.

### #39 — "Log di audit" nunca registra nada (tabela `audit_logs` vazia; nenhuma ação do sistema grava auditoria)
- **Tipo**: valor divergente do banco / funcionalidade ausente
- **Onde**: `/gestionale/amministrazione/audit`; `devit-api`: só `audit-log.controller.ts` expõe `POST /audit-logs` manual; nenhum controller/interceptor usa `AuditLogRepository`
- **Como reproduzir**:
  1. Durante a sessão: criar e excluir usuário, filial, banner, cliente, imóvel, proposta, contrato etc. (ver #3, #35, #36, #38…)
  2. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/audit`; `browser_evaluate` → `Nessun log trovato.` / `Pagina 1 di 1 · 0 risultati`
  3. `psql`: `select count(*) from audit_logs` → `0`
  4. `grep -rn "AuditLogRepository" devit-api/src` → só repositório, controller de CRUD e testes (sem uso em controllers de negócio)
- **Evidência**: texto do passo 2 + `0` do passo 3 + grep do passo 4
- **Efeito**: a tela de auditoria existe no menu mas está sempre vazia: sem rastro de quem criou/alterou/excluiu (inclusive usuários e preços). Devia gravar `action/entity/previousData/newData/userId/ip` nas mutações.

### #40 — Proprietari › "Aggiungi proprietario" só oferece pessoas com perfil `owner` (2); os donos reais dos imóveis são `contact`
- **Tipo**: inconsistência entre telas / valor divergente do banco
- **Onde**: `/gestionale/amministrazione/proprietari` → "Aggiungi proprietario" (`GET /people?filter={"where":{"role":"owner"},"order":["name ASC"],"limit":200}`) x `/gestionale/proprieta` (dono de cada imóvel) x `/gestionale/clienti` (filtro Ruolo "Proprietario")
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/proprietari`; `browser_click` "Aggiungi proprietario"; `browser_click` `[role=dialog] button:has-text("Seleziona un proprietario")`
  2. `browser_evaluate` nas `[role=option]` → `["Luca Bianchi","Teste Proprietario Audit"]`
  3. `browser_network_requests` (filter `/people`): `GET /people?filter={"where":{"role":"owner"},…,"limit":200}`
  4. `psql`: `select o.role, count(distinct p.owner_id) donos, count(*) imoveis from properties p join people o on o.id=p.owner_id group by 1 order by 3 desc` → `contact | 8386 | 8822`, `owner | 1 | 3`, `tenant | 1 | 1`
  5. Na lista de imóveis, o dono (ex.: R-7497 → `palumbo maria corso garibaldi parco crimi`) aparece como "Proprietario" em Proprietà, mas essa pessoa é `contact` em Clienti
- **Evidência**: opções do passo 2 + request do passo 3 + SELECT do passo 4
- **Efeito**: quase todos os proprietários reais (8.386) não podem receber acesso ao portal e não aparecem no filtro "Proprietario" de Clienti (2 resultados). O "papel" da pessoa e a posse do imóvel são conceitos desencontrados; devia usar quem consta em `properties.owner_id`/`property_owners`.

### #41 — Editar banner: campos Titolo, Sottotitolo, Link e Ordine aparecem vazios (a API devolve os valores)
- **Tipo**: código (formulário / `reset` com `keepFieldsRef`)
- **Onde**: `/gestionale/amministrazione/banner/:id` (`src/pages/Amministrazione/Banner/hooks/useBannerForm.ts:52-66`, `form.reset(..., { keepFieldsRef: true })` + `src/pages/Amministrazione/Banner/components/BannerFormFields.tsx` com `register`)
- **Como reproduzir**:
  1. `psql`: `select title, display_order from home_banners where id='f05520a0-ad6c-11f1-bb15-5f964d72d9c2'` → `12321313 | 1`
  2. `browser_navigate` → `http://localhost:5174/gestionale/amministrazione/banner/f05520a0-ad6c-11f1-bb15-5f964d72d9c2`; `browser_wait_for` 6s
  3. `browser_evaluate` nos inputs → `title|`, `subtitle|`, `targetLink|`, `displayOrder|` (todos vazios)
  4. `browser_network_request` do `GET /home-banners/{id}?filter=…` → resposta traz `"title":"12321313","displayOrder":1`
  5. `browser_take_screenshot` (`.playwright-mcp/banner-edit-vazio.png`): Titolo (obrigatório) em branco, preview da imagem carregada
  6. `browser_click` `button[type=submit]:has-text("Salva")` sem tocar em nada → `PATCH /home-banners/{id} => 204`; `psql` mostra `12321313 | 1` mantidos
- **Evidência**: print do passo 5; response do passo 4; SELECT do passo 6
- **Efeito**: o estado interno do formulário está correto (salvar preserva), mas o usuário vê campos em branco e acha que o banner perdeu o título/ordem; vai redigitar ou desistir. Mesmo padrão de fragilidade do `reset` visto em #7 (Scheda de cliente), aqui na direção oposta (DOM não recebe o valor).

### #42 — Site: `/immobile/:id` de imóvel inexistente/inativo mostra página em branco (sem mensagem nem 404)
- **Tipo**: código (estado de erro ausente)
- **Onde**: `http://localhost:5174/immobile/:id` (`src/pages/Site/PropertyDetail`)
- **Como reproduzir**:
  1. `psql`: `select id, code, active, published_on_site from properties where published_on_site and not active` → `2d240b20-adec-11f1-abfb-11bc3f94ddb5 | 000002 | f | t`
  2. `browser_navigate` → `http://localhost:5174/immobile/2d240b20-adec-11f1-abfb-11bc3f94ddb5`; `browser_wait_for` 4s
  3. `browser_network_requests` (filter `public/properties/`): `GET /public/properties/2d240b20-… => [404] Not Found`
  4. `browser_evaluate` do texto da página → só cabeçalho, rodapé e banner de cookies; nada entre eles; título da aba continua "Devit Servizi Immobiliari"; erro de console (404)
- **Evidência**: request do passo 3 + texto do passo 4
- **Efeito**: o visitante (ou link antigo/indexado) vê uma tela vazia. Devia mostrar "Immobile non trovato" com link para `/immobili` (como a rota `*` faz com NotFound). Obs: o backend esconde corretamente o imóvel inativo.

### #43 (UX) — Site: `/zone/<slug inexistente>` mostra "Nessun immobile corrisponde a questi criteri" em vez de página não encontrada
- **Tipo**: código (estado de erro)
- **Onde**: `http://localhost:5174/zone/:zona` (`src/pages/Site/ZoneDetail`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/zone/centro` → título "Immobili a Centro | Devit Immobiliare", "0 immobili disponibili."
  2. `browser_navigate` → `http://localhost:5174/zone/nao-existe`; `browser_wait_for` 3s
  3. `browser_evaluate` de `main` → `Nessun immobile corrisponde a questi criteri.`; título da aba continua `Devit Servizi Immobiliari`
- **Evidência**: textos dos passos 1 e 3
- **Efeito**: URL de zona inventada/errada parece uma zona real sem imóveis; sem breadcrumb, sem título e sem 404 (Google indexa lixo). Obs de dados: a zona "Centro" mostra 0 imóveis porque só 2 imóveis têm bairro vinculado e nenhum está publicado/ativo, embora haja 29 imóveis publicados em Napoli.

### #44 — Site › Richieste (público): aceita "Prezzo max" negativo; mensagem de erro do tipo continua depois de escolher
- **Tipo**: código (validação front + API pública)
- **Onde**: `http://localhost:5174/richieste` → `POST /public/leads` (sem autenticação)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/richieste`; `browser_click` "Invia la richiesta" vazio → erros corretos para todos os campos (validação ok)
  2. `browser_click` "Cerco immobile"; `browser_fill_form`: `desiredCity`=`Napoli`, `maxBudget`=`-5`, `name`=`BUGHUNT Richiesta`, `email`=`bughunt@test.com`, `phone`=`abc`, `message`=`teste automatizzato`
  3. `browser_click` "Invia la richiesta" → ainda mostra "Inserisci un numero di telefono valido", "Devi accettare i termini sulla privacy" **e** "Lasciaci la tua richiesta: stai cercando un immobile…" (esta última já com "Cerco immobile" escolhido: erro obsoleto)
  4. `browser_fill_form` `phone`=`3331234567`; `browser_click` `[role=checkbox][aria-labelledby]`; "Invia la richiesta"
  5. `browser_network_requests`: `POST /public/leads => 200`
  6. `psql`: `select name, source, request_type, desired_city, max_budget from leads where name like 'BUGHUNT%'` → `BUGHUNT Richiesta | site | search | Napoli | -5.00`
- **Evidência**: request do passo 5 + SELECT do passo 6
- **Efeito**: o orçamento negativo vai direto para o CRM (card "Prezzo richiesto ≤ -5"); devia ser ≥ 0 (front e API). Os botões "Cerco immobile / Valutazione proprietà" não expõem estado selecionado (`aria-pressed` nulo): leitor de tela não sabe qual está ativo. Endpoint público sem limite de taxa/captcha aparente (não testado em massa).

### #23 (i18n) — Rótulo em italiano com palavra de outra língua: "Data di escritura"
- **Tipo**: código (texto/i18n)
- **Onde**: `/gestionale/operazioni/vendite` → "Nuova vendita" → campo de data do rogito. `src/i18n/locales/it/operazioni.json:287` (`"deedDateLabel": "Data di escritura"`); a coluna da lista diz "Rogito" e o tour (`it/operazioni.json:462`) diz "Data atto"
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/operazioni/vendite` (logado, idioma italiano)
  2. `browser_click` "Nuova vendita"
  3. `browser_evaluate` nos `label` do dialog → inclui `"Data di escritura"`
  4. Comparar com `browser_evaluate` nos `th` da tabela → `"Rogito"`
- **Evidência**: lista de labels do passo 3; trecho do JSON
- **Efeito**: "escritura" é espanhol/português; em italiano o termo é "atto"/"rogito". Mesmo conceito com três nomes na mesma tela (Rogito / Data di escritura / Data atto). Regra do projeto: labels em italiano ou português conforme o idioma. Também: label "Valore finale*" sem espaço antes do asterisco (os demais usam "Numero *").

### #13 (UX) — Clicar "Avanti" na Scheda do imóvel já grava (PATCH /properties) e muda `updated_at`
- **Tipo**: código / clareza
- **Onde**: `/gestionale/proprieta/:id` botão "Avanti" (aba Generale)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/be512d40-abd9-11f1-86c3-d9570c3397d4`
  2. `browser_click` `button:has-text("Avanti") >> nth=0` sem alterar nada
  3. `browser_network_requests` (filter `properties|property-`): `PATCH /properties/{id} => 204`
  4. `psql`: `select updated_at from properties where code='R-7497'` → `2026-10-03 12:55:47` (antes: 2026-09-28)
- **Evidência**: request do passo 3 + SELECT do passo 4
- **Efeito**: só navegar entre etapas conta como "modificado" e muda o ranking do widget "Ultimi immobili modificati" da Home. Pode ser intencional (salvar por etapa) mas não há aviso.

### #14 — Botão "gerar código" do imóvel devolve sempre `000002` (duplicado)
- **Tipo**: código
- **Onde**: `/gestionale/proprieta/nuovo` → `src/pages/Imoveis/components/PropertyCodeField.tsx:26-33` (`order: ['code DESC']`, `limit: 1`, depois `Number(lastCode.replace(/\D/g,''))+1`)
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5174/gestionale/proprieta/nuovo` (logado)
  2. `browser_click` botão da varinha ao lado de "Codice"
  3. `browser_evaluate` `document.querySelector('input[name=code]').value` → `000002`
  4. `browser_network_requests` (filter `properties`): `GET /properties?filter={"order":["code DESC"],"limit":1,"fields":{"code":true}}`
  5. `psql`: `select code from properties order by code desc limit 3` → `T1`, `T-7507`, `T-111465145513898` (o topo em ordem de texto é `T1` → `1+1` = `000002`)
  6. `psql`: `select code, count(*) from properties group by 1 having count(*)>1 order by 2 desc limit 1` → `000002 | 5` (já existem 5 imóveis com esse código; sem índice único em `properties.code`)
- **Evidência**: valor do passo 3; request do passo 4; SELECTs 5-6
- **Efeito**: devia gerar o próximo número livre; ordenação textual (`T1` > `R-…` > `000…`) faz o gerador ignorar os 8.800 códigos importados e repetir `000002`. Resultado: códigos duplicados (já 5) e nada impede no banco.

### Observação (não bug confirmado): filtro Finalità "Affitto" mostra 941 (só `rent`); os 1244 `rent_or_sale` só aparecem em "Vendita e affitto". Comparar com o site público (`/immobili?contract=rent`) na fase do Site.

### Observação (dados): `properties.code` não é único (sem índice único; 20 códigos repetidos; 5 imóveis com `000002`, criados entre 11 e 20/09/2026). Ver a geração do código na criação (`/proprieta/nuovo`).

## Hipóteses não confirmadas
- Area Proprietari (login do portal, PIN de 4 dígitos): `devit-api/src/services/login-rate-limit.ts` limita por IP (20 tentativas/5 min) lendo `X-Forwarded-For` sem validar proxy confiável (`getClientIp` usa o 1º valor do header se presente). Hipótese: esse header é controlável pelo cliente e o limite pode não valer por trás de um proxy não configurado; com PIN de 4 dígitos (10 mil combinações) isso seria crítico. Não testei o bypass em si — a tentativa foi interrompida pela sandbox de segurança da sessão. Recomendo validar manualmente que a API só confia em `X-Forwarded-For` quando atrás de um proxy que o sobrescreve, e considerar aumentar `PIN_LENGTH`.
- Profilo: o formulário chama `PATCH /users/{id}`, protegido por `@authenticate(MY_JWT_ADMIN)` (`devit-api/src/controllers/user.controller.ts:135-156`); um usuário não-admin provavelmente não consegue salvar o próprio perfil, e o form expõe "Livello di accesso" editável. Não confirmado: a regra do projeto proíbe criar/usar outro usuário sem perguntar.
- `users.last_login_at` nunca é gravado (0 de 14 usuários; só existe em `user.model.ts:93`). Verificar se algum lugar da UI mostra "ultimo accesso" (Utenti).
- `people.created_by_id` fica NULL em cliente criado pela UI (`PersonController` não grava `createdById`, `CalendarEventController` grava). Pode ser intencional; 12794 de 21339 têm criador. Não reportado como bug.
(nenhuma ainda)
