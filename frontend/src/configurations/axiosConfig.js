import axios from "axios";

export const axiosAuth = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: process.env.REACT_APP_API_BASE_URL,  // React only exposes REACT_APP variables to the code
  withCredentials: true,
});

export const axiosPublic = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: process.env.REACT_APP_API_BASE_URL,
});