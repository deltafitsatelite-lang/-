import type { AssignmentDay, AssignmentPlan, Customer, PdfMode } from "@/types";

const PAGE_WIDTH = 1240;
const PAGE_HEIGHT = 1754;
const PDF_WIDTH = 595.28;
const PDF_HEIGHT = 841.89;
const MARGIN = 52;
const CARD_GAP = 16;

const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif';

const locationLabels: Record<AssignmentDay["location"], string> = {
  home: "自宅",
  gym: "ジム",
  outdoor: "屋外",
  rest: "休養日",
  other: "任意",
};

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

const compactText = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();

  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}…` : normalized;
};

const getTaskRows = (day: AssignmentDay, pdfMode: PdfMode) => {
  const limit = pdfMode === "single_page" ? 52 : 72;
  const rows = [
    ["運動", compactText(day.trainingTasks.join(" / ") || "未入力", limit)],
    ["有酸素", compactText(day.cardioTask, limit)],
    ["ケア", compactText(day.mobilityTask, limit)],
    ["食事", compactText(day.mealTask, limit)],
    ["睡眠", compactText(day.sleepTask, limit)],
    ["体重", compactText(day.weightLogTask, limit)],
    ["水分", compactText(day.waterTask, limit)],
    ["習慣", compactText(day.habitTask, limit)],
    ["学習", compactText(day.studyTask || "未入力", limit)],
    ["メモ", compactText(day.memo || "未入力", limit)],
  ].filter(([, text]) => text.length > 0) as Array<[string, string]>;

  return pdfMode === "single_page" ? rows.slice(0, day.isRestDay ? 5 : 6) : rows;
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

  context.fillStyle = "#f8fafc";
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.textBaseline = "top";

  drawHeader(context, plan, customer);
  drawFooter(context, pageNumber);

  return { canvas, context, y: 252 };
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
  drawRoundRect(context, MARGIN, MARGIN, PAGE_WIDTH - MARGIN * 2, 150, 24);

  context.fillStyle = "#ffffff";
  setFont(context, 34, "bold");
  context.fillText(plan.title, MARGIN + 28, MARGIN + 24, PAGE_WIDTH - MARGIN * 2 - 56);

  setFont(context, 19);
  context.fillText(`顧客名: ${customer.name}`, MARGIN + 28, MARGIN + 82);
  context.fillText(`期間: ${plan.startDate}〜${plan.endDate}`, MARGIN + 360, MARGIN + 82);
  context.fillText(`次回PT: ${plan.nextTrainingDate ?? "未設定"}`, MARGIN + 760, MARGIN + 82);

  if (hasText(plan.trainerMessage)) {
    context.fillStyle = "#eff6ff";
    context.strokeStyle = "#bfdbfe";
    drawRoundRect(context, MARGIN, MARGIN + 168, PAGE_WIDTH - MARGIN * 2, 58, 18);
    context.fillStyle = "#1e3a8a";
    setFont(context, 18, "bold");
    context.fillText(`トレーナーより: ${compactText(plan.trainerMessage, 90)}`, MARGIN + 20, MARGIN + 186);
  }
};

const drawFooter = (context: CanvasRenderingContext2D, pageNumber: number) => {
  context.fillStyle = "#64748b";
  setFont(context, 16);
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
  let height = 76;

  setFont(context, 18);
  for (const [, text] of rows) {
    height += Math.max(28, measureWrappedLines(context, text, PAGE_WIDTH - MARGIN * 2 - 170, 2).length * 25) + 8;
  }

  height += 54;

  return height;
};

const drawDayCard = (context: CanvasRenderingContext2D, day: AssignmentDay, pdfMode: PdfMode, y: number) => {
  const cardX = MARGIN;
  const cardWidth = PAGE_WIDTH - MARGIN * 2;
  const cardHeight = measureDayCardHeight(context, day, pdfMode);

  context.fillStyle = day.isRestDay ? "#fffbeb" : "#ffffff";
  context.strokeStyle = day.isRestDay ? "#f59e0b" : "#cbd5e1";
  context.lineWidth = 2;
  drawRoundRect(context, cardX, y, cardWidth, cardHeight, 22);

  context.fillStyle = "#0f172a";
  setFont(context, 24, "bold");
  context.fillText(`${day.date}（${day.dayOfWeek}）`, cardX + 24, y + 22);

  const badgeText = day.isRestDay ? "休養日" : locationLabels[day.location];
  context.fillStyle = day.isRestDay ? "#fef3c7" : "#dbeafe";
  context.strokeStyle = day.isRestDay ? "#fcd34d" : "#bfdbfe";
  drawRoundRect(context, cardX + cardWidth - 140, y + 18, 112, 38, 18);
  context.fillStyle = day.isRestDay ? "#92400e" : "#1d4ed8";
  setFont(context, 17, "bold");
  context.fillText(badgeText, cardX + cardWidth - 118, y + 27);

  let rowY = y + 74;

  for (const [label, text] of getTaskRows(day, pdfMode)) {
    context.fillStyle = "#475569";
    setFont(context, 17, "bold");
    context.fillText(label, cardX + 24, rowY);

    context.fillStyle = "#172033";
    setFont(context, 18);
    const textHeight = drawWrappedText(context, text, cardX + 110, rowY, cardWidth - 146, 25, 2);
    rowY += Math.max(28, textHeight) + 8;
  }

  const checkItems = day.checkItems.length > 0 ? day.checkItems : ["実施", "記録", "確認"];
  context.fillStyle = "#334155";
  setFont(context, 17, "bold");
  context.fillText(
    checkItems.slice(0, pdfMode === "single_page" ? 4 : 6).map((item) => `□ ${compactText(item, 16)}`).join("   "),
    cardX + 24,
    y + cardHeight - 40,
  );

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

    if (currentPage.y + cardHeight > PAGE_HEIGHT - 90) {
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
