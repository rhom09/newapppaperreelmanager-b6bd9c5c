

## Correção de filtros de data iOS Chrome — Dashboard

Duas correções cirúrgicas em dois arquivos para resolver sobreposição e falta de labels nos inputs de data no iOS Chrome.

### Alterações

**1. `src/pages/Dashboard.css`** — Bloco `.date-input-wrapper` (linhas 83-86)

Alterar de:
```css
.date-input-wrapper {
  flex: 1;
  min-width: 0;
}
```
Para:
```css
.date-input-wrapper {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
```

Adicionar logo abaixo desse bloco o novo estilo:
```css
.date-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**2. `src/pages/DashboardPage.tsx`** — Bloco JSX do `filter-date-group` (linhas 105-122)

Adicionar `<label className="date-label">` antes de cada input e remover os atributos `placeholder`.

### Resultado esperado
- Inputs de data nao colapsam mais no iOS (min-width: 120px)
- Labels "De" e "Ate" visiveis acima dos campos em todas as plataformas
- Nenhuma outra alteracao visual ou funcional

