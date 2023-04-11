import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req : Request, { params } : any) {

    const deleteRecordings = await prisma.recording.deleteMany({

    })

    return NextResponse.json('deleted recordings')
}