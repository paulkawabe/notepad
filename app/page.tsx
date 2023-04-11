'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import './Home.scss'

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const userId: string | null = sessionStorage.getItem('user_id')
    if (userId) {
      router.push(`http://localhost:3000/user/${userId}`)
    }
    
  }, [])
  
  return (
    <main className='home'>
      <div>
        <h1 className='home__hero'>Notepad</h1>
      </div>
      <p className='home__content'>
        Step up your practice with Notepad.
      </p>
      <div className='home__cards'>
        <div className='home__card'>
          <p className='home__content'>effortlessly document practice sessions</p>
        </div>
        <div className='home__card'>
          <p className='home__content'>create and sort recordings</p>
        </div>
        <div className='home__card'>
          <p className='home__content'>track your progress with ease</p>
        </div>
      </div>
      <div className='home__links'>
        <Link className='home__link' href='http://localhost:3000/login'>log in</Link>
        <Link className='home__link' href='http://localhost:3000/signup'>sign up</Link>
      </div>
    </main>
  )
}
