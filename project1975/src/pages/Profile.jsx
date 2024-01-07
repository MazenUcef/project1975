import React, { useState ,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../fireBase'
import {updateUserStart , updateUserSuccess , updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'



const Profile = () => {
  const fileRef = useRef(null)
  const  {currentUser ,loading , error} = useSelector(state =>state.user)
  const [file , setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0)
  const [filUplError , setFileUplError] = useState(false)
  const [formData ,setFormData] = useState({})
  console.log(formData);
  const [updSuccess , setUpdSuccess] = useState(false)
  const dispatch = useDispatch() 

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])
  const handleFileUpload = (file) =>{
const storage = getStorage(app);
const fileName = new Date().getTime() + file.name ;
const storageRef = ref(storage , fileName)
const uploadTask = uploadBytesResumable(storageRef , file)
  

uploadTask.on('state_changed',
(snapshot)=>{
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  setFilePerc(Math.round(progress))
  // console.log('Upload is'+ progress +'% done');
},
(error)=>{
setFileUplError(true)
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
setFormData({...formData , avatar:downloadURL})
      )
    }
  )
}
const  handleChange = (e) =>{
setFormData({...formData , [e.target.id]: e.target.value});
}
const handleSubmit = async (e)=>{
  // window.preventDefault()
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`,{
      method:'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body:JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.messaage));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdSuccess(true)
  } catch (error) {
    dispatch(updateUserFailure(error.message))
  }
}
const handleDeleteUser = async ()=>{
  try {
    dispatch(deleteUserStart())
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method :'DELETE',
    });
    const data  = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }
    dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}
  return (
<>
<div className='profile max-w-lg mx-auto'>
  <h1 className='text-3xl font-semibold text-center my-7'>{currentUser.username}</h1>
  <form onSubmit={handleSubmit} className='flex flex-col'>
    <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
    <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
    src={formData.avatar || currentUser.avatar} alt=''/>
    
    <p className='text-sm self-center mt-3'>{
      filUplError?(
    <span className='text-red-700'>Error Img upload (image must be less than 2 mb)</span>) :
    filePerc > 0 && filePerc < 100 ? (
      <span className='text-green-700'>{`Uploading ${filePerc}%`}</span>) :
      filePerc === 100 ? (
        <span className='text-green-700'>Successfully uploaded</span>) :
        ''
       
    }</p>
    <input onChange={handleChange} type='text' placeholder={currentUser.username} defaultValue={currentUser.username} className='border p-3 rounded-full mt-6' id='username'/>
    <input onChange={handleChange} type='email' placeholder={currentUser.email} defaultValue={currentUser.email} className='border p-3 rounded-full my-2' id='email'/>
    <input onChange={handleChange} type='password' placeholder='password' className='border p-3 rounded-full my-1' id='password'/>
    <button disabled={loading} className='button p-3 my-3 uppercase'>{loading ? 'Loading...' : 'Update'}</button>
    </form>
    <div className='flex justify-between mt-5'>
    <span onClick={handleDeleteUser} className='text-slate-700 cursor-pointer hover:text-red-700'>Delete Account</span>
    <span className='text-slate-700 cursor-pointer hover:text-red-700'>Sign out</span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>{updSuccess ? 'User is Updated Successfully' : ''}</p>
</div>
</>
  )
}

export default Profile
