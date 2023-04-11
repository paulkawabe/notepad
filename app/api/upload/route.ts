import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/app/lib/Prisma';

export async function POST(request: Request, response : Response) {

    //get formdata from request
    const formData = await request.formData();

    //extract file from formdata
    const file = formData.get('file')

    //extract recording name from formdata
    const recordingName = formData.get('recording_name')
    const focus_id = formData.get('focus_id')
    const user_id = formData.get('user_id')
    const session_id = formData.get('session_id')

    if (file && typeof recordingName === 'string' && typeof focus_id === 'string' && typeof user_id === 'string' && typeof session_id === 'string') {

        //turn recieved file into blob
        const blob = new Blob([file], {type: 'audio/mp3'})

        //create arrayBuffer from blob
        const arrayBuffer = await blob.arrayBuffer();

        //create buffer from arrayBuffer
        const buffer = Buffer.from(arrayBuffer)

        //insert new recording into database
        const newRecording = await prisma.recording.create({
            data: {
                recording_name : recordingName,
                focus_id : focus_id,
                user_id : user_id,
                session_id : session_id,
                data : buffer
            }
        })

        return new Response(`${JSON.stringify(newRecording.recording_name)}`);
    }

}