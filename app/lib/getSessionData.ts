import axios from "axios"

//make sure to pass params.session for session id

export default function getSessionData(
    sessionId : string,
    router : any,
    setSession : any,
    setActiveFocusId : any,
    setPastFocuses : any,
    setRecordingRefresh : any
) {
    axios
    .get(`http://localhost:3000/api/session/${sessionId}`)
    .then((result) => {

      if (!result.data.active) {
        router.push(`http://localhost:3000/user/${result.data.user_id}/session/${result.data.session_id}`)
      }

      setSession(result.data)
      if (result.data.focus.length > 0) {
        setActiveFocusId(result.data.focus[0].focus_id)
      }

      if (result.data.focus.length > 1) {
        //get the past focuses from data and remove the active/most recent one
        const nonActiveFocuses = [...result.data.focus];
        nonActiveFocuses.shift();

        //set past focuses with reversed order
        setPastFocuses(nonActiveFocuses)

      } else {
        console.log('either one or no focuses right now')
      }

      return result
    })
    .then((result) => {
      //
      setRecordingRefresh(true)
    })
    .catch((error) => {
      console.log(error)
    })
}