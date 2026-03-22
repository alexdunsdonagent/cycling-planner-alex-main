# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Adds new i18n keys to App.jsx T object. ASCII-safe."""
import re, shutil

SRC = "src/App.jsx"
shutil.copy(SRC, SRC + ".pre-i18n-final")

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

# New keys to add to English - plain ASCII only
EN_KEYS = ',whyMatched:"WHY MATCHED",aboutDest:"ABOUT THIS DESTINATION",furtherReading:"FURTHER READING",routesRiding:"ROUTES AND RIDING",exploreStrava:"Explore on Strava",browseKomoot:"Browse on Komoot",whereToStay:"WHERE TO STAY",whyCyclists:"WHY CYCLISTS STAY HERE",bikeShopsNearby:"BIKE SHOPS AND HIRE",yourDailyPlan:"YOUR DAILY PLAN",routeMap:"ROUTE MAP",bestAreaStay:"BEST AREA TO STAY",pricesApprox:"prices approx - verify before booking",viewHotelBtn:"View hotel",selfCateringOpt:"SELF-CATERING OPTION",outAndBack:"OUT-AND-BACK",directions:"DIRECTIONS FROM BASE",insiderTips:"INSIDER TIPS",recommendedBase:"RECOMMENDED BASE HOTEL",moreRidesFrom:"MORE RIDES FROM",otherRoutes:"OTHER CLASSIC ROUTES",videoSection:"VIDEO INSPIRATION",watchYoutube:"Watch on YouTube",whatToRide:"WHAT TO RIDE",foodFuel:"FOOD AND FUEL",whereStay:"WHERE TO STAY",alsoExplore:"ALSO EXPLORE",planYourTrip:"Get matched hotels and routes - free",notQuiteRight:"Not quite right?",shareWithFriend:"Share this trip",sendToFriend:"SEND TO A FRIEND",postOnSocial:"POST ON SOCIAL",groupTrip:"Going with a group?",groupComingSoon:"Group mode coming soon",primaryAirport:"PRIMARY AIRPORT",altAirport:"ALTERNATIVE AIRPORT",bikeTransport:"BIKE TRANSPORT",localKnowledge:"LOCAL INSIDER KNOWLEDGE",whatCouldGoWrong:"WHAT COULD GO WRONG",preRide:"PRE-RIDE",midRide:"MID-RIDE",postRide:"POST-RIDE",localFuel:"LOCAL FUEL",setAsBase:"Set as my base",day:"Day",estTime:"Est. time",difficulty:"Difficulty",distance:"Distance",elevation:"Elevation",style:"Style",baseTown:"Base town"'

NL_KEYS = ',whyMatched:"WAAROM GEMATCHT",aboutDest:"OVER DEZE BESTEMMING",furtherReading:"MEER LEZEN",routesRiding:"ROUTES EN RIJDEN",exploreStrava:"Verkennen op Strava",browseKomoot:"Bekijken op Komoot",whereToStay:"WAAR TE VERBLIJVEN",whyCyclists:"WAAROM FIETSERS HIER BLIJVEN",bikeShopsNearby:"FIETSWINKELS EN VERHUUR",yourDailyPlan:"UW DAGELIJKSE PLANNING",routeMap:"ROUTEKAART",bestAreaStay:"BESTE VERBLIJFSGEBIED",pricesApprox:"indicatieve prijzen",viewHotelBtn:"Hotel bekijken",selfCateringOpt:"ZELFVERZORGING",outAndBack:"HEEN EN TERUG",directions:"AANWIJZINGEN VANAF BASIS",insiderTips:"INSIDER TIPS",recommendedBase:"AANBEVOLEN BASISHOTEL",moreRidesFrom:"MEER RITTEN VANUIT",otherRoutes:"ANDERE KLASSIEKE ROUTES",videoSection:"VIDEO INSPIRATIE",watchYoutube:"Bekijk op YouTube",whatToRide:"WAT TE RIJDEN",foodFuel:"ETEN EN BRANDSTOF",whereStay:"WAAR TE VERBLIJVEN",alsoExplore:"OOK ONTDEKKEN",planYourTrip:"Krijg matched hotels en routes - gratis",notQuiteRight:"Niet helemaal goed?",shareWithFriend:"Deel deze trip",sendToFriend:"STUUR NAAR EEN VRIEND",postOnSocial:"DEEL OP SOCIALE MEDIA",groupTrip:"Met een groep?",groupComingSoon:"Groepsmodus binnenkort",primaryAirport:"PRIMAIRE LUCHTHAVEN",altAirport:"ALTERNATIEVE LUCHTHAVEN",bikeTransport:"FIETSTRANSPORT",localKnowledge:"LOKALE INSIDER KENNIS",whatCouldGoWrong:"WAT KAN ER MISGAAN",preRide:"VOOR DE RIT",midRide:"TIJDENS DE RIT",postRide:"NA DE RIT",localFuel:"LOKALE BRANDSTOF",setAsBase:"Instellen als basis",day:"Dag",estTime:"Geschatte tijd",difficulty:"Moeilijkheid",distance:"Afstand",elevation:"Hoogteverschil",style:"Stijl",baseTown:"Basisstad"'

PT_KEYS = ',whyMatched:"PORQUE CORRESPONDIDO",aboutDest:"SOBRE ESTE DESTINO",furtherReading:"LEITURA ADICIONAL",routesRiding:"ROTAS E CICLISMO",exploreStrava:"Explorar no Strava",browseKomoot:"Ver no Komoot",whereToStay:"ONDE FICAR",whyCyclists:"PORQUE OS CICLISTAS FICAM AQUI",bikeShopsNearby:"LOJAS E ALUGUER",yourDailyPlan:"PLANO DIARIO",routeMap:"MAPA DE ROTA",bestAreaStay:"MELHOR AREA",pricesApprox:"precos aproximados",viewHotelBtn:"Ver hotel",selfCateringOpt:"ALOJAMENTO PROPRIO",outAndBack:"IDA E VOLTA",directions:"DIRECOES DA BASE",insiderTips:"DICAS DE INSIDER",recommendedBase:"HOTEL BASE RECOMENDADO",moreRidesFrom:"MAIS PERCURSOS DE",otherRoutes:"OUTRAS ROTAS",videoSection:"INSPIRACAO EM VIDEO",watchYoutube:"Ver no YouTube",whatToRide:"O QUE PEDALAR",foodFuel:"COMIDA E COMBUSTIVEL",whereStay:"ONDE FICAR",alsoExplore:"TAMBEM EXPLORAR",planYourTrip:"Obtenha hoteis e rotas - gratis",notQuiteRight:"Nao esta bem?",shareWithFriend:"Partilhe esta viagem",sendToFriend:"ENVIAR A UM AMIGO",postOnSocial:"PUBLICAR NAS REDES",groupTrip:"Com um grupo?",groupComingSoon:"Modo grupo em breve",primaryAirport:"AEROPORTO PRINCIPAL",altAirport:"AEROPORTO ALTERNATIVO",bikeTransport:"TRANSPORTE DE BICICLETA",localKnowledge:"CONHECIMENTO LOCAL",whatCouldGoWrong:"O QUE PODE CORRER MAL",preRide:"PRE-PEDALADA",midRide:"A MEIO",postRide:"POS-PEDALADA",localFuel:"COMBUSTIVEL LOCAL",setAsBase:"Definir como base",day:"Dia",estTime:"Tempo estimado",difficulty:"Dificuldade",distance:"Distancia",elevation:"Elevacao",style:"Estilo",baseTown:"Cidade base"'

PL_KEYS = ',whyMatched:"DLACZEGO DOPASOWANO",aboutDest:"O TEJ DESTYNACJI",furtherReading:"DALSZA LEKTURA",routesRiding:"TRASY I JAZDA",exploreStrava:"Eksploruj na Stravie",browseKomoot:"Przegladaj na Komoot",whereToStay:"GDZIE NOCOWAC",whyCyclists:"DLACZEGO KOLARZE TU NOCUJA",bikeShopsNearby:"SKLEPY I WYPOZYCZALNIE",yourDailyPlan:"TWOJ DZIENNY PLAN",routeMap:"MAPA TRASY",bestAreaStay:"NAJLEPSZA OKOLICA",pricesApprox:"ceny przyblizne",viewHotelBtn:"Zobacz hotel",selfCateringOpt:"OPCJA SAMODZIELNA",outAndBack:"TAM I Z POWROTEM",directions:"WSKAZOWKI OD BAZY",insiderTips:"PORADY INSIDEROW",recommendedBase:"POLECANY HOTEL BAZOWY",moreRidesFrom:"WIECEJ TRAS Z",otherRoutes:"INNE KLASYCZNE TRASY",videoSection:"INSPIRACJA WIDEO",watchYoutube:"Ogladaj na YouTube",whatToRide:"CO JEZDZIC",foodFuel:"JEDZENIE I PALIWO",whereStay:"GDZIE NOCOWAC",alsoExplore:"ODKRYJ ROWNIEZ",planYourTrip:"Dopasowane hotele i trasy - bezplatnie",notQuiteRight:"Nie do konca?",shareWithFriend:"Podziel sie trasa",sendToFriend:"WYSLIJ DO PRZYJACIELA",postOnSocial:"OPUBLIKUJ W MEDIACH",groupTrip:"Z grupa?",groupComingSoon:"Tryb grupowy wkrotce",primaryAirport:"GLOWNE LOTNISKO",altAirport:"ALTERNATYWNE LOTNISKO",bikeTransport:"TRANSPORT ROWERU",localKnowledge:"LOKALNA WIEDZA",whatCouldGoWrong:"CO MOZE POJSC ZLE",preRide:"PRZED JAZDA",midRide:"W TRAKCIE",postRide:"PO JEZDZIE",localFuel:"LOKALNE PALIWO",setAsBase:"Ustaw jako baze",day:"Dzien",estTime:"Szacowany czas",difficulty:"Trudnosc",distance:"Dystans",elevation:"Przewyzszenie",style:"Styl",baseTown:"Miasto bazowe"'

CS_KEYS = ',whyMatched:"PROC SPAROVANO",aboutDest:"O TOMTO MISTE",furtherReading:"DALSI CTENI",routesRiding:"TRASY A JIZDA",exploreStrava:"Prozkoumat na Strave",browseKomoot:"Prochazet na Komoot",whereToStay:"KDE POBYVAT",whyCyclists:"PROC TU CYKLISTE ZUSTAVAJI",bikeShopsNearby:"OBCHODY A PUJCOVNY",yourDailyPlan:"VAS DENNI PLAN",routeMap:"MAPA TRASY",bestAreaStay:"NEJLEPSI OBLAST",pricesApprox:"priblizne ceny",viewHotelBtn:"Zobrazit hotel",selfCateringOpt:"VLASTNI STRAVOVANI",outAndBack:"TAM A ZPET",directions:"POKYNY OD ZAKLADNY",insiderTips:"TIPY INSIDERU",recommendedBase:"DOPORUCENY HOTEL",moreRidesFrom:"VICE JIZD Z",otherRoutes:"JINE KLASICKE TRASY",videoSection:"VIDEO INSPIRACE",watchYoutube:"Sledovat na YouTube",whatToRide:"CO JEZDIT",foodFuel:"JIDLO A PALIVO",whereStay:"KDE POBYVAT",alsoExplore:"TAKE PROZKOUMAT",planYourTrip:"Ziskejte hotely a trasy - zdarma",notQuiteRight:"Neni to ono?",shareWithFriend:"Sdilejte vylet",sendToFriend:"POSLAT PRITELI",postOnSocial:"ZVEREJNIT NA SITI",groupTrip:"Se skupinou?",groupComingSoon:"Skupinovy rezim brzy",primaryAirport:"HLAVNI LETISTE",altAirport:"ALTERNATIVNI LETISTE",bikeTransport:"TRANSPORT KOLA",localKnowledge:"MISTNI ZNALOSTI",whatCouldGoWrong:"CO MUZE JIT SPATNE",preRide:"PRED JIZDOU",midRide:"BEHEM JIZDY",postRide:"PO JIZDE",localFuel:"MISTNI PALIVO",setAsBase:"Nastavit jako zakladnu",day:"Den",estTime:"Odhadovany cas",difficulty:"Obtiznost",distance:"Vzdalenost",elevation:"Prevyseni",style:"Styl",baseTown:"Zakladni mesto"'

DA_KEYS = ',whyMatched:"HVORFOR MATCHET",aboutDest:"OM DENNE DESTINATION",furtherReading:"VIDERE LAESNING",routesRiding:"RUTER OG CYKLING",exploreStrava:"Udforsk pa Strava",browseKomoot:"Gennemse pa Komoot",whereToStay:"HVOR MAN BOR",whyCyclists:"HVORFOR CYKLISTER BOR HER",bikeShopsNearby:"CYKELFORRETNINGER",yourDailyPlan:"DIN DAGLIGE PLAN",routeMap:"RUTEKORT",bestAreaStay:"BEDSTE OMRADE",pricesApprox:"omtrentlige priser",viewHotelBtn:"Se hotel",selfCateringOpt:"SELVFORPLEJNING",outAndBack:"TUR-RETUR",directions:"VEJLEDNING FRA BASE",insiderTips:"INSIDER TIPS",recommendedBase:"ANBEFALET BASISHOTEL",moreRidesFrom:"FLERE TURE FRA",otherRoutes:"ANDRE KLASSISKE RUTER",videoSection:"VIDEO INSPIRATION",watchYoutube:"Se pa YouTube",whatToRide:"HVAD MAN CYKLER",foodFuel:"MAD OG BRAENDSTOF",whereStay:"HVOR MAN BOR",alsoExplore:"UDFORSK OGSA",planYourTrip:"Fa matchede hoteller og ruter - gratis",notQuiteRight:"Ikke helt rigtigt?",shareWithFriend:"Del denne tur",sendToFriend:"SEND TIL EN VEN",postOnSocial:"POST PA SOCIALE MEDIER",groupTrip:"Med en gruppe?",groupComingSoon:"Gruppetistand kommer snart",primaryAirport:"PRIMAER LUFTHAVN",altAirport:"ALTERNATIV LUFTHAVN",bikeTransport:"CYKELTRANSPORT",localKnowledge:"LOKAL INSIDERVIDEN",whatCouldGoWrong:"HVAD KAN GA GALT",preRide:"FOR TUREN",midRide:"UNDER TUREN",postRide:"EFTER TUREN",localFuel:"LOKALT BRAENDSTOF",setAsBase:"Angiv som min base",day:"Dag",estTime:"Estimeret tid",difficulty:"Svaerhedsgrad",distance:"Afstand",elevation:"Stigning",style:"Stil",baseTown:"Baseby"'

SV_KEYS = ',whyMatched:"VARFOR MATCHAD",aboutDest:"OM DENNA DESTINATION",furtherReading:"VIDARE LASNING",routesRiding:"RUTTER OCH CYKLING",exploreStrava:"Utforska pa Strava",browseKomoot:"Bladdra pa Komoot",whereToStay:"VAR MAN BOR",whyCyclists:"VARFOR CYKLISTER STANNAR HAR",bikeShopsNearby:"CYKELAFFARER",yourDailyPlan:"DIN DAGLIGA PLAN",routeMap:"RUTTKARTA",bestAreaStay:"BASTA OMRADET",pricesApprox:"ungefaerliga priser",viewHotelBtn:"Visa hotell",selfCateringOpt:"SJALVHUSHALLNING",outAndBack:"FRAM OCH TILLBAKA",directions:"VAGBESKRIVNING",insiderTips:"INSIDERTIPS",recommendedBase:"REKOMMENDERAT HOTELL",moreRidesFrom:"FLER TURER FRAN",otherRoutes:"ANDRA KLASSISKA RUTTER",videoSection:"VIDEOINSPIRATION",watchYoutube:"Titta pa YouTube",whatToRide:"VAD MAN CYKLAR",foodFuel:"MAT OCH BRAENSLE",whereStay:"VAR MAN BOR",alsoExplore:"UTFORSKA OCKSA",planYourTrip:"Fa matchade hotell och rutter - gratis",notQuiteRight:"Inte riktigt ratt?",shareWithFriend:"Dela resan",sendToFriend:"SKICKA TILL EN VAN",postOnSocial:"POSTA PA SOCIALA MEDIER",groupTrip:"Med en grupp?",groupComingSoon:"Grupplade kommer snart",primaryAirport:"PRIMAER FLYGPLATS",altAirport:"ALTERNATIV FLYGPLATS",bikeTransport:"CYKELTRANSPORT",localKnowledge:"LOKAL INSIDERKUNSKAP",whatCouldGoWrong:"VAD KAN GA FEL",preRide:"FORE TUREN",midRide:"UNDER TUREN",postRide:"EFTER TUREN",localFuel:"LOKALT BRAENSLE",setAsBase:"Ange som min bas",day:"Dag",estTime:"Beraeknad tid",difficulty:"Svarighetsgrad",distance:"Avstand",elevation:"Hojdmeter",style:"Stil",baseTown:"Basstad"'

NO_KEYS = ',whyMatched:"HVORFOR MATCHET",aboutDest:"OM DENNE DESTINASJONEN",furtherReading:"VIDERE LESING",routesRiding:"RUTER OG SYKLING",exploreStrava:"Utforsk pa Strava",browseKomoot:"Bla pa Komoot",whereToStay:"HVOR MAN BOR",whyCyclists:"HVORFOR SYKLISTER BOR HER",bikeShopsNearby:"SYKKELBUTIKKER",yourDailyPlan:"DIN DAGLIGE PLAN",routeMap:"RUTEKART",bestAreaStay:"BESTE OMRADE",pricesApprox:"omtrentlige priser",viewHotelBtn:"Se hotell",selfCateringOpt:"SELVFORSYNING",outAndBack:"TUR-RETUR",directions:"VEIBESKRIVELSE",insiderTips:"INSIDER TIPS",recommendedBase:"ANBEFALT BASISHOTELL",moreRidesFrom:"FLERE TURER FRA",otherRoutes:"ANDRE KLASSISKE RUTER",videoSection:"VIDEOINSPIRASON",watchYoutube:"Se pa YouTube",whatToRide:"HVA MAN SYKLER",foodFuel:"MAT OG DRIVSTOFF",whereStay:"HVOR MAN BOR",alsoExplore:"UTFORSK OGSA",planYourTrip:"Fa matchede hoteller og ruter - gratis",notQuiteRight:"Ikke helt riktig?",shareWithFriend:"Del turen",sendToFriend:"SEND TIL EN VENN",postOnSocial:"POST PA SOSIALE MEDIER",groupTrip:"Med en gruppe?",groupComingSoon:"Gruppemodus kommer snart",primaryAirport:"PRIMAER FLYPLASS",altAirport:"ALTERNATIV FLYPLASS",bikeTransport:"SYKKELTRANSPORT",localKnowledge:"LOKAL INSIDERKUNNSKAP",whatCouldGoWrong:"HVA KAN GA GALT",preRide:"FOR TUREN",midRide:"UNDER TUREN",postRide:"ETTER TUREN",localFuel:"LOKALT DRIVSTOFF",setAsBase:"Sett som min base",day:"Dag",estTime:"Estimert tid",difficulty:"Vanskelighetsgrad",distance:"Avstand",elevation:"Stigning",style:"Stil",baseTown:"Baseby"'

# ja and zh: use English keys as fallback (avoids encoding issues)
JA_KEYS = EN_KEYS
ZH_KEYS = EN_KEYS

def find_lang_end(src, lang):
    """Find closing } of a language block by brace counting."""
    pat = re.compile(r'(?<![a-zA-Z])' + re.escape(lang) + r'\s*:\s*\{')
    m = pat.search(src)
    if not m:
        return None
    pos = m.end() - 1
    depth = 0
    i = pos
    in_str = False
    sc = None
    while i < len(src):
        c = src[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == sc:
                in_str = False
        else:
            if c in ('"', "'", '`'):
                in_str = True
                sc = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return None

LANG_KEYS = [
    ("en", EN_KEYS),
    ("nl", NL_KEYS),
    ("pt", PT_KEYS),
    ("pl", PL_KEYS),
    ("cs", CS_KEYS),
    ("da", DA_KEYS),
    ("sv", SV_KEYS),
    ("no", NO_KEYS),
    ("ja", JA_KEYS),
    ("zh", ZH_KEYS),
]

count = 0
for lang, keys in LANG_KEYS:
    # Skip keys already present
    if 'whyMatched:' in src[src.find(lang + ':'):src.find(lang + ':') + 5000]:
        print(f"  skip {lang} - already has keys")
        continue

    end = find_lang_end(src, lang)
    if end is None:
        print(f"  skip {lang} - block not found")
        continue

    # Insert before closing brace, after last non-whitespace char
    insert_at = end
    while insert_at > 0 and src[insert_at - 1] in (' ', '\t', '\n', '\r'):
        insert_at -= 1

    # Add comma only if last char isn't already a comma
    sep = "" if src[insert_at - 1] == "," else ","
    src = src[:insert_at] + sep + keys + src[insert_at:]
    print(f"  done {lang}")
    count += 1

with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print(f"\nDone - {count} languages updated")
print("Run: npm run dev")
