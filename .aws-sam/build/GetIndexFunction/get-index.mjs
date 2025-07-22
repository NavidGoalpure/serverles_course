
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// In SAM, the working directory is the functions folder, so we need to look for statics/index.html
const html = fs.readFileSync(path.join(__dirname, 'statics', 'index.html'), 'utf-8')

export const handler = async (event, context) => {
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      },
      body: html
    }
  
    return response
  }