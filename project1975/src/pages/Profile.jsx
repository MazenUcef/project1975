import React, { useState ,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../fireBase'
import {updateUserStart , updateUserSuccess , updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signInFailure, signOutUserFailure} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'



const Profile = () => {
  const fileRef = useRef(null)
  const  {currentUser ,loading , error} = useSelector(state =>state.user)
  const [file , setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0)
  const [filUplError , setFileUplError] = useState(false)
  const [formData ,setFormData] = useState({})
  const [userListings , setUserListings] = useState([])
  // console.log(formData);
  const [updSuccess , setUpdSuccess] = useState(false)
  const [showListingsError , setShowListingsError] = useState(false)
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




// =========================================




const  handleChange = (e) =>{
setFormData({...formData , [e.target.id]: e.target.value});
}











// ================================================================








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






// ==============================================================





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




// =========================================================



const handleSignOut = async () =>{
try {
  dispatch(signOutUserStart());
  const res = await fetch(`/api/auth/signout`);
  const data = await res.json();
  if(data.success === false){
    dispatch(signOutUserFailure(data.message))
    return;
  }
  dispatch(signOutUserSuccess(data))
} catch (error) {
  dispatch(signOutUserFailure(error.message))
}
}
const handleShowListings = async () =>{
try {
  setShowListingsError(false)
  const res = await fetch(`/api/user/listings/${currentUser._id}`);
  const data = await res.json();
  if(data.success === false){
    setShowListingsError(true)
    return;
  }
  setUserListings(data)
} catch (error) {
  setShowListingsError(true)
}
}
const handleListingDelete = async (listingId) =>{
try {
  const res = await fetch(`/api/listing/delete/${listingId}`,{
    method: 'DELETE',
  });
  const data  =  await res.json();
  if(data.success === false){
    console.log(data.message);
    return
  }
  setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingId))
} catch (error) {
  console.log(error.message);
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
    <Link className='button uppercase p-3 text-center' to={'/create-listing'}> Create Listing</Link>
    </form>
    <div className='flex justify-between mt-5'>
    <span onClick={handleDeleteUser} className='text-slate-700 cursor-pointer hover:text-red-700'>Delete Account</span>
    <span onClick={handleSignOut} className='text-slate-700 cursor-pointer hover:text-red-700'>Sign out</span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>{updSuccess ? 'User is Updated Successfully' : ''}</p>
    <button onClick={handleShowListings} className='button w-full my-3 uppercase'>Show Listings</button>
    <p className='text-red-700'>{showListingsError? 'Error showing listings':''}</p>
    {
      userListings && userListings.length > 0 &&
      <div className='flex flex-col gap-4'>
      <h1 className='text-center my-7 text-3xl text-slate-600 font-semibold'>Your Offers</h1>
      {userListings.map((listing)=>(
        <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img className='h-16 w-16 object-contain rounded-lg ' src={listing.imageUrls} alt='listing img'/>
          </Link>
          <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>
          <div className='flex flex-col item-center'>
            <button onClick={()=>handleListingDelete(listing._id)} className='uppercase text-slate-700 text-xs font-semibold hover:text-red-500'>Delete</button>
            <button className='uppercase text-slate-700 text-xs font-semibold hover:text-green-500'>Edit</button>
          </div>
        </div>
      ))}
      </div>
    }
</div>
</>
  )
}

export default Profile
