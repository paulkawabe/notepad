'use client'

import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Recording, session, focus } from '../../../../custom_typings/index'
import Focus from '@/app/components/Focus/Focus';
import './session.scss'

interface pageProps {
  params : { session : string, id : string }
}

const page: FC<pageProps> = ({params}) => {

  //states
  const [session, setSession] = useState< session | null >(null)
  const [user, setUser] = useState< any | null >(null)
  const [refresh, setRefresh] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([])

  //useEffect for getting user
  useEffect(() => {
    axios
    .get(`http://localhost:3000/api/user/${params.id}`, { headers: {'Authorization' : `Bearer ${sessionStorage.getItem('authorization')}`}})
    .then((result) => {
      setUser(result.data)
    })
  }, [])

  //useEffect for getting session data
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/session/${params.session}`)
      .then((result) => {
        setSession(result.data)
      })
    //cleanup function for reloading comments
    return () => setRefresh(false)
  }, [refresh])

  //useEffect for getting recordings
  useEffect(() => {
    axios
    .get(`http://localhost:3000/api/recording/${session?.session_id}`)
    .then((result) => {
      setRecordings(result.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [session])

  if (!session || !user) {
    return (
      <p>loading session...</p>
    )
  }


  return (
    <main className='session'>
      <h1 className='session__title'>{session.session_name}</h1>
      <p>Logged by {user.username} on {new Date(session.time_start!).toDateString()}</p>
      <h2>Areas of focus for this session: </h2>
      {session.focus!.map((focus: focus) => {
        return (
          <Focus
            key={focus.focus_id}
            focus={focus}
            recordings={recordings}
            session={session}
            user={user}
            setRefresh={setRefresh}
          />
        )
      })}
    </main>
  )
}

export default page;