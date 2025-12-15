let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const reshuffleDeckBtn = document.getElementById("reshuffle-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")

function handleClick() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
        })
        
    reshuffleDeckBtn.disabled = false
    resetGame()
}

newDeckBtn.addEventListener("click", handleClick)

reshuffleDeckBtn.addEventListener("click", function() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/`)
        .then(response => response.json())
        .then(data => {
            resetGame()
        })
})

drawCardBtn.addEventListener("click", () => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            
            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if(computerScore > myScore) {
                    header.textContent = "Computer won the game 😞"
                }
                else if(computerScore < myScore) {
                    header.textContent = "You won the game 🥳"
                }
            }
        })
})

/**
 * Challenge:
 * 
 * Display the final winner in the header at the top by
 * replacing the text of the h2.
 */

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer score: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `My score: ${myScore}`
        return "You win!"
    } else {
        return "War!"
    }
}

function resetGame() {
    header.textContent = "Game of War"
    
    myScore = 0
    computerScore = 0
    
    computerScoreEl.textContent = `Computer score: ${computerScore}`
    myScoreEl.textContent = `My score: ${myScore}`
    
    cardsContainer.children[0].innerHTML = ""
    cardsContainer.children[1].innerHTML = ""
    
    remainingText.textContent = "Remaining cards: 52"
    
    drawCardBtn.disabled = false
}