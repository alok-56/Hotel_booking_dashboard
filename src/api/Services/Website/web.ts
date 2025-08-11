import { BASEURL } from "@/api/Baseurl";

export const getContactus = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/public/contact-us`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const getB2B = async (): Promise<any> => {
  const res = await fetch(`${BASEURL}/public/b2b`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
