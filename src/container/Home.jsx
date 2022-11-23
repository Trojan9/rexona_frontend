import React from 'react'
import {useEffect,useRef,useState} from 'react';
import {HiMenu} from 'react-icons/hi';
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link,Routes,Route} from 'react-router-dom'
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import logo from '../assets/logo.png';
import {userQuery} from '../utils/data'
import {client} from '../client'
import Pins from './Pins'
function Home() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null)
   // scroll controller like in flutter
  const scrollRef=useRef(null);

  // if localstorage doesn't have user then we clear it
  const userInfo=localStorage.getItem('user')!=='undefined'?JSON.parse(localStorage.getItem('user')):localStorage.clear();

 
  useEffect(() => {
    // this will help outline the query we will send to sanity
    const query=userQuery(userInfo?.sub);
    client.fetch(query).then((data)=>{
      setUser(data[0]);
    }).catch((e)=>{console.log(e)});
  }, [])

  useEffect(() => {
   scrollRef.current.scrollTo(0,0);
  }, [])
  return (
  //  so in the div below..we use both flex-col and flex-row
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      {/* this is hidden for phone screen..this is like the side list of menu..this will show for laptop screens */}
      <div className='hidden md:flex h-screen flex-initial'>
        {/* if user exist send the user */}
        <Sidebar user={user && user}/>
      </div>
      {/* so this meubar will show on phone screens */}
      {/* this div is like the app bar at the top on mobile phones */}
      <div className='flex md:hidden flex-row'>
        {/* app bar contents its a row..so flex row...if its a column the flex column */}
        <div className='p-5 w-full flex flex-row justify-between items-center shadow-md'>
            <HiMenu fontSize={40} className='cursor-pointer' onClick={()=>setToggleSidebar(true)}/>
            <Link to="/">
              <img src={logo} className='w-28' alt='logo' ></img>
            </Link>
            {/* image and id from our sanity user */}
            <Link to={`UserProfile/${user?._id}`}>
              <img src={user?.image} className='w-28' alt='logo' ></img>
            </Link>
        </div>
         {/* so when the menubar is clicked this will show sliding in */}
          {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full justify-end flex items-center p-2'>
              <AiFillCloseCircle fontSize={30} className=' cursor-pointer' onClick={()=>setToggleSidebar(false)}/>
            </div>
            {/* if user exist send the user ..this also send the function to close toggle..just like passing a fuction in state widget flutter*/}
            <Sidebar user={user && user} closeToggle={setToggleSidebar}/>

          </div>)}
      </div>
     {/* this is the body of the page...the app bar remains the same but the body will change according to the link url... */}
     {/* so when we have /UserProfile/:userId the userProfile shows and otherwise pins shows */}
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/UserProfile/:userId' element={<UserProfile/>}/>
          <Route path='/*' element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home