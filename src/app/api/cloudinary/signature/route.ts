import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = body ? JSON.parse(body) : {};
    } catch {
      // body might be a form or empty; we'll try to continue
      console.warn('Signature endpoint: failed to parse JSON body, falling back to URL params');
    }

    // Accept paramsToSign from body or try reading url search params if empty
    const { paramsToSign } = parsed;

    // Accept multiple possible env var names to avoid breaking setups that used NEXT_PUBLIC_* names
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.warn('Signature endpoint: cloudinary keys not found in expected env vars. apiKey present?', !!apiKey, 'secret present?', !!apiSecret);
      return NextResponse.json({ error: 'Server configuration error: missing Cloudinary keys' }, { status: 500 });
    }

    let params: Record<string, unknown> | undefined = paramsToSign as Record<string, unknown> | undefined;
    if (!params) {
      // Try to parse from request URL
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      params = {} as Record<string, unknown>;
      searchParams.forEach((v, k) => {
        params![k] = v;
      });
    }

    if (!params || Object.keys(params).length === 0) {
      console.error('Signature endpoint: missing paramsToSign');
      return NextResponse.json({ error: 'Missing paramsToSign' }, { status: 400 });
    }

    // Import cloudinary v2 and configure using server-side env vars
    const cloudinary = await import('cloudinary').then((mod) => mod.v2);
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    type CloudinaryWithUtils = { utils: { api_sign_request: (p: Record<string, unknown>, secret: string) => string } };
    const cloudinaryTyped = cloudinary as unknown as CloudinaryWithUtils;
  const signature = cloudinaryTyped.utils.api_sign_request(params as Record<string, unknown>, apiSecret as string);

    // Normalize timestamp
    const tsVal = params['timestamp'] ?? params['time_stamp'] ?? undefined;
    const timestamp = tsVal ? Number(tsVal) : Math.round(Date.now() / 1000);

    // Return useful fields for the widget (api_key and cloud_name are safe to expose)
    return NextResponse.json({
      signature,
      timestamp,
      api_key: apiKey,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json({ error: 'Failed to create signature: ' + ((error as Error)?.message || String(error)) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allowedKeys = new Set([
      'timestamp',
      'folder',
      'public_id',
      'invalidate',
      'resource_type',
      'type',
      'eager',
      'transformation',
      'context',
      'tags',
      'upload_preset',
    ]);
    const paramsToSign: Record<string, string> = {};

    // Copy all query params except ones that should not be signed
    searchParams.forEach((value, key) => {
      if (!value) return;
      if (['signature', 'api_key', 'cloud_name', 'file', 'source'].includes(key)) return;
      if (!allowedKeys.has(key)) return;
      paramsToSign[key] = value;
    });

    if (!paramsToSign.timestamp) {
      paramsToSign.timestamp = String(Math.round(Date.now() / 1000));
    }

    if (!paramsToSign.upload_preset && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      paramsToSign.upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    }

    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
      console.error('Missing CLOUDINARY API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const cloudinary = await import('cloudinary').then((mod) => mod.v2);
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Small local type to access utils.api_sign_request without using plain `any`
    type CloudinaryWithUtils = { utils: { api_sign_request: (params: Record<string, unknown>, secret: string) => string } };
    const cloudinaryTyped = cloudinary as unknown as CloudinaryWithUtils;
    const signature = cloudinaryTyped.utils.api_sign_request(
      paramsToSign as Record<string, unknown>,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature, timestamp: paramsToSign.timestamp });
  } catch (error) {
    console.error('Cloudinary signature GET error:', error);
    return NextResponse.json({ error: 'Failed to create signature' }, { status: 500 });
  }
}


