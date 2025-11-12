// Animação dos cards em 3d + Lógica de Foco
const cards = document.querySelectorAll(".card");
const maxAngle = 12; // Ângulo máximo de inclinação para o 3D
let cardFocado = null; // Variável global para rastrear o card focado

cards.forEach((card) => {
  // 1. SALVA A TRANSFORMAÇÃO INICIAL DO CSS (PROBLEMA 1)
  // Isso deve ser feito UMA VEZ para cada card antes de qualquer evento
  const initialTransform = getComputedStyle(card).transform;
  card.dataset.initialTransform = initialTransform;

  // Adiciona as transições (como você já tem)
  card.style.willChange = "transform, box-shadow, width, height, top, left";

  // 2. LÓGICA DE FOCO (Clique) - CORRIGE ALTERNÂNCIA (PROBLEMA 3)
  card.addEventListener("click", (e) => {
    // Ignora o clique no botão de perfil
    if (e.target.classList.contains("verperfil")) return;

    // Se houver outro card focado, desfoque-o primeiro (CORREÇÃO PROBLEMA 3)
    if (cardFocado !== null) {
      cardFocado.classList.remove("foco");
      // RESTAURA o card antigo
      cardFocado.style.transform = cardFocado.dataset.initialTransform;
      cardFocado.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      cardFocado.style.zIndex = "auto";
      cardFocado.style.transition =
        "transform 1000ms ease, box-shadow 1000ms ease";
    }

    // Foca o card clicado
    card.classList.add("foco");
    cardFocado = card;

    // Desativa a transição do CSS para o 3D funcionar no mousemove
    card.style.transition = "none";
    card.style.zIndex = 1000;

    // Aplica o transform inicial de FOCO para centralizar (do CSS)
    card.style.transform = "translate(-50%, -50%)";
  });

  // 3. Animação 3D (APENAS se o card estiver FOCADO) - CORREÇÃO 3D (PROBLEMA 2)
  card.addEventListener("mousemove", (e) => {
    // ATIVA a animação 3D SOMENTE se o card estiver focado
    if (cardFocado !== card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    // COMBINAÇÃO: Transf. Foco (Centralização) + Rotação 3D do mouse
    // O focoTransform é SEMPRE o translate(-50%, -50%) no estado de FOCO
    const focoTransform = "translate(-50%, -50%)";

    card.style.transform = `perspective(1000px) ${focoTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

    // Ajusta a sombra para um efeito mais dramático no foco
    card.style.boxShadow = `0 ${20 + Math.abs(rotateX)}px ${
      40 + Math.abs(rotateY)
    }px rgba(0,0,0,0.6)`;
  });

  // 4. MOUSELEAVE (Retorna ao estado FOCADO sem 3D)
  card.addEventListener("mouseleave", () => {
    // Se o card estiver focado, remove o 3D, mas MANTÉM o FOCO/Centralização
    if (cardFocado === card) {
      // Volta ao estado de foco sem 3D (apenas a centralização)
      card.style.transform = "translate(-50%, -50%)";
      card.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.9)"; // Sombra padrão do foco
      return;
    }

    // Se não está focado, o CSS cuida do mouseleave (hover -> descanso)
  });
});

// Opcional: Clique fora do card para desativar o foco (JÁ estava correto, mas ajustado)
document.body.addEventListener("click", (e) => {
  // Se o clique não foi dentro de um card e há um card focado
  if (cardFocado && !e.target.closest(".card")) {
    cardFocado.classList.remove("foco");
    // RESTAURA a transformação do baralho (PROBLEMA 1)
    cardFocado.style.transform = cardFocado.dataset.initialTransform;
    cardFocado.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
    cardFocado.style.zIndex = "auto";
    cardFocado.style.transition =
      "transform 1000ms ease, box-shadow 1000ms ease";
    cardFocado = null;
  }
});
// Fim da animação dos cards e lógica de foco

// const cards = document.querySelectorAll(".card");
// cards.forEach((card) => {
//   card.addEventListener("mousemove", () => {
//     card.style.transform = "translateY(-10px) rotateZ(10deg)";
//   });
// });

// // Animação dos cards em 3d
// const cards = document.querySelectorAll(".card");
// const maxAngle = 12; // Ângulo máximo de inclinação

// cards.forEach((card) => {
//   card.style.transition = "transform 200ms ease, box-shadow 200ms ease";
//   card.style.willChange = "transform, box-shadow"; // melhora composição

//   card.addEventListener("mousemove", (e) => {
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((centerY - y) / centerY) * maxAngle;
//     const rotateY = ((x - centerX) / centerX) * maxAngle;

//     // perspective vem do pai (#cards), aqui só rotações
//     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
//     card.style.boxShadow = `0 ${20 + Math.abs(rotateX)}px ${
//       40 + Math.abs(rotateY)
//     }px rgba(0,0,0,0.6)`;
//   });

//   card.addEventListener("mouseleave", () => {
//     card.style.transform = `rotateX(0deg) rotateY(0deg)`;
//     card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
//   });
// });
// Fim da animação dos cards em 3d

// Objeto de dados centralizado dos membros
window.MEMBROS = {
  Ana: {
    twitch: "ana_live",
    frase: "Rainha do Just Chatting",
    cor: "#e91e63",
    avatar: "avatar-ana.jpg",
    fundoSecao1: "fern2.webp",
    fundoSecao2: "fundo2.jpg",
    fundoSecao3: "Fern.jpg",
    fundoSecao4: "fundo4.jpg",
    sobre: "Gosta de conversar com o chat e jogar cozy games",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: Lista de Objetos com nome e fundo (se for usar)
    jogos: [
      { nome: "Stardew Valley", fundo: "stardew_bg.jpg" },
      { nome: "The Sims 4", fundo: "sims_bg.jpg" },
      { nome: "Minecraft", fundo: "minecraft_bg.jpg" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
    clips: [
      // Substitua 'ExemploClipSlug1' pelo slug real do seu clipe
      { slug: "ExemploClipSlug1", titulo: "O Melhor Jumpscare" },
      { slug: "ExemploClipSlug2", titulo: "A Vitória mais Suada" },
    ],
  },
  // Você adicionará outros membros aqui no futuro...
  Maru: {
    twitch: "maruxisd",
    frase: "Platinador de soulslike",
    cor: "#4c44e4ff",
    avatar: "maruxisd.png",
    fundoSecao1: "fern2.webp",
    fundoSecao2: "fundo2.jpg",
    fundoSecao3: "Fern.jpg",
    fundoSecao4: "fundo4.jpg",
    sobre: "Gosta de um gacha e soulslikes, principalmente Elden Ring",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: LISTA DE STRINGS
    jogos: [
      { nome: "Genshin Impact", fundo: "" },
      { nome: "League of Legends", fundo: "lol.jpg" },
      { nome: "The Witcher 3", fundo: "" },
      { nome: "Elden Ring", fundo: "" },
      { nome: "Cyberpunk 2077", fundo: "" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
    clips: [
      // Substitua 'ExemploClipSlug1' pelo slug real do seu clipe
      {
        slug: "RenownedDullCrabRiPepperonis-IuU3wcbxr5NOl6Ag",
        titulo: "O Melhor Jumpscare",
      },
      { slug: "ExemploClipSlug2", titulo: "A Vitória mais Suada" },
    ],
  },
};
// Você adicionará outros membros aqui no futuro, como:
/*
  'Bruno': {
    twitch: 'bruno_stream',
    frase: 'O Deus do FPS',
    // ...
    jogos: ['Valorant', 'CS2', 'Apex Legends']
  }
  */

// Função para abrir o perfil do membro
// Simplificada para receber apenas o nome
function abrirPerfil(nome) {
  const params = new URLSearchParams({
    membro: nome, // Agora a URL terá apenas ?membro=Ana
  });
  window.location.href = `membro.html?${params.toString()}`;
}

function voltarComReload() {
  window.location.href = "index.html";
  // Espera a navegação voltar e recarrega
  setTimeout(() => window.location.reload(), 150);
}
