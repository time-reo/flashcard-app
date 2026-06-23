"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, Upload, Search } from "lucide-react";

const initialCards = [
  { front: "apple", back: "りんご" },
  { front: "book", back: "本" },
  { front: "weather", back: "天気" },
  { front: "study", back: "勉強する" },
  { front: "important", back: "重要な" },
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
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (card) => card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q)
    );
  }, [cards, query]);

  const safeIndex = Math.min(index, Math.max(filteredCards.length - 1, 0));
  const current = filteredCards[safeIndex];
  const knownCount = Object.values(known).filter(Boolean).length;

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
      setCards(parsed);
      setKnown({});
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
          <p className="text-slate-600">カードをクリックすると答えが表示されます。CSVでカードを差し替えできます。</p>
        </header>

        <div className="rounded-2xl shadow-sm border border-slate-200 bg-white">
          <div className="p-4 md:p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="flex h-10 w-full border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 pl-9 rounded-xl"
                  placeholder="カードを検索"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                    setFlipped(false);
                  }}
                />
              </div>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm cursor-pointer hover:bg-slate-50 h-10">
                <Upload className="h-4 w-4" /> CSV読込
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={importCsv} />
              </label>
            </div>

            <div className="flex justify-between text-sm text-slate-500">
              <span>{filteredCards.length ? `${safeIndex + 1} / ${filteredCards.length}` : "0 / 0"}</span>
              <span>覚えた: {knownCount} / {cards.length}</span>
            </div>

            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-slate-300 rounded-2xl"
            >
              <div className="relative h-72 md:h-80 [perspective:1000px]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`${safeIndex}-${flipped ? "back" : "front"}`}
                    initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm p-7"
                  >
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
                      <div className="text-center text-slate-500">カードがありません</div>
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
                  setCards((value) => shuffleArray(value));
                  setIndex(0);
                  setFlipped(false);
                }}
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
            <p className="font-semibold text-slate-800">CSV形式</p>
            <p>1行に「表,裏」を書きます。例: <span className="font-mono bg-slate-100 px-1 rounded">apple,りんご</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}