import React,{useState,useEffect} from 'react'
import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { FeedQuery,searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {

   if(searchTerm){
    setLoading(true)
    const query=searchQuery(searchTerm.toLowerCase())
    client.fetch(query).then((docs)=>{
      setPins(docs)
    setLoading(false)
    }).catch((e)=>console.log(e))
   }else{
    // if searchterm is empty it will return all the feeds like in home page
    client.fetch(FeedQuery).then((docs)=>{
      
      setPins(docs)
      setLoading(false)
    }).catch((e)=>console.log(e))
   }
  }, [searchTerm])
  return (
    <div>
      {loading&&(<Spinner message="Searching for pins..."/>)}
      {pins?.length>0 &&(<MasonryLayout pins={pins}/>)}
      {pins?.length===0 && searchTerm!=='' && !loading && 
      (<div className='mt-10 text-center text-xl'>
        No pins found
      </div>)}

    </div>
  )
}

export default Search