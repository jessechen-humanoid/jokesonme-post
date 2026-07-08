// 瀏覽器內把版型 DOM rasterize 成 PNG：離屏用真實尺寸渲染、內嵌字體、等字體與圖片就緒、2x 輸出。
import * as htmlToImage from "html-to-image";
import { buildCanvas, SIZES } from "./templates.js";

let fontCssCache = null;

async function ensureFontEmbedCSS(node) {
  await document.fonts.ready; // Wait for fonts before capture
  if (!fontCssCache) {
    fontCssCache = await htmlToImage.getFontEmbedCSS(node);
  }
  return fontCssCache;
}

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
    const fontEmbedCSS = await ensureFontEmbedCSS(canvas);
    await waitImages(canvas, data);
    return await htmlToImage.toBlob(canvas, {
      pixelRatio: 2,
      width: size.w,
      height: size.h,
      cacheBust: true,
      fontEmbedCSS,
    });
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
