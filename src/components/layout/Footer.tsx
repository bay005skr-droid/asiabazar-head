import Link from 'next/link'
import { Settings } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo & Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
                <span className="text-white font-black text-sm">АБ</span>
              </div>
              <span className="text-white font-bold text-xl">АзияБазар</span>
            </Link>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Подбор, проверка и доставка автомобилей из Южной Кореи под заказ. Работаем с 2019 года.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/catalog" className="text-white/40 hover:text-white transition-colors">Каталог</Link>
            <Link href="/articles/kakie-avto-vygodno-prignat" className="text-white/40 hover:text-white transition-colors">Статья</Link>
            <Link href="/#how-we-work" className="text-white/40 hover:text-white transition-colors">Как работаем</Link>
            <Link href="/#reviews" className="text-white/40 hover:text-white transition-colors">Отзывы</Link>
            <Link href="/#contact" className="text-white/40 hover:text-white transition-colors">Контакты</Link>
            <Link href="/quiz" className="text-white/40 hover:text-white transition-colors">Подобрать авто</Link>
          </div>

          {/* Messengers */}
          <div className="flex flex-col gap-2 text-sm text-white/40">
            <span className="font-medium text-white/60">Связаться с нами</span>
            <a href="https://t.me/asiabazar25" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
            <a href="https://wa.me/79149999999" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            <a href="https://max.ru/asiabazar25" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MAX</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} АзияБазар. Все права защищены.
          </p>
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-white/10 hover:text-white/30 transition-colors text-xs"
            title="Панель управления"
          >
            <Settings size={12} />
            <span>вход</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
