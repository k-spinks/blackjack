document.querySelector('.new-round-btn').addEventListener('click', newRound)
document.querySelector('.hit-btn').addEventListener('click', hit)
document.querySelector('.stand-btn').addEventListener('click', stand)
document.querySelector('.reset-btn').addEventListener('click', resetAll)

document.querySelector('.player-wins').innerText ='Player wins: ' + localStorage.getItem('playerWins');
document.querySelector('.house-wins').innerText ='House wins: ' + localStorage.getItem('houseWins')

setStorage('playerHandValueStorage');
setStorage('dealerHandValueStorage');
setStorage('houseWins');
setStorage('playerWins');
setStorage('cardsDrawn');

//generates a deck and stores deck in 'deckId' in local storage
if(!localStorage.getItem('deckId')){
  fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        localStorage.setItem('deckId', data.deck_id)
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
    }else if(deckCheck()){
      shuffle();
    };

    function shuffle() {
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckId')}/shuffle/`)
      .then(response => response.json())
      .then(data => {
      console.log(`Deck shuffled successfully: ${data.remaining} cards left`);
      })
    .catch(err => {
      console.log(`error ${err}`)
      })
    }

//checks if values are in local storage if not sets a new value

function setStorage(keyName){
  if(!localStorage.getItem(keyName)){
    localStorage.setItem(keyName, 0)
  }
}

//draw 4 cards and deal 2 to each player
function newRound () {
  const playerArea = document.querySelector('.player-hand');
  const dealerArea = document.querySelector('.dealer-hand');
  const dealerHandValueData = 'dealerHandValueStorage'
  const playerHandValueData = 'playerHandValueStorage'

  clearLocalStorage()
  deckCheck()

  for(let i = 0; i < Number(localStorage.getItem('cardsDrawn')); i++){
    removeFromHand(playerArea)
    removeFromHand(dealerArea)
  }

  for (let i = 0; i < 2; i++) {
    drawCard(playerArea, playerHandValueData);
    drawCard(dealerArea, dealerHandValueData);
  }

  if(hasBlackjack(playerHandValueData)){
    document.getElementById('stand-btn').disabled = false;
    document.getAnimations('hit-btn').disabled = true;
    document.getElementById('new-round-btn').disabled = true;
    console.log('Player Has Blackjack')
  } 
  if(hasBlackjack(dealerHandValueData)){
    incrementValue(houseWins);
    document.querySelector('.house-wins').innerText ='House wins: ' + localStorage.getItem(houseWins)
  }

  document.getElementById('stand-btn').disabled = false;
  document.getElementById('new-round-btn').disabled = true;
  document.getElementById('hit-btn').disabled = false;
  
}

function drawCard(playerHand, keyName) {
  const url = `https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deckId')}/draw/?count=1`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        const cardsDrawn = 'cardsDrawn'
        const card = data.cards[0];
        addToHand(card, playerHand);
        calculateHandValue(convertFace(card.value), keyName);
        incrementValue(cardsDrawn);
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
}

//draw new card when on 'hit-btn'
function hit () {
  const playerHandValueData = 'playerHandValueStorage'
  const playerHand = document.querySelector('.player-hand');
  const houseWins = 'houseWins'
 
  if(isBust(playerHandValueData)) {
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('new-round-btn').disabled = false;
    alert('House wins!');
    incrementValue(houseWins);
    document.querySelector('.house-wins').innerText ='House wins: ' + localStorage.getItem(houseWins)
  }else{
    drawCard(playerHand, playerHandValueData); 
  }
}


//function to append card img to play area
function addToHand (card, playerHand) {
  const imgElement = document.createElement('img');

  imgElement.src = card.images.png;
  playerHand.appendChild(imgElement);
}

function removeFromHand(playerHand) {
  // Get the last child element
  const lastChild = playerHand.lastChild;

  // Check if there is a child to remove
  if (lastChild) {
    // Remove the last child
    playerHand.removeChild(lastChild);
  }
}

//checks for bust 
function isBust (currentVal) {
  return (Number(localStorage.getItem(currentVal)) > 21)
}

function hasBlackjack (currentVal) {
  return (Number(localStorage.getItem(currentVal)) === 21)
}

//function to convert aces and face cards to num val
function convertFace(faceVal){
  if(faceVal === 'ACE'){
    return 11
  }else if(faceVal === 'KING' || faceVal === 'QUEEN' || faceVal === 'JACK'){
    return 10
  }else{
    return Number(faceVal);
    }
}

//calculate current player values 
function calculateHandValue(drawnCardValue, keyName) {
  let currentVal = Number(localStorage.getItem(keyName))
  let newTotal = currentVal + drawnCardValue;
  localStorage.setItem(keyName, newTotal)
  return newTotal;
}

//dealer draws cards in 'stand'
function stand () {
  document.getElementById('hit-btn').disabled = true;
  const dealerArea = document.querySelector('.dealer-hand');
  const dealerHandValueData = 'dealerHandValueStorage'
  const playerHandValueData = 'playerHandValueStorage'
  const playerWins = 'playerWins';

    if(!dealerCheck(dealerHandValueData) || !((Number(localStorage.getItem(dealerHandValueData))) > (Number(localStorage.getItem(playerHandValueData))))
    && !isBust((dealerHandValueData))){
      drawCard(dealerArea,dealerHandValueData);
    }else if(isBust(dealerHandValueData)) {
      document.getElementById('hit-btn').disabled = true;
      document.getElementById('stand-btn').disabled = true;
      document.getElementById('new-round-btn').disabled = false;
      alert('You win!');
      incrementValue(playerWins);
      document.querySelector('.player-wins').innerText ='Player wins: ' + localStorage.getItem(playerWins)
    }else{
      calculateWinner();
    }
}

function dealerCheck (dealerHandValueData) {
  return (Number(localStorage.getItem(dealerHandValueData)) >= 17)
}

function calculateWinner() {
  const playerHandValueData = 'playerHandValueStorage'
  const dealerHandValueData = 'dealerHandValueStorage'
  const playerWins = 'playerWins'
  const houseWins = 'houseWins'

  if (Number(localStorage.getItem(playerHandValueData)) > (Number(localStorage.getItem(dealerHandValueData))) && !isBust(playerHandValueData)) {
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('new-round-btn').disabled = false;
    alert('You win!');
    incrementValue(playerWins)
    document.querySelector('.player-wins').innerText ='Player wins: ' + localStorage.getItem(playerWins)
  } else {
    alert('House wins!');
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('new-round-btn').disabled = false;
    incrementValue(houseWins)
    document.querySelector('.house-wins').innerText ='House wins: ' + localStorage.getItem(houseWins)
  }
}

//clears local storage for a new round
function clearLocalStorage() {
  localStorage.setItem('playerHandValueStorage', 0)
  localStorage.setItem('dealerHandValueStorage', 0)
}

//keeps track of wins
function incrementValue (keyName) {
  let newValue = Number(localStorage.getItem(keyName));
  newValue += 1;
  localStorage.setItem(keyName,newValue)
}

function resetStorage(keyName) {
  localStorage.setItem(keyName, 0)
}

function deckCheck(){
  let url = `https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deckId')}/`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        const card = data;
        if(card.remaining < 50){
          shuffle();
        }
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
}

function resetAll () {
  if(window.confirm('Reset auto refreshes browser and clears all data. Are you sure you wish to continue?')){
  resetStorage('playerHandValueStorage');
  resetStorage('dealerHandValueStorage');
  resetStorage('houseWins');
  resetStorage('playerWins');
  resetStorage('cardsDrawn');
  localStorage.setItem('deckId', '');
  location.reload();
  }
}