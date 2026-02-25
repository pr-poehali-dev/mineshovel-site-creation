import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const ParticleBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.05,
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
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.fill();
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

const HeroVisual = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
    <div className="absolute inset-0 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
    <svg viewBox="0 0 200 200" className="w-full h-full relative z-10"
      style={{ filter: "drop-shadow(0 0 30px rgba(59,130,246,0.4))" }}>
      <defs>
        <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="blade-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="handle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="30%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="190" rx="50" ry="8" fill="rgba(59,130,246,0.08)" />

      <rect x="92" y="80" width="16" height="100" rx="3" fill="url(#handle-grad)" />
      <rect x="92" y="80" width="4" height="100" rx="1" fill="rgba(255,255,255,0.06)" />

      <rect x="88" y="78" width="24" height="8" rx="2" fill="url(#ring-grad)" opacity="0.8" />
      <rect x="88" y="78" width="24" height="3" rx="1" fill="rgba(255,255,255,0.2)" />

      <path d="M100 15 C65 15, 45 35, 45 60 C45 72, 52 78, 100 80 C148 78, 155 72, 155 60 C155 35, 135 15, 100 15Z"
        fill="url(#blade-grad)" />
      <path d="M100 15 C65 15, 45 35, 45 60 C45 72, 52 78, 100 80 C148 78, 155 72, 155 60 C155 35, 135 15, 100 15Z"
        fill="url(#blade-shine)" />

      <path d="M100 20 C75 20, 55 35, 52 55" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M100 25 C80 25, 62 38, 58 55" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />

      <path d="M100 15 C65 15, 45 35, 45 60 C45 72, 52 78, 100 80 C148 78, 155 72, 155 60 C155 35, 135 15, 100 15Z"
        fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />

      <circle cx="80" cy="45" r="2" fill="rgba(255,255,255,0.2)" />
      <circle cx="120" cy="50" r="1.5" fill="rgba(255,255,255,0.15)" />
      <circle cx="100" cy="60" r="1.8" fill="rgba(255,255,255,0.12)" />
    </svg>

    <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: "15s" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-ms-blue/10" />
    </div>
    <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: "25s", animationDirection: "reverse" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full border border-dashed border-ms-cyan/8" />
    </div>
  </div>
);

const CopyIP = ({ ip }: { ip: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ms-blue/30 bg-ms-dark/80 hover:border-ms-blue/60 transition-all cursor-pointer"
    >
      <span className="font-russo text-sm text-ms-blue-bright tracking-wider">{ip}</span>
      <Icon name={copied ? "Check" : "Copy"} size={14} className={copied ? "text-green-400" : "text-gray-500 group-hover:text-ms-blue-bright"} />
      {copied && <span className="text-xs text-green-400 ml-1">Скопировано!</span>}
    </button>
  );
};

const privileges = [
  {
    name: "Странник",
    price: "99 ₽",
    color: "#94a3b8",
    features: [
      "Префикс [Странник] в чате",
      "Доступ к /kit starter",
      "2 точки дома /sethome",
      "Цветной ник /nick",
    ]
  },
  {
    name: "Шахтёр",
    price: "249 ₽",
    color: "#60a5fa",
    features: [
      "Префикс [Шахтёр] в чате",
      "Доступ к /kit miner (кирка + броня)",
      "5 точек дома /sethome",
      "/fly в своих чанках",
      "Авто-шахта x2 скорость",
    ]
  },
  {
    name: "Воин",
    price: "399 ₽",
    color: "#38bdf8",
    features: [
      "Префикс [Воин] в чате",
      "Доступ к /kit warrior (зачарованная броня)",
      "8 точек дома",
      "/heal раз в 10 минут",
      "/back после смерти",
      "Бонус +10% к урону",
    ]
  },
  {
    name: "Рыцарь",
    price: "599 ₽",
    color: "#22d3ee",
    features: [
      "Префикс [Рыцарь] в чате",
      "/kit knight (полный незерит)",
      "12 точек дома",
      "/fly везде",
      "/heal раз в 5 минут",
      "/ec — эндер сундук",
      "Иммунитет к огню на 30 сек",
    ]
  },
  {
    name: "Лорд",
    price: "899 ₽",
    color: "#818cf8",
    features: [
      "Префикс [Лорд] в чате",
      "/kit lord (кастомное оружие)",
      "20 точек дома",
      "/god на 60 секунд (раз в час)",
      "/feed без кулдауна",
      "Приоритетный вход на сервер",
      "Уникальные частицы при ходьбе",
    ]
  },
  {
    name: "Титан",
    price: "1 299 ₽",
    color: "#a78bfa",
    features: [
      "Префикс [Титан] в чате",
      "/kit titan (легендарное оружие)",
      "30 точек дома",
      "/god на 2 минуты (раз в 30 мин)",
      "Кастомный ресурспак эффекты",
      "/craft — верстак в инвентаре",
      "x3 скорость авто-шахты",
      "Уникальный скин лопаты",
    ]
  },
  {
    name: "Император",
    price: "1 999 ₽",
    color: "#f472b6",
    features: [
      "Префикс [Император] в чате",
      "/kit emperor (мифическое снаряжение)",
      "50 точек дома",
      "/god на 5 минут",
      "Все команды предыдущих рангов",
      "Уникальная анимация входа",
      "Персональный варп /pwarp",
      "x5 скорость авто-шахты",
    ]
  },
  {
    name: "Бог",
    price: "3 499 ₽",
    color: "#fb923c",
    features: [
      "Префикс [Бог] в чате",
      "/kit god (божественное снаряжение)",
      "Безлимит точек дома",
      "/god без ограничений",
      "Все привилегии ниже",
      "Кастомный тег над ником",
      "Доступ к тестовым механикам",
      "Роль Бога в Discord",
      "x10 скорость авто-шахты",
    ]
  },
];

const rules = [
  { n: "01", title: "Читы запрещены", text: "Любые модификации, дающие преимущество, приводят к бану." },
  { n: "02", title: "Гриферство разрешено", text: "Это анархия — защищайте свои базы и ресурсы." },
  { n: "03", title: "Дюп запрещён", text: "Дюп предметов = перманентный бан без апелляции." },
  { n: "04", title: "Уважай админов", text: "Решения администрации — окончательные." },
  { n: "05", title: "Реклама = бан", text: "Реклама других серверов запрещена." },
  { n: "06", title: "Баги — репорт", text: "Нашли баг — сообщите нам, не эксплуатируйте." },
];

const navItems = [
  { id: "hero", label: "Главная" },
  { id: "about", label: "О сервере" },
  { id: "donate", label: "Донат" },
  { id: "status", label: "Статус" },
];

const Index = () => {
  const [activeNav, setActiveNav] = useState("hero");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [expandedPriv, setExpandedPriv] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.offsetTop <= scrollY) {
          setActiveNav(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div className="relative min-h-screen bg-ms-bg bg-grid">
      <ParticleBg />

      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)"
        }}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-ms-bg/80 border-b border-ms-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
              <Icon name="Shovel" size={16} className="text-ms-blue-bright" />
            </div>
            <span className="font-russo text-lg text-white">MINE<span className="text-ms-blue-bright">SHOVEL</span></span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link text-sm font-medium tracking-wide cursor-pointer ${
                  activeNav === item.id ? "text-ms-blue-bright" : "text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <CopyIP ip="mc.mineshovel.ru" />
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400 cursor-pointer">
            <Icon name={mobileMenu ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-ms-border/50 bg-ms-bg/95 backdrop-blur-xl">
            <div className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${
                    activeNav === item.id ? "text-ms-blue-bright bg-ms-blue/10" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3">
                <CopyIP ip="mc.mineshovel.ru" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ms-blue/20 bg-ms-blue/5 mb-6 opacity-0-init animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-ms-blue animate-pulse" />
              <span className="text-xs text-ms-blue-bright font-medium tracking-wider">JAVA 1.20.1 — 1.21.x</span>
            </div>

            <h1 className="font-russo text-5xl md:text-7xl text-white leading-tight opacity-0-init animate-fade-in animate-delay-100">
              Шаг в<br />
              <span className="text-glow-blue">Будущее</span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg max-w-lg opacity-0-init animate-fade-in animate-delay-200 leading-relaxed">
              Сервер, который покажет вам жестокость, любовь и красоту. Тут вы сами выбираете свою судьбу!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 opacity-0-init animate-fade-in animate-delay-300">
              <button
                onClick={() => scrollTo("about")}
                className="btn-blue px-8 py-3.5 rounded-xl bg-ms-blue font-russo text-sm tracking-wider text-white glow-blue cursor-pointer"
              >
                УЗНАТЬ БОЛЬШЕ
              </button>
              <CopyIP ip="mc.mineshovel.ru" />
            </div>
          </div>

          <div className="flex-shrink-0 opacity-0-init animate-scale-in animate-delay-400">
            <HeroVisual />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ animationDuration: "2s" }}>
          <Icon name="ChevronDown" size={20} className="text-ms-blue/40" />
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-ms-cyan text-xs tracking-[0.3em] font-medium mb-4">СОВРЕМЕННАЯ АНАРХИЯ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">
            О <span className="text-glow-blue">СЕРВЕРЕ</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: "Pickaxe",
              title: "Авто-Шахта",
              desc: "Уникальная механика — копай лопатой, а не киркой. Добывай ресурсы по-новому!",
              color: "#3b82f6"
            },
            {
              icon: "Palette",
              title: "Ресурспак",
              desc: "Кастомный ресурс пак с уникальными текстурами, звуками и моделями предметов.",
              color: "#22d3ee"
            },
            {
              icon: "CalendarDays",
              title: "Ивенты",
              desc: "Регулярные ивенты с эксклюзивными наградами и уникальными механиками.",
              color: "#818cf8"
            },
            {
              icon: "Swords",
              title: "PvP Анархия",
              desc: "Настоящая анархия без правил PvP. Стройте альянсы или уничтожайте всех.",
              color: "#f472b6"
            },
            {
              icon: "Gem",
              title: "Уникальные предметы",
              desc: "Кастомные предметы с особыми свойствами, которых нет ни на одном другом сервере.",
              color: "#38bdf8"
            },
            {
              icon: "Shield",
              title: "Стабильность",
              desc: "Мощное железо, защита от DDoS и постоянный аптайм 99.9%.",
              color: "#60a5fa"
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="glass-card glass-card-hover rounded-2xl p-6 opacity-0-init animate-fade-in cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <Icon name={item.icon} size={22} style={{ color: item.color }} />
              </div>
              <h3 className="font-russo text-lg text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ DONATE ════════ */}
      <section id="donate" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-ms-blue-bright text-xs tracking-[0.3em] font-medium mb-4">ПОДДЕРЖИ СЕРВЕР</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">
            <span className="text-glow-blue">ПРИВИЛЕГИИ</span>
          </h2>
          <p className="mt-4 text-gray-500 text-sm max-w-md mx-auto">
            Каждый ранг включает все возможности предыдущего
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {privileges.map((priv, i) => (
            <div
              key={priv.name}
              className="priv-card glass-card rounded-2xl overflow-hidden opacity-0-init animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s`, borderColor: `${priv.color}20` }}
              onClick={() => setExpandedPriv(expandedPriv === i ? null : i)}
            >
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${priv.color}80, ${priv.color}20)` }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-russo text-base" style={{ color: priv.color }}>{priv.name}</span>
                  <span className="font-russo text-lg text-white">{priv.price}</span>
                </div>

                <div className={`space-y-2 overflow-hidden transition-all duration-300 ${expandedPriv === i ? "max-h-96 opacity-100" : "max-h-24 opacity-80"}`}>
                  {priv.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <Icon name="Check" size={14} className="mt-0.5 flex-shrink-0" style={{ color: priv.color }} />
                      <span className="text-gray-400 text-xs leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                {priv.features.length > 3 && (
                  <button className="mt-3 text-xs flex items-center gap-1 cursor-pointer" style={{ color: priv.color }}>
                    <Icon name={expandedPriv === i ? "ChevronUp" : "ChevronDown"} size={12} />
                    {expandedPriv === i ? "Свернуть" : "Ещё " + (priv.features.length - 3)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ STATUS ════════ */}
      <section id="status" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-ms-cyan text-xs tracking-[0.3em] font-medium mb-4">В РЕАЛЬНОМ ВРЕМЕНИ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">
            <span className="text-glow-blue">СТАТУС</span> СЕРВЕРА
          </h2>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="glass-card rounded-2xl p-8 glow-blue animate-pulse-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
                <Icon name="Swords" size={20} className="text-ms-blue-bright" />
              </div>
              <div>
                <div className="font-russo text-xl text-white">Омега Анархия</div>
                <div className="text-xs text-gray-500">Основной режим</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(74,222,128,0.6)" }} />
                <span className="text-sm text-green-400 font-medium">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50">
                <div className="text-gray-500 text-xs mb-1 tracking-wider">ОНЛАЙН</div>
                <div className="font-russo text-3xl text-white">142<span className="text-gray-600 text-lg">/500</span></div>
                <div className="mt-2 h-1.5 bg-ms-border/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-ms-blue to-ms-cyan" style={{ width: "28%" }} />
                </div>
              </div>
              <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50">
                <div className="text-gray-500 text-xs mb-1 tracking-wider">TPS</div>
                <div className="font-russo text-3xl text-green-400">19.8</div>
                <div className="mt-2 h-1.5 bg-ms-border/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: "99%" }} />
                </div>
              </div>
            </div>

            <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50">
              <div className="text-gray-500 text-xs mb-2 tracking-wider">IP СЕРВЕРА</div>
              <CopyIP ip="mc.mineshovel.ru" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="relative border-t border-ms-border/30 bg-ms-bg/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2.5 justify-center md:justify-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
                  <Icon name="Shovel" size={16} className="text-ms-blue-bright" />
                </div>
                <span className="font-russo text-lg text-white">MINE<span className="text-ms-blue-bright">SHOVEL</span></span>
              </div>
              <p className="text-gray-600 text-sm max-w-xs">Шаг в Будущее. Современная анархия на Java 1.20.1 — 1.21.x</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="https://t.me/mineshovel" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-ms-blue/40 transition-all group cursor-pointer">
                <Icon name="Send" size={16} className="text-[#26A5E4] group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Telegram</span>
              </a>
              <a href="https://discord.gg/66f54mXCbR" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-[#5865f2]/40 transition-all group cursor-pointer">
                <Icon name="MessageCircle" size={16} className="text-[#5865f2] group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Discord</span>
              </a>
              <a href="https://youtube.com/@mineshovel_official" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-red-500/40 transition-all group cursor-pointer">
                <Icon name="Youtube" size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">YouTube</span>
              </a>
              <a href="https://vk.com/mineshovelofficial" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-[#0077FF]/40 transition-all group cursor-pointer">
                <Icon name="Globe" size={16} className="text-[#0077FF] group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">ВКонтакте</span>
              </a>
              <a href="mailto:mineshovelofficial@gmail.com"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-ms-cyan/40 transition-all group cursor-pointer">
                <Icon name="Mail" size={16} className="text-ms-cyan group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Почта</span>
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-ms-border/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-gray-600 text-xs">© 2025 MineShovel. Все права защищены.</span>
            <span className="text-gray-700 text-xs">Не является продуктом Mojang Studios</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
