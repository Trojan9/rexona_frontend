import React from 'react';
import {Routes,Route,useNavigator} from 'react-router-dom'
import Login  from './components/Login';
import Home from './container/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
// note evry variable in your .env file must start with REACT_APP_ else it won't work or see it to access
const app = () => {
  return (
    // so we need to wrap our application with googleOAuth in order to use goole signIn and googleSignOut
  <GoogleOAuthProvider clientId={`${process.env.REACT_APP_CLIENT_ID_GOOGLE_AUTH}`}>
   <Routes>
        <Route path='login' element={<Login/>}></Route>
        <Route path='/*' element={<Home/>}></Route>
   </Routes>
   </GoogleOAuthProvider>
  )
}

export default app