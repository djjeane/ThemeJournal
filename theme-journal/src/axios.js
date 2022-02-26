import axios from "axios";

const instance = axios.create({
  baseURL: "https://tiktok-mernnn.herokuapp.com",
});

export default instance;
