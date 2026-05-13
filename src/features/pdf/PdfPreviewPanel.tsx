"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import type { AssignmentPlan, Customer } from "@/types";
import { AssignmentPlanPdfDocument } from "./AssignmentPlanPdfDocument";

type PdfPreviewPanelProps = {
  plan: AssignmentPlan;
  customer: Customer;
};

const createFileName = (plan: AssignmentPlan, customer: Customer) =>
  `${customer.name}_${plan.title}_${plan.startDate}_${plan.endDate}.pdf`.replace(/[\\/:*?"<>|\s]+/g, "_");

export function PdfPreviewPanel({ plan, customer }: PdfPreviewPanelProps) {
  const document = <AssignmentPlanPdfDocument plan={plan} customer={customer} />;

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
        <PDFDownloadLink
          document={document}
          fileName={createFileName(plan, customer)}
          className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {({ loading }: { loading: boolean }) => (loading ? "PDFを準備中..." : "PDFをダウンロード")}
        </PDFDownloadLink>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        <PDFViewer className="h-[70vh] min-h-[420px] w-full" showToolbar>
          {document}
        </PDFViewer>
      </div>
    </section>
  );
}
