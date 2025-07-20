import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  currentImage?: string;
  className?: string;
}

const S3_BUCKET_URL = "https://souviens-imgs.s3.us-west-2.amazonaws.com";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, GIF, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const uploadUrl = `${S3_BUCKET_URL}/uploads/${filename}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return uploadUrl;
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      try {
        const uploadedUrl = await uploadToS3(file);
        onUpload(uploadedUrl);
        URL.revokeObjectURL(previewUrl); // Clean up
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        setPreview(null);
        URL.revokeObjectURL(previewUrl);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    onRemove();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs h-32 object-cover rounded border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() =>
            !isUploading && document.getElementById("file-input")?.click()
          }
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drop an image here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, GIF, WebP up to 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
    </div>
  );
}
