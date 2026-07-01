import { promises as fs } from "fs";
import path from "path";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export type Hero = { eyebrow: string; title: string; subtitle: string };
export type InfoRow = { label: string; value: string };
export type ServiceItem = { icon: string; title: string; description: string };
export type WorkItem = { category: string; title: string; description: string };

export type Content = {
  hero: Hero;
  about: { heading: string; lead: string; info: InfoRow[] };
  services: { heading: string; lead: string; items: ServiceItem[] };
  works: { heading: string; lead: string; items: WorkItem[] };
  access: { heading: string; address: string; access: string; hours: string; tel: string };
  contact: { heading: string; lead: string };
  footer: { companyName: string; copyright: string };
};

const FILE = path.join(process.cwd(), "src", "data", "content.json");
const HERO_ROW_ID = 1;

async function readJson(): Promise<Content> {
  const raw = await fs.readFile(FILE, "utf-8");
  return JSON.parse(raw) as Content;
}

async function writeJson(data: Content): Promise<void> {
  // Vercel などサーバーレス環境ではアプリ配下が読み取り専用のため書き込めない。
  // その場合はクラッシュさせず、best-effort（控えの保存はスキップ）とする。
  // ※ hero は Supabase を正とするため、書き込み失敗時も hero の永続化は影響を受けない。
  try {
    await fs.writeFile(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      console.warn(
        `content.json への書き込みをスキップしました（読み取り専用FS: ${code}）。hero は Supabase に保存されています。`,
      );
      return;
    }
    throw err;
  }
}

// --- ヒーローは Supabase を正とする ---
async function getHero(): Promise<Hero | null> {
  if (!isSupabaseConfigured()) return null; // 未設定なら JSON にフォールバック
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("hero")
    .select("eyebrow, title, subtitle")
    .eq("id", HERO_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(`Supabase からヒーローの取得に失敗しました: ${error.message}`);
  return data as Hero | null;
}

async function saveHero(hero: Hero): Promise<void> {
  if (!isSupabaseConfigured()) return; // 未設定なら JSON への保存のみ（下の writeJson が控えを持つ）
  const supabase = getSupabase();
  const { error } = await supabase
    .from("hero")
    .upsert({ id: HERO_ROW_ID, ...hero, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Supabase へのヒーロー保存に失敗しました: ${error.message}`);
}

export async function getContent(): Promise<Content> {
  const json = await readJson();
  const hero = await getHero();
  // Supabase に行があればそれで上書き。無ければ JSON の値をフォールバックとして使う。
  return hero ? { ...json, hero } : json;
}

export async function saveContent(data: Content): Promise<void> {
  // ヒーローは Supabase、それ以外は JSON に保存する（JSON にもヒーローを控えとして残す）
  await saveHero(data.hero);
  await writeJson(data);
}
