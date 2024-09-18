# Blackjack

[Blackjack](https://spinksblackjack.netlify.app/)

![Blackjack 21](/img/blackjack.png)

## How its made
**Tech used:** HTML, CSS, JavaScript, API

This Blackjack game was built using HTML, CSS, and JavaScript to create an interactive and dynamic web experience. The game's logic and functionality rely on JavaScript, while CSS is used to style the game interface. The Deck of Cards API plays a crucial role by providing real-time card data to simulate drawing cards from a shuffled deck.

When the game starts, API requests are sent to shuffle a deck and draw cards for both the player and dealer. I used event listeners in JavaScript to capture player actions like hitting, standing, or starting a new round. The card images and game status updates are dynamically rendered on the page by manipulating the DOM. To keep track of wins and hand values, the game stores data in the browser’s local storage, making it persistent even after refreshing.

By modularizing the game's logic into functions and using control flow mechanisms, the game can handle various states, including busts, blackjacks, and wins, ensuring smooth gameplay for the user.

**Player Wins**
![Blackjack 21](/img/playerwins.png)


**House Wins**
![Blackjack 21](/img/housewins.png)

## Optimization
1. "Savable" game state
- Storing the current deck in local storage ensures that a user can leave and continue at a later time.

## What I learned

1. Local storage
- I gained experience working with localStorage to store data persistently on the user's browser. This allows me to save and retrieve game states, even after the page is refreshed or revisited.

2. Modular Functions
- I improved my ability to write modular, reusable functions that perform specific tasks. Breaking the game into smaller functions like `newRound()`, `drawCard()`, and `shuffle()` made the code more organized and easier to maintain.

3. State Management with Flags
- I learned to manage state effectively by using flags like `firstdraw` to handle special conditions. This taught me how to make decisions in the game based on different stages, such as checking for blackjack only on the first draw.

4. Dynamic Element Creation
- I learned how to dynamically create and append elements in the DOM, such as generating an image element for each card drawn. This gave me better control over how the game is visually presented to the player.

5. DOM Manipulation
- I practiced manipulating the DOM by updating elements dynamically. This includes modifying text content, appending new elements, and removing existing ones to reflect changes in the game state.
