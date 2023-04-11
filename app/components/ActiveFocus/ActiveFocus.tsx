'use client'

import { useState } from "react";
const MicRecorder = require('mic-recorder-to-mp3');

import NotesBlock from "../NotesBlock/NotesBlock"
import { Buffer, Recording, session, comment, focus} from '../../custom_typings/index'
import handleUpload from "@/app/lib/handleUpload";
import submitComment from "@/app/lib/submitComment";
import './ActiveFocus.scss'


export default function ActiveFocus( props : {
    focus : focus,
    recordings : Recording[],
    session : session,
    user : any,
    setRefresh : any,
    setRecordingRefresh : any
    activeFocusId : string,
    newRecordingName : string,
    setNewRecordingName : any
    currentAudioUrl : string,
    setCurrentAudioUrl : any
}
) {

    //states
    const [recording, setRecording] = useState<boolean>(false);
    const [recordedFile, setRecordedFile] = useState<File | null>(null)
    
    //RECORDING FUNCTIONS
    // New instance of mp3 recorder
    const [Mp3Recorder, setMp3Recorder] = useState(
        new MicRecorder({ bitRate: 128 })
    );

    // Start recording
    const startRecording = () => {
    Mp3Recorder
        .start()
        .then(() => {
            setRecording(true)
        })
        .catch((error : any) => {
            console.error(error);
        });
    }

    // Stop recording
    const stopRecording = () => {

    Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer, blob] : any) => {

            console.log(blob)

            const file = new File([blob], 'currentRecording.mp3', {
                type: blob.type,
                lastModified: Date.now()
            });

            //store file in state for upload
            setRecordedFile(file)

            //store url in state for preview playback
            props.setCurrentAudioUrl(URL.createObjectURL(file))

        })
        .catch((error : any) => {
            console.log(error);
        });
    }

    if (!!props.session.focus && !!props.session.focus.length) {
    
        return (
            <div className='activeFocus' key={props.focus.focus_id}>
                <div className='activeFocus__header'>
                    <h3 className='activeFocus__title'>{props.focus.focus_title}</h3>
                </div>
                <div>
                    <h3 className='activeFocus__newRecording'>new Recording:</h3>
                    <button className='activeFocus__startRecording' onClick={startRecording}>start recording</button>
                    <button className='activeFocus__stopRecording' onClick={stopRecording}>stop recording</button>
                    <br />
                    <audio className={props.currentAudioUrl ? 'activeFocus__currentRecording' : 'activeFocus__currentRecording--hide'} src={props.currentAudioUrl} preload='auto' controls='controls' type='audio/mp3'></audio>
                    <br />
                    <input className={props.currentAudioUrl ? 'activeFocus__nameInput' : 'activeFocus__nameInput--hide'} type="text" value={props.newRecordingName} onChange={(e : any) => props.setNewRecordingName(e.target.value)} placeholder='name your new recording'/>
                    <br />
                    <button className={props.currentAudioUrl ? 'activeFocus__saveRecording' : 'activeFocus__saveRecording--hide'} onClick={() => {handleUpload(recordedFile, props.newRecordingName, props.session, props.user, props.setRecordingRefresh, props.setCurrentAudioUrl, props.setNewRecordingName)}}>Save recording</button>
                </div>
                <h3 className='activeFocus__recordingsTitle'>recordings:</h3>
                <div className='activeFocus__recordings'>
                    {props.recordings.length === 0 ? 
                    <p className='activeFocus__noRecordings'>make a recording!</p> : ''
                    }
                    {props.recordings.map((recording : Recording) => {

                        if (recording.focus_id === props.session!.focus![0].focus_id) {

                        //get data from recording buffer
                        const data : number[] = recording.data.data

                        //convert values into a uint8array
                        const uint = Uint8Array.from(data)
                        
                        //use blob to create new file
                        const newfile = new File([uint], `${recording.recording_name}.mp3`, {
                            type: 'audio/mp3'
                        })

                        const audioUrl = URL.createObjectURL(newfile)

                        const date = new Date(recording.timestamp).toLocaleString()

                        return (
                            <div className='activeFocus__recording' key={recording.recording_id}>
                                <div className='activeFocus__recordingBanner'>
                                    <h3 className='activeFocus__recordingTitle'>{recording.recording_name}</h3>
                                    <p className='activeFocus__recordingDate'>{date}</p>
                                </div>
                                <audio src={audioUrl} preload='auto' controls='controls' type='audio/mp3'></audio>
                            </div>
                        )
                        } else {
                        return ('')
                        }
                    })}
                </div>
                <h3 className='activeFocus__note'>notes: </h3>
                <NotesBlock focus={props.session.focus[0]} />
                <form className='activeFocus__form' onSubmit={(e : any) => {submitComment(e, props.user, props.session, props.setRefresh)}} id={props.session.focus[0].focus_id}>
                    <label name="new comment">
                        <textarea className='activeFocus__textArea' rows='4' name='comment' placeholder='type your notes here'/>                
                    </label>
                    <br />
                    <button className='activeFocus__newNote'>leave a note</button>
                </form>
            </div>
        )
    } else {
        return (
            <p>no focuses yet</p>
        )
    }
}