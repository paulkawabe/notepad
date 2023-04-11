import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import prisma from "@/app/lib/Prisma";

export async function POST(request: NextRequest, response: NextResponse) {

    const body = await request.json()

    const comment = await prisma.comment.create({
        data : {...body}
    })
    
    return new NextResponse('new comment created', { status : 201 })
}