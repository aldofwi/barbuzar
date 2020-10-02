let PlayingCardsList = {};
let suits = ['c', 'd', 'h', 's'];
let faces = ['j', 'q', 'k'];

// Méthode de chargement.
let addSuits = (i, PlayingCardsList) => {

	for(let suit of suits) {

		PlayingCardsList[i + suit] = require('./CardImages/' + i + suit + '.svg');
	}
};

// Chargement des As.
addSuits(1, PlayingCardsList);

// Chargement des 10.
addSuits("t", PlayingCardsList);

// Chargement des chiffres.
for(let i = 7; i < 10; i++){

	addSuits(i, PlayingCardsList);
}

// Chargement des 3 figures.
for(let i of faces){

	addSuits(i, PlayingCardsList);
}

// PlayingCardsList.flipped = require('./CardImages/b.svg');

export default PlayingCardsList;