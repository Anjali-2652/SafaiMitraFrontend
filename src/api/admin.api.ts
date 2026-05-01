import api from "./axios";

export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAllCitizenReports = async () => {
  const res = await api.get("/admin/reports");
  return res.data;
};

export const getWardAnalytics = async () => {
  const res = await api.get("/analytics/wards");
  return res.data;
};

export const createEmployeeAccount = async (payload: any) => {
  const res = await api.post("/admin/create-employee", payload);
  return res.data;
};

export const getAllEmployees = async () => {
  const res = await api.get("/admin/employees");
  return res.data;
};

export const assignEmployeeToReport = async (payload: any) => {
  const res = await api.post("/admin/assign-employee", payload);
  return res.data;
};

export const adminUpdateReportStatus = async (payload: any) => {
  const res = await api.patch("/admin/report-status", payload);
  return res.data;
};

export const getSingleAdminReport = async (id: string) => {
  const res = await api.get(`/admin/reports/${id}`);
  return res.data;
};
