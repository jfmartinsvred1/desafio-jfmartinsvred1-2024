const especiesPermitidas = [
    { nome: "leao", tamanho: 3, bioma: ["savana"], carnivoro: true },
    { nome: "leopardo", tamanho: 2, bioma: ["savana"], carnivoro: true },
    { nome: "crocodilo", tamanho: 3, bioma: ["rio"], carnivoro: true },
    { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
    { nome: "gazela", tamanho: 2, bioma: ["savana"], carnivoro: false },
    { nome: "hipopotamo", tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
]
class Recinto {
    Numero;
    Bioma;
    TamanhoTotal;
    Animais
    constructor(numero, bioma, tamanhoTotal, animais) {
        this.Numero = numero,
            this.Bioma = bioma,
            this.TamanhoTotal = tamanhoTotal,
            this.Animais = animais
    }
}

class Resposta {
    erro
    recintosViaveis
    constructor(erro, recintosViaveis) {
        this.erro = erro,
            this.recintosViaveis = recintosViaveis

    }
}

class RecintosZoo {
    Recintos
    constructor() {
        this.Recintos = [
            new Recinto(1, ["savana"], 10, [
                { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
                { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
                { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            ]),
            new Recinto(2, ["floresta"], 5, []),
            new Recinto(3, ["savana", "rio"], 7, [{ nome: "gazela", tamanho: 2, bioma: ["savana"], carnivoro: false }]),
            new Recinto(4, ["rio"], 8, []),
            new Recinto(5, ["savana"], 9, [{ nome: "leao", tamanho: 3, bioma: ["savana"], carnivoro: true }])

        ]

    }
    analisaRecintos(animal, quantidade) {
        if (!this.especiePermitida(animal)) {
            return new Resposta("Animal inválido", false);
        }
        if (!this.quantidadePermitida(quantidade)) {
            return new Resposta("Quantidade inválida", false)
        }
        if (this.verificaEspacoRecintos(animal, quantidade) == false) {
            return new Resposta("Não há recinto viável", false)
        }
        else {
            return new Resposta(false, this.verificaEspacoRecintos(animal, quantidade))
        }


    }

    especiePermitida(animal) {
        const existe = especiesPermitidas.find((a) => a.nome === animal.toLowerCase())
        return existe ? true : false
    }


    quantidadePermitida(quantidade) {
        return quantidade > 0 ? true : false
    }
    verificaNaoCarnivoros(ani, animais,qnt) {
        const animal = especiesPermitidas.find((a) => a.nome === ani.toLowerCase());
        let response = true;

        if (animal.nome === "macaco" && animais.Animais.length === 0 && qnt<2) {
            return false;
        }

        animais.Animais.map((a) => {
            if (!animal.carnivoro && a.carnivoro) {
                response = false;
            }
        });
        return response;
    }
    verificaCarnivoros(ani, animais) {
        const animal = especiesPermitidas.find((a) => a.nome === ani.toLowerCase());

        if (animal.carnivoro && animais.Animais.length > 0) {
            const mesmoAnimal = animais.Animais.every((a) => a.nome === animal.nome.toLowerCase());
            return mesmoAnimal ? true : false;
        }
        return true;
    }
    verificaBiomas(animal, recinto) {
        const biomasAnimal = especiesPermitidas.find(a => a.nome === animal.toLowerCase()).bioma
        let response = false;
        recinto.Bioma.map((biomaRecinto) => {
            biomasAnimal.map((biomaAnimal) => {
                if (biomaAnimal === biomaRecinto) {
                    response = true
                }
            })
        })
        return response

    }
    verificaHipopotamo(animal, recinto) {
        const hipopotamo = animal.toLowerCase() === 'hipopotamo';
        const temEspecieDiferente = this.verificaSeTemEspecieDiferente(animal, recinto.Animais);
        
        if (hipopotamo && temEspecieDiferente) {
            return recinto.Bioma.includes("savana") && recinto.Bioma.includes("rio");
        }
        return true;
    }
    
    verificaSeTemEspecieDiferente(animal, animais) {
        let response = false
        animais.map((a) => {
            if (a.nome !== animal.toLowerCase()) {
                response = true
            }
        })
        return response
    }
    verificaEspacoRecintos(animal, qnt) {
        const numeroDosRecintosDisponiveis = [];
        const especie = especiesPermitidas.find(a => a.nome === animal.toLowerCase());
        const quantidadeNecessaria = especie.tamanho * qnt;

        this.Recintos.forEach(Recinto => {
            let tamanhoDisponivel = Recinto.TamanhoTotal;

            Recinto.Animais.forEach(animal => {
                tamanhoDisponivel -= animal.tamanho;
            });

            if (quantidadeNecessaria <= tamanhoDisponivel &&
                this.verificaBiomas(animal, Recinto) &&
                this.verificaCarnivoros(animal, Recinto) &&
                this.verificaNaoCarnivoros(animal, Recinto,qnt) &&
                this.verificaHipopotamo(animal, Recinto)
            ) {
                const outraEspecieNoRecinto = this.verificaSeTemEspecieDiferente(animal, Recinto.Animais);

                const espacoOcupado = outraEspecieNoRecinto ? quantidadeNecessaria + 1 : quantidadeNecessaria;

                if (espacoOcupado <= tamanhoDisponivel) {
                    numeroDosRecintosDisponiveis.push(
                        `Recinto ${Recinto.Numero} (espaço livre: ${tamanhoDisponivel - espacoOcupado} total: ${Recinto.TamanhoTotal})`
                    );
                }
            }
        });

        return numeroDosRecintosDisponiveis.length > 0 ? numeroDosRecintosDisponiveis : false;
    }
}
var test = new RecintosZoo()
console.log(test.analisaRecintos('macaco', 2))

export { RecintosZoo as RecintosZoo };