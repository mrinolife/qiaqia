window.YAHA_CHATS = [
{ id:"c1", host:"usagi", title:"Night market run!!", emoji:"🍢", place:"士林夜市",
  script:[
    { npc:{ hanzi:"呀哈!! 欢迎来夜市!!", pinyin:"Yǎhā!! Huānyíng lái yèshì!!", en:"Yahoo!! Welcome to the night market!!", note:"" } },
    { npc:{ hanzi:"你饿不饿?", pinyin:"Nǐ è bu è?", en:"Are you hungry?", note:"饿 = hungry" } },
    { choice:{ options:[
      { hanzi:"我很饿!", pinyin:"Wǒ hěn è!", en:"I'm very hungry!", good:true, react:{ hanzi:"乌拉!! 我也是!!", pinyin:"Wūlā!! Wǒ yě shì!!", en:"Woohoo!! Me too!!" } },
      { hanzi:"我不太饿。", pinyin:"Wǒ bú tài è.", en:"I'm not very hungry.", good:true, react:{ hanzi:"没关系, 我们看看吧!", pinyin:"Méi guānxi, wǒmen kànkan ba!", en:"No problem, let's look around!" } },
      { hanzi:"你饿吗?", pinyin:"Nǐ è ma?", en:"Are you hungry?", good:false, react:{ hanzi:"哈哈, 这是在问我! 你要说「我很饿」~", pinyin:"Hāhā, zhè shì zài wèn wǒ! Nǐ yào shuō 「wǒ hěn è」~", en:"Haha, that asks me! You should say 'I'm very hungry'~" } }
    ] } },
    { npc:{ hanzi:"我们去吃鸡排, 好不好?", pinyin:"Wǒmen qù chī jīpái, hǎo bu hǎo?", en:"Let's go eat fried chicken cutlet, okay?", note:"" } },
    { npc:{ hanzi:"好, 我扮演老板, 开始了!", pinyin:"Hǎo, wǒ bànyǎn lǎobǎn, kāishǐ le!", en:"Okay, I'll play the boss, here we go!", note:"" } },
    { npc:{ hanzi:"你好! 要吃什么?", pinyin:"Nǐ hǎo! Yào chī shénme?", en:"Hello! What do you want to eat?", note:"" } },
    { choice:{ options:[
      { hanzi:"我要一个鸡排。", pinyin:"Wǒ yào yí gè jīpái.", en:"I want one fried chicken cutlet.", good:true, react:{ hanzi:"好, 马上来!", pinyin:"Hǎo, mǎshàng lái!", en:"Okay, coming right up!" } },
      { hanzi:"一个鸡排, 谢谢。", pinyin:"Yí gè jīpái, xièxie.", en:"One fried chicken cutlet, thanks.", good:true, react:{ hanzi:"不客气, 等一下喔!", pinyin:"Bú kèqi, děng yíxià ō!", en:"You're welcome, wait a bit!" } },
      { hanzi:"鸡排要一个我。", pinyin:"Jīpái yào yí gè wǒ.", en:"Chicken cutlet want one me.", good:false, react:{ hanzi:"呀哈, 意思对啦! 但是说「我要一个鸡排」更好~", pinyin:"Yǎhā, yìsi duì la! Dànshì shuō 「wǒ yào yí gè jīpái」 gèng hǎo~", en:"Yahoo, meaning's right! But 'I want one chicken cutlet' is better~" } }
    ] } },
    { npc:{ hanzi:"要不要辣?", pinyin:"Yào bu yào là?", en:"Do you want it spicy?", note:"辣 = spicy" } },
    { choice:{ options:[
      { hanzi:"要辣, 谢谢!", pinyin:"Yào là, xièxie!", en:"Yes spicy, thanks!", good:true, react:{ hanzi:"好, 辣的一个!", pinyin:"Hǎo, là de yí gè!", en:"Okay, one spicy!" } },
      { hanzi:"不要辣。", pinyin:"Bú yào là.", en:"Not spicy.", good:true, react:{ hanzi:"好, 不辣!", pinyin:"Hǎo, bú là!", en:"Okay, not spicy!" } },
      { hanzi:"辣不辣?", pinyin:"Là bu là?", en:"Is it spicy or not?", good:false, react:{ hanzi:"哈哈, 这是在问我喔! 你可以说「要辣」或「不要辣」~", pinyin:"Hāhā, zhè shì zài wèn wǒ ō! Nǐ kěyǐ shuō 「yào là」 huò 「bú yào là」~", en:"Haha, that asks me! You can say 'spicy' or 'not spicy'~" } }
    ] } },
    { npc:{ hanzi:"一共八十块。", pinyin:"Yígòng bāshí kuài.", en:"That's 80 kuai in total.", note:"一共 = in total, 块 = kuai" } },
    { choice:{ options:[
      { hanzi:"好, 给你。", pinyin:"Hǎo, gěi nǐ.", en:"Okay, here you go.", good:true, react:{ hanzi:"谢谢! 你的鸡排!", pinyin:"Xièxie! Nǐ de jīpái!", en:"Thanks! Here's your chicken cutlet!" } },
      { hanzi:"太贵了!", pinyin:"Tài guì le!", en:"That's too expensive!", good:true, react:{ hanzi:"呀哈, 夜市不能讲价啦!", pinyin:"Yǎhā, yèshì bù néng jiǎngjià la!", en:"Yahoo, you can't haggle at the night market!" } },
      { hanzi:"八十块很小。", pinyin:"Bāshí kuài hěn xiǎo.", en:"80 kuai is small.", good:false, react:{ hanzi:"哈哈, 意思怪怪的! 说「太贵了」或「好」就可以~", pinyin:"Hāhā, yìsi guàiguài de! Shuō 「tài guì le」 huò 「hǎo」 jiù kěyǐ~", en:"Haha, that's a bit odd! Just say 'too expensive' or 'okay'~" } }
    ] } },
    { npc:{ hanzi:"乌拉!! 鸡排真好吃!!", pinyin:"Wūlā!! Jīpái zhēn hǎochī!!", en:"Woohoo!! The chicken cutlet is so tasty!!", note:"" } },
    { npc:{ hanzi:"谢谢你陪我逛夜市!", pinyin:"Xièxie nǐ péi wǒ guàng yèshì!", en:"Thanks for exploring the night market with me!", note:"陪 = accompany, 逛 = stroll/browse" } },
    { npc:{ hanzi:"呀哈!! 下次再来!!", pinyin:"Yǎhā!! Xiàcì zài lái!!", en:"Yahoo!! Let's come again next time!!", note:"" } }
  ]
},
{ id:"c2", host:"hachiware", title:"Boba shop, go!", emoji:"🧋", place:"手摇饮料店",
  script:[
    { npc:{ hanzi:"你好呀! 今天我们去买珍珠奶茶!", pinyin:"Nǐ hǎo ya! Jīntiān wǒmen qù mǎi zhēnzhū nǎichá!", en:"Hi! Today let's go buy bubble milk tea!", note:"" } },
    { npc:{ hanzi:"台湾的饮料店问题很多, 我帮你!", pinyin:"Táiwān de yǐnliàodiàn wèntí hěn duō, wǒ bāng nǐ!", en:"Taiwan drink shops ask a lot of questions, I'll help you!", note:"问题 here = 'things they ask'" } },
    { npc:{ hanzi:"你好! 要什么?", pinyin:"Nǐ hǎo! Yào shénme?", en:"Hello! What would you like?", note:"" } },
    { choice:{ options:[
      { hanzi:"我要一杯珍珠奶茶。", pinyin:"Wǒ yào yì bēi zhēnzhū nǎichá.", en:"I want one bubble milk tea.", good:true, react:{ hanzi:"好的! 大杯还是小杯?", pinyin:"Hǎo de! Dà bēi háishi xiǎo bēi?", en:"Okay! Large or small?" } },
      { hanzi:"一杯珍珠奶茶, 谢谢。", pinyin:"Yì bēi zhēnzhū nǎichá, xièxie.", en:"One bubble milk tea, thanks.", good:true, react:{ hanzi:"好的! 大杯还是小杯?", pinyin:"Hǎo de! Dà bēi háishi xiǎo bēi?", en:"Okay! Large or small?" } },
      { hanzi:"珍珠奶茶好喝吗?", pinyin:"Zhēnzhū nǎichá hǎohē ma?", en:"Is bubble milk tea tasty?", good:false, react:{ hanzi:"哈哈, 很好喝! 但你要先说「我要」点餐喔~", pinyin:"Hāhā, hěn hǎohē! Dàn nǐ yào xiān shuō 「wǒ yào」 diǎncān ō~", en:"Haha, it's tasty! But say 'I want' to order first~" } }
    ] } },
    { npc:{ hanzi:"他们问大杯小杯, 是问饮料的大小!", pinyin:"Tāmen wèn dà bēi xiǎo bēi, shì wèn yǐnliào de dàxiǎo!", en:"They're asking big or small cup, that's the drink size!", note:"" } },
    { choice:{ options:[
      { hanzi:"大杯。", pinyin:"Dà bēi.", en:"Large.", good:true, react:{ hanzi:"好, 大杯! 要不要冰?", pinyin:"Hǎo, dà bēi! Yào bu yào bīng?", en:"Okay, large! Do you want ice?" } },
      { hanzi:"小杯, 谢谢。", pinyin:"Xiǎo bēi, xièxie.", en:"Small, thanks.", good:true, react:{ hanzi:"好, 小杯! 要不要冰?", pinyin:"Hǎo, xiǎo bēi! Yào bu yào bīng?", en:"Okay, small! Do you want ice?" } },
      { hanzi:"大杯和小杯。", pinyin:"Dà bēi hé xiǎo bēi.", en:"Large and small.", good:false, react:{ hanzi:"哈哈, 一杯选一个就好, 说「大杯」或「小杯」~", pinyin:"Hāhā, yì bēi xuǎn yí gè jiù hǎo, shuō 「dà bēi」 huò 「xiǎo bēi」~", en:"Haha, just pick one for one cup, say 'large' or 'small'~" } }
    ] } },
    { npc:{ hanzi:"要冰的还是热的?", pinyin:"Yào bīng de háishi rè de?", en:"Iced or hot?", note:"" } },
    { choice:{ options:[
      { hanzi:"冰的, 谢谢。", pinyin:"Bīng de, xièxie.", en:"Iced, thanks.", good:true, react:{ hanzi:"好, 冰的! 要不要珍珠?", pinyin:"Hǎo, bīng de! Yào bu yào zhēnzhū?", en:"Okay, iced! Do you want boba pearls?" } },
      { hanzi:"热的。", pinyin:"Rè de.", en:"Hot.", good:true, react:{ hanzi:"好, 热的! 要不要珍珠?", pinyin:"Hǎo, rè de! Yào bu yào zhēnzhū?", en:"Okay, hot! Do you want boba pearls?" } },
      { hanzi:"我要冰。", pinyin:"Wǒ yào bīng.", en:"I want ice.", good:false, react:{ hanzi:"哈哈, 这样听起来像只要冰块! 说「冰的」更自然~", pinyin:"Hāhā, zhèyàng tīngqǐlái xiàng zhǐ yào bīngkuài! Shuō 「bīng de」 gèng zìrán~", en:"Haha, that sounds like you just want ice cubes! 'Iced' is more natural~" } }
    ] } },
    { npc:{ hanzi:"太好了, 快点好了!", pinyin:"Tài hǎo le, kuài diǎn hǎo le!", en:"Great, almost done ordering!", note:"" } },
    { npc:{ hanzi:"要不要袋子?", pinyin:"Yào bu yào dàizi?", en:"Do you want a bag?", note:"袋子 = bag" } },
    { choice:{ options:[
      { hanzi:"要, 谢谢。", pinyin:"Yào, xièxie.", en:"Yes, thanks.", good:true, react:{ hanzi:"好, 给你袋子!", pinyin:"Hǎo, gěi nǐ dàizi!", en:"Okay, here's your bag!" } },
      { hanzi:"不用, 谢谢。", pinyin:"Bú yòng, xièxie.", en:"No need, thanks.", good:true, react:{ hanzi:"好的, 环保杯套给你!", pinyin:"Hǎo de, huánbǎo bēitào gěi nǐ!", en:"Okay, here's a reusable cup sleeve!" } }
    ] } },
    { npc:{ hanzi:"一共六十五块。", pinyin:"Yígòng liùshí wǔ kuài.", en:"That's 65 kuai total.", note:"" } },
    { npc:{ hanzi:"好喝吗? 珍珠很多喔!", pinyin:"Hǎohē ma? Zhēnzhū hěn duō ō!", en:"Is it tasty? There's lots of boba!", note:"" } },
    { npc:{ hanzi:"你现在会点饮料了! 太棒了!", pinyin:"Nǐ xiànzài huì diǎn yǐnliào le! Tài bàng le!", en:"You can order drinks now! Awesome!", note:"" } }
  ]
},
{ id:"c3", host:"rakko", title:"Taxi to the hotel", emoji:"🚕", place:"台北车站",
  script:[
    { npc:{ hanzi:"计程车。上车。", pinyin:"Jìchéngchē. Shàng chē.", en:"Taxi. Get in.", note:"计程车 = taxi in Taiwan" } },
    { npc:{ hanzi:"你要去哪里?", pinyin:"Nǐ yào qù nǎlǐ?", en:"Where do you want to go?", note:"" } },
    { choice:{ options:[
      { hanzi:"我要去饭店。", pinyin:"Wǒ yào qù fàndiàn.", en:"I want to go to the hotel.", good:true, react:{ hanzi:"好。", pinyin:"Hǎo.", en:"Okay." } },
      { hanzi:"请到台北车站。", pinyin:"Qǐng dào Táiběi Chēzhàn.", en:"Please go to Taipei Main Station.", good:true, react:{ hanzi:"好, 坐好。", pinyin:"Hǎo, zuò hǎo.", en:"Okay, sit tight." } },
      { hanzi:"饭店在哪里?", pinyin:"Fàndiàn zài nǎlǐ?", en:"Where is the hotel?", good:false, react:{ hanzi:"那是问路, 不是叫车。说「我要去...」~", pinyin:"Nà shì wèn lù, bú shì jiào chē. Shuō 「wǒ yào qù...」~", en:"That's asking directions, not calling a ride. Say 'I want to go to...'~" } }
    ] } },
    { npc:{ hanzi:"好, 出发。", pinyin:"Hǎo, chūfā.", en:"Okay, let's go.", note:"" } },
    { npc:{ hanzi:"十分钟。", pinyin:"Shí fēnzhōng.", en:"Ten minutes.", note:"分钟 = minutes" } },
    { npc:{ hanzi:"到了。", pinyin:"Dào le.", en:"We're here.", note:"" } },
    { npc:{ hanzi:"多少钱? 你问我。", pinyin:"Duōshao qián? Nǐ wèn wǒ.", en:"How much? You ask me.", note:"" } },
    { choice:{ options:[
      { hanzi:"多少钱?", pinyin:"Duōshao qián?", en:"How much is it?", good:true, react:{ hanzi:"两百五十块。", pinyin:"Liǎng bǎi wǔshí kuài.", en:"250 kuai." } },
      { hanzi:"请问, 多少钱?", pinyin:"Qǐngwèn, duōshao qián?", en:"Excuse me, how much?", good:true, react:{ hanzi:"两百五十块。", pinyin:"Liǎng bǎi wǔshí kuài.", en:"250 kuai." } },
      { hanzi:"钱多少?", pinyin:"Qián duōshao?", en:"Money how much?", good:false, react:{ hanzi:"意思对, 但说「多少钱」更自然。", pinyin:"Yìsi duì, dàn shuō 「duōshao qián」 gèng zìrán.", en:"Meaning's right, but 'how much' is more natural." } }
    ] } },
    { npc:{ hanzi:"现金还是卡?", pinyin:"Xiànjīn háishi kǎ?", en:"Cash or card?", note:"现金 = cash, 卡 = card" } },
    { choice:{ options:[
      { hanzi:"现金。", pinyin:"Xiànjīn.", en:"Cash.", good:true, react:{ hanzi:"好。", pinyin:"Hǎo.", en:"Okay." } },
      { hanzi:"卡, 可以吗?", pinyin:"Kǎ, kěyǐ ma?", en:"Card, is that okay?", good:true, react:{ hanzi:"可以。", pinyin:"Kěyǐ.", en:"Sure." } }
    ] } },
    { npc:{ hanzi:"好, 谢谢。", pinyin:"Hǎo, xièxie.", en:"Okay, thanks.", note:"" } },
    { npc:{ hanzi:"在这里停车, 可以吗? 你说说看。", pinyin:"Zài zhèlǐ tíngchē, kěyǐ ma? Nǐ shuōshuo kàn.", en:"Stop here, okay? Try saying it.", note:"" } },
    { choice:{ options:[
      { hanzi:"请在这里停车。", pinyin:"Qǐng zài zhèlǐ tíngchē.", en:"Please stop here.", good:true, react:{ hanzi:"好, 到了。", pinyin:"Hǎo, dào le.", en:"Okay, here we are." } },
      { hanzi:"这里就好。", pinyin:"Zhèlǐ jiù hǎo.", en:"Here is fine.", good:true, react:{ hanzi:"好。", pinyin:"Hǎo.", en:"Okay." } },
      { hanzi:"停车这里。", pinyin:"Tíngchē zhèlǐ.", en:"Stop car here.", good:false, react:{ hanzi:"意思懂, 但说「在这里停车」更好。", pinyin:"Yìsi dǒng, dàn shuō 「zài zhèlǐ tíngchē」 gèng hǎo.", en:"Understandable, but 'stop here' is said better this way." } }
    ] } },
    { npc:{ hanzi:"谢谢, 再见。", pinyin:"Xièxie, zàijiàn.", en:"Thanks, bye.", note:"" } }
  ]
},
{ id:"c4", host:"kani", title:"7-Eleven checkout", emoji:"🏪", place:"7-Eleven",
  script:[
    { npc:{ hanzi:"学弟学妹, 欢迎来 7-Eleven!", pinyin:"Xuédì xuémèi, huānyíng lái 7-Eleven!", en:"Hey junior, welcome to 7-Eleven!", note:"学弟/学妹 = junior, a senpai term" } },
    { npc:{ hanzi:"我先帮你结账, 你看好喔!", pinyin:"Wǒ xiān bāng nǐ jiézhàng, nǐ kàn hǎo ō!", en:"I'll check out first, watch closely!", note:"结账 = checkout/pay" } },
    { npc:{ hanzi:"一共九十块。", pinyin:"Yígòng jiǔshí kuài.", en:"That's 90 kuai total.", note:"" } },
    { npc:{ hanzi:"现在换你了! 便当要加热吗? 店员会问你。", pinyin:"Xiànzài huàn nǐ le! Biàndāng yào jiārè ma? Diànyuán huì wèn nǐ.", en:"Now it's your turn! Do you want the bento heated? The clerk will ask.", note:"便当 = bento box, 加热 = heat up" } },
    { npc:{ hanzi:"要不要加热?", pinyin:"Yào bu yào jiārè?", en:"Do you want it heated?", note:"" } },
    { choice:{ options:[
      { hanzi:"要, 谢谢。", pinyin:"Yào, xièxie.", en:"Yes, thanks.", good:true, react:{ hanzi:"好, 等一下喔!", pinyin:"Hǎo, děng yíxià ō!", en:"Okay, one moment!" } },
      { hanzi:"不用, 谢谢。", pinyin:"Bú yòng, xièxie.", en:"No need, thanks.", good:true, react:{ hanzi:"好的!", pinyin:"Hǎo de!", en:"Okay!" } },
      { hanzi:"加热不要。", pinyin:"Jiārè bú yào.", en:"Heat up not want.", good:false, react:{ hanzi:"意思懂, 但说「不用, 谢谢」更自然~", pinyin:"Yìsi dǒng, dàn shuō 「bú yòng, xièxie」 gèng zìrán~", en:"Understandable, but 'no need, thanks' is more natural~" } }
    ] } },
    { npc:{ hanzi:"要不要袋子? 一个五块。", pinyin:"Yào bu yào dàizi? Yí gè wǔ kuài.", en:"Do you want a bag? 5 kuai each.", note:"plastic bags are not free in Taiwan" } },
    { choice:{ options:[
      { hanzi:"要一个, 谢谢。", pinyin:"Yào yí gè, xièxie.", en:"Yes, one please.", good:true, react:{ hanzi:"好, 五块喔。", pinyin:"Hǎo, wǔ kuài ō.", en:"Okay, that's 5 kuai." } },
      { hanzi:"不用, 我有袋子。", pinyin:"Bú yòng, wǒ yǒu dàizi.", en:"No need, I have a bag.", good:true, react:{ hanzi:"好, 环保喔!", pinyin:"Hǎo, huánbǎo ō!", en:"Great, eco-friendly!" } }
    ] } },
    { npc:{ hanzi:"要不要发票?", pinyin:"Yào bu yào fāpiào?", en:"Do you want the receipt?", note:"发票 = receipt, can be used in a lottery" } },
    { choice:{ options:[
      { hanzi:"要, 谢谢。", pinyin:"Yào, xièxie.", en:"Yes, thanks.", good:true, react:{ hanzi:"好, 给你!", pinyin:"Hǎo, gěi nǐ!", en:"Here you go!" } },
      { hanzi:"不用了。", pinyin:"Bú yòng le.", en:"No need.", good:true, react:{ hanzi:"好的!", pinyin:"Hǎo de!", en:"Okay!" } },
      { hanzi:"发票要吗?", pinyin:"Fāpiào yào ma?", en:"Receipt want?", good:false, react:{ hanzi:"哈哈, 那是他问你! 你说「要」或「不用」就好~", pinyin:"Hāhā, nà shì tā wèn nǐ! Nǐ shuō 「yào」 huò 「bú yòng」 jiù hǎo~", en:"Haha, that's them asking you! Just say 'yes' or 'no need'~" } }
    ] } },
    { npc:{ hanzi:"一共九十五块。", pinyin:"Yígòng jiǔshí wǔ kuài.", en:"That's 95 kuai total.", note:"" } },
    { choice:{ options:[
      { hanzi:"好, 给你。", pinyin:"Hǎo, gěi nǐ.", en:"Okay, here you go.", good:true, react:{ hanzi:"谢谢, 慢走!", pinyin:"Xièxie, màn zǒu!", en:"Thanks, take care!" } },
      { hanzi:"谢谢。", pinyin:"Xièxie.", en:"Thanks.", good:true, react:{ hanzi:"谢谢, 慢走!", pinyin:"Xièxie, màn zǒu!", en:"Thanks, take care!" } }
    ] } },
    { npc:{ hanzi:"学弟学妹, 你学得很快!", pinyin:"Xuédì xuémèi, nǐ xué de hěn kuài!", en:"Junior, you learn fast!", note:"" } },
    { npc:{ hanzi:"便当要趁热吃喔!", pinyin:"Biàndāng yào chèn rè chī ō!", en:"Eat the bento while it's hot!", note:"趁热 = while hot" } }
  ]
},
{ id:"c5", host:"kurimanju", title:"Beef noodle stop", emoji:"🍜", place:"牛肉面店",
  script:[
    { npc:{ hanzi:"呼啊...我们去吃牛肉面吧。", pinyin:"Hū a... wǒmen qù chī niúròumiàn ba.", en:"*yawn*... let's go eat beef noodles.", note:"" } },
    { npc:{ hanzi:"内用还是外带?", pinyin:"Nèiyòng háishi wàidài?", en:"Dine in or take out?", note:"内用 = dine in, 外带 = take out" } },
    { choice:{ options:[
      { hanzi:"内用, 谢谢。", pinyin:"Nèiyòng, xièxie.", en:"Dine in, thanks.", good:true, react:{ hanzi:"好, 请坐。", pinyin:"Hǎo, qǐng zuò.", en:"Okay, please sit." } },
      { hanzi:"外带。", pinyin:"Wàidài.", en:"Take out.", good:true, react:{ hanzi:"好, 等一下喔。", pinyin:"Hǎo, děng yíxià ō.", en:"Okay, one moment." } },
      { hanzi:"内用外带都要。", pinyin:"Nèiyòng wàidài dōu yào.", en:"I want both dine-in and take-out.", good:false, react:{ hanzi:"哈哈, 只能选一个啦, 说「内用」或「外带」~", pinyin:"Hāhā, zhǐ néng xuǎn yí gè la, shuō 「nèiyòng」 huò 「wàidài」~", en:"Haha, you can only pick one, say 'dine in' or 'take out'~" } }
    ] } },
    { npc:{ hanzi:"我最喜欢牛肉面了, 很好吃。", pinyin:"Wǒ zuì xǐhuan niúròumiàn le, hěn hǎochī.", en:"I love beef noodles the most, very tasty.", note:"" } },
    { npc:{ hanzi:"要吃什么?", pinyin:"Yào chī shénme?", en:"What would you like to eat?", note:"" } },
    { choice:{ options:[
      { hanzi:"我要一碗牛肉面。", pinyin:"Wǒ yào yì wǎn niúròumiàn.", en:"I want a bowl of beef noodles.", good:true, react:{ hanzi:"好, 马上来。", pinyin:"Hǎo, mǎshàng lái.", en:"Okay, coming right up." } },
      { hanzi:"一碗牛肉面, 谢谢。", pinyin:"Yì wǎn niúròumiàn, xièxie.", en:"One bowl of beef noodles, thanks.", good:true, react:{ hanzi:"好的, 等一下喔。", pinyin:"Hǎo de, děng yíxià ō.", en:"Okay, one moment." } },
      { hanzi:"牛肉面一我要碗。", pinyin:"Niúròumiàn yī wǒ yào wǎn.", en:"Beef noodle one I want bowl.", good:false, react:{ hanzi:"呼...意思懂啦, 但说「我要一碗牛肉面」比较好~", pinyin:"Hū... yìsi dǒng la, dàn shuō 「wǒ yào yì wǎn niúròumiàn」 bǐjiào hǎo~", en:"*yawn*... I get it, but 'I want a bowl of beef noodles' is better~" } }
    ] } },
    { npc:{ hanzi:"要不要辣?", pinyin:"Yào bu yào là?", en:"Do you want it spicy?", note:"" } },
    { choice:{ options:[
      { hanzi:"要一点辣。", pinyin:"Yào yìdiǎn là.", en:"A little spicy please.", good:true, react:{ hanzi:"好, 一点辣。", pinyin:"Hǎo, yìdiǎn là.", en:"Okay, a little spicy." } },
      { hanzi:"不要辣, 谢谢。", pinyin:"Bú yào là, xièxie.", en:"Not spicy, thanks.", good:true, react:{ hanzi:"好的。", pinyin:"Hǎo de.", en:"Okay." } }
    ] } },
    { npc:{ hanzi:"呼...面来了, 慢慢吃。", pinyin:"Hū... miàn lái le, mànmàn chī.", en:"*yawn*... noodles are here, eat slowly.", note:"" } },
    { npc:{ hanzi:"好吃吗?", pinyin:"Hǎochī ma?", en:"Is it good?", note:"" } },
    { choice:{ options:[
      { hanzi:"很好吃!", pinyin:"Hěn hǎochī!", en:"Very tasty!", good:true, react:{ hanzi:"太好了, 谢谢!", pinyin:"Tài hǎo le, xièxie!", en:"Great, thank you!" } },
      { hanzi:"非常好吃。", pinyin:"Fēicháng hǎochī.", en:"Extremely tasty.", good:true, react:{ hanzi:"哈哈, 谢谢你!", pinyin:"Hāhā, xièxie nǐ!", en:"Haha, thanks!" } }
    ] } },
    { npc:{ hanzi:"现在去付钱, 柜台在那里。", pinyin:"Xiànzài qù fùqián, guìtái zài nàlǐ.", en:"Now let's pay, the counter is there.", note:"付钱 = to pay, 柜台 = counter" } },
    { choice:{ options:[
      { hanzi:"多少钱?", pinyin:"Duōshao qián?", en:"How much?", good:true, react:{ hanzi:"一百五十块。", pinyin:"Yìbǎi wǔshí kuài.", en:"150 kuai." } },
      { hanzi:"我要付钱。", pinyin:"Wǒ yào fùqián.", en:"I want to pay.", good:true, react:{ hanzi:"好, 一百五十块。", pinyin:"Hǎo, yìbǎi wǔshí kuài.", en:"Okay, 150 kuai." } }
    ] } },
    { npc:{ hanzi:"呼...吃饱了, 想睡觉了。", pinyin:"Hū... chī bǎo le, xiǎng shuìjiào le.", en:"*yawn*... I'm full, feel like sleeping now.", note:"吃饱 = full from eating" } }
  ]
},
{ id:"c6", host:"shisa", title:"MRT + EasyCard", emoji:"🚇", place:"台北捷运",
  script:[
    { npc:{ hanzi:"我是这里的向导, 跟我走!", pinyin:"Wǒ shì zhèlǐ de xiàngdǎo, gēn wǒ zǒu!", en:"I'm the local guide here, follow me!", note:"向导 = guide" } },
    { npc:{ hanzi:"我们先买悠游卡。", pinyin:"Wǒmen xiān mǎi yōuyóukǎ.", en:"Let's buy an EasyCard first.", note:"悠游卡 = EasyCard, Taipei's transit card" } },
    { npc:{ hanzi:"你好, 要买卡吗?", pinyin:"Nǐ hǎo, yào mǎi kǎ ma?", en:"Hello, do you want to buy a card?", note:"" } },
    { choice:{ options:[
      { hanzi:"要, 我要买一张悠游卡。", pinyin:"Yào, wǒ yào mǎi yì zhāng yōuyóukǎ.", en:"Yes, I want to buy an EasyCard.", good:true, react:{ hanzi:"好, 一百块。", pinyin:"Hǎo, yìbǎi kuài.", en:"Okay, 100 kuai." } },
      { hanzi:"我要买卡, 谢谢。", pinyin:"Wǒ yào mǎi kǎ, xièxie.", en:"I want to buy a card, thanks.", good:true, react:{ hanzi:"好, 一百块。", pinyin:"Hǎo, yìbǎi kuài.", en:"Okay, 100 kuai." } },
      { hanzi:"卡好不好?", pinyin:"Kǎ hǎo bu hǎo?", en:"Card good or not?", good:false, react:{ hanzi:"哈哈, 那不是买卡的话喔! 说「我要买一张悠游卡」~", pinyin:"Hāhā, nà bú shì mǎi kǎ de huà ō! Shuō 「wǒ yào mǎi yì zhāng yōuyóukǎ」~", en:"Haha, that's not how you buy a card! Say 'I want to buy an EasyCard'~" } }
    ] } },
    { npc:{ hanzi:"这张卡很方便, 捷运公车都能用!", pinyin:"Zhè zhāng kǎ hěn fāngbiàn, jiéyùn gōngchē dōu néng yòng!", en:"This card is super handy, works on MRT and buses!", note:"捷运 = MRT, 公车 = bus" } },
    { npc:{ hanzi:"要不要加值?", pinyin:"Yào bu yào jiāzhí?", en:"Do you want to add value?", note:"加值 = top up" } },
    { choice:{ options:[
      { hanzi:"要, 加两百块。", pinyin:"Yào, jiā liǎng bǎi kuài.", en:"Yes, add 200 kuai.", good:true, react:{ hanzi:"好, 加两百块。", pinyin:"Hǎo, jiā liǎng bǎi kuài.", en:"Okay, adding 200 kuai." } },
      { hanzi:"不用了, 谢谢。", pinyin:"Bú yòng le, xièxie.", en:"No need, thanks.", good:true, react:{ hanzi:"好的!", pinyin:"Hǎo de!", en:"Okay!" } }
    ] } },
    { npc:{ hanzi:"很好! 我们现在去坐车。", pinyin:"Hěn hǎo! Wǒmen xiànzài qù zuò chē.", en:"Great! Let's go take the train now.", note:"" } },
    { npc:{ hanzi:"请问, 你知道去几号出口吗?", pinyin:"Qǐngwèn, nǐ zhīdao qù jǐ hào chūkǒu ma?", en:"Do you know which exit number to go to?", note:"出口 = exit" } },
    { choice:{ options:[
      { hanzi:"我不知道, 请问几号出口?", pinyin:"Wǒ bù zhīdao, qǐngwèn jǐ hào chūkǒu?", en:"I don't know, which exit number please?", good:true, react:{ hanzi:"二号出口! 跟我来。", pinyin:"Èr hào chūkǒu! Gēn wǒ lái.", en:"Exit 2! Follow me." } },
      { hanzi:"几号出口?", pinyin:"Jǐ hào chūkǒu?", en:"Which exit number?", good:true, react:{ hanzi:"二号出口! 跟我来。", pinyin:"Èr hào chūkǒu! Gēn wǒ lái.", en:"Exit 2! Follow me." } },
      { hanzi:"出口几号?", pinyin:"Chūkǒu jǐ hào?", en:"Exit which number?", good:false, react:{ hanzi:"意思懂, 但说「几号出口」更自然~", pinyin:"Yìsi dǒng, dàn shuō 「jǐ hào chūkǒu」 gèng zìrán~", en:"Understandable, but 'which exit number' is more natural~" } }
    ] } },
    { npc:{ hanzi:"你看, 到了!", pinyin:"Nǐ kàn, dào le!", en:"Look, we're here!", note:"" } },
    { npc:{ hanzi:"悠游卡好用吗?", pinyin:"Yōuyóukǎ hǎoyòng ma?", en:"Is the EasyCard easy to use?", note:"" } },
    { choice:{ options:[
      { hanzi:"很好用!", pinyin:"Hěn hǎoyòng!", en:"Very easy to use!", good:true, react:{ hanzi:"太好了, 我就知道!", pinyin:"Tài hǎo le, wǒ jiù zhīdao!", en:"Great, I knew it!" } },
      { hanzi:"好用, 谢谢你。", pinyin:"Hǎoyòng, xièxie nǐ.", en:"Easy to use, thanks.", good:true, react:{ hanzi:"不客气!", pinyin:"Bú kèqi!", en:"You're welcome!" } }
    ] } },
    { npc:{ hanzi:"作为向导, 我很骄傲!", pinyin:"Zuòwéi xiàngdǎo, wǒ hěn jiāoào!", en:"As your guide, I'm proud!", note:"骄傲 = proud" } }
  ]
},
{ id:"c7", host:"yoroi", title:"Hotel check-in", emoji:"🏨", place:"饭店",
  script:[
    { npc:{ hanzi:"骑士为您服务! 欢迎光临饭店!", pinyin:"Qíshì wèi nín fúwù! Huānyíng guānglín fàndiàn!", en:"Your knight is at your service! Welcome to the hotel!", note:"为您服务 = at your service (polite)" } },
    { npc:{ hanzi:"您好, 请问贵姓?", pinyin:"Nín hǎo, qǐngwèn guìxìng?", en:"Hello, may I ask your surname?", note:"贵姓 = polite way to ask surname" } },
    { choice:{ options:[
      { hanzi:"我姓王。", pinyin:"Wǒ xìng Wáng.", en:"My surname is Wang.", good:true, react:{ hanzi:"王先生, 您好!", pinyin:"Wáng xiānsheng, nín hǎo!", en:"Mr. Wang, hello!" } },
      { hanzi:"我叫王明。", pinyin:"Wǒ jiào Wáng Míng.", en:"My name is Wang Ming.", good:true, react:{ hanzi:"王先生, 您好!", pinyin:"Wáng xiānsheng, nín hǎo!", en:"Mr. Wang, hello!" } },
      { hanzi:"贵姓是什么?", pinyin:"Guìxìng shì shénme?", en:"Your honorable surname is what?", good:false, react:{ hanzi:"哈哈, 那是问您喔! 说「我姓...」就好~", pinyin:"Hāhā, nà shì wèn nín ō! Shuō 「wǒ xìng...」 jiù hǎo~", en:"Haha, that's asking you! Just say 'my surname is...'~" } }
    ] } },
    { npc:{ hanzi:"请问您有订房吗?", pinyin:"Qǐngwèn nín yǒu dìngfáng ma?", en:"Did you make a reservation?", note:"订房 = book a room" } },
    { choice:{ options:[
      { hanzi:"有, 我有订房。", pinyin:"Yǒu, wǒ yǒu dìngfáng.", en:"Yes, I have a reservation.", good:true, react:{ hanzi:"好的, 请稍等。", pinyin:"Hǎo de, qǐng shāo děng.", en:"Okay, please wait a moment." } },
      { hanzi:"有。", pinyin:"Yǒu.", en:"Yes.", good:true, react:{ hanzi:"好的, 请稍等。", pinyin:"Hǎo de, qǐng shāo děng.", en:"Okay, please wait a moment." } }
    ] } },
    { npc:{ hanzi:"好了, 这是您的房卡。", pinyin:"Hǎo le, zhè shì nín de fángkǎ.", en:"All set, here's your room key card.", note:"房卡 = room key card" } },
    { npc:{ hanzi:"骑士提醒您: 可以问问早餐时间!", pinyin:"Qíshì tíxǐng nín: kěyǐ wènwen zǎocān shíjiān!", en:"Your knight reminds you: you can ask about breakfast time!", note:"早餐 = breakfast" } },
    { choice:{ options:[
      { hanzi:"早餐几点?", pinyin:"Zǎocān jǐ diǎn?", en:"What time is breakfast?", good:true, react:{ hanzi:"早上七点。", pinyin:"Zǎoshang qī diǎn.", en:"7am." } },
      { hanzi:"请问, 早餐几点?", pinyin:"Qǐngwèn, zǎocān jǐ diǎn?", en:"Excuse me, what time is breakfast?", good:true, react:{ hanzi:"早上七点。", pinyin:"Zǎoshang qī diǎn.", en:"7am." } },
      { hanzi:"早餐是什么时候几点?", pinyin:"Zǎocān shì shénme shíhou jǐ diǎn?", en:"Breakfast is what time when what time?", good:false, react:{ hanzi:"意思懂, 但说「早餐几点」就够了~", pinyin:"Yìsi dǒng, dàn shuō 「zǎocān jǐ diǎn」 jiù gòu le~", en:"Understandable, but 'what time is breakfast' alone is enough~" } }
    ] } },
    { npc:{ hanzi:"骑士也想知道 wifi 密码!", pinyin:"Qíshì yě xiǎng zhīdao wifi mìmǎ!", en:"The knight also wants to know the wifi password!", note:"密码 = password" } },
    { choice:{ options:[
      { hanzi:"wifi 密码是什么?", pinyin:"Wifi mìmǎ shì shénme?", en:"What's the wifi password?", good:true, react:{ hanzi:"密码在房卡后面。", pinyin:"Mìmǎ zài fángkǎ hòumiàn.", en:"The password is on the back of the key card." } },
      { hanzi:"请问 wifi 密码?", pinyin:"Qǐngwèn wifi mìmǎ?", en:"Excuse me, the wifi password?", good:true, react:{ hanzi:"密码在房卡后面。", pinyin:"Mìmǎ zài fángkǎ hòumiàn.", en:"The password is on the back of the key card." } }
    ] } },
    { npc:{ hanzi:"您的房间是三零五。", pinyin:"Nín de fángjiān shì sān líng wǔ.", en:"Your room is 305.", note:"" } },
    { npc:{ hanzi:"谢谢柜台, 骑士带您上楼!", pinyin:"Xièxie guìtái, qíshì dài nín shàng lóu!", en:"Thanks to the front desk, your knight will take you upstairs!", note:"上楼 = go upstairs" } },
    { npc:{ hanzi:"祝您入住愉快!", pinyin:"Zhù nín rùzhù yúkuài!", en:"Wishing you a pleasant stay!", note:"polite hotel phrase" } },
    { npc:{ hanzi:"骑士永远为您服务!", pinyin:"Qíshì yǒngyuǎn wèi nín fúwù!", en:"Your knight will always be at your service!", note:"" } }
  ]
},
{ id:"c8", host:"chimera", title:"Excuse me, where's...?", emoji:"🗺️", place:"台北街头",
  script:[
    { npc:{ hanzi:"嘻嘻...我们迷路了吗?", pinyin:"Xīxī... wǒmen mílù le ma?", en:"Hehe... are we lost?", note:"迷路 = lost" } },
    { npc:{ hanzi:"我们去问路人吧, 我扮演路人!", pinyin:"Wǒmen qù wèn lùrén ba, wǒ bànyǎn lùrén!", en:"Let's ask a passerby, I'll play the passerby!", note:"路人 = passerby" } },
    { npc:{ hanzi:"先跟路人打招呼喔~", pinyin:"Xiān gēn lùrén dǎzhāohu ō~", en:"First greet the passerby~", note:"打招呼 = greet" } },
    { choice:{ options:[
      { hanzi:"不好意思。", pinyin:"Bù hǎoyìsi.", en:"Excuse me.", good:true, react:{ hanzi:"嘻嘻, 你好! 什么事?", pinyin:"Xīxī, nǐ hǎo! Shénme shì?", en:"Hehe, hello! What's up?" } },
      { hanzi:"请问。", pinyin:"Qǐngwèn.", en:"May I ask.", good:true, react:{ hanzi:"嘻嘻, 你好! 什么事?", pinyin:"Xīxī, nǐ hǎo! Shénme shì?", en:"Hehe, hello! What's up?" } },
      { hanzi:"喂!", pinyin:"Wèi!", en:"Hey!", good:false, react:{ hanzi:"嘻嘻, 这样有点没礼貌喔, 说「不好意思」更好~", pinyin:"Xīxī, zhèyàng yǒudiǎn méi lǐmào ō, shuō 「bù hǎoyìsi」 gèng hǎo~", en:"Hehe, that's a bit rude, 'excuse me' is better~" } }
    ] } },
    { npc:{ hanzi:"现在问路吧, 你想去 101 大楼。", pinyin:"Xiànzài wèn lù ba, nǐ xiǎng qù 101 Dàlóu.", en:"Now ask for directions, you want to go to Taipei 101.", note:"101大楼 = Taipei 101" } },
    { choice:{ options:[
      { hanzi:"101 大楼在哪里?", pinyin:"101 Dàlóu zài nǎlǐ?", en:"Where is Taipei 101?", good:true, react:{ hanzi:"嘻嘻, 一直走就到了!", pinyin:"Xīxī, yìzhí zǒu jiù dào le!", en:"Hehe, just go straight and you'll get there!" } },
      { hanzi:"请问, 101 大楼怎么走?", pinyin:"Qǐngwèn, 101 Dàlóu zěnme zǒu?", en:"Excuse me, how do I get to Taipei 101?", good:true, react:{ hanzi:"嘻嘻, 一直走就到了!", pinyin:"Xīxī, yìzhí zǒu jiù dào le!", en:"Hehe, just go straight and you'll get there!" } },
      { hanzi:"101 大楼哪里在?", pinyin:"101 Dàlóu nǎlǐ zài?", en:"Taipei 101 where is?", good:false, react:{ hanzi:"嘻嘻, 意思懂啦, 但说「在哪里」更好~", pinyin:"Xīxī, yìsi dǒng la, dàn shuō 「zài nǎlǐ」 gèng hǎo~", en:"Hehe, I get it, but 'where is' is said better this way~" } }
    ] } },
    { npc:{ hanzi:"远不远? 你可以问问看。", pinyin:"Yuǎn bu yuǎn? Nǐ kěyǐ wènwen kàn.", en:"Far or not? You can try asking.", note:"远 = far" } },
    { choice:{ options:[
      { hanzi:"远不远?", pinyin:"Yuǎn bu yuǎn?", en:"Is it far?", good:true, react:{ hanzi:"不远, 走路十分钟。", pinyin:"Bù yuǎn, zǒulù shí fēnzhōng.", en:"Not far, 10 minutes by foot." } },
      { hanzi:"很远吗?", pinyin:"Hěn yuǎn ma?", en:"Is it very far?", good:true, react:{ hanzi:"不远, 走路十分钟。", pinyin:"Bù yuǎn, zǒulù shí fēnzhōng.", en:"Not far, 10 minutes by foot." } }
    ] } },
    { npc:{ hanzi:"太好了, 不远! 你要说谢谢喔。", pinyin:"Tài hǎo le, bù yuǎn! Nǐ yào shuō xièxie ō.", en:"Great, not far! You should say thanks.", note:"" } },
    { choice:{ options:[
      { hanzi:"谢谢你!", pinyin:"Xièxie nǐ!", en:"Thank you!", good:true, react:{ hanzi:"不客气, 慢走!", pinyin:"Bú kèqi, màn zǒu!", en:"You're welcome, take care!" } },
      { hanzi:"非常谢谢。", pinyin:"Fēicháng xièxie.", en:"Thank you very much.", good:true, react:{ hanzi:"不客气!", pinyin:"Bú kèqi!", en:"You're welcome!" } },
      { hanzi:"谢谢不客气。", pinyin:"Xièxie bú kèqi.", en:"Thanks you're welcome.", good:false, react:{ hanzi:"嘻嘻, 那两句不能一起说喔, 你只要说「谢谢你」~", pinyin:"Xīxī, nà liǎng jù bù néng yìqǐ shuō ō, nǐ zhǐyào shuō 「xièxie nǐ」~", en:"Hehe, you can't say both together, just say 'thank you'~" } }
    ] } },
    { npc:{ hanzi:"嘻嘻...其实我知道很多秘密路!", pinyin:"Xīxī... qíshí wǒ zhīdao hěn duō mìmì lù!", en:"Hehe... actually I know a lot of secret paths!", note:"秘密 = secret" } },
    { npc:{ hanzi:"走吧, 跟我来!", pinyin:"Zǒu ba, gēn wǒ lái!", en:"Let's go, follow me!", note:"" } },
    { npc:{ hanzi:"你看, 101 大楼到了!", pinyin:"Nǐ kàn, 101 Dàlóu dào le!", en:"Look, we've arrived at Taipei 101!", note:"" } },
    { npc:{ hanzi:"嘻嘻, 问路一点都不难吧?", pinyin:"Xīxī, wèn lù yìdiǎn dōu bù nán ba?", en:"Hehe, asking for directions isn't hard at all, right?", note:"" } }
  ]
},
{ id:"c9", host:"momonga", title:"Souvenir haggle time", emoji:"🎁", place:"纪念品商店",
  script:[
    { npc:{ hanzi:"哼! 今天要买最好的纪念品!", pinyin:"Hēng! Jīntiān yào mǎi zuì hǎo de jìniànpǐn!", en:"Hmph! Today we must buy the best souvenirs!", note:"纪念品 = souvenir" } },
    { npc:{ hanzi:"你看这个凤梨酥, 漂亮吧?", pinyin:"Nǐ kàn zhège fènglísū, piàoliang ba?", en:"Look at this pineapple cake, pretty right?", note:"" } },
    { npc:{ hanzi:"欢迎, 要看什么?", pinyin:"Huānyíng, yào kàn shénme?", en:"Welcome, what would you like to look at?", note:"" } },
    { choice:{ options:[
      { hanzi:"这个多少钱?", pinyin:"Zhège duōshao qián?", en:"How much is this?", good:true, react:{ hanzi:"一盒三百块。", pinyin:"Yì hé sān bǎi kuài.", en:"300 kuai a box." } },
      { hanzi:"请问, 这个多少钱?", pinyin:"Qǐngwèn, zhège duōshao qián?", en:"Excuse me, how much is this?", good:true, react:{ hanzi:"一盒三百块。", pinyin:"Yì hé sān bǎi kuài.", en:"300 kuai a box." } },
      { hanzi:"多少钱这个?", pinyin:"Duōshao qián zhège?", en:"How much this?", good:false, react:{ hanzi:"哼, 意思懂, 但说「这个多少钱」比较好~", pinyin:"Hēng, yìsi dǒng, dàn shuō 「zhège duōshao qián」 bǐjiào hǎo~", en:"Hmph, I get it, but 'how much is this' is said better this way~" } }
    ] } },
    { npc:{ hanzi:"哼! 三百块太贵了! 你要讲价!", pinyin:"Hēng! Sān bǎi kuài tài guì le! Nǐ yào jiǎngjià!", en:"Hmph! 300 kuai is too expensive! You must haggle!", note:"讲价 = haggle" } },
    { choice:{ options:[
      { hanzi:"太贵了!", pinyin:"Tài guì le!", en:"That's too expensive!", good:true, react:{ hanzi:"好啦, 两百五十块。", pinyin:"Hǎo la, liǎng bǎi wǔshí kuài.", en:"Okay fine, 250 kuai." } },
      { hanzi:"可以便宜一点吗?", pinyin:"Kěyǐ piányi yìdiǎn ma?", en:"Can it be a bit cheaper?", good:true, react:{ hanzi:"好啦, 两百五十块。", pinyin:"Hǎo la, liǎng bǎi wǔshí kuài.", en:"Okay fine, 250 kuai." } },
      { hanzi:"便宜!", pinyin:"Piányi!", en:"Cheap!", good:false, react:{ hanzi:"哼, 那样太直接啦! 说「可以便宜一点吗」更好~", pinyin:"Hēng, nàyàng tài zhíjiē la! Shuō 「kěyǐ piányi yìdiǎn ma」 gèng hǎo~", en:"Hmph, that's too blunt! 'Can it be a bit cheaper' is better~" } }
    ] } },
    { npc:{ hanzi:"哼哼! 我厉害吧? 你要夸我!", pinyin:"Hēnghēng! Wǒ lìhai ba? Nǐ yào kuā wǒ!", en:"Hmph hmph! I'm amazing right? You must praise me!", note:"厉害 = amazing, 夸 = praise" } },
    { choice:{ options:[
      { hanzi:"你很厉害!", pinyin:"Nǐ hěn lìhai!", en:"You're so amazing!", good:true, react:{ hanzi:"哼哼, 当然!", pinyin:"Hēnghēng, dāngrán!", en:"Hmph hmph, of course!" } },
      { hanzi:"你太棒了!", pinyin:"Nǐ tài bàng le!", en:"You're the best!", good:true, react:{ hanzi:"哼哼, 那当然!", pinyin:"Hēnghēng, nà dāngrán!", en:"Hmph hmph, of course!" } },
      { hanzi:"你厉害吗?", pinyin:"Nǐ lìhai ma?", en:"Are you amazing?", good:false, react:{ hanzi:"哼! 这是在问我吗? 说「你很厉害」才对啦!", pinyin:"Hēng! Zhè shì zài wèn wǒ ma? Shuō 「nǐ hěn lìhai」 cái duì la!", en:"Hmph! Is that asking me? You should say 'you're so amazing'!" } }
    ] } },
    { npc:{ hanzi:"好, 现在买单!", pinyin:"Hǎo, xiànzài mǎidān!", en:"Okay, let's pay now!", note:"买单 = pay the bill" } },
    { npc:{ hanzi:"两百五十块, 谢谢。", pinyin:"Liǎng bǎi wǔshí kuài, xièxie.", en:"250 kuai, thanks.", note:"" } },
    { choice:{ options:[
      { hanzi:"好, 我要这个。", pinyin:"Hǎo, wǒ yào zhège.", en:"Okay, I'll take this.", good:true, react:{ hanzi:"谢谢!", pinyin:"Xièxie!", en:"Thank you!" } },
      { hanzi:"好, 给你。", pinyin:"Hǎo, gěi nǐ.", en:"Okay, here you go.", good:true, react:{ hanzi:"谢谢!", pinyin:"Xièxie!", en:"Thank you!" } }
    ] } },
    { npc:{ hanzi:"哼哼! 因为我, 便宜了五十块!", pinyin:"Hēnghēng! Yīnwèi wǒ, piányi le wǔshí kuài!", en:"Hmph hmph! Because of me, it's 50 kuai cheaper!", note:"" } },
    { npc:{ hanzi:"快夸我讲价很厉害!", pinyin:"Kuài kuā wǒ jiǎngjià hěn lìhai!", en:"Quick, praise how amazing I am at haggling!", note:"" } },
    { choice:{ options:[
      { hanzi:"你讲价真的很厉害!", pinyin:"Nǐ jiǎngjià zhēn de hěn lìhai!", en:"You're really amazing at haggling!", good:true, react:{ hanzi:"哼哼! 当然啦!!", pinyin:"Hēnghēng! Dāngrán la!!", en:"Hmph hmph! Of course!!" } },
      { hanzi:"谢谢你!", pinyin:"Xièxie nǐ!", en:"Thank you!", good:false, react:{ hanzi:"哼, 光谢谢不够, 要夸我厉害!!", pinyin:"Hēng, guāng xièxie bú gòu, yào kuā wǒ lìhai!!", en:"Hmph, thanks alone isn't enough, praise me!!" } }
    ] } }
  ]
},
{ id:"c10", host:"chiikawa", title:"Making a new friend", emoji:"🌸", place:"公园",
  script:[
    { npc:{ hanzi:"呃...你好...我是...第一次说中文...", pinyin:"È... nǐ hǎo... wǒ shì... dì yī cì shuō Zhōngwén...", en:"Um... hello... I'm... it's my first time speaking Chinese...", note:"" } },
    { npc:{ hanzi:"我们...做朋友, 好不好?", pinyin:"Wǒmen... zuò péngyou, hǎo bu hǎo?", en:"Let's... be friends, okay?", note:"做朋友 = be friends" } },
    { choice:{ options:[
      { hanzi:"好啊!", pinyin:"Hǎo a!", en:"Sure!", good:true, react:{ hanzi:"太好了...谢谢你!", pinyin:"Tài hǎo le... xièxie nǐ!", en:"Great... thank you!" } },
      { hanzi:"好, 我很高兴。", pinyin:"Hǎo, wǒ hěn gāoxìng.", en:"Okay, I'm happy.", good:true, react:{ hanzi:"我也很高兴!", pinyin:"Wǒ yě hěn gāoxìng!", en:"I'm happy too!" } }
    ] } },
    { npc:{ hanzi:"你叫什么名字?", pinyin:"Nǐ jiào shénme míngzi?", en:"What's your name?", note:"" } },
    { choice:{ options:[
      { hanzi:"我叫...(说出你的名字)。", pinyin:"Wǒ jiào... (shuō chū nǐ de míngzi).", en:"My name is... (say your name).", good:true, react:{ hanzi:"你的名字...很好听!", pinyin:"Nǐ de míngzi... hěn hǎotīng!", en:"Your name... sounds very nice!" } },
      { hanzi:"我的名字是...。", pinyin:"Wǒ de míngzi shì...", en:"My name is...", good:true, react:{ hanzi:"你的名字...很好听!", pinyin:"Nǐ de míngzi... hěn hǎotīng!", en:"Your name... sounds very nice!" } },
      { hanzi:"名字什么?", pinyin:"Míngzi shénme?", en:"Name what?", good:false, react:{ hanzi:"呃...那样有点怪怪的, 说「我叫...」就好~", pinyin:"È... nàyàng yǒudiǎn guàiguài de, shuō 「wǒ jiào...」 jiù hǎo~", en:"Um... that's a bit off, just say 'my name is...'~" } }
    ] } },
    { npc:{ hanzi:"你是哪国人?", pinyin:"Nǐ shì nǎ guó rén?", en:"What country are you from?", note:"哪国人 = which country's person" } },
    { choice:{ options:[
      { hanzi:"我是美国人。", pinyin:"Wǒ shì Měiguórén.", en:"I'm American.", good:true, react:{ hanzi:"哇...美国...很远呢!", pinyin:"Wa... Měiguó... hěn yuǎn ne!", en:"Wow... America... that's so far!" } },
      { hanzi:"我从美国来。", pinyin:"Wǒ cóng Měiguó lái.", en:"I'm from America.", good:true, react:{ hanzi:"哇, 你来得真远!", pinyin:"Wa, nǐ lái de zhēn yuǎn!", en:"Wow, you came from so far!" } },
      { hanzi:"美国我。", pinyin:"Měiguó wǒ.", en:"America me.", good:false, react:{ hanzi:"呃...意思懂啦, 但说「我是美国人」更好~", pinyin:"È... yìsi dǒng la, dàn shuō 「wǒ shì Měiguórén」 gèng hǎo~", en:"Um... I understand, but 'I'm American' is said better this way~" } }
    ] } },
    { npc:{ hanzi:"呃...我...我喜欢猫咪...你呢? 你喜欢什么?", pinyin:"È... wǒ... wǒ xǐhuan māomī... nǐ ne? Nǐ xǐhuan shénme?", en:"Um... I... I like cats... what about you? What do you like?", note:"猫咪 = kitty" } },
    { choice:{ options:[
      { hanzi:"我喜欢猫。", pinyin:"Wǒ xǐhuan māo.", en:"I like cats.", good:true, react:{ hanzi:"真的吗! 我们一样!", pinyin:"Zhēn de ma! Wǒmen yíyàng!", en:"Really! We're the same!" } },
      { hanzi:"我喜欢茶。", pinyin:"Wǒ xǐhuan chá.", en:"I like tea.", good:true, react:{ hanzi:"茶...也很好喝!", pinyin:"Chá... yě hěn hǎohē!", en:"Tea... is also tasty!" } },
      { hanzi:"喜欢我什么?", pinyin:"Xǐhuan wǒ shénme?", en:"Like me what?", good:false, react:{ hanzi:"呃...那样意思不对喔, 说「我喜欢...」~", pinyin:"È... nàyàng yìsi bú duì ō, shuō 「wǒ xǐhuan...」~", en:"Um... that doesn't mean quite right, say 'I like...'~" } }
    ] } },
    { npc:{ hanzi:"呃...我...我可以问你...一起吃饭, 好吗?", pinyin:"È... wǒ... wǒ kěyǐ wèn nǐ... yìqǐ chīfàn, hǎo ma?", en:"Um... can I ask you... eat together, okay?", note:"一起 = together" } },
    { choice:{ options:[
      { hanzi:"好啊, 一起吃饭!", pinyin:"Hǎo a, yìqǐ chīfàn!", en:"Sure, let's eat together!", good:true, react:{ hanzi:"太好了!! 我很开心!!", pinyin:"Tài hǎo le!! Wǒ hěn kāixīn!!", en:"Great!! I'm so happy!!" } },
      { hanzi:"好, 走吧。", pinyin:"Hǎo, zǒu ba.", en:"Okay, let's go.", good:true, react:{ hanzi:"好...走吧!", pinyin:"Hǎo... zǒu ba!", en:"Okay... let's go!" } }
    ] } },
    { npc:{ hanzi:"谢谢你...跟我做朋友。", pinyin:"Xièxie nǐ... gēn wǒ zuò péngyou.", en:"Thank you... for being my friend.", note:"" } },
    { npc:{ hanzi:"呃...很高兴认识你!", pinyin:"È... hěn gāoxìng rènshi nǐ!", en:"Um... nice to meet you!", note:"很高兴认识你 = nice to meet you" } },
    { npc:{ hanzi:"我们...以后也要一起玩喔!", pinyin:"Wǒmen... yǐhòu yě yào yìqǐ wán ō!", en:"Let's... play together in the future too!", note:"" } }
  ]
}
];

window.YAHA_FOODS = [
  { id:"ramen", emoji:"🍜", name:"Ramen", hanzi:"拉面", pinyin:"lāmiàn", en:"Ramen noodle soup",
    order:{ hanzi:"老板, 我要一碗拉面。", pinyin:"Lǎobǎn, wǒ yào yì wǎn lāmiàn.", en:"Boss, I want a bowl of ramen." },
    tip:"Order by the bowl (碗) — many shops let you add toppings like egg for a few extra kuai." },
  { id:"hamburg", emoji:"🍔", name:"Hamburger", hanzi:"汉堡", pinyin:"hànbǎo", en:"Hamburger",
    order:{ hanzi:"我要一个汉堡, 谢谢。", pinyin:"Wǒ yào yí gè hànbǎo, xièxie.", en:"I want one hamburger, thanks." },
    tip:"Breakfast shops (早餐店) sell cheap hamburgers with egg — a great quick morning bite." },
  { id:"parfait", emoji:"🍨", name:"Parfait", hanzi:"芭菲", pinyin:"bāfēi", en:"Fruit and ice cream parfait",
    order:{ hanzi:"我要一份芭菲。", pinyin:"Wǒ yào yí fèn bāfēi.", en:"I want one parfait." },
    tip:"Found at dessert cafes — ask 请问有芭菲吗 if it's not on the menu board." },
  { id:"onigiri", emoji:"🍙", name:"Rice Ball", hanzi:"饭团", pinyin:"fàntuán", en:"Rice ball",
    order:{ hanzi:"我要一个饭团。", pinyin:"Wǒ yào yí gè fàntuán.", en:"I want one rice ball." },
    tip:"Sold at breakfast stands and convenience stores — perfect grab-and-go food." },
  { id:"pancake", emoji:"🥞", name:"Pancake", hanzi:"松饼", pinyin:"sōngbǐng", en:"Pancake",
    order:{ hanzi:"我要一份松饼。", pinyin:"Wǒ yào yí fèn sōngbǐng.", en:"I want one order of pancakes." },
    tip:"Night market stalls sell mini 松饼 with chocolate or peanut filling — cheap and sweet." },
  { id:"beer", emoji:"🍺", name:"Beer", hanzi:"啤酒", pinyin:"píjiǔ", en:"Beer",
    order:{ hanzi:"我要一杯啤酒。", pinyin:"Wǒ yào yì bēi píjiǔ.", en:"I want one beer." },
    tip:"Taiwan Beer (台湾啤酒) pairs well with night market food — 7-Elevens sell it cold too." },
  { id:"edamame", emoji:"🫛", name:"Edamame", hanzi:"毛豆", pinyin:"máodòu", en:"Edamame / soybeans",
    order:{ hanzi:"我要一份毛豆。", pinyin:"Wǒ yào yí fèn máodòu.", en:"I want one order of edamame." },
    tip:"A classic beer-shop side dish — usually salted and served cold." },
  { id:"boba", emoji:"🧋", name:"Bubble Tea", hanzi:"珍珠奶茶", pinyin:"zhēnzhū nǎichá", en:"Bubble milk tea",
    order:{ hanzi:"我要一杯珍珠奶茶, 大杯。", pinyin:"Wǒ yào yì bēi zhēnzhū nǎichá, dà bēi.", en:"I want one bubble milk tea, large." },
    tip:"Clerks ask sugar (甜度) and ice (冰) level — 半糖少冰 (half sugar, less ice) is a safe start." },
  { id:"xlb", emoji:"🥟", name:"Soup Dumplings", hanzi:"小笼包", pinyin:"xiǎolóngbāo", en:"Soup dumplings",
    order:{ hanzi:"我要一笼小笼包。", pinyin:"Wǒ yào yì lóng xiǎolóngbāo.", en:"I want one steamer of soup dumplings." },
    tip:"Full of hot soup inside — bite a small hole first to let the steam out before eating." },
  { id:"jipai", emoji:"🍗", name:"Fried Chicken Cutlet", hanzi:"鸡排", pinyin:"jīpái", en:"Taiwanese fried chicken cutlet",
    order:{ hanzi:"老板, 一个鸡排, 要辣。", pinyin:"Lǎobǎn, yí gè jīpái, yào là.", en:"Boss, one chicken cutlet, spicy please." },
    tip:"A night market must-try — bigger than your face; the vendor will ask 要不要辣 (spicy or not)." },
  { id:"mangoice", emoji:"🍧", name:"Mango Shaved Ice", hanzi:"芒果冰", pinyin:"mángguǒ bīng", en:"Mango shaved ice",
    order:{ hanzi:"我要一碗芒果冰。", pinyin:"Wǒ yào yì wǎn mángguǒ bīng.", en:"I want one bowl of mango shaved ice." },
    tip:"Best in summer — shops near Yongkang Street are famous for piling on fresh mango." },
  { id:"sweetpotato", emoji:"🍠", name:"Roasted Sweet Potato", hanzi:"烤地瓜", pinyin:"kǎo dìguā", en:"Roasted sweet potato",
    order:{ hanzi:"我要一个烤地瓜。", pinyin:"Wǒ yào yí gè kǎo dìguā.", en:"I want one roasted sweet potato." },
    tip:"Sold from roadside carts in cooler months — sometimes priced by weight." },
  { id:"beefnoodle", emoji:"🍲", name:"Beef Noodle Soup", hanzi:"牛肉面", pinyin:"niúròumiàn", en:"Beef noodle soup",
    order:{ hanzi:"我要一碗牛肉面。", pinyin:"Wǒ yào yì wǎn niúròumiàn.", en:"I want one bowl of beef noodle soup." },
    tip:"Taipei's signature dish — choose 内用 (dine in) or 外带 (take out) when you order." },
  { id:"luroufan", emoji:"🍚", name:"Braised Pork Rice", hanzi:"卤肉饭", pinyin:"lǔròufàn", en:"Braised pork rice",
    order:{ hanzi:"我要一碗卤肉饭。", pinyin:"Wǒ yào yì wǎn lǔròufàn.", en:"I want one bowl of braised pork rice." },
    tip:"Cheap, everywhere, and fast — a small bowl is often under NT$40." },
  { id:"choudoufu", emoji:"👃", name:"Stinky Tofu", hanzi:"臭豆腐", pinyin:"chòudòufu", en:"Stinky tofu",
    order:{ hanzi:"老板, 我要一份臭豆腐, 小辣。", pinyin:"Lǎobǎn, wǒ yào yí fèn chòudòufu, xiǎo là.", en:"Boss, one stinky tofu, mild spicy." },
    tip:"Smells strong, tastes great — night market stalls fry it crispy and serve it with pickled cabbage." },
  { id:"congzhuabing", emoji:"🫓", name:"Scallion Pancake", hanzi:"葱抓饼", pinyin:"cōngzhuābǐng", en:"Scallion pancake",
    order:{ hanzi:"我要一份葱抓饼, 加蛋。", pinyin:"Wǒ yào yí fèn cōngzhuābǐng, jiā dàn.", en:"I want one scallion pancake, with egg added." },
    tip:"A popular breakfast street food — 加蛋 (add egg) is a common upgrade for a few more kuai." },
  { id:"guabao", emoji:"🥙", name:"Gua Bao", hanzi:"割包", pinyin:"guàbāo", en:"Taiwanese pork belly bun",
    order:{ hanzi:"我要一个割包。", pinyin:"Wǒ yào yí gè guàbāo.", en:"I want one gua bao." },
    tip:"Called the 'Taiwanese hamburger' — a soft steamed bun stuffed with pork belly and peanut powder." },
  { id:"yansuji", emoji:"🍿", name:"Popcorn Chicken", hanzi:"盐酥鸡", pinyin:"yánsūjī", en:"Taiwanese popcorn chicken",
    order:{ hanzi:"我要一份盐酥鸡, 中辣。", pinyin:"Wǒ yào yí fèn yánsūjī, zhōng là.", en:"I want one order of popcorn chicken, medium spicy." },
    tip:"You pick your own mix-ins (mushrooms, tofu) at the counter before it's all fried together." },
  { id:"ezaijian", emoji:"🦪", name:"Oyster Omelet", hanzi:"蚵仔煎", pinyin:"ézǎijiān", en:"Oyster omelet",
    order:{ hanzi:"我要一份蚵仔煎。", pinyin:"Wǒ yào yí fèn ézǎijiān.", en:"I want one oyster omelet." },
    tip:"A night market classic with a sweet-savory starchy sauce — look for stalls with a big flat griddle." },
  { id:"douhua", emoji:"🍮", name:"Tofu Pudding", hanzi:"豆花", pinyin:"dòuhuā", en:"Sweet tofu pudding",
    order:{ hanzi:"我要一碗豆花, 加珍珠。", pinyin:"Wǒ yào yì wǎn dòuhuā, jiā zhēnzhū.", en:"I want one bowl of tofu pudding, with boba added." },
    tip:"Silky and light — served hot or cold; ask 热的还是冰的 if you're unsure." },
  { id:"fenglisu", emoji:"🍍", name:"Pineapple Cake", hanzi:"凤梨酥", pinyin:"fènglísū", en:"Pineapple cake",
    order:{ hanzi:"我要一盒凤梨酥。", pinyin:"Wǒ yào yì hé fènglísū.", en:"I want one box of pineapple cakes." },
    tip:"The go-to souvenir — sold by the box at bakeries and the airport, great for gifting." },
  { id:"chelunbing", emoji:"🥮", name:"Wheel Cake", hanzi:"车轮饼", pinyin:"chēlúnbǐng", en:"Wheel cake",
    order:{ hanzi:"我要一个车轮饼, 红豆的。", pinyin:"Wǒ yào yí gè chēlúnbǐng, hóngdòu de.", en:"I want one wheel cake, red bean flavor." },
    tip:"Named for looking like a cart wheel — pick a filling like red bean or custard at the stall." },
  { id:"doujiang", emoji:"🥛", name:"Soy Milk", hanzi:"豆浆", pinyin:"dòujiāng", en:"Soy milk",
    order:{ hanzi:"我要一杯豆浆, 热的。", pinyin:"Wǒ yào yì bēi dòujiāng, rè de.", en:"I want one soy milk, hot." },
    tip:"A classic breakfast drink — order 甜 (sweet) or 咸 (savory, soup-like) at breakfast shops." },
  { id:"danbing", emoji:"🌯", name:"Egg Crepe", hanzi:"蛋饼", pinyin:"dànbǐng", en:"Egg crepe",
    order:{ hanzi:"我要一份蛋饼, 加起司。", pinyin:"Wǒ yào yí fèn dànbǐng, jiā qǐsī.", en:"I want one egg crepe, with cheese added." },
    tip:"A breakfast-shop staple — a thin crepe rolled around egg, cheap and filling." },
  { id:"shuijiao", emoji:"🥣", name:"Dumplings", hanzi:"水饺", pinyin:"shuǐjiǎo", en:"Boiled dumplings",
    order:{ hanzi:"我要十个水饺。", pinyin:"Wǒ yào shí gè shuǐjiǎo.", en:"I want ten dumplings." },
    tip:"Usually ordered by the ten — dip in vinegar and chili for extra flavor." },
  { id:"baozi", emoji:"🍞", name:"Steamed Bun", hanzi:"包子", pinyin:"bāozi", en:"Steamed bun",
    order:{ hanzi:"我要一个包子。", pinyin:"Wǒ yào yí gè bāozi.", en:"I want one steamed bun." },
    tip:"Grab one from a steamer cart for a quick snack — ask 里面是什么 if you want to know the filling." },
  { id:"mianxian", emoji:"🍥", name:"Mian Xian", hanzi:"面线", pinyin:"miànxiàn", en:"Thin vermicelli soup",
    order:{ hanzi:"我要一碗面线。", pinyin:"Wǒ yào yì wǎn miànxiàn.", en:"I want one bowl of mian xian." },
    tip:"Often topped with oyster or pig intestine — a popular late-night street snack." },
  { id:"dongguacha", emoji:"🧊", name:"Winter Melon Tea", hanzi:"冬瓜茶", pinyin:"dōngguāchá", en:"Winter melon tea",
    order:{ hanzi:"我要一杯冬瓜茶。", pinyin:"Wǒ yào yì bēi dōngguāchá.", en:"I want one winter melon tea." },
    tip:"Sweet, caffeine-free, and cheap — a classic night market cool-down drink." },
  { id:"muguaniunai", emoji:"🥭", name:"Papaya Milk", hanzi:"木瓜牛奶", pinyin:"mùguā niúnǎi", en:"Papaya milk",
    order:{ hanzi:"我要一杯木瓜牛奶。", pinyin:"Wǒ yào yì bēi mùguā niúnǎi.", en:"I want one papaya milk." },
    tip:"A Taiwan specialty smoothie — Hualien is especially famous for it." },
  { id:"diguaqiu", emoji:"🍡", name:"Sweet Potato Balls", hanzi:"地瓜球", pinyin:"dìguāqiú", en:"Fried sweet potato balls",
    order:{ hanzi:"我要一份地瓜球。", pinyin:"Wǒ yào yí fèn dìguāqiú.", en:"I want one order of sweet potato balls." },
    tip:"Chewy, crispy, and best eaten hot straight from the fryer at night market stalls." }
];
