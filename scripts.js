let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioCtx) {
        console.warn("Áudio não iniciado ainda. Clique na tela primeiro.");
        return;
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'menu') {
        // Som de clique no menu
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    }
    else if (type === 'collision') {
        // Som de batida entre jogadores
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.25);
    }
    else if (type === 'hover') {
        // Som sutil ao passar o mouse (opcional)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
}

// Ativa o áudio no primeiro clique ou toque do jogador (OBRIGATÓRIO!)
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// Som ao clicar no menu
document.getElementById('botaoJogar').addEventListener('click', () => {
    playSound('menu');
    // aqui você coloca o código pra começar o jogo
});

document.getElementById('botaoOpcoes').addEventListener('click', () => {
    playSound('menu');
    // abre tela de opções
});

// Som ao passar o mouse (opcional, fica mais profissional)
document.querySelectorAll('button').forEach(botao => {
    botao.addEventListener('mouseenter', () => playSound('hover'));
});
if (colisaoEntre(player1, player2)) {
    playSound('collision');
    // diminui vida, empurra jogador, etc.
}