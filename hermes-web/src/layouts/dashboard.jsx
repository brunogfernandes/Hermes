import React from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import '../assets/css/style.css'

import Header from '../components/dashboard/Header'
import Footer from '../components/dashboard/Footer'

function Dashboard() {

  const user = window.localStorage.getItem("user_id");

  if(!user) return <Navigate to="/login" replace/>;

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

export default Dashboard;