import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/lib/Prisma";

export async function DELETE(req : Request, { params } : any) {

    const deleteRecordings = await prisma.recording.deleteMany({

    })

    return NextResponse.json('deleted recordings')
}