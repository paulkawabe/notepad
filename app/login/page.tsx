'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import './Login.scss'
import axios from 'axios';

export default function page() {

    //initialize router
    const router = useRouter();
    
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    

    const handleLogin = async (e: any) => {
        e.preventDefault()

        //create obj to send to login endpoint
        const body = {
            email,
            password
        }

        //check credentials against db and assign a jwt if correct
        axios
            .post('http://localhost:3000/api/login', body)
            .then((result) => {
                sessionStorage.setItem( 'authorization', result.data.authToken )
                sessionStorage.setItem( 'user_id', result.data.user_id)
                setEmail('')
                setPassword('')
                router.refresh()
                router.push(`http://localhost:3000/user/${result.data.user_id}`)
            })
            .catch((error) => {
                setEmail('')
                setPassword('')
                console.log(error)
            })
    }

    return (
        <main className='login'>
            <h1>Login page</h1>
            <form onSubmit={handleLogin}>
                <label className='login__label'> 
                    Username: <br />
                </label>
                    <input className='login__input' type="text" name='username' value={email} onChange={(e : any) => {setEmail(e.target.value)}}/>
                <br /><br />
                <label className='login__label'>
                    Password: <br />
                </label>
                    <input className='login__input' type="text" name='password' value={password} onChange={(e : any) => {setPassword(e.target.value)}}/>
                <br />
                <br />
                <button className='login__login'>login</button>
            </form>
        </main>
    )
}