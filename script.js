const galo = document.getElementById("galo-audio");
let intervalo;
let indice = 0;
let treino = [];

const treinoPadrao = [
  { nome: "Polichinelo", tempo: 30 },
  { nome: "Descanso", tempo: 15 },
  { nome: "Agachamento", tempo: 30 },
  { nome: "Descanso", tempo: 15 },
  { nome: "Corrida no lugar", tempo: 30 }
];

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const restoSegundos = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(restoSegundos).padStart(2, '0')}`;
}

function iniciarTreino() {
  treino = treinoPadrao;
  indice = 0;
  iniciarExecucao();
}

function iniciarTreinoPersonalizado() {
  const lista = document.querySelectorAll("#lista-personalizada li");
  if (lista.length === 0) {
    alert("Adicione pelo menos um exercício personalizado.");
    return;
  }

  treino = [];
  lista.forEach(item => {
    const partes = item.textContent.split(" - ");
    const nome = partes[0];
    const tempo = parseInt(partes[1]);
    treino.push({ nome, tempo });
  });

  indice = 0;
  iniciarExecucao();
}

function iniciarExecucao() {
  clearInterval(intervalo);
  document.getElementById("final-treino").style.display = "none";
  executarExercicio();
}

function executarExercicio() {
  if (indice >= treino.length) {
    document.getElementById("exercicio").textContent = "Treino personalizado finalizado!";
    document.getElementById("cronometro").textContent = "00:00";
    document.getElementById("progresso").textContent = "";
    document.getElementById("final-treino").style.display = "block";
    return;
  }

  const atual = treino[indice];
  let tempoRestante = atual.tempo;
  document.getElementById("exercicio").textContent = atual.nome;
  document.getElementById("progresso").textContent = `Exercício ${indice + 1} de ${treino.length}`;
  galo.pause();
  galo.currentTime = 0;
  galo.play();

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

function adicionarExercicio() {
  const nome = document.getElementById("nome-exercicio").value;
  const tempo = parseInt(document.getElementById("tempo-exercicio").value);

  if (!nome || isNaN(tempo) || tempo <= 0) {
    alert("Preencha o nome e tempo corretamente.");
    return;
  }

  const lista = document.getElementById("lista-personalizada");
  const item = document.createElement("li");
  item.textContent = `${nome} - ${tempo}`;
  lista.appendChild(item);

  document.getElementById("nome-exercicio").value = "";
  document.getElementById("tempo-exercicio").value = "";
}

function reiniciarTreino() {
  clearInterval(intervalo);
  document.getElementById("final-treino").style.display = "none";
  document.getElementById("exercicio").textContent = "Clique em \"Iniciar\"";
  document.getElementById("cronometro").textContent = "00:00";
  document.getElementById("progresso").textContent = "";
}

function iniciarTreinoIntervalado() {
  const tempoTiro = parseInt(document.getElementById("tempo-tiro").value);
  const tempoDescanso = parseInt(document.getElementById("tempo-descanso").value);
  const quantidadeCiclos = parseInt(document.getElementById("quantidade-ciclos").value);

  if (isNaN(tempoTiro) || isNaN(tempoDescanso) || isNaN(quantidadeCiclos) ||
      tempoTiro <= 0 || tempoDescanso <= 0 || quantidadeCiclos <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  let cicloAtual = 1;
  let emTiro = true;
  let tempoRestante = tempoTiro;

  clearInterval(intervalo);
  document.getElementById("final-treino").style.display = "none";
  document.getElementById("exercicio").textContent = `Tiro ${cicloAtual} de ${quantidadeCiclos}`;
  document.getElementById("progresso").textContent = "Tiro em andamento";
  galo.pause();
  galo.currentTime = 0;
  galo.play();

  intervalo = setInterval(() => {
    document.getElementById("cronometro").textContent = formatarTempo(tempoRestante);
    tempoRestante--;

    if (tempoRestante < 0) {
      if (emTiro) {
        emTiro = false;
        tempoRestante = tempoDescanso;
        document.getElementById("exercicio").textContent = `Descanso ${cicloAtual} de ${quantidadeCiclos}`;
        document.getElementById("progresso").textContent = "Descanso em andamento";
        galo.pause();
        galo.currentTime = 0;
        galo.play();
      } else {
        cicloAtual++;
        if (cicloAtual > quantidadeCiclos) {
          clearInterval(intervalo);
          document.getElementById("exercicio").textContent = "Treino intervalado finalizado! 🎉";
          document.getElementById("cronometro").textContent = "00:00";
          document.getElementById("progresso").textContent = "";
          document.getElementById("final-treino").style.display = "block";
        } else {
          emTiro = true;
          tempoRestante = tempoTiro;
          document.getElementById("exercicio").textContent = `Tiro ${cicloAtual} de ${quantidadeCiclos}`;
          document.getElementById("progresso").textContent = "Tiro em andamento";
          galo.pause();
          galo.currentTime = 0;
          galo.play();
        }
      }
    }
  }, 1000);
}