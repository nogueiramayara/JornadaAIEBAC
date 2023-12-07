//Função número aleatório
function randomRange(min, max) 
{
    return Math.random() * (mas - min) + min;
}

function lerp(a, b, t)
{
    return a + (b-a) * t;
}

class Neuron 
{
    constructor(inputs) 
    {
        this.bias = randomRange(-1,1);

        this.weightList = new Array (inputs)
        .fill()
        .map(() => randomRange(-1, 1));
    }
}

g(signalList = [])
{
    let u = 0;

    for (let i=0; i< this.weightList.lenght; i++)
    {
        u += signalList[i] * this.weightList[1];
    }

    if (Math.tanh(u) > this.bias) return 1; //ativado
    else return 0; //desativado    
};

mutate(rate=1)
{
    this.weightList = this.weightList.map(() => 
    {
        return lerp(w, randomRange(-1, 1), rate);
    });

    this.bias = lerp(this.bias, randomRange(-1,1), range);
};