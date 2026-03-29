export const YOOKASSA_API =
  "https://functions.poehali.dev/3f8d6504-ce50-4afb-8d89-4fa22dc94b3a";
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
  rconCommands?: Record<string, string>;
  detailedDesc?: string;
}

export interface ShopItem {
  name: string;
  price: number;
  color: string;
  desc: string;
  icon: string;
  rconCommand?: string;
  excludeFromHolidayDiscount?: boolean;
  excludeFromPromoDiscount?: boolean;
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
  durationKey?: string;
  durations?: Duration[];
  nickname: string;
  email: string;
  promoCode: string;
  promoDiscount: number;
  orderId?: string;
  orderNumber?: string;
  icon?: string;
  detailedDesc?: string;
  holidayDiscount?: number;
}

// =============================================================================
// SEASONAL SYSTEM
// =============================================================================

interface SeasonConfig {
  name: string;
  icon: string;
  colorLeft: string;
  colorRight: string;
  desc: string;
  kitName: string;
  features: string[];
  rconName: string;
}

const SEASONS: Record<string, SeasonConfig> = {
  spring: {
    name: "Spring",
    icon: "Flower2",
    colorLeft: "#E2FF34",
    colorRight: "#FFF332",
    desc: "Сезонная весенняя привилегия с уникальными бонусами.",
    kitName: "spring",
    features: [
      "Весенний префикс [Spring]",
      "Сезонный /kit spring",
      "Уникальные весенние частицы",
      "Весенний ивент-бонус x2",
      "Эксклюзивный скин",
    ],
    rconName: "season",
  },
  summer: {
    name: "Summer",
    icon: "Sun",
    colorLeft: "#00FF6A",
    colorRight: "#00CC55",
    desc: "Сезонная летняя привилегия с уникальными летними бонусами.",
    kitName: "summer",
    features: [
      "Летний префикс [Summer]",
      "Сезонный /kit summer",
      "Уникальные летние частицы",
      "Летний ивент-бонус x2",
      "Эксклюзивный скин",
    ],
    rconName: "season",
  },
  autumn: {
    name: "Autumn",
    icon: "Leaf",
    colorLeft: "#FF8C00",
    colorRight: "#FFB347",
    desc: "Сезонная осенняя привилегия с уникальными осенними бонусами.",
    kitName: "autumn",
    features: [
      "Осенний префикс [Autumn]",
      "Сезонный /kit autumn",
      "Уникальные осенние частицы",
      "Осенний ивент-бонус x2",
      "Эксклюзивный скин",
    ],
    rconName: "season",
  },
  winter: {
    name: "Frozen",
    icon: "Snowflake",
    colorLeft: "#00BFFF",
    colorRight: "#87CEEB",
    desc: "Сезонная зимняя привилегия с уникальными зимними бонусами.",
    kitName: "frozen",
    features: [
      "Зимний префикс [Frozen]",
      "Сезонный /kit frozen",
      "Уникальные зимние частицы",
      "Зимний ивент-бонус x2",
      "Эксклюзивный скин",
    ],
    rconName: "season",
  },
};

export function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getSeasonConfig(): SeasonConfig {
  return SEASONS[getCurrentSeason()];
}

export function getSeasonEndDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (month >= 2 && month <= 4) return new Date(year, 4, 31, 23, 59, 59);
  if (month >= 5 && month <= 7) return new Date(year, 7, 31, 23, 59, 59);
  if (month >= 8 && month <= 10) return new Date(year, 10, 30, 23, 59, 59);
  if (month <= 1) return new Date(year, 1, 28, 23, 59, 59);
  return new Date(year + 1, 1, 28, 23, 59, 59);
}

export function getSeasonDaysLeft(): number {
  const end = getSeasonEndDate();
  const now = new Date();
  return Math.max(
    1,
    Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function getSeasonalDurations(): Duration[] {
  const daysLeft = getSeasonDaysLeft();
  if (daysLeft < 30) {
    return [
      {
        label: `${daysLeft} дн. (до конца сезона)`,
        key: "season_short",
        price: 599,
      },
    ];
  }
  return [
    { label: "1 месяц", key: "1m", price: 599 },
    { label: `На весь сезон (${daysLeft} дн.)`, key: "season", price: 899 },
  ];
}

export function getSeasonalPrivilege(): Privilege {
  const config = getSeasonConfig();
  const daysLeft = getSeasonDaysLeft();
  return {
    name: config.name,
    colorLeft: config.colorLeft,
    colorRight: config.colorRight,
    desc: config.desc,
    icon: config.icon,
    features: config.features,
    durations: [],
    detailedDesc: `◆ Команды:\n/kit ${config.kitName} — кит привилегии\n/emitingtable — улучшить снаряжение\n/${config.kitName} — интересные фишки привилегии\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 8\nприватов: 4\nточки дома: 7`,
    rconCommands: {
      "1m": `lp user {user} parent addtemp season 30d`,
      season: `lp user {user} parent addtemp season ${daysLeft}d`,
      season_short: `lp user {user} parent addtemp season ${daysLeft}d`,
    },
  };
}

// =============================================================================
// HOLIDAY DISCOUNT SYSTEM
// =============================================================================

interface HolidayDiscount {
  name: string;
  discount: number;
  isActive: boolean;
  daysUntil: number;
  endDate?: Date;
}

export function getActiveHolidayDiscount(): HolidayDiscount | null {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if ((month === 11 && day >= 31) || (month === 0 && day <= 1)) {
    return {
      name: "Новый год",
      discount: 30,
      isActive: true,
      daysUntil: 0,
      endDate: new Date(
        month === 11 ? now.getFullYear() + 1 : now.getFullYear(),
        0,
        2,
      ),
    };
  }

  if ((month === 9 && day === 31) || (month === 10 && day <= 2)) {
    return {
      name: "Хеллоуин",
      discount: 30,
      isActive: true,
      daysUntil: 0,
      endDate: new Date(now.getFullYear(), 10, 3),
    };
  }

  if (month === 1 && day === 23) {
    return {
      name: "День защитника Отечества",
      discount: 30,
      isActive: true,
      daysUntil: 0,
      endDate: new Date(now.getFullYear(), 1, 24),
    };
  }

  if (month === 2 && day === 8) {
    return {
      name: "Международный женский день",
      discount: 30,
      isActive: true,
      daysUntil: 0,
      endDate: new Date(now.getFullYear(), 2, 9),
    };
  }

  return null;
}

export function getNextHoliday(): { name: string; daysUntil: number } | null {
  const now = new Date();
  const year = now.getFullYear();

  const holidays = [
    { name: "День защитника Отечества", date: new Date(year, 1, 23) },
    { name: "Международный женский день", date: new Date(year, 2, 8) },
    { name: "Хеллоуин", date: new Date(year, 9, 31) },
    { name: "Новый год", date: new Date(year, 11, 31) },
    { name: "День защитника Отечества", date: new Date(year + 1, 1, 23) },
    { name: "Международный женский день", date: new Date(year + 1, 2, 8) },
  ];

  for (const h of holidays) {
    const diff = Math.ceil(
      (h.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff > 0) {
      return { name: h.name, daysUntil: diff };
    }
  }
  return null;
}

// =============================================================================
// PRIVILEGES
// =============================================================================

export const privileges: Privilege[] = [
  {
    name: "Midnight",
    colorLeft: "#FFC917",
    colorRight: "#E0FF1C",
    desc: "Начальная привилегия с базовыми бонусами для старта.",
    icon: "Moon",
    features: [
      "Префикс [Midnight] в чате",
      "Доступ к /kit midnight",
      "3 точки дома /sethome",
      "Цветной ник /nick",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 18 },
      { label: "3 месяца", key: "3m", price: 28 },
      { label: "Навсегда", key: "forever", price: 38 },
    ],
    detailedDesc: `◆ Команды:\n/kit midnight — кит привилегии\n/recipe — узнать крафт предмета\n/loom — виртуальный ткацкий станок\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 3\nприватов: 4\nточки дома: 2`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp midnight 30d",
      "3m": "lp user {user} parent addtemp midnight 90d",
      forever: "lp user {user} parent add midnight",
    },
  },
  {
    name: "Exotic",
    colorLeft: "#FC30FF",
    colorRight: "#FF73DF",
    desc: "Экзотические возможности и яркий стиль.",
    icon: "Sparkles",
    features: [
      "Префикс [Exotic] в чате",
      "Доступ к /kit exotic",
      "Виртуальный эндер-сундук /ec",
      "/feed — покормить себя",
      "/hat — надеть блок на голову",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 32 },
      { label: "3 месяца", key: "3m", price: 52 },
      { label: "Навсегда", key: "forever", price: 72 },
    ],
    detailedDesc: `◆ Команды:\n/kit exotic — кит привилегии\n/ec — виртуальный эндер-сундук\n/feed — покормить себя\n/hat — надеть блок на голову\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 4\nприватов: 4\nточки дома: 2`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp exotic 30d",
      "3m": "lp user {user} parent addtemp exotic 90d",
      forever: "lp user {user} parent add exotic",
    },
  },
  {
    name: "Atomic",
    colorLeft: "#8AFF00",
    colorRight: "#B1FF57",
    desc: "Атомная мощь и усиленные привилегии.",
    icon: "Atom",
    features: [
      "Префикс [Atomic] в чате",
      "Доступ к /kit atomic",
      "/craft — виртуальный верстак",
      "/ext — потушить себя",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 48 },
      { label: "3 месяца", key: "3m", price: 70 },
      { label: "Навсегда", key: "forever", price: 84 },
    ],
    detailedDesc: `◆ Команды:\n/kit atomic — кит привилегии\n/craft — виртуальный верстак\n/ext — потушить себя\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 4\nприватов: 4\nточки дома: 3`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp atomic 30d",
      "3m": "lp user {user} parent addtemp atomic 90d",
      forever: "lp user {user} parent add atomic",
    },
  },
  {
    name: "Warden",
    colorLeft: "#FF9E1E",
    colorRight: "#FFD76B",
    desc: "Страж подземелий с мощными бонусами.",
    icon: "Shield",
    features: [
      "Префикс [Warden] в чате",
      "/kit warden",
      "/ptime — личное время суток",
      "/clear — очистить инвентарь",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 74 },
      { label: "3 месяца", key: "3m", price: 90 },
      { label: "Навсегда", key: "forever", price: 114 },
    ],
    detailedDesc: `◆ Команды:\n/kit warden — кит привилегии\n/ptime — личное время суток\n/clear — очистить себе инвентарь\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 5\nприватов: 4\nточки дома: 4`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp warden 30d",
      "3m": "lp user {user} parent addtemp warden 90d",
      forever: "lp user {user} parent add warden",
    },
  },
  {
    name: "Noris",
    colorLeft: "#FF6969",
    colorRight: "#FF8F62",
    desc: "Неудержимая сила и продвинутые команды.",
    icon: "Flame",
    features: [
      "Префикс [Noris] в чате",
      "/kit noris",
      "/repair — починить предмет",
      "/heal — пополнить здоровье",
      "/near — найти игрока",
      "/rtp player — ТП к случайному игроку",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 98 },
      { label: "3 месяца", key: "3m", price: 118 },
      { label: "Навсегда", key: "forever", price: 138 },
    ],
    detailedDesc: `◆ Команды:\n/kit noris — кит привилегии\n/repair — починить один предмет\n/heal — пополнить здоровье\n/near — найти игрока возле себя\n/rtp player — телепортация к случайному игроку\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 5\nприватов: 4\nточки дома: 4`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp noris 30d",
      "3m": "lp user {user} parent addtemp noris 90d",
      forever: "lp user {user} parent add noris",
    },
  },
  {
    name: "Chrona",
    colorLeft: "#A8D1FF",
    colorRight: "#CB84FF",
    desc: "Повелитель времени с уникальными способностями.",
    icon: "Clock",
    features: [
      "Префикс [Chrona] в чате",
      "/kit chrona",
      "/trash — виртуальная мусорка",
      "/back — предыдущая ТП",
      "/grindstone — снятие зачарований",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 114 },
      { label: "3 месяца", key: "3m", price: 138 },
      { label: "Навсегда", key: "forever", price: 178 },
    ],
    detailedDesc: `◆ Команды:\n/kit chrona — кит привилегии\n/trash — виртуальная мусорка\n/back — предыдущая точка телепортации\n/grindstone — снятие зачарований\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 6\nприватов: 4\nточки дома: 5`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp chrona 30d",
      "3m": "lp user {user} parent addtemp chrona 90d",
      forever: "lp user {user} parent add chrona",
    },
  },
  {
    name: "Briz",
    colorLeft: "#FF7324",
    colorRight: "#FF4E2C",
    desc: "Огненный ветер — элитная привилегия.",
    icon: "Wind",
    features: [
      "Префикс [Briz] в чате",
      "/kit briz",
      "/suicide — самоубийство",
      "/bc — объявление в чате",
      "/stonecutter — виртуальный камнерез",
      "/rtp base — ТП к базам игроков",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 134 },
      { label: "3 месяца", key: "3m", price: 178 },
      { label: "Навсегда", key: "forever", price: 218 },
    ],
    detailedDesc: `◆ Команды:\n/kit briz — кит привилегии\n/suicide — самоубийство\n/bc — объявление в чате\n/stonecutter — виртуальный камнерез\n/rtp base — телепортация к базам игроков\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 6\nприватов: 4\nточки дома: 6`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp briz 30d",
      "3m": "lp user {user} parent addtemp briz 90d",
      forever: "lp user {user} parent add briz",
    },
  },
  {
    name: "Shovel",
    colorLeft: "#00FF3B",
    colorRight: "#00FFA2",
    desc: "Легендарная привилегия с максимальными возможностями.",
    icon: "Shovel",
    features: [
      "Префикс [Shovel] в чате",
      "/kit shovel",
      "/invsee — посмотреть инвентарь",
      "/rename — переименовать предмет",
      "/tempvote — мут игроку",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 218 },
      { label: "3 месяца", key: "3m", price: 438 },
      { label: "Навсегда", key: "forever", price: 658 },
    ],
    detailedDesc: `◆ Команды:\n/kit shovel — кит привилегии\n/invsee — посмотреть инвентарь игрока\n/rename — поменять название предмета\n/tempvote — выдать мут игроку на время\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 7\nприватов: 4\nточки дома: 6`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp shovel 30d",
      "3m": "lp user {user} parent addtemp shovel 90d",
      forever: "lp user {user} parent add shovel",
    },
  },
  {
    name: "Кастомка",
    colorLeft: "#FFEF5B",
    colorRight: "#FFA352",
    desc: "Создай свою уникальную привилегию! Кастомный префикс и настройки.",
    icon: "Paintbrush",
    features: [
      "Свой уникальный префикс",
      "Выбор цвета ника",
      "Кастомный /kit",
      "Персональная настройка",
    ],
    durations: [
      { label: "1 месяц", key: "1m", price: 899 },
      { label: "2 месяца", key: "2m", price: 1099 },
      { label: "3 месяца", key: "3m", price: 1299 },
    ],
    detailedDesc: `◆ Команды:\n/kit kactom — кит привилегии\n/nick — поменять себе ник в чате\nВсе команды предыдущих привилегий\n\n◆ Дополнительные возможности:\nслоты на аукционе: 8\nприватов: 4\nточки дома: 8`,
    rconCommands: {
      "1m": "lp user {user} parent addtemp custom 30d",
      "2m": "lp user {user} parent addtemp custom 60d",
      "3m": "lp user {user} parent addtemp custom 90d",
    },
  },
];

// =============================================================================
// CASES / OTHER ITEMS
// =============================================================================

export const cases: ShopItem[] = [
  {
    name: "Кейс с Донатом",
    price: 49,
    color: "#a78bfa",
    desc: "Из кейса с привилегиями ты гарантированно получаешь одну из следующих привилегий:\nSHOVEL, BRIZ, CHRONA, NORIS, WARDEN, ATOMIC, EXOTIC, MIDNIGHT\n\nВсе привилегии выдаются на срок от 30 дней.",
    icon: "Gift",
    rconCommand: "cubelets give {user} donate 1",
  },
  {
    name: "Кейс с Кусочками",
    price: 19,
    color: "#eab308",
    desc: "После открытия данного кейса, игрок гарантированно получает случайное количество кусочков.",
    icon: "Coins",
    rconCommand: "cubelets give {user} value 1",
  },
  {
    name: "Тайник с Отмычками",
    price: 9,
    color: "#60a5fa",
    desc: "После покупки данного товара — игроку гарантировано выдают отмычку к главному тайнику всех тайников.",
    icon: "Key",
    rconCommand: "cache give {user} holo5 1",
  },
  {
    name: "Всё или Харрибо",
    price: 1,
    color: "#fb923c",
    desc: "После открытия данного кейса, игрок имеет возможность выбить из кейса привилегию Харрибо, либо ничего.",
    icon: "Dices",
    rconCommand: "cubelets give {user} harribo 1",
    excludeFromHolidayDiscount: true,
    excludeFromPromoDiscount: true,
  },
];

export const otherItems: ShopItem[] = [
  {
    name: "Разбан",
    price: 199,
    color: "#ef4444",
    desc: "Снятие бана (блокировки) игроку на сервере.\nЕсли игрок присутствует в ЧСП проекта — разбан невозможен!",
    icon: "ShieldOff",
    rconCommand: "unban {user}",
    excludeFromHolidayDiscount: true,
  },
  {
    name: "Размут",
    price: 99,
    color: "#f59e0b",
    desc: "Снятие мута (блокировки чата) игроку на сервере.",
    icon: "MessageCircleOff",
    rconCommand: "unmute {user}",
    excludeFromHolidayDiscount: true,
  },
  {
    name: "Щавель-Пасс",
    price: 199,
    color: "#22d3ee",
    desc: "Подписка на 1 месяц. Уникальные бонусы и доступ к эксклюзивному контенту:\n\n— Каждую неделю: 1 кейс с элементами кита Копателя, 100 кусочков.\n— Доступ к выбору одного из девяти особых цветов ника в /cosmetics.\n— Дополнительных слота на аукционе (+2)\n— Дополнительных голоса в голосовании за ивенты (+2)",
    icon: "Star",
    rconCommand: "pass give {user} 30d",
  },
];

// =============================================================================
// TABS & NAVIGATION
// =============================================================================

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

// =============================================================================
// PRICE HELPERS (holiday + promo discount)
// =============================================================================

export function applyHolidayDiscount(
  price: number,
  itemName: string,
  excludeHoliday?: boolean,
): { price: number; discount: number } {
  if (excludeHoliday) return { price, discount: 0 };
  const holiday = getActiveHolidayDiscount();
  if (!holiday) return { price, discount: 0 };

  const excluded = ["Всё или Харрибо", "Разбан", "Размут"];
  if (excluded.includes(itemName)) return { price, discount: 0 };

  if (itemName.includes("кусочков") || itemName === "Кусочки")
    return { price, discount: 0 };

  const discounted = Math.round(price * (1 - holiday.discount / 100));
  return { price: Math.max(1, discounted), discount: holiday.discount };
}

export function isValidNickname(nick: string): boolean {
  return /^[a-zA-Z0-9_]{3,16}$/.test(nick);
}
