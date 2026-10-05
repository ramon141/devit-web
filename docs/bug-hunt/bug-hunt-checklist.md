# Bug Hunt Checklist
Base: http://localhost:5174 (CRM em /gestionale) | API: http://127.0.0.1:3006 | DB: localhost:5432/devit_api (só SELECT)
Estados: [ ] pendente | [ok] | [bug] #N | [descartado] motivo

## Auth
[ok] /gestionale/login (login válido, inválido, campos vazios) — obs: sem autocomplete nos inputs (aviso DOM verbose, menor)
[ok] /gestionale/forgot-password — mensagem genérica (não vaza se e-mail existe), POST 200
[ok] /gestionale/reset-password — sem token: "link não válido"; com token inválido: form aparece mas API recusa (422) corretamente
[ok] redirect rota privada sem sessão -> login — confirmado
[ok] logout — limpa sessão, redireciona a /login

## CRM
[ok] /gestionale (Home: widgets, números) — leads 145/138/7, evento de hoje e 10 últimos imóveis batem com DB; widgets add/remove e filtro de período ainda não exercitados (voltar no passe final)
[bug] #1 #2 /gestionale/agenda — 4 views ok, criar/editar/excluir ok, validação título ok, filtros busca/telefonate/colega sem erro; #1 eventos sem criador somem; #2 fim<início aceito. Obs UX: modal de detalhe não mostra data/hora/luogo. Não testado: filtro Tipo evento, recorrência, esito, anexos, cliente/imóvel no modal
[bug] #3 #4 #5 /gestionale/clienti — total/busca/filtro ruolo/paginação batem com DB; criar sem nascimento ok; editar pelo lápis ok; excluir ok (confirmação); #3 nascimento→422; #4 modal mantém dados; #5 endereço órfão (falha e exclusão). Obs a11y: botões de paginação sem aria-label. Não testado: Esporta
[bug] #8 #9 /gestionale/clienti/richieste (Leads) — contagens por coluna batem com DB, busca ok, Solo le mie ok (0, tudo sem atribuição), criar ok, excluir ok (confirmação). #8 min>max aceito, #9 "≤ 0". Não testado: drag entre colunas, editar (lápis), filtros Provenienza/Tipo/Assegnatario, validação nome vazio
[bug] #6 #7 /gestionale/clienti/:id — 5 abas carregam sem erro de console; #6 endereço vazio; #7 edição não grava. Não testado: upload de anexo, abas com dados (cliente com imóveis/eventos/comunicações)
[bug] #10 #11 /gestionale/proprieta (lista) — total 8826, Finalità Affitto 941, Prezzo da 1M=102, aba Commerciale 223, busca R-7497 (valores da linha) batem com DB; vista grade ok; #10 preço ignora rentPrice; #11 mapa em (0,0). Obs a11y: botões de vista sem aria-label. Stato e Filtri avanzati (quartos/área) batem com DB. Falta: Categoria, Ordina per, Solo i miei/prestigio/asta, paginação, Esporta, editar/duplicar/excluir pela lista
[bug] #14 #15 #16 #18 /gestionale/proprieta/nuovo — validação vazio ok; código gerado duplicado (#14); busca de owner (#15); erros grudados (#16); criação ocorre no passo 3 (POST addresses+properties) ok; preço grava + histórico ok (cache #18). BH-0001 excluído ok (endereço fica órfão, #5). #19 duplicar imóvel falha 422. Falta: abas 4–11 preenchendo dados
[bug] #12 #13 #17 #18 /gestionale/proprieta/:id — 12 etapas carregam sem erro de console; Prezzo e Storico batem com DB; #12 owner vazio, #13 Avanti grava, #17 cidade fora da lista, #18 Storico stale. Falta (aprofundar): Foto (upload), Documenti (upload), Dettagli, Commerciale/Industriale/Terreno/Tasse preenchendo e salvando
[bug] #20 #21 #22 /gestionale/proposte — lista (3 propostas, datas, valores) bate com DB; validação de campos obrigatórios ok; Rifiutata exige motivo ok; criar/excluir ok. #20 selects limitados a 200; #21 validade < data; #22 "Creata da" nunca preenche. Obs UX: Immobile/Acquirente sem asterisco de obrigatório. Não testado: filtros da lista, anexos, acquirenti aggiuntivi, Esporta, status Accettata → venda
[ok] /gestionale/operazioni (redirect) — coberto indiretamente pelo menu; confirmar no passe final
[bug] #23 #24 #25 /gestionale/operazioni/vendite — lista (3 vendas) bate com DB; validação obrigatórios ok; criar ok (wizard 2 passos); Venduta trava editar/excluir (resíduo de teste: venda BH-V1 id 52e72f40… não removível pela UI; obs: sem como reabrir). #20 também vale nos selects daqui. Não testado: filtros, Documenti, Storico, altri venditori/acquirenti, rate
[bug] #26 /gestionale/operazioni/locazioni — lista (2 contratos) bate com DB; validação obrigatórios ok; criar/excluir ok; #26 dia/datas/aviso sem validação; #24 status do imóvel não muda. Não testado: filtros, editar, rinnovo/rescisão, anexos, altri proprietari/inquilini
[bug] #27 /gestionale/operazioni/adeguamenti-canone — contratto ativo (RC2) e histórico (4 ajustes, valores) batem com DB; #27 formato do %. Não testado: "Genera documenti" (alteraria o aluguel real de RC2), Esporta
[bug] #28 /gestionale/operazioni/scadenziario — janela 30/500 bate com DB; #28 rótulo Scadenza ambíguo + janela negativa aceita. Não testado: ações da linha (rinnovo)
[bug] #29 /gestionale/operazioni/registrazioni — lista (2 contratos) bate com DB; #29 rescindido aparece. Não testado: ação "registrar"/"rinnovare" (alteraria RC2)
[bug] #30 #31 #32 #33 #34 /gestionale/marketing — 7 abas carregam sem erro; Modelli, Rimozioni, Storico (7 campanhas), Bacheca vs DB conferidos; criar/excluir modelo ok. Não testado: ENVIO de campanha (mandaria e-mail real), Nuova rimozione, editar modelo, aba WhatsApp além do status
[ok] /gestionale/statistiche — leads 130/11/4 = DB; vendas (2+2, eixo 0-2) e e-mails 30 dias (13 falhas/15 enviados, eixo 0-16) coerentes; valores das barras não lidos exatamente (só eixo). Não testado: filtro Periodo
[ok] /gestionale/notifiche — vazio = 0 no banco. Não testado: marcar como lida/lista com dados (sem notificações para testar)
[ok] /gestionale/profilo — dados batem com DB; nome <2 chars bloqueia; salvar sem senha não altera senha (PATCH sem password, password_changed_at igual). Hipótese de não-admin no relatório. Não testado: trocar senha (mudaria a senha do admin de dev), foto, idioma
[ok] /gestionale/amministrazione (redirect) → /gestionale/amministrazione/utenti, confirmado
[bug] #35 /gestionale/amministrazione/utenti — lista (14) bate com DB; senha <6 bloqueia; criar/excluir ok; #35 e-mail duplicado aceito. Não testado: editar, ativar/desativar, filtros, 2ª página, foto
[bug] #36 /gestionale/amministrazione/filiali — lista (1) bate com DB; criar/editar/excluir ok; #36 nome duplicado aceito
[bug] #37 /gestionale/amministrazione/categorie — lista (6, imóveis por categoria) bate com DB; #37 excluir em uso = 500 em inglês. Obs dados: categorias "Apartamento"/"Apartment" duplicam "Residenziale" (data de teste). Não testado: criar/editar, nome duplicado (ver #36), busca
[ok] /gestionale/amministrazione/zone — lista (Centro, Napoli, NA) bate com DB; criar/excluir ok. Obs: "Provincia" aceita texto longo (grava "NAPOLI DI TESTE LUNGA", placeholder NA). Não testado: bairros da zona (7), editar, excluir zona em uso (cascata destrutiva)
[ok] /gestionale/amministrazione/banner (lista) — 3 banners, ordem e textos batem com DB; excluir ok (confirmação); anexo fica órfão (#5)
[bug] #38 /gestionale/amministrazione/banner/nuovo — validação imagem obrigatória ok; upload+criar ok; #38 link javascript:/ordem negativa aceitos
[bug] #41 /gestionale/amministrazione/banner/:id — preview de imagem carrega; #41 campos aparecem vazios; salvar preserva valores
[bug] #39 /gestionale/amministrazione/audit — vazia = 0 no banco, mas nada é auditado. Não testado: filtros (sem dados)
[bug] #40 /gestionale/amministrazione/proprietari — lista (2 acessos, datas) bate com DB; #40 select só role=owner. Não testado: criar acesso/PIN, ativar/desativar, excluir, busca
[ok] /gestionale/componenti — carrega, sem erro de console (vitrine interna; não interagi com cada componente)
[ok] /gestionale/design-system-site — carrega, sem imagem quebrada nem erro de console
[ok] Shell: sidebar colapsa, widgets da Home remove/persiste, idioma IT/PT em Profilo troca e persiste (localStorage lang), navegação entre módulos sem erro

## Site público
[ ] / (Home do site — próximo)
[ok] /immobili — 51 imóveis (= publicados+ativos no DB), 5 páginas de 12; /affitto → 8 (= rent no DB). Não testado: filtros Zona/Tipologia/preço/superfície/camere, ordenação, busca, página 2+
[bug] #42 /immobile/:id — detalhe de R-111111465453338 (85 m², 3 camere, 1 bagno, 1280 €/mese) bate com DB; #42 inativo/inexistente = tela em branco. Não testado: galeria, WhatsApp, mapa
[ok] /zone — lista "Centro 0" coerente com dados (nenhum imóvel publicado com bairro)
[bug] #43 /zone/:zona — /zone/centro ok; slug inexistente sem 404
[ok] /chi-siamo — carrega, sem imagem quebrada
[ok] /calendari — 6 imagens de calendário, todas 200
[ok] /vendita (redirect) → /immobili?contract=sale, 43 = DB
[ok] /affitto (redirect) → /immobili?contract=rent, 8 resultados = DB
[bug] #44 /richieste (form) — validação vazio ok; #44 orçamento negativo aceito, mensagem de tipo não some
[ok] /contatti (form) — validação vazio ok (nome/email/phone/privacy); não testado envio válido (evita e-mail real)
[ok] /news — placeholder "Presto pubblicheremo"
[ok] /privacy-cookies — texto carrega
[ok] /area-proprietari/login — 401 com credenciais erradas; rate-limit existe, hipótese sobre X-Forwarded-For não confirmada
[ok] /area-proprietari — sem sessão redireciona para /login corretamente
[ ] rota inexistente (NotFound)

## Passes transversais (só após zerar acima)
[ok] Consistência: imóvel lista vs scheda — feito ao longo da varredura: #12 (owner some), #17 (cidade some), #18 (storico stale); valores de preço/área/quartos batem
[ok] Consistência: cliente lista vs proposta/vendas — nomes batem (Luca Bianchi, este Owner); #22 "Creata da" nunca preenche em nenhuma tela
[ok] Consistência: Statistiche vs Home — leads 130+11+4=145 em Statistiche, 145 em Home/Richieste; mesma fonte
[ok] Valores vs banco — feito célula a célula ao longo da varredura (dezenas de SELECTs no relatório)
[ok] i18n — varredura por palavras em inglês (Edit/Delete/Save/Loading/Please/required/undefined/null) em Clienti/Vendite/Marketing: nenhuma; achados #23 ("escritura"), #37 ("Internal Server Error") já cobrem os vazamentos reais encontrados
[ok] Revisar hipóteses originais sem destino — todas as hipóteses da seção "Passo a passo" renderam bug confirmado ou entraram em "Hipóteses não confirmadas" do relatório
