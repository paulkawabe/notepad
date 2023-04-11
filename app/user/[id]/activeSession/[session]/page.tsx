'use client'

import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import './activeSession.scss'
import Timer from '../../../../components/timer/Timer'
import { useRouter } from 'next/navigation';
import { Recording, session, focus} from '../../../../custom_typings/index'

//functions import
import addNewFocus from '@/app/lib/addNewFocus';
import getRecordings from '@/app/lib/getRecordings';
import saveSession from '@/app/lib/saveSession';
import getSessionData from '@/app/lib/getSessionData';

//component import
import Focus from '@/app/components/Focus/Focus';
import ActiveFocus from '@/app/components/ActiveFocus/ActiveFocus';


// //TYPE DEFINITIONS
interface pageProps {
  params : { session : string, id : string }
}

const page: FC<pageProps> = ({params}) => {

  //initialize router
  const router = useRouter();

  //STATES
  //display states
  const [session, setSession] = useState< session | null >(null)
  const [user, setUser] = useState< any | null >(null)
  const [refresh, setRefresh] = useState(false)
  const [activeFocusId, setActiveFocusId] = useState<string>('')
  const [pastFocuses, setPastFocuses] = useState<focus[]>([])

  //form states
  const [focusTitle, setFocusTitle] = useState<string>('')

  //recording states
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('')
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [newRecordingName, setNewRecordingName] = useState<string>('')
  const [recordingRefresh, setRecordingRefresh] = useState<Boolean>(false)

  //USEEFFECTS
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
    getSessionData(params.session, router, setSession, setActiveFocusId, setPastFocuses, setRecordingRefresh)

    //cleanup function for reloading comments and focuses
    return () => setRefresh(false)
  }, [refresh])

  // useeffect for getting recordings of active session
  useEffect(() => {
    if (session && session.session_id && recordingRefresh) {
      getRecordings(session.session_id, setRecordings)
    }

    return () => setRecordingRefresh(false)
  }, [recordingRefresh])

  const addNewFocusHandler = (e : any) => {
    if (session) {
      addNewFocus(
        focusTitle, 
        activeFocusId, 
        session, 
        e, 
        setNewRecordingName, 
        setCurrentAudioUrl, 
        setFocusTitle, 
        setActiveFocusId,
        setRefresh, 
        setRecordingRefresh,
      )
    } else {
      console.log('no session')
    }
  }

  if (!session || !user) {
    return (
      <p>loading session...</p>
    )
  }

  return (
    <main className='activeSession'>
      <Timer />
      <h1>{session.session_name}</h1>
      <p>This session was created by {user.firstname}</p>
      <h2>Active Focus:</h2>
      { session.focus ? 
        <ActiveFocus 
          focus={session.focus[0]}
          recordings={recordings}
          session={session}
          user={user}
          setRefresh={setRefresh}
          setRecordingRefresh={setRecordingRefresh}
          activeFocusId={activeFocusId}
          newRecordingName={newRecordingName}
          setNewRecordingName={setNewRecordingName}
          currentAudioUrl={currentAudioUrl}
          setCurrentAudioUrl={setCurrentAudioUrl}
        /> :
        <p>no active focus</p>
      }
      <h2>previous focuses:</h2>
      {pastFocuses.length > 0 ? pastFocuses.map((focus: focus) => {
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
      }) : <p>none to display yet</p>}
      <div className='newFocus'>
        <h2>new focus</h2>
        <form>
          <label className='newFocus__label' name='focus_title'>what are you working on?</label>
          <br />
          <input className='newFocus__input' type="text" name='focus_title' placeholder='name your new focus area' value={focusTitle} onChange={(e : any) => {setFocusTitle(e.target.value)}}/>
          <br />
          <button className='newFocus__add' onClick={(e : any) => addNewFocusHandler(e)}>create new focus</button>
        </form>
      </div>
      <button className='activeSession__save' onClick={(e: any) => {saveSession(e, router, session)}}>Save and end ession</button>
    </main>
  )
}

export default page;