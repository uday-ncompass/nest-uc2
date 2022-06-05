import { Exclude } from "class-transformer";
import{ IsEmail, MinLength, IsNotEmpty, IsOptional} from "class-validator";
export class CreateUserDto {
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsOptional()   
    isAdmin: boolean;
}
