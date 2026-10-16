import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Verify file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file must be an image (PNG, JPG, WebP, GIF, SVG)' },
        { status: 400 }
      );
    }

    // File size check (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try Cloudinary Direct Upload if credentials exist
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && !apiKey.includes('your_api_key')) {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', base64Data);
        cloudinaryForm.append('api_key', apiKey);
        cloudinaryForm.append('timestamp', timestamp.toString());
        cloudinaryForm.append('folder', folder);
        cloudinaryForm.append('signature', signature);

        const cldRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: cloudinaryForm,
          }
        );

        if (cldRes.ok) {
          const cldData = await cldRes.json();
          return NextResponse.json({
            success: true,
            url: cldData.secure_url || cldData.url,
            provider: 'cloudinary',
            filename: file.name,
            size: file.size,
          });
        }
      } catch (cldErr) {
        console.warn('Cloudinary upload fallback to local storage:', cldErr);
      }
    }

    // 2. Reliable Local Storage Fallback (/public/uploads)
    // Ensures instant upload works in all environments without external cloud friction
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    // Generate clean, collision-free filename
    const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'jpg'}`;
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const safeFilename = `${cleanBase}_${uniqueId}${ext}`;
    const filePath = path.join(uploadDir, safeFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'local',
      filename: safeFilename,
      size: file.size,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('File upload failed:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
