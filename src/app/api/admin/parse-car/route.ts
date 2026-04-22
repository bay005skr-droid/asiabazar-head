import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Referer': 'https://www.encar.com/',
  'Origin': 'https://www.encar.com',
}

const FUEL_MAP: Record<string, string> = {
  '가솔린': 'Бензин', '휘발유': 'Бензин', 'gasoline': 'Бензин',
  '디젤': 'Дизель', '경유': 'Дизель', 'diesel': 'Дизель',
  '전기': 'Электро', 'electric': 'Электро',
  '하이브리드': 'Гибрид', 'hybrid': 'Гибрид',
  'lpg': 'Газ/Бензин',
}

const TRANSMISSION_MAP: Record<string, string> = {
  '오토': 'АКПП', '자동': 'АКПП', 'A/T': 'АКПП', 'AT': 'АКПП', 'auto': 'АКПП',
  '수동': 'МКПП', 'M/T': 'МКПП', 'MT': 'МКПП', 'manual': 'МКПП',
  'DCT': 'Робот (DSG)', 'DSG': 'Робот (DSG)',
  'CVT': 'Вариатор',
}

const BRAND_MAP: Record<string, string> = {
  '현대': 'Hyundai', '기아': 'Kia', '제네시스': 'Genesis',
  '쉐보레': 'Chevrolet', '르노': 'Renault', '쌍용': 'SsangYong', 'KGM': 'KGM',
  'BMW': 'BMW', '벤츠': 'Mercedes-Benz', 'Mercedes-Benz': 'Mercedes-Benz',
  '아우디': 'Audi', 'Audi': 'Audi',
  '폭스바겐': 'Volkswagen', '볼보': 'Volvo',
  '렉서스': 'Lexus', '토요타': 'Toyota', '혼다': 'Honda', '닛산': 'Nissan',
  '포르쉐': 'Porsche', '랜드로버': 'Land Rover',
}

const MODEL_MAP: Record<string, string> = {
  '아반떼': 'Avante', '소나타': 'Sonata', '그랜저': 'Grandeur', '아이오닉': 'Ioniq',
  '투싼': 'Tucson', '싼타페': 'Santa Fe', '팰리세이드': 'Palisade',
  '코나': 'Kona', '스타리아': 'Staria', '넥쏘': 'Nexo',
  '스포티지': 'Sportage', 'K3': 'K3', 'K5': 'K5', 'K8': 'K8', 'K9': 'K9',
  '셀토스': 'Seltos', '쏘렌토': 'Sorento', '카니발': 'Carnival', '모하비': 'Mohave',
  'EV6': 'EV6', 'EV9': 'EV9', 'EV3': 'EV3',
  'GV70': 'GV70', 'GV80': 'GV80', 'G80': 'G80', 'G90': 'G90', 'GV60': 'GV60',
  '티볼리': 'Tivoli', '렉스턴': 'Rexton', '코란도': 'Korando',
}

function mapValue(val: string, map: Record<string, string>): string {
  const lower = val.toLowerCase()
  for (const [key, rus] of Object.entries(map)) {
    if (lower.includes(key.toLowerCase())) return rus
  }
  return val
}

function extractCarId(url: string): string | null {
  // fem.encar.com/cars/detail/41084182
  const femMatch = url.match(/encar\.com\/cars\/detail\/(\d+)/)
  if (femMatch) return femMatch[1]
  // www.encar.com/dc/dc_cardetailview.do?carid=41084182
  const caridMatch = url.match(/carid=(\d+)/)
  if (caridMatch) return caridMatch[1]
  // any trailing number
  const numMatch = url.match(/\/(\d{6,})/)
  if (numMatch) return numMatch[1]
  return null
}

async function fetchEncarApi(carid: string) {
  const endpoints = [
    `https://api.encar.com/v1/readside/vehicle/${carid}`,
    `https://api.encar.com/readside/car/v1/vehicle/${carid}`,
  ]
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { headers: HEADERS, signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        const json = await res.json()
        if (json && (json.Vehicle || json.vehicle || json.Id || json.id)) return json
      }
    } catch { /* try next */ }
  }
  return null
}

async function fetchEncarHtml(carid: string): Promise<string> {
  const url = `https://www.encar.com/dc/dc_cardetailview.do?carid=${carid}`
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) })
  return res.ok ? res.text() : ''
}

function parseFromApi(data: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v: any = data.Vehicle || data.vehicle || data
  const result: Record<string, string | number> = {}

  const manufacturer = String(v.Manufacturer || v.manufacturer || v.Make || '')
  const modelGroup   = String(v.ModelGroup   || v.modelGroup   || v.Model || '')
  const badge        = String(v.BadgeName    || v.badge        || v.Trim  || '')

  if (manufacturer) result.brand = mapValue(manufacturer, BRAND_MAP)
  if (modelGroup)   result.model = mapValue(modelGroup, MODEL_MAP)

  const year = Number(v.FormYear || v.formYear || v.Year || v.year || 0)
  if (year) result.year = year

  const mileage = Number(v.Mileage || v.mileage || 0)
  if (mileage) result.mileage = mileage

  const fuel = String(v.FuelType || v.fuelType || v.Fuel || '')
  if (fuel) result.engineType = mapValue(fuel, FUEL_MAP)

  const displacement = Number(v.Displacement || v.displacement || v.EngineSize || 0)
  if (displacement) result.engineVolume = `${displacement} см³`

  const gearbox = String(v.GearBox || v.gearBox || v.Transmission || '')
  if (gearbox) result.transmission = mapValue(gearbox, TRANSMISSION_MAP)

  const hp = Number(v.Horsepower || v.horsepower || v.Power || 0)
  if (hp) result.horsepower = hp

  // Build title
  if (result.brand && result.model) {
    result.title = [result.brand, result.model, badge, year || ''].filter(Boolean).join(' ').trim()
  }

  // Price (만원 → KRW)
  const priceManwon = Number(data.TotalPrice || data.totalPrice || v.Price || v.price || 0)
  if (priceManwon) result._priceKRW = priceManwon * 10000

  // Photos
  const photos: string[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photo: any = v.Photo || v.photo || {}
  if (photo.path) {
    const base = photo.path.replace(/\/$/, '')
    const list = Array.isArray(photo.list) ? photo.list : []
    if (list.length > 0) {
      list.slice(0, 15).forEach((p: string) => {
        const url = p.startsWith('http') ? p : `https://ci.encar.com${base}/${p}`
        photos.push(url)
      })
    } else if (base) {
      // fallback numbered photos
      for (let i = 1; i <= 10; i++) {
        photos.push(`https://ci.encar.com${base}/${String(i).padStart(3, '0')}.jpg`)
      }
    }
  }
  if (photos.length) result._images = photos.join('|||')

  return result
}

function parseFromHtml(html: string) {
  const result: Record<string, string | number> = {}
  if (!html) return result

  // Try embedded JSON
  const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?\})(?:\s*;|\s*<\/script>)/)
    || html.match(/window\.__data__\s*=\s*(\{[\s\S]+?\})(?:\s*;|\s*<\/script>)/)
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1])
      if (data) return parseFromApi(data)
    } catch { /* fall through */ }
  }

  // og:title: "2023 현대 아반떼 CN7 1.6 스마트"
  const titleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/)
  if (titleMatch) {
    const t = titleMatch[1]
    const yr = t.match(/\b(20\d{2})\b/)
    if (yr) result.year = parseInt(yr[1])
    for (const [k, v] of Object.entries(BRAND_MAP)) if (t.includes(k)) { result.brand = v; break }
    for (const [k, v] of Object.entries(MODEL_MAP)) if (t.includes(k)) { result.model = v; break }
    if (result.brand && result.model)
      result.title = [result.brand, result.model, result.year].filter(Boolean).join(' ')
  }

  const km = html.match(/주행거리[^<]*?([\d,]+)\s*km/i) || html.match(/([\d,]+)\s*km/)
  if (km) result.mileage = parseInt(km[1].replace(/,/g, ''))

  const fuel = html.match(/연료[^<]*(가솔린|휘발유|디젤|경유|전기|하이브리드|LPG)/i) || html.match(/(가솔린|디젤|전기|하이브리드)/i)
  if (fuel) result.engineType = mapValue(fuel[1], FUEL_MAP)

  const cc = html.match(/([\d,]+)\s*cc/i)
  if (cc) result.engineVolume = `${parseInt(cc[1].replace(/,/g, ''))} см³`

  const gear = html.match(/변속기[^<]*(자동|오토|수동|DCT|CVT)/i) || html.match(/(자동|오토|수동)/i)
  if (gear) result.transmission = mapValue(gear[1], TRANSMISSION_MAP)

  const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)
  if (ogImg) result._images = ogImg[1]

  return result
}

export async function POST(request: NextRequest) {
  const auth = await getAdminSession()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json().catch(() => ({}))
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL обязателен' }, { status: 400 })
  }

  try {
    const isEncar = url.includes('encar.com')
    const carid = isEncar ? extractCarId(url) : null

    let result: Record<string, string | number> = {}

    if (carid) {
      // Try JSON API first
      const apiData = await fetchEncarApi(carid)
      if (apiData) {
        result = parseFromApi(apiData)
      } else {
        // Fall back to HTML
        const html = await fetchEncarHtml(carid)
        result = parseFromHtml(html)
      }
    } else {
      // Generic HTML scraping for other sites
      const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) })
      if (!res.ok) return NextResponse.json({ error: `Сайт вернул ошибку: ${res.status}` }, { status: 400 })
      const html = await res.text()
      result = parseFromHtml(html)
    }

    return NextResponse.json({ data: result })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return NextResponse.json({ error: `Ошибка: ${msg}` }, { status: 500 })
  }
}
