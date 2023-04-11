import axios from 'axios';
import { Buffer, Recording, session, comment, focus} from '../custom_typings/index'

//upload handler function
const handleUpload = async (
    recordedFile : File | null,
    newRecordingName : string, 
    session : session,
    user : any,
    setRecordingRefresh : any,
    setCurrentAudioUrl : any,
    setNewRecordingName : any
) => {

    //check data to be uploaded. There is a named file
    if (!recordedFile || newRecordingName.length < 1 || !session || !session.focus || !session.session_id) {
        console.log('please record something and ensure it is named')
        return
    }

    //create formdata with file and file name to send to server
    const formData = new FormData();
    formData.append('file', recordedFile, 'file.mp3')
    formData.append('recording_name', newRecordingName)
    formData.append('focus_id', session.focus[0].focus_id)
    formData.append('user_id', user.id)
    formData.append('session_id', session.session_id)

    axios
        .post('http://localhost:3000/api/upload', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
        })
        .then((result) => {
        console.log(result.data, 'upload successful')
        setRecordingRefresh(true)
        setCurrentAudioUrl('')
        setNewRecordingName('')
        })
        .catch((error) => {
        console.log(error)
        })
};

export default handleUpload;