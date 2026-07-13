// YaHa — Taiwan Reality Pack
// Simplified characters + pinyin tone marks, HSK1-level content for a learner visiting Taiwan.
// Plain script, no modules.

window.YAHA_TAIWAN = {

  grammar: [
    {
      id: "g1",
      title: "Basic word order (SVO)",
      pattern: "Subject + Verb + Object",
      explain: "Chinese word order is a lot like English: subject, then verb, then object. If you can say it in English in that order, you can usually say it in Chinese the same way.",
      examples: [
        { hanzi: "我喝茶", pinyin: "wǒ hē chá", en: "I drink tea." },
        { hanzi: "他吃面", pinyin: "tā chī miàn", en: "He eats noodles." },
        { hanzi: "我们看电影", pinyin: "wǒmen kàn diànyǐng", en: "We watch a movie." }
      ],
      exercises: [
        { words: ["我", "喝", "茶"], answer: "我喝茶", en: "I drink tea." },
        { words: ["他", "吃", "面"], answer: "他吃面", en: "He eats noodles." },
        { words: ["我", "喜欢", "你"], answer: "我喜欢你", en: "I like you." }
      ]
    },
    {
      id: "g2",
      title: "是 sentences (to be)",
      pattern: "A + 是 + B",
      explain: "是 (shì) means \"to be\" and links two things that are the same, like a name plus a category. It doesn't change form no matter who the subject is.",
      examples: [
        { hanzi: "我是学生", pinyin: "wǒ shì xuéshēng", en: "I am a student." },
        { hanzi: "他是老师", pinyin: "tā shì lǎoshī", en: "He is a teacher." },
        { hanzi: "这是我的朋友", pinyin: "zhè shì wǒ de péngyou", en: "This is my friend." }
      ],
      exercises: [
        { words: ["我", "是", "学生"], answer: "我是学生", en: "I am a student." },
        { words: ["她", "是", "老师"], answer: "她是老师", en: "She is a teacher." },
        { words: ["这", "是", "水"], answer: "这是水", en: "This is water." }
      ]
    },
    {
      id: "g3",
      title: "吗 questions",
      pattern: "Statement + 吗?",
      explain: "The easiest way to ask a yes/no question is to just add 吗 (ma) to the end of a normal statement. No word order changes needed — that's the whole trick.",
      examples: [
        { hanzi: "你是学生吗", pinyin: "nǐ shì xuéshēng ma", en: "Are you a student?" },
        { hanzi: "你喝茶吗", pinyin: "nǐ hē chá ma", en: "Do you drink tea?" },
        { hanzi: "你忙吗", pinyin: "nǐ máng ma", en: "Are you busy?" }
      ],
      exercises: [
        { words: ["你", "是", "老师", "吗"], answer: "你是老师吗", en: "Are you a teacher?" },
        { words: ["你", "喝", "水", "吗"], answer: "你喝水吗", en: "Do you drink water?" },
        { words: ["你", "累", "吗"], answer: "你累吗", en: "Are you tired?" }
      ]
    },
    {
      id: "g4",
      title: "Question words (什么/哪/谁/几)",
      pattern: "Question word sits where the answer would go",
      explain: "Chinese question words don't move to the front like English \"what\" or \"who\" — they stay right where the answer word would be. So \"你喝什么\" is literally \"you drink what\".",
      examples: [
        { hanzi: "你喝什么", pinyin: "nǐ hē shénme", en: "What do you drink?" },
        { hanzi: "你是哪国人", pinyin: "nǐ shì nǎ guó rén", en: "Which country are you from?" },
        { hanzi: "他是谁", pinyin: "tā shì shéi", en: "Who is he?" }
      ],
      exercises: [
        { words: ["你", "喝", "什么"], answer: "你喝什么", en: "What do you drink?" },
        { words: ["他", "是", "谁"], answer: "他是谁", en: "Who is he?" },
        { words: ["你", "有", "几", "个", "朋友"], answer: "你有几个朋友", en: "How many friends do you have?" }
      ]
    },
    {
      id: "g5",
      title: "不 vs 没 negation",
      pattern: "不 + verb/adjective (general/now) · 没 + 有/verb (past/possession)",
      explain: "不 (bù) negates most things, including how something usually is or what someone doesn't want. 没 (méi) is different — use it for \"didn't happen\" or \"don't have\", almost always paired with 有 or a past action.",
      examples: [
        { hanzi: "我不喝咖啡", pinyin: "wǒ bù hē kāfēi", en: "I don't drink coffee." },
        { hanzi: "我没有钱", pinyin: "wǒ méiyǒu qián", en: "I don't have money." },
        { hanzi: "他没去学校", pinyin: "tā méi qù xuéxiào", en: "He didn't go to school." }
      ],
      exercises: [
        { words: ["我", "不", "喝", "咖啡"], answer: "我不喝咖啡", en: "I don't drink coffee." },
        { words: ["我", "没有", "钱"], answer: "我没有钱", en: "I don't have money." },
        { words: ["他", "不", "是", "老师"], answer: "他不是老师", en: "He is not a teacher." }
      ]
    },
    {
      id: "g6",
      title: "的 for possession",
      pattern: "Owner + 的 + Thing",
      explain: "的 (de) works like an apostrophe-s. Put the owner first, add 的, then the thing they own. \"我的\" is simply \"my/mine\".",
      examples: [
        { hanzi: "我的手机", pinyin: "wǒ de shǒujī", en: "my phone" },
        { hanzi: "他的名字", pinyin: "tā de míngzi", en: "his name" },
        { hanzi: "这是我的杯子", pinyin: "zhè shì wǒ de bēizi", en: "This is my cup." }
      ],
      exercises: [
        { words: ["我", "的", "手机"], answer: "我的手机", en: "my phone" },
        { words: ["这", "是", "她", "的", "包"], answer: "这是她的包", en: "This is her bag." },
        { words: ["他", "的", "朋友", "很", "好"], answer: "他的朋友很好", en: "His friend is very nice." }
      ]
    },
    {
      id: "g7",
      title: "Measure word 个 (and 杯/瓶 for drinks)",
      pattern: "Number + Measure word + Noun",
      explain: "You can't put a number straight onto a noun in Chinese — you need a measure word in between. 个 (gè) is the all-purpose one; for drinks, use 杯 (bēi, a cup of) or 瓶 (píng, a bottle of) instead.",
      examples: [
        { hanzi: "一个人", pinyin: "yí gè rén", en: "one person" },
        { hanzi: "一杯奶茶", pinyin: "yì bēi nǎichá", en: "one cup of milk tea" },
        { hanzi: "两瓶水", pinyin: "liǎng píng shuǐ", en: "two bottles of water" }
      ],
      exercises: [
        { words: ["一", "个", "人"], answer: "一个人", en: "one person" },
        { words: ["我", "要", "一", "杯", "奶茶"], answer: "我要一杯奶茶", en: "I want one milk tea." },
        { words: ["两", "瓶", "水"], answer: "两瓶水", en: "two bottles of water" }
      ]
    },
    {
      id: "g8",
      title: "有 for possession and existence",
      pattern: "Subject + 有 + Object",
      explain: "有 (yǒu) means \"to have\", and it also works for \"there is/are\" when you're talking about a place. It's negated with 没, not 不 — remember that pair.",
      examples: [
        { hanzi: "我有一个哥哥", pinyin: "wǒ yǒu yí gè gēge", en: "I have an older brother." },
        { hanzi: "这里有厕所吗", pinyin: "zhè li yǒu cèsuǒ ma", en: "Is there a bathroom here?" },
        { hanzi: "我没有时间", pinyin: "wǒ méiyǒu shíjiān", en: "I don't have time." }
      ],
      exercises: [
        { words: ["我", "有", "一", "个", "哥哥"], answer: "我有一个哥哥", en: "I have an older brother." },
        { words: ["这里", "有", "厕所", "吗"], answer: "这里有厕所吗", en: "Is there a bathroom here?" },
        { words: ["他", "没有", "手机"], answer: "他没有手机", en: "He doesn't have a phone." }
      ]
    },
    {
      id: "g9",
      title: "在 for location",
      pattern: "Subject + 在 + Place",
      explain: "在 (zài) means \"at/in/on\" and tells you where something or someone is. You can also use it before a verb to mean \"doing something right now\".",
      examples: [
        { hanzi: "我在台北", pinyin: "wǒ zài Táiběi", en: "I am in Taipei." },
        { hanzi: "他在家", pinyin: "tā zài jiā", en: "He is at home." },
        { hanzi: "厕所在哪里", pinyin: "cèsuǒ zài nǎlǐ", en: "Where is the bathroom?" }
      ],
      exercises: [
        { words: ["我", "在", "台北"], answer: "我在台北", en: "I am in Taipei." },
        { words: ["他", "在", "家"], answer: "他在家", en: "He is at home." },
        { words: ["厕所", "在", "哪里"], answer: "厕所在哪里", en: "Where is the bathroom?" }
      ]
    },
    {
      id: "g10",
      title: "Time words come before the verb",
      pattern: "Subject + Time + Verb",
      explain: "In Chinese, time words go right after the subject and before the verb, not at the end of the sentence like in English. Think \"I today go\" instead of \"I go today\".",
      examples: [
        { hanzi: "我今天很忙", pinyin: "wǒ jīntiān hěn máng", en: "I am busy today." },
        { hanzi: "他明天去台南", pinyin: "tā míngtiān qù Táinán", en: "He is going to Tainan tomorrow." },
        { hanzi: "我们现在吃饭", pinyin: "wǒmen xiànzài chīfàn", en: "We are eating now." }
      ],
      exercises: [
        { words: ["我", "今天", "很", "忙"], answer: "我今天很忙", en: "I am busy today." },
        { words: ["他", "明天", "去", "台南"], answer: "他明天去台南", en: "He is going to Tainan tomorrow." },
        { words: ["我们", "现在", "吃饭"], answer: "我们现在吃饭", en: "We are eating now." }
      ]
    },
    {
      id: "g11",
      title: "想/要 for wants",
      pattern: "Subject + 想/要 + Verb/Noun",
      explain: "想 (xiǎng) is a softer \"would like to\", while 要 (yào) is a stronger \"want\" and is also what you say when ordering something. Both go right before the verb or thing you want.",
      examples: [
        { hanzi: "我想喝奶茶", pinyin: "wǒ xiǎng hē nǎichá", en: "I'd like to drink milk tea." },
        { hanzi: "我要一杯珍珠奶茶", pinyin: "wǒ yào yì bēi zhēnzhū nǎichá", en: "I want one bubble milk tea." },
        { hanzi: "你想去哪里", pinyin: "nǐ xiǎng qù nǎlǐ", en: "Where would you like to go?" }
      ],
      exercises: [
        { words: ["我", "想", "喝", "奶茶"], answer: "我想喝奶茶", en: "I'd like to drink milk tea." },
        { words: ["我", "要", "一", "杯", "珍珠奶茶"], answer: "我要一杯珍珠奶茶", en: "I want one bubble milk tea." },
        { words: ["你", "想", "去", "哪里"], answer: "你想去哪里", en: "Where would you like to go?" }
      ]
    },
    {
      id: "g12",
      title: "会/能 for can",
      pattern: "Subject + 会/能 + Verb",
      explain: "会 (huì) is \"can\" for a learned skill, like speaking a language. 能 (néng) is \"can\" for ability or permission in the moment, like being allowed to do something right now.",
      examples: [
        { hanzi: "我会说中文", pinyin: "wǒ huì shuō Zhōngwén", en: "I can speak Chinese." },
        { hanzi: "我不会说英文", pinyin: "wǒ bú huì shuō Yīngwén", en: "I can't speak English." },
        { hanzi: "我能坐这里吗", pinyin: "wǒ néng zuò zhèlǐ ma", en: "Can I sit here?" }
      ],
      exercises: [
        { words: ["我", "会", "说", "中文"], answer: "我会说中文", en: "I can speak Chinese." },
        { words: ["我", "不", "会", "说", "英文"], answer: "我不会说英文", en: "I can't speak English." },
        { words: ["我", "能", "坐", "这里", "吗"], answer: "我能坐这里吗", en: "Can I sit here?" }
      ]
    },
    {
      id: "g13",
      title: "了 for completed action",
      pattern: "Subject + Verb + 了",
      explain: "了 (le) after a verb tells the listener the action is finished or already happened. It's the simplest way to talk about the past in Chinese — no verb changes needed.",
      examples: [
        { hanzi: "我吃了", pinyin: "wǒ chī le", en: "I already ate." },
        { hanzi: "他走了", pinyin: "tā zǒu le", en: "He left." },
        { hanzi: "我买了一杯奶茶", pinyin: "wǒ mǎi le yì bēi nǎichá", en: "I bought a milk tea." }
      ],
      exercises: [
        { words: ["我", "吃", "了"], answer: "我吃了", en: "I already ate." },
        { words: ["他", "走", "了"], answer: "他走了", en: "He left." },
        { words: ["我", "买", "了", "一", "杯", "奶茶"], answer: "我买了一杯奶茶", en: "I bought a milk tea." }
      ]
    },
    {
      id: "g14",
      title: "呢 for bounce-back questions",
      pattern: "Noun/Pronoun + 呢?",
      explain: "呢 (ne) is a quick way to ask \"and...?\" or \"what about...?\" by just attaching it to a noun, instead of repeating the whole question. It's very common in casual conversation.",
      examples: [
        { hanzi: "我很好，你呢", pinyin: "wǒ hěn hǎo, nǐ ne", en: "I'm good, and you?" },
        { hanzi: "我要奶茶，你呢", pinyin: "wǒ yào nǎichá, nǐ ne", en: "I want milk tea, what about you?" },
        { hanzi: "我的手机呢", pinyin: "wǒ de shǒujī ne", en: "Where's my phone?" }
      ],
      exercises: [
        { words: ["我", "很", "好", "你", "呢"], answer: "我很好你呢", en: "I'm good, and you?" },
        { words: ["我", "要", "奶茶", "你", "呢"], answer: "我要奶茶你呢", en: "I want milk tea, what about you?" },
        { words: ["我", "的", "手机", "呢"], answer: "我的手机呢", en: "Where's my phone?" }
      ]
    }
  ],

  scenarios: [
    {
      id: "s1",
      title: "Night market",
      emoji: "🍢",
      intro: "Night markets are loud, fast, and mostly cash-and-point. Stall owners are used to tourists pointing at food, so a few key phrases go a long way.",
      phrases: [
        { hanzi: "这个多少钱", pinyin: "zhège duōshǎo qián", en: "How much is this?", note: "The single most useful sentence in any night market. You can literally point while saying it." },
        { hanzi: "要辣吗", pinyin: "yào là ma", en: "Do you want it spicy?", note: "Stall owners will often ask you this — a simple 要 (yes) or 不要 (no) answers it." },
        { hanzi: "我要一份", pinyin: "wǒ yào yí fèn", en: "I'll take one portion.", note: "份 (fèn) is the measure word for a \"portion\" or \"order\" of food, very common at food stalls." },
        { hanzi: "不要辣", pinyin: "bú yào là", en: "No spicy, please.", note: "Say this upfront if you're not sure how spicy \"spicy\" means here — it can be intense." },
        { hanzi: "可以刷卡吗", pinyin: "kěyǐ shuākǎ ma", en: "Can I pay by card?", note: "Many small stalls are cash-only, so it's worth asking, but carry cash as backup." },
        { hanzi: "给我一个袋子", pinyin: "gěi wǒ yí gè dàizi", en: "Give me a bag, please.", note: "Handy if you're carrying food around while you keep browsing other stalls." },
        { hanzi: "谢谢", pinyin: "xièxie", en: "Thank you.", note: "Always appreciated — night market vendors work fast and hard." },
        { hanzi: "这是什么", pinyin: "zhè shì shénme", en: "What is this?", note: "Great for the mystery food stalls — most vendors are happy to explain." }
      ]
    },
    {
      id: "s2",
      title: "Convenience store (7-Eleven)",
      emoji: "🏪",
      intro: "Convenience stores are everywhere and do far more than sell snacks — bills, packages, tickets, even hot food counters. Staff move fast and ask a couple of standard questions at checkout.",
      phrases: [
        { hanzi: "要袋子吗", pinyin: "yào dàizi ma", en: "Do you want a bag?", note: "Asked at almost every checkout. Bags usually cost a small fee, so say 不用 if you don't need one." },
        { hanzi: "不用，谢谢", pinyin: "bú yòng, xièxie", en: "No need, thanks.", note: "Perfect quick reply to \"do you want a bag/receipt/etc.\"" },
        { hanzi: "要加热吗", pinyin: "yào jiārè ma", en: "Do you want it heated up?", note: "Common for bento boxes and rice balls — say 好 or 要 for yes." },
        { hanzi: "统一编号", pinyin: "tǒngyī biānhào", en: "Company tax ID number", note: "Cashiers may ask \"统编 (tǒngbiān) 要吗\" — this is a business tax number, tourists just say 不用." },
        { hanzi: "要收据吗", pinyin: "yào shōujù ma", en: "Do you want the receipt?", note: "Taiwan receipts double as a government lottery ticket (发票, fāpiào) — worth keeping even if you can't check the numbers yet!" },
        { hanzi: "多少钱", pinyin: "duōshǎo qián", en: "How much?", note: "Simple and works everywhere, though the register display usually shows the total too." },
        { hanzi: "在哪里", pinyin: "zài nǎlǐ", en: "Where is it?", note: "Useful for asking staff where an item is, or where the bathroom is." }
      ]
    },
    {
      id: "s3",
      title: "Bubble tea shop",
      emoji: "🧋",
      intro: "This is the essential Taiwan experience — but ordering bubble tea means answering a rapid checklist: sugar level, ice level, and size, sometimes all before you've even picked your drink. Knowing these words in advance makes ordering painless.",
      phrases: [
        { hanzi: "珍珠奶茶", pinyin: "zhēnzhū nǎichá", en: "pearl (bubble) milk tea", note: "The classic. 珍珠 means \"pearls\" (the tapioca balls), 奶茶 means milk tea." },
        { hanzi: "全糖", pinyin: "quán táng", en: "full sugar", note: "One of four standard sugar levels — order exactly as sweet as the name says." },
        { hanzi: "半糖", pinyin: "bàn táng", en: "half sugar", note: "A popular middle-ground choice if full sugar feels like too much." },
        { hanzi: "微糖", pinyin: "wēi táng", en: "a little sugar", note: "Lightly sweet — a common default for many locals." },
        { hanzi: "无糖", pinyin: "wú táng", en: "no sugar", note: "Zero added sugar — good if you want just the tea flavor." },
        { hanzi: "去冰", pinyin: "qù bīng", en: "no ice", note: "One of four ice levels; useful in winter or if you don't want a watered-down drink." },
        { hanzi: "少冰", pinyin: "shǎo bīng", en: "less ice", note: "A common choice — full flavor with a bit less dilution than normal ice." },
        { hanzi: "正常冰", pinyin: "zhèngcháng bīng", en: "normal ice", note: "The default amount of ice if you don't ask for anything special." },
        { hanzi: "大杯", pinyin: "dà bēi", en: "large size", note: "Ask this along with 中杯 (medium) — sizes and prices are usually posted on the menu board." },
        { hanzi: "中杯", pinyin: "zhōng bēi", en: "medium size", note: "The other common size option; small is less common at most chains." }
      ]
    },
    {
      id: "s4",
      title: "MRT & EasyCard",
      emoji: "🚇",
      intro: "Taipei's MRT is clean, fast, and easy once you have an EasyCard (悠游卡) to tap in and out. Just remember: no eating or drinking once you're past the gates.",
      phrases: [
        { hanzi: "悠游卡", pinyin: "yōuyóukǎ", en: "EasyCard", note: "The rechargeable transit card — works on MRT, buses, and even some convenience store purchases." },
        { hanzi: "加值", pinyin: "jiāzhí", en: "top up (add value)", note: "Say this at a machine or counter when your EasyCard balance runs low." },
        { hanzi: "几号出口", pinyin: "jǐ hào chūkǒu", en: "Which exit number?", note: "MRT stations have numbered exits — knowing the right one saves a lot of walking." },
        { hanzi: "这班车去哪里", pinyin: "zhè bān chē qù nǎlǐ", en: "Where does this train go?", note: "Handy if you're unsure of the direction on the platform." },
        { hanzi: "在哪里换车", pinyin: "zài nǎlǐ huàn chē", en: "Where do I transfer?", note: "Useful for lines that require switching trains, like Red to Blue at Taipei Main Station." },
        { hanzi: "车站", pinyin: "chēzhàn", en: "train/subway station", note: "General word for station, useful when asking directions on the street." },
        { hanzi: "不可以在捷运上吃东西", pinyin: "bù kěyǐ zài jiéyùn shàng chī dōngxi", en: "No eating on the MRT.", note: "This is a strictly enforced rule with fines — finish your bubble tea before tapping in!" }
      ]
    },
    {
      id: "s5",
      title: "Taxi / Uber",
      emoji: "🚕",
      intro: "Taxis are metered and easy to flag down, and drivers are commonly addressed with a respectful title rather than a direct \"you\". A short address or landmark name usually gets you where you're going.",
      phrases: [
        { hanzi: "师傅", pinyin: "shīfu", en: "driver (polite term)", note: "A respectful way to address a taxi driver, like \"sir\" — much more natural than saying nothing." },
        { hanzi: "到...多少钱", pinyin: "dào... duōshǎo qián", en: "How much to get to...?", note: "Fill in the blank with your destination; most rides use the meter, but this is good to confirm." },
        { hanzi: "在这里停", pinyin: "zài zhèlǐ tíng", en: "Stop here, please.", note: "Say this when you've reached your destination or want to get out early." },
        { hanzi: "请开到这里", pinyin: "qǐng kāi dào zhèlǐ", en: "Please drive to here.", note: "Good paired with showing an address or map pin on your phone." },
        { hanzi: "麻烦你", pinyin: "máfan nǐ", en: "Excuse me / sorry to trouble you", note: "A soft, polite way to get a driver's attention before asking something." },
        { hanzi: "可以刷卡吗", pinyin: "kěyǐ shuākǎ ma", en: "Can I pay by card?", note: "Some taxis are cash-only, so ask up front or have cash ready just in case." },
        { hanzi: "谢谢，不用找了", pinyin: "xièxie, bú yòng zhǎo le", en: "Thanks, keep the change.", note: "Optional and casual — tipping isn't expected, but rounding up is common and appreciated." }
      ]
    },
    {
      id: "s6",
      title: "Restaurant real-talk",
      emoji: "🍜",
      intro: "Ordering food goes beyond the menu — you'll often be asked eat-in or takeout right away, and paying works a bit differently than back home.",
      phrases: [
        { hanzi: "内用还是外带", pinyin: "nèiyòng háishì wàidài", en: "Eat in or takeout?", note: "One of the first questions you'll hear at counters — answer with 内用 (eat in) or 外带 (takeout)." },
        { hanzi: "内用", pinyin: "nèiyòng", en: "eat in / dine in", note: "Say this if you plan to sit and eat at the restaurant." },
        { hanzi: "外带", pinyin: "wàidài", en: "takeout / to go", note: "Say this if you want your food packaged to go." },
        { hanzi: "我要加点", pinyin: "wǒ yào jiā diǎn", en: "I'd like to order more.", note: "Useful at hot pot or shared-plate places where you add dishes as you go." },
        { hanzi: "买单", pinyin: "mǎidān", en: "the bill, please", note: "The everyday phrase to ask for the check; 结账 (jiézhàng) means the same thing and is equally common." },
        { hanzi: "结账", pinyin: "jiézhàng", en: "to settle the bill", note: "Interchangeable with 买单 — either works when you're ready to pay." },
        { hanzi: "服务费", pinyin: "fúwùfèi", en: "service charge", note: "Some restaurants add a 10% service charge automatically — check the menu or receipt; extra tipping is not expected." },
        { hanzi: "好吃", pinyin: "hǎochī", en: "delicious", note: "A simple, genuine compliment that staff and cooks always appreciate hearing." }
      ]
    },
    {
      id: "s7",
      title: "Asking locals for help",
      emoji: "🙋",
      intro: "Locals are generally warm and patient with learners, even with just a few words of Chinese. The right opener makes all the difference in getting a friendly response.",
      phrases: [
        { hanzi: "不好意思", pinyin: "bù hǎoyìsi", en: "Excuse me", note: "THE go-to attention-getter in Taiwan — used far more often than 对不起 for \"excuse me\", whether you're passing by, interrupting, or asking a question." },
        { hanzi: "请问", pinyin: "qǐngwèn", en: "May I ask...", note: "A polite lead-in before any question, like \"may I ask...\" — pairs naturally with 不好意思." },
        { hanzi: "Wifi密码是什么", pinyin: "wifi mìmǎ shì shénme", en: "What's the Wifi password?", note: "A very commonly needed phrase at cafes and shops — most places are happy to share it." },
        { hanzi: "厕所在哪里", pinyin: "cèsuǒ zài nǎlǐ", en: "Where is the bathroom?", note: "Simple and direct — works in restaurants, malls, and stations." },
        { hanzi: "可以帮我吗", pinyin: "kěyǐ bāng wǒ ma", en: "Can you help me?", note: "A friendly, open way to ask for assistance with anything." },
        { hanzi: "我听不懂", pinyin: "wǒ tīng bù dǒng", en: "I don't understand.", note: "Totally fine to say — most people will slow down or try simpler words." },
        { hanzi: "谢谢你", pinyin: "xièxie nǐ", en: "Thank you.", note: "A little extra warmth compared to just 谢谢, nice to use with someone who helped you directly." }
      ]
    },
    {
      id: "s8",
      title: "Hotel / check-in",
      emoji: "🏨",
      intro: "Check-in is usually smooth and many staff speak some English, but a few Chinese phrases make the process faster and friendlier.",
      phrases: [
        { hanzi: "我要check-in", pinyin: "wǒ yào check-in", en: "I'd like to check in.", note: "Many hotels mix English words like \"check-in\" right into the conversation — totally normal." },
        { hanzi: "我有预订", pinyin: "wǒ yǒu yùdìng", en: "I have a reservation.", note: "Good to say right away along with your name or booking confirmation." },
        { hanzi: "我的名字是...", pinyin: "wǒ de míngzi shì...", en: "My name is...", note: "Fill in your name — staff will look up your reservation from this." },
        { hanzi: "几点退房", pinyin: "jǐ diǎn tuìfáng", en: "What time is checkout?", note: "退房 (tuìfáng) means \"check out\" — good to confirm on arrival." },
        { hanzi: "有早餐吗", pinyin: "yǒu zǎocān ma", en: "Is there breakfast?", note: "Worth asking, since breakfast inclusion varies a lot between hotels." },
        { hanzi: "钥匙", pinyin: "yàoshi", en: "key", note: "Useful word if you're asking about a room key or key card." },
        { hanzi: "可以寄放行李吗", pinyin: "kěyǐ jìfàng xíngli ma", en: "Can I store my luggage?", note: "Handy for early arrivals or late departures when your room isn't ready yet." }
      ]
    }
  ],

  dialogues: [
    {
      title: "Ordering bubble tea",
      emoji: "🧋",
      place: "50岚 bubble tea shop",
      turns: [
        { who: "B", hanzi: "我要一杯珍珠奶茶", pinyin: "wǒ yào yì bēi zhēnzhū nǎichá", en: "I'd like one pearl milk tea." },
        { who: "A", hanzi: "大杯还是中杯", pinyin: "dà bēi háishì zhōng bēi", en: "Large or medium?", note: "还是 (háishì) means \"or\" in a question — very common when staff give you a choice." },
        { who: "B", hanzi: "大杯", pinyin: "dà bēi", en: "Large." },
        { who: "A", hanzi: "甜度呢？全糖、半糖、微糖，还是无糖？", pinyin: "tiándù ne? quán táng, bàn táng, wēi táng, háishì wú táng?", en: "And the sweetness? Full, half, light, or no sugar?", note: "甜度 (tiándù) means \"sweetness level\" — slightly beyond HSK1 but you'll hear it every single time." },
        { who: "B", hanzi: "半糖", pinyin: "bàn táng", en: "Half sugar." },
        { who: "A", hanzi: "冰块呢？去冰、少冰，还是正常冰？", pinyin: "bīngkuài ne? qù bīng, shǎo bīng, háishì zhèngcháng bīng?", en: "And the ice? No ice, less ice, or normal ice?", note: "冰块 (bīngkuài) means \"ice cubes\" — the fuller word for 冰." },
        { who: "B", hanzi: "少冰，谢谢", pinyin: "shǎo bīng, xièxie", en: "Less ice, thanks." },
        { who: "A", hanzi: "要袋子吗？", pinyin: "yào dàizi ma?", en: "Do you want a bag?" },
        { who: "B", hanzi: "不用，谢谢", pinyin: "bú yòng, xièxie", en: "No need, thanks." }
      ]
    },
    {
      title: "Night market haggling-lite",
      emoji: "🍢",
      place: "士林夜市 Shilin Night Market stall",
      turns: [
        { who: "B", hanzi: "这个多少钱", pinyin: "zhège duōshǎo qián", en: "How much is this?" },
        { who: "A", hanzi: "一份六十块", pinyin: "yí fèn liùshí kuài", en: "Sixty dollars a portion.", note: "块 (kuài) is the everyday spoken word for \"dollars\" (NT$)." },
        { who: "B", hanzi: "我要两份", pinyin: "wǒ yào liǎng fèn", en: "I'll take two portions." },
        { who: "A", hanzi: "要辣吗", pinyin: "yào là ma", en: "Do you want it spicy?" },
        { who: "B", hanzi: "不要辣，谢谢", pinyin: "bú yào là, xièxie", en: "No spicy, thanks." },
        { who: "A", hanzi: "好，等一下喔", pinyin: "hǎo, děng yíxià o", en: "Okay, one moment.", note: "喔 (o) is a soft, friendly sentence-ending sound common in casual Taiwan speech." },
        { who: "B", hanzi: "谢谢", pinyin: "xièxie", en: "Thank you." }
      ]
    },
    {
      title: "7-Eleven checkout",
      emoji: "🏪",
      place: "7-Eleven convenience store",
      turns: [
        { who: "B", hanzi: "你好，我要买这个", pinyin: "nǐ hǎo, wǒ yào mǎi zhège", en: "Hi, I'd like to buy this." },
        { who: "A", hanzi: "好，一共八十五块", pinyin: "hǎo, yígòng bāshíwǔ kuài", en: "Okay, that's eighty-five dollars total.", note: "一共 (yígòng) means \"in total\" — useful to recognize when the cashier states your total." },
        { who: "A", hanzi: "要加热吗？", pinyin: "yào jiārè ma?", en: "Do you want it heated up?" },
        { who: "B", hanzi: "好，谢谢", pinyin: "hǎo, xièxie", en: "Yes please, thanks." },
        { who: "A", hanzi: "要袋子吗？", pinyin: "yào dàizi ma?", en: "Do you want a bag?" },
        { who: "B", hanzi: "不用", pinyin: "bú yòng", en: "No need." },
        { who: "A", hanzi: "统编要吗？", pinyin: "tǒngbiān yào ma?", en: "Do you need the company tax ID printed?", note: "统编 (tǒngbiān) is a business tax number on the receipt — tourists just say 不用." },
        { who: "B", hanzi: "不用，谢谢", pinyin: "bú yòng, xièxie", en: "No need, thanks." }
      ]
    },
    {
      title: "Asking for directions to the MRT",
      emoji: "🚇",
      place: "street corner near Ximending",
      turns: [
        { who: "B", hanzi: "不好意思，请问", pinyin: "bù hǎoyìsi, qǐngwèn", en: "Excuse me, may I ask..." },
        { who: "B", hanzi: "捷运站在哪里", pinyin: "jiéyùn zhàn zài nǎlǐ", en: "Where is the MRT station?", note: "捷运 (jiéyùn) is what Taipei locals call the MRT/subway system." },
        { who: "A", hanzi: "一直走，到路口右转就到了", pinyin: "yìzhí zǒu, dào lùkǒu yòu zhuǎn jiù dào le", en: "Go straight, turn right at the intersection and you're there.", note: "A fast, natural direction-giving sentence — the key words to catch are 一直走 (go straight) and 右转 (turn right)." },
        { who: "B", hanzi: "谢谢你", pinyin: "xièxie nǐ", en: "Thank you." },
        { who: "A", hanzi: "不会", pinyin: "bú huì", en: "No problem.", note: "不会 literally means \"cannot/won't\" but here it's used idiomatically to mean \"you're welcome / no problem\" — very common reply to thanks in Taiwan." }
      ]
    },
    {
      title: "Ordering beef noodles",
      emoji: "🍜",
      place: "牛肉面 beef noodle shop",
      turns: [
        { who: "A", hanzi: "内用还是外带？", pinyin: "nèiyòng háishì wàidài?", en: "Eat in or takeout?" },
        { who: "B", hanzi: "内用", pinyin: "nèiyòng", en: "Eat in." },
        { who: "A", hanzi: "要什么？", pinyin: "yào shénme?", en: "What would you like?" },
        { who: "B", hanzi: "我要一碗牛肉面", pinyin: "wǒ yào yì wǎn niúròumiàn", en: "I'd like one bowl of beef noodles.", note: "碗 (wǎn) is the measure word for a bowl of something." },
        { who: "A", hanzi: "要加辣吗？", pinyin: "yào jiā là ma?", en: "Do you want it extra spicy?" },
        { who: "B", hanzi: "一点点辣，谢谢", pinyin: "yìdiǎndiǎn là, xièxie", en: "A little bit spicy, thanks." },
        { who: "A", hanzi: "好，坐着等一下喔", pinyin: "hǎo, zuò zhe děng yíxià o", en: "Okay, have a seat and wait a moment." },
        { who: "B", hanzi: "好，谢谢", pinyin: "hǎo, xièxie", en: "Okay, thank you." }
      ]
    },
    {
      title: "Buying a SIM card / EasyCard at the airport",
      emoji: "📱",
      place: "桃园机场 Taoyuan Airport arrivals",
      turns: [
        { who: "B", hanzi: "你好，我要买一张悠游卡", pinyin: "nǐ hǎo, wǒ yào mǎi yì zhāng yōuyóukǎ", en: "Hi, I'd like to buy an EasyCard.", note: "张 (zhāng) is the measure word for flat things like cards, tickets, and paper." },
        { who: "A", hanzi: "好，你要加值多少？", pinyin: "hǎo, nǐ yào jiāzhí duōshǎo?", en: "Sure, how much would you like to add?" },
        { who: "B", hanzi: "五百块", pinyin: "wǔbǎi kuài", en: "Five hundred dollars." },
        { who: "A", hanzi: "你也需要网路卡吗？", pinyin: "nǐ yě xūyào wǎnglùkǎ ma?", en: "Do you also need a SIM card?", note: "网路卡 (wǎnglùkǎ) is a SIM/data card — 网路 is the Taiwan term for \"internet\", slightly different from mainland 网络." },
        { who: "B", hanzi: "要，我要一张", pinyin: "yào, wǒ yào yì zhāng", en: "Yes, I'd like one." },
        { who: "A", hanzi: "好的，请给我你的护照", pinyin: "hǎode, qǐng gěi wǒ nǐ de hùzhào", en: "Okay, please give me your passport.", note: "护照 (hùzhào) means passport — SIM registration in Taiwan requires ID." },
        { who: "B", hanzi: "好，给你", pinyin: "hǎo, gěi nǐ", en: "Okay, here you go." },
        { who: "A", hanzi: "谢谢，等一下喔", pinyin: "xièxie, děng yíxià o", en: "Thanks, one moment please." }
      ]
    }
  ],

  culture: [
    {
      emoji: "🎟️",
      title: "Every receipt is a lottery ticket",
      tip: "Taiwan's government-issued receipts (发票, fāpiào) double as numbers in a bi-monthly national lottery. Keep your receipts from convenience stores and shops — you might genuinely win cash just for shopping."
    },
    {
      emoji: "🚇",
      title: "No eating or drinking on the MRT",
      tip: "Taipei's MRT strictly bans eating and drinking (even water) once you're past the ticket gates, and it's enforced with real fines. Finish your snack or bubble tea before you tap in."
    },
    {
      emoji: "🚶",
      title: "Stand right on escalators",
      tip: "On MRT and mall escalators, everyone stands on the right side and leaves the left side clear for people walking up. It's an unwritten rule that locals take seriously, especially during rush hour."
    },
    {
      emoji: "🙋",
      title: "不好意思 is your everyday word",
      tip: "不好意思 (bù hǎoyìsi) is used constantly in Taiwan — to get someone's attention, to apologize lightly, or to politely interrupt. It's used far more often day-to-day than 对不起, which feels more serious."
    },
    {
      emoji: "🎶",
      title: "Trash trucks play music",
      tip: "Garbage collection in Taiwan works differently — trucks come by on a schedule and play a recognizable jingle (often sounding like classical music) so residents know to bring their trash out and hand it over directly."
    },
    {
      emoji: "🏪",
      title: "Convenience stores are a life hub",
      tip: "7-Eleven and FamilyMart aren't just for snacks — you can pay bills, buy event tickets, ship and receive packages, print documents, and grab hot food any hour of the day. They're genuinely central to daily life."
    },
    {
      emoji: "🍢",
      title: "Night market etiquette",
      tip: "It's normal to eat standing up or find a shared table, and lines at popular stalls move fast, so have your order ready. Most stalls are cash-only, so keep small bills handy."
    },
    {
      emoji: "💵",
      title: "Tipping isn't expected",
      tip: "There's no tipping culture in Taiwan for restaurants, taxis, or hotels — some restaurants add a fixed 10% service charge automatically, but extra tips on top are not expected or common."
    },
    {
      emoji: "🧧",
      title: "Convenience stores handle almost everything",
      tip: "Beyond shopping, locals use convenience stores to pick up online orders, pay for utilities, and even get parcels shipped between stores — it's worth knowing they exist as a backup for almost any errand."
    },
    {
      emoji: "😊",
      title: "People are patient with learners",
      tip: "Taiwanese locals are generally warm and encouraging toward people learning Mandarin, even with just a few words. Don't be shy about trying — a simple attempt is usually met with a smile and some help."
    }
  ]

};
