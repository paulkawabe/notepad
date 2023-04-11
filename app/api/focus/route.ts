import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import prisma from "@/app/lib/Prisma";


export async function POST(request: Request) {

    //parse body from request
    const data = await request.json();

    //get token from headers
    const token = await request.headers.get('authorization')?.split(' ')[1];

    //decode using secret key
    const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);

    //create new session
    const addNewFocus = await prisma.focus.create({
        data: {
            focus_title : data.focus_title,
            session_id : data.session_id,
            time_start : new Date().toISOString(),
            time_end : new Date().toISOString()
        }
    })

    return NextResponse.json(addNewFocus)
}

export async function PUT(request : Request) {

    //parse body from request
    const data = await request.json();

    //get token from headers
    const token = await request.headers.get('authorization')?.split(' ')[1];

    //decode using secret key
    const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);

    const updateFocus = await prisma.focus.update({
        where : {
            focus_id : data.focus_id
        },
        data : {
            time_end : data.time_end
        }
    })

    return NextResponse.json({message : "updated focus", focus_id : updateFocus.focus_id})
}