document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll('.game-card');
  let numCards = cards.length;
  let card1 = null;
  let card2 = null;
  let cardsFlipped = 0;
  let currentScore = 0;
  let lowScore = localStorage.getItem('low-score');

  if (lowScore) {
    document.getElementById('best-score').innerText = lowScore;
  }

  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  }

  let startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startGame);

  function handleCardClick(event) {
    // if we're not showing the front, do nothing
    if (!event.target.classList.contains('front')) return;

    // Assign the parent element of the target to currentCard
    let currentCard = event.target.parentElement;

    if (!card1 || !card2) {
      if (!currentCard.classList.contains('flipped')) {
        setScore(currentScore + 1);
      }
      currentCard.classList.add('flipped');
      card1 = card1 || currentCard;
      card2 = currentCard === card1 ? null : currentCard;
    }

    if (card1 && card2) {
      let gif1 = card1.children[1].children[0].src;
      let gif2 = card2.children[1].children[0].src;

      if (gif1 === gif2) {
        cardsFlipped += 2;
        card1.removeEventListener('click', handleCardClick);
        card2.removeEventListener('click', handleCardClick);
        card1 = null;
        card2 = null;
      } else {
        setTimeout(function() {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          card1 = null;
          card2 = null;
        }, 1000);
      }
    }

    // Once all the cards are showing, the game is over
    if (cardsFlipped === numCards) endGame();
  }

  function startGame() {
    setScore(0);
    start.classList.add("playing");
    let indices = [];
    for (let i = 1; i <= numCards / 2; i++) {
      indices.push(i.toString());
    }
    let pairs = shuffle(indices.concat(indices));

    for (let i = 0; i < cards.length; i++) {
      let path = "gifs/" + pairs[i] + ".gif";
      cards[i].children[1].children[0].src = path;
    }
  }

  function shuffle(array) {
    // Copy the array
    let arrayCopy = array.slice();

    for (let index1 = arrayCopy.length - 1; index1 > 0; index1--) {
      let index2 = Math.floor(Math.random() * (index1 + 1));
      let temp = arrayCopy[index1];
      arrayCopy[index1] = arrayCopy[index2];
      arrayCopy[index2] = temp;
    }
    return arrayCopy;
  }

  function setScore(score) {
    // update the current score and display it
    currentScore = score;
    document.getElementById("current-score").innerText = currentScore;
  }

  function endGame() {
    let end = document.getElementById('end');
    let scoreHeader = end.children[1];
    scoreHeader.innerText = "Your score: " + currentScore;
    let lowScore = +localStorage.getItem('low-score') || Infinity;
    if (currentScore < lowScore) {
      scoreHeader.innerText += " - New Best Score!";
      localStorage.setItem('low-score', currentScore);
    }
    document.getElementById('end').classList.add('game-over');
  }
});
