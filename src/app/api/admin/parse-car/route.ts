import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, */*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
  'Referer': 'https://www.encar.com/',
  'Origin': 'https://www.encar.com',
}

const FUEL_MAP: Record<string, string> = {
  '가솔린': 'Бензин', '휘발유': 'Бензин',
  '디젤': 'Дизель', '경유': 'Дизель',
  '전기': 'Электро',
  '하이브리드': 'Гибрид',
  'lpg': 'Газ/Бензин',
}
const TRANS_MAP: Record<string, string> = {
  '오토': 'АКПП', '자동': 'АКПП', 'A/T': 'АКПП',
  '수동': 'МКПП', 'M/T': 'МКПП',
  'DCT': 'Робот (DSG)', 'CVT': 'Вариатор',
}
const BRAND_MAP: Record<string, string> = {
  '현대': 'Hyundai', '기아': 'Kia', '제네시스': 'Genesis',
  '쉐보레': 'Chevrolet', '르노코리아': 'Renault', '르노삼성': 'Renault', '르노': 'Renault', '쌍용': 'SsangYong', 'KG모빌리티': 'KG Mobility',
  'BMW': 'BMW', '벤츠': 'Mercedes-Benz', '메르세데스': 'Mercedes-Benz', '아우디': 'Audi',
  '폭스바겐': 'Volkswagen', '볼보': 'Volvo', '렉서스': 'Lexus',
  '토요타': 'Toyota', '혼다': 'Honda', '닛산': 'Nissan',
  '포르쉐': 'Porsche', '랜드로버': 'Land Rover', '재규어': 'Jaguar',
  '링컨': 'Lincoln', '캐딜락': 'Cadillac', '지프': 'Jeep', '크라이슬러': 'Chrysler',
  '미니': 'MINI', '푸조': 'Peugeot', '시트로엥': 'Citroen',
}
const MODEL_MAP: Record<string, string> = {
  '아반떼': 'Avante', '소나타': 'Sonata', '그랜저': 'Grandeur',
  '투싼': 'Tucson', '싼타페': 'Santa Fe', '팰리세이드': 'Palisade',
  '코나': 'Kona', '아이오닉': 'Ioniq', '스타리아': 'Staria',
  '스포티지': 'Sportage', 'K3': 'K3', 'K5': 'K5', 'K8': 'K8', 'K9': 'K9',
  '셀토스': 'Seltos', '쏘렌토': 'Sorento', '카니발': 'Carnival',
  'EV6': 'EV6', 'EV9': 'EV9', 'EV3': 'EV3',
  'GV70': 'GV70', 'GV80': 'GV80', 'G80': 'G80', 'G90': 'G90', 'GV60': 'GV60', 'G70': 'G70',
  '티볼리': 'Tivoli', '렉스턴': 'Rexton', '코란도': 'Korando', '모하비': 'Mohave',
  'SM6': 'SM6', 'SM5': 'SM5', 'SM3': 'SM3', 'QM6': 'QM6', 'QM3': 'QM3', 'QM5': 'QM5',
  '말리부': 'Malibu', '트레일블레이저': 'Trailblazer', '트랙스': 'Trax', '이쿼녹스': 'Equinox',
  '아이오닉5': 'Ioniq 5', '아이오닉6': 'Ioniq 6',
}

function map(v: string, m: Record<string, string>) {
  for (const [k, r] of Object.entries(m)) if (v.toLowerCase().includes(k.toLowerCase())) return r
  return v
}

function extractCarId(url: string): string | null {
  return url.match(/\/detail\/(\d+)/)?.[1]
    || url.match(/carid=(\d+)/)?.[1]
    || url.match(/\/(\d{7,})/)?.[1]
    || null
}

async function tryFetch(url: string, headers = BASE_HEADERS) {
  try {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(10000) })
    return r
  } catch (e) { console.log(`[parse-car] fetch error: ${e}`); return null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEncarJson(d: any, carid: string): Record<string, string | number> {
  const result: Record<string, string | number> = {}
  if (!d) return result

  console.log(`[parse-car] parseEncarJson top-keys=${Object.keys(d).join(',')}`)

  const str = (x: unknown) => (x != null ? String(x) : '')

  // ── v1/readside/vehicle structure: { category, spec, performance, advertisement, photos } ──
  if (d.category) {
    const cat = d.category
    const spec = d.spec ?? {}
    const perf = d.performance ?? {}
    const advert = d.advertisement ?? d.price ?? {}

    const mfr = str(cat.manufacturerName ?? '')
    if (mfr) result.brand = map(mfr, BRAND_MAP)

    const mdl = str(cat.modelName ?? '')
    if (mdl) result.model = map(mdl, MODEL_MAP)

    const badge = str(cat.gradeName ?? cat.gradeEnglishName ?? '')

    const yr = parseInt(str(cat.formYear ?? cat.yearMonth?.slice(0, 4) ?? ''))
    if (yr) result.year = yr

    const km = parseInt(str(spec.mileage ?? perf.mileage ?? '').replace(/,/g, ''))
    if (km) result.mileage = km

    const fuel = str(spec.fuelName ?? spec.fuel ?? cat.fuelName ?? '')
    if (fuel) result.engineType = map(fuel, FUEL_MAP)

    const cc = parseInt(str(spec.displacement ?? spec.engineDisplacement ?? '').replace(/,/g, ''))
    if (cc) result.engineVolume = `${cc} см³`

    const gear = str(spec.transmissionName ?? spec.transmission ?? '')
    if (gear) result.transmission = map(gear, TRANS_MAP)

    const hp = parseInt(str(spec.maximumPower ?? spec.enginePower ?? perf.maximumPower ?? ''))
    if (hp) result.horsepower = hp

    if (result.brand || result.model) {
      result.title = [result.brand, result.model, badge, yr || ''].filter(Boolean).join(' ').trim()
    }

    const rawPrice = parseInt(str(advert.price ?? advert.totalPrice ?? '').replace(/,/g, ''))
    if (rawPrice) result._priceKRW = rawPrice > 100000 ? rawPrice : rawPrice * 10000

    // Photos — v1 API: photos array or photo.list
    const photos: string[] = []
    const photoArr = d.photos ?? d.photo
    if (Array.isArray(photoArr) && photoArr.length) {
      photoArr.slice(0, 20).forEach((p: { path?: string; imagePath?: string; url?: string }) => {
        const u = p.url ?? p.imagePath ?? p.path ?? ''
        if (u) photos.push(u.startsWith('http') ? u : `https://ci.encar.com${u}`)
      })
    } else if (photoArr && typeof photoArr === 'object') {
      const path = str(photoArr.path ?? photoArr.Path ?? '')
      const list: string[] = Array.isArray(photoArr.list) ? photoArr.list : []
      if (list.length) {
        list.slice(0, 20).forEach((p: string) => {
          photos.push(p.startsWith('http') ? p : `https://ci.encar.com${path}/${p}`)
        })
      } else if (path) {
        for (let i = 1; i <= 12; i++) photos.push(`https://ci.encar.com${path}/${String(i).padStart(3,'0')}.jpg`)
      }
    }
    if (!photos.length && carid) {
      for (let i = 1; i <= 10; i++) photos.push(`https://ci.encar.com/carpicture${carid}/${String(i).padStart(3,'0')}.jpg`)
    }
    if (photos.length) result._images = photos.join('|||')

    console.log(`[parse-car] v1 parsed: brand=${result.brand} model=${result.model} year=${result.year} km=${result.mileage} fuel=${result.engineType} gear=${result.transmission} photos=${photos.length}`)
    return result
  }

  // ── encar search API: { SearchResults: [{ Vehicle: {...} }] } ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v: any = d?.SearchResults?.[0]?.Vehicle ?? d?.Vehicle ?? d?.vehicle ?? d?.car ?? d

  const mfr = str(v?.Manufacturer ?? v?.maker ?? v?.brand ?? '')
  if (mfr) result.brand = map(mfr, BRAND_MAP)

  const mdl = str(v?.ModelGroup ?? v?.modelGroup ?? v?.model ?? '')
  if (mdl) result.model = map(mdl, MODEL_MAP)

  const badge = str(v?.BadgeName ?? v?.badge ?? v?.trim ?? '')

  const yr = parseInt(str(v?.FormYear ?? v?.year ?? ''))
  if (yr) result.year = yr

  const km = parseInt(str(v?.Mileage ?? v?.mileage ?? '').replace(/,/g, ''))
  if (km) result.mileage = km

  const fuel = str(v?.FuelType ?? v?.fuel ?? '')
  if (fuel) result.engineType = map(fuel, FUEL_MAP)

  const cc = parseInt(str(v?.Displacement ?? v?.displacement ?? '').replace(/,/g, ''))
  if (cc) result.engineVolume = `${cc} см³`

  const gear = str(v?.GearBox ?? v?.gearBox ?? v?.transmission ?? '')
  if (gear) result.transmission = map(gear, TRANS_MAP)

  const hp = parseInt(str(v?.Horsepower ?? v?.horsepower ?? v?.power ?? ''))
  if (hp) result.horsepower = hp

  if (result.brand || result.model) {
    result.title = [result.brand, result.model, badge, yr || ''].filter(Boolean).join(' ').trim()
  }

  const rawPrice = parseInt(str(v?.Price ?? d?.TotalPrice ?? d?.price ?? '').replace(/,/g, ''))
  if (rawPrice) result._priceKRW = rawPrice > 100000 ? rawPrice : rawPrice * 10000

  // Photos
  const photos: string[] = []
  const photo = v?.Photo ?? v?.photo ?? v?.photos
  if (photo) {
    const path = photo?.path ?? photo?.Path ?? ''
    const list: string[] = Array.isArray(photo?.list) ? photo.list : []
    if (list.length) {
      list.slice(0, 20).forEach((p: string) => {
        photos.push(p.startsWith('http') ? p : `https://ci.encar.com${path}/${p}`)
      })
    } else if (path) {
      for (let i = 1; i <= 12; i++) photos.push(`https://ci.encar.com${path}/${String(i).padStart(3,'0')}.jpg`)
    }
  }

  if (!photos.length && carid) {
    for (let i = 1; i <= 10; i++) photos.push(`https://ci.encar.com/carpicture${carid}/${String(i).padStart(3,'0')}.jpg`)
  }
  if (photos.length) result._images = photos.join('|||')

  return result
}

function parseHtml(html: string, carid: string): Record<string, string | number> {
  const result: Record<string, string | number> = {}

  const og = (prop: string) => html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`))?.[1]
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`))?.[1] ?? ''

  const title = og('title')
  if (title) {
    const yr = title.match(/\b(20\d{2})\b/)
    if (yr) result.year = parseInt(yr[1])
    for (const [k, v] of Object.entries(BRAND_MAP)) if (title.includes(k)) { result.brand = v; break }
    for (const [k, v] of Object.entries(MODEL_MAP)) if (title.includes(k)) { result.model = v; break }
    if (result.brand && result.model) result.title = [result.brand, result.model, result.year].filter(Boolean).join(' ')
  }

  const km = html.match(/주행거리[^<]*([\d,]+)\s*km/i) ?? html.match(/([\d,]+)\s*km/)
  if (km) result.mileage = parseInt(km[1].replace(/,/g, ''))

  const fuel = html.match(/(가솔린|휘발유|디젤|경유|전기|하이브리드|LPG)/i)
  if (fuel) result.engineType = map(fuel[1], FUEL_MAP)

  const cc = html.match(/([\d,]+)\s*cc/i)
  if (cc) result.engineVolume = `${parseInt(cc[1].replace(/,/g, ''))} см³`

  const gear = html.match(/(자동|오토|수동|DCT|CVT)/i)
  if (gear) result.transmission = map(gear[1], TRANS_MAP)

  // CDN photos
  if (carid) {
    const photos: string[] = []
    for (let i = 1; i <= 10; i++) photos.push(`https://ci.encar.com/carpicture${carid}/${String(i).padStart(3,'0')}.jpg`)
    result._images = photos.join('|||')
  }

  return result
}

export async function POST(request: NextRequest) {
  const auth = await getAdminSession()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json().catch(() => ({}))
  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'URL обязателен' }, { status: 400 })

  const carid = extractCarId(url)
  if (!carid) return NextResponse.json({ error: 'Не удалось определить ID автомобиля из ссылки' }, { status: 400 })

  try {
    console.log(`[parse-car] carid=${carid}`)

    // 1. Try encar search/list API (returns rich JSON)
    const apiUrls = [
      `https://api.encar.com/search/car/list/general?count=1&q=(And.Hidden.N._.CarNo.${carid}.)&sr=%7CModifiedDate%7C0%7C1`,
      `https://api.encar.com/v1/readside/vehicle/${carid}`,
      `https://api.encar.com/readside/car/v1/vehicle/${carid}`,
    ]

    for (const apiUrl of apiUrls) {
      console.log(`[parse-car] trying API: ${apiUrl}`)
      const res = await tryFetch(apiUrl, {
        ...BASE_HEADERS,
        'Accept': 'application/json',
      })
      if (!res) { console.log(`[parse-car] no response`); continue }
      console.log(`[parse-car] status=${res.status}`)
      const text = await res.text()
      console.log(`[parse-car] body(500)=${text.slice(0, 500)}`)
      let json = null
      try { json = JSON.parse(text) } catch { console.log(`[parse-car] JSON parse failed`) }
      if (json) {
        const result = parseEncarJson(json, carid)
        console.log(`[parse-car] parsed keys=${Object.keys(result).join(',')}`)
        if (Object.keys(result).length > 2) {
          return NextResponse.json({ data: result })
        }
      }
    }

    // 2. Try desktop HTML
    const htmlUrl = `https://www.encar.com/dc/dc_cardetailview.do?carid=${carid}`
    console.log(`[parse-car] trying HTML: ${htmlUrl}`)
    const htmlRes = await tryFetch(htmlUrl)
    if (htmlRes) {
      console.log(`[parse-car] HTML status=${htmlRes.status}`)
      const html = await htmlRes.text()
      console.log(`[parse-car] HTML length=${html.length}, head(300)=${html.slice(0, 300)}`)
      // Try embedded JSON in desktop page
      const jsonStr = html.match(/var\s+inspectionInfo\s*=\s*(\{[\s\S]{10,2000}?\});/)
        ?? html.match(/dataLayer\.push\((\{[\s\S]{10,1000}?\})\)/)
      if (jsonStr) {
        console.log(`[parse-car] found embedded JSON`)
        try {
          const d = JSON.parse(jsonStr[1])
          const result = parseEncarJson(d, carid)
          if (Object.keys(result).length > 1) return NextResponse.json({ data: result })
        } catch { /* fall through */ }
      }
      const result = parseHtml(html, carid)
      console.log(`[parse-car] HTML parse keys=${Object.keys(result).join(',')}`)
      return NextResponse.json({ data: result })
    }

    // 3. Last resort — just return CDN photos + empty fields
    console.log(`[parse-car] fallback CDN photos`)
    const photos: string[] = []
    for (let i = 1; i <= 10; i++) photos.push(`https://ci.encar.com/carpicture${carid}/${String(i).padStart(3,'0')}.jpg`)
    return NextResponse.json({ data: { _images: photos.join('|||') } })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return NextResponse.json({ error: `Ошибка: ${msg}` }, { status: 500 })
  }
}
