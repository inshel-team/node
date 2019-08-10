import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'environment', 'config.json')
const KEY_PATH = path.join(process.cwd(), 'environment', 'key')
const NODE_KEY_PATH = path.join(process.cwd(), 'environment', 'node-key')

const readFileSync = (fileName, fn = (i) => i) => {
  try {
    return fn(fs.readFileSync(fileName, { encoding: 'UTF-8' }).toString())
  } catch (e) {
    throw new Error(`Can't read file ${fileName}`)
  }
}

const toJSON = (fileName, content) => {
  try {
    return JSON.parse(content)
  } catch (e) {
    throw new Error(`File "${fileName}": parse error (JSON)`)
  }
}

const createConfig = () => {
  const config = readFileSync(CONFIG_PATH, toJSON.bind(null, CONFIG_PATH))
  config.key = readFileSync(KEY_PATH)
  config.nodeKey = readFileSync(NODE_KEY_PATH)

  return config
}

export default createConfig
