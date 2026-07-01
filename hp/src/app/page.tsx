import { getContent } from "@/lib/content";

const NAV_LINKS = [
  { href: "#about", label: "会社概要" },
  { href: "#services", label: "サービス" },
  { href: "#works", label: "実績" },
  { href: "#access", label: "アクセス" },
  { href: "#contact", label: "お問い合わせ" },
];

export default async function Home() {
  const content = await getContent();
  const { hero, about, services, works, access, contact, footer } = content;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="text-lg font-bold tracking-tight text-slate-900">
            {footer.companyName}
          </a>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-indigo-600">
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            お問い合わせ
          </a>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-6 py-2 text-sm font-medium text-slate-600 md:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap hover:text-indigo-600">
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="flex-1 pt-28 md:pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
          <p className="text-sm font-semibold tracking-widest text-indigo-600">{hero.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-slate-600">{hero.subtitle}</p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#services"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              サービスを見る
            </a>
            <a
              href="#contact"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              お問い合わせ
            </a>
          </div>
        </section>

        {/* 会社概要 */}
        <section id="about" className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
              {about.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{about.lead}</p>
            <dl className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {about.info.map((item) => (
                <div key={item.label} className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-4 sm:gap-4">
                  <dt className="text-sm font-semibold text-slate-500 sm:col-span-1">{item.label}</dt>
                  <dd className="text-sm text-slate-800 sm:col-span-3">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* サービス */}
        <section id="services" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
              {services.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{services.lead}</p>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.items.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-3xl">{service.icon}</div>
                  <h3 className="mt-4 font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 実績 */}
        <section id="works" className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
              {works.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{works.lead}</p>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {works.items.map((work) => (
                <div key={work.title} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
                  <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {work.category}
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900">{work.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{work.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
              {access.heading}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
                地図（Googleマップ等をここに埋め込みます）
              </div>
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="text-sm font-semibold text-slate-500">住所</p>
                  <p className="mt-1">{access.address}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">アクセス</p>
                  <p className="mt-1">{access.access}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">営業時間</p>
                  <p className="mt-1">{access.hours}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">電話番号</p>
                  <p className="mt-1">{access.tel}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <section id="contact" className="bg-slate-900 py-16 text-white md:py-24">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-2xl font-bold md:text-3xl">{contact.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-slate-300">{contact.lead}</p>
            <form className="mt-10 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                  お名前
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="sample@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-200">
                  お問い合わせ内容
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="お問い合わせ内容をご記入ください"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                送信する
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        {footer.copyright}
      </footer>
    </>
  );
}
