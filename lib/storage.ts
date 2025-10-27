import { put, list, del } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob storage
 */
export async function uploadFile(
  file: File,
  userId: string
): Promise<{ url: string; key: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }

  const blob = await put(`${userId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    key: blob.pathname,
  };
}

/**
 * List all files for a user
 */
export async function listUserFiles(userId: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }

  const { blobs } = await list({
    prefix: `${userId}/`,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blobs;
}

/**
 * Delete a file from Vercel Blob storage
 */
export async function deleteFile(key: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }

  await del(key, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

