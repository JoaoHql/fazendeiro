# Brainstorm de Design - Sistema de Pedidos

## Contexto
Sistema simples de pedidos com tema claro e detalhes em verde. Foco em usabilidade, micro-interações e hierarquia visual clara.

---

## Abordagem 1: Minimalismo Corporativo Moderno
**Probabilidade:** 0.08

### Design Movement
Modernismo corporativo com influências do design escandinavo — limpo, funcional e elegante.

### Core Principles
1. **Clareza Absoluta**: Cada elemento tem um propósito claro; nada é decorativo
2. **Espaço Respirável**: Generoso uso de whitespace para criar sensação de leveza
3. **Tipografia como Hierarquia**: Contraste forte entre pesos de fonte para guiar o olhar
4. **Funcionalidade Estética**: Sombras e bordas sutis servem à usabilidade, não à decoração

### Color Philosophy
- **Branco Puro** (#FFFFFF): Fundo limpo e confiável
- **Verde Esmeralda** (#10B981): Ação, confirmação, crescimento — transmite segurança e progresso
- **Cinza Neutro** (#1F2937 para textos, #E5E7EB para bordas): Hierarquia sem ruído visual
- **Vermelho Suave** (#EF4444): Apenas para estados críticos (cancelamento)
- **Amarelo Morno** (#FBBF24): Atenção sem alarme (status pendente)

### Layout Paradigm
- **Grid Assimétrico**: Cards de produtos em grid 2-3 colunas (responsivo), com espaçamento consistente
- **Header Fixo Minimalista**: Apenas ícones funcionais, sem texto desnecessário
- **Drawer Lateral Limpo**: Carrinho desliza da direita, overlay sutil (não escuro demais)
- **Seções Bem Definidas**: Separação clara entre catálogo, carrinho e histórico

### Signature Elements
1. **Botões com Micro-animação**: Hover sutil com elevação (shadow increase), sem mudança de cor agressiva
2. **Badges Verdes Discretos**: Tags de "Lote +5" com fundo verde claro e borda verde escura
3. **Stepper de Quantidade Refinado**: Botões [-] e [+] com ícones, transição suave entre estados

### Interaction Philosophy
- **Feedback Imediato**: Cliques disparam animações suaves (150-200ms)
- **Estados Visuais Claros**: Hover, focus, disabled, active — cada um com aparência distinta
- **Transições Fluidas**: Drawer, modais e mudanças de estado usam easing suave (ease-in-out)
- **Sem Surpresas**: Comportamentos previsíveis, sem animações que distraem

### Animation
- **Entrada**: Cards aparecem com fade-in suave (200ms) ao carregar
- **Hover**: Botões elevam levemente (transform: translateY(-2px)) com shadow crescente
- **Clique**: Feedback tátil com scale rápido (95% → 100%) em 100ms
- **Drawer**: Desliza da direita com easing cubic-bezier(0.4, 0, 0.2, 1) em 300ms
- **Transição de Página**: Fade suave entre telas (100ms)

### Typography System
- **Display/Títulos**: Roboto Bold 28-32px (H1), 24px (H2) — peso e tamanho para hierarquia
- **Corpo**: Roboto Regular 14-16px — legibilidade máxima
- **Acentos**: Roboto Medium 14px — para labels, badges, botões
- **Espaçamento de Linha**: 1.6 para corpo, 1.2 para títulos

---

## Abordagem 2: Naturalismo Orgânico com Acentos Verdes
**Probabilidade:** 0.07

### Design Movement
Biofilia aplicada ao design digital — formas arredondadas, paleta natural, sensação de crescimento e vitalidade.

### Core Principles
1. **Formas Suaves**: Bordas arredondadas generosas (12-16px) em todos os elementos
2. **Paleta Terrestre**: Tons que remetem à natureza — verde, creme, cinza quente
3. **Movimento Orgânico**: Animações que imitam movimento natural (não linear)
4. **Acessibilidade Emocional**: Design que se sente amigável, não corporativo

### Color Philosophy
- **Fundo Creme Quente** (#FFFBF0): Mais acolhedor que branco puro, reduz fadiga
- **Verde Vivo** (#16A34A): Energia e vitalidade, não tão corporativo quanto esmeralda
- **Cinza Quente** (#78716C para textos, #F5F3F0 para fundos secundários): Menos frio que cinza neutro
- **Laranja Suave** (#FB923C): Atenção amigável (status pendente)
- **Rosa Suave** (#F87171): Ações destrutivas (cancelamento) — menos agressivo que vermelho

### Layout Paradigm
- **Grid Fluido com Espaçamento Generoso**: Produtos em cards grandes e respiráveis
- **Curvas e Diagonais**: Seções com clip-path suave ou SVG dividers com curvas
- **Carrinho Integrado**: Drawer com fundo gradiente suave (creme → branco)
- **Ícones Ilustrativos**: Não apenas símbolos, mas pequenas ilustrações

### Signature Elements
1. **Cards com Sombra Suave e Gradiente Sutil**: Fundo branco com gradiente imperceptível (branco → creme)
2. **Botões Arredondados com Ícones Ilustrativos**: Formas suaves, ícones com mais personalidade
3. **Badges Verdes com Folhas**: Tag de "Lote +5" com pequeno ícone de folha

### Interaction Philosophy
- **Transições Fluidas e Naturais**: Easing que imita movimento natural (cubic-bezier com curvas suaves)
- **Hover Generoso**: Elementos respondem com mudança de cor suave + elevação
- **Feedback Tátil**: Cliques com feedback visual que parece "orgânico"
- **Animações Contínuas**: Pequenas animações de "respiração" em elementos importantes

### Animation
- **Entrada**: Cards aparecem com scale suave (90% → 100%) + fade em 400ms
- **Hover**: Elementos ganham sombra maior + cor mais saturada (transição 200ms)
- **Clique**: Ripple effect suave emanando do ponto de clique
- **Drawer**: Desliza com easing natural (cubic-bezier(0.34, 1.56, 0.64, 1)) em 350ms
- **Respiração**: Ícones importantes têm animação contínua de scale suave (0.95 → 1.05)

### Typography System
- **Display**: Poppins Bold 32px (H1), 24px (H2) — mais personalidade que Roboto
- **Corpo**: Inter Regular 15px — legibilidade com warmth
- **Acentos**: Poppins SemiBold 14px — para labels e botões
- **Espaçamento de Linha**: 1.7 para corpo, 1.3 para títulos

---

## Abordagem 3: Utilitarismo Digital com Foco em Dados
**Probabilidade:** 0.09

### Design Movement
Design utilitário inspirado em dashboards e ferramentas digitais — informação em primeiro lugar, visual em segundo.

### Core Principles
1. **Densidade de Informação**: Máxima informação sem poluição visual
2. **Tipografia Monoespacial**: Números e dados em fontes monoespaciais para clareza
3. **Grid Rigoroso**: Alinhamento perfeito, sem exceções
4. **Cores Semânticas**: Cores significam estados, não decoração

### Color Philosophy
- **Fundo Cinza Muito Claro** (#F3F4F6): Neutro, profissional, reduz brilho
- **Verde Saturado** (#059669): Ação, confirmação, sucesso — sem ambiguidade
- **Cinza Escuro** (#111827 para textos): Máximo contraste
- **Azul Suave** (#3B82F6): Informação secundária
- **Vermelho Claro** (#DC2626): Erro ou cancelamento

### Layout Paradigm
- **Tabela-Like para Carrinho**: Linhas claras, colunas bem definidas
- **Cards Compactos**: Informação densa mas legível
- **Sidebar Fixa Opcional**: Para navegação entre seções
- **Números em Destaque**: Preços, quantidades, totais em tamanho maior

### Signature Elements
1. **Tabelas com Linhas Alternadas**: Alternância sutil de fundo para legibilidade
2. **Indicadores Numéricos**: Badges com números em fonte monoespacial
3. **Ícones Funcionais Apenas**: Sem decoração, cada ícone tem propósito claro

### Interaction Philosophy
- **Feedback Textual**: Toasts com mensagens claras, não apenas ícones
- **Confirmação Explícita**: Ações críticas pedem confirmação (modal simples)
- **Sem Ambiguidade**: Estados são óbvios, não requerem interpretação
- **Velocidade**: Transições rápidas (100-150ms), sem delays desnecessários

### Animation
- **Entrada**: Fade-in rápido (100ms) sem scale
- **Hover**: Mudança de cor sutil + cursor pointer
- **Clique**: Feedback rápido com invert de cores por 50ms
- **Drawer**: Desliza rápido (200ms) com easing linear
- **Transição de Página**: Fade instantâneo (50ms)

### Typography System
- **Display**: IBM Plex Mono Bold 28px (H1), 20px (H2) — monoespacial para dados
- **Corpo**: IBM Plex Mono Regular 13px — legibilidade com consistência
- **Números**: IBM Plex Mono SemiBold 16px — destaque para valores
- **Espaçamento de Linha**: 1.5 para corpo, 1.1 para títulos

---

## Decisão Final

Após análise, a **Abordagem 1 (Minimalismo Corporativo Moderno)** foi selecionada porque:

1. **Alinha com o Plano do Usuário**: O plano especifica "interface limpa e profissional" com "espaço respirável"
2. **Balanceamento Perfeito**: Combina funcionalidade corporativa com detalhes em verde que transmitem confiança
3. **Usabilidade Clara**: Micro-interações e hierarquia visual são naturais nesta abordagem
4. **Escalabilidade**: Fácil de manter e expandir sem perder consistência
5. **Performance**: Animações suaves mas não pesadas, ideal para e-commerce

### Paleta Final Confirmada
- **Primária**: Verde Esmeralda #10B981
- **Fundo**: Branco #FFFFFF
- **Textos**: Cinza Chumbo #1F2937
- **Bordas**: Cinza Claro #E5E7EB
- **Atenção**: Amarelo #FBBF24
- **Erro**: Vermelho #EF4444

### Tipografia Final
- **Display**: Roboto Bold (títulos)
- **Corpo**: Roboto Regular (textos)
- **Acentos**: Roboto Medium (labels, botões)

### Animações Principais
- Fade-in suave: 200ms
- Hover elevation: 150-200ms
- Drawer slide: 300ms
- Clique feedback: 100ms
