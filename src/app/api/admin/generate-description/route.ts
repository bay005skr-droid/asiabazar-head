import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = await getAdminSession()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY не настроен' }, { status: 500 })

  const body = await request.json().catch(() => ({}))
  const { brand, model, year, engineType, engineVolume, horsepower, transmission, drive, bodyType, mileage, configuration, price } = body

  if (!brand || !model) return NextResponse.json({ error: 'Укажите марку и модель' }, { status: 400 })

  const carInfo = [
    `${brand} ${model}`,
    year && `Год: ${year}`,
    engineVolume && engineType && `Двигатель: ${engineVolume} ${engineType}`,
    horsepower && `Мощность: ${horsepower} л.с.`,
    configuration && `Комплектация: ${configuration}`,
    transmission && `Коробка передач: ${transmission}`,
    drive && `Привод: ${drive}`,
    bodyType && `Тип кузова: ${bodyType}`,
    mileage && `Пробег: ${Number(mileage).toLocaleString('ru-RU')} км`,
    price && `Цена: ${Number(price).toLocaleString('ru-RU')} ₽`,
  ].filter(Boolean).join('\n')

  const prompt = `Ты — менеджер по продажам автомобилей из Кореи. Напиши продающее описание автомобиля для сайта на русском языке.

Данные автомобиля:
${carInfo}

Требования:
- 3-4 абзаца, живой продающий текст без шаблонных фраз
- Упомяни ключевые характеристики естественно, не как список
- Не используй слова "представляем", "рады предложить", "идеальный выбор"
- Без markdown, без заголовков, только чистый текст абзацами
- Объём: 150-220 слов`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[generate-description] Claude error:', err)
      return NextResponse.json({ error: 'Ошибка генерации' }, { status: 500 })
    }

    const data = await res.json()
    const text = data?.content?.[0]?.text ?? ''
    return NextResponse.json({ description: text.trim() })
  } catch (e) {
    console.error('[generate-description]', e)
    return NextResponse.json({ error: 'Ошибка подключения к AI' }, { status: 500 })
  }
}
