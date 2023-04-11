//TYPE DEFINITIONS

export interface pageProps {
    params : { session : string, id : string }
}

//define focus object
export interface focus {
    focus_id : string,
    session_id : string,
    focus_title : string,
    time_start : string,
    time_end: string,
    comment?: comment[]
}

//define comment object
export interface comment {
    comment_id : string,
    focus_id : string,
    session_id : string,
    body : string,
    user_id : string,
    user: any,
    timestamp : Date
}

//define session object
export interface session {
    session_id? : string,
    owner_id? : string,
    session_name? : string,
    time_start? : string,
    time_end? : string,
    focus? : focus[],
    comment? : object[],
}

//define recording object
export interface Recording {
    data : Buffer,
    recording_id : string,
    recording_name : string,
    focus_id : string,
    user_id : string,
    timestamp : Date
}

//define Buffer object
export interface Buffer {
    type : string,
    data : number[]
}