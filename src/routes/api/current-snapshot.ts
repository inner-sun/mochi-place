import { readFile } from "node:fs/promises"
import path from "path"
import { randomCanvas } from '~/server/init-canvas'

export async function GET() {
  // const filePath = path.join(process.cwd(), "public", "snapshot.bin")
  // console.log(filePath)

  // const snapshot = await readFile(filePath)
  // console.log(snapshot.byteLength)

  const snapshot = randomCanvas()

  return new Response(snapshot, {
    headers: {
      "Content-Type": "application/octet-stream"
    }
  })
}
