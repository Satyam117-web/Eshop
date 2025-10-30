'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';

interface CloudinaryUploadWidgetProps {
  // Provide the uploaded image URL (secure_url) for simplicity
  onUploadSuccess: (uploadedUrl: string) => void;
  onUploadStart?: () => void;
  folder?: string;
}

export function CloudinaryUploadWidget({
  onUploadSuccess,
  onUploadStart,
  folder = 'ecommerce-products',
}: CloudinaryUploadWidgetProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  type UploadResult = { event?: string; info?: Record<string, unknown> | undefined };
  const isUploadResult = (obj: unknown): obj is UploadResult => {
    return typeof obj === 'object' && obj !== null && 'event' in (obj as Record<string, unknown>);
  };

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      signatureEndpoint={'/api/cloudinary/signature'}
      options={{
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        folder,
        maxFileSize: 5000000,
        sources: ['local'],
      }}
      onSuccess={(result: unknown) => {
        console.log('Upload success:', result);
        if (isUploadResult(result) && result.event === 'success') {
          const info = result.info;
          if (info) {
            // Try common property names used by Cloudinary
            const url = (info['secure_url'] as string) || (info['secureUrl'] as string) || (info['url'] as string) || '';
            if (url) {
              onUploadSuccess(url);
            }
          }
        }
      }}
      onError={(error: unknown) => {
        console.error('Cloudinary upload error:', error);
        alert('Upload failed. Please try again.');
      }}
      onOpen={() => {
        console.log('Upload widget opened');
        onUploadStart?.();
      }}
    >
      {({ open }: { open: () => void }) => (
        <Button type="button" onClick={() => open()} variant="outline">
          Upload Image
        </Button>
      )}
    </CldUploadWidget>
  );
}