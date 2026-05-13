"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { findTemplateById, listTemplates, removeTemplate, saveTemplate } from "@/lib/storage";
import type { Template } from "@/types";
import {
  emptyTemplateFormValues,
  formValuesToTemplate,
  templateCategoryLabels,
  templateCategoryOptions,
  templateFormSchema,
  templateToFormValues,
  type TemplateFormValues,
} from "./templateForm";

type FormErrors = Partial<Record<keyof TemplateFormValues, string>>;

const getFieldErrors = (error: unknown) => {
  const errors: FormErrors = {};

  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return errors;
  }

  const issues = (error as { issues: Array<{ path: Array<string | number>; message: string }> }).issues;

  for (const issue of issues) {
    const key = issue.path[0] as keyof TemplateFormValues | undefined;

    if (key) {
      errors[key] = issue.message;
    }
  }

  return errors;
};

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [values, setValues] = useState<TemplateFormValues>(emptyTemplateFormValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(listTemplates());
  }, []);

  const editingTemplate = useMemo(
    () => templates.find((template) => template.id === editingTemplateId),
    [editingTemplateId, templates],
  );

  const refreshTemplates = () => setTemplates(listTemplates());

  const resetForm = () => {
    setEditingTemplateId(null);
    setValues(emptyTemplateFormValues);
    setErrors({});
  };

  const handleSubmit = () => {
    const result = templateFormSchema.safeParse(values);

    if (!result.success) {
      setErrors(getFieldErrors(result.error));
      return;
    }

    const currentTemplate = editingTemplateId ? findTemplateById(editingTemplateId) : undefined;
    const template = formValuesToTemplate(result.data, currentTemplate);

    saveTemplate(template);
    refreshTemplates();
    resetForm();
    setStatusMessage(editingTemplateId ? "テンプレートを更新しました。" : "テンプレートを追加しました。");
  };

  const handleEdit = (template: Template) => {
    setEditingTemplateId(template.id);
    setValues(templateToFormValues(template));
    setErrors({});
    setStatusMessage(null);
  };

  const handleDelete = (template: Template) => {
    const confirmed = window.confirm(`「${template.name}」を削除します。よろしいですか？`);

    if (!confirmed) {
      return;
    }

    removeTemplate(template.id);
    refreshTemplates();

    if (editingTemplateId === template.id) {
      resetForm();
    }

    setStatusMessage("テンプレートを削除しました。");
  };

  return (
    <>
      <PageHeader
        title="テンプレート管理"
        description="よく使う課題文をテンプレートとして保存し、課題作成画面の日別課題へすぐ反映できるようにします。"
      />

      <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">{editingTemplate ? "編集中" : "新規追加"}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            {editingTemplate ? `「${editingTemplate.name}」` : "テンプレートを追加"}
          </h2>

          <div className="mt-6 grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">テンプレート名 *</span>
              <input
                value={values.name}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
              {errors.name ? <span className="text-sm font-semibold text-rose-600">{errors.name}</span> : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">カテゴリ</span>
              <select
                value={values.category}
                onChange={(event) => setValues((current) => ({ ...current, category: event.target.value as TemplateFormValues["category"] }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                {templateCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {templateCategoryLabels[category]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">内容 *</span>
              <textarea
                rows={8}
                value={values.content}
                onChange={(event) => setValues((current) => ({ ...current, content: event.target.value }))}
                placeholder="例: スクワット 10回 × 3セット"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
              {errors.content ? <span className="text-sm font-semibold text-rose-600">{errors.content}</span> : null}
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {editingTemplate ? "更新する" : "追加する"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                クリア
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">テンプレート一覧</h2>
              <p className="mt-1 text-sm text-slate-500">登録数: {templates.length}件</p>
            </div>
          </div>

          {statusMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {statusMessage}
            </div>
          ) : null}

          {templates.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center">
              <h3 className="text-xl font-bold text-slate-950">テンプレートはまだありません</h3>
              <p className="mt-3 text-sm text-slate-500">よく使う課題文を登録すると、日別課題へ反映できます。</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {templates.map((template) => (
                <article key={template.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {templateCategoryLabels[template.category]}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-slate-950">{template.name}</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{template.content}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(template)}
                        className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(template)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
