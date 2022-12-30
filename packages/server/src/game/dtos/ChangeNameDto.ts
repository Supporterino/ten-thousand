import { IsAlphanumeric, IsString, IsUUID } from 'class-validator';

export class ChangeNameDto {
  @IsString()
  @IsAlphanumeric()
  name: string;

  @IsString()
  @IsUUID('4')
  lobbyId: string;
}
