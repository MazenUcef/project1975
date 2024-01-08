import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../fireBase';
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'

const CreateListing = () => {
    const {currentUser} = useSelector(state =>state.user)
    const [files , setFiles] = useState([])
    const [error,setError] = useState(false)
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()
    const [formData , setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bathrooms:1,
        bedrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    });
    const [uploading , setUploading] = useState(false);
    const [imageUplError , setImageUplError] = useState(false)
    console.log(formData);
    const handleImageSubmit = (e)=>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUplError(false)
            const promises = [];

            for(let i = 0 ; i < files.length  ;i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData , imageUrls: formData.imageUrls.concat(urls)});
                setImageUplError(false)
                setUploading(false)
            }).catch((err)=>{
                setImageUplError("Image upload failed (2 mb max per image");
                setUploading(false);
            });
            
        }else{
            setImageUplError('You can only upload 6 images per listing')
            setUploading(false)
        }
    }
    const storeImage = async(file) =>{
        return new Promise((resolve , reject)=>{
            const storage = getStorage(app);
            const fileName =new Date().getTime() + file.name;
            const storageRef = ref(storage , fileName);
            const uploadTask = uploadBytesResumable(storageRef , file)
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    const handleRemImg = (index) =>{
setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_ , i)=> i !==index),
})
    }
    const handelChange = (e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price')
            setLoading(true)
            setError(false)
            const res = await fetch('/api/listing/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });
            const data = await res.json();
            setLoading(false)
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }
  return (
<>
<main className='listing-section p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create Your Offer</h1>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input
            type='text' placeholder='Name...' 
            className='border p-3 rounded-lg' id='name' 
            maxLength='62' minLength='10' required onChange={handelChange} value={formData.name}
            />
            <textarea
            type='text' placeholder='Description...' onChange={handelChange}
            className='border p-3 rounded-lg' id='description' required value={formData.description}
            />
            <input
            type='text' placeholder='Address...' onChange={handelChange}
            className='border p-3 rounded-lg' id='address' required value={formData.address}
            />
            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale' 
                    className='w-5' onChange={handelChange} 
                    checked={formData.type === 'sale'}/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='rent' 
                    onChange={handelChange}
                    checked={formData.type === 'rent'}
                    className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking'
                    onChange={handelChange}
                    checked={formData.parking}
                    className='w-5'/>
                    <span>Parking Slot</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' 
                    onChange={handelChange}
                    checked={formData.furnished}
                    className='w-5'/>
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' 
                    onChange={handelChange}
                    checked={formData.offer}
                    className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' 
                    type='number' 
                    id='bedrooms' 
                    onChange={handelChange}
                    value={formData.bedrooms}
                    min={1} max={10} required/>
                    
                    <p>bedrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input 
                    onChange={handelChange}
                    value={formData.bathrooms}
                    className='p-3 border border-gray-300 rounded-lg' 
                    type='number' 
                    id='bathrooms' min={1} max={10} required/>
                    <p>bathrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input 
                    className='p-3 border border-gray-300 rounded-lg' 
                    onChange={handelChange}
                    value={formData.regularPrice}
                    type='number' 
                    id='regularPrice' min='50' max='1000000' required/>
                    <div className='flex flex-col items-center'>
                        <p>Regular price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                {formData.offer && (
                    <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' 
                    type='number'
                    onChange={handelChange}
                    value={formData.discountPrice} 
                    id='discountPrice' min='0' max='1000000' required/>
                    <div className='flex flex-col items-center'>
                        <p>Discounted price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                )}
                
            </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first one will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
                <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                <button type='button' onClick={handleImageSubmit} disabled={uploading} className='button uppercase'>
                {uploading ? 'Uploading...':'Upload'}
                </button>
            </div>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url , index)=>(
                    <div key={url} className='flex rounded-lg justify-between p-3 border item-center'>
                    <img  src={url} alt='listing image' className='rounded-lg w-20 h-20 object-contain'/>
                    <button type='button' onClick={()=>handleRemImg(index)} className='p-3 text-slate-500 rounded-full font-semibold uppercase hover:opacity-75 text-sm'>Delete</button>
                    </div>
                ))
            }
            <button disabled={loading || uploading} className='p-3 bg-slate-700 text-write rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80 text-white'>{loading ? 'Creating...' : 'Create Listing'}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
            <p className='text-red-700 text-sm'>{imageUplError && imageUplError}</p>
            </div>
    </form>
</main>
</>
  )
}

export default CreateListing
