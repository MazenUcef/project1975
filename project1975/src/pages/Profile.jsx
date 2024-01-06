import React, { useState ,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../fireBase'
import { FaFileUpload } from 'react-icons/fa'

const Profile = () => {
  const fileRef = useRef(null)
  const  {currentUser} = useSelector(state =>state.user)
  const [file , setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0)
  const [filUplError , setFileUplError] = useState(false)
  const [formData ,setFormData] = useState({})

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
  return (
<>
<div className='profile max-w-lg mx-auto'>
  <h1 className='text-3xl font-semibold text-center my-7'>{currentUser.username}</h1>
  <form className='flex flex-col'>
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
