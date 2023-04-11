import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request : Request, { params } : any) {
  
  //get token from headers
  const token = await request.headers.get('authorization')?.split(' ')[1];

  //decode using secret key
  const decodedJWT = jwt.verify(token, process.env.SECRET_KEY)
  
  //check if user is authorized to view user attached to params.id
  if (decodedJWT.id !== params.id) {
    return NextResponse.json({message: 'this is not the same user'})
  }
  
  //prisma query function
  async function getUserWithSessions() {

    const userWithSessions = await prisma.user.findUnique({
      where: {
        id : params.id
      },
      include: {
        session: true,
      }
    })
  
    return userWithSessions;
  
  }

  const returnUser = await getUserWithSessions()

  return NextResponse.json(returnUser)

}