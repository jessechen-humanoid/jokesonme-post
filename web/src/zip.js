// 多張素材打包成 ZIP，檔名依使用者順序加補零序號前綴。
import JSZip from "jszip";
import { renderToBlob, downloadBlob } from "./rasterize.js";

const pad = (n, width) => String(n).padStart(width, "0");

// posts: [{ kind, data, slug }]，依陣列順序即為輸出順序
export async function renderAndZip(posts, zipName = "看我笑話素材.zip") {
  const zip = new JSZip();
  const width = String(posts.length).length; // 位數：>=10 張才用兩位以上
  for (let i = 0; i < posts.length; i++) {
    const { kind, data, slug } = posts[i];
    const blob = await renderToBlob(kind, data);
    const name = `${pad(i + 1, Math.max(2, width))}_${slug || kind}.png`;
    zip.file(name, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  downloadBlob(out, zipName);
}
