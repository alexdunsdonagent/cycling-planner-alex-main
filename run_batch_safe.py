#!/usr/bin/env python3
"""
Safe batch runner - reads credentials from environment only, never stores them.
Usage: python3 run_batch_safe.py
"""
import urllib.request, json, time, sys

WORKER_URL = "https://cycling-data-generator.rewardspy.workers.dev"
SECRET = "CyclingBatch2024"

DESTINATIONS = ["Girona","Mallorca North","Mallorca South","Tenerife","Lanzarote","Gran Canaria","Fuerteventura","Menorca","Catalonia Pyrenees","Basque Country","Navarra Cycling","Valencia Region Cycling","Andalusia","Galicia","Rioja Wine Cycling","Cantabria","Extremadura","Castile La Mancha","Col de la Madone Nice","Col du Tourmalet","Provence","Alps","Brittany Coast","Loire Valley","Alsace Wine Route","Alsace Cols","Burgundy Cycling","Normandy D-Day Coast","Bordeaux Vineyards","Jura Cycling","Vercors Plateau","Chartreuse Massif","Massif Central Auvergne","Languedoc Cycling","Dordogne Cycling","Camargue Delta","Atlantic Coast Vendee","Haute-Savoie","Corsica","Cote dAzur","Dolomites","Tuscany","Sardinia","Sicily Cycling","Amalfi Coast","Puglia","Piedmont Wine Country","Umbria Green Heart","Veneto Cycling","Lombardy Lakes","Chianti Tuscany","Cinque Terre and Liguria","Marche Region","Calabria","Friuli Venezia Giulia","Abruzzo","Basilicata","South Tyrol","Trentino","Algarve","Douro Valley","Sintra and Cascais","Alentejo","Madeira","Azores Cycling","Black Forest","Bavaria Munich Area","Moselle Wine Cycling","Saxon Switzerland","Ticino Swiss Italy","Engadin Valley","Innsbruck Alps","Salzburg Lakes","Styrian Wine Roads","Flanders Classics Country","Ardennes","Zeeland Coast","Limburg Hills","Mullerthal and Ardennes Luxembourg","Lofoten Islands","Fjordland Norway","Bergen","Oslo","Gotland Island","West Coast Sweden","Stockholm","Bornholm Island","North Zealand","Iceland Ring Road","Faroe Islands","Finnish Lake District","Yorkshire Dales","Lake District","Cotswolds","Cornwall Coast Cycling","Peak District","Surrey Hills","Northumberland","New Forest","Exmoor","Derbyshire Dales","Chilterns","South Downs","Shropshire Hills","Norfolk Broads","Isle of Wight","Dartmoor","Forest of Dean","Scottish Highlands","Cairngorms","Argyll and the Isles","Snowdonia","Brecon Beacons","Pembrokeshire Coast","Causeway Coast","Mourne Mountains","Ring of Kerry","Wild Atlantic Way Connemara","Wicklow Mountains","Istria","Dalmatian Coast Cycling","Bohemian Paradise","Moravia Wine Region","Lake Balaton","Peloponnese","Crete Cycling","Transylvania Cycling","High Tatras Slovakia","Tatra Mountains Zakopane","Slovenia Julian Alps","Montenegro Coastal","Blue Mountains NSW","Hunter Valley NSW","Snowy Mountains","Yarra Valley Victoria","Great Ocean Road Victoria","Mornington Peninsula Victoria","Sunshine Coast Hinterland Queensland","Atherton Tablelands Queensland","Adelaide Hills South Australia","Margaret River Western Australia","Perth Hills Western Australia","Hobart and Huon Valley Tasmania","East Coast Tasmania","Canberra ACT","Hawkes Bay","Waikato Cambridge","Rotorua Geothermal","Wellington and Wairarapa","Nelson Tasman","Central Otago Rail Trail","Canterbury Banks Peninsula","Marlborough Wine Region","Queenstown","Fiordland Te Anau","Sedona Arizona","Tucson Arizona","Marin County California","Napa Valley California","Moab Utah","Park City Utah","Colorado Rockies Boulder","Durango Colorado","Blue Ridge Parkway","Columbia River Gorge Oregon","Acadia Maine","Texas Hill Country","Vermont Green Mountains","Cascade Loop Washington","Florida Keys","Finger Lakes New York","Maui Hawaii","White Mountains New Hampshire","San Juan Islands Washington","Okanagan Valley BC","Vancouver Island BC","Kootenays BC","Jasper Alberta","Prince Edward Island","Cape Breton Nova Scotia","Charlevoix Quebec","Eastern Townships Quebec","Georgian Bay Ontario","Niagara Peninsula Ontario","Oaxaca Valley","San Miguel de Allende","Baja California Sur","Antigua Guatemala","Costa Rica Central Valley","Chiriqui Highlands Panama","Sacred Valley Peru","Chilean Lake District","Mendoza Wine Region","Bariloche Patagonia","Boyaca Colombia","Florianopolis Brazil","Serra Gaucha Brazil","Quito Highlands Ecuador","Colonia Uruguay","Nagano","Kyoto","Hokkaido","Kyushu Japan","North Thailand","Ubud","Ha Giang Loop Vietnam","Hoi An Vietnam","Dalat Vietnam","Siem Reap Cambodia","Jeju Island South Korea","Kerala Backwaters India","Himalayan Foothills India","Sri Lanka Hill Country","Cappadocia Turkey","Istanbul and Thrace Turkey","Dead Sea and Negev Israel","Wadi Rum Jordan","Garden Route South Africa","Cape Town","Drakensberg KwaZulu-Natal","Rwandan Thousand Hills","Atlas Mountains Morocco","Western Cape"]

# Test connection
print("Testing worker...")
req = urllib.request.Request(f"{WORKER_URL}/status", headers={"X-Batch-Secret": SECRET})
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        status = json.loads(r.read())
        print(f"Worker OK: {status['done']}/{status['total']} done, {status['remaining']} remaining")
        if status['remaining'] == 0:
            print("All done! Nothing to process.")
            sys.exit(0)
except Exception as e:
    print(f"Worker error: {e}")
    sys.exit(1)

total = len(DESTINATIONS)
chunk = 5
processed = skipped = failed = 0
print(f"\nStarting batch for {total} destinations...\n")

for start in range(0, total, chunk):
    url = f"{WORKER_URL}/process?start={start}&count={chunk}"
    req = urllib.request.Request(url, headers={"X-Batch-Secret": SECRET})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = json.loads(r.read())
                p = len(data.get("processed", []))
                f = len(data.get("failed", []))
                s = len(data.get("skipped", []))
                processed += p; failed += f; skipped += s
                done = processed + skipped
                pct = int(done / total * 100)
                bar = "█" * (pct // 5) + "░" * (20 - pct // 5)
                names = ", ".join(data.get("processed", [])[:2]) or "(cached)"
                print(f"[{bar}] {pct:3d}% {done}/{total} | +{p}: {names}", flush=True)
                break
        except Exception as e:
            if attempt < 2:
                print(f"  Retry {attempt+1}: {e}")
                time.sleep(10)
            else:
                print(f"  FAILED batch {start}: {e}")
                failed += chunk
    time.sleep(2)

print(f"\n{'='*55}")
print(f"DONE: {processed} generated | {skipped} cached | {failed} failed")
print(f"{'='*55}")
