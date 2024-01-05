import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../fireBase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {Link , useNavigate} from 'react-router-dom'


const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async ()=>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result  = await signInWithPopup(auth , provider)
            const res = await fetch('/api/auth/google' , {
                method :'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName , email : result.user.email , photo :result.user.photoURL
                })
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("could not sign in with googl" , error);
        }
    }
  return (
<>
<button onClick={handleGoogleClick} type='button' className='google-button button bg-red-500 text-white p-3 rounded-lg uppercase'>Continue with google</button>
</>
  )
}

export default OAuth
