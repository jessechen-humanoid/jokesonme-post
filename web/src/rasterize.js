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

// html2canvas 不支援 object-fit：畫 <img> 時會把整張原圖拉伸塞滿元素框，
// 底圖比例跟畫布不同就會變形（預覽的 CSS cover 只裁不變形，兩邊才會不一致）。
// 截圖前把 .bgimg 換成已依 cover 邏輯（等比放大、置中裁切）裁成畫布比例的 <canvas>，
// html2canvas 拉伸同比例的來源就不會變形。用 <canvas> 直接替換可免去 dataURL 重編碼。
function preCropBgToCover(root, size) {
  const im = root.querySelector(".bgimg");
  if (!im || !im.naturalWidth || !im.naturalHeight) return;
  const scale = Math.max(size.w / im.naturalWidth, size.h / im.naturalHeight);
  const sw = Math.min(im.naturalWidth, Math.round(size.w / scale));
  const sh = Math.min(im.naturalHeight, Math.round(size.h / scale));
  if (sw === im.naturalWidth && sh === im.naturalHeight) return; // 比例已同畫布：整張都會入鏡，不必裁
  const sx = Math.round((im.naturalWidth - sw) / 2);
  const sy = Math.round((im.naturalHeight - sh) / 2);
  const cv = document.createElement("canvas");
  cv.className = im.className; // 沿用 .bgimg 的版面規則（absolute + 100%）
  cv.width = sw;
  cv.height = sh;
  cv.getContext("2d").drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
  im.replaceWith(cv);
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
    preCropBgToCover(canvas, size); // 底圖先裁成畫布比例，避免 html2canvas 拉伸變形
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
