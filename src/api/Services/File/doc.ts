import { BASEURL } from "@/api/Baseurl";

// Upload multiple files
export const MultipleFileUpload = async (files: File[]): Promise<any> => {
  const TOKEN = () => localStorage.getItem("token");

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("Image", file);
    });

    const response = await fetch(`${BASEURL}/file/multiple`, {
      method: "POST",
      body: formData,
      headers: {
        token: TOKEN()!,
      },
    });

    return await response.json();
  } catch (error: any) {
    console.error("Upload failed:", error);
    return { error: error.message };
  }
};

// Upload single file
export const SingleFileUpload = async (file: File): Promise<any> => {
  const TOKEN = () => localStorage.getItem("token");

  try {
    const formData = new FormData();
    formData.append("Image", file);

    const response = await fetch(`${BASEURL}/file/single`, {
      method: "POST",
      body: formData,
      headers: {
        token: TOKEN()!,
      },
    });

    return await response.json();
  } catch (error: any) {
    console.error("Upload failed:", error);
    return { error: error.message };
  }
};

// Delete file from cloud
export const DeleteFileUpload = async (fileUrl: string): Promise<any> => {
  const TOKEN = () => localStorage.getItem("token");

  try {
    const response = await fetch(
      `${BASEURL}/file/delete?imageUrl=${encodeURIComponent(fileUrl)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: TOKEN()!,
        },
      }
    );

    return await response.json();
  } catch (error: any) {
    console.error("Delete failed:", error);
    return { error: error.message };
  }
};
