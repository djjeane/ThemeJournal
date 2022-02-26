import axios from "axios";

const instance = axios.create({
  baseURL: "https://theme-journal.herokuapp.com",
});

export default instance;
