const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper button");
const firstCardWith = carousel.querySelector(".card").offsetWidth;

// Pega os cards dentro do carrossel
const carouselChildrens = [...carousel.children];

// Variáveis de controle
let isDragging = false, startX, startScrollLeft, timeOutId;
let cardPerView = Math.round(carousel.offsetWidth / firstCardWith);
let currentActiveIndex = cardPerView;

const updateIndicators = () => {
    // Remove classe ativa de todos
    const indicators_actives = document.querySelectorAll(".indicador.active");
    indicators_actives.forEach(indicator => {
        indicator.classList.remove("active");
    });

    // Índice relativo (descontando os duplicados no início)
    let relativeIndex = currentActiveIndex - cardPerView;

    // Ativa o indicador correto
    const indicators = document.querySelectorAll(".indicador");

    if (relativeIndex <= 3){
        indicators[0].classList.add("active")
    } else {
        indicators[1].classList.add("active")
    }
};

// Atualiza o card central
const updateActiveCardByScroll = () => {
    // Pega posição e tamanho do carrossel
    const carouselRect = carousel.getBoundingClientRect(); 
    // Calcula o ponto central do carrossel (eixo X)
    const centerX = carouselRect.left + carousel.offsetWidth / 2; 
    // Card mais próximo do centro
    let closestCard = null;
    // Distância mais próxima do centro até agora
    let closestDistance = Infinity; 
    // Pega os cards dentro do carrossel
    let allCards = carousel.querySelectorAll(".card");

    // Percorre todos os cards dentro do carrossel
    allCards.forEach((card, index) => {
        // Pega a posição e o tamanho do card
        const cardRect = card.getBoundingClientRect();
        // Calcula o centro do card
        const cardCenter = cardRect.left + cardRect.width / 2;
        // Distância entre o centro do carrossel e o card
        const distance = Math.abs(centerX - cardCenter);

         // Verifica se o card atual está mais próximo do centro da tela que o último
        if (distance < closestDistance) {
            // Atualiza o card mais próximo do centro
            closestDistance = distance;
            closestCard = card;
            // Salva o índice central
            currentActiveIndex = index; 
        }
    });

    // Remove a classe "active" de todos os cards atualmente ativos
    allCards.forEach(card => card.classList.remove("active"));
    if (window.innerWidth >= 1180 && closestCard) {
        closestCard.classList.add("active");
    }

    // Só aplica o "ativo" se a tela for grande o suficiente (>= 1180px)
    if (window.innerWidth >= 1180) {
        if (closestCard) {
            // Adiciona a classe "active" ao card mais centralizado
            closestCard.classList.add("active");
        }
    }
};

// Indicadores clicáveis
document.querySelectorAll(".indicador").forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
        let targetIndex;

        // Remove classe "active" de todos os indicadores antes de adicionar no correto
        document.querySelectorAll(".indicador").forEach(i => i.classList.remove("active"));

        // Adiciona classe "active" ao indicador clicado
        indicator.classList.add("active");
        
        if (index === 0) {
            // Indicador 0 → primeiro card real
            targetIndex = cardPerView;
        } else {
            // Indicador 1 → último card real
            targetIndex = carouselChildrens.length - 1 + cardPerView
        }

        // Move o carrossel até o card desejado
        carousel.scrollLeft = targetIndex * firstCardWith;

        // Atualiza o card ativo com base na nova posição
        updateActiveCardByScroll();
    });
});

// Duplicação dos cards no início e fim para criar um efeito de carrossel infinito
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    // Insere os últimos `cardPerView` cards no início do carrossel, em ordem reversa
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens.slice(0, cardPerView).forEach(card => {
    // Insere os primeiros `cardPerView` cards no final do carrossel
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Ações dos botões do carrossel
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Verifica qual botão foi clicado para mover o carrossel
        carousel.scrollLeft += btn.id === "left" ? -firstCardWith : firstCardWith;
        // Atualiza o card central
        updateActiveCardByScroll();
        // Atualiza o indicador
        updateIndicators();
    })
})

// Quando o mouse tocar no carrossel
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Armazena a posição inicial do mouse
    startX = e.pageX;
    // Armazena a posição inicial do scroll
    startScrollLeft = carousel.scrollLeft;
}

// Quando o mouse estiver sendo arrastado
const dragging = (e) => {
    if(!isDragging) return;
    // Move o carrossel com o mouse
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

// Quando o mouse deixar de ser arrastado
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
    // Atualiza o card central
    updateActiveCardByScroll();
    // Atualiza o indicador
    updateIndicators();
}

// Move o carrossel automaticamente
const autoPlay = () => {
    // Atualiza o card central
    updateActiveCardByScroll();
    // Atualiza o indicador
    updateIndicators();
    // Evita que o setTimeout seja executado mais de uma vez
    timeOutId = setTimeout(() => {
        // Verifica o tamanho da tela e move o carrossel
        if (window.innerWidth < 1180 && window.innerWidth >= 865) {
            carousel.scrollLeft += (firstCardWith + 24);
        }
        // Move o carrossel
        carousel.scrollLeft += firstCardWith;
    }, 3000);
}

// Move o carrossel infinitamente
const infiniteScroll = () => {
    // Variáveis que armazenam o valor inicial e final do scroll
    const atStart = carousel.scrollLeft === 0;
    const atEnd = Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth;
    // Verifica se uma das variáveis existe
    if (atStart || atEnd) {
        carousel.classList.add("no-transition");
        // Verifica se o scroll chegou ao inicio
        if (atStart) {
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        } 
        // Faz o carrossel voltar ao inicio
        else {
            carousel.scrollLeft = carousel.offsetWidth;
        }
        
        carousel.classList.remove("no-transition");
        return;
    }
    
    // Limpa o setTimeout
    clearTimeout(timeOutId);
    // Verifica se o mouse não está sobre o carrossel
    if (!wrapper.matches(":hover")) autoPlay();
    // Atualiza o card central
    updateActiveCardByScroll();
    // Atualiza o indicador
    updateIndicators();
};

// Inicialização das funções
autoPlay();
updateActiveCardByScroll();
updateIndicators();

// Eventos do carrossel
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeOutId));
wrapper.addEventListener("mouseleave", autoPlay);

// Novidades

// Validação do formulário de novidades
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signup-form');
  if (!form) return; // segurança para não tentar validar se o form não existe

  const nameInput = form.elements['name'];
  const emailInput = form.elements['email'];
  const meditateInputs = form.elements['meditates'];
  const formMessage = document.getElementById('form-message');
  const meditateError = document.getElementById('meditate-error');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  function isMeditationSelected() {
    return [...meditateInputs].some(input => input.checked);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formMessage.textContent = '';
    let errors = [];

    // Nome
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      errors.push('Por favor, insira um nome válido com pelo menos 2 caracteres.');
      nameInput.setAttribute('aria-invalid', 'true');
    } else {
      nameInput.removeAttribute('aria-invalid');
    }

    // Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      errors.push('Por favor, insira um email válido.');
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.removeAttribute('aria-invalid');
    }

    // Meditação
    if (!isMeditationSelected()) {
      meditateError.style.display = 'block';
      errors.push('Por favor, selecione se você já medita.');
    } else {
      meditateError.style.display = 'none';
    }

    // Mostrar erros
    if (errors.length > 0) {
      formMessage.style.color = '#a46cff';
      formMessage.textContent = errors.join(' ');
      return;
    }

    // Sucesso
    formMessage.style.color = '##a46cff';
    formMessage.textContent = 'Cadastro realizado com sucesso!';
    console.log('Nome:', nameInput.value.trim());
    console.log('Email:', emailInput.value.trim());
    form.reset();
    meditateError.style.display = 'none';
  });
});

const links = document.querySelectorAll(".ul li a");
links.forEach((link) => {
    link.addEventListener("click", () => {
        links.forEach((link) => {
            link.classList.remove("active");
        });
        link.classList.add("active");
    });
});

let currentSectionId = null;

window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll(".ul li a");

    let newActiveSectionId = null;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const offsetTrigger = 50;

        if ( window.scrollY >= sectionTop - offsetTrigger &&
            window.scrollY < sectionTop + sectionHeight - offsetTrigger) {
            newActiveSectionId = section.id;
        }

    });

    // Só atualiza se mudou de seção
    if (newActiveSectionId !== currentSectionId) {
        currentSectionId = newActiveSectionId;

        links.forEach((link) => {
            const href = link.getAttribute("href").replace("#", "");
            const header = document.querySelector("header");

            if (href === currentSectionId) {
                if (href === "sobre" || href === "depoimentos") {
                    header.classList.add("active");
                } else {
                    header.classList.remove("active");
                }

                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
  
  const sobreSection = document.querySelector('.sobre-banner').closest('section') || 
                     document.querySelector('.sobre-banner').parentElement;
  
  
  const counterConfigs = [
    { target: 6, duration: 1000 },
    { target: 100, duration: 1500 },
    { target: 10000, duration: 2000 }
  ];
  
  
  const originalValues = Array.from(document.querySelectorAll('.banner-item h3'))
    .map(el => el.textContent);
  
  
  function resetCounters() {
    document.querySelectorAll('.banner-item h3').forEach((counter, index) => {
      counter.textContent = '0';
    });
  }
  
  
  function animateCounters() {
    const counters = document.querySelectorAll('.banner-item h3');
    
    counters.forEach((counter, index) => {
      const target = parseInt(originalValues[index].replace('+', '')) || counterConfigs[index].target;
      const duration = counterConfigs[index].duration;
      
      animateCounter(counter, target, duration);
    });
  }
  
  
  function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    
    if (element.timer) clearInterval(element.timer);
    
    element.timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(element.timer);
        current = target;
        element.textContent = Math.floor(current) + '+';
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
  
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        
        animateCounters();
      } else {
        
        resetCounters();
      }
    });
  }, {
    threshold: 0.5 
  });
  
  
  if (sobreSection) {
    observer.observe(sobreSection);
  }
  
  
  resetCounters();
});
let inputs = document.querySelectorAll('form .campo'),
    paragraphs = document.querySelectorAll('form .alert-msg'),
    submitButton = document.querySelector('form .btn-submit')


const form = document.getElementById('signup-form'),
    Modalcontainer = document.getElementById('alert'),
    msgModal = document.getElementById('alert-message'),
    triangleIcon = document.getElementById('triangle-alert'),
    badgeIcon = document.getElementById('badge-check'),
    closeBtn = document.querySelector('.close-button'),
    confirmBtn = document.getElementById('alert-confirm')

function exibeModal(message) {
    msgModal.textContent = message
    Modalcontainer.style.display = 'flex'

    function fechaModal() {
        Modalcontainer.style.display = 'none'
    }

    confirmBtn.addEventListener('click', fechaModal)
    closeBtn.addEventListener('click', fechaModal)

    window.addEventListener('click', event => {
        if (event.target === Modalcontainer) {
            fechaModal()
        }
    })
}