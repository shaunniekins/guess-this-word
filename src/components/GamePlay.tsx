"use client";

import React, { useState, useEffect, useRef } from "react";
import { wordData } from "../data/words.js";
import GuessModal from "./GuessModal";
import DisplayPlay from "./DisplayPlay";

type WordData = {
  word: string;
  category: string;
};

type GamePlayProps = {
  numPlayers: number;
  numLives: number;
  timer: number;
  setGameStarted: (gameStarted: boolean) => void;
};

const GamePlay: React.FC<GamePlayProps> = ({
  numPlayers,
  numLives,
  timer,
  setGameStarted,
}) => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(timer);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [disqualifiedPlayers, setDisqualifiedPlayers] = useState<number[]>([]);
  const [round, setRound] = useState<number>(numPlayers === 1 ? 0 : 1);
  const [remainingLives, setRemainingLives] = useState<number[]>(
    Array.from({ length: numPlayers }, () => numLives)
  );

  const [players, setPlayers] = useState<number[]>(
    Array.from({ length: numPlayers }, (_, i) => i + 1)
  );

  const [isGuessModalOpen, setIsGuessModalOpen] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(1);
  const [guess, setGuess] = useState<string>("");

  const [roundWinner, setRoundWinner] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const playerTimers = useRef<{ [key: number]: number }>({});

  const handleGuessClick = () => {
    setIsGuessModalOpen(true);
  };

  const handleGuessSubmit = () => {
    setIsGuessModalOpen(false);

    // console.log("guess", guess);
    // console.log("currentWord", currentWord);

    // Compare the guess with the current word
    if (guess.toLowerCase() === currentWord) {
      // Award points to the player who guessed it
      const updatedPlayerPoints = [...playerPoints];
      updatedPlayerPoints[selectedPlayer - 1] += 1;
      setPlayerPoints(updatedPlayerPoints);
      setGuess(" ");

      // Set the round winner
      setRoundWinner(selectedPlayer);
      setIsGameOver(true);

      // Check if all rounds have been played to declare the overall game winner
      if (round >= numPlayers) {
        // Declare the overall game winner
        let gameWinner = 1;
        for (let i = 1; i < numPlayers; i++) {
          if (playerPoints[i] > playerPoints?.[gameWinner - 1]) {
            gameWinner = i + 1;
          }
        }
        setRoundWinner(gameWinner);
      }
    } else {
      // Handle incorrect guess if needed
      disqualifyPlayer(selectedPlayer);
      switchToNextPlayer();
      setRoundWinner(null); // Reset roundWinner if the guess is incorrect
    }
  };

  useEffect(() => {
    setIsGameOver(
      disqualifiedPlayers.length === numPlayers ||
        remainingLives.every((lives) => lives <= 0)
    );
  }, [disqualifiedPlayers, remainingLives]);

  const hasWon = currentWord
    .split("")
    .every((letter) => guesses.includes(letter) || letter === " ");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData?.[randomIndex];

    // useEffect(() => {
    //   const randomizeWord = () => {
    //     const randomIndex = Math.floor(Math.random() * wordData.length);
    //     const randomWord = wordData[randomIndex];

    //     return (randomWord);
    //   }

    //   let randomWord = ()

    //   // Check if randomWord is not in the array of usedWords
    //   if (!usedWords.includes(randomWord.word.toLowerCase())) {
    //     setUsedWords([...usedWords, randomWord.word.toLowerCase()]);
    //     setCurrentWord(randomWord.word.toLowerCase());
    //     setCategory(randomWord.category);
    //     setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    //     setRemainingTime(timer);
    //     setCurrentPlayer(1);
    //   }
    // }, [numLives, timer, usedWords]);

    // Check if randomWord is in the array of usedWords
    if (usedWords.includes(randomWord.word.toLowerCase())) {
      // If it's already in usedWords, generate a new random word
      const newRandomWord = getRandomUnusedWord(wordData, usedWords);
      setUsedWords([...usedWords, newRandomWord.word.toLowerCase()]);
      setCurrentWord(newRandomWord.word.toLowerCase());
      setCategory(newRandomWord.category);
    } else {
      // If it's not in usedWords, add it to usedWords and set the current word
      setUsedWords?.([...usedWords, randomWord.word.toLowerCase()]);
      setCurrentWord?.(randomWord.word.toLowerCase());
      setCategory?.(randomWord.category);
    }

    // Rest of your code...
    setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    setRemainingTime(timer);
    setCurrentPlayer(1);
  }, [round, numLives, timer]);

  // Function to get a random word that hasn't been used yet
  function getRandomUnusedWord(
    wordData: WordData[],
    usedWords: string[]
  ): WordData {
    let randomWord: WordData;
    do {
      const randomIndex = Math.floor(Math.random() * wordData.length);
      randomWord = wordData[randomIndex];
    } while (usedWords.includes(randomWord.word.toLowerCase()));
    return randomWord;
  }

  const [playerPoints, setPlayerPoints] = useState(
    Array.from({ length: numPlayers }, () => 0)
  );

  useEffect(() => {
    if (numPlayers > 1 || (numPlayers === 1 && timer > 0)) {
      if (!isGameOver && !isGuessModalOpen) {
        let gameTimerInterval: NodeJS.Timeout | null = null;

        if (remainingTime > 0) {
          gameTimerInterval = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);
        } else if (!disqualifiedPlayers.includes(currentPlayer)) {
          disqualifyPlayer(currentPlayer);
          switchToNextPlayer();
        }

        // Stop the timer when a player wins
        if (hasWon && gameTimerInterval) {
          clearInterval(gameTimerInterval);
        }

        return () => {
          if (gameTimerInterval) {
            clearInterval(gameTimerInterval);
          }
        };
      }
    }
  }, [
    remainingTime,
    disqualifiedPlayers,
    currentPlayer,
    numPlayers,
    timer,
    hasWon,
    isGameOver,
    isGuessModalOpen,
  ]);

  useEffect(() => {
    if (numPlayers > 1) {
      players.forEach((player) => {
        playerTimers.current[player] = timer;
      });
    }
  }, [numPlayers, players, timer]);

  const handleGuess = (letter: string) => {
    const letterLower = letter.toLowerCase();
    if (!guesses.includes(letterLower)) {
      setGuesses?.([...guesses, letterLower]);
      if (!currentWord.includes(letterLower)) {
        const updatedLives = [...remainingLives];
        updatedLives[currentPlayer - 1] -= 1;
        setRemainingLives(updatedLives);
        if (updatedLives[currentPlayer - 1] === 0) {
          disqualifyPlayer(currentPlayer);
        }
      }
      if (!(numPlayers === 1 && timer > 0)) {
        // Only switch to the next player if it's not a single player with a timer
        switchToNextPlayer();
      }
    }
  };

  const switchToNextPlayer = () => {
    let nextPlayer = (currentPlayer % numPlayers) + 1;
    while (disqualifiedPlayers.includes(nextPlayer)) {
      nextPlayer = (nextPlayer % numPlayers) + 1;
    }
    setCurrentPlayer(nextPlayer);
    setRemainingTime(playerTimers.current[nextPlayer]);
  };

  const disqualifyPlayer = (player: number) => {
    setDisqualifiedPlayers?.([...disqualifiedPlayers, player]);
  };

  const handleNextGame = () => {
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData?.[randomIndex];
    setCurrentWord(randomWord.word.toLowerCase());
    setCategory(randomWord.category);
    setGuesses?.([]);
    setDisqualifiedPlayers([]);
    setRound(0);
    setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    setRemainingTime(timer);
    setCurrentPlayer(1);
  };

  const handleNextRound = () => {
    // Check if the current player's guess was correct
    const isCorrectGuess = guess.toLowerCase() === currentWord;

    setRound(round + 1);

    // Update the player points for the current round if the guess was correct
    if (isCorrectGuess) {
      const updatedPlayerPoints = [...playerPoints];
      updatedPlayerPoints[currentPlayer - 1] += 1; // You can adjust the points earned as needed
      setPlayerPoints(updatedPlayerPoints);
    }

    // Reset the game for the next round
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData[randomIndex];
    setCurrentWord(randomWord.word.toLowerCase());
    setCategory(randomWord.category);
    setGuesses?.([]);
    setDisqualifiedPlayers?.([]);
    setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    setRemainingTime(timer);

    // Switch to the next player for the next round
    let nextPlayer = (currentPlayer % numPlayers) + 1;
    while (disqualifiedPlayers.includes(nextPlayer)) {
      nextPlayer = (nextPlayer % numPlayers) + 1;
    }
    setCurrentPlayer(nextPlayer);

    // Clear the guess for the next round
    setGuess("");

    // Update the roundWinner to null, as it's a new round
    setRoundWinner(null);
  };

  return (
    <>
      {isGuessModalOpen && (
        <GuessModal
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          players={players}
          disqualifiedPlayers={disqualifiedPlayers}
          guess={guess}
          setGuess={setGuess}
          setIsGuessModalOpen={setIsGuessModalOpen}
          handleGuessSubmit={handleGuessSubmit}
        />
      )}
      <DisplayPlay
        category={category}
        guesses={guesses}
        numPlayers={numPlayers}
        disqualifiedPlayers={disqualifiedPlayers}
        round={round}
        remainingLives={remainingLives}
        currentPlayer={currentPlayer}
        timer={timer}
        remainingTime={remainingTime}
        setGameStarted={setGameStarted}
        playerPoints={playerPoints}
        handleGuessClick={handleGuessClick}
        currentWord={currentWord}
        isGameOver={isGameOver}
        hasWon={hasWon}
        roundWinner={roundWinner}
        handleNextRound={handleNextRound}
        handleNextGame={handleNextGame}
        handleGuess={handleGuess}
      />
    </>
  );
};

export default GamePlay;
