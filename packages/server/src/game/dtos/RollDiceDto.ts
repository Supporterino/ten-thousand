import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class RollDiceDto {
  @IsString()
  @IsUUID('4')
  lobbyId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsOptional()
  toSafe?: Array<number>;
}
