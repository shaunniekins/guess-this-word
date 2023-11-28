// problems:
// -- add: guess whole word for what player

"use client";

import React, { useState, useEffect, useRef } from "react";
import wordData from "../data/words.json";

const GamePlay = ({ numPlayers, numLives, timer, setGameStarted }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [category, setCategory] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [remainingLives, setRemainingLives] = useState(
    Array.from({ length: numPlayers }, () => numLives)
  );
  const [remainingTime, setRemainingTime] = useState(timer);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [players, setPlayers] = useState(
    Array.from({ length: numPlayers }, (_, i) => i + 1)
  );
  const [disqualifiedPlayers, setDisqualifiedPlayers] = useState([]);

  const playerTimers = useRef({});

  const isGameOver =
    disqualifiedPlayers.length === numPlayers ||
    remainingLives.every((lives) => lives <= 0);

  const hasWon = currentWord
    .split("")
    .every((letter) => guesses.includes(letter) || letter === " ");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData[randomIndex];
    setCurrentWord(randomWord.word.toLowerCase());
    setCategory(randomWord.category);
    setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    setRemainingTime(timer);
    setCurrentPlayer(1);
  }, [numLives, timer]);

  useEffect(() => {
    if (numPlayers > 1 || (numPlayers === 1 && timer > 0)) {
      if (!isGameOver) {
        let gameTimerInterval;

        if (remainingTime > 0) {
          gameTimerInterval = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);
        } else if (!disqualifiedPlayers.includes(currentPlayer)) {
          // Disqualify the player if they run out of time
          disqualifyPlayer(currentPlayer);
          switchToNextPlayer();
        }

        // Stop the timer when a player wins
        if (hasWon) {
          clearInterval(gameTimerInterval);
        }

        return () => {
          clearInterval(gameTimerInterval);
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
  ]);

  useEffect(() => {
    if (numPlayers > 1) {
      players.forEach((player) => {
        playerTimers.current[player] = timer;
      });
    }
  }, [numPlayers, players, timer]);

  const handleGuess = (letter) => {
    const letterLower = letter.toLowerCase();
    if (!guesses.includes(letterLower)) {
      setGuesses([...guesses, letterLower]);
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

  const disqualifyPlayer = (player) => {
    setDisqualifiedPlayers([...disqualifiedPlayers, player]);
  };

  const handleNextGame = () => {
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const randomWord = wordData[randomIndex];
    setCurrentWord(randomWord.word.toLowerCase());
    setCategory(randomWord.category);
    setGuesses([]);
    setDisqualifiedPlayers([]);
    setRemainingLives(Array.from({ length: numPlayers }, () => numLives));
    setRemainingTime(timer);
    setCurrentPlayer(1);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <img
          src="guess-this-word-logo.png"
          alt="Guess Logo"
          className="h-[100px] w-[130px] "
        />
      </div>
      <div className="min-h-height px-8 md:px-24 pb-14 md:pb-32 flex flex-col space-y-10 md:space-y-20 select-none font-Roboto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {/* <h1>Guess This Word</h1> */}
            <p>Category: {category}</p>
            {numPlayers === 1 ? (
              <p>Remaining Lives: {remainingLives[currentPlayer - 1]} </p>
            ) : (
              ""
            )}
            {timer === 0 ? "" : <p>Remaining Time: {remainingTime} seconds</p>}
            {/* {numPlayers !== 1 ? <p>Player: {currentPlayer}</p> : ""} */}

            <button
              className="self-start rounded-lg text-purple-800"
              onClick={() => setGameStarted(false)}>
              Change Setup
            </button>
          </div>
          {numPlayers !== 1 ? (
            <div className="flex flex-col">
              {remainingLives.map((life, index) => (
                <div
                  key={index}
                  className={`${
                    currentPlayer === index + 1
                      ? "font-bold text-purple-700"
                      : disqualifiedPlayers.includes(index + 1)
                      ? "line-through"
                      : ""
                  }`}>
                  Player {index + 1} - Lives: {life}
                </div>
              ))}
              <button className="self-start rounded-lg text-purple-800">
                Guess Now
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="text-center word-display text-4xl md:text-7xl">
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

        <div className="alphabet-buttons text-center">
          {isGameOver || hasWon ? (
            isGameOver ? (
              <div className=" space-y-3">
                <p>Game Over!</p>
                <button
                  className=" bg-orange-400 rounded-lg px-3 py-2"
                  onClick={handleNextGame}>
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <p>Congratulations, You Win!</p>
                <div className="flex space-x-3">
                  <button
                    className=" bg-orange-400 rounded-lg px-3 py-2"
                    onClick={() => setGameStarted(false)}>
                    Change Setup
                  </button>
                  <button
                    className=" bg-purple-400 rounded-lg px-3 py-2"
                    onClick={handleNextGame}>
                    Next Round
                  </button>
                </div>
              </div>
            )
          ) : (
            "abcdefghijklmnopqrstuvwxyz".split("").map((letter, index) => (
              <button
                key={letter}
                className={`w-[40px] h-[40px] md:w-[100px] md:h-[100px] text-4xl md:text-5xl border border-purple-600 rounded-lg md:rounded-3xl mx-[2px] my-1  ${
                  guesses.includes(letter)
                    ? currentWord.includes(letter)
                      ? "bg-purple-600" // Correct guess
                      : "bg-purple-200" // Incorrect guess
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
    </>
  );
};

export default GamePlay;
