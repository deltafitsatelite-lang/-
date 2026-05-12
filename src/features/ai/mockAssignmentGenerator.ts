import type { Customer } from "@/types";
import type { AssignmentDayFormValues } from "@/features/assignments/assignmentPlanForm";

export type GenerateMockAssignmentInput = {
  customer: Customer;
  days: AssignmentDayFormValues[];
};

const includesAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.toLowerCase().includes(keyword.toLowerCase()));

const hasAnyEquipment = (equipment: string[]) =>
  equipment.length > 0 && !equipment.some((item) => item.includes("なし"));

const isBeginnerCustomer = (customer: Customer) =>
  includesAny(`${customer.trainingHistory} ${customer.exerciseFrequency}`, [
    "初心者",
    "未経験",
    "なし",
    "ほぼない",
    "少ない",
    "久しぶり",
  ]);

const hasWeightLossGoal = (customer: Customer) =>
  includesAny(`${customer.goal} ${customer.bodyConcerns} ${customer.currentChallenges}`, [
    "ダイエット",
    "減量",
    "体脂肪",
    "痩せ",
    "やせ",
    "体重",
  ]);

const hasSleepChallenge = (customer: Customer) =>
  (customer.sleepHours !== null && customer.sleepHours < 6) ||
  includesAny(`${customer.lifestyle} ${customer.currentChallenges} ${customer.habitsToImprove}`, [
    "睡眠",
    "寝不足",
    "夜更かし",
    "眠",
  ]);

const hasPainOrInjury = (customer: Customer) => customer.injuries.trim().length > 0;

const buildTrainingTasks = (customer: Customer, day: AssignmentDayFormValues, index: number) => {
  const isBeginner = isBeginnerCustomer(customer);
  const hasHomeEquipment = hasAnyEquipment(customer.homeEquipment);
  const hasGymEquipment = hasAnyEquipment(customer.gymEquipment);
  const useGym = day.location === "gym" && hasGymEquipment;
  const setText = isBeginner ? "2セット" : "3セット";

  if (day.isRestDay || day.location === "rest") {
    return "";
  }

  if (useGym) {
    return [
      `レッグプレス 10回 × ${setText}`,
      `ラットプルダウン 10回 × ${setText}`,
      `チェストプレス 10回 × ${setText}`,
      "痛みや違和感が出る重さでは行わない",
    ].join("\n");
  }

  if (!hasHomeEquipment) {
    const patterns = [
      [
        `椅子スクワット 8〜10回 × ${setText}`,
        `膝つきプッシュアップ 6〜8回 × ${setText}`,
        `ヒップリフト 12回 × ${setText}`,
      ],
      [
        `カーフレイズ 12回 × ${setText}`,
        `デッドバグ 左右8回 × ${setText}`,
        `サイドプランク 左右20秒 × ${setText}`,
      ],
    ];

    return patterns[index % patterns.length].join("\n");
  }

  return [
    `ダンベルまたはチューブ種目 10回 × ${setText}`,
    `スクワット 10回 × ${setText}`,
    `ヒップリフト 12回 × ${setText}`,
  ].join("\n");
};

const buildCardioTask = (customer: Customer, day: AssignmentDayFormValues) => {
  if (day.isRestDay || day.location === "rest") {
    return "余裕があれば軽い散歩10分。疲れている場合は休む";
  }

  if (hasWeightLossGoal(customer)) {
    return isBeginnerCustomer(customer) ? "息が上がりすぎない散歩15分" : "早歩きまたはバイク20〜30分";
  }

  return "余裕があれば散歩10〜15分";
};

const buildMealTask = (customer: Customer) => {
  if (hasWeightLossGoal(customer)) {
    return "毎食たんぱく質を1品入れ、主食は腹八分目にする";
  }

  if (customer.eatingHabits || customer.snackHabit) {
    return "食事内容を1日1回メモし、間食の量を確認する";
  }

  return "毎食たんぱく質を1品入れる";
};

const buildSleepTask = (customer: Customer) => {
  if (hasSleepChallenge(customer)) {
    return "就寝30分前はスマホを置き、いつもより15分早く布団に入る";
  }

  return "就寝前に軽く深呼吸し、睡眠時間を記録する";
};

const buildMemo = (customer: Customer, day: AssignmentDayFormValues) => {
  const notes = ["痛みが出たら中止し、不安があればトレーナーに相談してください。"];

  if (hasPainOrInjury(customer)) {
    notes.unshift(`注意点: ${customer.injuries}。痛みのある部位に強い負荷をかけないでください。`);
  }

  if (day.isRestDay || day.location === "rest") {
    notes.unshift("休養日です。疲労回復を優先し、無理に運動量を増やさないでください。");
  }

  return notes.join("\n");
};

export function generateMockAssignmentDays({ customer, days }: GenerateMockAssignmentInput) {
  return days.map((day, index): AssignmentDayFormValues => {
    const isRestDay = day.isRestDay || day.location === "rest";
    const trainingTasksText = buildTrainingTasks(customer, day, index);
    const mobilityTask = isRestDay
      ? "首・肩・股関節まわりを軽く5分ほぐす"
      : "トレーニング後に使った部位を5分ストレッチ";

    return {
      ...day,
      location: isRestDay ? "rest" : day.location,
      isRestDay,
      trainingTasksText,
      cardioTask: buildCardioTask(customer, day),
      mobilityTask,
      mealTask: buildMealTask(customer),
      sleepTask: buildSleepTask(customer),
      weightLogTask: hasWeightLossGoal(customer) ? "起床後トイレ後に体重を測る" : "可能な日は同じ条件で体重を記録する",
      waterTask: customer.waterIntake !== null && customer.waterIntake < 1.5 ? "水を1.5L目標にこまめに飲む" : "水分をこまめにとり、飲んだ量を確認する",
      habitTask: customer.habitsToImprove || "1日1回、今日できたことをメモする",
      studyTask: day.studyTask || "健康・運動に関する学習を5〜10分行う",
      memo: buildMemo(customer, day),
      checkItemsText: [
        trainingTasksText ? "トレーニング完了" : "休養・ケア完了",
        hasWeightLossGoal(customer) ? "体重記録" : "体調メモ",
        "水分摂取を確認",
        "痛み・違和感がないか確認",
      ].join("\n"),
    };
  });
}
