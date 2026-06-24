import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;

  const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`);
  url.searchParams.set('type', 'upload');
  url.searchParams.set('prefix', 'musial-me');
  url.searchParams.set('max_results', '30');
  if (cursor) url.searchParams.set('next_cursor', cursor);

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${credentials}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: 'Cloudinary error', detail: err }, { status: 500 });
  }

  const data = await res.json();

  const images = (data.resources as Array<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    created_at: string;
    format: string;
    bytes: number;
  }>).map(r => ({
    url: r.secure_url,
    publicId: r.public_id,
    width: r.width,
    height: r.height,
    createdAt: r.created_at,
    format: r.format,
    bytes: r.bytes,
  }));

  return NextResponse.json({
    images,
    nextCursor: data.next_cursor ?? null,
  });
}
