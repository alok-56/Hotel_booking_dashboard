import { BASEURL } from "@/api/Baseurl";

const TOKEN = () => localStorage.getItem("token");

// Create hotel
export const createHotel = async (hotel: any) => {
  const res = await fetch(`${BASEURL}/hotel/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN()!,
    },
    body: JSON.stringify(hotel),
  });
  const data = await res.json();

  return data;
};

// Get all hotels
export const getAllHotels = async () => {
  const res = await fetch(`${BASEURL}/admin/profile`, {
    headers: {
      token: TOKEN()!,
    },
  });
  const data = await res.json();

  return data;
};

// Update hotel
export const updateHotel = async (id: string, hotel: any) => {
  const res = await fetch(`${BASEURL}/hotel/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN()!,
    },
    body: JSON.stringify(hotel),
  });
  const data = await res.json();

  return data;
};

// Delete hotel
export const deleteHotel = async (id: string) => {
  const res = await fetch(`${BASEURL}/hotel/${id}`, {
    method: "DELETE",
    headers: {
      token: TOKEN()!,
    },
  });
  const data = await res.json();

  return data;
};

// Create a new room
export const createRoom = async (room: any): Promise<any> => {
  const res = await fetch(`${BASEURL}/room/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(room),
  });

  const data = await res.json();

  return data;
};

// Get all rooms
export const getAllRooms = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/room/all`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();
  return data;
};

// Update room
export const updateRoom = async (id: string, room: any): Promise<any> => {
  const res = await fetch(`${BASEURL}/room/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(room),
  });

  const data = await res.json();
  return data;
};

// Search room availability by hotelId and date range
export const searchRooms = async (
  hotelId: string,
  startDate: string,
  endDate: string
): Promise<any> => {
  const params = new URLSearchParams({
    hotelId,
    startDate,
    endDate,
  });

  const res = await fetch(`${BASEURL}/room/search?${params.toString()}`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();

  return data;
};

export const createMenu = async (payload: {
  hotelId: string;
  menuname: string;
  price: number;
  isavailable?: boolean;
  Category?: string;
}): Promise<any> => {
  const res = await fetch(`${BASEURL}/menu/create`, {
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

export const updateMenu = async (
  id: string,
  payload: {
    hotelId: string;
    menuname: string;
    price: number;
    isavailable?: boolean;
    Category?: string;
  }
): Promise<any> => {
  const res = await fetch(`${BASEURL}/menu/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN() || "",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return data;
};

export const getAllMenus = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/menu/all`, {
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();

  return data;
};

export const deleteMenu = async (id: string): Promise<any> => {
  const res = await fetch(`${BASEURL}/menu/${id}`, {
    method: "DELETE",
    headers: {
      token: TOKEN() || "",
    },
  });

  const data = await res.json();

  return data;
};
