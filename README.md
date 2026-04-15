# АзияБазар — Автомобили из Южной Кореи

Полноценный Next.js 14 сайт для лидогенерации под заказ авто из Кореи.

## Стек
- **Next.js 14** (App Router, SSR/SSG)
- **TypeScript**
- **Tailwind CSS** (тёмная тема, красные акценты)
- **Prisma + SQLite** (→ легко меняется на PostgreSQL)
- **jose** для JWT-сессий в админке
- **React Hook Form + Zod** для форм

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Создать БД и применить схему
npx prisma db push

# 3. Наполнить демо-данными (10 авто, отзывы, статья, статистика)
npm run db:seed

# 4. Запустить
npm run dev
```

Откройте http://localhost:3000

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная (hero, каталог, статья, как работаем, статистика, отзывы, FAQ, форма) |
| `/catalog` | Каталог с фильтрами и сортировкой |
| `/catalog/[slug]` | Страница автомобиля (галерея, характеристики, форма, похожие) |
| `/articles/kakie-avto-vygodno-prignat` | Статья с псевдо-live счётчиком просмотров |
| `/quiz` | Форма подбора |
| `/admin` | Дашборд (пароль: `buyer005code`) |
| `/admin/cars` | Список авто + CRUD |
| `/admin/cars/new` | Добавить авто |
| `/admin/cars/[id]/edit` | Редактировать авто |
| `/admin/requests` | Заявки из форм |
| `/admin/reviews` | Управление отзывами |
| `/admin/stats` | Статистика (счётчики на главной) |
| `/admin/article` | Редактирование статьи |

## Переменные окружения (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
ADMIN_PASSWORD="buyer005code"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Для production** — смените `ADMIN_PASSWORD` и `JWT_SECRET`.

## Переход на PostgreSQL

В `prisma/schema.prisma` замените:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Обновите `DATABASE_URL` на строку подключения PostgreSQL и запустите `npx prisma db push`.

## Структура проекта

```
src/
├── app/
│   ├── page.tsx                    # Главная
│   ├── catalog/page.tsx            # Каталог
│   ├── catalog/[slug]/page.tsx     # Страница авто
│   ├── articles/[slug]/page.tsx    # Статья
│   ├── quiz/page.tsx               # Квиз
│   ├── admin/                      # Вся админка
│   └── api/                        # API routes
├── components/
│   ├── layout/                     # Header, Footer, FloatingButtons
│   ├── home/                       # Все секции главной
│   ├── cars/                       # CarCard, CatalogFilters, ImageGallery
│   ├── forms/                      # ContactForm
│   └── admin/                      # Компоненты админки
├── lib/
│   ├── prisma.ts                   # Prisma client
│   ├── auth.ts                     # JWT auth
│   └── utils.ts                    # Хелперы
├── types/index.ts                  # TypeScript типы
├── hooks/useArticleViews.ts        # Псевдо-live счётчик просмотров
└── middleware.ts                   # Защита /admin/*
```

## Особенности реализации

- **Псевдо-live просмотры статьи** — стартуют с ~4847, растут на 15–50 каждые 60 сек в рамках сессии (sessionStorage)
- **Псевдо-live отзывы** — карусель с автосменой каждые 7 сек + периодический бейдж «Новый отзыв»
- **Анимированные счётчики** — запускаются при скролле до блока (IntersectionObserver)
- **Авторизация** — httpOnly cookie с JWT, проверка на сервере, middleware на `/admin/*`
- **Загрузка файлов** — в `/public/uploads/` (dev), заменяется на S3 в prod

## Добавление авто

Через админку: `/admin/cars/new`  
Или через seed: отредактируйте `prisma/seed.ts` и выполните `npm run db:seed`
