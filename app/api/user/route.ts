import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt')
const saltRounds = 10;
import prisma from "@/app/lib/Prisma";

export async function POST(request: Request, response: NextResponse){
    
    try {
        //parse request body
        const data = await request.json()
        
        //hash password
        const hashed = await bcrypt.hash(data.password, saltRounds)
      
        //create object to return
        const newUser = {...data};
      
        //update password with hashed version
        newUser.password = hashed;
      
        //add user to user db
        const addUser = await prisma.user.create({
            data: {
                firstname : newUser.firstname,
                lastname : newUser.lastname,
                email : newUser.email,
                username : newUser.username,
                password : newUser.password
            }
        })


        //retrieve generated user id
        const user = await prisma.user.findUnique({
            where : {
                email : newUser.email
            }
        })
    
        //create object for user claims
        const claims = {
            id : newUser.id,
            username : newUser.username,
            email : newUser.email
        }
    
        //generate token based on claims
        const token = jwt.sign(claims, process.env.SECRET_KEY!)
    
        if (user && token) {
            //send as response
            return NextResponse.json({ authToken : token, user_id : user.id })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({message : 'something went wrong'}, {status: 400})
    }

    
}
