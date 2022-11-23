import React from 'react'
import { NavLink,Link } from 'react-router-dom';
import {RiHomeFill} from 'react-icons/ri';
import {IoIosArrowForward} from 'react-icons/io';
import logo from '../assets/logo.png';

// we destryctured the props coming
const Sidebar = ({user,closeToggle}) => {
    const isNotActiveStyle='flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-i-out capitalize';
    const isActiveStyle='flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-i-out capitalize';
    const handleCloseSidebar=()=>{
        // this comes from the home..the setToggleSidebar useState
        if(closeToggle)closeToggle(false);
    }
    const categories=[
        {name:"Animals"},{name:"Travel"},{name:"Technology"},{name:"Comedy"},{name:"Others"}
    ];
  return (
    <div className='flex flex-col justify-between h-full bg-white overflow-y-scroll min-w-210 hide-scrollbar'>
        <div className='flex flex-col'>
            <Link
            to="/"
            onClick={handleCloseSidebar}
            className='flex px-5 gap-2 my-6 w-190 pt-1 items-center'>
                <img src={logo} className='w-full h-10 object-cover' alt="logo"/>
            </Link>
            <div className='flex flex-col gap-5'>
                {/* so here if we are on home..the style will change */}
                <NavLink
                to='/'
                onClick={handleCloseSidebar}
                // the is active comes from the NavLink ..we just need to access it
                className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}>
                    <RiHomeFill/>
                    Home

                </NavLink>
                <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Categories</h3>
                {categories.slice(0,categories.length-1).map((category)=>(
                    <NavLink
                    to={`/category/${category.name}`}
                    onClick={handleCloseSidebar}
                    // the is active comes from the NavLink ..we just need to access it
                    className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}
// add a key cause we are looping and each needs to be unique
                    key={category.name}
                    >
                        {category.name}
                    </NavLink>
                ))}
            </div>
        </div>
        {user && (
        <Link
        to={`userProfile/${user?._id}`}
        className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
        onClick={handleCloseSidebar}
        >
            <img src={user.image} className='w-10 h-10 rounded-full' alt="user-profile"></img>
            <p>{user?.userName}</p>
        </Link>)}
    </div>
  )
}

export default Sidebar