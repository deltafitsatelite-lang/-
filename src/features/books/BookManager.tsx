"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { listBooks, removeBook, saveBook } from "@/lib/storage";
import type { Book } from "@/types";
import {
  bookFormSchema,
  bookSectionFormSchema,
  createBook,
  createBookSection,
  emptyBookFormValues,
  emptyBookSectionFormValues,
  sortBookSections,
  type BookFormValues,
  type BookSectionFormValues,
} from "./bookForm";

type FormErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

const getFieldErrors = <T extends Record<string, unknown>>(error: unknown) => {
  const errors: FormErrors<T> = {};

  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return errors;
  }

  const issues = (error as { issues: Array<{ path: Array<string | number>; message: string }> }).issues;

  for (const issue of issues) {
    const key = issue.path[0] as keyof T | undefined;

    if (key) {
      errors[key] = issue.message;
    }
  }

  return errors;
};

export function BookManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [bookValues, setBookValues] = useState<BookFormValues>(emptyBookFormValues);
  const [sectionValues, setSectionValues] = useState<BookSectionFormValues>(emptyBookSectionFormValues);
  const [bookErrors, setBookErrors] = useState<FormErrors<BookFormValues>>({});
  const [sectionErrors, setSectionErrors] = useState<FormErrors<BookSectionFormValues>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedBooks = listBooks();
    setBooks(storedBooks);
    setSelectedBookId(storedBooks[0]?.id ?? null);
  }, []);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const refreshBooks = (nextSelectedBookId?: string | null) => {
    const storedBooks = listBooks();
    setBooks(storedBooks);

    if (nextSelectedBookId !== undefined) {
      setSelectedBookId(nextSelectedBookId);
    }
  };

  const handleCreateBook = () => {
    const result = bookFormSchema.safeParse(bookValues);

    if (!result.success) {
      setBookErrors(getFieldErrors<BookFormValues>(result.error));
      return;
    }

    const book = createBook(result.data);
    saveBook(book);
    setBookValues(emptyBookFormValues);
    setBookErrors({});
    refreshBooks(book.id);
    setStatusMessage("書籍を登録しました。");
  };

  const handleDeleteBook = (book: Book) => {
    const confirmed = window.confirm(`『${book.title}』を削除します。よろしいですか？`);

    if (!confirmed) {
      return;
    }

    removeBook(book.id);
    const nextBooks = listBooks().filter((currentBook) => currentBook.id !== book.id);
    refreshBooks(nextBooks[0]?.id ?? null);
    setStatusMessage("書籍を削除しました。");
  };

  const handleAddSection = () => {
    if (!selectedBook) {
      setStatusMessage("先に書籍を選択してください。");
      return;
    }

    const result = bookSectionFormSchema.safeParse(sectionValues);

    if (!result.success) {
      setSectionErrors(getFieldErrors<BookSectionFormValues>(result.error));
      return;
    }

    const nextBook: Book = {
      ...selectedBook,
      chapters: sortBookSections([...selectedBook.chapters, createBookSection(result.data, selectedBook.id)]),
      updatedAt: new Date().toISOString(),
    };

    saveBook(nextBook);
    setSectionValues({ ...emptyBookSectionFormValues, order: String(nextBook.chapters.length) });
    setSectionErrors({});
    refreshBooks(nextBook.id);
    setStatusMessage("学習セクションを追加しました。");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedBook) {
      return;
    }

    const nextBook: Book = {
      ...selectedBook,
      chapters: selectedBook.chapters.filter((section) => section.id !== sectionId),
      updatedAt: new Date().toISOString(),
    };

    saveBook(nextBook);
    refreshBooks(nextBook.id);
    setStatusMessage("学習セクションを削除しました。");
  };

  return (
    <>
      <PageHeader
        title="書籍管理"
        description="学習課題に使う書籍と、PDFに表示する章・読む範囲を登録します。書籍本文は保存せず、章・ラベルだけを扱います。"
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">書籍を登録</h2>
            <div className="mt-5 grid gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">書籍名 *</span>
                <input
                  value={bookValues.title}
                  onChange={(event) => setBookValues((values) => ({ ...values, title: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                {bookErrors.title ? <span className="text-sm font-semibold text-rose-600">{bookErrors.title}</span> : null}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">著者名</span>
                <input
                  value={bookValues.author}
                  onChange={(event) => setBookValues((values) => ({ ...values, author: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">メモ</span>
                <textarea
                  rows={4}
                  value={bookValues.notes}
                  onChange={(event) => setBookValues((values) => ({ ...values, notes: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <button
                type="button"
                onClick={handleCreateBook}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                書籍を保存
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">登録済み書籍</h2>
            {books.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">書籍はまだ登録されていません。</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {books.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedBookId === book.id ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <span className="block font-bold text-slate-950">『{book.title}』</span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {book.author || "著者未入力"} / {book.chapters.length}セクション
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedBook ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">選択中の書籍</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">『{selectedBook.title}』</h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedBook.author || "著者未入力"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteBook(selectedBook)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  書籍を削除
                </button>
              </div>

              {selectedBook.notes ? (
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{selectedBook.notes}</p>
              ) : null}

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-950">学習セクションを追加</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">章 *</span>
                    <input
                      placeholder="例: 1章"
                      value={sectionValues.chapter}
                      onChange={(event) => setSectionValues((values) => ({ ...values, chapter: event.target.value }))}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    {sectionErrors.chapter ? <span className="text-sm font-semibold text-rose-600">{sectionErrors.chapter}</span> : null}
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">ラベル *</span>
                    <input
                      placeholder="例: 1〜5"
                      value={sectionValues.label}
                      onChange={(event) => setSectionValues((values) => ({ ...values, label: event.target.value }))}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    {sectionErrors.label ? <span className="text-sm font-semibold text-rose-600">{sectionErrors.label}</span> : null}
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">表示順 *</span>
                    <input
                      inputMode="numeric"
                      value={sectionValues.order}
                      onChange={(event) => setSectionValues((values) => ({ ...values, order: event.target.value }))}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    {sectionErrors.order ? <span className="text-sm font-semibold text-rose-600">{sectionErrors.order}</span> : null}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mt-4 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  セクションを追加
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-950">学習セクション一覧</h3>
                {selectedBook.chapters.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">セクションはまだ登録されていません。</p>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {sortBookSections(selectedBook.chapters).map((section) => (
                      <article key={section.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold text-slate-950">
                            {section.chapter} / {section.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            表示順: {section.order}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(section.id)}
                          className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                        >
                          削除
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center">
              <h2 className="text-xl font-bold text-slate-950">書籍を選択してください</h2>
              <p className="mt-3 text-sm text-slate-500">書籍を登録すると、章・読む範囲を追加できます。</p>
            </div>
          )}
        </section>
      </section>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {statusMessage}
        </div>
      ) : null}
    </>
  );
}
