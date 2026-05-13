"use client";

import { pdf } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import type { AssignmentPlan, Customer } from "@/types";
import { AssignmentPlanPdfDocument } from "./AssignmentPlanPdfDocument";

type PdfPreviewPanelProps = {
  plan: AssignmentPlan;
  customer: Customer;
};

const createFileName = (plan: AssignmentPlan, customer: Customer) =>
  `${customer.name}_${plan.title}_${plan.startDate}_${plan.endDate}.pdf`.replace(/[\\/:*?"<>|\s]+/g, "_");

export function PdfPreviewPanel({ plan, customer }: PdfPreviewPanelProps) {
  const document = useMemo(() => <AssignmentPlanPdfDocument plan={plan} customer={customer} />, [customer, plan]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let currentObjectUrl: string | null = null;
    let isCancelled = false;

    setIsGenerating(true);
    setErrorMessage(null);
    setPdfUrl(null);

    const generatePdf = async () => {
      try {
        const blob = await pdf(document).toBlob();

        if (isCancelled) {
          return;
        }

        currentObjectUrl = URL.createObjectURL(blob);
        setPdfUrl(currentObjectUrl);
      } catch (error) {
        console.error(error);

        if (!isCancelled) {
          setErrorMessage("PDFの生成に失敗しました。入力内容を保存してから、ページを再読み込みしてもう一度お試しください。");
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    void generatePdf();

    return () => {
      isCancelled = true;

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [document]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">PDFプレビュー</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">LINE送信用PDFを確認</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A4縦で出力します。スマホで見やすいように、要点を短くまとめた日別カードと大きめのチェック欄を優先しています。
          </p>
        </div>

        {pdfUrl ? (
          <a
            href={pdfUrl}
            download={createFileName(plan, customer)}
            className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
          >
            PDFをダウンロード
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="rounded-full bg-blue-300 px-5 py-3 text-center text-sm font-bold text-white"
          >
            {isGenerating ? "PDFを生成中..." : "PDFを生成できません"}
          </button>
        )}
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        {pdfUrl ? (
          <iframe title="PDFプレビュー" src={pdfUrl} className="h-[70vh] min-h-[420px] w-full" />
        ) : (
          <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm font-semibold text-slate-500">
            {isGenerating ? "PDFを生成中です..." : "PDFプレビューを表示できません。"}
          </div>
        )}
      </div>
    </section>
  );
}
