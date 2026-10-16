import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

export type StorageAdapter = {
  save: (fileName: string, content: Buffer) => Promise<{ publicUrl: string; localPath: string }>;
};

const localStorage: StorageAdapter = {
  async save(fileName, content) {
    const dir = path.join(process.cwd(), "public", "generated");
    await mkdir(dir, { recursive: true });
    const full = path.join(dir, fileName);
    await writeFile(full, content);
    return {
      publicUrl: `/generated/${fileName}`,
      localPath: full,
    };
  },
};

export function getStorageAdapter(): StorageAdapter {
  if (env.storageProvider === "local") return localStorage;

  throw new Error("S3 adapter is not configured. Set STORAGE_PROVIDER=local or implement S3 credentials.");
}
