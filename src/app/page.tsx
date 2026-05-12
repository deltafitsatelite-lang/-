import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const featureCards = [
  {
    href: "/customers",
    title: "顧客管理",
    description: "顧客の目標、生活習慣、怪我や使える器具を登録します。",
  },
  {
    href: "/assignments",
    title: "課題作成",
    description: "次回トレーニングまでの課題を作成し、PDF出力につなげます。",
  },
  {
    href: "/books",
    title: "書籍管理",
    description: "顧客に合わせた学習課題で使う書籍を管理します。",
  },
  {
    href: "/templates",
    title: "テンプレート管理",
    description: "よく使う課題文や種目セットを再利用できる形で管理します。",
  },
] as const;

export default function Home() {
  return (
    <>
      <PageHeader
        title="顧客課題PDF作成Webアプリ"
        description="パーソナルトレーニングの顧客に向けて、次回までの課題を作成し、LINEで送りやすいPDFとして出力するための管理画面です。"
      />
      <section className="grid gap-4 md:grid-cols-2">
        {featureCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
