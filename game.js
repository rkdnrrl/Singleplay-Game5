(function () {
  'use strict';

  const FORGE_MATERIALS_KEY = 'WEB_ALP_SPACE_FISHING_FORGE_V1';
  const FORGE_SPENT_UIDS_KEY = 'WEB_ALP_FORGE_SPENT_UIDS_V1';

  const urlParams = new URLSearchParams(window.location.search);
  const alpToken = urlParams.get('token');
  const platformApi = window.__ALP_PLATFORM_API__ || '';

  let forgeInFlight = false;
  let smeltInFlight = false;
  let serverMeltLost = []; // 마지막 장비 녹임에서 소실된 재료 목록
  let totalCoins = 0;
  let forgeStartAt = 0; // 제련 시작 시각 (Date.now)
  /** 모루는 산출물(smelt)만 허용 — 최소 2개. */
  const MIN_SMELT_MATERIALS_FOR_FORGE = 2;

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
    if (!pa || typeof pa !== 'object') return false;
    const url = typeof pa.imageDataUrl === 'string' ? pa.imageDataUrl.trim() : '';
    if (!url) return false;
    return (
      /^data:image\/(png|jpeg|webp);base64,/i.test(url) ||
      /^data:image\/svg\+xml/i.test(url)
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
  const forgeOverlayBonusEl = document.getElementById('forgeOverlayBonus');
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
  const furnaceEquipWarnEl = document.getElementById('furnaceEquipWarn');
  const furnacePreviewEl = document.getElementById('furnacePreview');
  const furnaceResultEl = document.getElementById('furnaceResult');
  const coinCountEl = document.getElementById('coinCount');
  const forgeDiscoveryBannerEl = document.getElementById('forgeDiscoveryBanner');
  const forgeOverlayTitleEl = document.getElementById('forgeOverlayTitle');
  const smeltStockListEl = document.getElementById('smeltStockList');
  const smeltCategoryFiltersEl = document.getElementById('smeltCategoryFilters');
  const materialDockFiltersEl = document.getElementById('materialDockFilters');
  const furnacePanelEl = document.querySelector('.furnace-panel');
  const anvilPanelEl = document.querySelector('.refine-panel.forge-workbench') || document.querySelector('.refine-panel');

  const materialDetailModalEl = document.getElementById('materialDetailModal');
  const materialDetailCloseBtn = document.getElementById('materialDetailClose');
  const materialDetailThumbEl = document.getElementById('materialDetailThumb');
  const materialDetailTitleEl = document.getElementById('materialDetailTitle');
  const materialDetailRarityEl = document.getElementById('materialDetailRarity');
  const materialDetailDlEl = document.getElementById('materialDetailDl');
  const materialDetailHintEl = document.getElementById('materialDetailHint');
  /** 터치로 상세를 연 직후 합성 click이 배경/행에 닿아 바로 닫히는 것 방지 */
  let materialDetailBackdropIgnoreUntil = 0;
  let materialDetailSyntheticClickSuppressUntil = 0;

  let materials = [];
  /** 서버에 저장된 장비 — 재료 슬롯에 합류 */
  let serverEquipmentForgePool = [];
  /** 장비 ID → sourceMaterials 맵 */
  let equipSourceMatsMap = new Map();
  /** 대장간 숙련도 (서버에서 로드, float) */
  let smithingProficiency = 0;
  let smithingProfLevelInfo = { mul: 1.0 };
  let selected = [];
  /** 용광로에 넣은 재료 (낚시 재료·장비) */
  let furnaceSelected = [];
  let resultHideTimer = 0;
  let signatureCelebrateTimer = 0;
  let pendingSignatureCelebrateName = null;
  let forgeOverlayCountdownId = 0;
  let forgeScanBonusToastShown = false;
  let smeltCategory = 'all';
  /** 보관함 목록 필터: all | material(잔해·폐품형) | equipment | soul(생명·우주 신비형) */
  let materialDockFilter = 'all';
  /** 제련할 장비 종류: weapon | armor */
  let forgeSlot = 'weapon';

  const MAT_DOCK_SOUL_TYPES = new Set(['fish', 'creature', 'cosmic', 'crystal', 'artifact']);
  const MAT_DOCK_MATERIAL_TYPES = new Set(['scrap', 'debris']);

  const SMELT_STOCK_KEY = 'WEB_ALP_FORGE_SMELT_STOCK_V1';
  const FORGE_DRAG_MATERIAL_UID = 'application/x-forge-material-uid';
  const FORGE_DRAG_SMELT_UID = 'application/x-forge-smelt-id';
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
    polymer: new Set(['resin', 'rubber', 'plastic', 'leather', 'textile', 'petro', 'bitumen', 'kevlar', 'carbonfiber']),
    gem: new Set(['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'opal', 'topaz', 'garnet', 'pearl']),
    bio: new Set(['keratin', 'chitin', 'protein', 'enzyme', 'biofuel']),
  };

  function escRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function makeSmeltRule(id, name, emoji, keywords) {
    const words = (Array.isArray(keywords) ? keywords : [])
      .map((k) => String(k || '').trim())
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    const source = words.map((k) => escRegExp(k)).join('|');
    const re = source ? new RegExp(source, 'i') : /$^/;
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
    { id: 'silver', name: '은괴', emoji: '⚪', keywords: ['실버', 'silver', '순은', '백은', '925은', '은괴', '은선', '은도금', '은장', '은박', '스털링'] },
    { id: 'gold', name: '금괴', emoji: '🟡', keywords: ['순금', '황금', 'gold', '골드', '금괴', '금도금', '24k', '18k', '캐럿'] },
    { id: 'iron', name: '철괴', emoji: '⛓️', keywords: ['강철', '연철', '스테인리스', '스테인', 'iron', 'steel', '철근', '철판', '철사', '철망', '철창', '철퇴', '철심', '철벽', '철광', '철가루', 'scrap iron'] },
    {
      id: 'circuit',
      name: '회로합금',
      emoji: '🧩',
      keywords: [
        '비철',
        '기계식키보드',
        '유선키보드',
        '무선키보드',
        '키보드',
        'keyboard',
        '게이밍마우스',
        '무선마우스',
        '마우스',
        'mouse',
        '게임패드',
        'gamepad',
        '조이스틱',
        '컨트롤러',
        'controller',
        '마우스패드',
        '모니터',
        'monitor',
        '디스플레이',
        'lcd',
        'oled',
        '노트북',
        '태블릿',
        '스마트폰',
        '그래픽카드',
        'gpu',
        'cpu',
        'ram',
        'ddr',
        'ssd',
        'm.2',
        '하드디스크',
        '메인보드',
        '마더보드',
        '파워서플라이',
        'usb허브',
        'usb',
        '충전기',
        '어댑터',
        '웹캠',
        'webcam',
        '헤드셋',
        'headset',
        '이어폰',
        '스피커',
        '마이크',
        '회로',
        'circuit',
        'pcb',
        '칩',
        'chip',
        '메모리',
        '프로세서',
        'nvidia',
        'amd',
        '인텔',
        'intel',
      ],
    },

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
    { id: 'plasma', name: '플라즈마핵', emoji: '⚡', keywords: ['번개', 'plasma', '플라즈마'] },
    { id: 'battery', name: '배터리합재', emoji: '🔋', keywords: ['배터리', 'battery', '셀', 'cell'] },

    // 유리/세라믹/건축
    { id: 'glass', name: '유리액', emoji: '🫙', keywords: ['유리', 'glass', '렌즈', 'lens'] },
    { id: 'fiber', name: '광섬유편', emoji: '🧵', keywords: ['광섬유', 'fiber', 'fibre'] },
    { id: 'ceramic', name: '세라믹분말', emoji: '🧱', keywords: ['도자기', '자기', 'porcelain', '세라믹', 'ceramic', '점토', 'clay'] },
    { id: 'cement', name: '시멘트가루', emoji: '🏗️', keywords: ['시멘트', 'cement'] },
    { id: 'concrete', name: '콘크리트편', emoji: '🧱', keywords: ['콘크리트', 'concrete'] },
    { id: 'sand', name: '정제모래', emoji: '🏜️', keywords: ['모래', 'sand'] },
    { id: 'limestone', name: '석회분말', emoji: '🪨', keywords: ['석회', 'limestone'] },
    { id: 'granite', name: '화강암편', emoji: '🪨', keywords: ['화강암', 'granite', '대리석', 'marble'] },
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
    { id: 'resin', name: '수지덩어리', emoji: '🪵', keywords: ['목판', '원목', '대나무', '나무자루', '수지', 'resin', '나무', 'wood', '목재'] },
    { id: 'rubber', name: '고무덩어리', emoji: '🛞', keywords: ['고무', 'rubber', '라텍스', 'latex'] },
    { id: 'plastic', name: '플라스틱편', emoji: '🧴', keywords: ['플라스틱', 'plastic', '폴리머', 'polymer'] },
    {
      id: 'leather',
      name: '가죽편',
      emoji: '🥾',
      keywords: [
        '낡은가죽',
        '가죽장갑',
        '가죽장화',
        '가죽신발',
        '가죽벨트',
        '가죽지갑',
        '가죽소파',
        '가죽시트',
        '가죽재킷',
        '가죽자켓',
        '가죽코트',
        '가죽모자',
        '가죽책',
        '가죽',
        'leather',
        '스웨이드',
        'suede',
        '누벅',
        '합피',
        '인조가죽',
      ],
    },
    {
      id: 'textile',
      name: '면섬유뭉치',
      emoji: '🧶',
      keywords: [
        '면섬유',
        '순면',
        '면티',
        '면원단',
        '면장갑',
        '니트장갑',
        '울장갑',
        '실크장갑',
        '털장갑',
        '코튼',
        'cotton',
        '린넨',
        'linen',
        '데님',
        'denim',
        '폴리에스터',
        '레이온',
        '스웨터',
        '니트',
        '티셔츠',
        '후드티',
        '맨투맨',
        '셔츠',
        '블라우스',
        '청바지',
        '바지',
        '반바지',
        '슬랙스',
        '치마',
        '원피스',
        '패딩',
        '코트',
        '재킷',
        '점퍼',
        '바람막이',
        '양말',
        '스타킹',
        '모자',
        '비니',
        '베레모',
        '스카프',
        '목도리',
        '슬리퍼',
        '운동화',
        '캔버스',
        '섬유',
        '원단',
        '직물',
        '편직',
        '실크',
        '울',
        'wool',
        '패브릭',
        'fabric',
      ],
    },
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
    { id: 'keratin', name: '생체분말', emoji: '🦴', keywords: ['뼈', 'bone', '비늘', 'scale', '발톱', '뿔', 'horn'] },
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

  // ─── 재료 강도 분류 ─────────────────────────────────────────
  // 서버 craftResolveMaterials.js의 smeltTierForProductId 와 동일 기준 유지
  const SMELT_LEGENDARY_IDS = new Set(['platinum', 'palladium', 'rhodium', 'iridium', 'uranium', 'diamond']);
  const SMELT_EPIC_IDS      = new Set(['titanium', 'tungsten', 'rareearth', 'neodymium', 'graphene', 'ruby', 'sapphire', 'emerald']);
  const SMELT_RARE_IDS      = new Set(['gold', 'silver', 'copper', 'iron', 'glass', 'circuit', 'battery']);

  function smeltTierFromId(id) {
    const sid = String(id || '').toLowerCase();
    if (SMELT_LEGENDARY_IDS.has(sid)) return 'legendary';
    if (SMELT_EPIC_IDS.has(sid))      return 'epic';
    if (SMELT_RARE_IDS.has(sid))      return 'rare';
    return 'common';
  }

  function strengthScoreFromTier(tier) {
    const t = String(tier || 'common').toLowerCase();
    if (t === 'legendary') return 4;
    if (t === 'epic')      return 3;
    if (t === 'rare')      return 2;
    return 1;
  }

  /**
   * 평균 강도 점수 → UI 레이블 + CSS 클래스
   * @param {number} avgStr 1.0~4.0
   */
  function strengthLabelUi(avgStr) {
    if (avgStr >= 3.5) return { label: '최강', cls: 'strength--legendary' };
    if (avgStr >= 2.5) return { label: '강함', cls: 'strength--strong' };
    if (avgStr >= 1.5) return { label: '보통', cls: 'strength--medium' };
    return { label: '약함', cls: 'strength--weak' };
  }

  /**
   * 선택된 smelt 재료들의 평균 강도 점수 계산
   * @param {object[]} sel — selected 배열 (isSmeltMaterial 필터링은 호출자가)
   * @returns {number}
   */
  function calcSelectedAvgStrength(sel) {
    const smeltOnly = sel.filter(isSmeltMaterial);
    if (smeltOnly.length === 0) return 1;
    let total = 0;
    for (const m of smeltOnly) {
      total += strengthScoreFromTier(m.rarity || smeltTierFromId(m.smeltId));
    }
    return total / smeltOnly.length;
  }

  /**
   * 클라이언트 측 성공률 계산 (서버 calcSuccessRate 와 동일 공식)
   */
  function clientSuccessRate(prof, avgStr) {
    const base = 0.65 + Math.sqrt(Math.max(0, prof)) * 0.06;
    const adj  = -(Math.max(1, Math.min(4, avgStr)) - 2) * 0.05;
    return Math.min(0.93, Math.max(0.20, base + adj));
  }

  /**
   * 숙련도 float → 스탯 배율 (서버 proficiencyMulFromValue 동일 공식)
   */
  function clientProfMul(prof) {
    return 1.0 + Math.log(1 + Math.max(0, prof)) * 0.30;
  }

  /**
   * 조합 다양성 → 조합 품질 레이블 (서버 harmonyLabel 동일 공식)
   */
  function clientHarmonyLabel(uniqueTierCount) {
    if (uniqueTierCount >= 4) return '최상 조합';
    if (uniqueTierCount >= 3) return '좋은 조합';
    if (uniqueTierCount >= 2) return '보통 조합';
    return '단조로운 조합';
  }

  /**
   * 클라이언트 측 craftHarmonyMul 계산 (서버 공식 동일)
   */
  function clientCraftHarmonyMul(sel) {
    const smeltOnly = sel.filter(isSmeltMaterial);
    if (!smeltOnly.length) return 0.40;
    const scores = smeltOnly.map((m) => strengthScoreFromTier(m.rarity || smeltTierFromId(m.smeltId)));
    const n = scores.length;
    const avg = scores.reduce((a, b) => a + b, 0) / n;
    const avgMul = 0.40 + (avg - 1.0) / 3.0 * 0.90;
    const uniqueTierCount = new Set(scores).size;
    const divBonus = (uniqueTierCount - 1) * 0.40;
    const variance = scores.reduce((a, s) => a + (s - avg) ** 2, 0) / n;
    const spreadBonus = Math.sqrt(variance) * 0.15;
    return Math.max(0.10, avgMul + divBonus + spreadBonus);
  }

  /** 선택된 재료의 고유 강도 등급 수 */
  function countUniqueStrengthTiers(sel) {
    const smeltOnly = sel.filter(isSmeltMaterial);
    const tiers = new Set(smeltOnly.map((m) => m.rarity || smeltTierFromId(m.smeltId)));
    return tiers.size;
  }

  // ─── 클라이언트 시너지 규칙 (서버 SYNERGY_RULES 와 동일) ────
  const CLIENT_SYNERGY_RULES = [
    // 금속 합금
    { id: 'steel',       name: '강철 합성',    requires: ['iron', 'carbon'],               bonusMul: 0.35 },
    { id: 'stainless',   name: '스테인리스',   requires: ['iron', 'chromium'],             bonusMul: 0.25 },
    { id: 'superalloy',  name: '초경합금',     requires: ['tungsten', 'cobalt'],           bonusMul: 0.40 },
    { id: 'lightweight', name: '경량초강도',   requires: ['titanium', 'graphene'],         bonusMul: 0.45 },
    { id: 'nicromel',    name: '니크롬합금',   requires: ['nickel', 'chromium'],           bonusMul: 0.28 },
    { id: 'bronze',      name: '청동 합성',    requires: ['copper', 'tin'],                bonusMul: 0.18 },
    { id: 'brass',       name: '황동 합성',    requires: ['copper', 'zinc'],               bonusMul: 0.18 },
    { id: 'noble',       name: '귀금속 융합',  requires: ['platinum', 'palladium'],        bonusMul: 0.40 },
    { id: 'mangsteel',   name: '망간강',       requires: ['iron', 'manganese'],            bonusMul: 0.22 },
    // 전자/에너지
    { id: 'electronic',  name: '전자 융합',    requires: ['circuit', 'battery'],           bonusMul: 0.28 },
    { id: 'energy',      name: '에너지 폭발',  requires: ['plasma', 'battery'],            bonusMul: 0.35 },
    { id: 'magneto',     name: '자기전자',     requires: ['neodymium', 'circuit'],         bonusMul: 0.32 },
    { id: 'nanoelec',    name: '나노전자',     requires: ['graphene', 'circuit'],          bonusMul: 0.42 },
    // 보석/탄소
    { id: 'ultrahard',   name: '초경도 결합',  requires: ['diamond', 'graphene'],          bonusMul: 0.50 },
    { id: 'gemforge',    name: '삼보석 융합',  requires: ['ruby', 'sapphire', 'emerald'],  bonusMul: 0.45 },
    { id: 'divtitan',    name: '신성합금',     requires: ['diamond', 'titanium'],          bonusMul: 0.55 },
    { id: 'carboniso',   name: '탄소동소체',   requires: ['carbon', 'graphene'],           bonusMul: 0.30 },
    // 화학/특수
    { id: 'inferno',     name: '초고온 단조',  requires: ['plasma', 'magma'],              bonusMul: 0.38 },
    { id: 'cryohard',    name: '냉각강화',     requires: ['cryo', 'glass'],                bonusMul: 0.28 },
    { id: 'ballistic',   name: '방탄섬유',     requires: ['kevlar', 'carbonfiber'],        bonusMul: 0.38 },
    { id: 'thermoshock', name: '냉온충격',     requires: ['plasma', 'cryo'],               bonusMul: 0.45 },
    { id: 'volcanic',    name: '화산냉각',     requires: ['magma', 'cryo'],                bonusMul: 0.35 },
    { id: 'quench',      name: '담금질',       requires: ['iron', 'cryo'],                 bonusMul: 0.25 },
    { id: 'bio',         name: '생체활성',     requires: ['protein', 'enzyme'],            bonusMul: 0.22 },
  ];

  /**
   * 현재 선택 재료에서 발동되는 시너지 목록 반환.
   * @param {object[]} sel — selected 배열
   * @returns {{ id, name, bonusMul }[]}
   */
  function detectClientSynergies(sel) {
    const smeltOnly = sel.filter(isSmeltMaterial);
    const ids = new Set(smeltOnly.map((m) => String(m.smeltId || '').toLowerCase()));
    return CLIENT_SYNERGY_RULES.filter((rule) =>
      rule.requires.every((r) => ids.has(r)),
    );
  }

  const MAX_SMELT_YIELDS_PER_ITEM = 3;

  /** 녹일 때 이름·설명 끄트머리에 붙은 원소 힌트만 신뢰 (전체 문장 키워드 남발·고철 보너스 방지) */
  function materialSmeltTextBlob(name, hintText) {
    const a = String(name || '').trim();
    const b = String(hintText || '').trim();
    if (a && b) return `${a}\n${b}`;
    return a || b;
  }

  function splitSmeltCompositionTokens(inner) {
    return String(inner || '')
      .split(/[,，、·+|｜/／]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function matchSmeltTokenToCatalogId(token) {
    const t0 = String(token || '').trim();
    if (!t0) return '';
    const t = t0.toLowerCase();
    if (/^[a-z0-9_-]+$/.test(t)) {
      const byId = SMELT_CATALOG.find((e) => String(e.id).toLowerCase() === t);
      if (byId) return byId.id;
    }
    let best = { id: '', score: 0 };
    for (const entry of SMELT_CATALOG) {
      const kws = Array.isArray(entry.keywords) ? entry.keywords : [];
      for (const kw of kws) {
        const k = String(kw || '').trim();
        if (!k) continue;
        const kl = k.toLowerCase();
        if (t === kl) {
          if (k.length > best.score) best = { id: entry.id, score: k.length };
          continue;
        }
        if (t.length >= 2 && k.length >= 2 && (t.includes(kl) || kl.includes(t))) {
          const sc = Math.min(t.length, k.length);
          if (sc > best.score) best = { id: entry.id, score: sc };
        }
      }
    }
    return best.id || '';
  }

  function dedupeSmeltIdsInOrder(ids) {
    const seen = new Set();
    const out = [];
    for (const id of ids) {
      const x = String(id || '').trim();
      if (!x || seen.has(x)) continue;
      seen.add(x);
      out.push(x);
      if (out.length >= MAX_SMELT_YIELDS_PER_ITEM) break;
    }
    return out;
  }

  /** 이름/설명 끝에 붙은 「원소: …」「#smelt: …」「（a,b）」 등 */
  function parseExplicitSmeltCompositionTail(blob) {
    const text = String(blob || '').trim();
    if (!text) return null;
    const mHash = text.match(/[#＃](?:smelt|원소)\s*[:：]\s*([\w\-가-힣,\s·+|｜/／]+)\s*$/i);
    if (mHash) {
      const ids = dedupeSmeltIdsInOrder(
        splitSmeltCompositionTokens(mHash[1]).map((tok) => matchSmeltTokenToCatalogId(tok)),
      );
      if (ids.length) return ids;
    }
    const mKo = text.match(
      /(?:원소|성분|기초\s*재료|분해\s*성분)\s*[:：]\s*([\w\-가-힣,\s·+|｜/／]+)\s*$/i,
    );
    if (mKo) {
      const ids = dedupeSmeltIdsInOrder(
        splitSmeltCompositionTokens(mKo[1]).map((tok) => matchSmeltTokenToCatalogId(tok)),
      );
      if (ids.length) return ids;
    }
    const mParen = text.match(/(?:（|\()([^)）]{1,120})(?:）|\))\s*$/);
    if (mParen && /[,，、·+]/.test(mParen[1])) {
      const ids = dedupeSmeltIdsInOrder(
        splitSmeltCompositionTokens(mParen[1]).map((tok) => matchSmeltTokenToCatalogId(tok)),
      );
      if (ids.length) return ids;
    }
    const mSq = text.match(/[〔【]([^〕】]{1,120})[〕】]\s*$/);
    if (mSq && /[,，、·+]/.test(mSq[1])) {
      const ids = dedupeSmeltIdsInOrder(
        splitSmeltCompositionTokens(mSq[1]).map((tok) => matchSmeltTokenToCatalogId(tok)),
      );
      if (ids.length) return ids;
    }
    return null;
  }

  /** 문자열 끝부분(꼬리)에만 걸린 키워드로 카탈로그 id 추론 (이름+설명 blob의 마지막 구간) */
  function inferSmeltProductsTailAnchored(fullBlob) {
    const n = String(fullBlob || '');
    const len = n.length;
    if (!len) return [];
    const tailChars = Math.min(80, Math.max(28, Math.floor(len * 0.45)));
    const idxMin = Math.max(0, len - tailChars);
    const cands = [];
    for (const entry of SMELT_CATALOG) {
      const kws = Array.isArray(entry.keywords) ? [...entry.keywords] : [];
      kws.sort((a, b) => String(b).length - String(a).length);
      let bestIdx = -1;
      for (const kw of kws) {
        const k = String(kw || '').trim();
        if (k.length < 1) continue;
        const idx = n.toLowerCase().lastIndexOf(k.toLowerCase());
        if (idx >= idxMin) bestIdx = bestIdx === -1 ? idx : Math.max(bestIdx, idx);
      }
      if (bestIdx >= 0) cands.push({ id: entry.id, idx: bestIdx });
    }
    cands.sort((a, b) => a.idx - b.idx || String(a.id).localeCompare(String(b.id)));
    return dedupeSmeltIdsInOrder(cands.map((c) => c.id));
  }

  function hashMaterialNameSmelt(s) {
    let h = 2166136261 >>> 0;
    const str = String(s || '');
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function inferSmeltProducts(materialName, hintText) {
    const n = String(materialName || '');
    const blob = materialSmeltTextBlob(n, hintText);

    const explicit = parseExplicitSmeltCompositionTail(blob);
    if (explicit && explicit.length > 0) return explicit;

    const tailIds = inferSmeltProductsTailAnchored(blob);
    if (tailIds.length > 0) return tailIds;

    const hits = [];
    for (let i = 0; i < SMELT_RULES.length; i += 1) {
      if (SMELT_RULES[i].test(n)) hits.push(SMELT_RULES[i].out.id);
    }
    const seen = new Set();
    const dedup = [];
    for (const id of hits) {
      if (seen.has(id)) continue;
      seen.add(id);
      dedup.push(id);
      if (dedup.length >= MAX_SMELT_YIELDS_PER_ITEM) break;
    }
    if (dedup.length === 0) return ['slag'];
    if (dedup.length === 1 && dedup[0] !== 'slag') {
      if (hashMaterialNameSmelt(n) % 5 === 0) return [dedup[0], 'slag'];
    }
    return dedup;
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

  /** 서버/로컬 공통: 기초 재료(용광로 재고) 맵 복사 (표시용 엔트리만) */
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

  function addSmeltCountToStock(stock, materialName, add, hintText) {
    const n = Math.floor(Number(add));
    if (!Number.isFinite(n) || n <= 0) return;
    const ids = inferSmeltProducts(materialName, hintText);
    for (const pid of ids) {
      const p = inferSmeltProductById(pid);
      const prev = stock[p.id];
      const c = prev && typeof prev.count === 'number' ? prev.count : 0;
      stock[p.id] = { id: p.id, name: p.name, emoji: p.emoji, count: c + n };
    }
  }

  function inferSmeltProductById(pid) {
    const id = String(pid || '').trim();
    const hit = SMELT_CATALOG.find((e) => e.id === id);
    if (hit) return { id: hit.id, name: hit.name, emoji: hit.emoji };
    if (id === 'slag') return { id: 'slag', name: '고철', emoji: '🔩' };
    return { id, name: id, emoji: '◆' };
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

  /** 로그인 시 서버 재고를 불러오고, 서버가 비어 있으면 로컬 기초 재료를 한 번 이관 */
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

  function setFurnaceMsg(msg) {
    if (furnaceMsgEl) furnaceMsgEl.textContent = msg || '';
  }

  let furnaceResultTimer = 0;
  function showSmeltResult(gains, lost) {
    if (!furnaceResultEl) return;
    if (furnaceResultTimer) { window.clearTimeout(furnaceResultTimer); furnaceResultTimer = 0; }
    furnaceResultEl.innerHTML = '';
    if (gains.length === 0 && lost.length === 0) {
      furnaceResultEl.classList.add('hidden');
      return;
    }
    const label = document.createElement('span');
    label.className = 'furnace-result-label';
    label.textContent = '녹인 결과';
    furnaceResultEl.appendChild(label);
    for (const g of gains) {
      const chip = document.createElement('span');
      chip.className = 'furnace-result-chip furnace-result-chip--gain';
      chip.textContent = `${g.emoji} ${g.name} +${g.count}`;
      furnaceResultEl.appendChild(chip);
    }
    for (const l of lost) {
      const chip = document.createElement('span');
      chip.className = 'furnace-result-chip furnace-result-chip--lost';
      chip.textContent = `${l.emoji || ''}${l.name} ×${l.count} 소실`;
      furnaceResultEl.appendChild(chip);
    }
    furnaceResultEl.classList.remove('hidden');
    furnaceResultTimer = window.setTimeout(() => {
      furnaceResultEl.classList.add('hidden');
      furnaceResultEl.innerHTML = '';
      furnaceResultTimer = 0;
    }, 6000);
  }

  function updateCoinDisplay() {
    if (!coinCountEl) return;
    coinCountEl.textContent = totalCoins.toLocaleString();
  }

  async function loadCoins() {
    if (!alpToken || !platformApi) return;
    try {
      const res = await fetch(`${platformApi}/api/coins`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (res.ok) {
        const d = await res.json();
        if (typeof d.coins === 'number') { totalCoins = d.coins; updateCoinDisplay(); }
      }
    } catch { /* 비치명 */ }
  }

  async function grantForgeBonus(elapsedMs) {
    if (!alpToken || !platformApi || elapsedMs <= 0) return 0;
    try {
      const res = await fetch(`${platformApi}/api/ai/fishing-scan-bonus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
        body: JSON.stringify({ scanElapsedMs: elapsedMs }),
      });
      if (!res.ok) return 0;
      const d = await res.json();
      const bonus = Math.max(0, Math.floor(Number(d.bonusCoins) || 0));
      if (typeof d.coins === 'number') { totalCoins = d.coins; updateCoinDisplay(); }
      return bonus;
    } catch { return 0; }
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
      smeltStockListEl.innerHTML = `<span class="smelt-pill smelt-pill--empty">${escapeHtml(catLabel)} 기초 재료 없음</span>`;
      return;
    }
    smeltStockListEl.innerHTML = '';
    filtered.forEach((entry) => {
      const pill = document.createElement('div');
      const sid = String(entry.id != null ? entry.id : '').trim();
      const stockQtyRaw = Math.floor(Number(entry.count));
      const stockQty = Number.isFinite(stockQtyRaw) && stockQtyRaw > 0 ? stockQtyRaw : 0;
      const onAnvil = countSelectedSmeltById(sid);
      const displayQty = Math.max(0, stockQty - onAnvil);
      const canAdd = displayQty > 0;
      const pillTier = smeltTierFromId(sid);
      const pillStrInfo = strengthLabelUi(strengthScoreFromTier(pillTier));
      pill.className = `smelt-pill smelt-pill--tier-${pillTier}${canAdd ? ' smelt-pill--draggable' : ' smelt-pill--disabled'}`;
      pill.setAttribute('role', 'listitem');
      pill.draggable = canAdd;
      // 이 재료가 포함된 시너지 규칙 힌트
      const synHints = CLIENT_SYNERGY_RULES
        .filter((rule) => rule.requires.includes(sid))
        .map((rule) => `⚡ ${rule.name} (${rule.requires.join(' + ')})`)
        .join('\n');
      pill.title = canAdd
        ? `[${pillStrInfo.label}] 남은 ${displayQty}개 · 모루로 끌어다 놓기 (모루에 ${onAnvil}개 올려 둠)${synHints ? '\n시너지:\n' + synHints : ''}`
        : `모루에 모두 올려 두었습니다. 「선택 비우기」로 돌려 받을 수 있어요.${synHints ? '\n시너지:\n' + synHints : ''}`;
      pill.innerHTML = `<span aria-hidden="true">${entry.emoji || '◆'}</span> ${escapeHtml(entry.name || '')} <span class="smelt-strength ${pillStrInfo.cls}">${pillStrInfo.label}</span> <strong>${displayQty}</strong>`;

      if (canAdd) {
        pill.addEventListener('dragstart', (ev) => {
          if (!ev.dataTransfer) return;
          ev.dataTransfer.setData(FORGE_DRAG_SMELT_UID, sid);
          ev.dataTransfer.setData('text/plain', `forge-smelt:${sid}`);
          ev.dataTransfer.effectAllowed = 'copyMove';
          pill.classList.add('smelt-pill--dragging');
        });
        pill.addEventListener('dragend', () => {
          pill.classList.remove('smelt-pill--dragging');
          clearForgeDnDHover();
        });

        pill.addEventListener(
          'touchstart',
          (ev) => {
            beginForgeTouchDrag(
              {
                kind: 'smelt',
                smeltSid: sid,
                label: `${entry.emoji || '◆'} ${entry.name != null ? String(entry.name) : ''}`.trim(),
                sourceEl: pill,
              },
              ev,
            );
          },
          { passive: true },
        );
      }

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
    // 장비가 있으면 소실 경고 + 산출물 미리보기
    const equipItems = furnaceSelected.filter((m) => isEquipmentMaterial(m));
    if (furnaceEquipWarnEl) furnaceEquipWarnEl.classList.toggle('hidden', equipItems.length === 0);
    if (furnacePreviewEl) {
      const catchItems = furnaceSelected.filter((m) => !isEquipmentMaterial(m));
      if (furnaceSelected.length === 0) {
        furnacePreviewEl.textContent = '';
      } else {
        const parts = [];
        for (const m of equipItems) {
          const mats = equipSourceMatsMap.get(String(m.equipmentId)) || [];
          for (const sm of mats.filter((x) => x.kind === 'smelt')) {
            const meta = smeltProductMeta(sm.id);
            parts.push(`${meta.emoji} ${meta.name}`);
          }
        }
        if (catchItems.length > 0) parts.push('?');
        furnacePreviewEl.textContent = parts.length > 0 ? `예상: ${parts.join(', ')}` : '🎲 무엇이 나올지 알 수 없어요';
      }
    }
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
        // 장비 녹임 소실 정보 저장
        if (Array.isArray(data.lost) && data.lost.length > 0) {
          serverMeltLost = data.lost;
        } else {
          serverMeltLost = [];
        }
      }

      for (let i = 0; i < localInfer.length; i += 1) {
        const mi = localInfer[i];
        const hint = [mi && mi.desc, mi && mi.description].filter(Boolean).join('\n');
        addSmeltCountToStock(stock, mi.name, 1, hint);
      }

      saveSmeltStock(stock);
      removeMaterialsAfterUse(toMelt);
      furnaceSelected = furnaceSelected.filter((m) => !toMelt.some((u) => u.uid === m.uid));
      refreshMaterials();
      syncFurnaceUi();
      syncForgeUi();
      const gains = getSmeltGainSummary(beforeStock, stock);
      showSmeltResult(gains, serverMeltLost);
      setFurnaceMsg(`${toMelt.length}개를 녹였습니다.`);
      serverMeltLost = [];
      renderSmeltStock();
      void refreshCraftedList();
      window.setTimeout(() => setFurnaceMsg(''), 3000);
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

  function hideForgeOverlayScanBonus() {
    forgeScanBonusToastShown = false;
    if (!forgeOverlayBonusEl) return;
    forgeOverlayBonusEl.classList.add('forge-overlay-bonus--hidden');
    forgeOverlayBonusEl.textContent = '';
  }

  function showForgeCoinBonus(bonusCoins) {
    if (!forgeOverlayBonusEl || bonusCoins <= 0) return;
    // 첫 조합 축하 메시지 아래에 코인 정보를 추가
    const prev = forgeOverlayBonusEl.textContent || '';
    const coinLine = `🪙 +${bonusCoins.toLocaleString()} 코인 적립!`;
    forgeOverlayBonusEl.textContent = prev.includes('조합') ? `${prev}  ${coinLine}` : coinLine;
    forgeOverlayBonusEl.classList.remove('forge-overlay-bonus--hidden');
  }

  /** 경과 초 → 예상 코인 (서버와 동일 공식: 20초당 100코인, 최대 900) */
  function calcForgeExpectedCoins(elapsedSec) {
    return Math.min(900, Math.round((Math.min(elapsedSec, 180) / 20) * 100));
  }

  function updateForgeOverlayBonusEstimate(elapsedSec) {
    if (!forgeOverlayBonusEl) return;
    const coins = calcForgeExpectedCoins(elapsedSec);
    forgeOverlayBonusEl.textContent = `🪙 제련 보상 예상: +${coins} 코인`;
    forgeOverlayBonusEl.classList.remove('forge-overlay-bonus--hidden');
  }

  /** 20→0초 예상, 이후 예상시간 N초 초과로 증가 + 실시간 보상 예상 */
  function startForgeOverlayTimer() {
    stopForgeOverlayTimer();
    hideForgeOverlayScanBonus();
    if (!forgeOverlayTimerEl) return;
    let countdown = 20;
    let totalElapsed = 0;
    forgeOverlayTimerEl.textContent = `예상 시간 약 ${countdown}초`;
    updateForgeOverlayBonusEstimate(totalElapsed);
    forgeOverlayCountdownId = window.setInterval(() => {
      totalElapsed += 1;
      countdown -= 1;
      if (countdown >= 0) {
        forgeOverlayTimerEl.textContent = `예상 시간 약 ${countdown}초`;
      } else {
        const exceed = -countdown;
        forgeOverlayTimerEl.textContent = `예상시간 ${exceed}초 초과`;
      }
      updateForgeOverlayBonusEstimate(totalElapsed);
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
      if (forgeOverlayTitleEl) forgeOverlayTitleEl.textContent = '대장간에서 제작 중…';
      if (forgeDiscoveryBannerEl) {
        forgeDiscoveryBannerEl.textContent = '';
        forgeDiscoveryBannerEl.classList.add('forge-discovery-banner--hidden');
      }
      startForgeOverlayTimer();
    } else {
      stopForgeOverlayTimer();
      hideForgeOverlayScanBonus();
    }
    forgeOverlayEl.classList.toggle('forge-overlay--hidden', !visible);
    forgeOverlayEl.setAttribute('aria-hidden', visible ? 'false' : 'true');
    document.documentElement.classList.toggle('forge-scroll-lock', !!visible);
    document.body.classList.toggle('forge-scroll-lock', !!visible);
  }

  function isEquipmentMaterial(m) {
    return Boolean(m && (m.kind === 'equipment' || m.equipmentId != null));
  }

  function catchItemTypeLower(m) {
    if (!m || isEquipmentMaterial(m)) return '';
    return String(m.itemType != null ? m.itemType : m.type || '')
      .trim()
      .toLowerCase();
  }

  /** 낚시 재료를 보관함 필터 탭으로 분류 (장비 제외). */
  function materialDockBucketForCatch(m) {
    const t = catchItemTypeLower(m);
    if (MAT_DOCK_SOUL_TYPES.has(t)) return 'soul';
    if (MAT_DOCK_MATERIAL_TYPES.has(t)) return 'material';
    if (!t) return 'material';
    return 'material';
  }

  function materialMatchesDockFilter(m, filter) {
    if (!m) return false;
    if (filter === 'all') return true;
    if (filter === 'equipment') return isEquipmentMaterial(m);
    if (isEquipmentMaterial(m)) return false;
    const b = materialDockBucketForCatch(m);
    if (filter === 'material') return b === 'material';
    if (filter === 'soul') return b === 'soul';
    return true;
  }

  function materialDetailKindLabel(m) {
    if (!m) return '';
    if (isEquipmentMaterial(m)) return '제작 장비(서버 보관함)';
    const t = catchItemTypeLower(m);
    if (MAT_DOCK_SOUL_TYPES.has(t)) return '낚시 — 영혼·우주·특수형';
    if (MAT_DOCK_MATERIAL_TYPES.has(t)) return '낚시 — 잔해·폐품형';
    if (t) return `낚시 — 유형: ${t}`;
    return '낚시 재료';
  }

  function renderMaterialDockFilterUi() {
    if (!materialDockFiltersEl) return;
    materialDockFiltersEl.querySelectorAll('.material-dock-filter').forEach((btn) => {
      const f = btn.getAttribute('data-filter') || 'all';
      btn.classList.toggle('is-active', f === materialDockFilter);
    });
  }

  function isSmeltMaterial(m) {
    return Boolean(m && m.kind === 'smelt' && m.smeltId != null && String(m.smeltId).trim() !== '');
  }

  /** true면 제련 버튼 비활성: 선택 수량이 최소 미만이거나 smelt 아닌 재료가 있을 때. */
  function isForgeBlockedSmeltOnlyMinCount(sel) {
    if (!Array.isArray(sel) || sel.length === 0) return true;
    if (sel.length < MIN_SMELT_MATERIALS_FOR_FORGE) return true;
    return sel.some((m) => !isSmeltMaterial(m));
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
      rarity: smeltTierFromId(sid),
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

  function tryAddSmeltToAnvilBySid(sidRaw) {
    const sid = String(sidRaw || '').trim();
    if (!sid) return false;
    const latestStock = cloneSmeltStock(loadSmeltStock());
    const latest = latestStock[sid];
    const maxCount = latest && typeof latest.count === 'number' ? latest.count : 0;
    const inSelected = countSelectedSmeltById(sid);
    if (inSelected >= maxCount) {
      if (statusMsgEl) statusMsgEl.textContent = '해당 기초 재료는 보유 수량만큼만 모루에 올릴 수 있어요.';
      syncForgeUi();
      return true;
    }
    selected.push(makeSmeltSelectionMaterial(latest || { id: sid, name: sid, emoji: '◆' }));
    syncForgeUi();
    return true;
  }

  function readSmeltDragSid(dt) {
    if (!dt) return '';
    try {
      const a = dt.getData(FORGE_DRAG_SMELT_UID);
      if (a) return String(a).trim();
      const b = dt.getData('text/plain');
      if (b && String(b).startsWith('forge-smelt:')) return String(b).slice('forge-smelt:'.length).trim();
    } catch {
      /* ignore */
    }
    return '';
  }

  function tryAddSmeltToAnvilFromDataTransfer(dt) {
    const sid = readSmeltDragSid(dt);
    if (!sid) return false;
    return tryAddSmeltToAnvilBySid(sid);
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
          itemType: c.itemType != null ? String(c.itemType).toLowerCase().trim() : '',
          size: c.size != null ? c.size : null,
          coins: c.coinValue != null ? c.coinValue : 0,
          serverId: String(c.id).trim(),
          pixelArt: c.pixelArt || null,
        }));

      // 서버 항목으로 덮어쓰되, 서버 id가 없는 로컬 임시 항목은 유지
      const current = loadMaterials();
      const localOnly = current.filter((x) => x && (!x.serverId || String(x.serverId).trim() === ''));
      const merged = serverItems.concat(localOnly);
      const seenCatch = new Set();
      const seenEquip = new Set();
      const items = [];
      for (const it of merged) {
        if (!it) continue;
        if (it.equipmentId != null && String(it.equipmentId).trim() !== '') {
          const k = `e:${String(it.equipmentId).trim()}`;
          if (seenEquip.has(k)) continue;
          seenEquip.add(k);
          items.push(it);
          continue;
        }
        if (it.serverId != null && String(it.serverId).trim() !== '') {
          const k = `c:${String(it.serverId).trim()}`;
          if (seenCatch.has(k)) continue;
          seenCatch.add(k);
          items.push(it);
          continue;
        }
        items.push(it);
      }
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

  function forgeDockDragPayloadPresent(dt) {
    if (!dt || !dt.types) return false;
    const types = Array.from(dt.types);
    return types.includes(FORGE_DRAG_MATERIAL_UID) || types.includes(FORGE_DRAG_SMELT_UID) || types.includes('text/plain');
  }

  function readMaterialDragUid(dt) {
    if (!dt) return '';
    try {
      const a = dt.getData(FORGE_DRAG_MATERIAL_UID);
      if (a) return String(a).trim();
      const b = dt.getData('text/plain');
      if (!b) return '';
      const s = String(b).trim();
      if (s.startsWith('forge-smelt:')) return '';
      return s;
    } catch {
      return '';
    }
  }

  function findMaterialByUid(uid) {
    const u = String(uid || '').trim();
    if (!u) return null;
    return materials.find((m) => m && m.uid === u) || null;
  }

  function appendMaterialDetailRow(dl, label, valueText) {
    if (!dl) return;
    const v = valueText != null ? String(valueText).trim() : '';
    if (!v) return;
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = v.length > 480 ? `${v.slice(0, 478)}…` : v;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function formatEquipmentStatsSummary(st) {
    if (!st || typeof st !== 'object') return '';
    const parts = [];
    if (typeof st.attackBonus === 'number' && Number.isFinite(st.attackBonus)) {
      parts.push(`공격 +${st.attackBonus}`);
    }
    if (typeof st.defenseBonus === 'number' && Number.isFinite(st.defenseBonus)) {
      parts.push(`방어 +${st.defenseBonus}`);
    }
    if (st.speedBonus != null && Number.isFinite(Number(st.speedBonus))) {
      parts.push(`스피드 +${(Number(st.speedBonus) * 100).toFixed(1)}%`);
    }
    if (st.durabilityMax != null && Number.isFinite(Number(st.durabilityMax))) {
      const max = Number(st.durabilityMax);
      const cur = st.durability != null && Number.isFinite(Number(st.durability)) ? Number(st.durability) : max;
      parts.push(`내구 ${cur}/${max}`);
    }
    return parts.join(' · ');
  }

  function appendEquipmentStatsDetail(dl, stats) {
    if (!dl) return;
    const st = stats && typeof stats === 'object' ? stats : null;
    const line = formatEquipmentStatsSummary(st);
    if (line) {
      appendMaterialDetailRow(dl, '능력치', line);
      return;
    }
    if (st) {
      appendMaterialDetailRow(dl, '능력치', '등록된 보너스·내구 수치가 없습니다.');
    } else {
      appendMaterialDetailRow(dl, '능력치', '목록을 다시 불러오면 표시됩니다. (능력치 데이터 없음)');
    }
  }

  function closeMaterialDetailModal() {
    if (!materialDetailModalEl) return;
    materialDetailModalEl.classList.add('material-detail-modal--hidden');
    materialDetailModalEl.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('material-detail-open');
    document.body.classList.remove('material-detail-open');
  }

  function smeltProductMeta(id) {
    const entry = SMELT_CATALOG.find((e) => e.id === id);
    if (entry) return entry;
    const extras = {
      slag:  { id: 'slag',  name: '고철',     emoji: '🔩' },
      alloy: { id: 'alloy', name: '합금괴',    emoji: '🔧' },
      ash:   { id: 'ash',   name: '재',        emoji: '🌫️' },
    };
    return extras[id] || { id, name: id, emoji: '🔩' };
  }

  function openCraftedEquipmentDetail(item, sourceMats) {
    if (!materialDetailModalEl || !materialDetailTitleEl || !materialDetailRarityEl || !materialDetailDlEl || !materialDetailThumbEl) return;
    const nameStr = item.name || item.displayName || '장비';
    materialDetailTitleEl.textContent = nameStr;
    const tier = rarityClass(item.tier || item.rarity || 'common');
    materialDetailRarityEl.textContent = tierLabel(tier);
    materialDetailRarityEl.className = `material-detail-rarity rarity-${tier}`;
    mountForgeThumbOrImage(materialDetailThumbEl, item.pixelArt || item.pixel_art, item.emoji || matEmoji(nameStr), 88, 88);
    materialDetailDlEl.innerHTML = '';

    const smeltMats = (sourceMats || []).filter((m) => m.kind === 'smelt');
    const catchMats = (sourceMats || []).filter((m) => m.kind === 'catch');
    if (smeltMats.length > 0) {
      const names = smeltMats.map((m) => {
        const meta = smeltProductMeta(m.id);
        return `${meta.emoji} ${meta.name}`;
      }).join(', ');
      appendMaterialDetailRow(materialDetailDlEl, '기초 재료', names);
    }
    if (catchMats.length > 0) {
      appendMaterialDetailRow(materialDetailDlEl, '낚시 재료', `${catchMats.length}종`);
    }
    if (smeltMats.length === 0 && catchMats.length === 0) {
      appendMaterialDetailRow(materialDetailDlEl, '재료 정보', '기록 없음');
    }
    const desc = (item.description != null && String(item.description).trim()) || (item.desc != null && String(item.desc).trim()) || '';
    if (desc) appendMaterialDetailRow(materialDetailDlEl, '설명', desc);

    if (materialDetailHintEl) materialDetailHintEl.textContent = '이 장비를 만들 때 사용된 재료 목록입니다.';
    materialDetailModalEl.classList.remove('material-detail-modal--hidden');
    materialDetailModalEl.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('material-detail-open');
    document.body.classList.add('material-detail-open');
    if (materialDetailCloseBtn) window.requestAnimationFrame(() => materialDetailCloseBtn.focus());
  }

  function openMaterialDetailModal(m) {
    if (!m || !materialDetailModalEl || !materialDetailThumbEl || !materialDetailTitleEl || !materialDetailRarityEl || !materialDetailDlEl) return;
    materialDetailTitleEl.textContent = m.name != null ? String(m.name) : '이름 없음';
    const tier = rarityClass(m.rarity);
    materialDetailRarityEl.textContent = tierLabel(tier);
    materialDetailRarityEl.className = `material-detail-rarity rarity-${tier}`;
    mountForgeThumbOrImage(materialDetailThumbEl, m.pixelArt, matEmoji(String(m.name || '')), 88, 88);
    materialDetailDlEl.innerHTML = '';
    if (isEquipmentMaterial(m)) {
      appendMaterialDetailRow(materialDetailDlEl, '분류', materialDetailKindLabel(m));
      appendEquipmentStatsDetail(materialDetailDlEl, m.stats);
      appendMaterialDetailRow(materialDetailDlEl, '장비 ID', m.equipmentId);
      const srcMats = equipSourceMatsMap.get(String(m.equipmentId)) || [];
      const smeltMats = srcMats.filter((x) => x.kind === 'smelt');
      const catchMats = srcMats.filter((x) => x.kind === 'catch');
      if (smeltMats.length > 0) {
        const names = smeltMats.map((x) => { const meta = smeltProductMeta(x.id); return `${meta.emoji} ${meta.name}`; }).join(', ');
        appendMaterialDetailRow(materialDetailDlEl, '기초 재료', names);
      }
      if (catchMats.length > 0) appendMaterialDetailRow(materialDetailDlEl, '낚시 재료', `${catchMats.length}종`);
    } else {
      appendMaterialDetailRow(materialDetailDlEl, '분류', materialDetailKindLabel(m));
      appendMaterialDetailRow(materialDetailDlEl, '인벤토리 ID', m.serverId);
      const it = catchItemTypeLower(m);
      if (it) appendMaterialDetailRow(materialDetailDlEl, '유형 코드', it);
      if (m.size != null && String(m.size).trim() !== '') {
        appendMaterialDetailRow(materialDetailDlEl, '크기·길이', String(m.size).trim());
      }
      if (m.coins != null && Number(m.coins) > 0) {
        appendMaterialDetailRow(materialDetailDlEl, '코인 가치', String(m.coins));
      }
    }
    const desc =
      (m.description != null && String(m.description).trim()) ||
      (m.desc != null && String(m.desc).trim()) ||
      '';
    if (desc) appendMaterialDetailRow(materialDetailDlEl, '설명', desc);
    if (materialDetailHintEl) materialDetailHintEl.innerHTML = '끌어서 <strong>용광로</strong>에 녹이세요. 산출물이 되면 모루에서 장비를 만들 수 있어요.';
    materialDetailModalEl.classList.remove('material-detail-modal--hidden');
    materialDetailModalEl.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('material-detail-open');
    document.body.classList.add('material-detail-open');
    if (materialDetailCloseBtn) window.requestAnimationFrame(() => materialDetailCloseBtn.focus());
  }

  function applyMaterialToFurnaceByUid(uid) {
    const m = findMaterialByUid(uid);
    if (!m) return;
    const fi = furnaceSelected.findIndex((s) => s.uid === uid);
    if (fi >= 0) furnaceSelected.splice(fi, 1);
    else {
      const ai = selected.findIndex((s) => s.uid === uid);
      if (ai >= 0) selected.splice(ai, 1);
      furnaceSelected.push(m);
    }
    syncFurnaceUi();
    syncForgeUi();
  }

  function applyMaterialToAnvilByUid(uid) {
    const m = findMaterialByUid(uid);
    if (!m) return;
    // 모루는 기초 재료(산출물)만 허용
    if (!isSmeltMaterial(m)) {
      if (statusMsgEl) {
        statusMsgEl.textContent = '낚시 재료·장비는 먼저 용광로에서 녹여야 해요. 재료를 용광로로 이동시켜 드릴게요.';
      }
      applyMaterialToFurnaceByUid(uid);
      return;
    }
    const fi = furnaceSelected.findIndex((s) => s.uid === uid);
    if (fi >= 0) furnaceSelected.splice(fi, 1);
    const i = selected.findIndex((s) => s.uid === uid);
    if (i >= 0) selected.splice(i, 1);
    else selected.push(m);
    syncForgeUi();
    syncFurnaceUi();
  }

  function clearForgeDnDHover() {
    if (furnacePanelEl) furnacePanelEl.classList.remove('forge-drop-hover');
    if (anvilPanelEl) anvilPanelEl.classList.remove('forge-drop-hover');
  }

  /** 모바일: 손가락을 따라다니는 드래그 미리보기 + 드롭 하이라이트 */
  const FORGE_TOUCH_DRAG_SLOP = 14;
  /** 짧은 탭으로 상세 모달 열기 (드래그와 구분) */
  const FORGE_MATERIAL_DETAIL_TAP_MAX_DIST = 28;
  /** 손가락을 잠깐 누른 뒤에만 잡기(드래그 모드) — 움직여서 용광로·모루 위로 가도 자동 잡기 없음 */
  const FORGE_LONG_PRESS_MS = 300;
  /** 롱프레스 취소: 이 거리 이상 움직이면 “누르기” 없이 스크롤·탭으로 처리 */
  const FORGE_LONG_PRESS_CANCEL_MOVE = 12;
  let touchDragSession = null;
  let touchDragGhostEl = null;

  function getOrCreateForgeTouchDragGhost() {
    if (touchDragGhostEl) return touchDragGhostEl;
    touchDragGhostEl = document.createElement('div');
    touchDragGhostEl.className = 'forge-touch-drag-ghost forge-touch-drag-ghost--hidden';
    touchDragGhostEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(touchDragGhostEl);
    return touchDragGhostEl;
  }

  function showForgeTouchDragGhost(text, kind) {
    const g = getOrCreateForgeTouchDragGhost();
    const raw = String(text || '').trim();
    g.textContent = raw.length > 42 ? `${raw.slice(0, 40)}…` : raw;
    g.classList.remove(
      'forge-touch-drag-ghost--hidden',
      'forge-touch-drag-ghost--smelt',
      'forge-touch-drag-ghost--material',
    );
    g.classList.add(kind === 'smelt' ? 'forge-touch-drag-ghost--smelt' : 'forge-touch-drag-ghost--material');
  }

  function positionForgeTouchDragGhost(clientX, clientY) {
    const g = touchDragGhostEl;
    if (!g) return;
    g.style.left = `${clientX}px`;
    g.style.top = `${clientY}px`;
  }

  function hideForgeTouchDragGhost() {
    if (!touchDragGhostEl) return;
    touchDragGhostEl.classList.add('forge-touch-drag-ghost--hidden');
    touchDragGhostEl.classList.remove('forge-touch-drag-ghost--smelt', 'forge-touch-drag-ghost--material');
    touchDragGhostEl.textContent = '';
  }

  function forgeDropPanelAtPoint(clientX, clientY, smeltOnlyDrag) {
    let stack;
    try {
      stack = document.elementsFromPoint(clientX, clientY);
    } catch {
      return null;
    }
    if (!stack || stack.length === 0) return null;
    for (let i = 0; i < stack.length; i += 1) {
      const el = stack[i];
      if (anvilPanelEl && anvilPanelEl.contains(el)) return 'anvil';
      if (!smeltOnlyDrag && furnacePanelEl && furnacePanelEl.contains(el)) return 'furnace';
    }
    return null;
  }

  function setForgeTouchDropHover(panel) {
    clearForgeDnDHover();
    if (panel === 'furnace' && furnacePanelEl) furnacePanelEl.classList.add('forge-drop-hover');
    else if (panel === 'anvil' && anvilPanelEl) anvilPanelEl.classList.add('forge-drop-hover');
  }

  function removeForgeTouchDocumentListeners() {
    document.removeEventListener('touchmove', onForgeTouchProbeMove, { capture: true });
    document.removeEventListener('touchend', onForgeTouchProbeEnd, { capture: true });
    document.removeEventListener('touchcancel', onForgeTouchProbeEnd, { capture: true });
    document.removeEventListener('touchmove', onForgeTouchDragMove, { capture: true });
    document.removeEventListener('touchend', onForgeTouchDragEnd, { capture: true });
    document.removeEventListener('touchcancel', onForgeTouchDragEnd, { capture: true });
  }

  function clearForgeTouchLongPressTimer(s) {
    if (!s || !s.longPressTimerId) return;
    window.clearTimeout(s.longPressTimerId);
    s.longPressTimerId = 0;
  }

  function commitProbeToForgeDrag() {
    const s = touchDragSession;
    if (!s || s.phase !== 'probe') return;
    clearForgeTouchLongPressTimer(s);
    document.removeEventListener('touchmove', onForgeTouchProbeMove, { capture: true });
    document.removeEventListener('touchend', onForgeTouchProbeEnd, { capture: true });
    document.removeEventListener('touchcancel', onForgeTouchProbeEnd, { capture: true });
    s.phase = 'drag';
    if (s.sourceEl) {
      s._restoreTouchAction = s.sourceEl.style.touchAction;
      s.sourceEl.style.touchAction = 'none';
    }
    s.dragging = true;
    document.documentElement.classList.add('forge-touch-drag-active');
    showForgeTouchDragGhost(s.label, s.kind);
    if (s.sourceEl) {
      if (s.kind === 'smelt') s.sourceEl.classList.add('smelt-pill--dragging');
      else s.sourceEl.classList.add('inv-item--dragging');
    }
    const lt = s.lastTouch;
    positionForgeTouchDragGhost(lt.clientX, lt.clientY);
    const panel = forgeDropPanelAtPoint(lt.clientX, lt.clientY, s.kind === 'smelt');
    setForgeTouchDropHover(panel);
    document.addEventListener('touchmove', onForgeTouchDragMove, { capture: true, passive: false });
    document.addEventListener('touchend', onForgeTouchDragEnd, { capture: true, passive: false });
    document.addEventListener('touchcancel', onForgeTouchDragEnd, { capture: true });
  }

  function onForgeTouchProbeMove(ev) {
    if (!touchDragSession || touchDragSession.phase !== 'probe' || ev.touches.length !== 1) return;
    const t = ev.touches[0];
    touchDragSession.lastTouch = { clientX: t.clientX, clientY: t.clientY };
    const dx = t.clientX - touchDragSession.x0;
    const dy = t.clientY - touchDragSession.y0;
    const dist = Math.hypot(dx, dy);
    if (dist > FORGE_LONG_PRESS_CANCEL_MOVE) {
      clearForgeTouchLongPressTimer(touchDragSession);
    }
  }

  function onForgeTouchProbeEnd(ev) {
    if (!touchDragSession || touchDragSession.phase !== 'probe') return;
    const t = ev.changedTouches && ev.changedTouches[0];
    if (t) touchDragSession.lastTouch = { clientX: t.clientX, clientY: t.clientY };
    const opened = finalizeForgeTouchDrag(ev.type === 'touchend');
    if (opened && ev.cancelable) {
      ev.preventDefault();
    }
  }

  function finalizeForgeTouchDrag(applyDrop) {
    const s = touchDragSession;
    if (!s) return false;
    let openedMaterialDetailFromTap = false;
    clearForgeTouchLongPressTimer(s);
    removeForgeTouchDocumentListeners();
    if (s.sourceEl) {
      if ('_restoreTouchAction' in s) {
        s.sourceEl.style.touchAction = s._restoreTouchAction;
        delete s._restoreTouchAction;
      }
      s.sourceEl.classList.remove('smelt-pill--dragging', 'inv-item--dragging');
    }
    hideForgeTouchDragGhost();
    clearForgeDnDHover();
    document.documentElement.classList.remove('forge-touch-drag-active');
    if (applyDrop && s.dragging && s.lastTouch) {
      const { clientX, clientY } = s.lastTouch;
      const panel = forgeDropPanelAtPoint(clientX, clientY, s.kind === 'smelt');
      if (s.kind === 'smelt') {
        if (panel === 'anvil' && s.smeltSid) tryAddSmeltToAnvilBySid(s.smeltSid);
        else if (panel === 'furnace' && statusMsgEl) {
          statusMsgEl.textContent = '기초 재료는 모루로만 끌어다 놓을 수 있어요.';
        }
      } else if (s.kind === 'material' && s.uid) {
        if (panel === 'furnace') applyMaterialToFurnaceByUid(s.uid);
        else if (panel === 'anvil') {
          // applyMaterialToAnvilByUid 내부에서 비-smelt 검사 후 용광로로 리다이렉트
          applyMaterialToAnvilByUid(s.uid);
        }
      }
    } else if (
      applyDrop &&
      !s.dragging &&
      s.kind === 'material' &&
      s.uid &&
      s.lastTouch &&
      Math.hypot(s.lastTouch.clientX - s.x0, s.lastTouch.clientY - s.y0) <= FORGE_MATERIAL_DETAIL_TAP_MAX_DIST
    ) {
      const mm = findMaterialByUid(s.uid);
      if (mm) {
        openMaterialDetailModal(mm);
        const suppressUntil = Date.now() + 500;
        materialDetailBackdropIgnoreUntil = suppressUntil;
        materialDetailSyntheticClickSuppressUntil = suppressUntil;
        openedMaterialDetailFromTap = true;
      }
    }
    touchDragSession = null;
    return openedMaterialDetailFromTap;
  }

  function onForgeTouchDragMove(ev) {
    if (!touchDragSession || touchDragSession.phase !== 'drag' || ev.touches.length !== 1) return;
    const t = ev.touches[0];
    touchDragSession.lastTouch = { clientX: t.clientX, clientY: t.clientY };
    const dist = Math.hypot(t.clientX - touchDragSession.x0, t.clientY - touchDragSession.y0);
    if (!touchDragSession.dragging) {
      if (dist <= FORGE_TOUCH_DRAG_SLOP) return;
      touchDragSession.dragging = true;
      document.documentElement.classList.add('forge-touch-drag-active');
      showForgeTouchDragGhost(touchDragSession.label, touchDragSession.kind);
      if (touchDragSession.sourceEl) {
        if (touchDragSession.kind === 'smelt') touchDragSession.sourceEl.classList.add('smelt-pill--dragging');
        else touchDragSession.sourceEl.classList.add('inv-item--dragging');
      }
    }
    if (ev.cancelable) {
      ev.preventDefault();
    }
    positionForgeTouchDragGhost(t.clientX, t.clientY);
    const panel = forgeDropPanelAtPoint(t.clientX, t.clientY, touchDragSession.kind === 'smelt');
    setForgeTouchDropHover(panel);
  }

  function onForgeTouchDragEnd(ev) {
    if (!touchDragSession || touchDragSession.phase !== 'drag') return;
    const t = ev.changedTouches && ev.changedTouches[0];
    if (t) touchDragSession.lastTouch = { clientX: t.clientX, clientY: t.clientY };
    const openedDetail = finalizeForgeTouchDrag(ev.type === 'touchend');
    if (openedDetail && ev.cancelable) {
      ev.preventDefault();
    }
  }

  function beginForgeTouchDrag(spec, ev) {
    if (touchDragSession) return;
    if (!ev.touches || ev.touches.length !== 1) return;
    const t = ev.touches[0];
    touchDragSession = {
      kind: spec.kind,
      uid: spec.uid,
      smeltSid: spec.smeltSid,
      label: spec.label || '',
      sourceEl: spec.sourceEl || null,
      x0: t.clientX,
      y0: t.clientY,
      dragging: false,
      phase: 'probe',
      longPressTimerId: 0,
      lastTouch: { clientX: t.clientX, clientY: t.clientY },
    };
    touchDragSession.longPressTimerId = window.setTimeout(() => {
      if (!touchDragSession || touchDragSession.phase !== 'probe') return;
      touchDragSession.longPressTimerId = 0;
      commitProbeToForgeDrag();
    }, FORGE_LONG_PRESS_MS);
    document.addEventListener('touchmove', onForgeTouchProbeMove, { capture: true, passive: true });
    document.addEventListener('touchend', onForgeTouchProbeEnd, { capture: true, passive: false });
    document.addEventListener('touchcancel', onForgeTouchProbeEnd, { capture: true });
  }

  let forgeMaterialDropZonesWired = false;
  function wireForgeMaterialDropZones() {
    if (forgeMaterialDropZonesWired || !furnacePanelEl || !anvilPanelEl) return;
    forgeMaterialDropZonesWired = true;
    const bindPanel = (panel, kind) => {
      panel.addEventListener('dragenter', (e) => {
        if (!forgeDockDragPayloadPresent(e.dataTransfer)) return;
        e.preventDefault();
        panel.classList.add('forge-drop-hover');
      });
      panel.addEventListener('dragover', (e) => {
        if (!forgeDockDragPayloadPresent(e.dataTransfer)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        panel.classList.add('forge-drop-hover');
      });
      panel.addEventListener('dragleave', (e) => {
        const rt = e.relatedTarget;
        if (rt == null || !panel.contains(rt)) panel.classList.remove('forge-drop-hover');
      });
      panel.addEventListener('drop', (e) => {
        e.preventDefault();
        clearForgeDnDHover();
        if (kind === 'furnace') {
          if (readSmeltDragSid(e.dataTransfer)) {
            if (statusMsgEl) statusMsgEl.textContent = '기초 재료는 모루로만 끌어다 놓을 수 있어요.';
            return;
          }
          const uid = readMaterialDragUid(e.dataTransfer);
          if (uid) applyMaterialToFurnaceByUid(uid);
        } else {
          if (tryAddSmeltToAnvilFromDataTransfer(e.dataTransfer)) return;
          const uid = readMaterialDragUid(e.dataTransfer);
          if (uid) applyMaterialToAnvilByUid(uid);
        }
      });
    };
    bindPanel(furnacePanelEl, 'furnace');
    bindPanel(anvilPanelEl, 'anvil');
    document.addEventListener('dragend', clearForgeDnDHover, true);
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
    const visible = materials.filter((m) => materialMatchesDockFilter(m, materialDockFilter));
    if (matCountBadge) {
      matCountBadge.textContent =
        materialDockFilter === 'all' || materials.length === 0
          ? String(materials.length)
          : `${visible.length}/${materials.length}`;
    }

    if (materials.length === 0) {
      materialListEl.innerHTML =
        '<p class="log-empty">재료가 없습니다. 낚시로 재료를 모은 뒤 새로고침 하세요.</p>';
      renderMaterialDockFilterUi();
      syncScrollOverflow();
      return;
    }

    if (visible.length === 0) {
      materialListEl.innerHTML =
        '<p class="log-empty">이 탭에 해당하는 항목이 없습니다. 다른 필터를 선택해 보세요.</p>';
      renderMaterialDockFilterUi();
      syncScrollOverflow();
      return;
    }

    materialListEl.innerHTML = '';
    visible.forEach((m) => {
      const row = document.createElement('div');
      row.className = `inv-item inv-item--draggable rarity-${rarityClass(m.rarity)}${isEquipmentMaterial(m) ? ' inv-item--equipment' : ''}`;
      row.dataset.uid = m.uid;
      row.draggable = true;
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

      let suppressMaterialRowClick = false;
      row.title = '눌러 정보 보기 · 끌어 용광로로 이동 (녹인 산출물로 모루에서 제련)';

      row.addEventListener('dragstart', (e) => {
        suppressMaterialRowClick = true;
        if (!e.dataTransfer) return;
        e.dataTransfer.setData(FORGE_DRAG_MATERIAL_UID, m.uid);
        e.dataTransfer.setData('text/plain', m.uid);
        e.dataTransfer.effectAllowed = 'copyMove';
        row.classList.add('inv-item--dragging');
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('inv-item--dragging');
        clearForgeDnDHover();
        window.setTimeout(() => {
          suppressMaterialRowClick = false;
        }, 220);
      });
      row.addEventListener('click', () => {
        if (suppressMaterialRowClick) return;
        if (Date.now() < materialDetailSyntheticClickSuppressUntil) return;
        openMaterialDetailModal(m);
      });

      row.addEventListener(
        'touchstart',
        (e) => {
          beginForgeTouchDrag(
            {
              kind: 'material',
              uid: m.uid,
              label: m.name != null ? String(m.name) : '재료',
              sourceEl: row,
            },
            e,
          );
        },
        { passive: true },
      );

      materialListEl.appendChild(row);
    });
    renderMaterialDockFilterUi();
    syncScrollOverflow();
  }

  function removeSelectedUid(uid) {
    const i = selected.findIndex((s) => s.uid === uid);
    if (i >= 0) selected.splice(i, 1);
    syncForgeUi();
  }

  /** 숙련도 표시 갱신 (숫자 + 보너스 %) */
  function updateProficiencyDisplay(gained) {
    const barEl = document.getElementById('proficiencyBar');
    const labelEl = document.getElementById('profLabel');
    const countEl = document.getElementById('profCount');
    if (!barEl || !labelEl || !countEl) return;
    labelEl.textContent = '대장장이 능력치';
    const profVal = Number(smithingProficiency) || 0;
    const mul = clientProfMul(profVal);
    const bonusPct = ((mul - 1.0) * 100).toFixed(1);
    countEl.textContent = `${profVal.toFixed(3)}  (+${bonusPct}% 보너스)`;
    if (gained) {
      barEl.classList.add('prof-level-up');
      window.setTimeout(() => barEl.classList.remove('prof-level-up'), 1200);
    }
  }

  /** 서버에서 숙련도 로드 */
  async function loadProficiency() {
    if (!alpToken || !platformApi) return;
    try {
      const res = await fetch(`${platformApi}/api/craft/proficiency`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.smithingProficiency === 'number') {
        smithingProficiency = data.smithingProficiency;
        smithingProfLevelInfo = data.levelInfo || { mul: 1.0 };
        updateProficiencyDisplay(false);
      }
    } catch {
      /* 숙련도 로드 실패는 무시 */
    }
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
      // 모루: 산출물 2개 이상이어야 활성화
      const smeltGateBlocked = isForgeBlockedSmeltOnlyMinCount(selected);
      btnForge.disabled = !hasServer || smeltGateBlocked;
    }
    updateStatusMsg();
    renderMaterials();
    renderSmeltStock();
  }

  function updateStatusMsg() {
    if (!statusMsgEl) return;
    statusMsgEl.className = 'status-msg'; // 매번 초기화 후 조건부 강도 클래스 추가
    if (selected.length === 0) {
      statusMsgEl.textContent = '기초 재료(산출물)를 모루에 끌어다 놓으세요. 낚시·장비는 먼저 용광로에 녹이세요.';
      return;
    }
    if (!alpToken || !platformApi) {
      statusMsgEl.textContent = '게임에서 이 화면을 연 경우에만 서버에 제련할 수 있어요.';
      return;
    }
    const nonSmelt = selected.filter((m) => !isSmeltMaterial(m));
    if (nonSmelt.length > 0) {
      statusMsgEl.textContent = `모루에는 기초 재료(산출물)만 올릴 수 있어요. 낚시·장비는 용광로에 먼저 녹이세요.`;
      return;
    }
    if (selected.length < MIN_SMELT_MATERIALS_FOR_FORGE) {
      statusMsgEl.textContent = `기초 재료(산출물)가 최소 ${MIN_SMELT_MATERIALS_FOR_FORGE}개 필요해요.`;
      return;
    }
    if (selected.every((m) => isSmeltMaterial(m))) {
      const avgStr = calcSelectedAvgStrength(selected);
      const uniqueTiers = countUniqueStrengthTiers(selected);
      const harmLabel = clientHarmonyLabel(uniqueTiers);
      const successPct = Math.round(clientSuccessRate(smithingProficiency, avgStr) * 100);
      const activeSyn = detectClientSynergies(selected);
      // 조합 품질에 따라 색상 클래스 (시너지 발동 시 최상 색상 우선)
      const harmCls = activeSyn.length > 0 ? 'strength--legendary'
        : uniqueTiers >= 4 ? 'strength--legendary'
        : uniqueTiers >= 3 ? 'strength--strong'
        : uniqueTiers >= 2 ? 'strength--medium'
        : 'strength--weak';
      const hint = uniqueTiers < 4 ? `  ★ ${4 - uniqueTiers}종 더 추가하면 조합 강화!` : '  ★ 최고 조합!';
      const synLine = activeSyn.length > 0
        ? `  ⚡ ${activeSyn.map((s) => s.name).join(' · ')}`
        : '';
      statusMsgEl.textContent = `기초 재료 ${selected.length}개 · [${harmLabel}] · 성공률 약 ${successPct}%${synLine}${synLine ? '' : hint}`;
      statusMsgEl.className = `status-msg ${harmCls}`;
      return;
    }
    statusMsgEl.className = 'status-msg';
    statusMsgEl.textContent =
      `기초 재료(산출물) ${selected.length}개 — 「⚒️ 제련하기」를 눌러 장비를 만드세요.`;
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
      api_error:
        'AI API 오류(모델명·할당량·Generative Language API 미활성 등)로 로컬 규칙을 썼어요. 서버에 GEMINI_MODEL=gemini-2.0-flash 로 바꿔 보세요.',
      blocked: 'AI 안전 정책으로 이름 생성이 제한되어 로컬 규칙을 썼어요.',
      parse_error: 'AI 응답을 해석하지 못해 로컬 규칙으로 이름·스탯을 정했어요.',
      incomplete_response: 'AI가 완전한 이름·스탯을 주지 않아 로컬 규칙을 썼어요.',
      exception: 'AI 처리 중 오류가 나 로컬 규칙으로 이름·스탯을 정했어요.',
      unknown: 'AI 이름을 쓰지 못하고 로컬 규칙으로 이름·스탯을 정했어요.',
    };
    return map[r] || map.unknown;
  }

  /**
   * 제련 실패 결과 표시
   * @param {{ successRatePct, materialStrengthLabel, returnedMaterials, proficiencyGain }} data
   */
  function showForgeFailure(data) {
    if (!resultCard || !resultName || !resultDesc || !resultRarity || !resultSpriteHost) return;
    window.clearTimeout(resultHideTimer);

    resultCard.className = 'result-card result-card--failed';
    resultRarity.className = 'result-rarity result-rarity--failed';
    resultRarity.textContent = '제련 실패';
    resultName.textContent = '장비가 부서졌습니다';

    // 반환 재료 목록
    const returned = Array.isArray(data.returnedMaterials) ? data.returnedMaterials : [];
    let returnLine = '';
    if (returned.length > 0) {
      const items = returned.map((r) => `${r.emoji || '◆'} ${r.name} ×${r.count}`).join('  ');
      returnLine = `\n회수된 산출물: ${items}`;
    } else {
      returnLine = '\n회수된 산출물 없음';
    }

    const gainStr = data.proficiencyGain != null
      ? `  (능력치 +${Number(data.proficiencyGain).toFixed(4)})`
      : '';
    const synArr = Array.isArray(data.activeSynergies) ? data.activeSynergies : [];
    const synFailLine = synArr.length > 0 ? `\n시너지: ⚡ ${synArr.map((s) => s.name).join(' · ')}` : '';
    resultDesc.textContent = `성공률 ${data.successRatePct ?? '?'}% · 강도 [${data.materialStrengthLabel || '?'}]${gainStr}${synFailLine}${returnLine}`;

    // 깨진 이모지
    resultSpriteHost.innerHTML = '<span style="font-size:2.5rem;line-height:1">💥</span>';

    resultCard.classList.remove('hidden');
    if (statusMsgEl) {
      statusMsgEl.textContent = `제련 실패! 재료 일부가 회수됐어요.`;
      statusMsgEl.className = 'status-msg strength--weak';
    }
    resultHideTimer = window.setTimeout(() => {
      hideResultCard();
      if (statusMsgEl) {
        statusMsgEl.className = 'status-msg';
        statusMsgEl.textContent = '기초 재료(산출물)를 모루에 끌어다 놓으세요.';
      }
    }, 5000);
  }

  function showResultFromServer(eq, stats, nameSource, nameAiMeta, materialStrengthLabel, materialHarmonyLabel, activeSynergies) {
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
    } else if (nameSource === 'smelt_procedural') {
      const harmBadge = materialHarmonyLabel || materialStrengthLabel || '';
      const synArr = Array.isArray(activeSynergies) ? activeSynergies : [];
      const synText = synArr.length > 0 ? `  ⚡ ${synArr.map((s) => s.name).join(' · ')}` : '';
      aiLine = harmBadge ? `[${harmBadge}]${synText} 절차 생성\n` : `절차 생성${synText}\n`;
    }
    if (stats && typeof stats.attackBonus === 'number') {
      const spdPct = ((stats.speedBonus != null ? Number(stats.speedBonus) : 0) * 100).toFixed(1);
      const dur =
        stats.durabilityMax != null && Number.isFinite(Number(stats.durabilityMax))
          ? ` · 내구 ${stats.durability != null ? stats.durability : stats.durabilityMax}/${stats.durabilityMax}`
          : '';
      resultDesc.textContent = `${aiLine}${baseDesc}\n공격 +${stats.attackBonus} · 방어 +${stats.defenseBonus} · 스피드 +${spdPct}%${dur}`;
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
    if (selected.length < MIN_SMELT_MATERIALS_FOR_FORGE) return;
    if (!alpToken || !platformApi) {
      if (statusMsgEl) statusMsgEl.textContent = '게임 연결(토큰)이 없어 제련할 수 없어요.';
      return;
    }

    const used = selected.slice();
    // 모루는 산출물(smelt)만 허용
    if (used.some((m) => !isSmeltMaterial(m))) {
      if (statusMsgEl) {
        statusMsgEl.textContent = '모루에는 기초 재료(산출물)만 올릴 수 있어요. 낚시 재료·장비를 용광로에 먼저 녹이세요.';
      }
      return;
    }
    if (used.length < MIN_SMELT_MATERIALS_FOR_FORGE) {
      if (statusMsgEl) {
        statusMsgEl.textContent = `기초 재료(산출물)가 최소 ${MIN_SMELT_MATERIALS_FOR_FORGE}개 필요해요.`;
      }
      return;
    }

    const materialsPayload = used.map((m) =>
      isSmeltMaterial(m)
        ? { kind: 'smelt', id: String(m.smeltId).trim() }
        : isEquipmentMaterial(m)
          ? { kind: 'equipment', id: String(m.equipmentId).trim() }
          : { kind: 'catch', id: String(m.serverId).trim() },
    );

    forgeInFlight = true;
    forgeStartAt = Date.now();
    pendingSignatureCelebrateName = null;
    if (btnForge) {
      btnForge.disabled = true;
      btnForge.textContent = '제련 중…';
    }

    // recipe-check 먼저 → 새 조합이면 오버레이, 기존 조합이면 바로 제작
    let isNewRecipe = false;
    {
      const smeltIds = materialsPayload
        .filter((m) => m.kind === 'smelt')
        .map((m) => m.id)
        .sort()
        .join(',');
      if (smeltIds) {
        try {
          const rr = await fetch(
            `${platformApi}/api/craft/recipe-check?slot=${encodeURIComponent(forgeSlot)}&ids=${encodeURIComponent(smeltIds)}`,
            { headers: { Authorization: `Bearer ${alpToken}` } },
          );
          const dd = await rr.json();
          isNewRecipe = !!dd.isNew;
        } catch {}
      }
    }
    if (isNewRecipe) {
      setForgeOverlay(true);
      if (forgeOverlayTitleEl) forgeOverlayTitleEl.textContent = '새로운 조합 발견!';
      if (forgeDiscoveryBannerEl) {
        forgeDiscoveryBannerEl.textContent = '✨ 축하드립니다! 도감에 없는 새 조합이에요.';
        forgeDiscoveryBannerEl.classList.remove('forge-discovery-banner--hidden');
      }
    }

    try {
      const res = await fetch(`${platformApi}/api/craft/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${alpToken}`,
        },
        body: JSON.stringify({
          materials: materialsPayload,
          slot: forgeSlot,
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
      // HTTP 오류 처리
      if (!res.ok) {
        const msg =
          (data && data.error && data.error.message) ||
          (data && data.message) ||
          `서버 오류 (${res.status})`;
        if (statusMsgEl) statusMsgEl.textContent = msg;
        return;
      }

      // ── 숙련도 공통 업데이트 ─────────────────────────────────
      if (typeof data.smithingProficiency === 'number') {
        smithingProficiency = data.smithingProficiency;
        smithingProfLevelInfo = data.proficiencyLevelInfo || { mul: 1.0 };
        updateProficiencyDisplay(true);
      }

      // ── 재료 공통 처리 ───────────────────────────────────────
      const uids = used.map((s) => s.uid);
      appendSpent(uids.filter((u) => !String(u).startsWith('eq-') && !String(u).startsWith('smelt-')));
      removeMaterialsFromStore(uids);
      consumeSmeltSelectionMaterials(used);
      const usedSet = new Set(uids);
      selected = selected.filter((s) => !usedSet.has(s.uid));
      refreshMaterials();

      // ── 실패 처리 ────────────────────────────────────────────
      if (data.success === false) {
        // 반환된 산출물을 로컬에도 반영 (서버와 동기화)
        await syncSmeltFromServer();
        syncForgeUi();
        showForgeFailure(data);
        return;
      }

      // ── 성공 처리 ────────────────────────────────────────────
      if (!data.equipment) {
        if (statusMsgEl) statusMsgEl.textContent = '서버 응답 형식 오류 — 다시 시도하세요.';
        return;
      }
      const serverEquipment = data.equipment;
      const serverStats = serverEquipment.stats || null;

      syncForgeUi();
      await refreshCraftedList();
      void syncSmeltFromServer();

      // 실제 경과 시간으로 게임머니 지급
      const forgeBonus = await grantForgeBonus(Date.now() - forgeStartAt);
      if (forgeBonus > 0) showForgeCoinBonus(forgeBonus);

      showResultFromServer(serverEquipment, serverStats, data.nameSource, {
        nameAiRequested: data.nameAiRequested,
        nameAiUsed: data.nameAiUsed,
        nameAiSkipReason: data.nameAiSkipReason,
      }, data.materialStrengthLabel || null, data.materialHarmonyLabel || null, data.activeSynergies || []);
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
            stats:
              item.stats != null && typeof item.stats === 'object' && !Array.isArray(item.stats)
                ? { ...item.stats }
                : null,
            description: item.description != null ? String(item.description) : '',
            desc: item.desc != null ? String(item.desc) : '',
          };
        });
      equipSourceMatsMap = new Map(
        list.map((item) => [String(item.id), Array.isArray(item.sourceMaterials) ? item.sourceMaterials : []])
      );
      refreshMaterials();
      renderMaterials();
      selected = selected.filter((s) => isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid));
      syncForgeUi();

      craftedListEl.innerHTML = '';
      list.forEach((item) => {
        const c = normalizeCraftedRow(item);
        const row = document.createElement('div');
        row.className = 'crafted-row';
        const sourceMats = Array.isArray(item.sourceMaterials) ? item.sourceMaterials : [];
        if (sourceMats.length > 0) {
          row.classList.add('crafted-row--clickable');
          row.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            openCraftedEquipmentDetail(item, sourceMats);
          });
        }
        const thumb = document.createElement('div');
        mountCraftedThumb(thumb, item);
        row.appendChild(thumb);
        const body = document.createElement('div');
        const st = c.stats;
        const durMax = st && st.durabilityMax != null && Number.isFinite(Number(st.durabilityMax)) ? Number(st.durabilityMax) : 0;
        const durCur = durMax > 0 ? (st.durability != null && Number.isFinite(Number(st.durability)) ? Number(st.durability) : durMax) : 0;
        const isDamaged = durMax > 0 && durCur < durMax;

        const REPAIR_COST_PER_DUR = { common: 5, rare: 12, epic: 30, legendary: 70 };
        const tier = String(c.rarity || item.tier || 'common').toLowerCase();
        const repairCost = isDamaged ? Math.max(1, Math.ceil((durMax - durCur) * (REPAIR_COST_PER_DUR[tier] ?? 5))) : 0;

        const durPart = durMax > 0
          ? ` · 내구 <span style="color:${isDamaged ? '#f87171' : 'inherit'}">${durCur}/${durMax}</span>`
          : '';
        const SLOT_EMOJI_MAP = { weapon:'⚔️',head:'🪖',chest:'🧥',pants:'👖',gloves:'🧤',boots:'👢',accessory:'💍' };
        const slotTag = st && st.equipSlot ? `<span style="opacity:0.55">${SLOT_EMOJI_MAP[st.equipSlot]||''}</span> ` : '';
        const hpPart = st && st.hpBonus > 0 ? ` · HP +${st.hpBonus}` : '';
        const statsLine =
          st && typeof st.attackBonus === 'number'
            ? `<div class="cr-stats">${slotTag}공격 +${st.attackBonus} · 방어 +${st.defenseBonus} · 속도 +${(Number(st.speedBonus || 0) * 100).toFixed(1)}%${durPart}${hpPart}</div>`
            : '';
        body.innerHTML = `
          <strong>${escapeHtml(c.name)}</strong>
          <div class="cr-desc">${escapeHtml(c.desc || '')}</div>
          ${statsLine}
        `;
        // 수리는 🔨 수리 탭에서 진행
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
  if (materialDockFiltersEl) {
    materialDockFiltersEl.querySelectorAll('.material-dock-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-filter') || 'all';
        if (next === materialDockFilter) return;
        materialDockFilter = next;
        renderMaterials();
      });
    });
  }
  if (btnForge) btnForge.addEventListener('click', () => void forge());

  const FORGE_SLOT_DEFS = [
    { id: 'weapon',    emoji: '⚔️', label: '무기'    },
    { id: 'head',      emoji: '🪖', label: '머리'    },
    { id: 'chest',     emoji: '🧥', label: '상의'    },
    { id: 'pants',     emoji: '👖', label: '하의'    },
    { id: 'gloves',    emoji: '🧤', label: '손'      },
    { id: 'boots',     emoji: '👢', label: '다리'    },
    { id: 'accessory', emoji: '💍', label: '악세서리' },
  ];
  const forgeSlotToggleEl = document.getElementById('forgeSlotToggle');
  let slotBtns = {};
  if (forgeSlotToggleEl) {
    for (const def of FORGE_SLOT_DEFS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'forge-slot-btn' + (def.id === 'weapon' ? ' forge-slot-active' : '');
      btn.textContent = `${def.emoji} ${def.label}`;
      btn.addEventListener('click', () => {
        forgeSlot = def.id;
        Object.values(slotBtns).forEach(b => b.classList.remove('forge-slot-active'));
        btn.classList.add('forge-slot-active');
        if (btnForge) btnForge.textContent = `⚒️ ${def.label} 제련`;
      });
      slotBtns[def.id] = btn;
      forgeSlotToggleEl.appendChild(btn);
    }
  }
  window.addEventListener('storage', onStorage);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideResultCard();
      closeMaterialDetailModal();
    }
  });

  let materialDetailModalWired = false;
  function wireMaterialDetailModal() {
    if (materialDetailModalWired || !materialDetailModalEl) return;
    materialDetailModalWired = true;
    const backdrop = materialDetailModalEl.querySelector('.material-detail-backdrop');
    if (materialDetailCloseBtn) materialDetailCloseBtn.addEventListener('click', () => closeMaterialDetailModal());
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (Date.now() < materialDetailBackdropIgnoreUntil) return;
        closeMaterialDetailModal();
      });
    }
  }

  refreshMaterials();
  wireForgeMaterialDropZones();
  wireMaterialDetailModal();
  syncFurnaceUi();
  syncForgeUi();
  void loadProficiency();
  void loadCoins();
  void syncForgeMaterialsFromServer()
    .then(() => refreshCraftedList())
    .then(() => syncSmeltFromServer());

  // ══════════════════════════════════════════════════════════════
  // 수리 탭
  // ══════════════════════════════════════════════════════════════
  const REPAIR_COLS = 8, REPAIR_ROWS = 10;
  const REPAIR_COST_TABLE = { common: 5, rare: 12, epic: 30, legendary: 70 };

  let repairItem = null;
  let repairMaxDur = 0, repairOrigDur = 0, repairDur = 0;
  let repairCracks = null; // Set<"col,row">
  let repairZoom = 1.0;
  let repairImg = null;
  let repairSpent = 0;

  const $repairCanvas    = document.getElementById('repairCanvas');
  const $repairHint      = document.getElementById('repairDropHint');
  const $repairControls  = document.getElementById('repairControls');
  const $repairDurInfo   = document.getElementById('repairDurInfo');
  const $repairCoinInfo  = document.getElementById('repairCoinInfo');
  const $repairEquipList = document.getElementById('repairEquipList');
  let repairCtx = $repairCanvas ? $repairCanvas.getContext('2d') : null;

  function seededRng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
  }
  function hashStr(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
    return h >>> 0;
  }

  function generateCracks(curDur, maxDur, seedStr) {
    const damagedCount = Math.round(((maxDur - curDur) / maxDur) * (REPAIR_COLS * REPAIR_ROWS));
    if (damagedCount <= 0) return new Set();
    const rng = seededRng(hashStr(String(seedStr)));
    const cracked = new Set();
    const queue = [];
    const numOrigins = 2 + (rng() < 0.4 ? 1 : 0);
    for (let i = 0; i < numOrigins; i++) {
      const cx = Math.floor(rng() * REPAIR_COLS), cy = Math.floor(rng() * REPAIR_ROWS);
      const k = `${cx},${cy}`;
      if (!cracked.has(k)) { cracked.add(k); queue.push([cx, cy]); }
    }
    let safety = 5000;
    while (cracked.size < damagedCount && queue.length > 0 && --safety > 0) {
      const idx = Math.floor(rng() * Math.min(queue.length, 4));
      const [x, y] = queue.splice(idx, 1)[0];
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        if (cracked.size >= damagedCount) break;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= REPAIR_COLS || ny < 0 || ny >= REPAIR_ROWS) continue;
        const k = `${nx},${ny}`;
        if (!cracked.has(k) && rng() < 0.72) { cracked.add(k); queue.push([nx, ny]); }
      }
    }
    return cracked;
  }

  function repairMsg(msg) {
    if (statusMsgEl) { statusMsgEl.textContent = msg; setTimeout(() => { if (statusMsgEl.textContent === msg) statusMsgEl.textContent = ''; }, 3000); }
  }

  function loadRepairItem(item) {
    const stats = item.stats || {};
    const maxDur = Number(stats.durabilityMax || 0);
    if (maxDur <= 0) { repairMsg('내구도가 없는 장비입니다.'); return; }
    const curDur = stats.durability != null ? Number(stats.durability) : maxDur;
    const eqId = item.equipmentId || item.id || '';
    repairItem = { ...item, _eqId: eqId };
    repairMaxDur = maxDur; repairOrigDur = curDur;
    repairDur = curDur; repairSpent = 0; repairZoom = 1.0;
    repairCracks = generateCracks(curDur, maxDur, eqId);
    $repairEquipList?.querySelectorAll('.repair-equip-item')
      .forEach(el => el.classList.toggle('is-selected', el.dataset.id === eqId));
    $repairHint?.classList.add('hidden');
    $repairCanvas?.classList.remove('hidden');
    $repairControls?.classList.remove('hidden');
    repairImg = null;
    const imgSrc = item.pixelArt?.imageDataUrl;
    if (imgSrc) {
      const img = new Image();
      img.onload = () => { repairImg = img; drawRepairCanvas(); };
      img.src = imgSrc;
    } else { drawRepairCanvas(); }
    updateRepairHud();

    // 캔버스 크기를 드롭존에 맞게 조정
    if ($repairCanvas) {
      const dz = document.getElementById('repairDropZone');
      if (dz) {
        $repairCanvas.width  = dz.clientWidth  || 320;
        $repairCanvas.height = dz.clientHeight || 400;
        repairCtx = $repairCanvas.getContext('2d');
      }
    }
    drawRepairCanvas();
  }

  function drawRepairCanvas() {
    if (!repairCtx || !repairItem || !repairCracks) return;
    const canvas = $repairCanvas;
    const ctx = repairCtx;
    const cw = canvas.width, ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const cellW = (cw / REPAIR_COLS) * repairZoom;
    const cellH = (ch / REPAIR_ROWS) * repairZoom;
    const ox = (cw - cellW * REPAIR_COLS) / 2;
    const oy = (ch - cellH * REPAIR_ROWS) / 2;
    const gridW = cellW * REPAIR_COLS, gridH = cellH * REPAIR_ROWS;

    ctx.fillStyle = '#0d0d1e';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.beginPath(); ctx.rect(ox, oy, gridW, gridH); ctx.clip();
    if (repairImg) {
      ctx.drawImage(repairImg, ox, oy, gridW, gridH);
    } else {
      ctx.font = `${Math.min(gridW, gridH) * 0.6}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillText(repairItem.emoji || '⚔️', cw / 2, ch / 2);
    }
    ctx.restore();

    // 균열 칸 오버레이
    for (const key of repairCracks) {
      const [c, r] = key.split(',').map(Number);
      const x = ox + c * cellW, y = oy + r * cellH;
      ctx.fillStyle = 'rgba(0,0,0,0.68)';
      ctx.fillRect(x, y, cellW, cellH);
      // 균열선 (각 셀 고유 패턴)
      const rng = seededRng(hashStr(`${key}${repairItem._eqId}`));
      ctx.strokeStyle = 'rgba(255,80,30,0.8)';
      ctx.lineWidth = Math.max(1, cellW * 0.05); ctx.lineCap = 'round';
      const pts = Array.from({length: 4}, () => [rng() * cellW, rng() * cellH]);
      ctx.beginPath();
      ctx.moveTo(x + pts[0][0], y + pts[0][1]);
      pts.slice(1).forEach(p => ctx.lineTo(x + p[0], y + p[1]));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + pts[1][0], y + pts[1][1]);
      ctx.lineTo(x + pts[1][0] + (rng()-0.5)*cellW*0.6, y + pts[1][1] - rng()*cellH*0.4);
      ctx.stroke();
    }

    // 격자선
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
    for (let c = 0; c <= REPAIR_COLS; c++) {
      const x = ox + c * cellW;
      ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + gridH); ctx.stroke();
    }
    for (let r = 0; r <= REPAIR_ROWS; r++) {
      const y = oy + r * cellH;
      ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + gridW, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(120,90,220,0.3)'; ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, gridW, gridH);
  }

  function onRepairTapAt(clientX, clientY) {
    if (!repairItem || !$repairCanvas || !repairCracks) return;
    const rect = $repairCanvas.getBoundingClientRect();
    const px = (clientX - rect.left) * ($repairCanvas.width / rect.width);
    const py = (clientY - rect.top)  * ($repairCanvas.height / rect.height);
    const cellW = ($repairCanvas.width  / REPAIR_COLS) * repairZoom;
    const cellH = ($repairCanvas.height / REPAIR_ROWS) * repairZoom;
    const ox = ($repairCanvas.width  - cellW * REPAIR_COLS) / 2;
    const oy = ($repairCanvas.height - cellH * REPAIR_ROWS) / 2;
    const col = Math.floor((px - ox) / cellW);
    const row = Math.floor((py - oy) / cellH);
    if (col < 0 || col >= REPAIR_COLS || row < 0 || row >= REPAIR_ROWS) return;

    const key = `${col},${row}`;
    const cost = REPAIR_COST_TABLE[String(repairItem.tier || 'common').toLowerCase()] ?? 5;

    if (repairCracks.has(key)) {
      if (repairDur >= repairMaxDur) return;
      repairCracks.delete(key); repairDur++; repairSpent += cost;
      showRepairCoinFx(clientX, clientY, `-${cost}`, '#fbbf24');
    } else {
      if (repairDur <= 0) return;
      repairCracks.add(key); repairDur--; repairSpent += cost;
      showRepairCoinFx(clientX, clientY, `-${cost}`, '#f87171');
    }
    drawRepairCanvas(); updateRepairHud();
  }

  function showRepairCoinFx(x, y, text, color) {
    const el = document.createElement('span');
    el.className = 'repair-fx-coin';
    el.textContent = text; el.style.color = color;
    el.style.left = `${x - 12}px`; el.style.top = `${y - 16}px`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.classList.add('repair-fx-coin--rise');
      setTimeout(() => el.remove(), 700);
    });
  }

  function updateRepairHud() {
    if ($repairDurInfo) {
      $repairDurInfo.textContent = `내구도: ${repairDur} / ${repairMaxDur}`;
      $repairDurInfo.style.color = repairDur < repairMaxDur ? '#f87171' : '#4ade80';
    }
    if ($repairCoinInfo) {
      $repairCoinInfo.textContent = `🪙 ${Math.max(0, totalCoins - repairSpent).toLocaleString()}  (-${repairSpent})`;
    }
  }

  async function confirmRepairSession() {
    if (!repairItem) return;
    const netRepair = repairDur - repairOrigDur;
    if (netRepair <= 0) { repairMsg('수리한 내용이 없습니다.'); return; }
    if (!alpToken || !platformApi) { repairMsg('로그인이 필요합니다.'); return; }
    const btn = document.getElementById('repairConfirmBtn');
    if (btn) { btn.disabled = true; btn.textContent = '처리 중…'; }
    try {
      const res = await fetch(`${platformApi}/api/craft/equipment/${encodeURIComponent(repairItem._eqId)}/repair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
        body: JSON.stringify({ amount: netRepair }),
      });
      const d = await res.json();
      if (!res.ok) { repairMsg(d?.error?.message || '수리에 실패했습니다.'); return; }
      totalCoins = Math.max(0, totalCoins - (d.costPaid || 0));
      updateCoinDisplay();
      repairMsg(`✅ 수리 완료! 🪙-${d.costPaid}`);
      repairItem = null;
      $repairCanvas?.classList.add('hidden');
      $repairControls?.classList.add('hidden');
      $repairHint?.classList.remove('hidden');
      await refreshCraftedList();
      refreshRepairEquipList();
    } catch { repairMsg('수리 중 오류가 발생했습니다.'); }
    finally {
      if (btn) { btn.disabled = false; btn.textContent = '✅ 수리 완료'; }
    }
  }

  function refreshRepairEquipList() {
    if (!$repairEquipList) return;
    $repairEquipList.innerHTML = '';
    const pool = (typeof serverEquipmentForgePool !== 'undefined') ? serverEquipmentForgePool : [];
    for (const item of pool) {
      const stats = item.stats || {};
      const maxDur = Number(stats.durabilityMax || 0);
      const curDur = stats.durability != null ? Number(stats.durability) : maxDur;
      const damaged = maxDur > 0 && curDur < maxDur;

      const el = document.createElement('div');
      el.className = 'repair-equip-item' + (damaged ? '' : ' no-damage');
      el.dataset.id = String(item.equipmentId || item.id);
      el.draggable = damaged;
      el.title = item.name || '장비';

      const thumb = document.createElement('div');
      thumb.className = 'repair-equip-thumb';
      const imgSrc = item.imageUrl || item.pixelArt?.imageDataUrl;
      if (imgSrc) {
        const img = document.createElement('img');
        img.className = 'repair-equip-img'; img.src = imgSrc;
        thumb.appendChild(img);
      } else { thumb.textContent = item.emoji || '⚔️'; }

      const info = document.createElement('div');
      info.className = 'repair-equip-info';
      const name = document.createElement('div');
      name.className = 'repair-equip-name'; name.textContent = item.name || '장비';
      const dur = document.createElement('div');
      dur.className = 'repair-equip-dur';
      if (maxDur > 0) {
        dur.innerHTML = `<span style="color:${damaged ? '#f87171' : '#4ade80'}">${curDur}/${maxDur}</span>`;
      } else { dur.textContent = '—'; }
      info.appendChild(name); info.appendChild(dur);
      el.appendChild(thumb); el.appendChild(info);

      if (damaged) {
        el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', String(item.equipmentId || item.id)));
        el.addEventListener('click', () => loadRepairItem(item));
      }
      $repairEquipList.appendChild(el);
    }
  }

  // 수리 탭 이벤트 바인딩
  if ($repairCanvas) {
    const dropZone = document.getElementById('repairDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault(); dropZone.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const pool = (typeof serverEquipmentForgePool !== 'undefined') ? serverEquipmentForgePool : [];
        const item = pool.find(i => String(i.equipmentId || i.id) === id);
        if (item) loadRepairItem(item);
      });
    }
    $repairCanvas.addEventListener('click', e => onRepairTapAt(e.clientX, e.clientY));
    $repairCanvas.addEventListener('touchend', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      onRepairTapAt(t.clientX, t.clientY);
    }, { passive: false });
    document.getElementById('repairZoomIn')?.addEventListener('click', () => {
      repairZoom = Math.min(3, repairZoom + 0.25); drawRepairCanvas();
    });
    document.getElementById('repairZoomOut')?.addEventListener('click', () => {
      repairZoom = Math.max(0.3, repairZoom - 0.25); drawRepairCanvas();
    });
    document.getElementById('repairConfirmBtn')?.addEventListener('click', confirmRepairSession);
  }

  // ── 탭바 (모바일 하단 / PC 좌측 사이드바 공용) ──
  const mobileTabbarEl = document.getElementById('mobileTabbar');
  if (mobileTabbarEl) {
    function setMobileTab(tab) {
      document.body.dataset.tab = tab;
      mobileTabbarEl.querySelectorAll('.mobile-tab').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.tab === tab);
      });
      if (tab === 'repair') refreshRepairEquipList();
    }
    if (!document.body.dataset.tab) setMobileTab('furnace');
    mobileTabbarEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-tab');
      if (btn && btn.dataset.tab) setMobileTab(btn.dataset.tab);
    });
  }
})();
