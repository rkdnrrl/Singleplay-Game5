(function () {
  'use strict';

  /* ── i18n ── */
  const _LANG = (function() {
    try { const p = new URLSearchParams(location.search).get('lang'); return (p || 'ko').toLowerCase().split('-')[0]; } catch { return 'ko'; }
  })();
  const _I18N = {
    ko: {
      cancel: '취소', confirm: '확인', close: '닫기', back_to_games: '← 게임 목록',
      tutorial_help: '튜토리얼 다시 보기', t_prev: '이전', t_next: '다음', t_skip: '건너뛰기', t_start: '시작!', t_dont_show: '다시 보지 않기',
      page_title: '왕국의 대장간',
      // 용광로
      furnace_title: '용광로', furnace_hint: '재료를 <strong>끌어다</strong> 이 칸에 놓고 녹이면 괴·유리 등이 나옵니다.',
      furnace_smelt: '🔥 녹이기', furnace_clear: '용광로 비우기',
      furnace_equip_warn: '⚠️ 장비를 녹이면 재료 일부가 소실될 수 있습니다.',
      // 모루/제련
      anvil_aria: '모루·제련', forge_label: '<strong>기초 재료(산출물)</strong> 클릭 → 빈 슬롯 자동 배치 · 드래그 → 슬롯 선택 (드래그 시 선호 슬롯 표시)',
      anvil_aria_only: '모루', forge_btn: '⚒️ 제련하기', forge_clear: '선택 비우기',
      status_msg_default: '기초 재료(산출물)를 끌어 모루에 놓으세요. 낚시·장비는 먼저 용광로에 녹이세요.',
      prof_label: '견습 대장장이', prof_count: '{n}회',
      // 제작 장비
      crafted_title: '🛡️ 제작한 장비',
      // 수리
      repair_aria: '장비 수리', repair_drop_hint: '← 오른쪽 장비를 클릭하거나<br>드래그해서 놓으세요',
      repair_dur_info: '내구도 --/--', repair_guide_tip: '프레스가 빛나는 구역에 올 때 탭!',
      repair_confirm: '✅ 저장', repair_sidebar_title: '🛡️ 장비 목록',
      // 재료
      material_aria: '재료 보관함', material_count_title: '📦 재료',
      filter_all: '전체', filter_material: '재료', filter_equipment: '장비', filter_soul: '영혼', filter_module: '🔩 모듈',
      mat_empty: '재료가 없습니다. 낚시로 재료를 모은 뒤 새로고침 하세요.',
      // 기초 재료
      smelt_stock_title: '기초 재료', smelt_aria: '보관함 종류 필터', smelt_cat_aria: '기초 재료 분류',
      cat_metal: '금속', cat_electronic: '전자', cat_chemical: '화학', cat_polymer: '폴리머', cat_gem: '보석', cat_bio: '생체', cat_etc: '기타',
      // 오버레이
      overlay_title: '대장간에서 제작 중…', overlay_timer: '예상 시간 약 {n}초',
      // 결과
      result_default: '장비', result_saved: '서버에 저장됨', goto_dungeon: '⚔️ 던전에서 사용하기',
      // 재료 상세
      material_hint: '끌어서 <strong>용광로</strong>에 녹이세요. 산출물이 되면 모루에서 장비를 만들 수 있어요.',
      // 시그니처
      sig_title: '멋진 이름 달성!', sig_sub: 'AI가 이 장비 이름을 특별히 멋지거나 예쁘다고 인정했어요. 축하합니다!',
      // 장비 커스터마이즈
      custom_title: '🔨 장비 이름 & 도안 설정',
      custom_name_placeholder: '장비 이름 입력', custom_rand_title: '랜덤 이름',
      custom_color: '색상', custom_eyedropper_title: '스포이드 — 캔버스에서 색상 추출',
      custom_eraser: '지우개', custom_clear: '전체 지우기',
      custom_random_pixel: '🎲 랜덤 도안', custom_done: '✅ 완성하기',
      custom_loading_congrats: '✨ 축하합니다!<br>처음 만든 레시피입니다!',
      custom_loading_timer: '예상 대기시간 {n}초',
      custom_loading_coin_hint: '🪙 기다린 만큼 게임머니를 드려요!',
      custom_loading_wait: '잠시만 기다려주세요…',
      // 컬러 피커
      color_picker_title: '색상 선택', color_picker_eyedropper: '스포이드',
      // 개조
      module_aria: '장비 개조', module_equip_section: '🛡️ 장비 선택', module_inv_title: '🔩 보유 모듈',
      module_select_first: '장비를 선택하세요', module_craft_toggle: '⚒️ 모듈 제작',
      module_craft_title: '⚒️ 모듈 제작', module_craft_slots_label: '재료 슬롯',
      module_craft_slot_count: '{n}/{max}', module_craft_clear: '전체 비우기',
      module_craft_stock: '보유 산출물', module_craft_btn: '✨ 제작',
      // 강화
      enhance_aria: '장비 강화', enhance_stones: '🗃️ 보유 강화 아이템', enhance_equip: '🛡️ 강화할 장비 선택',
      enhance_hint: '강화 아이템과 장비를 선택하세요', enhance_btn: '✨ 강화하기',
      // 모바일 탭
      tab_materials: '재료', tab_furnace: '용광로', tab_forge: '제련', tab_stock: '기초재료',
      tab_equipment: '장비', tab_repair: '수리', tab_enhance: '강화', tab_modules: '개조',
      // 토스트
      forge_done: '⚒️ 제련 완료!',
      forge_failed: '제련 실패',
      smelt_result_label: '녹인 결과',
      smelt_loss_chip: '{emoji}{name} ×{n} 소실',
      smelt_empty: '아직 없음', smelt_cat_empty: '{cat} 기초 재료 없음',
      module_empty: '모듈이 없습니다.', module_equipped_tag: '{tier} · 장착중',
      smelt_equip_warn: '⚠️ {parts}을 녹이면 재료 일부가 소실될 수 있습니다 (회수율 약 70%).',
      smelt_preview_prefix: '예상: ',
      smelt_preview_unknown: '🎲 무엇이 나올지 알 수 없어요',
      forge_overlay_bonus: '🪙 제련 보상 예상: +{n} 코인',
      forge_overlay_timer: '예상 시간 약 {n}초',
      forge_overlay_overdue: '예상시간 {n}초 초과',
      forge_overlay_busy: '대장간에서 제작 중…',
      msg_qty_limit: '해당 기초 재료는 보유 수량만큼만 모루에 올릴 수 있어요.',
      msg_slot_full: '슬롯이 꽉 찼어요. (최대 9칸)',
      msg_smelt_first: '낚시 재료·장비는 먼저 용광로에서 녹여야 해요. 재료를 용광로로 이동시켜 드릴게요.',
      msg_anvil_only_outputs: '기초 재료는 모루로만 끌어다 놓을 수 있어요.',
      smith_proficiency_label: '대장장이 능력치',
      smith_proficiency_count: '{n}  (+{p}% 보너스)',
      msg_drag_to_anvil: '산출물을 클릭하거나 원하는 슬롯으로 드래그하세요. 위치에 따라 능력치가 오르내려요.',
      msg_open_from_game: '게임에서 이 화면을 연 경우에만 서버에 제련할 수 있어요.',
      msg_anvil_only_outputs2: '모루에는 기초 재료(산출물)만 올릴 수 있어요.',
      msg_forge_ready: '재료 {n}개 · [{harm}] · 성공률 약 {p}%{syn}',
      msg_forge_basic_ready: '기초 재료(산출물) {n}개 — 「⚒️ 제련하기」를 눌러 장비를 만드세요.',
      result_failed: '제련 실패', result_broken: '장비가 부서졌습니다',
      material_history_hint: '이 장비를 만들 때 사용된 재료 목록입니다.',
      nameless: '이름 없음',
      sound_label: '🔊',
      forge_combo_prefix: '조합',
      desc_stats: '공격 +{atk} · 방어 +{def} · 스피드 +{spd}%{dur}',
      timing_title: '⚒️ 타이밍을 맞춰 제련하세요!',
      timing_sub: '클릭 또는 스페이스바로 멈추세요',
      no_token: '게임 연결(토큰)이 없어 제련할 수 없어요.',
      btn_forging: '제련 중…',
      server_resp_err: '서버 응답 형식 오류 — 다시 시도하세요.',
      network_err: '네트워크 오류로 서버에 저장하지 못했어요.',
      list_loading: '불러오는 중…',
      list_load_fail: '목록을 불러오지 못했어요.',
      list_no_crafted: '아직 제작한 장비가 없습니다.',
      list_network_err: '네트워크 오류로 목록을 불러오지 못했어요.',
      ecl_timer_remaining: '예상 대기시간 {n}초',
      ecl_timer_overdue: '예상 대기시간 초과 +{n}초',
      forge_specific: '⚒️ {label} 제련',
      repair_dur_info_full: '내구도: {cur} / {max}',
      repair_coin_info: '🪙 {n}  (-{spent})',
      btn_processing: '처리 중…',
      btn_repair_done: '✅ 수리 완료',
      empty_dash: '—',
      modules_label: '🔩 모듈',
      no_crafted: '제작된 장비가 없습니다',
      enhance_with_item: '{emoji} {sname}로 [{ename}] 강화',
      enhance_pick_item: '강화 아이템을 선택하세요',
      enhance_pick_equip: '강화할 장비를 선택하세요',
      enhance_busy: '강화 중…',
      enhance_fail_default: '강화 실패',
      enhance_success: '✅ 강화 성공!',
      enhance_fail_msg: '💔 강화 실패… 아이템만 소모됐습니다.',
      error_occurred: '오류가 발생했습니다.',
      list_load_fail_short: '불러오기 실패',
      no_gear: '장비가 없습니다',
      forge_failed_msg: '제련 실패! 재료 일부가 회수됐어요.',
      forge_basic_drag_hint: '기초 재료(산출물)를 모루에 끌어다 놓으세요.',
      result_desc_template: '성공률 {p}% · 강도 [{strength}]{gain}{syn}{ret}',
      module_no_modules: '모듈 없음 — 아래에서 제작하세요',
      module_no_outputs: '산출물 없음',
      module_craft_busy: '제작 중…',
      module_craft_fail: '제작 실패',
      module_craft_success: '✅ {name} 제작 완료!',
      module_craft_close: '✕ 닫기',
      desc_stats_full: '{fit}{base}\n공격 +{atk} · 방어 +{def} · 스피드 +{spd}%{dur}',
      // 튜토리얼
      t5_t1_title: '대장간에 오신 걸 환영해요!', t5_t1_body: '낚시 아이템을 녹여 재료를 모으고,<br>그 재료로 장비를 제작·강화하는 곳이에요.',
      t5_t2_title: '용광로 — 아이템 녹이기', t5_t2_body: '<b>낚시에서 얻은 폐품</b>을 용광로에 넣으면<br>재료(철·구리·보석 등)가 나와요.<br>명사 등급이 높을수록 더 많이 나옵니다.',
      t5_t3_title: '모루 — 장비 제작', t5_t3_body: '<b>산출 재료</b>를 모루에 올려놓고 제작하면<br>무기·방어구·악세서리가 만들어져요.<br>재료 조합에 따라 능력치가 결정돼요.',
      t5_t4_title: '모듈로 강화', t5_t4_body: '<b>모듈</b>을 장비 슬롯에 끼우면 추가 능력치를 부여할 수 있어요.<br>모듈도 재료를 모아 제작 가능!',
      t5_t5_title: '수리', t5_t5_body: '던전에서 닳은 장비는 <b>코인을 내고 수리</b>할 수 있어요.<br>내구도 0이 되기 전에 수리하세요!',
      t5_t6_title: '던전 연동', t5_t6_body: '여기서 만든 장비는 <b>던전 탐험(Game7)</b>에서 장착해 사용해요.<br>좋은 장비 = 더 깊은 던전!',
    },
    en: {
      cancel: 'Cancel', confirm: 'OK', close: 'Close', back_to_games: '← Games',
      tutorial_help: 'Replay tutorial', t_prev: 'Back', t_next: 'Next', t_skip: 'Skip', t_start: 'Start!', t_dont_show: "Don't show again",
      page_title: 'Kingdom Blacksmith',
      furnace_title: 'Furnace', furnace_hint: '<strong>Drag</strong> materials here and smelt them into ingots, glass, and more.',
      furnace_smelt: '🔥 Smelt', furnace_clear: 'Clear furnace',
      furnace_equip_warn: '⚠️ Smelting equipment may lose some materials.',
      anvil_aria: 'Anvil · Forge', forge_label: 'Click <strong>base material (output)</strong> → auto-fill empty slot · Drag → choose slot (preferred shown on drag)',
      anvil_aria_only: 'Anvil', forge_btn: '⚒️ Forge', forge_clear: 'Clear selection',
      status_msg_default: 'Drag base materials (output) onto the anvil. Smelt fish/gear in the furnace first.',
      prof_label: 'Apprentice Smith', prof_count: '{n} times',
      crafted_title: '🛡️ Crafted Gear',
      repair_aria: 'Gear Repair', repair_drop_hint: '← Click or drag<br>gear from the right',
      repair_dur_info: 'Durability --/--', repair_guide_tip: 'Tap when the press hits the glowing zone!',
      repair_confirm: '✅ Save', repair_sidebar_title: '🛡️ Gear List',
      material_aria: 'Material Stash', material_count_title: '📦 Materials',
      filter_all: 'All', filter_material: 'Materials', filter_equipment: 'Gear', filter_soul: 'Souls', filter_module: '🔩 Modules',
      mat_empty: 'No materials. Fish for materials then refresh.',
      smelt_stock_title: 'Base Materials', smelt_aria: 'Stash filter', smelt_cat_aria: 'Base material category',
      cat_metal: 'Metal', cat_electronic: 'Electronic', cat_chemical: 'Chemical', cat_polymer: 'Polymer', cat_gem: 'Gem', cat_bio: 'Bio', cat_etc: 'Other',
      overlay_title: 'Forging at the Smithy…', overlay_timer: 'About {n}s',
      result_default: 'Equipment', result_saved: 'Saved to server', goto_dungeon: '⚔️ Use in Dungeon',
      material_hint: 'Drag to the <strong>Furnace</strong> to smelt. Once it\'s an output, craft gear at the anvil.',
      sig_title: 'Great Name!', sig_sub: 'AI thinks this gear name is especially cool or pretty. Congrats!',
      custom_title: '🔨 Gear Name & Sprite',
      custom_name_placeholder: 'Enter gear name', custom_rand_title: 'Random name',
      custom_color: 'Color', custom_eyedropper_title: 'Eyedropper — pick color from canvas',
      custom_eraser: 'Eraser', custom_clear: 'Clear all',
      custom_random_pixel: '🎲 Random sprite', custom_done: '✅ Finish',
      custom_loading_congrats: '✨ Congrats!<br>It\'s your first time crafting this recipe!',
      custom_loading_timer: 'About {n}s',
      custom_loading_coin_hint: '🪙 You\'ll earn coins for waiting!',
      custom_loading_wait: 'Please wait…',
      color_picker_title: 'Pick Color', color_picker_eyedropper: 'Eyedropper',
      module_aria: 'Gear Modification', module_equip_section: '🛡️ Pick Gear', module_inv_title: '🔩 Owned Modules',
      module_select_first: 'Pick gear first', module_craft_toggle: '⚒️ Craft Module',
      module_craft_title: '⚒️ Craft Module', module_craft_slots_label: 'Material slots',
      module_craft_slot_count: '{n}/{max}', module_craft_clear: 'Clear all',
      module_craft_stock: 'Owned outputs', module_craft_btn: '✨ Craft',
      enhance_aria: 'Gear Enhancement', enhance_stones: '🗃️ Enhance Items', enhance_equip: '🛡️ Pick gear to enhance',
      enhance_hint: 'Select enhance item and gear', enhance_btn: '✨ Enhance',
      tab_materials: 'Materials', tab_furnace: 'Furnace', tab_forge: 'Forge', tab_stock: 'Base',
      tab_equipment: 'Gear', tab_repair: 'Repair', tab_enhance: 'Enhance', tab_modules: 'Modify',
      forge_done: '⚒️ Forging done!',
      forge_failed: 'Forging failed',
      smelt_result_label: 'Smelted',
      smelt_loss_chip: '{emoji}{name} ×{n} lost',
      smelt_empty: 'None yet', smelt_cat_empty: 'No {cat} base materials',
      module_empty: 'No modules.', module_equipped_tag: '{tier} · Equipped',
      smelt_equip_warn: '⚠️ Smelting {parts} may lose some materials (~70% recovery).',
      smelt_preview_prefix: 'Expected: ',
      smelt_preview_unknown: '🎲 Unknown output',
      forge_overlay_bonus: '🪙 Forge bonus: +{n} coins',
      forge_overlay_timer: 'About {n}s',
      forge_overlay_overdue: '{n}s over estimate',
      forge_overlay_busy: 'Forging at the smithy…',
      msg_qty_limit: 'You can only place as many as you have.',
      msg_slot_full: 'Slots full. (max 9)',
      msg_smelt_first: 'Fish materials/gear must be smelted first. Moving to furnace.',
      msg_anvil_only_outputs: 'Only base materials go on the anvil.',
      smith_proficiency_label: 'Smith Proficiency',
      smith_proficiency_count: '{n}  (+{p}% bonus)',
      msg_drag_to_anvil: 'Click an output or drag to a slot. Position affects stats.',
      msg_open_from_game: 'Server forging works only when opened from the game.',
      msg_anvil_only_outputs2: 'Only base materials (outputs) can be placed on the anvil.',
      msg_forge_ready: '{n} materials · [{harm}] · Success ~{p}%{syn}',
      msg_forge_basic_ready: '{n} base materials — press "⚒️ Forge" to craft.',
      result_failed: 'Forge failed', result_broken: 'Gear shattered',
      material_history_hint: 'Materials used to craft this gear.',
      nameless: 'Unnamed',
      sound_label: '🔊',
      forge_combo_prefix: 'combo',
      desc_stats: 'ATK +{atk} · DEF +{def} · SPD +{spd}%{dur}',
      timing_title: '⚒️ Time your forge!',
      timing_sub: 'Click or press Space to stop',
      no_token: 'No game connection — cannot forge.',
      btn_forging: 'Forging…',
      server_resp_err: 'Server response error — try again.',
      network_err: 'Network error — could not save.',
      list_loading: 'Loading…',
      list_load_fail: 'Failed to load list.',
      list_no_crafted: 'No crafted gear yet.',
      list_network_err: 'Network error — could not load list.',
      ecl_timer_remaining: 'About {n}s',
      ecl_timer_overdue: '+{n}s over estimate',
      forge_specific: '⚒️ Forge {label}',
      repair_dur_info_full: 'Durability: {cur} / {max}',
      repair_coin_info: '🪙 {n}  (-{spent})',
      btn_processing: 'Processing…',
      btn_repair_done: '✅ Repaired',
      empty_dash: '—',
      modules_label: '🔩 Modules',
      no_crafted: 'No crafted gear',
      enhance_with_item: '{emoji} {sname} on [{ename}]',
      enhance_pick_item: 'Select an enhance item',
      enhance_pick_equip: 'Select gear to enhance',
      enhance_busy: 'Enhancing…',
      enhance_fail_default: 'Enhance failed',
      enhance_success: '✅ Enhance success!',
      enhance_fail_msg: '💔 Enhance failed… item consumed.',
      error_occurred: 'An error occurred.',
      list_load_fail_short: 'Load failed',
      no_gear: 'No gear',
      forge_failed_msg: 'Forge failed! Some materials recovered.',
      forge_basic_drag_hint: 'Drag base materials onto the anvil.',
      result_desc_template: 'Success {p}% · Strength [{strength}]{gain}{syn}{ret}',
      module_no_modules: 'No modules — craft below',
      module_no_outputs: 'No outputs',
      module_craft_busy: 'Crafting…',
      module_craft_fail: 'Craft failed',
      module_craft_success: '✅ {name} crafted!',
      module_craft_close: '✕ Close',
      desc_stats_full: '{fit}{base}\nATK +{atk} · DEF +{def} · SPD +{spd}%{dur}',
      t5_t1_title: 'Welcome to the Blacksmith!', t5_t1_body: 'Smelt fishing items into materials,<br>then craft and enhance gear with them.',
      t5_t2_title: 'Furnace — Smelt Items', t5_t2_body: '<b>Scrap from fishing</b> goes in the furnace<br>and comes out as materials (iron/copper/gems).<br>Higher noun-tier = more output!',
      t5_t3_title: 'Anvil — Craft Gear', t5_t3_body: 'Place <b>output materials</b> on the anvil and craft<br>weapons/armor/accessories.<br>Material combinations decide the stats.',
      t5_t4_title: 'Enhance with Modules', t5_t4_body: 'Slot <b>modules</b> into gear to grant bonus stats.<br>Modules can also be crafted from materials!',
      t5_t5_title: 'Repair', t5_t5_body: 'Worn-out gear from dungeons can be <b>repaired for coins</b>.<br>Repair before durability hits 0!',
      t5_t6_title: 'Dungeon Sync', t5_t6_body: 'Gear made here is used in <b>Dungeon Exploration (Game7)</b>.<br>Better gear = deeper dungeons!',
    },
    ja: {
      cancel: 'キャンセル', confirm: 'OK', close: '閉じる', back_to_games: '← ゲーム一覧',
      tutorial_help: 'チュートリアルを再表示', t_prev: '戻る', t_next: '次へ', t_skip: 'スキップ', t_start: 'はじめる!', t_dont_show: '次回から表示しない',
      page_title: '王国の鍛冶屋',
      furnace_title: '炉', furnace_hint: '素材を<strong>ドラッグ</strong>してこの枠に置き溶かすと、インゴットやガラスなどが出ます。',
      furnace_smelt: '🔥 溶かす', furnace_clear: '炉を空にする',
      furnace_equip_warn: '⚠️ 装備を溶かすと素材の一部が失われることがあります。',
      anvil_aria: '金床・精錬', forge_label: '<strong>基礎素材(産出物)</strong>クリック → 空きスロットへ自動配置 · ドラッグ → スロット選択(優先スロット表示)',
      anvil_aria_only: '金床', forge_btn: '⚒️ 精錬する', forge_clear: '選択クリア',
      status_msg_default: '基礎素材(産出物)を金床にドラッグして置きましょう。釣り素材・装備はまず炉で溶かしてください。',
      prof_label: '見習い鍛冶屋', prof_count: '{n}回',
      crafted_title: '🛡️ 製作した装備',
      repair_aria: '装備修理', repair_drop_hint: '← 右の装備をクリックまたは<br>ドラッグして置いてください',
      repair_dur_info: '耐久度 --/--', repair_guide_tip: 'プレスが光る区域に来た時タップ!',
      repair_confirm: '✅ 保存', repair_sidebar_title: '🛡️ 装備一覧',
      material_aria: '素材保管庫', material_count_title: '📦 素材',
      filter_all: 'すべて', filter_material: '素材', filter_equipment: '装備', filter_soul: '魂', filter_module: '🔩 モジュール',
      mat_empty: '素材がありません。釣りで素材を集めて再読み込みしてください。',
      smelt_stock_title: '基礎素材', smelt_aria: '保管庫種別フィルター', smelt_cat_aria: '基礎素材分類',
      cat_metal: '金属', cat_electronic: '電子', cat_chemical: '化学', cat_polymer: 'ポリマー', cat_gem: '宝石', cat_bio: '生体', cat_etc: 'その他',
      overlay_title: '鍛冶屋で製作中…', overlay_timer: '予想時間 約{n}秒',
      result_default: '装備', result_saved: 'サーバーに保存済み', goto_dungeon: '⚔️ ダンジョンで使う',
      material_hint: '<strong>炉</strong>にドラッグして溶かしてください。産出物になれば金床で装備が作れます。',
      sig_title: '素晴らしい名前達成!', sig_sub: 'AIがこの装備名を特に格好いい/可愛いと認めました。おめでとうございます!',
      custom_title: '🔨 装備名 & 図案設定',
      custom_name_placeholder: '装備名を入力', custom_rand_title: 'ランダム名',
      custom_color: '色', custom_eyedropper_title: 'スポイト — キャンバスから色を抽出',
      custom_eraser: '消しゴム', custom_clear: '全消去',
      custom_random_pixel: '🎲 ランダム図案', custom_done: '✅ 完成',
      custom_loading_congrats: '✨ おめでとうございます!<br>初めて作るレシピです!',
      custom_loading_timer: '予想待機時間 {n}秒',
      custom_loading_coin_hint: '🪙 待った分だけコインを差し上げます!',
      custom_loading_wait: 'しばらくお待ちください…',
      color_picker_title: '色選択', color_picker_eyedropper: 'スポイト',
      module_aria: '装備改造', module_equip_section: '🛡️ 装備選択', module_inv_title: '🔩 所持モジュール',
      module_select_first: '装備を選択してください', module_craft_toggle: '⚒️ モジュール製作',
      module_craft_title: '⚒️ モジュール製作', module_craft_slots_label: '素材スロット',
      module_craft_slot_count: '{n}/{max}', module_craft_clear: '全クリア',
      module_craft_stock: '所持産出物', module_craft_btn: '✨ 製作',
      enhance_aria: '装備強化', enhance_stones: '🗃️ 所持強化アイテム', enhance_equip: '🛡️ 強化する装備選択',
      enhance_hint: '強化アイテムと装備を選択してください', enhance_btn: '✨ 強化する',
      tab_materials: '素材', tab_furnace: '炉', tab_forge: '精錬', tab_stock: '基礎',
      tab_equipment: '装備', tab_repair: '修理', tab_enhance: '強化', tab_modules: '改造',
      forge_done: '⚒️ 精錬完了!',
      forge_failed: '精錬失敗',
      smelt_result_label: '溶解結果',
      smelt_loss_chip: '{emoji}{name} ×{n} 消失',
      smelt_empty: 'まだなし', smelt_cat_empty: '{cat}の基礎素材なし',
      module_empty: 'モジュールがありません。', module_equipped_tag: '{tier} · 装着中',
      smelt_equip_warn: '⚠️ {parts}を溶かすと素材の一部が失われることがあります (回収率約70%)。',
      smelt_preview_prefix: '予想: ',
      smelt_preview_unknown: '🎲 何が出るかわからない',
      forge_overlay_bonus: '🪙 精錬ボーナス予想: +{n} コイン',
      forge_overlay_timer: '予想時間 約{n}秒',
      forge_overlay_overdue: '予想時間 {n}秒超過',
      forge_overlay_busy: '鍛冶屋で製作中…',
      msg_qty_limit: '基礎素材は所持数までしか金床に載せられません。',
      msg_slot_full: 'スロットが満杯です。 (最大9枠)',
      msg_smelt_first: '釣り素材・装備はまず炉で溶かす必要があります。素材を炉へ移します。',
      msg_anvil_only_outputs: '基礎素材は金床にしか置けません。',
      smith_proficiency_label: '鍛冶屋熟練度',
      smith_proficiency_count: '{n}  (+{p}% ボーナス)',
      msg_drag_to_anvil: '産出物をクリックまたは希望のスロットにドラッグ。位置で能力値が変わります。',
      msg_open_from_game: 'ゲームからこの画面を開いた場合のみサーバー精錬可能です。',
      msg_anvil_only_outputs2: '金床には基礎素材(産出物)のみ載せられます。',
      msg_forge_ready: '素材{n}個 · [{harm}] · 成功率約{p}%{syn}',
      msg_forge_basic_ready: '基礎素材(産出物){n}個 — 「⚒️ 精錬する」を押して装備を作ってください。',
      result_failed: '精錬失敗', result_broken: '装備が壊れました',
      material_history_hint: 'この装備を作るのに使われた素材リストです。',
      nameless: '名前なし',
      sound_label: '🔊',
      forge_combo_prefix: '組合',
      desc_stats: '攻撃 +{atk} · 防御 +{def} · スピード +{spd}%{dur}',
      timing_title: '⚒️ タイミングを合わせて精錬しよう!',
      timing_sub: 'クリックまたはスペースで停止',
      no_token: 'ゲーム接続(トークン)がないので精錬できません。',
      btn_forging: '精錬中…',
      server_resp_err: 'サーバー応答エラー — 再試行してください。',
      network_err: 'ネットワークエラーで保存できませんでした。',
      list_loading: '読み込み中…',
      list_load_fail: 'リスト読み込みに失敗。',
      list_no_crafted: 'まだ製作した装備がありません。',
      list_network_err: 'ネットワークエラーでリストを読み込めません。',
      ecl_timer_remaining: '予想待機 {n}秒',
      ecl_timer_overdue: '予想超過 +{n}秒',
      forge_specific: '⚒️ {label}を精錬',
      repair_dur_info_full: '耐久度: {cur} / {max}',
      repair_coin_info: '🪙 {n}  (-{spent})',
      btn_processing: '処理中…',
      btn_repair_done: '✅ 修理完了',
      empty_dash: '—',
      modules_label: '🔩 モジュール',
      no_crafted: '製作した装備なし',
      enhance_with_item: '{emoji} {sname}で[{ename}]強化',
      enhance_pick_item: '強化アイテムを選択',
      enhance_pick_equip: '強化する装備を選択',
      enhance_busy: '強化中…',
      enhance_fail_default: '強化失敗',
      enhance_success: '✅ 強化成功!',
      enhance_fail_msg: '💔 強化失敗… アイテムだけ消費されました。',
      error_occurred: 'エラーが発生しました。',
      list_load_fail_short: '読み込み失敗',
      no_gear: '装備なし',
      forge_failed_msg: '精錬失敗! 素材の一部が回収されました。',
      forge_basic_drag_hint: '基礎素材(産出物)を金床にドラッグしてください。',
      result_desc_template: '成功率 {p}% · 強度 [{strength}]{gain}{syn}{ret}',
      module_no_modules: 'モジュールなし — 下で製作',
      module_no_outputs: '産出物なし',
      module_craft_busy: '製作中…',
      module_craft_fail: '製作失敗',
      module_craft_success: '✅ {name} 製作完了!',
      module_craft_close: '✕ 閉じる',
      desc_stats_full: '{fit}{base}\n攻撃 +{atk} · 防御 +{def} · スピード +{spd}%{dur}',
      t5_t1_title: '鍛冶屋へようこそ!', t5_t1_body: '釣りで得たアイテムを溶かして素材を集め、<br>その素材で装備を製作・強化する場所です。',
      t5_t2_title: '炉 — アイテムを溶かす', t5_t2_body: '<b>釣りで得た廃品</b>を炉に入れると<br>素材(鉄・銅・宝石など)が出ます。<br>名詞ランクが高いほどたくさん出ます。',
      t5_t3_title: '金床 — 装備製作', t5_t3_body: '<b>産出素材</b>を金床に置いて製作すると<br>武器・防具・アクセサリができます。<br>素材の組み合わせで能力値が決まります。',
      t5_t4_title: 'モジュールで強化', t5_t4_body: '<b>モジュール</b>を装備スロットに装着すると追加能力値を付与できます。<br>モジュールも素材を集めて製作可能!',
      t5_t5_title: '修理', t5_t5_body: 'ダンジョンで消耗した装備は<b>コインで修理</b>できます。<br>耐久度0になる前に修理しましょう!',
      t5_t6_title: 'ダンジョン連動', t5_t6_body: 'ここで作った装備は<b>ダンジョン探索 (Game7)</b>で装着して使います。<br>良い装備 = より深いダンジョン!',
    },
    zh: {
      cancel: '取消', confirm: '确认', close: '关闭', back_to_games: '← 游戏列表',
      tutorial_help: '重新查看教程', t_prev: '上一步', t_next: '下一步', t_skip: '跳过', t_start: '开始!', t_dont_show: '不再显示',
      page_title: '王国铁匠铺',
      furnace_title: '熔炉', furnace_hint: '将材料<strong>拖动</strong>到此处熔炼,可获得锭、玻璃等。',
      furnace_smelt: '🔥 熔炼', furnace_clear: '清空熔炉',
      furnace_equip_warn: '⚠️ 熔炼装备可能损失部分材料。',
      anvil_aria: '铁砧·精炼', forge_label: '点击<strong>基础材料(产物)</strong> → 自动放入空槽 · 拖动 → 选择槽(拖动时显示首选槽)',
      anvil_aria_only: '铁砧', forge_btn: '⚒️ 精炼', forge_clear: '清空选择',
      status_msg_default: '将基础材料(产物)拖到铁砧上。钓鱼物品和装备请先在熔炉熔炼。',
      prof_label: '学徒铁匠', prof_count: '{n}次',
      crafted_title: '🛡️ 制作的装备',
      repair_aria: '装备修理', repair_drop_hint: '← 点击或拖动<br>右侧的装备',
      repair_dur_info: '耐久度 --/--', repair_guide_tip: '冲压到发光区域时点击!',
      repair_confirm: '✅ 保存', repair_sidebar_title: '🛡️ 装备列表',
      material_aria: '材料仓库', material_count_title: '📦 材料',
      filter_all: '全部', filter_material: '材料', filter_equipment: '装备', filter_soul: '灵魂', filter_module: '🔩 模块',
      mat_empty: '没有材料。请钓鱼收集材料后刷新。',
      smelt_stock_title: '基础材料', smelt_aria: '仓库种类筛选', smelt_cat_aria: '基础材料分类',
      cat_metal: '金属', cat_electronic: '电子', cat_chemical: '化学', cat_polymer: '聚合物', cat_gem: '宝石', cat_bio: '生物', cat_etc: '其他',
      overlay_title: '正在铁匠铺制作…', overlay_timer: '约{n}秒',
      result_default: '装备', result_saved: '已保存到服务器', goto_dungeon: '⚔️ 在地下城使用',
      material_hint: '拖到<strong>熔炉</strong>熔炼。变成产物后可在铁砧制作装备。',
      sig_title: '名字超棒!', sig_sub: 'AI认为这个装备名字特别帅或可爱。恭喜!',
      custom_title: '🔨 装备名 & 图案设置',
      custom_name_placeholder: '输入装备名', custom_rand_title: '随机名字',
      custom_color: '颜色', custom_eyedropper_title: '吸管 — 从画布提取颜色',
      custom_eraser: '橡皮擦', custom_clear: '全部清除',
      custom_random_pixel: '🎲 随机图案', custom_done: '✅ 完成',
      custom_loading_congrats: '✨ 恭喜!<br>这是您第一次制作的配方!',
      custom_loading_timer: '预计等待{n}秒',
      custom_loading_coin_hint: '🪙 等待越久得越多金币!',
      custom_loading_wait: '请稍候…',
      color_picker_title: '选择颜色', color_picker_eyedropper: '吸管',
      module_aria: '装备改造', module_equip_section: '🛡️ 选择装备', module_inv_title: '🔩 持有模块',
      module_select_first: '请先选择装备', module_craft_toggle: '⚒️ 制作模块',
      module_craft_title: '⚒️ 制作模块', module_craft_slots_label: '材料槽',
      module_craft_slot_count: '{n}/{max}', module_craft_clear: '全部清空',
      module_craft_stock: '持有产物', module_craft_btn: '✨ 制作',
      enhance_aria: '装备强化', enhance_stones: '🗃️ 持有强化道具', enhance_equip: '🛡️ 选择强化的装备',
      enhance_hint: '请选择强化道具和装备', enhance_btn: '✨ 强化',
      tab_materials: '材料', tab_furnace: '熔炉', tab_forge: '精炼', tab_stock: '基础',
      tab_equipment: '装备', tab_repair: '修理', tab_enhance: '强化', tab_modules: '改造',
      forge_done: '⚒️ 精炼完成!',
      forge_failed: '精炼失败',
      smelt_result_label: '熔炼结果',
      smelt_loss_chip: '{emoji}{name} ×{n} 损失',
      smelt_empty: '还没有', smelt_cat_empty: '没有{cat}基础材料',
      module_empty: '没有模块。', module_equipped_tag: '{tier} · 已装备',
      smelt_equip_warn: '⚠️ 熔炼{parts}可能损失部分材料 (回收率约70%)。',
      smelt_preview_prefix: '预计: ',
      smelt_preview_unknown: '🎲 不确定会出什么',
      forge_overlay_bonus: '🪙 精炼奖励预计: +{n} 金币',
      forge_overlay_timer: '约{n}秒',
      forge_overlay_overdue: '超出预计{n}秒',
      forge_overlay_busy: '正在铁匠铺制作…',
      msg_qty_limit: '基础材料只能放入持有数量。',
      msg_slot_full: '槽位已满。 (最多9格)',
      msg_smelt_first: '钓鱼材料/装备必须先在熔炉熔炼。已为您移动到熔炉。',
      msg_anvil_only_outputs: '基础材料只能拖到铁砧。',
      smith_proficiency_label: '铁匠熟练度',
      smith_proficiency_count: '{n}  (+{p}% 加成)',
      msg_drag_to_anvil: '点击产物或拖到指定槽位。位置影响能力值。',
      msg_open_from_game: '只有从游戏内打开此页面时才能在服务器精炼。',
      msg_anvil_only_outputs2: '铁砧只能放基础材料(产物)。',
      msg_forge_ready: '材料{n}个 · [{harm}] · 成功率约{p}%{syn}',
      msg_forge_basic_ready: '基础材料(产物){n}个 — 按"⚒️ 精炼"制作装备。',
      result_failed: '精炼失败', result_broken: '装备损坏了',
      material_history_hint: '制作此装备使用的材料列表。',
      nameless: '无名',
      sound_label: '🔊',
      forge_combo_prefix: '组合',
      desc_stats: '攻击 +{atk} · 防御 +{def} · 速度 +{spd}%{dur}',
      timing_title: '⚒️ 把握时机精炼!',
      timing_sub: '点击或按空格停止',
      no_token: '没有游戏连接(令牌),无法精炼。',
      btn_forging: '精炼中…',
      server_resp_err: '服务器响应错误 — 请重试。',
      network_err: '网络错误,无法保存到服务器。',
      list_loading: '加载中…',
      list_load_fail: '加载列表失败。',
      list_no_crafted: '还没有制作的装备。',
      list_network_err: '网络错误,无法加载列表。',
      ecl_timer_remaining: '预计等待 {n}秒',
      ecl_timer_overdue: '超出预计 +{n}秒',
      forge_specific: '⚒️ 精炼{label}',
      repair_dur_info_full: '耐久度: {cur} / {max}',
      repair_coin_info: '🪙 {n}  (-{spent})',
      btn_processing: '处理中…',
      btn_repair_done: '✅ 修理完成',
      empty_dash: '—',
      modules_label: '🔩 模块',
      no_crafted: '没有制作的装备',
      enhance_with_item: '{emoji} {sname}强化[{ename}]',
      enhance_pick_item: '请选择强化道具',
      enhance_pick_equip: '请选择强化的装备',
      enhance_busy: '强化中…',
      enhance_fail_default: '强化失败',
      enhance_success: '✅ 强化成功!',
      enhance_fail_msg: '💔 强化失败… 仅消耗道具。',
      error_occurred: '发生错误。',
      list_load_fail_short: '加载失败',
      no_gear: '没有装备',
      forge_failed_msg: '精炼失败! 部分材料已回收。',
      forge_basic_drag_hint: '将基础材料(产物)拖到铁砧。',
      result_desc_template: '成功率 {p}% · 强度 [{strength}]{gain}{syn}{ret}',
      module_no_modules: '没有模块 — 请在下方制作',
      module_no_outputs: '没有产物',
      module_craft_busy: '制作中…',
      module_craft_fail: '制作失败',
      module_craft_success: '✅ {name} 制作完成!',
      module_craft_close: '✕ 关闭',
      desc_stats_full: '{fit}{base}\n攻击 +{atk} · 防御 +{def} · 速度 +{spd}%{dur}',
      t5_t1_title: '欢迎来到铁匠铺!', t5_t1_body: '将钓鱼物品熔炼成材料,<br>然后用这些材料制作和强化装备。',
      t5_t2_title: '熔炉 — 熔炼物品', t5_t2_body: '<b>钓鱼获得的废品</b>放入熔炉<br>会变成材料(铁/铜/宝石等)。<br>名词等级越高产出越多!',
      t5_t3_title: '铁砧 — 制作装备', t5_t3_body: '将<b>产物材料</b>放到铁砧制作<br>武器/防具/饰品。<br>材料组合决定能力值。',
      t5_t4_title: '用模块强化', t5_t4_body: '将<b>模块</b>插入装备槽可增加能力值。<br>模块也可用材料制作!',
      t5_t5_title: '修理', t5_t5_body: '地下城中磨损的装备可<b>用金币修理</b>。<br>耐久归0前请修理!',
      t5_t6_title: '地下城联动', t5_t6_body: '这里制作的装备可在<b>地下城探险 (Game7)</b>装备使用。<br>好装备 = 更深地下城!',
    },
  };
  function tr(key, params) {
    const dict = _I18N[_LANG] || _I18N.ko;
    let s = dict[key] || _I18N.ko[key] || key;
    if (params) for (const k in params) s = s.split('{' + k + '}').join(String(params[k]));
    return s;
  }
  function applyHtmlI18n() {
    try { document.documentElement.lang = _LANG; document.title = tr('page_title'); } catch {}
    const setText = (sel, key) => { const el = document.querySelector(sel); if (el) el.textContent = tr(key); };
    const setHtml = (sel, key) => { const el = document.querySelector(sel); if (el) el.innerHTML = tr(key); };
    // 용광로
    setText('.furnace-title', 'furnace_title');
    setHtml('.furnace-hint', 'furnace_hint');
    setText('#btnSmelt', 'furnace_smelt');
    setText('#btnClearFurnace', 'furnace_clear');
    setText('#furnaceEquipWarn', 'furnace_equip_warn');
    // 모루
    setHtml('.forge-slots-label', 'forge_label');
    setText('#btnForge', 'forge_btn');
    setText('#btnClear', 'forge_clear');
    setText('#statusMsg', 'status_msg_default');
    setText('#profLabel', 'prof_label');
    const profCnt = document.getElementById('profCount'); if (profCnt) profCnt.textContent = tr('prof_count', { n: 0 });
    // 제작 장비
    setText('.forge-extra .log-title', 'crafted_title');
    // 수리
    setHtml('#repairDropHint', 'repair_drop_hint');
    setText('#repairDurInfo', 'repair_dur_info');
    setText('.repair-guide-tip', 'repair_guide_tip');
    setText('#repairConfirmBtn', 'repair_confirm');
    setText('.repair-sidebar-title', 'repair_sidebar_title');
    // 재료
    const mcb = document.getElementById('matCountBadge');
    const mc = document.querySelector('#materialDock .log-title');
    if (mc) mc.innerHTML = tr('material_count_title') + ' <span id="matCountBadge" class="mat-badge">' + (mcb ? mcb.textContent : '0') + '</span>';
    document.querySelectorAll('#materialDockFilters .material-dock-filter').forEach(b => {
      const f = b.dataset.filter;
      const key = f === 'all' ? 'filter_all' : f === 'material' ? 'filter_material' :
                  f === 'equipment' ? 'filter_equipment' : f === 'soul' ? 'filter_soul' :
                  f === 'module' ? 'filter_module' : null;
      if (key) b.textContent = tr(key);
    });
    setText('.log-empty', 'mat_empty');
    // 기초 재료
    setText('.smelt-stock-title', 'smelt_stock_title');
    document.querySelectorAll('#smeltCategoryFilters .smelt-filter').forEach(b => {
      const c = b.dataset.cat;
      const key = c === 'all' ? 'filter_all' : c === 'metal' ? 'cat_metal' :
                  c === 'electronic' ? 'cat_electronic' : c === 'chemical' ? 'cat_chemical' :
                  c === 'polymer' ? 'cat_polymer' : c === 'gem' ? 'cat_gem' :
                  c === 'bio' ? 'cat_bio' : c === 'etc' ? 'cat_etc' : null;
      if (key) b.textContent = tr(key);
    });
    // 오버레이
    setText('#forgeOverlayTitle', 'overlay_title');
    setText('#forgeOverlayTimer', tr('overlay_timer', { n: 20 }));
    // 결과
    setText('#resultRarity', 'result_default');
    setText('.result-added', 'result_saved');
    setText('#btn-go-dungeon', 'goto_dungeon');
    // 재료 상세
    setHtml('.material-detail-hint', 'material_hint');
    // 시그니처
    setText('#signatureCelebrateTitle', 'sig_title');
    setText('.signature-celebrate-sub', 'sig_sub');
    setText('#signatureCelebrateOk', 'confirm');
    // 커스터마이즈
    setText('#equipCustomizeTitle', 'custom_title');
    const ein = document.getElementById('equipNameInput'); if (ein) ein.placeholder = tr('custom_name_placeholder');
    const erb = document.getElementById('equipRandomNameBtn'); if (erb) erb.title = tr('custom_rand_title');
    setText('.equip-color-btn-text', 'custom_color');
    const eed = document.getElementById('equipEyedropperBtn'); if (eed) eed.title = tr('custom_eyedropper_title');
    setText('#equipEraserBtn', 'custom_eraser');
    setText('#equipClearBtn', 'custom_clear');
    setText('#equipRandomPixelBtn', 'custom_random_pixel');
    setText('#equipCustomizeDoneBtn', 'custom_done');
    setHtml('.ecl-congrats', 'custom_loading_congrats');
    const eclTimer = document.getElementById('eclTimer'); if (eclTimer) eclTimer.textContent = tr('custom_loading_timer', { n: 20 });
    setText('.ecl-coin-hint', 'custom_loading_coin_hint');
    setText('.ecl-wait', 'custom_loading_wait');
    // 색상 피커
    setText('.cpk-title', 'color_picker_title');
    const ce = document.getElementById('cpkEyedropper'); if (ce) ce.title = tr('color_picker_eyedropper');
    // 개조
    document.querySelectorAll('.module-section-title').forEach(el => {
      if (el.textContent.indexOf('장비 선택') >= 0) el.textContent = tr('module_equip_section');
      else if (el.textContent.indexOf('보유 모듈') >= 0) el.textContent = tr('module_inv_title');
      else if (el.id === 'moduleSlotTitle') el.textContent = tr('module_select_first');
      else if (el.textContent.indexOf('모듈 제작') >= 0) el.textContent = tr('module_craft_title');
    });
    setText('#moduleCraftToggleBtn', 'module_craft_toggle');
    setText('#moduleCraftClearBtn', 'module_craft_clear');
    setText('#moduleCraftBtn', 'module_craft_btn');
    document.querySelectorAll('.module-craft-area-label').forEach(el => {
      if (el.textContent.indexOf('재료 슬롯') >= 0) {
        const cntEl = el.querySelector('#moduleCraftSlotCount');
        el.innerHTML = tr('module_craft_slots_label') + ' <span class="module-craft-slot-count" id="moduleCraftSlotCount">' + (cntEl ? cntEl.textContent : '0/8') + '</span>';
      } else if (el.textContent.indexOf('보유 산출물') >= 0) el.textContent = tr('module_craft_stock');
    });
    // 강화
    document.querySelectorAll('.enhance-area-title').forEach(el => {
      if (el.textContent.indexOf('강화 아이템') >= 0) el.textContent = tr('enhance_stones');
      else if (el.textContent.indexOf('강화할 장비') >= 0) el.textContent = tr('enhance_equip');
    });
    setText('#enhanceHint', 'enhance_hint');
    setText('#enhanceBtn', 'enhance_btn');
    // 모바일 탭
    document.querySelectorAll('.mobile-tab').forEach(b => {
      const tab = b.dataset.tab;
      const key = 'tab_' + tab;
      const lblEl = b.querySelector('.mobile-tab-label');
      if (lblEl) lblEl.textContent = tr(key);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyHtmlI18n);
  else applyHtmlI18n();

  /* ── 캐릭터 위젯 — React 컴포넌트와 동일 기능 (드래그 바, 리사이즈 핸들, localStorage 저장) ── */
  function mountCharacterWidget(userId, { app = 'platform', bottomOffset = 0, storageKey = 'charwidget' } = {}) {
    if (document.getElementById('assistant-widget')) return;
    const IFRAME_SRC = 'https://assistant-chi-two.vercel.app';
    const NATURAL_W = 220, NATURAL_H = 390, ASPECT = NATURAL_H / NATURAL_W;
    const DESKTOP_W = 220, MOBILE_W = 140, MIN_W = 80, MAX_W = 360;
    const isMobile = () => window.innerWidth < 640;
    const load = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); if (v != null) return v; } catch (e) {} return f; };
    const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
    const defaultSize = { w: isMobile() ? MOBILE_W : DESKTOP_W, h: Math.round((isMobile() ? MOBILE_W : DESKTOP_W) * ASPECT) };
    const state = {
      pos:  load(storageKey + '_pos',  { x: -1, y: -1 }),
      size: load(storageKey + '_size', defaultSize),
      blocked: false,
    };

    const TOOLBAR_H = 32;

    const wrapper = document.createElement('div');
    wrapper.id = 'assistant-widget';
    const pos0 = state.pos.x >= 0 ? `left:${state.pos.x}px;top:${state.pos.y}px;` : `right:0;bottom:${bottomOffset}px;`;
    wrapper.style.cssText = `position:fixed;${pos0}width:${state.size.w}px;height:${state.size.h}px;z-index:9999;background:transparent;`;

    const iframe = document.createElement('iframe');
    iframe.src = `${IFRAME_SRC}?userId=${encodeURIComponent(userId)}&app=${encodeURIComponent(app)}`;
    iframe.setAttribute('allow', 'autoplay');
    function applyIframeStyle() {
      const scale = state.size.w / NATURAL_W;
      iframe.style.cssText = `width:${NATURAL_W}px;height:${NATURAL_H}px;border:none;background:transparent;pointer-events:${state.blocked ? 'none' : 'auto'};transform:scale(${scale});transform-origin:bottom right;position:absolute;bottom:0;right:0;will-change:transform;`;
    }
    applyIframeStyle();
    wrapper.appendChild(iframe);

    const blocker = document.createElement('div');
    blocker.style.cssText = 'position:absolute;inset:0;z-index:2;display:none;';
    wrapper.appendChild(blocker);

    // 툴바 — 캐릭터 위에 오버레이
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `position:absolute;top:0;left:0;right:0;height:${TOOLBAR_H}px;display:flex;align-items:center;background:rgba(30,30,40,0.85);border-radius:8px 8px 0 0;box-shadow:0 -1px 0 rgba(255,255,255,0.15) inset;z-index:3;`;

    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `width:32px;height:${TOOLBAR_H}px;cursor:nwse-resize;display:flex;align-items:center;justify-content:center;`;
    const resizeInner = document.createElement('div');
    resizeInner.style.cssText = 'width:12px;height:12px;border-top:2.5px solid #fff;border-left:2.5px solid #fff;border-radius:2px 0 0 0;';
    resizeHandle.appendChild(resizeInner);
    toolbar.appendChild(resizeHandle);

    const dragBar = document.createElement('div');
    dragBar.style.cssText = `flex:1;height:${TOOLBAR_H}px;cursor:grab;display:flex;align-items:center;justify-content:center;`;
    const dragInner1 = document.createElement('div');
    dragInner1.style.cssText = 'width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,0.6);';
    const dragInner2 = document.createElement('div');
    dragInner2.style.cssText = 'width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,0.6);margin-left:4px;';
    dragBar.appendChild(dragInner1); dragBar.appendChild(dragInner2);
    toolbar.appendChild(dragBar);

    wrapper.appendChild(toolbar);
    document.body.appendChild(wrapper);

    function setBlocked(b) { state.blocked = b; blocker.style.display = b ? 'block' : 'none'; applyIframeStyle(); }
    function switchToLeftTop() {
      if (state.pos.x >= 0) return;
      const r = wrapper.getBoundingClientRect();
      state.pos = { x: r.left, y: r.top };
      wrapper.style.right = ''; wrapper.style.bottom = '';
      wrapper.style.left = r.left + 'px'; wrapper.style.top = r.top + 'px';
    }
    function startDrag(e) {
      e.preventDefault(); e.stopPropagation();
      switchToLeftTop();
      const sMx = e.touches ? e.touches[0].clientX : e.clientX;
      const sMy = e.touches ? e.touches[0].clientY : e.clientY;
      const sX = state.pos.x, sY = state.pos.y;
      setBlocked(true);
      function onMove(ev) {
        if (ev.cancelable) ev.preventDefault();
        const t = ev.touches ? ev.touches[0] : ev;
        const nx = Math.max(0, Math.min(window.innerWidth  - state.size.w, sX + t.clientX - sMx));
        const ny = Math.max(0, Math.min(window.innerHeight - state.size.h, sY + t.clientY - sMy));
        state.pos = { x: nx, y: ny };
        wrapper.style.left = nx + 'px'; wrapper.style.top = ny + 'px';
      }
      function onUp() {
        setBlocked(false); save(storageKey + '_pos', state.pos);
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp);
      }
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onUp);
    }
    function startResize(e) {
      e.preventDefault(); e.stopPropagation();
      const sMx = e.touches ? e.touches[0].clientX : e.clientX;
      const sMy = e.touches ? e.touches[0].clientY : e.clientY;
      const sW = state.size.w;
      setBlocked(true);
      function onMove(ev) {
        if (ev.cancelable) ev.preventDefault();
        const t = ev.touches ? ev.touches[0] : ev;
        const delta = ((sMx - t.clientX) + (sMy - t.clientY)) / 2;
        const nw = Math.max(MIN_W, Math.min(MAX_W, sW + delta));
        state.size = { w: Math.round(nw), h: Math.round(nw * ASPECT) };
        wrapper.style.width = state.size.w + 'px';
        wrapper.style.height = state.size.h + 'px';
        applyIframeStyle();
      }
      function onUp() {
        setBlocked(false); save(storageKey + '_size', state.size);
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp);
      }
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onUp);
    }
    dragBar.addEventListener('mousedown', startDrag);
    dragBar.addEventListener('touchstart', startDrag, { passive: false });
    resizeHandle.addEventListener('mousedown', startResize);
    resizeHandle.addEventListener('touchstart', startResize, { passive: false });

    document.addEventListener('mousemove', (e) => {
      const p = state.pos, s = state.size;
      const elX = p.x >= 0 ? p.x : window.innerWidth  - s.w;
      const elY = p.y >= 0 ? p.y : window.innerHeight - s.h - bottomOffset;
      const scale = s.w / NATURAL_W;
      iframe.contentWindow && iframe.contentWindow.postMessage({
        type: 'assistant:mousemove',
        x: (e.clientX - elX) / scale,
        y: (e.clientY - elY) / scale,
      }, '*');
    });
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'assistant:navigate' && typeof e.data.url === 'string') {
        window.open(e.data.url, '_blank');
      }
    });
  }

  /* ── 튜토리얼 시스템 — 첫 방문 자동 오버레이 + ? 버튼으로 재시도 ── */
  function mountTutorial({ storageKey, steps, helpButtonPos = { top: 12, left: 12 } }) {
    if (document.getElementById('_tutorial-help-btn')) return;
    const seenKey = storageKey + '_seen';

    const helpBtn = document.createElement('button');
    helpBtn.id = '_tutorial-help-btn';
    helpBtn.textContent = '?';
    helpBtn.title = tr('tutorial_help');
    helpBtn.style.cssText = `position:fixed;top:${helpButtonPos.top}px;left:${helpButtonPos.left}px;width:36px;height:36px;border-radius:50%;background:rgba(30,30,40,0.85);color:#fff;border:1.5px solid rgba(255,255,255,0.4);font-size:18px;font-weight:bold;cursor:pointer;z-index:9998;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:transform 0.15s;`;
    helpBtn.addEventListener('mouseenter', () => helpBtn.style.transform = 'scale(1.1)');
    helpBtn.addEventListener('mouseleave', () => helpBtn.style.transform = 'scale(1)');
    helpBtn.addEventListener('click', () => showTutorial());
    document.body.appendChild(helpBtn);

    function showTutorial() {
      if (document.getElementById('_tutorial-modal')) return;
      let idx = 0;

      const backdrop = document.createElement('div');
      backdrop.id = '_tutorial-modal';
      backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;';

      const card = document.createElement('div');
      card.style.cssText = 'max-width:420px;width:100%;background:#1e1e28;color:#fff;border-radius:16px;padding:24px;box-shadow:0 12px 48px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);';
      backdrop.appendChild(card);

      const emoji = document.createElement('div');
      emoji.style.cssText = 'font-size:56px;text-align:center;margin-bottom:12px;';
      card.appendChild(emoji);

      const title = document.createElement('div');
      title.style.cssText = 'font-size:20px;font-weight:bold;text-align:center;margin-bottom:8px;color:#fff;';
      card.appendChild(title);

      const body = document.createElement('div');
      body.style.cssText = 'font-size:14px;line-height:1.6;text-align:center;color:rgba(255,255,255,0.85);margin-bottom:20px;min-height:60px;';
      card.appendChild(body);

      const dots = document.createElement('div');
      dots.style.cssText = 'display:flex;justify-content:center;gap:6px;margin-bottom:16px;';
      card.appendChild(dots);

      const nav = document.createElement('div');
      nav.style.cssText = 'display:flex;gap:8px;';
      card.appendChild(nav);

      const prevBtn = document.createElement('button');
      prevBtn.textContent = tr('t_prev');
      prevBtn.style.cssText = 'flex:1;padding:10px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:8px;cursor:pointer;font-size:14px;';
      nav.appendChild(prevBtn);

      const skipBtn = document.createElement('button');
      skipBtn.textContent = tr('t_skip');
      skipBtn.style.cssText = 'flex:1;padding:10px;background:transparent;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:14px;';
      nav.appendChild(skipBtn);

      const nextBtn = document.createElement('button');
      nextBtn.style.cssText = 'flex:1;padding:10px;background:#3b82f6;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;';
      nav.appendChild(nextBtn);

      const dontShow = document.createElement('label');
      dontShow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;color:rgba(255,255,255,0.5);cursor:pointer;justify-content:center;';
      dontShow.innerHTML = '<input type="checkbox" id="_tutorial-dontshow" style="cursor:pointer;"> ' + tr('t_dont_show');
      card.appendChild(dontShow);

      function render() {
        const s = steps[idx];
        emoji.textContent = s.emoji || '✨';
        title.textContent = s.title || '';
        body.innerHTML = s.body || '';
        prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = idx === steps.length - 1 ? tr('t_start') : tr('t_next');
        dots.innerHTML = '';
        steps.forEach((_, i) => {
          const d = document.createElement('div');
          d.style.cssText = `width:6px;height:6px;border-radius:50%;background:${i === idx ? '#3b82f6' : 'rgba(255,255,255,0.3)'};`;
          dots.appendChild(d);
        });
      }
      render();

      function close() {
        const cb = card.querySelector('#_tutorial-dontshow');
        if (cb && cb.checked) localStorage.setItem(seenKey, '1');
        backdrop.remove();
      }
      prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
      nextBtn.addEventListener('click', () => {
        if (idx < steps.length - 1) { idx++; render(); }
        else { localStorage.setItem(seenKey, '1'); backdrop.remove(); }
      });
      skipBtn.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

      document.body.appendChild(backdrop);
    }

    if (!localStorage.getItem(seenKey)) {
      setTimeout(showTutorial, 800);
    }
  }

  const FORGE_MATERIALS_KEY = 'WEB_ALP_SPACE_FISHING_FORGE_V1';
  const FORGE_SPENT_UIDS_KEY = 'WEB_ALP_FORGE_SPENT_UIDS_V1';

  const urlParams = new URLSearchParams(window.location.search);
  const alpToken = urlParams.get('token');
  const platformApi = window.__ALP_PLATFORM_API__ || '';
  const platformWeb = urlParams.get('platformWeb') || '';

  // 웹으로 돌아가기 버튼
  if (platformWeb) {
    const btn = document.createElement('a');
    btn.href = platformWeb + '/games';
    btn.textContent = tr('back_to_games');
    btn.style.cssText = [
      'position:fixed;top:12px;left:12px;z-index:9999',
      'background:rgba(0,0,0,0.35);color:#ccc',
      'border:1px solid rgba(255,255,255,0.2);border-radius:20px',
      'padding:5px 12px;font-size:0.78rem;text-decoration:none',
      'backdrop-filter:blur(6px);transition:background .15s',
    ].join(';');
    btn.onmouseover = () => { btn.style.background = 'rgba(0,0,0,0.6)'; btn.style.color = '#fff'; };
    btn.onmouseout  = () => { btn.style.background = 'rgba(0,0,0,0.35)'; btn.style.color = '#ccc'; };
    document.body.appendChild(btn);
  }

  let _sessionExpiredShown = false;
  function showSessionExpiredBanner() {
    if (_sessionExpiredShown) return;
    _sessionExpiredShown = true;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0 0 auto;z-index:99999;background:#dc2626;color:#fff;' +
      'padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.4)';
    el.innerHTML = '<span>🔒 로그인이 만료됐습니다. 다시 로그인해 주세요.</span>' +
      '<a href="/ko/login" style="background:#fff;color:#dc2626;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none">로그인</a>';
    document.body.prepend(el);
  }
  function apiFetch(url, init) {
    return fetch(url, init).then(res => {
      if (res.status === 401 && alpToken) showSessionExpiredBanner();
      return res;
    });
  }

  let forgeInFlight = false;
  let smeltInFlight = false;
  let serverMeltLost = []; // 마지막 장비 녹임에서 소실된 재료 목록
  let totalCoins = 0;
  let forgeStartAt = 0; // 제련 시작 시각 (Date.now)
  /** 모루는 산출물(smelt)만 허용 — 최소 1개, 슬롯 9칸. */
  const MIN_SMELT_MATERIALS_FOR_FORGE = 1;

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
  /** 9칸 고정 모루 슬롯 (null = 비어있음) */
  let selected = new Array(9).fill(null);
  /** 용광로에 넣은 재료 (낚시 재료·장비) */
  let furnaceSelected = [];
  /** 용광로에 드래그된 모듈 목록 */
  let furnaceModulesPending = [];
  /** 보관함 모듈 탭 — API에서 로드한 풀 */
  let dockModulePool = [];
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

  let smeltStockCache = {}; // 서버에서 가져온 재료 재고 (localStorage 사용 안 함)
  const FORGE_DRAG_MATERIAL_UID = 'application/x-forge-material-uid';
  const FORGE_DRAG_SMELT_UID = 'application/x-forge-smelt-id';
  const FORGE_DRAG_MODULE_ID = 'application/x-forge-module-id';
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
    return smeltStockCache;
  }

  function saveSmeltStock(stock) {
    smeltStockCache = (stock && typeof stock === 'object') ? stock : {};
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
      const res = await apiFetch(`${platformApi}/api/smelt/stock`, {
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
      const serverStock = data && data.stock && typeof data.stock === 'object' ? data.stock : {};
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
    label.textContent = tr('smelt_result_label');
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
      chip.textContent = tr('smelt_loss_chip', { emoji: l.emoji || '', name: l.name, n: l.count });
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
      const res = await apiFetch(`${platformApi}/api/coins`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (res.ok) {
        const d = await res.json();
        if (typeof d.coins === 'number') { totalCoins = d.coins; updateCoinDisplay(); }
      }
    } catch { /* 비치명 */ }
    // 캐릭터 iframe 삽입 (1회)
    if (!document.getElementById('assistant-widget')) {
      try {
        const meRes = await apiFetch(`${platformApi}/api/auth/me`, {
          headers: { Authorization: `Bearer ${alpToken}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          const cuid = me?.user?.commonUserId || me?.user?.id;
          if (cuid) mountCharacterWidget(cuid, { app: 'platform', storageKey: 'alp_charwidget' });
        }
      } catch { /* 비치명 */ }
    }
  }

  async function grantForgeBonus(elapsedMs) {
    if (!alpToken || !platformApi || elapsedMs <= 0) return 0;
    try {
      const res = await apiFetch(`${platformApi}/api/ai/fishing-scan-bonus`, {
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
      smeltStockListEl.innerHTML = '<span class="smelt-pill smelt-pill--empty">' + tr('smelt_empty') + '</span>';
      return;
    }
    const filtered = entries.filter((e) => matchSmeltCategory(e, smeltCategory));
    if (filtered.length === 0) {
      const catLabel = SMELT_CATEGORY_NAMES[smeltCategory] || '선택한 카테고리';
      smeltStockListEl.innerHTML = '<span class="smelt-pill smelt-pill--empty">' + escapeHtml(tr('smelt_cat_empty', { cat: catLabel })) + '</span>';
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
        ? `[${pillStrInfo.label}] 남은 ${displayQty}개 · 클릭하거나 원하는 슬롯으로 드래그 (모루에 ${onAnvil}개 올려 둠)${synHints ? '\n시너지:\n' + synHints : ''}`
        : `모루에 모두 올려 두었습니다. 「선택 비우기」로 돌려 받을 수 있어요.${synHints ? '\n시너지:\n' + synHints : ''}`;
      pill.innerHTML = `<span aria-hidden="true">${entry.emoji || '◆'}</span> ${escapeHtml(entry.name || '')} <span class="smelt-strength ${pillStrInfo.cls}">${pillStrInfo.label}</span> <strong>${displayQty}</strong>`;

      if (canAdd) {
        pill.addEventListener('click', () => tryAddSmeltToAnvilBySid(sid));
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

  // ── 보관함 모듈 필터 ──────────────────────────────────────────
  const MODULE_TIER_LABEL = { common: '일반', rare: '희귀', epic: '에픽', legendary: '전설' };
  const MODULE_TIER_YIELD = { common: 1, rare: 2, epic: 3, legendary: 5 };

  async function fetchDockModules() {
    try {
      const res = await apiFetch(`${platformApi}/api/modules`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      const data = await res.json();
      dockModulePool = (data.modules || []);
    } catch {
      dockModulePool = [];
    }
  }

  function renderDockModules() {
    if (!materialListEl) return;
    if (matCountBadge) matCountBadge.textContent = String(dockModulePool.length);
    materialListEl.innerHTML = '';
    if (dockModulePool.length === 0) {
      materialListEl.innerHTML = '<p class="log-empty">' + tr('module_empty') + '</p>';
      renderMaterialDockFilterUi();
      syncScrollOverflow();
      return;
    }
    renderMaterialDockFilterUi();
    dockModulePool.forEach((mod) => {
      const isPending = furnaceModulesPending.some((m) => m.id === mod.id);
      const row = document.createElement('div');
      row.className = 'inv-item inv-item--draggable' + (isPending ? ' inv-item--furnace' : '');
      row.draggable = !mod.equippedTo; // 부착 중이면 드래그 불가
      const tierLabel = MODULE_TIER_LABEL[mod.tier] || mod.tier;
      const thumb = document.createElement('div');
      thumb.className = 'inv-thumb';
      thumb.textContent = '🔩';
      thumb.style.fontSize = '1.4rem';
      thumb.style.display = 'flex';
      thumb.style.alignItems = 'center';
      thumb.style.justifyContent = 'center';
      row.appendChild(thumb);
      const nameEl = document.createElement('span');
      nameEl.className = 'inv-name';
      nameEl.textContent = mod.name;
      row.appendChild(nameEl);
      const tagEl = document.createElement('span');
      tagEl.className = 'inv-tag';
      tagEl.textContent = mod.equippedTo ? tr('module_equipped_tag', { tier: tierLabel }) : tierLabel;
      row.appendChild(tagEl);

      if (mod.equippedTo) {
        row.title = '장비에서 분리해야 녹일 수 있습니다';
        row.style.opacity = '0.45';
      } else {
        row.title = '끌어서 용광로에 놓아 녹이세요';
        row.addEventListener('dragstart', (e) => {
          if (!e.dataTransfer) return;
          e.dataTransfer.setData(FORGE_DRAG_MODULE_ID, mod.id);
          e.dataTransfer.setData('text/plain', `module:${mod.id}`);
          e.dataTransfer.effectAllowed = 'move';
          row.classList.add('inv-item--dragging');
        });
        row.addEventListener('dragend', () => {
          row.classList.remove('inv-item--dragging');
          clearForgeDnDHover();
        });
        // 클릭으로도 용광로 토글
        row.addEventListener('click', () => {
          if (isPending) {
            furnaceModulesPending = furnaceModulesPending.filter((m) => m.id !== mod.id);
          } else {
            if (!furnaceModulesPending.some((m) => m.id === mod.id)) {
              furnaceModulesPending.push(mod);
            }
          }
          syncFurnaceUi();
          renderDockModules();
        });
      }
      materialListEl.appendChild(row);
    });
    syncScrollOverflow();
  }
  // ─────────────────────────────────────────────────────────────

  function syncFurnaceUi() {
    if (furnaceSlotsEl) {
      furnaceSlotsEl.innerHTML = '';
      const totalItems = furnaceSelected.length + furnaceModulesPending.length;
      if (totalItems === 0) {
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
        // 모듈 칩
        furnaceModulesPending.forEach((mod) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'furnace-chip furnace-chip--module';
          chip.title = '클릭하여 빼기';
          const label = mod.name.length > 18 ? `${mod.name.slice(0, 16)}…` : mod.name;
          chip.textContent = `🔩 ${label}`;
          chip.addEventListener('click', () => {
            furnaceModulesPending = furnaceModulesPending.filter((x) => x.id !== mod.id);
            syncFurnaceUi();
            if (materialDockFilter === 'module') renderDockModules();
          });
          furnaceSlotsEl.appendChild(chip);
        });
      }
    }
    const hasAnything = furnaceSelected.length > 0 || furnaceModulesPending.length > 0;
    if (btnSmelt) btnSmelt.disabled = !hasAnything;
    // 소실 경고: 장비 또는 모듈이 있으면 표시
    const equipItems = furnaceSelected.filter((m) => isEquipmentMaterial(m));
    const hasLossRisk = equipItems.length > 0 || furnaceModulesPending.length > 0;
    if (furnaceEquipWarnEl) {
      furnaceEquipWarnEl.classList.toggle('hidden', !hasLossRisk);
      if (hasLossRisk) {
        const parts = [];
        if (equipItems.length > 0) parts.push('장비');
        if (furnaceModulesPending.length > 0) parts.push('모듈');
        furnaceEquipWarnEl.textContent = tr('smelt_equip_warn', { parts: parts.join('·') });
      }
    }
    if (furnacePreviewEl) {
      const totalItems = furnaceSelected.length + furnaceModulesPending.length;
      if (totalItems === 0) {
        furnacePreviewEl.textContent = '';
      } else {
        const parts = [];
        // 장비 예상 재료
        const catchItems = furnaceSelected.filter((m) => !isEquipmentMaterial(m));
        for (const m of equipItems) {
          const mats = equipSourceMatsMap.get(String(m.equipmentId)) || [];
          for (const sm of mats.filter((x) => x.kind === 'smelt')) {
            const meta = smeltProductMeta(sm.id);
            parts.push(`${meta.emoji} ${meta.name}`);
          }
        }
        if (catchItems.length > 0) parts.push('?');
        // 모듈 예상 재료
        const MODULE_YIELD = { common: 1, rare: 2, epic: 3, legendary: 5 };
        for (const mod of furnaceModulesPending) {
          const y = MODULE_YIELD[mod.tier] || 1;
          const expected = Math.round(y * 0.7); // 70% 회수율 적용
          parts.push(`🔩 ${mod.name} (~${expected}개)`);
        }
        furnacePreviewEl.textContent = parts.length > 0 ? tr('smelt_preview_prefix') + parts.join(', ') : tr('smelt_preview_unknown');
      }
    }
    renderSmeltStock();
  }

  async function smeltFurnace() {
    const hasAnything = furnaceSelected.length > 0 || furnaceModulesPending.length > 0;
    if (!hasAnything || smeltInFlight) return;
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

    const moduleIds = furnaceModulesPending.map((m) => m.id);
    const needsServer = serverCatches.length > 0 || serverEquipment.length > 0 || moduleIds.length > 0;
    if (needsServer && (!alpToken || !platformApi)) {
      setFurnaceMsg('낚시 재료·장비·모듈을 녹이려면 게임에서 이 화면을 연 상태여야 해요.');
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
        const res = await apiFetch(`${platformApi}/api/smelt/melt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${alpToken}`,
          },
          body: JSON.stringify({ catchIds, equipmentIds, moduleIds }),
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
        if (Array.isArray(data.lost) && data.lost.length > 0) {
          serverMeltLost = data.lost;
        } else {
          serverMeltLost = [];
        }
        // 모듈 녹임 성공 → 목록 정리
        if (moduleIds.length > 0) {
          furnaceModulesPending = [];
          if (materialDockFilter === 'module') {
            await fetchDockModules();
            renderDockModules();
          }
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
      const meltCount = toMelt.length + moduleIds.length;
      setFurnaceMsg(`${meltCount}개를 녹였습니다.`);
      serverMeltLost = [];
      renderSmeltStock();
      void refreshCraftedList();
      window.setTimeout(() => setFurnaceMsg(''), 3000);
    } catch {
      setFurnaceMsg('네트워크 오류로 녹이기에 실패했어요.');
      window.setTimeout(() => setFurnaceMsg(''), 4200);
    } finally {
      smeltInFlight = false;
      const stillHas = furnaceSelected.length > 0 || furnaceModulesPending.length > 0;
      if (btnSmelt) btnSmelt.disabled = !stillHas;
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
    forgeOverlayBonusEl.textContent = prev.includes(tr('forge_combo_prefix')) ? `${prev}  ${coinLine}` : coinLine;
    forgeOverlayBonusEl.classList.remove('forge-overlay-bonus--hidden');
  }

  /** 경과 초 → 예상 코인 (서버와 동일 공식: 20초당 100코인, 최대 200) */
  function calcForgeExpectedCoins(elapsedSec) {
    return Math.min(200, Math.round((elapsedSec / 20) * 100));
  }

  function updateForgeOverlayBonusEstimate(elapsedSec) {
    if (!forgeOverlayBonusEl) return;
    const coins = calcForgeExpectedCoins(elapsedSec);
    forgeOverlayBonusEl.textContent = tr('forge_overlay_bonus', { n: coins });
    forgeOverlayBonusEl.classList.remove('forge-overlay-bonus--hidden');
  }

  /** 20→0초 예상, 이후 예상시간 N초 초과로 증가 + 실시간 보상 예상 */
  function startForgeOverlayTimer() {
    stopForgeOverlayTimer();
    hideForgeOverlayScanBonus();
    if (!forgeOverlayTimerEl) return;
    let countdown = 20;
    let totalElapsed = 0;
    forgeOverlayTimerEl.textContent = tr('forge_overlay_timer', { n: countdown });
    updateForgeOverlayBonusEstimate(totalElapsed);
    forgeOverlayCountdownId = window.setInterval(() => {
      totalElapsed += 1;
      countdown -= 1;
      if (countdown >= 0) {
        forgeOverlayTimerEl.textContent = tr('forge_overlay_timer', { n: countdown });
      } else {
        const exceed = -countdown;
        forgeOverlayTimerEl.textContent = tr('forge_overlay_overdue', { n: exceed });
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
      if (forgeOverlayTitleEl) forgeOverlayTitleEl.textContent = tr('forge_overlay_busy');
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
    const items = Array.isArray(sel) ? sel.filter(Boolean) : [];
    if (items.length < MIN_SMELT_MATERIALS_FOR_FORGE) return true;
    return items.some((m) => !isSmeltMaterial(m));
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
    return selected.filter((m) => m && isSmeltMaterial(m) && String(m.smeltId).trim() === sid).length;
  }

  function tryAddSmeltToAnvilBySid(sidRaw) {
    const sid = String(sidRaw || '').trim();
    if (!sid) return false;
    const latestStock = cloneSmeltStock(loadSmeltStock());
    const latest = latestStock[sid];
    const maxCount = latest && typeof latest.count === 'number' ? latest.count : 0;
    const inSelected = countSelectedSmeltById(sid);
    if (inSelected >= maxCount) {
      if (statusMsgEl) statusMsgEl.textContent = tr('msg_qty_limit');
      syncForgeUi();
      return true;
    }
    const emptyIdx = selected.indexOf(null);
    if (emptyIdx < 0) {
      if (statusMsgEl) statusMsgEl.textContent = tr('msg_slot_full');
      return true;
    }
    selected[emptyIdx] = makeSmeltSelectionMaterial(latest || { id: sid, name: sid, emoji: '◆' });
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
    const smeltUsed = used.filter((m) => m && isSmeltMaterial(m));
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
      const res = await apiFetch(`${platformApi}/api/catches/inventory?limit=200`, {
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
    return types.includes(FORGE_DRAG_MATERIAL_UID) || types.includes(FORGE_DRAG_SMELT_UID) || types.includes(FORGE_DRAG_MODULE_ID) || types.includes('text/plain');
  }

  function readModuleDragId(dt) {
    if (!dt) return '';
    try {
      const a = dt.getData(FORGE_DRAG_MODULE_ID);
      if (a) return String(a).trim();
      const plain = dt.getData('text/plain') || '';
      if (plain.startsWith('module:')) return plain.slice(7).trim();
    } catch { /* ignore */ }
    return '';
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

    if (materialDetailHintEl) materialDetailHintEl.textContent = tr('material_history_hint');
    materialDetailModalEl.classList.remove('material-detail-modal--hidden');
    materialDetailModalEl.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('material-detail-open');
    document.body.classList.add('material-detail-open');
    if (materialDetailCloseBtn) window.requestAnimationFrame(() => materialDetailCloseBtn.focus());
  }

  function openMaterialDetailModal(m) {
    if (!m || !materialDetailModalEl || !materialDetailThumbEl || !materialDetailTitleEl || !materialDetailRarityEl || !materialDetailDlEl) return;
    materialDetailTitleEl.textContent = m.name != null ? String(m.name) : tr('nameless');
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
    if (materialDetailHintEl) materialDetailHintEl.innerHTML = tr('material_hint');
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
      const ai = selected.findIndex((s) => s && s.uid === uid);
      if (ai >= 0) selected[ai] = null;
      furnaceSelected.push(m);
    }
    syncFurnaceUi();
    syncForgeUi();
  }

  function applyMaterialToAnvilByUid(uid) {
    const m = findMaterialByUid(uid);
    if (!m) return;
    if (!isSmeltMaterial(m)) {
      if (statusMsgEl) {
        statusMsgEl.textContent = tr('msg_smelt_first');
      }
      applyMaterialToFurnaceByUid(uid);
      return;
    }
    const fi = furnaceSelected.findIndex((s) => s.uid === uid);
    if (fi >= 0) furnaceSelected.splice(fi, 1);
    const i = selected.findIndex((s) => s && s.uid === uid);
    if (i >= 0) {
      selected[i] = null;
    } else {
      const emptyIdx = selected.indexOf(null);
      if (emptyIdx >= 0) selected[emptyIdx] = m;
      else if (statusMsgEl) statusMsgEl.textContent = tr('msg_slot_full');
    }
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
        if (panel === 'anvil' && s.smeltSid) {
          // 터치 드롭 위치에서 빈 슬롯 셀 감지 → 해당 슬롯에 배치
          const cellEl = document.elementFromPoint(clientX, clientY);
          const slotCell = cellEl && cellEl.closest('.forge-grid-cell--empty');
          const slotIdx = slotCell ? parseInt(slotCell.getAttribute('data-slot'), 10) : NaN;
          if (!Number.isNaN(slotIdx) && slotIdx >= 0 && slotIdx <= 8) {
            tryAddSmeltToAnvilAtSlot(s.smeltSid, slotIdx);
          } else {
            tryAddSmeltToAnvilBySid(s.smeltSid);
          }
        } else if (panel === 'furnace' && statusMsgEl) {
          statusMsgEl.textContent = tr('msg_anvil_only_outputs');
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
            if (statusMsgEl) statusMsgEl.textContent = tr('msg_anvil_only_outputs');
            return;
          }
          // 모듈 드롭 처리
          const modId = readModuleDragId(e.dataTransfer);
          if (modId) {
            const mod = dockModulePool.find((m) => m.id === modId);
            if (mod && !furnaceModulesPending.some((m) => m.id === modId)) {
              furnaceModulesPending.push(mod);
              syncFurnaceUi();
              if (materialDockFilter === 'module') renderDockModules();
            }
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
    // 모듈 필터는 별도 렌더러 사용
    if (materialDockFilter === 'module') {
      renderDockModules();
      return;
    }
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
      if (selected.some((s) => s && s.uid === m.uid)) row.classList.add('selected');
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
    const i = selected.findIndex((s) => s && s.uid === uid);
    if (i >= 0) selected[i] = null;
    syncForgeUi();
  }

  /** 숙련도 표시 갱신 (숫자 + 보너스 %) */
  function updateProficiencyDisplay(gained) {
    const barEl = document.getElementById('proficiencyBar');
    const labelEl = document.getElementById('profLabel');
    const countEl = document.getElementById('profCount');
    if (!barEl || !labelEl || !countEl) return;
    labelEl.textContent = tr('smith_proficiency_label');
    const profVal = Number(smithingProficiency) || 0;
    const mul = clientProfMul(profVal);
    const bonusPct = ((mul - 1.0) * 100).toFixed(1);
    countEl.textContent = tr('smith_proficiency_count', { n: profVal.toFixed(3), p: bonusPct });
    if (gained) {
      barEl.classList.add('prof-level-up');
      window.setTimeout(() => barEl.classList.remove('prof-level-up'), 1200);
    }
  }

  /** 서버에서 숙련도 로드 */
  async function loadProficiency() {
    if (!alpToken || !platformApi) return;
    try {
      const res = await apiFetch(`${platformApi}/api/craft/proficiency`, {
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

  /** 서버와 동일한 해시: 산출물 ID → 선호 슬롯 (0~8) */
  function preferredSlotFromId(id) {
    let h = 0;
    for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h % 9;
  }

  function tryAddSmeltToAnvilAtSlot(sidRaw, slotIndex) {
    const sid = String(sidRaw || '').trim();
    if (!sid) return;
    if (slotIndex < 0 || slotIndex > 8 || selected[slotIndex] !== null) return;
    const latestStock = cloneSmeltStock(loadSmeltStock());
    const latest = latestStock[sid];
    const maxCount = latest && typeof latest.count === 'number' ? latest.count : 0;
    const inSelected = countSelectedSmeltById(sid);
    if (inSelected >= maxCount) {
      if (statusMsgEl) statusMsgEl.textContent = tr('msg_qty_limit');
      return;
    }
    selected[slotIndex] = makeSmeltSelectionMaterial(latest || { id: sid, name: sid, emoji: '◆' });
    syncForgeUi();
  }

  function syncForgeUi() {
    if (selectedSlotsEl) {
      selectedSlotsEl.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const m = selected[i];
        const cell = document.createElement('div');
        cell.setAttribute('data-slot', String(i));

        if (m) {
          cell.className = 'forge-grid-cell forge-grid-cell--filled';
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'fgc-remove-btn';
          const label = m.name.length > 5 ? m.name.slice(0, 4) + '…' : m.name;
          btn.title = `${m.name}  클릭하여 빼기`;
          btn.innerHTML = `<span class="fgc-emoji">${escapeHtml(m.emoji || '◆')}</span>`
            + `<span class="fgc-name">${escapeHtml(label)}</span>`;
          btn.addEventListener('click', () => removeSelectedUid(m.uid));
          cell.appendChild(btn);
        } else {
          cell.className = 'forge-grid-cell forge-grid-cell--empty';
          const _slotNouns = SLOT_ITEM_NOUNS[forgeSlot] || SLOT_ITEM_NOUNS.weapon;
          cell.innerHTML = `<span class="fgc-slot-noun">${_slotNouns[i] || (i + 1)}</span>`;
          const slotIdx = i;
          cell.addEventListener('dragover', (e) => {
            if (!readSmeltDragSid(e.dataTransfer) && !e.dataTransfer.types.includes('text/plain')) return;
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            cell.classList.add('forge-grid-cell--drag-over');
          });
          cell.addEventListener('dragleave', (e) => {
            if (!cell.contains(e.relatedTarget)) cell.classList.remove('forge-grid-cell--drag-over');
          });
          cell.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cell.classList.remove('forge-grid-cell--drag-over');
            const sid = readSmeltDragSid(e.dataTransfer);
            if (sid) tryAddSmeltToAnvilAtSlot(sid, slotIdx);
          });
        }
        selectedSlotsEl.appendChild(cell);
      }
    }
    if (btnForge) {
      const hasServer = Boolean(alpToken && platformApi);
      const smeltGateBlocked = isForgeBlockedSmeltOnlyMinCount(selected);
      btnForge.disabled = !hasServer || smeltGateBlocked;
    }
    updateStatusMsg();
    renderMaterials();
    renderSmeltStock();
  }

  function updateStatusMsg() {
    if (!statusMsgEl) return;
    statusMsgEl.className = 'status-msg';
    const items = selected.filter(Boolean);
    if (items.length === 0) {
      statusMsgEl.textContent = tr('msg_drag_to_anvil');
      return;
    }
    if (!alpToken || !platformApi) {
      statusMsgEl.textContent = tr('msg_open_from_game');
      return;
    }
    const nonSmelt = items.filter((m) => !isSmeltMaterial(m));
    if (nonSmelt.length > 0) {
      statusMsgEl.textContent = tr('msg_anvil_only_outputs2');
      return;
    }
    if (items.every((m) => isSmeltMaterial(m))) {
      const avgStr = calcSelectedAvgStrength(items);
      const uniqueTiers = countUniqueStrengthTiers(items);
      const harmLabel = clientHarmonyLabel(uniqueTiers);
      const successPct = Math.round(clientSuccessRate(smithingProficiency, avgStr) * 100);
      const activeSyn = detectClientSynergies(items);
      const harmCls = activeSyn.length > 0 ? 'strength--legendary'
        : uniqueTiers >= 4 ? 'strength--legendary'
        : uniqueTiers >= 3 ? 'strength--strong'
        : uniqueTiers >= 2 ? 'strength--medium'
        : 'strength--weak';
      const synLine = activeSyn.length > 0
        ? `  ⚡ ${activeSyn.map((s) => s.name).join(' · ')}`
        : '';
      statusMsgEl.textContent = tr('msg_forge_ready', { n: items.length, harm: harmLabel, p: successPct, syn: synLine });
      statusMsgEl.className = `status-msg ${harmCls}`;
      return;
    }
    statusMsgEl.className = 'status-msg';
    statusMsgEl.textContent = tr('msg_forge_basic_ready', { n: items.length });
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
    resultRarity.textContent = tr('result_failed');
    resultName.textContent = tr('result_broken');

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
    resultDesc.textContent = tr('result_desc_template', { p: data.successRatePct ?? '?', strength: data.materialStrengthLabel || '?', gain: gainStr, syn: synFailLine, ret: returnLine });

    // 깨진 이모지
    resultSpriteHost.innerHTML = '<span style="font-size:2.5rem;line-height:1">💥</span>';

    resultCard.classList.remove('hidden');
    if (statusMsgEl) {
      statusMsgEl.textContent = tr('forge_failed_msg');
      statusMsgEl.className = 'status-msg strength--weak';
    }
    resultHideTimer = window.setTimeout(() => {
      hideResultCard();
      if (statusMsgEl) {
        statusMsgEl.className = 'status-msg';
        statusMsgEl.textContent = tr('forge_basic_drag_hint');
      }
    }, 5000);
  }

  function showResultFromServer(eq, stats, nameSource, nameAiMeta, materialStrengthLabel, materialHarmonyLabel, activeSynergies, fitScore) {
    if (!resultCard || !resultName || !resultDesc || !resultRarity || !resultSpriteHost) return;
    window.clearTimeout(resultHideTimer);
    const tier = String(eq.tier || eq.rarity || 'rare').toLowerCase();
    resultCard.className = `result-card rarity-${rarityClass(tier)}`;
    resultRarity.className = `result-rarity rarity-${rarityClass(tier)}`;
    resultRarity.textContent = tierLabel(tier);
    resultName.textContent = eq.name || eq.displayName || tr('result_default');
    const baseDesc = eq.description || eq.desc || '';
    const fitLine = '';
    if (stats && typeof stats.attackBonus === 'number') {
      const spdPct = ((stats.speedBonus != null ? Number(stats.speedBonus) : 0) * 100).toFixed(1);
      const dur =
        stats.durabilityMax != null && Number.isFinite(Number(stats.durabilityMax))
          ? ` · 내구 ${stats.durability != null ? stats.durability : stats.durabilityMax}/${stats.durabilityMax}`
          : '';
      resultDesc.textContent = tr('desc_stats_full', { fit: fitLine, base: baseDesc, atk: stats.attackBonus, def: stats.defenseBonus, spd: spdPct, dur: dur });
    } else {
      resultDesc.textContent = `${fitLine}${baseDesc}`;
    }
    if (resultSpriteHost) {
      mountForgeThumbOrImage(resultSpriteHost, eq.pixelArt, eq.emoji || '⚒️', 88, 88);
    }

    // 던전으로 바로 가기 버튼
    const $dungeonBtn = document.getElementById('btn-go-dungeon');
    if ($dungeonBtn) {
      const dungeonBase = window.__ALP_DUNGEON_URL__ || '../Singleplay-Game7/';
      $dungeonBtn.href = alpToken
        ? `${dungeonBase}?token=${encodeURIComponent(alpToken)}`
        : dungeonBase;
      $dungeonBtn.classList.remove('hidden');
    }

    resultCard.classList.remove('hidden');
    resultHideTimer = window.setTimeout(hideResultCard, 3800);
  }

  // ── 타이밍 미니게임 ───────────────────────────────────────────
  function showTimingBar(onResult) {
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column',
      'align-items:center;justify-content:center;background:rgba(0,0,0,.78);gap:20px',
    ].join(';');

    const title = document.createElement('div');
    title.style.cssText = 'color:#fff;font-size:1.1rem;font-weight:700;text-align:center';
    title.textContent = tr('timing_title');

    const sub = document.createElement('div');
    sub.style.cssText = 'color:#aaa;font-size:.85rem;text-align:center';
    sub.textContent = tr('timing_sub');

    // 게이지 바
    const track = document.createElement('div');
    track.style.cssText = [
      'position:relative;width:min(420px,90vw);height:52px;border-radius:12px;overflow:hidden',
      'border:2px solid #555;background:#1a1a2e',
    ].join(';');

    // 구간 색상 (왼→오)
    const zones = [
      { pct: 0,   width: 15, color: '#c0392b' }, // 빨강 (나쁨)
      { pct: 15,  width: 20, color: '#e67e22' }, // 주황
      { pct: 35,  width: 30, color: '#27ae60' }, // 초록 (좋음)
      { pct: 65,  width: 20, color: '#e67e22' }, // 주황
      { pct: 85,  width: 15, color: '#c0392b' }, // 빨강
    ];
    zones.forEach(({ pct, width, color }) => {
      const seg = document.createElement('div');
      seg.style.cssText = `position:absolute;top:0;left:${pct}%;width:${width}%;height:100%;background:${color};opacity:.55`;
      track.appendChild(seg);
    });
    // 중앙 완벽 구간 (15px 폭)
    const perfect = document.createElement('div');
    perfect.style.cssText = 'position:absolute;top:0;left:calc(50% - 7px);width:14px;height:100%;background:#f1c40f;opacity:.9;border-radius:3px';
    track.appendChild(perfect);

    // 커서
    const cursor = document.createElement('div');
    cursor.style.cssText = [
      'position:absolute;top:4px;bottom:4px;width:8px;border-radius:4px',
      'background:#fff;box-shadow:0 0 8px #fff;left:0%;transition:none',
    ].join(';');
    track.appendChild(cursor);

    // 결과 표시
    const resultEl = document.createElement('div');
    resultEl.style.cssText = 'color:#f1c40f;font-size:1.2rem;font-weight:800;text-align:center;min-height:1.5em';

    overlay.appendChild(title);
    overlay.appendChild(track);
    overlay.appendChild(sub);
    overlay.appendChild(resultEl);
    document.body.appendChild(overlay);

    let pos = 0;       // 0~100
    let dir = 1;
    const speed = 1.4; // %/frame
    let stopped = false;
    let rafId;

    function posToBonus(p) {
      const dist = Math.abs(p - 50); // 0 = center (perfect)
      if (dist <  8) return { bonus: 1.5, label: '🌟 완벽!',    color: '#f1c40f' };
      if (dist < 18) return { bonus: 1.3, label: '✅ 좋아요!',   color: '#27ae60' };
      if (dist < 32) return { bonus: 1.1, label: '🟡 괜찮아요',  color: '#e67e22' };
      if (dist < 42) return { bonus: 0.9, label: '🟠 아쉬워요',  color: '#e67e22' };
      return           { bonus: 0.7, label: '❌ 실패',          color: '#c0392b' };
    }

    function step() {
      if (stopped) return;
      pos += dir * speed;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0)   { pos = 0;   dir =  1; }
      cursor.style.left = `calc(${pos}% - 4px)`;
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    function stop() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(rafId);
      const { bonus, label, color } = posToBonus(pos);
      resultEl.textContent = label;
      resultEl.style.color = color;
      cursor.style.background = color;
      cursor.style.boxShadow = `0 0 12px ${color}`;
      setTimeout(() => {
        document.body.removeChild(overlay);
        onResult(bonus);
      }, 900);
    }

    overlay.addEventListener('click', stop);
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); stop(); }
    }
    document.addEventListener('keydown', onKey);
    // cleanup key listener after done
    const _origStop = stop;
    Object.defineProperty(overlay, '_cleanup', { value: () => document.removeEventListener('keydown', onKey) });
    overlay.addEventListener('click', () => document.removeEventListener('keydown', onKey), { once: true });
  }

  async function forge(customName, pixelArtData, pixelArtUrl, timingBonus) {
    if (forgeInFlight) return;
    const usedSlots = selected.map((m, i) => m ? { m, i } : null).filter(Boolean);
    if (usedSlots.length < MIN_SMELT_MATERIALS_FOR_FORGE) return;
    if (!alpToken || !platformApi) {
      if (statusMsgEl) statusMsgEl.textContent = tr('no_token');
      return;
    }

    const used = usedSlots.map(({ m }) => m);
    if (used.some((m) => !isSmeltMaterial(m))) {
      if (statusMsgEl) {
        statusMsgEl.textContent = tr('msg_anvil_only_outputs2');
      }
      return;
    }

    const materialsPayload = usedSlots.map(({ m, i }) =>
      isSmeltMaterial(m)
        ? { kind: 'smelt', id: String(m.smeltId).trim(), slotIndex: i }
        : { kind: 'catch', id: String(m.serverId).trim(), slotIndex: i },
    );

    forgeInFlight = true;
    forgeStartAt = Date.now();
    pendingSignatureCelebrateName = null;
    if (btnForge) {
      btnForge.disabled = true;
      btnForge.textContent = tr('btn_forging');
    }

    try {
      const res = await apiFetch(`${platformApi}/api/craft/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${alpToken}`,
        },
        body: JSON.stringify({
          materials: materialsPayload,
          customName: customName || undefined,
          equipSlot: forgeSlot || 'weapon',
          pixelArtUrl: pixelArtUrl || undefined,
          pixelArtData: (!pixelArtUrl && pixelArtData) ? pixelArtData : undefined,
          timingBonus: (timingBonus != null && Number.isFinite(timingBonus)) ? timingBonus : 1.0,
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
      selected = new Array(9).fill(null);
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
        if (statusMsgEl) statusMsgEl.textContent = tr('server_resp_err');
        return;
      }
      const serverEquipment = data.equipment;
      const serverStats = serverEquipment.stats || null;

      syncForgeUi();
      await refreshCraftedList();
      void syncSmeltFromServer();

      // 일일 미션: 장비 제련
      if (alpToken && platformApi) {
        apiFetch(`${platformApi}/api/missions/daily/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
          body: JSON.stringify({ missionId: 'forge_1', increment: 1 }),
        }).catch(() => {});
      }

      // 실제 경과 시간으로 게임머니 지급
      const forgeBonus = await grantForgeBonus(Date.now() - forgeStartAt);
      if (forgeBonus > 0) showForgeCoinBonus(forgeBonus);

      // 유저가 직접 그린 그림이 있으면 서버 응답보다 항상 우선 사용
      if (pixelArtUrl) {
        serverEquipment.pixelArt = { imageDataUrl: pixelArtUrl };
      } else if (pixelArtData) {
        serverEquipment.pixelArt = pixelArtData;
      }
      showResultFromServer(serverEquipment, serverStats, data.nameSource, {
        nameAiRequested: data.nameAiRequested,
        nameAiUsed: data.nameAiUsed,
        nameAiSkipReason: data.nameAiSkipReason,
      }, data.materialStrengthLabel || null, data.materialHarmonyLabel || null, data.activeSynergies || [], data.fitScore || null);
      if (data.nameSource === 'ai' && data.nameClass === 'signature') {
        pendingSignatureCelebrateName = String(serverEquipment.name || '').trim() || '장비';
      }
    } catch {
      pendingSignatureCelebrateName = null;
      if (statusMsgEl) statusMsgEl.textContent = tr('network_err');
    } finally {
      setForgeOverlay(false);
      forgeInFlight = false;
      if (btnForge) btnForge.textContent = tr('forge_btn');
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
    craftedListEl.innerHTML = '<p class="log-empty">' + tr('list_loading') + '</p>';
    try {
      const res = await apiFetch(`${platformApi}/api/craft/equipment`, {
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
        craftedListEl.innerHTML = '<p class="log-empty">' + tr('list_load_fail') + '</p>';
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
        craftedListEl.innerHTML = '<p class="log-empty">' + tr('list_no_crafted') + '</p>';
        serverEquipmentForgePool = [];
        refreshMaterials();
        renderMaterials();
        selected = selected.map((s) => (s && (isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid))) ? s : null);
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
      selected = selected.map((s) => (s && (isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid))) ? s : null);
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
      craftedListEl.innerHTML = '<p class="log-empty">' + tr('list_network_err') + '</p>';
      serverEquipmentForgePool = [];
      refreshMaterials();
      renderMaterials();
      syncForgeUi();
    }
  }

  function onStorage(e) {
    if (e.key !== FORGE_MATERIALS_KEY && e.key !== FORGE_SPENT_UIDS_KEY) return;
    refreshMaterials();
    selected = selected.map((s) => (s && (isSmeltMaterial(s) || materials.some((m) => m.uid === s.uid))) ? s : null);
    furnaceSelected = furnaceSelected.filter((s) => materials.some((m) => m.uid === s.uid));
    syncForgeUi();
    syncFurnaceUi();
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      selected = new Array(9).fill(null);
      syncForgeUi();
    });
  }
  if (btnClearFurnace) {
    btnClearFurnace.addEventListener('click', () => {
      furnaceSelected = [];
      furnaceModulesPending = [];
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
      btn.addEventListener('click', async () => {
        const next = btn.getAttribute('data-filter') || 'all';
        if (next === materialDockFilter) return;
        materialDockFilter = next;
        if (next === 'module') {
          renderMaterialDockFilterUi();
          materialListEl.innerHTML = '<p class="log-empty">' + tr('list_loading') + '</p>';
          await fetchDockModules();
        }
        renderMaterials();
      });
    });
  }
  // ── 픽셀 에디터 / 장비 커스터마이즈 ───────────────────────────
  const PIXEL_G = 32; // 32×32 격자
  const SMELT_KO = {
    iron:'철',copper:'구리',gold:'금',silver:'은',aluminum:'알루미늄',
    nickel:'니켈',zinc:'아연',tin:'주석',lead:'납',manganese:'망간',
    chromium:'크롬',titanium:'티타늄',cobalt:'코발트',tungsten:'텅스텐',
    platinum:'백금',palladium:'팔라듐',rhodium:'로듐',iridium:'이리듐',
    vanadium:'바나듐',niobium:'니오브',molybdenum:'몰리브덴',
    magnesium:'마그네슘',lithium:'리튬',bismuth:'비스무트',antimony:'안티몬',
    hafnium:'하프늄',tantalum:'탄탈럼',zirconium:'지르코늄',
    gallium:'갈륨',germanium:'게르마늄',indium:'인듐',selenium:'셀레늄',
    tellurium:'텔루륨',rareearth:'희토류',neodymium:'네오디뮴',
    lanthanum:'란탄',cerium:'세륨',samarium:'사마륨',yttrium:'이트륨',
    rubber:'고무',plastic:'플라스틱',resin:'수지',fiber:'섬유',
    textile:'직물',leather:'가죽',kevlar:'케블라',carbonfiber:'탄소섬유',
    glass:'유리',ceramic:'세라믹',silicon:'실리콘',silica:'실리카',
    carbon:'탄소',graphite:'흑연',graphene:'그래핀',diamond:'다이아몬드',
    circuit:'회로',wafer:'웨이퍼',battery:'배터리',
    salt:'소금',sulfur:'황',petro:'석유',biofuel:'바이오연료',
    sand:'모래',concrete:'콘크리트',cement:'시멘트',asphalt:'아스팔트',
    limestone:'석회석',granite:'화강암',basalt:'현무암',
    protein:'단백질',chitin:'키틴',keratin:'케라틴',enzyme:'효소',
    hydrogen:'수소',oxygen:'산소',nitrogen:'질소',helium:'헬륨',
    argon:'아르곤',plasma:'플라즈마',magma:'마그마',cryo:'크리오',
    pearl:'진주',opal:'오팔',topaz:'토파즈',garnet:'가닛',
    amethyst:'자수정',emerald:'에메랄드',sapphire:'사파이어',ruby:'루비',
    uranium:'우라늄',sodaash:'소다',phosphor:'인',phosphate:'인산염',
    chloride:'염화물',nitrate:'질산염',ammonia:'암모니아',lithiumsalt:'리튬염',
  };
  // 슬롯 위치(0~8)별 고정 장비 명사 — 카테고리 × 9슬롯
  const SLOT_ITEM_NOUNS = {
    weapon:    ['검','도끼','창','활','방패','지팡이','망치','낫','단검'],
    head:      ['투구','헬멧','철모','고깔','왕관','가면','두건','머리띠','철갓'],
    chest:     ['갑옷','흉갑','로브','망토','전투복','판금갑옷','체인메일','가죽갑옷','코트'],
    pants:     ['각반','레깅스','전투바지','기사바지','가죽바지','철제각반','사슬각반','강화각반','마법각반'],
    gloves:    ['장갑','건틀릿','철장갑','가죽장갑','마법장갑','강철장갑','비단장갑','화염장갑','전투장갑'],
    boots:     ['장화','부츠','철화','그리브','기사부츠','가죽장화','마법부츠','강화장화','전투화'],
    accessory: ['반지','목걸이','귀걸이','팔찌','부적','메달','브로치','펜던트','뱃지'],
  };

  let pixelGrid = Array(PIXEL_G * PIXEL_G).fill(null);
  let pixelArtImageUrl = null; // PixelLab 생성 이미지 URL (base64)
  let pixelColor = '#c0392b'; // 기본: 빨강 (null = 지우개)
  let pixelPainting = false;

  function generateEquipName(mats, noun) {
    const ids = [...new Set(mats.filter(Boolean).map((m) => m.smeltId).filter(Boolean))];
    const words = ids.slice(0, 2).map((id) => SMELT_KO[id] || id);
    const n = noun || '검';
    if (words.length === 0) return `강철 ${n}`;
    if (words.length === 1) return `${words[0]} ${n}`;
    return `${words[0]}·${words[1]} ${n}`;
  }

  // base64 PNG → pixelGrid (32×32) 변환 (64×64 이미지 2×2 블록 평균)
  function _imageUrlToPixelGrid(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ofc = document.createElement('canvas');
        ofc.width = 64; ofc.height = 64;
        const octx = ofc.getContext('2d');
        octx.drawImage(img, 0, 0, 64, 64);
        const G = PIXEL_G; // 32
        const scale = 2; // 64 / 32
        const idata = octx.getImageData(0, 0, 64, 64).data;
        const grid = new Array(G * G).fill(null);
        for (let gy = 0; gy < G; gy++) {
          for (let gx = 0; gx < G; gx++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
              const px = ((gy * scale + dy) * 64 + (gx * scale + dx)) * 4;
              r += idata[px]; g += idata[px + 1]; b += idata[px + 2]; a += idata[px + 3];
            }
            if (a / 4 < 80) continue; // 투명
            const hr = Math.round(r / 4).toString(16).padStart(2, '0');
            const hg = Math.round(g / 4).toString(16).padStart(2, '0');
            const hb = Math.round(b / 4).toString(16).padStart(2, '0');
            grid[gy * G + gx] = `#${hr}${hg}${hb}`;
          }
        }
        pixelGrid = grid;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }

  // ── 로딩 오버레이 타이머 ───────────────────────────────────
  let _eclTimerRef = null;
  const ECL_EXPECTED = 20; // 예상 대기 초

  function _startEclTimer() {
    const timerEl = document.getElementById('eclTimer');
    if (!timerEl) return;
    timerEl.className = 'ecl-timer';
    timerEl.textContent = tr('custom_loading_timer', { n: ECL_EXPECTED });
    const startMs = Date.now();
    _eclTimerRef = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const remaining = ECL_EXPECTED - elapsed;
      if (remaining > 0) {
        timerEl.textContent = tr('ecl_timer_remaining', { n: remaining });
        timerEl.className = 'ecl-timer';
      } else {
        timerEl.textContent = tr('ecl_timer_overdue', { n: Math.abs(remaining) });
        timerEl.className = 'ecl-timer ecl-timer--over';
      }
    }, 1000);
  }

  function _stopEclTimer() {
    if (_eclTimerRef) { clearInterval(_eclTimerRef); _eclTimerRef = null; }
  }

  // DB 캐시에서 장비 이미지 조회 (noun = 장비 명사, 없으면 빈 이미지)
  async function _fetchEquipArtFromDb(noun) {
    if (!alpToken || !platformApi || !noun) return;
    try {
      const res = await apiFetch(`${platformApi}/api/craft/equip-pixel-art`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
        body: JSON.stringify({ noun }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.imageDataUrl) {
        // 유저가 이미 그리기 시작했으면 덮어쓰지 않음
        if (pixelGrid.some(Boolean)) return;
        pixelArtImageUrl = data.imageDataUrl;
        await _imageUrlToPixelGrid(data.imageDataUrl);
        renderPixelCanvas();
      }
    } catch (e) {
      console.warn('[equip-art] DB 조회 실패:', e?.message || e);
    }
  }

  // ── 픽셀 아트 생성 (마스크 기반 알고리즘) ─────────────────────
  function _detectItemType(name) {
    if (!name) return null;
    const checks = ['대검','단검','검','도끼','창','활','방패','갑옷','투구','지팡이','망치','낫','장갑','장화','반지','목걸이'];
    for (const k of checks) if (name.includes(k)) return k;
    return null;
  }

  function generateRandomPixels(mats, name) {
    const TIER_PAL = {
      legendary: ['#3d1a00','#c25b00','#f5a623','#fff3a0'],
      epic:      ['#1e063a','#6b2f92','#a86cc1','#d4aef0'],
      rare:      ['#051828','#1458a0','#4a9fd4','#9bd8f5'],
      common:    ['#0d0d0d','#484848','#888888','#d0d0d0'],
    };
    const tiers = mats.filter(Boolean).map((m) => m.tier || 'common');
    const tier = tiers.includes('legendary') ? 'legendary' : tiers.includes('epic') ? 'epic' : tiers.includes('rare') ? 'rare' : 'common';
    const pal = TIER_PAL[tier]; // [0]=darkest … [3]=lightest

    const G = PIXEL_G; // 32
    const MID = Math.floor(G / 2); // 16

    // Seeded Xorshift32 RNG from item name (reproducible per name)
    let _s = 0x811c9dc5 >>> 0;
    for (let i = 0; i < (name || 'x').length; i++)
      _s = (Math.imul(_s ^ (name || 'x').charCodeAt(i), 0x01000193)) >>> 0;
    if (_s === 0) _s = 1;
    const rng = () => { _s ^= _s << 13; _s ^= _s >>> 17; _s ^= _s << 5; return (_s >>> 0) / 0x100000000; };

    // mask: 0=empty, 1=always-on (outline/structure), 2=random-fill (65% chance)
    const mask = new Uint8Array(G * G);
    const set = (x, y, v = 1) => { if (x >= 0 && x < G && y >= 0 && y < G) mask[y * G + x] = Math.max(mask[y * G + x], v); };
    const fill = (x, y, w, h, v = 2) => { for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) set(x + dx, y + dy, v); };

    const type = _detectItemType(name);
    switch (type) {
      case '대검': case '검': {
        const bladeH = type === '대검' ? 20 : 16;
        fill(MID - 1, 1, 3, bladeH, 2);
        for (let y = 1; y < 1 + bladeH; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        set(MID, 0, 1);
        const gy = 1 + bladeH, gw = type === '대검' ? 7 : 5;
        fill(MID - gw, gy, gw * 2 + 1, 2, 2);
        for (let dx = -gw; dx <= gw; dx++) { set(MID + dx, gy, 1); set(MID + dx, gy + 1, 1); }
        set(MID - gw, gy, 1); set(MID + gw, gy, 1); set(MID - gw, gy + 1, 1); set(MID + gw, gy + 1, 1);
        const hy = gy + 2, hLen = type === '대검' ? 8 : 6;
        fill(MID - 1, hy, 3, hLen, 2);
        for (let y = hy; y < hy + hLen; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 2, hy + hLen, 5, 2, 1);
        break;
      }
      case '단검': {
        fill(MID - 1, 7, 3, 10, 2);
        for (let y = 7; y < 17; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        set(MID, 6, 1);
        fill(MID - 4, 17, 9, 2, 2);
        for (let dx = -4; dx <= 4; dx++) { set(MID + dx, 17, 1); set(MID + dx, 18, 1); }
        fill(MID - 1, 19, 3, 5, 2);
        for (let y = 19; y < 24; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 2, 24, 5, 2, 1);
        break;
      }
      case '도끼': {
        fill(MID - 1, 7, 3, 22, 2);
        for (let y = 7; y < 29; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 1, 29, 3, 1, 1);
        for (let y = 1; y <= 16; y++) {
          const lOff = Math.round(9 * Math.sin((y - 1) / 15 * Math.PI));
          if (lOff > 0) { fill(MID - 2 - lOff, y, lOff, 1, 2); set(MID - 2 - lOff, y, 1); }
          const rOff = Math.round(3 * Math.sin((y - 1) / 15 * Math.PI));
          if (rOff > 0) { fill(MID + 2, y, rOff, 1, 2); set(MID + 2 + rOff - 1, y, 1); }
        }
        break;
      }
      case '창': {
        fill(MID - 1, 10, 3, 21, 2);
        for (let y = 10; y < 31; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 1, 31, 3, 1, 1);
        for (let y = 0; y <= 10; y++) {
          const hw = Math.min(y + 1, 10 - y, 4);
          fill(MID - hw, y, hw * 2 + 1, 1, hw < 4 ? 1 : 2);
          set(MID - hw, y, 1); set(MID + hw, y, 1);
        }
        break;
      }
      case '활': {
        for (let y = 2; y <= 14; y++) {
          const t = (y - 2) / 12, x = MID - 3 - Math.round(6 * Math.sin(t * Math.PI));
          set(x, y, 1); set(x + 1, y, 2);
        }
        fill(MID - 10, 15, 7, 3, 2); set(MID - 10, 15, 1); set(MID - 10, 17, 1);
        for (let y = 17; y <= 29; y++) {
          const t = (29 - y) / 12, x = MID - 3 - Math.round(6 * Math.sin(t * Math.PI));
          set(x, y, 1); set(x + 1, y, 2);
        }
        for (let y = 1; y <= 30; y++) set(MID + 4, y, 1);
        set(MID - 5, 1, 1); set(MID - 4, 1, 1); set(MID - 5, 30, 1); set(MID - 4, 30, 1);
        break;
      }
      case '방패': {
        for (let y = 3; y <= 27; y++) {
          const hw = y <= 15 ? Math.min(11, 2 + y) : Math.round(11 * (1 - (y - 15) / 13));
          if (hw > 0) { fill(MID - hw, y, hw * 2 + 1, 1, 2); set(MID - hw, y, 1); set(MID + hw, y, 1); }
        }
        for (let dx = -9; dx <= 9; dx++) set(MID + dx, 3, 1);
        set(MID, 27, 1);
        fill(MID - 2, 12, 5, 6, 1);
        break;
      }
      case '투구': {
        for (let y = 4; y <= 17; y++) {
          const hw = Math.round(11 * Math.sqrt(Math.max(0, 1 - ((y - 17) * (y - 17)) / 169)));
          if (hw > 0) { fill(MID - hw, y, hw * 2 + 1, 1, 2); set(MID - hw, y, 1); set(MID + hw, y, 1); }
        }
        fill(MID - 12, 17, 25, 3, 2);
        for (let dx = -12; dx <= 12; dx++) { set(MID + dx, 17, 1); set(MID + dx, 19, 1); }
        set(MID - 12, 17, 1); set(MID - 12, 19, 1); set(MID + 12, 17, 1); set(MID + 12, 19, 1);
        fill(MID - 10, 20, 8, 7, 2); fill(MID + 3, 20, 8, 7, 2);
        fill(MID - 1, 17, 3, 10, 1);
        for (let y = 1; y <= 4; y++) { set(MID, y, 1); set(MID - 1, y + 1, 2); set(MID + 1, y + 1, 2); }
        break;
      }
      case '지팡이': {
        fill(MID - 1, 13, 3, 18, 2);
        for (let y = 13; y < 31; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 1, 31, 3, 1, 1);
        const oR = 8, oCX = MID, oCY = 7;
        for (let oy = oCY - oR; oy <= oCY + oR; oy++) {
          for (let ox = oCX - oR; ox <= oCX + oR; ox++) {
            const d = Math.hypot(ox - oCX, oy - oCY);
            if (d <= oR) set(ox, oy, d >= oR - 1.5 ? 1 : 2);
          }
        }
        break;
      }
      case '망치': {
        fill(MID - 1, 16, 3, 14, 2);
        for (let y = 16; y < 30; y++) { set(MID - 1, y, 1); set(MID + 1, y, 1); }
        fill(MID - 1, 30, 3, 1, 1);
        fill(MID - 9, 3, 19, 13, 2);
        for (let dx = -9; dx <= 9; dx++) { set(MID + dx, 3, 1); set(MID + dx, 15, 1); }
        for (let dy = 3; dy <= 15; dy++) { set(MID - 9, dy, 1); set(MID + 9, dy, 1); }
        break;
      }
      case '낫': {
        for (let i = 0; i < 18; i++) {
          const sx = MID - 6 + i, sy = 13 + i;
          set(sx, sy, 2); set(sx - 1, sy, 1); set(sx + 1, sy, 1);
        }
        for (let a = 115; a <= 230; a += 5) {
          const r = a * Math.PI / 180, cx = MID + 4, cy = 11;
          set(Math.round(cx + 12 * Math.cos(r)), Math.round(cy + 12 * Math.sin(r)), 1);
          set(Math.round(cx + 9 * Math.cos(r)), Math.round(cy + 9 * Math.sin(r)), 2);
        }
        break;
      }
      case '갑옷': {
        fill(MID - 8, 12, 17, 15, 2);
        for (let dx = -8; dx <= 8; dx++) { set(MID + dx, 12, 1); set(MID + dx, 26, 1); }
        for (let dy = 12; dy <= 26; dy++) { set(MID - 8, dy, 1); set(MID + 8, dy, 1); }
        fill(MID - 12, 12, 5, 9, 2); fill(MID + 8, 12, 5, 9, 2);
        for (let dy = 12; dy < 21; dy++) { set(MID - 12, dy, 1); set(MID + 12, dy, 1); }
        fill(MID - 3, 8, 7, 5, 1);
        fill(MID - 8, 22, 17, 4, 1);
        break;
      }
      case '장갑': {
        fill(MID - 7, 16, 15, 11, 2);
        for (let dx = -7; dx <= 7; dx++) { set(MID + dx, 16, 1); set(MID + dx, 26, 1); }
        for (let dy = 16; dy <= 26; dy++) { set(MID - 7, dy, 1); set(MID + 7, dy, 1); }
        for (let f = 0; f < 4; f++) {
          const fx = MID - 6 + f * 4;
          fill(fx, 6, 3, 11, 2);
          for (let dy = 6; dy < 16; dy++) { set(fx, dy, 1); set(fx + 2, dy, 1); }
          set(fx, 6, 1); set(fx + 1, 6, 1); set(fx + 2, 6, 1);
        }
        fill(MID + 6, 12, 4, 7, 2);
        set(MID + 6, 12, 1); set(MID + 9, 12, 1);
        fill(MID - 7, 26, 15, 4, 1);
        break;
      }
      case '장화': {
        fill(MID - 12, 2, 6, 19, 2);
        for (let dy = 2; dy < 21; dy++) { set(MID - 12, dy, 1); set(MID - 7, dy, 1); }
        set(MID - 12, 2, 1); set(MID - 7, 2, 1);
        fill(MID - 13, 21, 9, 4, 2);
        for (let dx = 0; dx < 9; dx++) { set(MID - 13 + dx, 21, 1); set(MID - 13 + dx, 24, 1); }
        fill(MID - 14, 24, 11, 3, 1);
        fill(MID + 6, 2, 6, 19, 2);
        for (let dy = 2; dy < 21; dy++) { set(MID + 6, dy, 1); set(MID + 11, dy, 1); }
        set(MID + 6, 2, 1); set(MID + 11, 2, 1);
        fill(MID + 5, 21, 9, 4, 2);
        for (let dx = 0; dx < 9; dx++) { set(MID + 5 + dx, 21, 1); set(MID + 5 + dx, 24, 1); }
        fill(MID + 4, 24, 11, 3, 1);
        break;
      }
      case '반지': {
        const rCX = MID, rCY = 23, rR = 7;
        for (let ry = rCY - rR; ry <= rCY + rR; ry++) {
          for (let rx = rCX - rR; rx <= rCX + rR; rx++) {
            const d = Math.hypot(rx - rCX, ry - rCY);
            if (d >= rR - 2.5 && d <= rR) set(rx, ry, d >= rR - 0.7 ? 1 : 2);
          }
        }
        fill(MID - 1, 16, 3, 7, 1);
        fill(MID - 4, 7, 9, 10, 1);
        fill(MID - 3, 8, 7, 8, 2);
        break;
      }
      case '목걸이': {
        for (let a = 200; a <= 340; a += 7) {
          const r = a * Math.PI / 180;
          set(Math.round(MID + 12 * Math.cos(r)), Math.round(8 + 6 * Math.sin(r)), 1);
        }
        fill(MID - 1, 13, 3, 5, 1);
        for (let y = 17; y <= 29; y++) {
          const hw = Math.round(5 * Math.sin((y - 17) / 12 * Math.PI));
          if (hw > 0) { fill(MID - hw, y, hw * 2 + 1, 1, 2); set(MID - hw, y, 1); set(MID + hw, y, 1); }
        }
        set(MID, 29, 1);
        break;
      }
      default: {
        for (let y = 6; y <= 26; y++) for (let x = 6; x <= 26; x++) {
          const dx = (x - MID) / (G * 0.28), dy = (y - G / 2) / (G * 0.38);
          if (dx * dx + dy * dy < 1) set(x, y, 2);
        }
        break;
      }
    }

    // Apply random fill (type-2 cells have 65% chance)
    const grid = new Array(G * G).fill(null);
    for (let i = 0; i < G * G; i++) {
      if (mask[i] === 0) continue;
      if (mask[i] === 2 && rng() > 0.65) continue;
      grid[i] = true;
    }

    // 2-pass isolated pixel removal
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < G * G; i++) {
        if (!grid[i]) continue;
        const x = i % G, y = Math.floor(i / G);
        const L = x > 0 && grid[i - 1], R = x < G - 1 && grid[i + 1];
        const U = y > 0 && grid[i - G], D = y < G - 1 && grid[i + G];
        if (!L && !R && !U && !D) grid[i] = null;
      }
    }

    // Edge-based shading: light from upper-right
    // sc = (exposed_right + exposed_top) - (exposed_left + exposed_bottom)
    for (let i = 0; i < G * G; i++) {
      if (!grid[i]) continue;
      const x = i % G, y = Math.floor(i / G);
      const eL = !(x > 0 && grid[i - 1]);
      const eR = !(x < G - 1 && grid[i + 1]);
      const eU = !(y > 0 && grid[i - G]);
      const eD = !(y < G - 1 && grid[i + G]);
      if (!eL && !eR && !eU && !eD) {
        grid[i] = pal[2]; // interior → mid tone
      } else {
        const sc = (eR ? 1 : 0) + (eU ? 1 : 0) - (eL ? 1 : 0) - (eD ? 1 : 0);
        grid[i] = pal[sc >= 1 ? 3 : sc <= -1 ? 0 : 1];
      }
    }

    return grid;
  }

  function renderPixelCanvas() {
    const canvas = document.getElementById('equipPixelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const cell = W / PIXEL_G;
    // 배경 (투명 체크무늬)
    ctx.clearRect(0, 0, W, W);
    for (let y = 0; y < PIXEL_G; y++) {
      for (let x = 0; x < PIXEL_G; x++) {
        const even = (x + y) % 2 === 0;
        ctx.fillStyle = even ? '#2a2a3a' : '#1e1e2e';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    // 픽셀 색상
    for (let i = 0; i < pixelGrid.length; i++) {
      if (!pixelGrid[i]) continue;
      ctx.fillStyle = pixelGrid[i];
      ctx.fillRect((i % PIXEL_G) * cell, Math.floor(i / PIXEL_G) * cell, cell, cell);
    }
    // 격자선
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= PIXEL_G; i++) {
      const p = i * cell;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(W, p); ctx.stroke();
    }
  }

  function paintPixelAt(e) {
    const canvas = document.getElementById('equipPixelCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / rect.width * PIXEL_G);
    const row = Math.floor((e.clientY - rect.top) / rect.height * PIXEL_G);
    if (col < 0 || col >= PIXEL_G || row < 0 || row >= PIXEL_G) return;
    const idx = row * PIXEL_G + col;
    if (pixelGrid[idx] === pixelColor) return;
    pixelGrid[idx] = pixelColor;
    pixelArtImageUrl = null; // 직접 그리면 DB 이미지 URL 초기화
    renderPixelCanvas();
  }

  // ── 유니티 스타일 컬러 피커 ──────────────────────────────────
  const CPK_W = 220, CPK_CX = 110, CPK_CY = 110;
  const CPK_OR = 100, CPK_IR = 72, CPK_SH = 46; // outer/inner radius, SV half-side

  const _cpk = { h: 0, s: 1, v: 0.75 };
  let _cpkDragZone = null;

  function _hsvToRgb(h, s, v) {
    const i = Math.floor(h / 60) % 6, f = h / 60 - Math.floor(h / 60);
    const p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
    const m = [[v,t,p,p,q,v],[q,v,v,t,p,p],[p,p,q,v,v,t]];
    return { r: Math.round(m[0][i]*255), g: Math.round(m[1][i]*255), b: Math.round(m[2][i]*255) };
  }
  function _rgbToHsv(r, g, b) {
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
    let h=0;
    if (d>0) {
      if (max===r) h=((g-b)/d)%6;
      else if (max===g) h=(b-r)/d+2;
      else h=(r-g)/d+4;
      h=((h*60)+360)%360;
    }
    return { h, s: max===0?0:d/max, v: max };
  }
  function _hexToRgb(hex) {
    const h=(hex||'').replace('#','');
    if (h.length!==6) return null;
    const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
    return (isNaN(r)||isNaN(g)||isNaN(b))?null:{r,g,b};
  }
  function _toHex(r,g,b) { return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join(''); }

  function _cpkCurrentHex() { const {r,g,b}=_hsvToRgb(_cpk.h,_cpk.s,_cpk.v); return _toHex(r,g,b); }

  function _cpkRender() {
    const canvas = document.getElementById('cpkRingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    ctx.clearRect(0,0,W,W);

    // 색상환 링 (ImageData)
    const img = ctx.createImageData(W, W);
    const d = img.data;
    for (let y=0; y<W; y++) {
      for (let x=0; x<W; x++) {
        const dx=x-CPK_CX, dy=y-CPK_CY, dist=Math.hypot(dx,dy);
        if (dist<CPK_IR||dist>CPK_OR) continue;
        const angle=((Math.atan2(dy,dx)*180/Math.PI)+90+360)%360;
        const {r,g,b}=_hsvToRgb(angle,1,1);
        const idx=(y*W+x)*4;
        d[idx]=r; d[idx+1]=g; d[idx+2]=b; d[idx+3]=255;
      }
    }
    ctx.putImageData(img,0,0);

    // SV 사각형
    const sx=CPK_CX-CPK_SH, sy=CPK_CY-CPK_SH, sw=CPK_SH*2, sh=CPK_SH*2;
    const {r,g,b}=_hsvToRgb(_cpk.h,1,1);
    const gH=ctx.createLinearGradient(sx,sy,sx+sw,sy);
    gH.addColorStop(0,'#fff'); gH.addColorStop(1,`rgb(${r},${g},${b})`);
    ctx.fillStyle=gH; ctx.fillRect(sx,sy,sw,sh);
    const gV=ctx.createLinearGradient(sx,sy,sx,sy+sh);
    gV.addColorStop(0,'rgba(0,0,0,0)'); gV.addColorStop(1,'#000');
    ctx.fillStyle=gV; ctx.fillRect(sx,sy,sw,sh);

    // 색상환 커서 (링 위의 원)
    const hRad=(_cpk.h-90)*Math.PI/180;
    const cr=(CPK_IR+CPK_OR)/2;
    const hcx=CPK_CX+Math.cos(hRad)*cr, hcy=CPK_CY+Math.sin(hRad)*cr;
    ctx.beginPath(); ctx.arc(hcx,hcy,9,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(hcx,hcy,9,0,Math.PI*2);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();

    // SV 커서
    const scx=sx+_cpk.s*sw, scy=sy+(1-_cpk.v)*sh;
    ctx.beginPath(); ctx.arc(scx,scy,7,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(scx,scy,7,0,Math.PI*2);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();

    // 입력 동기화
    const hex=_cpkCurrentHex();
    const {r:rr,g:gg,b:bb}=_hsvToRgb(_cpk.h,_cpk.s,_cpk.v);
    const hexEl=document.getElementById('cpkHex');
    const rEl=document.getElementById('cpkR'), gEl=document.getElementById('cpkG'), bEl=document.getElementById('cpkB');
    const preview=document.getElementById('cpkPreview');
    const swatch=document.getElementById('equipColorSwatch');
    const eraserBtn=document.getElementById('equipEraserBtn');
    if (hexEl&&document.activeElement!==hexEl) hexEl.value=hex.slice(1);
    if (rEl&&document.activeElement!==rEl) rEl.value=rr;
    if (gEl&&document.activeElement!==gEl) gEl.value=gg;
    if (bEl&&document.activeElement!==bEl) bEl.value=bb;
    if (preview) preview.style.background=hex;
    if (swatch) swatch.style.background=hex;
    if (eraserBtn) eraserBtn.classList.remove('is-active');
    pixelColor=hex;
  }

  function _cpkHitTest(x, y) {
    const dx=x-CPK_CX, dy=y-CPK_CY, dist=Math.hypot(dx,dy);
    if (dist>=CPK_IR-4&&dist<=CPK_OR+4) return 'ring';
    const sx=CPK_CX-CPK_SH, sy=CPK_CY-CPK_SH, sw=CPK_SH*2, sh=CPK_SH*2;
    if (x>=sx&&x<=sx+sw&&y>=sy&&y<=sy+sh) return 'sv';
    return null;
  }

  function _cpkApplyEvent(e, canvas) {
    const rect=canvas.getBoundingClientRect();
    const scale=CPK_W/rect.width;
    const x=(e.clientX-rect.left)*scale, y=(e.clientY-rect.top)*scale;
    const dx=x-CPK_CX, dy=y-CPK_CY;
    if (_cpkDragZone==='ring') {
      _cpk.h=((Math.atan2(dy,dx)*180/Math.PI)+90+360)%360;
    } else if (_cpkDragZone==='sv') {
      const sx=CPK_CX-CPK_SH, sy=CPK_CY-CPK_SH;
      _cpk.s=Math.max(0,Math.min(1,(x-sx)/(CPK_SH*2)));
      _cpk.v=Math.max(0,Math.min(1,1-(y-sy)/(CPK_SH*2)));
    }
    _cpkRender();
  }

  function cpkOpen(initialColor) {
    const popup=document.getElementById('colorPickerPopup');
    if (!popup) return;
    if (initialColor) {
      const rgb=_hexToRgb(initialColor);
      if (rgb) Object.assign(_cpk, _rgbToHsv(rgb.r,rgb.g,rgb.b));
    }
    popup.classList.remove('cpk-popup--hidden');
    _cpkRender();

    const canvas=document.getElementById('cpkRingCanvas');
    if (canvas) {
      let painting=false;
      canvas.onpointerdown=(e)=>{
        e.preventDefault(); painting=true; canvas.setPointerCapture(e.pointerId);
        const rect=canvas.getBoundingClientRect(), scale=CPK_W/rect.width;
        const x=(e.clientX-rect.left)*scale, y=(e.clientY-rect.top)*scale;
        _cpkDragZone=_cpkHitTest(x,y);
        _cpkApplyEvent(e,canvas);
      };
      canvas.onpointermove=(e)=>{ if(painting){e.preventDefault();_cpkApplyEvent(e,canvas);} };
      canvas.onpointerup=canvas.onpointercancel=()=>{ painting=false; _cpkDragZone=null; };
    }

    const hexEl=document.getElementById('cpkHex');
    if (hexEl) hexEl.oninput=()=>{
      const rgb=_hexToRgb(hexEl.value);
      if(rgb){Object.assign(_cpk,_rgbToHsv(rgb.r,rgb.g,rgb.b));_cpkRender();}
    };
    ['R','G','B'].forEach(ch=>{
      const el=document.getElementById('cpk'+ch);
      if(!el) return;
      el.oninput=()=>{
        const r=parseInt(document.getElementById('cpkR')?.value||0,10);
        const g=parseInt(document.getElementById('cpkG')?.value||0,10);
        const b=parseInt(document.getElementById('cpkB')?.value||0,10);
        if([r,g,b].some(isNaN)) return;
        Object.assign(_cpk,_rgbToHsv(
          Math.max(0,Math.min(255,r)),
          Math.max(0,Math.min(255,g)),
          Math.max(0,Math.min(255,b))
        ));
        _cpkRender();
      };
    });

    const eyeBtn=document.getElementById('cpkEyedropper');
    if (eyeBtn) {
      eyeBtn.disabled=!window.EyeDropper;
      eyeBtn.onclick=async()=>{
        if(!window.EyeDropper) return;
        try {
          const res=await new EyeDropper().open();
          const rgb=_hexToRgb(res.sRGBHex);
          if(rgb){Object.assign(_cpk,_rgbToHsv(rgb.r,rgb.g,rgb.b));_cpkRender();}
        } catch{}
      };
    }

    document.getElementById('cpkClose').onclick=cpkClose;
    document.getElementById('cpkBackdrop').onclick=cpkClose;
  }

  function cpkClose() {
    const popup=document.getElementById('colorPickerPopup');
    if(popup) popup.classList.add('cpk-popup--hidden');
  }

  function showCustomizeModal(mats, slotIndices) {
    const modal = document.getElementById('equipCustomizeModal');
    const nameInput = document.getElementById('equipNameInput');
    if (!modal) return;
    // 등급 기준 슬롯 결정: 가장 높은 티어 재료의 슬롯 → 동등級이면 먼저 놓인 슬롯
    const TIER_RANK = { legendary: 4, epic: 3, rare: 2, common: 1 };
    let primaryIdx = Array.isArray(slotIndices) && slotIndices.length > 0 ? slotIndices[0] : 0;
    let primaryRank = 0;
    mats.forEach((m, j) => {
      const rank = TIER_RANK[m?.rarity || m?.tier || 'common'] || 1;
      const idx = slotIndices?.[j] ?? j;
      if (rank > primaryRank || (rank === primaryRank && idx < primaryIdx)) {
        primaryRank = rank;
        primaryIdx = idx;
      }
    });
    const nouns = SLOT_ITEM_NOUNS[forgeSlot] || SLOT_ITEM_NOUNS.weapon;
    const fixedNoun = nouns[primaryIdx] || nouns[0];
    const initName = generateEquipName(mats, fixedNoun);
    if (nameInput) nameInput.value = initName;
    pixelArtImageUrl = null;
    pixelGrid = Array(PIXEL_G * PIXEL_G).fill(null);
    modal.classList.remove('equip-customize-modal--hidden');
    modal.setAttribute('aria-hidden', 'false');
    renderPixelCanvas();
    nameInput && nameInput.focus();
    // DB에서 명사 기반 이미지 조회 (없으면 빈 이미지)
    void _fetchEquipArtFromDb(fixedNoun);

    const canvas = document.getElementById('equipPixelCanvas');
    if (canvas) {
      canvas.onpointerdown = (e) => { e.preventDefault(); pixelPainting = true; paintPixelAt(e); };
      canvas.onpointermove = (e) => { if (pixelPainting) { e.preventDefault(); paintPixelAt(e); } };
      canvas.onpointerup = canvas.onpointerleave = canvas.onpointercancel = () => { pixelPainting = false; };
    }

    const eraserBtn = document.getElementById('equipEraserBtn');
    const colorBtn = document.getElementById('equipColorBtn');
    const eyedropperBtn = document.getElementById('equipEyedropperBtn');
    const pixelCanvas = document.getElementById('equipPixelCanvas');

    let eyedropperMode = false;
    function setEyedropperMode(on) {
      eyedropperMode = on;
      if (eyedropperBtn) eyedropperBtn.classList.toggle('is-active', on);
      if (pixelCanvas) pixelCanvas.classList.toggle('eyedropper-mode', on);
    }

    if (colorBtn) colorBtn.onclick = () => { setEyedropperMode(false); cpkOpen(pixelColor || '#c0392b'); };
    if (eraserBtn) {
      eraserBtn.classList.toggle('is-active', pixelColor === null);
      eraserBtn.onclick = () => {
        setEyedropperMode(false);
        pixelColor = null;
        eraserBtn.classList.add('is-active');
        const sw = document.getElementById('equipColorSwatch');
        if (sw) sw.style.background = 'repeating-conic-gradient(#555 0% 25%,#333 0% 50%) 0 0/10px 10px';
      };
    }
    if (eyedropperBtn) {
      eyedropperBtn.onclick = () => setEyedropperMode(!eyedropperMode);
    }
    // 스포이드 모드: 캔버스 클릭 시 색상 추출
    if (pixelCanvas) {
      pixelCanvas.addEventListener('pointerdown', (e) => {
        if (!eyedropperMode) return;
        e.preventDefault(); e.stopPropagation();
        const rect = pixelCanvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / rect.width * PIXEL_G);
        const row = Math.floor((e.clientY - rect.top) / rect.height * PIXEL_G);
        if (col < 0 || col >= PIXEL_G || row < 0 || row >= PIXEL_G) return;
        const picked = pixelGrid[row * PIXEL_G + col];
        if (!picked) return; // 빈 셀은 무시
        pixelColor = picked;
        // 색상 스와치 갱신
        const sw = document.getElementById('equipColorSwatch');
        if (sw) sw.style.background = picked;
        if (eraserBtn) eraserBtn.classList.remove('is-active');
        setEyedropperMode(false); // 추출 후 바로 그리기 모드로 전환
      }, true);
    }

    const rndNameBtn = document.getElementById('equipRandomNameBtn');
    const rndPixelBtn = document.getElementById('equipRandomPixelBtn');
    const clearBtn = document.getElementById('equipClearBtn');
    const doneBtn = document.getElementById('equipCustomizeDoneBtn');
    const backdrop = document.getElementById('equipCustomizeBackdrop');
    if (rndNameBtn) rndNameBtn.onclick = () => { if (nameInput) nameInput.value = generateEquipName(mats, fixedNoun); };
    if (rndPixelBtn) rndPixelBtn.onclick = () => {
      pixelArtImageUrl = null;
      pixelGrid = Array(PIXEL_G * PIXEL_G).fill(null);
      renderPixelCanvas();
      void _fetchEquipArtFromDb(fixedNoun);
    };
    if (clearBtn) clearBtn.onclick = () => { pixelArtImageUrl = null; pixelGrid = Array(PIXEL_G * PIXEL_G).fill(null); renderPixelCanvas(); };
    if (doneBtn) doneBtn.onclick = () => {
      const name = (nameInput?.value || '').trim() || generateEquipName(mats);
      // 유저가 직접 그린 경우: 캔버스 PNG → dataURL로 전송 (가장 단순하고 확실)
      let finalUrl = pixelArtImageUrl;
      if (!finalUrl && pixelGrid.some(Boolean)) {
        const cv = document.getElementById('equipPixelCanvas');
        if (cv) finalUrl = cv.toDataURL('image/png');
      }
      hideCustomizeModal();
      showTimingBar((bonus) => forge(name, null, finalUrl, bonus));
    };
    if (backdrop) backdrop.onclick = () => { hideCustomizeModal(); };
  }

  function hideCustomizeModal() {
    const modal = document.getElementById('equipCustomizeModal');
    if (!modal) return;
    modal.classList.add('equip-customize-modal--hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (btnForge) btnForge.addEventListener('click', () => {
    if (forgeInFlight) return;
    const usedSlots = selected.map((m, i) => (m ? { m, i } : null)).filter(Boolean);
    if (usedSlots.length < MIN_SMELT_MATERIALS_FOR_FORGE) return;
    const used = usedSlots.map(({ m }) => m);
    if (used.some((m) => !isSmeltMaterial(m))) {
      if (statusMsgEl) statusMsgEl.textContent = '모루에는 기초 재료(산출물)만 올릴 수 있어요.';
      return;
    }
    showCustomizeModal(used, usedSlots.map(({ i }) => i));
  });

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
        if (btnForge) btnForge.textContent = tr('forge_specific', { label: def.label });
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
  const REPAIR_COLS = 6, REPAIR_ROWS = 8;
  const REPAIR_COST_TABLE = { common: 5, rare: 12, epic: 30, legendary: 70 };
  let repairItem = null;
  let repairConfirmInFlight = false;  // 중복 확인 방지
  let repairItemIsModule = false;  // true면 모듈 수리
  let repairModulePool = [];  // 수리 탭용 모듈 캐시
  let repairMaxDur = 0, repairOrigDur = 0, repairDur = 0;
  let repairCracks      = null;
  let repairImg         = null;
  let repairSpent       = 0;
  let repairDurPerCrack = 1;
  // 해머 게임 상태
  let repairRafId           = null;
  let repairParticles       = [];
  let repairHammerT         = 0;      // 연속 증가 (radians)
  let repairHammerSpeed     = 0.0013; // rad/ms
  let repairHammerSpeedMax  = 0.0042;
  let repairStrikeThresh    = 0.28;   // |sin(T)| < this = 타격 구역
  let repairStrikeThreshMin = 0.11;
  let repairTargetCrack     = null;   // 현재 수리 대상 균열 key
  let repairCombo           = 0;
  let repairFlash           = null;   // {hit:bool, born:number}
  let repairLastTs          = 0;

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
    const damage = maxDur - curDur;
    if (damage <= 0) return new Set();
    const totalCells = REPAIR_COLS * REPAIR_ROWS;
    // 칸 수는 최대 totalCells, 내구도 차이에 비례
    const damagedCount = Math.min(totalCells, Math.max(1, Math.round((damage / maxDur) * totalCells)));
    // 칸 하나당 회복 내구도 (모든 칸을 수리하면 정확히 damage 회복)
    repairDurPerCrack = Math.max(1, Math.round(damage / damagedCount));
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

  // 균열 형태 헬퍼 — 인접 셀이 동일 점을 공유해 자연스러운 파편선 생성
  function hEdgeMid(c, rb, cellW, cellH, ox, oy, eqId) {
    const rng = seededRng(hashStr(`h${c}_${rb}_${eqId}`));
    return [ox + (c+0.5)*cellW + (rng()-0.5)*cellW*0.06, oy + rb*cellH + (rng()-0.5)*cellH*0.38];
  }
  function vEdgeMid(cb, r, cellW, cellH, ox, oy, eqId) {
    const rng = seededRng(hashStr(`v${cb}_${r}_${eqId}`));
    return [ox + cb*cellW + (rng()-0.5)*cellW*0.38, oy + (r+0.5)*cellH + (rng()-0.5)*cellH*0.06];
  }
  function drawFractureLine(ctx, p1, mid, p2) {
    ctx.save();
    ctx.shadowColor = 'rgba(255,210,70,1)'; ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(255,225,90,0.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(mid[0],mid[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,220,0.95)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(mid[0],mid[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke();
    ctx.restore();
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
    repairItemIsModule = false;
    repairItem = { ...item, _eqId: eqId };
    repairMaxDur = maxDur; repairOrigDur = curDur;
    repairDur = curDur; repairSpent = 0;
    repairCracks = generateCracks(curDur, maxDur, eqId);

    // 레어리티별 난이도 [시작속도, 최대속도, 시작타격창, 최소타격창]
    const dm = {
      common:    [0.0011, 0.0038, 0.30, 0.12],
      rare:      [0.0014, 0.0046, 0.26, 0.10],
      epic:      [0.0018, 0.0054, 0.22, 0.08],
      legendary: [0.0024, 0.0064, 0.18, 0.07],
    };
    const d = dm[String(item.tier || 'common').toLowerCase()] || dm.common;
    repairHammerSpeed = d[0]; repairHammerSpeedMax = d[1];
    repairStrikeThresh = d[2]; repairStrikeThreshMin = d[3];
    repairHammerT = Math.PI * 0.5; // 오른쪽 끝에서 출발
    repairCombo = 0; repairFlash = null; repairParticles = []; repairLastTs = 0;
    repairTargetCrack = repairCracks.size > 0
      ? [...repairCracks][Math.floor(Math.random() * repairCracks.size)] : null;

    $repairEquipList?.querySelectorAll('.repair-equip-item')
      .forEach(el => el.classList.toggle('is-selected', el.dataset.id === eqId));
    $repairHint?.classList.add('hidden');
    $repairCanvas?.classList.remove('hidden');
    $repairControls?.classList.remove('hidden');
    if ($repairCanvas) {
      const dz = document.getElementById('repairDropZone');
      if (dz) {
        $repairCanvas.width  = dz.clientWidth  || 320;
        $repairCanvas.height = dz.clientHeight || 400;
        repairCtx = $repairCanvas.getContext('2d');
      }
    }
    repairImg = null;
    const imgSrc = item.pixelArt?.imageDataUrl;
    if (imgSrc) {
      const img = new Image();
      img.onload = () => { repairImg = img; };
      img.src = imgSrc;
    }
    updateRepairHud();
    startRepairHammer();
  }

  function drawRepairCanvas(ts) {
    if (!repairCtx || !repairItem || !repairCracks) return;
    const ctx = repairCtx;
    const cw = $repairCanvas.width, ch = $repairCanvas.height;
    const eqId = repairItem._eqId;

    // 프레임 델타 (프레임레이트 독립)
    const dt = repairLastTs ? Math.min(ts - repairLastTs, 50) : 16;
    repairLastTs = ts;
    repairHammerT += repairHammerSpeed * dt;

    ctx.clearRect(0, 0, cw, ch);

    const splitY = Math.floor(ch * 0.58);
    const forgeH  = ch - splitY;
    const mg = 8;
    const eqW = cw - mg*2, eqH = splitY - mg*2;
    const cellW = eqW / REPAIR_COLS, cellH = eqH / REPAIR_ROWS;

    // 장비 이미지
    if (repairImg) {
      ctx.drawImage(repairImg, mg, mg, eqW, eqH);
      const tintMap = { rare:'rgba(60,160,255,0.09)', epic:'rgba(180,60,255,0.11)', legendary:'rgba(255,170,20,0.12)' };
      const tint = tintMap[String(repairItem.tier||'').toLowerCase()];
      if (tint) { ctx.fillStyle = tint; ctx.fillRect(mg, mg, eqW, eqH); }
    } else {
      ctx.fillStyle = 'rgba(20,10,38,0.95)'; ctx.fillRect(mg, mg, eqW, eqH);
      ctx.save();
      ctx.shadowColor='rgba(160,120,255,0.55)'; ctx.shadowBlur=30;
      ctx.font=`${Math.min(eqW,eqH)*0.55}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff';
      ctx.fillText(repairItem.emoji||'⚔️', cw/2, splitY/2);
      ctx.restore();
    }

    // 균열 오버레이 + 타겟 강조
    for (const key of repairCracks) {
      const [c, r] = key.split(',').map(Number);
      const cx = mg + (c+0.5)*cellW, cy = mg + (r+0.5)*cellH;
      const isTarget = key === repairTargetCrack;
      const x0=mg+c*cellW, y0=mg+r*cellH, x1=x0+cellW, y1=y0+cellH;
      const tM=hEdgeMid(c,r,cellW,cellH,mg,mg,eqId), bM=hEdgeMid(c,r+1,cellW,cellH,mg,mg,eqId);
      const lM=vEdgeMid(c,r,cellW,cellH,mg,mg,eqId),  rM=vEdgeMid(c+1,r,cellW,cellH,mg,mg,eqId);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0,y0); ctx.lineTo(tM[0],tM[1]); ctx.lineTo(x1,y0);
      ctx.lineTo(rM[0],rM[1]); ctx.lineTo(x1,y1);
      ctx.lineTo(bM[0],bM[1]); ctx.lineTo(x0,y1);
      ctx.lineTo(lM[0],lM[1]); ctx.closePath();
      ctx.clip();
      ctx.fillStyle = isTarget ? 'rgba(22,10,4,0.72)' : 'rgba(8,4,2,0.88)';
      ctx.fillRect(x0, y0, cellW, cellH);
      const rng = seededRng(hashStr(`rust_${key}_${eqId}`));
      for (let i = 0, spots = 4 + Math.floor(rng()*5); i < spots; i++) {
        ctx.fillStyle = `rgba(${110+Math.floor(rng()*70)},${28+Math.floor(rng()*25)},${5+Math.floor(rng()*10)},${0.35+rng()*0.35})`;
        ctx.beginPath(); ctx.arc(x0+rng()*cellW, y0+rng()*cellH, 1.2+rng()*2.5, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
      if (isTarget) {
        const pulse = 0.55 + 0.45*Math.sin(ts*0.0072);
        ctx.save();
        ctx.shadowColor='rgba(255,200,40,1)'; ctx.shadowBlur=18*pulse;
        ctx.strokeStyle=`rgba(255,200,40,${0.6+0.4*pulse})`; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(cx, cy, Math.min(cellW,cellH)*0.36, 0, Math.PI*2); ctx.stroke();
        const cs=Math.min(cellW,cellH)*0.27;
        ctx.strokeStyle=`rgba(255,240,140,${0.55*pulse})`; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(cx-cs,cy); ctx.lineTo(cx+cs,cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx,cy-cs); ctx.lineTo(cx,cy+cs); ctx.stroke();
        ctx.restore();
      }
    }

    // 균열 경계선
    for (let c=0; c<REPAIR_COLS; c++) {
      for (let r=0; r<REPAIR_ROWS; r++) {
        if (c+1<REPAIR_COLS && repairCracks.has(`${c},${r}`)!==repairCracks.has(`${c+1},${r}`))
          drawFractureLine(ctx,[mg+(c+1)*cellW,mg+r*cellH], vEdgeMid(c+1,r,cellW,cellH,mg,mg,eqId), [mg+(c+1)*cellW,mg+(r+1)*cellH]);
        if (r+1<REPAIR_ROWS && repairCracks.has(`${c},${r}`)!==repairCracks.has(`${c},${r+1}`))
          drawFractureLine(ctx,[mg+c*cellW,mg+(r+1)*cellH], hEdgeMid(c,r+1,cellW,cellH,mg,mg,eqId), [mg+(c+1)*cellW,mg+(r+1)*cellH]);
      }
    }

    // 타격/실패 플래시
    if (repairFlash) {
      const age = ts - repairFlash.born;
      const alpha = Math.max(0, 0.40 - age / 200);
      if (alpha > 0) {
        ctx.fillStyle = repairFlash.hit ? `rgba(255,255,180,${alpha})` : `rgba(200,20,20,${alpha})`;
        ctx.fillRect(0, 0, cw, splitY);
      } else { repairFlash = null; }
    }

    // 연타 표시
    if (repairCombo >= 2) {
      ctx.save();
      ctx.font = `bold ${13+Math.min(repairCombo*0.8,8)}px Jua,sans-serif`;
      ctx.textAlign='right'; ctx.textBaseline='top';
      ctx.fillStyle='#fde68a'; ctx.shadowColor='#f59e0b'; ctx.shadowBlur=10;
      ctx.fillText(`🔥 ${repairCombo}연타!`, cw-8, 7);
      ctx.restore();
    }

    // 완료 오버레이
    if (repairCracks.size === 0) {
      ctx.save();
      ctx.fillStyle='rgba(0,0,0,0.42)'; ctx.fillRect(0, 0, cw, splitY);
      ctx.font='bold 26px Jua,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='#4ade80'; ctx.shadowColor='#22c55e'; ctx.shadowBlur=22;
      ctx.fillText('✅ 수리 완료!', cw/2, splitY/2);
      ctx.restore();
    }

    // 구분선 (강철 색상)
    const divG = ctx.createLinearGradient(0, splitY-2, 0, splitY+3);
    divG.addColorStop(0,'rgba(150,175,210,0.65)'); divG.addColorStop(1,'rgba(40,55,80,0.4)');
    ctx.fillStyle=divG; ctx.fillRect(0, splitY-1, cw, 4);

    // ═══ 분쇄기 영역 ═══
    // 공업용 어두운 배경
    const grindBg = ctx.createLinearGradient(0, splitY, 0, ch);
    grindBg.addColorStop(0,'#13151e'); grindBg.addColorStop(0.7,'#0d0e16'); grindBg.addColorStop(1,'#08090e');
    ctx.fillStyle=grindBg; ctx.fillRect(0, splitY, cw, forgeH);

    // 분쇄기 회전 원판 (하단에서 상단 호만 보임)
    const pivX = cw*0.5, pivY = splitY+8;
    const discR  = Math.min(cw*0.46, forgeH*1.15);
    const discCx = pivX, discCy = ch + discR*0.38;
    const hamLen = Math.max(forgeH*0.28, discCy - discR - pivY);
    const discRot = ts * 0.0028; // 느린 회전

    ctx.save();
    ctx.beginPath(); ctx.rect(0, splitY, cw, forgeH); ctx.clip(); // 캔버스 안만 그리기

    // 원판 본체
    ctx.beginPath(); ctx.arc(discCx, discCy, discR, 0, Math.PI*2);
    ctx.fillStyle='#252830'; ctx.fill();

    // 원판 세그먼트 + 외곽 톱니 (회전)
    ctx.save();
    ctx.translate(discCx, discCy); ctx.rotate(discRot);
    const segN = 20;
    for (let i=0; i<segN; i++) {
      const a = (i/segN)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*discR*0.28, Math.sin(a)*discR*0.28);
      ctx.lineTo(Math.cos(a)*discR*0.92, Math.sin(a)*discR*0.92);
      ctx.strokeStyle = i%2===0 ? 'rgba(75,88,115,0.7)' : 'rgba(50,60,85,0.45)';
      ctx.lineWidth=1.8; ctx.stroke();
    }
    // 톱니 외곽 (그라인더 질감)
    for (let i=0; i<segN*2; i++) {
      const a1=(i/(segN*2))*Math.PI*2, a2=((i+0.5)/(segN*2))*Math.PI*2;
      ctx.beginPath(); ctx.arc(0,0,discR*0.965,a1,a2);
      ctx.strokeStyle = i%2===0 ? 'rgba(110,128,160,0.8)' : 'rgba(65,78,105,0.5)';
      ctx.lineWidth=discR*0.07; ctx.stroke();
    }
    ctx.restore();

    // 원판 테두리 링
    ctx.beginPath(); ctx.arc(discCx, discCy, discR, 0, Math.PI*2);
    ctx.strokeStyle='rgba(95,115,150,0.75)'; ctx.lineWidth=3; ctx.stroke();
    ctx.restore();

    const hamAngle = Math.sin(repairHammerT) * Math.PI * 0.54;
    const hamHeadX = pivX + Math.sin(hamAngle)*hamLen;
    const hamHeadY = pivY + Math.cos(hamAngle)*hamLen;

    // 접촉 구역 글로우 (팔이 중앙 가까울수록 빛남)
    const nearness = Math.max(0, 1 - Math.abs(Math.sin(repairHammerT)) / repairStrikeThresh);
    if (nearness > 0.05) {
      const cGlow = ctx.createRadialGradient(pivX, pivY+hamLen, 0, pivX, pivY+hamLen, hamLen*0.22);
      cGlow.addColorStop(0, `rgba(200,225,255,${nearness*0.4})`);
      cGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle=cGlow;
      ctx.fillRect(pivX-hamLen*0.22, pivY+hamLen-hamLen*0.22, hamLen*0.44, hamLen*0.44);
    }

    // 타격 구역 호 (파란 계열)
    const zoneA = Math.asin(Math.min(0.998, repairStrikeThresh));
    const perfA  = zoneA * 0.30;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pivX, pivY, hamLen, Math.PI*0.5-zoneA, Math.PI*0.5+zoneA);
    ctx.strokeStyle='rgba(100,180,255,0.20)';
    ctx.lineWidth=Math.max(5, Math.sin(zoneA)*hamLen*2.0); ctx.stroke();
    ctx.beginPath();
    ctx.arc(pivX, pivY, hamLen, Math.PI*0.5-perfA, Math.PI*0.5+perfA);
    ctx.strokeStyle='rgba(200,235,255,0.55)';
    ctx.lineWidth=Math.max(3, Math.sin(perfA)*hamLen*2.0); ctx.stroke();
    ctx.restore();

    // 프레스 팔 (금속 막대)
    ctx.save();
    ctx.strokeStyle='#6a7488'; ctx.lineWidth=9; ctx.lineCap='round';
    ctx.shadowColor='rgba(0,0,0,0.65)'; ctx.shadowBlur=6;
    ctx.beginPath(); ctx.moveTo(pivX,pivY); ctx.lineTo(hamHeadX,hamHeadY); ctx.stroke();
    // 광택 하이라이트
    ctx.strokeStyle='rgba(170,195,225,0.32)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(pivX,pivY); ctx.lineTo(hamHeadX,hamHeadY); ctx.stroke();
    // 프레스 블록 (팔 끝)
    const hW=Math.min(28,cw*0.088), hH=Math.min(15,cw*0.052);
    ctx.translate(hamHeadX,hamHeadY); ctx.rotate(hamAngle);
    ctx.fillStyle='#505868'; ctx.shadowColor='rgba(150,200,255,0.25)'; ctx.shadowBlur=8;
    ctx.fillRect(-hW*0.5,-hH*0.5,hW,hH);
    ctx.fillStyle='rgba(190,218,245,0.45)';
    ctx.fillRect(-hW*0.5,hH*0.5-4,hW,4); // 접촉면 광택
    ctx.strokeStyle='#8090aa'; ctx.lineWidth=1; ctx.shadowBlur=0;
    ctx.strokeRect(-hW*0.5,-hH*0.5,hW,hH);
    ctx.restore();

    // 피벗 볼트
    ctx.save();
    ctx.fillStyle='#8898b0'; ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=3;
    ctx.beginPath(); ctx.arc(pivX,pivY,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c0cede';
    ctx.beginPath(); ctx.arc(pivX,pivY,2.5,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // 파티클
    repairParticles = repairParticles.filter(p => p.life > 0);
    for (const p of repairParticles) {
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav??0.14; p.life-=0.028;
      if (p.life <= 0) continue;
      ctx.save();
      ctx.globalAlpha=Math.pow(p.life,0.6);
      ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=7;
      ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(0.5,p.size*Math.sqrt(p.life)),0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // RPM 게이지
    const hPct = Math.min(1, repairHammerSpeed / repairHammerSpeedMax);
    const barW = Math.min(65, cw*0.19);
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(8,ch-18,barW,7);
    const hCol = hPct>0.72?'#00ccff':hPct>0.42?'#3388ee':'#1155bb';
    ctx.fillStyle=hCol; ctx.shadowColor=hCol; ctx.shadowBlur=5;
    ctx.fillRect(8,ch-18,barW*hPct,7);
    ctx.shadowBlur=0;
    ctx.font='10px Jua,sans-serif'; ctx.fillStyle='rgba(140,190,240,0.8)';
    ctx.textAlign='left'; ctx.fillText('RPM', 8, ch-22);
    ctx.textAlign='right'; ctx.font='12px Jua,sans-serif';
    ctx.fillStyle='rgba(140,190,240,0.85)';
    ctx.fillText(`균열 ${repairCracks.size}개`, cw-8, ch-20);
  }

  // ══════════════════════════════════════════════
  //  수리: 대장장이 망치 타이밍 게임
  // ══════════════════════════════════════════════
  function startRepairHammer() {
    repairHammerT = Math.PI * 0.5;
    repairParticles = []; repairCombo = 0; repairFlash = null; repairLastTs = 0;
    if (repairRafId) cancelAnimationFrame(repairRafId);
    function loop(ts) { drawRepairCanvas(ts); repairRafId = requestAnimationFrame(loop); }
    repairRafId = requestAnimationFrame(loop);
  }

  function stopRepairHammer() {
    if (repairRafId) { cancelAnimationFrame(repairRafId); repairRafId = null; }
  }

  function _repairTargetScreenPos() {
    if (!$repairCanvas || !repairTargetCrack) return null;
    const cw2=$repairCanvas.width, ch2=$repairCanvas.height;
    const splitY=Math.floor(ch2*0.58), mg=8;
    const cellW=(cw2-mg*2)/REPAIR_COLS, cellH=(ch2*0.58-mg*2)/REPAIR_ROWS;
    const [c,r]=repairTargetCrack.split(',').map(Number);
    const cx=mg+(c+0.5)*cellW, cy=mg+(r+0.5)*cellH;
    const rect=$repairCanvas.getBoundingClientRect();
    return { x:rect.left+cx*(rect.width/cw2), y:rect.top+cy*(rect.height/ch2) };
  }

  function onRepairClick() {
    if (!repairItem || !repairTargetCrack || repairCracks.size === 0) return;
    const sinVal = Math.abs(Math.sin(repairHammerT));
    const inZone    = sinVal < repairStrikeThresh;
    const isPerfect = sinVal < repairStrikeThresh * 0.30;
    const cost = REPAIR_COST_TABLE[String(repairItem.tier||'common').toLowerCase()] ?? 5;

    if (inZone) {
      repairCracks.delete(repairTargetCrack);
      const bonus = isPerfect ? repairDurPerCrack : 0;
      repairDur = Math.min(repairMaxDur, repairDur + repairDurPerCrack + bonus);
      if (repairDur >= repairMaxDur) repairCracks.clear();
      repairCombo++;
      repairSpent += cost;
      repairFlash = { hit: true, born: performance.now() };

      // 분쇄 스파크 파티클 (프레스 블록 위치)
      if ($repairCanvas) {
        const ch2=$repairCanvas.height, cw2=$repairCanvas.width;
        const sY=Math.floor(ch2*0.58), fH=ch2-sY;
        const pX=cw2*0.5, pY=sY+8;
        const dR=Math.min(cw2*0.46,fH*1.15), dCy=ch2+dR*0.38;
        const hL=Math.max(fH*0.28, dCy-dR-pY);
        const hA=Math.sin(repairHammerT)*Math.PI*0.54;
        const hx=pX+Math.sin(hA)*hL, hy=pY+Math.cos(hA)*hL;
        // 분쇄기 스파크: 좌우로 퍼지는 흰색/파란색
        const cols=isPerfect?['#ffffff','#e8f4ff','#c8e8ff','#a0d0ff']:['#d0e8ff','#a8c8ee','#ffffff','#e0f0ff'];
        for (let i=0,cnt=isPerfect?30:18; i<cnt; i++) {
          const side=Math.random()>0.5?1:-1;
          const a=side*(Math.PI*0.08+Math.random()*Math.PI*0.52);
          const spd=3+Math.random()*(isPerfect?7:5);
          repairParticles.push({
            x:hx,y:hy,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-0.8,
            life:1,size:isPerfect?1.5+Math.random()*2.5:1+Math.random()*2,
            color:cols[Math.floor(Math.random()*cols.length)],grav:0.22,
          });
        }
      }

      const spos = _repairTargetScreenPos();
      if (spos) showRepairCoinFx(spos.x+18, spos.y-12, `-${cost}`, '#fbbf24');

      // 타격 성공 → 속도 증가 + 타격창 축소
      repairHammerSpeed  = Math.min(repairHammerSpeedMax, repairHammerSpeed  + 0.000082);
      repairStrikeThresh = Math.max(repairStrikeThreshMin, repairStrikeThresh - 0.0072);
      updateRepairHud();

      // 코인 소진 시 자동 완료
      if (totalCoins - repairSpent <= 0) {
        repairTargetCrack = null;
        stopRepairHammer();
        setTimeout(() => confirmRepairSession(), 750);
        return;
      }

      if (repairCracks.size > 0) {
        repairTargetCrack = [...repairCracks][Math.floor(Math.random()*repairCracks.size)];
      } else {
        repairTargetCrack = null;
        stopRepairHammer();
        setTimeout(() => confirmRepairSession(), 750);
      }
    } else {
      // 실패: 코인 소모 + 내구도 감소
      repairCombo = 0;
      repairSpent += cost;
      repairDur = Math.max(0, repairDur - repairDurPerCrack);
      // 실패로 내구도가 0 이하면 균열 하나 추가
      if (repairDur <= 0) repairDur = 0;
      repairFlash = { hit: false, born: performance.now() };

      // 실패 파티클 — 붉은 불꽃
      if ($repairCanvas) {
        const ch2=$repairCanvas.height, cw2=$repairCanvas.width;
        const sY=Math.floor(ch2*0.58), fH=ch2-sY;
        const pX=cw2*0.5, pY=sY+8;
        const dR=Math.min(cw2*0.46,fH*1.15), dCy=ch2+dR*0.38;
        const hL=Math.max(fH*0.28, dCy-dR-pY);
        const hA=Math.sin(repairHammerT)*Math.PI*0.54;
        const hx=pX+Math.sin(hA)*hL, hy=pY+Math.cos(hA)*hL;
        for (let i=0; i<14; i++) {
          const a=(Math.random()-0.5)*Math.PI*1.2;
          repairParticles.push({
            x:hx,y:hy,vx:Math.cos(a)*( 2+Math.random()*4),vy:Math.sin(a)*(2+Math.random()*4)-1,
            life:1,size:1+Math.random()*2,
            color:['#f87171','#ef4444','#fca5a5'][Math.floor(Math.random()*3)],grav:0.18,
          });
        }
      }

      const spos = _repairTargetScreenPos();
      if (spos) {
        showRepairCoinFx(spos.x+18, spos.y-12, `-${cost}`, '#f87171');
        showRepairCoinFx(spos.x-10, spos.y-28, `-${repairDurPerCrack}내구도`, '#f87171');
      }
      updateRepairHud();

      // 코인 소진 시 자동 완료
      if (totalCoins - repairSpent <= 0) {
        repairTargetCrack = null;
        stopRepairHammer();
        setTimeout(() => confirmRepairSession(), 750);
      }
    }
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
      $repairDurInfo.textContent = tr('repair_dur_info_full', { cur: repairDur, max: repairMaxDur });
      $repairDurInfo.style.color = repairDur < repairMaxDur ? '#f87171' : '#4ade80';
    }
    if ($repairCoinInfo) {
      $repairCoinInfo.textContent = tr('repair_coin_info', { n: Math.max(0, totalCoins - repairSpent).toLocaleString(), spent: repairSpent });
    }
  }

  async function confirmRepairSession() {
    if (repairConfirmInFlight) return;
    if (!repairItem) return;
    if (repairSpent === 0 && repairDur === repairOrigDur) { repairMsg('수리한 내용이 없습니다.'); return; }
    if (!alpToken || !platformApi) { repairMsg('로그인이 필요합니다.'); return; }
    repairConfirmInFlight = true;
    const btn = document.getElementById('repairConfirmBtn');
    if (btn) { btn.disabled = true; btn.textContent = tr('btn_processing'); }
    try {
      const url = repairItemIsModule
        ? `${platformApi}/api/modules/${encodeURIComponent(repairItem._eqId)}/repair`
        : `${platformApi}/api/craft/equipment/${encodeURIComponent(repairItem._eqId)}/repair`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
        body: JSON.stringify({ finalDur: Math.round(repairDur), totalCost: repairSpent }),
      });
      const d = await res.json();
      if (!res.ok) { repairMsg(d?.error?.message || '수리에 실패했습니다.'); return; }
      totalCoins = Math.max(0, totalCoins - (d.costPaid || 0));
      updateCoinDisplay();
      const netRepair = repairDur - repairOrigDur;
      const msg = netRepair >= 0
        ? `✅ 수리 완료! 🪙-${d.costPaid}`
        : `⚠️ 내구도 -${Math.abs(netRepair)} (실패 페널티) 🪙-${d.costPaid}`;
      repairMsg(msg);
      const wasModule = repairItemIsModule;
      repairItem = null;
      repairItemIsModule = false;
      $repairCanvas?.classList.add('hidden');
      $repairControls?.classList.add('hidden');
      $repairHint?.classList.remove('hidden');
      if (!wasModule) await refreshCraftedList();
      refreshRepairEquipList();
    } catch { repairMsg('수리 중 오류가 발생했습니다.'); }
    finally {
      repairConfirmInFlight = false;
      if (btn) { btn.disabled = false; btn.textContent = tr('btn_repair_done'); }
    }
  }

  async function refreshRepairEquipList() {
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
      name.className = 'repair-equip-name'; name.textContent = item.name || tr('result_default');
      const dur = document.createElement('div');
      dur.className = 'repair-equip-dur';
      if (maxDur > 0) {
        dur.innerHTML = `<span style="color:${damaged ? '#f87171' : '#4ade80'}">${curDur}/${maxDur}</span>`;
      } else { dur.textContent = tr('empty_dash'); }
      info.appendChild(name); info.appendChild(dur);
      el.appendChild(thumb); el.appendChild(info);

      if (damaged) {
        el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', String(item.equipmentId || item.id)));
        el.addEventListener('click', () => loadRepairItem(item));
      }
      $repairEquipList.appendChild(el);
    }

    // 모듈 섹션
    try {
      const modRes = await apiFetch(`${platformApi}/api/modules`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (!modRes.ok) return;
      const modData = await modRes.json();
      const damaged = (modData.modules || []).filter(m => m.equippedTo == null && m.durability < m.durabilityMax);
      if (damaged.length === 0) return;

      repairModulePool = damaged;

      const sep = document.createElement('p');
      sep.className = 'repair-module-section-title';
      sep.textContent = tr('modules_label');
      $repairEquipList.appendChild(sep);

      const TIER_COLOR = { common: '#9ca3af', rare: '#60a5fa', epic: '#c084fc', legendary: '#fbbf24' };
      for (const mod of damaged) {
        const el = document.createElement('div');
        el.className = 'repair-equip-item';
        el.title = mod.name;
        el.draggable = true;
        el.dataset.moduleId = mod.id;

        const thumb = document.createElement('div');
        thumb.className = 'repair-equip-thumb';
        thumb.textContent = '🔩';

        const info = document.createElement('div');
        info.className = 'repair-equip-info';
        const nameEl = document.createElement('div');
        nameEl.className = 'repair-equip-name';
        nameEl.textContent = mod.name;
        nameEl.style.color = TIER_COLOR[mod.tier] || '#fff';
        const durEl = document.createElement('div');
        durEl.className = 'repair-equip-dur';
        durEl.innerHTML = `<span style="color:#f87171">${mod.durability}/${mod.durabilityMax}</span>`;
        info.appendChild(nameEl); info.appendChild(durEl);
        el.appendChild(thumb); el.appendChild(info);
        el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', 'module:' + mod.id));
        el.addEventListener('click', () => loadRepairModule(mod));
        $repairEquipList.appendChild(el);
      }
    } catch { /* 모듈 로딩 실패 무시 */ }
  }

  function loadRepairModule(mod) {
    if (!mod || mod.durability >= mod.durabilityMax) { repairMsg('내구도가 최대입니다.'); return; }

    repairItemIsModule = true;
    repairItem = { tier: mod.tier, name: mod.name, emoji: '🔩', _eqId: mod.id };
    repairMaxDur = mod.durabilityMax;
    repairOrigDur = mod.durability;
    repairDur = mod.durability;
    repairSpent = 0;
    repairCracks = generateCracks(mod.durability, mod.durabilityMax, mod.id);

    const dm = {
      common:    [0.0011, 0.0038, 0.30, 0.12],
      rare:      [0.0014, 0.0046, 0.26, 0.10],
      epic:      [0.0018, 0.0054, 0.22, 0.08],
      legendary: [0.0024, 0.0064, 0.18, 0.07],
    };
    const d = dm[String(mod.tier || 'common').toLowerCase()] || dm.common;
    repairHammerSpeed = d[0]; repairHammerSpeedMax = d[1];
    repairStrikeThresh = d[2]; repairStrikeThreshMin = d[3];
    repairHammerT = Math.PI * 0.5;
    repairCombo = 0; repairFlash = null; repairParticles = []; repairLastTs = 0;
    repairTargetCrack = repairCracks.size > 0
      ? [...repairCracks][Math.floor(Math.random() * repairCracks.size)] : null;
    repairImg = null;  // 모듈은 이미지 없음 — 이모지로 표시

    $repairEquipList?.querySelectorAll('[data-module-id]')
      .forEach(el => el.classList.toggle('is-selected', el.dataset.moduleId === mod.id));
    $repairHint?.classList.add('hidden');
    $repairCanvas?.classList.remove('hidden');
    $repairControls?.classList.remove('hidden');
    document.getElementById('repairModuleCard')?.remove();
    if ($repairCanvas) {
      const dz = document.getElementById('repairDropZone');
      if (dz) {
        $repairCanvas.width  = dz.clientWidth  || 320;
        $repairCanvas.height = dz.clientHeight || 400;
        repairCtx = $repairCanvas.getContext('2d');
      }
    }
    updateRepairHud();
    startRepairHammer();
  }

  // 수리 탭 이벤트 바인딩
  if ($repairCanvas) {
    const dropZone = document.getElementById('repairDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault(); dropZone.classList.remove('drag-over');
        const raw = e.dataTransfer.getData('text/plain');
        if (raw.startsWith('module:')) {
          const modId = raw.slice(7);
          const mod = repairModulePool.find(m => m.id === modId);
          if (mod) loadRepairModule(mod);
        } else {
          const pool = (typeof serverEquipmentForgePool !== 'undefined') ? serverEquipmentForgePool : [];
          const item = pool.find(i => String(i.equipmentId || i.id) === raw);
          if (item) loadRepairItem(item);
        }
      });
    }
    $repairCanvas.addEventListener('click', onRepairClick);
    $repairCanvas.addEventListener('touchend', e => { e.preventDefault(); onRepairClick(); }, { passive: false });
    document.getElementById('repairConfirmBtn')?.addEventListener('click', () => {
      stopRepairHammer(); confirmRepairSession();
    });
  }

  // ══ 강화 탭 ════════════════════════════════════════════════════

  const ENHANCE_STONE_META = {
    stone_common:  { name: '일반 강화석', emoji: '🪨', rate: '60%', desc: '공격 또는 방어 +1' },
    stone_rare:    { name: '희귀 강화석', emoji: '💎', rate: '70%', desc: '공격 또는 방어 +2' },
    crystal_magic: { name: '마법 수정',   emoji: '🔮', rate: '80%', desc: '공/방 +1, 이속 +2%, 체력 +5' },
    shard_legend:  { name: '전설 파편',   emoji: '✨', rate: '85%', desc: '공/방 +3, 이속 +5%, 체력 +10' },
  };

  let enhanceStock = {};            // itemType → count
  let enhanceSelectedStone = null;  // itemType string
  let enhanceSelectedEquip = null;  // equipment object

  const $enhanceStoneGrid = document.getElementById('enhanceStoneGrid');
  const $enhanceEquipList = document.getElementById('enhanceEquipList');
  const $enhanceBtn       = document.getElementById('enhanceBtn');
  const $enhanceHint      = document.getElementById('enhanceHint');
  const $enhanceResult    = document.getElementById('enhanceResult');

  function renderEnhanceStones() {
    if (!$enhanceStoneGrid) return;
    $enhanceStoneGrid.innerHTML = '';
    Object.entries(ENHANCE_STONE_META).forEach(([type, meta]) => {
      const count = enhanceStock[type] || 0;
      const item = document.createElement('div');
      item.className = 'enhance-stone-item' +
        (count === 0 ? ' is-empty' : '') +
        (enhanceSelectedStone === type ? ' is-selected' : '');
      item.dataset.type = type;
      item.innerHTML = `
        <span class="enhance-stone-emoji">${meta.emoji}</span>
        <span class="enhance-stone-info">
          <span class="enhance-stone-name">${meta.name}</span>
          <span class="enhance-stone-count">보유 ${count}개</span>
          <span class="enhance-stone-rate">성공 ${meta.rate} · ${meta.desc}</span>
        </span>`;
      if (count > 0) {
        item.addEventListener('click', () => {
          enhanceSelectedStone = enhanceSelectedStone === type ? null : type;
          renderEnhanceStones();
          updateEnhanceBtn();
        });
      }
      $enhanceStoneGrid.appendChild(item);
    });
  }

  function renderEnhanceEquipList() {
    if (!$enhanceEquipList) return;
    $enhanceEquipList.innerHTML = '';
    const pool = (typeof serverEquipmentForgePool !== 'undefined' ? serverEquipmentForgePool : []);
    if (pool.length === 0) {
      $enhanceEquipList.innerHTML = '<p style="color:rgba(200,190,240,0.4);font-size:0.8rem;padding:0.5rem">' + tr('no_crafted') + '</p>';
      return;
    }
    pool.forEach((eq) => {
      const id    = eq.equipmentId || eq.id;
      const stats = eq.stats || {};
      const parts = [];
      if (stats.attackBonus)  parts.push(`공격 +${stats.attackBonus}`);
      if (stats.defenseBonus) parts.push(`방어 +${stats.defenseBonus}`);
      if (stats.speedBonus)   parts.push(`이속 +${Math.round(stats.speedBonus * 100)}%`);
      if (stats.hpBonus)      parts.push(`체력 +${stats.hpBonus}`);

      const item = document.createElement('div');
      item.className = 'enhance-equip-item' +
        (enhanceSelectedEquip && (enhanceSelectedEquip.equipmentId || enhanceSelectedEquip.id) === id ? ' is-selected' : '');
      item.innerHTML = `
        <div class="enhance-equip-thumb">${_renderEnhanceThumb(eq)}</div>
        <div class="enhance-equip-meta">
          <span class="enhance-equip-name">${eq.name || '이름 없음'}</span>
          <span class="enhance-equip-stats">${parts.join(' · ') || '스탯 없음'}</span>
        </div>`;
      item.addEventListener('click', () => {
        enhanceSelectedEquip = enhanceSelectedEquip && (enhanceSelectedEquip.equipmentId || enhanceSelectedEquip.id) === id ? null : eq;
        renderEnhanceEquipList();
        updateEnhanceBtn();
      });
      $enhanceEquipList.appendChild(item);
    });
  }

  function _renderEnhanceThumb(eq) {
    const pa = eq.pixelArt;
    if (pa && typeof pa === 'object' && typeof pa.imageDataUrl === 'string' && pa.imageDataUrl.startsWith('data:image/')) {
      return `<img src="${pa.imageDataUrl}" alt="" decoding="async" loading="lazy">`;
    }
    return `<span aria-hidden="true">${eq.itemEmoji || eq.emoji || '⚒️'}</span>`;
  }

  function updateEnhanceBtn() {
    const ready = !!enhanceSelectedStone && !!enhanceSelectedEquip;
    if ($enhanceBtn) $enhanceBtn.disabled = !ready;
    if ($enhanceHint) {
      if (ready) {
        const smeta = ENHANCE_STONE_META[enhanceSelectedStone];
        $enhanceHint.textContent = tr('enhance_with_item', { emoji: smeta.emoji, sname: smeta.name, ename: enhanceSelectedEquip.name });
      } else if (!enhanceSelectedStone && !enhanceSelectedEquip) {
        $enhanceHint.textContent = tr('enhance_hint');
      } else if (!enhanceSelectedStone) {
        $enhanceHint.textContent = tr('enhance_pick_item');
      } else {
        $enhanceHint.textContent = tr('enhance_pick_equip');
      }
    }
  }

  async function loadEnhancementTab() {
    if (!$enhanceStoneGrid) return;
    try {
      const resp = await apiFetch(`${platformApi}/api/craft/enhancement-stock`, {
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      if (resp.ok) {
        const json = await resp.json();
        enhanceStock = json.stock || {};
      }
    } catch (e) { /* non-fatal */ }
    renderEnhanceStones();
    renderEnhanceEquipList();
    updateEnhanceBtn();
  }

  if ($enhanceBtn) {
    $enhanceBtn.addEventListener('click', async () => {
      if (!enhanceSelectedStone || !enhanceSelectedEquip || $enhanceBtn.disabled) return;
      const equipId = enhanceSelectedEquip.equipmentId || enhanceSelectedEquip.id;
      $enhanceBtn.disabled = true;
      if ($enhanceResult) { $enhanceResult.textContent = tr('enhance_busy'); $enhanceResult.className = 'enhance-result'; }
      try {
        const resp = await apiFetch(`${platformApi}/api/craft/equipment/${equipId}/enhance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
          body: JSON.stringify({ itemType: enhanceSelectedStone }),
        });
        const json = await resp.json();
        if (!resp.ok) {
          if ($enhanceResult) { $enhanceResult.textContent = json?.error?.message || tr('enhance_fail_default'); $enhanceResult.className = 'enhance-result enhance-result--fail'; }
          $enhanceBtn.disabled = false;
          return;
        }
        // 소모 처리
        enhanceStock[enhanceSelectedStone] = Math.max(0, (enhanceStock[enhanceSelectedStone] || 1) - 1);

        if (json.success) {
          // 풀에서 스탯 업데이트
          const pool = (typeof serverEquipmentForgePool !== 'undefined' ? serverEquipmentForgePool : []);
          const poolItem = pool.find(e => (e.equipmentId || e.id) === equipId);
          if (poolItem && json.stats) { poolItem.stats = json.stats; enhanceSelectedEquip = poolItem; }
          if ($enhanceResult) { $enhanceResult.textContent = tr('enhance_success'); $enhanceResult.className = 'enhance-result enhance-result--success'; }
        } else {
          if ($enhanceResult) { $enhanceResult.textContent = tr('enhance_fail_msg'); $enhanceResult.className = 'enhance-result enhance-result--fail'; }
        }
        renderEnhanceStones();
        renderEnhanceEquipList();
        updateEnhanceBtn();
      } catch (e) {
        if ($enhanceResult) { $enhanceResult.textContent = tr('error_occurred'); $enhanceResult.className = 'enhance-result enhance-result--fail'; }
        $enhanceBtn.disabled = false;
      }
    });
  }

  // ══ 개조 탭 ════════════════════════════════════════════════════

  // Client-side module catalog (mirrors server lib/moduleCatalog.js)
  const MODULE_CATALOG_CLIENT = {
    barrel:        { label:'날/총열',   emoji:'⚔️',  equipSlots:['weapon'] },
    scope:         { label:'조준기',    emoji:'🎯',  equipSlots:['weapon'] },
    grip:          { label:'손잡이',    emoji:'✊',  equipSlots:['weapon','gloves'] },
    muzzle:        { label:'날끝/총구', emoji:'💥',  equipSlots:['weapon'] },
    padding:       { label:'내장재',    emoji:'🛡️', equipSlots:['head','chest','pants','gloves','boots'] },
    reinforcement: { label:'보강재',    emoji:'⚙️', equipSlots:['chest'] },
    visor:         { label:'바이저',    emoji:'👁️', equipSlots:['head'] },
    lining:        { label:'라이닝',    emoji:'🧶',  equipSlots:['chest'] },
    sole:          { label:'밑창',      emoji:'👟',  equipSlots:['boots'] },
    gem:           { label:'보석',      emoji:'💎',  equipSlots:['accessory'] },
    enchant:       { label:'각인',      emoji:'✨',  equipSlots:['accessory'] },
    buffer:        { label:'완충재',    emoji:'🛡️', equipSlots:['weapon','head','chest','pants','gloves','boots','accessory'] },
  };
  const EQUIP_MODULE_SLOTS_CLIENT = {
    weapon:    ['barrel','scope','grip','muzzle','buffer'],
    head:      ['padding','visor','buffer'],
    chest:     ['padding','reinforcement','lining','buffer'],
    pants:     ['padding','buffer'],
    gloves:    ['grip','padding','buffer'],
    boots:     ['sole','padding','buffer'],
    accessory: ['gem','enchant','buffer'],
  };
  const TIER_LABEL = { common:'일반', rare:'희귀', epic:'에픽', legendary:'전설' };

  // Client-side synergy calculation (mirrors server lib/moduleSynergy.js)
  const BONUS_SYNERGIES_CLIENT = {
    '화염':{ name:'화염 공명',  atkMul:1.20, defMul:0.90 },
    '냉기':{ name:'빙결 공명',  spdAdd:0.15, atkMul:0.95 },
    '번개':{ name:'번개 공명',  atkMul:1.25, durDecayMul:2.0 },
    '독':  { name:'독성 공명',  defMul:1.10, spdAdd:-0.10 },
    '신성':{ name:'신성 공명',  hpMul:1.30,  spdAdd:-0.05 },
    '암흑':{ name:'암흑 공명',  atkMul:1.15, hpMul:0.90 },
    '관통':{ name:'관통 공명',  atkMul:1.30, defMul:0.80 },
    '방어':{ name:'방어 공명',  defMul:1.25, atkMul:0.90 },
    '기민':{ name:'기민 공명',  spdAdd:0.20, atkMul:0.90 },
    '강화':{ name:'강화 공명',  atkMul:1.15, defMul:1.10 },
    '치유':{ name:'치유 공명',  hpMul:1.40,  atkMul:0.85 },
    '저주':{ name:'저주 공명',  atkMul:1.15, defMul:1.15, spdAdd:0.05, hpMul:1.10, durDecayMul:1.5 },
  };
  const CONFLICT_PAIRS_CLIENT = [
    { pair:['화염','냉기'], name:'증기 폭발'   },
    { pair:['신성','암흑'], name:'존재 부정'   },
    { pair:['관통','방어'], name:'모순 구조'   },
    { pair:['기민','강화'], name:'무게 과부하' },
    { pair:['독','치유'],   name:'약효 상쇄'   },
    { pair:['번개','냉기'], name:'전도 방해'   },
  ];

  function calcSynergyClient(modules) {
    const counts = {};
    for (const m of modules) {
      for (const kw of (m.keywords || [])) counts[kw] = (counts[kw] || 0) + 1;
    }
    const present = new Set(Object.keys(counts));
    const bonuses = [], penalties = [];
    for (const cp of CONFLICT_PAIRS_CLIENT) {
      if (present.has(cp.pair[0]) && present.has(cp.pair[1])) penalties.push(cp.name);
    }
    for (const [kw, syn] of Object.entries(BONUS_SYNERGIES_CLIENT)) {
      if ((counts[kw] || 0) >= 2) bonuses.push(syn.name);
    }
    return { bonuses, penalties };
  }

  let moduleAllList      = [];  // all user modules from server
  let moduleSelectedEquip = null;  // currently selected equipment object
  let moduleSelectedModId = null;  // module id awaiting attachment
  let moduleSelectedSlot  = null;  // slot name awaiting attachment

  const $moduleEquipList      = document.getElementById('moduleEquipList');
  const $moduleSlotTitle      = document.getElementById('moduleSlotTitle');
  const $moduleSlotGrid       = document.getElementById('moduleSlotGrid');
  const $moduleSynergyDisplay = document.getElementById('moduleSynergyDisplay');
  const $moduleInvList        = document.getElementById('moduleInvList');
  const $moduleCraftPanel     = document.getElementById('moduleCraftPanel');
  const $moduleCraftToggleBtn = document.getElementById('moduleCraftToggleBtn');
  const $moduleCraftTypeList  = document.getElementById('moduleCraftTypeList');
  const $moduleCraftTierPreview = document.getElementById('moduleCraftTierPreview');
  const $moduleCraftBtn         = document.getElementById('moduleCraftBtn');
  const $moduleCraftMsg         = document.getElementById('moduleCraftMsg');

  let moduleCraftSelectedType = null;
  const MAX_CRAFT_SLOTS = 8;
  let moduleCraftSlots        = Array(MAX_CRAFT_SLOTS).fill(null);  // 인덱스 고정 슬롯
  let moduleCraftStockCache   = {};   // productId → { productId, name, emoji, count(남은) }

  async function loadModuleTab() {
    if (!$moduleEquipList) return;
    try {
      const [eqRes, modRes, stockRes] = await Promise.all([
        apiFetch(`${platformApi}/api/craft/equipment?limit=40`, { headers: { Authorization: `Bearer ${alpToken}` } }),
        apiFetch(`${platformApi}/api/modules`,                  { headers: { Authorization: `Bearer ${alpToken}` } }),
        apiFetch(`${platformApi}/api/smelt/stock`,              { headers: { Authorization: `Bearer ${alpToken}` } }),
      ]);
      const eqData    = eqRes.ok    ? await eqRes.json()    : {};
      const modData   = modRes.ok   ? await modRes.json()   : {};
      const stockData = stockRes.ok ? await stockRes.json() : {};
      const eqPool  = (eqData.equipment || []).filter(e => e && e.stats);
      moduleAllList = modData.modules || [];
      // 캐시 초기화 (슬롯 초기화는 하지 않음 — 열어둔 상태 유지)
      const raw = stockData.stock || {};
      moduleCraftStockCache = {};
      Object.values(raw).forEach(s => {
        if ((s.count || 0) > 0) moduleCraftStockCache[s.id || s.productId] = { ...s, productId: s.id || s.productId };
      });
      renderModuleEquipList(eqPool);
      renderModuleInvList();
      renderModuleCraftTypeList();
      renderModuleCraftSlots();
      renderModuleCraftStock();
    } catch (e) {
      if ($moduleEquipList) $moduleEquipList.innerHTML = '<p style="color:rgba(200,180,240,0.4);font-size:0.78rem;padding:0.5rem">' + tr('list_load_fail_short') + '</p>';
    }
  }

  function renderModuleEquipList(pool) {
    if (!$moduleEquipList) return;
    $moduleEquipList.innerHTML = '';
    if (!pool || pool.length === 0) {
      $moduleEquipList.innerHTML = '<p style="color:rgba(200,180,240,0.4);font-size:0.78rem;padding:0.5rem">' + tr('no_gear') + '</p>';
      return;
    }
    pool.forEach(eq => {
      const equipSlot = eq.stats?.equipSlot || 'weapon';
      const slots = EQUIP_MODULE_SLOTS_CLIENT[equipSlot] || [];
      const id = eq.equipmentId || eq.id;
      const attached = moduleAllList.filter(m => m.equippedTo === id).length;
      const item = document.createElement('div');
      item.className = 'module-equip-item' +
        (moduleSelectedEquip && (moduleSelectedEquip.equipmentId || moduleSelectedEquip.id) === id ? ' is-selected' : '');
      const pa = eq.pixelArt;
      const thumb = pa?.imageDataUrl
        ? `<img src="${pa.imageDataUrl}" alt="" decoding="async">`
        : `<span>${eq.itemEmoji || '⚒️'}</span>`;
      item.innerHTML = `
        <div class="module-equip-thumb">${thumb}</div>
        <div class="module-equip-meta">
          <span class="module-equip-name">${escHtmlModule(eq.name || '장비')}</span>
          <span class="module-equip-slot-count">${attached}/${slots.length} 슬롯</span>
        </div>`;
      item.addEventListener('click', () => {
        moduleSelectedEquip = eq;
        moduleSelectedModId = null;
        moduleSelectedSlot  = null;
        renderModuleEquipList(pool);
        renderModuleSlots(eq);
        renderModuleInvList();
      });
      $moduleEquipList.appendChild(item);
    });
  }

  function renderModuleSlots(eq) {
    if (!$moduleSlotGrid || !eq) return;
    $moduleSlotTitle.textContent = eq.name || tr('result_default');
    $moduleSlotGrid.innerHTML = '';
    const equipSlot = eq.stats?.equipSlot || 'weapon';
    const slots = EQUIP_MODULE_SLOTS_CLIENT[equipSlot] || [];
    const equipId = eq.equipmentId || eq.id;
    const attachedMods = moduleAllList.filter(m => m.equippedTo === equipId);

    slots.forEach(slotName => {
      const catalogEntry = MODULE_CATALOG_CLIENT[slotName];
      const filled = attachedMods.find(m => m.equippedSlot === slotName);
      const item = document.createElement('div');
      const isHighlight = !filled && moduleSelectedModId !== null && moduleSelectedSlot === null;
      item.className = 'module-slot-item' +
        (filled ? ' is-filled' : '') +
        (isHighlight ? ' is-highlight' : '');

      if (filled) {
        const kws = (filled.keywords || []).join(', ');
        const durPct = filled.durabilityMax > 0 ? Math.round(filled.durability / filled.durabilityMax * 100) : 0;
        item.innerHTML = `
          <span class="module-slot-label">${catalogEntry?.emoji || ''} ${slotName}</span>
          <div class="module-slot-content">
            <span class="module-slot-filled-name">${escHtmlModule(filled.name)}</span>
            <span class="module-slot-filled-meta">${escHtmlModule(kws)} · 내구 ${filled.durability}/${filled.durabilityMax} (${durPct}%)</span>
          </div>
          <button class="module-slot-detach-btn" data-modid="${escHtmlModule(filled.id)}">분리</button>`;
        item.querySelector('.module-slot-detach-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          detachModule(filled.id);
        });
      } else {
        item.innerHTML = `
          <span class="module-slot-label">${catalogEntry?.emoji || ''} ${slotName}</span>
          <div class="module-slot-content">
            <span class="module-slot-empty-hint">빈 슬롯 — 모듈을 선택 후 탭</span>
          </div>`;
        item.addEventListener('click', () => {
          if (moduleSelectedModId) {
            // Attach selected module to this slot
            attachModule(moduleSelectedModId, equipId, slotName);
          }
        });
      }
      $moduleSlotGrid.appendChild(item);
    });

    // Synergy display
    if ($moduleSynergyDisplay) {
      const { bonuses, penalties } = calcSynergyClient(attachedMods);
      let html = '';
      if (penalties.length) html += `<span class="module-synergy-penalty">⚡ 충돌: ${penalties.join(', ')}</span> `;
      if (bonuses.length)   html += `<span class="module-synergy-bonus">✨ 시너지: ${bonuses.join(', ')}</span>`;
      if (!html) html = '<span style="color:rgba(200,190,240,0.35)">시너지 없음</span>';
      $moduleSynergyDisplay.innerHTML = html;
    }
  }

  function renderModuleInvList() {
    if (!$moduleInvList) return;
    $moduleInvList.innerHTML = '';
    const unequipped = moduleAllList.filter(m => !m.equippedTo);
    const equipped   = moduleAllList.filter(m => m.equippedTo);
    const allSorted  = [...unequipped, ...equipped];
    if (allSorted.length === 0) {
      $moduleInvList.innerHTML = '<p style="color:rgba(200,180,240,0.35);font-size:0.75rem;padding:0.4rem">' + tr('module_no_modules') + '</p>';
      return;
    }
    allSorted.forEach(mod => {
      const isEquipped = !!mod.equippedTo;
      const isSelected = mod.id === moduleSelectedModId;
      const durPct = mod.durabilityMax > 0 ? Math.round(mod.durability / mod.durabilityMax * 100) : 0;
      const durLow = durPct < 30;
      const tierLabel = TIER_LABEL[mod.tier] || mod.tier;
      const tierClass = `tier-${mod.tier}`;
      const kws = (mod.keywords || []).join(', ');
      const item = document.createElement('div');
      item.className = 'module-inv-item' +
        (isEquipped ? ' is-equipped' : '') +
        (isSelected ? ' is-selected' : '');

      const statsStr = _moduleStatsStr(mod.stats);

      let html = `
        <div class="module-inv-name">
          <span class="${tierClass}">${escHtmlModule(mod.name)}</span>
          <span style="font-size:0.68rem;color:rgba(200,190,240,0.4)">[${escHtmlModule(tierLabel)}]</span>
        </div>
        <div class="module-inv-meta">${escHtmlModule(kws)} · ${escHtmlModule(statsStr)}</div>
        <div class="module-inv-dur ${durLow ? 'is-low' : 'is-ok'}">내구 ${mod.durability}/${mod.durabilityMax} (${durPct}%)</div>`;
      if (isEquipped) {
        html += `<div style="font-size:0.68rem;color:rgba(200,190,240,0.4)">장착됨 · 슬롯 ${escHtmlModule(mod.equippedSlot || '')}</div>`;
      }
      item.innerHTML = html;

      if (!isEquipped) {
        item.addEventListener('click', () => {
          moduleSelectedModId = isSelected ? null : mod.id;
          renderModuleInvList();
          if (moduleSelectedEquip) renderModuleSlots(moduleSelectedEquip);
        });
      }
      $moduleInvList.appendChild(item);
    });
  }

  function _moduleStatsStr(stats) {
    if (!stats || typeof stats !== 'object') return '';
    const parts = [];
    if (stats.attackBonus)  parts.push(`공격${stats.attackBonus > 0 ? '+' : ''}${stats.attackBonus}`);
    if (stats.defenseBonus) parts.push(`방어${stats.defenseBonus > 0 ? '+' : ''}${stats.defenseBonus}`);
    if (stats.speedBonus)   parts.push(`이속+${Math.round((stats.speedBonus || 0) * 100)}%`);
    if (stats.hpBonus)      parts.push(`HP${stats.hpBonus > 0 ? '+' : ''}${stats.hpBonus}`);
    return parts.join(' ');
  }

  async function attachModule(modId, equipId, slot) {
    try {
      const resp = await apiFetch(`${platformApi}/api/modules/${encodeURIComponent(modId)}/attach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
        body: JSON.stringify({ equipmentId: equipId, slot }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        alert(json?.error?.message || '장착 실패');
        return;
      }
      // Update local list
      const idx = moduleAllList.findIndex(m => m.id === modId);
      if (idx !== -1) moduleAllList[idx] = json.module;
      moduleSelectedModId = null;
      renderModuleSlots(moduleSelectedEquip);
      renderModuleInvList();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  }

  async function detachModule(modId) {
    try {
      const resp = await apiFetch(`${platformApi}/api/modules/${encodeURIComponent(modId)}/detach`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${alpToken}` },
      });
      const json = await resp.json();
      if (!resp.ok) { alert(json?.error?.message || '분리 실패'); return; }
      const idx = moduleAllList.findIndex(m => m.id === modId);
      if (idx !== -1) moduleAllList[idx] = json.module;
      renderModuleSlots(moduleSelectedEquip);
      renderModuleInvList();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  }


  const MODULE_TYPE_DESC = {
    barrel:        '무기에 장착. 공격 시 내구도가 닳고 공격력을 올립니다.',
    scope:         '무기에 장착. 공격 시 내구도가 닳고 공격력·이속을 올립니다.',
    grip:          '무기·장갑에 장착. 공격 시 내구도가 닳고 공격력·이속을 올립니다.',
    muzzle:        '무기에 장착. 공격 시 내구도가 닳고 공격력을 올립니다.',
    padding:       '방어구에 장착. 피격 시 내구도가 닳고 방어력·HP를 올립니다.',
    reinforcement: '상체에 장착. 피격 시 내구도가 닳고 방어력을 크게 올립니다.',
    visor:         '머리에 장착. 피격 시 내구도가 닳고 이속·HP를 올립니다.',
    lining:        '상체에 장착. 피격 시 내구도가 닳고 HP를 크게 올립니다.',
    sole:          '신발에 장착. 피격 시 내구도가 닳고 이동 속도를 올립니다.',
    gem:           '장신구에 장착. 공격 시 내구도가 닳고 공격력을 크게 올립니다.',
    enchant:       '장신구에 장착. 피격 시 내구도가 닳고 HP·방어력을 올립니다.',
    buffer:        '모든 장비에 장착. 장비 내구도가 닳을 때 대신 모듈 내구도가 감소해 장비를 보호합니다.',
  };

  function renderModuleCraftTypeList() {
    if (!$moduleCraftTypeList) return;
    $moduleCraftTypeList.innerHTML = '';
    Object.entries(MODULE_CATALOG_CLIENT).forEach(([typeId, meta]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'module-craft-type-btn' + (moduleCraftSelectedType === typeId ? ' is-selected' : '');
      btn.textContent = `${meta.emoji} ${meta.label}`;
      btn.addEventListener('click', () => {
        moduleCraftSelectedType = typeId;
        renderModuleCraftTypeList();
        updateModuleCraftBtn();
      });
      $moduleCraftTypeList.appendChild(btn);
    });
    const $desc = document.getElementById('moduleCraftTypeDesc');
    if ($desc) {
      const desc = moduleCraftSelectedType ? (MODULE_TYPE_DESC[moduleCraftSelectedType] || '') : '';
      $desc.textContent = desc;
      $desc.style.display = desc ? '' : 'none';
    }
  }

  // ── 재료 카테고리 맵 (smelt product id → category) ──────────────
  const CRAFT_MAT_CAT = (() => {
    const metal    = ['platinum','palladium','rhodium','iridium','tungsten','titanium','molybdenum','chromium','vanadium','niobium','cobalt','nickel','manganese','zinc','tin','lead','bismuth','antimony','magnesium','aluminum','copper','silver','gold','iron','slag'];
    const elec     = ['circuit','rareearth','neodymium','lanthanum','cerium','samarium','yttrium','gallium','germanium','indium','selenium','tellurium','hafnium','tantalum','zirconium','silicon','wafer','graphite','graphene','lithiumsalt','plasma','battery','lithium'];
    const chem     = ['sulfur','salt','sodaash','phosphor','phosphate','chloride','nitrate','ammonia','hydrogen','oxygen','nitrogen','helium','argon','uranium'];
    const organic  = ['rubber','plastic','resin','glass','fiber','leather','textile','fabric','wood'];
    const mineral  = ['silica','carbon','ceramic','cement','concrete','sand','limestone','granite','basalt','asphalt'];
    const map = {};
    metal.forEach(id   => { map[id] = 'metal'; });
    elec.forEach(id    => { map[id] = 'electronic'; });
    chem.forEach(id    => { map[id] = 'chemical'; });
    organic.forEach(id => { map[id] = 'organic'; });
    mineral.forEach(id => { map[id] = 'mineral'; });
    return map;
  })();

  const CAT_LABEL = { metal:'금속', electronic:'전자', chemical:'화학', organic:'유기물', mineral:'광물' };
  const CAT_COLOR = { metal:'#94a3b8', electronic:'#60a5fa', chemical:'#facc15', organic:'#86efac', mineral:'#d8b4fe' };

  // ── 시너지 규칙 ────────────────────────────────────────────────
  // type:'same' = 단일 카테고리 다수, type:'combo' = 두 카테고리 조합
  const CRAFT_SYNERGIES = [
    // 단일 카테고리 시너지
    { type:'same', cat:'metal',      min:2, name:'강철 공명',   desc:'방어력 +12%',        muls:{ defMul:1.12 } },
    { type:'same', cat:'metal',      min:4, name:'강철 요새',   desc:'방어력 +28%',        muls:{ defMul:1.28 }, overrides:'강철 공명' },
    { type:'same', cat:'electronic', min:2, name:'전기 공명',   desc:'이속 +10%',          muls:{ spdMul:1.10 } },
    { type:'same', cat:'electronic', min:4, name:'사이버 강화', desc:'이속 +22%',          muls:{ spdMul:1.22 }, overrides:'전기 공명' },
    { type:'same', cat:'chemical',   min:2, name:'화학 반응',   desc:'공격력 +12%',        muls:{ atkMul:1.12 } },
    { type:'same', cat:'organic',    min:2, name:'생체 강화',   desc:'HP +15%',            muls:{ hpMul:1.15 } },
    { type:'same', cat:'mineral',    min:2, name:'암반 강화',   desc:'내구도 +18%',        muls:{ durMul:1.18 } },
    // 조합 시너지 (보너스)
    { type:'combo', cats:['metal','electronic'],  name:'기계 공명',    desc:'전체 스탯 +8%',      muls:{ allMul:1.08 } },
    { type:'combo', cats:['metal','mineral'],     name:'강화 광물',    desc:'방어력 +10%',        muls:{ defMul:1.10 } },
    { type:'combo', cats:['electronic','chemical'],name:'에너지 폭발', desc:'공격력 +10%, 이속 +5%', muls:{ atkMul:1.10, spdMul:1.05 } },
    { type:'combo', cats:['organic','mineral'],   name:'자연 조화',    desc:'HP +8%, 내구도 +8%', muls:{ hpMul:1.08, durMul:1.08 } },
    // 조합 패널티
    { type:'combo', cats:['chemical','organic'],  name:'독성 오염',   desc:'전체 스탯 -18%', muls:{ allMul:0.82 }, penalty:true },
    { type:'combo', cats:['electronic','mineral'],name:'전기 단락',   desc:'이속 -12%',      muls:{ spdMul:0.88 }, penalty:true },
    { type:'combo', cats:['metal','chemical'],    name:'금속 부식',   desc:'방어력 -10%',    muls:{ defMul:0.90 }, penalty:true },
    // 분산 패널티 — 마구잡이 혼합 시 악화
    { type:'scatter', minCats:3, maxEach:1, name:'재료 불안정',
      desc:'다른 재료가 너무 많아 불안정: 전체 -12%',         muls:{ allMul:0.88 }, penalty:true },
    { type:'scatter', minCats:4,            name:'혼합 혼돈',
      desc:'재료가 서로 반발함: 전체 -25%',                   muls:{ allMul:0.75 }, penalty:true, overrides:'재료 불안정' },
    { type:'scatter', minCats:5,            name:'극한 혼돈',
      desc:'재료가 서로 충돌해 붕괴: 전체 -42%',              muls:{ allMul:0.58 }, penalty:true, overrides:'혼합 혼돈' },
  ];

  // ── 슬롯 위치 보너스 (4×2 그리드) ─────────────────────────────
  // 윗줄(0-3): 공격/이속 계열, 아랫줄(4-7): 방어/HP 계열
  const SLOT_ZONE_TOP    = new Set([0,1,2,3]);
  const SLOT_ZONE_BOTTOM = new Set([4,5,6,7]);
  const ZONE_BONUS_CATS  = {
    top:    new Set(['metal','electronic','chemical']),   // 공격 계열
    bottom: new Set(['organic','mineral']),               // 방어 계열
  };

  // 인접 슬롯 쌍 (가로/세로)
  const ADJACENT_PAIRS = [[0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[0,4],[1,5],[2,6],[3,7]];

  function getCraftItemCat(item) {
    return item ? (CRAFT_MAT_CAT[item.productId] || 'misc') : null;
  }

  function calcCraftSynergy(slots) {
    // 카테고리 카운트
    const catCount = {};
    slots.forEach(item => {
      const c = getCraftItemCat(item);
      if (c) catCount[c] = (catCount[c] || 0) + 1;
    });

    // 분산 패널티 계산용: 카테고리별 개수 (misc 제외)
    const realCats = Object.entries(catCount).filter(([c]) => c !== 'misc');
    const distinctCats = realCats.length;
    const singletonCats = realCats.filter(([, n]) => n === 1).length;

    // 시너지 규칙 적용 — 먼저 전부 매칭, 그 다음 overrides 필터
    const matched = [];
    const overridden = new Set();
    CRAFT_SYNERGIES.forEach(rule => {
      let match = false;
      if (rule.type === 'same') {
        match = (catCount[rule.cat] || 0) >= rule.min;
      } else if (rule.type === 'combo') {
        match = rule.cats.every(c => (catCount[c] || 0) >= 1);
      } else if (rule.type === 'scatter') {
        const meetsMin = distinctCats >= rule.minCats;
        const meetsMax = rule.maxEach == null || singletonCats >= rule.minCats;
        match = meetsMin && meetsMax;
      }
      if (match) {
        matched.push({ ...rule });
        if (rule.overrides) overridden.add(rule.overrides);
      }
    });
    // overrides된 규칙 제거 (하위 티어 규칙이 상위 티어와 중복 적용되는 버그 방지)
    const active = matched.filter(r => !overridden.has(r.name));

    // 슬롯 위치 보너스
    let zoneBonusAtk = 0, zoneBonusDef = 0;
    slots.forEach((item, idx) => {
      const cat = getCraftItemCat(item);
      if (!cat) return;
      if (SLOT_ZONE_TOP.has(idx) && ZONE_BONUS_CATS.top.has(cat))    zoneBonusAtk++;
      if (SLOT_ZONE_BOTTOM.has(idx) && ZONE_BONUS_CATS.bottom.has(cat)) zoneBonusDef++;
    });
    if (zoneBonusAtk > 0) active.push({ name:'공격 배치', desc:`공격력 +${zoneBonusAtk * 4}% (윗줄 배치 보너스)`, muls:{ atkMul: 1 + zoneBonusAtk * 0.04 } });
    if (zoneBonusDef > 0) active.push({ name:'방어 배치', desc:`방어/HP +${zoneBonusDef * 4}% (아랫줄 배치 보너스)`, muls:{ defMul: 1 + zoneBonusDef * 0.04, hpMul: 1 + zoneBonusDef * 0.04 } });

    // 인접 같은 카테고리 보너스
    let adjBonus = 0;
    ADJACENT_PAIRS.forEach(([a, b]) => {
      const ca = slots[a] ? getCraftItemCat(slots[a]) : null;
      const cb = slots[b] ? getCraftItemCat(slots[b]) : null;
      if (ca && ca === cb && ca !== 'misc') adjBonus++;
    });
    if (adjBonus > 0) active.push({ name:'인접 공명', desc:`전체 +${adjBonus * 3}% (같은 재료 인접 배치)`, muls:{ allMul: 1 + adjBonus * 0.03 } });

    // 최종 합산
    const totalMuls = { allMul:1, atkMul:1, defMul:1, spdMul:1, hpMul:1, durMul:1 };
    active.forEach(s => {
      Object.entries(s.muls || {}).forEach(([k, v]) => {
        totalMuls[k] = (totalMuls[k] || 1) * v;
      });
    });

    return { active, totalMuls };
  }

  function renderCraftSynergy(slots) {
    const $syn = document.getElementById('moduleCraftSynergy');
    if (!$syn) return;
    if (slots.length === 0) { $syn.innerHTML = ''; return; }
    const { active, totalMuls } = calcCraftSynergy(slots);
    if (active.length === 0) { $syn.innerHTML = ''; return; }
    const allNet = Object.values(totalMuls).reduce((p, v) => p * v, 1);
    const sign = allNet >= 1 ? '+' : '';
    const pct  = Math.round((allNet - 1) * 100);
    $syn.innerHTML = active.map(s => `
      <span class="mcw-syn-tag ${s.penalty ? 'is-bad' : 'is-good'}">
        ${s.penalty ? '⚠️' : '✨'} <strong>${escHtmlModule(s.name)}</strong> ${escHtmlModule(s.desc)}
      </span>`).join('') +
      `<span class="mcw-syn-total ${allNet >= 1 ? 'is-good' : 'is-bad'}">종합 스탯 ${sign}${pct}%</span>`;
  }

  function renderModuleCraftSlots() {
    const $slots = document.getElementById('moduleCraftSlots');
    const $count = document.getElementById('moduleCraftSlotCount');
    if ($slots) {
      $slots.innerHTML = '';
      for (let i = 0; i < MAX_CRAFT_SLOTS; i++) {
        const cell = document.createElement('div');
        const item = moduleCraftSlots[i];
        const zone = i < 4 ? 'top' : 'bottom';
        if (item) {
          const cat = getCraftItemCat(item);
          cell.className = 'mcw-slot mcw-slot--filled';
          cell.textContent = item.emoji || '📦';
          cell.title = `${item.name || ''}\n[${CAT_LABEL[cat] || cat}] — 클릭: 제거`;
          if (cat && CAT_COLOR[cat]) cell.style.borderColor = CAT_COLOR[cat] + '88';
          cell.draggable = true;
          cell.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', 'slot:' + i);
            cell.classList.add('is-dragging');
          });
          cell.addEventListener('dragend', () => cell.classList.remove('is-dragging'));
          cell.addEventListener('click', () => {
            const removed = moduleCraftSlots.splice(i, 1)[0];
            if (removed) {
              const pid = removed.productId;
              if (moduleCraftStockCache[pid]) moduleCraftStockCache[pid].count++;
              else moduleCraftStockCache[pid] = { ...removed, count: 1 };
            }
            renderModuleCraftSlots();
            renderModuleCraftStock();
          });
        } else {
          const inZone = zone === 'top' ? '공격' : '방어';
          cell.className = 'mcw-slot mcw-slot--empty';
          cell.title = `빈 슬롯 (${inZone} 구역)`;
          cell.textContent = i < 4 ? '⚔' : '🛡';
        }
        // 드롭 수신
        cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', e => {
          e.preventDefault(); cell.classList.remove('drag-over');
          const raw = e.dataTransfer.getData('text/plain');
          if (raw.startsWith('stock:')) {
            const pid = raw.slice(6);
            if (item) return; // 빈 슬롯에만
            const s = moduleCraftStockCache[pid];
            if (!s || s.count <= 0) return;
            moduleCraftSlots[i] = { productId: s.productId, name: s.name, emoji: s.emoji };
            s.count--;
          } else if (raw.startsWith('slot:')) {
            const from = parseInt(raw.slice(5), 10);
            if (from === i) return;
            const tmp = moduleCraftSlots[i] || null;
            moduleCraftSlots[i]    = moduleCraftSlots[from] || null;
            moduleCraftSlots[from] = tmp;
            // null이면 배열 정리 불필요 — 인덱스 직접 접근
          }
          renderModuleCraftSlots();
          renderModuleCraftStock();
          renderCraftSynergy(moduleCraftSlots.filter(Boolean));
          updateModuleCraftBtn();
        });
        $slots.appendChild(cell);
      }
    }
    if ($count) $count.textContent = `${moduleCraftSlots.filter(Boolean).length}/${MAX_CRAFT_SLOTS}`;
    renderCraftSynergy(moduleCraftSlots.filter(Boolean));
    updateModuleCraftBtn();
  }

  function renderModuleCraftStock() {
    const $list = document.getElementById('moduleCraftStockList');
    if (!$list) return;
    $list.innerHTML = '';
    const items = Object.values(moduleCraftStockCache).filter(s => (s.count || 0) > 0);
    if (items.length === 0) {
      $list.innerHTML = '<span style="font-size:0.72rem;color:rgba(200,190,240,0.4)">' + tr('module_no_outputs') + '</span>';
      return;
    }
    const full = moduleCraftSlots.filter(Boolean).length >= MAX_CRAFT_SLOTS;
    items.forEach(s => {
      const cat = CRAFT_MAT_CAT[s.productId] || 'misc';
      const pill = document.createElement('div');
      pill.className = 'mcw-stock-pill' + (full ? ' is-full' : '');
      pill.draggable = !full;
      pill.title = `${s.name} [${CAT_LABEL[cat] || cat}] — 클릭 or 드래그해서 슬롯에 배치`;
      pill.style.borderColor = (CAT_COLOR[cat] || '#fff') + '55';
      pill.innerHTML = `<span class="mcw-stock-emoji">${s.emoji || '📦'}</span>`+
        `<span class="mcw-stock-name">${escHtmlModule(s.name || '')}</span>`+
        `<span class="mcw-stock-cat" style="color:${CAT_COLOR[cat] || '#aaa'}">${CAT_LABEL[cat] || ''}</span>`+
        `<span class="mcw-stock-cnt">×${s.count}</span>`;
      pill.addEventListener('dragstart', e => {
        if (full) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', 'stock:' + s.productId);
      });
      pill.addEventListener('click', () => {
        if (full) return;
        // 첫 번째 빈 슬롯에 배치
        const idx = moduleCraftSlots.findIndex(x => x == null);
        if (idx === -1 && moduleCraftSlots.length < MAX_CRAFT_SLOTS) {
          moduleCraftSlots.push({ productId: s.productId, name: s.name, emoji: s.emoji });
        } else if (idx !== -1) {
          moduleCraftSlots[idx] = { productId: s.productId, name: s.name, emoji: s.emoji };
        } else return;
        s.count--;
        renderModuleCraftSlots();
        renderModuleCraftStock();
      });
      $list.appendChild(pill);
    });

    // 스톡 영역도 드롭 수신 (슬롯→스톡 드래그)
    $list.addEventListener('dragover', e => { e.preventDefault(); $list.classList.add('drag-over'); });
    $list.addEventListener('dragleave', () => $list.classList.remove('drag-over'));
    $list.addEventListener('drop', e => {
      e.preventDefault(); $list.classList.remove('drag-over');
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw.startsWith('slot:')) return;
      const from = parseInt(raw.slice(5), 10);
      const removed = moduleCraftSlots[from];
      if (!removed) return;
      moduleCraftSlots[from] = null;
      const pid = removed.productId;
      if (moduleCraftStockCache[pid]) moduleCraftStockCache[pid].count++;
      else moduleCraftStockCache[pid] = { ...removed, count: 1 };
      renderModuleCraftSlots();
      renderModuleCraftStock();
    });
  }

  function updateModuleCraftBtn() {
    if (!$moduleCraftBtn) return;
    const cnt = moduleCraftSlots.filter(Boolean).length;
    let tierLabel = '일반';
    if (cnt >= 5) tierLabel = '전설';
    else if (cnt >= 3) tierLabel = '에픽';
    else if (cnt >= 2) tierLabel = '희귀';
    if ($moduleCraftTierPreview) {
      $moduleCraftTierPreview.textContent = cnt > 0
        ? `예상 등급: ${tierLabel} (재료 ${cnt}개)`
        : '재료를 슬롯에 넣어주세요';
    }
    $moduleCraftBtn.disabled = !moduleCraftSelectedType || cnt === 0;
  }

  document.getElementById('moduleCraftClearBtn')?.addEventListener('click', () => {
    // 슬롯 비우기 → 스톡으로 전부 반환
    for (const item of moduleCraftSlots) {
      const pid = item.productId;
      if (moduleCraftStockCache[pid]) moduleCraftStockCache[pid].count++;
      else moduleCraftStockCache[pid] = { ...item, count: 1 };
    }
    moduleCraftSlots = Array(MAX_CRAFT_SLOTS).fill(null);
    renderModuleCraftSlots();
    renderModuleCraftStock();
  });

  if ($moduleCraftToggleBtn) {
    $moduleCraftToggleBtn.addEventListener('click', () => {
      const shown = $moduleCraftPanel && $moduleCraftPanel.style.display !== 'none';
      if ($moduleCraftPanel) $moduleCraftPanel.style.display = shown ? 'none' : 'block';
      $moduleCraftToggleBtn.textContent = shown ? tr('module_craft_toggle') : tr('module_craft_close');
    });
  }

  if ($moduleCraftBtn) {
    $moduleCraftBtn.addEventListener('click', async () => {
      const filledSlots = moduleCraftSlots.filter(Boolean);
      if (!moduleCraftSelectedType || filledSlots.length === 0 || $moduleCraftBtn.disabled) return;
      if ($moduleCraftMsg) { $moduleCraftMsg.textContent = tr('module_craft_busy'); $moduleCraftMsg.style.color = 'rgba(200,190,240,0.6)'; }
      $moduleCraftBtn.disabled = true;

      // 슬롯 재료를 productId별로 집계
      const countMap = {};
      for (const item of filledSlots) {
        countMap[item.productId] = (countMap[item.productId] || 0) + 1;
      }
      const smeltMaterials = Object.entries(countMap).map(([productId, count]) => ({ productId, count }));
      const { totalMuls: statMuls } = calcCraftSynergy(filledSlots);

      try {
        const resp = await apiFetch(`${platformApi}/api/modules/craft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${alpToken}` },
          body: JSON.stringify({ moduleType: moduleCraftSelectedType, smeltMaterials, statMuls }),
        });
        const json = await resp.json();
        if (!resp.ok) {
          // 실패 시 재료 슬롯 복구
          if ($moduleCraftMsg) { $moduleCraftMsg.textContent = json?.error?.message || tr('module_craft_fail'); $moduleCraftMsg.style.color = '#fca5a5'; }
          $moduleCraftBtn.disabled = false;
          return;
        }
        // 성공: 슬롯 비우기 (서버에서 이미 소모됨)
        moduleCraftSlots = Array(MAX_CRAFT_SLOTS).fill(null);
        moduleAllList.push(json.module);
        if ($moduleCraftMsg) { $moduleCraftMsg.textContent = tr('module_craft_success', { name: json.module.name }); $moduleCraftMsg.style.color = '#6ee7b7'; }
        renderModuleInvList();
        renderModuleCraftSlots();
        renderModuleCraftStock();
        $moduleCraftBtn.disabled = false;
      } catch (e) {
        if ($moduleCraftMsg) { $moduleCraftMsg.textContent = tr('error_occurred'); $moduleCraftMsg.style.color = '#fca5a5'; }
        $moduleCraftBtn.disabled = false;
      }
    });
  }

  function escHtmlModule(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
      else stopRepairHammer();
      if (tab === 'enhance') loadEnhancementTab();
      if (tab === 'modules') loadModuleTab();
    }
    if (!document.body.dataset.tab) setMobileTab('furnace');
    mobileTabbarEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-tab');
      if (btn && btn.dataset.tab) setMobileTab(btn.dataset.tab);
    });
  }

  /* ── 튜토리얼 ───────────────────────────────────────── */
  mountTutorial({
    storageKey: 'game5_tutorial',
    steps: [
      { emoji: '⚒️', title: tr('t5_t1_title'), body: tr('t5_t1_body') },
      { emoji: '🔥', title: tr('t5_t2_title'), body: tr('t5_t2_body') },
      { emoji: '🛠️', title: tr('t5_t3_title'), body: tr('t5_t3_body') },
      { emoji: '🔩', title: tr('t5_t4_title'), body: tr('t5_t4_body') },
      { emoji: '🔧', title: tr('t5_t5_title'), body: tr('t5_t5_body') },
      { emoji: '🗡️', title: tr('t5_t6_title'), body: tr('t5_t6_body') },
    ],
  });
})();
