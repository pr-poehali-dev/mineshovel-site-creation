import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Rules = () => {
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
              <Icon name="ArrowLeft" size={16} className="text-ms-blue-bright" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">На главную</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-sm text-gray-500">Правила сервера</span>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-12 pb-24">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="font-unbounded text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            ПРАВИЛА СЕРВЕРА
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Правила использования сервера MineShovel
          </p>
        </div>

        <div className="space-y-2 mb-10 text-gray-400 text-sm border-l-2 border-ms-blue/30 pl-4">
          <p>
            Играя на сервере MineShovel, вы автоматически соглашаетесь с данными правилами.
            Незнание правил не освобождает от ответственности.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-gray-300 text-[15px] leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              1. Основные положения
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">1.1.</span>{" "}
                Администрация сервера MineShovel (далее — «Администрация») устанавливает настоящие
                правила (далее — «Правила») для всех пользователей (далее — «Игроки»).
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.2.</span>{" "}
                Играя на сервере, Игрок автоматически соглашается с настоящими Правилами.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.3.</span>{" "}
                Незнание Правил не освобождает от ответственности за их нарушение.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.4.</span>{" "}
                Администрация оставляет за собой право изменять Правила без предварительного
                уведомления. Актуальная версия всегда доступна на сайте проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.5.</span>{" "}
                Администрация оставляет за собой право выносить наказания по своему усмотрению, в
                том числе за действия, не описанные в Правилах, если они наносят вред серверу или
                его игрокам.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.6.</span>{" "}
                Решения Администрации являются окончательными и не подлежат оспариванию, за
                исключением случаев подачи апелляции через официальные каналы поддержки.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.7.</span>{" "}
                Администрация не обязана объяснять причины своих решений, но может сделать это по
                своему усмотрению.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.8.</span>{" "}
                Все игроки равны перед Правилами вне зависимости от статуса, привилегий или иных
                обстоятельств.
              </p>
              <p>
                <span className="text-gray-500 font-medium">1.9.</span>{" "}
                Использование сервера в любых целях, противоречащих законодательству Российской
                Федерации, запрещено.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              2. Игровые правила
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">2.1.</span>{" "}
                Запрещено использование любых модификаций, дающих преимущество над другими
                игроками, включая, но не ограничиваясь:
              </p>
              <ul className="list-disc list-inside pl-6 space-y-1 text-gray-400">
                <li>Читы (KillAura, Fly, Speed, Nuker и т.д.)</li>
                <li>X-Ray (текстурпаки и моды для просмотра руд через блоки)</li>
                <li>Автокликеры и макросы</li>
                <li>Моды для автоматической игры (баритон и аналоги)</li>
                <li>Любые другие модификации, дающие нечестное преимущество</li>
              </ul>

              <p>
                <span className="text-gray-500 font-medium">2.2.</span>{" "}
                Запрещено использование багов и уязвимостей сервера. При обнаружении бага Игрок
                обязан сообщить о нём Администрации. Использование бага в личных целях влечёт
                наказание.
              </p>
              <p>
                <span className="text-gray-500 font-medium">2.3.</span>{" "}
                Запрещён гриферство — намеренное разрушение построек других игроков, кража
                предметов из чужих хранилищ (если это не предусмотрено механикой сервера), а также
                любые действия, направленные на порчу игрового опыта других игроков.
              </p>
              <p>
                <span className="text-gray-500 font-medium">2.4.</span>{" "}
                Запрещено использование сторонних скриптов, ботов и программ для автоматизации
                игрового процесса без разрешения Администрации.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              3. Правила аккаунта
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">3.1.</span>{" "}
                Каждый Игрок несёт полную ответственность за безопасность своего аккаунта. В
                случае взлома аккаунта Администрация не компенсирует потерянные предметы или
                привилегии.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.2.</span>{" "}
                Запрещена передача, продажа или обмен аккаунтов между игроками.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.3.</span>{" "}
                Никнейм Игрока не должен содержать оскорбительных, нецензурных, провокационных или
                иных неприемлемых выражений. Администрация вправе потребовать смены никнейма.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.4.</span>{" "}
                Запрещено использование никнеймов, имитирующих никнеймы членов Администрации или
                известных личностей с целью введения в заблуждение.
              </p>
              <p>
                <span className="text-gray-500 font-medium">3.5.</span>{" "}
                Использование мультиаккаунтов (нескольких аккаунтов одним лицом) запрещено, если
                иное не разрешено Администрацией.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              4. Правила чата
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">4.1.</span>{" "}
                Запрещены оскорбления, унижения, угрозы, дискриминация по любому признаку
                (национальность, раса, пол, религия и т.д.) в любой форме общения (чат, личные
                сообщения, Discord и т.д.).
              </p>
              <p>
                <span className="text-gray-500 font-medium">4.2.</span>{" "}
                Запрещён спам, флуд, чрезмерное использование Caps Lock, а также реклама сторонних
                проектов, сайтов и сервисов без разрешения Администрации.
              </p>
              <p>
                <span className="text-gray-500 font-medium">4.3.</span>{" "}
                Запрещено распространение персональных данных других игроков (доксинг) без их
                согласия.
              </p>
              <p>
                <span className="text-gray-500 font-medium">4.4.</span>{" "}
                Запрещено распространение контента 18+ (порнография, насилие, шок-контент и т.д.)
                в любых каналах общения проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">4.5.</span>{" "}
                Запрещены попытки обхода чат-фильтров, включая замену символов, использование
                транслита или иных способов для передачи запрещённого контента.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              5. Донат и привилегии
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">5.1.</span>{" "}
                Донат (пожертвование) является добровольным. Приобретённые привилегии и предметы
                предоставляются в соответствии с публичной офертой, размещённой на сайте проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.2.</span>{" "}
                Привилегии не дают права нарушать Правила сервера. Наличие привилегии не
                освобождает от ответственности за нарушения.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.3.</span>{" "}
                Администрация вправе изменять состав и возможности привилегий в целях баланса
                игрового процесса.
              </p>
              <p>
                <span className="text-gray-500 font-medium">5.4.</span>{" "}
                Возврат средств за донат осуществляется в соответствии с условиями публичной
                оферты.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              6. Анти-чарджбек политика
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">6.1.</span>{" "}
                Чарджбек (принудительный возврат платежа через банк или платёжную систему) является
                грубым нарушением условий использования Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.2.</span>{" "}
                В случае инициирования чарджбека аккаунт Игрока блокируется навсегда без
                возможности разблокировки.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.3.</span>{" "}
                Все приобретённые привилегии, предметы и игровая валюта на заблокированном аккаунте
                аннулируются без возможности восстановления.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.4.</span>{" "}
                Администрация оставляет за собой право взыскать убытки, понесённые в результате
                чарджбека, в соответствии с действующим законодательством.
              </p>
              <p>
                <span className="text-gray-500 font-medium">6.5.</span>{" "}
                Если у Игрока возникли проблемы с платежом, рекомендуется обращаться в службу
                поддержки Проекта, а не инициировать чарджбек.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              7. Политика конфиденциальности
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">7.1.</span>{" "}
                Администрация собирает и хранит минимально необходимые данные для функционирования
                Проекта (никнейм, IP-адрес, данные об активности на сервере).
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.2.</span>{" "}
                Персональные данные Игроков не передаются третьим лицам, за исключением случаев,
                предусмотренных законодательством Российской Федерации.
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.3.</span>{" "}
                Администрация принимает разумные меры для защиты данных Игроков, но не несёт
                ответственности за утечки, произошедшие по вине третьих лиц.
              </p>
              <p>
                <span className="text-gray-500 font-medium">7.4.</span>{" "}
                Игрок вправе запросить удаление своих персональных данных, обратившись в службу
                поддержки. При этом аккаунт будет удалён без возможности восстановления.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-unbounded text-lg sm:text-xl font-semibold text-white mb-5">
              8. Заключительные положения
            </h2>
            <div className="space-y-3 pl-1">
              <p>
                <span className="text-gray-500 font-medium">8.1.</span>{" "}
                Настоящие Правила действуют с момента их публикации и до их отмены или замены
                Администрацией.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.2.</span>{" "}
                Все вопросы и предложения по Правилам можно направлять через официальные каналы
                поддержки Проекта.
              </p>
              <p>
                <span className="text-gray-500 font-medium">8.3.</span>{" "}
                Продолжая использовать сервер после изменения Правил, Игрок подтверждает своё
                согласие с обновлёнными Правилами.
              </p>
            </div>
          </section>

          {/* Safety recommendation */}
          <section>
            <div className="rounded-xl border border-ms-blue/20 bg-ms-blue/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-ms-blue/15 border border-ms-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="ShieldCheck" size={20} className="text-ms-blue-bright" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Рекомендация безопасности</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Для безопасности вашего аккаунта рекомендуем использовать сложные пароли и не
                  передавать данные для входа третьим лицам. При возникновении проблем с аккаунтом
                  или подозрении на несанкционированный доступ обращайтесь в поддержку:{" "}
                  <span className="text-ms-blue-bright">@mineshovel_bot</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Rules;
