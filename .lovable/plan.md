
Objetivo: corrigir o colapso/sobreposição dos filtros de data no iOS Chrome alterando somente `src/pages/Dashboard.css` e apenas os 3 blocos indicados.

1) Substituir completamente o bloco `.filter-date-group` pelo conteúdo exato:
```css
.filter-date-group {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex: 1 1 300px;
  min-width: 260px;
  width: 100%;
}
```

2) Substituir completamente o bloco `.date-input-wrapper` pelo conteúdo exato:
```css
.date-input-wrapper {
  flex: 1 1 50%;
  min-width: 120px;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
```

3) Substituir completamente o bloco `.date-input-wrapper input` pelo conteúdo exato:
```css
.date-input-wrapper input {
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 0.5rem 0 0.75rem;
  cursor: pointer;
  color-scheme: dark light;
  display: block;
  box-sizing: border-box;
}
```

Escopo e garantias:
- Não alterar nenhum outro arquivo além de `src/pages/Dashboard.css`.
- Não alterar cores, bordas, espaçamentos, tipografia ou layout fora dos 3 blocos acima.
- Não remover nem modificar o bloco `.date-input-wrapper input::-webkit-date-and-time-value`.
- Manter intactas as demais regras (incluindo media queries e estados hover/focus).

Resultado esperado:
- O grupo de datas mantém largura mínima estável.
- Cada input de data preserva área visível e não colapsa.
- Fim da sobreposição dos campos no iOS Chrome.
