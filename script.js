document.addEventListener("DOMContentLoaded", () => {
  const galo = document.getElementById("galo-audio");
  let intervalo;
  let indice = 0;
  let treino = [];
  let tempoRestante = 0;
  let emPausa = false;
  let nomeUsuario = "";

  document.getElementById("entrar-app").addEventListener("click", () => {
    const input = document.getElementById("nome-usuario");
    nomeUsuario = input.value.trim();

    if (!nomeUsuario) {
      alert("Por favor, digite seu nome para começar.");
      return;
    }

    document.getElementById("boas-vindas").classList.add("fade-out");
  });

  function mensagemFinal(texto) {
    return nomeUsuario ? `Parabéns, ${nomeUsuario}! ${texto}` : texto;
  }

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

  function gerarSegmentos(qtd, barraId = "barra-progresso") {
    const barra = document.getElementById(barraId);
    if (!barra) return;
    barra.innerHTML = "";
    for (let i = 0; i < qtd; i++) {
      const seg = document.createElement("div");
      seg.classList.add("segmento");
      barra.appendChild(seg);
    }
  }

  function iniciarTreino() {
    treino = treinoPadrao;
    indice = 0;
    emPausa = false;
    gerarSegmentos(treino.length, "barra-progresso");
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
    emPausa = false;
    gerarSegmentos(treino.length, "barra-progresso-personalizado");
    iniciarExecucao();
  }

  function iniciarExecucao() {
    clearInterval(intervalo);
    document.getElementById("final-treino").style.display = "none";
    executarExercicio();
  }

  function executarExercicio() {
    if (indice >= treino.length) {
      document.querySelector(".tab-content.active .exercicio").textContent = mensagemFinal("Treino finalizado! 🎉");
      document.querySelector(".tab-content.active .cronometro").textContent = "00:00";
      document.querySelector(".tab-content.active .progresso").textContent = "";
      document.getElementById("final-treino").style.display = "block";
      return;
    }

    const segmentos = document.querySelectorAll(".tab-content.active .segmento");
    segmentos.forEach((seg, i) => {
      seg.classList.toggle("ativo", i === indice);
    });

    const atual = treino[indice];
    tempoRestante = atual.tempo;
    document.querySelector(".tab-content.active .exercicio").textContent = atual.nome;
    document.querySelector(".tab-content.active .progresso").textContent = `Exercício ${indice + 1} de ${treino.length}`;
    galo.pause();
    galo.currentTime = 0;
    galo.play();

    intervalo = setInterval(() => {
      if (!emPausa) {
        document.querySelector(".tab-content.active .cronometro").textContent = formatarTempo(tempoRestante);
        tempoRestante--;

        if (tempoRestante < 0) {
          clearInterval(intervalo);
          indice++;
          executarExercicio();
        }
      }
    }, 1000);
  }

  function iniciarTreinoIntervalado() {
    const tempoTiro = parseInt(document.getElementById("tempo-tiro").value);
    const tempoDescanso = parseInt(document.getElementById("tempo-descanso").value);
    const quantidadeCiclos = parseInt(document.getElementById("quantidade-ciclos").value);

    if (isNaN(tempoTiro) || tempoTiro <= 0 || tempoTiro > 300) {
      alert("Tempo do tiro inválido. Use entre 1 e 300 segundos.");
      return;
    }
    if (isNaN(tempoDescanso) || tempoDescanso <= 0 || tempoDescanso > 300) {
      alert("Tempo de descanso inválido. Use entre 1 e 300 segundos.");
      return;
    }
    if (isNaN(quantidadeCiclos) || quantidadeCiclos <= 0 || quantidadeCiclos > 50) {
      alert("Quantidade de ciclos inválida. Use entre 1 e 50.");
      return;
    }

    let cicloAtual = 1;
    let emTiro = true;
    tempoRestante = tempoTiro;
    emPausa = false;

    gerarSegmentos(quantidadeCiclos * 2, "barra-progresso-hiit");
    clearInterval(intervalo);
    document.getElementById("final-treino").style.display = "none";
    document.querySelector(".tab-content.active .exercicio").textContent = `Tiro ${cicloAtual} de ${quantidadeCiclos}`;
    document.querySelector(".tab-content.active .progresso").textContent = "Tiro em andamento";
    galo.pause();
    galo.currentTime = 0;
    galo.play();

    intervalo = setInterval(() => {
      if (!emPausa) {
        document.querySelector(".tab-content.active .cronometro").textContent = formatarTempo(tempoRestante);
        tempoRestante--;

        const segmentos = document.querySelectorAll("#barra-progresso-hiit .segmento");
        const posicao = (cicloAtual - 1) * 2 + (emTiro ? 0 : 1);
        segmentos.forEach((seg, i) => {
          seg.classList.toggle("ativo", i === posicao);
        });

        if (tempoRestante < 0) {
          if (emTiro) {
            emTiro = false;
            tempoRestante = tempoDescanso;
            document.querySelector(".tab-content.active .exercicio").textContent = `Descanso ${cicloAtual} de ${quantidadeCiclos}`;
            document.querySelector(".tab-content.active .progresso").textContent = "Descanso em andamento";
          } else {
            cicloAtual++;
            if (cicloAtual > quantidadeCiclos) {
              clearInterval(intervalo);
              document.querySelector(".tab-content.active .exercicio").textContent = mensagemFinal("Treino intervalado finalizado! 🎉");
              document.querySelector(".tab-content.active .cronometro").textContent = "00:00";
              document.querySelector(".tab-content.active .progresso").textContent = "";
              document.getElementById("final-treino").style.display = "block";
              return;
            }
            emTiro = true;
            tempoRestante = tempoTiro;
            document.querySelector(".tab-content.active .exercicio").textContent = `Tiro ${cicloAtual} de ${quantidadeCiclos}`;
            document.querySelector(".tab-content.active .progresso").textContent = "Tiro em andamento";
          }
          galo.pause();
          galo.currentTime = 0;
          galo.play();
        }
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

  function pausarTreino() {
    emPausa = true