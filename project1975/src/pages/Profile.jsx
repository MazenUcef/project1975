import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const  {currentUser} = useSelector(state =>state.user)
  return (
<>
<div className='profile max-w-lg mx-auto'>
  <h1 className='text-3xl font-semibold text-center my-7'>{currentUser.username}</h1>
  <form className='flex flex-col'>
    <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser.avatar} alt=''/>
    <input type='text' placeholder={currentUser.username} className='border p-3 rounded-full mt-6' id='username'/>
    <input type='email' placeholder={currentUser.email} className='border p-3 rounded-full my-2' id='email'/>
    <input type='password' placeholder='password' className='border p-3 rounded-full my-1' id='password'/>
    <button className='button p-3 uppercase'>update</button>
    </form>
    <div className='flex justify-between mt-5'>
    <span className='text-slate-700 cursor-pointer hover:text-red-700'>Delete Account</span>
    <span className='text-slate-700 cursor-pointer hover:text-red-700'>Sign out</span>
    </div>
</div>
</>
  )
}

export default Profile
