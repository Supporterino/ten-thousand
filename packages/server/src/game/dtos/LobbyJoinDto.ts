import { IsString, IsUUID } from 'class-validator';

export class LobbyJoinDto {
  @IsString()
  @IsUUID('4')
  lobbyId: string;
}
