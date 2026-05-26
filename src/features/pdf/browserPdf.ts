import type { AssignmentDay, AssignmentPlan, Customer, PdfMode } from "@/types";

const PAGE_WIDTH = 1240;
const PAGE_HEIGHT = 1754;
const PDF_WIDTH = 595.28;
const PDF_HEIGHT = 841.89;
const MARGIN = 56;
const CARD_GAP = 26;
const FOOTER_RESERVED_HEIGHT = 92;

const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif';

const compactText = (value: string, maxLength: number) => {
  const normalized = value.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}…` : normalized;
};

type TaskRow = {
  label: "トレーニング" | "学習" | "メモ";
  text: string;
  maxLines: number;
};

const getTrainingText = (day: AssignmentDay) => {
  const trainingText = day.trainingTasks.map((task) => task.trim()).filter(Boolean).join("\n");

  if (trainingText) {
    return trainingText;
  }

  return day.isRestDay ? "休養日です。軽い散歩やストレッチ程度にしましょう。" : "未入力";
};

const getTaskRows = (day: AssignmentDay, pdfMode: PdfMode): TaskRow[] => {
  const trainingLimit = pdfMode === "single_page" ? 120 : 180;
  const textLimit = pdfMode === "single_page" ? 80 : 130;

  return [
    { label: "トレーニング", text: compactText(getTrainingText(day), trainingLimit), maxLines: pdfMode === "single_page" ? 4 : 6 },
    { label: "学習", text: compactText(day.studyTask || "未入力", textLimit), maxLines: 3 },
    { label: "メモ", text: compactText(day.memo || "未入力", textLimit), maxLines: pdfMode === "single_page" ? 3 : 4 },
  ];
};

type PdfPageImage = {
  bytes: Uint8Array;
  width: number;
  height: number;
};

type CanvasPage = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  y: number;
};

const createCanvasPage = (plan: AssignmentPlan, customer: Customer, pageNumber: number): CanvasPage => {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("PDF生成用のCanvasを作成できませんでした");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.textBaseline = "top";

  const startY = pageNumber === 1 ? drawHeader(context, plan, customer) : drawContinuationHeader(context, customer, pageNumber);
  drawFooter(context, pageNumber);

  return { canvas, context, y: startY };
};

const setFont = (context: CanvasRenderingContext2D, size: number, weight: "normal" | "bold" = "normal") => {
  context.font = `${weight === "bold" ? "700" : "400"} ${size}px ${fontFamily}`;
};

const drawRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
  context.stroke();
};

const drawHeader = (context: CanvasRenderingContext2D, plan: AssignmentPlan, customer: Customer) => {
  context.fillStyle = "#1d4ed8";
  context.strokeStyle = "#1d4ed8";
  drawRoundRect(context, MARGIN, MARGIN, PAGE_WIDTH - MARGIN * 2, 138, 20);

  context.fillStyle = "#ffffff";
  setFont(context, 34, "bold");
  context.fillText(plan.title, MARGIN + 30, MARGIN + 24, PAGE_WIDTH - MARGIN * 2 - 60);

  setFont(context, 19);
  context.fillText(`顧客名: ${customer.name}`, MARGIN + 30, MARGIN + 82);
  context.fillText(`期間: ${plan.startDate}〜${plan.endDate}`, MARGIN + 360, MARGIN + 82);
  context.fillText(`次回PT: ${plan.nextTrainingDate ?? "未設定"}`, MARGIN + 760, MARGIN + 82);

  return MARGIN + 166;
};

const drawContinuationHeader = (context: CanvasRenderingContext2D, customer: Customer, pageNumber: number) => {
  context.fillStyle = "#334155";
  setFont(context, 18, "bold");
  context.fillText(`顧客名: ${customer.name}`, MARGIN, 34);

  context.fillStyle = "#64748b";
  setFont(context, 16);
  context.fillText(`${pageNumber}ページ目`, PAGE_WIDTH - MARGIN - 80, 36);

  context.strokeStyle = "#e5e7eb";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(MARGIN, 70);
  context.lineTo(PAGE_WIDTH - MARGIN, 70);
  context.stroke();

  return 96;
};

const drawFooter = (context: CanvasRenderingContext2D, pageNumber: number) => {
  context.fillStyle = "#64748b";
  setFont(context, 15);
  context.fillText("書籍本文は含めず、書籍名・章・ラベルのみ表示しています。", MARGIN, PAGE_HEIGHT - 54);
  context.fillText(String(pageNumber), PAGE_WIDTH - MARGIN - 20, PAGE_HEIGHT - 54);
};

const measureWrappedLines = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 6,
) => {
  const lines: string[] = [];
  const sourceLines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  for (const sourceLine of sourceLines.length > 0 ? sourceLines : [""]) {
    let currentLine = "";

    for (const char of sourceLine) {
      const nextLine = `${currentLine}${char}`;

      if (currentLine && context.measureText(nextLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = char;

        if (lines.length >= maxLines) {
          return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1]}…`];
        }
      } else {
        currentLine = nextLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length >= maxLines) {
      return lines.slice(0, maxLines);
    }
  }

  return lines;
};

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines?: number,
) => {
  const lines = measureWrappedLines(context, text, maxWidth, maxLines);

  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));

  return lines.length * lineHeight;
};

const measureDayCardHeight = (context: CanvasRenderingContext2D, day: AssignmentDay, pdfMode: PdfMode) => {
  const rows = getTaskRows(day, pdfMode);
  let height = 82;

  setFont(context, 21);
  for (const { text, maxLines } of rows) {
    height += 34 + Math.max(34, measureWrappedLines(context, text, PAGE_WIDTH - MARGIN * 2 - 76, maxLines).length * 31) + 20;
  }

  height += 18;

  return height;
};

const drawDayCard = (context: CanvasRenderingContext2D, day: AssignmentDay, pdfMode: PdfMode, y: number) => {
  const cardX = MARGIN;
  const cardWidth = PAGE_WIDTH - MARGIN * 2;
  const cardHeight = measureDayCardHeight(context, day, pdfMode);

  context.fillStyle = "#ffffff";
  context.strokeStyle = day.isRestDay ? "#fbbf24" : "#d1d5db";
  context.lineWidth = 2;
  drawRoundRect(context, cardX, y, cardWidth, cardHeight, 18);

  context.fillStyle = "#0f172a";
  setFont(context, 24, "bold");
  context.fillText(`${day.date}（${day.dayOfWeek}）`, cardX + 28, y + 24);

  if (day.isRestDay) {
    context.fillStyle = "#fef3c7";
    context.strokeStyle = "#fcd34d";
    drawRoundRect(context, cardX + cardWidth - 142, y + 20, 112, 36, 18);
    context.fillStyle = "#92400e";
    setFont(context, 17, "bold");
    context.fillText("休養日", cardX + cardWidth - 118, y + 28);
  }

  let rowY = y + 82;

  for (const { label, text, maxLines } of getTaskRows(day, pdfMode)) {
    context.fillStyle = "#111827";
    setFont(context, 20, "bold");
    context.fillText(`【${label}】`, cardX + 34, rowY);
    rowY += 34;

    context.fillStyle = "#1f2937";
    setFont(context, 21);
    const textHeight = drawWrappedText(context, text, cardX + 34, rowY, cardWidth - 68, 31, maxLines);
    rowY += Math.max(34, textHeight) + 18;
  }

  return cardHeight;
};

const canvasToJpegBytes = (canvas: HTMLCanvasElement) => {
  const base64 = canvas.toDataURL("image/jpeg", 0.92).split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const renderPlanToPageImages = (plan: AssignmentPlan, customer: Customer) => {
  const pages: CanvasPage[] = [createCanvasPage(plan, customer, 1)];
  let currentPage = pages[0];

  for (const day of plan.days) {
    const cardHeight = measureDayCardHeight(currentPage.context, day, plan.pdfMode);

    if (currentPage.y + cardHeight > PAGE_HEIGHT - FOOTER_RESERVED_HEIGHT) {
      currentPage = createCanvasPage(plan, customer, pages.length + 1);
      pages.push(currentPage);
    }

    drawDayCard(currentPage.context, day, plan.pdfMode, currentPage.y);
    currentPage.y += cardHeight + CARD_GAP;
  }

  return pages.map((page) => ({
    bytes: canvasToJpegBytes(page.canvas),
    width: page.canvas.width,
    height: page.canvas.height,
  }));
};

const textEncoder = new TextEncoder();

const ascii = (value: string) => textEncoder.encode(value);

const buildPdfFromImages = (images: PdfPageImage[]) => {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === "string" ? ascii(chunk) : chunk;
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const addObject = (id: number, body: Array<Uint8Array | string>) => {
    offsets[id] = byteLength;
    push(`${id} 0 obj\n`);
    body.forEach(push);
    push("\nendobj\n");
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObject(2, [
    `<< /Type /Pages /Count ${images.length} /Kids [${images.map((_, index) => `${3 + index * 3} 0 R`).join(" ")}] >>`,
  ]);

  images.forEach((image, index) => {
    const pageObjectId = 3 + index * 3;
    const contentObjectId = pageObjectId + 1;
    const imageObjectId = pageObjectId + 2;
    const content = `q\n${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm\n/Im0 Do\nQ\n`;

    addObject(pageObjectId, [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im0 ${imageObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    ]);
    addObject(contentObjectId, [`<< /Length ${content.length} >>\nstream\n${content}endstream`]);
    addObject(imageObjectId, [
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`,
      image.bytes,
      "\nendstream",
    ]);
  });

  const xrefOffset = byteLength;
  push(`xref\n0 ${offsets.length}\n`);
  push("0000000000 65535 f \n");

  for (let index = 1; index < offsets.length; index += 1) {
    push(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }

  push(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks.map((chunk) => chunk.slice().buffer), { type: "application/pdf" });
};

export const generateAssignmentPlanPdfBlob = async (plan: AssignmentPlan, customer: Customer) => {
  const images = renderPlanToPageImages(plan, customer);

  if (images.length === 0) {
    throw new Error("PDFに出力する課題日がありません");
  }

  return buildPdfFromImages(images);
};
