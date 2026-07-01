"use client";

import { useState, useTransition } from "react";
import { saveAction } from "./actions";
import type { Content, InfoRow, ServiceItem, WorkItem } from "@/lib/content";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

function RowActions({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      削除
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
    >
      ＋ {label}
    </button>
  );
}

export default function Editor({ initial }: { initial: Content }) {
  const [content, setContent] = useState<Content>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  // 深い更新を避けるため、セクションごとに部分更新するヘルパー
  function patch<K extends keyof Content>(key: K, value: Partial<Content[K]>) {
    setContent((c) => ({ ...c, [key]: { ...c[key], ...value } }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveAction(content);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* ヒーロー */}
      <Section title="トップ（ヒーロー）">
        <Field label="小見出し" value={content.hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
        <Field label="見出し" value={content.hero.title} onChange={(v) => patch("hero", { title: v })} textarea />
        <Field label="説明文" value={content.hero.subtitle} onChange={(v) => patch("hero", { subtitle: v })} textarea />
      </Section>

      {/* 会社概要 */}
      <Section title="会社概要">
        <Field label="見出し" value={content.about.heading} onChange={(v) => patch("about", { heading: v })} />
        <Field label="リード文" value={content.about.lead} onChange={(v) => patch("about", { lead: v })} textarea />
        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-600">会社情報の項目</span>
          {content.about.info.map((row: InfoRow, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="w-1/3">
                <Field
                  label="項目名"
                  value={row.label}
                  onChange={(v) =>
                    patch("about", {
                      info: content.about.info.map((r, j) => (j === i ? { ...r, label: v } : r)),
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Field
                  label="内容"
                  value={row.value}
                  onChange={(v) =>
                    patch("about", {
                      info: content.about.info.map((r, j) => (j === i ? { ...r, value: v } : r)),
                    })
                  }
                />
              </div>
              <div className="pb-2">
                <RowActions
                  onRemove={() =>
                    patch("about", { info: content.about.info.filter((_, j) => j !== i) })
                  }
                />
              </div>
            </div>
          ))}
          <AddButton
            label="項目を追加"
            onClick={() => patch("about", { info: [...content.about.info, { label: "", value: "" }] })}
          />
        </div>
      </Section>

      {/* サービス */}
      <Section title="サービス紹介">
        <Field label="見出し" value={content.services.heading} onChange={(v) => patch("services", { heading: v })} />
        <Field label="リード文" value={content.services.lead} onChange={(v) => patch("services", { lead: v })} textarea />
        <div className="space-y-4">
          {content.services.items.map((item: ServiceItem, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">サービス {i + 1}</span>
                <RowActions
                  onRemove={() => patch("services", { items: content.services.items.filter((_, j) => j !== i) })}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <Field
                    label="アイコン(絵文字)"
                    value={item.icon}
                    onChange={(v) =>
                      patch("services", { items: content.services.items.map((r, j) => (j === i ? { ...r, icon: v } : r)) })
                    }
                  />
                </div>
                <div className="sm:col-span-3">
                  <Field
                    label="タイトル"
                    value={item.title}
                    onChange={(v) =>
                      patch("services", { items: content.services.items.map((r, j) => (j === i ? { ...r, title: v } : r)) })
                    }
                  />
                </div>
              </div>
              <Field
                label="説明文"
                value={item.description}
                onChange={(v) =>
                  patch("services", { items: content.services.items.map((r, j) => (j === i ? { ...r, description: v } : r)) })
                }
                textarea
              />
            </div>
          ))}
          <AddButton
            label="サービスを追加"
            onClick={() =>
              patch("services", { items: [...content.services.items, { icon: "✨", title: "", description: "" }] })
            }
          />
        </div>
      </Section>

      {/* 実績 */}
      <Section title="導入実績">
        <Field label="見出し" value={content.works.heading} onChange={(v) => patch("works", { heading: v })} />
        <Field label="リード文" value={content.works.lead} onChange={(v) => patch("works", { lead: v })} textarea />
        <div className="space-y-4">
          {content.works.items.map((item: WorkItem, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">実績 {i + 1}</span>
                <RowActions
                  onRemove={() => patch("works", { items: content.works.items.filter((_, j) => j !== i) })}
                />
              </div>
              <Field
                label="カテゴリ"
                value={item.category}
                onChange={(v) =>
                  patch("works", { items: content.works.items.map((r, j) => (j === i ? { ...r, category: v } : r)) })
                }
              />
              <Field
                label="タイトル"
                value={item.title}
                onChange={(v) =>
                  patch("works", { items: content.works.items.map((r, j) => (j === i ? { ...r, title: v } : r)) })
                }
              />
              <Field
                label="説明文"
                value={item.description}
                onChange={(v) =>
                  patch("works", { items: content.works.items.map((r, j) => (j === i ? { ...r, description: v } : r)) })
                }
                textarea
              />
            </div>
          ))}
          <AddButton
            label="実績を追加"
            onClick={() =>
              patch("works", { items: [...content.works.items, { category: "", title: "", description: "" }] })
            }
          />
        </div>
      </Section>

      {/* アクセス */}
      <Section title="アクセス">
        <Field label="見出し" value={content.access.heading} onChange={(v) => patch("access", { heading: v })} />
        <Field label="住所" value={content.access.address} onChange={(v) => patch("access", { address: v })} />
        <Field label="アクセス" value={content.access.access} onChange={(v) => patch("access", { access: v })} />
        <Field label="営業時間" value={content.access.hours} onChange={(v) => patch("access", { hours: v })} />
        <Field label="電話番号" value={content.access.tel} onChange={(v) => patch("access", { tel: v })} />
      </Section>

      {/* お問い合わせ */}
      <Section title="お問い合わせ">
        <Field label="見出し" value={content.contact.heading} onChange={(v) => patch("contact", { heading: v })} />
        <Field label="リード文" value={content.contact.lead} onChange={(v) => patch("contact", { lead: v })} textarea />
      </Section>

      {/* フッター */}
      <Section title="フッター">
        <Field label="会社名" value={content.footer.companyName} onChange={(v) => patch("footer", { companyName: v })} />
        <Field label="コピーライト表記" value={content.footer.copyright} onChange={(v) => patch("footer", { copyright: v })} />
      </Section>

      {/* 保存バー（固定） */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-4 px-6 py-4">
          {saved && <span className="text-sm font-medium text-green-600">保存しました ✓</span>}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isPending ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>
    </form>
  );
}
