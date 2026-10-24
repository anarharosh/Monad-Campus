/* ============================================================
   MonadCampus & Guild — Campus Arena
   Interactive frontend prototype
   ============================================================ */

const GUILDS = [
  { id: "metu", rank: 1, name: "METU Monad DAO", short: "METU", city: "Ankara, Türkiye", crest: "M", color: "#9b74ff", verified: true, badge: "Founding Campus", tvl: 1280000, members: 1420, xp: 148260, growth: 14.8, category: ["tvl", "activity", "students"], activityScore: 96, spark: [18, 16, 19, 22, 21, 24, 26] },
  { id: "bilkent", rank: 2, name: "Bilkent Web3 Guild", short: "B", city: "Ankara, Türkiye", crest: "B", color: "#4fd8ff", verified: true, badge: "Top Builder Guild", tvl: 1120000, members: 1186, xp: 131840, growth: 12.4, category: ["tvl", "activity"], activityScore: 91, spark: [16, 17, 16, 18, 19, 21, 23] },
  { id: "itu", rank: 3, name: "ITU Blockchain", short: "ITU", city: "Istanbul, Türkiye", crest: "ITU", color: "#ff9e64", verified: true, badge: "Rising Star", tvl: 984000, members: 1042, xp: 118920, growth: 21.3, category: ["tvl", "activity", "students"], activityScore: 89, spark: [12, 13, 15, 17, 19, 22, 26] },
  { id: "bogazici", rank: 4, name: "Boğaziçi Web3", short: "BÜ", city: "Istanbul, Türkiye", crest: "BÜ", color: "#62e3b5", verified: true, badge: "", tvl: 842000, members: 892, xp: 102460, growth: 9.6, category: ["tvl", "activity"], activityScore: 84, spark: [15, 16, 15, 17, 17, 18, 19] },
  { id: "hacettepe", rank: 5, name: "Hacettepe Crypto Guild", short: "H", city: "Ankara, Türkiye", crest: "H", color: "#b894ff", verified: true, badge: "", tvl: 716000, members: 764, xp: 89420, growth: 8.1, category: ["tvl", "students"], activityScore: 78, spark: [13, 14, 13, 14, 15, 16, 17] },
  { id: "odtu", rank: 6, name: "ODTÜ Blockchain Society", short: "ODTU", city: "Ankara, Türkiye", crest: "O", color: "#7a9bff", verified: true, badge: "Verified Campus", tvl: 648000, members: 712, xp: 81640, growth: 7.4, category: ["tvl", "students"], activityScore: 75, spark: [12, 12, 13, 13, 14, 15, 16] },
  { id: "koc", rank: 7, name: "Koç Blockchain Club", short: "K", city: "Istanbul, Türkiye", crest: "K", color: "#ffd27c", verified: true, badge: "Verified Campus", tvl: 586000, members: 684, xp: 76280, growth: 6.9, category: ["tvl", "students"], activityScore: 72, spark: [11, 12, 11, 12, 13, 14, 15] },
  { id: "sabanci", rank: 8, name: "Sabancı Web3", short: "S", city: "Istanbul, Türkiye", crest: "S", color: "#ff86c8", verified: true, badge: "", tvl: 524000, members: 626, xp: 69440, growth: 6.2, category: ["tvl", "activity"], activityScore: 69, spark: [10, 10, 11, 11, 12, 13, 14] }
];

const GRANTS = [
  { id: "g1", protocol: "Monad Labs", initials: "M", accent: "#8352ff", title: "Monad Ecosystem Onboarding Grant", amount: 10000, total: 10000, claimed: 6800, tags: ["Onboarding", "Hackathons", "Beginner Friendly"], deadline: "12d left", description: "Help students ship their first dApp on Monad. Focus on UX, wallet flows, and educational repos.", category: "onboarding" },
  { id: "g2", protocol: "Uniswap", initials: "U", accent: "#ff5e9d", title: "DeFi Security Quest", amount: 2500, total: 2500, claimed: 1750, tags: ["Security", "Audits", "Research"], deadline: "8d left", description: "Identify edge cases in Uniswap hooks, document attack vectors, and propose mitigations for Monad deployments.", category: "security" },
  { id: "g3", protocol: "Wormhole", initials: "W", accent: "#b8a7e7", title: "Cross-chain Composability Bounty", amount: 5000, total: 5000, claimed: 3200, tags: ["Bridging", "Messaging", "Interoperability"], deadline: "15d left", description: "Build a student demo showcasing Wormhole messaging between Monad and another chain. Prioritize composability.", category: "interop" }
];

const BADGES = [
  { id: "b1", name: "METU Founding Pioneer", issuer: "METU Monad DAO", rarity: "Legendary", series: "S01", earned: "Oct 2025", bg1: "#8c63ff", bg2: "#351a85", emblem: "i-graduation", desc: "Awarded to founding members of METU Monad DAO during Season 01." },
  { id: "b2", name: "Monad Blitz Ankara Scholar", issuer: "Monad Campus", rarity: "Epic", series: "BLITZ", earned: "Oct 2026", bg1: "#5af3ff", bg2: "#0a3f4f", emblem: "i-bolt", desc: "Recognizes active participation in Monad Blitz Ankara. Issued as non-transferable proof of attendance and contribution." },
  { id: "b3", name: "Top Yield Farmer", issuer: "Campus Arena", rarity: "Rare", series: "S02", earned: "Oct 2026", bg1: "#ffb95c", bg2: "#6b3c00", emblem: "i-trend", desc: "Earned by ranking among the top 10% of stakers in Season 02." },
  { id: "b4", name: "Bounty Hunter", issuer: "Protocol Vaults", rarity: "Uncommon", series: "S02", earned: null, bg1: "#6b5b95", bg2: "#2a243d", emblem: "i-target", desc: "Claim your first protocol bounty to unlock this badge.", locked: true },
  { id: "b5", name: "Guild Ambassador", issuer: "Monad Campus", rarity: "Epic", series: "S02", earned: null, bg1: "#7f7aff", bg2: "#272355", emblem: "i-users", desc: "Refer 5 new students to your campus guild.", locked: true },
  { id: "b6", name: "DeFi Builder", issuer: "Protocol Vaults", rarity: "Rare", series: "S02", earned: null, bg1: "#52f5b5", bg2: "#12382c", emblem: "i-code", desc: "Submit a merged PR for a bounty with verifiable proof.", locked: true }
];

const WALLET_PRESETS = [
  { id: "metamask", name: "MetaMask", desc: "Browser extension", tag: "Popular", style: "wallet-metamask", initial: "MM" },
  { id: "walletconnect", name: "WalletConnect", desc: "Scan with mobile wallet", tag: "Universal", style: "wallet-walletconnect", initial: "WC" },
  { id: "coinbase", name: "Coinbase Wallet", desc: "Self-custody app", tag: "Easy", style: "wallet-coinbase", initial: "CB" },
  { id: "rabby", name: "Rabby", desc: "Multi-chain & safer UX", tag: "DeFi-native", style: "wallet-rabby", initial: "RB" }
];

let walletConnected = false;
let walletAddress = "0x7A3F9B2C8E4D5A6F9012C7B8E9F3A4C5D6E7F902";
let currentFilter = "tvl";
let heroTimer = null;

const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));
const formatMon = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
const formatMonK = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return Math.round(n / 1000) + "K";
  return n.toLocaleString();
};
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function initReveal() {
  if (!document.documentElement.classList.contains("js")) return;
  const els = qsa(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}

function initHeader() {
  const header = qs(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = qs("#mobileMenuButton");
  const mobileNav = qs("#mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    qsa(".mobile-nav-inner a").forEach((a) => a.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  // live block numbers
  let b = 18492731;
  setInterval(() => {
    b += Math.floor(Math.random() * 2) + 1;
    ["#liveBlock", "#leaderboardBlock", "#footerBlock"].forEach((sel) => {
      const el = qs(sel);
      if (el) el.textContent = b.toLocaleString();
    });
  }, 4200);
}

function initWallet() {
  const btn = qs("#walletButton");
  const label = qs("#walletLabel");
  const sync = qs("#studentConnectButton");
  const statusBadge = qs("#profileStatusBadge");
  const sectionAddr = qs("#studentSectionAddress");

  if (btn) btn.addEventListener("click", openWalletModal);
  if (sync) sync.addEventListener("click", openWalletModal);

  function update() {
    if (walletConnected) {
      btn?.classList.add("is-connected");
      if (label) label.textContent = walletAddress.slice(0, 6) + "…" + walletAddress.slice(-4);
      sync && (sync.innerHTML = '<svg class="icon"><use href="#i-check" /></svg> Wallet synced');
      statusBadge && (statusBadge.textContent = "VERIFIED · CONNECTED", statusBadge.classList.add("is-verified"));
      sectionAddr && (sectionAddr.innerHTML = '<svg class="icon"><use href="#i-wallet" /></svg> ' + walletAddress.slice(0, 6) + '…' + walletAddress.slice(-4));
      qs("#studentAddressLabel") && (qs("#studentAddressLabel").textContent = walletAddress.slice(0, 6) + "…" + walletAddress.slice(-4));
      qs("#studentName") && (qs("#studentName").textContent = "Anon Scholar");
      const av = qs("#studentAvatar");
      if (av) av.textContent = "AS";
    } else {
      btn?.classList.remove("is-connected");
      if (label) label.textContent = "Connect Wallet";
      sync && (sync.innerHTML = '<svg class="icon"><use href="#i-wallet" /></svg> Sync wallet');
      statusBadge && (statusBadge.textContent = "DEMO PREVIEW", statusBadge.classList.remove("is-verified"));
      sectionAddr && (sectionAddr.innerHTML = '<svg class="icon"><use href="#i-wallet" /></svg> Wallet not connected');
      qs("#studentAddressLabel") && (qs("#studentAddressLabel").textContent = "0x7A3F…9C2E");
      qs("#studentName") && (qs("#studentName").textContent = "Campus Scholar");
      const av = qs("#studentAvatar");
      if (av) av.textContent = "CS";
    }
  }
  update();
}

function openWalletModal() {
  openModal({
    wide: false,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon"><svg class="icon"><use href="#i-wallet" /></svg></div>
        <span class="modal-kicker">CONNECT TO MONADCAMPUS</span>
        <h2>Connect your wallet</h2>
        <p>Simulated connection for this prototype. Pick a wallet to link to the campus arena.</p>
      </div>
      <div class="wallet-list">
        ${WALLET_PRESETS.map((w, i) => `
          <button class="wallet-option" data-wallet="${w.id}" data-index="${i}">
            <span class="wallet-brand ${w.style}">${w.initial}</span>
            <div class="wallet-info"><strong>${w.name}</strong><span>${w.desc}</span></div>
            <span class="wallet-tag">${w.tag}</span>
            <svg class="icon"><use href="#i-arrow-right" /></svg>
          </button>
        `).join("")}
      </div>
      <div class="modal-note"><svg class="icon"><use href="#i-shield" /></svg> By connecting, you agree to interact with the Monad testnet in demo mode. No real signatures are requested.</div>
    `,
    onReady: (card) => {
      qsa(".wallet-option", card).forEach((opt) => {
        opt.addEventListener("click", () => {
          const idx = Number(opt.dataset.index);
          opt.classList.add("is-loading");
          opt.innerHTML = '<span class="wallet-brand ' + WALLET_PRESETS[idx].style + '">' + WALLET_PRESETS[idx].initial + '</span><div class="wallet-info"><strong>' + WALLET_PRESETS[idx].name + '</strong><span>Awaiting approval...</span></div><span class="wallet-loading"></span>';
          setTimeout(() => {
            walletConnected = true;
            closeModal();
            toast("success", "Wallet connected", "0x7A3F…9C2E linked to METU Monad DAO");
            initWallet();
          }, 900);
        });
      });
    }
  });
}

function renderLeaderboard(filter = currentFilter) {
  currentFilter = filter;
  const list = qs("#leaderboardList");
  if (!list) return;
  list.innerHTML = "";

  let sorted = [...GUILDS];
  if (filter === "activity") sorted.sort((a,b) => b.activityScore - a.activityScore);
  else if (filter === "students") sorted.sort((a,b) => b.members - a.members);
  else sorted.sort((a,b) => b.tvl - a.tvl);

  sorted.forEach((g, i) => {
    const rank = i + 1;
    const row = document.createElement("div");
    row.className = "lb-row" + (rank === 1 ? " is-first" : "");
    row.style.setProperty("--row-index", i);
    row.style.setProperty("--guild-color", g.color);
    row.dataset.guild = g.id;
    row.innerHTML = `
      <div class="lb-rank">
        <div class="rank-block">
          <span class="rank-number">#${rank}</span>
          ${rank === 1 ? '<span class="rank-medal"><svg class="icon"><use href="#i-trophy" /></svg></span>' : '<span class="rank-change is-flat"><svg class="icon"><use href="#i-trend" /></svg> 0</span>'}
        </div>
      </div>
      <div class="guild-cell">
        <span class="crest ${rank === 1 ? 'crest-first' : ''}"><span>${g.crest}</span></span>
        <div class="guild-info">
          <div class="guild-name-row">
            <a class="guild-name" href="#simulator" data-scroll-guild="${g.id}">${g.name}</a>
            ${g.verified ? '<span class="verified-tick"><svg class="icon"><use href="#i-check" /></svg></span>' : ''}
            ${rank === 1 && g.badge ? '<span class="guild-badge">' + g.badge + '</span>' : g.city.includes('İstanbul') || g.city.includes('Istanbul') ? '<span class="guild-badge global">Global Push</span>' : ''}
          </div>
          <div class="guild-meta"><span class="guild-city"><svg class="icon"><use href="#i-globe" /></svg> ${g.city}</span><span class="meta-dot"></span><span>${g.members.toLocaleString()} members</span></div>
        </div>
      </div>
      <div class="metric-cell tvl-cell" data-label="Total Staked">
        <svg class="sparkline" viewBox="0 0 52 22"><polyline class="spark-line" style="--spark-color: ${g.color}" points="${g.spark.map((v,j)=>j*8.66+','+(20-v)).join(' ')}" /></svg>
        <div class="tvl-numbers">
          <span class="metric-main">${formatMonK(g.tvl)} <small>MON</small></span>
          <span class="metric-sub"><span>$</span>${formatMonK(g.tvl)} <small>VALUE</small></span>
        </div>
      </div>
      <div class="metric-cell members-cell" data-label="Active Members">
        <span class="metric-main">${g.members.toLocaleString()}</span>
        <span class="metric-sub"><span class="members-pip"></span> ${Math.round(g.members*0.74).toLocaleString()} active 7d</span>
      </div>
      <div class="metric-cell xp-cell" data-label="Season XP">
        <span class="metric-main">${g.xp.toLocaleString()} <small>XP</small></span>
        <span class="metric-sub">+${Math.round(g.xp*0.068).toLocaleString()} this week</span>
      </div>
      <div class="growth-cell">
        <span class="growth-pill ${g.growth < 0 ? 'is-negative' : ''}"><svg class="icon"><use href="#i-trend" /></svg> +${g.growth.toFixed(1)}%</span>
      </div>
      <div class="guild-actions">
        <button class="row-action row-action-join" data-join="${g.id}"><svg class="icon"><use href="#i-users" /></svg> Join Guild</button>
        <button class="row-action row-action-stake" data-stake-guild="${g.id}"><svg class="icon"><use href="#i-bolt" /></svg> Stake MON</button>
      </div>
    `;
    list.appendChild(row);
  });

  qs("#leaderboardFootCount").textContent = sorted.length;
  const labels = { tvl: "Ranked by total staked MON", activity: "Ranked by season activity score", students: "Ranked by active student count" };
  qs("#rankedByLabel").textContent = labels[filter] || labels.tvl;
  qsa(".tab-button").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === filter));
  qsa(".tab-button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.filter === filter)));

  // bind
  qsa("[data-join]", list).forEach((b) => b.addEventListener("click", () => {
    b.classList.toggle("is-joined");
    if (b.classList.contains("is-joined")) {
      b.innerHTML = '<svg class="icon"><use href="#i-check" /></svg> Joined';
      toast("success", "Joined campus guild", "You're now representing " + b.closest(".lb-row").querySelector(".guild-name").textContent);
      const row = b.closest(".lb-row");
      row.classList.add("is-joined");
    } else {
      b.innerHTML = '<svg class="icon"><use href="#i-users" /></svg> Join Guild';
      row.classList.remove("is-joined");
    }
  }));
  qsa("[data-stake-guild]", list).forEach((b) => b.addEventListener("click", () => {
    const g = GUILDS.find(x => x.id === b.dataset.stakeGuild);
    openStakeModal(g);
    document.getElementById("simulator").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  qsa("[data-scroll-guild]", list).forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const g = GUILDS.find(x => x.id === a.dataset.scrollGuild);
    setSimGuild(g.id);
    document.getElementById("simulator").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
}

function initTabs() {
  qsa(".tab-button").forEach((b) => b.addEventListener("click", () => renderLeaderboard(b.dataset.filter)));
}

function initHero() {
  const top = qs("#heroTopGuilds");
  if (top) {
    top.innerHTML = GUILDS.slice(0, 3).map((g, i) => `
      <div class="hero-rank-row">
        <span class="hero-rank-num">0${i+1}</span>
        <span class="hero-rank-crest" style="--guild-color: ${g.color}">${g.crest}</span>
        <span class="hero-rank-name">${g.name}</span>
        <span class="hero-rank-tvl">${formatMonK(g.tvl)} <span>MON</span></span>
      </div>
    `).join("");
  }
  const setTvl = () => {
    let t = 6600000;
    // animate slightly
  };
  // live counters
  let tvl = 6600000;
  setInterval(() => { tvl += Math.floor(Math.random()*8000); qs("#heroTvl") && (qs("#heroTvl").textContent = formatMonK(tvl)); qs("#navTvl") && (qs("#navTvl").innerHTML = formatMonK(tvl) + " <small>MON</small>"); qs("#mobileTvl") && (qs("#mobileTvl").textContent = formatMonK(tvl) + " MON"); }, 6000);
}

function renderGrants() {
  const grid = qs("#grantGrid");
  if (!grid) return;
  grid.innerHTML = "";
  GRANTS.forEach((g, i) => {
    const pct = Math.round((g.claimed / g.total) * 100);
    const card = document.createElement("article");
    card.className = "grant-card" + (i === 0 ? " is-new" : "");
    card.style.setProperty("--grant-accent", g.accent);
    card.innerHTML = `
      <div class="grant-top">
        <span class="protocol-badge">${g.protocol === "Monad Labs" ? '<svg class="icon"><use href="#i-monad" /></svg>' : g.initials}</span>
        <div class="protocol-info">
          <strong>${g.protocol} <span class="verified-tick"><svg class="icon"><use href="#i-check" /></svg></span></strong>
          <span>VERIFIED PROTOCOL</span>
        </div>
        <div class="grant-reward"><strong>$${g.amount.toLocaleString()}</strong><span>MICRO-GRANT</span></div>
      </div>
      <h4>${g.title}</h4>
      <p>${g.description}</p>
      <div class="grant-tags">${g.tags.map(t=>'<span class="grant-tag">'+t+'</span>').join('')}</div>
      <div class="grant-progress">
        <div class="grant-progress-head"><span>CLAIMED</span><strong>${g.claimed.toLocaleString()} / ${g.total.toLocaleString()} USDC</strong></div>
        <div class="grant-progress-bar"><span style="width: ${pct}%"></span></div>
      </div>
      <div class="grant-foot">
        <span class="grant-deadline"><svg class="icon"><use href="#i-clock" /></svg> ${g.deadline}</span>
        <button class="claim-btn" data-claim="${g.id}"><svg class="icon"><use href="#i-gift" /></svg> Claim Bounty</button>
      </div>
    `;
    grid.appendChild(card);
  });
  qs("#activeGrantCount").textContent = GRANTS.length;
  const pool = GRANTS.reduce((a,b)=>a+b.amount,0);
  qs("#grantPoolTotal").textContent = "$" + pool.toLocaleString();

  qsa("[data-claim]", grid).forEach((b) => b.addEventListener("click", () => {
    const g = GRANTS.find(x => x.id === b.dataset.claim);
    openClaimModal(g);
  }));
}

function renderBadges() {
  const grid = qs("#badgeGrid");
  if (!grid) return;
  grid.innerHTML = "";
  BADGES.forEach((b) => {
    const card = document.createElement("button");
    card.className = "badge-card" + (b.locked ? " is-locked" : "");
    card.type = "button";
    card.innerHTML = `
      <div class="badge-art" style="--badge-bg-1: ${b.bg1}; --badge-bg-2: ${b.bg2}">
        <div class="badge-shine"></div>
        <span class="badge-emblem"><svg class="icon"><use href="#${b.emblem}" /></svg></span>
        <span class="badge-serial">${b.series} • #${Math.floor(Math.random()*9999).toString().padStart(4,'0')}</span>
        <span class="badge-chain">MONAD</span>
      </div>
      <span class="badge-name">${b.name}</span>
      <span class="badge-meta">${b.locked ? 'LOCKED' : b.issuer + ' • ' + b.rarity}</span>
    `;
    card.addEventListener("click", () => openBadgeModal(b));
    grid.appendChild(card);
  });
  qs("#studentBadgeCount").textContent = BADGES.filter(b=>!b.locked).length;
  qs("#badgeCountDisplay").textContent = BADGES.filter(b=>!b.locked).length;
}

function initSimulator() {
  const guildSel = qs("#simGuild");
  const crest = qs("#simSelectedCrest");
  const meta = qs("#simGuildMeta");
  const gTvl = qs("#simGuildTvl");
  const amount = qs("#simAmount");
  const amtDisp = qs("#simAmountDisplay");
  const amtConf = qs("#simConfirmAmount");
  const durBtns = qsa(".duration-option");
  const quick = qsa(".quick-amounts button");
  const stakeBtn = qs("#simStakeButton");

  // populate
  if (guildSel) {
    guildSel.innerHTML = GUILDS.map(g => `<option value="${g.id}">${g.name}</option>`).join("");
  }

  function updateGuild() {
    const g = GUILDS.find(x => x.id === guildSel.value);
    if (!g) return;
    crest.textContent = g.crest;
    crest.style.setProperty("--sim-guild-color", g.color);
    meta.textContent = g.city.split(',')[0] + " · Rank #" + g.rank;
    gTvl.textContent = "$" + formatMonK(g.tvl) + " TVL";
    calc();
  }

  if (guildSel) guildSel.addEventListener("change", updateGuild);

  function updateAmount() {
    const v = Number(amount.value);
    amtDisp.textContent = v.toLocaleString();
    amtConf.textContent = v.toLocaleString() + " MON";
    amount.style.setProperty("--range-progress", ((v-100)/(250000-100))*100 + "%");
    calc();
  }
  if (amount) { amount.addEventListener("input", updateAmount); updateAmount(); }

  durBtns.forEach((b) => b.addEventListener("click", () => {
    durBtns.forEach(x=>x.classList.remove("is-active"));
    b.classList.add("is-active");
    calc();
  }));

  quick.forEach((b) => b.addEventListener("click", () => {
    amount.value = b.dataset.amount;
    updateAmount();
  }));

  if (stakeBtn) stakeBtn.addEventListener("click", () => {
    const g = GUILDS.find(x => x.id === guildSel.value);
    const v = Number(amount.value);
    openStakeModal(g, v);
  });

  function calc() {
    const g = GUILDS.find(x => x.id === guildSel.value) || GUILDS[0];
    const v = Number(amount.value);
    const days = Number(qs(".duration-option.is-active")?.dataset.days || 30);
    const mult = days >= 180 ? 1.32 : days >= 90 ? 1.24 : days >= 30 ? 1.18 : 1.12;
    const baseXp = Math.round(v * 0.14);
    const xp = Math.round(baseXp * mult);
    const apy = (16.2 + (days/180)*8).toFixed(1);
    const annual = Math.round(v * (Number(apy)/100));
    const weekly = (annual/52).toFixed(1);
    const boost = Math.min(2.4, (v/1000000)*2.2).toFixed(1);
    const newTvl = g.tvl + v;
    const projected = g.rank;
    
    qs("#simXp").textContent = xp.toLocaleString();
    qs("#simMultiplier").textContent = mult.toFixed(1) + "×";
    qs("#simApy").textContent = apy + "%";
    qs("#simAnnualYield").textContent = annual.toLocaleString();
    qs("#simWeeklyYield").textContent = weekly;
    qs("#simTvlBoost").textContent = boost + "%";
    qs("#simProjectedRank").innerHTML = "#" + projected + " <small>↔</small>";
    qs("#simBarCurrentValue").textContent = formatMonK(g.tvl) + " MON";
    qs("#simBarAfterValue").textContent = formatMonK(newTvl) + " MON";
    qs("#simBarAfter").style.width = Math.min(100, (newTvl / (newTvl * 0.001 + g.tvl)) * 100) + "%";
    const pct = Math.min(98, 100 - (projected-1)*6);
    qs("#rankTrackPosition").style.left = pct + "%";
    qs("#simDistanceToNext").textContent = projected === 1 ? "You lead the arena" : "Closing gap to #" + (projected-1);
    qs("#simPrizeShare").textContent = "320K MON";
  }

  updateGuild();
  window.setSimGuild = (id) => {
    if (guildSel) { guildSel.value = id; updateGuild(); }
  };
}

function openModal({ content, wide = false, onReady }) {
  const modal = qs("#appModal");
  const card = qs("#modalCard");
  if (!modal || !card) return;
  card.innerHTML = content;
  card.classList.toggle("modal-wide", wide);
  modal.showModal();
  document.body.classList.add("modal-open");
  qsa("[data-close]", card).forEach((b) => b.addEventListener("click", closeModal));
  card.querySelector(".modal-close")?.focus();

  // Delegated handlers for modal buttons
  card.onclick = (e) => {
    const explorerBtn = e.target.closest("#badgeExplorerBtn");
    if (explorerBtn) {
      e.preventDefault();
      e.stopPropagation();
      window.open("https://testnet.monadexplorer.com/", "_blank", "noopener,noreferrer");
      return;
    }
    const reqBtn = e.target.closest("#badgeReqBtn");
    if (reqBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
      toast("info", "Badge Requirements", "Complete more tasks, staking milestones, or bounties to unlock this soulbound badge.");
      return;
    }
  };

  if (onReady) onReady(card);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  }, { once: true });
}

function closeModal() {
  const modal = qs("#appModal");
  if (!modal) return;
  modal.close();
  document.body.classList.remove("modal-open");
}

function toast(type, title, msg) {
  const stack = qs("#toastStack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = "toast is-" + type;
  el.innerHTML = `
    <span class="toast-icon"><svg class="icon"><use href="#i-${type==='success'?'check':type==='error'?'close':'info'}" /></svg></span>
    <div class="toast-body"><strong>${title}</strong><span>${msg}</span></div>
    <button class="toast-close"><svg class="icon"><use href="#i-close" /></svg></button>
  `;
  stack.appendChild(el);
  const rm = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 300); };
  el.querySelector(".toast-close").addEventListener("click", rm);
  setTimeout(rm, 3800);
}

function openStakeModal(guild, presetAmount) {
  if (!guild) guild = GUILDS[0];
  openModal({
    wide: false,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon"><svg class="icon"><use href="#i-bolt" /></svg></div>
        <span class="modal-kicker">STAKE TO CAMPUS VAULT</span>
        <h2>Stake MON to ${guild.short}</h2>
        <p>Boost your campus rank. Simulated transaction in prototype mode.</p>
      </div>
      <div class="modal-guild-card" style="--guild-color: ${guild.color}">
        <span class="crest"><span>${guild.crest}</span></span>
        <div class="modal-guild-info"><strong>${guild.name}</strong><span>${guild.city}</span></div>
        <span class="modal-guild-rank">Rank #${guild.rank}</span>
      </div>
      <div class="modal-section">
        <div class="modal-section-label"><span>AMOUNT</span><span>BALANCE: 25,000 MON</span></div>
        <div class="amount-input-wrap">
          <input type="number" id="stakeAmtInput" value="${presetAmount || 8500}" min="100" max="250000" placeholder="Enter amount" />
          <span class="amount-currency">MON</span>
        </div>
        <div class="amount-input-meta"><span>Min 100 MON • Max 250,000 MON</span><button type="button" id="useMax">Use max</button></div>
        <div class="amount-chip-row">
          <button type="button" data-chip="1000">1K</button>
          <button type="button" data-chip="5000">5K</button>
          <button type="button" data-chip="10000">10K</button>
          <button type="button" data-chip="25000">25K</button>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-label"><span>LOCK DURATION</span></div>
        <select class="inline-select" id="stakeLock"><option value="7">7 days</option><option value="30" selected>30 days</option><option value="90">90 days</option><option value="180">180 days</option></select>
      </div>
      <div class="modal-summary">
        <div class="modal-summary-row"><span>Estimated XP</span><strong class="is-purple">+<span id="stakeXp">1190</span></strong></div>
        <div class="modal-summary-row"><span>APY</span><strong>18.4%</strong></div>
        <div class="modal-summary-row"><span>Guild TVL after</span><strong><span id="stakeAfterTvl">${formatMonK(guild.tvl + (presetAmount||8500))}</span> MON</strong></div>
        <div class="modal-summary-row"><span>Projected rank</span><strong class="is-green">#${guild.rank} <small>→</small> #${guild.rank}</strong></div>
      </div>
      <button class="btn btn-primary btn-full modal-stake-btn" id="confirmStake"><span>Sign &amp; Stake</span><svg class="icon"><use href="#i-arrow-right" /></svg></button>
      <p class="modal-disclaimer"><svg class="icon"><use href="#i-shield" /></svg> Prototype only. No on-chain transaction is broadcast.</p>
    `,
    onReady: (card) => {
      const input = card.querySelector("#stakeAmtInput");
      const useMax = card.querySelector("#useMax");
      const chips = qsa("[data-chip]", card);
      const calcS = () => {
        const v = Number(input.value || 0);
        const lock = Number(card.querySelector("#stakeLock").value);
        const mult = lock >= 180 ? 1.32 : lock >= 90 ? 1.24 : lock >= 30 ? 1.18 : 1.12;
        card.querySelector("#stakeXp").textContent = Math.round(v*0.14*mult).toLocaleString();
        card.querySelector("#stakeAfterTvl").textContent = formatMonK(guild.tvl + v);
      };
      input?.addEventListener("input", calcS);
      useMax?.addEventListener("click", () => { input.value = 25000; calcS(); });
      chips.forEach(c => c.addEventListener("click", () => { input.value = c.dataset.chip; calcS(); }));
      card.querySelector("#stakeLock")?.addEventListener("change", calcS);
      calcS();
      card.querySelector("#confirmStake").addEventListener("click", () => {
        const v = Number(input.value || 0);
        card.innerHTML = `
          <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
          <div class="tx-state">
            <div class="tx-spinner"><svg class="icon"><use href="#i-bolt" /></svg></div>
            <h2>Confirming stake</h2>
            <p>Routing <strong>${v.toLocaleString()} MON</strong> to <strong>${guild.name}</strong> vault...</p>
            <div class="tx-steps">
              <span class="tx-step is-active">Signing</span>
              <span class="tx-step is-active">Broadcasting</span>
              <span class="tx-step">Finalizing</span>
            </div>
          </div>
        `;
        qsa("[data-close]", card).forEach(b=>b.addEventListener("click", closeModal));
        setTimeout(() => {
          card.innerHTML = `
            <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
            <div class="modal-success">
              <div class="success-icon"><svg class="icon"><use href="#i-check" /></svg></div>
              <h2>Stake successful</h2>
              <p>You staked <strong>${v.toLocaleString()} MON</strong> to <strong>${guild.name}</strong>. Your campus just got stronger.</p>
              <div class="tx-receipt">
                <div class="tx-receipt-row"><span>Tx Hash</span><strong>0x9f3a...c842</strong></div>
                <div class="tx-receipt-row"><span>Block</span><strong>#${Math.floor(18492700 + Math.random()*200)}</strong></div>
                <div class="tx-receipt-row"><span>XP Earned</span><strong class="green">+${Math.round(v*0.14*1.18).toLocaleString()} XP</strong></div>
                <div class="tx-receipt-row"><span>Guild Rank</span><strong>#${guild.rank}</strong></div>
              </div>
              <span class="tx-hash">MONAD TESTNET • GAS PAID (SIMULATED)</span>
              <div class="modal-actions">
                <button class="btn btn-primary" data-close>Return to Arena</button>
                <button class="btn btn-ghost" data-view>View in My Campus</button>
              </div>
            </div>
          `;
          qsa("[data-close]", card).forEach(b=>b.addEventListener("click", closeModal));
          card.querySelector("[data-view]").addEventListener("click", () => { closeModal(); document.getElementById("student").scrollIntoView({behavior:"smooth"}); });
          // update leaderboard small flash
          const row = qs(".lb-row[data-guild='"+guild.id+"']");
          if (row) { row.classList.add("is-stake-flash"); setTimeout(()=>row.classList.remove("is-stake-flash"), 1700); }
          toast("success", "Stake confirmed", v.toLocaleString() + " MON staked to " + guild.name);
        }, 1400);
      });
    }
  });
}

function openClaimModal(g) {
  openModal({
    wide: false,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon is-cyan"><svg class="icon"><use href="#i-gift" /></svg></div>
        <span class="modal-kicker is-cyan">BOUNTY CLAIM</span>
        <h2>Claim bounty</h2>
        <p>Verify eligibility and claim your micro-grant. Prototype flow only.</p>
      </div>
      <div class="claim-summary-card" style="--grant-accent: ${g.accent}">
        <div class="claim-protocol-row">
          <span class="protocol-badge">${g.protocol==='Monad Labs'?'<svg class="icon"><use href="#i-monad" /></svg>':g.initials}</span>
          <div><strong>${g.protocol}</strong><span>VERIFIED PROTOCOL</span></div>
          <span class="claim-reward">$${g.amount.toLocaleString()}</span>
        </div>
        <h4>${g.title}</h4>
        <p>${g.description}</p>
        <div class="claim-meta-row">${g.tags.map(t=>'<span>'+t+'</span>').join('')}<span>${g.deadline}</span></div>
      </div>
      <div class="modal-note"><svg class="icon"><use href="#i-info" /></svg> To claim, connect your wallet and ensure you're a verified student of a campus guild. Demo uses simulated checks.</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary" id="doClaim"><span>Verify &amp; Claim</span><svg class="icon"><use href="#i-arrow-right" /></svg></button>
      </div>
    `,
    onReady: (card) => {
      card.querySelector("#doClaim").addEventListener("click", () => {
        if (!walletConnected) { closeModal(); openWalletModal(); toast("info", "Wallet required", "Connect your wallet to verify student eligibility."); return; }
        card.innerHTML = `
          <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
          <div class="tx-state">
            <div class="tx-spinner"><svg class="icon"><use href="#i-shield" /></svg></div>
            <h2>Verifying eligibility</h2>
            <p>Checking student guild membership &amp; quest requirements...</p>
            <div class="tx-steps">
              <span class="tx-step is-active">Guild Check</span>
              <span class="tx-step is-active">Proofs</span>
              <span class="tx-step">Sign</span>
            </div>
          </div>
        `;
        qsa("[data-close]", card).forEach(b=>b.addEventListener("click", closeModal));
        setTimeout(() => {
          card.innerHTML = `
            <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
            <div class="modal-success">
              <div class="success-icon"><svg class="icon"><use href="#i-check" /></svg></div>
              <h2>Bounty claimed</h2>
              <p>Congratulations! <strong>$${g.amount.toLocaleString()} USDC</strong> will be distributed to your student wallet.</p>
              <div class="tx-receipt">
                <div class="tx-receipt-row"><span>Bounty</span><strong>${g.title}</strong></div>
                <div class="tx-receipt-row"><span>Protocol</span><strong>${g.protocol}</strong></div>
                <div class="tx-receipt-row"><span>Reward</span><strong class="green">$${g.amount.toLocaleString()} USDC</strong></div>
                <div class="tx-receipt-row"><span>XP</span><strong class="green">+${g.amount*0.12} XP</strong></div>
              </div>
              <span class="tx-hash">PAYOUT SCHEDULED • SEASON 02</span>
              <div class="modal-actions">
                <button class="btn btn-primary" data-close>Done</button>
                <button class="btn btn-ghost" data-badges>View Badges</button>
              </div>
            </div>
          `;
          qsa("[data-close]", card).forEach(b=>b.addEventListener("click", closeModal));
          card.querySelector("[data-badges]").addEventListener("click", () => { closeModal(); document.getElementById("student").scrollIntoView({behavior:"smooth"}); });
          const btn = qs(`[data-claim='${g.id}']`);
          if (btn) { btn.classList.add("is-claimed"); btn.innerHTML = '<svg class="icon"><use href="#i-check" /></svg> Claimed'; btn.disabled = true; }
          toast("success", "Bounty claimed", "$" + g.amount.toLocaleString() + " USDC from " + g.protocol);
        }, 1500);
      });
    }
  });
}

function openBadgeModal(b) {
  openModal({
    wide: false,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon ${b.locked?'':'is-green'}"><svg class="icon"><use href="#${b.locked?'i-lock':b.emblem}" /></svg></div>
        <span class="modal-kicker ${b.locked?'':'is-green'}">${b.locked?'LOCKED BADGE':'PROOF OF CAMPUS'}</span>
        <h2>${b.name}</h2>
        <p>${b.desc}</p>
      </div>
      <div class="badge-modal-hero">
        <div class="badge-modal-art" style="--badge-bg-1: ${b.bg1}; --badge-bg-2: ${b.bg2}">
          <span class="badge-emblem"><svg class="icon"><use href="#${b.emblem}" /></svg></span>
          <span class="badge-art-label">SOULBOUND • NON-TRANSFERABLE</span>
        </div>
        <div class="badge-modal-info">
          <h3>${b.rarity} Tier</h3>
          <p>Issued by <strong>${b.issuer}</strong> • Series ${b.series}</p>
          <div class="badge-modal-meta">
            <span>ERC-721</span>
            <span>Monad Chain</span>
            <span>${b.locked ? 'Not Earned' : 'Earned ' + b.earned}</span>
          </div>
        </div>
      </div>
      <div class="badge-modal-attrs">
        <div class="badge-attr"><span>Issuer</span><strong>${b.issuer}</strong></div>
        <div class="badge-attr"><span>Rarity</span><strong>${b.rarity}</strong></div>
        <div class="badge-attr"><span>Token Standard</span><strong>ERC-721 (Soulbound)</strong></div>
        <div class="badge-attr"><span>Status</span><strong>${b.locked ? 'Locked' : 'Claimed'}</strong></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-close>Close</button>
        ${b.locked ? '<button class="btn btn-primary" type="button" id="badgeReqBtn"><span>View Requirements</span><svg class="icon"><use href="#i-arrow-right" /></svg></button>' : '<button class="btn btn-primary" type="button" id="badgeExplorerBtn"><span>View on Explorer</span><svg class="icon"><use href="#i-external" /></svg></button>'}
      </div>
    `
  });
}

function initHeroBtns() {
  qs("#heroJoinButton")?.addEventListener("click", () => document.getElementById("leaderboard").scrollIntoView({behavior:"smooth"}));
  qs("#heroSponsorButton")?.addEventListener("click", () => document.getElementById("vaults").scrollIntoView({behavior:"smooth"}));
  qs("#finalJoinButton")?.addEventListener("click", () => document.getElementById("leaderboard").scrollIntoView({behavior:"smooth"}));
  qs("#finalSponsorButton")?.addEventListener("click", () => document.getElementById("vaults").scrollIntoView({behavior:"smooth"}));
  qs("#deployGrantButton")?.addEventListener("click", () => openGrantForm());
  qs("#vaultFundButton")?.addEventListener("click", () => openGrantForm());
  qs("#vaultDetailsButton")?.addEventListener("click", () => toast("info", "Genesis Vault", "Season allocation $250k • 12 bounties • Ends in 12 days"));
  qs("#institutionContactButton")?.addEventListener("click", () => openGrantForm());
  qs("#howRankingButton")?.addEventListener("click", () => openInfoModal("Ranking", [["TVL Weight", "Major factor - total staked MON"],["Activity Score", "Quests, bounties, governance"],["Student Count", "Active verified wallets"],["Growth", "Week-over-week momentum"]]));
  qs("#topMoverStakeButton")?.addEventListener("click", () => { setSimGuild("itu"); document.getElementById("simulator").scrollIntoView({behavior:"smooth"}); openStakeModal(GUILDS.find(g=>g.id==='itu')); });
  qs("#viewPrizesButton")?.addEventListener("click", () => openInfoModal("Season 02 Prizes", [["Top 1 Guild", "320,000 MON"],["Top 2-3", "200,000 MON each"],["Top 4-10", "80,000 MON each"],["Active Members Bonus", "250,000 MON pool"]]));
  qs("#allGuildsButton")?.addEventListener("click", () => toast("info", "Campus Directory", "All 24 guilds visible in arena"));
  qs("#refreshLeaderboardButton")?.addEventListener("click", (e) => { const btn = e.currentTarget; btn.classList.add("is-spinning"); setTimeout(()=>{ renderLeaderboard(currentFilter); btn.classList.remove("is-spinning"); toast("success", "Refreshed", "Leaderboard synced to latest block"); }, 650); });
}

function openGrantForm() {
  openModal({
    wide: true,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon is-cyan"><svg class="icon"><use href="#i-plus" /></svg></div>
        <span class="modal-kicker is-cyan">INSTITUTIONAL VAULT</span>
        <h2>Deploy a micro-grant</h2>
        <p>Configure bounty details. This creates a preview grant in the prototype (no on-chain deployment).</p>
      </div>
      <form class="modal-form" id="grantForm">
        <div class="form-grid">
          <div class="form-field is-full"><span>Protocol Name</span><input placeholder="e.g. Monad Labs, Uniswap" required /></div>
          <div class="form-field"><span>Grant Title</span><input placeholder="e.g. ZK Learning Bounty" required /></div>
          <div class="form-field"><span>Reward Amount (USDC)</span><input type="number" placeholder="2500" min="100" required /></div>
          <div class="form-field"><span>Category</span><select><option>Onboarding</option><option>DeFi</option><option>Security</option><option>Tooling</option><option>Bridging/Interop</option></select></div>
          <div class="form-field"><span>Deadline</span><select><option>7 days</option><option>12 days</option><option selected>15 days</option><option>30 days</option></select></div>
          <div class="form-field is-full"><span>Description</span><textarea placeholder="Describe the task, deliverables, and judging criteria..." required></textarea></div>
          <div class="form-field is-full"><span>Tags (comma separated)</span><input placeholder="Onboarding, Tutorial, Beginner" /></div>
        </div>
        <div class="form-note"><svg class="icon"><use href="#i-shield" /></svg> Grants go live to verified student guilds only. You'll need to verify protocol identity before publishing.</div>
        <button class="btn btn-primary modal-submit" type="submit"><span>Preview &amp; Deploy</span><svg class="icon"><use href="#i-arrow-right" /></svg></button>
      </form>
    `,
    onReady: (card) => {
      card.querySelector("#grantForm").addEventListener("submit", (e) => {
        e.preventDefault();
        closeModal();
        toast("success", "Grant drafted", "Micro-grant saved to draft. Review in Institutional Vault.");
      });
    }
  });
}

function openInfoModal(title, items) {
  openModal({
    wide: false,
    content: `
      <button class="modal-close" data-close aria-label="Close"><svg class="icon"><use href="#i-close" /></svg></button>
      <div class="modal-head">
        <div class="modal-icon"><svg class="icon"><use href="#i-info" /></svg></div>
        <span class="modal-kicker">INFORMATION</span>
        <h2>${title}</h2>
        <p>Quick reference for this prototype.</p>
      </div>
      <div class="info-list">
        ${items.map((it, i) => `<div class="info-list-item"><span class="info-list-index">${i+1}</span><div><strong>${it[0]}</strong><p>${it[1]}</p></div></div>`).join("")}
      </div>
      <div class="modal-actions"><button class="btn btn-primary" data-close>Got it</button></div>
    `
  });
}

function initParallax() {
  const spot = qs(".hero-spotlight");
  if (!spot) return;
  const move = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    spot.style.setProperty("--spot-x", x + "px");
    spot.style.setProperty("--spot-y", y + "px");
  };
  window.addEventListener("mousemove", move, { passive: true });
}

function init() {
  initReveal();
  initHeader();
  initWallet();
  renderLeaderboard("tvl");
  initTabs();
  initHero();
  renderGrants();
  renderBadges();
  initSimulator();
  initHeroBtns();
  initParallax();

  // smooth anchors
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      const el = document.querySelector(href);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
