//CSS
import './App.css';

//REACT
import { useCallback, useEffect, useState } from 'react';

//data
import { wordsList } from "./data/words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
  
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  


  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
       //console.log(category)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    //console.log(word)

    return { category, word }
  }, [words]);
  // Starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLettersStates();

    // pick work and pick category
    const { category, word } = pickWordAndCategory();
        
    // create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //console.log(word, category);
    //console.log(wordLetters);

    // fill states
    setpickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the lettle input

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }    
  }

 // clear letters state
 const clearLettersStates = () => {
  setGuessedLetters([]);
  setWrongLetters([]);
};
// check if guesses ended
useEffect(() => {
  if (guesses === 0) {
    // game over and reset all states
    clearLettersStates();

    setGameStage(stages[2].name);
  }
}, [guesses]);

// check win condition
useEffect(() => {
  const uniqueLetters = [...new Set(letters)];
  // win condition
  if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
    // add score
    setScore((actualScore) => (actualScore += 100));

    // restart game with new word
    startGame();
  }
}, [guessedLetters, letters, startGame,gameStage]);

  //restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name)
  }

  
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}

    </div>
  );
}

export default App;
