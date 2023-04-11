'use client'

import { useState } from "react";
import axios from 'axios';
import './Signup.scss'
import { useRouter } from "next/navigation";

export default function page() {

    const router = useRouter();
    
    const [firstname, setFirstname] = useState<string>('')
    const [lastname, setLastname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    

    const handleSignup = async (e: any) => {
        e.preventDefault()

        const body = {
            firstname,
            lastname,
            email,
            username,
            password
        }

        axios
            .post('http://localhost:3000/api/user', body)
            .then((result) => {
                console.log(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className='signup'>
            <h1>Signup page</h1>
            <form onSubmit={handleSignup}>
                <div className='signup__form' >
                    <div>
                        <label className='signup__label'>
                            Firstname
                        </label>
                        <br />
                        <input className='signup__input' type="text" name='firstname' value={firstname} onChange={(e : any) => {setFirstname(e.target.value)}}/>
                        <br />
                        <br />
                        <label className='signup__label'>
                            Lastname
                        </label>
                        <br />
                        <input className='signup__input' type="text" name='lastname' value={lastname} onChange={(e : any) => {setLastname(e.target.value)}}/>
                        <br />
                        <br />
                        <label className='signup__label'>
                            Email
                        </label>
                        <br />
                        <input className='signup__input' type="text" name='email' value={email} onChange={(e : any) => {setEmail(e.target.value)}}/>
                        <br />
                        <br />
                    </div>
                    <div>
                        <label className='signup__label'>
                            Username
                        </label>
                        <br />
                        <input className='signup__input' type="text" name='username' value={username} onChange={(e : any) => {setUsername(e.target.value)}}/>
                        <br />
                        <br />
                        <label className='signup__label'>
                            Password
                        </label>
                        <br />
                        <input className='signup__input' type="text" name='password' value={password} onChange={(e : any) => {setPassword(e.target.value)}}/>
                        <br />
                        <br />
                    </div>
                </div>
                <button className='signup__signup'>Signup</button>
            </form>
        </div>
    )
}