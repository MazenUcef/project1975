import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../fireBase';

const CreateListing = () => {
    const [files , setFiles] = useState([])
    const [formData , setFormData] = useState({
        imageUrls:[]
    })
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
  return (
<>
<main className='listing-section p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create Your Offer</h1>
    <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input
            type='text' placeholder='Name...' 
            className='border p-3 rounded-lg' id='name' 
            maxLength='62' minLength='10' required
            />
            <textarea
            type='text' placeholder='Description...' 
            className='border p-3 rounded-lg' id='description' required
            />
            <input
            type='text' placeholder='Address...' 
            className='border p-3 rounded-lg' id='address' required
            />
            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale' className='w-5'/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='rent' className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-5'/>
                    <span>Parking Slot</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-5'/>
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bedrooms' min={1} max={10} required/>
                    <p>bedrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bathrooms' min={1} max={10} required/>
                    <p>bathrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='regularPrice' min={1} max={10} required/>
                    <div className='flex flex-col items-center'>
                        <p>Regular price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='discountPrice' min={1} max={10} required/>
                    <div className='flex flex-col items-center'>
                        <p>Discounted price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
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
            <button className='p-3 bg-slate-700 text-write rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80 text-white'>Create Listing</button>
            <p className='text-red-700 text-sm'>{imageUplError && imageUplError}</p>
            </div>
    </form>
</main>
</>
  )
}

export default CreateListing
