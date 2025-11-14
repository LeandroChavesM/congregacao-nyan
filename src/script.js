// =========================================================================
// LÓGICA DE FOCO E 3D (APENAS DESKTOP)
// =========================================================================
let cardFocado = null;
const desktopQuery = window.matchMedia("(min-width: 768px)");
const cards = document.querySelectorAll(".card");
const maxAngle = 12; // Ângulo máximo de inclinação para o 3D

function aplicarLogicaDesktop() {
  // 1. CONDICIONAL DE DESKTOP E LIMPEZA (Mobile/Desktop)
  if (!desktopQuery.matches) {
    if (cardFocado) {
      cardFocado.classList.remove("foco");
      cardFocado.style.transform = "";
      cardFocado.style.boxShadow = "";
      cardFocado.style.zIndex = "";
      cardFocado.style.transition = "";
      cardFocado = null;
    }
    // Remove os event listeners do JS em mobile para não interferir
    cards.forEach((card) => {
      card.onclick = null;
      card.onmousemove = null;
      card.onmouseleave = null;
    });
    document.body.onclick = null;
    return;
  }

  // 2. ADICIONA EVENT LISTENERS APENAS EM DESKTOP
  cards.forEach((card) => {
    // Define a transição inicial do JS (importante para o hover/descanso)
    card.style.transition = "transform 600ms ease, box-shadow 600ms ease";
    card.style.willChange = "transform, box-shadow, width, height, top, left";

    // LÓGICA DE FOCO (Clique)
    card.onclick = (e) => {
      if (e.target.classList.contains("verperfil")) return;
      if (cardFocado === card) return; // Se já está focado, não faz nada

      // DESFOQUE O CARD ANTIGO (se existir)
      if (cardFocado !== null) {
        cardFocado.classList.remove("foco");

        // Limpa o transform inline para que o CSS do :hover/baralho reassuma
        cardFocado.style.transform = "";
        cardFocado.style.boxShadow = "";
        cardFocado.style.zIndex = "auto";
        cardFocado.style.transition =
          "transform 600ms ease, box-shadow 600ms ease";
      }

      // FOCA O CARD CLICADO
      card.classList.add("foco");
      cardFocado = card;

      // Prepara o card para o 3D
      card.style.transition = "none"; // Desativa transição para 3D instantâneo
      card.style.zIndex = 1000;

      // Aplica o transform inicial de FOCO
      card.style.transform = "translate(-50%, -50%) translateZ(0)";
    };

    // Animação 3D (APENAS se o card estiver FOCADO) - CORREÇÃO FLICKER
    card.onmousemove = (e) => {
      if (cardFocado !== card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      // ⭐️ CLAMPEAMENTO (CLAMPING): Limita o valor da rotação para não exceder maxAngle
      // Isso previne que o cálculo vá para valores extremos nos cantos ou fora do card
      const clampedRotateX = Math.min(Math.max(rotateX, -maxAngle), maxAngle);
      const clampedRotateY = Math.min(Math.max(rotateY, -maxAngle), maxAngle);

      const focoTransform = "translate(-50%, -50%)";

      // Aplica os valores clampeados
      card.style.transform = `perspective(1000px) ${focoTransform} rotateX(${clampedRotateX}deg) rotateY(${clampedRotateY}deg) translateZ(0)`;

      // Ajusta a sombra usando os valores clampeados
      card.style.boxShadow = `0 ${20 + Math.abs(clampedRotateX)}px ${
        40 + Math.abs(clampedRotateY)
      }px rgba(0,0,0,0.6)`;
    };

    // MOUSELEAVE (Retorna ao estado FOCADO sem 3D)
    card.onmouseleave = () => {
      if (cardFocado === card) {
        // Volta ao estado de foco sem 3D (apenas a centralização)
        card.style.transform = "translate(-50%, -50%) translateZ(0)";
        card.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.9)";
        return;
      }
    };
  });

  // Clique fora do card para desativar o foco
  document.body.onclick = (e) => {
    if (cardFocado && !e.target.closest(".card")) {
      cardFocado.classList.remove("foco");

      // Limpa o transform inline para que o CSS do :hover/baralho reassuma
      cardFocado.style.transform = "";
      cardFocado.style.boxShadow = "";
      cardFocado.style.transition =
        "transform 600ms ease, box-shadow 600ms ease";
      cardFocado = null;
    }
  };
}

// Inicialização da lógica e monitoramento do media query
aplicarLogicaDesktop();
desktopQuery.addEventListener("change", aplicarLogicaDesktop);

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

// const rotateX = ((centerY - y) / centerY) * maxAngle;
// const rotateY = ((x - centerX) / centerX) * maxAngle;

//     // perspective vem do pai (#cards), aqui só rotações
//   card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
//   card.style.boxShadow = `0 ${20 + Math.abs(rotateX)}px ${
//     40 + Math.abs(rotateY)
//   }px rgba(0,0,0,0.6)`;
// });

//   card.addEventListener("mouseleave", () => {
//     card.style.transform = `rotateX(0deg) rotateY(0deg)`;
//     card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
//   });
// });
// Fim da animação dos cards em 3d

// Objeto de dados centralizado dos membros
window.MEMBROS = {
  TenyTe: {
    twitch: "maruxisd",
    frase: "Platinador de soulslike",
    cor: "#791becff",
    avatar: "maruxisd.png",
    fundos: {
      mobile: ["ubelFundoMob.jpg", "ubelFundomob2.jpg"],
      desktop: ["ubelFundoDesk2.jpg", "ubelFundoDesk.webp"],
    },
    sobre: "Gosta de um gacha e soulslikes, principalmente Elden Ring",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: LISTA DE STRINGS
    jogos: [
      { nome: "", fundo: "dofus.png" },
      { nome: "", fundo: "poe1.jpg" },
      { nome: "", fundo: "cs2.jpg" },
      { nome: "", fundo: "darksouls1r.avif" },
      { nome: "", fundo: "darksouls2.jpg" },
      { nome: "", fundo: "darksouls3.jpg" },
    ],
  },
  // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
  Maru: {
    twitch: "maruxisd",
    frase: "Platinador de soulslike",
    cor: "#7f79f0ff",
    avatar: "maruxisd.png",
    fundos: {
      mobile: ["frierenfundo.jpg", "frierenFundoMobile.jpg"],
      desktop: ["frierenFundo3.jpg", "frierenFundoDesktop.jpg"],
    },
    sobre: "Gosta de um gacha e soulslikes, principalmente Elden Ring",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: LISTA DE STRINGS
    jogos: [
      { nome: "", fundo: "genshinCard.avif" },
      { nome: "", fundo: "lol.jpg" },
      { nome: "", fundo: "thewitcherCard.jpg" },
      { nome: "", fundo: "eldenringCard.jpg" },
      { nome: "", fundo: "cyberpunkCard.jpg" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
    clips: [
      // Substitua 'ExemploClipSlug1' pelo slug real do seu clipe
      {
        slug: "RenownedDullCrabRiPepperonis-IuU3wcbxr5NOl6Ag",
        titulo: "TIGRESAAAAAAA",
      },
      {
        slug: "BloodyExuberantMetalFrankerZ-JX0VB0h6nIDHvWz8",
        titulo: "Susto",
      },
      {
        slug: "PiercingThoughtfulHippoCoolStoryBob-qPzPYuC77bhtazAz",
        titulo: "IMAGINA MATA ALGUEM??",
      },
    ],
  },
  Yksin: {
    twitch: "yksin_",
    frase:
      "Ex melhor jogador de soulslike da América Latina (é o que ele acha)",
    cor: "#e91e63",
    avatar: "avatar-ana.jpg",
    fundos: {
      mobile: ["fern.webp", "fern2.jpg"],
      desktop: ["fernFundoDesk.jpg", "fundoFern.jpg"],
    },
    sobre: "Gosta de conversar com o chat e jogar cozy games",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: Lista de Objetos com nome e fundo (se for usar)
    jogos: [
      { nome: "", fundo: "genshinCard.avif" },
      { nome: "Chaos Zero Nightmare", fundo: "cznCard.jpg" },
      { nome: "", fundo: "wuwa.jpg" },
      { nome: "", fundo: "darksouls3.jpg" },
      { nome: "", fundo: "over.jpg" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
    clips: [
      // Substitua 'ExemploClipSlug1' pelo slug real do seu clipe
      {
        slug: "StylishSweetOrangePraiseIt-SyhB7O0knkIwBMvf",
        titulo: "Chuva de Gemas",
      },
      { slug: "ExemploClipSlug2", titulo: "A Vitória mais Suada" },
    ],
  },
  Ban: {
    twitch: "yksin_",
    frase:
      "Ex melhor jogador de soulslike da América Latina (é o que ele acha)",
    cor: "#f8e621ff",
    avatar: "avatar-ana.jpg",
    fundos: {
      mobile: ["landFundoMob.jpg", "landCard.jpg"],
      desktop: ["landFundoDesk.webp", "landFundoMob2.jpg"],
    },
    sobre: "Gosta de conversar com o chat e jogar cozy games",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: Lista de Objetos com nome e fundo (se for usar)
    jogos: [
      { nome: "", fundo: "genshinCard.avif" },
      { nome: "", fundo: "darksouls1r.avif" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
  },
  // Você adicionará outros membros aqui no futuro...
  Fuzer: {
    twitch: "",
    frase: "Elden ring kkj",
    cor: "#caf468ff",
    avatar: "maruxisd.png",
    fundos: {
      mobile: ["starkFundoDesk.jpg", "starkFundoDesk2.jpeg"],
      desktop: ["starkFundoDesk.jpeg", "starkFundoDesk2.jpeg"],
    },
    sobre: "jogador de elden ring kkkj",
    discord: "https://discord.gg", // Substitua pelo link real
    instagram: "https://instagram.com", // Substitua pelo link real
    // JOGOS: LISTA DE STRINGS
    jogos: [
      { nome: "", fundo: "eldenringCard.jpg" },
      { nome: "", fundo: "genshinCard.avif" },
      { nome: "", fundo: "lol.jpg" },
      { nome: "", fundo: "cs2.jpg" },
    ],
    // CLIPES: Lista de Objetos com o slug (ID do clipe) e título (opcional)
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
