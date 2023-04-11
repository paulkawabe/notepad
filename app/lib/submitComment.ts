import axios from 'axios';
import { Buffer, Recording, session, comment, focus} from '../custom_typings/index'


const submitComment = (
    e: any,
    user : any,
    session : session,
    setRefresh : any
) => {
    
    e.preventDefault();

    const body = {
      focus_id : e.target.id,
      body : e.target.comment.value,
      session_id : session?.session_id,
      user_id : user.id
    }

    axios
      .post('http://localhost:3000/api/comment', body)
      .then((result) => {
        console.log(result.data)
        setRefresh(true);
        e.target.reset();
      })
}

export default submitComment;