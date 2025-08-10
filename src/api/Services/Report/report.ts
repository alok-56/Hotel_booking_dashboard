import { BASEURL } from "@/api/Baseurl";

const TOKEN = () => localStorage.getItem("token");

export const getRoomOccupancyReport = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  const res = await fetch(
    `${BASEURL}/report/room-occupancy?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: TOKEN() || "",
      },
    }
  );

  const data = await res.json();
  return data;
};

export const getDashboardCounts = async (hotelIds: string[]): Promise<any> => {
  const res = await fetch(
    `${BASEURL}/report/dashboard/counts?hotelIds=${hotelIds.join(",")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: TOKEN() || "",
      },
    }
  );
  return await res.json();
};

export const getRevenueVsBookingChart = async (
  period: string,
  hotelIds: string[]
): Promise<any> => {
  const res = await fetch(
    `${BASEURL}/report/analytics/revenue-booking?period=${period}&hotelIds=${hotelIds.join(
      ","
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: TOKEN() || "",
      },
    }
  );
  return await res.json();
};

export const getDailyBookingsChart = async (
  period: string,
  hotelIds: string[]
): Promise<any> => {
  const res = await fetch(
    `${BASEURL}/report/room-analytics/daily-bookings?period=${period}&hotelIds=${hotelIds.join(
      ","
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: TOKEN() || "",
      },
    }
  );
  return await res.json();
};

export const getBookingSummaryReport = async ({
  from,
  to,
  page = 1,
  limit = 10,
  hotelId = "all",
}: {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  hotelId?: string;
}): Promise<any> => {
  const queryParams = new URLSearchParams();

  if (from) queryParams.append("from", from);
  if (to) queryParams.append("to", to);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (hotelId && hotelId !== "all") queryParams.append("hotelId", hotelId);

  const res = await fetch(`${BASEURL}/report/booking-summary?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
  });

  return await res.json();
};
