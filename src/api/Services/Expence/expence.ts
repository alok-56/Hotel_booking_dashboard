import { BASEURL } from "@/api/Baseurl";

const TOKEN = () => localStorage.getItem("token");

// ✅ 1. Get Expense Statistics Overview
export const getExpenseStatistics = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/statistics/overview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};

// ✅ 2. Get Expenses by Date Range
export const getExpensesByDateRange = async (
  startDate: string,
  endDate: string,
  hotelId?: string
): Promise<any> => {
  const params = new URLSearchParams({ startDate, endDate });
  if (hotelId) params.append("hotelId", hotelId);

  const res = await fetch(`${BASEURL}/expenses/range?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};

// ✅ 3. Get All Expenses (with optional filters)
export const getAllExpenses = async (filters: Record<string, string | number> = {}): Promise<any> => {
  const params = new URLSearchParams(filters as Record<string, string>);

  const res = await fetch(`${BASEURL}/expenses/all?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};

// ✅ 4. Get Expense by ID
export const getExpenseById = async (id: string): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};

// ✅ 5. Create New Expense
export const createExpense = async (payload: {
  expenseName: string;
  hotelId: string;
  category: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  month: number;
  year: number;
  notes?: string;
  attachmentUrl?: string;
  status?: string;
}): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

// ✅ 6. Update Expense
export const updateExpense = async (
  id: string,
  payload: {
    expenseName?: string;
    hotelId?: string;
    category?: string;
    amount?: number;
    paymentMethod?: string;
    expenseDate?: string;
    month?: number;
    year?: number;
    notes?: string;
    attachmentUrl?: string;
    status?: string;
  }
): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

// ✅ 7. Delete Expense
export const deleteExpense = async (id: string): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};

// ✅ 8. Update Expense Status
export const updateExpenseStatus = async (
  id: string,
  status: string
): Promise<any> => {
  const res = await fetch(`${BASEURL}/expenses/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify({ status }),
  });

  return await res.json();
};
