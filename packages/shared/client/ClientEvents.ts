const enum ClientEvents {
  Ping = 'client.ping',
  LobbyJoin = 'client.lobby.join',
  LobbyCreate = 'client.lobby.create',
  LobbyLeave = 'client.lobby.leave',
  ChangeUsername = 'client.lobby.changeName',
  RollDice = 'client.game.rollDice',
}

export { ClientEvents };
