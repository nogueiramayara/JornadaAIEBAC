//função para retornar um número aleatório
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

//interpolação linear vai encontrar valor intermediário e retornar pra gente
function lerp (a, b, t) {
  return a + (b - a) * t;
}

//classe armazena vários valores, funções e códigos
//aqui estamos construindo a cabeça da nossa IA
//o bias, é o número que vai ajudar a nossa IA a aprender. 
//Array é uma lista em js. Então aqui estamos armazenando o número gerado.
class Neuron {
    constructor(inputs) {
        this.bias = randomRange(-1, 1);
        this.weightList = new Array(inputs)
        .fill()
        .map(() => randomRange(-1, 1));
    };

//analisa a saída do neurônio, a ativação
//o lenght vai servir para calcular o tamanho da lista
    g(signalList = []) {
        let u = 0;

        for (let i = 0; i <this.weightList.length; i++) {
        u += signalList[i] * this.weightList[i];
        }

        if (Math.tanh(u) > this.bias) return 1;
        else return 0;
    }

//realizando a mutação, para gerarmos evolução e não cópias infinitas
    mutate(rate = 1) {
        this.weightList = this.weightList.map((w) => {
            return lerp(w, randomRange(-1,1), rate);
        });

        this.bias = lerp(this.bias, randomRange(-1, 1), rate);
    };
};
//a pontuação serve pra sabermos qual foi a melhor geração e qual foi o melhor neurônio dentro daquela geração
class RNA {
    constructor(inputCount = 1, levelList = []) {
        this.score = 0;

        this.levelList = levelList.map((l, i) => {
            const inputSize = i === 0 ? inputCount : levelList[i - 1];

            return new Array(l).fill().map(() => new Neuron(inputSize));
        });
    }

//calculando as saídas da RNA
//aqui a lista está sempre sendo atualizada
    compute(list = []) {
        for (let i = 0; i < this.levelList.length; i++) {
            const tempList = [];
            for (const neuron of this.levelList[i]) {
                if (list.length !== neuron.weightList.length) throw new Error("Entrada inválida");
                tempList.push(neuron.g(list));
            }
            list = tempList;
        }
        return list;
    }

//aplicando as funções
//nossa rna vai ser sempre mutada
    mutate(rate = 1) {
        for (const level of this.levelList) {
            for (const neuron of level) neuron.mutate(rate)
        }
    }

//toda vez que nossa rna for mutada, vamos carregar a rna anterior
//map servindo para criar uma nova lista utilizando a informação de uma lista original
    load(rna) {
        if (!rna) return;
        try {
            this.levelList = rna.map((neuronList) => {
                return neuronList.map((neuron) => {
                    const n = new Neuron();
                    n.bias = neuron.bias
                    n.weightList = neuron.weightList;

                    return n;
                });
            });
        } catch (e) {
            return;
        }
    }

    save() {
        return this.levelList;
    }
}
export default RNA;