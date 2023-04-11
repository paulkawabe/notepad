'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
const MicRecorder = require('mic-recorder-to-mp3');
import RecordingBlock from '../components/Recordings/Recordings';

interface Recording {
    data : Buffer,
    recording_id : string,
    recording_name : string,
    focus_id : string,
    user_id : string,
    timestamp : Date
}

interface Buffer {
    type : string,
    data : number[]
}

const Page =  () => {

    //states
    // const [recording, setRecording] = useState<boolean>(false);
    const [recordedFile, setRecordedFile] = useState<File | null>(null)
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('')
    const [recordings, setRecordings] = useState<Recording[]>([])
    const [newRecordingName, setNewRecordingName] = useState<string>('')
    const [activeFocusId, setActiveFocusId] = useState<string>('ff76a352-b8cd-4554-8f59-04231d329fcc')

    // New instance of mp3 recorder
    const [Mp3Recorder, setMp3Recorder] = useState(
        new MicRecorder({ bitRate: 128 })
    );

    // Start recording
    const startRecording = () => {
        Mp3Recorder
            .start()
            .then(() => {
                // setRecording(true)
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
                setCurrentAudioUrl(URL.createObjectURL(file))

            })
            .catch((error : any) => {
                console.log(error);
            });
    }

    //upload handler function
    const handleUpload = async () => {
        
        //check data to be uploaded. There is a named file
        if (!recordedFile || newRecordingName.length < 1) {
            console.log('please record something and ensure it is named')
            return
        }

        //create formdata with file and file name to send to server
        const formData = new FormData();
        formData.append('file', recordedFile, 'file.mp3')
        formData.append('recording_name', newRecordingName)
        formData.append('focus_id', 'ff76a352-b8cd-4554-8f59-04231d329fcc')
        formData.append('user_id', 'b1982217-7a44-48f2-b279-3ccfc6fa7276')

        axios
            .post('http://localhost:3000/api/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((result) => {
                console.log(result.data, 'upload successful')
            })
            .catch((error) => {
                console.log(error)
            })
    };

    //function for retrieving list of recordings by focus_id
    // const getRecordings = async () => {
    //     axios
    //         .get(`http://localhost:3000/api/recording/${activeFocusId}`)
    //         .then((result) => {
    //             setRecordings(result.data)
    //             console.log(result.data)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    const deleteRecordings = async () => {
        axios
            .delete('http://localhost:3000/api/recording')
            .then((result) => {
                console.log(result)
            })
    }


    return (
        <>
            <button onClick={() => {deleteRecordings()}}>delete all recordings</button>
            <h1>help</h1>
            <button onClick={startRecording}>start recording</button>
            <button onClick={stopRecording}>stop recording</button>
            <br />
            <br />
            <audio src={currentAudioUrl} preload='auto' controls='controls' type='audio/mp3'></audio>
            <br />
            <br />
            <input type="text" value={newRecordingName} onChange={(e : any) => setNewRecordingName(e.target.value)}/>
            <button onClick={handleUpload}>upload</button>
            <br />
            <br />
            {/* <button onClick={getRecordings}>get recording</button> */}
            <br />
            <button onClick={() => setActiveFocusId('ff76a352-b8cd-4554-8f59-04231d329fcc')}>set focus id</button>
            <h1>recordings</h1>
            <RecordingBlock focus_id={activeFocusId} />
            {/* {recordings.map((recording : Recording) => {
            
                //get data from recording buffer
                const data : number[] = recording.data.data

                //convert values into a uint8array
                const uint = Uint8Array.from(data)

                //create blob from uint8array
                const blob = new Blob([uint], { type: 'audio/mp3'})

                //use blob to create new file
                const newfile = new File([blob], `${recording.recording_name}.mp3`, {
                    type: 'audio/mp3'
                })

                const audioUrl = URL.createObjectURL(newfile)

                const date = new Date(recording.timestamp).toLocaleString()

                return (
                    <div key={recording.recording_id}>
                        <h3>{recording.recording_name}</h3>
                        <p>{date}</p>
                        <audio src={audioUrl} preload='auto' controls='controls' type='audio/mp3'></audio>
                    </div>
                )

            })} */}
        </>
    )
}

export default Page;