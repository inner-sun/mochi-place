import { Canvas } from 'canvas'
import { readFile, readdir, writeFile } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { canvasSize } from '~/editor/settings'
import { createImage } from './create-image'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const snapshotDir = path.resolve(__dirname, '..', 'public')  
const exportDir = path.resolve(__dirname, '..', 'exports')

const exportCanvas = (snapshotFile: string) => {
  const canvas = new Canvas(canvasSize, canvasSize)
  const context = canvas.getContext('2d')
  const snapshotFilepath = `${snapshotDir}/${snapshotFile}`

  readFile(snapshotFilepath, (error, fileContent) => {
    if (error) {
      console.error(error)
    }else{
      const filePath = `${exportDir}/${snapshotFile}.png`
      const pngImageBuffer = createImage(fileContent, canvas, context)
      writeFile(filePath, pngImageBuffer, err => {
        if(err) console.error(err)
        console.log(filePath)
      })
    }
  })
}

const forEachSnapshotIn = (folder: string, callback: (folder: string) => void) => {
  readdir(folder, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err)
    }
    
    const snapshotFiles = files.filter(file => file.startsWith('snapshot'))
    
    snapshotFiles.forEach(file => {
      callback(file)
    })
  })
}

forEachSnapshotIn(snapshotDir, exportCanvas)