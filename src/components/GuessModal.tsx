import React, { useState } from "react";

interface GuessModalProps {
  selectedPlayer: number;
  setSelectedPlayer: (player: number) => void;
  players: number[];
  disqualifiedPlayers: number[];
  guess: string;
  setGuess: (guess: string) => void;
  setIsGuessModalOpen: (isOpen: boolean) => void;
  handleGuessSubmit: () => void;
}

const GuessModal: React.FC<GuessModalProps> = ({
  selectedPlayer,
  setSelectedPlayer,
  players,
  disqualifiedPlayers,
  guess,
  setGuess,
  setIsGuessModalOpen,
  handleGuessSubmit,
}) => {
  console.log("selectedPlayer: ", selectedPlayer);
  console.log("players: ", players);
  console.log("disqualifiedPlayers: ", disqualifiedPlayers);
  console.log("guess: ", guess);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4">
            <div className="mb-10 space-y-2">
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Guess the Word
              </h3>
              <div className="h-1 rounded-full bg-purple-600" />
            </div>
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 justify-between sm:items-center sm:space-x-11">
              <label>Select Player:</label>
              <select
                value={selectedPlayer}
                className="flex-1 bg-purple-600 flex-grow rounded-full text-white border-none px-5 py-2 text-right"
                onChange={(e) => setSelectedPlayer(parseInt(e.target.value))}>
                {players
                  .filter((player) => !disqualifiedPlayers.includes(player))
                  .map((player) => (
                    <option key={player} value={player}>
                      Player {player}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 justify-between sm:items-center sm:space-x-3">
              <label>Enter your guess:</label>
              <input
                type="text"
                value={guess}
                className="border-2 flex-grow border-purple-600 px-5 py-2 rounded-full text-right"
                onChange={(e) => setGuess(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-50 flex flex-col px-4 py-3 sm:px-6 sm:flex-row-reverse space-y-2 sm:space-y-0">
            <button
              onClick={handleGuessSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
              Submit Guess
            </button>
            <button
              onClick={() => setIsGuessModalOpen(false)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessModal;
