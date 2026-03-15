import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const PublicOffer = () => {
  return (
    <div className="min-h-screen bg-ms-bg bg-grid">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-ms-bg/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-5 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg bg-ms-blue/10 border border-ms-blue/20 flex items-center justify-center group-hover:bg-ms-blue/20 transition-all duration-300">
              <Icon
                name="ArrowLeft"
                size={16}
                className="text-ms-blue-bright"
              />
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              На главную
            </span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-sm text-gray-500">Публичная оферта</span>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-12 pb-24">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="font-unbounded text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            ПУБЛИЧНАЯ ОФЕРТА
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            о предоставлении доступа к дополнительным возможностям игрового
            проекта MineShovel
          </p>
        </div>

        <div className="space-y-2 mb-10 text-gray-400 text-sm border-l-2 border-ms-blue/30 pl-4">
          <p>Дата публикации: 15.03.2026г..</p>
          <p>
            Настоящий документ является официальным предложением (публичной
            офертой) администрации проекта MineShovel (далее — «Проект»)
            заключить договор на указанных ниже условиях.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-gray-300 text-[15px] leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              1. Общие положения
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">1.1.</span>{" "}
                Настоящий документ является публичной офертой в соответствии со
                статьёй 437 Гражданского кодекса Российской Федерации.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.2.</span> Оферта
                адресована любому физическому лицу (далее — «Пользователь»),
                желающему получить доступ к дополнительным возможностям Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.3.</span> Акцептом
                (принятием) настоящей оферты является совершение Пользователем
                оплаты любого из предложенных товаров или услуг на сайте
                Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.4.</span> Совершая
                оплату, Пользователь подтверждает, что полностью ознакомился и
                согласен с условиями настоящей оферты.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.5.</span>{" "}
                Администрация Проекта оставляет за собой право вносить изменения
                в условия оферты без предварительного уведомления. Актуальная
                версия оферты всегда доступна на сайте Проекта.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              2. Термины и определения
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">Проект</span> —
                игровой сервер MineShovel и все связанные с ним сервисы (сайт,
                Discord-сервер, бот и др.).
              </p>
              <p>
                <span className="text-gray-500 font-medium">Пользователь</span>{" "}
                — физическое лицо, осуществившее акцепт настоящей оферты.
              </p>
              <p>
                <span className="text-gray-500 font-medium">Привилегия</span> —
                набор дополнительных игровых возможностей, предоставляемых
                Пользователю на определённый срок или бессрочно.
              </p>
              <p>
                <span className="text-gray-500 font-medium">Услуга</span> —
                действие, выполняемое администрацией Проекта по запросу
                Пользователя (например, разбан, размут и др.).
              </p>
              <p>
                <span className="text-gray-500 font-medium">Кейс</span> —
                виртуальный предмет, содержащий случайный набор игровых
                возможностей или предметов.
              </p>
              <p>
                <span className="text-gray-500 font-medium">
                  Игровая валюта («Кусочки»)
                </span>{" "}
                — внутриигровая валюта Проекта, не имеющая реальной денежной
                стоимости вне Проекта.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              3. Предмет договора
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">3.1.</span>{" "}
                Администрация Проекта предоставляет Пользователю доступ к
                дополнительным игровым возможностям в соответствии с выбранным
                товаром или услугой.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.2.</span> Все
                предоставляемые возможности носят исключительно виртуальный
                характер и действуют только в рамках Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.3.</span>{" "}
                Приобретённые возможности не являются товаром в понимании Закона
                о защите прав потребителей и не подлежат обмену или возврату, за
                исключением случаев, предусмотренных настоящей офертой.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.4.</span>{" "}
                Администрация не гарантирует постоянную доступность всех
                функций, связанных с приобретёнными возможностями, и вправе
                изменять их в целях баланса, технической поддержки или развития
                Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.5.</span>{" "}
                Пользователь понимает и принимает, что все приобретённые
                возможности привязаны к аккаунту и не подлежат передаче третьим
                лицам.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              4. Перечень предоставляемых возможностей
            </h2>

            {/* 4.1 */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">4.1. Привилегии</h3>
              <p className="mb-3 pl-1">
                Привилегии предоставляют набор дополнительных возможностей в
                игре. Перечень и стоимость актуальны на момент покупки и могут
                быть изменены администрацией.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-left">
                      <th className="px-4 py-3 font-medium">Название</th>
                      <th className="px-4 py-3 font-medium">Примечание</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-4 py-2.5">Midnight</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Exotic</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Atomic</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Warden</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Noris</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Chrona</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Briz</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Shovel</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Постоянная привилегия
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Spring</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Сезонная привилегия (ограниченный срок)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Кастомная</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Индивидуальная привилегия по запросу
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4.2 */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">4.2. Кейсы</h3>
              <p className="mb-3 pl-1">
                Кейсы содержат случайный набор игровых предметов или
                возможностей. Содержимое определяется случайным образом в момент
                открытия.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-left">
                      <th className="px-4 py-3 font-medium">Название</th>
                      <th className="px-4 py-3 font-medium">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-4 py-2.5">Кейс с донатом</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Содержит случайную привилегию или предмет
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Кейс с кусочками</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Содержит случайное количество игровой валюты
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Тайник с отмычками</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Специальный кейс с уникальным содержимым
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Всё или Харрибо</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Кейс с повышенным риском и наградой
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4.3 */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">4.3. Услуги</h3>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-left">
                      <th className="px-4 py-3 font-medium">Название</th>
                      <th className="px-4 py-3 font-medium">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-4 py-2.5">Разбан</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Снятие блокировки (бана) с аккаунта
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Размут</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Снятие ограничения чата (мута) с аккаунта
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Щавель-Пасс</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        Сезонный пропуск с дополнительными наградами
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4.4 */}
            <div className="mb-2">
              <h3 className="text-white font-semibold mb-3">
                4.4. Игровая валюта — «Кусочки»
              </h3>
              <div className="space-y-3 pl-1">
                <p>
                  Пользователь может приобрести внутриигровую валюту «Кусочки»
                  для использования в рамках Проекта.
                </p>
                <p>Доступные номиналы: от 10 до 10 000 кусочков.</p>
                <p>Курс: 1 рубль = 10 кусочков.</p>
                <p>
                  Игровая валюта не подлежит обратному обмену на реальные деньги
                  и не имеет стоимости за пределами Проекта.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              5. Порядок оплаты
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">5.1.</span> Оплата
                производится через платёжные системы, доступные на сайте
                Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.2.</span>{" "}
                Стоимость товаров и услуг указана на сайте и может быть изменена
                администрацией без предварительного уведомления.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.3.</span> Товар
                или услуга считаются предоставленными с момента зачисления
                оплаты и активации соответствующих возможностей на аккаунте
                Пользователя.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.4.</span> В случае
                технических сбоев при оплате Пользователь обязан обратиться в
                службу поддержки Проекта для решения проблемы.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.5.</span>{" "}
                Пользователь несёт полную ответственность за правильность
                указанных при оплате данных (никнейм, выбранный товар и т.д.).
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              6. Политика возврата средств
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">6.1.</span> Возврат
                денежных средств возможен только в случае, если оплаченная
                услуга или товар не были предоставлены по вине администрации
                Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.2.</span> Запросы
                на возврат принимаются в течение 7 (семи) календарных дней с
                момента оплаты.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.3.</span> Возврат
                не осуществляется, если Пользователь уже воспользовался
                приобретённой услугой или товаром (активировал привилегию,
                открыл кейс, потратил игровую валюту и т.д.).
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.4.</span> В случае
                блокировки аккаунта Пользователя за нарушение правил Проекта
                возврат средств не производится.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.5.</span> Для
                оформления возврата необходимо обратиться в службу поддержки
                Проекта с указанием данных платежа и причины запроса.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              7. Права администрации
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">7.1.</span>{" "}
                Администрация вправе в любое время изменять перечень, стоимость
                и состав предоставляемых товаров и услуг.
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.2.</span>{" "}
                Администрация вправе ограничить или прекратить доступ
                Пользователя к приобретённым возможностям в случае нарушения
                правил Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.3.</span>{" "}
                Администрация вправе проводить акции, предоставлять скидки и
                специальные предложения по своему усмотрению.
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.4.</span>{" "}
                Администрация вправе приостанавливать работу Проекта для
                проведения технических работ без предварительного уведомления.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              8. Обязанности пользователя
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">8.1.</span>{" "}
                Пользователь обязан ознакомиться с условиями настоящей оферты
                перед совершением оплаты.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.2.</span>{" "}
                Пользователь обязан соблюдать правила Проекта, опубликованные на
                сайте.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.3.</span>{" "}
                Пользователь обязан использовать приобретённые возможности
                только в рамках предусмотренного функционала.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.4.</span>{" "}
                Пользователь обязан не передавать данные своего аккаунта третьим
                лицам.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.5.</span>{" "}
                Пользователь обязан не использовать приобретённые возможности
                для нарушения правил Проекта или причинения вреда другим
                игрокам.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              9. Ограничение ответственности
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">9.1.</span>{" "}
                Администрация не несёт ответственности за временную
                недоступность Проекта, вызванную техническими причинами,
                обновлениями или обстоятельствами непреодолимой силы.
              </p>
              <p>
                <span className="text-gray-500 font-medium">9.2.</span>{" "}
                Администрация не несёт ответственности за потерю игровых данных,
                произошедшую по причинам, не зависящим от администрации (сбои
                хостинга, DDoS-атаки и т.д.).
              </p>
              <p>
                <span className="text-gray-500 font-medium">9.3.</span>{" "}
                Максимальная ответственность администрации перед Пользователем
                ограничивается суммой, фактически уплаченной Пользователем за
                конкретный товар или услугу.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              10. Блокировка аккаунтов
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">10.1.</span> В
                случае нарушения правил Проекта администрация вправе
                заблокировать аккаунт Пользователя без возврата средств за
                приобретённые товары и услуги.
              </p>
              <p>
                <span className="text-gray-500 font-medium">10.2.</span>{" "}
                Оспорить блокировку можно через службу поддержки Проекта.
                Решение администрации по результатам рассмотрения является
                окончательным.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              11. Заключительные положения
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">11.1.</span>{" "}
                Настоящая оферта вступает в силу с момента её публикации на
                сайте Проекта и действует до момента её отзыва администрацией.
              </p>
              <p>
                <span className="text-gray-500 font-medium">11.2.</span> Все
                споры, возникающие в связи с настоящей офертой, разрешаются
                путём переговоров. В случае невозможности урегулирования спора
                путём переговоров, спор подлежит рассмотрению в соответствии с
                действующим законодательством Российской Федерации.
              </p>
              <p>
                <span className="text-gray-500 font-medium">11.3.</span> По всем
                вопросам, не урегулированным настоящей офертой, стороны
                руководствуются действующим законодательством Российской
                Федерации.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              12. Контактная информация
            </h2>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
              <p>
                <span className="text-gray-500">Проект:</span>{" "}
                <span className="text-white font-medium">MineShovel</span>
              </p>
              <p>
                <span className="text-gray-500">Сайт:</span>{" "}
                <a
                  href="https://mineshovel.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ms-blue-bright hover:underline"
                >
                  mineshovel.ru
                </a>
              </p>
              <p>
                <span className="text-gray-500">Поддержка:</span>{" "}
                <span className="text-ms-blue-bright">@mineshovel_support</span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PublicOffer;
