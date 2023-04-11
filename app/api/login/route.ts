import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import prisma from "@/app/lib/Prisma";
const bcrypt = require('bcrypt')


export async function POST(request: Request, response: NextResponse) {

    //read data from request
    const data = await request.json()

    //pull user from db
    const user = await prisma.user.findUnique({
        where: {
            email : data.email
        }
    })

    console.log(user)

    let accepted = false; 

    if (user) {
        //check submitted password with hashed password in db
        accepted = await bcrypt.compare(data.password, user.password)
        console.log(accepted)
    }

    if (accepted && user) {

        //create object for user claims
        const claims = {
            id : user.id,
            username : user.username,
            email : user.email
        }

        //generate token based on claims
        const jwt = sign(claims, process.env.SECRET_KEY!)

        console.log(jwt)

        //send as response
        return NextResponse.json({ authToken : jwt, user_id : user.id })

    } else {
        return NextResponse.json({ message : 'invalid credentials or non existent user'}, { status : 401})
    }

}