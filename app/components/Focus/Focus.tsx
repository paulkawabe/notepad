'use client'

import NotesBlock from "../NotesBlock/NotesBlock"
import { Recording, session, focus} from '../../custom_typings/index'
import submitComment from "@/app/lib/submitComment";
import './Focus.scss'


export default function Focus( props : {
    focus : focus,
    recordings : Recording[],
    session : session,
    user : any,
    setRefresh : any,
}
) {

    const minutes = Math.floor(((new Date(props.focus.time_end!).getTime()) - (new Date(props.focus.time_start!).getTime())) / 60000)
    const hours = Math.floor(minutes / 60)
    const remainingMin = minutes % (hours ? hours : 1 * 60)
    const formattedTime = `${hours.toString().length > 1 ? hours.toString() : '0' + hours.toString()}:${remainingMin.toString().length > 1 ? remainingMin.toString() : '0' + remainingMin.toString()}`


    if (!!props.session.focus && !!props.session.focus.length) {
        return (
            <div key={props.focus.focus_id} className='focus'>
                <div className='focus__header'>
                    <h3 className='focus__title'>{props.focus.focus_title}</h3>
                    <p className='focus__duration'>duration: {formattedTime}</p>
                </div>
                <h3 className='focus__recordingsTitle'>recordings:</h3>
                <div className='focus__recordings'>
                    {props.recordings.map((recording : Recording) => {

                        if (recording.focus_id === props.focus.focus_id) {

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
                            <div className='focus__recording' key={recording.recording_id}>
                                <div className='focus__recordingBanner'>
                                    <h3 className='focus__recordingTitle'>{recording.recording_name}</h3>
                                    <p className='focus__recordingDate'>{date}</p>
                                </div>
                                <audio src={audioUrl} preload='auto' controls='controls' type='audio/mp3'></audio>
                            </div>
                        )
                        } else {
                        return (
                            <p className='focus__noRecordings'>no recordings were made for this focus area.</p>
                        )
                        }
                    })}
                </div>
                <h3 className='focus__note'>notes: </h3>
                <NotesBlock focus={props.focus} />
                <form className='focus__form' onSubmit={(e : any) => {submitComment(e, props.user, props.session, props.setRefresh)}} id={props.focus.focus_id}>
                    <label name="new comment">
                        <textarea className='focus__textArea' rows='4' name='comment' placeholder='type your notes here'/>
                    </label>
                    <br />
                    <button className='focus__newNote'>leave a note</button>
                </form>
            </div>
        )
    } else {
        return (
            <p>no focuses yet</p>
        )
    }
}