# Relatório final de testes do sistema Devit

## Cobertura
- Telas testadas: 52 (todas as linhas da lista de conferência foram fechadas).
- Resultado: 31 sem problema, 21 com pelo menos um problema.
- Problemas confirmados: 27 (problemas de acessibilidade ficaram fora do escopo).
- "100%" aqui significa todas as telas e funções listadas, não todas as combinações de situações possíveis.

## Situação das correções
Todos os problemas listados abaixo foram corrigidos, exceto:
- **Editor de e-mail do Marketing em inglês:** o fornecedor do editor só libera tradução em plano pago; não há como traduzir sem contratar.
- **Venditore limitado ao dono do imóvel:** ao escolher o imóvel, o dono já vem preenchido como vendedor; a lista de vendedores continua mostrando todas as pessoas.
- **Quartos aceita 500:** agora o limite é 50 quartos e 50 banheiros.

## Não testado (com motivo)
- Envio real de campanha de e-mail: evitar mandar mensagens a clientes.
- Geração de documentos de reajuste de aluguel: alteraria contratos reais.
- Acesso com usuário comum: não há credenciais de outro perfil.
- Salvar o perfil de um usuário que não seja administrador: só administradores podem editar usuários.

## Problemas por gravidade

### Alta
1. **Valores monetários reabertos aparecem 100 vezes menores.** Imóvel, proposta e venda: um imóvel de 150.000,00 € aparece como 1.500,00 € na ficha. A lista mostra o valor certo. Quem editar o campo a partir do que vê pode gravar um preço 100 vezes menor.
2. **Etapas do cadastro do imóvel avançam sem gravar quando há dado inválido.** Nas abas Detalhes, Comercial e Industrial, o sistema muda de etapa sem aviso e nada é salvo (percentuais de 150% e -5%, faturamento mínimo maior que o máximo, andares negativos).

### Média
3. **Datas aparecem com 1 dia a menos** para quem usa fuso a oeste de Londres, como o Brasil (proposta de 18/10 aparece como 17/10; início de contrato 01/10 aparece como 30/09). Afeta propostas, vendas, locações e registros.
4. **Lista de notificações entrega as de todos os usuários.** A tela filtra, mas a fonte de dados não. Confirmado como administrador; para usuários comuns, não testei.
5. **Tentativas erradas no portal do proprietário bloqueiam o login da equipe.** 20 tentativas erradas no portal público travam o acesso ao sistema por 5 minutos para quem usa a mesma rede. Também permite travar o acesso de um proprietário específico.
6. **Excluir uma filial com usuários vinculados é permitido** e remove a filial deles sem aviso.
7. **Mapa do site público sempre vazio.** O cadastro não tem campo para definir a localização pública do imóvel: dos 51 imóveis publicados, 13 têm localização interna e nenhum tem pública.
8. **Mapa de imóveis do sistema mostra só os 10 da página atual** e, sem filtro, informa que nenhum imóvel tem coordenadas, embora 6.382 tenham.
9. **"Salva" em "Nuova vendita" não reage** quando o erro está em outra etapa (valor final ou número duplicado).
10. **Nome de bairro muito longo estica a tela de Zone** até esconder colunas e botões. Há um bairro com 100.000 caracteres no banco.
11. **Editor de e-mail do Marketing aparece em inglês.**
12. **A política de privacidade manda escrever para um e-mail "indicado em Contatti"**, mas essa página não mostra e-mail algum.
13. **Aba "Valutazione proprietà" do site continua mostrando "Prezzo max".**

### Baixa
14. Mensagens automáticas do navegador, no idioma do navegador (português), em formulários em italiano: e-mail, preço e quantidades negativas (clientes, solicitações, site público).
15. Caixa "Solo i miei" encosta no seletor de cidade nos filtros avançados de imóveis.
16. Plural errado: "1 risultati".
17. Código de imóvel duplicado só é recusado no passo 3 do cadastro.
18. Gerador de código de imóvel sugere um número de 17 dígitos e perde precisão.
19. Excluir documento, foto ou taxa do imóvel acontece sem confirmação.
20. Tela de imóvel não encontrado: erro técnico e a mesma consulta repetida 4 vezes.
21. Aviso da senha só aparece no segundo clique em "Nuovo utente"; o mesmo vale para a imagem obrigatória do banner.
22. Imóvel sem preço aparece como "0,00 €" na área do proprietário (o sistema mostra "—").
23. Horário de geração dos arquivos exportados está em UTC (cerca de 2 horas a menos que a Itália no verão).
24. Imóvel e Acquirente obrigatórios sem asterisco em "Nuova proposta"; o mesmo em vendas e locações.
25. Em "Nuova vendita", qualquer pessoa pode ser escolhida como vendedor e só no salvar surge a recusa por não ser dono do imóvel.
26. Botão "Aggiungi" de taxas do imóvel não faz nada sem escolher a frequência.
27. Quartos aceita 500 sem limite razoável. A mensagem de erro de bairro longo mostra texto técnico ("/name").

## O que funcionou bem
- Totais e listas conferem com o banco: clientes (21.413), imóveis (8.864), solicitações (167), propostas (19), vendas (20), contratos (25), usuários (16), acessos de proprietário (9), registros de auditoria, estatísticas e site público (51 imóveis, 43 venda, 8 aluguel).
- Filtros de preço, finalidade, categoria, perfil e estado conferem com o banco.
- Exportações em Excel e PDF trazem os dados esperados.
- Exclusão de categoria em uso é bloqueada com mensagem clara.
- Criar, editar e excluir funcionam em clientes, solicitações, agenda, propostas, vendas, usuários, filiais, zonas, categorias e banners, e os dados gravados conferem com o que foi digitado.
- Recuperação de senha, links inválidos, saída da conta e proteção das telas sem sessão funcionam.
- Limite de 10 MB e tipo de arquivo nos envios são respeitados.

## Dados de teste que ficaram no sistema
- Imóvel "BUGHUNT-WIZ-002".
- Venda "BUGHUNT-VEN-T1" (vendas já concluídas não podem ser excluídas pela tela).
- Acesso de proprietário "bh-portal-test@example.com", desativado.
- A filial "Agenzia di Napoli" foi recriada e reatribuída ao administrador depois do teste de exclusão.
