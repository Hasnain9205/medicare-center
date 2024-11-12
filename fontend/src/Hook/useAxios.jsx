import axios from "axios";

const useAxios = axios.create({
  baseURL: "http://localhost:5001/api",
});
export default useAxios;
