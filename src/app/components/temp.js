isGameOver ? (
    <div className=" space-y-3">
      {roundWinner ? (
        <div>
          <p>Round Winner: Player {roundWinner}</p>
          {round < numPlayers ? (
            <div className="flex space-x-3">
              <button
                className="bg-orange-400 rounded-lg px-3 py-2"
                onClick={handleNextRound}>
                Next Round
              </button>
            </div>
          ) : (
            <div>
              <p>Game Over!</p>
              <button
                className="bg-orange-400 rounded-lg px-3 py-2"
                onClick={handleNextGame}>
                Try Again
              </button>
              {numPlayers !== 1 && (
                <button
                  className="bg-purple-400 rounded-lg px-3 py-2"
                  onClick={() => setGameStarted(false)}>
                  Change Setup
                </button>
              )}
            </div>
          )}
        </div>
      ) : isGameOver ? (
        <div>
          <p>Game Over!</p>
          <button
            className="bg-orange-400 rounded-lg px-3 py-2"
            onClick={handleNextGame}>
            Try Again
          </button>
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
      <p>Congratulations, You Win!</p>
      <div className="flex space-x-3">
        <button
          className=" bg-orange-400 rounded-lg px-3 py-2"
          onClick={() => setGameStarted(false)}>
          Change Setup
        </button>
        <button
          className=" bg-purple-400 rounded-lg px-3 py-2"
          onClick={handleNextRound}>
          Next Round
        </button>
      </div>
    </div>
  )