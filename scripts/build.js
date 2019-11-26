import fse from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import { promisify } from 'util'
import glob from 'glob'

const ejsRenderFile = promisify(ejs.renderFile)
const globP = promisify(glob)

const srcPath = './src'
const distPath = './public'

fse.emptyDirSync(distPath)


globP('**/*.ejs', { cwd: `${srcPath}/pages` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      fse.mkdirs(destPath)
      .then(() => {
        return ejsRenderFile(`${srcPath}/pages/${file}`)
      })
      .then((pageContents) => {
        return ejsRenderFile(`${srcPath}/layout.ejs`)
      })
      .then((layoutContent) => {
        fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
      })
      console.log(destPath)
    })
  })