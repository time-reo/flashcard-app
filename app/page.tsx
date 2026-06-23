"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, Upload, Search, Eye, Check, Sparkles } from "lucide-react";

// 科目のリスト
const CATEGORIES = ["公共", "家庭", "数学", "科人", "情１"] as const;
type Category = typeof CATEGORIES[number];

// 初期カードデータ（各科目にサンプルを配置）
const initialCards = [
  { front: "sin²θ + cos²θ", back: "1", category: "数学" as Category },
  { front: " y = ax² のグラフの形", back: "放物線", category: "数学" as Category },
  { front: "契約の成立時期", back: "申し込みに対する承諾の通知が相手に届いたとき", category: "公共" as Category },
  { front: "一歩下がる、互いを尊重する態度", back: "アサーティブなコミュニケーション", category: "家庭" as Category },
  { front: "自然界の4つの基本相互作用", back: "重力、電磁気力、強い力、弱い力", category: "科人" as Category },
  { front: "情報のデジタル化のメリット", back: "ノイズに強く、劣化せずに複製・伝送ができること", category: "情１" as Category },
];

function parseCsv(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [front, ...rest] = line.split(",");
      return { front: (front || "").trim(), back: rest.join(",").trim() };
    })
    .filter((card) => card.front && card.back);
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlashcardWebPrototype() {
  const [cards, setCards] = useState(initialCards);
  // 初期カテゴリを「公共」に変更
  const [selectedCategory, setSelectedCategory] = useState<Category>("公共");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});
  
  // 閲覧回数を記録するステート（文字列：回数）
  const [viewedCount, setViewedCount] = useState<Record<string, number>>({});
  // 直前に見たカードを記録して、連続でカウントアップするのを防ぐ
  const lastViewed = useRef<string | null>(null);
  
  const [query, setQuery] = useState("");

  const categoryCards = useMemo(() => {
    return cards.filter((card) => card.category === selectedCategory);
  }, [cards, selectedCategory]);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryCards;
    return categoryCards.filter(
      (card) => card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q)
    );
  }, [categoryCards, query]);

  const safeIndex = Math.min(index, Math.max(filteredCards.length - 1, 0));
  const current = filteredCards[safeIndex];

  const knownCount = useMemo(() => {
    return categoryCards.filter((card) => known[card.front]).length;
  }, [categoryCards, known]);

  // カードが表示されたら閲覧回数を+1する
  useEffect(() => {
    if (current && lastViewed.current !== current.front) {
      setViewedCount((prev) => ({
        ...prev,
        [current.front]: (prev[current.front] || 0) + 1,
      }));
      lastViewed.current = current.front;
    }
  }, [current]);

  // 現在のカードの閲覧回数を取得
  const currentViewCount = current ? (viewedCount[current.front] || 0) : 0;

  const goTo = (nextIndex: number) => {
    if (!filteredCards.length) return;
    setIndex((nextIndex + filteredCards.length) % filteredCards.length);
    setFlipped(false);
  };

  const importCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);
    if (parsed.length) {
      const newCategoryCards = parsed.map((card) => ({
        ...card,
        category: selectedCategory,
      }));

      setCards((prev) => [
        ...prev.filter((card) => card.category !== selectedCategory),
        ...newCategoryCards,
      ]);

      setIndex(0);
      setFlipped(false);
      setQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-2 text-center">
          <p className="text-sm font-medium text-slate-500">Webで共有できる単語学習カード</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">フラッシュカード</h1>
          <p className="text-slate-600">カードをクリックすると答えが表示されます。科目ごとに学習が可能です。</p>
        </header>

        {/* 科目選択タブ */}
        <div className="flex flex-wrap gap-2 justify-center bg-slate-200/60 p-1.5 rounded-2xl">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setIndex(0);
                setFlipped(false);
                setQuery("");
                lastViewed.current = null; // タブ切り替え時にリセット
              }}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                selectedCategory === category
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="rounded-2xl shadow-sm border border-slate-200 bg-white">
          <div className="p-4 md:p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="flex h-10 w-full border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 pl-9 rounded-xl"
                  placeholder={`${selectedCategory}のカードを検索`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                    setFlipped(false);
                  }}
                />
              </div>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm cursor-pointer hover:bg-slate-50 h-10">
                <Upload className="h-4 w-4" /> {selectedCategory}にCSV読込
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={importCsv} />
              </label>
            </div>

            <div className="flex justify-between text-sm text-slate-500">
              <span>{filteredCards.length ? `${safeIndex + 1} / ${filteredCards.length}` : "0 / 0"}</span>
              <span>覚えた: {knownCount} / {categoryCards.length}</span>
            </div>

            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-slate-300 rounded-2xl relative block"
            >
              <div className="relative h-72 md:h-80 [perspective:1000px]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${safeIndex}-${flipped ? "back" : "front"}`}
                    initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm p-7"
                  >
                    {current && (
                      <>
                        {/* 左上：閲覧回数による成長バッジ */}
                        {currentViewCount > 0 && (
                          <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm transition-colors ${
                            currentViewCount >= 5 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                            currentViewCount >= 3 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {currentViewCount >= 5 ? <Sparkles className="h-3.5 w-3.5 text-amber-500" /> : <Eye className="h-3 w-3" />}
                            {currentViewCount >= 5 ? `${currentViewCount}回目！頑張ってますね✨` : `${currentViewCount}回閲覧`}
                          </div>
                        )}

                        {/* 右上：「覚えた」の目印 */}
                        {known[current.front] && (
                          <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md shadow-sm">
                            <Check className="h-3 w-3 stroke-[3]" /> 覚えた
                          </div>
                        )}
                      </>
                    )}

                    {current ? (
                      <div className="text-center space-y-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {flipped ? "Answer" : "Question"}
                        </p>
                        <p className="text-4xl md:text-5xl font-bold leading-tight">
                          {flipped ? current.back : current.front}
                        </p>
                        <p className="text-sm text-slate-500">クリックして反転</p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500">
                        {query ? "検索結果に該当するカードがありません" : "この科目のカードがありません"}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </button>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50" onClick={() => goTo(safeIndex - 1)} disabled={!filteredCards.length}>
                <ChevronLeft className="h-4 w-4 mr-1" /> 前へ
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50" onClick={() => setFlipped(false)} disabled={!filteredCards.length}>
                <RotateCcw className="h-4 w-4 mr-1" /> 表へ
              </button>
              <button
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
                onClick={() => {
                  const otherCategoryCards = cards.filter((card) => card.category !== selectedCategory);
                  const shuffled = shuffleArray(categoryCards);
                  setCards([...otherCategoryCards, ...shuffled]);
                  setIndex(0);
                  setFlipped(false);
                  lastViewed.current = null; // シャッフル時にもカウントが正しく動くようにリセット
                }}
                disabled={!filteredCards.length}
              >
                <Shuffle className="h-4 w-4 mr-1" /> シャッフル
              </button>
              <button
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
                onClick={() => current && setKnown((value) => ({ ...value, [current.front]: !value[current.front] }))}
                disabled={!current}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> 覚えた
              </button>
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 col-span-2 md:col-span-1" onClick={() => goTo(safeIndex + 1)} disabled={!filteredCards.length}>
                次へ <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-sm border border-slate-200 bg-white">
          <div className="p-4 md:p-5 text-sm text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">CSV形式での追加について</p>
            <p>現在選択している科目（今は <span className="font-bold text-slate-800">「{selectedCategory}」</span>）に対して、1行に「表,裏」の形式で一括読込・差し替えが可能です。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
