'use client'

import { comment, focus} from '../../custom_typings/index'
import './NotesBlock.scss'


export default function NotesBlock( props : {
    focus : focus,
}) {

    if (!props.focus || !props.focus.comment || props.focus.comment.length === 0) {
        return (
            <>
                <p className='no__notes'>no notes yet!</p>
            </>
        )
    }
    
    return(
        <section className='notes'>
            {props.focus.comment.map((comment: comment) => {
                
                //create date for comment
                const commentDate = new Date(comment.timestamp)
        
                return (
                <div className='note' key={comment.comment_id}>
                    <p className='note__body'>{comment.body}</p>
                    <div className='note__details'>
                        <p className='note__detail'>- {comment.user.username}</p>
                        <p className='note__detail'>on: {commentDate.toDateString()}</p>
                    </div>
                </div>
                )
            })}
        </section>
    )
}