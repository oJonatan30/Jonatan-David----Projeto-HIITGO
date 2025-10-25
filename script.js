const galo = document.getElementById("galo-audio");

// Lista de exercícios padrão
const treino = [
  { nome: "Polichinelo", tempo: 30 },
  { nome: "Descanso", tempo: 15 },
  { nome: "Agachamento", tempo: 30 },
  { nome: "Descanso", tempo: 15 },
  { nome: "Corrida no lugar", tempo: 30 }
];

let indice = 0;
let tempoRestante = 0;
let intervalo;

// Inicia o treino padrão
function iniciarTreino() {
  indice = 0;
  executarExercicio();
}

// Executa cada exercício do treino padrão
function executarExercicio() {
  if (indice >= treino.length) {
    document.getElementById("exercicio").textContent = "Treino finalizado! 🎉";
    document.getElementById("cronometro").textContent = "00:00";
    return;
  }

  const atual = treino[indice];
  tempoRestante = atual.tempo;
  document.getElementById("exercicio").textContent = atual.nome;

  intervalo = setInterval(() => {
    document.getElementById("cronometro").textContent = formatarTempo(tempoRestante);
    tempoRestante--;

    if (tempoRestante < 0) {
      clearInterval(intervalo);
      indice++;
      executarExercicio();
    }
  }, 1000);
}

// Formata o tempo em mm:ss
function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

// Lista de treino personalizado
let treinoPersonalizado = [];

// Adiciona exercício à lista personalizada
function adicionarExercicio() {
  const nome = document.getElementById("nome-exercicio").value;
  const tempo = parseInt(document.getElementById("tempo-exercicio").value);

  if (!nome || isNaN(tempo) || tempo <= 0) {
    alert("Preencha os campos corretamente.");
    return;
  }

  treinoPersonalizado.push({ nome, tempo });
  atualizarLista();

  document.getElementById("nome-exercicio").value = "";
  document.getElementById("tempo-exercicio").value = "";
}

// Atualiza a lista visual
function atualizarLista() {
  const lista = document.getElementById("lista-personalizada");
  lista.innerHTML = "";
  treinoPersonalizado.forEach((ex, i) => {
    lista.innerHTML += `
      <li>
        ${i + 1}. ${ex.nome} - ${ex.tempo}s
        <button onclick="removerExercicio(${i})">Remover</button>
      </li>
    `;
  });
}

// Remove exercício da lista
function removerExercicio(indice) {
  treinoPersonalizado.splice(indice, 1);
  atualizarLista();
}

// Inicia o treino personalizado
function iniciarTreinoPersonalizado() {
  if (treinoPersonalizado.length === 0) {
    alert("Adicione pelo menos um exercício.");
    return;
  }

  indice = 0;
  tempoRestante = treinoPersonalizado[indice].tempo;

  document.getElementById("exercicio").textContent = treinoPersonalizado[indice].nome;
  document.getElementById("progresso").textContent = `Exercício ${indice + 1} de ${treinoPersonalizado.length}`;

  intervalo = setInterval(() => {
    document.getElementById("cronometro").textContent = formatarTempo(tempoRestante);
    tempoRestante--;

    if (tempoRestante < 0) {
      indice++;

      if (indice >= treinoPersonalizado.length) {
        clearInterval(intervalo);
        document.getElementById("exercicio").textContent = "Treino personalizado finalizado! 🎉";
        document.getElementById("cronometro").textContent = "00:00";
        document.getElementById("final-treino").style.display = "block";
      } else {
        galo.pause();
        galo.currentTime = 0;
        galo.play();

        tempoRestante = treinoPersonalizado[indice].tempo;
        document.getElementById("exercicio").textContent = treinoPersonalizado[indice].nome;
        document.getElementById("progresso").textContent = `Exercício ${indice + 1} de ${treinoPersonalizado.length}`;
      }
    }
  }, 1000);
}

// Reinicia o treino e limpa tudo
function reiniciarTreino() {
  clearInterval(intervalo);
  document.getElementById("final-treino").style.display = "none";
  document.getElementById("exercicio").textContent = "Clique em \"Iniciar\"";
  document.getElementById("cronometro").textContent = "00:00";
  document.getElementById("progresso").textContent = "";
  treinoPersonalizado = [];
  atualizarLista();
}
