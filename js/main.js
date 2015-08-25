/* Game code goes here. */
$(document).on('ready', function(){
// Initial jQuery object creations
var gameContainer = $('.game-container');
var infoDisplay = $('.info-display');
var scoreDisplay = $('.score-display');
var guessesDisplay = $('.guesses-display');
var matchesDisplay = $('.matches-display');

/***************** Core Game Functions ****************************************/
var startGame = function(){
	console.log('Starting new game...');
	//new game status
	gameState.score = 0;
	gameState.cardsLeft = 12;
	gameState.cardsMatched = [];
	gameState.matchesMade = 0;
	gameState.guessesMade = 0;

	updateInfoDisplay();

	//Cards loading
	deck1 = shuffle(deck.slice());
	// SLICE makes copy of deck, then send into shuffle
	deck2 = shuffle(deck.slice());
	// Make a copy of each card
	gameState.cards = [].concat(deck1, deck2);
	// concat joins the 2 decks
	console.log('gameState initialized');

	//initally hide this element
	gameContainer.empty();
	infoDisplay.removeClass('hidden');

	//attach card list to gameboard
	var cardList = $('<ul>').attr({
		id: 'card-list'
	}).appendTo(gameContainer);
	buildGameBoard();
};
	//add images to cards
	var buildGameBoard = function(){
		console.log('Getting game ready');
		var cardList = $('#card-list');
		$.each(gameState.cards, function(key, card){
			var cardImagePath = 'img/deck/' + card.file;
			var newCardItem = $('<li>').attr({
				class: 'card',
				style: 'background: url("' + cardImagePath + '") top left no-repeat;background-size:contain;',
				'data-slug': card.slug,
				'data-name': card.name,
				'data-file': card.file
			});
	//card-back effect
			$('<span>').attr({
				class: 'back'
			}).appendTo(newCardItem);
			newCardItem.appendTo(cardList);

			addCardListener(newCardItem);
		});
	};

	var evaluateGuess = function(target){
		//construct a card object from current guess
		console.log('evaluating guess');
		var cardTarget = $(target.parentElement);
		var guessCard = {
			slug: cardTarget.data('slug'),
			name: cardTarget.data('name'),
			file: cardTarget.data('file')
		}
		gameState.currentGuess.push(guessCard);

		if (gameState.currentGuess.length == 2){
			console.log('evaluating selection');
			//evaluate if CurrentGuess array has 2 entries
			gameState.guessesMade += 1;

			if(gameState.currentGuess[0].slug == gameState.currentGuess[1].slug) {
			//if cards match, give points, then remove match
				console.log("Good Guess!");
				gameState.machesMade += 1;
				gameState.cardsMatched.push(gameState.currentGuess[0]);
				recalculateScore();
				updateInfoDisplay();
				deactivateMatchedCards(gameState.currentGuess[0]);
				gameState.currentGuess =[];
			}else {
				console.log('Cards do not match');
				recalculateScore();
				updateInfoDisplay();
				setTimeout( resetGuess, 1000);
		}
		}else if (gameState.currentGueess.length < 2) {
			 // If the currentGuess Array has fewer than 2 entries in it, let it keep going
        console.log('first selection of a pair');

		}else if (gameState.currentGuess.length > 2) {
			//if more than 2 guesses are made, then reset
			console.log('MORE THAN 2 GUESSES. RESET!');
			setTimeout( resetGuess, 1000);
		}
	};
	var addCardListener = function(newCardItem){
		//event listener to flip cards
		newCardItem.on('click', function(event){
			$(event.target.parentElement).find('.back').fadeout();
			evaluateGuesses(event.target);
		});
	};
	var deactivateMatchedCards = function(card){
		//After match is made, deactivatecards from play
		var matchedCards = $('li[data-slug="' + card.slug + '"].card');
		matchedCards.off('click');
		matchedCards.removeClass('card').addClass('matchedCard');
		gameState.cardsLeft = gameState.cardsLeft - (gameState.cardsMatched.length * 2);
		if (gameState.cardsLeft <=0){
			endGame();
		}
	};

	var recalculateScore = function(){
		gameState.score = (gameState.matchesMAde * 5) -
			(gameState.guessesMade * 2);
	};

	var updateInfoDisplay = function(){
		matchesDisplay.fadeOut().text(gameState.matchesMade).fadeIn();
		guessesDisplay.fadeOut().text(gameState.guessesMade).fadeIn();
		scoreDisplay.fadeOut().text(gameState.score).fadeIn();
	};
	var resetGuess = function(){
		$('li[data-slug="'+ gameState.currentGuess[0].slug + '"].back').fadeIn();
		$('li[data-slug="' + gameState.currentGuess[1].slug + '"].back').fadeIn();
		gameState.currentGuess =[];
	};

	var endGame = function(){
		var rating = "unknown";
		if (gameState.score > 20){
			rating = "3-stars";
		}else if ((gameState.score <= 20) && (gameState.score > 5)) {
			rating = "2-stars";
		}else if ((gameState.score <= 5) && (gameState.score > 0)) {
			rating = "1-star";
		}else {
			rating = "0-star";
		}
		$('#end-game-modal').modal();
		$('.final-score').text(gameState.guessesMade);
		$('.final-matches').text(gameState.matchesMade);
		$('.final-rating').text(rating);
		$('play-again').on('click', function(event){
			startGame();
			$('#end-game-modal').modal('hide');
		});
	};









	/***************** Event Listeners for Start Buttons **************************/
$('.btn-start').on('click', function(event){
    event.preventDefault();
    startGame();
});

}); // end of document ready //////////////////////////////



/***************** Initialized Data Objects and Arrays ************************/

// Define an object that will be used to store the game state during play.
var gameState = {
    score: 0, // Score is calculated with `calculateScore`
    cardsLeft: 6,
    cardsMatched: [], // Array of all the cards matched
    matchesMade: 0, // Used to calculate score: +5x
    guessesMade: 0, // Used to calculate score: -2x
    currentGuess: [], // Array used to store guesses in progress
    cards: [] // Array of cards in the game; populated by `startGame`
};
var deck = [ // An Array of card objects that can be used in the game.
    {
        slug: '1',
        name: '1',
        file: '1.jpg'
    },
    {
        slug: '2',
        name: '2',
        file: '2.jpg'
    },
    {
        slug: '3',
        name: '3',
        file: '3.jpg'
    },
    {
        slug: '4',
        name: '4',
        file: '4.jpg'
    },
    {
        slug: '5',
        name: '5',
        file: '5.jpg'
    },
    {
        slug: '6',
        name: '6',
        file: '6.jpg'
    },

];
var cardBack = { // The default card backing.
    slug: 'default',
    name: 'Default Card Back',
    file: 'woman-painting.png'
};

/***************** Helper Functions That Don't Need jQuery *******************/
function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}
