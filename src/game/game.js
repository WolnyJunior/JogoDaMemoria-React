let game = {

    lockMode: false,//serve para travar a carta, enquanto verifica a segunda
    firstCard: null,
    secondCard: null,

    techs: [
        'bootstrap',
        'css',
        'electron',
        'firebase',
        'html',
        'javascript',
        'jquery',
        'mongo',
        'node',
        'react'],


    setCard: function (id) {//retornará true ou false para saber se a carta ja foi virada ou não

        let card = this.cards.filter(card => card.id === id)[0];
        console.log(card);
        if (card.flipped || this.lockMode) {
            return false;
        }

        if (!this.firstCard) {
            this.firstCard = card;
            this.firstCard.flipped = true;
            return true;
        } else {
            this.secondCard = card;
            this.secondCard.flipped = true;
            this.lockMode = true;
            return true;
        }
    },

    checkMatch: function () {
        if (!this.firstCard || !this.secondCard) {
            return false;
        }

        return this.firstCard.icon === this.secondCard.icon;

    },

    clearCards: function () {

        this.firstCard = null;
        this.secondCard = null;
        this.lockMode = false;
    },

    unflipCards() {

        this.firstCard.flipped = false;
        this.secondCard.flipped = false;
        this.clearCards();
    },

    checkGameOver() {

        return this.cards.filter(card => !card.flipped).length == 0;
    },

    cards: null,//variável global

    createCardsFromTechs: function () {

        this.cards = [];

        this.techs.forEach((tech) => {

            this.cards.push(this.createPairFromTech(tech));
        })

        this.cards = this.cards.flatMap(pair => pair);
        //flatMap para criar todos os pares numa mesma array
        this.embaralharCartas();
        return this.cards;

    },

    createPairFromTech: function (tech) {//funcção para criar o par das cartas

        return [{

            id: this.createIdWithTech(tech),
            icon: tech,
            flipped: false,//alguma coisa sobre a carta estar flipada(virada)
        }, {
            id: this.createIdWithTech(tech),
            icon: tech,
            flipped: false,
        }]
    },

    createIdWithTech: function (tech) {//funcção para criar o id aleatório

        return tech + parseInt(Math.random() * 1000)
        //multiplica por 1000 pois o random gera um número entre 0 e 1.
        //parseInt para pegar um número inteiro.

    },

    embaralharCartas: function (cards) {//função para embaralhar as cartas

        let currentIndex = this.cards.length;
        let randomIndex = 0;

        while (currentIndex !== 0) {//só vai pegar cartas que ainda não foram embaralhadas

            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--;

            [this.cards[randomIndex], this.cards[currentIndex]] = [this.cards[currentIndex], this.cards[randomIndex]]
            //serve para inverter os valores das cartas
        }
    },
    
    flipCard: function (cardId, gameOverCallBack, noMatchCallBack) {
        if (this.setCard(cardId)) {
            if (this.secondCard) {
                if (this.checkMatch()) {
                    this.clearCards();
                    setTimeout(() => {
                        if (this.checkGameOver()) {
                            //GameOver
                            gameOverCallBack();
                        }
                    }, 500);
                } else {
                    setTimeout(() => {
                        //no Match - sem combinações
                        this.unflipCards();
                        noMatchCallBack();
                    }, 1000);
                };
            }
        }

    }

}

export default game;