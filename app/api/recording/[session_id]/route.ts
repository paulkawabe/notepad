import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req : Request, { params } : any) {

    const recordings = await prisma.recording.findMany({
        where : {
            session_id : params.session_id
        }
    })

    return NextResponse.json(recordings)
}