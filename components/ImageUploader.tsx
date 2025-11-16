import { useState, useRef } from "react";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface ImageUploaderProps {
  bucket: string;
  folder?: string; // optional folder
  onUpload?: (url: string) => void;
}

export default function ImageUploader({
  bucket = "eventio",
  folder = "uploads",
  onUpload,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          onUploadProgress: (p) => {
            setProgress(Math.round((p.loaded / p.total) * 100));
          },
          upsert: false,
        });

      if (error) throw error;

      // Generate a public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (onUpload && urlData?.publicUrl) {
        onUpload(urlData.publicUrl);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error)?.message);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFilePicker = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={openFilePicker}
      className="border-2 border-dashed border-gray-400 rounded p-6 text-center cursor-pointer hover:bg-gray-50"
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={onFileChange}
      />

      {!uploading && <p>Click or drag an image here to upload</p>}

      {uploading && (
        <div className="flex flex-col items-center">
          <p>Uploading… {progress}%</p>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
