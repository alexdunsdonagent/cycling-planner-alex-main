#!/usr/bin/env python3
"""Removes the broken i18n insertion and adds keys correctly."""
import re, shutil

SRC = "src/App.jsx"

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

# ── Remove the entire broken block that was inserted after about:"About" ──
# It starts with whyMatched and ends just before the closing }, of en block
# We'll find the en block closing and strip the junk

# The en block legitimately ends at about:"About"  },
# Everything between about:"About" and the next lang block (nl:{) is junk

GOOD_END = 'about:"About"'
NL_START = '\nnl:{'

en_end_idx = src.find(GOOD_END)
nl_start_idx = src.find(NL_START)

if en_end_idx == -1 or nl_start_idx == -1:
    print("❌ Could not find markers — check file manually")
    exit(1)

# What's between the good end and nl start?
junk = src[en_end_idx + len(GOOD_END):nl_start_idx]
print(f"Found junk block ({len(junk)} chars):")
print(repr(junk[:200]))

# Replace: keep about:"About" then close the en block, then start nl
# The en block needs its closing }, 
src = src[:en_end_idx + len(GOOD_END)] + '\n},' + src[nl_start_idx:]
print("✅ Removed junk block")

# ── Now do the same cleanup for other languages ──
# Each lang block should end at about:"..." },  then next lang or closing }
lang_ends = {
    'nl': ('about:"Over"',     '\npt:{'),
    'pt': ('about:"Sobre"',    '\npl:{'),
    'pl': ('about:"O nas"',    '\ncs:{'),
    'cs': ('about:"O nás"',    '\nda:{'),
    'da': ('about:"Om"',       '\nsv:{'),   # da and sv both use "Om"
    'sv': ('about:"Om"',       '\nno:{'),
    'no': ('about:"Om"',       '\nja:{'),
    'ja': ('about:"について"',  '\nzh:{'),
    'zh': ('about:"关于"',      None),       # last lang, close with }
}

for lang, (good_end, next_start) in lang_ends.items():
    # Find the LAST occurrence of good_end before next_start
    if next_start:
        ns_idx = src.find(next_start)
        if ns_idx == -1:
            print(f"⚠  Could not find {next_start} for {lang}")
            continue
        ge_idx = src.rfind(good_end, 0, ns_idx)
    else:
        ge_idx = src.rfind(good_end)
        ns_idx = None

    if ge_idx == -1:
        print(f"⚠  Could not find '{good_end}' for {lang}")
        continue

    after_end = ge_idx + len(good_end)
    
    if next_start and ns_idx:
        junk = src[after_end:ns_idx]
        if len(junk.strip()) > 3:  # more than just \n},
            print(f"  Cleaning {lang}: {len(junk)} chars of junk")
            src = src[:after_end] + '\n},' + src[ns_idx:]
    else:
        # Last language — find the closing of the T object
        # Should be \n}; after zh block
        t_close = src.find('\n};', after_end)
        if t_close != -1:
            junk = src[after_end:t_close]
            if len(junk.strip()) > 3:
                print(f"  Cleaning {lang}: {len(junk)} chars of junk")
                src = src[:after_end] + '\n}\n};' + src[t_close+3:]

# ── Now add the new keys correctly ──────────────────────────────────────────
print("\nAdding new i18n keys...")

NEW_KEYS = {
    "en": {
        "whyMatched":"WHY MATCHED","aboutDest":"ABOUT THIS DESTINATION","furtherReading":"FURTHER READING",
        "routesRiding":"ROUTES & RIDING","exploreStrava":"Explore on Strava","browseKomoot":"Browse on Komoot",
        "whereToStay":"WHERE TO STAY","whyCyclists":"WHY CYCLISTS STAY HERE",
        "bikeShopsNearby":"BIKE SHOPS & HIRE","yourDailyPlan":"YOUR DAILY PLAN",
        "routeMap":"ROUTE MAP","bestAreaStay":"BEST AREA TO STAY",
        "pricesApprox":"prices approx, verify before booking","viewHotelBtn":"View hotel",
        "selfCateringOpt":"SELF-CATERING OPTION",
        "outAndBack":"OUT-AND-BACK","directions":"DIRECTIONS FROM BASE","insiderTips":"INSIDER TIPS",
        "recommendedBase":"RECOMMENDED BASE HOTEL","moreRidesFrom":"MORE RIDES FROM",
        "otherRoutes":"OTHER CLASSIC CYCLING ROUTES","videoSection":"VIDEO INSPIRATION",
        "watchYoutube":"Watch on YouTube","whatToRide":"WHAT TO RIDE","foodFuel":"FOOD & FUEL",
        "whereStay":"WHERE TO STAY","alsoExplore":"ALSO EXPLORE",
        "planYourTrip":"Get matched hotels, routes & local intel — free",
        "notQuiteRight":"Not quite right?","shareWithFriend":"Share this trip with a friend",
        "sendToFriend":"SEND TO A FRIEND","postOnSocial":"POST ON SOCIAL",
        "groupTrip":"Going with a group of mixed abilities?","groupComingSoon":"Group mode — coming soon",
        "primaryAirport":"PRIMARY AIRPORT","altAirport":"ALTERNATIVE AIRPORT",
        "bikeTransport":"BIKE TRANSPORT","localKnowledge":"LOCAL INSIDER KNOWLEDGE",
        "whatCouldGoWrong":"WHAT COULD GO WRONG","preRide":"PRE-RIDE","midRide":"MID-RIDE",
        "postRide":"POST-RIDE","localFuel":"LOCAL FUEL","setAsBase":"Set as my base",
        "day":"Day","estTime":"Est. time","difficulty":"Difficulty",
        "distance":"Distance","elevation":"Elevation","style":"Style","baseTown":"Base town",
    },
    "nl": {
        "whyMatched":"WAAROM GEMATCHT","aboutDest":"OVER DEZE BESTEMMING","furtherReading":"MEER LEZEN",
        "routesRiding":"ROUTES & RIJDEN","exploreStrava":"Verkennen op Strava","browseKomoot":"Bekijken op Komoot",
        "whereToStay":"WAAR TE VERBLIJVEN","whyCyclists":"WAAROM FIETSERS HIER BLIJVEN",
        "bikeShopsNearby":"FIETSWINKELS & VERHUUR","yourDailyPlan":"UW DAGELIJKSE PLANNING",
        "routeMap":"ROUTEKAART","bestAreaStay":"BESTE VERBLIJFSGEBIED",
        "pricesApprox":"indicatieve prijzen, verifieer voor boeking","viewHotelBtn":"Hotel bekijken",
        "selfCateringOpt":"ZELFVERZORGING OPTIE",
        "outAndBack":"HEEN EN TERUG","directions":"AANWIJZINGEN VANAF BASIS","insiderTips":"INSIDER TIPS",
        "recommendedBase":"AANBEVOLEN BASISHOTEL","moreRidesFrom":"MEER RITTEN VANUIT",
        "otherRoutes":"ANDERE KLASSIEKE FIETSROUTES","videoSection":"VIDEO INSPIRATIE",
        "watchYoutube":"Bekijk op YouTube","whatToRide":"WAT TE RIJDEN","foodFuel":"ETEN & BRANDSTOF",
        "whereStay":"WAAR TE VERBLIJVEN","alsoExplore":"OOK ONTDEKKEN",
        "planYourTrip":"Krijg matched hotels, routes & lokale informatie — gratis",
        "notQuiteRight":"Niet helemaal goed?","shareWithFriend":"Deel deze trip met een vriend",
        "sendToFriend":"STUUR NAAR EEN VRIEND","postOnSocial":"DEEL OP SOCIALE MEDIA",
        "groupTrip":"Gaat u met een groep?","groupComingSoon":"Groepsmodus — binnenkort",
        "primaryAirport":"PRIMAIRE LUCHTHAVEN","altAirport":"ALTERNATIEVE LUCHTHAVEN",
        "bikeTransport":"FIETSTRANSPORT","localKnowledge":"LOKALE INSIDER KENNIS",
        "whatCouldGoWrong":"WAT KAN ER MISGAAN","preRide":"VOOR DE RIT","midRide":"TIJDENS DE RIT",
        "postRide":"NA DE RIT","localFuel":"LOKALE BRANDSTOF","setAsBase":"Instellen als basis",
        "day":"Dag","estTime":"Geschatte tijd","difficulty":"Moeilijkheid",
        "distance":"Afstand","elevation":"Hoogteverschil","style":"Stijl","baseTown":"Basisstad",
    },
    "pt": {
        "whyMatched":"PORQUÊ CORRESPONDIDO","aboutDest":"SOBRE ESTE DESTINO","furtherReading":"LEITURA ADICIONAL",
        "routesRiding":"ROTAS & CICLISMO","exploreStrava":"Explorar no Strava","browseKomoot":"Ver no Komoot",
        "whereToStay":"ONDE FICAR","whyCyclists":"PORQUE OS CICLISTAS FICAM AQUI",
        "bikeShopsNearby":"LOJAS & ALUGUER","yourDailyPlan":"PLANO DIÁRIO",
        "routeMap":"MAPA DE ROTA","bestAreaStay":"MELHOR AREA PARA FICAR",
        "pricesApprox":"precos aproximados, verifique antes de reservar","viewHotelBtn":"Ver hotel",
        "selfCateringOpt":"ALOJAMENTO PROPRIO",
        "outAndBack":"IDA E VOLTA","directions":"DIRECOES DA BASE","insiderTips":"DICAS DE INSIDER",
        "recommendedBase":"HOTEL BASE RECOMENDADO","moreRidesFrom":"MAIS PERCURSOS DE",
        "otherRoutes":"OUTRAS ROTAS CLASSICAS","videoSection":"INSPIRACAO EM VIDEO",
        "watchYoutube":"Ver no YouTube","whatToRide":"O QUE PEDALAR","foodFuel":"COMIDA & COMBUSTIVEL",
        "whereStay":"ONDE FICAR","alsoExplore":"TAMBEM EXPLORAR",
        "planYourTrip":"Obtenha hoteis, rotas e informacao local — gratis",
        "notQuiteRight":"Nao esta bem?","shareWithFriend":"Partilhe esta viagem",
        "sendToFriend":"ENVIAR A UM AMIGO","postOnSocial":"PUBLICAR NAS REDES",
        "groupTrip":"A viajar com um grupo?","groupComingSoon":"Modo grupo — em breve",
        "primaryAirport":"AEROPORTO PRINCIPAL","altAirport":"AEROPORTO ALTERNATIVO",
        "bikeTransport":"TRANSPORTE DE BICICLETA","localKnowledge":"CONHECIMENTO LOCAL",
        "whatCouldGoWrong":"O QUE PODE CORRER MAL","preRide":"PRE-PEDALADA","midRide":"A MEIO",
        "postRide":"POS-PEDALADA","localFuel":"COMBUSTIVEL LOCAL","setAsBase":"Definir como base",
        "day":"Dia","estTime":"Tempo estimado","difficulty":"Dificuldade",
        "distance":"Distancia","elevation":"Elevacao","style":"Estilo","baseTown":"Cidade base",
    },
    "pl": {
        "whyMatched":"DLACZEGO DOPASOWANO","aboutDest":"O TEJ DESTYNACJI","furtherReading":"DALSZA LEKTURA",
        "routesRiding":"TRASY & JAZDA","exploreStrava":"Eksploruj na Stravie","browseKomoot":"Przegladaj na Komoot",
        "whereToStay":"GDZIE NOCOWAC","whyCyclists":"DLACZEGO KOLARZE TU NOCUJA",
        "bikeShopsNearby":"SKLEPY & WYPOZYCZALNIE","yourDailyPlan":"TWOJ DZIENNY PLAN",
        "routeMap":"MAPA TRASY","bestAreaStay":"NAJLEPSZA OKOLICA",
        "pricesApprox":"ceny przyblizne, zweryfikuj przed rezerwacja","viewHotelBtn":"Zobacz hotel",
        "selfCateringOpt":"OPCJA SAMODZIELNEGO GOTOWANIA",
        "outAndBack":"TAM I Z POWROTEM","directions":"WSKAZOWKI OD BAZY","insiderTips":"PORADY INSIDEROW",
        "recommendedBase":"POLECANY HOTEL BAZOWY","moreRidesFrom":"WIECEJ TRAS Z",
        "otherRoutes":"INNE KLASYCZNE TRASY","videoSection":"INSPIRACJA WIDEO",
        "watchYoutube":"Ogladaj na YouTube","whatToRide":"CO JEZDZIC","foodFuel":"JEDZENIE & PALIWO",
        "whereStay":"GDZIE NOCOWAC","alsoExplore":"ODKRYJ ROWNIEZ",
        "planYourTrip":"Dopasowane hotele, trasy i lokalna wiedza — bezplatnie",
        "notQuiteRight":"Nie do konca?","shareWithFriend":"Podziel sie trasa",
        "sendToFriend":"WYSLIJ DO PRZYJACIELA","postOnSocial":"OPUBLIKUJ W MEDIACH",
        "groupTrip":"Jedziesz z grupa?","groupComingSoon":"Tryb grupowy — wkrotce",
        "primaryAirport":"GLOWNE LOTNISKO","altAirport":"ALTERNATYWNE LOTNISKO",
        "bikeTransport":"TRANSPORT ROWERU","localKnowledge":"LOKALNA WIEDZA",
        "whatCouldGoWrong":"CO MOZE POJSC ZLE","preRide":"PRZED JAZDA","midRide":"W TRAKCIE",
        "postRide":"PO JEZDZIE","localFuel":"LOKALNE PALIWO","setAsBase":"Ustaw jako baze",
        "day":"Dzien","estTime":"Szacowany czas","difficulty":"Trudnosc",
        "distance":"Dystans","elevation":"Przewyzszenie","style":"Styl","baseTown":"Miasto bazowe",
    },
    "cs": {
        "whyMatched":"PROC SPAROVANO","aboutDest":"O TOMTO MISTE","furtherReading":"DALSI CTENI",
        "routesRiding":"TRASY & JIZDA","exploreStrava":"Prozkoumat na Strave","browseKomoot":"Prochazet na Komoot",
        "whereToStay":"KDE POBYVAT","whyCyclists":"PROC TU CYKLISTE ZUSTAVAJI",
        "bikeShopsNearby":"OBCHODY & PUJCOVNY","yourDailyPlan":"VAS DENNI PLAN",
        "routeMap":"MAPA TRASY","bestAreaStay":"NEJLEPSI OBLAST",
        "pricesApprox":"priblizne ceny, overuji pred rezervaci","viewHotelBtn":"Zobrazit hotel",
        "selfCateringOpt":"MOZNOST VLASTNIHO STRAVOVANI",
        "outAndBack":"TAM A ZPET","directions":"POKYNY OD ZAKLADNY","insiderTips":"TIPY INSIDERU",
        "recommendedBase":"DOPORUCENY HOTEL","moreRidesFrom":"VICE JIZD Z",
        "otherRoutes":"JINE KLASICKE TRASY","videoSection":"VIDEO INSPIRACE",
        "watchYoutube":"Sledovat na YouTube","whatToRide":"CO JEZDIT","foodFuel":"JIDLO & PALIVO",
        "whereStay":"KDE POBYVAT","alsoExplore":"TAKE PROZKOUMAT",
        "planYourTrip":"Ziskejte hotely, trasy a mistni znalosti — zdarma",
        "notQuiteRight":"Neni to ono?","shareWithFriend":"Sdilejte vylet",
        "sendToFriend":"POSLAT PRITELI","postOnSocial":"ZVEREJNIT NA SITI",
        "groupTrip":"Jedete se skupinou?","groupComingSoon":"Skupinovy rezim — brzy",
        "primaryAirport":"HLAVNI LETISTE","altAirport":"ALTERNATIVNI LETISTE",
        "bikeTransport":"TRANSPORT KOLA","localKnowledge":"MISTNI ZNALOSTI",
        "whatCouldGoWrong":"CO MUZE JIT SPATNE","preRide":"PRED JIZDOU","midRide":"BEHEM JIZDY",
        "postRide":"PO JIZDE","localFuel":"MISTNI PALIVO","setAsBase":"Nastavit jako zakladnu",
        "day":"Den","estTime":"Odhadovany cas","difficulty":"Obtiznost",
        "distance":"Vzdalenost","elevation":"Prevyseni","style":"Styl","baseTown":"Zakladni mesto",
    },
    "da": {
        "whyMatched":"HVORFOR MATCHET","aboutDest":"OM DENNE DESTINATION","furtherReading":"VIDERE LAESNING",
        "routesRiding":"RUTER & CYKLING","exploreStrava":"Udforsk pa Strava","browseKomoot":"Gennemse pa Komoot",
        "whereToStay":"HVOR MAN BOR","whyCyclists":"HVORFOR CYKLISTER BOR HER",
        "bikeShopsNearby":"CYKELFORRETNINGER","yourDailyPlan":"DIN DAGLIGE PLAN",
        "routeMap":"RUTEKORT","bestAreaStay":"BEDSTE OMRADE",
        "pricesApprox":"omtrentlige priser, tjek for booking","viewHotelBtn":"Se hotel",
        "selfCateringOpt":"SELVFORPLEJNING",
        "outAndBack":"TUR-RETUR","directions":"VEJLEDNING FRA BASE","insiderTips":"INSIDER TIPS",
        "recommendedBase":"ANBEFALET BASISHOTEL","moreRidesFrom":"FLERE TURE FRA",
        "otherRoutes":"ANDRE KLASSISKE RUTER","videoSection":"VIDEO INSPIRATION",
        "watchYoutube":"Se pa YouTube","whatToRide":"HVAD MAN CYKLER","foodFuel":"MAD & BRAENDSTOF",
        "whereStay":"HVOR MAN BOR","alsoExplore":"UDFORSK OGSA",
        "planYourTrip":"Fa matchede hoteller og ruter — gratis",
        "notQuiteRight":"Ikke helt rigtigt?","shareWithFriend":"Del denne tur",
        "sendToFriend":"SEND TIL EN VEN","postOnSocial":"POST PA SOCIALE MEDIER",
        "groupTrip":"Rejser med en gruppe?","groupComingSoon":"Gruppetistand — kommer snart",
        "primaryAirport":"PRIMAER LUFTHAVN","altAirport":"ALTERNATIV LUFTHAVN",
        "bikeTransport":"CYKELTRANSPORT","localKnowledge":"LOKAL INSIDERVIDEN",
        "whatCouldGoWrong":"HVAD KAN GA GALT","preRide":"FOR TUREN","midRide":"UNDER TUREN",
        "postRide":"EFTER TUREN","localFuel":"LOKALT BRAENDSTOF","setAsBase":"Angiv som min base",
        "day":"Dag","estTime":"Estimeret tid","difficulty":"Svaerhedsgrad",
        "distance":"Afstand","elevation":"Stigning","style":"Stil","baseTown":"Baseby",
    },
    "sv": {
        "whyMatched":"VARFOR MATCHAD","aboutDest":"OM DENNA DESTINATION","furtherReading":"VIDARE LASNING",
        "routesRiding":"RUTTER & CYKLING","exploreStrava":"Utforska pa Strava","browseKomoot":"Bladddra pa Komoot",
        "whereToStay":"VAR MAN BOR","whyCyclists":"VARFOR CYKLISTER STANNAR HAR",
        "bikeShopsNearby":"CYKELAFFARER","yourDailyPlan":"DIN DAGLIGA PLAN",
        "routeMap":"RUTTKARTA","bestAreaStay":"BASTA OMRADET",
        "pricesApprox":"ungefaerliga priser, kontrollera innan bokning","viewHotelBtn":"Visa hotell",
        "selfCateringOpt":"SJALVHUSHALLNING",
        "outAndBack":"FRAM OCH TILLBAKA","directions":"VAGBESKRIVNING","insiderTips":"INSIDERTIPS",
        "recommendedBase":"REKOMMENDERAT HOTELL","moreRidesFrom":"FLER TURER FRAN",
        "otherRoutes":"ANDRA KLASSISKA RUTTER","videoSection":"VIDEOINSPIRATION",
        "watchYoutube":"Titta pa YouTube","whatToRide":"VAD MAN CYKLAR","foodFuel":"MAT & BRAENSLE",
        "whereStay":"VAR MAN BOR","alsoExplore":"UTFORSKA OCKSA",
        "planYourTrip":"Fa matchade hotell och rutter — gratis",
        "notQuiteRight":"Inte riktigt ratt?","shareWithFriend":"Dela resan",
        "sendToFriend":"SKICKA TILL EN VAN","postOnSocial":"POSTA PA SOCIALA MEDIER",
        "groupTrip":"Reser med en grupp?","groupComingSoon":"Grupplade — kommer snart",
        "primaryAirport":"PRIMAER FLYGPLATS","altAirport":"ALTERNATIV FLYGPLATS",
        "bikeTransport":"CYKELTRANSPORT","localKnowledge":"LOKAL INSIDERKUNSKAP",
        "whatCouldGoWrong":"VAD KAN GA FEL","preRide":"FORE TUREN","midRide":"UNDER TUREN",
        "postRide":"EFTER TUREN","localFuel":"LOKALT BRAENSLE","setAsBase":"Ange som min bas",
        "day":"Dag","estTime":"Beraeknad tid","difficulty":"Svarighetsgrad",
        "distance":"Avstand","elevation":"Hojdmeter","style":"Stil","baseTown":"Basstad",
    },
    "no": {
        "whyMatched":"HVORFOR MATCHET","aboutDest":"OM DENNE DESTINASJONEN","furtherReading":"VIDERE LESING",
        "routesRiding":"RUTER & SYKLING","exploreStrava":"Utforsk pa Strava","browseKomoot":"Bla pa Komoot",
        "whereToStay":"HVOR MAN BOR","whyCyclists":"HVORFOR SYKLISTER BOR HER",
        "bikeShopsNearby":"SYKKELBUTIKKER","yourDailyPlan":"DIN DAGLIGE PLAN",
        "routeMap":"RUTEKART","bestAreaStay":"BESTE OMRADE",
        "pricesApprox":"omtrentlige priser, sjekk for booking","viewHotelBtn":"Se hotell",
        "selfCateringOpt":"SELVFORSYNING",
        "outAndBack":"TUR-RETUR","directions":"VEIBESKRIVELSE","insiderTips":"INSIDER TIPS",
        "recommendedBase":"ANBEFALT BASISHOTELL","moreRidesFrom":"FLERE TURER FRA",
        "otherRoutes":"ANDRE KLASSISKE RUTER","videoSection":"VIDEOINSPIRASON",
        "watchYoutube":"Se pa YouTube","whatToRide":"HVA MAN SYKLER","foodFuel":"MAT & DRIVSTOFF",
        "whereStay":"HVOR MAN BOR","alsoExplore":"UTFORSK OGSA",
        "planYourTrip":"Fa matchede hoteller og ruter — gratis",
        "notQuiteRight":"Ikke helt riktig?","shareWithFriend":"Del turen",
        "sendToFriend":"SEND TIL EN VENN","postOnSocial":"POST PA SOSIALE MEDIER",
        "groupTrip":"Reiser med en gruppe?","groupComingSoon":"Gruppemodus — kommer snart",
        "primaryAirport":"PRIMAER FLYPLASS","altAirport":"ALTERNATIV FLYPLASS",
        "bikeTransport":"SYKKELTRANSPORT","localKnowledge":"LOKAL INSIDERKUNNSKAP",
        "whatCouldGoWrong":"HVA KAN GA GALT","preRide":"FOR TUREN","midRide":"UNDER TUREN",
        "postRide":"ETTER TUREN","localFuel":"LOKALT DRIVSTOFF","setAsBase":"Sett som min base",
        "day":"Dag","estTime":"Estimert tid","difficulty":"Vanskelighetsgrad",
        "distance":"Avstand","elevation":"Stigning","style":"Stil","baseTown":"Baseby",
    },
    "ja": {
        "whyMatched":"マッチした理由","aboutDest":"この目的地について","furtherReading":"さらに読む",
        "routesRiding":"ルートとライド","exploreStrava":"Stravaで探索","browseKomoot":"Komootで閲覧",
        "whereToStay":"宿泊場所","whyCyclists":"サイクリストがここに泊まる理由",
        "bikeShopsNearby":"自転車店とレンタル","yourDailyPlan":"日程",
        "routeMap":"ルートマップ","bestAreaStay":"最適な宿泊エリア",
        "pricesApprox":"概算価格・予約前に確認","viewHotelBtn":"ホテルを見る",
        "selfCateringOpt":"自炊オプション",
        "outAndBack":"往復","directions":"基地からの道順","insiderTips":"インサイダーのヒント",
        "recommendedBase":"おすすめ拠点ホテル","moreRidesFrom":"こちらのルート",
        "otherRoutes":"その他の定番ルート","videoSection":"動画インスピレーション",
        "watchYoutube":"YouTubeで見る","whatToRide":"走るルート","foodFuel":"食事と補給",
        "whereStay":"宿泊場所","alsoExplore":"こちらも探索",
        "planYourTrip":"マッチしたホテルとルートを取得 — 無料",
        "notQuiteRight":"少し違いますか？","shareWithFriend":"友達にシェア",
        "sendToFriend":"友達に送る","postOnSocial":"SNSに投稿",
        "groupTrip":"グループでお出かけですか？","groupComingSoon":"グループモード — 近日公開",
        "primaryAirport":"主要空港","altAirport":"代替空港",
        "bikeTransport":"自転車輸送","localKnowledge":"地元の情報",
        "whatCouldGoWrong":"注意点","preRide":"ライド前","midRide":"ライド中",
        "postRide":"ライド後","localFuel":"現地補給食","setAsBase":"拠点に設定",
        "day":"日","estTime":"推定時間","difficulty":"難易度",
        "distance":"距離","elevation":"獲得標高","style":"スタイル","baseTown":"拠点の町",
    },
    "zh": {
        "whyMatched":"为何匹配","aboutDest":"关于此目的地","furtherReading":"延伸阅读",
        "routesRiding":"路线与骑行","exploreStrava":"在Strava探索","browseKomoot":"在Komoot浏览",
        "whereToStay":"住宿地点","whyCyclists":"为何骑行者选择这里",
        "bikeShopsNearby":"自行车店与租赁","yourDailyPlan":"每日计划",
        "routeMap":"路线地图","bestAreaStay":"最佳住宿区域",
        "pricesApprox":"参考价格·预订前请核实","viewHotelBtn":"查看酒店",
        "selfCateringOpt":"自助住宿选项",
        "outAndBack":"往返路线","directions":"从基地出发方向","insiderTips":"内部人士建议",
        "recommendedBase":"推荐基地酒店","moreRidesFrom":"更多路线",
        "otherRoutes":"其他经典骑行路线","videoSection":"视频灵感",
        "watchYoutube":"在YouTube观看","whatToRide":"骑行路线","foodFuel":"饮食与补给",
        "whereStay":"住宿地点","alsoExplore":"也可探索",
        "planYourTrip":"获取匹配酒店和路线 — 免费",
        "notQuiteRight":"不太合适？","shareWithFriend":"分享此行程",
        "sendToFriend":"发送给朋友","postOnSocial":"发布到社交媒体",
        "groupTrip":"与团队一起旅行？","groupComingSoon":"团队模式 — 即将推出",
        "primaryAirport":"主要机场","altAirport":"备用机场",
        "bikeTransport":"自行车运输","localKnowledge":"本地信息",
        "whatCouldGoWrong":"注意事项","preRide":"骑行前","midRide":"骑行中",
        "postRide":"骑行后","localFuel":"当地补给","setAsBase":"设为基地",
        "day":"天","estTime":"预计时间","difficulty":"难度",
        "distance":"距离","elevation":"爬升","style":"风格","baseTown":"基地城镇",
    },
}

# Insert keys before the closing }, of each language block
LANG_ANCHORS = {
    "en": 'about:"About"',
    "nl": 'about:"Over"',
    "pt": 'about:"Sobre"',
    "pl": 'about:"O nas"',
    "cs": 'about:"O nas"',
    "da": 'about:"Om"',
    "sv": 'about:"Om"',
    "no": 'about:"Om"',
    "ja": 'about:"\u306b\u3064\u3044\u3066"',
    "zh": 'about:"\u5173\u4e8e"',
}

# For da/sv/no they all use "Om" - need to find the right one
# Find them in order of appearance
om_indices = []
search_from = 0
for _ in range(5):
    idx = src.find('about:"Om"', search_from)
    if idx == -1:
        break
    om_indices.append(idx)
    search_from = idx + 1

print(f"Found {len(om_indices)} 'about:Om' occurrences")

for lang, keys in NEW_KEYS.items():
    anchor = LANG_ANCHORS[lang]
    
    if lang in ("da", "sv", "no") and om_indices:
        lang_list = ["da", "sv", "no"]
        idx_in_list = lang_list.index(lang)
        if idx_in_list < len(om_indices):
            pos = om_indices[idx_in_list]
            key_str = "," + ",".join(f'{k}:"{v}"' for k, v in keys.items())
            src = src[:pos + len(anchor)] + key_str + src[pos + len(anchor):]
            # Update remaining om_indices
            shift = len(key_str)
            om_indices = [i + shift if i > pos else i for i in om_indices]
            print(f"  ✓ {lang}: added {len(keys)} keys")
            continue

    if anchor not in src:
        print(f"  ⚠  {lang}: anchor not found")
        continue

    key_str = "," + ",".join(f'{k}:"{v}"' for k, v in keys.items())
    src = src.replace(anchor, anchor + key_str, 1)
    print(f"  ✓ {lang}: added {len(keys)} keys")

with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print("\n✅ Done. Run: npm run dev")
