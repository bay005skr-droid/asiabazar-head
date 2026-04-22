import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9',
}

const FUEL_MAP: Record<string, string> = {
  '가솔린': 'Бензин', '휘발유': 'Бензин',
  '디젤': 'Дизель', '경유': 'Дизель',
  '전기': 'Электро',
  '하이브리드': 'Гибрид',
  'lpg': 'Газ/Бензин', 'LPG': 'Газ/Бензин',
}

const TRANSMISSION_MAP: Record<string, string> = {
  '오토': 'АКПП', '자동': 'АКПП',
  '수동': 'МКПП',
  'DCT': 'Робот (DSG)', 'DSG': 'Робот (DSG)',
  'CVT': 'Вариатор',
}

const BRAND_MAP: Record<string, string> = {
  '현대': 'Hyundai', '기아': 'Kia', '제네시스': 'Genesis',
  '쉐보레': 'Chevrolet', '르노': 'Renault', '쌍용': 'SsangYong',
  'BMW': 'BMW', '벤츠': 'Mercedes-Benz', '아우디': 'Audi',
  '폭스바겐': 'Volkswagen', '볼보': 'Volvo', '렉서스': 'Lexus',
  '토요타': 'Toyota', '혼다': 'Honda', '닛산': 'Nissan',
  '포르쉐': 'Porsche', '랜드로버': 'Land Rover',
}

const MODEL_MAP: Record<string, string> = {
  '아반떼': 'Avante', '소나타': 'Sonata', '그랜저': 'Grandeur',
  '투싼': 'Tucson', '싼타페': 'Santa Fe', '팰리세이드': 'Palisade',
  '코나': 'Kona', '아이오닉': 'Ioniq', '스타리아': 'Staria',
  '스포티지': 'Sportage', 'K3': 'K3', 'K5': 'K5', 'K8': 'K8', 'K9': 'K9',
  '셀토스': 'Seltos', '쏘렌토': 'Sorento', '카니발': 'Carnival',
  'EV6': 'EV6', 'EV9': 'EV9', 'EV3': 'EV3',
  'GV70': 'GV70', 'GV80': 'GV80', 'G80': 'G80', 'G90': 'G90', 'GV60': 'GV60',
  '티볼리': 'Tivoli', '렉스턴': 'Rexton', '코란도': 'Korando',
  '모하비': 'Mohave', '스팅어': 'Stinger', '카이엔': 'Cayenne',
}

function mapVal(v: string, map: Record<string, string>): string {
  for (const [k, r] of Object.entries(map)) {
    if (v.toLowerCase().includes(k.toLowerCase())) return r
  }
  return v
}

function extractCarId(url: string): string | null {
  return url.match(/\/detail\/(\d+)/)?.[1]
    || url.match(/carid=(\d+)/)?.[1]
    || url.match(/\/(\d{7,})/)?.[1]
    || null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepFind(obj: any, keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key]
  }
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') {
      const found = deepFind(val, keys)
      if (found !== undefined) return found
    }
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseNextData(data: any, carid: string): Record<string, string | number> {
  const result: Record<string, string | number> = {}

  // Navigate into pageProps / car / vehicle data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: any = data?.props?.pageProps ?? data?.pageProps ?? data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const car: any = props?.car ?? props?.vehicle ?? props?.detail ?? props?.carDetail ?? props?.data ?? props

  // Brand
  const manufacturer = deepFind(car, ['Manufacturer', 'manufacturer', 'maker', 'Maker', 'brand', 'Brand', 'make', 'Make'])
  if (manufacturer) result.brand = mapVal(String(manufacturer), BRAND_MAP)

  // Model
  const modelGroup = deepFind(car, ['ModelGroup', 'modelGroup', 'model', 'Model', 'modelName', 'ModelName'])
  if (modelGroup) result.model = mapVal(String(modelGroup), MODEL_MAP)

  // Badge / trim
  const badge = deepFind(car, ['BadgeName', 'badgeName', 'badge', 'trim', 'Trim', 'grade', 'Grade'])

  // Year
  const year = deepFind(car, ['FormYear', 'formYear', 'year', 'Year', 'modelYear', 'ModelYear'])
  if (year) result.year = parseInt(String(year))

  // Mileage
  const mileage = deepFind(car, ['Mileage', 'mileage', 'km', 'Km', 'distance'])
  if (mileage) result.mileage = parseInt(String(mileage).replace(/,/g, ''))

  // Fuel
  const fuel = deepFind(car, ['FuelType', 'fuelType', 'fuel', 'Fuel', 'fuelName'])
  if (fuel) result.engineType = mapVal(String(fuel), FUEL_MAP)

  // Displacement
  const cc = deepFind(car, ['Displacement', 'displacement', 'engineSize', 'EngineSize', 'cc', 'Cc'])
  if (cc) result.engineVolume = `${parseInt(String(cc).replace(/,/g, ''))} см³`

  // Transmission
  const gear = deepFind(car, ['GearBox', 'gearBox', 'transmission', 'Transmission', 'gear', 'Gear'])
  if (gear) result.transmission = mapVal(String(gear), TRANSMISSION_MAP)

  // Horsepower
  const hp = deepFind(car, ['Horsepower', 'horsepower', 'power', 'Power', 'ps', 'Ps'])
  if (hp) result.horsepower = parseInt(String(hp))

  // Drive
  const drive = deepFind(car, ['DriveType', 'driveType', 'drive', 'Drive', 'wheelDrive'])
  if (drive) {
    const d = String(drive)
    if (d.includes('4WD') || d.includes('사륜')) result.drive = '4WD (полный)'
    else if (d.includes('AWD')) result.drive = 'AWD (автоматический полный)'
    else if (d.includes('후륜') || d.includes('FR') || d.includes('RWD')) result.drive = '2WD (задний)'
    else result.drive = '2WD (передний)'
  }

  // Title
  if (result.brand || result.model) {
    result.title = [result.brand, result.model, badge, result.year].filter(Boolean).join(' ')
  }

  // Price (만원)
  const price = deepFind(car, ['TotalPrice', 'totalPrice', 'Price', 'price', 'salePrice'])
  if (price) {
    const p = parseInt(String(price).replace(/,/g, ''))
    result._priceKRW = p > 10000 ? p : p * 10000
  }

  // Photos — try multiple known structures
  const photos: string[] = []
  const photoBase = deepFind(car, ['Photo', 'photo', 'photos', 'Photos', 'image', 'Image'])

  if (photoBase && typeof photoBase === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = photoBase
    const path = p.path || p.Path || p.url || p.Url || ''
    const list: string[] = Array.isArray(p.list) ? p.list
      : Array.isArray(p.List) ? p.List
      : Array.isArray(p.items) ? p.items : []

    if (list.length > 0) {
      list.slice(0, 20).forEach((item) => {
        const url = typeof item === 'string'
          ? (item.startsWith('http') ? item : `https://ci.encar.com${path}/${item}`)
          : (item as Record<string, string>)?.url || (item as Record<string, string>)?.src || ''
        if (url) photos.push(url)
      })
    } else if (path) {
      for (let i = 1; i <= 12; i++) {
        photos.push(`https://ci.encar.com${path}/${String(i).padStart(3, '0')}.jpg`)
      }
    }
  }

  // Fallback: standard encar CDN pattern
  if (photos.length === 0 && carid) {
    for (let i = 1; i <= 10; i++) {
      photos.push(`https://ci.encar.com/carpicture${carid}/${String(i).padStart(3, '0')}.jpg`)
    }
  }

  if (photos.length) result._images = photos.join('|||')

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
    const carid = extractCarId(url)

    // Always fetch fem.encar.com (mobile Next.js version — has __NEXT_DATA__)
    const fetchUrl = carid
      ? `https://fem.encar.com/cars/detail/${carid}`
      : url

    const res = await fetch(fetchUrl, {
      headers: HEADERS,
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Сайт вернул ошибку: ${res.status}` }, { status: 400 })
    }

    const html = await res.text()

    // Extract __NEXT_DATA__ JSON
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/)
    if (!nextDataMatch) {
      return NextResponse.json({ error: 'Не удалось найти данные на странице. Попробуйте другую ссылку.' }, { status: 400 })
    }

    const nextData = JSON.parse(nextDataMatch[1])
    const result = parseNextData(nextData, carid || '')

    return NextResponse.json({ data: result })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return NextResponse.json({ error: `Ошибка: ${msg}` }, { status: 500 })
  }
}
