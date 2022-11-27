import React,{useState,useEffect} from 'react'
import {searchQuery,FeedQuery} from '../utils/data'
// user params can be used to get params from the link..i.e category/1234.....1234 is the id we can get the params from the link
import { useParams } from 'react-router-dom'
import {client} from '../client'
// check online for wetin masonry mean..its like a grid list view without same height..so some are longer than the other
import MasonryLayout from '../components/MasonryLayout'
import Spinner from '../components/Spinner'
const Feed = () => {
  const [Loading, setLoading] = useState(true);
  const [pins, setPins] = useState(null)
  // now we get params for categoryid..so anytime we choose a new category on the sidebar this will change
  // so we need to listen using useEffect to refresh feeds
  const {categoryId}=useParams();
  useEffect(() => {
    if(categoryId){
      const query=searchQuery(categoryId);
      client.fetch(query).then((data)=>{
        setPins(data)
        setLoading(false)
      }).catch((e)=>{})
      
    }else{
      client.fetch(FeedQuery).then((data)=>{
        setPins(data)
        setLoading(false)
      }).catch((e)=>{})
      
    }
  }, [categoryId])

  if(Loading)return <Spinner message='we are adding new ideas to your spinner'/>
  if(!pins?.length>0)return <h2 className='flex mt-10 items-center justify-center'>No pins available</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed