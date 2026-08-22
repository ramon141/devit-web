# Devit — Design System (extraído de https://www.devit.it/site/)

> Site roda em WordPress com tema **Houzez** (v2.8.6.1, tema para agências imobiliárias).
> Dados extraídos direto do HTML/CSS servido pela página (não via screenshot — não houve acesso ao navegador nesta sessão). Cores e fontes abaixo são as regras reais aplicadas no site (`styling-options.css`, `main.css`, `<style>` inline no `<head>`).

---

## 1. Logos

Ficam em `src/assets/design-system/logos/`.

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

**Correção:** a cor de marca real é o **amarelo da logo**, extraído por pixel do arquivo `devit-logo.png` (não do CSS do tema — o `#00aeff` abaixo é cor de *UI/interação* do template Houzez, não a cor da identidade visual).

| Cor | Hex | Origem / Uso |
|---|---|---|
| 🟡 **Amarelo (cor de marca — logo)** | `#fecc13` | Extraído por pixel do `devit-logo.png` (382×148, cor sólida dominante, 18549 pixels 100% opacos amostrados). Esta é a cor oficial da marca Devit. |
| 🟡 Amarelo (variante — logo mobile) | `#ffd200` | Extraído do `devit-logo-mobile.png` — pequena variação de tom por reamostragem/compressão do PNG menor, mesma família de cor. |
| 🟡 Amarelo (variante — favicon) | `#f3d200` | Extraído do `devit-favicon.png` (46×46) — idem, variação por reamostragem em tamanho pequeno. |

Use `#fecc13` como hex de referência oficial (vem do asset de maior resolução, menos sujeito a artefato de compressão/reamostragem).

### Cores de UI do template (Houzez) — não são a cor de marca

Essas cores vêm do tema WordPress/Houzez usado no site (CSS de botões, links, hover) e **não da logo**. Mantidas aqui só como referência de como o site atual usa cor de interação — não confundir com identidade visual.

| Cor | Hex | Uso |
|---|---|---|
| Azul de UI (destaque de interação) | `#00aeff` | Botões, links, hover, bordas ativas no template Houzez atual. |
| Azul de UI (hover/variante) | `#33beff` | Variante do azul de UI em estados de hover/tab ativa. |
| Azul-marinho de UI (secundário) | `#004274` | Cor escura usada em header/footer do template atual. |
| Azul-marinho de UI (variante) | `#00335A` / `#002B4B` | Tons mais escuros, detalhes pontuais (gradientes/hover) no template atual. |

### Cores neutras

| Cor | Hex | Uso |
|---|---|---|
| Branco | `#ffffff` | Fundo padrão, texto sobre fundo escuro. |
| Preto | `#000000` | Texto de maior contraste, raros casos. |
| Cinza texto escuro | `#222222` | Texto de corpo, labels sobre fundo claro. |
| Cinza médio | `#555555` | Texto secundário (ex: disclaimers). |
| Cinza claro (borda) | `#dce0e0` | Bordas de inputs, cards, divisórias. |
| Cinza claro (texto apagado) | `#a1a7a8` | Texto desabilitado / placeholder / labels secundárias. |
| Cinza off-white | `#f9f9f9` / `#f8f8f8` | Fundos de seção alternados. |
| Cinza ícone | `#ebebeb` | Ícones em estado neutro/inativo. |

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

Ficam em `src/assets/design-system/images/`. São fotos de imóveis usadas no site — servem de referência de estilo fotográfico (imagens de propriedades reais, tratamento de cor neutro/natural, proporção 4:3 ≈ 592×444px), não são parte do design system de componentes.

| Arquivo | Uso no site |
|---|---|
| `property-sample-1.jpg` | Thumbnail de imóvel em destaque na home. |
| `property-sample-2.jpg` | Thumbnail de imóvel em destaque na home. |
| `property-detail-gallery-1.jpg` | Foto de galeria da página de detalhe de imóvel (1170×785, corte wide usado no topo da ficha). |

---

## 7.1 Catálogo de componentes

Levantado a partir das 8 telas pedidas + home (HTML/CSS real via `curl`, sem screenshot — extensão Chrome offline nesta sessão). Todas as telas usam o mesmo CSS global (seções 1–6); o que muda de tela pra tela são estes componentes reutilizáveis:

| Componente | Classe(s) de referência | Descrição | Onde aparece |
|---|---|---|---|
| **Card de imóvel** | `.item-listing-wrap`, `.item-listing-wrap-v3.card` | Card com foto, preço, título (`.item-title`, fonte Poppins), localização e ícones de características. Base de qualquer grid de listagem. | Home, `/affitto/`, `/vendita/`, `/status/vendita/`, favoritos |
| **Grid de listagem** | `.property-grids-module-v4`, wrapper 3 colunas | Grid responsivo de cards de imóvel. | `/affitto/`, `/vendita/`, favoritos |
| **Busca avançada** | `.advanced-search`, `.advanced-search-filters`, `.advanced-search-v1`, `.advanced-search-btn` | Formulário de filtro (localização, tipo, preço, quartos etc.), barra fixa no topo da listagem. | `/affitto/`, `/vendita/` |
| **Galeria de imóvel** | `.top-gallery-section`, `.lightbox-gallery`, `.lightbox-gallery-wrap` | Galeria de fotos com abertura em lightbox, usa Slick Carousel. | Ficha de imóvel (`/property/...`) |
| **Bloco de características** | `.property-features-wrap`, `.property-section-wrap` | Lista de atributos do imóvel (m², quartos, banheiros etc.), ícones `houzez-iconfont`. | Ficha de imóvel |
| **Card do agente/corretor** | `.agent-information` | Foto, nome, telefone, e-mail do corretor responsável. | Ficha de imóvel |
| **Formulário de contato (padrão)** | `.wpcf7-form` (Contact Form 7) | Campos: nome, e-mail, telefone, assunto, mensagem, checkbox de aceite. | `/contatti/` |
| **Formulário customizado (Ninja Forms)** | `.nf-form-cont`, campos `nf-field-*` | Formulário de layout livre (texto, telefone, textarea, radio) — usado quando o form padrão não serve. | `/richieste/` |
| **Modal de login/registro** | `#login_register_form`, campos `username`, `useremail`, `register_pass` | Modal global do tema (login, cadastro, "esqueci senha"), injetado em toda página, não é página própria. | Global (todas as telas) |
| **Header dashboard (sem menu público)** | `.houzez-dashboard`, `houzez-header-none` | Variante de header sem navegação pública, usada em áreas logadas. | Favoritos |
| **Botão primário** | `.btn` | Botão padrão do sistema — ver seção 4 (radius) e seção 2 pra cor. | Global |

### Páginas sem componente próprio (reaproveitam os de cima)

`/chi-siamo/`, `/news/` e `/richieste/` usam template de page builder livre (`template-homepage`) — não têm componente estrutural exclusivo, só combinam texto/imagem/vídeo com os componentes acima (ex: vídeo institucional embutido). `/privacy-cookies/` e `/contatti/` usam `template-page`, layout de página simples de texto + form.

### Não cobertos (sem link público / exigem login)

Dashboard completo do usuário (editar perfil, "minhas propriedades", mensagens), página de 404, arquivo de agente/agência individual. Fazem parte do tema Houzez por padrão mas não achei link ativo neles.

---

## 8. Limitações desta extração

- Feita sem acesso ao Chrome (extensão não conectada nesta sessão) — dados vieram do HTML/CSS baixado via `curl`, não de inspeção visual renderizada nem screenshot. Isso vale pra home **e** pras 8 telas da seção 7.1.
- Não peguei estados de hover/animação/transição em detalhe, nem breakpoints completos de responsividade.
- Dashboard logado, login/registro, 404 e página de agente individual **não foram visitados** (sem link direto encontrado / exigem login) — ver tabela em 7.1.
- Se precisar de mais fidelidade visual (espaçamento exato entre seções, grid, comportamento responsivo real, telas que exigem login), o ideal é reconectar a extensão Claude in Chrome e navegar ao vivo.
