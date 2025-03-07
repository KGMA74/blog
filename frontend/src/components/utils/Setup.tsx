'use client';
import React from "react";
import useVerify from "../../hooks/useVerify";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Setup = () => {
    useVerify() //thats check if there's a valid access Tocken
    return <ToastContainer/>
}

export default Setup;