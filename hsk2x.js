/* YaHa — HSK2 expansion pack: phrases, dialogues, and grammar lessons that bring
   the HSK2 units to full HSK1 parity (words + phrases + story + grammar + exam).
   Vocabulary sticks to HSK1+HSK2 words (data.js + hsk2.js) so nothing is unfair.
   Plain script (no modules). Assigns window.YAHA_HSK2X.
   - phrases: keyed by HSK2 unit id (see H2_SPEC in path.js)
   - dialogues: keyed by HSK2 unit id, story-node shape {title, emoji, turns}
   - grammar: same shape as YAHA_TAIWAN.grammar (gintro/gbuild compatible) */

window.YAHA_HSK2X = {

phrases: {
  "h-people": [
    { hanzi: "大家好！", pinyin: "dàjiā hǎo!", en: "Hello everyone!", scenario: "h-people", note: "warm opener for a group" },
    { hanzi: "这是我妻子。", pinyin: "zhè shì wǒ qīzi.", en: "This is my wife.", scenario: "h-people", note: "swap 妻子 for 丈夫/哥哥/妹妹…" },
    { hanzi: "我哥哥很高。", pinyin: "wǒ gēge hěn gāo.", en: "My older brother is very tall.", scenario: "h-people", note: "" },
    { hanzi: "你的孩子几岁了？", pinyin: "nǐ de háizi jǐ suì le?", en: "How old is your child?", scenario: "h-people", note: "几岁 for kids; 多大 for adults" },
    { hanzi: "您贵姓？", pinyin: "nín guìxìng?", en: "May I ask your surname?", scenario: "h-people", note: "polite — answer 我姓…" },
    { hanzi: "让我介绍一下。", pinyin: "ràng wǒ jièshào yíxià.", en: "Let me introduce (someone).", scenario: "h-people", note: "一下 softens it" }
  ],
  "h-body": [
    { hanzi: "我生病了，想休息。", pinyin: "wǒ shēngbìng le, xiǎng xiūxi.", en: "I'm sick and want to rest.", scenario: "h-body", note: "" },
    { hanzi: "你要多喝水。", pinyin: "nǐ yào duō hē shuǐ.", en: "You should drink more water.", scenario: "h-body", note: "多 + verb = do more of it" },
    { hanzi: "我的眼睛很累。", pinyin: "wǒ de yǎnjing hěn lèi.", en: "My eyes are very tired.", scenario: "h-body", note: "too much phone!" },
    { hanzi: "吃药了吗？", pinyin: "chī yào le ma?", en: "Have you taken your medicine?", scenario: "h-body", note: "吃药 = literally 'eat medicine'" },
    { hanzi: "我身体很好。", pinyin: "wǒ shēntǐ hěn hǎo.", en: "I'm in good health.", scenario: "h-body", note: "身体 = body, here 'health'" }
  ],
  "h-time": [
    { hanzi: "现在几点了？", pinyin: "xiànzài jǐ diǎn le?", en: "What time is it now?", scenario: "h-time", note: "" },
    { hanzi: "我每天早上跑步。", pinyin: "wǒ měitiān zǎoshang pǎobù.", en: "I run every morning.", scenario: "h-time", note: "每天 = every day" },
    { hanzi: "你什么时候上班？", pinyin: "nǐ shénme shíhou shàngbān?", en: "When do you go to work?", scenario: "h-time", note: "什么时候 = when" },
    { hanzi: "今天是我的生日。", pinyin: "jīntiān shì wǒ de shēngrì.", en: "Today is my birthday.", scenario: "h-time", note: "🎂 生日快乐 = happy birthday!" },
    { hanzi: "我等了一个小时。", pinyin: "wǒ děng le yí gè xiǎoshí.", en: "I waited for an hour.", scenario: "h-time", note: "" }
  ],
  "h-food": [
    { hanzi: "服务员，买单！", pinyin: "fúwùyuán, mǎidān!", en: "Waiter, the check please!", scenario: "h-food", note: "" },
    { hanzi: "这个菜真好吃！", pinyin: "zhège cài zhēn hǎochī!", en: "This dish is really tasty!", scenario: "h-food", note: "真 = really" },
    { hanzi: "我要吃面条。", pinyin: "wǒ yào chī miàntiáo.", en: "I want to eat noodles.", scenario: "h-food", note: "" },
    { hanzi: "西瓜比苹果便宜。", pinyin: "xīguā bǐ píngguǒ piányi.", en: "Watermelon is cheaper than apples.", scenario: "h-food", note: "比 = than (comparison)" },
    { hanzi: "你喝咖啡还是茶？", pinyin: "nǐ hē kāfēi háishi chá?", en: "Coffee or tea?", scenario: "h-food", note: "还是 = or (in questions)" },
    { hanzi: "我不喝牛奶。", pinyin: "wǒ bù hē niúnǎi.", en: "I don't drink milk.", scenario: "h-food", note: "" }
  ],
  "h-places": [
    { hanzi: "火车站离这儿远吗？", pinyin: "huǒchēzhàn lí zhèr yuǎn ma?", en: "Is the train station far from here?", scenario: "h-places", note: "离 = distance from" },
    { hanzi: "我在机场等你。", pinyin: "wǒ zài jīchǎng děng nǐ.", en: "I'll wait for you at the airport.", scenario: "h-places", note: "" },
    { hanzi: "宾馆旁边有商店。", pinyin: "bīnguǎn pángbiān yǒu shāngdiàn.", en: "There's a shop next to the hotel.", scenario: "h-places", note: "旁边 = beside" },
    { hanzi: "怎么去公司？", pinyin: "zěnme qù gōngsī?", en: "How do I get to the company?", scenario: "h-places", note: "怎么 + verb = how to" },
    { hanzi: "洗手间在左边。", pinyin: "xǐshǒujiān zài zuǒbian.", en: "The restroom is on the left.", scenario: "h-places", note: "左边 left · 右边 right" }
  ],
  "h-things": [
    { hanzi: "你的手机真漂亮！", pinyin: "nǐ de shǒujī zhēn piàoliang!", en: "Your phone is really pretty!", scenario: "h-things", note: "" },
    { hanzi: "这件衣服太大了。", pinyin: "zhè jiàn yīfu tài dà le.", en: "This piece of clothing is too big.", scenario: "h-things", note: "件 = measure word for clothes" },
    { hanzi: "我喜欢红的。", pinyin: "wǒ xǐhuan hóng de.", en: "I like the red one.", scenario: "h-things", note: "color + 的 = 'the ___ one'" },
    { hanzi: "报纸在桌子上。", pinyin: "bàozhǐ zài zhuōzi shàng.", en: "The newspaper is on the table.", scenario: "h-things", note: "" },
    { hanzi: "你的手表是新的吗？", pinyin: "nǐ de shǒubiǎo shì xīn de ma?", en: "Is your watch new?", scenario: "h-things", note: "" }
  ],
  "h-verbs": [
    { hanzi: "我们一起去游泳吧！", pinyin: "wǒmen yìqǐ qù yóuyǒng ba!", en: "Let's go swimming together!", scenario: "h-verbs", note: "吧 makes it a friendly suggestion" },
    { hanzi: "你会跳舞吗？", pinyin: "nǐ huì tiàowǔ ma?", en: "Can you dance?", scenario: "h-verbs", note: "" },
    { hanzi: "请再说一次。", pinyin: "qǐng zài shuō yí cì.", en: "Please say it one more time.", scenario: "h-verbs", note: "essential learner phrase!" },
    { hanzi: "我正在学习汉语。", pinyin: "wǒ zhèngzài xuéxí Hànyǔ.", en: "I'm studying Chinese right now.", scenario: "h-verbs", note: "正在 = in the middle of" },
    { hanzi: "我去过中国。", pinyin: "wǒ qùguo Zhōngguó.", en: "I've been to China.", scenario: "h-verbs", note: "过 = have done before" },
    { hanzi: "别走！", pinyin: "bié zǒu!", en: "Don't go!", scenario: "h-verbs", note: "别 + verb = don't" }
  ],
  "h-adj": [
    { hanzi: "今天天气真好！", pinyin: "jīntiān tiānqì zhēn hǎo!", en: "The weather is really nice today!", scenario: "h-adj", note: "the classic small-talk opener" },
    { hanzi: "外面在下雪。", pinyin: "wàimian zài xià xuě.", en: "It's snowing outside.", scenario: "h-adj", note: "" },
    { hanzi: "他跑得很快。", pinyin: "tā pǎo de hěn kuài.", en: "He runs very fast.", scenario: "h-adj", note: "verb + 得 + how" },
    { hanzi: "这个最便宜。", pinyin: "zhège zuì piányi.", en: "This one is the cheapest.", scenario: "h-adj", note: "最 = the most" },
    { hanzi: "明天是晴天。", pinyin: "míngtiān shì qíngtiān.", en: "Tomorrow will be sunny.", scenario: "h-adj", note: "晴 sunny · 阴 cloudy" }
  ],
  "h-glue": [
    { hanzi: "因为下雨，所以我不去。", pinyin: "yīnwèi xiàyǔ, suǒyǐ wǒ bú qù.", en: "Because it's raining, I'm not going.", scenario: "h-glue", note: "因为…所以… pair" },
    { hanzi: "虽然很贵，但是我喜欢。", pinyin: "suīrán hěn guì, dànshì wǒ xǐhuan.", en: "Although it's expensive, I like it.", scenario: "h-glue", note: "虽然…但是… pair" },
    { hanzi: "我已经知道了。", pinyin: "wǒ yǐjīng zhīdào le.", en: "I already know.", scenario: "h-glue", note: "已经 = already" },
    { hanzi: "我可能不去。", pinyin: "wǒ kěnéng bú qù.", en: "I might not go.", scenario: "h-glue", note: "可能 = maybe" },
    { hanzi: "别说话！", pinyin: "bié shuōhuà!", en: "Stop talking! / Quiet!", scenario: "h-glue", note: "for the library… or siblings" }
  ]
},

dialogues: {
  "h-body": {
    title: "Seeing the doctor",
    emoji: "🏥",
    turns: [
      { who: "A", hanzi: "医生，我生病了。", pinyin: "Yīshēng, wǒ shēngbìng le.", en: "Doctor, I'm sick." },
      { who: "B", hanzi: "你哪儿不好？", pinyin: "Nǐ nǎr bù hǎo?", en: "Where do you feel unwell?" },
      { who: "A", hanzi: "我很累，不想吃东西。", pinyin: "Wǒ hěn lèi, bù xiǎng chī dōngxi.", en: "I'm very tired and don't want to eat." },
      { who: "B", hanzi: "你要多休息，多喝水。", pinyin: "Nǐ yào duō xiūxi, duō hē shuǐ.", en: "You need to rest more and drink more water." },
      { who: "A", hanzi: "要吃药吗？", pinyin: "Yào chī yào ma?", en: "Do I need to take medicine?" },
      { who: "B", hanzi: "要，一天三次。", pinyin: "Yào, yì tiān sān cì.", en: "Yes, three times a day." },
      { who: "A", hanzi: "谢谢医生！", pinyin: "Xièxie yīshēng!", en: "Thank you, doctor!" }
    ]
  },
  "h-things": {
    title: "Bargain hunting",
    emoji: "🛍️",
    turns: [
      { who: "A", hanzi: "这件衣服多少钱？", pinyin: "Zhè jiàn yīfu duōshao qián?", en: "How much is this piece of clothing?" },
      { who: "B", hanzi: "一百块。", pinyin: "Yìbǎi kuài.", en: "100 yuan." },
      { who: "A", hanzi: "太贵了！那件呢？", pinyin: "Tài guì le! Nà jiàn ne?", en: "Too expensive! What about that one?" },
      { who: "B", hanzi: "那件八十块。", pinyin: "Nà jiàn bāshí kuài.", en: "That one is 80 yuan." },
      { who: "A", hanzi: "这件比那件漂亮，但是太贵了。", pinyin: "Zhè jiàn bǐ nà jiàn piàoliang, dànshì tài guì le.", en: "This one is prettier than that one, but it's too expensive." },
      { who: "B", hanzi: "好吧，九十块给你。", pinyin: "Hǎo ba, jiǔshí kuài gěi nǐ.", en: "Fine, 90 yuan for you." },
      { who: "A", hanzi: "谢谢！我买这件。", pinyin: "Xièxie! Wǒ mǎi zhè jiàn.", en: "Thanks! I'll buy this one." }
    ]
  },
  "h-verbs": {
    title: "Weekend plans",
    emoji: "⚽",
    turns: [
      { who: "A", hanzi: "明天你想做什么？", pinyin: "Míngtiān nǐ xiǎng zuò shénme?", en: "What do you want to do tomorrow?" },
      { who: "B", hanzi: "我想去踢足球，你呢？", pinyin: "Wǒ xiǎng qù tī zúqiú, nǐ ne?", en: "I want to play soccer. You?" },
      { who: "A", hanzi: "我不会踢足球，我喜欢游泳。", pinyin: "Wǒ bú huì tī zúqiú, wǒ xǐhuan yóuyǒng.", en: "I can't play soccer, I like swimming." },
      { who: "B", hanzi: "那我们上午游泳，下午踢足球，怎么样？", pinyin: "Nà wǒmen shàngwǔ yóuyǒng, xiàwǔ tī zúqiú, zěnmeyàng?", en: "Then let's swim in the morning and play soccer in the afternoon, how about it?" },
      { who: "A", hanzi: "好！几点开始？", pinyin: "Hǎo! Jǐ diǎn kāishǐ?", en: "Great! What time do we start?" },
      { who: "B", hanzi: "早上九点，别晚了！", pinyin: "Zǎoshang jiǔ diǎn, bié wǎn le!", en: "Nine in the morning — don't be late!" },
      { who: "A", hanzi: "好的，明天见！", pinyin: "Hǎo de, míngtiān jiàn!", en: "Okay, see you tomorrow!" }
    ]
  },
  "h-places": {
    title: "Trip stories",
    emoji: "✈️",
    turns: [
      { who: "A", hanzi: "你去过北京吗？", pinyin: "Nǐ qùguo Běijīng ma?", en: "Have you been to Beijing?" },
      { who: "B", hanzi: "去过，去年去的。", pinyin: "Qùguo, qùnián qù de.", en: "I have — I went last year." },
      { who: "A", hanzi: "北京怎么样？", pinyin: "Běijīng zěnmeyàng?", en: "How was Beijing?" },
      { who: "B", hanzi: "非常大，也非常漂亮。", pinyin: "Fēicháng dà, yě fēicháng piàoliang.", en: "Very big, and very beautiful." },
      { who: "A", hanzi: "你是怎么去的？", pinyin: "Nǐ shì zěnme qù de?", en: "How did you get there?" },
      { who: "B", hanzi: "坐飞机去的，飞机票很贵。", pinyin: "Zuò fēijī qù de, fēijī piào hěn guì.", en: "By plane — the plane ticket was expensive." },
      { who: "A", hanzi: "我也想去！", pinyin: "Wǒ yě xiǎng qù!", en: "I want to go too!" },
      { who: "B", hanzi: "我们明年一起去吧！", pinyin: "Wǒmen míngnián yìqǐ qù ba!", en: "Let's go together next year!" }
    ]
  }
},

grammar: [
  {
    id: "h2g1",
    title: "比 comparisons (than)",
    pattern: "A + 比 + B + adjective",
    explain: "比 (bǐ) compares two things: A 比 B tall = A is taller than B. The adjective comes last and never needs 很.",
    examples: [
      { hanzi: "我比他高", pinyin: "wǒ bǐ tā gāo", en: "I am taller than him." },
      { hanzi: "这个比那个便宜", pinyin: "zhège bǐ nàge piányi", en: "This one is cheaper than that one." },
      { hanzi: "今天比昨天热", pinyin: "jīntiān bǐ zuótiān rè", en: "Today is hotter than yesterday." }
    ],
    exercises: [
      { words: ["我", "比", "他", "高"], answer: "我比他高", en: "I am taller than him." },
      { words: ["这个", "比", "那个", "便宜"], answer: "这个比那个便宜", en: "This one is cheaper than that one." },
      { words: ["今天", "比", "昨天", "热"], answer: "今天比昨天热", en: "Today is hotter than yesterday." }
    ]
  },
  {
    id: "h2g2",
    title: "得 — how you do it",
    pattern: "verb + 得 + description",
    explain: "得 (de) links a verb to HOW it's done: 跑得快 = run fast. Think of 得 as 'in a way that is…'.",
    examples: [
      { hanzi: "他跑得很快", pinyin: "tā pǎo de hěn kuài", en: "He runs very fast." },
      { hanzi: "她说得真好", pinyin: "tā shuō de zhēn hǎo", en: "She speaks really well." },
      { hanzi: "你写得很漂亮", pinyin: "nǐ xiě de hěn piàoliang", en: "You write very beautifully." }
    ],
    exercises: [
      { words: ["他", "跑", "得", "很", "快"], answer: "他跑得很快", en: "He runs very fast." },
      { words: ["她", "说", "得", "真", "好"], answer: "她说得真好", en: "She speaks really well." },
      { words: ["你", "写", "得", "很", "漂亮"], answer: "你写得很漂亮", en: "You write very beautifully." }
    ]
  },
  {
    id: "h2g3",
    title: "过 — been there, done that",
    pattern: "verb + 过 (+ object)",
    explain: "过 (guo) right after a verb means you've had that experience at least once: 去过 = have been, 吃过 = have eaten (before).",
    examples: [
      { hanzi: "我去过中国", pinyin: "wǒ qùguo Zhōngguó", en: "I have been to China." },
      { hanzi: "你吃过面条吗？", pinyin: "nǐ chīguo miàntiáo ma?", en: "Have you ever eaten noodles?" },
      { hanzi: "我看过这个电影", pinyin: "wǒ kànguo zhège diànyǐng", en: "I have seen this movie." }
    ],
    exercises: [
      { words: ["我", "去", "过", "中国"], answer: "我去过中国", en: "I have been to China." },
      { words: ["你", "吃", "过", "面条", "吗"], answer: "你吃过面条吗？", en: "Have you ever eaten noodles?" },
      { words: ["我", "看", "过", "这个", "电影"], answer: "我看过这个电影", en: "I have seen this movie." }
    ]
  },
  {
    id: "h2g4",
    title: "正在 — happening right now",
    pattern: "subject + 正在 + verb",
    explain: "正在 (zhèngzài) marks an action in progress right now, like English '-ing': 我正在吃 = I am eating (at this moment).",
    examples: [
      { hanzi: "我正在吃饭", pinyin: "wǒ zhèngzài chīfàn", en: "I am eating (right now)." },
      { hanzi: "他正在学习", pinyin: "tā zhèngzài xuéxí", en: "He is studying (right now)." },
      { hanzi: "妈妈正在做饭", pinyin: "māma zhèngzài zuòfàn", en: "Mom is cooking (right now)." }
    ],
    exercises: [
      { words: ["我", "正在", "吃饭"], answer: "我正在吃饭", en: "I am eating right now." },
      { words: ["他", "正在", "学习"], answer: "他正在学习", en: "He is studying right now." },
      { words: ["妈妈", "正在", "做饭"], answer: "妈妈正在做饭", en: "Mom is cooking right now." }
    ]
  },
  {
    id: "h2g5",
    title: "要…了 — about to happen",
    pattern: "(快)要 + verb + 了",
    explain: "要…了 (yào…le) wraps a verb to say it's about to happen very soon. Add 快 for extra 'any second now!'.",
    examples: [
      { hanzi: "飞机要起飞了", pinyin: "fēijī yào qǐfēi le", en: "The plane is about to take off." },
      { hanzi: "我们要到了", pinyin: "wǒmen yào dào le", en: "We're almost there." },
      { hanzi: "快要下雨了", pinyin: "kuài yào xiàyǔ le", en: "It's about to rain." }
    ],
    exercises: [
      { words: ["飞机", "要", "起飞", "了"], answer: "飞机要起飞了", en: "The plane is about to take off." },
      { words: ["我们", "要", "到", "了"], answer: "我们要到了", en: "We're almost there." },
      { words: ["快", "要", "下雨", "了"], answer: "快要下雨了", en: "It's about to rain." }
    ]
  },
  {
    id: "h2g6",
    title: "因为…所以… (because…so…)",
    pattern: "因为 + reason，所以 + result",
    explain: "Chinese loves to use BOTH halves: 因为 (because) opens the reason and 所以 (so) opens the result. Using the pair sounds natural, not repetitive.",
    examples: [
      { hanzi: "因为下雨，所以我不去", pinyin: "yīnwèi xiàyǔ, suǒyǐ wǒ bú qù", en: "Because it's raining, I'm not going." },
      { hanzi: "因为很贵，所以我不买", pinyin: "yīnwèi hěn guì, suǒyǐ wǒ bù mǎi", en: "Because it's expensive, I'm not buying it." },
      { hanzi: "因为我生病了，所以想休息", pinyin: "yīnwèi wǒ shēngbìng le, suǒyǐ xiǎng xiūxi", en: "Because I'm sick, I want to rest." }
    ],
    exercises: [
      { words: ["因为", "下雨", "所以", "我", "不", "去"], answer: "因为下雨，所以我不去", en: "Because it's raining, I'm not going." },
      { words: ["因为", "很", "贵", "所以", "我", "不", "买"], answer: "因为很贵，所以我不买", en: "Because it's expensive, I'm not buying it." }
    ]
  },
  {
    id: "h2g7",
    title: "虽然…但是… (although…but…)",
    pattern: "虽然 + fact，但是 + contrast",
    explain: "Same pair-logic as 因为…所以…: 虽然 (although) sets up a fact, 但是 (but) delivers the twist. Chinese uses both halves together.",
    examples: [
      { hanzi: "虽然很贵，但是我喜欢", pinyin: "suīrán hěn guì, dànshì wǒ xǐhuan", en: "Although it's expensive, I like it." },
      { hanzi: "虽然很累，但是很快乐", pinyin: "suīrán hěn lèi, dànshì hěn kuàilè", en: "Although (I'm) tired, (I'm) very happy." },
      { hanzi: "虽然下雨，但是我们去玩", pinyin: "suīrán xiàyǔ, dànshì wǒmen qù wán", en: "Although it's raining, we're going out to have fun." }
    ],
    exercises: [
      { words: ["虽然", "很", "贵", "但是", "我", "喜欢"], answer: "虽然很贵，但是我喜欢", en: "Although it's expensive, I like it." },
      { words: ["虽然", "很", "累", "但是", "很", "快乐"], answer: "虽然很累，但是很快乐", en: "Although tired, very happy." }
    ]
  },
  {
    id: "h2g8",
    title: "离 — how far apart",
    pattern: "A + 离 + B + 近/远",
    explain: "离 (lí) measures the gap between two places: A 离 B 很近 = A is close to B. The distance word (近/远) always comes last.",
    examples: [
      { hanzi: "我家离学校很近", pinyin: "wǒ jiā lí xuéxiào hěn jìn", en: "My home is close to school." },
      { hanzi: "机场离这儿很远", pinyin: "jīchǎng lí zhèr hěn yuǎn", en: "The airport is far from here." },
      { hanzi: "商店离宾馆不远", pinyin: "shāngdiàn lí bīnguǎn bù yuǎn", en: "The shop isn't far from the hotel." }
    ],
    exercises: [
      { words: ["我", "家", "离", "学校", "很", "近"], answer: "我家离学校很近", en: "My home is close to school." },
      { words: ["机场", "离", "这儿", "很", "远"], answer: "机场离这儿很远", en: "The airport is far from here." },
      { words: ["商店", "离", "宾馆", "不", "远"], answer: "商店离宾馆不远", en: "The shop isn't far from the hotel." }
    ]
  }
]

};
