// Animação dos cards em 3d
const cards = document.querySelectorAll(".card");
const maxAngle = 12; // Ângulo máximo de inclinação

cards.forEach((card) => {
  card.style.transition = "transform 200ms ease, box-shadow 200ms ease";
  card.style.willChange = "transform, box-shadow"; // melhora composição

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    // perspective vem do pai (#cards), aqui só rotações
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    card.style.boxShadow = `0 ${20 + Math.abs(rotateX)}px ${
      40 + Math.abs(rotateY)
    }px rgba(0,0,0,0.6)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
  });
});
// Fim da animação dos cards em 3d

// Função para abrir o perfil do membro
function abrirPerfil(
  nome,
  twitch,
  frase,
  cor,
  avatar,
  fundoSecao1,
  fundoSecao2,
  fundoSecao3,
  fundoSecao4,
  sobre,
  discord,
  instagram
) {
  const params = new URLSearchParams({
    nome,
    twitch,
    frase,
    cor,
    avatar,
    fundoSecao1: fundoSecao1 || "",
    fundoSecao2: fundoSecao2 || "",
    fundoSecao3: fundoSecao3 || "",
    fundoSecao4: fundoSecao4 || "",
    sobre: sobre || "",
    discord: discord || "",
    instagram: instagram || "",
  });
  window.location.href = `membro.html?${params.toString()}`;
}

function voltarComReload() {
  history.back();
  // Espera a navegação voltar e recarrega
  setTimeout(() => window.location.reload(), 150);
}
