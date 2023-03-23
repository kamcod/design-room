import React, {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import axioInstance from "@app/utils/axios";
import axios from "axios";

const PrivateRoute = () => {
  const [isAuth, setIsAuth] = useState(true);
  useEffect(() => {
      console.log('in private routes...')
    axios.get('http://localhost:8000/api/getDashboardStats')
        .then(res => {
          if(res.status === 200){
            setIsAuth(true);
          }
        })
        .catch(err => {
          console.log(err);
          setIsAuth(false);
        })
  }, [])
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
