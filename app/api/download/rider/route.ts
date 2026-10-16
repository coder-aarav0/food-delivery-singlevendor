import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GITHUB_RELEASE_APK_URL =
  'https://github.com/coder-aarav0/food-delivery-singlevendor/releases/download/v2.4.0/FreshMart-Rider-v2.4.0.apk';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const preferGitHub = searchParams.get('source') === 'github';

  if (preferGitHub) {
    return NextResponse.redirect(GITHUB_RELEASE_APK_URL, 302);
  }

  // Check possible local build paths
  const candidatePaths = [
    path.join(process.cwd(), 'public', 'downloads', 'FreshMart-Rider-v2.4.0.apk'),
    path.join(process.cwd(), 'public', 'downloads', 'keshri-mart-rider-v2.4.apk'),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': 'attachment; filename="FreshMart-Rider-v2.4.0.apk"',
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (err) {
        console.error('Error reading local APK buffer:', err);
      }
    }
  }

  // If local file is unavailable on serverless edge, redirect to official GitHub Release asset
  return NextResponse.redirect(GITHUB_RELEASE_APK_URL, 302);
}
