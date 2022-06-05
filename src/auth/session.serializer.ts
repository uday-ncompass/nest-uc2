import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";


@Injectable()
export class SessionSerializer extends PassportSerializer{
    serializeUser(user: any, done: Function) {
        console.log("2")
        console.log(user)
        done(null, user)
    }

    deserializeUser(payload: any, done: Function) {
        console.log(payload)
        done(null, payload)
    }
}