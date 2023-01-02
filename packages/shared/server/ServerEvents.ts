const enum ServerEvents {
  Pong = 'server.pong',
  LobbyState = 'server.lobby.state',
  GameNotification = 'server.notification',
  DiceRoll = 'server.diceRolled',
  NewRound = 'server.newRound',
}

export { ServerEvents };
