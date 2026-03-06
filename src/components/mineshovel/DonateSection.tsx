import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  privileges, cases, otherItems, donateTabs, getSpringDurations,
  type DonateTab, type Privilege, type ShopItem, type PurchaseState,
} from "./data";

const DonateSection = ({
  onPurchase,
}: {
  onPurchase: (s: PurchaseState) => void;
}) => {
  const [donateTab, setDonateTab] = useState<DonateTab>("privileges");
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const currencyPrice = Math.round(currencyAmount / 10);

  const openPrivilegePurchase = (priv: Privilege) => {
    const durations = priv.name === "Spring" ? getSpringDurations() : priv.durations;
    onPurchase({
      step: 1, type: "privilege", name: priv.name, desc: priv.desc,
      features: priv.features, color: priv.colorLeft, colorRight: priv.colorRight,
      price: 0, duration: undefined, durations, nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
    });
  };

  const openItemPurchase = (item: ShopItem) => {
    onPurchase({
      step: 1, type: "item", name: item.name, desc: item.desc,
      color: item.color, price: item.price, nickname: "", email: "",
      promoCode: "", promoDiscount: 0,
    });
  };

  const getMinPrice = (priv: Privilege) => {
    const durations = priv.name === "Spring" ? getSpringDurations() : priv.durations;
    if (!durations.length) return null;
    return Math.min(...durations.map(d => d.price));
  };

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {privileges.map((priv, i) => {
              const minPrice = getMinPrice(priv);
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
                          className="font-russo text-lg group-hover:scale-105 transition-transform duration-300 inline-block"
                          style={{ background: `linear-gradient(135deg, ${priv.colorLeft}, ${priv.colorRight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                        >
                          {priv.name}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{priv.desc}</p>

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
                        <span className="text-white font-russo text-base">от {minPrice} ₽</span>
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
                type="range" min={10} max={10000} step={10}
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer slider-round"
                style={{ background: `linear-gradient(to right, #3b82f6 ${((currencyAmount - 10) / 9990) * 100}%, #152040 ${((currencyAmount - 10) / 9990) * 100}%)` }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>10</span><span>10 000</span>
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
              className="glass-card rounded-2xl p-6 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${i * 0.1}s`, borderColor: `${c.color}20` }}
              onClick={() => openItemPurchase(c)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${c.color}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${c.color}15`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${c.color}20`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
                <Icon name={c.icon} size={30} style={{ color: c.color }} />
              </div>
              <div className="font-russo text-lg text-white mb-2 group-hover:text-ms-blue-bright transition-colors">{c.name}</div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{c.desc}</p>
              <div className="font-russo text-xl" style={{ color: c.color }}>{c.price} ₽</div>
            </div>
          ))}
        </div>
      )}

      {donateTab === "other" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherItems.map((item, i) => (
            <div
              key={item.name}
              className="glass-card rounded-2xl p-6 cursor-pointer group opacity-0-init animate-fade-in hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${i * 0.1}s`, borderColor: `${item.color}20` }}
              onClick={() => openItemPurchase(item)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${item.color}15`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}20`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <Icon name={item.icon} size={30} style={{ color: item.color }} />
              </div>
              <div className="font-russo text-lg text-white mb-2 group-hover:text-ms-blue-bright transition-colors">{item.name}</div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
              <div className="font-russo text-xl" style={{ color: item.color }}>{item.price} ₽</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DonateSection;
