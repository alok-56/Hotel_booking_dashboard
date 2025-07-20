import { BASEURL } from "@/api/Baseurl";

const TOKEN = () => localStorage.getItem("token");

// Login Api
export const LoginApi = async (payload: {
  Email: string;
  Password: string;
}) => {
  try {
    const response = await fetch(`${BASEURL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(data?.message || "Invalid credentials");
    }

    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Login failed");
  }
};

// get all admina
export const getAllAdmins = async () => {
  const res = await fetch(`${BASEURL}/admin/all`, {
    headers: { token: TOKEN()! },
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Fetch failed");
  return data;
};

// create admin
export const createAdmin = async (admin: {
  Name: string;
  Email: string;
  Password: string;
  Permission: string[];
}) => {
  const res = await fetch(`${BASEURL}/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(admin),
  });
  const data = await res.json();
  if (!res.ok || !data.status)
    throw new Error(data.message || "Creation failed");
  return data;
};

// update admin
export const updateAdmin = async (
  id: string,
  admin: {
    Name: string;
    Email: string;
    Password: string;
    Permission: string[];
  }
) => {
  const res = await fetch(`${BASEURL}/admin/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN()!,
    },
    body: JSON.stringify(admin),
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Update failed");
  return data;
};

// deleet admin
export const deleteAdmin = async (id: string) => {
  const res = await fetch(`${BASEURL}/admin/delete/${id}`, {
    method: "DELETE",
    headers: { token: TOKEN()! },
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Delete failed");
  return data;
};
