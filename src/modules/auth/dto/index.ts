import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  rememberMe?: boolean;
}

export class RegisterAuthCredentialsDTO {
  @ApiProperty()
  @IsString()
<<<<<<< HEAD
  email: string; 
=======
  email: string;
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a

  @ApiProperty()
  @IsString()
  password: string;
}
