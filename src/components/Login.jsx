import React from 'react'
import {useNavigate} from 'react-router-dom'
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import {client} from '../client.js';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// <GoogleOAuthProvider clientId="309210128428-h30clp6oji0v8s87nlf6q85mu4vb6ocg.apps.googleusercontent.com">...</GoogleOAuthProvider>;
function Login() {
    // for navigation
    const navigate=useNavigate()
    const responseGoogle=(response)=>{
        // so we need to jwt decode the response comeing
        if(response!=null){
           const decode=jwt_decode(response.credential)
            // store in local storage like shredPreference in flutter
            localStorage.setItem('user',JSON.stringify(decode));
            // then we store in our sanity DB
            const {name, sub,picture}=decode

            // so ow we create a document of user schema like in or db
            const doc={
                _id:sub,
                _type:"user",
                userName:name,
                image:picture
            }
            // adds to the clientDB if not exist
            client.createIfNotExists(doc).then(()=>{
                // then we navigate to home screen
                navigate('/',{replace:true})
            }).catch((e)=>
            {console.log(e)});
        }
    }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        {/* i.e every component in this div will take full width and full height */}
        <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                     typeof="video/mp4"
                        loop
                    controls={false}
                        muted
                            autoPlay
                    // object cover will make video take the whole width and height specified
                     className='w-full h-full object-cover'>

                 </video>
                 {/* this will make the div absolutely placed at the ceter */}
                <div className='absolute flex flex-col justify-center items-center left-0 right-0 bottom-0 top-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} alt="logo" width="130px" className='object-cover h-10'/>
                    </div>
                    <div className='shadow-2x1'>
                        {/* <GoogleOAuthProvider clientId='309210128428-h30clp6oji0v8s87nlf6q85mu4vb6ocg.apps.googleusercontent.com'>

                            <button type='button' className='bg-mainColor flex items-center justify-center p-5'>
                                {/* margin right of 4..so there is a mrgin at the right side */}
                                {/* <FcGoogle className='mr-4'/>
                                Sign In With Google
                            </button>
                        </GoogleOAuthProvider> */}
                        <GoogleLogin
                                onSuccess={credentialResponse => {
                                    responseGoogle(credentialResponse);
                                        }}
                                onError={(credentialResponse) => {
                                    responseGoogle(credentialResponse);
                                            }}
                        />;
                    </div>
                </div>
               

        </div>

    </div>
  )
}

export default Login