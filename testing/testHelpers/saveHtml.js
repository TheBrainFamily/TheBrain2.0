import fs from 'fs';
export default async function saveHtml(wrapper) {
  let html = "<head>\n" +
    "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <title>ALEF Admin</title>\n" +
    "<link href=\"style.css\" rel=\"stylesheet\"></head>" + wrapper.render().html()

  await fs.writeFileSync('./src/myFile.html', html);
}