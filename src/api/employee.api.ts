import api from "./axios";

export const getAssignedWorks = async () => {
  const res = await api.get("/employee/reports");
  return res.data;
};



// update status + upload cleaned image
export const employeeUpdateStatus = async (id: string, data: any) => {
  const res = await api.patch(`/employee/reports/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};