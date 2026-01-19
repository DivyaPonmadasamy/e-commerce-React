// import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { axiosAuth } from './configurations/axiosConfig';
import { useEffect } from 'react';
import { setLoggedIn, setLoggedOut, setUser } from './reducers/loginSlice';
import { useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import Carousel from './components/Carousel';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // If no token cookie => user is logged out, skip API call
    // const hasToken = document.cookie.includes("token=");

    // if (!hasToken) {
    //   dispatch(setLoggedOut());
    //   dispatch(setLoading(false));
    //   return;
    // }

    axiosAuth.get("/validatetoken")
      .then((res) => {
        dispatch(setUser(res.data));
        dispatch(setLoggedIn());
      })
      .catch((err) => {
        console.error("Authentication failed. Invalid token.")
        dispatch(setLoggedOut());
      });
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <ProductCard />
      <ToastContainer position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      // theme="colored"
      />
      <Carousel />
    </div>
  );
}

export default App;
