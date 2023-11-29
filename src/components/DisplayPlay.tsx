import React from "react";

interface DisplayPlayProps {
  category: string;
  guesses: string[];
  numPlayers: number;
  disqualifiedPlayers: number[];
  round: number;
  remainingLives: number[];
  currentPlayer: number;
  timer: number;
  remainingTime: number;
  setGameStarted: (value: boolean) => void;
  playerPoints: number[];
  handleGuessClick: () => void;
  currentWord: string;
  isGameOver: boolean;
  hasWon: boolean;
  roundWinner: number | null;
  handleNextRound: () => void;
  handleNextGame: () => void;
  handleGuess: (letter: string) => void;
}

const DisplayPlay: React.FC<DisplayPlayProps> = ({
  category,
  guesses,
  numPlayers,
  disqualifiedPlayers,
  round,
  remainingLives,
  currentPlayer,
  timer,
  remainingTime,
  setGameStarted,
  playerPoints,
  handleGuessClick,
  currentWord,
  isGameOver,
  hasWon,
  roundWinner,
  handleNextRound,
  handleNextGame,
  handleGuess,
}) => {
  // console.log("category: ", category);
  // console.log("guesses: ", guesses);
  // console.log("numPlayers: ", numPlayers);
  // console.log("disqualifiedPlayers: ", disqualifiedPlayers);
  // console.log("round: ", round);
  // console.log("remainingLives: ", remainingLives);
  // console.log("currentPlayer: ", currentPlayer);
  // console.log("timer: ", timer);
  // console.log("remainingTime: ", remainingTime);
  // console.log("playerPoints: ", playerPoints);
  // console.log("currentWord: ", currentWord);
  // console.log("isGameOver: ", isGameOver);
  // console.log("hasWon: ", hasWon);
  // console.log("roundWinner: ", roundWinner);

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
            <p>Category: {category}</p>
            {numPlayers === 1
              ? round !== 0 && <p>Streak: {round}</p>
              : round !== 0 && <p>Round: {round}</p>}

            {numPlayers === 1 ? (
              <p>Remaining Lives: {remainingLives?.[currentPlayer - 1]} </p>
            ) : (
              ""
            )}
            {timer === 0 ? "" : <p>Remaining Time: {remainingTime} seconds</p>}

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
                  <p>Points: {playerPoints?.[index]}</p>
                </div>
              ))}
              {!isGameOver && (
                <button
                  className={`self-start rounded-lg ${
                    isGameOver ? "text-gray-800" : "text-purple-500"
                  } `}
                  onClick={handleGuessClick}
                  disabled={isGameOver}>
                  Guess Now
                </button>
              )}
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
                {roundWinner ? (
                  <div className="flex flex-col items-center space-y-3">
                    {/* <p>Round Winner: Player {roundWinner}</p> */}
                    <p>Round Winner: Player Wins!</p>
                    <div className="flex space-x-3">
                      <button
                        className="bg-orange-400 rounded-lg px-3 py-2"
                        onClick={handleNextRound}>
                        End Game
                      </button>
                      <button
                        className="bg-purple-400 rounded-lg px-3 py-2"
                        onClick={handleNextRound}>
                        Next Round (multiplayer)
                      </button>
                    </div>
                  </div>
                ) : isGameOver ? (
                  <div className="flex flex-col items-center space-y-3">
                    {numPlayers === 1 && (
                      <>
                        <p>Game Over!</p>
                        <button
                          className="bg-orange-400 rounded-lg px-3 py-2"
                          onClick={handleNextGame}>
                          Try Again (Single Player)
                        </button>
                      </>
                    )}
                    {numPlayers !== 1 && (
                      <button
                        className="bg-purple-400 rounded-lg px-3 py-2"
                        onClick={handleNextRound}>
                        Next Round
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                {numPlayers === 1 && <p>Congratulations, You Win!</p>}

                <div className="flex space-x-3">
                  <button
                    className=" bg-orange-400 rounded-lg px-3 py-2"
                    onClick={() => setGameStarted(false)}>
                    Change Setup (Single Player)
                  </button>
                  <button
                    className=" bg-purple-400 rounded-lg px-3 py-2"
                    onClick={handleNextRound}>
                    Next Round (Single Player)
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

export default DisplayPlay;
