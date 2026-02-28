

## Correção de compatibilidade iOS Chrome — Dashboard.css

Três alterações cirúrgicas no arquivo `src/pages/Dashboard.css`, sem tocar em nenhum outro arquivo.

### Correção 1 — Remover `display: flex !important` e `align-items: center`
No bloco que estiliza `.filter-select-wrapper select, .date-input-wrapper input, .filter-nf-wrapper input, .shortcut-btn` (linha ~53), remover as duas propriedades que causam colapso visual no iOS Chrome por serem inválidas em replaced elements.

### Correção 2 — `font-size: 0.875rem` para `font-size: 16px`
No mesmo bloco, trocar o font-size para 16px, evitando o auto-zoom do iOS ao focar inputs/selects.

### Correção 3 — `color-scheme: dark` para `color-scheme: dark light`
No bloco `.date-input-wrapper input` (linha ~89), adicionar fallback `light` para evitar ícones invisíveis no iOS Chrome.

### Resumo técnico

| # | Bloco | De | Para |
|---|-------|----|------|
| 1 | seletores compartilhados (~L53) | `display: flex !important; align-items: center;` | *(remover)* |
| 2 | seletores compartilhados (~L53) | `font-size: 0.875rem;` | `font-size: 16px;` |
| 3 | `.date-input-wrapper input` (~L89) | `color-scheme: dark;` | `color-scheme: dark light;` |

Nenhum outro arquivo ou propriedade será alterado.

