# Plano de 300 testes do sistema (revisado)

> Somente ideias, ainda sem código. Cada teste traz **como é feito**, **resultado esperado** e **risco que cobre**. Todos os resultados foram conferidos contra as regras reais do sistema.

Palavras como "servidor" significam o sistema central que guarda os dados.

## Resumo por área

| Área | Testes | Numeração |
|---|---|---|
| 1. Acesso, sessão e senhas | 25 | T001–T025 |
| 2. Clientes (pessoas) | 25 | T026–T050 |
| 3. Solicitações (leads) e quadro de negociação | 35 | T051–T085 |
| 4. Imóveis: cadastro e lista | 36 | T086–T121 |
| 5. Ficha do imóvel | 25 | T122–T146 |
| 6. Propostas de compra | 21 | T147–T167 |
| 7. Operações: vendas e locações | 25 | T168–T192 |
| 8. Agenda | 22 | T193–T214 |
| 9. Marketing e comunicação | 22 | T215–T236 |
| 10. Administração | 27 | T237–T263 |
| 11. Painel inicial, estatísticas e notificações | 8 | T264–T271 |
| 12. Site público e área do proprietário | 16 | T272–T287 |
| 13. Regras transversais | 13 | T288–T300 |
| **Total** | **300** | |

## 1. Acesso, sessão e senhas

_Porta de entrada do sistema: quem entra, quem é barrado e o que acontece quando a sessão acaba._

### T001 — Entrar com e-mail e senha corretos

- **Como é feito:** Tela de login aberta. O sistema central responde que as credenciais admin@devit.com / admin123 são válidas e devolve os dados do usuário (código, nome, e-mail, nível). O usuário digita os dois campos e clica em Entrar.
- **Resultado esperado:** Os dados do usuário ficam guardados (nome, e-mail, nível de acesso, código) e a pessoa é levada ao painel inicial. O que foi enviado ao servidor contém exatamente o e-mail e a senha digitados, nada além.
- **Risco que cobre:** Se o login 'passa' mas nada fica guardado, o usuário parece logado e cai de volta na tela de entrada na página seguinte.

### T002 — Entrar com senha errada

- **Como é feito:** O servidor responde 'credenciais inválidas' (401) com uma mensagem própria. O usuário digita um e-mail correto e uma senha errada e envia.
- **Resultado esperado:** A mensagem exata do servidor aparece em destaque no formulário. Nenhum dado de usuário é guardado. Os campos continuam preenchidos para nova tentativa.
- **Risco que cobre:** Mensagem genérica no lugar da real esconde o motivo (ex.: conta bloqueada) e gera chamados de suporte.

### T003 — Entrar com e-mail sem formato válido ("abc", "a@", "a@b")

- **Como é feito:** Digitar, um por vez, 'abc', 'a@' e 'a@b' no e-mail, com senha válida, e enviar.
- **Resultado esperado:** Em cada caso o envio é barrado na própria tela com o aviso 'e-mail não válido'; nenhuma requisição chega ao servidor.
- **Risco que cobre:** Formato de e-mail aceito por engano gera tentativas inúteis ao servidor e confunde quem errou a digitação.

### T004 — Entrar com e-mail em branco

- **Como é feito:** Deixar o e-mail vazio, preencher a senha e enviar.
- **Resultado esperado:** Aparece o aviso 'e-mail obrigatório', que é diferente do aviso de e-mail inválido; o aviso desaparece quando o campo é corrigido.
- **Risco que cobre:** Misturar os dois avisos faz a pessoa procurar erro de formato onde só faltou preencher.

### T005 — Senha com 5 caracteres

- **Como é feito:** E-mail válido e senha com 5 caracteres ('abcde').
- **Resultado esperado:** Envio barrado com o aviso de mínimo de 6 caracteres; o servidor não é consultado.
- **Risco que cobre:** Aceitar senha curta demais abre espaço para contas fracas e quebra a regra combinada com o servidor.

### T006 — Senha com exatamente 6 caracteres

- **Como é feito:** E-mail válido e senha com exatamente 6 caracteres ('abcdef').
- **Resultado esperado:** O envio é feito normalmente (sem aviso de tamanho).
- **Risco que cobre:** Erro de 'um a mais' no limite bloquearia quem tem senha de 6 caracteres e nunca conseguiria entrar.

### T007 — Senha com 500 caracteres e e-mail com 300

- **Como é feito:** Digitar um e-mail de 300 caracteres e uma senha de 500 e enviar, com o servidor respondendo erro.
- **Resultado esperado:** O sistema não trava nem corta o texto; o envio sai com os valores inteiros e a mensagem de erro do servidor é mostrada.
- **Risco que cobre:** Campos que cortam ou congelam com textos longos são um caminho clássico de falha e de ataque.

### T008 — Clicar duas vezes rápido em "Entrar"

- **Como é feito:** O servidor demora a responder. O usuário clica duas vezes seguidas em Entrar.
- **Resultado esperado:** Apenas uma tentativa de login é feita. Enquanto aguarda, o botão fica desativado com indicador de carregamento.
- **Risco que cobre:** Duas tentativas simultâneas podem contar em dobro no limite de tentativas e bloquear a conta.

### T009 — Servidor fora do ar durante o login

- **Como é feito:** O servidor está fora do ar (sem resposta de rede). O usuário tenta entrar.
- **Resultado esperado:** Aparece a mensagem de que o servidor não responde, incluindo o endereço consultado, e o formulário continua usável para tentar de novo.
- **Risco que cobre:** Uma tela travada ou muda faz o usuário achar que o sistema inteiro caiu.

### T010 — Excesso de tentativas de login (servidor recusa por limite)

- **Como é feito:** O servidor recusa por excesso de tentativas (429) com mensagem própria.
- **Resultado esperado:** A mensagem de limite de tentativas é exibida de forma legível, sem detalhes técnicos; o botão volta a ficar utilizável.
- **Risco que cobre:** Tratar esse caso como 'senha errada' induz a pessoa a continuar tentando e prolonga o bloqueio.

### T011 — Usuário já logado abre a tela de login

- **Como é feito:** Existe sessão ativa (usuário já identificado) e o servidor confirma a sessão. A pessoa abre o endereço do login.
- **Resultado esperado:** Ela é levada direto ao painel inicial, sem ver o formulário de login.
- **Risco que cobre:** Mostrar login a quem já está logado causa confusão e duplicidade de sessões.

### T012 — Login de administrador e de corretor

- **Como é feito:** Fazer dois logins: um de administrador e outro de corretor.
- **Resultado esperado:** O nível de acesso gravado em cada caso é o correto, e itens de menu reservados ao administrador aparecem só para ele.
- **Risco que cobre:** Nível gravado errado libera ou esconde áreas inteiras (usuários, auditoria).

### T013 — Login com resposta do servidor sem identificação do usuário

- **Como é feito:** O servidor responde sucesso, mas sem o código do usuário.
- **Resultado esperado:** O login é recusado com aviso de dados incompletos; nada é gravado como logado e a pessoa permanece na tela de entrada.
- **Risco que cobre:** Considerar o usuário logado sem identificação deixa o sistema num estado inconsistente.

### T014 — Primeiro login do dia mostra a tela de boas-vindas uma única vez

- **Como é feito:** Fazer login com sucesso e depois recarregar a página.
- **Resultado esperado:** A tela de boas-vindas aparece uma única vez logo após entrar e não reaparece ao recarregar.
- **Risco que cobre:** Se reaparecer a cada atualização, vira irritação diária; se nunca aparecer, perde-se a função.

### T015 — Trocar o idioma na tela de login (italiano ⇄ português)

- **Como é feito:** Na tela de login, trocar o idioma de italiano para português e depois recarregar a página.
- **Resultado esperado:** Títulos, rótulos, textos de exemplo e avisos de validação passam para português; ao recarregar continua em português.
- **Risco que cobre:** Textos que ficam no idioma antigo geram telas pela metade; esquecer a escolha obriga a trocar a cada acesso.

### T016 — Abrir qualquer tela interna sem estar logado

- **Como é feito:** Sem nenhuma sessão, abrir diretamente o endereço de uma tela interna (ex.: lista de imóveis).
- **Resultado esperado:** A pessoa é levada ao login sem que o conteúdo da tela interna apareça nem por um instante.
- **Risco que cobre:** Vazamento visual de telas internas para quem não está logado é falha de segurança.

### T017 — Sessão expira no meio do uso (servidor responde "não autorizado")

- **Como é feito:** Usuário logado trabalhando; uma consulta qualquer volta 'não autorizado' (sessão vencida).
- **Resultado esperado:** Os dados de sessão guardados no navegador são apagados e a pessoa é levada ao login.
- **Risco que cobre:** Sessão vencida que não derruba o usuário deixa a tela cheia de erros sem explicação.

### T018 — Servidor responde "não autorizado" na própria tela de login

- **Como é feito:** Na própria tela de login, o servidor responde 'não autorizado' à tentativa de entrar.
- **Resultado esperado:** Não ocorre novo redirecionamento nem repetição em laço; apenas o erro de credencial é mostrado.
- **Risco que cobre:** Um laço de redirecionamento na tela de login deixa o navegador travado.

### T019 — Sair do sistema

- **Como é feito:** Usuário logado clica em Sair e depois usa o botão Voltar do navegador.
- **Resultado esperado:** O servidor é avisado do encerramento, os dados locais são apagados e a pessoa volta ao login; o botão Voltar não reabre telas internas.
- **Risco que cobre:** Sair sem encerrar de fato permite que outra pessoa use o computador compartilhado.

### T020 — Sessão renovada automaticamente a cada 30 minutos

- **Como é feito:** Usuário logado com o sistema aberto; o tempo é avançado 30 minutos. Repetir com usuário sem login.
- **Resultado esperado:** Logado: o sistema pede renovação da sessão ao servidor a cada 30 minutos. Sem login: nenhum pedido é feito.
- **Risco que cobre:** Sem renovação a pessoa é derrubada no meio de um cadastro longo; renovando sem login gera tráfego inútil.

### T021 — Renovação de sessão falha

- **Como é feito:** O pedido de renovação da sessão falha (rede ou servidor).
- **Resultado esperado:** Nada é exibido ao usuário e a tela continua funcionando; a falha só aparece se a sessão realmente expirar.
- **Risco que cobre:** Alerta assustador a cada falha de rede passageira atrapalha o trabalho.

### T022 — Esqueci a senha com e-mail válido

- **Como é feito:** Na tela 'Esqueci a senha', digitar um e-mail válido e enviar, com o servidor lento.
- **Resultado esperado:** Aparece a confirmação de envio do link; durante o carregamento o botão fica desativado e não permite reenvio.
- **Risco que cobre:** Reenvios repetidos enchem a caixa do usuário e podem acionar limites do servidor.

### T023 — Redefinir senha sem letra maiúscula, sem minúscula, sem número, sem símbolo ou com 7 caracteres

- **Como é feito:** Na redefinição, testar cinco senhas: sem maiúscula, sem minúscula, sem número, sem símbolo, e com 7 caracteres.
- **Resultado esperado:** Cada senha gera o seu aviso específico (maiúscula, minúscula, número, símbolo, tamanho mínimo de 8); nenhuma é aceita.
- **Risco que cobre:** Aviso único e genérico não diz à pessoa o que ajustar e leva a muitas tentativas.

### T024 — Redefinir senha com confirmação diferente da senha

- **Como é feito:** Digitar senha forte e uma confirmação diferente.
- **Resultado esperado:** O aviso 'as senhas não conferem' aparece no campo de confirmação e o envio é barrado.
- **Risco que cobre:** Erro de digitação na confirmação pode deixar o usuário com uma senha que ele não conhece.

### T025 — Redefinir senha com link vencido ou já usado

- **Como é feito:** O servidor responde que o link de redefinição venceu ou já foi usado.
- **Resultado esperado:** A mensagem do servidor é exibida e nenhuma senha é alterada; a pessoa pode tentar pedir novo link.
- **Risco que cobre:** Fingir sucesso deixaria o usuário achando que trocou a senha quando não trocou.

## 2. Clientes (pessoas)

_Cadastro de proprietários, inquilinos, compradores, fiadores, contatos e fornecedores._

### T026 — Cadastrar pessoa com nome de 1 letra

- **Como é feito:** Cadastro de pessoa com nome 'A', papel preenchido, demais campos válidos.
- **Resultado esperado:** Envio barrado com o aviso de nome com no mínimo 2 caracteres.
- **Risco que cobre:** Nomes de uma letra poluem a base e atrapalham a busca.

### T027 — Cadastrar pessoa com nome só de espaços ("   ")

- **Como é feito:** Digitar apenas três espaços no nome e enviar.
- **Resultado esperado:** O nome é tratado como vazio e o aviso de nome mínimo aparece; os espaços não contam.
- **Risco que cobre:** Cadastros com nome 'em branco' ficam invisíveis na lista e impossíveis de localizar.

### T028 — Cadastrar pessoa sem escolher o papel (proprietário, inquilino…)

- **Como é feito:** Preencher todos os campos exceto o papel (proprietário, inquilino, comprador…) e enviar.
- **Resultado esperado:** Aviso de papel obrigatório no campo de papel; nada é enviado.
- **Risco que cobre:** Pessoa sem papel não aparece em nenhum filtro por tipo de cliente.

### T029 — Cadastrar com cada um dos 6 papéis

- **Como é feito:** Repetir o cadastro escolhendo, uma vez, cada um dos 6 papéis (proprietário, inquilino, comprador, fiador, contato, fornecedor), em italiano e em português.
- **Resultado esperado:** Os 6 papéis estão na lista de opções, cada um com o rótulo do idioma ativo, e o papel escolhido é o que segue no envio.
- **Risco que cobre:** Um papel faltando na lista impede de cadastrar aquele tipo de cliente.

### T030 — Telefone nos formatos "+39 081 123 4567", "(081) 1234567", "081.123.4567"

- **Como é feito:** Informar telefone nos formatos '+39 081 123 4567', '(081) 1234567' e '081.123.4567'.
- **Resultado esperado:** Os três são aceitos sem aviso; o valor digitado é guardado como foi escrito.
- **Risco que cobre:** Recusar formatos comuns de telefone obriga o corretor a reescrever números que já estão certos.

### T031 — Telefone "abc", "+", "123" (curto demais) e 25 dígitos

- **Como é feito:** Informar 'abc', '+', '123' e um número com 25 dígitos.
- **Resultado esperado:** Todos recusados com aviso de telefone inválido (letras, só símbolo, curto demais e longo demais).
- **Risco que cobre:** Telefone inválido na base quebra campanhas de WhatsApp e contatos.

### T032 — Telefone secundário inválido com o principal válido

- **Como é feito:** Telefone principal válido e telefone secundário 'abc'.
- **Resultado esperado:** O aviso aparece apenas no campo do telefone secundário; o principal não recebe erro.
- **Risco que cobre:** Erro apontado no campo errado faz o usuário mexer no número que estava certo.

### T033 — E-mail em branco

- **Como é feito:** Deixar o e-mail vazio e salvar; depois preencher 'maria@' e salvar.
- **Resultado esperado:** Vazio: aceito (campo opcional). 'maria@': recusado com aviso de e-mail inválido.
- **Risco que cobre:** Tornar o e-mail obrigatório impede cadastrar quem só tem telefone; aceitar lixo estraga e-mails em massa.

### T034 — Data de nascimento no futuro (amanhã)

- **Como é feito:** Data de nascimento de amanhã e depois a data de hoje.
- **Resultado esperado:** Amanhã: recusada ('data no futuro'). Hoje: aceita (limite do dia).
- **Risco que cobre:** Erro de um dia no limite aceitaria datas impossíveis ou recusaria um recém-nascido.

### T035 — Data de nascimento em 1899 e em 1900

- **Como é feito:** Data de nascimento 31/12/1899 e depois 01/01/1900.
- **Resultado esperado:** 1899: recusada como data implausível (informando o ano mínimo). 1900: aceita.
- **Risco que cobre:** Datas como 01/01/0001, comuns em erros de digitação, quebrariam relatórios e o servidor.

### T036 — Preencher rua sem informar cidade

- **Como é feito:** Preencher rua e número, deixar a cidade em branco e enviar.
- **Resultado esperado:** Aviso de cidade obrigatória aparece no campo cidade, não na rua.
- **Risco que cobre:** Endereço sem cidade é inútil para mala direta e para o cruzamento por região.

### T037 — Preencher apenas a cidade, sem demais dados de endereço

- **Como é feito:** Formulário de nova pessoa com nome e papel válidos. No endereço, preencher somente a cidade 'Napoli'; rua, número, CEP e região ficam vazios. Salvar.
- **Resultado esperado:** O cadastro é aceito: nenhum aviso de campo faltando e o envio ao servidor leva a cidade e os demais campos de endereço como 'sem valor'.
- **Risco que cobre:** Exigir endereço completo travaria o cadastro rápido de contatos feito por telefone.

### T038 — CEP com 3, 4, 10 e 11 dígitos e com letras

- **Como é feito:** Testar CEP com 3, 4, 10 e 11 dígitos e outro com letras ('12AB5').
- **Resultado esperado:** 3 e 11 dígitos e o com letras: recusados com aviso de CEP inválido. 4 e 10 dígitos: aceitos. CEP em branco: aceito.
- **Risco que cobre:** Regra de CEP diferente da do cadastro de imóveis geraria dados incompatíveis entre telas.

### T039 — Editar pessoa e salvar sem mudar nada

- **Como é feito:** Abrir uma pessoa existente e salvar sem alterar nada, com vários campos opcionais vazios.
- **Resultado esperado:** Salva sem erro; os campos vazios seguem como 'sem valor' e nada aparece como texto estranho (ex.: 'undefined').
- **Risco que cobre:** Salvar sem mudar nada que gera erro mostra que o formulário não reconhece os dados que ele mesmo carregou.

### T040 — Campos de texto vazios na hora de salvar

- **Como é feito:** Salvar pessoa com e-mail, telefone e data de nascimento vazios.
- **Resultado esperado:** O envio ao servidor leva 'sem valor' nesses campos, nunca texto vazio; o servidor aceita.
- **Risco que cobre:** O servidor recusa texto vazio em campos de formato (como data) e o cadastro falharia sem motivo visível.

### T041 — Buscar pessoa digitando rápido "mar"

- **Como é feito:** Na busca de clientes, digitar 'mar', 'mari', 'mario' com intervalo de décimos de segundo entre as letras.
- **Resultado esperado:** Apenas uma consulta é feita, depois de uma breve pausa, com o texto 'mario'; a lista mostra o resultado correto.
- **Risco que cobre:** Uma consulta por tecla sobrecarrega o servidor e pode mostrar resultado antigo sobre o novo.

### T042 — Buscar com acento e caixa diferentes ("JOSÉ" x "jose")

- **Como é feito:** Pessoa cadastrada como 'José'. Buscar por 'JOSE', 'jose' e 'José'.
- **Resultado esperado:** As três buscas devolvem a mesma pessoa.
- **Risco que cobre:** Busca sensível a acento e caixa faz o corretor achar que o cliente não existe.

### T043 — Buscar com % e _ no texto

- **Como é feito:** Buscar por '%' e por '_'.
- **Resultado esperado:** Os símbolos são tratados como letras comuns: a busca por '%' não devolve a base inteira.
- **Risco que cobre:** Esses símbolos funcionam como curinga na consulta; sem tratamento a busca devolve tudo ou erra.

### T044 — Paginação com 25 pessoas (10 por página)

- **Como é feito:** Base com 25 pessoas, página de 10. Ir para a página 3 e depois digitar algo na busca.
- **Resultado esperado:** Há 3 páginas; a última mostra 5 pessoas. Ao mudar a busca, a lista volta para a página 1.
- **Risco que cobre:** Ficar na página 3 de uma busca com 1 resultado mostra lista vazia sem explicação.

### T045 — Lista sem nenhuma pessoa

- **Como é feito:** O servidor devolve lista vazia.
- **Resultado esperado:** Aparece a mensagem de lista vazia, sem tabela quebrada e sem indicador de carregamento eterno.
- **Risco que cobre:** Tabela em branco sem texto parece falha do sistema.

### T046 — Excluir pessoa pedindo confirmação

- **Como é feito:** Clicar em excluir uma pessoa: primeiro cancelar, depois repetir e confirmar.
- **Resultado esperado:** Ao cancelar nada acontece. Ao confirmar, a exclusão é pedida, a lista é atualizada e aparece aviso de sucesso.
- **Risco que cobre:** Exclusão sem confirmação por clique acidental é perda de dados irreversível.

### T047 — Excluir pessoa que o servidor recusa (vinculada a imóvel)

- **Como é feito:** O servidor recusa a exclusão porque a pessoa está vinculada a um imóvel.
- **Resultado esperado:** A mensagem do servidor é exibida e a pessoa continua na lista.
- **Risco que cobre:** Dizer 'excluído' sem estar excluído gera registros fantasmas e confusão.

### T048 — Abrir a ficha de uma pessoa inexistente

- **Como é feito:** Abrir diretamente o endereço da ficha de uma pessoa que não existe.
- **Resultado esperado:** Aparece a tela de 'não encontrado' com caminho de volta à lista.
- **Risco que cobre:** Tela em branco ou carregando para sempre não diz ao usuário o que houve.

### T049 — Ficha da pessoa: aba de imóveis, eventos, comunicações e anexos

- **Como é feito:** Abrir a ficha de uma pessoa e percorrer as abas de imóveis, eventos, comunicações e anexos, uma com dados e outra vazia.
- **Resultado esperado:** Cada aba mostra somente o que pertence àquela pessoa; a aba sem dados mostra mensagem de vazio.
- **Risco que cobre:** Misturar dados de outro cliente numa ficha é erro grave de privacidade.

### T050 — Rua preenchida e cidade só com espaços

- **Como é feito:** Preencher rua e número e digitar apenas espaços na cidade.
- **Resultado esperado:** Aviso de cidade obrigatória: espaços não contam como cidade.
- **Risco que cobre:** Cidade 'em branco disfarçada' passaria pela regra e geraria endereços incompletos.

## 3. Solicitações (leads) e quadro de negociação

_Funil de interessados, critérios de busca e cruzamento com imóveis._

### T051 — Solicitação com nome de 1 letra

- **Como é feito:** Nova solicitação com nome 'A' e situação definida.
- **Resultado esperado:** Bloqueada com aviso de nome com no mínimo 2 caracteres.
- **Risco que cobre:** Solicitações sem nome identificável não podem ser atendidas.

### T052 — Solicitação sem situação escolhida

- **Como é feito:** Abrir o formulário de nova solicitação, preencher nome 'Maria Rossi' e telefone válido, mas não escolher a situação (nova, contatada, em negociação…). Enviar.
- **Resultado esperado:** Aviso 'situação obrigatória' junto ao campo de situação e nenhum dado enviado ao servidor.
- **Risco que cobre:** Solicitação sem situação não pertence a nenhuma coluna do quadro e desaparece da visão do corretor.

### T053 — Data do primeiro contato amanhã, hoje e ontem

- **Como é feito:** Informar o primeiro contato em três datas: amanhã, hoje e ontem.
- **Resultado esperado:** Amanhã: recusada. Hoje e ontem: aceitas.
- **Risco que cobre:** Primeiro contato no futuro distorce relatórios de tempo de resposta.

### T054 — Orçamento mínimo maior que o máximo

- **Como é feito:** Orçamento mínimo 500.000 e máximo 400.000.
- **Resultado esperado:** Aviso 'mínimo maior que o máximo' aparece no campo do máximo.
- **Risco que cobre:** Faixa invertida nunca cruza com nenhum imóvel e o cliente fica sem ofertas.

### T055 — Orçamento mínimo igual ao máximo

- **Como é feito:** Na solicitação, informar orçamento mínimo 300.000 e máximo 300.000 (cliente que busca valor exato) e salvar.
- **Resultado esperado:** Aceito sem avisos; o cruzamento passa a procurar imóveis de exatamente 300.000.
- **Risco que cobre:** Se a regra usar 'menor ou igual' no lugar de 'menor' por engano, o cliente com valor fixo seria barrado.

### T056 — Área mínima 100 e máxima 99,9

- **Como é feito:** Área mínima 100 e máxima 99,9; depois mínima 100 e máxima 100.
- **Resultado esperado:** O primeiro par é recusado (mínimo maior que máximo); o segundo é aceito.
- **Risco que cobre:** Comparar como texto ('99,9' > '100') daria resultado errado nos números.

### T057 — Valor negativo em orçamento, área, quartos ou banheiros

- **Como é feito:** Informar -1 em orçamento, em área, em quartos e em banheiros (um por vez).
- **Resultado esperado:** Cada campo mostra o aviso de valor negativo.
- **Risco que cobre:** Valores negativos distorcem o cruzamento com imóveis.

### T058 — Andar mínimo -1 (subsolo) e máximo 3

- **Como é feito:** Critérios de busca com andar mínimo -1 (subsolo) e andar máximo 3. Salvar.
- **Resultado esperado:** Aceito: o andar é o único campo de faixa que aceita números negativos; nenhum aviso de valor negativo aparece.
- **Risco que cobre:** Bloquear andares negativos impede registrar clientes que procuram garagem ou loja no subsolo.

### T059 — Andar mínimo 5 e máximo -2

- **Como é feito:** Critérios com andar mínimo 5 e andar máximo -2.
- **Resultado esperado:** Recusado: aviso 'mínimo maior que máximo' no campo do máximo, mesmo com números negativos.
- **Risco que cobre:** A comparação de faixas precisa tratar negativos como números, não como texto.

### T060 — Quartos 2,5 e banheiros 1,2

- **Como é feito:** Critérios com quartos mínimo 2,5 e banheiros mínimo 1,2 (dois campos de contagem preenchidos com decimais).
- **Resultado esperado:** Os dois campos mostram aviso de 'número inteiro' e o envio é barrado.
- **Risco que cobre:** O servidor só aceita contagens inteiras e recusaria o envio sem explicar qual campo errou.

### T061 — Andar 1,5

- **Como é feito:** Critérios com andar mínimo 1,5.
- **Resultado esperado:** Recusado com aviso de número inteiro, apesar de o campo permitir negativos.
- **Risco que cobre:** A permissão de negativos não pode desligar por engano a exigência de número inteiro.

### T062 — Seis pares de faixa errados ao mesmo tempo

- **Como é feito:** Preencher os seis pares de faixa (orçamento, área, quartos, dormitórios, banheiros, andar) todos com mínimo maior que máximo.
- **Resultado esperado:** Seis avisos aparecem, um em cada campo de máximo; nenhum erro encobre outro.
- **Risco que cobre:** Mostrar só o primeiro erro obriga a corrigir e reenviar seis vezes.

### T063 — Salvar critérios com tudo em branco

- **Como é feito:** Salvar uma solicitação com todos os critérios de busca em branco.
- **Resultado esperado:** Aceito; faixas vazias vão ao servidor como 'sem limite' e características como indiferentes.
- **Risco que cobre:** Exigir critérios impediria registrar um primeiro contato sem detalhes.

### T064 — Salvar critério de faixa com valor "0"

- **Como é feito:** Informar mínimo de quartos igual a 0 e salvar.
- **Resultado esperado:** O 0 segue como valor informado (vale no cruzamento), e não é confundido com campo vazio.
- **Risco que cobre:** Tratar 0 como vazio perde a intenção do cliente (ex.: estúdio sem quarto separado).

### T065 — Marcar elevador e garagem e desmarcar o resto

- **Como é feito:** Marcar 'elevador' e 'garagem' e deixar as demais características desmarcadas; salvar.
- **Resultado esperado:** Só elevador e garagem seguem como exigência; as demais seguem como 'indiferente'.
- **Risco que cobre:** Enviar 'não quer varanda' no lugar de 'tanto faz' exclui imóveis que o cliente aceitaria.

### T066 — Marcar e desmarcar uma característica

- **Como é feito:** Marcar 'terraço', salvar, reabrir, desmarcar e salvar.
- **Resultado esperado:** Depois de desmarcar, a característica volta a ser 'indiferente', e não 'não quer'.
- **Risco que cobre:** Marcar e desmarcar não pode deixar resíduo de exigência.

### T067 — Mostrar faixa de valores na ficha: área mínima 10000 e máxima 25000; e outra faixa 1000 a 2000

- **Como é feito:** Duas fichas de solicitação: uma com área de 10000 a 25000 e outra com 1000 a 2000.
- **Resultado esperado:** A primeira mostra '10.000 — 25.000'. A segunda mostra '1000 — 2000' (no formato italiano, números de 4 dígitos não levam ponto de milhar).
- **Risco que cobre:** Quem escreve o teste esperando '1.000' em vez de '1000' faria o teste falhar por engano; o formato precisa ser o do sistema.

### T068 — Faixa só com mínimo, só com máximo e com mínimo "0.00"

- **Como é feito:** Três fichas: só mínimo 500; só máximo 900; mínimo '0.00' e máximo vazio.
- **Resultado esperado:** Exibe '≥ 500', '≤ 900' e nenhum texto (0.00 conta como não informado).
- **Risco que cobre:** Mostrar '≥ 0' ou 'NaN' polui a ficha com informação sem sentido.

### T069 — Arrastar solicitação de "Novo" para "Contatado"

- **Como é feito:** No quadro, arrastar o cartão de 'Novo' para 'Contatado'.
- **Resultado esperado:** A situação muda no servidor, o quadro é recarregado com o cartão na nova coluna e aparece aviso de sucesso.
- **Risco que cobre:** Arrasto que só muda visualmente faz o quadro voltar ao estado antigo no próximo carregamento.

### T070 — Arrastar e soltar na mesma coluna

- **Como é feito:** No quadro, pressionar um cartão da coluna 'Contatado', arrastar 100 pixels e soltá-lo sobre a mesma coluna.
- **Resultado esperado:** Nenhuma atualização é enviada ao servidor e nenhum aviso de sucesso aparece.
- **Risco que cobre:** Atualizações desnecessárias poluem a auditoria e geram avisos falsos de mudança.

### T071 — Arrastar e soltar fora de qualquer coluna

- **Como é feito:** Arrastar um cartão e soltar fora de qualquer coluna.
- **Resultado esperado:** O cartão volta ao lugar original sem aviso de erro.
- **Risco que cobre:** Soltar fora não pode mudar situação nem quebrar a tela.

### T072 — Mover para uma coluna que já tem 4 cartões

- **Como é feito:** Coluna de destino com 4 cartões; arrastar um quinto cartão de outra coluna para ela.
- **Resultado esperado:** O pedido de mudança leva a situação nova e a posição 4 (depois dos quatro que já existem, contando a partir de zero).
- **Risco que cobre:** Posição errada embaralha a ordem de prioridade escolhida pelo corretor.

### T073 — Arrastar um clique curto (menos de 8 pixels)

- **Como é feito:** Pressionar o cartão e mover o ponteiro menos de 8 pixels antes de soltar.
- **Resultado esperado:** Nenhum arrasto é iniciado; o clique abre o cartão normalmente.
- **Risco que cobre:** Arrasto acidental ao clicar muda a situação de solicitações sem querer.

### T074 — Servidor recusa o movimento

- **Como é feito:** Arrastar um cartão para outra coluna e o servidor recusa a mudança.
- **Resultado esperado:** A mensagem de erro do servidor aparece e o cartão continua na coluna original depois de recarregar o quadro.
- **Risco que cobre:** Quadro mostrando uma situação que o servidor não tem leva a atendimento errado.

### T075 — Imóveis compatíveis com a solicitação: exibição do resultado

- **Como é feito:** O servidor devolve 3 imóveis compatíveis para uma solicitação aberta no quadro.
- **Resultado esperado:** A janela de compatíveis lista exatamente os 3 imóveis com código e título; a escolha de quais são compatíveis é do servidor.
- **Risco que cobre:** A tela não pode esconder, duplicar nem reordenar o que o servidor entregou.

### T076 — Cruzamento sem nenhum imóvel compatível

- **Como é feito:** Solicitação cujo critério nenhum imóvel atende.
- **Resultado esperado:** Mensagem 'nenhum imóvel compatível', sem erro e sem tabela quebrada.
- **Risco que cobre:** Estado vazio é o mais comum no início do cadastro.

### T077 — Salvar solicitação trocando os bairros de interesse

- **Como é feito:** Solicitação já ligada aos bairros A e B. No formulário, desmarcar B, manter A e marcar C; salvar.
- **Resultado esperado:** O sistema remove só a ligação com B, cria só a ligação com C e não mexe na ligação com A.
- **Risco que cobre:** Recriar tudo a cada salvamento apaga histórico; esquecer de remover deixa bairros que o cliente já descartou.

### T078 — Abrir solicitação por link direto (ex.: vindo de uma notificação)

- **Como é feito:** Abrir a tela de solicitações com o código de uma solicitação existente no endereço (como vem de uma notificação); repetir com um código que não existe.
- **Resultado esperado:** Código existente: a solicitação abre assim que o quadro carrega e o código sai do endereço. Código inexistente: nada abre e a tela funciona normalmente.
- **Risco que cobre:** Notificação que não abre a solicitação perde o propósito; código inválido não pode travar a tela.

### T079 — Atribuir solicitação a um corretor

- **Como é feito:** Escolher um corretor responsável pela solicitação e depois trocá-lo.
- **Resultado esperado:** O corretor aparece com o código na frente ('Código - Nome'); ao trocar, o cartão passa a mostrar o novo.
- **Risco que cobre:** Responsável errado faz o cliente ser atendido por quem não conhece o caso.

### T080 — Excluir solicitação

- **Como é feito:** Excluir uma solicitação na coluna 'Novo' com 3 cartões.
- **Resultado esperado:** Pede confirmação; ao confirmar, o cartão sai e a contagem da coluna passa de 3 para 2.
- **Risco que cobre:** Contagem desatualizada engana a gerência sobre o volume do funil.

### T081 — Cada uma das 10 origens

- **Como é feito:** Criar solicitações escolhendo cada uma das 10 origens (portal, site, telefone, indicação, rede social, balcão, chatbot do WhatsApp, vitrine, internet, outra).
- **Resultado esperado:** As 10 origens estão disponíveis, são salvas e exibidas com o rótulo correto.
- **Risco que cobre:** Origem faltando distorce a medição de qual canal traz clientes.

### T082 — Cada uma das 5 situações

- **Como é feito:** Criar uma solicitação em cada uma das 5 situações (nova, contatada, em negociação, convertida, perdida).
- **Resultado esperado:** Cada coluna tem cor própria e a contagem de cartões é a correta.
- **Risco que cobre:** Cores e contagens trocadas levam a ler o funil ao contrário.

### T083 — Quadro com 200 solicitações

- **Como é feito:** Carregar 200 solicitações distribuídas pelas 5 situações.
- **Resultado esperado:** Cada cartão aparece na coluna certa e a soma das contagens das colunas é 200.
- **Risco que cobre:** Lista que corta ou duplica cartões em volume alto esconde clientes.

### T084 — Solicitação com e-mail inválido e telefone inválido ao mesmo tempo

- **Como é feito:** Solicitação com e-mail 'x@' e telefone 'abc' preenchidos ao mesmo tempo; enviar.
- **Resultado esperado:** Aparecem dois avisos separados: 'e-mail inválido' no e-mail e 'telefone inválido' no telefone.
- **Risco que cobre:** Mostrar só o primeiro erro obriga a corrigir e reenviar em duas rodadas.

### T085 — Opções de tipo de pedido e de finalidade

- **Como é feito:** Abrir as listas de tipo de pedido e de finalidade, em italiano e em português.
- **Resultado esperado:** Tipo de pedido: busca, avaliação e contato. Finalidade: locação, venda e locação ou venda. Rótulos no idioma ativo.
- **Risco que cobre:** Opção faltando ou sem tradução deixa o formulário incompleto ou com texto técnico.

## 4. Imóveis: cadastro e lista

_Cadastro de imóveis, regras de preço por finalidade, endereço e lista com filtros._

### T086 — Imóvel só para venda sem preço de venda

- **Como é feito:** Cadastro de imóvel com finalidade 'venda', preço de venda em branco.
- **Resultado esperado:** Erro no campo preço de venda: obrigatório.
- **Risco que cobre:** Imóvel à venda sem preço não pode ser anunciado nem entra nas buscas por faixa.

### T087 — Imóvel só para locação com preço de venda preenchido

- **Como é feito:** Finalidade 'locação' com preço de venda 300.000 preenchido.
- **Resultado esperado:** Erro no campo preço de venda: não permitido para locação.
- **Risco que cobre:** Preço de venda em imóvel só de locação confunde o site e os relatórios.

### T088 — Imóvel só para venda com preço de locação preenchido

- **Como é feito:** Finalidade 'venda' com preço de locação 900 preenchido.
- **Resultado esperado:** Erro no campo preço de locação: não permitido para venda.
- **Risco que cobre:** Mesma incoerência no sentido inverso.

### T089 — Imóvel "locação ou venda" com os dois preços

- **Como é feito:** Cadastro com finalidade 'locação ou venda', preço de venda 300.000 e preço de locação 900; demais campos obrigatórios válidos.
- **Resultado esperado:** Aceito sem erros em nenhum dos dois campos de preço.
- **Risco que cobre:** É o caso que combina as duas regras e não pode ser barrado por engano.

### T090 — Imóvel "locação ou venda" sem preço de venda

- **Como é feito:** Finalidade 'locação ou venda' com só o preço de locação.
- **Resultado esperado:** Erro de preço de venda obrigatório (o imóvel também é vendável).
- **Risco que cobre:** Anunciar para venda sem preço quebra a vitrine.

### T091 — Trocar finalidade de venda para locação com preço de venda já digitado

- **Como é feito:** Escolher 'venda', digitar preço de venda e depois mudar a finalidade para 'locação'.
- **Resultado esperado:** O erro 'preço de venda não permitido' aparece imediatamente no campo de venda, sem precisar enviar.
- **Risco que cobre:** Usuário que troca a finalidade esqueceria o preço antigo e só descobriria ao salvar.

### T092 — Cidade em branco ou só espaços

- **Como é feito:** Cadastro de imóvel com a cidade vazia; depois repetir digitando apenas três espaços na cidade.
- **Resultado esperado:** Nos dois casos, aviso 'cidade obrigatória' no campo cidade; nada é salvo.
- **Risco que cobre:** Imóvel sem cidade não aparece em buscas por região nem no site.

### T093 — CEP com 4 e 10 dígitos (aceitos), 3 e 11 (recusados) e com letras

- **Como é feito:** CEP com 4 e 10 dígitos; CEP com 3 e com 11 dígitos; CEP '12AB5'.
- **Resultado esperado:** 4 e 10: aceitos. 3, 11 e o com letras: recusados com aviso de CEP inválido.
- **Risco que cobre:** Os limites 4 e 10 são onde a regra costuma falhar por um número.

### T094 — Quartos e banheiros: 50 (aceito) e 51 (recusado)

- **Como é feito:** Quartos 50 e banheiros 50; depois quartos 51.
- **Resultado esperado:** 50 é aceito. 51 é recusado com aviso de quantidade máxima de cômodos.
- **Risco que cobre:** Evita números absurdos digitados por erro (ex.: 500 quartos).

### T095 — Vagas de garagem e área com valor negativo

- **Como é feito:** Cadastro de imóvel com vagas de garagem -1; em outra tentativa, área -10.
- **Resultado esperado:** Cada campo mostra o aviso de 'número não negativo'; o envio é barrado.
- **Risco que cobre:** Área negativa estraga os cálculos de preço por metro quadrado.

### T096 — Quartos com texto "abc", "1e3" ou "∞"

- **Como é feito:** No campo quartos, digitar 'abc'; depois '1e3'; depois '∞'. Tentar salvar a cada vez.
- **Resultado esperado:** Os três são recusados com aviso de número inválido; nenhum é convertido silenciosamente em número.
- **Risco que cobre:** '1e3' é lido como 1.000 por algumas rotinas, o que criaria um imóvel com mil quartos.

### T097 — Percentuais de 0, 100 (aceitos), -1 e 100,01 (recusados)

- **Como é feito:** Em campos percentuais, informar 0 e 100; depois -1 e 100,01.
- **Resultado esperado:** 0 e 100 aceitos; -1 e 100,01 recusados com aviso de faixa de 0 a 100.
- **Risco que cobre:** Percentual acima de 100% distorce comissões e rendimentos.

### T098 — Link do Instagram válido, de outro site, sem https e com 501 caracteres

- **Como é feito:** No link do Instagram informar: um endereço válido do Instagram; um de outro site; um sem https (só 'instagram.com/x'); e um com 501 caracteres.
- **Resultado esperado:** O válido é aceito; o de outro site e o sem protocolo são recusados; o com 501 caracteres é recusado por tamanho.
- **Risco que cobre:** Links errados no site público levam clientes para fora ou para página quebrada.

### T099 — Link do Instagram "https://evil-instagram.com" e "https://instagram.com.evil.com"

- **Como é feito:** Informar 'https://evil-instagram.com' e 'https://instagram.com.evil.com'.
- **Resultado esperado:** Ambos recusados: o domínio precisa ser de fato o Instagram.
- **Risco que cobre:** Imitação de domínio é o truque mais comum de golpe; checar só 'contém instagram.com' é falha.

### T100 — Campo de link do TikTok preenchido com espaços

- **Como é feito:** No cadastro de imóvel, digitar apenas dois espaços no campo do link do TikTok e salvar.
- **Resultado esperado:** Tratado como vazio: nenhum aviso de link inválido e o imóvel é salvo.
- **Risco que cobre:** Campo opcional não pode virar obrigatório por causa de um espaço digitado sem querer.

### T101 — Lista de imóveis com 35 itens

- **Como é feito:** Lista com 35 imóveis, página de 10; navegar da página 1 à 4 com um filtro ativo.
- **Resultado esperado:** 4 páginas, a última com 5 imóveis; o total é 35; o filtro continua ativo ao trocar de página.
- **Risco que cobre:** Perder o filtro ao paginar faz o usuário ver imóveis que ele havia excluído.

### T102 — Combinar filtros da lista de imóveis (status, finalidade, categoria, faixa de preço, só meus, ordenação) e limpar

- **Como é feito:** Lista de imóveis com 12 itens variados. Ativar juntos status 'disponível', finalidade 'venda', preço de 200.000 a 400.000 e 'só meus'; depois ordenar por preço decrescente; depois limpar tudo.
- **Resultado esperado:** Com os filtros ativos só aparecem imóveis que atendem a todos, na ordem pedida; ao limpar, os 12 voltam.
- **Risco que cobre:** Filtro que ignora um critério leva a decisões sobre uma lista que não é a pedida.

### T103 — Buscar por código parcial e por título com acento

- **Como é feito:** Buscar por parte do código ('AP-12') e por título com acento ('Città').
- **Resultado esperado:** Encontra os imóveis ignorando maiúsculas e acentos.
- **Risco que cobre:** Busca exata demais faz parecer que o imóvel não existe.

### T104 — Cada um dos 6 status

- **Como é feito:** Imóveis nos 6 status (disponível, reservado, alugado, vendido, indisponível, vencido); olhar a lista e os cartões estreitos do painel.
- **Resultado esperado:** Na lista aparece o rótulo completo; nos cartões estreitos, o abreviado; cada status tem o rótulo certo no idioma ativo.
- **Risco que cobre:** Status com rótulo trocado leva a ler um imóvel vendido como disponível.

### T105 — Duplicar imóvel com preços recebidos como texto do servidor

- **Como é feito:** Duplicar imóvel cujo preço o servidor entregou como texto ('835000.00').
- **Resultado esperado:** A cópia é criada com preço numérico correto (835000) e o usuário é levado à ficha da cópia.
- **Risco que cobre:** Reenviar texto no lugar de número fazia o servidor recusar a cópia.

### T106 — Duplicar imóvel sem preço

- **Como é feito:** Duplicar imóvel sem preço de venda, aluguel ou condomínio.
- **Resultado esperado:** A cópia é criada sem preços; nenhum '0' nem 'NaN' inventado.
- **Risco que cobre:** Preço 0 inventado faria o imóvel parecer gratuito no site.

### T107 — Duplicar imóvel: código e título

- **Como é feito:** Duplicar o imóvel de código 'AP-100' e título 'Bilocale Vomero'.
- **Resultado esperado:** A cópia nasce com código 'AP-100-COPIA' e título 'Bilocale Vomero (copia)'.
- **Risco que cobre:** Código igual ao original é recusado ou confunde os dois imóveis.

### T108 — Duplicar quando o servidor recusa

- **Como é feito:** Duplicar imóvel e o servidor recusa.
- **Resultado esperado:** A mensagem do servidor aparece e o usuário permanece na lista (sem ir para ficha nenhuma).
- **Risco que cobre:** Navegar para a ficha de uma cópia que não existe leva a tela de erro.

### T109 — Transferir imóvel para outro corretor com motivo de 2 caracteres

- **Como é feito:** Transferir o imóvel AP-12 para outro corretor escolhendo o novo corretor e digitando como motivo 'ab' (2 caracteres).
- **Resultado esperado:** Recusado: aviso de motivo com no mínimo 3 caracteres; a transferência não é enviada.
- **Risco que cobre:** Transferência sem justificativa real prejudica a auditoria de quem perdeu o imóvel.

### T110 — Motivo de transferência com 3 e com 500 caracteres

- **Como é feito:** Na transferência, usar motivos de 3 caracteres, de 500 caracteres e de 501 caracteres.
- **Resultado esperado:** 3 e 500: aceitos. 501: recusado com aviso de tamanho máximo.
- **Risco que cobre:** Os limites exatos de tamanho concentram erros de 'um a mais'.

### T111 — Motivo com 3 espaços

- **Como é feito:** Na transferência, preencher o motivo apenas com três espaços.
- **Resultado esperado:** Recusado: espaços nas pontas são descartados e o motivo fica vazio.
- **Risco que cobre:** Evita driblar a exigência de motivo apertando a barra de espaço.

### T112 — Transferir sem escolher o novo corretor

- **Como é feito:** Transferência de corretor com motivo válido e sem escolher o novo corretor.
- **Resultado esperado:** Aviso de corretor obrigatório; e a ação de transferir só aparece para o administrador (corretor comum não a vê).
- **Risco que cobre:** Transferir para ninguém deixaria o imóvel sem responsável; corretor comum não pode tirar imóvel de colega.

### T113 — Excluir imóvel

- **Como é feito:** Excluir um imóvel com confirmação; a lista tinha 35.
- **Resultado esperado:** Pede confirmação; depois o imóvel some e o total passa a 34.
- **Risco que cobre:** Total desatualizado depois de excluir engana quem confere a contagem.

### T114 — Excluir imóvel com proposta aberta (servidor recusa)

- **Como é feito:** Excluir imóvel que tem proposta aberta; o servidor recusa.
- **Resultado esperado:** A mensagem do servidor aparece e o imóvel permanece na lista.
- **Risco que cobre:** Excluir imóvel com negócio em andamento corromperia propostas e vendas.

### T115 — Imóvel publicado no site e usado no assistente automático

- **Como é feito:** Marcar 'publicar no site' sem marcar 'usar no assistente automático'; salvar e reabrir; repetir ao contrário.
- **Resultado esperado:** As duas opções são independentes e voltam exatamente como foram salvas.
- **Risco que cobre:** Publicar no site por engano expõe um imóvel que a agência não quer divulgar.

### T116 — Cadastro por etapas: avançar com etapa incompleta

- **Como é feito:** No cadastro por etapas, tentar avançar com campos obrigatórios da etapa em branco.
- **Resultado esperado:** O avanço é bloqueado, os avisos aparecem nos campos faltando e a etapa seguinte não abre.
- **Risco que cobre:** Avançar com etapa incompleta só revelaria o erro no último passo, longe do campo.

### T117 — Categoria muda o tipo de imóvel (residencial, comercial, terreno…)

- **Como é feito:** Escolher categoria 'comercial' e depois 'terreno'; preencher campos comuns antes.
- **Resultado esperado:** Os campos específicos de cada tipo aparecem e somem conforme o tipo; os campos comuns preenchidos permanecem.
- **Risco que cobre:** Perder o que foi digitado ao trocar de categoria irrita e causa retrabalho.

### T118 — Imóvel importado sem corretor de cadastro

- **Como é feito:** Abrir um imóvel importado de outra fonte, sem corretor de cadastro.
- **Resultado esperado:** O 'cadastrado por' mostra origem desconhecida, nunca um nome inventado.
- **Risco que cobre:** Atribuir autoria falsa compromete a auditoria.

### T119 — Dados do cadastro e da última alteração

- **Como é feito:** Imóvel criado e alterado em instantes próximos da meia-noite no horário de Roma.
- **Resultado esperado:** Data e hora aparecem no horário da Itália e com o nome correto de quem criou e de quem alterou por último.
- **Risco que cobre:** Mostrar horário do navegador (outro fuso) causa datas de ontem ou amanhã.

### T120 — Salvar com falha de rede

- **Como é feito:** Preencher todo o cadastro e o salvamento falha por rede.
- **Resultado esperado:** Aparece aviso de falha e todos os dados digitados continuam no formulário.
- **Risco que cobre:** Perder um cadastro longo por uma falha de rede é frustração máxima.

### T121 — Imóvel só para locação com apenas o preço de locação

- **Como é feito:** Finalidade 'locação' com preço de locação preenchido e sem preço de venda.
- **Resultado esperado:** Aceito sem pedir preço de venda.
- **Risco que cobre:** Imóvel só de locação é comum e não pode ser bloqueado pela regra de venda.

## 5. Ficha do imóvel

_Cômodos, fotos, documentos, características, preços detalhados e contrato de intermediação._

### T122 — Contrato de intermediação vence em 31 dias

- **Como é feito:** Imóvel cujo contrato de intermediação vence exatamente daqui a 31 dias.
- **Resultado esperado:** A ficha não mostra alerta de vencimento.
- **Risco que cobre:** Alertas cedo demais viram ruído e passam a ser ignorados.

### T123 — Contrato vence em 30 dias, em 1 dia e hoje

- **Como é feito:** Três imóveis com contrato vencendo daqui a 30 dias, daqui a 1 dia e hoje.
- **Resultado esperado:** Os três mostram alerta, com 30, 1 e 0 dias restantes respectivamente.
- **Risco que cobre:** Os limites da janela (30 e 0) são onde a conta de dias costuma falhar por um dia.

### T124 — Contrato venceu ontem

- **Como é feito:** Imóvel cujo contrato venceu ontem.
- **Resultado esperado:** Sem alerta de 'a vencer' e sem contagem negativa de dias.
- **Risco que cobre:** 'Faltam -1 dias' numa ficha mostra descuido e confunde.

### T125 — Contrato sem data de vencimento

- **Como é feito:** Imóvel cujo contrato de intermediação não tem data de vencimento cadastrada.
- **Resultado esperado:** A ficha abre normalmente, sem alerta e sem erro.
- **Risco que cobre:** Imóveis sem essa data são comuns e não podem quebrar a ficha.

### T126 — Data de vencimento recebida só como dia e com hora completa

- **Como é feito:** Dois imóveis com o mesmo vencimento, um recebido só como dia e outro com data e hora completas.
- **Resultado esperado:** Os dois mostram o mesmo número de dias restantes.
- **Risco que cobre:** Formatos diferentes de data vindos do servidor não podem mudar a conta.

### T127 — Adicionar cômodo de cada tipo

- **Como é feito:** Adicionar um cômodo de cada tipo disponível.
- **Resultado esperado:** Cada cômodo aparece na lista com o tipo certo e entra nos totais da ficha.
- **Risco que cobre:** Totais errados de cômodos desinformam o cliente.

### T128 — Remover cômodo

- **Como é feito:** Ficha com 3 cômodos cadastrados; clicar em remover no segundo.
- **Resultado esperado:** Pede confirmação; ao confirmar, restam 2 cômodos e o total da ficha passa de 3 para 2.
- **Risco que cobre:** Remoção sem confirmação elimina informação cadastrada por engano.

### T129 — Enviar foto PNG, JPG e WebP válidas

- **Como é feito:** Enviar três fotos reais: uma PNG, uma JPG e uma WebP.
- **Resultado esperado:** As três são aceitas e aparecem na galeria da ficha.
- **Risco que cobre:** Recusar formatos comuns de foto impede publicar o imóvel.

### T130 — Enviar arquivo ".jpg" cujo conteúdo é outro tipo

- **Como é feito:** Enviar um arquivo chamado 'foto.jpg' cujo conteúdo é de outro tipo.
- **Resultado esperado:** Recusado com mensagem de que o conteúdo não corresponde ao tipo declarado; nada é enviado.
- **Risco que cobre:** Arquivos disfarçados são vetor de ataque e quebram a galeria.

### T131 — Enviar PDF verdadeiro e arquivo de texto renomeado para PDF

- **Como é feito:** Enviar um PDF verdadeiro e um arquivo de texto renomeado para 'contrato.pdf'.
- **Resultado esperado:** O PDF verdadeiro é aceito; o arquivo de texto é recusado com mensagem de conteúdo diferente do declarado.
- **Risco que cobre:** Documentos corrompidos em contratos geram problemas jurídicos futuros.

### T132 — Enviar arquivo vazio declarado como PDF

- **Como é feito:** Enviar um arquivo de 0 bytes chamado 'vazio.pdf'.
- **Resultado esperado:** Recusado: o conteúdo não corresponde a um PDF.
- **Risco que cobre:** Verificação que só olha o nome do arquivo deixaria passar arquivos vazios.

### T133 — Enviar 20 fotos de uma vez

- **Como é feito:** Selecionar 20 fotos e enviar; em outra tentativa, fazer o envio de 20 fotos em que uma é recusada pelo servidor.
- **Resultado esperado:** Caso 1: as 20 aparecem na galeria. Caso 2: o aviso de erro do envio é exibido (não aparece mensagem de sucesso).
- **Risco que cobre:** Envio em lote que informa sucesso mesmo com falha deixa a galeria incompleta sem o usuário saber.

### T134 — Definir foto de capa

- **Como é feito:** Imóvel com foto A como capa; marcar a foto B como capa.
- **Resultado esperado:** Só a foto B é capa; a foto A deixa de ser.
- **Risco que cobre:** Duas capas fazem o site escolher uma ao acaso.

### T135 — Reordenar fotos

- **Como é feito:** Arrastar a foto da posição 5 para a posição 1 e recarregar a página da ficha.
- **Resultado esperado:** A nova ordem permanece depois de recarregar.
- **Risco que cobre:** Ordem que não persiste obriga a refazer a galeria a cada visita.

### T136 — Imóvel sem fotos

- **Como é feito:** Imóvel sem nenhuma foto; depois imóvel com foto de capa e sem galeria.
- **Resultado esperado:** O primeiro mostra mensagem de galeria vazia; no segundo a ficha pública usa a foto de capa.
- **Risco que cobre:** Galeria em branco sem explicação parece erro de carregamento.

### T137 — Anexar documento ao imóvel

- **Como é feito:** Anexar um documento PDF ao imóvel e baixá-lo.
- **Resultado esperado:** O documento aparece com nome, tipo e data; baixar abre o arquivo correto.
- **Risco que cobre:** Anexo trocado entre imóveis é vazamento de informação.

### T138 — Excluir documento

- **Como é feito:** Ficha com 2 documentos anexados; excluir o primeiro.
- **Resultado esperado:** Pede confirmação; depois a lista mostra só o segundo documento.
- **Risco que cobre:** Exclusão de documento jurídico sem confirmação é perda séria.

### T139 — Marcar e desmarcar características (varanda, elevador, piscina…)

- **Como é feito:** Marcar varanda, elevador e piscina; salvar; recarregar; desmarcar a varanda; salvar.
- **Resultado esperado:** Após cada recarga estão marcadas exatamente as escolhidas.
- **Risco que cobre:** Característica que não persiste faz o imóvel sumir de buscas filtradas.

### T140 — Aquecimento e detalhes técnicos em branco

- **Como é feito:** Salvar aquecimento e detalhes técnicos sem preencher nada.
- **Resultado esperado:** Salva sem erro; campos ficam como 'sem informação'.
- **Risco que cobre:** Exigir esses detalhes impediria cadastrar um imóvel no primeiro contato.

### T141 — Preço detalhado: condomínio com periodicidade

- **Como é feito:** Preencher o condomínio com cada periodicidade disponível; depois um valor negativo.
- **Resultado esperado:** Cada periodicidade mostra o rótulo próprio; valor negativo é recusado.
- **Risco que cobre:** Condomínio mensal lido como anual muda 12 vezes o custo mostrado ao cliente.

### T142 — Áreas industriais: adicionar e remover

- **Como é feito:** Adicionar duas áreas industriais e remover uma.
- **Resultado esperado:** A lista mostra a área restante e o total reflete a mudança.
- **Risco que cobre:** Total desatualizado em áreas industriais distorce o preço por metro quadrado.

### T143 — Histórico de alterações

- **Como é feito:** Abrir o histórico de um imóvel com 5 alterações feitas por pessoas diferentes.
- **Resultado esperado:** Cada alteração mostra autor, data e rótulo legível no idioma ativo, do mais recente ao mais antigo.
- **Risco que cobre:** Histórico ilegível ou fora de ordem inviabiliza a auditoria.

### T144 — Abrir ficha por endereço de imóvel inexistente

- **Como é feito:** Abrir o endereço de uma ficha de imóvel que não existe.
- **Resultado esperado:** Aparece a tela de não encontrado com volta à lista de imóveis.
- **Risco que cobre:** Tela vazia sem saída trava o usuário.

### T145 — Abrir "novo imóvel" e depois um imóvel existente

- **Como é feito:** Abrir 'novo imóvel', digitar algo, sair; abrir um imóvel existente.
- **Resultado esperado:** O formulário mostra os dados do imóvel existente, sem restos do rascunho anterior.
- **Risco que cobre:** Misturar dados de dois imóveis é o erro mais perigoso de cadastro.

### T146 — Foto GIF (duas versões do formato) e WebP verdadeiros; planilha de tipo não verificado

- **Como é feito:** Enviar um GIF verdadeiro (nas duas versões do formato), um WebP verdadeiro e uma planilha.
- **Resultado esperado:** GIF e WebP verdadeiros são aceitos; a planilha, de tipo sem verificação de conteúdo, passa sem bloqueio.
- **Risco que cobre:** Confirma que a verificação de conteúdo vale só para os tipos que o servidor também verifica.

## 6. Propostas de compra

_Ofertas recebidas, negociação, aceite, recusa e conversão em venda._

### T147 — Proposta sem número, sem imóvel ou sem comprador

- **Como é feito:** Nova proposta com número, imóvel e comprador todos vazios; demais campos válidos. Enviar.
- **Resultado esperado:** Três avisos distintos aparecem, um em cada campo; nada é enviado.
- **Risco que cobre:** Proposta sem imóvel ou comprador não pode ser negociada nem convertida em venda.

### T148 — Valor da proposta 0, -1 e em branco

- **Como é feito:** Valor da proposta: deixar em branco; depois 0; depois -1.
- **Resultado esperado:** Em branco: aviso de valor obrigatório. 0 e -1: aviso de valor positivo.
- **Risco que cobre:** Distinguir 'faltou' de 'valor inválido' orienta o usuário certo.

### T149 — Valor 0,01 e 999.999.999,99

- **Como é feito:** Criar duas propostas: uma de 0,01 e outra de 999.999.999,99.
- **Resultado esperado:** Ambas são aceitas e o valor enviado ao servidor é exatamente o digitado, sem arredondar.
- **Risco que cobre:** Arredondamentos pequenos viram diferenças reais em contratos.

### T150 — Valor com texto "abc"

- **Como é feito:** Digitar 'abc' no campo valor da proposta e enviar.
- **Resultado esperado:** Recusado com aviso; o valor não vira 0 nem NaN.
- **Risco que cobre:** Texto virando número registraria proposta sem valor real.

### T151 — Data de validade anterior à data da proposta

- **Como é feito:** Data da proposta 10/05 e validade 09/05.
- **Resultado esperado:** Erro no campo de validade: não pode ser anterior à data da proposta.
- **Risco que cobre:** Proposta já nasce vencida.

### T152 — Data de validade igual à data da proposta

- **Como é feito:** Proposta com data 10/05/2026 e validade 10/05/2026 (mesmo dia).
- **Resultado esperado:** Aceita: validade no mesmo dia é válida.
- **Risco que cobre:** Recusar o mesmo dia impediria propostas com validade de um dia.

### T153 — Proposta recusada sem motivo e com motivo só de espaços

- **Como é feito:** Status 'recusada': primeiro sem motivo, depois motivo só com espaços.
- **Resultado esperado:** Erro de motivo da recusa obrigatório nos dois casos.
- **Risco que cobre:** Recusa sem motivo impede aprender por que se perdem negócios.

### T154 — Proposta recusada com motivo

- **Como é feito:** Marcar a proposta como 'recusada', escrever 'valor acima do orçamento' como motivo e salvar; reabrir.
- **Resultado esperado:** Salva e o motivo aparece na ficha ao reabrir.
- **Risco que cobre:** O motivo gravado precisa estar visível para análise posterior dos negócios perdidos.

### T155 — Proposta aceita sem motivo

- **Como é feito:** Marcar a proposta como 'aceita' sem preencher motivo de recusa.
- **Resultado esperado:** Aceita sem pedir motivo.
- **Risco que cobre:** A exigência de motivo vale somente para a recusa.

### T156 — Cada forma de pagamento (à vista, financiado, parcelado direto, permuta, outra)

- **Como é feito:** Criar propostas com cada forma de pagamento: à vista, financiado, parcelado direto, permuta, outra.
- **Resultado esperado:** As cinco são oferecidas, salvas e exibidas com o rótulo correto.
- **Risco que cobre:** Forma de pagamento trocada altera a análise do negócio.

### T157 — Escolher comprador pela busca digitando

- **Como é feito:** No campo comprador, digitar parte do nome; escolher uma pessoa; apagar o texto de busca.
- **Resultado esperado:** A lista mostra só quem combina; a escolha preenche o campo; apagar a busca não desfaz a escolha.
- **Risco que cobre:** Comprador errado ou perdido associa a proposta à pessoa errada.

### T158 — Escolher imóvel pela busca por código

- **Como é feito:** No campo imóvel, buscar pelo código.
- **Resultado esperado:** Cada resultado mostra código e título; escolher preenche o campo.
- **Risco que cobre:** Sem código visível, imóveis de título igual se confundem.

### T159 — Vincular proposta a uma solicitação

- **Como é feito:** Vincular a proposta a uma solicitação existente.
- **Resultado esperado:** A solicitação aparece na ficha da proposta e permanece após reabrir.
- **Risco que cobre:** Sem vínculo se perde a origem do negócio.

### T160 — Converter proposta aceita em venda

- **Como é feito:** Converter uma proposta aceita em venda.
- **Resultado esperado:** O usuário vai à tela de vendas, aparece aviso de sucesso e o total de propostas abertas diminui.
- **Risco que cobre:** Sem atualizar a contagem a gerência vê negócios já fechados como pendentes.

### T161 — Converter proposta quando o servidor recusa

- **Como é feito:** Converter proposta e o servidor recusa.
- **Resultado esperado:** A mensagem do servidor aparece e o usuário permanece na proposta.
- **Risco que cobre:** Levar o usuário às vendas sem a venda criada gera confusão.

### T162 — Converter duas vezes seguidas (duplo clique)

- **Como é feito:** Proposta aceita pronta para converter. Clicar duas vezes seguidas em 'Converter em venda'.
- **Resultado esperado:** Apenas uma venda deve ser criada. Atenção: hoje a conversão não tem proteção contra duplo clique; este teste pode revelar uma falha real.
- **Risco que cobre:** Venda duplicada infla o faturamento e é trabalhosa de corrigir.

### T163 — Anexar documento à proposta

- **Como é feito:** Anexar a uma proposta um arquivo válido e outro com conteúdo falso.
- **Resultado esperado:** O válido aparece na lista; o falso é recusado com mensagem.
- **Risco que cobre:** Anexos de proposta são documentos jurídicos.

### T164 — Excluir proposta

- **Como é feito:** Lista com 5 propostas abertas; excluir uma confirmando.
- **Resultado esperado:** Pede confirmação; depois a lista e o contador do topo mostram 4.
- **Risco que cobre:** Contagem desatualizada engana a gerência sobre o funil.

### T165 — Filtrar propostas por status

- **Como é feito:** Filtrar por cada status e conferir os totais.
- **Resultado esperado:** Cada status mostra só as suas propostas e a soma dos status é igual ao total geral.
- **Risco que cobre:** Soma diferente indica propostas que sumiram de algum filtro.

### T166 — Lista de propostas vazia

- **Como é feito:** O servidor responde lista de propostas vazia.
- **Resultado esperado:** Aparece mensagem de lista vazia, sem erro e sem carregamento infinito.
- **Risco que cobre:** É o estado inicial de qualquer cliente novo.

### T167 — Proposta com data da proposta em branco

- **Como é feito:** Preencher a proposta e deixar a data da proposta em branco.
- **Resultado esperado:** Aviso 'data obrigatória' no campo; nada é enviado.
- **Risco que cobre:** A data é a base de cálculo do prazo de validade.

## 7. Operações: vendas e locações

_Vendas e locações: regras reais dos formulários, conflitos de número e de imóvel, formatos de valores e datas._

### T168 — Abrir "Operações" sem escolher subárea

- **Como é feito:** Usuário logado abre o endereço geral de Operações (sem escolher Vendas ou Locações).
- **Resultado esperado:** O sistema leva direto para a lista de Vendas; a página geral não fica em branco nem mostra erro.
- **Risco que cobre:** Quem chega pelo menu ou por link antigo ficaria numa tela vazia.

### T169 — Lista de vendas com 25 itens

- **Como é feito:** O servidor devolve 25 vendas, com valores como 950, 1250000 e 87500,50. Abrir Vendas e navegar pelas páginas.
- **Resultado esperado:** A lista tem 3 páginas (10, 10 e 5 vendas); os valores aparecem como '950,00 €', '1.250.000,00 €' e '87.500,50 €' (euro depois do número).
- **Risco que cobre:** Valor sem formato claro leva a confundir 1.000 com 1,000 numa decisão de negócio.

### T170 — Venda sem valor

- **Como é feito:** Uma venda chega sem valor informado e outra com valor 0.
- **Resultado esperado:** A venda sem valor mostra um traço; nunca 0 nem 'NaN'. A com valor 0 mostra '0,00 €' (informado de verdade).
- **Risco que cobre:** Valor inventado faz a gerência somar vendas que não existem.

### T171 — Valor com 1 centavo e com 1 bilhão

- **Como é feito:** Duas vendas: uma de 0,01 euro e outra de 1.000.000.000 euros.
- **Resultado esperado:** Aparecem '0,01 €' e '1.000.000.000,00 €', sem arredondar o centavo nem cortar a coluna.
- **Risco que cobre:** Os extremos são onde arredondamento e largura de coluna falham.

### T172 — Percentual de reajuste 2,5, 100 e 12,3456

- **Como é feito:** Três contratos com reajuste de 2,5; 100 e 12,3456 por cento.
- **Resultado esperado:** Exibidos como '2,5%', '100%' e '12,35%': vírgula italiana e no máximo duas casas.
- **Risco que cobre:** Percentual com muitas casas decimais polui a leitura e dá falsa precisão.

### T173 — Percentual vazio, nulo e "abc"

- **Como é feito:** Três contratos com percentual de reajuste vazio, nulo e com o texto 'abc'.
- **Resultado esperado:** Os três mostram um traço; em nenhum aparece 'NaN%'.
- **Risco que cobre:** 'NaN%' numa tela da gerência passa a impressão de sistema quebrado.

### T174 — Corretor responsável aparece com código

- **Como é feito:** Três linhas: corretor 'C07' chamado Ana Rossi; corretor sem código chamado Luca Verdi; imóvel sem corretor.
- **Resultado esperado:** Aparecem 'C07 - Ana Rossi', 'Luca Verdi' e um traço.
- **Risco que cobre:** Padrão único evita confundir corretores de mesmo nome.

### T175 — Data que chega à meia-noite no fuso de Londres

- **Como é feito:** O servidor devolve uma data como '2026-03-05T00:00:00.000Z' (meia-noite universal).
- **Resultado esperado:** A tela mostra 05/03/2026, e não 04/03/2026, mesmo com o computador em fuso diferente.
- **Risco que cobre:** O erro 'um dia a menos' é o mais comum em sistemas com fuso e muda prazos.

### T176 — Venda convertida de proposta

- **Como é feito:** Converter uma proposta (comprador Mario Bianchi, imóvel AP-12, valor 320.000) e abrir a venda criada.
- **Resultado esperado:** A venda mostra o mesmo comprador, o mesmo imóvel e o valor de 320.000.
- **Risco que cobre:** Divergência entre proposta e venda é erro financeiro direto.

### T177 — Excluir venda ou locação

- **Como é feito:** Excluir uma venda e uma locação (uma de cada vez), confirmando.
- **Resultado esperado:** Em cada caso o sistema pede confirmação; ao confirmar, o item sai e os totais da tela diminuem em 1.
- **Risco que cobre:** Totais antigos escondem que algo foi excluído.

### T178 — Venda: data da escritura antes da data da venda

- **Como é feito:** Nova venda com data da venda 10/05 e data da escritura 09/05; depois com escritura em 10/05.
- **Resultado esperado:** O primeiro caso mostra erro no campo escritura ('antes da venda'); o segundo é aceito.
- **Risco que cobre:** Escritura anterior à venda é incoerência de datas que quebra prazos e comissões.

### T179 — Venda: comissão maior que o valor da venda

- **Como é feito:** Venda de 100.000 com comissão de 100.001; depois com comissão de 100.000.
- **Resultado esperado:** O primeiro caso é recusado no campo comissão; o segundo é aceito (igual ao valor é permitido).
- **Risco que cobre:** Comissão acima do valor da venda é erro de digitação com impacto financeiro direto.

### T180 — Venda: comprador e vendedor são a mesma pessoa

- **Como é feito:** Escolher a mesma pessoa como comprador e como vendedor.
- **Resultado esperado:** Erro no campo vendedor informando que são a mesma pessoa.
- **Risco que cobre:** Uma venda de alguém para si mesmo distorce relatórios e pode ser fraude.

### T181 — Venda cancelada sem motivo

- **Como é feito:** Marcar a venda como cancelada: primeiro sem motivo, depois com motivo só de espaços, depois com motivo escrito.
- **Resultado esperado:** Os dois primeiros recebem erro de motivo obrigatório; o terceiro é aceito.
- **Risco que cobre:** Sem motivo não se aprende por que as vendas caem.

### T182 — Venda: quantidade de parcelas

- **Como é feito:** Informar parcelas 0, 2,5, 3 e deixar em branco.
- **Resultado esperado:** 0 e 2,5 recusados (precisa ser inteiro maior que zero); 3 e vazio aceitos.
- **Risco que cobre:** Parcela fracionada ou zero gera contrato sem sentido.

### T183 — Venda: valor final em branco, 0 e -1

- **Como é feito:** Salvar a venda com valor final vazio; depois 0; depois -1.
- **Resultado esperado:** Vazio: aviso de valor obrigatório; 0 e -1: aviso de valor positivo.
- **Risco que cobre:** Venda sem valor real distorce o faturamento.

### T184 — Venda: comissão negativa e comissão zero

- **Como é feito:** Informar comissão -1 e depois 0.
- **Resultado esperado:** -1 é recusado; 0 é aceito.
- **Risco que cobre:** Comissão negativa subtrai dinheiro do faturamento.

### T185 — Venda: número já usado

- **Como é feito:** Criar uma venda com o número 'V-100' enquanto o servidor informa que já existe uma venda com esse número; depois editar a própria venda 'V-100' mantendo o número.
- **Resultado esperado:** Na criação o sistema avisa que o número está duplicado e bloqueia; na edição da própria venda não há conflito.
- **Risco que cobre:** Dois contratos com o mesmo número geram confusão jurídica; mas a própria venda não pode se bloquear.

### T186 — Venda: imóvel já vendido

- **Como é feito:** Criar uma venda para um imóvel que já tem venda concluída; depois editar uma venda existente desse imóvel.
- **Resultado esperado:** A criação é bloqueada com aviso de imóvel já vendido; a edição da venda existente não é bloqueada por essa regra.
- **Risco que cobre:** Vender duas vezes o mesmo imóvel é o pior erro possível do sistema.

### T187 — Venda: as três situações

- **Como é feito:** Abrir a lista de situações da venda em italiano e em português.
- **Resultado esperado:** Aparecem em negociação, vendida e cancelada, cada uma com o rótulo certo.
- **Risco que cobre:** Situação faltando impede registrar o andamento real.

### T188 — Locação: dia de vencimento do aluguel

- **Como é feito:** Informar dia de vencimento 0, 32, 1,5, 1 e 31.
- **Resultado esperado:** 0, 32 e 1,5 são recusados (precisa ser inteiro de 1 a 31); 1 e 31 são aceitos.
- **Risco que cobre:** Dia 0 ou 32 gera cobrança que nunca vence.

### T189 — Locação: dias de aviso prévio

- **Como é feito:** Informar aviso prévio -1, 1,5 e 0; e deixar em branco.
- **Resultado esperado:** -1 e 1,5 recusados; 0 e vazio aceitos.
- **Risco que cobre:** Aviso prévio negativo ou fracionado distorce o alerta de renovação.

### T190 — Locação: data de término

- **Como é feito:** Contrato com início em 01/01 e término em 31/12 (aceito); término igual ao início (01/01); término anterior ao início; e término em branco.
- **Resultado esperado:** Término depois do início e término em branco (prazo indeterminado) são aceitos; término igual ou anterior ao início é recusado.
- **Risco que cobre:** Contrato que termina no dia em que começa, ou antes, é erro de digitação.

### T191 — Locação: campos obrigatórios

- **Como é feito:** Salvar contrato de locação vazio.
- **Resultado esperado:** Avisos nos campos número, imóvel, inquilino, proprietário, data de início, dia de vencimento e valor do aluguel.
- **Risco que cobre:** Contrato sem esses dados não pode gerar cobrança.

### T192 — Locação: as três situações

- **Como é feito:** Abrir a lista de situações do contrato em italiano e em português.
- **Resultado esperado:** Aparecem ativo, encerrado (rescindido) e concluído, cada um com o rótulo certo.
- **Risco que cobre:** Situação errada faz contratos encerrados continuarem gerando cobranças.

## 8. Agenda

_Calendário de visitas, ligações, escrituras e compromissos._

### T193 — Evento sem título, com 1 letra e com 2 letras

- **Como é feito:** Novo evento: título vazio; depois 'A'; depois 'Ab'.
- **Resultado esperado:** Vazio: aviso de título obrigatório. 'A': aviso de mínimo de 2 caracteres. 'Ab': aceito.
- **Risco que cobre:** Compromisso sem título fica ilegível no calendário.

### T194 — Evento sem tipo escolhido

- **Como é feito:** Preencher título, data e horários, e deixar o tipo de evento em branco.
- **Resultado esperado:** Aviso de tipo obrigatório; nada é salvo.
- **Risco que cobre:** O tipo define a cor e o significado do compromisso.

### T195 — Hora de fim antes da hora de início

- **Como é feito:** Evento de 15:00 a 14:00 no mesmo dia, 'dia inteiro' desmarcado.
- **Resultado esperado:** Erro no campo hora de fim; nada é salvo.
- **Risco que cobre:** Duração negativa quebra o desenho do calendário.

### T196 — Hora de fim igual à de início

- **Como é feito:** Evento com início 15:00 e fim 15:00.
- **Resultado esperado:** Recusado: o fim precisa ser depois do início.
- **Risco que cobre:** Evento de duração zero desaparece do calendário.

### T197 — Evento de dia inteiro com horas invertidas

- **Como é feito:** Marcar 'dia inteiro' e deixar início 15:00 e fim 14:00.
- **Resultado esperado:** Aceito: as horas não são verificadas em eventos de dia inteiro.
- **Risco que cobre:** A regra de horas não pode barrar eventos que não usam hora.

### T198 — Evento das 23:30 às 00:30

- **Como é feito:** Início 23:30 e fim 00:30 (atravessa a meia-noite).
- **Resultado esperado:** Recusado: no mesmo dia a hora de fim precisa ser maior que a de início.
- **Risco que cobre:** Evita eventos de dois dias desenhados no lugar errado do calendário.

### T199 — Cor dos eventos no calendário

- **Como é feito:** Quatro eventos: um pendente, um confirmado, um cancelado e um com cor própria escolhida.
- **Resultado esperado:** Pendente aparece cinza, confirmado verde, cancelado vermelho; o de cor própria usa a cor escolhida em vez da cor da confirmação.
- **Risco que cobre:** Cor errada faz o corretor ler um compromisso pendente como confirmado.

### T200 — Cada lembrete (nenhum, na hora, 5 min, 15 min, 30 min, 1 h, 1 dia)

- **Como é feito:** Salvar 7 eventos, cada um com uma opção de lembrete (nenhum, na hora, 5 min, 15 min, 30 min, 1 hora, 1 dia).
- **Resultado esperado:** Reabrindo cada evento, o lembrete escolhido aparece como foi salvo.
- **Risco que cobre:** Lembrete que não é guardado causa compromisso esquecido.

### T201 — Repetição do evento (nenhuma, diária, semanal, mensal)

- **Como é feito:** Criar quatro eventos, um com cada opção de repetição, e reabri-los.
- **Resultado esperado:** O valor da repetição escolhida é enviado ao servidor e reaparece ao reabrir; as quatro opções existem em italiano e português.
- **Risco que cobre:** Repetição que não é guardada faz compromissos fixos (ex.: plantão semanal) sumirem.

### T202 — Cada origem (Immobiliare, social, placa, vitrine, proposta da agência)

- **Como é feito:** Cinco eventos, um de cada origem (Immobiliare, rede social, placa, vitrine, proposta da agência).
- **Resultado esperado:** Cada cartão mostra a sigla respectiva: IM, S, C, V e P.
- **Risco que cobre:** A origem diz de onde veio o compromisso e como cobrar o resultado.

### T203 — Arrastar evento para outro dia

- **Como é feito:** Arrastar um evento de 10:00 a 11:30 para o dia seguinte; o calendário informa o novo início e fim.
- **Resultado esperado:** O novo início e o novo fim informados são enviados ao servidor (com os 90 minutos de duração) e o calendário recarrega com aviso de sucesso.
- **Risco que cobre:** Enviar só o início, ou um fim errado, encolhe ou estica o compromisso.

### T204 — Arrastar evento e o servidor recusa

- **Como é feito:** Arrastar um evento para outro dia e o servidor recusa a mudança.
- **Resultado esperado:** Aparece a mensagem de erro e o evento volta ao lugar original no calendário.
- **Risco que cobre:** Calendário mostrando um horário que o servidor não tem leva a visitas perdidas.

### T205 — Redimensionar evento para estender o horário

- **Como é feito:** Esticar a borda de um evento de 10:00–11:00 até 12:00.
- **Resultado esperado:** O novo horário de fim (12:00) é enviado e o evento passa a mostrar 10:00–12:00.
- **Risco que cobre:** Ajustar a duração é o gesto mais frequente do corretor.

### T206 — Filtros da agenda (tipo, só ligações, busca e usuários visíveis) lembrados

- **Como é feito:** Na agenda, escolher o tipo 'visita', ligar 'só ligações' (que prevalece sobre o tipo), digitar uma busca e escolher dois usuários visíveis; recarregar a página.
- **Resultado esperado:** Os usuários visíveis escolhidos continuam os mesmos depois de recarregar; sem escolha salva, aparece apenas o usuário logado. 'Só ligações' mostra apenas ligações agendadas e realizadas.
- **Risco que cobre:** Perder a escolha de agendas a cada acesso obriga a remontar a visão da equipe todo dia.

### T207 — Adicionar e remover participantes antes de salvar

- **Como é feito:** Adicionar três participantes e remover o segundo antes de salvar.
- **Resultado esperado:** A lista mostra dois participantes; ao salvar, só esses dois são enviados.
- **Risco que cobre:** Participante removido que recebe convite é falha grave com o cliente.

### T208 — Adicionar imóvel ao evento

- **Como é feito:** Adicionar o imóvel AP-12 e o AP-15 a um evento e remover o AP-12.
- **Resultado esperado:** Aparecem código e título dos imóveis; após remover, só o AP-15 fica.
- **Risco que cobre:** Imóvel errado numa visita manda o cliente ao endereço errado.

### T209 — Registrar resultados do evento (ex.: cliente gostou)

- **Como é feito:** Registrar três resultados no evento ('gostou', 'quer revisitar', 'proposta futura') e remover o segundo.
- **Resultado esperado:** Ficam o primeiro e o terceiro, na mesma ordem.
- **Risco que cobre:** Remover pela posição errada apaga o resultado errado.

### T210 — Anexar arquivo a evento ainda não salvo

- **Como é feito:** Escolher um arquivo para um evento novo e: (a) salvar o evento; (b) em outra tentativa, cancelar.
- **Resultado esperado:** (a) O arquivo é enviado junto ao salvar. (b) Nenhum arquivo é enviado.
- **Risco que cobre:** Arquivo enviado sem o evento salvo vira lixo na base.

### T211 — Fechar o formulário e abrir um novo

- **Como é feito:** Preencher um evento com participantes, imóveis, resultados e anexo; fechar sem salvar; abrir um evento novo.
- **Resultado esperado:** O novo formulário está totalmente limpo.
- **Risco que cobre:** Dados do evento anterior vazando para o novo causam vínculos errados.

### T212 — Excluir evento

- **Como é feito:** Abrir um evento existente no calendário e clicar em excluir.
- **Resultado esperado:** Pede confirmação; ao confirmar, o evento some do calendário.
- **Risco que cobre:** Exclusão sem confirmação em agenda compartilhada é perda de compromisso.

### T213 — Painel "compromissos de hoje"

- **Como é feito:** Eventos em três dias diferentes, com três horários distintos no dia de hoje cadastrados fora de ordem.
- **Resultado esperado:** O painel 'compromissos de hoje' mostra só os de hoje, em ordem de horário.
- **Risco que cobre:** Eventos de outro dia no painel de hoje enganam o corretor.

### T214 — Evento sem situação de confirmação, lembrete e repetição

- **Como é feito:** Preencher o evento deixando em branco situação de confirmação, lembrete e repetição.
- **Resultado esperado:** Três avisos de obrigatório, um em cada campo.
- **Risco que cobre:** Evento sem esses campos fica em estado indefinido.

## 9. Marketing e comunicação

_Modelos de mensagem, grupos de destinatários, campanhas e descadastro._

### T215 — Modelo sem nome, sem canal ou sem categoria

- **Como é feito:** Nova mensagem-modelo sem nome, sem canal e sem categoria; corpo preenchido.
- **Resultado esperado:** Três avisos distintos, um por campo.
- **Risco que cobre:** Modelo sem categoria não aparece nas telas de envio.

### T216 — Modelo de e-mail sem assunto e com assunto só de espaços

- **Como é feito:** Modelo de e-mail sem assunto; depois com assunto composto só de espaços.
- **Resultado esperado:** Nos dois casos, aviso de assunto obrigatório para e-mail.
- **Risco que cobre:** E-mail sem assunto tem alta chance de ir para o lixo eletrônico.

### T217 — Modelo de WhatsApp sem assunto

- **Como é feito:** Modelo do canal WhatsApp com corpo preenchido e assunto vazio.
- **Resultado esperado:** Aceito sem exigir assunto.
- **Risco que cobre:** WhatsApp não usa assunto; exigi-lo bloquearia o canal inteiro.

### T218 — Corpo vazio, só espaços e só marcas de formatação ("<p></p>")

- **Como é feito:** Corpo do modelo: vazio; só espaços; só marcas de formatação '<p></p>'.
- **Resultado esperado:** Os três recusados com aviso de corpo obrigatório.
- **Risco que cobre:** Mensagem sem texto visível seria enviada em branco aos clientes.

### T219 — Corpo com texto dentro de formatação

- **Como é feito:** Corpo do modelo '<p>Olá <b>Maria</b></p>' (texto com formatação).
- **Resultado esperado:** Aceito.
- **Risco que cobre:** A regra de corpo vazio não pode barrar texto que tem marcas de formatação.

### T220 — Editar modelo e salvar sem mudanças

- **Como é feito:** Abrir um modelo existente e clicar em salvar sem mudar nada.
- **Resultado esperado:** Salva sem erro e o conteúdo permanece igual.
- **Risco que cobre:** Salvar sem alterar não pode corromper o modelo.

### T221 — Excluir modelo em uso por campanha

- **Como é feito:** Excluir um modelo usado por campanha e o servidor recusa.
- **Resultado esperado:** A mensagem do servidor aparece e o modelo permanece na lista.
- **Risco que cobre:** Excluir modelo em uso apaga o histórico de envios.

### T222 — Montar grupo de destinatários filtrando por rua "via roma"

- **Como é feito:** Grupo com filtro de rua 'via roma'; candidatos com ruas 'Via Roma', 'VIA ROMA 12', 'Via Nàpoli'.
- **Resultado esperado:** Entram os dois primeiros e o terceiro fica de fora.
- **Risco que cobre:** Rua escrita de formas diferentes é a regra, não a exceção.

### T223 — Filtro de rua em branco

- **Como é feito:** Grupo com filtro de rua em branco e 10 candidatos com ruas variadas.
- **Resultado esperado:** Os 10 passam pelo filtro.
- **Risco que cobre:** Filtro vazio não pode eliminar ninguém.

### T224 — Candidato sem e-mail em campanha de e-mail

- **Como é feito:** Campanha por e-mail com 3 candidatos, um deles sem e-mail.
- **Resultado esperado:** O candidato sem e-mail é contado como 'sem contato' e fica de fora; os outros dois são elegíveis.
- **Risco que cobre:** Contar quem não tem e-mail como destinatário infla o resultado da campanha.

### T225 — Candidato sem telefone em campanha de WhatsApp

- **Como é feito:** Campanha por WhatsApp com 3 candidatos, um deles sem telefone.
- **Resultado esperado:** O candidato sem telefone é contado como 'sem contato' e fica de fora.
- **Risco que cobre:** O mesmo cuidado para o outro canal.

### T226 — E-mail descadastrado com maiúsculas e espaços (" Ana@X.com ")

- **Como é feito:** Lista de descadastro com ' Ana@X.com ' (maiúsculas e espaços); candidato com 'ana@x.com'.
- **Resultado esperado:** O candidato é reconhecido como descadastrado e fica de fora.
- **Risco que cobre:** Enviar a quem pediu para sair é infração às regras de privacidade.

### T227 — Telefone descadastrado escrito "+39 081-123 4567" e o do candidato "390811234567"

- **Como é feito:** Descadastro com '+39 081-123 4567'; candidato com telefone '390811234567'.
- **Resultado esperado:** Reconhecidos como o mesmo número; candidato fica de fora.
- **Risco que cobre:** Máscaras diferentes escondem a mesma pessoa.

### T228 — Candidato com e-mail liberado mas telefone descadastrado, campanha por e-mail

- **Como é feito:** Candidato com e-mail liberado, mas telefone na lista de descadastro; campanha por e-mail.
- **Resultado esperado:** Fica de fora como descadastrado.
- **Risco que cobre:** Basta um contato na lista para proteger a pessoa.

### T229 — Grupo de 1000 candidatos

- **Como é feito:** Grupo de 1.000 candidatos: parte elegível, parte sem contato, parte descadastrada.
- **Resultado esperado:** Elegíveis + sem contato + descadastrados = exatamente 1.000.
- **Risco que cobre:** Soma que não fecha indica candidatos perdidos.

### T230 — Grupo sem nenhum elegível

- **Como é feito:** Grupo em que todos os candidatos estão descadastrados.
- **Resultado esperado:** O botão de enviar fica desativado e há explicação do motivo.
- **Risco que cobre:** Evita criar campanha para ninguém.

### T231 — Enviar campanha com sucesso

- **Como é feito:** Enviar uma campanha para 50 elegíveis, com o servidor aceitando.
- **Resultado esperado:** Aparece aviso de sucesso e a campanha entra no histórico com 50 destinatários.
- **Risco que cobre:** Envio sem registro perde a rastreabilidade.

### T232 — Enviar campanha com falha do servidor

- **Como é feito:** Enviar campanha para 50 elegíveis e o servidor falha na gravação.
- **Resultado esperado:** A mensagem do servidor aparece e nenhuma campanha entra no histórico.
- **Risco que cobre:** Histórico com campanha que não saiu engana a equipe.

### T233 — Enviar duas vezes seguidas (duplo clique)

- **Como é feito:** Campanha pronta; clicar duas vezes seguidas em Enviar.
- **Resultado esperado:** Uma só campanha é criada.
- **Risco que cobre:** Mensagem duplicada irrita os clientes e provoca descadastros.

### T234 — Enviar campanha sem modelo escolhido

- **Como é feito:** Montar o grupo e tentar enviar sem escolher o modelo de mensagem.
- **Resultado esperado:** Envio bloqueado com aviso pedindo o modelo.
- **Risco que cobre:** Campanha sem mensagem não tem sentido.

### T235 — Histórico de campanhas com 30 itens

- **Como é feito:** Histórico com 30 campanhas de datas diferentes.
- **Resultado esperado:** 3 páginas de 10; a campanha mais recente é a primeira da primeira página.
- **Risco que cobre:** Ordem invertida esconde o que acabou de ser enviado.

### T236 — Grupo filtrado por duas ruas ("via roma" e "corso umberto")

- **Como é feito:** Grupo com duas ruas no filtro ('via roma' e 'corso umberto') e três candidatos: um de cada rua e um de outra.
- **Resultado esperado:** Entram os dois das ruas filtradas; o terceiro fica de fora.
- **Risco que cobre:** Exigir as duas ruas ao mesmo tempo esvaziaria todo grupo.

## 10. Administração

_Usuários, filiais, categorias, zonas e bairros, vídeo da página inicial, auditoria e proprietários._

### T237 — Usuário com senha "abc12345" (sem maiúscula e símbolo)

- **Como é feito:** Criar usuário com senha 'abc12345'; depois com 'Abc12345!'.
- **Resultado esperado:** A primeira é recusada (falta maiúscula e símbolo); a segunda é aceita.
- **Risco que cobre:** Senha fraca na base é risco de segurança.

### T238 — Usuário com senha de 7 e de 8 caracteres fortes

- **Como é feito:** Criar usuário com senha forte de 7 caracteres ('Ab1!xyz') e outro com 8 ('Ab1!xyzw').
- **Resultado esperado:** A de 7 é recusada; a de 8 é aceita.
- **Risco que cobre:** O limite exato de tamanho concentra erros de 'um a mais'.

### T239 — Novo usuário sem senha

- **Como é feito:** Novo usuário com tudo preenchido, menos a senha.
- **Resultado esperado:** Aviso 'senha obrigatória'; nada é enviado.
- **Risco que cobre:** Usuário novo sem senha não consegue entrar.

### T240 — Editar usuário deixando a senha em branco

- **Como é feito:** Editar um usuário existente trocando o nome e deixando o campo de senha vazio.
- **Resultado esperado:** Aceito: a senha atual é mantida e só o nome muda.
- **Risco que cobre:** Exigir senha em toda edição obrigaria trocar a senha a cada alteração.

### T241 — Editar usuário digitando senha fraca

- **Como é feito:** Editar usuário digitando a senha fraca 'abc' no campo de senha.
- **Resultado esperado:** Recusada com aviso, mesmo sendo campo opcional.
- **Risco que cobre:** Opcional não significa aceitar senha fraca.

### T242 — Usuário com nome de 1 letra e e-mail inválido

- **Como é feito:** Novo usuário com nome 'A' e e-mail 'x'.
- **Resultado esperado:** Dois avisos separados, um em cada campo.
- **Risco que cobre:** Dois erros devem ser vistos juntos.

### T243 — Usuário sem nível de acesso

- **Como é feito:** Novo usuário com tudo preenchido, menos o nível de acesso.
- **Resultado esperado:** Aviso 'nível obrigatório'.
- **Risco que cobre:** Sem nível não se sabe o que a pessoa pode ver ou fazer.

### T244 — Criar usuário com e-mail já existente

- **Como é feito:** Criar usuário com e-mail já cadastrado e o servidor recusa.
- **Resultado esperado:** A mensagem do servidor (e-mail já em uso) aparece.
- **Risco que cobre:** Mensagem genérica não diz o que corrigir.

### T245 — Usuário desativado

- **Como é feito:** Desativar um usuário na administração; depois tentar entrar com ele, com o servidor recusando a entrada.
- **Resultado esperado:** A lista mostra o usuário como inativo; no login aparece a mensagem de recusa do servidor e nada fica gravado.
- **Risco que cobre:** Mostrar o usuário como ativo depois de desativar leva a achar que o acesso foi cortado quando não foi.

### T246 — Foto do usuário

- **Como é feito:** Enviar a foto de usuário válida; depois um arquivo com conteúdo diferente do tipo.
- **Resultado esperado:** A válida é aceita; a outra é recusada.
- **Risco que cobre:** A foto aparece em todo o sistema.

### T247 — Filial: nome de 1 letra, 2 letras, vazio

- **Como é feito:** Cadastro de filial: nome vazio; depois 'A'; depois 'Ab'.
- **Resultado esperado:** Vazio e 'A': recusados. 'Ab': aceito.
- **Risco que cobre:** Filial sem nome não aparece nas listas de escolha.

### T248 — Excluir filial com usuários vinculados

- **Como é feito:** Excluir uma filial que tem usuários vinculados e o servidor recusa.
- **Resultado esperado:** A mensagem do servidor aparece e a filial continua na lista.
- **Risco que cobre:** Excluir filial deixaria usuários sem filial.

### T249 — Categoria com identificador "Casa Nova", "casa-nova" e "casa_nova!"

- **Como é feito:** Identificador de categoria 'Casa Nova', 'casa-nova', 'casa_nova!' e 'a'.
- **Resultado esperado:** Só 'casa-nova' (minúsculas, números e hífen entre palavras, 2 ou mais caracteres) é aceito; os outros recebem aviso.
- **Risco que cobre:** Identificador inválido quebra o endereço da categoria no site.

### T250 — Ordem de exibição da categoria: -1, 1,5, 'abc', 32768, 0 e 32767

- **Como é feito:** Salvar categorias com cada um desses valores de ordem.
- **Resultado esperado:** -1, 1,5, 'abc' e 32768 são recusados com aviso informando o máximo de 32767; 0 e 32767 são aceitos.
- **Risco que cobre:** Ordem fora do limite do servidor faria a gravação falhar sem explicação.

### T251 — Cada tipo de categoria (residencial, comercial, industrial, terreno, anexo, canteiro)

- **Como é feito:** Abrir a lista de tipo de categoria, em italiano e em português.
- **Resultado esperado:** Residencial, comercial, industrial, terreno, anexo e canteiro de obras, com rótulos corretos.
- **Risco que cobre:** O tipo define quais campos o cadastro de imóvel mostra.

### T252 — Zona com nome de 120 e 121 caracteres

- **Como é feito:** Zona com nome de 120 caracteres e outra com 121.
- **Resultado esperado:** 120 é aceito; 121 é recusado com aviso de tamanho máximo.
- **Risco que cobre:** O limite exato de tamanho concentra erros de 'um a mais'.

### T253 — Zona sem cidade ou cidade de 1 letra

- **Como é feito:** Zona com nome válido e cidade vazia; depois com cidade 'A'.
- **Resultado esperado:** Ambas recusadas com aviso de cidade (obrigatória e mínimo de 2 letras).
- **Risco que cobre:** Zona sem cidade não pode ser usada no cadastro de imóveis.

### T254 — Bairro sem escolher zona

- **Como é feito:** Bairro com nome válido, sem escolher a zona.
- **Resultado esperado:** Aviso 'zona obrigatória'.
- **Risco que cobre:** Bairro solto não aparece nos filtros por região.

### T255 — Painel de bairros da zona

- **Como é feito:** Abrir a zona A (3 bairros) e depois a zona B (1 bairro).
- **Resultado esperado:** O painel mostra só os bairros da zona escolhida a cada vez.
- **Risco que cobre:** Bairros de outra zona confundem o cadastro.

### T256 — Trilha de auditoria: 15 por página

- **Como é feito:** Trilha de auditoria com 40 registros.
- **Resultado esperado:** Páginas de 15 itens; a terceira mostra 10.
- **Risco que cobre:** Paginação diferente da combinada esconde registros.

### T257 — Auditoria: nome de quem fez cada ação

- **Como é feito:** Auditoria com 5 registros feitos por 2 usuários diferentes.
- **Resultado esperado:** Cada linha mostra o nome do usuário (não o código) e, sem registros, aparece a mensagem de vazio.
- **Risco que cobre:** Auditoria com códigos no lugar de nomes não ajuda a investigar nada.

### T258 — Vídeo da home: publicar vídeo novo

- **Como é feito:** Na tela do vídeo da página inicial, escolher um arquivo MP4 válido e clicar em publicar.
- **Resultado esperado:** Aparece a pré-visualização do arquivo, depois o aviso 'publicado com sucesso' e o texto passa a dizer que o vídeo atual é o personalizado.
- **Risco que cobre:** Vídeo que não troca deixa o site com conteúdo antigo.

### T259 — Vídeo da home: restaurar o padrão

- **Como é feito:** Com um vídeo personalizado publicado, clicar em restaurar o padrão.
- **Resultado esperado:** Pede confirmação; depois a tela mostra que o padrão está em uso.
- **Risco que cobre:** Restaurar sem confirmar apaga o vídeo personalizado.

### T260 — Vídeo da página inicial fora das regras (formato, tamanho e duração)

- **Como é feito:** Escolher: um arquivo que não é MP4; um MP4 de 41 MB; um MP4 de 61 segundos; e um MP4 de 40 MB e 60 segundos.
- **Resultado esperado:** Os três primeiros são recusados cada um com a sua mensagem (formato, tamanho, duração) e nada é publicado; o último é aceito.
- **Risco que cobre:** Os limites exatos (40 MB, 60 s) são onde a regra costuma falhar por um.

### T261 — Proprietários: gerar o código de acesso

- **Como é feito:** Abrir um proprietário e gerar o código de acesso (PIN).
- **Resultado esperado:** A janela mostra o PIN com o aviso 'anote agora: não será mais exibido' e só fecha pelo botão 'anotei, fechar'; reabrindo o cadastro, o PIN não aparece mais.
- **Risco que cobre:** O PIN é a chave do proprietário; exibir de novo ou não exibir nunca deixa o acesso insustentável.

### T262 — Zona com nome "  Posillipo  " e com nome "  a  "

- **Como é feito:** Zona '  Posillipo  ' e zona '  a  '.
- **Resultado esperado:** A primeira é salva como 'Posillipo'; a segunda é recusada por ter 1 letra.
- **Risco que cobre:** Espaços escondem nomes iguais e enganam o mínimo de letras.

### T263 — Bairro com nome de 120 e de 121 caracteres

- **Como é feito:** Bairro com nome de 120 e de 121 caracteres.
- **Resultado esperado:** 120 aceito; 121 recusado com aviso de tamanho.
- **Risco que cobre:** Mesmo limite da zona, aplicado ao bairro.

## 11. Painel inicial, estatísticas e notificações

_Números que a gerência lê para decidir._

### T264 — Painel sem nenhum dado

- **Como é feito:** Painel com todos os cartões sem dados.
- **Resultado esperado:** Cartões mostram zero ou 'sem dados'; nenhum 'NaN' ou gráfico quebrado.
- **Risco que cobre:** É o primeiro painel de cada cliente novo.

### T265 — Imóveis parados e cadastros incompletos

- **Como é feito:** Imóveis parados e imóveis com cadastro incompleto.
- **Resultado esperado:** Só entram os que cumprem a regra; abrir o item leva à ficha certa.
- **Risco que cobre:** Lista errada gera trabalho sobre imóveis que não precisam.

### T266 — Mudar a janela de tempo (7, 30, 90 dias)

- **Como é feito:** No painel, trocar a janela de tempo de 7 para 30 e para 90 dias.
- **Resultado esperado:** Todos os cartões atualizam juntos para a janela escolhida.
- **Risco que cobre:** Cartões com janelas diferentes comparam coisas incomparáveis.

### T267 — Cartões escolhidos para o painel e prazo de imóveis parados

- **Como é feito:** Painel sem escolha salva; depois escolher 2 cartões; depois deixar guardado um valor inválido e um cartão inexistente; por fim guardar 90 dias para imóveis parados.
- **Resultado esperado:** Sem escolha: aparecem os 4 cartões padrão. Com escolha: ficam os 2 escolhidos após recarregar. Valor inválido: volta aos 4 padrão. Cartão inexistente: é ignorado. Prazo de parados: 90 dias (padrão 180).
- **Risco que cobre:** Perder a organização do painel a cada acesso, ou quebrar com dado antigo guardado, desmotiva o uso.

### T268 — Servidor falha em um dos cartões

- **Como é feito:** Um dos cartões do painel falha ao carregar (erro do servidor); os demais respondem.
- **Resultado esperado:** Só aquele cartão mostra erro; os demais aparecem normalmente.
- **Risco que cobre:** Um erro isolado não pode derrubar o painel inteiro.

### T269 — Notificações: contador de não lidas

- **Como é feito:** Três notificações não lidas; marcar uma como lida.
- **Resultado esperado:** O sino mostra 3 e depois 2, conferindo com a lista.
- **Risco que cobre:** Contador errado leva a ignorar avisos.

### T270 — Notificação de nova solicitação ou de imóvel disponível novamente

- **Como é feito:** Uma notificação de nova solicitação e outra de imóvel disponível novamente.
- **Resultado esperado:** Cada uma mostra o seu título e, ao clicar, abre a ficha correta.
- **Risco que cobre:** Aviso que abre a ficha errada atrapalha.

### T271 — Notificação sem vínculo a nenhum registro

- **Como é feito:** Notificação sem vínculo com nenhum registro (nem solicitação, nem imóvel).
- **Resultado esperado:** Aparece na lista sem link e sem erro; clicar não leva a lugar nenhum.
- **Risco que cobre:** Nem todo aviso tem registro associado.

## 12. Site público e área do proprietário

_Vitrine para visitantes e área restrita dos donos de imóveis._

### T272 — Lista pública de imóveis filtrada por "venda"

- **Como é feito:** Lista pública filtrada por 'venda' com imóveis de venda, de locação e de 'locação ou venda'.
- **Resultado esperado:** Aparecem os de venda e os de 'locação ou venda'; os só de locação não.
- **Risco que cobre:** Filtro errado esconde imóveis ou mostra o que não está à venda.

### T273 — Filtro "locação"

- **Como é feito:** A mesma lista pública filtrada por 'locação', com imóveis de venda, de locação e de 'locação ou venda'.
- **Resultado esperado:** Aparecem locação e 'locação ou venda'; os só de venda não.
- **Risco que cobre:** Mesma regra no sentido contrário.

### T274 — Preço recebido como texto ("835000.00")

- **Como é feito:** Preços '835000.00', vazio, nulo e 'abc'.
- **Resultado esperado:** O primeiro é formatado como número; os outros não mostram 'NaN'.
- **Risco que cobre:** Preço que chega como texto é o formato real do servidor.

### T275 — Ficha pública: capa e fotos

- **Como é feito:** Ficha pública com fotos fora de ordem; outra só com capa; outra sem nada.
- **Resultado esperado:** Capa primeiro e depois pela ordem; só capa mostra a capa; sem nada mostra imagem padrão.
- **Risco que cobre:** A foto é o primeiro contato do cliente.

### T276 — Ficha pública aberta por link antigo (por número do imóvel)

- **Como é feito:** Abrir o endereço antigo de um imóvel (por número) em vez do endereço atual.
- **Resultado esperado:** O imóvel abre normalmente.
- **Risco que cobre:** Links antigos em e-mails e redes não podem quebrar.

### T277 — Ficha de imóvel que não existe ou não está publicado

- **Como é feito:** Abrir o endereço de um imóvel inexistente e depois o de um imóvel não publicado.
- **Resultado esperado:** Tela de não encontrado nos dois casos.
- **Risco que cobre:** Imóvel não publicado não pode vazar.

### T278 — Mapa: imóvel dentro e fora da região coberta

- **Como é feito:** Imóvel com coordenadas dentro e outro fora da região do mapa.
- **Resultado esperado:** Dentro: marcador na posição certa. Fora: sem marcador, só link para o mapa externo.
- **Risco que cobre:** Marcador fora do mapa fica no canto da imagem.

### T279 — Telefone da filial

- **Como é feito:** Filial com telefone com espaços e endereço sem número.
- **Resultado esperado:** Link de ligar sem espaços; endereço só com as partes existentes.
- **Risco que cobre:** Link de telefone com espaço não funciona no celular.

### T280 — Atalhos antigos de venda e aluguel

- **Como é feito:** Abrir os atalhos antigos de venda e de aluguel.
- **Resultado esperado:** Cada um redireciona para a lista de imóveis já filtrada (venda e locação).
- **Risco que cobre:** Links antigos em materiais impressos.

### T281 — Pedido de contato: nome, e-mail, telefone e mensagem mínimos

- **Como é feito:** Pedido de contato com nome 'A', e-mail 'x', telefone de 5 dígitos e mensagem de 4 caracteres.
- **Resultado esperado:** Quatro avisos, um por campo.
- **Risco que cobre:** Pedidos incompletos poluem o quadro de solicitações.

### T282 — Pedido sem aceitar os termos

- **Como é feito:** Preencher o pedido de contato com tudo válido, sem aceitar os termos.
- **Resultado esperado:** Recusado com aviso de aceitar os termos.
- **Risco que cobre:** Exigência de privacidade.

### T283 — Orçamento 0, negativo e "abc" em pedido de busca

- **Como é feito:** Pedido de busca com orçamento 0, -5 e 'abc'; depois pedido de avaliação com orçamento inválido.
- **Resultado esperado:** Os de busca são recusados; no de avaliação o orçamento é ignorado.
- **Risco que cobre:** Orçamento só importa para quem procura imóvel.

### T284 — Pedido de contato enviado com sucesso

- **Como é feito:** Preencher e enviar um pedido de contato válido, com o servidor aceitando.
- **Resultado esperado:** Mensagem de agradecimento e formulário limpo.
- **Risco que cobre:** Formulário não limpo gera pedidos duplicados.

### T285 — Pedido com falha do servidor

- **Como é feito:** Enviar o pedido e o servidor falha.
- **Resultado esperado:** Mensagem de erro e os dados digitados permanecem para nova tentativa.
- **Risco que cobre:** Perder a mensagem digitada afasta o cliente.

### T286 — Pedido de contato com a verificação contra robôs ausente

- **Como é feito:** A verificação não carrega; preencher o pedido com tudo válido e enviar; o servidor recusa por falta de verificação.
- **Resultado esperado:** A mensagem do servidor aparece e os dados digitados continuam no formulário.
- **Risco que cobre:** Pedido recusado sem explicação faz o cliente desistir; perder o texto digitado é pior.

### T287 — Acesso do proprietário (e-mail e PIN)

- **Como é feito:** Tentar entrar com e-mail vazio; depois com PIN vazio; depois com ambos errados (servidor recusa); depois com os corretos.
- **Resultado esperado:** Campos vazios: aviso de preenchimento obrigatório sem consultar o servidor. Errados: um único aviso de credenciais inválidas. Corretos: o acesso fica guardado separado do acesso do sistema interno e a pessoa vai para a área do proprietário.
- **Risco que cobre:** Mensagens diferentes para 'e-mail certo, PIN errado' ajudam a descobrir e-mails cadastrados; misturar acessos exporia a agência inteira.

## 13. Regras transversais

_Comportamentos que valem para o sistema inteiro._

### T288 — Valores em euro

- **Como é feito:** Valores 0,5; 1234,5; 1000000 e ausente em telas diferentes.
- **Resultado esperado:** Aparecem '0,50 €', '1234,50 €' e '1.000.000,00 €' (euro depois do número, vírgula nos centavos, ponto de milhar só a partir de 5 dígitos); o ausente vira traço.
- **Risco que cobre:** Formato monetário consistente em todo o sistema, exatamente como o navegador italiano o escreve.

### T289 — Datas puras e datas com hora

- **Como é feito:** Datas '2026-03-05' e '2026-03-05T00:00:00.000Z' em telas diferentes.
- **Resultado esperado:** As duas aparecem como 05/03/2026.
- **Risco que cobre:** O servidor devolve os dois formatos.

### T290 — Data e hora exibidas

- **Como é feito:** Data e hora de um registro com o computador configurado em outro fuso.
- **Resultado esperado:** Sempre exibida no horário da Itália.
- **Risco que cobre:** A agência opera na Itália.

### T291 — Texto de busca com "%", "_" e "\"

- **Como é feito:** Buscar '%', '_' e '\' em listas diferentes.
- **Resultado esperado:** Tratados como texto literal; a busca não devolve toda a base.
- **Risco que cobre:** Curingas viram busca da base inteira.

### T292 — Texto com HTML malicioso digitado em campos livres

- **Como é feito:** Digitar '<script>alert(1)</script>' em campos livres e ver o registro salvo.
- **Resultado esperado:** Aparece como texto, sem executar nada.
- **Risco que cobre:** Execução de código digitado é falha grave de segurança.

### T293 — Idioma salvo

- **Como é feito:** Escolher português, recarregar a página e visitar várias telas.
- **Resultado esperado:** Todas as telas aparecem em português.
- **Risco que cobre:** O idioma é guardado no navegador.

### T294 — Falta de tradução em um idioma

- **Como é feito:** Texto que só existe em italiano, com o idioma em português.
- **Resultado esperado:** Aparece em italiano, nunca como 'chave.tecnica'.
- **Risco que cobre:** Chave técnica na tela parece erro.

### T295 — Mensagem de erro do servidor com vários detalhes por campo

- **Como é feito:** O servidor devolve erro com mensagens por campo.
- **Resultado esperado:** Mostra as mensagens reais de cada campo.
- **Risco que cobre:** Mensagem genérica esconde o que corrigir.

### T296 — Servidor devolve erro sem mensagem

- **Como é feito:** O servidor devolve erro sem nenhuma mensagem.
- **Resultado esperado:** Mostra a mensagem padrão do módulo.
- **Risco que cobre:** Mensagem vazia deixa o usuário sem explicação.

### T297 — Erros 4xx em consultas de leitura

- **Como é feito:** Consulta de leitura com erro 404; outra com erro de rede.
- **Resultado esperado:** 404: sem repetição, erro na hora. Rede: até 3 novas tentativas.
- **Risco que cobre:** Repetir 'não encontrado' só atrasa a resposta.

### T298 — Confirmação de exclusão em qualquer lista

- **Como é feito:** Em qualquer lista, abrir a confirmação de exclusão e clicar em cancelar.
- **Resultado esperado:** A janela fecha e nada é excluído.
- **Risco que cobre:** Cancelar tem que cancelar de verdade.

### T299 — Telas em celular (largura < 1024px)

- **Como é feito:** Abrir o login e um formulário com largura de 800 pixels.
- **Resultado esperado:** A versão móvel aparece e nenhum campo fica cortado.
- **Risco que cobre:** Corretores usam celular em visitas.

### T300 — Quebra de linha e espaços extras em nomes

- **Como é feito:** Cadastrar uma pessoa com nome '  Maria   Rossi  '.
- **Resultado esperado:** Os espaços das pontas são removidos antes de salvar.
- **Risco que cobre:** Espaços nas pontas atrapalham buscas e duplicam pessoas.

## Resultado da revisão

Cada teste foi lido de novo e comparado com o que o sistema faz de verdade. Dos 300: **256 ficaram como estavam**, **29 foram corrigidos ou aprofundados** e **15 foram trocados** por testes de regras reais que não estavam cobertas.

### O que estava errado e foi corrigido

- **Formato de números e euro:** no formato italiano o euro vai depois do número ("0,50 €") e números de 4 dígitos não levam ponto de milhar ("1000", mas "10.000"). Os testes de faixas, vendas e valores foram corrigidos.
- **Cruzamento de solicitações e imóveis:** quem decide a compatibilidade é o servidor; a tela só exibe o resultado. O teste passou a verificar a exibição, não uma regra que a tela não executa.
- **Bairros da solicitação:** o que existe é a sincronização ao salvar (remove os desmarcados, cria os novos, mantém os que ficam), não a limpeza ao trocar de cidade.
- **Repetição de eventos:** a tela guarda a repetição escolhida; quem gera as ocorrências é o servidor. O teste verifica o valor guardado.
- **Cor dos eventos:** a cor segue a situação da confirmação (cinza, verde, vermelho) ou a cor escolhida, não o tipo do evento.
- **Auditoria:** não tem filtros por ação ou entidade; o teste passou a verificar a exibição do nome de quem agiu e a paginação de 15.
- **Vídeo da página inicial:** regras reais são só MP4, 40 MB e 60 segundos; os testes usam esses limites exatos.
- **Código do proprietário:** o aviso real é "anote agora, não será mais exibido"; o teste cobre isso.
- **Acesso do proprietário:** a tela real pede e-mail e código e mostra uma única mensagem de erro.
- **Verificação contra robôs:** a tela não bloqueia o envio; o servidor decide. O teste verifica o aviso do servidor e a preservação dos dados.
- **Cartões do painel:** o que persiste é a escolha de cartões (padrão de 4) e o prazo de imóveis parados (padrão 180 dias), com tolerância a dado guardado inválido.
- **Transferência de corretor:** só o administrador vê a ação.

### O que foi retirado por não ser sustentável

- Testes que verificariam comportamento de bibliotecas externas e não do sistema (visões do calendário, editor visual de e-mail, tour guiado, tecla Enter, mudança de horário de verão).
- Testes de resultados que eu não consegui confirmar no sistema (vencimentos de locação por faixa de dias, exportação, relatórios de entrega de campanha, soma dos cartões do painel, período invertido nas estatísticas, remoção de descadastro, texto de busca com caracteres raros).

### O que entrou no lugar

Quinze testes das regras reais de vendas e locações (datas de escritura e término, comissão acima do valor, comprador igual a vendedor, cancelamento sem motivo, parcelas, número de contrato duplicado, imóvel já vendido, dia de vencimento de 1 a 31, aviso prévio, campos obrigatórios e situações).

### Testes que podem revelar falhas reais no sistema

Estes foram escritos para forçar um comportamento que hoje pode não existir:

- **Duplo clique em "Converter em venda":** a conversão não tem proteção contra clique repetido; o teste pode mostrar duas vendas criadas.
- **Arrastar evento de dia inteiro (sem hora de fim):** o calendário ignora a mudança quando o evento não tem hora de fim; confirmar se isso é desejado.
- **Envio de 20 fotos com uma falha:** parte das fotos pode ter sido gravada antes do erro; o teste confere se a tela avisa a falha.
- **Valor "0" nos critérios da solicitação:** deve ser tratado como informado (não vazio); vale conferir na prática.

### Grau de certeza

- **Alto:** regras de formulário, formatação, acesso e sessão, filtros de lista e grupos de marketing (lidos no código).
- **Médio (confirmar na tela ao escrever o teste):** exibição de ficha pública, painel, galeria de fotos, envio de campanhas e detalhes visuais.

### Ordem sugerida de implementação

1. Regras de formulário (pessoas, solicitações, imóveis, propostas, vendas, locações, agenda, administração).
2. Acesso e sessão e formatações.
3. Telas com servidor simulado: listas, exclusão, paginação, arrastar.
4. Site público e área do proprietário.
