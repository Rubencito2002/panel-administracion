import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No se recibió ningún archivo",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "portfolio-projects",
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error al subir imagen",
      },
      {
        status: 500,
      }
    );
  }
}