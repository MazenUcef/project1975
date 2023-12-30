import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'


const Header = () => {
  return (
<>
<header className='shadow-md'>
<div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
    <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='title1'>Project</span>
            <span className='title2'>Estate</span>
        </h1>
    </Link>
    <form className='bg-slate-300 p-2 rounded-lg flex items-center'>
        <input type='text' placeholder='Search....' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
        <FaSearch className='text-slate-600'/>
    </form>
    <ul className='flex gap-4'>
        <Link to='/'><li className='hidden sm:inline hover:underline text-slate-300'>Home</li></Link>
        <Link to='/about'><li className='hidden sm:inline hover:underline text-slate-300'>About</li></Link>
        <Link to='/sign-in'><li className='hover:underline text-slate-300'>Sign In</li></Link>
    </ul>
</div>
</header>
</>
  )
}

export default Header
