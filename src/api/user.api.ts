import API from "./axios";

export const getUserProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

export const getUserReports = async () => {
  const res = await API.get("/user/reports");
  return res.data;
};