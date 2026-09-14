---
name: joyride-tour
description: Cria/edita tour guiado (react-joyride) numa tela do devit-web — granular por campo de filtro, coluna de tabela, item de card e campo de modal de cadastro. Use quando o usuário pedir "criar tour", "tour guiado", "onboarding da tela", "adicionar joyride", "explicar os campos do modal no tour" ou invocar /joyride-tour.
---

# Tour guiado com react-joyride

Padrão já estabelecido no projeto. Não inventar variação: reusar `useTour`, `JoyrideWrapper`, `TourFab`, `constants/joyride.ts` existentes.

## Peças fixas (não recriar)

- `src/hooks/useTour.ts` — estado do tour (`run`, `stepIndex`, `tourKey`, `handleJoyrideCallback`, `startTour`, `stopTour`). Genérico, recebe só `{ steps }`.
- `src/components/JoyrideWrapper/index.tsx` — wrapper do `<Joyride>` com estilo/locale/options do projeto.
- `src/components/TourFab/index.tsx` — botão flutuante (canto inferior direito) com menu "Iniciar Tour Guiado" / "Ver Vídeo Tutorial".
- `src/constants/joyride.ts` — locale PT-BR, cores (#003D68), options. Não duplicar.

Trabalho da skill = só criar `usePAGINATour.ts` + colocar `id` nos elementos certos + plugar 3 hooks/componentes na tela.

## Passo 1 — hook `use<Tela>Tour.ts`

Local: `hooks/use<Tela>Tour.ts` da própria página (junto dos outros hooks da tela).

```ts
import { type Step } from 'react-joyride';
import { useTour } from '../../../../hooks/useTour'; // ajustar profundidade

const PAGE_STEPS: Step[] = [
    { target: '#x-section-title', title: '...', content: '...', placement: 'bottom' },
    // um step por: header, CADA campo de filtro, tabela/lista (visão geral), botão de ação (export, novo item)
];

export const MODAL_TOUR_START_STEP = PAGE_STEPS.length; // só se a tela tiver modal de cadastro

const MODAL_STEPS: Step[] = [
    { target: '#modal-x-form', title: '...', content: '...', placement: 'center' },
    // um step por CADA campo do formulário do modal, na ordem visual
    { target: '#modal-btn-actions', title: 'Salvar ou Cancelar', content: '...', placement: 'top' },
];

const TOUR_STEPS: Step[] = [...PAGE_STEPS, ...MODAL_STEPS];

export const use<Tela>Tour = () => useTour({ steps: TOUR_STEPS });
```

Regra de granularidade — nunca agrupe "a tabela" ou "o formulário" num step genérico quando dá pra ser específico:

- **Filtros**: um step por campo de filtro (não "os filtros" num step só). Ex.: `#x-period-filter`, `#x-status-filter`, `#x-search-input`.
- **Colunas da tabela**: se a coluna precisa de explicação própria (chip colorido, valor calculado, formato específico), dá `id` na própria `<TableCell>`/coluna e cria step dedicado. Se são colunas triviais (nome, data simples), pode agrupar num único step sobre a tabela — mas cite cada coluna não óbvia pelo nome no `content`.
- **Itens de card**: mesmo critério — cada informação/ação do card que não é óbvia à primeira vista ganha seu próprio `target`.
- **Botões de ação da tela**: um step por botão relevante (novo, exportar, editar em massa), nunca "os botões" agrupados.
- **Campos do modal de cadastro**: SEMPRE um step por campo, sem exceção, na ordem em que aparecem no form. Termina sempre com um step no container de ações (`#modal-btn-actions`) explicando salvar/cancelar.

## Passo 2 — colocar `id` nos elementos

Convenção de nomes:
- Página: `#<entidade>-section-title`, `#<entidade>-table`, `#<entidade>-<nome-do-filtro>-filter`, `#<entidade>-<acao>-btn`.
- Modal: sempre prefixo `modal-`: `#modal-<entidade>-form` (no `Box component="form"` raiz), `#modal-field-<campo>` (no `Grid`/wrapper que envolve o campo, não no input em si), `#modal-btn-actions` (no container do `ButtonActionsModal`).

`id` vai no elemento wrapper (Box/Grid), não direto no MUI `TextField`/`Controller` interno — evita clash com refs internos da lib de form.

## Passo 3 — estratégia para abrir modal durante o tour

react-joyride não abre modais sozinho. Ele só aponta pra elemento que já existe no DOM. Estratégia usada no projeto (ver `ClientListContent.tsx`):

1. `useEffect` que observa `run` e `stepIndex`: quando `stepIndex >= MODAL_TOUR_START_STEP` e o modal ainda não está aberto, abre o modal (`handleOpen()`); quando o tour sai da faixa de steps do modal (ou é interrompido), fecha o modal (`handleModalClose()`).
2. Passar `onTourClose={stopTour}` pro modal — se o usuário fechar o modal manualmente (X ou Cancelar) durante o tour, o tour para junto (`stopTour()`), não fica travado com steps do modal enquanto ele está fechado.
3. `useEffect` adicional de scroll: como o Joyride as vezes não centraliza bem alvo dentro de modal com scroll próprio, faz `document.querySelector(target)?.scrollIntoView(...)` com pequeno `setTimeout` (~200ms, pra esperar o modal montar) a cada troca de `stepIndex`.

```tsx
useEffect(() => {
    if (run && stepIndex >= MODAL_TOUR_START_STEP && !isOpen) {
        setEditX(null);
        handleOpen();
    }
    if ((!run || stepIndex < MODAL_TOUR_START_STEP) && isOpen) {
        handleModalClose();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [run, stepIndex]);

useEffect(() => {
    if (!run || stepIndex < MODAL_TOUR_START_STEP) return;
    const step = steps[stepIndex];
    if (!step?.target || typeof step.target !== 'string') return;
    const timer = setTimeout(() => {
        document.querySelector(step.target as string)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    return () => clearTimeout(timer);
}, [run, stepIndex, steps]);
```

Se a tela tiver mais de um modal no tour (ex.: modal de cadastro + modal de detalhe), soma faixas: `MODAL_TOUR_START_STEP` e `MODAL2_TOUR_START_STEP = MODAL_TOUR_START_STEP + MODAL_STEPS.length`, replicando a mesma lógica de useEffect para cada faixa.

## Passo 4 — plugar na tela (`*ListContent.tsx` / `index.tsx`)

```tsx
const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } = use<Tela>Tour();

<JoyrideWrapper steps={steps} run={run} stepIndex={stepIndex} tourKey={tourKey} onEvent={handleJoyrideCallback} />
<TourFab onClick={startTour} />

<ModalRegisterX
    isOpen={isOpen}
    handleClose={handleModalClose}
    onTourClose={stopTour}
    ...
/>
```

## Checklist antes de terminar

- [ ] Todo `Step[]` tem `target`, `title`, `content` (pt-BR) e `placement` coerente com a posição real do elemento.
- [ ] Nenhum campo de filtro, coluna não-óbvia, ou campo de modal ficou sem step próprio.
- [ ] `id`s seguem a convenção `#<entidade>-...` / `#modal-field-...`.
- [ ] Modal fecha sozinho se o tour for interrompido (`onTourClose`).
- [ ] `npx tsc --noEmit` limpo (regra do projeto).
