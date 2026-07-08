import "./styles/fonts.css";
import "./styles/templates.css";
import "./styles/app.css";
import Sortable from "sortablejs";
import { SIZES, BRAND_LOGOS, buildCanvas } from "./templates.js";
import { PRESET_BG, COMMON_INFO } from "./presets.js";
import { renderToBlob, downloadBlob } from "./rasterize.js";
import { renderAndZip } from "./zip.js";

const state = {
  type: "banner",
  banner: { brand: "mprc", subtitle: "", tag: "會員限定", season: "", date: "", venue: "", image: null },
  // IG：每張貼文都是可編輯的物件；表單直接綁「當前作用中」那張
  igPosts: [], // [{id, template, title, intro, listText, badge, image, shot}]
  activeId: null,
};

let seq = 0;
const controls = document.getElementById("controls");
const stage = document.getElementById("stage");

// ---- IG 貼文模型 ----
function newPost(fields = {}) {
  return {
    id: "p" + ++seq, template: "gonggao",
    title: "", intro: "", listText: "", badge: "", image: null, shot: "",
    ...fields,
  };
}
function activePost() {
  return state.igPosts.find((p) => p.id === state.activeId) || null;
}
function ensureActive() {
  if (!state.igPosts.length) {
    const p = newPost();
    state.igPosts.push(p);
    state.activeId = p.id;
  } else if (!activePost()) {
    state.activeId = state.igPosts[0].id;
  }
}
function postToRender(p) {
  if (p.template === "gonggao")
    return { kind: "gonggao", data: { title: p.title, intro: p.intro, list: (p.listText || "").split("\n"), image: p.image, shot: p.shot } };
  return { kind: "zhuvisual", data: { title: p.title, badge: p.badge, image: p.image } };
}

// ---- 預覽資料 ----
function currentPreview() {
  if (state.type === "banner") return { kind: "banner", data: state.banner };
  const p = activePost();
  return p ? postToRender(p) : { kind: "gonggao", data: { title: "", intro: "", list: [], image: null } };
}
function slugify(s) {
  return (String(s || "").trim().replace(/\s+/g, "-").replace(/[\/\\:*?"<>|]/g, "").slice(0, 20)) || "ig";
}

// ---- 縮放：整張塞進「可用寬度 ∩ 可視高度」 ----
function fitCanvas(innerEl, canvasEl, kind) {
  const size = SIZES[kind];
  const availW = stage.clientWidth || 700;
  const maxH = Math.max(320, window.innerHeight - 260);
  const scale = Math.min(availW / size.w, maxH / size.h);
  innerEl.style.width = size.w * scale + "px";
  innerEl.style.height = size.h * scale + "px";
  canvasEl.style.transform = `scale(${scale})`;
}
function renderPreview() {
  renderPreviewNav();
  const { kind, data } = currentPreview();
  stage.innerHTML = "";
  const inner = document.createElement("div");
  inner.className = "stage-inner";
  const canvas = buildCanvas(kind, data);
  inner.appendChild(canvas);
  stage.appendChild(inner);
  fitCanvas(inner, canvas, kind);
}

// 多張 IG 的預覽導覽（切換作用中貼文）
function renderPreviewNav() {
  let nav = document.getElementById("previewNav");
  if (!nav) {
    nav = document.createElement("div");
    nav.id = "previewNav";
    stage.parentElement.insertBefore(nav, stage);
  }
  nav.innerHTML = "";
  if (state.type !== "ig" || state.igPosts.length <= 1) return;
  const total = state.igPosts.length;
  const idx = state.igPosts.findIndex((p) => p.id === state.activeId);
  const prev = document.createElement("button");
  prev.textContent = "‹"; prev.disabled = idx <= 0;
  const next = document.createElement("button");
  next.textContent = "›"; next.disabled = idx >= total - 1;
  const label = document.createElement("div");
  label.className = "navlabel";
  label.textContent = `第 ${idx + 1} / ${total} 張`;
  prev.addEventListener("click", () => { if (idx > 0) { state.activeId = state.igPosts[idx - 1].id; renderControls(); renderPreview(); } });
  next.addEventListener("click", () => { if (idx < total - 1) { state.activeId = state.igPosts[idx + 1].id; renderControls(); renderPreview(); } });
  nav.append(prev, label, next);
}

// ---- 讀圖 / 縮圖 ----
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
function loadImageEl(src) {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im.naturalWidth > 0 ? im : null);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}
const MAX_EDGE = 3600;
function downscale(img) {
  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  cv.getContext("2d").drawImage(img, 0, 0, w, h);
  return cv.toDataURL("image/jpeg", 0.92);
}
async function acceptFile(file, onImage) {
  if (!file) return;
  const raw = await readFileAsDataURL(file);
  const img = await loadImageEl(raw);
  if (!img) {
    alert(
      "這張圖片瀏覽器無法顯示，常見於 iPhone／Mac 的 HEIC 格式。\n\n" +
      "請改用 JPG 或 PNG：\n" +
      "・iPhone：設定 → 相機 → 格式 → 選「相容性最佳」再拍，或先截圖\n" +
      "・Mac：用「預覽程式」打開後 檔案 → 輸出成 JPEG"
    );
    return;
  }
  onImage(downscale(img));
}
function mountDropzone(elm, onImage, hasImage) {
  elm.className = "dropzone" + (hasImage ? " has-img" : "");
  elm.textContent = hasImage ? "✓ 已載入底圖（點此更換）" : "把底圖拖進來，或點此選擇";
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*"; input.style.display = "none";
  elm.appendChild(input);
  elm.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => acceptFile(e.target.files[0], onImage));
  ["dragover", "dragenter"].forEach((ev) =>
    elm.addEventListener(ev, (e) => { e.preventDefault(); elm.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) =>
    elm.addEventListener(ev, () => elm.classList.remove("drag")));
  elm.addEventListener("drop", (e) => {
    e.preventDefault();
    acceptFile(e.dataTransfer.files[0], onImage);
  });
}

// 預設底圖縮圖列
function presetPicker(brandKeys, onPick) {
  const wrap = document.createElement("div");
  wrap.className = "presetrow";
  brandKeys.forEach((bk) =>
    (PRESET_BG[bk] || []).forEach((item) => {
      const im = document.createElement("img");
      im.className = "presetthumb";
      im.src = item.thumb; im.loading = "lazy"; im.title = "用這張當底圖";
      im.addEventListener("click", () => onPick(item.full));
      wrap.appendChild(im);
    })
  );
  return wrap;
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
    h.className = "hint"; h.textContent = hint;
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
  panel.appendChild(field("或選預設底圖", presetPicker([b.brand], (url) => { b.image = url; renderControls(); renderPreview(); })));

  const dl = document.createElement("button");
  dl.className = "btn primary"; dl.textContent = "下載 PNG";
  dl.addEventListener("click", () => exportSingle("banner", b, slugify(b.brand === "kwxh" ? b.season : b.subtitle) + "-banner"));
  const actions = document.createElement("div");
  actions.className = "actions"; actions.appendChild(dl);
  panel.appendChild(actions);
}

function renderIgControls(panel) {
  ensureActive();
  const p = activePost();

  // 常用資訊選單
  const ciWrap = document.createElement("div");
  ciWrap.style.display = "flex"; ciWrap.style.gap = "8px";
  const ci = document.createElement("select");
  const ph = document.createElement("option");
  ph.value = ""; ph.textContent = "— 選一個常用資訊 —"; ci.appendChild(ph);
  COMMON_INFO.forEach((t) => {
    const o = document.createElement("option");
    o.value = t.id; o.textContent = `${t.label}（${t.slides.length} 張）`;
    ci.appendChild(o);
  });
  const ciBtn = document.createElement("button");
  ciBtn.className = "btn ghost"; ciBtn.textContent = "帶入";
  ciBtn.style.flex = "0 0 auto";
  ciBtn.addEventListener("click", () => { if (ci.value) addCommonInfo(ci.value); });
  ciWrap.append(ci, ciBtn);
  panel.appendChild(field("常用資訊（帶入文字＋截圖，可再修改）", ciWrap, "帶入後底圖仍用你選的，文字可直接改"));

  // 版型
  const sel = document.createElement("select");
  [["gonggao", "公告型（標題＋內文＋條列）"], ["zhuvisual", "主視覺型（大標＋選配 badge）"]].forEach(([k, label]) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = label; if (k === p.template) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener("change", () => { p.template = sel.value; renderControls(); renderPreview(); });
  panel.appendChild(field("版型", sel));

  if (p.template === "gonggao") {
    panel.appendChild(field("標題", textArea(p.title, (v) => (p.title = v), "可換行"), "換行用 Enter"));
    panel.appendChild(field("內文（細節）", textArea(p.intro, (v) => (p.intro = v)), "**兩個星號** 之間會變粗體"));
    panel.appendChild(field("條列（每行一項，選配）", textArea(p.listText, (v) => (p.listText = v))));
  } else {
    panel.appendChild(field("標題", textArea(p.title, (v) => (p.title = v), "可換行")));
    panel.appendChild(field("橘色圓 badge（選配，留空不顯示）", textArea(p.badge, (v) => (p.badge = v), "例：本期報修人\\n竹節蟲 & 傑哥")));
  }

  const dz = document.createElement("div");
  mountDropzone(dz, (url) => { p.image = url; renderControls(); renderPreview(); }, !!p.image);
  panel.appendChild(field("底圖", dz));
  panel.appendChild(field("或選預設底圖", presetPicker(["kwxh", "mprc"], (url) => { p.image = url; renderControls(); renderPreview(); })));

  const addBtn = document.createElement("button");
  addBtn.className = "btn ghost"; addBtn.textContent = "＋ 新增一張";
  addBtn.addEventListener("click", () => {
    const np = newPost({ image: p.image });
    state.igPosts.push(np); state.activeId = np.id;
    renderControls(); renderPreview();
  });
  const dl = document.createElement("button");
  dl.className = "btn primary"; dl.textContent = "下載這張 PNG";
  dl.addEventListener("click", () => {
    const { kind, data } = postToRender(p);
    exportSingle(kind, data, slugify(data.title));
  });
  const actions = document.createElement("div");
  actions.className = "actions"; actions.append(addBtn, dl);
  panel.appendChild(actions);

  renderPostsSection(panel);
}

function renderPostsSection(panel) {
  const box = document.createElement("div");
  box.className = "posts";
  const h = document.createElement("h3");
  h.textContent = `貼文清單（${state.igPosts.length}）— 點縮圖編輯／拖曳排序`;
  box.appendChild(h);

  const list = document.createElement("div");
  list.className = "postlist";
  state.igPosts.forEach((p, idx) => list.appendChild(postCard(p, idx)));
  box.appendChild(list);

  const zipBtn = document.createElement("button");
  zipBtn.className = "btn primary"; zipBtn.textContent = "下載 ZIP（依順序）";
  zipBtn.style.marginTop = "12px";
  zipBtn.disabled = state.igPosts.length < 2;
  zipBtn.addEventListener("click", exportZip);
  box.appendChild(zipBtn);

  Sortable.create(list, {
    animation: 150,
    onEnd: () => {
      const ids = [...list.children].map((c) => c.dataset.id);
      state.igPosts.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      renderControls();
    },
  });
  panel.appendChild(box);
}

function postCard(p, idx) {
  const card = document.createElement("div");
  card.className = "postcard" + (p.id === state.activeId ? " active" : "");
  card.dataset.id = p.id;
  card.title = "點縮圖編輯這張";
  card.addEventListener("click", () => {
    state.activeId = p.id;
    renderControls(); renderPreview();
  });
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  const { kind, data } = postToRender(p);
  const c = buildCanvas(kind, data);
  thumb.appendChild(c);
  c.style.transform = `scale(${96 / SIZES[kind].w})`;
  card.appendChild(thumb);
  const seqEl = document.createElement("div");
  seqEl.className = "seq"; seqEl.textContent = String(idx + 1);
  card.appendChild(seqEl);
  const del = document.createElement("button");
  del.className = "del"; del.textContent = "✕";
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    state.igPosts = state.igPosts.filter((x) => x.id !== p.id);
    if (state.activeId === p.id) state.activeId = null;
    renderControls(); renderPreview();
  });
  card.appendChild(del);
  return card;
}

// 判斷「沒有實質內容」的貼文（忽略底圖——底圖會另外當 base 沿用）
function isEmptyPost(p) {
  return !p.title && !p.intro && !p.listText && !p.badge && !p.shot;
}

// 帶入常用資訊主題：每張投影片 → 一則可編輯貼文，底圖沿用當下選定
function addCommonInfo(topicId) {
  const topic = COMMON_INFO.find((t) => t.id === topicId);
  if (!topic || !topic.slides.length) return;
  const cur = activePost();
  const base = cur ? cur.image : null;
  // 當前若是空白貼文，帶入時移除它，避免清單留一張空的
  if (cur && isEmptyPost(cur)) state.igPosts = state.igPosts.filter((x) => x.id !== cur.id);
  let firstId = null;
  topic.slides.forEach((s) => {
    const np = newPost({
      template: "gonggao",
      title: s.title || "", intro: s.intro || "",
      listText: (s.list || []).join("\n"), image: base, shot: s.shot || "",
    });
    state.igPosts.push(np);
    if (!firstId) firstId = np.id;
  });
  state.activeId = firstId;
  renderControls(); renderPreview();
}

// ---- 匯出 ----
async function exportSingle(kind, data, slug) {
  if (!data.image) return alert("還沒放底圖，放了底圖再下載。");
  const blob = await renderToBlob(kind, data);
  downloadBlob(blob, `${slug || kind}.png`);
}
async function exportZip() {
  const posts = state.igPosts.filter((p) => postToRender(p).data.image);
  if (posts.length < 1) return alert("清單裡的貼文都還沒放底圖。");
  await renderAndZip(posts.map((p) => {
    const { kind, data } = postToRender(p);
    return { kind, data, slug: slugify(data.title) };
  }));
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

if (import.meta.env.DEV) {
  window.__test = { renderToBlob, state, addCommonInfo };
}
