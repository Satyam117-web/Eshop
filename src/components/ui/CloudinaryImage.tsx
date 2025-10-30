'use client';

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority,
  sizes,
}: CloudinaryImageProps) {
  // Check if it's a Cloudinary URL or public ID
  const isCloudinaryImage = src.includes('cloudinary.com') || !src.startsWith('http');
  
  // If not using Cloudinary or no cloud name configured, use regular Next Image
  if (!isCloudinaryImage || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        fill={fill}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  // Extract public ID if full Cloudinary URL is provided
  let publicId = src;
  if (src.includes('cloudinary.com')) {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
    const match = src.match(regex);
    publicId = match ? match[1] : src;
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      crop="fill"
      gravity="auto"
      quality="auto"
      format="auto"
      sizes={sizes}
      priority={priority}
    />
  );
}

