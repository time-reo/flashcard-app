"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, Upload, Search, Eye, Check, Sparkles } from "lucide-react";

// 科目のリスト
const CATEGORIES = ["公共", "家庭", "数学", "科人", "情１"] as const;
type Category = typeof CATEGORIES[number];

// 初期カードデータ（各科目にサンプルを配置）
const initialCards = [
  { front: "121+73", back: "194", category: "数学" as Category },
  { front: "67-19", back: "48", category: "数学" as Category },
  { front: "地球規模で起こり、国境を越えて影響を及ぼすため、国際的な協力による解決が必要な環境問題の総称は？", back: "地球環境問題", category: "公共" as Category },
  { front: "一方を追求すれば他方が犠牲になるような両立しえない関係。環境保全と経済成長の関係などでよく用いられる言葉は？", back: "トレードオフ", category: "公共" as Category },
  { front: "将来の世代の欲求を満たしつつ、現在の世代の欲求も満足させるような、環境と開発を両立させる社会のあり方を示す概念は？", back: "持続可能性", category: "公共" as Category },
  { front: "地表から放射される熱を吸収し、大気を暖める働きを持つ気体の総称（二酸化炭素やメタンなど）は？", back: "温室効果ガス", category: "公共" as Category },
  { front: "大気に含まれる特定の気体が熱を吸収し、地球の表面温度を生物の生存に適した温度に保つ仕組み（現象）そのものは？", back: "温室効果", category: "公共" as Category },
  { front: "人間活動によって温室効果ガスが増加し、地球全体の平均気温が長期的に上昇していく環境問題（事象）は？", back: "地球温暖化", category: "公共" as Category },
  { front: "過去数十年にわたって経験したことのないような、極端な高温や大雨、干ばつなどの激しい気象現象は？", back: "異常気象", category: "公共" as Category },
  { front: "成層圏に存在し、太陽からの有害な紫外線を吸収して地球上の生命を守っている気体の層は？", back: "オゾン層", category: "公共" as Category },
  { front: "かつて冷蔵庫の冷媒やスプレーなどに使われていた人工の化学物質で、オゾン層を破壊する原因となった気体は？", back: "フロンガス", category: "公共" as Category },
  { front: "フロンガスなどの排出を規制し、オゾン層の破壊を防ぐために1987年に採択された国際的な取り決め（議定書）は？", back: "モントリオール議定書", category: "公共" as Category },
  { front: "焼畑農業の拡大や過度な伐採などが原因で、赤道付近の生物多様性が豊かな森林が失われていく問題は？", back: "熱帯林の減少", category: "公共" as Category },
  { front: "干ばつや過放牧などにより、土地が劣化し不毛な地になることを防ぐために採択された条約は？", back: "砂漠化対処条約", category: "公共" as Category },
  { front: "海洋に流れ込んだごみが波や紫外線で砕かれ、5ミリメートル以下の微小なサイズになったプラスチック物質は？", back: "マイクロプラスチック", category: "公共" as Category },
  { front: "特に水鳥の生息地として国際的に重要な湿地と、そこに生息する動植物の保全を目的とした条約は？", back: "ラムサール条約", category: "公共" as Category },
  { front: "絶滅のおそれのある野生動植物の「国際取引（輸出入）を規制」することで、それらの保護を目的とした条約は？", back: "ワシントン条約", category: "公共" as Category },
  { front: "地球上の多様な生物とその生息環境の保全、および遺伝資源の持続可能で公平な利用を総合的な目的とした条約は？", back: "生物多様性条約", category: "公共" as Category },
  { front: "お金（お給料）をもらってする仕事", back: "有償労働", category: "家庭" as Category },
  { front: "家事やボランティアなどお金をもらわないでする仕事", back: "無償労働", category: "家庭" as Category },
  { front: "働く期間の終わりが決まっていない安定した働き方", back: "正規雇用", category: "家庭" as Category },
  { front: "働く期間や時間が限られている働き方", back: "非正規雇用", category: "家庭" as Category },
  { front: "会社に直接雇われて期間の決められずに働く社員", back: "正社員", category: "家庭" as Category },
  { front: "「〇年だけ働く」と期間を決めて会社に雇われる社員", back: "契約社員", category: "家庭" as Category },
  { front: "自分の都合に合わせて短い時間や日数で働く人", back: "パートアルバイト", category: "家庭" as Category },
  { front: "派遣会社に登録して別の会社に派遣されて働く人", back: "派遣労働者", category: "家庭" as Category },
  { front: "正社員以外の働き方（アルバイトなど）で生活している若者", back: "フリーター", category: "家庭" as Category },
  { front: "学校に行かず仕事もせず働くための訓練も受けていない若者", back: "ニート", category: "家庭" as Category },
  { front: "自分が将来どんな仕事をしてどう生きていくかを計画すること", back: "キャリアプランニング", category: "家庭" as Category },
  { front: "夫婦だけ、または「親と未婚の子ども」だけで暮らす家族", back: "核家族", category: "家庭" as Category },
  { front: "自分が生まれて育てられた家族", back: "出生家族", category: "家庭" as Category },
  { front: "自分が大人になって結婚して新しくつくる家族", back: "創設家族", category: "家庭" as Category },
  { front: "祖父母や親戚など核家族以外の人が一緒に暮らしている家族", back: "拡大家族", category: "家庭" as Category },
  { front: "昔は家庭でやっていた教育や介護などを社会の施設が代わりにやってくれること", back: "家庭機能の社会化", category: "家庭" as Category },
  { front: "一緒に住んでいて生活費を共有している人の集まり", back: "世帯", category: "家庭" as Category },
  { front: "ひとり暮らしのこと", back: "単独世帯", category: "家庭" as Category },
  { front: "役所に届けて法律上正式な夫婦になること", back: "婚姻", category: "家庭" as Category },
  { front: "役所に届けを出していないけれど夫婦と同じように一緒に暮らしていること", back: "事実婚", category: "家庭" as Category },
  { front: "夫婦が話し合いや裁判で結婚をやめて別れること", back: "離婚", category: "家庭" as Category },
  { front: "子どもを育てて教育したり子どもの財産を管理したりする親の権利と義務", back: "親権", category: "家庭" as Category },
  { front: "赤ちゃんが生まれたときに「生まれました」と役所に出す書類", back: "出生届", category: "家庭" as Category },
  { front: "自分一人では生活できない家族を助けて養うこと", back: "扶養", category: "家庭" as Category },
  { front: "亡くなった人のお金や家などの財産を家族が引き継ぐこと", back: "相続", category: "家庭" as Category },
  { front: "「仕事」と「プライベートの時間」のバランスを良くしてどちらも充実させること", back: "ワーク・ライフ・バランス", category: "家庭" as Category },
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
  const [selectedCategory, setSelectedCategory] = useState<Category>("公共");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [viewedCount, setViewedCount] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  
  // ジャンプ先の番号を入力するステート
  const [jumpInput, setJumpInput] = useState("");
  const lastViewed = useRef<string | null>(null);

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

  useEffect(() => {
    if (current && lastViewed.current !== current.front) {
      setViewedCount((prev) => ({
        ...prev,
        [current.front]: (prev[current.front] || 0) + 1,
      }));
      lastViewed.current = current.front;
    }
  }, [current]);

  const currentViewCount = current ? (viewedCount[current.front] || 0) : 0;

  const goTo = (nextIndex: number) => {
    if (!filteredCards.length) return;
    setIndex((nextIndex + filteredCards.length) % filteredCards.length);
    setFlipped(false);
  };

  // 指定したカード番号にジャンプする関数
  const handleJump = () => {
    const targetNum = parseInt(jumpInput, 10);
    if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= filteredCards.length) {
      setIndex(targetNum - 1);
      setFlipped(false);
      setJumpInput(""); // 入力欄をクリア
    }
  };

  // 10枚ごとのセットを切り替える関数
  const handleSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const setIdx = parseInt(e.target.value, 10);
    setIndex(setIdx * 10);
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
                lastViewed.current = null;
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

            {/* 進捗・セット選択・番号ジャンプを一列にまとめたコントロールパネル */}
            <div className="flex flex-wrap gap-3 items-center justify-between text-sm text-slate-500 bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <div className="flex gap-4">
                <span>{filteredCards.length ? `${safeIndex + 1} / ${filteredCards.length}` : "0 / 0"}</span>
                <span>覚えた: {knownCount} / {categoryCards.length}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* 10枚ごとのセット選択ドロップダウン（カードが11枚以上あるときだけ表示） */}
                {filteredCards.length > 10 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-400">セット:</span>
                    <select
                      value={Math.floor(safeIndex / 10)}
                      onChange={handleSetChange}
                      className="bg-white border border-slate-200 rounded-lg p-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                    >
                      {Array.from({ length: Math.ceil(filteredCards.length / 10) }).map((_, i) => {
                        const start = i * 10 + 1;
                        const end = Math.min((i + 1) * 10, filteredCards.length);
                        return (
                          <option key={i} value={i}>
                            {start} 〜 {end} 番
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* 番号指定ジャンプ（カードがあるときだけ表示） */}
                {filteredCards.length > 0 && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={filteredCards.length}
                      placeholder="番号"
                      value={jumpInput}
                      onChange={(e) => setJumpInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJump()}
                      className="w-14 bg-white border border-slate-200 rounded-lg p-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleJump}
                      className="bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
                    >
                      移動
                    </button>
                  </div>
                )}
              </div>
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
                    className={`absolute inset-0 flex items-center justify-center rounded-2xl border shadow-sm p-7 ${
                      flipped ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
                    }`}
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
                      <div className="text-center space-y-4 w-full">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {flipped ? "Answer" : "Question"}
                        </p>
                        <p className="text-xl md:text-2xl font-bold leading-tight px-4 break-words">
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
                  lastViewed.current = null;
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
