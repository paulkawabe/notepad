import { NextResponse } from "next/server";
import prisma from "@/app/lib/Prisma";

//define focus object
interface focus {
  focus_id : string,
  session_id : string,
  focus_title : string,
  time_start : Date,
  time_end: Date,
  comment?: comment[]
}

//define comment object
interface comment {
  comment_id : string,
  focus_id : string,
  session_id : string,
  body : string,
  user_id : string,
  timestamp : Date
}

//define session object
interface session {
    session_id? : string,
    owner_id? : string,
    session_name? : string,
    time_start? : Date,
    time_end? : Date,
    focus? : focus[],
    comment? : object[],
}

export async function GET(request : Request, { params } : any) {

  //create session
  let session: session | null;

  //assign session values
  async function getSession() {

    session = await prisma.session.findUnique({
      where: {
        session_id : params.session
      }
    })

    //get focuses related to session
    const sessionFocus = await prisma.focus.findMany({
        where: {
            session_id : params.session
        },
        orderBy : {
          time_start : 'desc'
        }
    })

    //attach focuses to session object
    session!.focus = sessionFocus;

    //get comments related to session
    const sessionComment = await prisma.comment.findMany({
        where: {
            session_id : params.session
        },
        include: {
          user : {
            select: {
              username: true
            }
          }
        }
    })

    //check if there are comments
    if (sessionComment.length !== 0) {
      
      //attach comments to related focuses
      sessionComment.forEach((comment) => {
  
        //create variable for holding index
        let focusIndex : number;
  
        //index of matching focus
        if (typeof session!.focus?.findIndex((focus) => focus.focus_id === comment.focus_id) === 'number') {
          focusIndex = session!.focus?.findIndex((focus) => focus.focus_id === comment.focus_id)
        } else {
          return;
        }
  
        //add comment to comment array in focus. Create comment array if it does not exist
        if (session!.focus![focusIndex].comment! === undefined) {
          session!.focus[focusIndex].comment = []
          session!.focus[focusIndex].comment?.push(comment)
        } else {
          session?.focus[focusIndex].comment?.push(comment)
        }
  
      })

    }

    return session;
  
  }

  const returnSession = await getSession()

  return NextResponse.json(returnSession)

}

export async function PUT(request: Request, {params} : any) {

  //parse request body
  const data = await request.json()

  const updateSession = await prisma.session.update({
    where : {
      session_id : params.session
    },
    data : {
      active : false,
      time_end : data.time_end
    }
  })

  return NextResponse.json({message: 'session saved successfully'})
}
