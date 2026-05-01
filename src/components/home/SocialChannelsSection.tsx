import Link from 'next/link'

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

// MAX logo inverted to white
const MaxLogoWhite = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg/1280px-%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg.png"
    alt="MAX"
    className="w-[38px] h-4 object-contain brightness-0 invert"
  />
)

export function SocialChannelsSection() {
  return (
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="divider-red" style={{ marginBottom: 0 }} />
          <h2 className="text-xl font-black text-gray-900">Больше информации</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-6 py-6">
          <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xl">
            Подписывайтесь на наши каналы — актуальные авто в наличии, цены, советы по выбору и реальные истории клиентов.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="https://t.me/asiabazarkr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc4] text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] no-underline"
            >
              <TelegramIcon />
              Telegram
            </Link>

            <Link
              href="https://max.ru/join/QufBAWxXDzIyo_6_tokZ4e_SEJCTy7bH_9_KYQ10Hjs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7B44CF] hover:bg-[#6A33C2] text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] no-underline"
            >
              <MaxLogoWhite />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
