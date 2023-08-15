import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-6-server-am9o.onrender.com",
});
// instance.interceptors.request.use((config) => {
//   config.headers.Authorization = window.localStorage.getItem("token");
//   return config;
// });
export default instance;
