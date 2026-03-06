export const YOOKASSA_API = "https://functions.poehali.dev/3f8d6504-ce50-4afb-8d89-4fa22dc94b3a";
export const RETURN_URL = window.location.origin + "/?payment=success";
export const MC_SERVER_IP = "mc.mineshovel.ru";
export const BTN_COLOR = "#23BEFC";

export interface Privilege {
  name: string;
  colorLeft: string;
  colorRight: string;
  desc: string;
  features: string[];
  durations: { label: string; key: string }[];
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
  durations?: { label: string; key: string }[];
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
    features: ["Префикс [Midnight] в чате", "Доступ к /kit midnight", "3 точки дома /sethome", "Цветной ник /nick"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Exotic",
    colorLeft: "#FC30FF", colorRight: "#FF73DF",
    desc: "Экзотические возможности и яркий стиль.",
    features: ["Префикс [Exotic] в чате", "Доступ к /kit exotic", "5 точек дома", "/fly в своих чанках", "Авто-шахта x2 скорость"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Atomic",
    colorLeft: "#8AFF00", colorRight: "#B1FF57",
    desc: "Атомная мощь и усиленные привилегии.",
    features: ["Префикс [Atomic] в чате", "Доступ к /kit atomic (зачарованная броня)", "8 точек дома", "/heal раз в 10 минут", "/back после смерти"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Warden",
    colorLeft: "#FF9E1E", colorRight: "#FFD76B",
    desc: "Страж подземелий с мощными бонусами.",
    features: ["Префикс [Warden] в чате", "/kit warden (полный незерит)", "12 точек дома", "/fly везде", "/heal раз в 5 минут", "/ec — эндер сундук"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Noris",
    colorLeft: "#FF6969", colorRight: "#FF8F62",
    desc: "Неудержимая сила и продвинутые команды.",
    features: ["Префикс [Noris] в чате", "/kit noris (кастомное оружие)", "20 точек дома", "/god на 60 сек (раз в час)", "/feed без кулдауна", "Приоритетный вход"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Chrona",
    colorLeft: "#A8D1FF", colorRight: "#CB84FF",
    desc: "Повелитель времени с уникальными способностями.",
    features: ["Префикс [Chrona] в чате", "/kit chrona (легендарное оружие)", "30 точек дома", "/god на 2 мин (раз в 30 мин)", "/craft — верстак", "x3 скорость авто-шахты"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Briz",
    colorLeft: "#FF7324", colorRight: "#FF4E2C",
    desc: "Огненный ветер — элитная привилегия.",
    features: ["Префикс [Briz] в чате", "/kit briz (мифическое снаряжение)", "50 точек дома", "/god на 5 минут", "Все команды предыдущих", "Уникальная анимация входа", "/pwarp"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Shovel",
    colorLeft: "#00FF3B", colorRight: "#00FFA2",
    desc: "Легендарная привилегия с максимальными возможностями.",
    features: ["Префикс [Shovel] в чате", "/kit shovel (божественное снаряжение)", "Безлимит точек дома", "/god без ограничений", "Кастомный тег над ником", "Доступ к тестовым механикам", "Роль Shovel в Discord", "x10 авто-шахта"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "3 месяца", key: "3m" }, { label: "Навсегда", key: "forever" }],
  },
  {
    name: "Spring",
    colorLeft: "#E2FF34", colorRight: "#FFF332",
    desc: "Сезонная весенняя привилегия с уникальными весенними бонусами.",
    features: ["Весенний префикс [Spring]", "Сезонный /kit spring", "Уникальные весенние частицы", "Весенний ивент-бонус x2", "Эксклюзивный скин"],
    durations: [],
  },
  {
    name: "Кастомка",
    colorLeft: "#FFEF5B", colorRight: "#FFA352",
    desc: "Создай свою уникальную привилегию! Кастомный префикс и настройки.",
    features: ["Свой уникальный префикс", "Выбор цвета ника", "Кастомный /kit", "Персональная настройка"],
    durations: [{ label: "1 месяц", key: "1m" }, { label: "2 месяца", key: "2m" }, { label: "3 месяца", key: "3m" }],
  },
];

export function getSpringDurations(): { label: string; key: string }[] {
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

export const cases: ShopItem[] = [
  { name: "Кейс с Донатом", price: 49, color: "#a78bfa", desc: "Шанс получить привилегию или кусочки!", icon: "Gift" },
  { name: "Кейс с Кусочками", price: 19, color: "#eab308", desc: "Случайное количество кусочков.", icon: "Coins" },
  { name: "Тайник с Отмычками", price: 9, color: "#60a5fa", desc: "Случайная отмычка для кейсов.", icon: "Key" },
  { name: "Всё или Харрибо", price: 1, color: "#fb923c", desc: "Рискни всем! Джекпот или ничего.", icon: "Dices" },
];

export const otherItems: ShopItem[] = [
  { name: "Разбан", price: 199, color: "#ef4444", desc: "Снятие блокировки аккаунта на сервере.", icon: "ShieldOff" },
  { name: "Кастомный Титул", price: 99, color: "#a78bfa", desc: "Уникальный титул рядом с ником в чате.", icon: "Tag" },
  { name: "Передача привилегии", price: 149, color: "#22d3ee", desc: "Перенеси привилегию на другой аккаунт.", icon: "ArrowLeftRight" },
  { name: "Доп. точка дома", price: 49, color: "#38bdf8", desc: "+1 дополнительная точка /sethome.", icon: "Home" },
  { name: "Цветной чат", price: 79, color: "#f472b6", desc: "Возможность писать цветными сообщениями.", icon: "Palette" },
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
