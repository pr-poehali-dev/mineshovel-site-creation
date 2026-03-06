import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import PurchaseModal from "@/components/mineshovel/PurchaseModal";
import DonateSection from "@/components/mineshovel/DonateSection";
import { MC_SERVER_IP, navItems, type PurchaseState } from "@/components/mineshovel/data";

const HERO_IMG_LEFT = "https://cdn.poehali.dev/projects/734d0079-141f-458f-a592-69a0f49a5cd1/bucket/32b3b7e6-ff77-4ea7-8f9c-86b725dce618.png";
const HERO_IMG_RIGHT = "https://cdn.poehali.dev/projects/734d0079-141f-458f-a592-69a0f49a5cd1/bucket/5b9d0f1f-e082-4cd9-8d0a-ff0f001d5d8d.png";

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
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.4 + 0.05,
      });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const CopyIP = ({ ip, size = "sm" }: { ip: string; size?: "sm" | "lg" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const isLg = size === "lg";
  return (
    <button onClick={handleCopy} className={`group flex items-center gap-2 rounded-xl border border-ms-blue/30 bg-ms-dark/80 hover:border-ms-blue/60 hover:bg-ms-blue/5 hover:scale-[1.03] transition-all duration-300 cursor-pointer ${isLg ? "px-8 py-4" : "px-5 py-2.5"}`}>
      <span className={`font-russo text-ms-blue-bright tracking-wider ${isLg ? "text-2xl" : "text-sm"}`}>
        {copied ? "Скопировано!" : ip}
      </span>
      <Icon name={copied ? "Check" : "Copy"} size={isLg ? 22 : 14} className={copied ? "text-green-400" : "text-gray-500 group-hover:text-ms-blue-bright transition-colors"} />
    </button>
  );
};

const useServerStatus = () => {
  const [online, setOnline] = useState<number | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number>(500);
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${MC_SERVER_IP}`);
        const data = await res.json();
        if (data.online) { setIsOnline(true); setOnline(data.players?.online ?? 0); setMaxPlayers(data.players?.max ?? 500); }
        else { setIsOnline(false); setOnline(null); }
      } catch { setIsOnline(false); setOnline(null); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  return { online, maxPlayers, isOnline };
};

const useMouseParallax = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setOffset({
      x: (e.clientX - cx) / cx,
      y: (e.clientY - cy) / cy,
    });
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);
  return offset;
};

const Index = () => {
  const [activeNav, setActiveNav] = useState("hero");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [purchaseState, setPurchaseState] = useState<PurchaseState | null>(null);
  const { online, maxPlayers, isOnline } = useServerStatus();
  const mouse = useMouseParallax();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({ id: item.id, el: document.getElementById(item.id) }));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.offsetTop <= scrollY) { setActiveNav(sections[i].id); break; }
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
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)" }} />

      {/* ════════ NAV ════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-full border border-ms-border/50 bg-ms-bg/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-4">
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-7 h-7 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center group-hover:bg-ms-blue/25 transition-all duration-300">
                <Icon name="Shovel" size={14} className="text-ms-blue-bright" />
              </div>
              <span className="font-russo text-sm text-white hidden sm:inline">MINESHOVEL</span>
            </button>
            <div className="hidden lg:block">
              <CopyIP ip={MC_SERVER_IP} />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
                  activeNav === item.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-[140px]" />

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400 cursor-pointer">
            <Icon name={mobileMenu ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileMenu && (
          <div className="absolute top-full mt-2 left-4 right-4 rounded-2xl border border-ms-border/50 bg-ms-bg/95 backdrop-blur-xl p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                  activeNav === item.id ? "text-white bg-white/10" : "text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3"><CopyIP ip={MC_SERVER_IP} /></div>
          </div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <img
          src={HERO_IMG_LEFT}
          alt=""
          className="absolute pointer-events-none select-none w-[600px] md:w-[750px] lg:w-[900px] opacity-25"
          style={{
            left: "-8%",
            top: "50%",
            transform: `translate(${mouse.x * 25}px, calc(-50% + ${mouse.y * 25}px))`,
            filter: "drop-shadow(0 0 60px rgba(59,130,246,0.3))",
            transition: "transform 0.15s ease-out",
          }}
        />
        <img
          src={HERO_IMG_RIGHT}
          alt=""
          className="absolute pointer-events-none select-none w-[500px] md:w-[650px] lg:w-[800px] opacity-20"
          style={{
            right: "-10%",
            top: "10%",
            transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
            filter: "drop-shadow(0 0 60px rgba(59,130,246,0.25))",
            transition: "transform 0.15s ease-out",
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="font-russo text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight opacity-0-init animate-fade-in">
            Вся судьба анархии лишь{" "}
            <span style={{ background: "linear-gradient(135deg, #9CFFF3, #00ACFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              в твоих руках!
            </span>
            {" "}Докажи, что ты достоин.
          </h1>

          <p className="mt-6 text-gray-500 text-base md:text-lg max-w-2xl mx-auto opacity-0-init animate-fade-in animate-delay-200 leading-relaxed">
            Сервер, который покажет вам жестокость, любовь и красоту. Только тут вы сможете раскрыть свой потенциал и способности творить безумие!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0-init animate-fade-in animate-delay-300">
            <button
              onClick={() => scrollTo("donate")}
              className="btn-blue px-8 py-3.5 rounded-xl bg-ms-blue font-russo text-sm tracking-wider text-white glow-blue cursor-pointer hover:bg-blue-500 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300"
            >
              МАГАЗИН
            </button>
            <CopyIP ip={MC_SERVER_IP} />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ animationDuration: "2s" }}>
          <Icon name="ChevronDown" size={20} className="text-ms-blue/40" />
        </div>
      </section>

      {/* ════════ DONATE ════════ */}
      <DonateSection onPurchase={setPurchaseState} />

      {/* ════════ STATUS ════════ */}
      <section id="status" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-ms-cyan text-xs tracking-[0.3em] font-medium mb-4">В РЕАЛЬНОМ ВРЕМЕНИ</div>
          <h2 className="font-russo text-4xl md:text-5xl text-white">СТАТУС СЕРВЕРА</h2>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="glass-card rounded-2xl p-8 status-glow transition-all duration-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
                <Icon name="Swords" size={20} className="text-ms-blue-bright" />
              </div>
              <div>
                <div className="font-russo text-xl text-white">Омега Анархия</div>
                <div className="text-xs text-gray-500">Java 1.20.1 — 1.21.x</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-400 status-blink" : "bg-red-400"}`}
                  style={{ boxShadow: isOnline ? "0 0 8px rgba(74,222,128,0.6)" : "0 0 8px rgba(248,113,113,0.6)" }} />
                <span className={`text-sm font-medium ${isOnline ? "text-green-400" : "text-red-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-ms-blue/30 transition-all duration-300 cursor-default mb-6">
              <div className="text-gray-500 text-xs mb-1 tracking-wider">ОНЛАЙН</div>
              <div className="font-russo text-3xl text-white">
                {online !== null ? online : "—"}<span className="text-gray-600 text-lg">/{maxPlayers}</span>
              </div>
              {online !== null && (
                <div className="mt-2 h-1.5 bg-ms-border/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-ms-blue to-ms-cyan transition-all duration-1000" style={{ width: `${(online / maxPlayers) * 100}%` }} />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <CopyIP ip={MC_SERVER_IP} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PURCHASE MODAL ════════ */}
      {purchaseState && (
        <PurchaseModal state={purchaseState} setState={setPurchaseState} onClose={() => setPurchaseState(null)} />
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
              {[
                { href: "https://t.me/mineshovel", icon: "Send", label: "Telegram", color: "#26A5E4" },
                { href: "https://discord.gg/66f54mXCbR", icon: "MessageCircle", label: "Discord", color: "#5865f2" },
                { href: "https://youtube.com/@mineshovel_official", icon: "Youtube", label: "YouTube", color: "#ef4444" },
                { href: "https://vk.com/mineshovelofficial", icon: "Globe", label: "ВКонтакте", color: "#0077FF" },
                { href: "mailto:mineshovelofficial@gmail.com", icon: "Mail", label: "Почта", color: "#9ca3af" },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${link.color}40`; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 20px ${link.color}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ""; }}
                >
                  <Icon name={link.icon} size={16} style={{ color: link.color }} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ms-border/20 text-center">
            <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} MineShovel. Все права защищены. Не является публичной офертой.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
