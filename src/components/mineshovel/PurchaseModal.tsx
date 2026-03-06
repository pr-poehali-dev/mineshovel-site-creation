import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { useYookassa, openPaymentPage, isValidEmail } from "@/components/extensions/yookassa/useYookassa";
import { YOOKASSA_API, RETURN_URL, BTN_COLOR, type PurchaseState } from "./data";

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

  const handleSelectDuration = (label: string, price: number) => {
    setState({ ...state, duration: label, price });
    setError("");
  };

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
      setState({ ...state, step: 3, orderId: response.payment_id, orderNumber: response.order_number });
      setTimeout(() => openPaymentPage(response.payment_url), 1500);
    }
  };

  const grad = `linear-gradient(135deg, ${state.color}, ${state.colorRight || state.color})`;

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
                    onClick={() => handleSelectDuration(d.label, d.price)}
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
                      <span className="font-russo text-sm text-white">{d.label}</span>
                    </div>
                    <span className="font-russo text-sm" style={{ color: state.color }}>{d.price} ₽</span>
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={!state.duration}
                  className="mt-4 w-full py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: BTN_COLOR }}
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
                  style={{ background: BTN_COLOR }}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            )}

            {state.step === 2 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={state.nickname}
                  onChange={(e) => setState({ ...state, nickname: e.target.value })}
                  placeholder="Никнейм"
                  className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                  style={{ borderColor: state.nickname ? `${state.color}40` : undefined }}
                />
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState({ ...state, email: e.target.value })}
                  placeholder="Электронная почта"
                  className="w-full px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors"
                  style={{ borderColor: state.email ? `${state.color}40` : undefined }}
                />

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
                      className="flex-1 px-4 py-3 rounded-xl bg-ms-dark border border-ms-border/50 text-white text-sm placeholder:text-gray-600 focus:outline-none"
                    />
                    <button onClick={handleApplyPromo} className="px-4 py-3 rounded-xl text-sm font-medium cursor-pointer hover:brightness-110 transition-all text-white" style={{ background: BTN_COLOR }}>
                      OK
                    </button>
                  </div>
                )}

                {state.promoDiscount > 0 && (
                  <div className="text-green-400 text-xs flex items-center gap-1">
                    <Icon name="Check" size={12} /> Скидка {state.promoDiscount}% применена
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-xl bg-ms-blue/5 border border-ms-blue/20 mt-2">
                  <span className="text-gray-400 text-sm">К оплате:</span>
                  <div className="flex items-center gap-2">
                    {state.promoDiscount > 0 && (
                      <span className="text-gray-600 line-through text-sm">{state.price} ₽</span>
                    )}
                    <span className="font-russo text-xl text-white">{finalPrice} ₽</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={handleBack} className="px-5 py-3 rounded-xl border border-ms-border/50 text-gray-400 text-sm cursor-pointer hover:text-white hover:border-ms-blue/30 transition-all">
                    <Icon name="ArrowLeft" size={16} />
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-xl font-russo text-sm tracking-wider text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
                    style={{ background: BTN_COLOR }}
                  >
                    {isLoading ? "ЗАГРУЗКА..." : "ОПЛАТИТЬ"}
                  </button>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse" style={{ background: `${state.color}15`, border: `2px solid ${state.color}30` }}>
                  <Icon name="Loader2" size={28} style={{ color: state.color }} className="animate-spin" />
                </div>
                <div className="font-russo text-lg text-white mb-2">Перенаправляем на оплату...</div>
                <p className="text-gray-500 text-sm">
                  {state.orderNumber && <>Заказ #{state.orderNumber}. </>}Откроется страница оплаты. После оплаты товар будет выдан автоматически.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <Icon name="AlertCircle" size={14} /> {error}
              </div>
            )}
          </div>

          <div className="w-full md:w-72 p-6 border-t md:border-t-0 md:border-l border-ms-border/30 flex flex-col justify-center items-center bg-ms-dark/50">
            <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: grad, boxShadow: `0 8px 30px ${state.color}30` }}>
              <Icon name="Crown" size={28} className="text-white" />
            </div>
            <div className="font-russo text-xl text-center mb-1" style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {state.name}
            </div>
            {state.duration && <div className="text-gray-500 text-sm mb-3">{state.duration}</div>}

            {state.features && state.features.length > 0 && (
              <div className="w-full mt-2 space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {state.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-400 text-xs">
                    <Icon name="Check" size={12} style={{ color: state.color }} className="mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
