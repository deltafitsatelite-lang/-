import Link from "next/link";

const navigationItems = [
  { href: "/", label: "ホーム" },
  { href: "/customers", label: "顧客管理" },
  { href: "/assignments", label: "課題作成" },
  { href: "/books", label: "書籍管理" },
  { href: "/templates", label: "テンプレート管理" },
] as const;

export function AppNavigation() {
  return (
    <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-xl font-bold text-slate-950">
            顧客課題PDF作成
          </Link>
          <p className="text-sm text-slate-500">
            パーソナルトレーナー向けの課題作成・PDF出力アプリ
          </p>
        </div>
        <nav aria-label="メインナビゲーション" className="flex gap-2 overflow-x-auto pb-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
