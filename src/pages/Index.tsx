import { useState, useEffect, useRef, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { useYookassa, openPaymentPage, isValidEmail } from "@/components/extensions/yookassa/useYookassa";

const YOOKASSA_API = "https://functions.poehali.dev/3f8d6504-ce50-4afb-8d89-4fa22dc94b3a";
const RETURN_URL = window.location.origin + "/?payment=success";
const MC_SERVER_IP = "mc.mineshovel.ru";

interface Privilege {
  name: string;
  colorLeft: string;
  colorRight: string;
  desc: string;
  features: string[];
  durations: { label: string; key: string }[];
}

interface ShopItem {
  name: string;
  price: number;
  color: string;
  desc: string;
  icon: string;
}

interface PurchaseState {
  step: number;
  type: "privilege" | "item";
  name: string;
  desc: string;
  features?: string[];
  color: string;
  colorRight?: string;
  price: number;
  duration?: string;
  durations?: { label: string; key: string }[];
  nickname: string;
  email: string;
  promoCode: string;
  promoDiscount: number;
  orderId?: string;
  orderNumber?: string;
}

const privileges: Privilege[] = [
  {
    name: "Midnight",
    colorLeft: "#FFC917",
    colorRight: "#E0FF1C",
    desc: "Начальная привилегия с базовыми бонусами для старта.",
    features: ["Префикс [Midnight] в чате", "Доступ к /kit midnight", "3 точки дома /sethome", "Цветной ник /nick"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Exotic",
    colorLeft: "#FC30FF",
    colorRight: "#FF73DF",
    desc: "Экзотические возможности и яркий стиль.",
    features: ["Префикс [Exotic] в чате", "Доступ к /kit exotic", "5 точек дома", "/fly в своих чанках", "Авто-шахта x2 скорость"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Atomic",
    colorLeft: "#8AFF00",
    colorRight: "#B1FF57",
    desc: "Атомная мощь и усиленные привилегии.",
    features: ["Префикс [Atomic] в чате", "Доступ к /kit atomic (зачарованная броня)", "8 точек дома", "/heal раз в 10 минут", "/back после смерти"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Warden",
    colorLeft: "#FF9E1E",
    colorRight: "#FFD76B",
    desc: "Страж подземелий с мощными бонусами.",
    features: ["Префикс [Warden] в чате", "/kit warden (полный незерит)", "12 точек дома", "/fly везде", "/heal раз в 5 минут", "/ec — эндер сундук"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Noris",
    colorLeft: "#FF6969",
    colorRight: "#FF8F62",
    desc: "Неудержимая сила и продвинутые команды.",
    features: ["Префикс [Noris] в чате", "/kit noris (кастомное оружие)", "20 точек дома", "/god на 60 сек (раз в час)", "/feed без кулдауна", "Приоритетный вход"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Chrona",
    colorLeft: "#A8D1FF",
    colorRight: "#CB84FF",
    desc: "Повелитель времени с уникальными способностями.",
    features: ["Префикс [Chrona] в чате", "/kit chrona (легендарное оружие)", "30 точек дома", "/god на 2 мин (раз в 30 мин)", "/craft — верстак", "x3 скорость авто-шахты"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Briz",
    colorLeft: "#FF7324",
    colorRight: "#FF4E2C",
    desc: "Огненный ветер — элитная привилегия.",
    features: ["Префикс [Briz] в чате", "/kit briz (мифическое снаряжение)", "50 точек дома", "/god на 5 минут", "Все команды предыдущих", "Уникальная анимация входа", "/pwarp"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Shovel",
    colorLeft: "#00FF3B",
    colorRight: "#00FFA2",
    desc: "Легендарная привилегия с максимальными возможностями.",
    features: ["Префикс [Shovel] в чате", "/kit shovel (божественное снаряжение)", "Безлимит точек дома", "/god без ограничений", "Кастомный тег над ником", "Доступ к тестовым механикам", "Роль Shovel в Discord", "x10 авто-шахта"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Spring",
    colorLeft: "#E2FF34",
    colorRight: "#FFF332",
    desc: "Сезонная весенняя привилегия с уникальными весенними бонусами.",
    features: ["Весенний префикс [Spring]", "Сезонный /kit spring", "Уникальные весенние частицы", "Весенний ивент-бонус x2", "Эксклюзивный скин"],
    durations: [],
  },
  {
    name: "Кастомка",
    colorLeft: "#FFEF5B",
    colorRight: "#FFA352",
    desc: "Создай свою уникальную привилегию! Кастомный префикс и настройки.",
    features: ["Свой уникальный префикс", "Выбор цвета ника", "Кастомный /kit", "Персональная настройка"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "2 месяца", key: "2m" }, { label: "3 месяца", key: "3m" }],
  },
];

function getSpringDurations(): { label: string; key: string }[] {
  const now = new Date();
  const springEnd = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
  if (now > springEnd) {
    return [{ label: "1 месяц", key: "1m" }, { label: "На весь сезон", key: "season" }];
  }
  const daysLeft = Math.ceil((springEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 30) {
    return [{ label: `${daysLeft} дн. (до конца сезона)`, key: "season_short" }];
  }
  return [{ label: "1 месяц", key: "1m" }, { label: `На весь сезон (${daysLeft} дн.)`, key: "season" }];
}

const cases: ShopItem[] = [
  { name: "Кейс с Донатом", price: 49, color: "#a78bfa", desc: "Шанс получить привилегию или кусочки!", icon: "Gift" },
  { name: "Кейс с Кусочками", price: 19, color: "#eab308", desc: "Случайное количество кусочков.", icon: "Coins" },
  { name: "Тайник с Отмычками", price: 9, color: "#60a5fa", desc: "Случайная отмычка для кейсов.", icon: "Key" },
  { name: "Всё или Харрибо", price: 1, color: "#fb923c", desc: "Рискни всем! Джекпот или ничего.", icon: "Dices" },
];

const otherItems: ShopItem[] = [
  { name: "Разбан", price: 199, color: "#ef4444", desc: "Снятие блокировки аккаунта на сервере.", icon: "ShieldOff" },
  { name: "Кастомный Титул", price: 99, color: "#a78bfa", desc: "Уникальный титул рядом с ником в чате.", icon: "Tag" },
  { name: "Передача привилегии", price: 149, color: "#22d3ee", desc: "Перенеси привилегию на другой аккаунт.", icon: "ArrowLeftRight" },
  { name: "Доп. точка дома", price: 49, color: "#38bdf8", desc: "+1 дополнительная точка /sethome.", icon: "Home" },
  { name: "Цветной чат", price: 79, color: "#f472b6", desc: "Возможность писать цветными сообщениями.", icon: "Palette" },
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
            ? "radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <img
        src="https://cdn.poehali.dev/projects/734d0079-141f-458f-a592-69a0f49a5cd1/bucket/9beef907-3885-4225-a29e-faa21f776214.png"
        alt="MineShovel 3D"
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
        style={{
          filter: hover
            ? "drop-shadow(0 0 40px rgba(34,211,238,0.5))"
            : "drop-shadow(0 0 25px rgba(59,130,246,0.35))",
          transition: "filter 0.5s ease"
        }}
      />
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
      <span className="font-russo text-sm text-ms-blue-bright tracking-wider">
        {copied ? "Скопировано!" : ip}
      </span>
      <Icon name={copied ? "Check" : "Copy"} size={14} className={copied ? "text-green-400" : "text-gray-500 group-hover:text-ms-blue-bright transition-colors"} />
    </button>
  );
};

const PurchaseModal = ({
  state,
  setState,
  onClose,
}: {
  state: PurchaseState;
  setState: (s: PurchaseState | null) => void;
  onClose: () => void;
}) => {
  const [error, setError] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  const { createPayment, isLoading } = useYookassa({
    apiUrl: YOOKASSA_API,
    onError: (err) => setError(err.message),
  });

  const finalPrice = useMemo(() => {
    let p = state.price;
    if (state.promoDiscount > 0) {
      p = Math.round(p * (1 - state.promoDiscount / 100));
    }
    return Math.max(1, p);
  }, [state.price, state.promoDiscount]);

  const handleNext = () => {
    if (state.step === 1 && state.type === "privilege" && !state.duration) {
      setError("Выберите срок");
      return;
    }
    setError("");
    setState({ ...state, step: state.step + 1 });
  };

  const handleBack = () => {
    setError("");
    setState({ ...state, step: state.step - 1 });
  };

  const handleApplyPromo = () => {
    const code = state.promoCode.trim().toUpperCase();
    if (code === "SHOVEL10") {
      setState({ ...state, promoDiscount: 10 });
      setError("");
    } else if (code === "MINESHOVEL") {
      setState({ ...state, promoDiscount: 15 });
      setError("");
    } else if (code === "SPRING2026") {
      setState({ ...state, promoDiscount: 20 });
      setError("");
    } else {
      setError("Промокод не найден");
    }
  };

  const handlePurchase = async () => {
    if (!state.nickname.trim()) { setError("Введите ник"); return; }
    if (!state.email.trim() || !isValidEmail(state.email)) { setError("Введите корректный email"); return; }
    setError("");

    const desc = state.type === "privilege"
      ? `${state.name} (${state.duration}) — ${state.nickname}`
      : `${state.name} — ${state.nickname}`;

    const response = await createPayment({
      amount: finalPrice,
      userEmail: state.email,
      userName: state.nickname,
      description: desc,
      returnUrl: RETURN_URL,
      cartItems: [{ id: state.name, name: state.name, price: finalPrice, quantity: 1 }],
    });

    if (response?.payment_url) {
      setState({
        ...state,
        step: 3,
        orderId: response.payment_id,
        orderNumber: response.order_number,
      });
      setTimeout(() => openPaymentPage(response.payment_url), 1500);
    }
  };

  const grad = `linear-gradient(135deg, ${state.color}, ${state.colorRight || state.color})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full" style={{ background: grad }} />

        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white cursor-pointer transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-8 h-1 rounded-full transition-all duration-300 ${state.step >= s ? "opacity-100" : "opacity-20"}`}
                    style={{ background: state.step >= s ? grad : "#334155" }} />
                ))}
              </div>
            </div>

            <div className="font-russo text-lg text-white mb-0.5">Шаг {state.step}</div>
            <div className="text-gray-500 text-sm mb-5">
              {state.step === 1 && (state.type === "privilege" ? "Выберите срок" : "Описание товара")}
              {state.step === 2 && "Заполните данные"}
              {state.step === 3 && "Ожидание оплаты"}
            </div>

            {state.step === 1 && state.type === "privilege" && state.durations && (
              <div className="space-y-2.5">
                {state.durations.map(d => (
                  <button
                    key={d.key}
                    onClick={() => { setState({ ...state, duration: d.label }); setError(""); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      state.duration === d.label
                        ? "border-opacity-60 bg-opacity-10"
                        : "border-ms-border/50 bg-ms-dark hover:border-opacity-30"
                    }`}
                    style={{
                      borderColor: state.duration === d.label ? state.color : undefined,
                      background: state.duration === d.label ? `${state.color}10` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        state.duration === d.label ? "" : "border-gray-600"
                      }`} style={{ borderColor: state.duration === d.label ? state.color : undefined }}>
                        {state.duration === d.label && (
                          <div className="w-2 h-2 rounded-full" style={{ background: state.color }} />
                        )}
                      </div>
                      <span className="font-russo text-sm text-white">{d.label}</span>
                    </div>
                  </button>
                ))}

                <button
                  onClick={handleNext}
                  disabled={!state.duration}
                  className="mt-4 w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: grad }}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            )}

            {state.step === 1 && state.type === "item" && (
              <div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{state.desc}</p>
                <div className="font-russo text-2xl mb-4" style={{ color: state.color }}>{state.price} ₽</div>
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300"
                  style={{ background: grad }}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            )}

            {state.step === 2 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={state.nickname}
                    onChange={(e) => setState({ ...state, nickname: e.target.value })}
                    placeholder="Никнейм"
                    className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                    style={{ borderColor: state.nickname ? `${state.color}40` : undefined }}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) => setState({ ...state, email: e.target.value })}
                    placeholder="Электронная почта"
                    className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                    style={{ borderColor: state.email ? `${state.color}40` : undefined }}
                  />
                </div>

                {!showPromo ? (
                  <button onClick={() => setShowPromo(true)} className="text-gray-500 text-xs underline cursor-pointer hover:text-gray-300 transition-colors">
                    У меня есть промокод
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={state.promoCode}
                      onChange={(e) => setState({ ...state, promoCode: e.target.value })}
                      placeholder="Промокод"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 rounded-xl font-russo text-xs text-white cursor-pointer hover:brightness-110 transition-all"
                      style={{ background: `${state.color}40` }}
                    >
                      OK
                    </button>
                  </div>
                )}

                {state.promoDiscount > 0 && (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Icon name="BadgeCheck" size={14} />
                    Скидка {state.promoDiscount}% применена!
                  </div>
                )}

                <div className="mt-2">
                  <div className="text-gray-500 text-xs mb-2 tracking-wider">СПОСОБ ОПЛАТЫ</div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ms-blue/10 border border-ms-blue/30 cursor-default">
                      <Icon name="CreditCard" size={16} className="text-ms-blue-bright" />
                      <span className="text-sm text-white">Картой</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-400 text-sm">Итого:</span>
                  <div className="flex items-center gap-2">
                    {state.promoDiscount > 0 && (
                      <span className="text-gray-600 line-through text-sm">{state.price} ₽</span>
                    )}
                    <span className="font-russo text-xl text-white">{finalPrice} ₽</span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: grad }}
                >
                  {isLoading ? "Создаём платёж..." : "ОПЛАТИТЬ"}
                </button>

                <p className="text-center text-gray-600 text-[10px] leading-relaxed">
                  Продолжая вы автоматически соглашаетесь с условиями оферты.
                </p>
              </div>
            )}

            {state.step === 3 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse" style={{ background: `${state.color}15` }}>
                  <Icon name="Clock" size={28} style={{ color: state.color }} />
                </div>
                <div className="font-russo text-lg text-white mb-2">Ожидание оплаты</div>
                <div className="space-y-2 text-sm text-gray-400">
                  {state.orderNumber && <div>Заказ: <span className="text-white">#{state.orderNumber}</span></div>}
                  <div>Товар: <span className="text-white">{state.name}{state.duration ? ` (${state.duration})` : ""}</span></div>
                  <div>Оплата: <span className="text-white">Картой</span></div>
                  <div>Сумма: <span className="font-russo text-white">{finalPrice} ₽</span></div>
                </div>
                <p className="text-gray-600 text-xs mt-4">Вы будете перенаправлены на страницу оплаты...</p>
              </div>
            )}

            {error && (
              <div className="mt-3 text-red-400 text-xs flex items-center gap-1.5">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            {state.step === 2 && (
              <button onClick={handleBack} className="mt-4 flex items-center gap-1 text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">
                <Icon name="ChevronLeft" size={16} />
                Назад
              </button>
            )}
          </div>

          <div className="md:w-64 p-6 md:border-l border-t md:border-t-0 border-ms-border/30">
            <div className="font-russo text-lg mb-1" style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {state.name}
            </div>
            {state.duration && <div className="text-gray-400 text-xs mb-3">{state.duration}</div>}

            {state.features && state.features.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {state.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Icon name="Check" size={12} className="mt-0.5 flex-shrink-0" style={{ color: state.color }} />
                    <span className="text-gray-400 text-xs leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {state.type === "item" && (
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{state.desc}</p>
            )}
          </div>
        </div>
      </div>
    </div>
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
        if (data.online) {
          setIsOnline(true);
          setOnline(data.players?.online ?? 0);
          setMaxPlayers(data.players?.max ?? 500);
        } else {
          setIsOnline(false);
          setOnline(null);
        }
      } catch {
        setIsOnline(false);
        setOnline(null);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { online, maxPlayers, isOnline };
};

const Index = () => {
  const [activeNav, setActiveNav] = useState("hero");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [donateTab, setDonateTab] = useState<DonateTab>("privileges");
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const [purchaseState, setPurchaseState] = useState<PurchaseState | null>(null);

  const { online, maxPlayers, isOnline } = useServerStatus();

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

  const currencyPrice = Math.round(currencyAmount / 10);

  const openPrivilegePurchase = (priv: Privilege) => {
    const durations = priv.name === "Spring" ? getSpringDurations() : priv.durations;
    setPurchaseState({
      step: 1, type: "privilege", name: priv.name, desc: priv.desc,
      features: priv.features, color: priv.colorLeft, colorRight: priv.colorRight,
      price: 0, duration: undefined, durations, nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
    });
  };

  const openItemPurchase = (item: ShopItem) => {
    setPurchaseState({
      step: 1, type: "item", name: item.name, desc: item.desc,
      color: item.color, price: item.price, nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
    });
  };

  return (
    <div className="relative min-h-screen bg-ms-bg bg-grid">
      <ParticleBg />

      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)" }}
      />

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
            <CopyIP ip={MC_SERVER_IP} />
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
              <div className="pt-3"><CopyIP ip={MC_SERVER_IP} /></div>
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
              <CopyIP ip={MC_SERVER_IP} />
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
          <h2 className="font-russo text-4xl md:text-5xl text-white">О СЕРВЕРЕ</h2>
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

        {donateTab === "privileges" && (
          <div>
            <p className="text-center text-gray-500 text-sm mb-8">Нажми на привилегию, чтобы узнать подробнее и купить</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {privileges.map((priv, i) => (
                <div
                  key={priv.name}
                  className="priv-card glass-card rounded-2xl overflow-hidden opacity-0-init animate-fade-in cursor-pointer group"
                  style={{ animationDelay: `${i * 0.06}s`, borderColor: `${priv.colorLeft}20` }}
                  onClick={() => openPrivilegePurchase(priv)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.colorLeft}40`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.colorLeft}20`; }}
                >
                  <div className="h-1.5 w-full transition-all duration-500 group-hover:h-2" style={{ background: `linear-gradient(90deg, ${priv.colorLeft}, ${priv.colorRight})` }} />
                  <div className="p-4 text-center">
                    <span
                      className="font-russo text-base group-hover:scale-105 transition-transform duration-300 inline-block"
                      style={{ background: `linear-gradient(135deg, ${priv.colorLeft}, ${priv.colorRight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      {priv.name}
                    </span>
                    <div className="mt-2">
                      <Icon name="ChevronRight" size={14} className="text-gray-600 group-hover:text-white transition-colors inline" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  className="w-full h-3 rounded-full appearance-none cursor-pointer slider-round"
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
                onClick={() => openItemPurchase({ name: `${currencyAmount} кусочков`, price: currencyPrice, color: "#eab308", desc: `Покупка ${currencyAmount} кусочков — внутриигровой донат-валюты.`, icon: "Coins" })}
                className="mt-6 w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-black cursor-pointer bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] transition-all duration-300"
              >
                КУПИТЬ {currencyAmount} КУСОЧКОВ
              </button>
              <p className="text-center text-gray-600 text-xs mt-4">10 кусочков = 1 ₽</p>
            </div>
          </div>
        )}

        {donateTab === "cases" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cases.map((c, i) => (
              <div
                key={c.name}
                className="glass-card rounded-2xl p-5 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s`, borderColor: `${c.color}20` }}
                onClick={() => openItemPurchase(c)}
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
                  <Icon name={c.icon} size={26} style={{ color: c.color }} />
                </div>
                <div className="font-russo text-base text-white mb-1 group-hover:text-ms-blue-bright transition-colors">{c.name}</div>
                <div className="font-russo text-lg mt-2" style={{ color: c.color }}>{c.price} ₽</div>
              </div>
            ))}
          </div>
        )}

        {donateTab === "other" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherItems.map((item, i) => (
              <div
                key={item.name}
                className="glass-card rounded-2xl p-5 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s`, borderColor: `${item.color}20` }}
                onClick={() => openItemPurchase(item)}
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
                <div className="font-russo text-lg mt-2" style={{ color: item.color }}>{item.price} ₽</div>
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
          <div className="glass-card rounded-2xl p-8 status-glow transition-all duration-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center">
                <Icon name="Swords" size={20} className="text-ms-blue-bright" />
              </div>
              <div>
                <div className="font-russo text-xl text-white">Омега Анархия</div>
                <div className="text-xs text-gray-500">Основной режим</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-400 status-blink" : "bg-red-400"}`}
                  style={{ boxShadow: isOnline ? "0 0 8px rgba(74,222,128,0.6)" : "0 0 8px rgba(248,113,113,0.6)" }} />
                <span className={`text-sm font-medium ${isOnline ? "text-green-400" : "text-red-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-ms-blue/30 transition-all duration-300 cursor-default">
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
            </div>

            <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 hover:border-ms-blue/30 transition-all duration-300">
              <div className="text-gray-500 text-xs mb-2 tracking-wider">IP СЕРВЕРА</div>
              <CopyIP ip={MC_SERVER_IP} />
            </div>
          </div>
        </div>
      </section>

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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ms-dark border border-ms-border/50 hover:border-gray-400/40 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(156,163,175,0.1)] transition-all duration-300 group cursor-pointer">
                <Icon name="Mail" size={16} className="text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">Почта</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ms-border/20 text-center">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} MineShovel. Все права защищены. Не является публичной офертой.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
