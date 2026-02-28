

## Substituir inputs de data por componente React customizado

Duas alterações em dois arquivos para resolver definitivamente o problema dos filtros de data invisíveis no iOS Chrome.

### 1. `src/pages/DashboardPage.tsx`

- Alterar import de `import { useState, useMemo } from 'react'` para `import React, { useState, useMemo } from 'react'`
- Substituir o bloco JSX do `filter-date-group` (linhas 105-122) pelos dois componentes `<DateInputField>`
- Adicionar o componente `DateInputField` após o componente `KPICard` (após linha 258)

### 2. `src/pages/Dashboard.css`

- Remover os blocos `.date-input-wrapper` (linhas 85-92), `.date-label` (linhas 94-101), `.date-input-wrapper input` (linhas 103-112) e `.date-input-wrapper input::-webkit-date-and-time-value` (linhas 115-118)
- Remover `.date-input-wrapper input` dos seletores de hover (linha 189) e focus (linha 197)
- Adicionar no lugar os novos estilos: `.date-field-wrapper`, `.date-field-label`, `.date-field-display`, `.date-field-wrapper:hover .date-field-display`, `.date-field-icon`, `.date-field-value`, `.date-field-placeholder`, `.date-field-input-hidden`
- Manter `.filter-date-group` inalterado
- Atualizar o seletor base (linha 44-47) removendo `.date-input-wrapper input`

### Por que funciona

O input real (`opacity: 0`) cobre toda a area clicavel e abre o date picker nativo. O usuario ve o componente customizado (icone de calendario + data formatada ou placeholder "dd/mm/aaaa"), garantindo funcionamento identico em iOS, Android e desktop.

### Detalhes tecnicos

- O seletor base compartilhado (linhas 44-47) sera atualizado para remover `.date-input-wrapper input` ja que o input hidden tem seus proprios estilos
- Os seletores de hover/focus serao limpos para remover referencias a `.date-input-wrapper input`
- O `.filter-date-group` permanece intacto com suas propriedades flex atuais

