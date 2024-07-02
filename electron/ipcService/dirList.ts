import fs from 'node:fs'

export const dirList = (pathStr: string) => {
  return new Promise<string[]>((resolve) => {
    const bool = fs.existsSync(pathStr)
    if (!bool) {
      resolve([])
      return
    }
    fs.readdir(pathStr, (err, files) => {
      resolve(files)
    })
  })
}
