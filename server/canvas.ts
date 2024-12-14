import { readFile, writeFile } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { canvasSize } from '~/editor/settings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class Canvas{
  lastSnapshot: number = Date.now()
  buffer: Uint8Array = new Uint8Array(canvasSize * canvasSize * 3)

  constructor(){
    const folder = path.resolve(__dirname, '..', 'public')
    const snapshotFile = `snapshot.bin`
    const filePath = `${folder}/${snapshotFile}`
    
    // Read last snapshot on cold start, store it into buffer
    readFile(filePath, (error, fileContent) => {
      if(error){
        if(error.code === 'ENOENT'){
          const emptyCanvas = new Uint8Array(canvasSize * canvasSize * 3)
          writeFile(filePath, Buffer.from(emptyCanvas), error => {
            if(error){
              console.error(error)
            }
          })
        }else{
          console.error(error)
        }
      }else{
        this.buffer = fileContent
      }
    })
  }

  async save (){
    const folder = path.resolve(__dirname, '..', 'public')

    // Update public snapshot
    const snapshotFile = `snapshot.bin`
    const filePath = `${folder}/${snapshotFile}`
    writeFile(filePath, Buffer.from(this.buffer), error => {
      if(error){
        console.error(error)
      }
    })

    // If last snapshot is older than 5min, save an timestamped archive
    const now = Date.now()
    const maxDelay = 5 * 60 * 1000
    if (now - maxDelay > this.lastSnapshot) {
      const snapshotArchiveFile = `snapshot-${now}.bin`
      const archiveFilePath = `${folder}/${snapshotArchiveFile}`
      writeFile(archiveFilePath, Buffer.from(this.buffer), error => {
        if(error){
          console.error(error)
        }
      })
      this.lastSnapshot = now
    }
  }
}

