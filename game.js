(function () {
  'use strict';

  const FORGE_MATERIALS_KEY = 'WEB_ALP_SPACE_FISHING_FORGE_V1';
  const FORGE_SPENT_UIDS_KEY = 'WEB_ALP_FORGE_SPENT_UIDS_V1';

  const urlParams = new URLSearchParams(window.location.search);
  const alpToken = urlParams.get('token');
  const platformApi = window.__ALP_PLATFORM_API__ || '';

  let forgeInFlight = false;
  let smeltInFlight = false;

  const MAT_EMOJI_POOL = [
    '🐟', '🐠', '🐡', '🪸', '🦑', '🪼', '🐙', '✨', '🌌', '💎', '🔮', '🛸',
    '🪨', '⚙️', '🧩', '☄️', '🌠', '💫', '🔱', '🫧', '🌀', '🦈', '🐬',
  ];

  function matEmoji(name) {
    let h = 2166136261;
    const s = String(name);
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return MAT_EMOJI_POOL[Math.abs(h >>> 0) % MAT_EMOJI_POOL.length];
  }

  /** Singleplay-Game3 `mountPixelArt` / 적재함과 동일 톤 (#08081a 매트) */
  const PIXEL_MAT = '#08081a';
  function pixelPaintColor(hex, cidx) {
    if (cidx === 0) return PIXEL_MAT;
    if (!hex || typeof hex !== 'string') return PIXEL_MAT;
    const h = hex.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(h)) return PIXEL_MAT;
    const r = parseInt(h.slice(1, 3), 16) / 255;
    const g = parseInt(h.slice(3, 5), 16) / 255;
    const b = parseInt(h.slice(5, 7), 16) / 255;
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const cap = cidx === 0 ? 0.4 : cidx >= 5 ? 0.82 : 0.58;
    if (L <= cap) return h.toLowerCase();
    const f = cap / L;
    const rr = Math.min(255, Math.round(r * f * 255));
    const gg = Math.min(255, Math.round(g * f * 255));
    const bb = Math.min(255, Math.round(b * f * 255));
    return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
  }

  function sanitizeForgePixelArt(pa) {
    if (!pa || !Array.isArray(pa.cells) || pa.cells.length < 4) return null;
    const palIn = Array.isArray(pa.palette) ? pa.palette : [];
    const palette = [PIXEL_MAT];
    for (let i = 0; i < palIn.length && palette.length < 48; i += 1) {
      const hx = String(palIn[i] || '').trim();
      if (/^#[0-9a-fA-F]{6}$/.test(hx)) palette.push(hx.toLowerCase());
    }
    if (palette.length < 2) return null;
    let w = Number(pa.w) | 0;
    let h = Number(pa.h) | 0;
    const clen = pa.cells.length;
    const cells = pa.cells.map((c) => Number(c) | 0);
    if (w > 0 && h > 0 && w * h === clen) {
      return { w, h, palette, cells, fromEmoji: !!pa.fromEmoji };
    }
    const side = Math.round(Math.sqrt(clen));
    if (side >= 4 && side * side === clen) {
      return { w: side, h: side, palette, cells, fromEmoji: !!pa.fromEmoji };
    }
    return null;
  }

  function mountForgePixelArt(hostEl, art, cssW, cssH) {
    if (!hostEl || !art || !Array.isArray(art.cells) || !Array.isArray(art.palette)) return;
    const canvas = document.createElement('canvas');
    canvas.width = art.w;
    canvas.height = art.h;
    canvas.className = 'pixel-art-canvas';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = PIXEL_MAT;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < art.cells.length; i += 1) {
      const cidx = art.cells[i];
      const px = i % art.w;
      const py = Math.floor(i / art.w);
      const raw = cidx === 0 ? PIXEL_MAT : (art.palette[cidx] || PIXEL_MAT);
      ctx.fillStyle = art.fromEmoji ? raw.toLowerCase() : pixelPaintColor(raw, cidx);
      ctx.fillRect(px, py, 1, 1);
    }
    const scale = 2;
    canvas.style.width = `${cssW != null ? cssW : art.w * scale}px`;
    canvas.style.height = `${cssH != null ? cssH : art.h * scale}px`;
    canvas.style.imageRendering = 'pixelated';
    hostEl.innerHTML = '';
    hostEl.appendChild(canvas);
  }

  function isForgePixelImageUrl(pa) {
    return (
      pa &&
      typeof pa === 'object' &&
      typeof pa.imageDataUrl === 'string' &&
      /^data:image\/(png|jpeg|webp);base64,/i.test(pa.imageDataUrl.trim())
    );
  }

  /** 절차적 pixelArt · PixelLab raster · 이모지 폴백 */
  function mountForgeThumbOrImage(hostEl, pixelArtVal, fallbackEmoji, cssW, cssH) {
    if (!hostEl) return;
    hostEl.innerHTML = '';
    if (isForgePixelImageUrl(pixelArtVal)) {
      const im = document.createElement('img');
      im.src = pixelArtVal.imageDataUrl.trim();
      im.alt = '';
      im.decoding = 'async';
      im.loading = 'lazy';
      im.draggable = false;
      im.className = 'forge-raster-thumb';
      if (cssW != null) im.width = cssW;
      if (cssH != null) im.height = cssH;
      hostEl.appendChild(im);
      return;
    }
    const art = sanitizeForgePixelArt(pixelArtVal);
    if (art) {
      mountForgePixelArt(hostEl, art, cssW, cssH);
      return;
    }
    const span = document.createElement('span');
    span.className = 'inv-emoji cr-emoji-fallback';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = fallbackEmoji || '⚒️';
    hostEl.appendChild(span);
  }

  const materialListEl = document.getElementById('materialList');
  const materialScrollWrap = document.getElementById('materialScrollWrap');
  const matCountBadge = document.getElementById('matCountBadge');
  const selectedSlotsEl = document.getElementById('selectedSlots');
  const btnClear = document.getElementById('btnClear');
  const btnForge = document.getElementById('btnForge');
  const statusMsgEl = document.getElementById('statusMsg');
  const craftedListEl = document.getElementById('craftedList');
  const resultCard = document.getElementById('resultCard');
  const resultRarity = document.getElementById('resultRarity');
  const resultName = document.getElementById('resultName');
  const resultDesc = document.getElementById('resultDesc');
  const resultSpriteHost = document.getElementById('resultSpriteHost');
  const forgeOverlayEl = document.getElementById('forgeOverlay');
  const forgeOverlayTimerEl = document.getElementById('forgeOverlayTimer');
  const furnaceSlotsEl = document.getElementById('furnaceSlots');
  const btnSmelt = document.getElementById('btnSmelt');
  const btnClearFurnace = document.getElementById('btnClearFurnace');
  const furnaceMsgEl = document.getElementById('furnaceMsg');
  const smeltStockListEl = document.getElementById('smeltStockList');

  let materials = [];
  /** 서버에 저장된 장비 — 재료 슬롯에 합류 */
  let serverEquipmentForgePool = [];
  let selected = [];
  /** 용광로에 넣은 재료 (낚시 재료만) */
  let furnaceSelected = [];
  let resultHideTimer = 0;
  let forgeOverlayCountdownId = 0;

  const SMELT_STOCK_KEY = 'WEB_ALP_FORGE_SMELT_STOCK_V1';

  const SMELT_RULES = [
    {
      test: (n) => /유리|glass|프리즘|결정|크리스탈|수정|lens/i.test(n),
      out: { id: 'glass', name: '유리액', emoji: '🫙' },
    },
    {
      test: (n) => /금|gold|골드/i.test(n),
      out: { id: 'gold', name: '금괴', emoji: '🟡' },
    },
    {
      test: (n) => /구리|copper|동|bronze/i.test(n),
      out: { id: 'copper', name: '구리괴', emoji: '🟠' },
    },
    {
      test: (n) => /은|silver|실버/i.test(n),
      out: { id: 'silver', name: '은괴', emoji: '⚪' },
    },
    {
      test: (n) => /철|강철|패널|회로|금속|잔해|쓰레기|컨테이너|iron|steel/i.test(n),
      out: { id: 'iron', name: '철괴', emoji: '⛓️' },
    },
  ];

  function inferSmeltProduct(materialName) {
    const n = String(materialName || '');
    for (let i = 0; i < SMELT_RULES.length; i += 1) {
      if (SMELT_RULES[i].test(n)) return { ...SMELT_RULES[i].out };
    }
    return { id: 'slag', name: '고철', emoji: '🔩' };
  }

  function loadSmeltStock() {
    try {
      const raw = localStorage.getItem(SMELT_STOCK_KEY);
      const o = raw ? JSON.parse(raw) : {};
      return o && typeof o === 'object' ? o : {};
    } catch {
      return {};
    }
  }

  function saveSmeltStock(stock) {
    try {
      localStorage.setItem(SMELT_STOCK_KEY, JSON.stringify(stock));
    } catch {
      /* ignore */
    }
  }

  /** 서버/로컬 공통: 산출물 맵 복사 (표시용 엔트리만) */
  function cloneSmeltStock(src) {
    const out = {};
    if (!src || typeof src !== 'object') return out;
    for (const k of Object.keys(src)) {
      const v = src[k];
      if (!v || typeof v !== 'object') continue;
      const c = Math.floor(Number(v.count));
      if (!Number.isFinite(c) || c <= 0) continue;
      const id = String(v.id || k).trim() || k;
      out[id] = {
        id,
        name: v.name != null ? String(v.name) : id,
        emoji: v.emoji != null ? String(v.emoji) : '◆',
        count: c,
      };
    }
    return out;
  }

  function addSmeltCountToStock(stock, materialName, add) {
    const n = Math.floor(Number(add));
    if (!Number.isFinite(n) || n <= 0) return;
    const p = inferSmeltProduct(materialName);
    const prev = stock[p.id];
    const c = prev && typeof prev.count === 'number' ? prev.count : 0;
    stock[p.id] = { ...p, count: c + n };
  }

  /** 로그인 시 서버 재고를 불러오고, 서버가 비어 있으면 로컬 산출물을 한 번 이관 */
  async function syncSmeltFromServer() {
    if (!alpToken || !platformApi) {
      renderSmeltStock();
      return;
    }
    try {
      const res = await fetch(`${platformApi}/api/smelt/stock`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (!res.ok) {
        renderSmeltStock();
        return;
      }
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
      let serverStock = data && data.stock && typeof data.stock === 'object' ? data.stock : {};
      const serverHasAny = Object.keys(serverStock).some((k) => {
        const v = serverStock[k];
        return v && typeof v.count === 'number' && v.count > 0;
      });
      if (!serverHasAny) {
        const local = loadSmeltStock();
        const localHasAny = Object.keys(local).some((k) => {
          const v = local[k];
          return v && typeof v.count === 'number' && v.count > 0;
        });
        if (localHasAny) {
          const boot = await fetch(`${platformApi}/api/smelt/bootstrap`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${alpToken}`,
            },
            body: JSON.stringify({ stock: local }),
          });
          if (boot.ok) {
            const bt = await boot.text();
            let bd = null;
            if (bt) {
              try {
                bd = JSON.parse(bt);
              } catch {
                bd = null;
              }
            }
            if (bd && bd.stock && typeof bd.stock === 'object') serverStock = bd.stock;
          }
        }
      }
      saveSmeltStock(serverStock);
      renderSmeltStock();
    } catch {
      renderSmeltStock();
    }
  }

  function getForgeTarget() {
    const el = document.querySelector('input[name="forgeTarget"]:checked');
    return el && el.value === 'furnace' ? 'furnace' : 'anvil';
  }

  function setFurnaceMsg(msg) {
    if (furnaceMsgEl) furnaceMsgEl.textContent = msg || '';
  }

  function removeMaterialsAfterUse(used) {
    const uids = used.map((u) => u.uid);
    appendSpent(uids.filter((u) => !String(u).startsWith('eq-')));
    removeMaterialsFromStore(uids);
    const eqIds = new Set(
      used.filter((m) => isEquipmentMaterial(m) && m.equipmentId != null).map((m) => String(m.equipmentId).trim()),
    );
    if (eqIds.size > 0) {
      serverEquipmentForgePool = serverEquipmentForgePool.filter((e) => !eqIds.has(String(e.equipmentId).trim()));
    }
  }

  function renderSmeltStock() {
    if (!smeltStockListEl) return;
    const stock = loadSmeltStock();
    const entries = Object.keys(stock)
      .map((k) => stock[k])
      .filter((x) => x && x.count > 0);
    if (entries.length === 0) {
      smeltStockListEl.innerHTML = '<span class="smelt-pill smelt-pill--empty">아직 없음</span>';
      return;
    }
    smeltStockListEl.innerHTML = '';
    entries.forEach((e) => {
      const pill = document.createElement('span');
      pill.className = 'smelt-pill';
      pill.innerHTML = `<span aria-hidden="true">${e.emoji || '◆'}</span> ${escapeHtml(e.name || '')} <strong>${e.count}</strong>`;
      smeltStockListEl.appendChild(pill);
    });
  }

  function syncFurnaceUi() {
    if (furnaceSlotsEl) {
      furnaceSlotsEl.innerHTML = '';
      if (furnaceSelected.length === 0) {
        const empty = document.createElement('span');
        empty.className = 'furnace-empty';
        empty.textContent = '—';
        furnaceSlotsEl.appendChild(empty);
      } else {
        furnaceSelected.forEach((m) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'furnace-chip';
          chip.title = '클릭하여 빼기';
          const n = m.name;
          const label = n.length > 20 ? `${n.slice(0, 18)}…` : n;
          chip.textContent = label;
          chip.addEventListener('click', () => {
            furnaceSelected = furnaceSelected.filter((x) => x.uid !== m.uid);
            syncFurnaceUi();
            renderMaterials();
          });
          furnaceSlotsEl.appendChild(chip);
        });
      }
    }
    if (btnSmelt) btnSmelt.disabled = furnaceSelected.length === 0;
    renderSmeltStock();
  }

  async function smeltFurnace() {
    if (furnaceSelected.length === 0 || smeltInFlight) return;
    const usable = furnaceSelected.filter((m) => !isEquipmentMaterial(m));
    if (usable.length === 0) {
      setFurnaceMsg('장비는 용광로에 넣을 수 없어요. 낚시 재료만 녹일 수 있어요.');
      return;
    }
    const serverUsable = usable.filter((m) => m.serverId != null && String(m.serverId).trim() !== '');
    const localUsable = usable.filter((m) => m.serverId == null || String(m.serverId).trim() === '');
    if (serverUsable.length > 0 && (!alpToken || !platformApi)) {
      setFurnaceMsg('서버에 저장된 재료를 녹이려면 게임에서 이 화면을 연 상태여야 해요.');
      window.setTimeout(() => setFurnaceMsg(''), 3600);
      return;
    }

    smeltInFlight = true;
    if (btnSmelt) btnSmelt.disabled = true;

    try {
      let stock = cloneSmeltStock(loadSmeltStock());

      if (serverUsable.length > 0) {
        const catchIds = serverUsable.map((m) => String(m.serverId).trim());
        const res = await fetch(`${platformApi}/api/smelt/melt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${alpToken}`,
          },
          body: JSON.stringify({ catchIds }),
        });
        const text = await res.text();
        let data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = null;
          }
        }
        if (!res.ok || !data || !data.stock) {
          const msg =
            (data && data.error && data.message) ||
            (data && data.error && data.error.message) ||
            `용광로 서버 처리 실패 (${res.status})`;
          setFurnaceMsg(msg);
          window.setTimeout(() => setFurnaceMsg(''), 4200);
          return;
        }
        stock = cloneSmeltStock(data.stock);
      }

      for (let i = 0; i < localUsable.length; i += 1) {
        addSmeltCountToStock(stock, localUsable[i].name, 1);
      }

      saveSmeltStock(stock);
      removeMaterialsAfterUse(usable);
      furnaceSelected = furnaceSelected.filter((m) => !usable.some((u) => u.uid === m.uid));
      refreshMaterials();
      syncFurnaceUi();
      syncForgeUi();
      setFurnaceMsg(`${usable.length}개 재료를 녹였습니다.`);
      window.setTimeout(() => setFurnaceMsg(''), 3200);
    } catch {
      setFurnaceMsg('네트워크 오류로 녹이기에 실패했어요.');
      window.setTimeout(() => setFurnaceMsg(''), 4200);
    } finally {
      smeltInFlight = false;
      if (btnSmelt) btnSmelt.disabled = furnaceSelected.length === 0;
      syncFurnaceUi();
    }
  }

  function stopForgeOverlayTimer() {
    if (forgeOverlayCountdownId) {
      window.clearInterval(forgeOverlayCountdownId);
      forgeOverlayCountdownId = 0;
    }
  }

  /** 20→0초 예상, 이후 예상시간 N초 초과로 증가 */
  function startForgeOverlayTimer() {
    stopForgeOverlayTimer();
    if (!forgeOverlayTimerEl) return;
    let countdown = 20;
    let exceed = 0;
    forgeOverlayTimerEl.textContent = `예상 시간 약 ${countdown}초`;
    forgeOverlayCountdownId = window.setInterval(() => {
      countdown -= 1;
      if (countdown >= 0) {
        forgeOverlayTimerEl.textContent = `예상 시간 약 ${countdown}초`;
      } else {
        exceed += 1;
        forgeOverlayTimerEl.textContent = `예상시간 ${exceed}초 초과`;
      }
    }, 1000);
  }

  function setForgeOverlay(visible) {
    if (!forgeOverlayEl) return;
    if (visible) {
      startForgeOverlayTimer();
    } else {
      stopForgeOverlayTimer();
    }
    forgeOverlayEl.classList.toggle('forge-overlay--hidden', !visible);
    forgeOverlayEl.setAttribute('aria-hidden', visible ? 'false' : 'true');
    document.documentElement.classList.toggle('forge-scroll-lock', !!visible);
    document.body.classList.toggle('forge-scroll-lock', !!visible);
  }

  function isEquipmentMaterial(m) {
    return Boolean(m && (m.kind === 'equipment' || m.equipmentId != null));
  }

  function materialHasForgeServerRef(m) {
    if (!m) return false;
    if (isEquipmentMaterial(m)) {
      return m.equipmentId != null && String(m.equipmentId).trim() !== '';
    }
    return m.serverId != null && String(m.serverId).trim() !== '';
  }

  function getSpentSet() {
    try {
      const raw = localStorage.getItem(FORGE_SPENT_UIDS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function appendSpent(uids) {
    const s = getSpentSet();
    uids.forEach((u) => s.add(u));
    localStorage.setItem(FORGE_SPENT_UIDS_KEY, JSON.stringify([...s]));
  }

  function loadMaterials() {
    try {
      const raw = localStorage.getItem(FORGE_MATERIALS_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      const spent = getSpentSet();
      const items = Array.isArray(data.items) ? data.items : [];
      return items.filter((i) => i && i.uid && !spent.has(i.uid));
    } catch {
      return [];
    }
  }

  function removeMaterialsFromStore(uids) {
    const set = new Set(uids);
    try {
      const raw = localStorage.getItem(FORGE_MATERIALS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const items = Array.isArray(data.items) ? data.items : [];
      data.items = items.filter((i) => i && !set.has(i.uid));
      data.updatedAt = Date.now();
      localStorage.setItem(FORGE_MATERIALS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }

  const MAX_EQUIP_NAME = 30;

  function hangulOnlyUi(s) {
    return String(s || '').replace(/[^가-힣]/g, '');
  }

  const BLEND_SUFFIX_UI = ['날', '심', '릭', '드', '텍', '온', '프', '즈', '빛', '심'];

  function pickSuffixUi(seed) {
    const n = String(seed || '').length;
    return BLEND_SUFFIX_UI[Math.abs(n * 17) % BLEND_SUFFIX_UI.length];
  }

  /** 서버 휴리스틱과 동일: 짧은 합성 이름 (유리+…버드 등), 풀재료 나열 금지 */
  function mergeEquipmentName(mats) {
    const names = mats.map((m) => String(m.name != null ? m.name : '').trim()).filter((x) => x.length > 0);
    if (names.length === 0) return '무명합금';
    const hang = names.map((nm) => hangulOnlyUi(nm)).filter((h) => h.length > 0);
    if (hang.length === 0) return '무명합금';
    if (hang.length === 1) {
      const h = hang[0];
      const core = h.length <= 4 ? h : `${h.slice(0, 2)}${h.slice(-2)}`;
      return `${core}${pickSuffixUi(h)}`.slice(0, MAX_EQUIP_NAME);
    }
    if (hang.length === 2) {
      const a = hang[0];
      const b = hang[1];
      const head = a.slice(0, 2) || a.slice(0, 1) || '무';
      const tail = b.length >= 2 ? b.slice(-2) : b.slice(0, Math.min(2, b.length)) || '명';
      return `${head}${tail}`.slice(0, MAX_EQUIP_NAME);
    }
    if (hang.length === 3) {
      const c0 = hang[0].slice(0, 1) || '·';
      const c1 = hang[1].slice(0, 1) || '·';
      const c2 = hang[2].slice(-1) || hang[2].slice(0, 1) || '·';
      const suf = pickSuffixUi(hang.join(''));
      return `${c0}${c1}${c2}${suf}`.slice(0, MAX_EQUIP_NAME);
    }
    const bits = hang
      .slice(0, 4)
      .map((h) => h.slice(0, 1))
      .join('');
    const suf = pickSuffixUi(bits + String(hang.length));
    return `${bits}${suf}`.slice(0, MAX_EQUIP_NAME);
  }

  function mergeEquipmentDesc(mats) {
    const n = mats.length;
    const short = mergeEquipmentName(mats);
    if (n === 2) {
      return `「${short}」 두 흔적을 한 덩이로 비벼 냈다.`.slice(0, 140);
    }
    if (n >= 3) {
      return `「${short}」 여러 기운을 한 덩이로 녹였다.`.slice(0, 140);
    }
    return `${n}가지 재료를 섞어 제련했습니다.`;
  }

  function tierLabel(t) {
    const m = { common: '일반', rare: '희귀', epic: '에픽', legendary: '전설' };
    return m[t] || t || '장비';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function rarityClass(r) {
    const x = String(r || 'common').toLowerCase();
    if (x === 'rare' || x === 'epic' || x === 'legendary' || x === 'common') return x;
    return 'common';
  }

  function refreshMaterials() {
    const spent = getSpentSet();
    const fromLocal = loadMaterials();
    const fromServer = serverEquipmentForgePool.filter((e) => e && !spent.has(e.uid));
    materials = fromLocal.concat(fromServer);
  }

  function syncScrollOverflow() {
    if (!materialScrollWrap || !materialListEl) return;
    requestAnimationFrame(() => {
      const overflow = materialListEl.scrollHeight > materialScrollWrap.clientHeight + 2;
      materialScrollWrap.classList.toggle('has-overflow', overflow);
    });
  }

  function renderMaterials() {
    if (!materialListEl) return;
    if (matCountBadge) matCountBadge.textContent = String(materials.length);

    if (materials.length === 0) {
      materialListEl.innerHTML =
        '<p class="log-empty">재료가 없습니다. 낚시로 재료를 모은 뒤 새로고침 하세요.</p>';
      syncScrollOverflow();
      return;
    }

    materialListEl.innerHTML = '';
    materials.forEach((m) => {
      const row = document.createElement('div');
      row.className = `inv-item rarity-${rarityClass(m.rarity)}${isEquipmentMaterial(m) ? ' inv-item--equipment' : ''}`;
      row.dataset.uid = m.uid;
      if (selected.some((s) => s.uid === m.uid)) row.classList.add('selected');
      if (furnaceSelected.some((s) => s.uid === m.uid)) row.classList.add('inv-item--furnace');
      const thumb = document.createElement('div');
      thumb.className = 'inv-thumb';
      mountForgeThumbOrImage(thumb, m.pixelArt, matEmoji(m.name), 56, 56);
      row.appendChild(thumb);
      const nameEl = document.createElement('span');
      nameEl.className = 'inv-name';
      nameEl.textContent = m.name != null ? String(m.name) : '';
      row.appendChild(nameEl);
      const tagEl = document.createElement('span');
      tagEl.className = 'inv-tag';
      tagEl.textContent = rarityClass(m.rarity);
      row.appendChild(tagEl);
      row.addEventListener('click', () => toggleSelect(m));
      materialListEl.appendChild(row);
    });
    syncScrollOverflow();
  }

  function toggleSelect(m) {
    if (getForgeTarget() === 'furnace') {
      if (isEquipmentMaterial(m)) {
        setFurnaceMsg('장비는 용광로에 넣을 수 없어요.');
        window.setTimeout(() => setFurnaceMsg(''), 2400);
        return;
      }
      const fi = furnaceSelected.findIndex((s) => s.uid === m.uid);
      if (fi >= 0) {
        furnaceSelected.splice(fi, 1);
      } else {
        const ai = selected.findIndex((s) => s.uid === m.uid);
        if (ai >= 0) selected.splice(ai, 1);
        furnaceSelected.push(m);
      }
      syncFurnaceUi();
      syncForgeUi();
      return;
    }
    const fi = furnaceSelected.findIndex((s) => s.uid === m.uid);
    if (fi >= 0) furnaceSelected.splice(fi, 1);
    const i = selected.findIndex((s) => s.uid === m.uid);
    if (i >= 0) selected.splice(i, 1);
    else selected.push(m);
    syncForgeUi();
  }

  function removeSelectedUid(uid) {
    const i = selected.findIndex((s) => s.uid === uid);
    if (i >= 0) selected.splice(i, 1);
    syncForgeUi();
  }

  function syncForgeUi() {
    if (selectedSlotsEl) {
      selectedSlotsEl.innerHTML = '';
      if (selected.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'anvil-empty';
        empty.innerHTML = '<span class="anvil-empty-mark">—</span>';
        selectedSlotsEl.appendChild(empty);
      } else {
        selected.forEach((m) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'anvil-chip';
          chip.title = '클릭하여 빼기';
          const n = m.name;
          const label = n.length > 22 ? `${n.slice(0, 20)}…` : n;
          chip.innerHTML = `<span class="anvil-chip-label">${escapeHtml(label)}</span>`;
          chip.addEventListener('click', () => removeSelectedUid(m.uid));
          selectedSlotsEl.appendChild(chip);
        });
      }
    }
    if (btnForge) {
      const hasServer = Boolean(alpToken && platformApi);
      const allRef = selected.every((m) => materialHasForgeServerRef(m));
      btnForge.disabled = selected.length < 2 || !hasServer || !allRef;
    }
    updateStatusMsg();
    renderMaterials();
  }

  function updateStatusMsg() {
    if (!statusMsgEl) return;
    if (selected.length === 0) {
      statusMsgEl.textContent = '보관함에서 「모루·제련」을 고른 뒤 재료를 눌러 모루에 담으세요.';
      return;
    }
    if (!alpToken || !platformApi) {
      statusMsgEl.textContent = '게임에서 이 화면을 연 경우에만 서버에 제련할 수 있어요.';
      return;
    }
    if (selected.length === 1) {
      statusMsgEl.textContent = '재료를 하나 더 올리면 조합(제련)할 수 있어요.';
      return;
    }
    const miss = selected.some((m) => !materialHasForgeServerRef(m));
    if (miss) {
      statusMsgEl.textContent = '낚시 재료(serverId) 또는 서버에 저장된 장비만 제련 재료로 쓸 수 있어요.';
      return;
    }
    const preview = mergeEquipmentName(selected);
    statusMsgEl.innerHTML = `제련 시 이름: <strong>${escapeHtml(preview)}</strong> (서버에 저장)`;
  }

  function hideResultCard() {
    if (resultCard) resultCard.classList.add('hidden');
  }

  function showResultFromServer(eq, stats, nameSource) {
    if (!resultCard || !resultName || !resultDesc || !resultRarity || !resultSpriteHost) return;
    window.clearTimeout(resultHideTimer);
    const tier = String(eq.tier || eq.rarity || 'rare').toLowerCase();
    resultCard.className = `result-card rarity-${rarityClass(tier)}`;
    resultRarity.className = `result-rarity rarity-${rarityClass(tier)}`;
    resultRarity.textContent = tierLabel(tier);
    resultName.textContent = eq.name || eq.displayName || '장비';
    const baseDesc = eq.description || eq.desc || '';
    const aiLine =
      nameSource === 'ai'
        ? '이름·능력치·내구도 · Gemini\n'
        : nameSource === 'client_fallback'
          ? '이름 · 로컬 규칙(AI 응답 없음)\n'
          : '';
    if (stats && typeof stats.attackBonus === 'number') {
      const spdPct = ((stats.speedBonus != null ? Number(stats.speedBonus) : 0) * 100).toFixed(1);
      const sz =
        stats.avgSourceSize != null
          ? `\n재료 평균 크기 ${stats.avgSourceSize}${stats.maxSourceSize != null ? ` · 최대 ${stats.maxSourceSize}` : ''}`
          : '';
      const dur =
        stats.durabilityMax != null && Number.isFinite(Number(stats.durabilityMax))
          ? ` · 내구 ${stats.durability != null ? stats.durability : stats.durabilityMax}/${stats.durabilityMax}`
          : '';
      resultDesc.textContent = `${aiLine}${baseDesc}\n공격 +${stats.attackBonus} · 방어 +${stats.defenseBonus} · 스피드 +${spdPct}%${dur}${sz}`;
    } else {
      resultDesc.textContent = `${aiLine}${baseDesc}`;
    }
    mountForgeThumbOrImage(
      resultSpriteHost,
      eq.pixelArt || eq.pixel_art,
      eq.emoji || eq.icon || matEmoji(String(eq.name || '')),
      88,
      88,
    );
    resultCard.classList.remove('hidden');
    resultHideTimer = window.setTimeout(hideResultCard, 3800);
  }

  async function forge() {
    if (forgeInFlight) return;
    if (selected.length < 2) return;
    if (!alpToken || !platformApi) {
      if (statusMsgEl) statusMsgEl.textContent = '게임 연결(토큰)이 없어 제련할 수 없어요.';
      return;
    }

    const used = selected.slice();
    if (!used.every((m) => materialHasForgeServerRef(m))) {
      if (statusMsgEl) statusMsgEl.textContent = '모든 재료에 서버 id(낚시 또는 장비)가 있어야 제련할 수 있어요.';
      return;
    }

    const materialsPayload = used.map((m) =>
      isEquipmentMaterial(m)
        ? { kind: 'equipment', id: String(m.equipmentId).trim() }
        : { kind: 'catch', id: String(m.serverId).trim() },
    );

    const name = mergeEquipmentName(used);
    const description = mergeEquipmentDesc(used);

    forgeInFlight = true;
    if (btnForge) {
      btnForge.disabled = true;
      btnForge.textContent = '제련 중…';
    }
    setForgeOverlay(true);
    try {
      const res = await fetch(`${platformApi}/api/craft/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${alpToken}`,
        },
        body: JSON.stringify({
          materials: materialsPayload,
          name,
          description,
          generateNameWithAi: true,
        }),
      });
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
      if (!res.ok || !data || !data.equipment) {
        const msg = (data && data.error && data.message) || (data && data.error && data.error.message) || `서버 저장 실패 (${res.status})`;
        if (statusMsgEl) statusMsgEl.textContent = msg;
        return;
      }

      const serverEquipment = data.equipment;
      const serverStats = serverEquipment.stats || null;

      const uids = used.map((s) => s.uid);
      appendSpent(uids.filter((u) => !String(u).startsWith('eq-')));
      removeMaterialsFromStore(uids);
      const usedSet = new Set(uids);
      selected = selected.filter((s) => !usedSet.has(s.uid));
      refreshMaterials();
      syncForgeUi();
      await refreshCraftedList();
      showResultFromServer(serverEquipment, serverStats, data.nameSource);
    } catch {
      if (statusMsgEl) statusMsgEl.textContent = '네트워크 오류로 서버에 저장하지 못했어요.';
    } finally {
      setForgeOverlay(false);
      forgeInFlight = false;
      if (btnForge) btnForge.textContent = '⚒️ 제련하기';
      syncForgeUi();
    }
  }

  function normalizeCraftedRow(item) {
    return {
      name: item.name || item.displayName || '장비',
      desc: item.description || item.desc || '',
      emoji: item.emoji || item.icon || matEmoji(String(item.name || item.displayName || '')),
      stats: item.stats,
    };
  }

  /** 보관함 썸네일: 래스터 URL · 절차적 pixelArt · 이모지 */
  function mountCraftedThumb(hostEl, item) {
    if (!hostEl) return;
    hostEl.className = 'cr-thumb';
    mountForgeThumbOrImage(
      hostEl,
      item.pixelArt || item.pixel_art,
      item.emoji || item.icon || matEmoji(String(item.name || item.displayName || '')),
      56,
      56,
    );
  }

  async function refreshCraftedList() {
    if (!craftedListEl) return;
    if (!alpToken || !platformApi) {
      craftedListEl.innerHTML =
        '<p class="log-empty">게임에 연결되면 서버에 저장된 장비 목록을 불러옵니다.</p>';
      serverEquipmentForgePool = [];
      refreshMaterials();
      renderMaterials();
      syncForgeUi();
      return;
    }
    craftedListEl.innerHTML = '<p class="log-empty">불러오는 중…</p>';
    try {
      const res = await fetch(`${platformApi}/api/craft/equipment`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (res.status === 404 || res.status === 405) {
        craftedListEl.innerHTML =
          '<p class="log-empty">장비 목록을 불러오는 API가 없습니다. 인벤토리에서 확인하세요.</p>';
        serverEquipmentForgePool = [];
        refreshMaterials();
        renderMaterials();
        syncForgeUi();
        return;
      }
      if (!res.ok) {
        craftedListEl.innerHTML = '<p class="log-empty">목록을 불러오지 못했어요.</p>';
        serverEquipmentForgePool = [];
        refreshMaterials();
        renderMaterials();
        return;
      }
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.equipment)) list = data.equipment;
      else if (data && Array.isArray(data.items)) list = data.items;
      else if (data && Array.isArray(data.list)) list = data.list;

      if (list.length === 0) {
        craftedListEl.innerHTML = '<p class="log-empty">아직 제작한 장비가 없습니다.</p>';
        serverEquipmentForgePool = [];
        refreshMaterials();
        renderMaterials();
        selected = selected.filter((s) => materials.some((m) => m.uid === s.uid));
        syncForgeUi();
        return;
      }
      serverEquipmentForgePool = list
        .filter((item) => item && item.id != null && String(item.id).trim() !== '')
        .map((item) => {
          const id = String(item.id).trim();
          const nameStr = item.name || item.displayName || '장비';
          const tier = String(item.tier || item.rarity || 'common').toLowerCase();
          const rawPa = item.pixelArt || item.pixel_art || null;
          return {
            uid: `eq-${id}`,
            name: nameStr,
            rarity: tier,
            pixelArt: rawPa,
            kind: 'equipment',
            equipmentId: id,
            serverId: null,
          };
        });
      refreshMaterials();
      renderMaterials();
      selected = selected.filter((s) => materials.some((m) => m.uid === s.uid));
      syncForgeUi();

      craftedListEl.innerHTML = '';
      list.forEach((item) => {
        const c = normalizeCraftedRow(item);
        const row = document.createElement('div');
        row.className = 'crafted-row';
        const thumb = document.createElement('div');
        mountCraftedThumb(thumb, item);
        row.appendChild(thumb);
        const body = document.createElement('div');
        const st = c.stats;
        const durPart =
          st && st.durabilityMax != null && Number.isFinite(Number(st.durabilityMax))
            ? ` · 내구 ${st.durability != null ? st.durability : st.durabilityMax}/${st.durabilityMax}`
            : '';
        const statsLine =
          st && typeof st.attackBonus === 'number'
            ? `<div class="cr-stats">공격 +${st.attackBonus} · 방어 +${st.defenseBonus} · 스피드 +${(Number(st.speedBonus || 0) * 100).toFixed(1)}%${durPart}</div>`
            : '';
        const sizeLine =
          st && st.avgSourceSize != null
            ? `<div class="cr-stats cr-stats--sub">재료 평균 크기 ${escapeHtml(String(st.avgSourceSize))}${st.maxSourceSize != null ? ` · 최대 ${escapeHtml(String(st.maxSourceSize))}` : ''}</div>`
            : '';
        body.innerHTML = `
          <strong>${escapeHtml(c.name)}</strong>
          <div class="cr-desc">${escapeHtml(c.desc || '')}</div>
          ${statsLine}
          ${sizeLine}
        `;
        row.appendChild(body);
        craftedListEl.appendChild(row);
      });
    } catch {
      craftedListEl.innerHTML = '<p class="log-empty">네트워크 오류로 목록을 불러오지 못했어요.</p>';
      serverEquipmentForgePool = [];
      refreshMaterials();
      renderMaterials();
      syncForgeUi();
    }
  }

  function onStorage(e) {
    if (e.key !== FORGE_MATERIALS_KEY && e.key !== FORGE_SPENT_UIDS_KEY && e.key !== SMELT_STOCK_KEY) return;
    refreshMaterials();
    selected = selected.filter((s) => materials.some((m) => m.uid === s.uid));
    furnaceSelected = furnaceSelected.filter((s) => materials.some((m) => m.uid === s.uid));
    syncForgeUi();
    syncFurnaceUi();
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      selected = [];
      syncForgeUi();
    });
  }
  if (btnClearFurnace) {
    btnClearFurnace.addEventListener('click', () => {
      furnaceSelected = [];
      syncFurnaceUi();
      renderMaterials();
    });
  }
  if (btnSmelt) btnSmelt.addEventListener('click', () => void smeltFurnace());
  document.querySelectorAll('input[name="forgeTarget"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      renderMaterials();
      setFurnaceMsg('');
    });
  });
  if (btnForge) btnForge.addEventListener('click', () => void forge());
  window.addEventListener('storage', onStorage);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideResultCard();
  });

  refreshMaterials();
  syncFurnaceUi();
  syncForgeUi();
  void refreshCraftedList().then(() => void syncSmeltFromServer());
})();
