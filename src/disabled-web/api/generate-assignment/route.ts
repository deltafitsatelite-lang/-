import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  aiAssignmentGenerationContentSchema,
  aiAssignmentGenerationRequestSchema,
  aiAssignmentGenerationResponseSchema,
  openAiAssignmentGenerationJsonSchema,
  type AiAssignmentGenerationContent,
  type AiAssignmentGenerationRequest,
  type AiAssignmentGenerationResponse,
} from "@/features/ai/assignmentGeneration";
import { generateMockAssignmentDays } from "@/features/ai/mockAssignmentGenerator";
import type { AssignmentDayFormValues } from "@/features/assignments/assignmentPlanForm";

export const runtime = "nodejs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5-mini";

const systemInstructions = [
  "あなたはパーソナルトレーナーの課題作成を補助するAIです。出力は必ずJSON Schemaに一致するJSONのみです。",
  "顧客の目標、現在の体型・悩み、生活習慣、睡眠、食事習慣、運動歴、使える器具、怪我・痛み・注意点、課題期間、課題日数、休養日、書籍学習ルールを踏まえて日別課題を作成してください。",
  "医療的な診断、治療、リハビリ処方の表現は避けてください。怪我や痛みがある場合は無理な種目や高負荷を避けてください。",
  "全日程のmemoには、痛みが出たら中止すること、不安があればトレーナーに相談すること、トレーナーが確認すべき短いメモを入れてください。",
  "初心者には簡単で実行しやすい内容にし、顧客が続けやすい量にしてください。トレーナーが手直ししやすい短文で書いてください。",
  "食事、睡眠、体重記録、水分摂取、習慣課題も必ず各日に入れてください。",
  "入力されたid、date、dayOfWeek、isRestDayは変更しないでください。休養日はlocationをrestにし、負荷の高いトレーニングを避け、回復・ストレッチ・軽い散歩中心にしてください。",
  "書籍学習ルールがある場合、studyTaskには書籍本文を出さず、渡された書籍名・章・ラベル・ページ範囲だけを使って学習範囲を表示してください。",
].join("\n");

const createMockResponse = (request: AiAssignmentGenerationRequest): AiAssignmentGenerationResponse => {
  const response = {
    source: "mock",
    days: generateMockAssignmentDays({ customer: request.customer, days: request.days }),
  } satisfies AiAssignmentGenerationResponse;

  return aiAssignmentGenerationResponseSchema.parse(response);
};

const buildOpenAiInput = (request: AiAssignmentGenerationRequest) => ({
  task: "personal_trainer_assignment_generation",
  outputLanguage: "ja-JP",
  assignmentPeriod: request.assignmentPeriod,
  restDays: request.days
    .filter((day: AssignmentDayFormValues) => day.isRestDay || day.location === "rest")
    .map((day: AssignmentDayFormValues) => ({ id: day.id, date: day.date, dayOfWeek: day.dayOfWeek })),
  customerProfile: {
    goal: request.customer.goal,
    bodyConcerns: request.customer.bodyConcerns,
    currentWeight: request.customer.currentWeight,
    targetWeight: request.customer.targetWeight,
    lifestyle: request.customer.lifestyle,
    sleepHours: request.customer.sleepHours,
    wakeUpTime: request.customer.wakeUpTime,
    bedTime: request.customer.bedTime,
    eatingHabits: request.customer.eatingHabits,
    alcoholFrequency: request.customer.alcoholFrequency,
    snackHabit: request.customer.snackHabit,
    mealsPerDay: request.customer.mealsPerDay,
    waterIntake: request.customer.waterIntake,
    trainingHistory: request.customer.trainingHistory,
    exerciseFrequency: request.customer.exerciseFrequency,
    weekdayActivityLevel: request.customer.weekdayActivityLevel,
    weekendActivityLevel: request.customer.weekendActivityLevel,
    homeEquipment: request.customer.homeEquipment,
    gymEquipment: request.customer.gymEquipment,
    injuries: request.customer.injuries,
    dislikedExercises: request.customer.dislikedExercises,
    likedExercises: request.customer.likedExercises,
    currentChallenges: request.customer.currentChallenges,
    habitsToImprove: request.customer.habitsToImprove,
    trainerNotes: request.customer.trainerNotes,
  },
  studyRule: request.studyRule,
  currentDays: request.days,
});

const extractResponseRefusal = (payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const output = (payload as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const content = (item as { content?: unknown }).content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const contentItem of content) {
      if (typeof contentItem !== "object" || contentItem === null) {
        continue;
      }

      const typedContentItem = contentItem as { refusal?: unknown; type?: unknown };

      if (typedContentItem.type === "refusal" && typeof typedContentItem.refusal === "string") {
        return typedContentItem.refusal;
      }
    }
  }

  return null;
};

const extractResponseText = (payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  if ("output_text" in payload && typeof payload.output_text === "string") {
    return payload.output_text;
  }

  const output = (payload as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const content = (item as { content?: unknown }).content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const contentItem of content) {
      if (typeof contentItem !== "object" || contentItem === null) {
        continue;
      }

      const typedContentItem = contentItem as { text?: unknown; type?: unknown };

      if (typedContentItem.type === "output_text" && typeof typedContentItem.text === "string") {
        return typedContentItem.text;
      }
    }
  }

  return null;
};

const validateGeneratedDaysMatchRequest = (
  generatedDays: AssignmentDayFormValues[],
  request: AiAssignmentGenerationRequest,
) => {
  if (generatedDays.length !== request.days.length) {
    throw new Error("Generated day count does not match requested day count.");
  }

  generatedDays.forEach((generatedDay, index) => {
    const requestedDay = request.days[index];

    if (
      generatedDay.id !== requestedDay.id ||
      generatedDay.date !== requestedDay.date ||
      generatedDay.dayOfWeek !== requestedDay.dayOfWeek
    ) {
      throw new Error(`Generated day metadata does not match request at index ${index}.`);
    }

    if (requestedDay.isRestDay && (!generatedDay.isRestDay || generatedDay.location !== "rest")) {
      throw new Error(`Generated rest day was not preserved at index ${index}.`);
    }
  });
};

const parseOpenAiContent = (text: string, request: AiAssignmentGenerationRequest): AiAssignmentGenerationContent => {
  const parsedJson = JSON.parse(text) as unknown;
  const content = aiAssignmentGenerationContentSchema.parse(parsedJson);

  validateGeneratedDaysMatchRequest(content.days, request);

  return content;
};

const createOpenAiResponse = async (
  request: AiAssignmentGenerationRequest,
  apiKey: string,
): Promise<AiAssignmentGenerationResponse> => {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_ASSIGNMENT_MODEL ?? DEFAULT_OPENAI_MODEL,
      instructions: systemInstructions,
      input: JSON.stringify(buildOpenAiInput(request)),
      store: false,
      text: {
        format: {
          type: "json_schema",
          name: "assignment_generation",
          strict: true,
          schema: openAiAssignmentGenerationJsonSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const refusal = extractResponseRefusal(payload);

  if (refusal) {
    throw new Error(`OpenAI API refused the request: ${refusal}`);
  }

  const outputText = extractResponseText(payload);

  if (!outputText) {
    throw new Error("OpenAI API response did not include output text.");
  }

  const content = parseOpenAiContent(outputText, request);
  const wrappedResponse = {
    source: "openai",
    days: content.days,
  } satisfies AiAssignmentGenerationResponse;

  return aiAssignmentGenerationResponseSchema.parse(wrappedResponse);
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsedRequest = aiAssignmentGenerationRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "AI生成リクエストの形式が不正です。入力内容を確認してから再生成してください。" },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(createMockResponse(parsedRequest.data));
  }

  try {
    return NextResponse.json(await createOpenAiResponse(parsedRequest.data, apiKey));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "OpenAI APIで課題案を生成できませんでした。入力内容やAPIキーを確認し、再生成するかモック生成を利用してください。",
      },
      { status: 502 },
    );
  }
}
