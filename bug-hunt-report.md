# Bug report

## BUG-01 — Validação nativa do navegador aparece em idioma diferente do sistema (código, baixa)
- **Onde**: /gestionale/clienti → modal "Nuovo cliente", campo E-mail (input type=email, form sem noValidate). Provavelmente afeta todo form com e-mail.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/clienti`
  2. `browser_click` → botão "Nuovo cliente"
  3. `browser_fill_form` → Nome "BUGHUNT cliente", E-mail "abc", Telefono "abc"
  4. `browser_click` → "Salva"
  5. `browser_evaluate` → `document.querySelector('[role=dialog] form').noValidate` = false; `input.type` = "email"; `document.documentElement.lang` = "it"
- **Evidência**: screenshot do passo 4: balão laranja nativo `Inclua um "@" no endereço de e-mail...` (português, idioma do navegador) enquanto o resto do sistema/erros estão em italiano ("Numero di telefono non valido").
- **Efeito**: esperado mensagem do sistema no idioma da interface (como o telefone); obtido mensagem nativa no idioma do navegador, e a validação própria do e-mail é ignorada.
- **Evidência adicional BUG-01**: /gestionale/clienti/richieste → "Nuova richiesta" → campo Locali "da" = -3 → "Salva": balão nativo `O valor deve ser maior ou igual a 0.` (português do navegador) em vez de mensagem italiana do sistema, como as de min/max ("Il valore minimo non può essere maggiore del massimo").

## BUG-02 — "Solo i miei" sobrepõe o seletor "Comune" nos filtros avançados de Proprietà (código/layout, baixa)
- **Onde**: /gestionale/proprieta → "Filtri avanzati". Viewport do Playwright 1200x919.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta`
  2. `browser_click` → botão "Filtri avanzati"
  3. `browser_evaluate` → medir `getBoundingClientRect()` do seletor "Tutti i comuni" (x 761–907) e do rótulo "Solo i miei" (x 895–1019): sobreposição horizontal de 12px
- **Evidência**: screenshot fullPage após o passo 2 mostra a caixa de seleção "Solo i miei" encostada/em cima da borda direita do seletor "Comune"; medidas acima.
- **Efeito**: esperado espaçamento entre os controles; obtido controles sobrepostos.

## BUG-04 — Visão "Mappa" mostra só os 10 imóveis da página atual; sem filtro mostra "Nessun immobile con coordinate" (código/UX, média)
- **Onde**: /gestionale/proprieta → ícone de mapa. Arquivos: `src/pages/Imoveis/components/PropertyMapView.tsx` (recebe só `properties` da página) e `src/pages/Imoveis/hooks/usePropertyLocations.ts`.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta`
  2. `browser_evaluate` → clicar no terceiro ícone de visão (mapa; botão em x≈1135,y≈396)
  3. `browser_wait_for` → 3s; `browser_take_screenshot` → mapa de Nápoles sem marcadores e aviso "Nessun immobile con coordinate impostate."; rodapé "Pagina 1 di 887 · 8864 risultati"
  4. `psql`: `select count(*) filter (where latitude is not null) from property_location_details;` → 6382
  5. `psql`: `select count(*) filter (where pld.latitude is not null and pld.longitude is not null) from (select id from properties order by created_at desc limit 10) p left join property_location_details pld on pld.property_id=p.id;` → 0 (a primeira página não tem coordenadas)
  6. `browser_evaluate` → preencher busca "I-1111465145512722" (tem coordenadas 40.93, 14.39) → 1 marcador e sem aviso
  7. `browser_network_requests` (filtro `property-location-details`) → só 10 ids por requisição
- **Evidência**: passos 3 e 6 (screenshot + contagem de `.leaflet-marker-icon`: 0 vs 1); 6382 imóveis geolocalizados no banco.
- **Efeito**: esperado mapa com todos (ou os filtrados) imóveis com coordenadas; obtido só os 10 da página, com a mensagem de que nenhum imóvel tem coordenadas, embora 6382 tenham.

## BUG-05 — Plural errado "1 risultati" na paginação (i18n, baixa)
- **Onde**: rodapé de paginação da lista de imóveis (e provavelmente de clientes).
- **Como reproduzir**: após BUG-04 passo 6, `browser_evaluate` → `document.body.innerText.match(/Pagina .*risultati/)[0]` = "Pagina 1 di 1 · 1 risultati".
- **Evidência**: texto lido na página: `Pagina 1 di 1 · 1 risultati`.
- **Efeito**: esperado "1 risultato"; obtido "1 risultati".

## BUG-06 — Código de imóvel duplicado só é rejeitado no passo 3 do cadastro (código/UX, baixa)
- **Onde**: /gestionale/proprieta/nuovo. Arquivo: `src/pages/Imoveis/components/PropertyCodeField.tsx` (o campo não valida duplicidade; o imóvel só é criado ao sair do passo 3).
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/nuovo`
  2. `browser_type` → Codice `R-2` (já existe no banco), Titolo "BUGHUNT wizard imovel"
  3. `browser_click` → Categoria "Residenziale"; Proprietario "... luigi via moretti"; `browser_click` "Avanti" (passa para o passo 2, sem erro)
  4. `browser_click` "Avanti" no passo 2 (Prezzo) → passo 3 (Localizzazione) abre sem erro
  5. `browser_click` Città → "Napoli"; `browser_click` "Avanti"
  6. `browser_take_screenshot` → toast vermelho "Esiste già un immobile con questo codice." e usuário continua preso no passo 3
- **Evidência**: screenshot do passo 6 + erro de console `browser_console_messages` level error: `Failed to load resource: 422 (Unprocessable Entity) @ http://127.0.0.1:3006/properties`.
- **Efeito**: esperado aviso no próprio campo Codice (passo 1) assim que o usuário o digita/avança; obtido erro só depois de preencher 3 passos, com o campo do erro fora de vista.

## BUG-07 — Gerador de código sugere número gigante e perde precisão (código, baixa/média)
- **Onde**: /gestionale/proprieta/nuovo, botão varinha ao lado de "Codice". Arquivo: `src/pages/Imoveis/components/PropertyCodeField.tsx` (`handleGenerate`): extrai os dígitos de TODOS os códigos (qualquer prefixo), usa `Number()` e soma 1; baixa até 20000 imóveis a cada clique.
- **Como reproduzir**:
  1. `psql`: `select code from properties order by length(regexp_replace(code,'\D','','g')) desc, code desc limit 3;` → `R-11111111465453479` (17 dígitos)
  2. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/nuovo`
  3. `browser_click` → botão com title "Genera codice" (varinha)
  4. `browser_wait_for` → 2s; `browser_evaluate` → `document.querySelector('input[placeholder=AP001]').value`
- **Evidência**: passo 4 retornou `11111111465453480`; esse valor passa de 9.007.199.254.740.991 (limite de inteiro seguro), então o `+1` já foi calculado com número arredondado pelo navegador.
- **Efeito**: esperado próximo código sequencial da série da agência; obtido número de 17 dígitos sem prefixo, que depende de qualquer código com dígitos longos e pode repetir/pular valores por arredondamento.

## BUG-08 — Passo "Dettagli" avança mesmo com dados inválidos e descarta o que foi digitado, sem aviso (código, alta)
- **Onde**: /gestionale/proprieta/:id → passo 5 "Dettagli". Arquivos: `src/pages/Imoveis/Scheda/components/PropertyDettagliTab.tsx` (`handleSubmit` chama `onSubmit(event)` e logo em seguida `onNext()`, sem esperar o resultado da validação) e `src/pages/Imoveis/Scheda/hooks/usePropertyDetailForm.ts` (`validatePercent` apenas faz `setError` e retorna).
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/5496b7a0-cb03-11f1-9870-9dfdfe428d5f` (imóvel criado pelo cadastro)
  2. `browser_click` → passo "Dettagli" (5)
  3. `browser_evaluate` → preencher "% mediazione cliente" = 150 e "% mediazione proprietario" = -5 (campos `input[type=number]`, disparando `input`)
  4. `browser_click` → "Avanti"
  5. `browser_take_screenshot` → já está no passo 6 "Foto"; sem toast e sem mensagem de erro
  6. `browser_network_requests` (filtro `property-details`) → nenhum PATCH novo após o passo 5
  7. `psql`: `select mediation_fee_client_pct, mediation_fee_owner_pct from property_details where property_id='5496b7a0-cb03-11f1-9870-9dfdfe428d5f';` → ambos vazios
- **Evidência**: screenshot do passo 5 (tela do passo 6 sem erro), lista de requisições (último PATCH em property-details foi anterior) e consulta SQL com valores vazios.
- **Efeito**: esperado ficar no passo 5 com o erro "percentRange" no campo; obtido a tela avança, o usuário acredita que salvou e os dados do passo (inclusive os demais campos do passo 5) não são gravados.
- **Evidência adicional BUG-08**: ao voltar ao passo 5 pelo indicador de passos, os campos aparecem em vermelho com 'Inserisci un valore tra 0 e 100' — o erro existia, mas o usuário já tinha sido enviado ao passo 6.

## BUG-09 — Excluir documento do imóvel não pede confirmação (UX, baixa)
- **Onde**: /gestionale/proprieta/:id → passo 7 "Documenti" (lixeira ao lado do arquivo). Outras exclusões (cliente, richiesta, impegno) mostram "Eliminare ...?".
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/5496b7a0-cb03-11f1-9870-9dfdfe428d5f`; `browser_click` → passo "Documenti"
  2. `browser_click` → "Clicca per caricare o trascina il file qui"; `browser_file_upload` → `.playwright-mcp/bughunt-doc.txt` (toast "Documenti caricati")
  3. `browser_evaluate` → clicar no botão da lixeira vermelha (x≈1144,y≈477)
  4. `browser_take_screenshot` → toast "Documento rimosso" imediato, lista vazia "Nessun documento caricato"
- **Evidência**: screenshot do passo 4 (sem diálogo de confirmação entre o clique e a remoção).
- **Efeito**: esperado popup de confirmação como nas outras exclusões; obtido remoção imediata e irreversível.

## BUG-10 — Preço carregado na ficha do imóvel aparece 100x menor que o real (valor divergente do banco/inconsistência entre telas, alta)
- **Onde**: /gestionale/proprieta/:id → passo 2 "Prezzo". Arquivos: `src/pages/Imoveis/hooks/usePropertyForm.ts:77` (`salePrice: String(property.salePrice)`, mesmo padrão para aluguel/condomínio) e `src/components/InputMoney.tsx` (lê o valor como dígitos/centavos: `value.replace(/\D/g,'')` / 100). Tela comparada: lista `src/pages/Imoveis/components/PropertyTable.tsx`.
- **Como reproduzir**:
  1. `psql`: `select code, sale_price from properties where code='R-7752';` → `R-7752 | 150000.00`
  2. `browser_navigate` → `http://localhost:5173/gestionale/proprieta`; `browser_evaluate` → preencher a busca com "R-7752"; ler a linha da tabela → `150.000,00 €`
  3. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/be0e7ef4-abd9-11f1-86c3-d9570c3397d4`
  4. `browser_click` → passo "Prezzo"
  5. `browser_evaluate` → `[...document.querySelectorAll('input')].filter(i=>i.offsetParent)[0].value` → `1500,00`
  6. Segundo caso: imóvel BUGHUNT-WIZ-001 criado pelo cadastro (banco 250000.00) mostrou `2500,00` no mesmo campo.
- **Evidência**: banco 150000.00; lista 150.000,00 €; ficha 1500,00 (screenshot do passo 4 mostra "1500,00" no Prezzo di vendita).
- **Efeito**: esperado 150.000,00 na ficha; obtido 1.500,00. Se o usuário editar o campo ou o dado for regravado a partir do que está na tela, o preço fica 100x menor. (Não consegui confirmar a gravação: o imóvel de teste foi removido do banco por outro processo antes de eu clicar em Avanti.)

## BUG-11 — Erro no console na tela "imóvel não encontrado": botão sem elemento nativo (código, baixa)
- **Onde**: /gestionale/proprieta/<id inexistente> (estado "não encontrado"). Arquivos: `src/components/NotFoundState.tsx:44` + `src/components/ui/button.tsx:76`.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proprieta/5496b7a0-cb03-11f1-9870-9dfdfe428d5f` (id que não existe mais)
  2. `browser_console_messages` level error
- **Evidência**: `[ERROR] Base UI: A component that acts as a button expected a native <button> because the nativeButton prop is true... at NotFoundState (NotFoundState.tsx:44)`, além de 4x `404 /properties/<id>` (a tela refaz a mesma requisição 4 vezes).
- **Efeito**: esperado sem erro de console e uma única requisição; obtido erro do Base UI e 4 requisições repetidas de um recurso inexistente.

## BUG-12 — Datas "puras" aparecem com 1 dia a menos em navegadores a oeste de UTC (código, média)
- **Onde**: /gestionale/proposte (coluna Data). Arquivo: `src/utils/formatDate.ts` (`dayjs(value).format('DD/MM/YYYY')`). A API devolve datas sem hora como meia-noite UTC.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/proposte`
  2. `browser_click` → "Nuova proposta"; preencher Numero `BUGHUNT-PROP-1`, Valore `100.000,00`, Immobile "AP001 · Nice flat", Acquirente "Abagnale Angelo", Data proposta 18/10/2026, Valida fino al 31/12/2026; `browser_click` "Salva"
  3. `psql`: `select number, proposal_date, valid_until from purchase_proposals where number='BUGHUNT-PROP-1';` → `2026-10-18 | 2026-12-31`
  4. `browser_evaluate` → `fetch('http://127.0.0.1:3006/purchase-proposals?filter={"where":{"number":"BUGHUNT-PROP-1"}}')` → `proposalDate: "2026-10-18T00:00:00.000Z"`
  5. `browser_evaluate` → buscar "BUGHUNT-PROP-1" na lista e ler a linha: `... 100.000,00 € 17/10/2026 Ricevuta ...`
  6. `browser_evaluate` → `Intl.DateTimeFormat().resolvedOptions().timeZone` = `America/Santarem` (UTC-3)
- **Evidência**: banco 2026-10-18; API 2026-10-18T00:00:00.000Z; tela 17/10/2026.
- **Efeito**: esperado 18/10/2026; obtido 17/10/2026 para quem usa fuso a oeste de UTC (equipe/dev no Brasil). Em fuso da Itália a data sai certa, mas o mesmo desvio atinge qualquer coluna de data sem hora exibida por esse formatador.

## BUG-13 — Imóvel e Acquirente obrigatórios sem indicação de obrigatório em "Nuova proposta" (UX, baixa)
- **Onde**: /gestionale/proposte → "Nuova proposta".
- **Como reproduzir**:
  1. `browser_click` → "Nuova proposta"
  2. `browser_type` → Numero `BUGHUNT-PROP-1`; valor `10000000` (digitado devagar → 100.000,00); data 18/10/2026
  3. `browser_click` → "Salva"
  4. `browser_take_screenshot`
- **Evidência**: screenshot do passo 4: erros "Seleziona un immobile" e "Seleziona un acquirente", mas os rótulos "Immobile"/"Acquirente" não têm o asterisco que Numero, Valore, Modalità, Stato e Data têm.
- **Efeito**: esperado asterisco nos dois campos obrigatórios; obtido sem indicação até tentar salvar.

### Evidências adicionais (BUG-10 e BUG-12) — Proposte
- **BUG-10 também em "Modifica proposta"**: após criar BUGHUNT-PROP-1 (banco `proposal_amount = 100000.00`), `browser_evaluate` clicando no botão de editar da linha abre o modal com "Valore della proposta" = `1000,00` (a lista mostra `100.000,00 €`). Clicar "Salva" sem tocar mantém 100000.00 no banco (`psql: select proposal_amount ...` → 100000.00), então o dano ocorre quando o valor é editado a partir do que está na tela.
- **BUG-12 como inconsistência entre telas**: a mesma proposta mostra Data `17/10/2026` na lista e `18/10/2026` no modal de edição (campo de data usa outro caminho de formatação).

## BUG-14 — "Salva" em "Nuova vendita" não faz nada quando o erro está em outro passo (código/UX, média)
- **Onde**: /gestionale/operazioni/vendite → "Nuova vendita" (modal com passos Generale/Pagamento/Documenti/Storico). O campo obrigatório "Valore finale" fica no passo 2.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/operazioni/vendite`
  2. `browser_click` → "Nuova vendita"
  3. `browser_type` → Numero `BHS-x2`; `browser_evaluate` → Data della vendita 18/10/2026
  4. `browser_click` → Immobile "AP001 · Nice flat", Venditore "A Oreste", Acquirente "AA AA"
  5. `browser_click` → "Salva" (duas vezes)
  6. `browser_network_requests` (filtro `sales`) → nenhum POST; `browser_console_messages` → 0 erros
  7. `browser_click` → passo "Pagamento": aparece "Inserisci il valore finale" em vermelho
- **Evidência**: screenshot do passo 5 (modal inalterado, sem toast nem mensagem) e do passo 7 (erro só visível no passo 2).
- **Efeito**: esperado levar o usuário ao passo com erro ou mostrar aviso; obtido clique sem nenhuma reação, parecendo que o botão está quebrado.

### Evidência adicional BUG-13 (campos obrigatórios sem asterisco)
- Em "Nuova vendita", Immobile, Venditore e Acquirente também são obrigatórios (erros "Seleziona un immobile/venditore/acquirente" ao salvar) e não têm asterisco no rótulo.
- **Evidência adicional BUG-14**: com Valore finale 100.000,00 preenchido e Numero duplicado `BHS-x2`, "Salva" no passo 2 também não reage (só um `GET /sales/count?where={"number":"BHS-x2"}` em `browser_network_requests`); ao voltar ao passo "Generale" aparece "Esiste già una vendita con questo numero." — o erro só existe no passo que o usuário não está vendo.
- **Observação (hipótese não confirmada)**: o banco tem duas vendas com o mesmo número (`select number,count(*) from sales group by 1 having count(*)>1` → `BHS-0ed1 | 2`) e 6 imóveis com código `000002`; não existe índice único (`select indexname from pg_indexes where tablename in ('sales','properties')` → só `*_pkey`). A unicidade depende apenas da checagem do formulário.
- **Evidência adicional BUG-13**: em /gestionale/operazioni/locazioni → "Nuovo contratto", Immobile, Proprietario e Inquilino também são obrigatórios (erros "Seleziona un immobile/proprietario/inquilino") sem asterisco; Numero, Data di inizio, Valore dell'affitto e Giorno di scadenza têm asterisco.
- **Evidência adicional BUG-12 (Registrazioni)**: /gestionale/operazioni/registrazioni mostra Periodo `30/09/2026` para BHR2-0ed1 e `31/12/2025` para BH1791834676, enquanto o banco tem `start_date` = `2026-10-01` e `2026-01-01` (`psql: select number,start_date from rental_contracts where situation='active'`). Mesmo desvio de 1 dia no fuso America/Santarem. Em Locazioni a lista também mostra Inizio `30/09/2026` para esse contrato.

## BUG-15 — Editor de e-mail do Marketing aparece em inglês (i18n, média)
- **Onde**: /gestionale/marketing → aba "Invia campagna" → campo "Messaggio" (editor visual embutido).
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/marketing`
  2. `browser_click` → aba "Invia campagna"
  3. `browser_evaluate` → rolar o container até o fim; `browser_take_screenshot`
- **Evidência**: screenshot do passo 3: "No content here. Drag content from right.", blocos "Columns, Button, Divider, Heading, Paragraph, Image, Social, Menu, HTML", abas "Content / Blocks / Body / Dev" — tudo em inglês, enquanto o resto da tela está em italiano.
- **Efeito**: esperado rótulos em italiano/português conforme o idioma do sistema; obtido editor em inglês.

## BUG-16 — API de notificações devolve notificações de todos os usuários (código/segurança, média; confirmado como administrador)
- **Onde**: `GET /notifications` e `GET /notifications/count` em devit-api (`src/controllers/notification.controller.ts`, rotas com `@authenticate(MY_JWT_ALL)` sem filtrar por usuário logado; PATCH/DELETE por id também sem checagem de dono). A tela /gestionale/notifiche só mostra as próprias porque o front filtra por `userId`.
- **Como reproduzir**:
  1. login `admin@devit.com`; `browser_navigate` → `http://localhost:5173/gestionale/notifiche`
  2. `browser_evaluate` → `fetch('http://127.0.0.1:3006/notifications', {headers:{Authorization:'Bearer '+localStorage.token}})` → 186 itens de 7 `userId` diferentes
  3. `browser_evaluate` → `fetch('.../notifications/count')` → `{count: 186}`; com `where={"userId":"<id do admin>"}` → `{count: 30}`
  4. `psql`: `select user_id, count(*) from notifications group by 1;` → 7 usuários (30+30+30+30+30+30+6 = 186)
- **Evidência**: respostas dos passos 2–4.
- **Efeito**: esperado cada usuário ver/alterar só as suas notificações; obtido a API entrega todas. Não testei com usuário não administrador (sem credenciais), então o impacto para perfis comuns ficou como hipótese forte, não confirmada.

## BUG-17 — Erro da senha só aparece depois de corrigir os outros campos em "Nuovo utente" (UX, baixa)
- **Onde**: /gestionale/amministrazione/utenti → "Nuovo utente".
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/amministrazione/utenti`
  2. `browser_click` → "Nuovo utente"; `browser_click` → "Salva" com tudo vazio
  3. `browser_take_screenshot` → erros só em Nome ("Inserisci almeno 2 caratteri") e E-mail ("E-mail non valida"); o campo Password (obrigatório, com asterisco) não mostra erro
  4. `browser_type` → Nome "BUGHUNT usuario", E-mail "bughunt-user@example.com"; `browser_click` → "Salva"
  5. `browser_take_screenshot` → agora aparece "La password è obbligatoria per un nuovo utente"
- **Evidência**: screenshots dos passos 3 e 5.
- **Efeito**: esperado todos os erros no primeiro clique; obtido o aviso da senha só no segundo clique.

## BUG-18 — Excluir filial com usuários vinculados é permitido e remove o vínculo sem aviso (código/integridade, média)
- **Onde**: /gestionale/amministrazione/filiali (lixeira da filial). A confirmação só diz `Questa azione eliminerà definitivamente "<nome>"`. No banco a chave de `users.branch_id` é `ON DELETE SET NULL`.
- **Como reproduzir**:
  1. `psql`: `select u.email, b.name from users u join branches b on b.id=u.branch_id;` → `admin@devit.com | Agenzia di Napoli`
  2. `browser_navigate` → `http://localhost:5173/gestionale/amministrazione/filiali`
  3. `browser_evaluate` → clicar na lixeira da linha "Agenzia di Napoli"; `browser_click` → "Elimina" (diálogo sem menção a usuários)
  4. `browser_take_screenshot` → toast "Filiale eliminata con successo!" e lista vazia
  5. `psql`: `select count(*) from users where branch_id is not null;` → 0; `select count(*) from branches;` → 0
- **Evidência**: toast de sucesso + consultas dos passos 1 e 5.
- **Efeito**: esperado bloquear (como categorias em uso, que retornam erro) ou avisar quantos usuários perdem a filial; obtido exclusão silenciosa, e o cabeçalho do usuário deixa de mostrar a filial.
- **Observação sobre o ambiente**: depois deste teste recriei a filial "Agenzia di Napoli" pela tela e reatribuí ao admin em "Il mio profilo". O id da filial mudou.

## BUG-19 — Nome de bairro muito longo estica a tela de Zone até esconder colunas e ações; nome aceito sem limite de tamanho (código/layout + validação, média)
- **Onde**: /gestionale/amministrazione/zone → clicar no nome da zona "Centro" (abre "Quartieri di Napoli - Centro"). Dado existente no banco: um bairro com 100000 caracteres.
- **Como reproduzir**:
  1. `psql`: `select length(name), left(name,12) from neighborhoods order by length(name) desc limit 2;` → `100000 | AAAAAAAAAAAA`
  2. `browser_navigate` → `http://localhost:5173/gestionale/amministrazione/zone`
  3. `browser_evaluate` → clicar no botão do nome "Centro" (primeiro botão da linha)
  4. `browser_take_screenshot` (fullPage) → tabela só mostra a coluna "Nome"; Città, Provincia, Stato e Azioni somem da tela
  5. `browser_evaluate` → largura da tabela: `document.querySelector('table').getBoundingClientRect().right` = 1050529 (janela de 1200)
- **Evidência**: screenshot do passo 4 e medida do passo 5 (nome ocupando 1.050.055 px).
- **Efeito**: esperado texto truncado/quebrado e layout estável; obtido tabela de zonas com mais de 1 milhão de pixels de largura, ações inacessíveis. O dado mostra que o cadastro de bairro aceita 100000 caracteres (sem limite de tamanho na validação).
- **Evidência adicional BUG-17 (Banner)**: em /gestionale/amministrazione/banner/nuovo, com Titolo "BUGHUNT banner" e Link `javascript:alert(1)`, o primeiro "Salva" mostra só "Il link deve iniziare con http://, https:// o /" (a validação do link funciona); só depois de corrigir o link para `https://example.com` e clicar "Salva" de novo aparece "Seleziona un'immagine per il banner" — a imagem obrigatória só é cobrada no segundo clique. Subir um `.txt` como imagem também não mostra motivo da recusa (mantém a mesma mensagem genérica).

## BUG-20 — Mapa do site público sempre vazio: o gestionale não tem campo para a coordenada pública (código/funcionalidade, média)
- **Onde**: site público `/` (seção "Dove sono le nostre case", contador "0 immobili sulla mappa") e mapa da página do imóvel. Arquivos: devit-api `src/controllers/public-property-map.controller.ts` (filtra por `publicLatitude/publicLongitude`) e devit-web `src/pages/Site/PropertyDetail/components/MapSection.tsx`. Nenhum código do CRM grava `publicLatitude`/`publicLongitude` (busca em `src` do devit-web e do devit-api só encontra leituras e o modelo).
- **Como reproduzir**:
  1. `psql`: `select count(*) filter (where pld.latitude is not null and pld.longitude is not null and not (pld.latitude=0 and pld.longitude=0)) as com_coord, count(*) filter (where pld.public_latitude is not null) as com_publica, count(*) from properties p left join property_location_details pld on pld.property_id=p.id where p.published_on_site and p.active;` → `13 | 0 | 51`
  2. `browser_navigate` → `http://localhost:5173/` (sem login); `browser_evaluate` → rolar a página até o fim
  3. `browser_evaluate` → `document.body.innerText` contém "0 IMMOBILI SULLA MAPPA"; `document.querySelectorAll('.leaflet-marker-icon').length` = 0
  4. `browser_evaluate` → `fetch('http://127.0.0.1:3006/public/properties/map')` → `[]`
- **Evidência**: passos 1, 3 e 4 (51 imóveis publicados, 13 com coordenada interna, 0 com coordenada pública; endpoint devolve lista vazia).
- **Efeito**: esperado mapa mostrando os imóveis publicados com coordenadas (ou um campo no CRM para definir a localização pública); obtido mapa sempre vazio, pois o único passo do CRM que define latitude/longitude grava só as coordenadas internas.
- **Evidência adicional BUG-01 (site público)**: em `http://localhost:5173/richieste` ("Cerco immobile"), com "Prezzo max" = -500 e consentimento marcado, "Invia la richiesta" mostra o balão nativo `O valor deve ser maior ou igual a 0.` (português do navegador) numa página em italiano. Corrigindo para 300000 a requisição é aceita (toast "Richiesta inviata con successo!") e o banco grava `source=site, request_type=search, desired_city=Napoli, max_budget=300000.00` (`select ... from leads where name='BUGHUNT Pubblico'`).

## BUG-21 — Aba "Valutazione proprietà" continua mostrando o campo "Prezzo max" (código, média)
- **Onde**: site público `/richieste`. Arquivos: `src/pages/Site/Richieste/index.tsx` (campo só deveria aparecer com `requestType === 'search'`, lendo `watch('requestType')` do formulário) e `src/pages/Site/Richieste/hooks/useRichiesteForm.ts`.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/richieste` (recarga limpa)
  2. `browser_click` → botão "Valutazione proprietà" (o botão fica amarelo/selecionado)
  3. `browser_wait_for` → 1s
  4. `browser_evaluate` → `!!document.querySelector('[name=maxBudget]')` = `true` e `[...document.querySelectorAll('label')].map(l=>l.innerText)` = `["Città dell'immobile","Prezzo max","Nome Completo",...]`
- **Evidência**: screenshot fullPage com a aba "Valutazione proprietà" ativa e o campo "Prezzo max" visível; resultado do passo 4.
- **Efeito**: esperado ocultar "Prezzo max" (o código limpa o valor ao trocar de aba e a validação do orçamento só vale para "search"); obtido o campo permanece, e quem pede avaliação de um imóvel vê um campo de orçamento de compra.

## BUG-22 — Política de privacidade manda escrever para um e-mail "indicado em Contatti", mas Contatti não mostra e-mail nenhum (inconsistência entre telas, média - legal/UX)
- **Onde**: `/privacy-cookies` (texto "scrivendo all'indirizzo email indicato nella pagina Contatti") x `/contatti` (cartões WhatsApp e "Agenzia di Napoli").
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/privacy-cookies`; `browser_evaluate` → `document.body.innerText` contém "Diritti dell'interessato ... scrivendo all'indirizzo email indicato nella pagina Contatti"
  2. `browser_navigate` → `http://localhost:5173/contatti`
  3. `browser_evaluate` → `[...document.querySelectorAll('a')].filter(a=>/wa\.me|whatsapp|tel:|mailto:/.test(a.href)).map(a=>a.href)` → só `["https://wa.me/393762118296"]`
  4. `browser_take_screenshot` (fullPage) → cartão "Agenzia di Napoli" vazio (sem endereço, telefone ou e-mail)
- **Evidência**: texto da privacidade no passo 1; lista de links do passo 3; screenshot do passo 4. (Parte da causa é dado ausente da filial: o CRM de filiais só pede o nome.)
- **Efeito**: esperado um e-mail de contato visível para exercer os direitos de privacidade; obtido nenhuma forma de e-mail em Contatti, só WhatsApp.

## BUG-23 — Tentativas de login no portal do proprietário (público) bloqueiam também o login do CRM no mesmo IP (código/segurança-disponibilidade, média)
- **Onde**: devit-api `src/services/login-rate-limit.ts` (contador único em memória por IP, 20 tentativas / 5 min) usado por `src/controllers/owner-portal.controller.ts:160` (`checkAndIncrementRateLimit(getClientIp(this.req))`) e pelo login do CRM. O portal é público, qualquer visitante pode consumir o contador.
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/area-proprietari/login`
  2. `browser_evaluate` → 22 chamadas `fetch('http://127.0.0.1:3006/owner-portal/login', {method:'POST', body: {email:'bh-op@example.com', pin:'<errado>'}})` → 401 nas 20 primeiras e `429` a partir da 21ª
  3. `browser_navigate` → `http://localhost:5173/gestionale/login`; `browser_fill_form` → admin@devit.com / admin123; `browser_click` → "Accedi"
  4. `browser_take_screenshot` → faixa vermelha "Troppi tentativi di accesso. Riprova più tardi." com credenciais corretas
- **Evidência**: screenshot do passo 4; respostas 401/429 do passo 2.
- **Efeito**: esperado limite separado por tela/conta (ou só contar tentativas erradas do mesmo alvo); obtido que 20 tentativas erradas no portal do proprietário travam o login da equipe por 5 minutos para todo o escritório que sai por um mesmo IP. Também, como o limite por e-mail do proprietário é público, qualquer pessoa consegue travar o acesso de um proprietário específico.

## BUG-25 — Imóvel sem preço aparece como "0,00 €" na área do proprietário (valor, baixa)
- **Onde**: `/area-proprietari` (dashboard "I tuoi immobili").
- **Como reproduzir**:
  1. `browser_navigate` → `http://localhost:5173/gestionale/amministrazione/proprietari`; `browser_click` "Aggiungi proprietario"; escolher "BUGHUNT-name-c1a728", e-mail `bh-portal-test@example.com`, "Salva" → PIN gerado `942485`
  2. `browser_navigate` → `http://localhost:5173/area-proprietari/login`; preencher e-mail e PIN; "Accedi"
  3. `browser_take_screenshot` (fullPage) → duas linhas com `0,00 €`
  4. `psql`: `select code, sale_price, rent_price from properties where owner_id='e61fec60-c693-11f1-8746-95f5bba4a41d';` → `BH9923216fd0 | NULL | NULL` e `BHe6fe48af84 | NULL | NULL`
- **Evidência**: screenshot do passo 3 e consulta do passo 4.
- **Efeito**: esperado "—" ou "Prezzo non disponibile" quando o imóvel não tem preço; obtido "0,00 €", dando a impressão de que o imóvel vale zero.

### Evidência adicional BUG-25
- Inconsistência relacionada a BUG-25: a lista do CRM (/gestionale/proprieta, em largura de celular e em desktop) mostra "—" para imóvel sem preço, enquanto /area-proprietari mostra "0,00 €".

## BUG-26 — Exportações mostram a hora de geração em UTC em vez da hora local do usuário (código, baixa)
- **Onde**: Excel/PDF de /gestionale/clienti, /gestionale/proposte e /gestionale/proprieta (cabeçalho "Devit · N righe · generato il ...").
- **Como reproduzir**:
  1. `Bash`: `date` → `Sun Oct 18 12:23:57 -03 2026` (horário local da máquina)
  2. `browser_navigate` → `http://localhost:5173/gestionale/proposte`; `browser_click` "Esporta" → "Excel" (download `export.xlsx`)
  3. Abrir `xl/sharedStrings.xml` do arquivo (python `zipfile`) → `Devit · 19 righe · generato il 18/10/2026, 15:30:09` (feito às 12:30 local)
  4. O mesmo no export de clientes: `generato il 18/10/2026, 14:42:57` gerado às 11:42 local
- **Evidência**: cabeçalhos dos dois arquivos x relógio local.
- **Efeito**: esperado a hora do usuário (Itália: UTC+1/+2); obtido horário do servidor em UTC, 2h a menos para a Itália durante o horário de verão.

### Evidências adicionais (rodada final de CRUD)
- **BUG-19 (nota)**: hoje a API recusa nome de bairro com 300 caracteres (toast `Il campo '/name' è troppo lungo.` — a mensagem mostra o caminho técnico `/name` em vez de um texto de negócio), então o bairro de 100000 caracteres é dado antigo; o problema de layout continua reproduzível com ele.
- **BUG-10 em Vendite**: /gestionale/operazioni/vendite → "Nuova vendita" BUGHUNT-VEN-T1 (Valore finale 75.000,00 gravado como `75000.00`) → reabrir pelo lápis → passo "Pagamento" mostra `finalAmount=750,00`; `psql: select final_amount from sales where number='BUGHUNT-VEN-T1'` → `75000.00` (a lista mostra 75.000,00 €). Salvar sem mexer no valor mantém 75000.00.
- **BUG-12 em Vendite**: venda criada com data 18/10/2026 aparece na lista como `17/10/2026`.
- **BUG-27 (UX, baixa)**: "Nuova vendita" oferece em "Venditore" qualquer pessoa; escolher alguém que não é o proprietário do imóvel só falha ao salvar com toast `Il venditore indicato non è proprietario dell'immobile.` visto no passo 2. Passos: `browser_click` "Nuova vendita" → imóvel "AP001 · Nice flat" → Venditore "A Oreste" → Valore finale 75.000,00 → "Salva". Esperado: lista de vendedores limitada ao proprietário do imóvel escolhido.
- **Campo "Provincia" de Zone**: aceita texto longo ("NAPOLI-LONGA" gravado em `zones.region`); rótulo "Provincia" ≠ coluna `region`.

### Evidências finais (rodada de abas do imóvel)
- **BUG-08 também na aba "Commerciale"**: imóvel BUGHUNT-WIZ-002 (id ef1d6020-cb09-11f1-9870-9dfdfe428d5f), aba Commerciale com Fatturato "da" 900000 > "a" 100000 e vetrine -2 → "Avanti" avança para "Industriale" sem erro; `select * from property_commercial_details where property_id='ef1d6020-...'` → 0 linhas (nada gravado).
- **BUG-09 também em Foto e Tasse**: remover foto (lixeira) e remover taxa (X) acontecem na hora, toasts "Foto rimossa" / "Tassa rimossa con successo!", sem confirmação.
- **BUG-28 (baixa)**: aba Tasse, botão "Aggiungi" sem escolher "Frequenza" não faz nada (nenhuma requisição, nenhum aviso).
- **BUG-29 (baixa)**: Descrizione aceita 500 quartos (`bedrooms = 500` gravado), sem limite razoável.
- Dado de teste remanescente: imóvel BUGHUNT-WIZ-002, venda BUGHUNT-VEN-T1 (venda "Venduta" não pode ser excluída), acesso de proprietário bh-portal-test@example.com (desativado).
