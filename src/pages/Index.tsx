import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useYookassa, openPaymentPage, isValidEmail } from "@/components/extensions/yookassa/useYookassa";

const YOOKASSA_API = "https://functions.poehali.dev/3f8d6504-ce50-4afb-8d89-4fa22dc94b3a";
const RETURN_URL = window.location.origin + "/?payment=success";

interface PurchaseItem {
  name: string;
  price: number;
  color: string;
}

const PurchaseModal = ({
  item,
  onClose,
}: {
  item: PurchaseItem;
  onClose: () => void;
}) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { createPayment, isLoading } = useYookassa({
    apiUrl: YOOKASSA_API,
    onError: (err) => setError(err.message),
  });

  const handlePurchase = async () => {
    if (!nickname.trim()) { setError("Введите ник"); return; }
    if (!email.trim() || !isValidEmail(email)) { setError("Введите корректный email"); return; }
    setError("");

    const response = await createPayment({
      amount: item.price,
      userEmail: email,
      userName: nickname,
      description: `${item.name} — ${nickname}`,
      returnUrl: RETURN_URL,
      cartItems: [{ id: item.name, name: item.name, price: item.price, quantity: 1 }],
    });

    if (response?.payment_url) {
      openPaymentPage(response.payment_url);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass-card rounded-2xl p-6 animate-scale-in"
        style={{ borderColor: `${item.color}30` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="mb-6">
          <div className="font-russo text-xl text-white mb-1">{item.name}</div>
          <div className="font-russo text-2xl" style={{ color: item.color }}>{item.price} ₽</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Ваш ник в Minecraft</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Steve"
              className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:border-ms-blue/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Email для чека</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:border-ms-blue/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 text-red-400 text-xs flex items-center gap-1.5">
            <Icon name="AlertCircle" size={14} />
            {error}
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="mt-6 w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: item.color }}
        >
          {isLoading ? "Создаём платёж..." : "ОПЛАТИТЬ"}
        </button>

        <p className="text-center text-gray-600 text-xs mt-3">
          Оплата через ЮKassa. После оплаты товар выдаётся автоматически.
        </p>
      </div>
    </div>
  );
};

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

const HeroVisual = () => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative w-64 h-64 md:w-80 md:h-80 animate-float cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ transition: "transform 0.5s ease", transform: hover ? "scale(1.08)" : "scale(1)" }}
    >
      <div className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          background: hover
            ? "radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <svg viewBox="0 0 220 220" className="w-full h-full relative z-10"
        style={{
          filter: hover
            ? "drop-shadow(0 0 40px rgba(34,211,238,0.5))"
            : "drop-shadow(0 0 25px rgba(59,130,246,0.35))",
          transition: "filter 0.5s ease"
        }}>
        <defs>
          <linearGradient id="orb-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="orb-inner" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="orb-shine" x1="30%" y1="0%" x2="70%" y2="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="core-glow" cx="50%" cy="40%" r="35%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.6)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>
          <linearGradient id="ring-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="glow-f">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="110" cy="205" rx="45" ry="6" fill="rgba(59,130,246,0.06)" />

        <circle cx="110" cy="100" r="55" fill="url(#orb-outer)" />
        <circle cx="110" cy="100" r="48" fill="url(#orb-inner)" />
        <circle cx="110" cy="100" r="48" fill="url(#core-glow)" />

        <ellipse cx="95" cy="82" rx="22" ry="16" fill="url(#orb-shine)" opacity="0.6" />

        <circle cx="110" cy="100" r="55" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" />
        <circle cx="110" cy="100" r="48" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />

        <g filter="url(#glow-f)">
          <text x="110" y="98" textAnchor="middle" fontFamily="Russo One, sans-serif" fontSize="22" fill="white" opacity="0.95">M</text>
          <text x="110" y="118" textAnchor="middle" fontFamily="Russo One, sans-serif" fontSize="10" fill="rgba(96,165,250,0.8)" letterSpacing="2">SHOVEL</text>
        </g>

        <circle cx="85" cy="70" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="130" cy="80" r="1" fill="rgba(255,255,255,0.2)" />
        <circle cx="110" cy="130" r="1.2" fill="rgba(255,255,255,0.15)" />
        <circle cx="75" cy="105" r="0.8" fill="rgba(34,211,238,0.4)" />
        <circle cx="145" cy="95" r="0.8" fill="rgba(34,211,238,0.3)" />

        <g opacity="0.15">
          <path d="M110 30 L110 38" stroke="url(#ring-cyan)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M110 162 L110 170" stroke="url(#ring-cyan)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 100 L38 100" stroke="url(#ring-cyan)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M182 100 L190 100" stroke="url(#ring-cyan)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <circle cx="110" cy="100" r="70" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="110" cy="100" r="80" fill="none" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5" strokeDasharray="2 12" />
      </svg>

      <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: "18s" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-ms-blue/10" />
        <div className="absolute top-[8%] left-1/2 w-2 h-2 rounded-full bg-ms-cyan/40" />
      </div>
      <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: "28s", animationDirection: "reverse" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] rounded-full border border-dashed border-ms-cyan/5" />
        <div className="absolute bottom-[5%] right-[15%] w-1.5 h-1.5 rounded-full bg-ms-blue/30" />
      </div>
    </div>
  );
};

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
      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ms-blue/30 bg-ms-dark/80 hover:border-ms-blue/60 hover:bg-ms-blue/5 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
    >
      <span className="font-russo text-sm text-ms-blue-bright tracking-wider">{ip}</span>
      <Icon name={copied ? "Check" : "Copy"} size={14} className={copied ? "text-green-400" : "text-gray-500 group-hover:text-ms-blue-bright transition-colors"} />
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

const cases = [
  { name: "Обычный кейс", price: "49 ₽", color: "#94a3b8", desc: "Случайный ресурс или инструмент" },
  { name: "Редкий кейс", price: "149 ₽", color: "#60a5fa", desc: "Зачарованные предметы и ресурсы" },
  { name: "Эпический кейс", price: "349 ₽", color: "#a78bfa", desc: "Кастомное оружие и уникальные предметы" },
  { name: "Легендарный кейс", price: "599 ₽", color: "#fb923c", desc: "Лучшие предметы сервера + эксклюзивы" },
];

const otherItems = [
  { name: "Разбан", price: "499 ₽", color: "#ef4444", desc: "Снятие блокировки аккаунта", icon: "ShieldOff" },
  { name: "Размут", price: "199 ₽", color: "#f59e0b", desc: "Снятие мута в чате", icon: "MessageSquareOff" },
  { name: "Смена ника", price: "99 ₽", color: "#22d3ee", desc: "Изменить игровой никнейм", icon: "UserPen" },
  { name: "Кастомный тег", price: "299 ₽", color: "#a78bfa", desc: "Уникальный тег рядом с ником", icon: "Tag" },
];

const navItems = [
  { id: "hero", label: "Главная" },
  { id: "about", label: "О сервере" },
  { id: "donate", label: "Донат" },
  { id: "status", label: "Статус" },
];

type DonateTab = "privileges" | "currency" | "cases" | "other";

const donateTabs: { id: DonateTab; label: string; icon: string }[] = [
  { id: "privileges", label: "Привилегии", icon: "Crown" },
  { id: "currency", label: "Кусочки", icon: "Coins" },
  { id: "cases", label: "Кейсы", icon: "Box" },
  { id: "other", label: "Другое", icon: "Settings" },
];

const Index = () => {
  const [activeNav, setActiveNav] = useState("hero");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [expandedPriv, setExpandedPriv] = useState<number | null>(null);
  const [donateTab, setDonateTab] = useState<DonateTab>("privileges");
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null);

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

  const currencyPrice = Math.round(currencyAmount / 10);

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
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center group-hover:bg-ms-blue/25 group-hover:border-ms-blue/50 transition-all duration-300">
              <Icon name="Shovel" size={16} className="text-ms-blue-bright" />
            </div>
            <span className="font-russo text-lg text-white">MINESHOVEL</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link text-sm font-medium tracking-wide cursor-pointer transition-all duration-300 ${
                  activeNav === item.id ? "text-ms-blue-bright" : "text-gray-400 hover:text-gray-200"
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
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all ${
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ms-blue/20 bg-ms-blue/5 mb-6 opacity-0-init animate-fade-in hover:border-ms-blue/40 hover:bg-ms-blue/10 transition-all duration-300 cursor-default">
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
                className="btn-blue px-8 py-3.5 rounded-xl bg-ms-blue font-russo text-sm tracking-wider text-white glow-blue cursor-pointer hover:bg-blue-500 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300"
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
            О СЕРВЕРЕ
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "Pickaxe", title: "Авто-Шахта", desc: "Уникальная механика — копай лопатой, а не киркой. Добывай ресурсы по-новому!", color: "#3b82f6" },
            { icon: "Palette", title: "Ресурспак", desc: "Кастомный ресурс пак с уникальными текстурами, звуками и моделями предметов.", color: "#22d3ee" },
            { icon: "CalendarDays", title: "Ивенты", desc: "Регулярные ивенты с эксклюзивными наградами и уникальными механиками.", color: "#818cf8" },
            { icon: "Swords", title: "PvP Анархия", desc: "Настоящая анархия без правил PvP. Стройте альянсы или уничтожайте всех.", color: "#f472b6" },
            { icon: "Gem", title: "Уникальные предметы", desc: "Кастомные предметы с особыми свойствами, которых нет ни на одном другом сервере.", color: "#38bdf8" },
            { icon: "Shield", title: "Стабильность", desc: "Мощное железо, защита от DDoS и постоянный аптайм 99.9%.", color: "#60a5fa" },
          ].map((item, i) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-6 opacity-0-init animate-fade-in cursor-default group hover:border-opacity-40 hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] transition-all duration-500"
              style={{ animationDelay: `${i * 0.1}s`, borderColor: `${item.color}15` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${item.color}15`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}15`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <Icon name={item.icon} size={22} style={{ color: item.color }} />
              </div>
              <h3 className="font-russo text-lg text-white mb-2 group-hover:text-ms-blue-bright transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ DONATE ════════ */}
      <section id="donate" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-ms-blue-bright text-xs tracking-[0.3em] font-medium mb-4">ПОДДЕРЖИ СЕРВЕР</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">ДОНАТ</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {donateTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setDonateTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300 hover:scale-[1.05] ${
                donateTab === tab.id
                  ? "bg-ms-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "bg-ms-dark border border-ms-border/50 text-gray-400 hover:text-white hover:border-ms-blue/30"
              }`}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Привилегии */}
        {donateTab === "privileges" && (
          <div>
            <p className="text-center text-gray-500 text-sm mb-8">Каждый ранг включает все возможности предыдущего</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {privileges.map((priv, i) => (
                <div
                  key={priv.name}
                  className="priv-card glass-card rounded-2xl overflow-hidden opacity-0-init animate-fade-in cursor-pointer group"
                  style={{ animationDelay: `${i * 0.08}s`, borderColor: `${priv.color}20` }}
                  onClick={() => setExpandedPriv(expandedPriv === i ? null : i)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.color}20`;
                  }}
                >
                  <div className="h-1.5 w-full transition-all duration-500 group-hover:h-2" style={{ background: `linear-gradient(90deg, ${priv.color}80, ${priv.color}20)` }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-russo text-base group-hover:scale-105 transition-transform duration-300 inline-block" style={{ color: priv.color }}>{priv.name}</span>
                      <span className="font-russo text-lg text-white">{priv.price}</span>
                    </div>

                    <div className={`space-y-2 overflow-hidden transition-all duration-400 ${expandedPriv === i ? "max-h-96 opacity-100" : "max-h-24 opacity-80"}`}>
                      {priv.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          <Icon name="Check" size={14} className="mt-0.5 flex-shrink-0" style={{ color: priv.color }} />
                          <span className="text-gray-400 text-xs leading-relaxed">{f}</span>
                        </div>
                      ))}
                    </div>

                    {priv.features.length > 3 && (
                      <button className="mt-3 text-xs flex items-center gap-1 cursor-pointer group-hover:gap-2 transition-all duration-300" style={{ color: priv.color }}>
                        <Icon name={expandedPriv === i ? "ChevronUp" : "ChevronDown"} size={12} />
                        {expandedPriv === i ? "Свернуть" : "Ещё " + (priv.features.length - 3)}
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPurchaseItem({ name: `Привилегия «${priv.name}»`, price: parseInt(priv.price.replace(/\s/g, "")), color: priv.color });
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl font-russo text-xs tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300"
                      style={{ background: `${priv.color}30`, border: `1px solid ${priv.color}40` }}
                    >
                      КУПИТЬ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кусочки */}
        {donateTab === "currency" && (
          <div className="max-w-lg mx-auto">
            <div className="glass-card rounded-2xl p-8 hover:border-ms-blue/30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                  <Icon name="Coins" size={24} className="text-yellow-400" />
                </div>
                <div>
                  <div className="font-russo text-xl text-white">Кусочки</div>
                  <div className="text-xs text-gray-500">Внутриигровая донат-валюта</div>
                </div>
              </div>

              <div className="bg-ms-dark rounded-xl p-6 border border-ms-border/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Количество:</span>
                  <span className="font-russo text-3xl text-yellow-400">{currencyAmount}</span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={10000}
                  step={10}
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${((currencyAmount - 10) / (10000 - 10)) * 100}%, #152040 ${((currencyAmount - 10) / (10000 - 10)) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>10</span>
                  <span>10 000</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-ms-blue/5 border border-ms-blue/20">
                <span className="text-gray-400">К оплате:</span>
                <span className="font-russo text-2xl text-white">{currencyPrice} ₽</span>
              </div>

              <button
                onClick={() => setPurchaseItem({ name: `${currencyAmount} кусочков`, price: currencyPrice, color: "#eab308" })}
                className="mt-6 w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-black cursor-pointer bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] transition-all duration-300"
              >
                КУПИТЬ {currencyAmount} КУСОЧКОВ
              </button>
              <p className="text-center text-gray-600 text-xs mt-4">10 кусочков = 1 ₽</p>
            </div>
          </div>
        )}

        {/* Кейсы */}
        {donateTab === "cases" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cases.map((c, i) => (
              <div
                key={c.name}
                className="glass-card rounded-2xl p-5 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s`, borderColor: `${c.color}20` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${c.color}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${c.color}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${c.color}20`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
                  <Icon name="Box" size={26} style={{ color: c.color }} />
                </div>
                <div className="font-russo text-base text-white mb-1 group-hover:text-ms-blue-bright transition-colors">{c.name}</div>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">{c.desc}</p>
                <div className="font-russo text-lg mb-3" style={{ color: c.color }}>{c.price}</div>
                <button
                  onClick={() => setPurchaseItem({ name: c.name, price: parseInt(c.price.replace(/\s/g, "")), color: c.color })}
                  className="w-full py-2.5 rounded-xl font-russo text-xs tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300"
                  style={{ background: `${c.color}30`, border: `1px solid ${c.color}40` }}
                >
                  КУПИТЬ
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Другое */}
        {donateTab === "other" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherItems.map((item, i) => (
              <div
                key={item.name}
                className="glass-card rounded-2xl p-5 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s`, borderColor: `${item.color}20` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${item.color}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}20`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                  <Icon name={item.icon} size={26} style={{ color: item.color }} />
                </div>
                <div className="font-russo text-base text-white mb-1 group-hover:text-ms-blue-bright transition-colors">{item.name}</div>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">{item.desc}</p>
                <div className="font-russo text-lg mb-3" style={{ color: item.color }}>{item.price}</div>
                <button
                  onClick={() => setPurchaseItem({ name: item.name, price: parseInt(item.price.replace(/\s/g, "")), color: item.color })}
                  className="w-full py-2.5 rounded-xl font-russo text-xs tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300"
                  style={{ background: `${item.color}30`, border: `1px solid ${item.color}40` }}
                >
                  КУПИТЬ
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ════════ STATUS ════════ */}
      <section id="status" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-ms-cyan text-xs tracking-[0.3em] font-medium mb-4">В РЕАЛЬНОМ ВРЕМЕНИ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">СТАТУС СЕРВЕРА</h2>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="glass-card rounded-2xl p-8 glow-blue animate-pulse-glow hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] transition-all duration-700">
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
              <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-ms-blue/30 transition-all duration-300 group cursor-default">
                <div className="text-gray-500 text-xs mb-1 tracking-wider">ОНЛАЙН</div>
                <div className="font-russo text-3xl text-white group-hover:text-ms-blue-bright transition-colors">142<span className="text-gray-600 text-lg">/500</span></div>
                <div className="mt-2 h-1.5 bg-ms-border/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-ms-blue to-ms-cyan" style={{ width: "28%" }} />
                </div>
              </div>
              <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-green-500/30 transition-all duration-300 group cursor-default">
                <div className="text-gray-500 text-xs mb-1 tracking-wider">TPS</div>
                <div className="font-russo text-3xl text-green-400 group-hover:text-green-300 transition-colors">19.8</div>
                <div className="mt-2 h-1.5 bg-ms-border/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: "99%" }} />
                </div>
              </div>
            </div>

            <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-ms-blue/30 transition-all duration-300">
              <div className="text-gray-500 text-xs mb-2 tracking-wider">IP СЕРВЕРА</div>
              <CopyIP ip="mc.mineshovel.ru" />
            </div>
          </div>
        </div>
      </section>

      {purchaseItem && (
        <PurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />
      )}

      {/* ════════ FOOTER ════════ */}
      <footer className="relative border-t border-ms-border/30 bg-ms-bg/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2.5 justify-center md:justify-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
                  <Icon name="Shovel" size={16} className="text-ms-blue-bright" />
                </div>
                <span className="font-russo text-lg text-white">MINESHOVEL</span>
              </div>
              <p className="text-gray-600 text-sm max-w-xs">Шаг в Будущее. Современная анархия на Java 1.20.1 — 1.21.x</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="https://t.me/mineshovel" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-[#26A5E4]/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(38,165,228,0.15)] transition-all duration-300 group cursor-pointer">
                <Icon name="Send" size={16} className="text-[#26A5E4] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">Telegram</span>
              </a>
              <a href="https://discord.gg/66f54mXCbR" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-[#5865f2]/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(88,101,242,0.15)] transition-all duration-300 group cursor-pointer">
                <Icon name="MessageCircle" size={16} className="text-[#5865f2] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">Discord</span>
              </a>
              <a href="https://youtube.com/@mineshovel_official" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-red-500/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)] transition-all duration-300 group cursor-pointer">
                <Icon name="Youtube" size={16} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">YouTube</span>
              </a>
              <a href="https://vk.com/mineshovelofficial" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-[#0077FF]/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,119,255,0.15)] transition-all duration-300 group cursor-pointer">
                <Icon name="Globe" size={16} className="text-[#0077FF] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">ВКонтакте</span>
              </a>
              <a href="mailto:mineshovelofficial@gmail.com"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-ms-cyan/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)] transition-all duration-300 group cursor-pointer">
                <Icon name="Mail" size={16} className="text-ms-cyan group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">Почта</span>
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