import React,{useState,useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import {Link, useParams } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid';
import { client, urlfor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery,pinDetailQuery } from '../utils/data';

import Spinner from './Spinner';
const PinDetails = ({user}) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)

  const {pinId}=useParams();
  const fetchPinDetail=()=>{
    let query=pinDetailQuery(pinId)
    if(query){
    client.fetch(query).then((docs)=>{
      setPinDetail(docs[0])
      // fetch more details about pin
    
      if(docs[0]){
        // fetchs data or pins that are similar to this pin
        query=pinDetailMorePinQuery(docs[0]);
        client.fetch(query).then((res)=>{
          setPins(res);
        })
      }

    });
  }
  }
  const addComment=()=>{
    if(comment){
      setAddingComment(true)
      // insert at the end..if missing it creates a comment object else we add to the end
      client.patch(pinId).setIfMissing({comments:[]}).insert('after','comments[-1]',[{
        comment:comment,
        _key:uuidV4(),
        postedBy:{
          _type:"postedBy",
          _ref:user?._id
        }
      }]).commit().then(()=>{
        fetchPinDetail()
        // set commet back to empty string
        setComment('')
        setAddingComment(false)
      })
    }
  }
  useEffect(() => {
   fetchPinDetail();
  }, [pinId])
  if(!pinDetail) return <Spinner message="Loading Pin..."/>
  return (
    <>
    <div className='flex xl-flex-row flex-col m-auto bg-white mt-2' style={{maxWidth: '1500px', borderRadius: '32px'}}>
      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img src={pinDetail?.image && urlfor(pinDetail?.image).url()}
        className='rounded-t-3xl rounded-b-lg'
        alt='user-post'
        />

      </div>
      <div className='w-full p-5 flex-1 xl:min-w-620'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <a href={`${pinDetail?.image?.asset?.url}?dl=`} 
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
          <a href={pinDetail?.destination} target='_blank' rel='noreferrer' 
          className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
          onClick={(e)=>e.stopPropagation()}
          >
              <BsFillArrowUpRightCircleFill/>
              {pinDetail?.destination.length>20? pinDetail?.destination.slice(8,20):pinDetail?.destination.slice(8)}
          </a>

        </div>
        <div>
          <h1 className='text-4xl font-bold break-words mt-3'>
            {pinDetail?.title}
          </h1>
          <p className='mt-3'>{pinDetail?.about}</p>
        </div>
        {/* don't forget to start the link with / i.e "/name" */}
        <Link to={`/userProfile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
            className='w-8 h-8 rounded-full object-cover'
            src={pinDetail?.postedBy?.image}
            alt='user-profile'
            />
            <p className='text-semibold capitalize'>{pinDetail?.postedBy?.userName}</p>
        </Link>
        <h2 className='mt-5 text-2xl'> Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
          {pinDetail?.comments?.map((comment,i)=>(
          <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
            <img 
            src={comment?.postedBy?.image}
            alt="user-profile"
            className='w-10 h-10 rounded-full cursor-pointer'
            />
            <div className='flex flex-col'>
              <p className='font-bold'>{comment?.postedBy?.userName}</p>
              <p>{comment?.comment}</p>
            </div>
          </div>))}
        </div>
        <div className='flex flex-wrap mt-6 gap-3'>
          <Link to={`/userProfile/${pinDetail?.postedBy?._id}`} >
              <img
              className='w-10 h-10 rounded-full cursor-pointer'
              src={pinDetail?.postedBy?.image}
              alt='user-profile'
              />
          </Link>
          <input
          className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
          type='text'
          placeholder='Add a comment'
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          />
          <button type='button'
          onClick={()=>addComment()}
          className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
          >
            {addingComment?"Adding comment...":"Post"}
          </button>
        </div>
      </div>
    </div>
    {pins?
    (
    <>
    <h2 className='text-center font-bold text-2x mt-8 mb-4'> More Like this</h2>
    <MasonryLayout pins={pins}/>
    </>):(<Spinner message='loading more pins...'/>)}
    </>
  )
}

export default PinDetails