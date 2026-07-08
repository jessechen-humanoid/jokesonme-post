import "./styles/fonts.css";
import "./styles/templates.css";
import "./styles/app.css";
import Sortable from "sortablejs";
import { SIZES, BRAND_LOGOS, buildCanvas } from "./templates.js";
import { renderToBlob, downloadBlob } from "./rasterize.js";
import { renderAndZip } from "./zip.js";

const state = {
  type: "banner",
  banner: { brand: "mprc", subtitle: "", tag: "", season: "", date: "", venue: "", image: null },
  igTemplate: "gonggao",
  ig: {
    gonggao: { title: "", intro: "", listText: "", image: null },
    zhuvisual: { title: "", badge: "", image: null },
  },
  posts: [],
};

let seq = 0;
const controls = document.getElementById("controls");
const stage = document.getElementById("stage");

// ---- 資料整形 ----
function igToData(f, tpl) {
  if (tpl === "gonggao")
    return { title: f.title, intro: f.intro, list: (f.listText || "").split("\n"), image: f.image };
  return { title: f.title, badge: f.badge, image: f.image };
}
function currentPreview() {
  if (state.type === "banner") return { kind: "banner", data: state.banner };
  return { kind: state.igTemplate, data: igToData(state.ig[state.igTemplate], state.igTemplate) };
}
function slugify(s) {
  return (String(s || "").trim().replace(/\s+/g, "-").replace(/[\/\\:*?"<>|]/g, "").slice(0, 20)) || "ig";
}

// ---- 縮放把真實尺寸 canvas 塞進容器 ----
function fitCanvas(canvasEl, kind, containerEl, containerWidth) {
  const size = SIZES[kind];
  const scale = containerWidth / size.w;
  canvasEl.style.transform = `scale(${scale})`;
  containerEl.style.height = size.h * scale + "px";
}

function renderPreview() {
  const { kind, data } = currentPreview();
  stage.innerHTML = "";
  const canvas = buildCanvas(kind, data);
  stage.appendChild(canvas);
  fitCanvas(canvas, kind, stage, stage.clientWidth);
}

// ---- 讀圖成 dataURL（不上傳，僅瀏覽器記憶體） ----
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function mountDropzone(elm, onImage, hasImage) {
  elm.className = "dropzone" + (hasImage ? " has-img" : "");
  elm.textContent = hasImage ? "✓ 已載入底圖（點此更換）" : "把底圖拖進來，或點此選擇";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  elm.appendChild(input);
  elm.addEventListener("click", () => input.click());
  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) onImage(await readFileAsDataURL(file));
  });
  ["dragover", "dragenter"].forEach((ev) =>
    elm.addEventListener(ev, (e) => { e.preventDefault(); elm.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) =>
    elm.addEventListener(ev, () => elm.classList.remove("drag")));
  elm.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith("image/"));
    if (file) onImage(await readFileAsDataURL(file));
  });
}

// ---- 控制面板 ----
function renderControls() {
  controls.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "panel";
  controls.appendChild(panel);

  if (state.type === "banner") renderBannerControls(panel);
  else renderIgControls(panel);
}

function field(labelText, inputEl, hint) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  const lab = document.createElement("label");
  lab.textContent = labelText;
  wrap.append(lab, inputEl);
  if (hint) {
    const h = document.createElement("div");
    h.className = "hint";
    h.textContent = hint;
    wrap.appendChild(h);
  }
  return wrap;
}
function textInput(value, onInput, placeholder) {
  const i = document.createElement("input");
  i.value = value || "";
  if (placeholder) i.placeholder = placeholder;
  i.addEventListener("input", () => { onInput(i.value); renderPreview(); });
  return i;
}
function textArea(value, onInput, placeholder) {
  const t = document.createElement("textarea");
  t.value = value || "";
  if (placeholder) t.placeholder = placeholder;
  t.addEventListener("input", () => { onInput(t.value); renderPreview(); });
  return t;
}

function renderBannerControls(panel) {
  const b = state.banner;
  const sel = document.createElement("select");
  Object.entries(BRAND_LOGOS).forEach(([k, v]) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = v.label; if (k === b.brand) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener("change", () => { b.brand = sel.value; renderControls(); renderPreview(); });
  panel.appendChild(field("品牌", sel));

  if (b.brand === "kwxh") {
    // 看我笑話：季月號 + 日期時間 + 場地（版面自動用左上 logo 版型）
    panel.appendChild(field("季／月號（例：第 2 季 6 月號）", textInput(b.season, (v) => (b.season = v))));
    panel.appendChild(field("日期時間（例：2026.6.20 週六晚上 7:30 開演）", textInput(b.date, (v) => (b.date = v))));
    panel.appendChild(field("場地（例：卡米地+ 大廳｜臺北市中山區復興北路480號）", textInput(b.venue, (v) => (b.venue = v))));
  } else {
    panel.appendChild(field("副標（例：8 月號 EP5 & EP6）", textInput(b.subtitle, (v) => (b.subtitle = v))));
    panel.appendChild(field("黃色標籤（選配，留空不顯示）", textInput(b.tag, (v) => (b.tag = v))));
  }

  const dz = document.createElement("div");
  mountDropzone(dz, (url) => { b.image = url; renderControls(); renderPreview(); }, !!b.image);
  panel.appendChild(field("底圖", dz));

  const dl = document.createElement("button");
  dl.className = "btn primary";
  dl.textContent = "下載 PNG";
  dl.addEventListener("click", () => exportSingle("banner", b, slugify(b.brand === "kwxh" ? b.season : b.subtitle) + "-banner"));
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.appendChild(dl);
  panel.appendChild(actions);
}

function renderIgControls(panel) {
  const sel = document.createElement("select");
  [["gonggao", "公告型（標題＋內文＋條列）"], ["zhuvisual", "主視覺型（大標＋選配 badge）"]].forEach(([k, label]) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = label; if (k === state.igTemplate) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener("change", () => { state.igTemplate = sel.value; renderControls(); renderPreview(); });
  panel.appendChild(field("版型", sel));

  const f = state.ig[state.igTemplate];
  if (state.igTemplate === "gonggao") {
    panel.appendChild(field("標題", textArea(f.title, (v) => (f.title = v), "可換行"), "換行用 Enter"));
    panel.appendChild(field("內文（細節）", textArea(f.intro, (v) => (f.intro = v)), "**兩個星號** 之間會變粗體"));
    panel.appendChild(field("條列（每行一項，選配）", textArea(f.listText, (v) => (f.listText = v))));
  } else {
    panel.appendChild(field("標題", textArea(f.title, (v) => (f.title = v), "可換行")));
    panel.appendChild(field("橘色圓 badge（選配，留空不顯示）", textArea(f.badge, (v) => (f.badge = v), "例：本期報修人\\n竹節蟲 & 傑哥")));
  }

  const dz = document.createElement("div");
  mountDropzone(dz, (url) => { f.image = url; renderControls(); renderPreview(); }, !!f.image);
  panel.appendChild(field("底圖", dz));

  const add = document.createElement("button");
  add.className = "btn ghost";
  add.textContent = "＋ 加入清單";
  add.addEventListener("click", addCurrentPost);
  const dl = document.createElement("button");
  dl.className = "btn primary";
  dl.textContent = "下載這張 PNG";
  dl.addEventListener("click", () => {
    const { kind, data } = currentPreview();
    exportSingle(kind, data, slugify(data.title));
  });
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(add, dl);
  panel.appendChild(actions);

  renderPostsSection(panel);
}

function renderPostsSection(panel) {
  const box = document.createElement("div");
  box.className = "posts";
  const h = document.createElement("h3");
  h.textContent = `貼文清單（${state.posts.length}）— 拖曳可排序`;
  box.appendChild(h);

  const list = document.createElement("div");
  list.className = "postlist";
  if (!state.posts.length) {
    const e = document.createElement("div");
    e.className = "empty";
    e.textContent = "還沒有貼文。填好一張後按「＋ 加入清單」。";
    box.appendChild(e);
  } else {
    state.posts.forEach((p, idx) => list.appendChild(postCard(p, idx)));
    box.appendChild(list);
    const zipBtn = document.createElement("button");
    zipBtn.className = "btn primary";
    zipBtn.textContent = "下載 ZIP（依順序）";
    zipBtn.style.marginTop = "12px";
    zipBtn.addEventListener("click", exportZip);
    box.appendChild(zipBtn);
    Sortable.create(list, {
      animation: 150,
      onEnd: () => {
        const ids = [...list.children].map((c) => c.dataset.id);
        state.posts.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        renderControls();
      },
    });
  }
  panel.appendChild(box);
}

function postCard(p, idx) {
  const card = document.createElement("div");
  card.className = "postcard";
  card.dataset.id = p.id;
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  const c = buildCanvas(p.kind, p.data);
  thumb.appendChild(c);
  c.style.transform = `scale(${96 / SIZES[p.kind].w})`;
  card.appendChild(thumb);
  const seqEl = document.createElement("div");
  seqEl.className = "seq";
  seqEl.textContent = String(idx + 1);
  card.appendChild(seqEl);
  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "✕";
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    state.posts = state.posts.filter((x) => x.id !== p.id);
    renderControls();
  });
  card.appendChild(del);
  return card;
}

function addCurrentPost() {
  const { kind, data } = currentPreview();
  if (!data.image) return alert("這張還沒放底圖，放了底圖再加入清單。");
  state.posts.push({
    id: "p" + ++seq,
    kind,
    data: JSON.parse(JSON.stringify(data)),
    slug: slugify(data.title),
  });
  renderControls();
}

// ---- 匯出 ----
async function exportSingle(kind, data, slug) {
  if (!data.image) return alert("還沒放底圖，放了底圖再下載。");
  const blob = await renderToBlob(kind, data);
  downloadBlob(blob, `${slug || kind}.png`);
}
async function exportZip() {
  if (!state.posts.length) return;
  await renderAndZip(state.posts.map((p) => ({ kind: p.kind, data: p.data, slug: p.slug })));
}

// ---- Tabs ----
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    state.type = tab.dataset.type;
    syncTabs();
    renderControls();
    renderPreview();
  });
});
function syncTabs() {
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.type === state.type));
}

window.addEventListener("resize", renderPreview);

// ---- 初始化 ----
syncTabs();
renderControls();
renderPreview();

// DEV 驗證鉤子（正式 build 不影響輸出品質；僅供本機測試出圖）
if (import.meta.env.DEV) {
  window.__test = { renderToBlob, state };
}
