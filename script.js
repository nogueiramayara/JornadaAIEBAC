//esse é o nosso script de treinamento
import utils from './utils.js';
import RNA from './RNA.js';
import controls from './controls.js';

//quantos dinos por geração
const SAMPLES = 5
//faz com que a nossa ia sempre execute o jogo
const game = Runner.instance_;
//cada geração será uma lista e cada dino tem um número
let dinoList = []
let dinoIndex = 0

//calculando a melhor rna da rede neural
//a diferença entre o 0 e o null é que o 0 ainda é um valor
let bestScore = 0;
let bestRNA = null;

//função para sempre carregar o melhor dino da geração anterior
//criando um novo dino com uma nova camada. Aqui criamos uma nova lista de dinos com 3 camadas de neurônios.
//aqui aplicamos também a mutação (valor o,5)
function fillDinoList () {
    for (let i=0; i < SAMPLES; i++) {
        dinoList[i] = new RNA (3, [10, 10, 2])
        dinoList[i].load(bestRNA)
        if (i > 0) dinoList[i].mutate(0.5)
    }
    console.log('Lista de dinossauros criada!')
}

//aqui estamos pedindo para o dinossauro sempre dar um pulo ao ver um cacto
//estamos dando os controles do js para a IA
setTimeout(() => {
    fillDinoList()
    controls.dispatch('jump')
}, 1000)

//aqui estamos verificando se o jogo está ativado
//se o dino atual for melhor que o anterior, ele sobrescreve (na func if game.crashed)
setInterval(() => {
    if (!game.activated) return

    const dino = dinoList[dinoIndex]

    if (game.crashed) {
        if (dino.score > bestScore) {
            bestScore = dino.score
            bestRNA = dino.save()
            console.log('Melhor pontuação:', bestScore)
        }
        dinoIndex++;
//verificando se todos os dinossauros foram avaliados    
        if (dinoIndex === SAMPLES) {
            fillDinoList();
            dinoIndex = 0;
            bestScore = 0;
        }
    game.restart()
    }

    const {tRex, horizon, currentSpeed, distanceRun, dimensions} = game
    dino.score = distanceRan - 2000 //calculando a pontuação do dino

    const player = {
        x: tRex.xPos, //posição em x
        y: tRex.yPos,
        speed: currentSpeed
    };
//a questão da posição localização dos obstáculos é porque a ia precisa aprender essa questão de saber onde o obstáculo está, para saber quando pular para evitá-lo
    const [obstacle] = horizon.obstacles
    .map((obstacle) => {
        return {
            x: obstacle.xPos,
            y: obstacle.yPos
        }
    })
    .filter((obstacle) => obstacle.x > player.x)

    if (obstacle) {
        const distance = 1 - (utils.getDistance(player, obstacle) / dimensions.WIDTH);
        const speed = player.speed / 6
        const height = Math.tanh(105 - obstacle.y)

        const [jump, crounch] = dino.compute([
            distance,
            speed,
            height,
        ]);

        if (jump === crouch) return
        if (jump) controls.dispatch('jump')
        if (crouch) controls.dispatch('crouch')
    };
}, 100);

/* const s = document.createElement('script');
s.type = 'module';
s.src = 'http://localhost:5500/script.js';
document.body.appendChild(s); */
