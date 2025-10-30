# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image management in your e-commerce app.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. Log in to your [Cloudinary Console](https://cloudinary.com/console)
2. On your dashboard, you'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Create an Upload Preset (for unsigned uploads)

1. Go to Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set:
   - **Preset name**: `ecommerce-products` (or any name you prefer)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `ecommerce-products`
   - **Use filename**: No (recommended)
   - **Unique filename**: Yes
5. Click "Save"

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ecommerce-products
# Optional: enable signed uploads (client needs public API key)
NEXT_PUBLIC_CLOUDINARY_SIGNED_UPLOADS=false
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key_here
```

**Important**: Replace the placeholder values with your actual credentials from the Cloudinary dashboard.

## Step 5: Restart Your Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Using Cloudinary in Your App

### 1. Upload Images in Admin Panel

- Go to `/admin`
- Click "Add New Product" or edit an existing product
- Click the "Upload Image" button
- Select an image from your computer
- The image URL will automatically populate

### 2. Image Display

Images are automatically optimized with:
- Auto format (WebP, AVIF when supported)
- Auto quality
- Responsive sizing
- Lazy loading

### 3. Manual Image URLs

You can also paste Cloudinary URLs directly in the image field:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg
```

## Features Included

✅ **Automatic Image Optimization**
- Format conversion (WebP, AVIF)
- Quality optimization
- Responsive images

✅ **Upload Widget**
- Drag & drop interface
- File type validation
- Size limits (5MB max)
- Progress tracking

✅ **Image Transformations**
- Automatic cropping
- Resizing
- Format conversion
- Quality adjustments

## Troubleshooting

### Upload button doesn't work
- Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Verify your upload preset is set to "Unsigned"
- Check browser console for errors
  - If you enabled signed uploads, also set `NEXT_PUBLIC_CLOUDINARY_API_KEY` and server `CLOUDINARY_API_SECRET`

### Images don't load
- Verify your cloud name is correct
- Check that the image URL is valid
- Ensure Next.js image domains are configured in `next.config.ts`

### Environment variables not loading
- Make sure `.env.local` is in the project root
- Restart the development server
- Check for typos in variable names

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations/month

This is more than enough for development and small production sites!

## Next Steps

1. Replace demo images in `src/data/products.json` with your own
2. Upload product images through the admin panel
3. Customize image transformations in `src/lib/cloudinary.ts`

For more information, visit [Cloudinary Documentation](https://cloudinary.com/documentation)

