import { BASEURL } from "@/api/Baseurl";

const TOKEN = () => localStorage.getItem("token");

export const createOfflineBooking = async (payload: any): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/offline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return data;
};

export const getAllBookings = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();

  return data;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string,
  paymentMethod: string,
  roomno: string,
  collectingAmount?: string
): Promise<any> => {
  console.log(roomno);
  const url = `${BASEURL}/booking/update-status?status=${status}&bookingid=${bookingId}&paymentMethod=${paymentMethod}&roomno=${roomno}&amount=${Number(
    collectingAmount
  )}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();

  return data;
};

export const getAllBookingPayments = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<any> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const res = await fetch(`${BASEURL}/booking/payment/all?${params}`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  return res.json();
};

export const createAddon = async (
  bookingId: string,
  addon: [{ serviceName: string; cost: number; status?: string }]
): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/${bookingId}/addon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(addon),
  });

  const data = await res.json();
  return data;
};

export const updateAddon = async (
  bookingId: string,
  payload: {
    index: number;
    newServiceName?: string;
    newCost?: number;
    status: "paid" | "pending";
  }
): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/${bookingId}/addon`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return data;
};

export const deleteAddon = async (
  bookingId: string,
  payload: {
    index: number;
    status: "paid" | "pending";
  }
): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/${bookingId}/addon`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return data;
};

export const getGuestStatusHistory = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  const res = await fetch(
    `${BASEURL}/booking/status-history?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        token: TOKEN() || "",
      },
    }
  );

  const data = await res.json();

  return data;
};

export const updateBookingDetails = async (payload: any): Promise<any> => {
  const url = `${BASEURL}/booking/bookingupdate`;
  console.log(payload);
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload), // <--- send directly
  });

  const data = await res.json();
  return data;
};

