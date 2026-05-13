import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { AssignmentDay, AssignmentPlan, Customer, PdfMode } from "@/types";

const notoSansJpRegular = "https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.otf";
const notoSansJpBold = "https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Bold.otf";

Font.register({
  family: "NotoSansJP",
  fonts: [
    { src: notoSansJpRegular, fontWeight: 400 },
    { src: notoSansJpBold, fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback((word: string) => [word]);

type AssignmentPlanPdfDocumentProps = {
  plan: AssignmentPlan;
  customer: Customer;
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#f8fafc",
    color: "#172033",
    fontFamily: "NotoSansJP",
    fontSize: 9,
    lineHeight: 1.35,
  },
  header: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  meta: {
    marginTop: 6,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    fontSize: 8,
  },
  trainerMessage: {
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    fontSize: 9,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
  },
  dayGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  dayCard: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  restDayCard: {
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  dayHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  dayTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 7,
    fontWeight: 700,
  },
  restBadge: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  taskRow: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    marginTop: 2,
  },
  taskLabel: {
    width: 54,
    color: "#475569",
    fontWeight: 700,
  },
  taskText: {
    flex: 1,
    color: "#0f172a",
  },
  checkList: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  checkItem: {
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#94a3b8",
    fontSize: 8,
  },
  checkBox: {
    fontSize: 11,
    fontWeight: 700,
  },
  caution: {
    marginTop: 10,
    padding: 9,
    borderRadius: 10,
    backgroundColor: "#fff7ed",
    color: "#9a3412",
    fontSize: 8.5,
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: 7,
  },
});

const locationLabels: Record<AssignmentDay["location"], string> = {
  home: "自宅",
  gym: "フィットネスジム",
  outdoor: "屋外",
  rest: "休養",
  other: "任意",
};

const cautionText =
  "痛みや強い違和感がある場合は無理をせず中止してください。不安がある場合はトレーナーに相談してください。";

const toLines = (value: string | string[]) => (Array.isArray(value) ? value : value.split("\n"));

const compactText = (value: string | string[], limit: number) => {
  const text = toLines(value).map((line) => line.trim()).filter(Boolean).join(" / ");

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit)}…`;
};

const hasText = (value: string | string[]) => compactText(value, 1000).length > 0;

const getTaskRows = (day: AssignmentDay, pdfMode: PdfMode) => {
  const limit = pdfMode === "single_page" ? 44 : 88;
  const rows = [
    ["筋トレ", compactText(day.trainingTasks, limit)],
    ["有酸素", compactText(day.cardioTask, limit)],
    ["ケア", compactText(day.mobilityTask, limit)],
    ["食事", compactText(day.mealTask, limit)],
    ["睡眠", compactText(day.sleepTask, limit)],
    ["体重", compactText(day.weightLogTask, limit)],
    ["水分", compactText(day.waterTask, limit)],
    ["習慣", compactText(day.habitTask, limit)],
    ["学習", compactText(day.studyTask, limit)],
    ["メモ", compactText(day.memo, limit)],
  ].filter(([, text]) => text.length > 0);

  if (pdfMode === "single_page") {
    return rows.slice(0, day.isRestDay ? 5 : 6);
  }

  return rows;
};

const splitDaysForMode = (days: AssignmentDay[], pdfMode: PdfMode) => {
  if (pdfMode === "single_page" || days.length <= 4) {
    return [days];
  }

  const midpoint = Math.ceil(days.length / 2);
  return [days.slice(0, midpoint), days.slice(midpoint)].filter((chunk) => chunk.length > 0);
};

function DayCard({ day, pdfMode }: { day: AssignmentDay; pdfMode: PdfMode }) {
  const taskRows = getTaskRows(day, pdfMode);
  const checkItems = day.checkItems.length > 0 ? day.checkItems : ["実施", "記録", "確認"];
  const dayCardStyle = day.isRestDay ? [styles.dayCard, styles.restDayCard] : styles.dayCard;
  const badgeStyle = day.isRestDay ? [styles.badge, styles.restBadge] : styles.badge;

  return (
    <View style={dayCardStyle} wrap={false}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>
          {day.date}（{day.dayOfWeek}）
        </Text>
        <Text style={badgeStyle}>
          {day.isRestDay ? "休養日" : locationLabels[day.location]}
        </Text>
      </View>
      {taskRows.map(([label, text]) => (
        <View key={`${day.id}-${label}`} style={styles.taskRow}>
          <Text style={styles.taskLabel}>{label}</Text>
          <Text style={styles.taskText}>{text}</Text>
        </View>
      ))}
      <View style={styles.checkList}>
        {checkItems.slice(0, pdfMode === "single_page" ? 4 : 6).map((item) => (
          <Text key={`${day.id}-${item}`} style={styles.checkItem}>
            <Text style={styles.checkBox}>□ </Text>
            {compactText(item, 20)}
          </Text>
        ))}
      </View>
    </View>
  );
}

function PdfPage({
  plan,
  customer,
  days,
  pageIndex,
  pageCount,
}: {
  plan: AssignmentPlan;
  customer: Customer;
  days: AssignmentDay[];
  pageIndex: number;
  pageCount: number;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{plan.title}</Text>
        <View style={styles.meta}>
          <Text>顧客名: {customer.name}</Text>
          <Text>
            期間: {plan.startDate}〜{plan.endDate}
          </Text>
          <Text>次回PT: {plan.nextTrainingDate ?? "未設定"}</Text>
        </View>
      </View>

      {pageIndex === 0 && hasText(plan.trainerMessage) ? (
        <Text style={styles.trainerMessage}>トレーナーより: {compactText(plan.trainerMessage, 160)}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>今日やること（日別課題）</Text>
      <View style={styles.dayGrid}>
        {days.map((day) => (
          <DayCard key={day.id} day={day} pdfMode={plan.pdfMode} />
        ))}
      </View>

      {pageIndex === pageCount - 1 ? <Text style={styles.caution}>注意事項: {cautionText}</Text> : null}

      <View style={styles.footer} fixed>
        <Text>書籍本文は含めず、書籍名・章・ラベルのみ表示しています。</Text>
        <Text>
          {pageIndex + 1} / {pageCount}
        </Text>
      </View>
    </Page>
  );
}

export function AssignmentPlanPdfDocument({ plan, customer }: AssignmentPlanPdfDocumentProps) {
  const dayChunks = splitDaysForMode(plan.days, plan.pdfMode).slice(0, plan.pdfMode === "single_page" ? 1 : 2);

  return (
    <Document title={plan.title} author="顧客課題PDF作成">
      {dayChunks.map((days, index) => (
        <PdfPage
          key={`${plan.id}-${index}`}
          plan={plan}
          customer={customer}
          days={days}
          pageIndex={index}
          pageCount={dayChunks.length}
        />
      ))}
    </Document>
  );
}
