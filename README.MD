Objetivo Principal
Landing page desenvolvida para converter visitantes em usuários do aplicativo Sereno, destacando seus benefícios para saúde mental e bem-estar. 
-----
Recursos Principais
Tela de início

Tela sobre o aplicativo

Tela de recursos do aplicativo

Tela de Depoimentos

Tela de novidades Novidadades

Interface em português

Tecnologias Utilizadas
Frontend:

HTML5

CSS3 

JavaScript para interatividade

Design responsivo para todos os dispositivos
-------
Design:

Paleta de cores roxa com variações


Layout limpo e intuitivo
 ------
Estrutura do Projeto
text
sereno/
├── index.html          # Página principal
├── sereno.css          # Estilos principais
├── script.js           # Lógica do carrossel e cadastro
└── img/                # Assets visuais
    
  ------  
Destaques Técnicos
Carrossel Interativo
javascript
// Configuração do carrossel infinito
const carousel = {
  init() {
    // Duplica cards para efeito infinito
    // Navegação por arrasto (drag)
    // Controles de setas e indicadores
    // Auto-play com pausa no hover
  }
};
Design Responsivo
css
/* Adaptação para diferentes telas */
@media (max-width: 865px) {
  .carousel {
    grid-auto-columns: 100%;
  }
  .nav-buttons {
    display: none;
  }
}
Design System
Cores Principais
css
:root {
  --roxo-principal: #5d22b3;
  --roxo-claro: #EEE0FF;
  --roxo-botão: #a864fc;
  --roxo-estrela: #7C3BE2;
}
----
Validação de Formulário
O formulário de cadastro possui um sistema robusto de validação client-side que garante a qualidade dos dados antes do envio:

Campos Validados
Nome Completo

Requer pelo menos 2 caracteres; não pode estar vazio; remove espaços em branco extras; E-mail; Valida formato usando regex ^[^\s@]+@[^\s@]+\.[^\s@]+$; Verifica se contém "@" e "."
Remove espaços em branco extras

Experiência com Meditação (radio buttons)

Obrigatório selecionar uma opção

Valida se pelo menos um radio foi marcado

Fluxo de Validação
javascript
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Impede envio padrão
  
  // Reset de estados
  formMessage.textContent = '';
  let errors = [];
  
  // Validações...
  
  if (errors.length > 0) {
    // Mostra erros
    return; 
  }
  
  // Processa formulário válido
});
---------------
Seções do Site
Início - Apresentação inicial com CTA

Sobre - Explica sobre o aplicativo

Recursos - Lista de funcionalidades

Depoimentos - Carrossel interativo de avaliações

Novidades: Cadastro por nome e email para recebimento de novidades.