import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — AsiaBazar',
  robots: 'noindex',
}

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-brand-red text-sm font-medium hover:underline mb-8 inline-block">
          ← На главную
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Политика конфиденциальности</h1>
        <p className="text-gray-400 text-sm mb-10">Последнее обновление: май 2025</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-8 text-gray-600">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных
              данных пользователей сайта <strong>asiabazar.ru</strong> (далее — «Сайт»).
              Используя Сайт, вы соглашаетесь с условиями настоящей Политики.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Какие данные мы собираем</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Имя и номер телефона — при заполнении формы обратной связи</li>
              <li>Предпочтительный мессенджер — для удобной связи</li>
              <li>Город доставки и интересующий автомобиль — для подбора предложений</li>
              <li>Технические данные: IP-адрес, тип браузера, устройство, страницы посещений — в целях аналитики</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Цели обработки данных</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Обработка заявок и связь с клиентами</li>
              <li>Подбор автомобилей из Кореи под запрос</li>
              <li>Улучшение работы Сайта и качества обслуживания</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Передача данных третьим лицам</h2>
            <p>
              Мы не продаём и не передаём ваши персональные данные третьим лицам без вашего согласия,
              за исключением случаев, предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Хранение и защита данных</h2>
            <p>
              Данные хранятся на защищённых серверах. Мы принимаем технические и организационные меры
              для защиты информации от несанкционированного доступа, изменения или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Ваши права</h2>
            <p>
              Вы вправе запросить удаление или исправление своих персональных данных, написав нам
              через любой мессенджер, указанный на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Контакты</h2>
            <p>
              По вопросам обработки персональных данных обращайтесь через Telegram:{' '}
              <a href="https://t.me/+79269264042" className="text-brand-red hover:underline">
                @asiabazarkr
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
