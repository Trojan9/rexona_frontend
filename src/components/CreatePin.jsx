import React, {useState} from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';
// categories [{name, image}];

const CreatePin = ({user}) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImagetype, setWrongImagetype] = useState(false);

  const navigate=useNavigate();
  const uploadImage=(e)=>{
  // to get the  file
    const selectedFile=e.target.files[0];
    // to get type of file
    const {type,name}=e.target.files[0];
    if(type==='image/png' || type==='image/jpg' || type==='image/jpeg' || type==='image/gif' || type==='image/tiff' || type==='image/svg'){
      setWrongImagetype(false)
      setLoading(true)
      client.assets.upload('image',e.target.files[0],{contentType:type, filename:name}).then((docs)=>{
        console.log(docs);
        // then initialize the image uploaded to our asset
        setImageAsset(docs);
        setLoading(false)
      }).catch((error)=>{
        console.log(error);
      });
    }else{
      setWrongImagetype(true)
    }
  }
  const savePin=()=>{
    if(title && category && about && destination && imageAsset?._id){
      // if the about abd value are named the same you dont have to write it twice it could be 
      // const doc={
      //   _type:"pin",
      //   title,
      //   about,
      //   destination
      // }
      // but so i don't get confused later on..i write in full
      const doc={
        _type:"pin",
        title:title,
        about:about,
        destination:destination,
        image:{
          _type:'image',
          asset:{
            _type:'reference',
            _ref: imageAsset?._id //so we pass the uploaded image to this guy using the ID
          }
        },
        userId:user?._id,
        postedBy:{
          _type:'postedBy',
          _ref:user?._id,
        },
        category:category
      };

      client.create(doc).then((document)=>{ navigate('/')})
    }else{
      setFields(true);
      setTimeout(()=>
        setFields(false)
      ,2000)
    }
  }
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (<p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
        Please fill in all the fields
      </p>)}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondary flex flex-0.7 p-3 w-full'>
          <div className='flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading&&(<Spinner/>)}
            {wrongImagetype && (<p>Wrong Image Type</p>)}
            {!imageAsset? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <p className='font-bold text-2xl'>
                        <AiOutlineCloudUpload/>
                    </p>
                    <p className='text-lg'>
                      Click to upload
                    </p>
                  </div>
                    <p className='mt-32 text-gray-400'>
                      Use high-quality JPG, JPEG, SVG , PNG , GIF  or TIFF less than 20mb
                    </p>
                  </div>
                    <input type='file'
                    name="upload-image" 
                    onChange={uploadImage} 
                    className='w-0 h-0'></input>
              </label>):(
                <div className='relative h-full'>
                  <img src={imageAsset?.url} alt='uploaded-pics' className='h-full w-full'/>
                  <button  type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out' onClick={()=>setImageAsset(null)}>
                    <MdDelete/>
                  </button>
                </div>)}
          </div>
        </div>
        
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input type='text' 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 '
          />
          {user && (
            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
              <img 
                src={user?.image}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
              />
              <p 
                className='font-bold'>{user?.userName}
              </p>

            </div>
          )}

          <input type='text' 
            value={about} 
            onChange={(e)=>setAbout(e.target.value)}
            placeholder='What is your pin about'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 '
          />
          <input type='text' 
            value={destination} 
            onChange={(e)=>setDestination(e.target.value)}
            placeholder='Add a destination Link'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 '
          />
          <div className='flex flex-col'>
            
              <p className='mb-2 font-semibold text-lg sm:text-xl'>
                Choose Pin Category
              </p>
            <select 
              onChange={(e)=>setCategory(e.target.value)}
              className='outine-none w-4/5 border-b-2 p-2 rounded-md border-gray-200 cursor-pointer w-4/5 text-base'>
              {/* default category */}
              <option value='other' className='bg-white'>
                Select Category
              </option>
              {/* then use once from our backend */}
              {categories.map((category)=>(
              <option value={category.name}  className='bg-white text-base border-0 capitalize text-black'>
                {category.name}
              </option>))}
            </select>
          </div>
          <div className='flex items-end justify-end mt-5'>
            {/* don't forget to always add arrow function this gave me headAche */}
            <button type='button' onClick={()=>savePin()} className='bg-red-400 text-white font-bold p-2 rounded-full w-28 outline-none'>
              Save Pin
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
