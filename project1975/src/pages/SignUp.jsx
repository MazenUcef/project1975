import React from 'react'
import {Link} from 'react-router-dom'



const SignUp = () => {
  return (
<>
  <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-bold text-center my-7'>Sign Up</h1>
    <form className='flex flex-col gap-4'>
      <input type='text' placeholder='username..' className='border p-3 rounded-lg' id='username'/>
      <input type='email' placeholder='email..' className='border p-3 rounded-lg' id='email'/>
      <input type='password' placeholder='password..' className='border p-3 rounded-lg' id='password'/>
      <button className='button font-bold  uppercase'> Sign Up</button>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Have an account?</p>
      <Link to='/sign-in' >
        <span className='text-blue-700'>Sign In</span>
      </Link>
    </div>
  </div>
</>
  )
}

export default SignUp
