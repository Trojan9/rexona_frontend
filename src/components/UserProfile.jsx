import React,{useEffect,useState} from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams,useNavigate } from 'react-router-dom';
import { userCreatedPinsQuery,userQuery,userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import { googleLogout } from '@react-oauth/google';
import Spinner from './Spinner';

const UserProfile = () => {
  // this will get a random banner on the net from unsplash..you can use this in other projects also
const randomImage='https://static.vecteezy.com/system/resources/thumbnails/000/693/934/small/dark-blue-technology-and-high-tech-abstract-background.jpg'
const activeBtnStyles='bg-red-500 font-bold text-white p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles='bg-primary mr-4 font-bold text-black p-2 rounded-full w-20 outline-none';
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created'); //either created or Saved
  const [activeBtn, setActiveBtn] = useState('Created');
  const navigate=useNavigate();
  const {userId}=useParams();
  const logOut=(response)=>{
    googleLogout();
    localStorage.clear();
    navigate('/login');
  }
  useEffect(() => {
    const query=userQuery(userId);
    client.fetch(query).then((docs)=>{
      setUser(docs[0]);
    }).catch((e)=>console.log(e));
  }, [userId])
  useEffect(() => {
  if(text==='Created'){
          // get created pins
          const query=userCreatedPinsQuery(userId);
          client.fetch(query).then((docs)=>{
            setPins(docs)
          }).catch((e)=>console.log(e))

  }else{
    // get saved pins
    const query=userSavedPinsQuery(userId);
        client.fetch(query).then((docs)=>{
        setPins(docs)
        }).catch((e)=>console.log(e))
          }
  }, [text,userId])
  if(!user) return <Spinner message="Loading Profile..."/>
  return (
    // remember i said relative is also like stack..here also..he just add margin top so the user-profile starts on top at the middle..till a stack
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
            src={randomImage}
            className='w-full h-320 2xl:h-510 shadow-lg object-cover'
            alt="banner-pics"
            />
            <img
            className='rounded-full w-20 h-20 -mt-10 shadow-xl shadow-cover'
            src={user?.image}
            alt='user-pic'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user?.userName}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId===user?._id && (
                 <button 
                 type='button'
                 className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                 onClick={()=>logOut()}
                 >
                    <AiOutlineLogout color='red' fontSize={21}/>
                 </button>
              )}

            </div>

          </div>
          <div className='mb-7 text-center'>
            {/* switching between 2 buttons */}
                <button
                type='button'
                onClick={(e)=>{
                  setText(e.target.textContent);
                  setActiveBtn('Created')
                }}
                className={`${activeBtn==='Created'? activeBtnStyles:notActiveBtnStyles}`}
                >
                   Created
                </button>
                <button
                type='button'
                onClick={(e)=>{
                  setText(e.target.textContent);
                  setActiveBtn('Saved')
                }}
                className={`${activeBtn==='Saved'? activeBtnStyles:notActiveBtnStyles}`}
                >
                   Saved
                </button>
          </div>
          {pins?.length>0 ? (
            <div className='px-2'>
              <MasonryLayout pins={pins}/>
            </div>
          ):(<div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found
          </div>)}
          
        </div>

      </div>
      
    </div>
  )
}

export default UserProfile