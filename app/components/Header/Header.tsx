'use client'

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import './Header.scss'

export default function Header(props : any) {

    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (sessionStorage.getItem('user_id') !== userId) {
            setUserId(sessionStorage.getItem('user_id'))
        }
    }, [usePathname()])
    
    const signoutHandler = () => {
        sessionStorage.clear()
        router.push('http://localhost:3000')
    }

    return (
        <header>
            <nav className='header'>
                <Link className='header__link--home' href='http://localhost:3000'>Notepad</Link>
                {userId ? '' : <Link className='header__link' href='http://localhost:3000/login'>Login</Link>}
                {userId ? '' : <Link className='header__link' href='http://localhost:3000/signup'>Signup</Link>}
                {userId ? <Link className='header__link' href={`http://localhost:3000/user/${userId}`}>Profile</Link> : null}
                {userId ? <button className='header__signout' onClick={() => {signoutHandler()}}>Signout</button> : null}
            </nav>
        </header>
    )
}