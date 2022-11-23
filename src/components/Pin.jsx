import React,{useState} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md';
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'
import { client,urlfor } from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({pin}) => {
    const [postHovered, setPostHovered] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const navigate=useNavigate();
    const user=fetchUser()
    const alreadySaved=(pin?.save?.filter((item)=>item?.postedBy?._id===user?.sub))?.length;
    const savePin=(id)=>{
        // this is a function to update sanity
         setSavingPost(true);
         client.patch(id).setIfMissing({save:[]}).insert('after','save[-1]',[{
            _key:uuidv4(),
            userId:user?.sub,
            postedBy:{
                _type:'postedBy',
                _ref:user?.sub,
            }
         }]).commit().then(()=>{
            window.location.reload();
            setSavingPost(false);
         })
    }
    const deletePin=(id)=>{
        client.delete(id).then(()=>{
            window.location.reload();
        })
    }
  return (
    <div className='m-2'>
        {/* we will check for mouse hover */}
        <div 
        onMouseEnter={()=>setPostHovered(true)} 
        onMouseLeave={()=>setPostHovered(false)} 
        onClick={()=>navigate(`/pin-details/${pin?._id}`)}
        className='relative cursor-zoom-in w-auto shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'>
            <img src={urlfor(pin?.image).width(250).url()} className='rounded-lg w-full md:' alt='user-post'/>
            {postHovered && (
            <div
                className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pd-2 z-50'
                style={{height:'100%'}}>
                    <div className='flex justify-between item-center'>
                        <div className='flex gap-2'>
                            {/* add the dl= to enable download */}
                            <a href={`${pin?.image?.asset?.url}?dl=`} 
                            download 
                            // so this stopPropagation helps prevent redirection when we click on the download button on the image
                            // normally it would download and also redirect to pin details page..but we only want it to download and still remain in the same page
                            // hence we use stopPropagation function to stop the redirection and only download 
                            onClick={(e)=>e.stopPropagation()}
                            className='bg-white h-9 w-9 rounded-full flex items-center justify-center text-dart text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                            >
                                <MdDownloadForOffline/>
                            </a>
                        </div>
                        { alreadySaved? (
                        <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                            {pin?.save?.length} Saved
                        </button>)
                        :
                        (<button type='button' 
                        onClick={(e)=>{
                            e.stopPropagation();
                            savePin(pin?._id)
                        }}
                        className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                            Save
                        </button>)}
                    </div>
                    <div className='flex justify-between items-center gap-2 w-full'>
                        {pin?.destination && (
                        <a href={pin?.destination} target='_blank' rel='noreferrer' 
                        className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                        onClick={(e)=>e.stopPropagation()}
                        >
                            <BsFillArrowUpRightCircleFill/>
                            {pin?.destination.length>20? pin?.destination.slice(8,20):pin?.destination.slice(8)}
                        </a>)}
                        { pin?.postedBy?._id===user?.sub && (
                        <button type='button' 
                        onClick={(e)=>{
                            e.stopPropagation();
                            deletePin(pin?._id)
                        }}
                         className='bg-white h-9 w-9 rounded-full flex items-center justify-center text-dart text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                            >
                            <AiTwotoneDelete/>
                        </button>)
                        }
                    </div>

            </div>)}
        </div>
        <Link to={`userProfile/${pin?.postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
            <img
            className='w-8 h-8 rounded-full object-cover'
            src={pin?.postedBy?.image}
            alt='user-profile'
            />
            <p className='text-semibold capitalize'>{pin?.postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin