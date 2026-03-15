import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useYookassa, openPaymentPage, isValidEmail } from "@/components/extensions/yookassa/useYookassa";
import { YOOKASSA_API, RETURN_URL, BTN_COLOR, isValidNickname, applyHolidayDiscount, getActiveHolidayDiscount, type PurchaseState } from "./data";

const PROMO_API = "https://functions.poehali.dev/75ac9224-15fd-487f-97e3-793f33bb0e21";

const PRIVILEGE_STEP_ICONS: Record<string, string> = {
  Midnight: "Moon",
  Exotic: "Sparkles",
  Atomic: "Atom",
  Warden: "Shield",
  Noris: "Flame",
  Chrona: "Clock",
  Briz: "Wind",
  Shovel: "Shovel",
  Spring: "Flower2",
  Summer: "Sun",
  Autumn: "Leaf",
  Frozen: "Snowflake",
  "Кастомка": "Paintbrush",
};

const DARK_ICON_PRIVILEGES = ["Midnight", "Atomic", "Spring", "Summer"];

function getStepBgStyle(name: string, color: string): React.CSSProperties {
  if (DARK_ICON_PRIVILEGES.includes(name)) {
    return { background: `linear-gradient(135deg, ${color}20, ${color}08)` };
  }
  return { background: `linear-gradient(135deg, ${color}15, ${color}05)` };
}

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
  const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [promoMessage, setPromoMessage] = useState("");

  const { createPayment, isLoading } = useYookassa({
    apiUrl: YOOKASSA_API,
    onError: (err) => setError(err.message),
  });

  const holiday = getActiveHolidayDiscount();

  const finalPrice = useMemo(() => {
    let p = state.price;
    if (holiday && state.type === "privilege") {
      const { price } = applyHolidayDiscount(p, state.name);
      p = price;
    }
    if (state.promoDiscount > 0) {
      p = Math.round(p * (1 - state.promoDiscount / 100));
    }
    return Math.max(1, p);
  }, [state.price, state.promoDiscount, state.name, state.type, holiday]);

  const handleSelectDuration = (label: string, key: string, price: number) => {
    setState({ ...state, duration: label, durationKey: key, price });
    setError("");
  };

  useEffect(() => {
    if (state.step === 1 && state.type === "privilege" && state.durations && state.durations.length > 0 && !state.duration) {
      const first = state.durations[0];
      setState({ ...state, duration: first.label, durationKey: first.key, price: first.price });
    }
  }, []);

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

  const handlePromoChange = (code: string) => {
    setState({ ...state, promoCode: code, promoDiscount: 0 });
    setPromoStatus("idle");
    setPromoMessage("");
  };

  const handleApplyPromo = async () => {
    const code = state.promoCode.trim();
    if (!code) return;

    try {
      const res = await fetch(`${PROMO_API}?action=check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, product_name: state.name }),
      });
      const data = await res.json();

      if (data.valid) {
        setState({ ...state, promoDiscount: data.discount });
        setPromoStatus("valid");
        setPromoMessage(data.message || `Скидка ${data.discount}% применена`);
      } else {
        setState({ ...state, promoDiscount: 0 });
        setPromoStatus("invalid");
        setPromoMessage(data.message || "Промокод не найден");
      }
    } catch {
      setState({ ...state, promoDiscount: 0 });
      setPromoStatus("invalid");
      setPromoMessage("Ошибка проверки промокода");
    }
  };

  const handlePurchase = async () => {
    if (!state.nickname.trim()) { setError("Введите ник"); return; }
    if (!isValidNickname(state.nickname.trim())) { setError("Ник: 3-16 символов (a-z, 0-9, _)"); return; }
    if (!state.email.trim() || !isValidEmail(state.email)) { setError("Введите корректный email"); return; }
    setError("");

    const desc = state.type === "privilege"
      ? `${state.name} (${state.duration}) — ${state.nickname}`
      : `${state.name} — ${state.nickname}`;

    const productKey = state.name.includes("кусочков")
      ? `currency_${state.name.replace(/\D/g, "")}`
      : state.type === "privilege"
        ? state.name.toLowerCase().replace("кастомка", "kactom")
        : state.name === "Кейс с Донатом" ? "case_donate"
        : state.name === "Кейс с Кусочками" ? "case_currency"
        : state.name === "Тайник с Отмычками" ? "cache_keys"
        : state.name === "Всё или Харрибо" ? "harribo"
        : state.name === "Разбан" ? "unban"
        : state.name === "Размут" ? "unmute"
        : state.name === "Щавель-Пасс" ? "shovel_pass"
        : state.name.toLowerCase();

    const response = await createPayment({
      amount: finalPrice,
      userEmail: state.email,
      userName: state.nickname.trim(),
      description: desc,
      returnUrl: RETURN_URL,
      cartItems: [{ id: state.name, name: state.name, price: finalPrice, quantity: 1 }],
      productKey,
      durationKey: state.durationKey || "",
      promoCode: state.promoCode || "",
      promoDiscount: state.promoDiscount || 0,
      originalAmount: state.price,
    });

    if (response?.payment_url) {
      setState({ ...state, step: 3, orderId: response.payment_id, orderNumber: response.order_number });
      setTimeout(() => openPaymentPage(response.payment_url), 1500);
    }
  };

  const stepIcon = PRIVILEGE_STEP_ICONS[state.name] || state.icon || "Package";
  const stepBg = getStepBgStyle(state.name, state.color);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white cursor-pointer transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-8 h-1 rounded-full transition-all duration-300 ${state.step >= s ? "opacity-100" : "opacity-20"}`}
                    style={{ background: state.step >= s ? BTN_COLOR : "#334155" }} />
                ))}
              </div>
            </div>

            <div className="font-unbounded text-lg text-white mb-0.5 font-semibold">Шаг {state.step}</div>
            <div className="text-gray-500 text-sm mb-5">
              {state.step === 1 && (state.type === "privilege" ? "Выберите срок" : "Описание товара")}
              {state.step === 2 && "Заполните данные"}
              {state.step === 3 && "Ожидание оплаты"}
            </div>

            {state.step === 1 && state.type === "privilege" && state.durations && (
              <div className="space-y-2.5">
                {state.detailedDesc && (
                  <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 mb-4 max-h-48 overflow-y-auto scrollbar-thin">
                    <pre className="text-gray-400 text-xs whitespace-pre-wrap font-sans leading-relaxed">{state.detailedDesc}</pre>
                  </div>
                )}
                {state.durations.map(d => {
                  const { price: dPrice, discount: dDisc } = applyHolidayDiscount(d.price, state.name);
                  return (
                    <button
                      key={d.key}
                      onClick={() => handleSelectDuration(d.label, d.key, d.price)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        state.duration === d.label ? "border-opacity-60 bg-opacity-10" : "border-ms-border/50 bg-ms-dark hover:border-opacity-30"
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
                          {state.duration === d.label && <div className="w-2 h-2 rounded-full" style={{ background: state.color }} />}
                        </div>
                        <span className="font-unbounded text-sm text-white">{d.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-unbounded text-sm font-semibold" style={{ color: state.color }}>{dDisc > 0 ? dPrice : d.price} ₽</span>
                        {dDisc > 0 && <span className="text-gray-500 text-xs line-through">{d.price} ₽</span>}
                      </div>
                    </button>
                  );
                })}
                <button
                  onClick={handleNext}
                  disabled={!state.duration}
                  className="mt-4 w-full py-3.5 rounded-xl font-unbounded text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                  style={{ background: BTN_COLOR }}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            )}

            {state.step === 1 && state.type === "item" && (
              <div>
                <div className="bg-ms-dark rounded-xl p-4 border border-ms-border/50 mb-4">
                  <pre className="text-gray-400 text-sm whitespace-pre-wrap font-sans leading-relaxed">{state.desc}</pre>
                </div>
                <div className="font-unbounded text-2xl mb-4 font-bold" style={{ color: state.color }}>
                  {finalPrice} ₽
                  {state.holidayDiscount && state.holidayDiscount > 0 && (
                    <span className="text-gray-500 text-base line-through ml-2">{state.price} ₽</span>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl font-unbounded text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 font-bold"
                  style={{ background: BTN_COLOR }}
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
                    placeholder="Никнейм (3-16 символов)"
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors font-unbounded"
                    style={{ borderColor: state.nickname && isValidNickname(state.nickname) ? `${state.color}40` : undefined }}
                  />
                  {state.nickname && !isValidNickname(state.nickname) && (
                    <p className="text-red-400 text-xs mt-1">Допустимо: a-z, 0-9, _ (3-16 символов)</p>
                  )}
                </div>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState({ ...state, email: e.target.value })}
                  placeholder="Электронная почта"
                  className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                  style={{ borderColor: state.email ? `${state.color}40` : undefined }}
                />

                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={state.promoCode}
                      onChange={(e) => handlePromoChange(e.target.value)}
                      placeholder="Промокод"
                      className="flex-1 px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!state.promoCode.trim()}
                      className="px-4 py-3 rounded-xl text-sm cursor-pointer transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                      style={{ background: `${state.color}20`, color: state.color }}
                    >
                      OK
                    </button>
                  </div>
                  {promoStatus === "invalid" && (
                    <p className="text-red-400 text-xs mt-1.5">{promoMessage}</p>
                  )}
                  {promoStatus === "valid" && (
                    <p className="text-green-400 text-xs mt-1.5">{promoMessage}</p>
                  )}
                </div>

                {error && <div className="text-red-400 text-xs">{error}</div>}

                <div className="flex items-center justify-between p-4 rounded-xl bg-ms-dark border border-ms-border/50">
                  <span className="text-gray-400 text-sm">К оплате:</span>
                  <div className="text-right">
                    <span className="font-unbounded text-xl text-white font-bold">{finalPrice} ₽</span>
                    {(state.promoDiscount > 0 || (state.holidayDiscount && state.holidayDiscount > 0)) && (
                      <div className="text-green-400 text-xs">
                        {state.promoDiscount > 0 && `Промо -${state.promoDiscount}%`}
                        {state.promoDiscount > 0 && state.holidayDiscount && state.holidayDiscount > 0 && " + "}
                        {state.holidayDiscount && state.holidayDiscount > 0 && `Праздник -${state.holidayDiscount}%`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleBack} className="px-5 py-3 rounded-xl border border-ms-border/50 text-gray-400 text-sm cursor-pointer hover:border-ms-blue/30 hover:text-white transition-all">
                    Назад
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-xl font-unbounded text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 font-bold"
                    style={{ background: BTN_COLOR }}
                  >
                    {isLoading ? "ЗАГРУЗКА..." : "ОПЛАТИТЬ"}
                  </button>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Icon name="CreditCard" size={28} className="text-ms-blue-bright" />
                </div>
                <div className="font-unbounded text-lg text-white mb-2 font-semibold">Переход к оплате...</div>
                <p className="text-gray-500 text-sm mb-2">Заказ #{state.orderNumber}</p>
                <p className="text-gray-600 text-xs">Если окно оплаты не открылось, нажмите кнопку ниже</p>
                <button
                  onClick={() => { if (state.orderId) window.open(`https://yoomoney.ru/checkout/payments/v2/contract?orderId=${state.orderId}`, "_blank"); }}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm cursor-pointer transition-all hover:brightness-110 font-medium"
                  style={{ background: BTN_COLOR, color: "white" }}
                >
                  Открыть оплату
                </button>
              </div>
            )}
          </div>

          <div
            className="hidden md:flex w-56 flex-col items-center justify-center p-6 border-l border-ms-border/30 relative overflow-hidden"
            style={stepBg}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${state.color}18`, border: `1px solid ${state.color}30` }}>
              <Icon name={stepIcon} size={40} style={{ color: state.color }} />
            </div>
            <span
              className="font-unbounded text-base text-center font-bold"
              style={{ background: `linear-gradient(135deg, ${state.color}, ${state.colorRight || state.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {state.name}
            </span>
            {state.duration && <span className="text-gray-500 text-xs mt-1">{state.duration}</span>}
            {state.price > 0 && <span className="font-unbounded text-lg text-white mt-2 font-bold">{finalPrice} ₽</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;