import React,{useState} from 'react'
import {Routes,Route} from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreatePin from '../components/CreatePin';
import Feed from '../components/Feed';
import PinDetails from '../components/PinDetails';
import Search from '../components/Search';
const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
      </div>
      {/* this holds the routes to components tha would be showed..thhey all share same navBar */}
      {/* to navigate to anywhere here in any of the page just use the Link featue of react-router the add the to..it will automatically add the parameters needed to them from here */}
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed/>}/>
          <Route path='/category/:categoryId' element={<Feed/>}/>
          <Route path='/pin-details/:pinId' element={<PinDetails user={user && user}/>}/>
          <Route path='/create-pin' element={<CreatePin user={user&&user}/>}/>
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Pins