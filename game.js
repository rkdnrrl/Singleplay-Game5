(function () {
  'use strict';

  const FORGE_MATERIALS_KEY = 'WEB_ALP_SPACE_FISHING_FORGE_V1';
  const FORGE_SPENT_UIDS_KEY = 'WEB_ALP_FORGE_SPENT_UIDS_V1';

  const urlParams = new URLSearchParams(window.location.search);
  const alpToken = urlParams.get('token');
  const platformApi = window.__ALP_PLATFORM_API__ || '';

  let forgeInFlight = false;
  let smeltInFlight = false;
  const MIN_SMELT_MATERIALS_FOR_FORGE = 5;

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
  const signatureCelebrateEl = document.getElementById('signatureCelebrate');
  const signatureCelebrateNameEl = document.getElementById('signatureCelebrateName');
  const signatureCelebrateOkBtn = document.getElementById('signatureCelebrateOk');
  const signatureCelebrateBackdropEl = signatureCelebrateEl
    ? signatureCelebrateEl.querySelector('.signature-celebrate-backdrop')
    : null;
  const furnaceSlotsEl = document.getElementById('furnaceSlots');
  const btnSmelt = document.getElementById('btnSmelt');
  const btnClearFurnace = document.getElementById('btnClearFurnace');
  const furnaceMsgEl = document.getElementById('furnaceMsg');
  const smeltStockListEl = document.getElementById('smeltStockList');
  const smeltCategoryFiltersEl = document.getElementById('smeltCategoryFilters');

  let materials = [];
  /** 서버에 저장된 장비 — 재료 슬롯에 합류 */
  let serverEquipmentForgePool = [];
  let selected = [];
  /** 용광로에 넣은 재료 (낚시 재료·장비) */
  let furnaceSelected = [];
  let resultHideTimer = 0;
  let signatureCelebrateTimer = 0;
  let pendingSignatureCelebrateName = null;
  let forgeOverlayCountdownId = 0;
  let smeltCategory = 'all';

  const SMELT_STOCK_KEY = 'WEB_ALP_FORGE_SMELT_STOCK_V1';
  const SMELT_CATEGORY_NAMES = {
    all: '전체',
    metal: '금속',
    electronic: '전자',
    chemical: '화학',
    polymer: '폴리머',
    gem: '보석',
    bio: '생체',
    etc: '기타',
  };
  const SMELT_CATEGORY_ID_SET = {
    metal: new Set([
      'platinum', 'palladium', 'rhodium', 'iridium', 'tungsten', 'titanium', 'molybdenum', 'chromium', 'vanadium',
      'niobium', 'cobalt', 'nickel', 'manganese', 'zinc', 'tin', 'lead', 'bismuth', 'antimony', 'lithium',
      'magnesium', 'aluminum', 'copper', 'silver', 'gold', 'iron', 'rareearth', 'neodymium', 'lanthanum', 'cerium',
      'samarium', 'yttrium', 'gallium', 'germanium', 'indium', 'selenium', 'tellurium', 'hafnium', 'tantalum',
      'zirconium', 'uranium',
    ]),
    electronic: new Set([
      'silicon', 'silica', 'wafer', 'graphite', 'carbon', 'graphene', 'lithiumsalt', 'plasma', 'battery', 'circuit',
      'fiber',
    ]),
    chemical: new Set([
      'sulfur', 'salt', 'sodaash', 'phosphor', 'phosphate', 'chloride', 'nitrate', 'ammonia', 'hydrogen', 'oxygen',
      'nitrogen', 'helium', 'argon',
    ]),
    polymer: new Set(['resin', 'rubber', 'plastic', 'petro', 'bitumen', 'kevlar', 'carbonfiber']),
    gem: new Set(['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'opal', 'topaz', 'garnet', 'pearl']),
    bio: new Set(['keratin', 'chitin', 'protein', 'enzyme', 'biofuel']),
  };

  function escRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function makeSmeltRule(id, name, emoji, keywords) {
    const source = keywords.map((k) => escRegExp(k)).join('|');
    const re = new RegExp(source, 'i');
    return {
      test: (n) => re.test(n),
      out: { id, name, emoji },
    };
  }

  const SMELT_CATALOG = [
    // 고급/희귀 금속
    { id: 'platinum', name: '백금괴', emoji: '✨', keywords: ['백금', 'platinum'] },
    { id: 'palladium', name: '팔라듐괴', emoji: '🌟', keywords: ['팔라듐', 'palladium'] },
    { id: 'rhodium', name: '로듐편', emoji: '💠', keywords: ['로듐', 'rhodium'] },
    { id: 'iridium', name: '이리듐편', emoji: '🛰️', keywords: ['이리듐', 'iridium'] },
    { id: 'tungsten', name: '텅스텐괴', emoji: '🧲', keywords: ['텅스텐', 'tungsten', 'wolfram'] },
    { id: 'titanium', name: '티타늄괴', emoji: '🛡️', keywords: ['티타늄', 'titanium'] },
    { id: 'molybdenum', name: '몰리브덴편', emoji: '🔩', keywords: ['몰리브덴', 'molybdenum'] },
    { id: 'chromium', name: '크로뮴괴', emoji: '🪞', keywords: ['크롬', 'chromium'] },
    { id: 'vanadium', name: '바나듐편', emoji: '🧪', keywords: ['바나듐', 'vanadium'] },
    { id: 'niobium', name: '니오븀편', emoji: '🧿', keywords: ['니오븀', 'niobium'] },
    { id: 'cobalt', name: '코발트괴', emoji: '🔵', keywords: ['코발트', 'cobalt'] },
    { id: 'nickel', name: '니켈괴', emoji: '🪙', keywords: ['니켈', 'nickel'] },
    { id: 'manganese', name: '망간괴', emoji: '🟤', keywords: ['망간', 'manganese'] },
    { id: 'zinc', name: '아연괴', emoji: '⚙️', keywords: ['아연', 'zinc'] },
    { id: 'tin', name: '주석괴', emoji: '🔘', keywords: ['주석', 'tin'] },
    { id: 'lead', name: '납괴', emoji: '◼️', keywords: ['납', 'lead'] },
    { id: 'bismuth', name: '비스무트편', emoji: '🧊', keywords: ['비스무트', 'bismuth'] },
    { id: 'antimony', name: '안티모니편', emoji: '🫧', keywords: ['안티모니', 'antimony'] },
    { id: 'lithium', name: '리튬결정', emoji: '🔋', keywords: ['리튬', 'lithium'] },
    { id: 'magnesium', name: '마그네슘괴', emoji: '🧯', keywords: ['마그네슘', 'magnesium'] },
    { id: 'aluminum', name: '알루미늄괴', emoji: '🔧', keywords: ['알루미늄', 'aluminum', 'aluminium'] },
    { id: 'copper', name: '구리괴', emoji: '🟠', keywords: ['구리', 'copper', '동'] },
    { id: 'silver', name: '은괴', emoji: '⚪', keywords: ['은', 'silver', '실버'] },
    { id: 'gold', name: '금괴', emoji: '🟡', keywords: ['금', 'gold', '골드'] },
    { id: 'iron', name: '철괴', emoji: '⛓️', keywords: ['철', '강철', 'iron', 'steel'] },

    // 희토류/기능 소재
    { id: 'rareearth', name: '희토류분말', emoji: '🧬', keywords: ['희토류', 'rare earth', 'rareearth'] },
    { id: 'neodymium', name: '네오디뮴편', emoji: '🧲', keywords: ['네오디뮴', 'neodymium'] },
    { id: 'lanthanum', name: '란타넘편', emoji: '🔬', keywords: ['란타넘', 'lanthanum'] },
    { id: 'cerium', name: '세륨편', emoji: '🔭', keywords: ['세륨', 'cerium'] },
    { id: 'samarium', name: '사마륨편', emoji: '🛰️', keywords: ['사마륨', 'samarium'] },
    { id: 'yttrium', name: '이트륨편', emoji: '🧱', keywords: ['이트륨', 'yttrium'] },
    { id: 'gallium', name: '갈륨방울', emoji: '💧', keywords: ['갈륨', 'gallium'] },
    { id: 'germanium', name: '게르마늄편', emoji: '🖲️', keywords: ['게르마늄', 'germanium'] },
    { id: 'indium', name: '인듐편', emoji: '📱', keywords: ['인듐', 'indium'] },
    { id: 'selenium', name: '셀레늄결정', emoji: '🔺', keywords: ['셀레늄', 'selenium'] },
    { id: 'tellurium', name: '텔루륨결정', emoji: '🔻', keywords: ['텔루륨', 'tellurium'] },
    { id: 'hafnium', name: '하프늄편', emoji: '⚛️', keywords: ['하프늄', 'hafnium'] },
    { id: 'tantalum', name: '탄탈럼편', emoji: '🔌', keywords: ['탄탈럼', 'tantalum'] },
    { id: 'zirconium', name: '지르코늄편', emoji: '🧷', keywords: ['지르코늄', 'zirconium'] },
    { id: 'uranium', name: '우라늄조각', emoji: '☢️', keywords: ['우라늄', 'uranium', '방사능', '핵'] },

    // 반도체/전자
    { id: 'silicon', name: '실리콘괴', emoji: '🔷', keywords: ['실리콘', 'silicon'] },
    { id: 'silica', name: '실리카분말', emoji: '◻️', keywords: ['실리카', 'silica', 'quartz', '석영'] },
    { id: 'wafer', name: '웨이퍼조각', emoji: '💿', keywords: ['웨이퍼', 'wafer'] },
    { id: 'graphite', name: '흑연분말', emoji: '⬛', keywords: ['흑연', 'graphite'] },
    { id: 'carbon', name: '탄소덩어리', emoji: '⬛', keywords: ['석탄', 'coal', '탄소', 'carbon'] },
    { id: 'graphene', name: '그래핀편', emoji: '🕸️', keywords: ['그래핀', 'graphene'] },
    { id: 'lithiumsalt', name: '리튬염', emoji: '🧂', keywords: ['전해질', 'electrolyte', '리튬염'] },
    { id: 'plasma', name: '플라즈마핵', emoji: '⚡', keywords: ['전기', '번개', 'plasma', '플라즈마'] },
    { id: 'battery', name: '배터리합재', emoji: '🔋', keywords: ['배터리', 'battery', '셀', 'cell'] },
    { id: 'circuit', name: '회로합금', emoji: '🧩', keywords: ['회로', 'circuit', 'pcb', '칩', 'chip'] },

    // 유리/세라믹/건축
    { id: 'glass', name: '유리액', emoji: '🫙', keywords: ['유리', 'glass', '렌즈', 'lens'] },
    { id: 'fiber', name: '광섬유편', emoji: '🧵', keywords: ['광섬유', 'fiber', 'fibre'] },
    { id: 'ceramic', name: '세라믹분말', emoji: '🧱', keywords: ['세라믹', 'ceramic', '점토', 'clay'] },
    { id: 'cement', name: '시멘트가루', emoji: '🏗️', keywords: ['시멘트', 'cement'] },
    { id: 'concrete', name: '콘크리트편', emoji: '🧱', keywords: ['콘크리트', 'concrete'] },
    { id: 'sand', name: '정제모래', emoji: '🏜️', keywords: ['모래', 'sand'] },
    { id: 'limestone', name: '석회분말', emoji: '🪨', keywords: ['석회', 'limestone'] },
    { id: 'granite', name: '화강암편', emoji: '🪨', keywords: ['화강암', 'granite'] },
    { id: 'basalt', name: '현무암편', emoji: '🗿', keywords: ['현무암', 'basalt'] },
    { id: 'asphalt', name: '아스팔트괴', emoji: '🛣️', keywords: ['아스팔트', 'asphalt'] },

    // 화학/가스
    { id: 'sulfur', name: '황결정', emoji: '🟨', keywords: ['황', 'sulfur', 'sulphur'] },
    { id: 'salt', name: '소금결정', emoji: '🧂', keywords: ['소금', 'salt', '염화나트륨'] },
    { id: 'sodaash', name: '소다회', emoji: '⚗️', keywords: ['소다회', 'soda ash'] },
    { id: 'phosphor', name: '인광분말', emoji: '🟩', keywords: ['인광', 'phosphor'] },
    { id: 'phosphate', name: '인산염', emoji: '🧪', keywords: ['인산', 'phosphate'] },
    { id: 'chloride', name: '염화물', emoji: '🫧', keywords: ['염소', 'chlorine', '염화'] },
    { id: 'nitrate', name: '질산염', emoji: '🧫', keywords: ['질산', 'nitrate'] },
    { id: 'ammonia', name: '암모니아염', emoji: '🧴', keywords: ['암모니아', 'ammonia'] },
    { id: 'hydrogen', name: '수소캡슐', emoji: '🫧', keywords: ['수소', 'hydrogen'] },
    { id: 'oxygen', name: '산소캡슐', emoji: '💨', keywords: ['산소', 'oxygen'] },
    { id: 'nitrogen', name: '질소캡슐', emoji: '🌫️', keywords: ['질소', 'nitrogen'] },
    { id: 'helium', name: '헬륨캡슐', emoji: '🎈', keywords: ['헬륨', 'helium'] },
    { id: 'argon', name: '아르곤캡슐', emoji: '🌬️', keywords: ['아르곤', 'argon'] },

    // 폴리머/석유
    { id: 'resin', name: '수지덩어리', emoji: '🪵', keywords: ['수지', 'resin', '나무', 'wood', '목재'] },
    { id: 'rubber', name: '고무덩어리', emoji: '🛞', keywords: ['고무', 'rubber', '라텍스', 'latex'] },
    { id: 'plastic', name: '플라스틱편', emoji: '🧴', keywords: ['플라스틱', 'plastic', '폴리머', 'polymer'] },
    { id: 'petro', name: '석유정제물', emoji: '🛢️', keywords: ['석유', 'oil', '원유', 'crude'] },
    { id: 'bitumen', name: '비투멘', emoji: '🛢️', keywords: ['비투멘', 'bitumen', '타르', 'tar'] },
    { id: 'kevlar', name: '아라미드섬유', emoji: '🦺', keywords: ['케블라', 'kevlar', 'aramid'] },
    { id: 'carbonfiber', name: '탄소섬유', emoji: '🧵', keywords: ['탄소섬유', 'carbon fiber', 'carbonfiber'] },

    // 보석/귀금속 계열
    { id: 'diamond', name: '다이아분말', emoji: '💎', keywords: ['다이아', 'diamond'] },
    { id: 'ruby', name: '루비분말', emoji: '❤️', keywords: ['루비', 'ruby'] },
    { id: 'sapphire', name: '사파이어분말', emoji: '💙', keywords: ['사파이어', 'sapphire'] },
    { id: 'emerald', name: '에메랄드가루', emoji: '🟢', keywords: ['에메랄드', 'emerald'] },
    { id: 'amethyst', name: '자수정가루', emoji: '🟣', keywords: ['자수정', 'amethyst'] },
    { id: 'opal', name: '오팔파편', emoji: '🫧', keywords: ['오팔', 'opal'] },
    { id: 'topaz', name: '토파즈가루', emoji: '🟨', keywords: ['토파즈', 'topaz'] },
    { id: 'garnet', name: '가넷가루', emoji: '🔴', keywords: ['가넷', 'garnet'] },
    { id: 'pearl', name: '진주분말', emoji: '⚪', keywords: ['진주', 'pearl'] },

    // 생체/기타
    { id: 'keratin', name: '생체분말', emoji: '🦴', keywords: ['뼈', 'bone', '가죽', 'hide', '비늘', 'scale'] },
    { id: 'chitin', name: '키틴편', emoji: '🪲', keywords: ['키틴', 'chitin', '갑각'] },
    { id: 'protein', name: '단백질덩어리', emoji: '🥩', keywords: ['단백질', 'protein'] },
    { id: 'enzyme', name: '효소응집체', emoji: '🧫', keywords: ['효소', 'enzyme'] },
    { id: 'biofuel', name: '바이오연료', emoji: '🟩', keywords: ['바이오', 'bio', '연료'] },
    { id: 'magma', name: '마그마코어', emoji: '🌋', keywords: ['마그마', 'lava', '용암'] },
    { id: 'cryo', name: '빙결결정', emoji: '🧊', keywords: ['얼음', 'ice', '빙결', '서리', 'frost'] },
  ];

  const SMELT_RULES = SMELT_CATALOG.map((entry) =>
    makeSmeltRule(entry.id, entry.name, entry.emoji, entry.keywords),
  );

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

  function getSmeltGainSummary(beforeStock, afterStock) {
    const before = cloneSmeltStock(beforeStock);
    const after = cloneSmeltStock(afterStock);
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const gains = [];
    keys.forEach((k) => {
      const b = before[k] && typeof before[k].count === 'number' ? before[k].count : 0;
      const a = after[k] && typeof after[k].count === 'number' ? after[k].count : 0;
      const d = a - b;
      if (d <= 0) return;
      const ref = after[k] || before[k] || { id: k, name: k, emoji: '◆' };
      gains.push({
        id: String(ref.id || k),
        name: String(ref.name || k),
        emoji: String(ref.emoji || '◆'),
        count: d,
      });
    });
    gains.sort((x, y) => y.count - x.count || x.name.localeCompare(y.name, 'ko'));
    return gains;
  }

  function formatSmeltGainSummary(gains) {
    if (!Array.isArray(gains) || gains.length === 0) return '';
    return gains.map((g) => `${g.emoji} ${g.name} +${g.count}`).join(', ');
  }

  function getSmeltCategoryById(id) {
    const sid = String(id || '').trim();
    if (!sid) return 'etc';
    if (sid === 'slag') return 'etc';
    if (SMELT_CATEGORY_ID_SET.metal.has(sid)) return 'metal';
    if (SMELT_CATEGORY_ID_SET.electronic.has(sid)) return 'electronic';
    if (SMELT_CATEGORY_ID_SET.chemical.has(sid)) return 'chemical';
    if (SMELT_CATEGORY_ID_SET.polymer.has(sid)) return 'polymer';
    if (SMELT_CATEGORY_ID_SET.gem.has(sid)) return 'gem';
    if (SMELT_CATEGORY_ID_SET.bio.has(sid)) return 'bio';
    return 'etc';
  }

  function matchSmeltCategory(entry, category) {
    if (!entry || category === 'all') return true;
    return getSmeltCategoryById(entry.id) === category;
  }

  function renderSmeltCategoryFilterUi() {
    if (!smeltCategoryFiltersEl) return;
    smeltCategoryFiltersEl.querySelectorAll('.smelt-filter').forEach((btn) => {
      const cat = btn.getAttribute('data-cat') || 'all';
      btn.classList.toggle('is-active', cat === smeltCategory);
    });
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
    renderSmeltCategoryFilterUi();
    if (entries.length === 0) {
      smeltStockListEl.innerHTML = '<span class="smelt-pill smelt-pill--empty">아직 없음</span>';
      return;
    }
    const filtered = entries.filter((e) => matchSmeltCategory(e, smeltCategory));
    if (filtered.length === 0) {
      const catLabel = SMELT_CATEGORY_NAMES[smeltCategory] || '선택한 카테고리';
      smeltStockListEl.innerHTML = `<span class="smelt-pill smelt-pill--empty">${escapeHtml(catLabel)} 산출물 없음</span>`;
      return;
    }
    smeltStockListEl.innerHTML = '';
    filtered.forEach((e) => {
      const pill = document.createElement('button');
      const sid = String(e.id != null ? e.id : '').trim();
      const currentSelected = countSelectedSmeltById(sid);
      const canAdd = currentSelected < Number(e.count || 0);
      pill.className = 'smelt-pill';
      pill.type = 'button';
      pill.disabled = !canAdd;
      pill.title = canAdd ? '클릭하여 모루 재료에 추가' : '이미 보유 수량만큼 선택됨';
      pill.innerHTML = `<span aria-hidden="true">${e.emoji || '◆'}</span> ${escapeHtml(e.name || '')} <strong>${e.count}</strong>`;
      pill.addEventListener('click', () => {
        if (getForgeTarget() === 'furnace') {
          if (statusMsgEl) statusMsgEl.textContent = '산출물은 모루·제련에서만 재료로 쓸 수 있어요.';
          return;
        }
        const latestStock = cloneSmeltStock(loadSmeltStock());
        const latest = latestStock[sid];
        const maxCount = latest && typeof latest.count === 'number' ? latest.count : 0;
        const inSelected = countSelectedSmeltById(sid);
        if (inSelected >= maxCount) {
          if (statusMsgEl) statusMsgEl.textContent = '해당 산출물은 보유 수량만큼만 모루에 올릴 수 있어요.';
          syncForgeUi();
          return;
        }
        selected.push(makeSmeltSelectionMaterial(latest || e));
        syncForgeUi();
      });
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
    const toMelt = furnaceSelected.slice();

    const serverCatches = toMelt.filter(
      (m) => !isEquipmentMaterial(m) && m.serverId != null && String(m.serverId).trim() !== '',
    );
    const serverEquipment = toMelt.filter(
      (m) =>
        isEquipmentMaterial(m) &&
        m.equipmentId != null &&
        String(m.equipmentId).trim() !== '',
    );
    const localOnly = toMelt.filter(
      (m) =>
        !isEquipmentMaterial(m) &&
        (m.serverId == null || String(m.serverId).trim() === ''),
    );
    const localEquipmentOrphans = toMelt.filter(
      (m) =>
        isEquipmentMaterial(m) &&
        (m.equipmentId == null || String(m.equipmentId).trim() === ''),
    );
    const localInfer = localOnly.concat(localEquipmentOrphans);

    const needsServer = serverCatches.length > 0 || serverEquipment.length > 0;
    if (needsServer && (!alpToken || !platformApi)) {
      setFurnaceMsg('낚시 재료·장비를 녹이려면 게임에서 이 화면을 연 상태여야 해요.');
      window.setTimeout(() => setFurnaceMsg(''), 3600);
      return;
    }

    smeltInFlight = true;
    if (btnSmelt) btnSmelt.disabled = true;

    try {
      const beforeStock = cloneSmeltStock(loadSmeltStock());
      let stock = cloneSmeltStock(beforeStock);

      if (needsServer) {
        const catchIds = serverCatches.map((m) => String(m.serverId).trim());
        const equipmentIds = serverEquipment.map((m) => String(m.equipmentId).trim());
        const res = await fetch(`${platformApi}/api/smelt/melt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${alpToken}`,
          },
          body: JSON.stringify({ catchIds, equipmentIds }),
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

      for (let i = 0; i < localInfer.length; i += 1) {
        addSmeltCountToStock(stock, localInfer[i].name, 1);
      }

      saveSmeltStock(stock);
      removeMaterialsAfterUse(toMelt);
      furnaceSelected = furnaceSelected.filter((m) => !toMelt.some((u) => u.uid === m.uid));
      refreshMaterials();
      syncFurnaceUi();
      syncForgeUi();
      const gains = getSmeltGainSummary(beforeStock, stock);
      const gainText = formatSmeltGainSummary(gains);
      setFurnaceMsg(
        gainText ? `${toMelt.length}개를 녹였습니다. 산출: ${gainText}` : `${toMelt.length}개를 녹였습니다.`,
      );
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

  function hideSignatureCelebrate() {
    window.clearTimeout(signatureCelebrateTimer);
    signatureCelebrateTimer = 0;
    if (!signatureCelebrateEl) return;
    signatureCelebrateEl.classList.add('signature-celebrate--hidden');
    signatureCelebrateEl.setAttribute('aria-hidden', 'true');
  }

  function showSignatureCelebrate(displayName) {
    if (!signatureCelebrateEl || !signatureCelebrateNameEl) return;
    hideSignatureCelebrate();
    const label = String(displayName || '').trim() || '장비';
    signatureCelebrateNameEl.textContent = label;
    signatureCelebrateEl.classList.remove('signature-celebrate--hidden');
    signatureCelebrateEl.setAttribute('aria-hidden', 'false');
    signatureCelebrateTimer = window.setTimeout(hideSignatureCelebrate, 5200);
  }

  if (signatureCelebrateOkBtn) {
    signatureCelebrateOkBtn.addEventListener('click', () => hideSignatureCelebrate());
  }
  if (signatureCelebrateBackdropEl) {
    signatureCelebrateBackdropEl.addEventListener('click', () => hideSignatureCelebrate());
  }

  function setForgeOverlay(visible) {
    if (!forgeOverlayEl) return;
    if (visible) {
      hideSignatureCelebrate();
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

  function isSmeltMaterial(m) {
    return Boolean(m && m.kind === 'smelt' && m.smeltId != null && String(m.smeltId).trim() !== '');
  }

  function materialHasForgeServerRef(m) {
    if (!m) return false;
    if (isSmeltMaterial(m)) return true;
    if (isEquipmentMaterial(m)) {
      return m.equipmentId != null && String(m.equipmentId).trim() !== '';
    }
    return m.serverId != null && String(m.serverId).trim() !== '';
  }

  function makeSmeltSelectionMaterial(stockEntry) {
    const sid = String(stockEntry && stockEntry.id != null ? stockEntry.id : '').trim();
    return {
      uid: `smelt-${sid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: 'smelt',
      smeltId: sid,
      name: stockEntry && stockEntry.name != null ? String(stockEntry.name) : sid,
      rarity: 'rare',
      pixelArt: null,
      serverId: null,
      equipmentId: null,
      emoji: stockEntry && stockEntry.emoji != null ? String(stockEntry.emoji) : '◆',
    };
  }

  function countSelectedSmeltById(smeltId) {
    const sid = String(smeltId || '').trim();
    if (!sid) return 0;
    return selected.filter((m) => isSmeltMaterial(m) && String(m.smeltId).trim() === sid).length;
  }

  function consumeSmeltSelectionMaterials(used) {
    if (!Array.isArray(used) || used.length === 0) return;
    const smeltUsed = used.filter((m) => isSmeltMaterial(m));
    if (smeltUsed.length === 0) return;
    const stock = cloneSmeltStock(loadSmeltStock());
    const useCountById = {};
    smeltUsed.forEach((m) => {
      const sid = String(m.smeltId || '').trim();
      if (!sid) return;
      useCountById[sid] = (useCountById[sid] || 0) + 1;
    });
    Object.keys(useCountById).forEach((sid) => {
      const usedCount = useCountById[sid];
      const prev = stock[sid];
      const prevCount = prev && typeof prev.count === 'number' ? prev.count : 0;
      const nextCount = Math.max(0, prevCount - usedCount);
      if (nextCount <= 0) delete stock[sid];
      else stock[sid] = { ...prev, count: nextCount };
    });
    saveSmeltStock(stock);
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

  /**
   * 대장간에서 직접 서버 보관함(catches/inventory)을 읽어 재료 캐시를 갱신.
   * 낚시 게임을 거치지 않아도 재료가 보이도록 한다.
   */
  async function syncForgeMaterialsFromServer() {
    if (!alpToken || !platformApi) return;
    try {
      const res = await fetch(`${platformApi}/api/catches/inventory?limit=200`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (!res.ok) return;
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
      const catches = data && Array.isArray(data.catches) ? data.catches : [];
      const serverItems = catches
        .filter((c) => c && c.id != null && String(c.id).trim() !== '')
        .map((c) => ({
          uid: `srv-${String(c.id).trim()}`,
          name: c.itemName != null ? String(c.itemName) : '재료',
          rarity: c.rarity != null ? String(c.rarity).toLowerCase() : 'common',
          size: c.size != null ? c.size : null,
          coins: c.coinValue != null ? c.coinValue : 0,
          serverId: String(c.id).trim(),
          pixelArt: c.pixelArt || null,
        }));

      // 서버 항목으로 덮어쓰되, 서버 id가 없는 로컬 임시 항목은 유지
      const current = loadMaterials();
      const localOnly = current.filter((x) => x && (!x.serverId || String(x.serverId).trim() === ''));
      const items = serverItems.concat(localOnly);
      localStorage.setItem(
        FORGE_MATERIALS_KEY,
        JSON.stringify({ v: 3, items, updatedAt: Date.now(), source: 'forge-direct' }),
      );
      refreshMaterials();
      renderMaterials();
      syncForgeUi();
      syncFurnaceUi();
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
      const smeltCount = selected.filter((m) => isSmeltMaterial(m)).length;
      const smeltGateBlocked = smeltCount > 0 && smeltCount < MIN_SMELT_MATERIALS_FOR_FORGE;
      btnForge.disabled = selected.length < 2 || !hasServer || !allRef || smeltGateBlocked;
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
      statusMsgEl.textContent = '낚시 재료(serverId)·서버 장비·산출물만 제련 재료로 쓸 수 있어요.';
      return;
    }
    const smeltCount = selected.filter((m) => isSmeltMaterial(m)).length;
    if (smeltCount > 0 && smeltCount < MIN_SMELT_MATERIALS_FOR_FORGE) {
      statusMsgEl.textContent = `산출물 포함 제련은 산출물 최소 ${MIN_SMELT_MATERIALS_FOR_FORGE}개가 필요해요.`;
      return;
    }
    if (selected.some((m) => isSmeltMaterial(m))) {
      statusMsgEl.textContent = '산출물 포함 조합은 서버에 저장됩니다.';
      return;
    }
    statusMsgEl.textContent =
      '「⚒️ 제련하기」를 누르면 서버에서 AI가 이름·능력치·내구도를 정하고 저장해요.';
  }

  function hideResultCard() {
    if (resultCard) resultCard.classList.add('hidden');
  }

  function nameAiSkipHintKo(reason) {
    const r = String(reason || 'unknown');
    const map = {
      no_api_key:
        '서버에 Gemini 키(GEMINI_API_KEY 또는 GOOGLE_AI_API_KEY)가 없어, 재료 규칙으로 이름·스탯을 정했어요.',
      timeout: 'AI 응답이 지연되어(타임아웃) 로컬 규칙으로 이름·스탯을 정했어요.',
      network: 'AI 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.',
      api_error: 'AI API 오류로 로컬 규칙으로 이름·스탯을 정했어요.',
      blocked: 'AI 안전 정책으로 이름 생성이 제한되어 로컬 규칙을 썼어요.',
      parse_error: 'AI 응답을 해석하지 못해 로컬 규칙으로 이름·스탯을 정했어요.',
      incomplete_response: 'AI가 완전한 이름·스탯을 주지 않아 로컬 규칙을 썼어요.',
      exception: 'AI 처리 중 오류가 나 로컬 규칙으로 이름·스탯을 정했어요.',
      unknown: 'AI 이름을 쓰지 못하고 로컬 규칙으로 이름·스탯을 정했어요.',
    };
    return map[r] || map.unknown;
  }

  function showResultFromServer(eq, stats, nameSource, nameAiMeta) {
    if (!resultCard || !resultName || !resultDesc || !resultRarity || !resultSpriteHost) return;
    window.clearTimeout(resultHideTimer);
    const tier = String(eq.tier || eq.rarity || 'rare').toLowerCase();
    resultCard.className = `result-card rarity-${rarityClass(tier)}`;
    resultRarity.className = `result-rarity rarity-${rarityClass(tier)}`;
    resultRarity.textContent = tierLabel(tier);
    resultName.textContent = eq.name || eq.displayName || '장비';
    const baseDesc = eq.description || eq.desc || '';
    const skipHint =
      nameAiMeta && nameAiMeta.nameAiRequested && nameAiMeta.nameAiUsed === false
        ? nameAiSkipHintKo(nameAiMeta.nameAiSkipReason)
        : '';
    let aiLine = '';
    if (skipHint) {
      aiLine = `${skipHint}\n`;
    } else if (nameSource === 'ai') {
      aiLine = '이름·능력치·내구도 · Gemini\n';
    } else if (nameSource === 'client_fallback') {
      aiLine = '이름 · 로컬 규칙(AI 응답 없음)\n';
    }
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
    const smeltCount = used.filter((m) => isSmeltMaterial(m)).length;
    if (smeltCount > 0 && smeltCount < MIN_SMELT_MATERIALS_FOR_FORGE) {
      if (statusMsgEl) {
        statusMsgEl.textContent = `산출물 포함 제련은 산출물 최소 ${MIN_SMELT_MATERIALS_FOR_FORGE}개가 필요해요.`;
      }
      return;
    }
    if (!used.every((m) => materialHasForgeServerRef(m))) {
      if (statusMsgEl) statusMsgEl.textContent = '모든 재료가 유효한 참조(낚시/장비/산출물)를 가져야 제련할 수 있어요.';
      return;
    }

    const materialsPayload = used.map((m) =>
      isSmeltMaterial(m)
        ? { kind: 'smelt', id: String(m.smeltId).trim() }
        : isEquipmentMaterial(m)
          ? { kind: 'equipment', id: String(m.equipmentId).trim() }
          : { kind: 'catch', id: String(m.serverId).trim() },
    );

    const name = mergeEquipmentName(used);
    const description = mergeEquipmentDesc(used);

    forgeInFlight = true;
    pendingSignatureCelebrateName = null;
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
      appendSpent(uids.filter((u) => !String(u).startsWith('eq-') && !String(u).startsWith('smelt-')));
      removeMaterialsFromStore(uids);
      consumeSmeltSelectionMaterials(used);
      const usedSet = new Set(uids);
      selected = selected.filter((s) => !usedSet.has(s.uid));
      refreshMaterials();
      syncForgeUi();
      await refreshCraftedList();
      showResultFromServer(serverEquipment, serverStats, data.nameSource, {
        nameAiRequested: data.nameAiRequested,
        nameAiUsed: data.nameAiUsed,
        nameAiSkipReason: data.nameAiSkipReason,
      });
      if (data.nameSource === 'ai' && data.nameClass === 'signature') {
        pendingSignatureCelebrateName = String(serverEquipment.name || '').trim() || '장비';
      }
    } catch {
      pendingSignatureCelebrateName = null;
      if (statusMsgEl) statusMsgEl.textContent = '네트워크 오류로 서버에 저장하지 못했어요.';
    } finally {
      setForgeOverlay(false);
      forgeInFlight = false;
      if (btnForge) btnForge.textContent = '⚒️ 제련하기';
      syncForgeUi();
      const sigName = pendingSignatureCelebrateName;
      pendingSignatureCelebrateName = null;
      if (sigName) showSignatureCelebrate(sigName);
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
        selected = selected.filter((s) => isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid));
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
      selected = selected.filter((s) => isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid));
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
    selected = selected.filter((s) => isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid));
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
  if (smeltCategoryFiltersEl) {
    smeltCategoryFiltersEl.querySelectorAll('.smelt-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-cat') || 'all';
        if (next === smeltCategory) return;
        smeltCategory = next;
        renderSmeltStock();
      });
    });
  }
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
  void syncForgeMaterialsFromServer()
    .then(() => refreshCraftedList())
    .then(() => syncSmeltFromServer());
})();
