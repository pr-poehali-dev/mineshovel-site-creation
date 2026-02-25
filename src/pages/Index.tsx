import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── 3D Iron Shovel SVG ──────────────────────────────────────────────────────
const IronShovel3D = ({ size = 200, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 120 168"
    className={className}
    style={{ filter: "drop-shadow(0 0 20px rgba(0,245,255,0.4)) drop-shadow(0 8px 24px rgba(0,0,0,0.8))" }}
  >
    <defs>
      <linearGradient id="iron-face" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f4ff" />
        <stop offset="15%" stopColor="#c8d4e4" />
        <stop offset="30%" stopColor="#90a0b4" />
        <stop offset="50%" stopColor="#d0dce8" />
        <stop offset="65%" stopColor="#788898" />
        <stop offset="80%" stopColor="#b8c8d8" />
        <stop offset="100%" stopColor="#e8f0f8" />
      </linearGradient>
      <linearGradient id="iron-side" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4a5568" />
        <stop offset="100%" stopColor="#718096" />
      </linearGradient>
      <linearGradient id="iron-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#a0aec0" />
      </linearGradient>
      <linearGradient id="stick-main" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="40%" stopColor="#d97706" />
        <stop offset="60%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="stick-side" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3d1a04" />
        <stop offset="100%" stopColor="#5c2a08" />
      </linearGradient>
      <linearGradient id="shine-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="40%" stopColor="rgba(255,255,255,0.25)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>

    {/* Stick - side face (darker) */}
    <polygon points="62,55 68,55 68,155 62,155" fill="url(#stick-side)" />
    {/* Stick - front face */}
    <rect x="50" y="55" width="12" height="100" fill="url(#stick-main)" rx="1" />
    {/* Stick - top face */}
    <polygon points="50,55 62,55 68,55 56,55" fill="#c27b30" />
    {/* Stick grain lines */}
    <line x1="52" y1="60" x2="52" y2="150" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
    <line x1="55" y1="60" x2="55" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
    <line x1="58" y1="60" x2="58" y2="150" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />

    {/* Shovel blade - side face (3D depth) */}
    <polygon points="78,8 84,14 84,58 78,52" fill="url(#iron-side)" />
    {/* Shovel blade - bottom face */}
    <polygon points="22,52 78,52 84,58 28,58" fill="#5a6a7a" />
    {/* Shovel blade - front face */}
    <rect x="22" y="8" width="56" height="44" fill="url(#iron-face)" rx="2" />
    {/* Shine overlay */}
    <rect x="22" y="8" width="56" height="44" fill="url(#shine-sweep)" rx="2" />
    {/* Top highlight edge */}
    <line x1="22" y1="9" x2="78" y2="9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
    <line x1="23" y1="8" x2="23" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    {/* Bottom shadow edge */}
    <line x1="22" y1="51" x2="78" y2="51" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />

    {/* Top of blade (3D) */}
    <polygon points="22,8 78,8 84,14 28,14" fill="url(#iron-top)" />

    {/* Blade texture grid lines */}
    <line x1="38" y1="10" x2="38" y2="50" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
    <line x1="55" y1="10" x2="55" y2="50" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
    <line x1="72" y1="10" x2="72" y2="50" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
    <line x1="24" y1="24" x2="77" y2="24" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
    <line x1="24" y1="38" x2="77" y2="38" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />

    {/* Neon cyan glow edge at bottom */}
    <line x1="22" y1="52" x2="78" y2="52" stroke="rgba(0,245,255,0.6)" strokeWidth="1" />
  </svg>
);

// ─── Iron Cube 3D ────────────────────────────────────────────────────────────
const IronCube3D = ({ size = 60, neon = "#39ff14" }: { size?: number; neon?: string }) => {
  const id = neon.replace("#", "");
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ filter: `drop-shadow(0 0 8px ${neon}60)` }}>
      <defs>
        <linearGradient id={`cube-face-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d0dce8" />
          <stop offset="50%" stopColor="#8090a8" />
          <stop offset="100%" stopColor="#b0bece" />
        </linearGradient>
        <linearGradient id={`cube-top-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f0f8" />
          <stop offset="100%" stopColor="#b0c0d0" />
        </linearGradient>
      </defs>
      <polygon points="30,5 55,18 55,42 30,55 5,42 5,18" fill={`url(#cube-face-${id})`} />
      <polygon points="30,5 55,18 30,31 5,18" fill={`url(#cube-top-${id})`} />
      <polygon points="5,18 30,31 30,55 5,42" fill="#4a5568" />
      <polygon points="55,18 30,31 30,55 55,42" fill="#5a6878" />
      <line x1="30" y1="5" x2="55" y2="18" stroke={neon} strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="30" y1="5" x2="5" y2="18" stroke={neon} strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="30" y1="5" x2="30" y2="55" stroke={neon} strokeWidth="0.5" strokeOpacity="0.4" />
    </svg>
  );
};

// ─── Particle Background ─────────────────────────────────────────────────────
const ParticleBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    const colors = ["#39ff14", "#00f5ff", "#ff2d78", "#ffe600"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ─── Server Status Component ─────────────────────────────────────────────────
const ServerStatus = () => {
  const online = true;
  const players = 142;
  const maxPlayers = 500;
  const tps = 19.8;

  return (
    <div className="glass-card rounded-2xl p-6 glow-green">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ background: "#39ff14", boxShadow: "0 0 10px #39ff14" }}
        />
        <span className="font-russo text-lg text-neon-green">ОНЛАЙН</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-mine-card rounded-xl p-3 border border-mine-border">
          <div className="text-gray-400 text-xs mb-1">ИГРОКИ</div>
          <div className="font-russo text-2xl text-neon-cyan">
            {players}<span className="text-gray-500 text-sm">/{maxPlayers}</span>
          </div>
          <div className="mt-2 h-1 bg-mine-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green"
              style={{ width: `${(players / maxPlayers) * 100}%`, boxShadow: "0 0 6px #00f5ff" }}
            />
          </div>
        </div>
        <div className="bg-mine-card rounded-xl p-3 border border-mine-border">
          <div className="text-gray-400 text-xs mb-1">TPS</div>
          <div className="font-russo text-2xl text-neon-green">{tps}</div>
          <div className="text-xs text-gray-500 mt-1">Стабильный</div>
        </div>
        <div className="bg-mine-card rounded-xl p-3 border border-mine-border col-span-2">
          <div className="text-gray-400 text-xs mb-1">АДРЕС</div>
          <div className="font-russo text-neon-yellow tracking-wider">mineshovel.ru</div>
        </div>
      </div>
    </div>
  );
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О сервере" },
  { id: "status", label: "Статус" },
  { id: "shop", label: "Донат" },
  { id: "rules", label: "Правила" },
  { id: "contacts", label: "Контакты" },
];

// ─── Shop Data ────────────────────────────────────────────────────────────────
const shopItems = [
  {
    id: 1, name: "Выживший", price: "199₽", oldPrice: null as string | null,
    color: "#39ff14", features: ["Приставка [Выживший]", "5 домов", "Цветной ник", "Fly в хабе"],
    popular: false, icon: "Shield",
  },
  {
    id: 2, name: "Шахтёр", price: "499₽", oldPrice: "699₽",
    color: "#00f5ff", features: ["Приставка [Шахтёр]", "10 домов", "Fly на выживании", "Доступ к шахте VIP"],
    popular: true, icon: "Pickaxe",
  },
  {
    id: 3, name: "Легенда", price: "999₽", oldPrice: null as string | null,
    color: "#ff2d78", features: ["Приставка [Легенда]", "Безлимит домов", "Все бонусы Шахтёра", "Ник в золоте", "Личный остров"],
    popular: false, icon: "Crown",
  },
];

const shopGoods = [
  { id: 1, name: "Набор строителя", price: "149₽", icon: "Hammer", color: "#39ff14", desc: "64 досок, 32 камня, 16 стекла" },
  { id: 2, name: "Зелье удачи", price: "89₽", icon: "Sparkles", color: "#00f5ff", desc: "Улучшает дроп x2 на 1 час" },
  { id: 3, name: "Кейс с оружием", price: "249₽", icon: "Sword", color: "#ff2d78", desc: "Случайное крутое оружие" },
  { id: 4, name: "Энчант книга", price: "179₽", icon: "BookOpen", color: "#ffe600", desc: "Книга с крутым зачарованием" },
];

// ─── Rules ────────────────────────────────────────────────────────────────────
const rules = [
  { n: "01", title: "Уважение к игрокам", text: "Запрещены оскорбления, угрозы, дискриминация и токсичное поведение в чате и личных сообщениях." },
  { n: "02", title: "Никакого читерства", text: "Запрещены любые читы, боты, макросы, дающие нечестное преимущество. Бан навсегда." },
  { n: "03", title: "Честная игра", text: "Запрещено использование багов и эксплойтов в корыстных целях. Обнаруженный баг — сообщи администрации." },
  { n: "04", title: "Реклама запрещена", text: "Запрещена реклама других серверов, сайтов и сторонних ресурсов в любом виде." },
  { n: "05", title: "Никакого спама", text: "Не флуди в чате, не пиши капслоком, не засоряй общение бессмысленными сообщениями." },
  { n: "06", title: "Уважай территорию", text: "Нельзя строить вблизи чужих построек без разрешения и намеренно портить ландшафт." },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyIp = () => {
    navigator.clipboard.writeText("mineshovel.ru");
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.3 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-mine-bg font-rubik relative">
      <ParticleBg />
      <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-50" />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "rgba(5,10,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(57,255,20,0.1)" }}>

        <button onClick={() => scrollTo("home")} className="flex items-center gap-3 group">
          <IronCube3D size={36} neon="#39ff14" />
          <div>
            <span className="font-russo text-xl tracking-widest text-neon-green">MINE</span>
            <span className="font-russo text-xl tracking-widest text-iron-light">SHOVEL</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`nav-link text-sm font-medium tracking-wider transition-all ${activeSection === item.id ? "text-neon-green" : "text-gray-400"}`}>
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={copyIp}
          className="hidden md:flex items-center gap-2 btn-neon px-5 py-2 rounded-xl font-russo text-sm tracking-wider text-mine-bg bg-neon-green glow-green hover:scale-105 transition-transform">
          <Icon name="Copy" size={14} />
          {copyDone ? "СКОПИРОВАНО!" : "mineshovel.ru"}
        </button>

        <button className="md:hidden text-neon-green" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{ background: "rgba(5,10,15,0.97)", backdropFilter: "blur(20px)" }}>
          {navItems.map((item, i) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="font-russo text-2xl tracking-widest py-4 text-gray-300 hover:text-neon-green transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animation: `fade-in 0.4s ease-out ${i * 0.08}s forwards` }}>
              {item.label}
            </button>
          ))}
          <button onClick={copyIp}
            className="mt-8 px-8 py-3 bg-neon-green text-mine-bg font-russo rounded-xl glow-green">
            {copyDone ? "СКОПИРОВАНО!" : "mineshovel.ru"}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(57,255,20,0.05) 0%, rgba(0,245,255,0.04) 40%, transparent 70%)"
        }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest text-neon-cyan"
              style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)" }}>
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" style={{ boxShadow: "0 0 6px #00f5ff" }} />
              СЕРВЕР ОНЛАЙН · 142 ИГРОКА
            </div>

            <h1 className="font-russo text-5xl md:text-7xl leading-none mb-6">
              <span className="block text-white">ДОБРО</span>
              <span className="block text-white">ПОЖАЛОВАТЬ</span>
              <span className="block text-neon-green" style={{ textShadow: "0 0 30px rgba(57,255,20,0.5)" }}>НА СЕРВЕР</span>
            </h1>

            <div className="flex items-end gap-3 mb-8">
              <span className="font-russo text-4xl md:text-6xl text-white">MINE</span>
              <span className="font-russo text-4xl md:text-6xl"
                style={{
                  background: "linear-gradient(135deg, #c8d4e4 0%, #90a0b4 30%, #d0dce8 60%, #788898 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 12px rgba(0,245,255,0.3))"
                }}>
                SHOVEL
              </span>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              Уникальный Minecraft сервер с крутым сообществом, честной игрой и постоянными событиями. Присоединяйся и стань частью легенды!
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={copyIp}
                className="btn-neon flex items-center gap-3 px-8 py-4 bg-neon-green text-mine-bg font-russo text-sm rounded-xl tracking-wider animate-glow-pulse hover:scale-105 transition-transform">
                <Icon name={copyDone ? "Check" : "Gamepad2"} size={18} />
                {copyDone ? "IP СКОПИРОВАН!" : "ИГРАТЬ СЕЙЧАС"}
              </button>
              <button onClick={() => scrollTo("shop")}
                className="btn-neon flex items-center gap-3 px-8 py-4 font-russo text-sm rounded-xl tracking-wider text-neon-cyan hover:scale-105 transition-transform"
                style={{ border: "1px solid rgba(0,245,255,0.4)", background: "rgba(0,245,255,0.05)" }}>
                <Icon name="ShoppingBag" size={18} />
                ДОНАТ МАГАЗИН
              </button>
            </div>

            <div className="flex gap-8 mt-12 pt-8 border-t border-mine-border">
              {[
                { val: "142", label: "Онлайн", color: "#39ff14" },
                { val: "18K+", label: "Игроков", color: "#00f5ff" },
                { val: "3", label: "Года", color: "#ff2d78" },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-russo text-2xl" style={{ color: s.color, textShadow: `0 0 12px ${s.color}60` }}>{s.val}</div>
                  <div className="text-gray-500 text-xs mt-1 tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Shovel hero */}
          <div className="flex justify-center items-center relative">
            <div className="absolute w-64 h-64 rounded-full" style={{
              background: "radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite"
            }} />
            <div className="absolute w-48 h-48 rounded-full" style={{
              background: "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite 1.5s"
            }} />
            <div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{
              border: "1px solid rgba(57,255,20,0.12)",
              animation: "rotate-slow 12s linear infinite"
            }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1 rounded-full bg-neon-green"
                style={{ boxShadow: "0 0 8px #39ff14" }} />
            </div>
            <div className="absolute w-56 h-56 rounded-full pointer-events-none" style={{
              border: "1px solid rgba(0,245,255,0.1)",
              animation: "rotate-slow 8s linear infinite reverse"
            }}>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-neon-cyan"
                style={{ boxShadow: "0 0 8px #00f5ff" }} />
            </div>
            <div className="animate-float">
              <IronShovel3D size={180} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-600 text-xs tracking-widest">ПРОКРУТИТЬ</span>
          <Icon name="ChevronDown" size={16} className="text-gray-600" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          О СЕРВЕРЕ
      ══════════════════════════════════════════════ */}
      <section id="about" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-neon-cyan text-xs tracking-[0.3em] font-medium mb-4">ЧТО МЫ ПРЕДЛАГАЕМ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">О <span className="text-neon-green">СЕРВЕРЕ</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "Globe", title: "Режимы игры", color: "#39ff14", text: "Выживание, PvP арены, Creative режим и секретные ивент-зоны — у нас всегда есть чем заняться любому игроку.", items: ["Выживание 1.20.4", "PvP Арены", "Creative", "Ивенты каждые выходные"] },
            { icon: "Zap", title: "Производительность", color: "#00f5ff", text: "Выделенные серверы на NVMe SSD с 99.9% аптаймом и стабильным TPS. Никаких лагов — только чистый геймплей.", items: ["TPS 20 стабильно", "NVMe SSD", "99.9% Uptime", "Защита от DDoS"] },
            { icon: "Users", title: "Сообщество", color: "#ff2d78", text: "18 000+ зарегистрированных игроков, активный Discord и Telegram, честная модерация и дружелюбная атмосфера.", items: ["18K+ игроков", "Discord сервер", "Telegram канал", "Честная модерация"] },
          ].map(card => (
            <div key={card.title}
              className="shop-card glass-card-cyan rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl"
                style={{ background: card.color, transform: "translate(30%,-30%)" }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                <Icon name={card.icon} size={24} style={{ color: card.color }} />
              </div>
              <h3 className="font-russo text-xl mb-3" style={{ color: card.color }}>{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{card.text}</p>
              <ul className="space-y-2">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.color, boxShadow: `0 0 4px ${card.color}` }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                <IronCube3D size={32} neon={card.color} />
              </div>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{ background: "linear-gradient(135deg, rgba(57,255,20,0.05) 0%, rgba(0,245,255,0.05) 50%, rgba(255,45,120,0.05) 100%)", border: "1px solid rgba(57,255,20,0.15)" }}>
          <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 animate-float">
              <IronShovel3D size={100} />
            </div>
            <div>
              <h3 className="font-russo text-2xl md:text-3xl text-white mb-3">
                Версия <span className="text-neon-green">Java 1.20.4</span> и <span className="text-neon-cyan">Bedrock</span>
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-2xl">
                Мы поддерживаем как Java Edition, так и Bedrock — играй с любого устройства. Подключайся с ПК, телефона или планшета. Кросс-платформенная игра без ограничений!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          СТАТУС СЕРВЕРА
      ══════════════════════════════════════════════ */}
      <section id="status" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-neon-green text-xs tracking-[0.3em] font-medium mb-4">РЕАЛЬНОЕ ВРЕМЯ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">СТАТУС <span className="text-neon-green">СЕРВЕРА</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <ServerStatus />
          <div className="space-y-4">
            {[
              { name: "Выживание", players: 89, max: 200, color: "#39ff14" },
              { name: "PvP Арены", players: 34, max: 100, color: "#00f5ff" },
              { name: "Creative", players: 19, max: 100, color: "#ff2d78" },
              { name: "Лобби", players: 142, max: 500, color: "#ffe600" },
            ].map(server => (
              <div key={server.name} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                  style={{ background: server.color, boxShadow: `0 0 8px ${server.color}` }} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{server.name}</span>
                    <span className="text-xs font-russo" style={{ color: server.color }}>{server.players}/{server.max}</span>
                  </div>
                  <div className="h-1.5 bg-mine-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${(server.players / server.max) * 100}%`, background: `linear-gradient(90deg, ${server.color}, ${server.color}aa)`, boxShadow: `0 0 6px ${server.color}` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Онлайн</span>
              </div>
            ))}
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs mb-1">Следующий ивент через</div>
              <div className="font-russo text-2xl text-neon-pink">02:47:13</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          МАГАЗИН / ДОНАТ
      ══════════════════════════════════════════════ */}
      <section id="shop" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-neon-pink text-xs tracking-[0.3em] font-medium mb-4">ПОДДЕРЖИ СЕРВЕР</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white mb-4">ДОНАТ <span className="text-neon-pink">МАГАЗИН</span></h2>
          <p className="text-gray-500 max-w-lg mx-auto">Все привилегии — исключительно косметические. Честный баланс гарантирован.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {shopItems.map(item => (
            <div key={item.id}
              className={`shop-card relative rounded-2xl p-8 flex flex-col ${item.popular ? "scale-105" : ""}`}
              style={{
                background: item.popular ? `linear-gradient(145deg, rgba(0,245,255,0.12), rgba(5,10,15,0.9))` : "rgba(10,21,32,0.85)",
                border: `1px solid ${item.color}30`,
                backdropFilter: "blur(12px)"
              }}>
              {item.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-russo text-xs text-mine-bg"
                  style={{ background: item.color, boxShadow: `0 0 12px ${item.color}` }}>
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl"
                style={{ background: item.color, transform: "translate(30%,-30%)" }} />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <Icon name={item.icon} size={22} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="font-russo text-xl" style={{ color: item.color }}>{item.name}</div>
                  {item.oldPrice && <div className="text-xs text-gray-500 line-through">{item.oldPrice}</div>}
                </div>
              </div>
              <div className="font-russo text-4xl text-white mb-6">{item.price}</div>
              <ul className="space-y-3 flex-1 mb-8">
                {item.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Icon name="Check" size={14} style={{ color: item.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="btn-neon w-full py-3 rounded-xl font-russo text-sm tracking-wider transition-all hover:scale-105"
                style={{
                  background: item.popular ? item.color : "transparent",
                  color: item.popular ? "#050a0f" : item.color,
                  border: `1px solid ${item.color}`,
                  boxShadow: item.popular ? `0 0 20px ${item.color}40` : "none"
                }}>
                КУПИТЬ
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-mine-border" />
            <h3 className="font-russo text-lg text-gray-400 tracking-widest">ПРЕДМЕТЫ</h3>
            <div className="h-px flex-1 bg-mine-border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shopGoods.map(good => (
              <div key={good.id}
                className="shop-card glass-card rounded-xl p-4 flex flex-col items-center text-center cursor-pointer"
                style={{ border: `1px solid ${good.color}20` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${good.color}12`, border: `1px solid ${good.color}25` }}>
                  <Icon name={good.icon} size={26} style={{ color: good.color }} />
                </div>
                <div className="font-medium text-white text-sm mb-1">{good.name}</div>
                <div className="text-xs text-gray-500 mb-3">{good.desc}</div>
                <div className="font-russo" style={{ color: good.color }}>{good.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ПРАВИЛА
      ══════════════════════════════════════════════ */}
      <section id="rules" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-neon-yellow text-xs tracking-[0.3em] font-medium mb-4">ОБЯЗАТЕЛЬНО К ПРОЧТЕНИЮ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">ПРАВИЛА <span className="text-neon-yellow" style={{ textShadow: "0 0 20px rgba(255,230,0,0.4)" }}>СЕРВЕРА</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map(rule => (
            <div key={rule.n}
              className="glass-card rounded-xl p-6 relative overflow-hidden hover:-translate-y-1 transition-transform">
              <div className="absolute top-4 right-4 font-russo text-4xl text-mine-border select-none">{rule.n}</div>
              <div className="relative z-10">
                <Icon name="AlertTriangle" size={20} className="text-neon-yellow mb-3" />
                <h3 className="font-russo text-lg text-white mb-2">{rule.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{rule.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 rounded-xl text-center"
          style={{ background: "rgba(255,230,0,0.05)", border: "1px solid rgba(255,230,0,0.2)" }}>
          <span className="text-neon-yellow font-russo text-sm">НАРУШЕНИЕ ПРАВИЛ = БАН БЕЗ ПРЕДУПРЕЖДЕНИЯ</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          КОНТАКТЫ
      ══════════════════════════════════════════════ */}
      <section id="contacts" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-neon-cyan text-xs tracking-[0.3em] font-medium mb-4">МЫ ВСЕГДА НА СВЯЗИ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white"><span className="text-neon-cyan">КОНТАКТЫ</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: "MessageCircle", label: "Discord", value: "discord.gg/mineshovel", color: "#5865f2" },
              { icon: "Send", label: "Telegram", value: "@mineshovel", color: "#00f5ff" },
              { icon: "Globe", label: "Сайт", value: "mineshovel.ru", color: "#39ff14" },
              { icon: "Mail", label: "Email", value: "admin@mineshovel.ru", color: "#ff2d78" },
            ].map(contact => (
              <div key={contact.label}
                className="glass-card rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform group"
                style={{ border: `1px solid ${contact.color}20` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${contact.color}15`, border: `1px solid ${contact.color}30` }}>
                  <Icon name={contact.icon} size={22} style={{ color: contact.color }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{contact.label}</div>
                  <div className="font-medium text-white">{contact.value}</div>
                </div>
                <Icon name="ChevronRight" size={16} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl p-10 flex flex-col justify-center items-center text-center overflow-hidden"
            style={{ background: "linear-gradient(145deg, rgba(57,255,20,0.08), rgba(0,245,255,0.05))", border: "1px solid rgba(57,255,20,0.2)" }}>
            <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
            <div className="animate-float mb-6">
              <IronShovel3D size={80} />
            </div>
            <h3 className="font-russo text-2xl text-white mb-3">ГОТОВ КОПАТЬ?</h3>
            <p className="text-gray-400 text-sm mb-8">Присоединяйся прямо сейчас и получи стартовый набор для новых игроков!</p>
            <button onClick={copyIp}
              className="btn-neon flex items-center gap-3 px-8 py-4 bg-neon-green text-mine-bg font-russo text-sm rounded-xl tracking-wider animate-glow-pulse hover:scale-105 transition-transform">
              <Icon name={copyDone ? "Check" : "Copy"} size={16} />
              {copyDone ? "СКОПИРОВАНО!" : "СКОПИРОВАТЬ IP"}
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-12 px-6 md:px-12" style={{ borderTop: "1px solid rgba(57,255,20,0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <IronCube3D size={28} neon="#39ff14" />
            <span className="font-russo tracking-widest">
              <span className="text-neon-green">MINE</span>
              <span className="text-iron-mid">SHOVEL</span>
            </span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="text-gray-600 hover:text-neon-green text-xs tracking-wider transition-colors">
                {item.label}
              </button>
            ))}
          </div>
          <div className="text-gray-700 text-xs">© 2024 MineShovel · Не связан с Mojang</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;