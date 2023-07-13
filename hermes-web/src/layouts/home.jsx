import React from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import '../assets/css/login.css'

import Header from '../components/home/Header'
import Footer from '../components/home/Footer'

function Home() {

  const user = window.localStorage.getItem("user_id");

  if(user) return <Navigate to="/dashboard" replace/>;

  return (
    <>
    <Header/>
      <main id="main-content-wrapper">
        <Outlet/>
      </main>
    <Footer/>
    </>
  );
}

export default Home;