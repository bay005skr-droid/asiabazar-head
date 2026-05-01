import Link from 'next/link'

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const MaxIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

export function SocialChannelsSection() {
  return (
    <section className="py-16 bg-brand-dark relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-brand-red/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-3">Следите за нами</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Больше информации
          </h2>
          <p className="text-white/40 text-base mb-10 leading-relaxed">
            Подписывайтесь на наши каналы — актуальные авто, цены, новости рынка и советы по выбору машины из Кореи.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://t.me/asiabazarkr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 bg-[#229ED9] hover:bg-[#1a8bc4] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#229ED9]/20"
            >
              <TelegramIcon />
              Подписаться в Telegram
            </Link>

            <Link
              href="https://max.ru/join/QufBAWxXDzIyo_6_tokZ4e_SEJCTy7bH_9_KYQ10Hjs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 bg-white/8 border border-white/12 hover:bg-white/12 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MaxIcon />
              Подписаться в MAX
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
