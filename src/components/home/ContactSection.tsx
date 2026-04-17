import { ContactForm } from '@/components/forms/ContactForm'

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="divider-red mx-auto mb-4" />
        <h2 className="section-title mb-3">
          Подберём автомобиль под ваш запрос
        </h2>
        <p className="section-subtitle mb-10">
          Оставьте заявку — мы найдём лучшие варианты из Кореи
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 md:p-8 text-left">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
