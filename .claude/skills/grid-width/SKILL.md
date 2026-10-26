---
name: grid-width
description: >
  Valida e corrige grids Tailwind (grid-cols-N + col-span-N) para que nenhuma linha
  fique com buraco quando um campo é renderizado condicionalmente. O campo sempre
  presente compensa o ausente com ternário de col-span. Use ao criar ou revisar
  formulários/modais com campos condicionais.
  Trigger: /grid-width, "verificar grid", "checar largura grid", "grid width", "buraco no grid".
---

# Regra: toda linha do grid fecha completa

O projeto usa Tailwind (`grid grid-cols-1 sm:grid-cols-N gap-4`) com `col-span-N` nos filhos.
Em um grid de N colunas, **cada linha deve somar exatamente N**, mesmo quando um filho
condicional (`{cond && <div/>}`) some. Se não fechar, sobra buraco ao lado do campo.

Padrão mais comum do projeto: `sm:grid-cols-2`, campos largos com `sm:col-span-2`.

## O problema

```tsx
// ERRADO: se showB = false, o campo A fica sozinho na metade da linha
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <FieldA />
  {showB && <FieldB />}
</div>
```

## A regra

> O campo sempre presente ocupa o espaço do condicional ausente.

```tsx
// CORRETO: A expande para a linha inteira quando B não aparece
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <div className={showB ? undefined : 'sm:col-span-2'}>
    <FieldA />
  </div>

  {showB && <FieldB />}
</div>
```

Em grids de 3+ colunas, o ternário escolhe o span:

```tsx
// sm:grid-cols-3 — B opcional: A ocupa 1 ou 2
<div className={showB ? 'sm:col-span-1' : 'sm:col-span-2'}>
```

## Atenção: Tailwind não vê classes montadas por string

Nunca `` `sm:col-span-${n}` `` — a classe não é gerada. Use sempre classes completas
em cada ramo do ternário (ou `cn()` de `@/lib/utils`).

## Padrões

- **1 condicional numa linha de 2:** sempre-presente com `sm:col-span-2` quando o outro some.
- **Condicional ímpar (sobra 1 de 2 colunas):** se o total de filhos visíveis fica ímpar,
  o último filho visível deve ter `sm:col-span-2`.
- **Múltiplos condicionais:** a soma dos spans **visíveis** deve ser sempre N.
  Calcule e distribua o restante entre os itens sempre presentes.
- **Campo largo por natureza** (textarea, lista, aviso): `sm:col-span-<N>` fixo, já fecha a linha.
- **Mobile:** `grid-cols-1` fecha sozinho, só o breakpoint `sm:`/`md:`/`lg:` precisa de conta.

## Checklist ao revisar/criar

1. Ache os filhos diretos do grid com renderização condicional (`&&`, `? :`, variável booleana).
2. Para cada linha, some os spans com o condicional `true` e com `false`.
3. Se `false` não fecha N, ajuste o span do item sempre presente com ternário.
4. Confira os dois casos: `true` = N **e** `false` = N.
5. Se o filho condicional é um componente próprio (ex.: `FormFieldWrapper`), o `col-span`
   vai num `<div>` wrapper ou no `className` do componente, e não dentro dele.
6. Rode `npx tsc -b` ao final (uma vez só).

## Exemplo

```tsx
const isFixed = watch('type') === 'FIXED'

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <div className={isFixed ? undefined : 'sm:col-span-2'}>
    <Controller name="type" control={control} render={...} />
  </div>

  {isFixed && (
    <FormFieldWrapper label={t('fixedValue')}>
      <Input {...register('fixedValue')} />
    </FormFieldWrapper>
  )}
</div>
```

Labels sempre via i18n (pt/it), nunca texto fixo.
