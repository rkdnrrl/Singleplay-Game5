(function () {
  'use strict';

  const FORGE_MATERIALS_KEY = 'WEB_ALP_SPACE_FISHING_FORGE_V1';
  const FORGE_SPENT_UIDS_KEY = 'WEB_ALP_FORGE_SPENT_UIDS_V1';
  const CRAFTED_KEY = 'WEB_ALP_BLACKSMITH_CRAFTED_V1';
  const DISCOVERED_KEY = 'WEB_ALP_BLACKSMITH_DISCOVERED_V1';

  const RECIPES = window.FORGE_RECIPES || [];

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

  let materials = [];
  let selected = [];
  let resultHideTimer = 0;

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

  function loadCrafted() {
    try {
      const raw = localStorage.getItem(CRAFTED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveCrafted(list) {
    localStorage.setItem(CRAFTED_KEY, JSON.stringify(list));
  }

  function loadDiscovered() {
    try {
      const raw = localStorage.getItem(DISCOVERED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveDiscovered(set) {
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify([...set]));
  }

  function keywordsMatchRecipe(need, mats) {
    if (need.length !== mats.length) return false;
    const used = new Set();
    for (let k = 0; k < need.length; k += 1) {
      const kw = need[k];
      let found = -1;
      for (let i = 0; i < mats.length; i += 1) {
        if (used.has(i)) continue;
        if (String(mats[i].name).includes(kw)) {
          found = i;
          break;
        }
      }
      if (found < 0) return false;
      used.add(found);
    }
    return true;
  }

  /** need 길이와 같은 subset의 순서를 바꿔가며 매칭 */
  function subsetMatchesNeed(need, subset) {
    if (need.length !== subset.length) return false;
    const k = subset.length;
    if (k <= 1) return keywordsMatchRecipe(need, subset);

    const idx = Array.from({ length: k }, (_, i) => i);
    function permute(depth) {
      if (depth === k) {
        const order = idx.map((j) => subset[j]);
        return keywordsMatchRecipe(need, order);
      }
      for (let i = depth; i < k; i += 1) {
        [idx[depth], idx[i]] = [idx[i], idx[depth]];
        if (permute(depth + 1)) return true;
        [idx[depth], idx[i]] = [idx[i], idx[depth]];
      }
      return false;
    }
    return permute(0);
  }

  /** 담긴 재료 중 레시피에 쓰이는 k개를 찾음. 없으면 null */
  function firstMatchingSubset(need, mats) {
    const k = need.length;
    const n = mats.length;
    if (k === 0 || n < k) return null;

    if (k === 1) {
      for (let i = 0; i < n; i += 1) {
        const one = [mats[i]];
        if (subsetMatchesNeed(need, one)) return one;
      }
      return null;
    }
    if (k === 2) {
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          const pair = [mats[i], mats[j]];
          if (subsetMatchesNeed(need, pair)) return pair;
        }
      }
      return null;
    }
    if (k === 3) {
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          for (let t = j + 1; t < n; t += 1) {
            const tri = [mats[i], mats[j], mats[t]];
            if (subsetMatchesNeed(need, tri)) return tri;
          }
        }
      }
      return null;
    }

    function comb(start, acc) {
      if (acc.length === k) {
        return subsetMatchesNeed(need, acc) ? acc.slice() : null;
      }
      for (let i = start; i < n; i += 1) {
        acc.push(mats[i]);
        const hit = comb(i + 1, acc);
        acc.pop();
        if (hit) return hit;
      }
      return null;
    }
    return comb(0, []);
  }

  /** @returns {null | { rec: object, used: typeof selected }} */
  function findRecipeFor(mats) {
    if (mats.length === 0) return null;
    for (let r = 0; r < RECIPES.length; r += 1) {
      const rec = RECIPES[r];
      if (!rec.need || rec.need.length === 0) continue;
      if (mats.length < rec.need.length) continue;
      const used = firstMatchingSubset(rec.need, mats);
      if (used) return { rec, used };
    }
    return null;
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
    materials = loadMaterials();
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
      row.className = `inv-item rarity-${rarityClass(m.rarity)}`;
      row.dataset.uid = m.uid;
      if (selected.some((s) => s.uid === m.uid)) row.classList.add('selected');
      const em = matEmoji(m.name);
      row.innerHTML = `
        <div class="inv-thumb"><span class="inv-emoji" aria-hidden="true">${em}</span></div>
        <span class="inv-name">${escapeHtml(m.name)}</span>
        <span class="inv-tag">${escapeHtml(rarityClass(m.rarity))}</span>
      `;
      row.addEventListener('click', () => toggleSelect(m));
      materialListEl.appendChild(row);
    });
    syncScrollOverflow();
  }

  function toggleSelect(m) {
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
    if (btnForge) btnForge.disabled = selected.length === 0;
    updateStatusMsg();
    renderMaterials();
  }

  function updateStatusMsg() {
    if (!statusMsgEl) return;
    if (selected.length === 0) {
      statusMsgEl.textContent = '위쪽 재료 보관함에서 눌러 담으세요.';
      return;
    }
    const hit = findRecipeFor(selected);
    if (hit) {
      statusMsgEl.innerHTML = `이 재료들로 <strong>${escapeHtml(hit.rec.out.emoji)} ${escapeHtml(hit.rec.out.name)}</strong> 제작이 가능합니다.`;
      return;
    }
    statusMsgEl.textContent = '담긴 재료로는 알려진 제작 조합이 없어요. 재료를 더 넣거나 바꿔 보세요.';
  }

  function hideResultCard() {
    if (resultCard) resultCard.classList.add('hidden');
  }

  function showResultCard(rec) {
    if (!resultCard || !resultName || !resultDesc || !resultRarity || !resultSpriteHost) return;
    window.clearTimeout(resultHideTimer);
    const tier = rec.out.tier || 'rare';
    resultCard.className = `result-card rarity-${rarityClass(tier)}`;
    resultRarity.className = `result-rarity rarity-${rarityClass(tier)}`;
    resultRarity.textContent = tierLabel(tier);
    resultName.textContent = rec.out.name;
    resultDesc.textContent = rec.out.desc || '';
    resultSpriteHost.textContent = rec.out.emoji || '⚒️';
    resultCard.classList.remove('hidden');
    resultHideTimer = window.setTimeout(hideResultCard, 3800);
  }

  function forge() {
    if (selected.length === 0) return;
    const hit = findRecipeFor(selected);
    if (!hit) {
      if (statusMsgEl) {
        statusMsgEl.textContent = '이 조합으로는 제련할 수 없어요. 재료를 바꿔 보세요.';
      }
      return;
    }
    const { rec, used } = hit;

    const uids = used.map((s) => s.uid);
    appendSpent(uids);
    removeMaterialsFromStore(uids);

    const crafted = loadCrafted();
    crafted.unshift({
      recipeId: rec.id,
      name: rec.out.name,
      emoji: rec.out.emoji,
      desc: rec.out.desc,
      tier: rec.out.tier,
      at: Date.now(),
    });
    saveCrafted(crafted.slice(0, 80));

    const disc = loadDiscovered();
    disc.add(rec.id);
    saveDiscovered(disc);

    const usedSet = new Set(uids);
    selected = selected.filter((s) => !usedSet.has(s.uid));
    refreshMaterials();
    syncForgeUi();
    renderCrafted();
    showResultCard(rec);
  }

  function renderCrafted() {
    if (!craftedListEl) return;
    const list = loadCrafted();
    if (list.length === 0) {
      craftedListEl.innerHTML = '<p class="log-empty">아직 없습니다.</p>';
      return;
    }
    craftedListEl.innerHTML = '';
    list.forEach((c) => {
      const row = document.createElement('div');
      row.className = 'crafted-row';
      row.innerHTML = `
        <span class="cr-emoji">${c.emoji || '⚒️'}</span>
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <div class="cr-desc">${escapeHtml(c.desc || '')}</div>
        </div>
      `;
      craftedListEl.appendChild(row);
    });
  }

  function onStorage(e) {
    if (e.key !== FORGE_MATERIALS_KEY && e.key !== FORGE_SPENT_UIDS_KEY) return;
    refreshMaterials();
    selected = selected.filter((s) => materials.some((m) => m.uid === s.uid));
    syncForgeUi();
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      selected = [];
      syncForgeUi();
    });
  }
  if (btnForge) btnForge.addEventListener('click', forge);
  window.addEventListener('storage', onStorage);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideResultCard();
  });

  refreshMaterials();
  syncForgeUi();
  renderCrafted();
})();
