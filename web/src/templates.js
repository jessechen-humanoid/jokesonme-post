// 依資料組出 .canvas 預覽/截圖節點。預覽與截圖共用同一組版型。
export const SIZES = {
  gonggao: { w: 1080, h: 1350 },
  zhuvisual: { w: 1080, h: 1350 },
  banner: { w: 3200, h: 1200 },
};

export const BRAND_LOGOS = {
  // 兩品牌 logo 比例差很多：現代問題維修中心是橫長字標（抓寬），看我笑話接近方形（抓高）
  kwxh: { label: "看我笑話", logo: `${import.meta.env.BASE_URL}logo-kwxh.png`, style: "height:620px;width:auto;" },
  mprc: { label: "現代問題維修中心", logo: `${import.meta.env.BASE_URL}logo-mprc.png`, style: "width:1820px;height:auto;" },
};

// \n → <br>，**粗體** → <b>粗體</b>（先跳脫 HTML 特殊字元）
function fmt(s) {
  const esc = String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
}

function makeBg(data) {
  const bg = document.createElement("div");
  bg.className = "bg";
  if (data.image) bg.style.setProperty("--bg", `url("${data.image}")`);
  bg.style.setProperty("--overlay", data.overlay ?? 1);
  return bg;
}

export function buildCanvas(kind, data) {
  const size = SIZES[kind];
  const canvas = document.createElement("div");
  canvas.className = `canvas tpl-${kind}`;
  canvas.style.width = size.w + "px";
  canvas.style.height = size.h + "px";
  canvas.appendChild(makeBg(data));

  if (kind === "gonggao") {
    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML =
      `<div class="title">${fmt(data.title)}</div>` +
      `<div class="intro">${fmt(data.intro)}</div>`;
    const items = (data.list || []).filter((x) => String(x).trim() !== "");
    if (items.length) {
      content.innerHTML +=
        `<ol class="list">${items.map((li) => `<li>${fmt(li)}</li>`).join("")}</ol>`;
    }
    canvas.appendChild(content);
  }

  if (kind === "zhuvisual") {
    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = fmt(data.title);
    canvas.appendChild(title);
    if (String(data.badge ?? "").trim() !== "") {
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.innerHTML = `<span>${fmt(data.badge)}</span>`;
      canvas.appendChild(badge);
    }
  }

  if (kind === "banner") {
    const brandKey = BRAND_LOGOS[data.brand] ? data.brand : "mprc";
    const brand = BRAND_LOGOS[brandKey];
    canvas.classList.add("brand-" + brandKey);

    if (brandKey === "kwxh") {
      // 看我笑話：logo 左上、季月號在下、右下角日期＋場地（復刻 Season 2）
      canvas.insertAdjacentHTML(
        "beforeend",
        `<img class="kwxh-logo" src="${brand.logo}" crossorigin="anonymous">` +
          `<div class="kwxh-bottom">` +
          `<div class="season">${fmt(data.season)}</div>` +
          `<div class="divider"></div>` +
          `<div class="info">` +
          `<div class="date">${fmt(data.date)}</div>` +
          `<div class="venue">${fmt(data.venue)}</div>` +
          `</div></div>`
      );
    } else {
      // 現代問題維修中心：logo 置中偏下 + 黃標 + 月號
      const stack = document.createElement("div");
      stack.className = "stack";
      stack.innerHTML =
        `<div class="meta">` +
        `<span class="tag">${fmt(data.tag)}</span>` +
        `<span class="subtitle">${fmt(data.subtitle)}</span>` +
        `</div>` +
        `<img class="logo" style="${brand.style}" src="${brand.logo}" crossorigin="anonymous">`;
      canvas.appendChild(stack);
    }
  }

  return canvas;
}
