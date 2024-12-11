import { readFile } from "node:fs/promises"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "snapshot.bin")
  const snapshot = await readFile(filePath)

  return new Response(snapshot, {
    headers: {
      "Content-Type": "application/octet-stream"
    }
  })
}
