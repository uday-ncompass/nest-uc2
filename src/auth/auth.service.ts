import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bycrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}

    async validateUser(email: string, password: string): Promise<any>{
        //console.log("Validate User")
        const user = await this.userService.findOneByEmail(email);
        if(user){
            const passwordMatch = bycrypt.compare(password, user.password);
            if(user && passwordMatch){
                const {password, ...rest} = user;
                return rest;
            }

        }else{
            throw new NotFoundException('User not found')
        }

        return null;
    }

    async login(user: any){
        //console.log("Login User")
        const payload = {email: user.email, id: user.id};
        return{
            message: 'SignedIn',
            access_token: this.jwtService.sign(payload),
            data: payload
        }
    }
}
