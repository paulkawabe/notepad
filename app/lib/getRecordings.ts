import axios from "axios"

//function for retrieving list of recordings by session_id
export default async function getRecordings(
    sessionId : string,
    setRecordings : any
) {
    axios
        .get(`http://localhost:3000/api/recording/${sessionId}`)
        .then((result) => {
        setRecordings(result.data)
        })
        .catch((error) => {
        console.log(error)
        })
}