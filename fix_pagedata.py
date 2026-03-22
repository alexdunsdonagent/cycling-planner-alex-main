#!/usr/bin/env python3
import os

path = "src/data/pageData.js"
f = open(path).read()

# Remove any existing SAFETY, SAFETY_LABEL, SAFETY_COLOR blocks
for name in ["SAFETY_LABEL", "SAFETY_COLOR", "SAFETY ="]:
    idx = f.find(f"\nexport const {name}")
    if idx != -1:
        f = f[:idx]

# Append clean versions
f += """
export const SAFETY = {
  'Girona':1,'Mallorca North':1,'Mallorca South':1,'Dolomites':1,'Algarve':1,
  'Tuscany':1,'Pyrenees':1,'Nice':2,'Tenerife':1,'Annecy':1,'Corsica':1,
  'Sardinia':1,'Girona Coast':1,'Calpe':1,'Andalusia':2,'Marrakech':3,
  'Morocco':3,'Istanbul':3,'Cairo':4,'Nairobi':4,'Johannesburg':5,
  'Bogota':4,'Cape Town':3,'Bali':2,'Thailand':2,'Vietnam':2,
  'Philippines':3,'Colombia':3,'Nepal':2,'India':3,'Sri Lanka':2,
  'Jordan':2,'Israel':3,'Lebanon':4,'Egypt':3,'Kenya':3,'Ethiopia':3,
};
export const SAFETY_LABEL = ['','Low crime','Generally safe','Take care','High caution','Avoid'];
export const SAFETY_COLOR = ['','#4aaa40','#4aaa40','#e8b84b','#db7b7b','#db3b3b'];
"""

open(path, "w").write(f)
print("Done - pageData.js fixed")
