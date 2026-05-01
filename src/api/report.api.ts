import API from "./axios";

export const createGarbageReport = async (formData: FormData) => {
  const res = await API.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getMyGarbageReports = async()=>{
  const res = await API.get("/reports/my");
  return res.data;
}

export const getSingleGarbageReport = async (id: string) => {
  const res = await API.get(`/reports/${id}`);
  return res.data;
};