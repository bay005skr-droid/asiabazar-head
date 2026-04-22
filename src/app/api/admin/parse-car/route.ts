import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

// Korean → Russian mappings
const FUEL_MAP: Record<string, string> = {
  '가솔린': 'Бензин', '휘발유': 'Бензин',
  '디젤': 'Дизель', '경유': 'Дизель',
  '전기': 'Электро',
  '하이브리드': 'Гибрид',
  'lpg': 'Газ/Бензин', 'LPG': 'Газ/Бензин',
}

const TRANSMISSION_MAP: Record<string, string> = {
  '자동': 'АКПП', 'A/T': 'АКПП', 'AT': 'АКПП',
  '수동': 'МКПП', 'M/T': 'МКПП', 'MT': 'МКПП',
  'DCT': 'Робот (DSG)', 'DSG': 'Робот (DSG)',
  'CVT': 'Вариатор',
}

const DRIVE_MAP: Record<string, string> = {
  '2WD': '2WD (передний)', 'FF': '2WD (передний)', 'FWD': '2WD (передний)',
  'FR': '2WD (задний)', 'RWD': '2WD (задний)',
  '4WD': '4WD (полный)', 'AWD': 'AWD (автоматический полный)',
}

const BRAND_MAP: Record<string, string> = {
  '현대': 'Hyundai', '기아': 'Kia', '제네시스': 'Genesis',
  '쉐보레': 'Chevrolet', '르노': 'Renault', '쌍용': 'SsangYong',
  'BMW': 'BMW', '벤츠': 'Mercedes-Benz', '아우디': 'Audi',
  '폭스바겐': 'Volkswagen', '볼보': 'Volvo', '렉서스': 'Lexus',
  '토요타': 'Toyota', '혼다': 'Honda', '닛산': 'Nissan',
  '포르쉐': 'Porsche', '랜드로버': 'Land Rover', '재규어': 'Jaguar',
}

const MODEL_MAP: Record<string, string> = {
  '아반떼': 'Avante', '소나타': 'Sonata', '그랜저': 'Grandeur',
  '투싼': 'Tucson', '싼타페': 'Santa Fe', '팰리세이드': 'Palisade',
  '코나': 'Kona', '아이오닉': 'Ioniq', '스타리아': 'Staria',
  '스포티지': 'Sportage', 'K3': 'K3', 'K5': 'K5', 'K8': 'K8', 'K9': 'K9',
  '셀토스': 'Seltos', '쏘렌토': 'Sorento', '카니발': 'Carnival',
  'EV6': 'EV6', 'EV9': 'EV9', 'GV70': 'GV70', 'GV80': 'GV80',
  'G80': 'G80', 'G90': 'G90',
}

function extractMeta(html: string, property: string): string {
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'))
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'))
  return match?.[1]?.trim() ?? ''
}

function extractText(html: string, pattern: RegExp): string {
  return html.match(pattern)?.[1]?.trim() ?? ''
}

function mapKorean(value: string, map: Record<string, string>): string {
  for (const [kor, rus] of Object.entries(map)) {
    if (value.toLowerCase().includes(kor.toLowerCase())) return rus
  }
  return ''
}

export async function POST(request: NextRequest) {
  const auth = await getAdminSession()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json().catch(() => ({}))
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL обязателен' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Сайт вернул ошибку: ${res.status}` }, { status: 400 })
    }

    const html = await res.text()
    const result: Record<string, string | number> = {}

    // ── Title / Brand / Model / Year ──
    const ogTitle = extractMeta(html, 'og:title')
    if (ogTitle) {
      // encar format: "2023 현대 아반떼 (AD) CN7 1.6 스마트"
      const yearMatch = ogTitle.match(/\b(19|20)\d{2}\b/)
      if (yearMatch) result.year = parseInt(yearMatch[0])

      for (const [kor, eng] of Object.entries(BRAND_MAP)) {
        if (ogTitle.includes(kor)) { result.brand = eng; break }
      }
      for (const [kor, eng] of Object.entries(MODEL_MAP)) {
        if (ogTitle.includes(kor)) { result.model = eng; break }
      }

      if (result.brand && result.model) {
        result.title = `${result.brand} ${result.model}${result.year ? ' ' + result.year : ''}`
      }
    }

    // ── Price (encar shows in 만원, 1만원 = 10,000 KRW) ──
    // KRW → RUB rough conversion: 1 KRW ≈ 0.075 RUB (adjust as needed)
    const priceManwon = extractText(html, /(\d[\d,]+)\s*만원/)
    if (priceManwon) {
      const krw = parseInt(priceManwon.replace(/,/g, '')) * 10000
      // Leave price as 0 — user sets RUB price manually
      result._priceKRW = krw
    }

    // ── Year (fallback from page body) ──
    if (!result.year) {
      const yearMatch = html.match(/연식[^>]*>?\s*(\d{4})[년\s]/)
      if (yearMatch) result.year = parseInt(yearMatch[1])
    }

    // ── Mileage ──
    const mileageMatch = html.match(/주행거리[^>]*>?[^<]*?([\d,]+)\s*km/i)
      ?? html.match(/([\d,]+)\s*km/)
    if (mileageMatch) {
      result.mileage = parseInt(mileageMatch[1].replace(/,/g, ''))
    }

    // ── Engine type ──
    const fuelMatch = html.match(/연료[^>]*>?[^<]*(가솔린|휘발유|디젤|경유|전기|하이브리드|LPG)/i)
      ?? html.match(/(가솔린|휘발유|디젤|경유|전기|하이브리드|LPG)/i)
    if (fuelMatch) {
      result.engineType = mapKorean(fuelMatch[1], FUEL_MAP) || fuelMatch[1]
    }

    // ── Engine volume ──
    const ccMatch = html.match(/([\d.]+)\s*cc/i) ?? html.match(/배기량[^>]*>?[^<]*([\d,]+)/)
    if (ccMatch) {
      const cc = parseInt(ccMatch[1].replace(/,/g, ''))
      result.engineVolume = `${cc} см³`
    }
    const literMatch = html.match(/([\d.]+)\s*[Ll](?:\s|<|엔진)/)
    if (!result.engineVolume && literMatch) {
      result.engineVolume = `${parseFloat(literMatch[1]) * 1000} см³`
    }

    // ── Transmission ──
    const transMatch = html.match(/변속기[^>]*>?[^<]*(자동|수동|DCT|CVT|DSG)/i)
      ?? html.match(/(자동|수동|A\/T|M\/T|DCT|CVT)/i)
    if (transMatch) {
      result.transmission = mapKorean(transMatch[1], TRANSMISSION_MAP) || transMatch[1]
    }

    // ── Drive ──
    const driveMatch = html.match(/구동방식[^>]*>?[^<]*(2WD|4WD|AWD|FF|FR|FWD|RWD)/i)
      ?? html.match(/\b(2WD|4WD|AWD)\b/i)
    if (driveMatch) {
      result.drive = mapKorean(driveMatch[1].toUpperCase(), DRIVE_MAP) || driveMatch[1]
    }

    // ── Horsepower ──
    const hpMatch = html.match(/([\d]+)\s*마력/) ?? html.match(/([\d]+)\s*ps/i) ?? html.match(/([\d]+)\s*hp/i)
    if (hpMatch) result.horsepower = parseInt(hpMatch[1])

    // ── Images (og:image) ──
    const images: string[] = []
    const ogImage = extractMeta(html, 'og:image')
    if (ogImage) images.push(ogImage)

    // Extract additional images from JSON-like data
    const imgRegex = /"(?:ImageUrl|imageUrl|img_url|photo_url)":\s*"([^"]+)"/g
    let imgMatch: RegExpExecArray | null
    while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 10) {
      const imgUrl = imgMatch[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/')
      if (imgUrl.startsWith('http') && !images.includes(imgUrl)) {
        images.push(imgUrl)
      }
    }

    if (images.length > 0) result._images = images.join('|||')

    return NextResponse.json({ data: result })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return NextResponse.json({ error: `Не удалось загрузить страницу: ${msg}` }, { status: 500 })
  }
}
