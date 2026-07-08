// 瀏覽器內把版型 DOM rasterize 成 PNG。
// 用 html2canvas：直接在 canvas 重繪、沿用頁面已載入的字體，不走 SVG、不內嵌字體
// （html-to-image 的 SVG→img 步驟在真實 Chrome 會卡死，且需內嵌 ~7MB 字體）。
import html2canvas from "html2canvas";
import { buildCanvas, SIZES } from "./templates.js";

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function waitImages(canvas, data) {
  const jobs = [loadImage(data.image)];
  canvas.querySelectorAll("img").forEach((im) => {
    jobs.push(im.decode ? im.decode().catch(() => {}) : loadImage(im.src));
  });
  await Promise.all(jobs);
}

// 產生單張 PNG Blob（kind: 'banner' | 'gonggao' | 'zhuvisual'）
export async function renderToBlob(kind, data) {
  const size = SIZES[kind];
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-99999px;top:0;pointer-events:none;";
  const canvas = buildCanvas(kind, data);
  holder.appendChild(canvas);
  document.body.appendChild(holder);
  try {
    await document.fonts.ready; // 字體就緒才截圖
    await waitImages(canvas, data);
    const rendered = await html2canvas(canvas, {
      width: size.w,
      height: size.h,
      scale: 2, // 2x retina 輸出
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });
    return await new Promise((res) => rendered.toBlob(res, "image/png"));
  } finally {
    holder.remove();
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
