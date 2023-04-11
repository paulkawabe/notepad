import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {

    //parse body from request
    const data = await request.json();

    //get token from headers
    const token = await request.headers.get('authorization')?.split(' ')[1];

    //decode using secret key
    const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);

    //create new session
    const addNewSession = await prisma.session.create({
        data: {
            owner_id : decodedJWT.id,
            session_name: data.session_name,
            time_start : new Date().toISOString(),
            time_end : new Date().toISOString()
        }
    })

    return NextResponse.json(addNewSession)

}