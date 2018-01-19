import fs from 'fs'
import open from 'opn'

export default async function saveHtml (wrapper) {
  if (!process.env.WALLABY) {
    // TODO why is this not using string templates? :-)
    let html = '<head>\n' +
    '  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
    '  <meta charset="utf-8">\n' +
    '  <title>title</title>\n' +
    '<link href=".enzymePreviewStyle.css" rel="stylesheet"></head><div id="root"><div class="App" style="background-color: rgb(102, 45, 145); background-image: none">' + wrapper.render().html() + '</div></div>'

    await fs.writeFileSync('./.enzymePreviewFile.html', html)

    open('./.enzymePreviewFile.html')
  }
}
