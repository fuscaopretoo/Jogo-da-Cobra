const tela = document.getElementById("tela");
const contexto = tela.getContext("2d");

const tamanhoBloco = 20;
const totalBlocos = Math.floor(tela.width / tamanhoBloco);

const spanPontuacao = document.querySelector("#painel-controle span");
const somComer = new Audio("./audio/somPontos.mp3");
const musicaFundo = new Audio("./audio/Hino do Palmeiras.mp3");
musicaFundo.volume = 0.1;
musicaFundo.loop = true;

let cobrinha = [{ x: 5, y: 5 }];
let direcao = "direita";
let comida = { x: 0, y: 0 };
let pontuacao = 0;
let jogoAtivo = false;
let tempoAtualizacao = 250;
let timeoutId = null;

function iniciarJogo() {
    const dificuldade = document.getElementById("Dificuldade").value;
    if (dificuldade === "facil") tempoAtualizacao = 250;
    else if (dificuldade === "medio") tempoAtualizacao = 120;
    else if (dificuldade === "dificil") tempoAtualizacao = 60;

    jogoAtivo = true;
    pontuacao = 0;
    spanPontuacao.textContent = pontuacao;
    cobrinha = [{ x: 5, y: 5 }];
    direcao = "direita";
    gerarComida();

    // Tocar música de fundo com tratamento de erro
    musicaFundo.currentTime = 0;
    musicaFundo.play().catch(() => {
        alert("Clique novamente em 'Iniciar Jogo' para liberar o áudio!");
    });

    if (timeoutId) clearTimeout(timeoutId);

    atualizar();
}

function gerarComida() {
    comida.x = Math.floor(Math.random() * totalBlocos);
    comida.y = Math.floor(Math.random() * totalBlocos);
}

function mudarDirecao(evento) {
    switch (evento.key) {
        case "ArrowUp":
            if (direcao !== "baixo") direcao = "cima";
            break;
        case "ArrowDown":
            if (direcao !== "cima") direcao = "baixo";
            break;
        case "ArrowLeft":
            if (direcao !== "direita") direcao = "esquerda";
            break;
        case "ArrowRight":
            if (direcao !== "esquerda") direcao = "direita";
            break;
    }
}

function atualizar() {
    if (!jogoAtivo) {
        musicaFundo.pause();
        return;
    }

    contexto.clearRect(0, 0, tela.width, tela.height);
    desenharCenario();
    desenharCobra();
    desenharComida();

    const cabeca = { x: cobrinha[0].x, y: cobrinha[0].y };

    switch (direcao) {
        case "cima":
            cabeca.y--;
            break;
        case "baixo":
            cabeca.y++;
            break;
        case "esquerda":
            cabeca.x--;
            break;
        case "direita":
            cabeca.x++;
            break;
    }

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        spanPontuacao.textContent = pontuacao;
        gerarComida();
        somComer.currentTime = 0;
        somComer.play().catch(() => {});
    } else {
        cobrinha.pop();
    }

    cobrinha.unshift(cabeca);

    if (
        cabeca.x < 0 || cabeca.x >= totalBlocos ||
        cabeca.y < 0 || cabeca.y >= totalBlocos ||
        colisaoComCobra(cabeca)
    ) {
        jogoAtivo = false;
        musicaFundo.pause();
        alert("Game Over! Sua pontuação foi: " + pontuacao);
    } else {
        timeoutId = setTimeout(atualizar, tempoAtualizacao);
    }
}

function colisaoComCobra(cabeca) {
    for (let i = 1; i < cobrinha.length; i++) {
        if (cobrinha[i].x === cabeca.x && cobrinha[i].y === cabeca.y) {
            return true;
        }
    }
    return false;
}

function desenharCenario() {
    const cor1 = "#0B4F3A"; // verde mais escuro (linha)
    const cor2 = "#005820"; // verde Palmeiras (linha)
    const tamanho = tamanhoBloco;

    for (let y = 0; y < tela.height / tamanho; y++) {
        contexto.fillStyle = y % 2 === 0 ? cor1 : cor2;
        contexto.fillRect(0, y * tamanho, tela.width, tamanho);
    }
}

function desenharCobra() {
    for (let i = 0; i < cobrinha.length; i++) {
        contexto.save();
        contexto.fillStyle = i === 0 ? "#A3D9A5" : "#27ae60";
        contexto.lineWidth = 3;
        contexto.strokeStyle = i === 0 ? "#C9B037" : "#FFFFFF";
        contexto.fillRect(
            cobrinha[i].x * tamanhoBloco,
            cobrinha[i].y * tamanhoBloco,
            tamanhoBloco, tamanhoBloco
        );
        contexto.strokeRect(
            cobrinha[i].x * tamanhoBloco,
            cobrinha[i].y * tamanhoBloco,
            tamanhoBloco, tamanhoBloco
        );
        contexto.restore();
    }
}

function desenharComida() {
    // Bola dourada com brilho
    contexto.save();
    contexto.beginPath();
    contexto.arc(
        comida.x * tamanhoBloco + tamanhoBloco / 2,
        comida.y * tamanhoBloco + tamanhoBloco / 2,
        tamanhoBloco / 2.2,
        0, 2 * Math.PI
    );
    contexto.fillStyle = "#C9B037";
    contexto.shadowColor = "#fffbe6";
    contexto.shadowBlur = 16;
    contexto.fill();
    contexto.lineWidth = 2;
    contexto.strokeStyle = "#C9B037";
    contexto.stroke();
    contexto.restore();
}

document.addEventListener("keydown", mudarDirecao);
document.querySelector("button").addEventListener("click", iniciarJogo);