import axios from "axios";
import { Buffer, Recording, session, comment, focus} from '../custom_typings/index'


//save session handler
const saveSession = (
    e: any,
    router : any,
    session : session
) => {

    e.preventDefault();

    const currentTime = new Date()

    const updateBody = {
        time_end : currentTime.toISOString()
    }

    axios
        .put(`http://localhost:3000/api/session/${session?.session_id}`, updateBody)
        .then((result) => {
        console.log(result)
        router.push(`http://localhost:3000/user/${session?.owner_id}`)
        })
        .catch((error) => {
        console.log(error)
        })
}

export default saveSession;