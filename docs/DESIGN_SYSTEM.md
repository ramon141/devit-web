# Devit — Design System (extraído de https://www.devit.it/site/)

> Site roda em WordPress com tema **Houzez** (v2.8.6.1, tema para agências imobiliárias).
> Dados verificados **ao vivo no navegador** (Playwright: screenshot real + `getComputedStyle` + amostragem de pixel), não só por leitura estática de CSS. Cores e fontes abaixo são as regras que o site realmente renderiza — inclusive overrides via customizer que não batem com o CSS padrão do tema.

---

## 1. Logos

Ficam em `src/assets/logos/`.

| Arquivo | Origem | Tamanho | Uso |
|---|---|---|---|
| `devit-logo.png` | `devitlogo-400x30072dpi.png` | 382×148px (renderizado em 150×58) | Logo principal, header desktop. Fundo transparente. |
| `devit-logo-mobile.png` | `devitlogo-150.png` | 150×58px | Logo do menu mobile (mesma arte, versão já otimizada pro tamanho pequeno). |
| `devit-favicon.png` | `favicon.png` | 46×46px | Favicon / ícone de aba do navegador. |

Recomendação de uso: `devit-logo.png` em qualquer header/nav com largura ≥150px; `devit-logo-mobile.png` só se precisar de asset já pré-otimizado pra menu mobile (na prática dá pra usar só o principal com CSS `width`).

---

## 2. Paleta de cores

Ficam listadas por função real de uso no CSS do tema (não são só cores "que aparecem", são as que o tema usa para elementos de UI).

### Cores de marca

Verificado ao vivo (Playwright, `getComputedStyle` nos elementos reais renderizados): o site tem um CSS customizado injetado por cima do tema Houzez padrão, que troca a cor de destaque original do tema (azul) por **amarelo**. É esse amarelo customizado — não o CSS padrão do tema — que é a cor de sistema real.

| Cor | Hex | Origem / Uso |
|---|---|---|
| 🟡 **Amarelo (cor primária do sistema)** | `#e7cc27` | Confirmado via `getComputedStyle` ao vivo: `.btn-primary`, `.btn-secondary`, links (`a`), badge "ESCLUSIVA" (`.label-featured`), bordas/estados ativos, ícones de slider. É a cor que o customizer do site define como primária — usar como principal em qualquer novo projeto. |
| 🟡 Amarelo (logo, variante) | `#fecc13` | Extraído por pixel do `devit-logo.png` (382×148, cor sólida dominante). Tom bem próximo do primário `#e7cc27` mas não idêntico — é a cor de impressão/arte do logo, não a cor de UI. Guardar como referência de logo, usar `#e7cc27` pra componentes de interface. |

### Cores de apoio (header/footer)

| Cor | Hex | Origem / Uso |
|---|---|---|
| Azul-marinho | `#004274` | Confirmado via CSS customizer (`.header-v1`): fundo do header em estado sólido (não transparente sobre hero). |
| Azul (acento pontual) | `#00aeff` | Confirmado via CSS customizer: cor do link do menu **apenas no hover**, dentro do header navy (`.header-v1 a.nav-link:hover`). Uso bem específico — não é cor de botão nem de link geral. |
| Cinza-azulado escuro (footer) | `#303c41` | Amostrado por pixel direto do screenshot renderizado — é o fundo real do rodapé (o CSS não expõe isso via `background-color` porque é aplicado por um wrapper com efeito de camada; a cor visual efetiva é essa). |
| Cinza neutro (botão utilitário) | `#676767` | Amostrado por pixel do botão "Ricerca" (busca) — botão utilitário neutro, não usa a cor primária. |

### Cores neutras

| Cor | Hex | Uso |
|---|---|---|
| Branco | `#ffffff` | Fundo padrão, texto sobre fundo escuro. |
| Preto | `#000000` | Texto de maior contraste, raros casos. |
| Cinza texto escuro | `#222222` | Texto de corpo, labels sobre fundo claro. |
| Cinza médio | `#555555` | Texto secundário (ex: disclaimers). |
| Cinza claro (borda) | `#dce0e0` | Bordas de inputs, cards, divisórias. |
| Cinza claro (texto apagado) | `#a1a7a8` | Texto desabilitado / placeholder / labels secundárias. |
| Cinza off-white | `#f8f8f8` | Confirmado via `getComputedStyle`: fundo do `<body>` no site real. |
| Cinza ícone | `#ebebeb` | Ícones em estado neutro/inativo. |
| Preto translúcido (badge de status) | `rgba(0,0,0,0.65)` | Confirmado via `getComputedStyle`: fundo do badge "VENDITA"/"AFFITTO" sobre foto do card — é overlay translúcido sobre a imagem, não cor sólida. |

### Cores de sistema (feedback)

| Cor | Hex | Uso |
|---|---|---|
| Verde sucesso | `#28a745` | Estado de sucesso (padrão Bootstrap). |
| Verde sucesso (hover) | `#34ce57` | Hover do botão de sucesso. |
| Vermelho erro | `#ea3d3d` / `#dc3545` | Mensagens de erro, campos inválidos. |
| Verde WhatsApp | `#25d366` | Botão/link de contato via WhatsApp. |

> Nota: o tema também injeta a paleta **padrão do WordPress/Gutenberg** (`--wp--preset--color--*`: preto, branco, roxo vívido, laranja, âmbar, etc.) no `<body>`. São cores genéricas do editor de blocos do WP, **não fazem parte da identidade visual do Devit** — não usar como referência de marca.

---

## 3. Tipografia

Três famílias, carregadas via Google Fonts (`Raleway`, `Poppins`, `Roboto`), cada uma com um papel fixo:

| Família | Peso(s) carregado(s) | Onde é usada | Tamanho / line-height |
|---|---|---|---|
| **Poppins** | 400 | Títulos: `h1`–`h6`, `.item-title` (títulos de card de imóvel) | peso 400, sem text-transform |
| **Poppins** | 400 | Navegação: menu principal, dropdowns, botão "criar anúncio", área logada | 14px |
| **Raleway** | 100–900 (+ itálicos) | Corpo de texto (`body`) | 15px / line-height 24px |
| **Raleway** | 400/500 | Botões, inputs, select, texto de ordenação | 15px |
| **Roboto** | 300 | Barra superior (`.top-bar-wrap`) e rodapé (`.footer-wrap`) | 15px/25px (topo), 14px/25px (rodapé) |

Import (já como está no site):
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,500,600,700,800,900,100italic,200italic,300italic,400italic,500italic,600italic,700italic,800italic,900italic%7CPoppins:400%7CRoboto:300&subset=latin&display=swap">
```

Resumo de papel: **Poppins = títulos e navegação (peso de "marca")**, **Raleway = corpo/formulários (texto de leitura)**, **Roboto 300 = elementos utilitários finos (topbar/footer)**.

---

## 4. Border-radius

| Valor | Uso |
|---|---|
| `0` | Elementos "flat" (padrão de vários componentes) |
| `2px` / `3px` | Pequenos elementos (badges, tags) |
| `4px` | **Mais comum** — botões, inputs, cards |
| `5px` / `6px` | Cards maiores, blocos de conteúdo |
| `10px` | Elementos de destaque (modais, containers grandes) |
| `50%` / `100%` | Elementos circulares (avatares, ícones em círculo) |

---

## 5. Sombras

**Sem sombra no sistema.** O site original usa `box-shadow` em vários pontos (cards, dropdown, hero), mas fica de fora deste design system por decisão — não replicar. Usar borda (`#dce0e0`) ou variação de fundo pra separar blocos/elevar elemento, não sombra.

---

## 6. Layout

- Container máximo: **1210px** (`@media (min-width: 1200px) { .container { max-width: 1210px; } }`)
- Framework base: **Bootstrap** (grid, componentes de form, dropdowns) + **Font Awesome 5** (ícones) + ícones customizados `houzez-iconfont`
- Sliders/carousel: **Slick Carousel**

---

## 7. Imagens de referência (conteúdo, não UI-kit)

Ficam em `src/assets/images/`. São fotos de imóveis usadas no site — servem de referência de estilo fotográfico (imagens de propriedades reais, tratamento de cor neutro/natural, proporção 4:3 ≈ 592×444px), não são parte do design system de componentes.

| Arquivo | Uso no site |
|---|---|
| `property-sample-1.jpg` | Thumbnail de imóvel em destaque na home. |
| `property-sample-2.jpg` | Thumbnail de imóvel em destaque na home. |
| `property-detail-gallery-1.jpg` | Foto de galeria da página de detalhe de imóvel (1170×785, corte wide usado no topo da ficha). |
| `reference-screenshot-home.png` | Screenshot real da home (Playwright, viewport completo) — referência visual de como os componentes se combinam na prática: header transparente sobre hero, busca avançada, cards com badge amarela. |
| `reference-screenshot-property-detail.png` | Screenshot real da ficha de imóvel — referência de galeria, badges, box de detalhes, bloco de características. |

---

## 7.1 Catálogo de componentes

Levantado a partir das 8 telas pedidas + home. Home e ficha de imóvel foram **verificadas ao vivo** (Playwright: screenshot real + `getComputedStyle`) — badges, botões e links confirmados em amarelo (`#e7cc27`) igual à home. As demais 6 telas (affitto, vendita, richieste, chi-siamo, contatti, news, favoritos) foram levantadas por HTML/CSS estático (`curl`) — os componentes e classes existem e batem com o CSS global, mas cor/pixel não foi reconferida individualmente em cada uma (mesmo CSS compartilhado da seção 2, então a paleta vale igual).

| Componente | Classe(s) de referência | Descrição | Onde aparece |
|---|---|---|---|
| **Card de imóvel** | `.item-listing-wrap`, `.item-listing-wrap-v3.card` | Card com foto, badge amarela "ESCLUSIVA" (`.label-featured`, `#e7cc27`), badge de status translúcida (`.label-status`, `rgba(0,0,0,.65)`), preço, título (`.item-title`, fonte Poppins), localização e ícones de características. Base de qualquer grid de listagem. Confirmado ao vivo na home. | Home, `/affitto/`, `/vendita/`, `/status/vendita/`, favoritos |
| **Grid de listagem** | `.property-grids-module-v4`, wrapper 3 colunas | Grid responsivo de cards de imóvel. | `/affitto/`, `/vendita/`, favoritos |
| **Busca avançada** | `.advanced-search`, `.advanced-search-filters`, `.advanced-search-v1`, `.advanced-search-btn` | Formulário de filtro (localização, tipo, preço, quartos etc.), botão de busca em cinza neutro (`#676767`, confirmado ao vivo — não usa a cor primária). | Home, `/affitto/`, `/vendita/` |
| **Galeria de imóvel** | `.top-gallery-section`, `.lightbox-gallery`, `.lightbox-gallery-wrap` | Galeria de fotos com abertura em lightbox (Slick Carousel), ícone de visualização ativo em amarelo. Confirmado ao vivo. | Ficha de imóvel (`/property/...`) |
| **Bloco de características** | `.property-features-wrap`, `.property-section-wrap` | Lista de atributos do imóvel (m², quartos, banheiros etc.), ícones `houzez-iconfont`. | Ficha de imóvel |
| **Card do agente/corretor** | `.agent-information` | Foto, nome, telefone, e-mail do corretor responsável, link em amarelo. | Ficha de imóvel |
| **Formulário de contato (padrão)** | `.wpcf7-form` (Contact Form 7) | Campos: nome, e-mail, telefone, assunto, mensagem, checkbox de aceite. | `/contatti/` |
| **Formulário customizado (Ninja Forms)** | `.nf-form-cont`, campos `nf-field-*` | Formulário de layout livre (texto, telefone, textarea, radio) — usado quando o form padrão não serve. | `/richieste/` |
| **Modal de login/registro** | `#login_register_form`, campos `username`, `useremail`, `register_pass` | Modal global do tema (login, cadastro, "esqueci senha"), injetado em toda página, não é página própria. Header (ícone de usuário) `#004274` com hover `#00aeff`. | Global (todas as telas) |
| **Header dashboard (sem menu público)** | `.houzez-dashboard`, `houzez-header-none` | Variante de header sem navegação pública, usada em áreas logadas. | Favoritos |
| **Footer** | `.footer-wrap`, `.footer-wrap-v1` | Fundo `#303c41` (confirmado por pixel), links em amarelo `#e7cc27`, texto Roboto 300. | Global |
| **Botão primário** | `.btn-primary`, `.btn-secondary` | Fundo/borda `#e7cc27`, texto branco. Confirmado ao vivo. | Global |
| **Botão outline** | `.btn-primary-outlined`, `.btn-secondary-outlined` | Borda e texto `#e7cc27`, fundo transparente; hover preenche com `#e7cc27` e texto branco. | Global |

### Páginas sem componente próprio (reaproveitam os de cima)

`/chi-siamo/`, `/news/` e `/richieste/` usam template de page builder livre (`template-homepage`) — não têm componente estrutural exclusivo, só combinam texto/imagem/vídeo com os componentes acima (ex: vídeo institucional embutido). `/privacy-cookies/` e `/contatti/` usam `template-page`, layout de página simples de texto + form.

### Não cobertos (sem link público / exigem login)

Dashboard completo do usuário (editar perfil, "minhas propriedades", mensagens), página de 404, arquivo de agente/agência individual. Fazem parte do tema Houzez por padrão mas não achei link ativo neles.

---

## 8. Limitações desta extração

- Home verificada ao vivo via Playwright (navegador real): screenshot, `getComputedStyle` e amostragem de pixel — corrigiu cores erradas que a leitura estática de CSS tinha sugerido (ver seção 2). As outras 7 telas (afitto, vendita, ficha de imóvel, richieste, chi-siamo, contatti, news, favoritos) ainda foram levantadas só por HTML/CSS estático (`curl`), sem verificação visual ao vivo — os componentes existem e as classes batem, mas não confirmei cor/pixel em cada uma individualmente.
- Não peguei estados de hover/animação/transição em detalhe, nem breakpoints completos de responsividade.
- Dashboard logado, login/registro, 404 e página de agente individual **não foram visitados** (sem link direto encontrado / exigem login).
