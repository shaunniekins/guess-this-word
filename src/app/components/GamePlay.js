// Import React, useState, useEffect, and any other necessary components
"use client";

import React, { useState, useEffect } from "react";
import wordData from "../data/words.json";

const GamePlay = ({ numPlayers, numLives, timer, setGameStarted }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [category, setCategory] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [remainingLives, setRemainingLives] = useState(numLives);
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData[randomIndex];
    setCurrentWord(randomWord.word.toLowerCase()); // Convert word to lowercase
    setCategory(randomWord.category);
    setRemainingLives(numLives);
    setRemainingTime(timer);
  }, [numLives, timer]);

  // Wrap the timer-related code in a conditional check for timer > 0
  if (timer > 0) {
    // Decrement the timer every second
    useEffect(() => {
      let timerInterval;

      if (remainingTime > 0) {
        timerInterval = setInterval(() => {
          setRemainingTime(remainingTime - 1);
        }, 1000);
      } else {
        // Timer has reached zero, the game is over
        clearInterval(timerInterval);
        setGameStarted(false);
      }

      return () => {
        clearInterval(timerInterval);
      };
    }, [remainingTime, setGameStarted]);
  }

  const handleGuess = (letter) => {
    const letterLower = letter.toLowerCase(); // Convert the guessed letter to lowercase
    if (!guesses.includes(letterLower)) {
      setGuesses([...guesses, letterLower]);
      if (!currentWord.includes(letterLower)) {
        // Guessed letter is not in the word
        setRemainingLives(remainingLives - 1);
      }
    }
  };

  const isGameOver = (remainingLives === 0 || remainingTime === 0) && timer > 0;

  const hasWon = currentWord
    .split("")
    .every((letter) => guesses.includes(letter) || letter === " "); // Check if all letters have been guessed

  return (
    <div className="min-h-screen px-8 md:px-24 py-32 flex flex-col space-y-20 select-none">
      <div className="flex flex-col">
        <h1>Guess This Word</h1>
        <p>Category: {category}</p>
        <p>Remaining Lives: {remainingLives}</p>
        {timer === 0 ? "" : <p>Remaining Time: {remainingTime} seconds</p>}

        <button
          className="self-start rounded-lg text-purple-800"
          onClick={() => setGameStarted(false)}>
          New Game
        </button>
      </div>
      <div className="text-center word-display text-7xl">
        {currentWord.split("").map((letter, index) => (
          <span key={index} className="letter">
            {letter === " " ? (
              <div className="inline mx-3" />
            ) : guesses.includes(letter.toLowerCase()) ? (
              letter
            ) : (
              " _ "
            )}
          </span>
        ))}
      </div>

      <div className="alphabet-buttons text-center space-x-3 space-y-4">
        {isGameOver || hasWon ? (
          isGameOver ? (
            <div className=" space-y-3">
              <p>Game Over!</p>
              <button
                className=" bg-orange-400 rounded-lg px-3 py-2"
                onClick={() => setGameStarted(false)}>
                New Game
              </button>
            </div>
          ) : (
            <div className=" space-y-3">
              <p>Congratulations, You Win!</p>
              <button
                className=" bg-orange-400 rounded-lg px-3 py-2"
                onClick={() => setGameStarted(false)}>
                Change
              </button>
              <button
                className=" bg-purple-400 rounded-lg px-3 py-2"
                onClick={() => setGameStarted(false)}>
                Next Round
              </button>
            </div>
          )
        ) : (
          "abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
            <button
              key={letter}
              className={`w-[100px] h-[100px] text-5xl border border-purple-600 rounded-3xl ${
                guesses.includes(letter)
                  ? currentWord.includes(letter)
                    ? "bg-green-300" // Correct guess
                    : "bg-red-300" // Incorrect guess
                  : "bg-white" // Default color for unguessed letters
              }`}
              onClick={() => handleGuess(letter)}
              disabled={guesses.includes(letter) || isGameOver}>
              {letter}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GamePlay;
