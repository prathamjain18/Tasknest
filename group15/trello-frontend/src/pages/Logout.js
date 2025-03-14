import React from 'react';
import { useDispatch } from 'react-redux';
import { setAuthenticate } from '../store/slices/user/UserSlice';
import { useNavigate } from 'react-router-dom';
import storage from '../lib/localStorage';

export default function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        storage.remove('token');
        dispatch(setAuthenticate(false));
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

