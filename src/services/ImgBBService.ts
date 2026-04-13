import type { ImgBBUploadResponse } from "../models";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;
const IMGBB_API_PATH = "https://api.imgbb.com/1/upload";
if (!IMGBB_API_KEY) {
    throw new Error("VITE_IMGBB_API_KEY is missing in .env");
}

export async function imageUpload(image: File): Promise<string>{
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(
        `${IMGBB_API_PATH}?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData,
        }
    );

    if(!res.ok){
        throw new Error(`Image Upload to ImgBB is not working. Status: ${res.status}`);
    }

    const json: ImgBBUploadResponse = await res.json();
    if(!json.success){
        throw new Error(`IMGBB upload was not successful`);
    }

    if (!json.data.url) {
        throw new Error("ImgBB response missing image URL");
    }

    return json.data.url;
}