export const getIsSignedIn = state => state.isSignedIn || false;

export const getPlayerId = state => state.playerId;

export const getGameId = state => state.gameId;

export const getPlayerUserName = state => state.playerUserName;

export const getRedPlayer = state => state.redPlayer;

export const getBluePlayer = state => state.bluePlayer;

export const getTurn = state => state.turn;

export const getInProgress = state => state.inProgress;

export const getCurrentPlayer = state => state.currentPlayer;

export const getPlayerTeam = state => state.playerTeam;

export const getIsCurrentPlayer = state => {
  const playerTeam = getPlayerTeam(state);
  const currentPlayer = getCurrentPlayer(state);

  return playerTeam === currentPlayer
};

export const getAreBothPlayersPresent = state => {
  const bluePlayer = getBluePlayer(state);
  const redPlayer = getRedPlayer(state);

  return Boolean(bluePlayer !== '' && redPlayer !== '')
}
