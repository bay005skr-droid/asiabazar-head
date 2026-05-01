import Link from 'next/link'

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export function SocialChannelsSection() {
  return (
    <section className="py-10 bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="divider-red" style={{ marginBottom: 0 }} />
          <h2 className="text-xl font-black text-gray-900">Больше информации</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-6 py-6">

          <div className="flex items-center justify-between gap-6 flex-wrap">
            <p className="text-gray-500 text-sm">
              Свежие авто в наличии, актуальные цены из Кореи, разбор утильсбора и таможни, реальные отзывы клиентов — всё это в наших каналах. Подписывайтесь, чтобы не пропустить выгодное предложение.
            </p>

            <div className="flex items-center gap-3">
              {/* Telegram */}
              <Link
                href="https://t.me/asiabazarkr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#229ED9] text-white text-sm font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] no-underline"
                style={{ boxShadow: '0 0 18px rgba(34,158,217,0.45), 0 4px 12px rgba(34,158,217,0.3)' }}
              >
                <TelegramIcon />
                Telegram
              </Link>

              {/* MAX */}
              <Link
                href="https://max.ru/join/QufBAWxXDzIyo_6_tokZ4e_SEJCTy7bH_9_KYQ10Hjs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#7B44CF] text-white text-sm font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] no-underline"
                style={{ boxShadow: '0 0 18px rgba(123,68,207,0.45), 0 4px 12px rgba(123,68,207,0.3)' }}
              >
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg/1280px-%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg.png"
                    alt="MAX"
                    className="w-4 h-auto object-contain block"
                  />
                </span>
                MAX
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
