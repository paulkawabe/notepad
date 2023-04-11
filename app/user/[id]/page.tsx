'use client'

import {FC, useState, useEffect } from 'react'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './userPage.scss'
import { session } from '../../custom_typings/index';

interface pageProps {
  params : { id : string }
}

//type for user object
interface userObj {
  id: String,
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: String
  session: object[]
}

const page: FC<pageProps> = ({params}) => {

  const [user, setUser] = useState< userObj | null >(null)
  const [sessions, setSessions] = useState< session[] | null >(null)
  const [authorized, setAuthorized] = useState(false)
  const [newSessionName, setNewSessionName] = useState<string>('')

  //initialize router
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${params.id}`, { headers: { "Authorization" : `Bearer ${sessionStorage.getItem('authorization')}`}})
      .then((result) => {
        console.log(result.data.id)
        setAuthorized(true)
        setUser(result.data)
        setSessions(result.data.session)
        console.log(result.data.session)
      })
      .catch((error) => {
        console.log(error)
        console.log("you are not authorized to view this user's data")
      })
  }, [])

  //create new session handler
  function handleNewSession(e: any) {
    e.preventDefault()

    //create obj to send as body
    const body = {
      session_name : newSessionName
    }

    axios
      .post('http://localhost:3000/api/session', body, { headers: { 'Authorization' : `Bearer ${sessionStorage.getItem('authorization')}`}})
      .then((result) => {
        console.log(result.data)
        router.push(`http://localhost:3000/user/${params.id}/activeSession/${result.data.session_id}`)
      })
  }
  
  if (!user || !sessions) {
    return (
      <p>loading...</p>
    )
  }

  if (!authorized) {
    return (
      <p>you gotta log in</p>
    )
  }

  return (
    <section className='userPage'>
      <div className='userPage__banner'>
        <h1 className='userPage__header'>Welcome back, {user.username}</h1>
      </div>
      <div className='userPage__newSession'>
        <h2 className='userPage__newSessionTitle'>Create a new session</h2>
        <form onSubmit={handleNewSession}>
          <label>
            <p className='userPage__newSessionLabel'>name your session</p>
            <input className='userPage__newSessionInput' type="text" placeholder='Session name here' name="session_name" id="session_name" value={newSessionName} onChange={(e: any)=>{setNewSessionName(e.target.value)}}/>
          </label>
          <br />
          <button className='userPage__newSessionButton'>Start practicing</button>
        </form>
      </div>
      <div>
        <h3 className='userPage__sessionHeader'>Session History</h3>
        <ul className='userPage__sessionList'>
        {sessions.map((session) => {
          const minutes = Math.floor(((new Date(session.time_end!).getTime()) - (new Date(session.time_start!).getTime())) / 60000)
          const hours = Math.floor(minutes / 60)
          const remainingMin = minutes % (hours ? hours : 1 * 60)
          const formattedTime = `${hours.toString().length > 1 ? hours.toString() : '0' + hours.toString()}:${remainingMin.toString().length > 1 ? remainingMin.toString() : '0' + remainingMin.toString()}`
          return (
            <li key={session.session_id} className='userPage__listItem'>
              <Link  href={`user/${user.id}/session/${session.session_id}`}>
                <div className='userPage__sessionItem'>
                  <h3>{session.session_name}</h3>
                  <p>{new Date(session.time_start!).toDateString()}</p>
                  <p>duration: {formattedTime}</p>
                </div>
              </Link>
            </li>
          )
        })}
        </ul>
      </div>
    </section>
  )
  
}

export default page;