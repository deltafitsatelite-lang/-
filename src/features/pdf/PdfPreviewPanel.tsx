"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AssignmentPlan, Customer } from "@/types";

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
    return `PDFの生成に失敗しました。ページを再読み込みしてもう一度お試しください。（${error.message}）`;
  }

  return "PDFの生成に失敗しました。ページを再読み込みしてもう一度お試しください。";
};

export function PdfPreviewPanel({ plan, customer }: PdfPreviewPanelProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const planRef = useRef(plan);
  const customerRef = useRef(customer);
  const pdfInputKey = useMemo(() => JSON.stringify({ plan, customer }), [customer, plan]);

  useEffect(() => {
    planRef.current = plan;
    customerRef.current = customer;
  }, [customer, plan]);

  const revokeCurrentUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const generatePdfUrl = useCallback(async () => {
    if (typeof window === "undefined") {
      throw new Error("ブラウザ環境でのみPDFを生成できます");
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const currentPlan = planRef.current;
      const currentCustomer = customerRef.current;
      const [{ pdf }, { AssignmentPlanPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./AssignmentPlanPdfDocument"),
      ]);
      const blob = await pdf(<AssignmentPlanPdfDocument plan={currentPlan} customer={currentCustomer} />).toBlob();
      const nextUrl = URL.createObjectURL(blob);

      revokeCurrentUrl();
      objectUrlRef.current = nextUrl;
      setPdfUrl(nextUrl);

      return nextUrl;
    } catch (error) {
      const message = getPdfErrorMessage(error);

      revokeCurrentUrl();
      setPdfUrl(null);
      setErrorMessage(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [revokeCurrentUrl]);

  useEffect(() => {
    let isCancelled = false;

    const preparePreview = async () => {
      try {
        await generatePdfUrl();
      } catch {
        if (!isCancelled) {
          // The visible Japanese error message is set in generatePdfUrl.
        }
      }
    };

    void preparePreview();

    return () => {
      isCancelled = true;
      revokeCurrentUrl();
      setPdfUrl(null);
    };
  }, [generatePdfUrl, pdfInputKey, revokeCurrentUrl]);

  const handleDownload = async () => {
    try {
      const url = pdfUrl ?? (await generatePdfUrl());
      const link = document.createElement("a");

      link.href = url;
      link.download = createSafeFileName(plan, customer);
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // The visible Japanese error message is set in generatePdfUrl.
    }
  };

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

        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isGenerating ? "PDFを生成中..." : pdfUrl ? "PDFをダウンロード" : "PDFを生成してダウンロード"}
        </button>
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
            {isGenerating ? "PDFを生成中です..." : "PDFプレビューを表示できません。上のボタンから再生成できます。"}
          </div>
        )}
      </div>
    </section>
  );
}
