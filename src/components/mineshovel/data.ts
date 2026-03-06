export const YOOKASSA_API = "https://functions.poehali.dev/3f8d6504-ce50-4afb-8d89-4fa22dc94b3a";
export const RETURN_URL = window.location.origin + "/?payment=success";
export const MC_SERVER_IP = "mc.mineshovel.ru";
export const BTN_COLOR = "#23BEFC";

export interface Duration {
  label: string;
  key: string;
  price: number;
}

export interface Privilege {
  name: string;
  colorLeft: string;
  colorRight: string;
  desc: string;
  features: string[];
  durations: Duration[];
  icon: string;
}

export interface ShopItem {
  name: string;
  price: number;
  color: string;
  desc: string;
  icon: string;
}

export interface PurchaseState {
  step: number;
  type: "privilege" | "item";
  name: string;
  desc: string;
  features?: string[];
  color: string;
  colorRight?: string;
  price: number;
  duration?: string;
  durations?: Duration[];
  nickname: string;
  email: string;
  promoCode: string;
  promoDiscount: number;
  orderId?: string;
  orderNumber?: string;
}

export const privileges: Privilege[] = [
  {
    name: "Midnight",
    colorLeft: "#FFC917", colorRight: "#E0FF1C",
    desc: "Начальная привилегия с базовыми бонусами для старта.",
    icon: "Moon",
    features: ["Префикс [Midnight] в чате", "Доступ к /kit midnight", "3 точки дома /sethome", "Цветной ник /nick"],
    durations: [{ label: "1 месяц", key: "1m", price: 18 }, { label: "3 месяца", key: "3m", price: 28 }, { label: "Навсегда", key: "forever", price: 38 }],
  },
  {
    name: "Exotic",
    colorLeft: "#FC30FF", colorRight: "#FF73DF",
    desc: "Экзотические возможности и яркий стиль.",
    icon: "Sparkles",
    features: ["Префикс [Exotic] в чате", "Доступ к /kit exotic", "5 точек дома", "/fly в своих чанках", "Авто-шахта x2 скорость"],
    durations: [{ label: "1 месяц", key: "1m", price: 32 }, { label: "3 месяца", key: "3m", price: 52 }, { label: "Навсегда", key: "forever", price: 72 }],
  },
  {
    name: "Atomic",
    colorLeft: "#8AFF00", colorRight: "#B1FF57",
    desc: "Атомная мощь и усиленные привилегии.",
    icon: "Atom",
    features: ["Префикс [Atomic] в чате", "Доступ к /kit atomic (зачарованная броня)", "8 точек дома", "/heal раз в 10 минут", "/back после смерти"],
    durations: [{ label: "1 месяц", key: "1m", price: 48 }, { label: "3 месяца", key: "3m", price: 70 }, { label: "Навсегда", key: "forever", price: 84 }],
  },
  {
    name: "Warden",
    colorLeft: "#FF9E1E", colorRight: "#FFD76B",
    desc: "Страж подземелий с мощными бонусами.",
    icon: "Shield",
    features: ["Префикс [Warden] в чате", "/kit warden (полный незерит)", "12 точек дома", "/fly везде", "/heal раз в 5 минут", "/ec — эндер сундук"],
    durations: [{ label: "1 месяц", key: "1m", price: 74 }, { label: "3 месяца", key: "3m", price: 90 }, { label: "Навсегда", key: "forever", price: 114 }],
  },
  {
    name: "Noris",
    colorLeft: "#FF6969", colorRight: "#FF8F62",
    desc: "Неудержимая сила и продвинутые команды.",
    icon: "Flame",
    features: ["Префикс [Noris] в чате", "/kit noris (кастомное оружие)", "20 точек дома", "/god на 60 сек (раз в час)", "/feed без кулдауна", "Приоритетный вход"],
    durations: [{ label: "1 месяц", key: "1m", price: 98 }, { label: "3 месяца", key: "3m", price: 118 }, { label: "Навсегда", key: "forever", price: 138 }],
  },
  {
    name: "Chrona",
    colorLeft: "#A8D1FF", colorRight: "#CB84FF",
    desc: "Повелитель времени с уникальными способностями.",
    icon: "Clock",
    features: ["Префикс [Chrona] в чате", "/kit chrona (легендарное оружие)", "30 точек дома", "/god на 2 мин (раз в 30 мин)", "/craft — верстак", "x3 скорость авто-шахты"],
    durations: [{ label: "1 месяц", key: "1m", price: 114 }, { label: "3 месяца", key: "3m", price: 138 }, { label: "Навсегда", key: "forever", price: 178 }],
  },
  {
    name: "Briz",
    colorLeft: "#FF7324", colorRight: "#FF4E2C",
    desc: "Огненный ветер — элитная привилегия.",
    icon: "Wind",
    features: ["Префикс [Briz] в чате", "/kit briz (мифическое снаряжение)", "50 точек дома", "/god на 5 минут", "Все команды предыдущих", "Уникальная анимация входа", "/pwarp"],
    durations: [{ label: "1 месяц", key: "1m", price: 134 }, { label: "3 месяца", key: "3m", price: 178 }, { label: "Навсегда", key: "forever", price: 218 }],
  },
  {
    name: "Shovel",
    colorLeft: "#00FF3B", colorRight: "#00FFA2",
    desc: "Легендарная привилегия с максимальными возможностями.",
    icon: "Shovel",
    features: ["Префикс [Shovel] в чате", "/kit shovel (божественное снаряжение)", "Безлимит точек дома", "/god без ограничений", "Кастомный тег над ником", "Доступ к тестовым механикам", "Роль Shovel в Discord", "x10 авто-шахта"],
    durations: [{ label: "1 месяц", key: "1m", price: 218 }, { label: "3 месяца", key: "3m", price: 438 }, { label: "Навсегда", key: "forever", price: 658 }],
  },
  {
    name: "Spring",
    colorLeft: "#E2FF34", colorRight: "#FFF332",
    desc: "Сезонная весенняя привилегия с уникальными весенними бонусами.",
    icon: "Flower2",
    features: ["Весенний префикс [Spring]", "Сезонный /kit spring", "Уникальные весенние частицы", "Весенний ивент-бонус x2", "Эксклюзивный скин"],
    durations: [],
  },
  {
    name: "Кастомка",
    colorLeft: "#FFEF5B", colorRight: "#FFA352",
    desc: "Создай свою уникальную привилегию! Кастомный префикс и настройки.",
    icon: "Paintbrush",
    features: ["Свой уникальный префикс", "Выбор цвета ника", "Кастомный /kit", "Персональная настройка"],
    durations: [{ label: "1 месяц", key: "1m", price: 899 }, { label: "3 месяца", key: "3m", price: 1299 }, { label: "Навсегда", key: "forever", price: 1699 }],
  },
];

export function getSpringDurations(): Duration[] {
  const now = new Date();
  const springEnd = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
  if (now > springEnd) {
    return [{ label: "1 месяц", key: "1m", price: 599 }, { label: "На весь сезон", key: "season", price: 899 }];
  }
  const daysLeft = Math.ceil((springEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 30) {
    return [{ label: `${daysLeft} дн. (до конца сезона)`, key: "season_short", price: 599 }];
  }
  return [{ label: "1 месяц", key: "1m", price: 599 }, { label: `На весь сезон (${daysLeft} дн.)`, key: "season", price: 899 }];
}

export const cases: ShopItem[] = [
  { name: "Кейс с Донатом", price: 49, color: "#a78bfa", desc: "Шанс получить привилегию до Shovel или кусочки!", icon: "Gift" },
  { name: "Кейс с Кусочками", price: 19, color: "#eab308", desc: "Рандомное количество кусочков.", icon: "Coins" },
  { name: "Тайник с Отмычками", price: 9, color: "#60a5fa", desc: "Любой ключ на 1 из тайников.", icon: "Key" },
  { name: "Всё или Харрибо", price: 1, color: "#fb923c", desc: "Рискни! Выбей привилегию Харрибо или ничего.", icon: "Dices" },
];

export const otherItems: ShopItem[] = [
  { name: "Разбан", price: 199, color: "#ef4444", desc: "Снятие блокировки аккаунта на сервере.", icon: "ShieldOff" },
  { name: "Размут", price: 99, color: "#f59e0b", desc: "Снятие мута (блокировки чата) на сервере.", icon: "MessageCircleOff" },
  { name: "Щавель-Пасс", price: 199, color: "#22d3ee", desc: "Премиум-подписка на 1 месяц. Уникальные бонусы и доступ к эксклюзивному контенту.", icon: "Star" },
];

export type DonateTab = "privileges" | "currency" | "cases" | "other";

export const donateTabs: { id: DonateTab; label: string; icon: string }[] = [
  { id: "privileges", label: "Привилегии", icon: "Crown" },
  { id: "currency", label: "Кусочки", icon: "Coins" },
  { id: "cases", label: "Кейсы", icon: "Box" },
  { id: "other", label: "Другое", icon: "Settings" },
];

export const navItems = [
  { id: "hero", label: "Главная" },
  { id: "donate", label: "Донат" },
  { id: "status", label: "Статус" },
];
