"use client";
import React, { useState } from "react";
import GamePlay from "./GamePlay";

const GameSetup = () => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [numLives, setNumLives] = useState(8);
  const [gameStarted, setGameStarted] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [timer, setTimer] = useState(0);

  const maxLivesForPlayer1AndPlayer2 = 8;
  const minLivesForMultiplayer = 6;
  const timedSinglePlayer = 60; //seconds
  const timedMultiplayer = 20; //seconds

  const startGame = (playerNum, isTimed) => {
    // console.log("player", playerNum);
    if (playerNum <= 2) {
      setNumLives(maxLivesForPlayer1AndPlayer2);
    } else {
      setNumLives(minLivesForMultiplayer);
    }

    if (isTimed && playerNum === 1) {
      setTimer(timedSinglePlayer);
    } else if (isTimed) {
      setTimer(timedMultiplayer);
    } else {
      setTimer(0);
    }

    setNumPlayers(playerNum);
    setShowMultiplayer(false);
    setGameStarted(true);
  };

  return (
    <>
      {gameStarted ? (
        <GamePlay
          numPlayers={numPlayers}
          numLives={numLives}
          timer={timer}
          setGameStarted={setGameStarted}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen select-none">
          <div className="w-[800px] py-10 px-7 rounded-lg shadow-2xl border border-purple-400 text-xl flex flex-col items-center">
            {/* <h1 className="text-3xl mb-6">Welcome!</h1> */}

            <div className="w-full space-y-2">
              <div className="">
                <button
                  className="w-full text-start bg-gray-100 rounded-lg px-3 py-2 flex justify-between"
                  onClick={() => setShowMultiplayer(!showMultiplayer)}>
                  <p>Multiplayer</p>
                  <p>{!showMultiplayer ? "►" : "⏷"} </p>
                </button>
                {showMultiplayer ? (
                  <div className="w-full bg-gray-100 p-4 flex justify-between items-center rounded-lg">
                    <div className="w-full flex justify-around ">
                      <button
                        className="p-4 rounded-3xl bg-gray-200"
                        onClick={() => startGame(2, true)}>
                        2P
                      </button>
                      <button
                        className="p-4 rounded-3xl bg-gray-200"
                        onClick={() => startGame(3, true)}>
                        3P
                      </button>
                      <button
                        className="p-4 rounded-3xl bg-gray-200"
                        onClick={() => startGame(4, true)}>
                        4P
                      </button>
                    </div>
                    <div className="w-full flex justify-around items-center">
                      <p>or</p>
                      <button
                        className="py-2 px-16 rounded-3xl bg-gray-200"
                        onClick={() => alert("Feature not yet available.")}>
                        Link
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="w-full flex space-x-4">
                <button
                  className="w-full bg-gray-100 flex flex-col rounded-lg px-3 py-2"
                  onClick={() => startGame(1, true)}>
                  Single Player - Timed
                  <span className="text-sm">Play by youself for 2mins</span>
                </button>
                <button
                  className="w-full bg-gray-100 flex flex-col rounded-lg px-3 py-2"
                  onClick={() => startGame(1, false)}>
                  Single Player - Untimed
                  <span className="text-sm">
                    Play by youself for unlimited time
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameSetup;
