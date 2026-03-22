#!/usr/bin/env python3
"""
Fixes i18n - adds missing keys to all 10 languages and replaces
hardcoded English strings in JSX with i18n.keyName references.

Run from project root: python3 fix_i18n.py
"""
import re, shutil

SRC = "src/App.jsx"
BAK = "src/App.jsx.pre-i18n"
shutil.copy(SRC, BAK)

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ══════════════════════════════════════════════════════════════════
# STEP 1: Add missing keys to ALL 10 language objects
# We add them to the English object first, then mirror to all others
# ══════════════════════════════════════════════════════════════════

# New keys to add (English values — other languages get translated values below)
NEW_KEYS_EN = {
    # Results page
    "whyMatched":       "WHY MATCHED",
    "aboutDest":        "ABOUT THIS DESTINATION",
    "furtherReading":   "FURTHER READING",
    "routesRiding":     "ROUTES & RIDING",
    "exploreStrava":    "Explore on Strava",
    "browseKomoot":     "Browse on Komoot",
    "whereToStay":      "WHERE TO STAY",
    "whyCyclists":      "WHY CYCLISTS STAY HERE",
    "bikeShopsNearby":  "BIKE SHOPS & HIRE",
    "yourDailyPlan":    "YOUR DAILY PLAN",
    "routeMap":         "ROUTE MAP",
    "bestAreaStay":     "BEST AREA TO STAY",
    "pricesApprox":     "prices approx · verify before booking",
    "viewHotelBtn":     "View hotel",
    "selfCateringOpt":  "SELF-CATERING OPTION",
    "notThisOne":       "Not this one ✕",
    "saveHeart":        "♡ Save",
    "savedHeart":       "♥ Saved",
    "bestMonthsBtn":    "Best months",
    "closeBtn":         "Close",
    # Route pages
    "outAndBack":       "OUT-AND-BACK",
    "directions":       "DIRECTIONS FROM BASE",
    "insiderTips":      "INSIDER TIPS",
    "recommendedBase":  "RECOMMENDED BASE HOTEL",
    "moreRidesFrom":    "MORE RIDES FROM",
    "otherRoutes":      "OTHER CLASSIC CYCLING ROUTES",
    "videoSection":     "VIDEO INSPIRATION",
    "watchYoutube":     "Watch on YouTube",
    # Destination pages
    "whatToRide":       "WHAT TO RIDE",
    "foodFuel":         "FOOD & FUEL",
    "whereStay":        "WHERE TO STAY",
    "alsoExplore":      "ALSO EXPLORE",
    "planYourTrip":     "Get matched hotels, routes & local intel — free",
    # Share strip
    "notQuiteRight":    "Not quite right?",
    "shareWithFriend":  "Share this trip with a friend",
    "sendToFriend":     "SEND TO A FRIEND",
    "postOnSocial":     "POST ON SOCIAL",
    "groupTrip":        "Going with a group of mixed abilities?",
    "groupComingSoon":  "Group mode — coming soon",
    "gpxNote":          "GPX ROUTES",
    # Intel tabs
    "primaryAirport":   "PRIMARY AIRPORT",
    "altAirport":       "ALTERNATIVE AIRPORT",
    "bikeTransport":    "BIKE TRANSPORT",
    "localKnowledge":   "LOCAL INSIDER KNOWLEDGE",
    "whatCouldGoWrong": "WHAT COULD GO WRONG",
    "preRide":          "PRE-RIDE",
    "midRide":          "MID-RIDE",
    "postRide":         "POST-RIDE",
    "localFuel":        "LOCAL FUEL",
    # Map
    "mapRouteStart":    "ROUTE MAP",
    "setAsBase":        "⭐ Set as my base",
    "yourBase":         "Your base",
    # Scoring
    "strongMatch":      "Strong match",
    "greatMatch":       "Great match",
    "goodMatch":        "Good match",
    # Days
    "day":              "Day",
    "estTime":          "Est. time",
    "difficulty":       "Difficulty",
    "distance":         "Distance",
    "elevation":        "Elevation",
    "style":            "Style",
    "baseTown":         "Base town",
}

# Translations for all 9 non-English languages
TRANSLATIONS = {
    "nl": {
        "whyMatched":"WAAROM GEMATCHT","aboutDest":"OVER DEZE BESTEMMING","furtherReading":"MEER LEZEN",
        "routesRiding":"ROUTES & RIJDEN","exploreStrava":"Verkennen op Strava","browseKomoot":"Bekijken op Komoot",
        "whereToStay":"WAAR TE VERBLIJVEN","whyCyclists":"WAAROM FIETSERS HIER BLIJVEN",
        "bikeShopsNearby":"FIETSWINKELS & VERHUUR","yourDailyPlan":"UW DAGELIJKSE PLANNING",
        "routeMap":"ROUTEKAART","bestAreaStay":"BESTE VERBLIJFSGEBIED",
        "pricesApprox":"prijzen indicatief · verifieer voor boeking","viewHotelBtn":"Hotel bekijken",
        "selfCateringOpt":"ZELFVERZORGING OPTIE","notThisOne":"Niet deze ✕",
        "saveHeart":"♡ Opslaan","savedHeart":"♥ Opgeslagen","bestMonthsBtn":"Beste maanden","closeBtn":"Sluiten",
        "outAndBack":"HEEN EN TERUG","directions":"AANWIJZINGEN VANAF BASIS","insiderTips":"INSIDER TIPS",
        "recommendedBase":"AANBEVOLEN BASISHOTEL","moreRidesFrom":"MEER RITTEN VANUIT",
        "otherRoutes":"ANDERE KLASSIEKE FIETSROUTES","videoSection":"VIDEO INSPIRATIE",
        "watchYoutube":"Bekijk op YouTube","whatToRide":"WAT TE RIJDEN","foodFuel":"ETEN & BRANDSTOF",
        "whereStay":"WAAR TE VERBLIJVEN","alsoExplore":"OOK ONTDEKKEN",
        "planYourTrip":"Krijg matched hotels, routes & lokale informatie — gratis",
        "notQuiteRight":"Niet helemaal goed?","shareWithFriend":"Deel deze trip met een vriend",
        "sendToFriend":"STUUR NAAR EEN VRIEND","postOnSocial":"PLAATSEN OP SOCIAL MEDIA",
        "groupTrip":"Gaat u met een groep van gemengde niveaus?","groupComingSoon":"Groepsmodus — binnenkort",
        "gpxNote":"GPX ROUTES","primaryAirport":"PRIMAIRE LUCHTHAVEN","altAirport":"ALTERNATIEVE LUCHTHAVEN",
        "bikeTransport":"FIETSTRANSPORT","localKnowledge":"LOKALE INSIDER KENNIS",
        "whatCouldGoWrong":"WAT KAN ER MISGAAN","preRide":"VOOR DE RIT","midRide":"TIJDENS DE RIT",
        "postRide":"NA DE RIT","localFuel":"LOKALE BRANDSTOF","mapRouteStart":"ROUTEKAART",
        "setAsBase":"⭐ Instellen als mijn basis","yourBase":"Uw basis",
        "strongMatch":"Sterke match","greatMatch":"Goede match","goodMatch":"Match",
        "day":"Dag","estTime":"Geschatte tijd","difficulty":"Moeilijkheid",
        "distance":"Afstand","elevation":"Hoogteverschil","style":"Stijl","baseTown":"Basisstad",
    },
    "pt": {
        "whyMatched":"PORQUÊ CORRESPONDIDO","aboutDest":"SOBRE ESTE DESTINO","furtherReading":"LEITURA ADICIONAL",
        "routesRiding":"ROTAS & CICLISMO","exploreStrava":"Explorar no Strava","browseKomoot":"Ver no Komoot",
        "whereToStay":"ONDE FICAR","whyCyclists":"PORQUE OS CICLISTAS FICAM AQUI",
        "bikeShopsNearby":"LOJAS & ALUGUER DE BICICLETAS","yourDailyPlan":"O SEU PLANO DIÁRIO",
        "routeMap":"MAPA DE ROTA","bestAreaStay":"MELHOR ÁREA PARA FICAR",
        "pricesApprox":"preços aproximados · verifique antes de reservar","viewHotelBtn":"Ver hotel",
        "selfCateringOpt":"OPÇÃO DE ALOJAMENTO PRÓPRIO","notThisOne":"Não este ✕",
        "saveHeart":"♡ Guardar","savedHeart":"♥ Guardado","bestMonthsBtn":"Melhores meses","closeBtn":"Fechar",
        "outAndBack":"IDA E VOLTA","directions":"DIREÇÕES A PARTIR DA BASE","insiderTips":"DICAS DE INSIDER",
        "recommendedBase":"HOTEL BASE RECOMENDADO","moreRidesFrom":"MAIS PERCURSOS DE",
        "otherRoutes":"OUTRAS ROTAS CLÁSSICAS","videoSection":"INSPIRAÇÃO EM VÍDEO",
        "watchYoutube":"Ver no YouTube","whatToRide":"O QUE PEDALAR","foodFuel":"COMIDA & COMBUSTÍVEL",
        "whereStay":"ONDE FICAR","alsoExplore":"TAMBÉM EXPLORAR",
        "planYourTrip":"Obtenha hotéis, rotas e informação local — grátis",
        "notQuiteRight":"Não está bem?","shareWithFriend":"Partilhe esta viagem com um amigo",
        "sendToFriend":"ENVIAR A UM AMIGO","postOnSocial":"PUBLICAR NAS REDES SOCIAIS",
        "groupTrip":"A viajar com um grupo de níveis mistos?","groupComingSoon":"Modo grupo — em breve",
        "gpxNote":"ROTAS GPX","primaryAirport":"AEROPORTO PRINCIPAL","altAirport":"AEROPORTO ALTERNATIVO",
        "bikeTransport":"TRANSPORTE DE BICICLETA","localKnowledge":"CONHECIMENTO LOCAL",
        "whatCouldGoWrong":"O QUE PODE CORRER MAL","preRide":"PRÉ-PEDALADA","midRide":"A MEIO DA PEDALADA",
        "postRide":"PÓS-PEDALADA","localFuel":"COMBUSTÍVEL LOCAL","mapRouteStart":"MAPA DE ROTA",
        "setAsBase":"⭐ Definir como minha base","yourBase":"A sua base",
        "strongMatch":"Forte correspondência","greatMatch":"Boa correspondência","goodMatch":"Correspondência",
        "day":"Dia","estTime":"Tempo estimado","difficulty":"Dificuldade",
        "distance":"Distância","elevation":"Elevação","style":"Estilo","baseTown":"Cidade base",
    },
    "pl": {
        "whyMatched":"DLACZEGO DOPASOWANO","aboutDest":"O TEJ DESTYNACJI","furtherReading":"DALSZA LEKTURA",
        "routesRiding":"TRASY & JAZDA","exploreStrava":"Eksploruj na Stravie","browseKomoot":"Przeglądaj na Komoot",
        "whereToStay":"GDZIE NOCOWAĆ","whyCyclists":"DLACZEGO KOLARZE TU NOCUJĄ",
        "bikeShopsNearby":"SKLEPY & WYPOŻYCZALNIE","yourDailyPlan":"TWÓJ DZIENNY PLAN",
        "routeMap":"MAPA TRASY","bestAreaStay":"NAJLEPSZA OKOLICA DO NOCLEGU",
        "pricesApprox":"ceny przybliżone · zweryfikuj przed rezerwacją","viewHotelBtn":"Zobacz hotel",
        "selfCateringOpt":"OPCJA SAMODZIELNEGO GOTOWANIA","notThisOne":"Nie to ✕",
        "saveHeart":"♡ Zapisz","savedHeart":"♥ Zapisano","bestMonthsBtn":"Najlepsze miesiące","closeBtn":"Zamknij",
        "outAndBack":"TAM I Z POWROTEM","directions":"WSKAZÓWKI OD BAZY","insiderTips":"PORADY INSIDERÓW",
        "recommendedBase":"POLECANY HOTEL BAZOWY","moreRidesFrom":"WIĘCEJ TRAS Z",
        "otherRoutes":"INNE KLASYCZNE TRASY","videoSection":"INSPIRACJA WIDEO",
        "watchYoutube":"Oglądaj na YouTube","whatToRide":"CO JEŹDZIĆ","foodFuel":"JEDZENIE & PALIWO",
        "whereStay":"GDZIE NOCOWAĆ","alsoExplore":"ODKRYJ RÓWNIEŻ",
        "planYourTrip":"Dopasowane hotele, trasy i lokalna wiedza — bezpłatnie",
        "notQuiteRight":"Nie do końca?","shareWithFriend":"Podziel się tą trasą z przyjacielem",
        "sendToFriend":"WYŚLIJ DO PRZYJACIELA","postOnSocial":"OPUBLIKUJ W MEDIACH SPOŁECZNOŚCIOWYCH",
        "groupTrip":"Jedziesz z grupą o różnych poziomach?","groupComingSoon":"Tryb grupowy — wkrótce",
        "gpxNote":"TRASY GPX","primaryAirport":"GŁÓWNE LOTNISKO","altAirport":"ALTERNATYWNE LOTNISKO",
        "bikeTransport":"TRANSPORT ROWERU","localKnowledge":"LOKALNA WIEDZA INSIDERÓW",
        "whatCouldGoWrong":"CO MOŻE PÓJŚĆ ŹLE","preRide":"PRZED JAZDĄ","midRide":"W TRAKCIE JAZDY",
        "postRide":"PO JEŹDZIE","localFuel":"LOKALNE PALIWO","mapRouteStart":"MAPA TRASY",
        "setAsBase":"⭐ Ustaw jako moją bazę","yourBase":"Twoja baza",
        "strongMatch":"Silne dopasowanie","greatMatch":"Dobre dopasowanie","goodMatch":"Dopasowanie",
        "day":"Dzień","estTime":"Szacowany czas","difficulty":"Trudność",
        "distance":"Dystans","elevation":"Przewyższenie","style":"Styl","baseTown":"Miasto bazowe",
    },
    "cs": {
        "whyMatched":"PROČ SPÁROVÁNO","aboutDest":"O TOMTO MÍSTĚ","furtherReading":"DALŠÍ ČTENÍ",
        "routesRiding":"TRASY & JÍZDA","exploreStrava":"Prozkoumat na Stravě","browseKomoot":"Procházet na Komoot",
        "whereToStay":"KDE POBÝVAT","whyCyclists":"PROČ TU CYKLISTÉ ZŮSTÁVAJÍ",
        "bikeShopsNearby":"OBCHODY & PŮJČOVNY KOL","yourDailyPlan":"VÁŠ DENNÍ PLÁN",
        "routeMap":"MAPA TRASY","bestAreaStay":"NEJLEPŠÍ OBLAST PRO POBYT",
        "pricesApprox":"přibližné ceny · ověřte před rezervací","viewHotelBtn":"Zobrazit hotel",
        "selfCateringOpt":"MOŽNOST VLASTNÍHO STRAVOVÁNÍ","notThisOne":"Ne toto ✕",
        "saveHeart":"♡ Uložit","savedHeart":"♥ Uloženo","bestMonthsBtn":"Nejlepší měsíce","closeBtn":"Zavřít",
        "outAndBack":"TAM A ZPĚT","directions":"POKYNY OD ZÁKLADNY","insiderTips":"TIPY INSIDERŮ",
        "recommendedBase":"DOPORUČENÝ ZÁKLADNÍ HOTEL","moreRidesFrom":"VÍCE JÍZD Z",
        "otherRoutes":"JINÉ KLASICKÉ TRASY","videoSection":"VIDEO INSPIRACE",
        "watchYoutube":"Sledovat na YouTube","whatToRide":"CO JEZDIT","foodFuel":"JÍDLO & PALIVO",
        "whereStay":"KDE POBÝVAT","alsoExplore":"TAKÉ PROZKOUMAT",
        "planYourTrip":"Získejte hotely, trasy a místní znalosti — zdarma",
        "notQuiteRight":"Není to úplně ono?","shareWithFriend":"Sdílejte výlet s přítelem",
        "sendToFriend":"POSLAT PŘÍTELI","postOnSocial":"ZVEŘEJNIT NA SOCIÁLNÍCH SÍTÍCH",
        "groupTrip":"Jedete se skupinou různých úrovní?","groupComingSoon":"Skupinový režim — brzy",
        "gpxNote":"GPX TRASY","primaryAirport":"HLAVNÍ LETIŠTĚ","altAirport":"ALTERNATIVNÍ LETIŠTĚ",
        "bikeTransport":"TRANSPORT KOLA","localKnowledge":"MÍSTNÍ ZNALOSTI INSIDERŮ",
        "whatCouldGoWrong":"CO MŮŽE JÍT ŠPATNĚ","preRide":"PŘED JÍZDOU","midRide":"BĚHEM JÍZDY",
        "postRide":"PO JÍZDĚ","localFuel":"MÍSTNÍ PALIVO","mapRouteStart":"MAPA TRASY",
        "setAsBase":"⭐ Nastavit jako základnu","yourBase":"Vaše základna",
        "strongMatch":"Silná shoda","greatMatch":"Dobrá shoda","goodMatch":"Shoda",
        "day":"Den","estTime":"Odhadovaný čas","difficulty":"Obtížnost",
        "distance":"Vzdálenost","elevation":"Převýšení","style":"Styl","baseTown":"Základní město",
    },
    "da": {
        "whyMatched":"HVORFOR MATCHET","aboutDest":"OM DENNE DESTINATION","furtherReading":"VIDERE LÆSNING",
        "routesRiding":"RUTER & CYKLING","exploreStrava":"Udforsk på Strava","browseKomoot":"Gennemse på Komoot",
        "whereToStay":"HVOR MAN OPHOLDER SIG","whyCyclists":"HVORFOR CYKLISTER BOR HER",
        "bikeShopsNearby":"CYKELFORRETNINGER & UDLEJNING","yourDailyPlan":"DIN DAGLIGE PLAN",
        "routeMap":"RUTEKORT","bestAreaStay":"BEDSTE OMRÅDE AT BO",
        "pricesApprox":"omtrentlige priser · tjek før booking","viewHotelBtn":"Se hotel",
        "selfCateringOpt":"SELVFORPLEJNING MULIGHED","notThisOne":"Ikke denne ✕",
        "saveHeart":"♡ Gem","savedHeart":"♥ Gemt","bestMonthsBtn":"Bedste måneder","closeBtn":"Luk",
        "outAndBack":"TUR-RETUR","directions":"VEJLEDNING FRA BASE","insiderTips":"INSIDER TIPS",
        "recommendedBase":"ANBEFALET BASISHOTEL","moreRidesFrom":"FLERE TURE FRA",
        "otherRoutes":"ANDRE KLASSISKE RUTER","videoSection":"VIDEO INSPIRATION",
        "watchYoutube":"Se på YouTube","whatToRide":"HVAD MAN CYKLER","foodFuel":"MAD & BRÆNDSTOF",
        "whereStay":"HVOR MAN OPHOLDER SIG","alsoExplore":"UDFORSK OGSÅ",
        "planYourTrip":"Få matchede hoteller, ruter og lokal viden — gratis",
        "notQuiteRight":"Ikke helt rigtigt?","shareWithFriend":"Del denne tur med en ven",
        "sendToFriend":"SEND TIL EN VEN","postOnSocial":"POST PÅ SOCIALE MEDIER",
        "groupTrip":"Rejser du med en gruppe af blandede niveauer?","groupComingSoon":"Gruppetilstand — kommer snart",
        "gpxNote":"GPX RUTER","primaryAirport":"PRIMÆR LUFTHAVN","altAirport":"ALTERNATIV LUFTHAVN",
        "bikeTransport":"CYKELTRANSPORT","localKnowledge":"LOKAL INSIDERVIDEN",
        "whatCouldGoWrong":"HVAD KAN GÅ GALT","preRide":"FØR TUREN","midRide":"UNDER TUREN",
        "postRide":"EFTER TUREN","localFuel":"LOKALT BRÆNDSTOF","mapRouteStart":"RUTEKORT",
        "setAsBase":"⭐ Angiv som min base","yourBase":"Din base",
        "strongMatch":"Stærkt match","greatMatch":"Godt match","goodMatch":"Match",
        "day":"Dag","estTime":"Estimeret tid","difficulty":"Sværhedsgrad",
        "distance":"Afstand","elevation":"Stigning","style":"Stil","baseTown":"Baseby",
    },
    "sv": {
        "whyMatched":"VARFÖR MATCHAD","aboutDest":"OM DENNA DESTINATION","furtherReading":"VIDARE LÄSNING",
        "routesRiding":"RUTTER & CYKLING","exploreStrava":"Utforska på Strava","browseKomoot":"Bläddra på Komoot",
        "whereToStay":"VAR MAN BOFAR","whyCyclists":"VARFÖR CYKLISTER STANNAR HÄR",
        "bikeShopsNearby":"CYKELAFFÄRER & UTHYRNING","yourDailyPlan":"DIN DAGLIGA PLAN",
        "routeMap":"RUTTKARTA","bestAreaStay":"BÄSTA OMRÅDET ATT BO",
        "pricesApprox":"ungefärliga priser · kontrollera innan bokning","viewHotelBtn":"Visa hotell",
        "selfCateringOpt":"SJÄLVHUSHÅLLNINGSALTERNATIV","notThisOne":"Inte denna ✕",
        "saveHeart":"♡ Spara","savedHeart":"♥ Sparad","bestMonthsBtn":"Bästa månader","closeBtn":"Stäng",
        "outAndBack":"FRAM OCH TILLBAKA","directions":"VÄGBESKRIVNING FRÅN BAS","insiderTips":"INSIDERTIPS",
        "recommendedBase":"REKOMMENDERAT BASHOTELL","moreRidesFrom":"FLER TURER FRÅN",
        "otherRoutes":"ANDRA KLASSISKA RUTTER","videoSection":"VIDEOINSPIRATION",
        "watchYoutube":"Titta på YouTube","whatToRide":"VAD MAN CYKLAR","foodFuel":"MAT & BRÄNSLE",
        "whereStay":"VAR MAN BOFAR","alsoExplore":"UTFORSKA OCKSÅ",
        "planYourTrip":"Få matchade hotell, rutter och lokal kunskap — gratis",
        "notQuiteRight":"Inte riktigt rätt?","shareWithFriend":"Dela den här resan med en vän",
        "sendToFriend":"SKICKA TILL EN VÄN","postOnSocial":"POSTA PÅ SOCIALA MEDIER",
        "groupTrip":"Reser du med en grupp på blandade nivåer?","groupComingSoon":"Gruppläge — kommer snart",
        "gpxNote":"GPX-RUTTER","primaryAirport":"PRIMÄR FLYGPLATS","altAirport":"ALTERNATIV FLYGPLATS",
        "bikeTransport":"CYKELTRANSPORT","localKnowledge":"LOKAL INSIDERKUNSKAP",
        "whatCouldGoWrong":"VAD KAN GÅ FEL","preRide":"FÖRE TUREN","midRide":"UNDER TUREN",
        "postRide":"EFTER TUREN","localFuel":"LOKALT BRÄNSLE","mapRouteStart":"RUTTKARTA",
        "setAsBase":"⭐ Ange som min bas","yourBase":"Din bas",
        "strongMatch":"Stark matchning","greatMatch":"Bra matchning","goodMatch":"Matchning",
        "day":"Dag","estTime":"Beräknad tid","difficulty":"Svårighetsgrad",
        "distance":"Avstånd","elevation":"Höjdmeter","style":"Stil","baseTown":"Basstad",
    },
    "no": {
        "whyMatched":"HVORFOR MATCHET","aboutDest":"OM DENNE DESTINASJONEN","furtherReading":"VIDERE LESING",
        "routesRiding":"RUTER & SYKLING","exploreStrava":"Utforsk på Strava","browseKomoot":"Bla på Komoot",
        "whereToStay":"HVOR MAN OPPHOLDER SEG","whyCyclists":"HVORFOR SYKLISTER BOR HER",
        "bikeShopsNearby":"SYKKELBUTIKKER & UTLEIE","yourDailyPlan":"DIN DAGLIGE PLAN",
        "routeMap":"RUTEKART","bestAreaStay":"BESTE OMRÅDE Å BO",
        "pricesApprox":"omtrentlige priser · sjekk før booking","viewHotelBtn":"Se hotell",
        "selfCateringOpt":"SELVFORSYNING ALTERNATIV","notThisOne":"Ikke denne ✕",
        "saveHeart":"♡ Lagre","savedHeart":"♥ Lagret","bestMonthsBtn":"Beste måneder","closeBtn":"Lukk",
        "outAndBack":"TUR-RETUR","directions":"VEIBESKRIVELSE FRA BASE","insiderTips":"INSIDER TIPS",
        "recommendedBase":"ANBEFALT BASISHOTELL","moreRidesFrom":"FLERE TURER FRA",
        "otherRoutes":"ANDRE KLASSISKE RUTER","videoSection":"VIDEOINSPIRASON",
        "watchYoutube":"Se på YouTube","whatToRide":"HVA MAN SYKLER","foodFuel":"MAT & DRIVSTOFF",
        "whereStay":"HVOR MAN OPPHOLDER SEG","alsoExplore":"UTFORSK OGSÅ",
        "planYourTrip":"Få matchede hoteller, ruter og lokal kunnskap — gratis",
        "notQuiteRight":"Ikke helt riktig?","shareWithFriend":"Del denne turen med en venn",
        "sendToFriend":"SEND TIL EN VENN","postOnSocial":"POST PÅ SOSIALE MEDIER",
        "groupTrip":"Reiser du med en gruppe av blandede nivåer?","groupComingSoon":"Gruppemodus — kommer snart",
        "gpxNote":"GPX-RUTER","primaryAirport":"PRIMÆR FLYPLASS","altAirport":"ALTERNATIV FLYPLASS",
        "bikeTransport":"SYKKELTRANSPORT","localKnowledge":"LOKAL INSIDERKUNNSKAP",
        "whatCouldGoWrong":"HVA KAN GÅ GALT","preRide":"FØR TUREN","midRide":"UNDER TUREN",
        "postRide":"ETTER TUREN","localFuel":"LOKALT DRIVSTOFF","mapRouteStart":"RUTEKART",
        "setAsBase":"⭐ Sett som min base","yourBase":"Din base",
        "strongMatch":"Sterkt treff","greatMatch":"Godt treff","goodMatch":"Treff",
        "day":"Dag","estTime":"Estimert tid","difficulty":"Vanskelighetsgrad",
        "distance":"Avstand","elevation":"Stigning","style":"Stil","baseTown":"Baseby",
    },
    "ja": {
        "whyMatched":"マッチした理由","aboutDest":"この目的地について","furtherReading":"さらに読む",
        "routesRiding":"ルート＆ライド","exploreStrava":"Stravaで探索","browseKomoot":"Komootで閲覧",
        "whereToStay":"宿泊場所","whyCyclists":"サイクリストがここに泊まる理由",
        "bikeShopsNearby":"自転車店＆レンタル","yourDailyPlan":"あなたの日程",
        "routeMap":"ルートマップ","bestAreaStay":"最適な宿泊エリア",
        "pricesApprox":"概算価格・予約前に確認","viewHotelBtn":"ホテルを見る",
        "selfCateringOpt":"自炊オプション","notThisOne":"これは違う ✕",
        "saveHeart":"♡ 保存","savedHeart":"♥ 保存済み","bestMonthsBtn":"ベストシーズン","closeBtn":"閉じる",
        "outAndBack":"往復","directions":"基地からの道順","insiderTips":"インサイダーのヒント",
        "recommendedBase":"おすすめ拠点ホテル","moreRidesFrom":"こちらのルート",
        "otherRoutes":"その他の定番ルート","videoSection":"動画インスピレーション",
        "watchYoutube":"YouTubeで見る","whatToRide":"走るルート","foodFuel":"食事＆補給",
        "whereStay":"宿泊場所","alsoExplore":"こちらも探索",
        "planYourTrip":"マッチしたホテル・ルート・現地情報を取得 — 無料",
        "notQuiteRight":"少し違いますか？","shareWithFriend":"友達にこの旅をシェア",
        "sendToFriend":"友達に送る","postOnSocial":"SNSに投稿",
        "groupTrip":"混合レベルのグループでお出かけですか？","groupComingSoon":"グループモード — 近日公開",
        "gpxNote":"GPXルート","primaryAirport":"主要空港","altAirport":"代替空港",
        "bikeTransport":"自転車輸送","localKnowledge":"地元のインサイダー情報",
        "whatCouldGoWrong":"注意点","preRide":"ライド前","midRide":"ライド中",
        "postRide":"ライド後","localFuel":"現地補給食","mapRouteStart":"ルートマップ",
        "setAsBase":"⭐ 拠点に設定","yourBase":"あなたの拠点",
        "strongMatch":"強いマッチ","greatMatch":"良いマッチ","goodMatch":"マッチ",
        "day":"日","estTime":"推定時間","difficulty":"難易度",
        "distance":"距離","elevation":"獲得標高","style":"スタイル","baseTown":"拠点の町",
    },
    "zh": {
        "whyMatched":"为何匹配","aboutDest":"关于此目的地","furtherReading":"延伸阅读",
        "routesRiding":"路线与骑行","exploreStrava":"在Strava探索","browseKomoot":"在Komoot浏览",
        "whereToStay":"住宿地点","whyCyclists":"为何骑行者选择这里",
        "bikeShopsNearby":"自行车店与租赁","yourDailyPlan":"您的每日计划",
        "routeMap":"路线地图","bestAreaStay":"最佳住宿区域",
        "pricesApprox":"参考价格·预订前请核实","viewHotelBtn":"查看酒店",
        "selfCateringOpt":"自助住宿选项","notThisOne":"不是这个 ✕",
        "saveHeart":"♡ 收藏","savedHeart":"♥ 已收藏","bestMonthsBtn":"最佳月份","closeBtn":"关闭",
        "outAndBack":"往返路线","directions":"从基地出发方向","insiderTips":"内部人士建议",
        "recommendedBase":"推荐基地酒店","moreRidesFrom":"更多路线",
        "otherRoutes":"其他经典骑行路线","videoSection":"视频灵感",
        "watchYoutube":"在YouTube观看","whatToRide":"骑行路线","foodFuel":"饮食与补给",
        "whereStay":"住宿地点","alsoExplore":"也可探索",
        "planYourTrip":"获取匹配酒店、路线和本地信息 — 免费",
        "notQuiteRight":"不太合适？","shareWithFriend":"与朋友分享此行程",
        "sendToFriend":"发送给朋友","postOnSocial":"发布到社交媒体",
        "groupTrip":"与混合水平的团队一起旅行？","groupComingSoon":"团队模式 — 即将推出",
        "gpxNote":"GPX路线","primaryAirport":"主要机场","altAirport":"备用机场",
        "bikeTransport":"自行车运输","localKnowledge":"本地内部信息",
        "whatCouldGoWrong":"注意事项","preRide":"骑行前","midRide":"骑行中",
        "postRide":"骑行后","localFuel":"当地补给","mapRouteStart":"路线地图",
        "setAsBase":"⭐ 设为我的基地","yourBase":"您的基地",
        "strongMatch":"强匹配","greatMatch":"好匹配","goodMatch":"匹配",
        "day":"天","estTime":"预计时间","difficulty":"难度",
        "distance":"距离","elevation":"爬升","style":"风格","baseTown":"基地城镇",
    },
}

# ── Insert new keys into each language object in T ──────────────────────────

def add_keys_to_lang(src, lang_code, new_keys):
    """Add new_keys dict to the language object T.{lang_code} in src."""
    # Find the language object — look for en:{ or nl:{ etc
    # The T object structure is: T={ en:{...}, nl:{...}, ... }
    
    # Build the key string to insert
    key_str = ""
    for k, v in new_keys.items():
        # Escape any single quotes in the value
        v_escaped = v.replace("'", "\\'")
        key_str += f"    {k}:'{v_escaped}',"
    key_str += "\n"
    
    # Find the language section — look for pattern like "en:{" at start
    # The last key in each lang object ends with "}, " before next lang
    # Strategy: find "about:'About'" (last key we know exists) and insert after
    
    # Find the closing of this language's object
    # Look for the lang code followed by :{
    lang_pattern = rf"\b{lang_code}:\{{([^}}]|(?:\{{[^}}]*\}}))*\}}"
    
    return src  # placeholder — we'll use a different approach below


# Better approach: find each language's last known key and insert after it
LAST_KNOWN_KEYS = {
    "en": "about:\"About\"",
    "nl": "about:\"Over\"",
    "pt": "about:\"Sobre\"",
    "pl": "about:\"O nas\"",
    "cs": "about:\"O nás\"",
    "da": "about:\"Om\"",
    "sv": "about:\"Om\"",
    "no": "about:\"Om\"",
    "ja": "about:\"について\"",
    "zh": "about:\"关于\"",
}

# For English, add all NEW_KEYS_EN
def build_key_additions(keys_dict):
    lines = []
    for k, v in keys_dict.items():
        v2 = v.replace('"', '\\"')
        lines.append(f'    {k}:"{v2}"')
    return ",\n".join(lines) + ","

en_additions = build_key_additions(NEW_KEYS_EN)

anchor = LAST_KNOWN_KEYS["en"]
if anchor in src:
    src = src.replace(anchor, anchor + "\n" + en_additions, 1)
    changes.append(f"Added {len(NEW_KEYS_EN)} new keys to English (en)")
else:
    print(f"⚠  Could not find English anchor: {anchor}")

# For other languages
for lang_code, translations in TRANSLATIONS.items():
    anchor = LAST_KNOWN_KEYS.get(lang_code)
    if not anchor or anchor not in src:
        print(f"⚠  Could not find anchor for {lang_code}")
        continue
    additions = build_key_additions(translations)
    src = src.replace(anchor, anchor + "\n" + additions, 1)
    changes.append(f"Added {len(translations)} keys to {lang_code}")


# ══════════════════════════════════════════════════════════════════
# STEP 2: Replace hardcoded English strings in JSX with i18n refs
# ══════════════════════════════════════════════════════════════════

replacements = [
    # Results page labels
    ('"WHY MATCHED:"',             '{i18n.whyMatched+":"}'),
    ('"ABOUT THIS DESTINATION"',   '{i18n.aboutDest}'),
    ('"FURTHER READING"',          '{i18n.furtherReading}'),
    ('"ROUTES & RIDING"',          '{i18n.routesRiding}'),
    ('"Explore on Strava"',        '{i18n.exploreStrava}'),
    ('"Browse on Komoot"',         '{i18n.browseKomoot}'),
    ('"WHERE TO STAY"',            '{i18n.whereToStay}'),
    ('"WHY CYCLISTS STAY HERE"',   '{i18n.whyCyclists}'),
    ('"BIKE SHOPS & HIRE"',        '{i18n.bikeShopsNearby}'),
    ('"YOUR DAILY PLAN"',          '{i18n.yourDailyPlan}'),
    ('"ROUTE MAP"',                '{i18n.routeMap}'),
    ('"BEST AREA TO STAY"',        '{i18n.bestAreaStay}'),
    ('"prices approx · verify before booking"', '{i18n.pricesApprox}'),
    ('"View hotel "',              '{i18n.viewHotelBtn+" "}'),
    ('"SELF-CATERING OPTION"',     '{i18n.selfCateringOpt}'),
    # Buttons
    ('{i18n.notThisOne}',          '{i18n.notThisOne}'),  # already done
    # Route pages
    ('"OUT-AND-BACK"',             '{i18n.outAndBack}'),
    ('"✈ DIRECTIONS FROM BASE"',  '{"✈ "+i18n.directions}'),
    ('"⚠ INSIDER TIPS"',          '{"⚠ "+i18n.insiderTips}'),
    ('"RECOMMENDED BASE HOTEL"',   '{i18n.recommendedBase}'),
    ('"VIDEO INSPIRATION"',        '{i18n.videoSection}'),
    # Destination pages
    ('"WHAT TO RIDE"',             '{i18n.whatToRide}'),
    ('"☕ FOOD & FUEL"',           '{"☕ "+i18n.foodFuel}'),
    ('"📍 WHERE TO STAY"',         '{"📍 "+i18n.whereStay}'),
    ('"ALSO EXPLORE"',             '{i18n.alsoExplore}'),
    # Share strip
    ('"Not quite right?"',         '{i18n.notQuiteRight}'),
    ('"Share this trip with a friend"', '{i18n.shareWithFriend}'),
    ('"SEND TO A FRIEND"',         '{i18n.sendToFriend}'),
    ('"POST ON SOCIAL"',           '{i18n.postOnSocial}'),
    ('"Going with a group of mixed abilities?"', '{i18n.groupTrip}'),
    ('"Group mode — coming soon"', '{i18n.groupComingSoon}'),
    # Intel tabs
    ('"PRIMARY AIRPORT"',          '{i18n.primaryAirport}'),
    ('"ALTERNATIVE AIRPORT"',      '{i18n.altAirport}'),
    ('"BIKE TRANSPORT"',           '{i18n.bikeTransport}'),
    ('"LOCAL INSIDER KNOWLEDGE"',  '{i18n.localKnowledge}'),
    ('"WHAT COULD GO WRONG"',      '{i18n.whatCouldGoWrong}'),
    ('"PRE-RIDE"',                 '{i18n.preRide}'),
    ('"MID-RIDE"',                 '{i18n.midRide}'),
    ('"POST-RIDE"',                '{i18n.postRide}'),
    ('"LOCAL FUEL"',               '{i18n.localFuel}'),
    # Stats labels
    ('"Distance"',                 '{i18n.distance}'),
    ('"Elevation"',                '{i18n.elevation}'),
    ('"Difficulty"',               '{i18n.difficulty}'),
    ('"Est. time"',                '{i18n.estTime}'),
    ('"Base town"',                '{i18n.baseTown}'),
    ('"Style"',                    '{i18n.style}'),
    # Map
    ('"⭐ Set as my base"',         '{i18n.setAsBase}'),
]

rep_count = 0
for old, new in replacements:
    if old in src and old != new:
        count = src.count(old)
        src = src.replace(old, new)
        rep_count += count

changes.append(f"Replaced {rep_count} hardcoded English strings with i18n refs")

# ══════════════════════════════════════════════════════════════════
# WRITE
# ══════════════════════════════════════════════════════════════════
with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print(f"\n✅ i18n fix complete — {len(changes)} changes:")
for c in changes:
    print(f"   ✓  {c}")
print(f"\nNow run: npm run dev")
print("Then switch languages and check text changes throughout")
print("\nIf broken: cp src/App.jsx.pre-i18n src/App.jsx")
print("If working: git add src/App.jsx && git commit -m 'Fix i18n - all strings translated' && git push")
