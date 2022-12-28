import { IsInt, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
  @IsString()
  mode: 'solo' | 'multi';

  @IsInt()
  @Min(2)
  @Max(6)
  numberOfPlayers: number;
}
