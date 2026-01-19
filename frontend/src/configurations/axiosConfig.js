import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const axiosPublic = axios.create({
  baseURL: "http://localhost:8080",
});