import { NextResponse } from 'next/server';
import { pinata } from '@/utils/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  // If you're going to use auth you'll want to verify here
  try {
    const url = await pinata.upload.createSignedURL({
      expires: 30, // The only required param
      name: 'Client File',
      group: 'my-group-id'
    });
    return NextResponse.json({ url: url }, { status: 200 }); // Returns the signed upload URL
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: 'Error creating API Key:' },
      { status: 500 }
    );
  }
}
