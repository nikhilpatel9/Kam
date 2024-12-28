/* eslint-disable no-unused-vars */
import { TextInput ,Select, FileInput, Button, Alert} from "flowbite-react";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function CreateLead() {
    const [file,setFile] =useState(null);
    const [imageUploadProcess,setImageUploadProcess] = useState(null);
    const [imageUploadError,setImageUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const [publishError,setPublicError]=useState(null);
    const navigate =useNavigate();
    const handleUploadImage=async()=>{
        try {
            if(!file){
                setImageUploadError("Please select an image");
                return;
            }
            setImageUploadError(null);
            const storage= getStorage(app);
            const fileName = new Date().getTime()+'-'+file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProcess(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("Image Upload failed");
                    setImageUploadProcess(null);
                    console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                            setImageUploadProcess(null);
                            setImageUploadError(null);
                            setFormData({...formData,image:downloadURL});
                        });
                   } 
    );
}
    catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadError(null);
        }
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        try {
            const res=await fetch('/api/lead/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                    },
                    body:JSON.stringify(formData)
                    });
                    const data=await res.json()
            
            if(!res.ok){
                setPublicError(data.message);
                return;
            }
            if(res.ok){
                setPublicError(null);
                navigate(`/lead/${data.slug}`)
            }
        } catch(error) {
                
                setPublicError('Something went wrong');
            }
 };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Create Lead</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" placeholder="Restaurant Name" required id='title'
                className="flex-1"
                onChange={(e)=>{
                    setFormData({...formData,title:e.target.value});
                }}
                />
                <TextInput type="text" placeholder="Category" required id="category" onChange={(e)=>{
                    setFormData({...formData,category:e.target.value});
                }}/>

            </div>
            <div className="flex gap-4 items-center justify-between border-4
            border-teal-500 border-dotted p-3">
                <FileInput type='file' accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
                <Button type="button" gradientDuoTone='purpleToBlue' size='sm'
                outline
                onClick={handleUploadImage}
                disabled={imageUploadProcess}
                >
                    {imageUploadProcess ? (
                    <div className="w-16 h-16">
                        <CircularProgressbar 
                        value={imageUploadProcess} 
                        text={`${imageUploadProcess|| 0}%`}/>
                    </div>):(
                        'Upload Image'
                    )}
                </Button>
            </div>
            {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>  }
            {
                formData.image && (
                    <img src={formData.image} alt="upload" className="w-full h-72 object-cover"
                    />
                )
            }
            <ReactQuill
            theme="snow"
            placeholder="Restaurant Details..."
            className="h-48 mb-12 editor-container text-gray-900 dark:text-gray-100
            [&_.ql-snow_.ql-stroke]:stroke-gray-900 dark:[&_.ql-snow_.ql-stroke]:stroke-gray-400 
            [&_.ql-snow_.ql-fill]:fill-gray-900 dark:[&_.ql-snow_.ql-fill]:fill-gray-400
            [&_.ql-editor]:text-gray-900 dark:[&_.ql-editor]:text-gray-100
            [&_.ql-picker]:text-gray-900 dark:[&_.ql-picker]:text-gray-100
            [&_.ql-editor.ql-blank::before]:text-gray-900 dark:[&_.ql-editor.ql-blank::before]:text-gray-400"
            required
            modules={{
                toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                ['clean'],
                ],
            }}
            formats={[
                'header',
                'bold', 'italic', 'underline', 'strike',
                'list', 'bullet',
                'link', 'image', 'video',
            ]}
            onChange={(content) => {
                setFormData((prevData) => ({ ...prevData, content }));
            }}
            onFocus={() => console.log('Editor focused')}
            onBlur={() => console.log('Editor blurred')}
            />
            <h1 className="text-xl">
              Restaurant Contact Details
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput type="text" placeholder="Phone no. +91XXXXXXXXXX" 
                className="flex-1"
                onChange={(e)=>{
                    setFormData({...formData,phone:e.target.value});
                }}
              />
              <TextInput type="email" placeholder="xxx@email.com" 
                className="flex-1"
                onChange={(e)=>{
                    setFormData({...formData,email:e.target.value});
                }}
              />
            </div>
             
            <Button type="submit" 
            gradientDuoTone='purpleToBlue'>
                Submit
                </Button>
                {publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>}
                
        </form>
    </div>
  )
}
