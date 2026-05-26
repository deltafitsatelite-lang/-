import { Lesson } from '@/types/lesson';

const commonSafetyNote =
  '動作中に痛みやしびれ、強い違和感がある場合はすぐに中止してください。呼吸を止めず、無理のない範囲で行いましょう。';

export const lessons: Lesson[] = [

  {
    id: 'chair-squat',
    title: '椅子スクワット入門',
    skillTree: 'lower-body',
    difficulty: 'beginner',
    totalMinutes: 3,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'cs-1', name: '椅子スクワット', reps: '8回', instruction: '椅子に軽く触れる深さでしゃがむ。', easyVersion: '半分の深さで5回。', caution: 'ひざに痛みがあれば中止。' },
      { id: 'cs-2', name: 'かかと上げ', durationSeconds: 40, instruction: '壁に手を添えてかかとを上げ下げ。', easyVersion: '両手で支えて行う。', caution: 'ふらつく場合は中止。' },
    ],
  },
  {
    id: 'shoulder-mobility',
    title: '肩まわりリセット',
    skillTree: 'flexibility',
    difficulty: 'beginner',
    totalMinutes: 3,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'sm-1', name: '肩回し', durationSeconds: 45, instruction: '小さく前後に肩を回す。', easyVersion: '回す幅を半分にする。', caution: '肩痛がある場合は中止。' },
      { id: 'sm-2', name: '胸ひらき', durationSeconds: 45, instruction: '肩甲骨を寄せるように胸を開く。', easyVersion: '可動域を小さくする。', caution: '痛みが出る角度は避ける。' },
    ],
  },
  {
    id: 'breathing-core',
    title: '体幹呼吸',
    skillTree: 'core',
    difficulty: 'beginner',
    totalMinutes: 3,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'bc-1', name: 'ドローイン呼吸', durationSeconds: 60, instruction: '吸って吐いてお腹を薄く保つ。', easyVersion: '仰向けで行う。', caution: 'めまいがあれば中止。' },
      { id: 'bc-2', name: '壁プランク', durationSeconds: 35, instruction: '壁に前腕をついて姿勢キープ。', easyVersion: '壁に近づいて行う。', caution: '腰痛があれば中止。' },
    ],
  },
  {
    id: 'wall-pushup',
    title: '壁腕立て入門',
    skillTree: 'upper-body',
    difficulty: 'beginner',
    totalMinutes: 4,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 12,
    exercises: [
      { id: 'wp-1', name: '壁プッシュアップ', reps: '8回', instruction: '壁に手をついて腕立て動作。', easyVersion: '壁に近づいて浅く行う。', caution: '肩に痛みがあれば中止。' },
      { id: 'wp-2', name: 'アームサークル', durationSeconds: 40, instruction: '腕を小さく回す。', easyVersion: '肘を曲げて行う。', caution: '肩の詰まり感があれば中止。' },
    ],
  },
  {
    id: 'hip-stretch',
    title: '股関節ストレッチ',
    skillTree: 'flexibility',
    difficulty: 'beginner',
    totalMinutes: 4,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 12,
    exercises: [
      { id: 'hs-1', name: '股関節前ストレッチ', durationSeconds: 45, instruction: '片脚を後ろに引き前側を伸ばす。', easyVersion: '壁に手を添える。', caution: '腰に痛みがあれば中止。' },
      { id: 'hs-2', name: 'お尻ストレッチ', durationSeconds: 45, instruction: '座って片脚を組み軽く前傾。', easyVersion: '前傾を浅くする。', caution: 'ひざに痛みがあれば中止。' },
    ],
  },
  {
    id: 'lower-body-1',
    title: '脚ほぐしスタート',
    skillTree: 'lower-body',
    difficulty: 'beginner',
    totalMinutes: 4,
    equipment: 'none',
    beginnerFriendly: true,
    safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'lb1-1', name: 'チェアスクワット', reps: '8回', instruction: 'イスに軽く触れる深さまでゆっくりしゃがみ、立ち上がる。', easyVersion: '半分の深さで5回。', caution: 'ひざが内側に入らないようにし、ひざ痛があれば中止。' },
      { id: 'lb1-2', name: 'かかと上げ', durationSeconds: 45, instruction: '壁に手を添えて、かかとを上げ下げする。', easyVersion: '片手ではなく両手で壁を支える。', caution: 'ふくらはぎがつりそうなときは休む。' },
      { id: 'lb1-3', name: 'もも前ストレッチ', durationSeconds: 40, instruction: '立位で片脚ずつ軽くひざを曲げ、もも前を伸ばす。', easyVersion: '伸ばす時間を20秒に短縮。', caution: '腰を反らしすぎず、腰に張りが出たら中止。' },
    ],
  },
  {
    id: 'lower-body-2', title: 'お尻と脚の基礎', skillTree: 'lower-body', difficulty: 'beginner', totalMinutes: 5, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'lb2-1', name: 'ヒップヒンジ', reps: '10回', instruction: '背すじを保ち、お尻を後ろに引いて上体を前へ倒す。', easyVersion: '手を太ももに添えて浅く倒す。', caution: '腰が丸まる・痛む場合は中止。' },
      { id: 'lb2-2', name: 'サイドレッグレイズ', reps: '左右各8回', instruction: '壁に手を添えて脚を真横にゆっくり上げる。', easyVersion: '可動域を半分にする。', caution: '骨盤を傾けすぎない。ひざや股関節に痛みがあれば中止。' },
      { id: 'lb2-3', name: '足首まわし', durationSeconds: 50, instruction: '片脚ずつ足首をゆっくり内外に回す。', easyVersion: '座って行う。', caution: '痛みのある方向へ強く回さない。' },
    ],
  },
  {
    id: 'lower-body-3', title: '下半身リズム', skillTree: 'lower-body', difficulty: 'beginner', totalMinutes: 3, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'lb3-1', name: 'その場ランジタッチ', reps: '左右各6回', instruction: '片脚を軽く引き、ひざを浅く曲げて戻る。', easyVersion: '脚を大きく引かずに小さく行う。', caution: '前ひざがつま先より大きく前へ出すぎない。痛みがあれば中止。' },
      { id: 'lb3-2', name: 'もも上げウォーク', durationSeconds: 50, instruction: 'その場で歩くようにももを軽く上げる。', easyVersion: 'ひざを低く上げる。', caution: 'バランスが不安なら壁の近くで実施。' },
    ],
  },

  {
    id: 'core-1', title: 'お腹やさしく目覚め', skillTree: 'core', difficulty: 'beginner', totalMinutes: 4, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'co1-1', name: 'ドローイン呼吸', durationSeconds: 60, instruction: '鼻から吸って、お腹を薄く保ちながら口から吐く。', easyVersion: '仰向けでひざを立てて行う。', caution: '息を止めない。めまいがあれば中止。' },
      { id: 'co1-2', name: 'デッドバグ（片側）', reps: '左右各6回', instruction: '反対の手足をゆっくり伸ばして戻す。', easyVersion: '脚だけ伸ばす。', caution: '腰が反るなら可動域を小さくする。腰痛があれば中止。' },
      { id: 'co1-3', name: 'ニーアップ座位', reps: '8回', instruction: '椅子に浅く座り、片脚ずつひざを持ち上げる。', easyVersion: '手で太ももを軽く支える。', caution: '腰に鋭い痛みが出たら中止。' },
    ],
  },
  {
    id: 'core-2', title: '姿勢キープ入門', skillTree: 'core', difficulty: 'beginner', totalMinutes: 5, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'co2-1', name: 'バードドッグ', reps: '左右各6回', instruction: '四つんばいで反対の手足を伸ばして戻す。', easyVersion: '脚のみ伸ばす。', caution: '腰が反る・肩がすくむ場合は小さく行う。' },
      { id: 'co2-2', name: 'サイドプランク（ひざ付き）', durationSeconds: 30, instruction: 'ひざを床につけたまま体側を持ち上げる。', easyVersion: '肘の位置を肩より少し前にして短時間。', caution: '肩や腰に痛みがあるときは中止。' },
      { id: 'co2-3', name: 'キャット&カウ', durationSeconds: 45, instruction: '背中を丸める・反らすをゆっくり繰り返す。', easyVersion: '可動域を小さくする。', caution: '腰の詰まり感が強いときは中止。' },
    ],
  },
  {
    id: 'core-3', title: '体幹バランス3分', skillTree: 'core', difficulty: 'beginner', totalMinutes: 3, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'co3-1', name: 'スタンディングツイスト', durationSeconds: 50, instruction: '骨盤を安定させ、胸からやさしく左右にひねる。', easyVersion: 'ひねる角度を半分にする。', caution: '腰を勢いよく回さない。腰に痛みがあれば中止。' },
      { id: 'co3-2', name: '壁プランク', durationSeconds: 40, instruction: '壁に前腕をつき、一直線姿勢を保つ。', easyVersion: '壁に近づいて負荷を下げる。', caution: '肩や手首に痛みがあれば中止。' },
    ],
  },

  {
    id: 'upper-body-1', title: '肩まわりウォームアップ', skillTree: 'upper-body', difficulty: 'beginner', totalMinutes: 4, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ub1-1', name: '肩甲骨よせ', reps: '10回', instruction: '胸を軽く開き、肩甲骨を背中で寄せて戻す。', easyVersion: '可動域を小さくしてゆっくり。', caution: '肩に刺すような痛みがあれば中止。' },
      { id: 'ub1-2', name: '壁プッシュアップ', reps: '8回', instruction: '壁に手をついて腕立ての動きを行う。', easyVersion: '壁に近づいて浅く曲げる。', caution: '肩がすくまないようにし、肩痛があれば中止。' },
      { id: 'ub1-3', name: '首すじストレッチ', durationSeconds: 40, instruction: '首を斜め前に倒して首すじを伸ばす。', easyVersion: '手で引かず自然な重みだけで伸ばす。', caution: 'しびれやめまいがある場合は中止。' },
    ],
  },
  {
    id: 'upper-body-2', title: '腕と背中の基礎', skillTree: 'upper-body', difficulty: 'beginner', totalMinutes: 5, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ub2-1', name: 'タオルなしローイング動作', reps: '10回', instruction: 'ひじを後ろへ引き、背中を寄せるイメージで動く。', easyVersion: 'ひじの引きを浅くする。', caution: '腰を反らしすぎず、肩痛があれば中止。' },
      { id: 'ub2-2', name: 'アームサークル', durationSeconds: 50, instruction: '腕を小さく前回し・後ろ回しする。', easyVersion: '肘を軽く曲げて回す。', caution: '肩が詰まる感覚があれば中止。' },
      { id: 'ub2-3', name: '胸ひらきストレッチ', durationSeconds: 40, instruction: '両手を後ろで組むようにして胸を開く。', easyVersion: '手は組まずに肩を後ろへ引くだけ。', caution: '肩前面に痛みが出る角度は避ける。' },
    ],
  },
  {
    id: 'upper-body-3', title: '上半身ライトサーキット', skillTree: 'upper-body', difficulty: 'beginner', totalMinutes: 3, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ub3-1', name: 'ひじタッチプレス', reps: '8回', instruction: '胸の前でひじを寄せ、ゆっくり腕を前へ押し出す。', easyVersion: '可動域を小さくして行う。', caution: '肩関節に痛みが出る動きは中止。' },
      { id: 'ub3-2', name: '壁Y字リフト', reps: '8回', instruction: '壁に背をつけて腕をY字に上げ下げする。', easyVersion: '肘を曲げたまま短い範囲で行う。', caution: '腰が反る場合は腹部を軽く締める。肩痛があれば中止。' },
    ],
  },

  {
    id: 'flexibility-1', title: '全身ゆるめストレッチ', skillTree: 'flexibility', difficulty: 'beginner', totalMinutes: 4, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'fl1-1', name: '前もも&股関節ストレッチ', durationSeconds: 45, instruction: '片脚を後ろに引き、股関節前をやさしく伸ばす。', easyVersion: '壁に手をついてバランス補助。', caution: '腰を反らしすぎると腰負担が増えるので中止目安を守る。' },
      { id: 'fl1-2', name: '体側のばし', durationSeconds: 45, instruction: '頭上で手を組み、左右にゆっくり倒す。', easyVersion: '片手を腰に置いて小さく倒す。', caution: '肩が痛む角度は避ける。' },
      { id: 'fl1-3', name: 'ふくらはぎストレッチ', durationSeconds: 40, instruction: '壁に手をついて片脚ずつかかとを床へ押す。', easyVersion: '後ろ脚を近づけて負荷を下げる。', caution: 'ひざを伸ばし切って痛む場合は軽く曲げる。' },
    ],
  },
  {
    id: 'flexibility-2', title: '肩腰リセット', skillTree: 'flexibility', difficulty: 'beginner', totalMinutes: 5, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'fl2-1', name: 'チャイルドポーズ', durationSeconds: 50, instruction: '正座から上体を前へ倒し、背中を広げる。', easyVersion: 'お尻の下にクッションを入れるイメージで浅く。', caution: 'ひざに痛みがある場合は中止。' },
      { id: 'fl2-2', name: '胸椎ひねり（四つんばい）', reps: '左右各6回', instruction: '片手を頭に添え、胸を開くようにひじを上げる。', easyVersion: 'ひじを少しだけ動かす。', caution: '腰をひねりすぎない。腰痛時は中止。' },
      { id: 'fl2-3', name: 'お尻ストレッチ座位', durationSeconds: 45, instruction: '椅子で片脚を反対ひざに乗せ、上体を軽く前へ。', easyVersion: '前傾を浅くし、20秒ずつ。', caution: 'ひざ外側に痛みが出たら中止。' },
    ],
  },
  {
    id: 'flexibility-3', title: '寝る前の3分ケア', skillTree: 'flexibility', difficulty: 'beginner', totalMinutes: 3, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'fl3-1', name: '首肩リリース呼吸', durationSeconds: 60, instruction: '肩をすくめて下ろす動きを呼吸に合わせて行う。', easyVersion: '肩を小さく動かす。', caution: '首や肩に痛みがある日は中止。' },
      { id: 'fl3-2', name: 'ハムストリング軽ストレッチ', durationSeconds: 45, instruction: '片脚を前に出し、背すじを保って前傾する。', easyVersion: 'ひざを軽く曲げたまま行う。', caution: '腰が丸まって痛む場合は中止。' },
    ],
  },

  {
    id: 'cardio-1', title: 'やさしい有酸素スタート', skillTree: 'cardio', difficulty: 'beginner', totalMinutes: 4, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ca1-1', name: 'その場ウォーク', durationSeconds: 70, instruction: '腕を軽く振りながら一定リズムで歩く。', easyVersion: '歩幅を小さくして実施。', caution: '息切れが強い場合は中止して休む。' },
      { id: 'ca1-2', name: 'サイドステップ', durationSeconds: 60, instruction: '左右に一歩ずつ移動し、リズムよく戻る。', easyVersion: '移動幅を半分にする。', caution: 'ひざが内側に入る動きは避ける。' },
      { id: 'ca1-3', name: 'クールダウン深呼吸', durationSeconds: 40, instruction: '歩きを止め、鼻吸い口吐きで呼吸を整える。', easyVersion: '座って行う。', caution: 'めまいや胸の不快感があれば中止。' },
    ],
  },
  {
    id: 'cardio-2', title: '全身ぽかぽか3種', skillTree: 'cardio', difficulty: 'beginner', totalMinutes: 5, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ca2-1', name: 'ローインパクトジャック', durationSeconds: 60, instruction: 'ジャンプせず、片脚ずつ開閉しながら腕を上げる。', easyVersion: '腕は肩の高さまで。', caution: '肩痛やひざ痛がある場合は可動域を下げるか中止。' },
      { id: 'ca2-2', name: 'ニーリフト&タッチ', durationSeconds: 60, instruction: 'ひざを上げて反対手でタッチする。', easyVersion: 'ひざは低く、テンポを落とす。', caution: '腰が反りやすいので腹部を軽く締める。腰痛なら中止。' },
      { id: 'ca2-3', name: 'ヒールタップ', durationSeconds: 50, instruction: 'かかとを前に出し、交互にタップする。', easyVersion: '椅子の背に手を添える。', caution: 'バランス不安やひざ痛がある場合は中止。' },
    ],
  },
  {
    id: 'cardio-3', title: '有酸素クイック3分', skillTree: 'cardio', difficulty: 'beginner', totalMinutes: 3, equipment: 'none', beginnerFriendly: true, safetyNote: commonSafetyNote,
    xp: 10,
    exercises: [
      { id: 'ca3-1', name: 'パンチウォーク', durationSeconds: 50, instruction: 'その場歩きに合わせて前へ軽くパンチする。', easyVersion: '腕は胸の高さまで。', caution: '肩に痛みがある日は腕を下げるか中止。' },
      { id: 'ca3-2', name: 'トゥタップ', durationSeconds: 50, instruction: 'つま先で前方を軽くタップしながら交互に動く。', easyVersion: 'テンポを落とす。', caution: 'すねやひざに痛みがあれば中止。' },
    ],
  },
];
