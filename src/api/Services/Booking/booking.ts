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
  if (!res.ok || !data.status)
    throw new Error(data.message || "Offline booking failed");
  return data;
};

export const getAllBookings = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();
  if (!res.ok || !data.status)
    throw new Error(data.message || "Fetching bookings failed");
  return data;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<any> => {
  const url = `${BASEURL}/booking/update-status?status=${status}&bookingid=${bookingId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();
  if (!res.ok || !data.status)
    throw new Error(data.message || "Updating status failed");
  return data;
};

export const getAllBookingPayments = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/booking/payment/all`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();
  if (!res.ok || !data.status)
    throw new Error(data.message || "Fetching payments failed");
  return data;
};
