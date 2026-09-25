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
  { front: "選挙により国民によって選ばれた、国会議員で組織される会", back: "国会", category: "公共" as Category },
  { front: "国会を衆議院と参議院の二つの院によって進める方法", back: "二院制", category: "公共" as Category },
  { front: "衆議院の定員", back: "465人", category: "公共" as Category },
  { front: "衆議院の任期", back: "4年", category: "公共" as Category },
  { front: "参議院の任期", back: "6年（3年ごとに半数が選挙で交代する）", category: "公共" as Category },
  { front: "国会の役割①○○を作る、②○○を決める、③憲法改正の発議", back: "①法律を作る、②予算を決める、③憲法改正の発議", category: "公共" as Category },
  { front: "憲法改正には、どれだけの割合の国民の賛成が必要か", back: "3分の2", category: "公共" as Category },
  { front: "衆議院の議決は参議院の議決よりも優先される。これを何というか", back: "衆議院の優越", category: "公共" as Category },
  { front: "衆議院の優越が見られる例　①参議院の議決よりも優先される、②○○決議権を持つ", back: "①参議院の議決よりも優先されること、②内閣不信任決議権を持つ", category: "公共" as Category },
  { front: "衆議院の優越がある理由　①○○が多い、②○○が短い、③○○がある", back: "①議員が多い、②任期が短い、③解散（途中解散）がある", category: "公共" as Category },
  { front: "国会の種類のうち、毎年1月に召集され、主に予算審議などを行うもの", back: "通常国会", category: "公共" as Category },
  { front: "国会の種類のうち、臨時に召集するもの", back: "臨時国会", category: "公共" as Category },
  { front: "内閣総理大臣を指名する国会", back: "特別国会", category: "公共" as Category },
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
// D 免疫
{ front: "病原体などの異物の侵入を防いだり、侵入した異物を除去したりする体のしくみを何というか", back: "生体防御", category: "科人" as Category },
{ front: "ヒトの皮膚の最外層をおおう、死んだ細胞の層を何というか", back: "角質", category: "科人" as Category },
{ front: "汗などにふくまれ、細菌を殺すはたらきをもつものは何か", back: "酵素", category: "科人" as Category },
{ front: "気管や消化管などの粘膜が分泌し、異物の侵入を防いだり排出したりするものは何か", back: "粘液", category: "科人" as Category },
{ front: "冬に病気に感染しやすくなる原因の1つとして考えられていることは何か", back: "乾燥により粘液などのはたらきが弱まること", category: "科人" as Category },
{ front: "体内に侵入した異物を非自己として認識して除去するしくみを何というか", back: "免疫", category: "科人" as Category },
{ front: "免疫でおもにはたらく血液の成分は何か", back: "白血球", category: "科人" as Category },
{ front: "がんに対する免疫の活動を活発にしてがんを治療する方法を何というか", back: "免疫療法", category: "科人" as Category },

// 1 免疫のしくみ
{ front: "体内に侵入した異物を直接とりこみ、分解して排除する白血球の一種は何か", back: "マクロファージ", category: "科人" as Category },
{ front: "抗体をつくらせる原因となる物質を何というか", back: "抗原", category: "科人" as Category },
{ front: "異物が抗原として認識されると活性化し、抗体を産生する白血球の一種は何か", back: "B細胞", category: "科人" as Category },
{ front: "抗原を認識して結合するタンパク質を何というか", back: "抗体", category: "科人" as Category },
{ front: "抗体が特定の抗原に結合することを何というか", back: "抗原抗体反応", category: "科人" as Category },

// 一次応答と二次応答
{ front: "はじめての異物が侵入したとき、抗体がつくられはじめるまでにかかる期間はどれくらいか", back: "1〜2週間", category: "科人" as Category },
{ front: "はじめて異物が侵入したときに起こる、抗体産生までに時間がかかる免疫反応を何というか", back: "一次応答", category: "科人" as Category },
{ front: "一次応答で活性化したB細胞などの一部が体内に残ったものを何というか", back: "記憶細胞", category: "科人" as Category },
{ front: "同じ抗原に再び出会ったとき、記憶細胞によって抗体が急速かつ大量に産生される反応を何というか", back: "二次応答", category: "科人" as Category },
{ front: "病原体やその情報が集められ、免疫反応が起こる場となるところはどこか", back: "リンパ節", category: "科人" as Category },

// コラム：血液型の判定
{ front: "異なる型の血液を混ぜると血液にかたまりができるのは、何という反応によるものか", back: "抗原抗体反応", category: "科人" as Category },
{ front: "血液型の判定で、抗原Aに対する抗体でのみ血液がかたまった場合、何型と判定されるか", back: "A型", category: "科人" as Category },

// 2 ワクチン
{ front: "二次応答のしくみを利用して、病気にかかりにくくするものは何か", back: "予防接種", category: "科人" as Category },
{ front: "予防接種で接種する抗原などを何というか", back: "ワクチン", category: "科人" as Category },
{ front: "ワクチンにはどのようなものが用いられるか", back: "弱毒化したウイルスや、細菌のもつタンパク質を抽出したものなど", category: "科人" as Category },
{ front: "ワクチン接種によって世界中で根絶された感染症は何か", back: "天然痘", category: "科人" as Category },
{ front: "WHOとは何の略称か", back: "世界保健機関", category: "科人" as Category },

// コラム：インフルエンザとワクチン
{ front: "抗原となる部分の性質が大きく変わったウイルスを何というか", back: "新型ウイルス", category: "科人" as Category },
{ front: "新型ウイルスによって起こることがある、感染症の世界的大流行を何というか", back: "パンデミック", category: "科人" as Category },
{ front: "1918年に流行し、約4000万人が死亡した新型インフルエンザを何というか", back: "スペイン風邪", category: "科人" as Category },
{ front: "新型コロナウイルスワクチンの主流は何ワクチンか", back: "RNAワクチン（mRNAワクチン）", category: "科人" as Category },

// 3 アレルギー
{ front: "免疫応答が過敏に起こり、体に不都合な影響を与える反応を何というか", back: "アレルギー", category: "科人" as Category },
{ front: "アレルギーの原因となる抗原を何というか", back: "アレルゲン", category: "科人" as Category },
{ front: "食物、ハチ毒、薬などが原因で起こる急性アレルギー反応を何というか", back: "アナフィラキシー", category: "科人" as Category },
{ front: "アナフィラキシーの重篤な状態で、死にいたることもあるものを何というか", back: "アナフィラキシーショック", category: "科人" as Category },

// コラム：花粉症のしくみと対処法
{ front: "スギやヒノキなどの花粉を吸入することで起こるアレルギー性疾患を何というか", back: "花粉症", category: "科人" as Category },
{ front: "抗原をごく微量ずつ投与し、抗原に対する反応を弱めていく治療法を何というか", back: "減感作療法", category: "科人" as Category },
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
