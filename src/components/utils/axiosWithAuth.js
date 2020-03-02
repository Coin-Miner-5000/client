import axios from "axios";

export const axiosWithAuth = () => {
  const token = process.env.REACT_APP_TOKEN;
  return axios.create({
    headers: {
      //   "Content-Type": "application/json",
      Authorization: `Token ${token}`
    }
  });
};
