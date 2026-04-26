import API from "./axios";

export const registerUser = async (data: {
  full_name: string;
  phone: string;
  address: string;
  password: string;
}) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: {
  phone: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};