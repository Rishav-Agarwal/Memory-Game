//Contains list of possible types of tile of a card
const tiles = {
    "ANCHOR": "fa-anchor",
    "BICYCLE": "fa-motorcycle",
    "BOLT": "fa-bolt",
    "BOMB": "fa-bomb",
    "CUBE": "fa-cube",
    "DIAMOND": "fa-gem",
    "LEAF": "fa-leaf",
    "PAPER_PLANE": "fa-paper-plane"
};
Object.freeze(tiles);

//List to store status of a card
const status = {
    "OPENED": "open",
    "CLOSED": "close",
    "MATCHED": "match"
};
Object.freeze(status);

//Constructor to create a card
function Card(tileType, status) {
    this.tileType = tileType;
    this.status = status;
}

//Create array of cards which stores each cards' information
let cards = [], i = 0;
for (let tile in tiles) {
    cards.push(new Card(tiles[tile], status["CLOSED"]));
    cards.push(new Card(tiles[tile], status["CLOSED"]));
    ++i;
}

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * Shuffle our card list
 * @param {*} array Card array to shuffle
 * @returns The shuffled array
 */
function shuffle(array) {
    /*
     * Shuffling the array
     */
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    /*
     *  Assign proper class(picture and status) to repective cards
     */
    let cardUL = document.querySelector('.deck');
    //console.log(cardUL);
    cards.forEach((card, i) => {
        //Get current card
        let currCard = cardUL.children[i];
        //Get the image element of card
        let currAnchor = currCard.querySelector('.fas');

        //Set the image for current card
        currAnchor.className = 'fas ' + card.tileType;

        //Set status for current card
        card.status = status.CLOSED;
        currCard.className = 'card ' + card.status;
    });

    return array;
}

//Perform action when DOM is loaded and ready to use
document.addEventListener('DOMContentLoaded', () => {
    /*
    *  All the global variables and DOM elements used throughout.
    */
    //Cards deck - unordered list
    const deck = document.querySelector('.deck');

    /*
    * Success Modal elements
    */
    //Success modal
    const modalSuccess = document.querySelector('.modal_back');
    //Success modal's moves
    const modalMoves = document.querySelector('.result_moves');
    ///Success modal's time
    const modalRating = document.querySelector('.result_rating');
    //Success modal's close
    const successModalClose = document.querySelector('.modal_close');
    //Success modal's restart
    const successModalRestart = document.querySelector('.success_restart');

    /*
    * Score panel
    */
    //Moves - span
    const spanMoves = document.querySelector('.moves');
    //Rating - unordered list
    const ulRating = document.querySelector('.stars');

    /*
    * Variables to denote status of the game
    */
    //Number of moves
    let moves = 0;
    //Stores the rating
    let rating = 3.0;
    //Stores number of cards matched
    let matched = 0;
    //Store position of previous card clicked
    let prev = null;

    //Reset/Refresh the game
    reset();

    /*
    * Define modal button actions
    */
    
    //Close modal
    successModalClose.addEventListener('click', () => {
        modalSuccess.classList.remove('visible');
        modalSuccess.classList.add('hide');
    });

    //Restart game from modal
    successModalRestart.addEventListener('click', () => {
        reset();
    });
    
    //Function to reset the game
    function reset() {
        //Hide the success/result modal
        modalSuccess.classList.remove('visible');
        modalSuccess.classList.add('hide');

        //Shuffle our cards
        cards = shuffle(cards);
        
        //Reset rating
        rating = 3.0;
        ulRating.children.item(0).className = "fas fa-star";
        ulRating.children.item(1).className = "fas fa-star";
        ulRating.children.item(2).className = "fas fa-star";

        //Reset moves
        moves = 0;
        spanMoves.textContent = moves.toString();

        //Reset matched cards
        matched = 0;

        //Reset prev card
        prev = null;

        //Get all the cards from deck
        const deckCards = deck.children;
        //Iterate trough the cards and add click listeners to them
        for (let i = 0; i < deckCards.length; ++i) {
            const currCard = deckCards.item(i);
            currCard.addEventListener('click', (event) => {
                //Log the click event
                console.log("clicked" + i);

                //If card is already opened or matched, do nothing
                if (cards[i].status != status.CLOSED)
                   return;

                //Open the clicked card
                cards[i].status = status.OPENED;
                currCard.classList.remove(status.CLOSED);
                currCard.classList.add(status.OPENED);

                //Perform action after card is opened after 500ms to allow UI update
                setTimeout(() => {
                    //If it is the first card to be opened in the pair, just store it in `prev` and return
                    if (prev == null) {
                        prev = i;
                    } else {
                        //If it's the second of the pair, continue

                        //Increment the moves and update the UI
                        ++moves;
                        spanMoves.textContent = moves.toString();
                        //If moves is greater than 38, set rating to 0.5 and update UI
                        if (moves > 38) {
                            rating = 0.5;
                            ulRating.children.item(0).className = "fas fa-star-half-alt";
                            ulRating.children.item(1).className = "far fa-star";
                            ulRating.children.item(2).className = "far fa-star";
                        } else if (moves > 30) {
                            //If moves is greater than 30, set rating to 1 and update UI
                            rating = 1.0;
                            ulRating.children.item(0).className = "fas fa-star";
                            ulRating.children.item(1).className = "far fa-star";
                            ulRating.children.item(2).className = "far fa-star";
                        } else if (moves > 24) {
                            //If moves is greater than 24, set rating to 1.5 and update UI
                            rating = 1.5;
                            ulRating.children.item(0).className = "fas fa-star";
                            ulRating.children.item(1).className = "fas fa-star-half-alt";
                            ulRating.children.item(2).className = "far fa-star";
                        } else if (moves > 20) {
                            //If moves is greater than 20, set rating to 2 and update UI
                            rating = 2.0;
                            ulRating.children.item(0).className = "fas fa-star";
                            ulRating.children.item(1).className = "fas fa-star";
                            ulRating.children.item(2).className = "far fa-star";
                        } else if (moves > 16) {
                            //If moves is greater than 16, set rating to 2.5 and update UI
                            rating = 2.5;
                            ulRating.children.item(0).className = "fas fa-star";
                            ulRating.children.item(1).className = "fas fa-star";
                            ulRating.children.item(2).className = "fas fa-star-half-alt";
                        } else {
                            //If moves is less than or equal to 16, set rating to 3 and update UI
                            rating = 3.0;
                            ulRating.children.item(0).className = "fas fa-star";
                            ulRating.children.item(1).className = "fas fa-star";
                            ulRating.children.item(2).className = "fas fa-star";
                        }

                        /*
                         *  If the card matches with previous card, set both cards' status to MATCHED
                         *  Increase the matched counter. If all cards are matched, show success modal and end the game
                         */
                        if (cards[i].tileType == cards[prev].tileType) {
                            //Current card
                            currCard.classList.remove(status.OPENED);
                            currCard.classList.remove(status.CLOSED);
                            currCard.classList.add(status.MATCHED);
                            cards[i].status = status.MATCHED;
                            //Previous card
                            deckCards.item(prev).classList.remove(status.OPENED);
                            deckCards.item(prev).classList.remove(status.CLOSED);
                            deckCards.item(prev).classList.add(status.MATCHED);
                            cards[prev].status = status.MATCHED;
                            
                            //Increase the matched counter
                            matched += 2;
                            //If all cards(16) are matched, show the success modal and end the game
                            if (matched == 16) {
                                modalMoves.textContent = moves.toString();
                                modalRating.textContent = rating.toString();
                                modalSuccess.classList.remove('hide');
                                modalSuccess.classList.add('visible');
                            }
                        } else {
                            /*
                             *  If the cards don't match, set both cards' status to CLOSED
                             */

                            //Current card
                            currCard.classList.remove(status.MATCHED);
                            currCard.classList.remove(status.OPENED);
                            currCard.classList.add(status.CLOSED);
                            cards[i].status = status.CLOSED;
                            //Previous card
                            deckCards.item(prev).classList.remove(status.MATCHED);
                            deckCards.item(prev).classList.remove(status.OPENED);
                            deckCards.item(prev).classList.add(status.CLOSED);
                            cards[prev].status = status.CLOSED;
                        }
                        //After second card's click, set previous opened card to `null`
                        prev = null;
                    }
                }, 500);
            });
        }
     }
 });