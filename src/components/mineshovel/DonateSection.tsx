import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  privileges, cases, otherItems, donateTabs, getSeasonalDurations, getSeasonalPrivilege,
  getActiveHolidayDiscount, applyHolidayDiscount,
  type DonateTab, type Privilege, type ShopItem, type PurchaseState,
} from "./data";

const DonateSection = ({
  onPurchase,
}: {
  onPurchase: (s: PurchaseState) => void;
}) => {
  const [donateTab, setDonateTab] = useState<DonateTab>("privileges");
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const [currencyInput, setCurrencyInput] = useState("100");
  const [animKey, setAnimKey] = useState(0);
  const prevTab = useRef<DonateTab>("privileges");
  const currencyPrice = Math.round(currencyAmount / 10);

  const holiday = getActiveHolidayDiscount();

  useEffect(() => {
    if (donateTab !== prevTab.current) {
      setAnimKey(k => k + 1);
      prevTab.current = donateTab;
    }
  }, [donateTab]);

  const handleCurrencyInput = (val: string) => {
    setCurrencyInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const rounded = Math.round(num / 10) * 10;
      const clamped = Math.max(10, Math.min(10000, rounded));
      setCurrencyAmount(clamped);
    }
  };

  const handleCurrencyBlur = () => {
    const num = parseInt(currencyInput, 10);
    if (isNaN(num) || num < 10) {
      setCurrencyAmount(10);
      setCurrencyInput("10");
    } else {
      const rounded = Math.round(num / 10) * 10;
      const clamped = Math.max(10, Math.min(10000, rounded));
      setCurrencyAmount(clamped);
      setCurrencyInput(String(clamped));
    }
  };

  const allPrivileges = [...privileges];
  const seasonal = getSeasonalPrivilege();
  const seasonalIdx = allPrivileges.findIndex(p => p.name === "Spring");
  if (seasonalIdx !== -1) {
    allPrivileges[seasonalIdx] = seasonal;
  } else {
    allPrivileges.splice(allPrivileges.length - 1, 0, seasonal);
  }

  const openPrivilegePurchase = (priv: Privilege) => {
    const isSeasonal = priv.name === seasonal.name;
    const durations = isSeasonal ? getSeasonalDurations() : priv.durations;
    const firstDuration = durations[0];
    onPurchase({
      step: 1, type: "privilege", name: priv.name, desc: priv.desc,
      features: priv.features, color: priv.colorLeft, colorRight: priv.colorRight,
      price: firstDuration?.price ?? 0,
      duration: firstDuration?.label,
      durationKey: firstDuration?.key,
      durations,
      nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
      icon: priv.icon,
      detailedDesc: priv.detailedDesc,
      holidayDiscount: holiday?.discount ?? 0,
    });
  };

  const openItemPurchase = (item: ShopItem) => {
    const { price: finalPrice, discount } = applyHolidayDiscount(item.price, item.name, item.excludeFromHolidayDiscount);
    onPurchase({
      step: 1, type: "item", name: item.name, desc: item.desc,
      color: item.color, price: finalPrice, nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
      icon: item.icon,
      holidayDiscount: discount,
    });
  };

  const getMinPrice = (priv: Privilege) => {
    const isSeasonal = priv.name === seasonal.name;
    const durations = isSeasonal ? getSeasonalDurations() : priv.durations;
    if (!durations.length) return null;
    const minRaw = Math.min(...durations.map(d => d.price));
    if (holiday) {
      const { price } = applyHolidayDiscount(minRaw, priv.name);
      return price;
    }
    return minRaw;
  };

  const getOrigMinPrice = (priv: Privilege) => {
    const isSeasonal = priv.name === seasonal.name;
    const durations = isSeasonal ? getSeasonalDurations() : priv.durations;
    if (!durations.length) return null;
    return Math.min(...durations.map(d => d.price));
  };

  return (
    <section id="donate" className="relative py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-ms-blue-bright text-xs tracking-[0.3em] font-medium mb-4">ПОДДЕРЖИ СЕРВЕР</div>
        <h2 className="font-unbounded text-4xl md:text-5xl text-white font-bold">ДОНАТ</h2>
        {holiday && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30">
            <Icon name="Percent" size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium">Скидка {holiday.discount}% в честь праздника «{holiday.name}»!</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {donateTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setDonateTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300 hover:scale-[1.05] ${
              donateTab === tab.id
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-white/20"
                : "bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div key={animKey}>
        {donateTab === "privileges" && (
          <div className="animate-fade-in">
            <p className="text-center text-gray-500 text-sm mb-8">Нажми на привилегию, чтобы узнать подробнее и купить</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allPrivileges.map((priv, i) => {
                const minPrice = getMinPrice(priv);
                const origPrice = getOrigMinPrice(priv);
                const hasDiscount = holiday && minPrice !== null && origPrice !== null && minPrice !== origPrice;
                return (
                  <div
                    key={priv.name}
                    className="priv-card glass-card rounded-2xl overflow-hidden opacity-0-init animate-fade-in cursor-pointer group"
                    style={{ animationDelay: `${i * 0.06}s`, borderColor: `${priv.colorLeft}15` }}
                    onClick={() => openPrivilegePurchase(priv)}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.colorLeft}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${priv.colorLeft}15`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${priv.colorLeft}15`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <div className="h-1.5 w-full transition-all duration-500 group-hover:h-2" style={{ background: `linear-gradient(90deg, ${priv.colorLeft}, ${priv.colorRight})` }} />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                          style={{ background: `${priv.colorLeft}12`, border: `1px solid ${priv.colorLeft}25` }}
                        >
                          <Icon name={priv.icon} size={22} style={{ color: priv.colorLeft }} />
                        </div>
                        <div>
                          <span
                            className="font-unbounded text-lg font-semibold group-hover:scale-105 transition-transform duration-300 inline-block"
                            style={{ background: `linear-gradient(135deg, ${priv.colorLeft}, ${priv.colorRight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                          >
                            {priv.name}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 font-unbounded text-xs">{priv.desc}</p>

                      <ul className="space-y-1.5 mb-4">
                        {priv.features.slice(0, 3).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-gray-400 text-xs">
                            <Icon name="Check" size={12} style={{ color: priv.colorLeft }} className="mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                        {priv.features.length > 3 && (
                          <li className="text-gray-600 text-xs pl-5">+{priv.features.length - 3} ещё</li>
                        )}
                      </ul>

                      <div className="flex items-center justify-between pt-3 border-t border-ms-border/30">
                        {minPrice !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-white font-unbounded text-base font-semibold">от {minPrice} ₽</span>
                            {hasDiscount && (
                              <span className="text-gray-500 text-xs line-through">от {origPrice} ₽</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Сезонная</span>
                        )}
                        <div className="flex items-center gap-1 text-gray-500 group-hover:text-white transition-colors text-xs">
                          <span>Подробнее</span>
                          <Icon name="ChevronRight" size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {donateTab === "currency" && (
          <div className="max-w-lg mx-auto animate-fade-in">
            <div className="glass-card rounded-2xl p-8 hover:border-ms-blue/30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                  <Icon name="Coins" size={24} className="text-yellow-400" />
                </div>
                <div>
                  <div className="font-unbounded text-xl text-white font-semibold">Кусочки</div>
                  <div className="text-xs text-gray-500">Внутриигровая донат-валюта</div>
                </div>
              </div>

              <div className="bg-ms-dark rounded-xl p-6 border border-ms-border/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Количество:</span>
                  <input
                    type="number"
                    value={currencyInput}
                    onChange={(e) => handleCurrencyInput(e.target.value)}
                    onBlur={handleCurrencyBlur}
                    min={10}
                    max={10000}
                    step={10}
                    className="font-unbounded text-3xl text-yellow-400 bg-transparent border-none outline-none text-right w-32 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <input
                  type="range" min={10} max={10000} step={10}
                  value={currencyAmount}
                  onChange={(e) => { setCurrencyAmount(Number(e.target.value)); setCurrencyInput(e.target.value); }}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer slider-round"
                  style={{ background: `linear-gradient(to right, #3b82f6 ${((currencyAmount - 10) / 9990) * 100}%, #152040 ${((currencyAmount - 10) / 9990) * 100}%)` }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>10</span><span>10 000</span>
                </div>
                <p className="text-gray-600 text-xs mt-3">Минимальная надбавка — 10 кусочков (кратно 10)</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-ms-blue/5 border border-ms-blue/20">
                <span className="text-gray-400">К оплате:</span>
                <span className="font-unbounded text-2xl text-white font-bold">{currencyPrice} ₽</span>
              </div>

              <button
                onClick={() => openItemPurchase({ name: `${currencyAmount} кусочков`, price: currencyPrice, color: "#eab308", desc: `Покупка ${currencyAmount} кусочков — внутриигровой донат-валюты.`, icon: "Coins", rconCommand: `points give {user} ${currencyAmount}`, excludeFromHolidayDiscount: true, excludeFromPromoDiscount: true })}
                className="mt-6 w-full py-3.5 rounded-xl font-unbounded text-sm tracking-wider text-black cursor-pointer bg-yellow-400 hover:bg-yellow-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold"
              >
                КУПИТЬ {currencyAmount} КУСОЧКОВ
              </button>
            </div>
          </div>
        )}

        {donateTab === "cases" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {cases.map((item, i) => {
              const { price: displayPrice, discount } = applyHolidayDiscount(item.price, item.name, item.excludeFromHolidayDiscount);
              return (
                <div
                  key={item.name}
                  className="glass-card rounded-2xl p-5 opacity-0-init animate-fade-in cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.08}s`, borderColor: `${item.color}15` }}
                  onClick={() => openItemPurchase(item)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${item.color}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}15`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div className="w-11 h-11 rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                    <Icon name={item.icon} size={22} style={{ color: item.color }} />
                  </div>
                  <div className="font-unbounded text-base text-white mb-1 font-semibold">{item.name}</div>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.desc.split('\n')[0]}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-unbounded font-bold" style={{ color: item.color }}>{displayPrice} ₽</span>
                    {discount > 0 && <span className="text-gray-500 text-xs line-through">{item.price} ₽</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {donateTab === "other" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {otherItems.map((item, i) => {
              const { price: displayPrice, discount } = applyHolidayDiscount(item.price, item.name, item.excludeFromHolidayDiscount);
              return (
                <div
                  key={item.name}
                  className="glass-card rounded-2xl p-5 opacity-0-init animate-fade-in cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.08}s`, borderColor: `${item.color}15` }}
                  onClick={() => openItemPurchase(item)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${item.color}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}15`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div className="w-11 h-11 rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                    <Icon name={item.icon} size={22} style={{ color: item.color }} />
                  </div>
                  <div className="font-unbounded text-base text-white mb-1 font-semibold">{item.name}</div>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.desc.split('\n')[0]}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-unbounded font-bold" style={{ color: item.color }}>{displayPrice} ₽</span>
                    {discount > 0 && <span className="text-gray-500 text-xs line-through">{item.price} ₽</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DonateSection;
