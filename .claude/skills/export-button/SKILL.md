---
name: export-button
description: >
  Ensina a usar o ExportMenu (botão "Esporta/Exportar" com PDF / Excel) e a
  padronizar telas que exportam com botão solto ou menu feito à mão.
  Use ao criar ou alterar qualquer exportação de tela.
  Trigger: /export-button, "botão de exportar", "padronizar exportar", "export menu", "exportar pdf excel".
---

# ExportMenu

Componente: `src/components/ExportMenu.tsx`. Botão em formato de pílula amarela
que abre um menu com **PDF** (ícone vermelho) e **Excel** (ícone verde).
O download, o toast de progresso/sucesso e o erro (`getErrorMessageFromRequest`)
já estão dentro do componente via `downloadExport` (`src/utils/downloadExport.ts`).

## Regras

1. **Nunca montar menu/dropdown próprio** para exportar. Sempre `ExportMenu`.
2. **Posição: dentro do section title**, nunca na barra de busca (`ListToolbar`).
   Para isso, envolva o `ExportMenu` com `PageHeaderAction`
   (`src/components/layout/PageHeaderAction.tsx`). No desktop ele aparece à
   direita do box do título; no mobile (sem section title) aparece acima do conteúdo.
3. **Não customizar cores/ícones/animações na tela.** Visual (pílula, hover com
   degradê amarelo e sombra amarela, ícones coloridos, cursor pointer) fica só
   no `ExportMenu`. Mudou o visual → mude no componente.
4. O menu tem PDF, Excel e Imprimir (azul). Imprimir reaproveita o PDF: abre a impressão sem baixar o arquivo. Não existe "Em breve".
5. O endpoint deve aceitar `format` xlsx/pdf (ver `downloadExport`). Sem endpoint, não há exportação.
6. Textos vêm de `common` → `exportMenu.*` (pt e it). Nunca texto fixo.

## Uso

```tsx
import ExportMenu from '@/components/ExportMenu'
import PageHeaderAction from '@/components/layout/PageHeaderAction'

<PageHeaderAction>
  <ExportMenu
    path="/purchase-proposals/export"
    params={{ filter: { where }, ...brokerParams }}
  />
</PageHeaderAction>
```

- `path`: rota de exportação da API.
- `params`: filtros atuais da lista (mesmo `where` da tabela), para exportar o
  que o usuário está vendo.
- Pode ficar em qualquer lugar do JSX da página; o conteúdo é levado ao slot do
  título via portal. Em tela dentro de abas, só a aba ativa renderiza, então só
  o export da aba ativa aparece.

## Padronizando uma tela existente

1. Achar o botão atual: `grep -rn "Esporta\|Exportar\|actions=" src/pages/<tela>`.
2. Remover o botão/menu antigo (e a prop `actions` do `ListToolbar`) e imports não usados.
3. Colocar `<PageHeaderAction><ExportMenu .../></PageHeaderAction>`.
4. Se a tela tem tour (joyride) apontando para o botão, o alvo é o título
   (`#page-section-title`); atualizar o texto do passo se mencionar o botão.
5. Rodar `npx tsc -b` uma vez (timeout 2min).

## Telas de referência

- `src/pages/Proposte/index.tsx`
- `src/pages/Imoveis/index.tsx`
- `src/pages/Operazioni/Locazioni/Adeguamenti/index.tsx` (export fora de lista)
