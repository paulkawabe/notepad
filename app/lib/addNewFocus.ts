import axios from "axios";
import { Buffer, Recording, session, comment, focus} from '../custom_typings/index'

//new focus handler
const addNewFocus = (
    focusTitle: string, 
    activeFocusId: string, 
    session: session, 
    e : any, 
    setNewRecordingName : any, 
    setCurrentAudioUrl : any,
    setFocusTitle : any,
    setActiveFocusId : any,
    setRefresh : any,
    setRecordingRefresh : any
    ) => {

e.preventDefault();

if (focusTitle.length === 0) {
    console.log('please name your new focus something')
    return
}

if (activeFocusId) {

    const currentTime = new Date()

    const updateBody = {
    focus_id : activeFocusId,
    time_end : currentTime.toISOString()
    }

    axios
    .put('http://localhost:3000/api/focus', updateBody, { headers : {'Authorization' : `Bearer ${sessionStorage.getItem('authorization')}`}})
    .then((result) => {
        console.log(result)
    })
}

const body = {
    focus_title : focusTitle,
    session_id : session?.session_id,
}

axios
    .post('http://localhost:3000/api/focus', body, { headers : {'Authorization' : `Bearer ${sessionStorage.getItem('authorization')}`}})
    .then((result) => {
        setNewRecordingName('')
        setCurrentAudioUrl('')
        setFocusTitle('')
        setActiveFocusId(result.data.focus_id)
    })
    .then(() => {
        setRefresh(true)
        setRecordingRefresh(true)
    })
}

export default addNewFocus;