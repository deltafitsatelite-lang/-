"use client";

import { useEffect, useRef, useState } from "react";
import type { AssignmentPlan, Customer } from "@/types";
import { generateAssignmentPlanPdfBlob } from "./browserPdf";

type PdfPreviewPanelProps = {
  plan: AssignmentPlan;
  customer: Customer;
};

const createSafeFileName = (plan: AssignmentPlan, customer: Customer) => {
  const rawFileName = `${customer.name}_${plan.title}_${plan.startDate}_${plan.endDate}.pdf`;
  const safeFileName = rawFileName.replace(/[\\/:*?"<>|\s]+/g, "_").replace(/^_+|_+$/g, "");

  return safeFileName || `assignment_${plan.startDate}_${plan.endDate}.pdf`;
};

const getPdfErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return `PDFの生成に失敗しました。入力内容を確認し、ページを再読み込みしてもう一度お試しください。（${error.message}）`;
  }

  return "PDFの生成に失敗しました。入力内容を確認し、ページを再読み込みしてもう一度お試しください。";
};

export function PdfPreviewPanel({ plan, customer }: PdfPreviewPanelProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const planRef = useRef(plan);
  const customerRef = useRef(customer);

  useEffect(() => {
    planRef.current = plan;
    customerRef.current = customer;
  }, [customer, plan]);

  const handleDownload = async () => {
    if (typeof window === "undefined") {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const currentPlan = planRef.current;
      const currentCustomer = customerRef.current;
      const blob = await generateAssignmentPlanPdfBlob(currentPlan, currentCustomer);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = createSafeFileName(currentPlan, currentCustomer);
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("PDF generation failed", error);
      setErrorMessage(getPdfErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">PDFダウンロード</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">LINE送信用PDFを保存</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            PDFプレビューは環境によって不安定になるため、上のボタンから直接PDFを生成してダウンロードします。
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isGenerating ? "PDFを生成中..." : "PDFを生成してダウンロード"}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm font-semibold text-slate-500">
        顧客名・PDFタイトル・課題日・トレーニング課題・学習課題・メモを含むPDFを生成します。
      </div>
    </section>
  );
}
