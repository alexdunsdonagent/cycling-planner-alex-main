import React from "react";

export default function Header({
  lang, setLang, i18n, LANGS,
  DEST_PAGES, ROUTE_LINKS,
  showNavDropdown, setShowNavDropdown,
  showLangMenu, setShowLangMenu,
  phase, step, STEPS,
  reset, setDestPage, setRoutePage, setShowAbout,
  openDynRoute,
}) {
  return (
    <nav style={{
      height:"58px",
      background:"rgba(10,10,8,0.97)",
      backdropFilter:"blur(12px)",
      borderBottom:"1px solid #1c1c1a",
      padding:"0 40px",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      flexShrink:0,zIndex:200,
      position:"relative",
    }}>
      {/* Clickable logo */}
      <button onClick={()=>{reset();setDestPage(null);setShowNavDropdown(false);}} style={{display:"flex",alignItems:"center",gap:"14px",background:"none",border:"none",cursor:"pointer",padding:0}}>
        <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
          <circle cx="6" cy="16" r="5" stroke="#e8b84b" strokeWidth="1.5" fill="none"/>
          <circle cx="26" cy="16" r="5" stroke="#e8b84b" strokeWidth="1.5" fill="none"/>
          <path d="M6 16 L13 5 L20 10 L26 16" stroke="#e8b84b" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 5 L16 2 L20 6 L20 10" stroke="#e8b84b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="16" cy="2" r="1.5" fill="#e8b84b"/>
        </svg>
        <div style={{textAlign:"left"}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"17px",fontWeight:"700",color:"#f0ede8",letterSpacing:"-0.3px",lineHeight:1}}>Cycling Trip Planner</div>
          <div style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"11px",color:"#7a7a74",marginTop:"2px",letterSpacing:"0.5px"}}>{i18n.tagline}</div>
        </div>
      </button>

      <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
        {/* Explore dropdown */}
        <div style={{position:"relative"}}>
          <button
            onClick={()=>setShowNavDropdown(v=>!v)}
            onBlur={()=>setTimeout(()=>setShowNavDropdown(false),200)}
            style={{
              display:"flex",alignItems:"center",gap:"6px",
              background:"transparent",border:"1px solid #2e2e2b",borderRadius:"5px",
              padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Mono','Courier New',monospace",
              fontSize:"10px",color:"#9a9a94",letterSpacing:"1px",transition:"all 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#555";e.currentTarget.style.color="#ddd";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2e2e2b";e.currentTarget.style.color="#9a9a94";}}
          >
            Explore
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{transition:"transform 0.2s",transform:showNavDropdown?"rotate(180deg)":"rotate(0deg)"}}><path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {showNavDropdown&&(
            <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"#111110",border:"1px solid #2e2e2b",borderRadius:"10px",padding:"8px",minWidth:"320px",maxHeight:"85vh",overflowY:"auto",zIndex:300,boxShadow:"0 8px 40px rgba(0,0,0,0.7)"}}>
              <div style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"9px",color:"#666",letterSpacing:"2px",padding:"6px 10px 6px"}}>TOP DESTINATIONS</div>
              {DEST_PAGES.map(p=>(
                <button key={p.slug} onMouseDown={()=>{setDestPage(p.slug);setShowNavDropdown(false);window.scrollTo(0,0);}} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"left",
                  background:"none",border:"none",padding:"9px 10px",cursor:"pointer",borderRadius:"6px",transition:"all 0.1s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(232,184,75,0.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
                >
                  <div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"13px",color:"#ddd"}}>{p.title.replace("Cycling in ","")}</div>
                    <div style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"9px",color:"#555",marginTop:"1px"}}>{p.stats[0].v}</div>
                  </div>
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#555" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ))}
              <div style={{borderTop:"1px solid #1e1e1c",margin:"6px 0 2px"}}/>
              <div style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"9px",color:"#555",letterSpacing:"2px",padding:"6px 10px 4px"}}>NAMED ROUTES</div>
              {Object.entries(ROUTE_LINKS).flatMap(([dest,dl])=>(dl.routes||[]).map(r=>({...r,dest}))).slice(0,20).map(r=>(
                <button key={r.slug} onMouseDown={()=>{if(r.slug){setRoutePage(r.slug);}else{openDynRoute(r.dest||'',r);}setDestPage(null);setShowNavDropdown(false);window.scrollTo(0,0);}} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"left",
                  background:"none",border:"none",padding:"7px 10px",cursor:"pointer",borderRadius:"6px",transition:"all 0.1s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(232,184,75,0.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
                >
                  <div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"12px",color:"#aaa"}}>{r.title.split("—")[0].trim()}</div>
                    <div style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"9px",color:"#444",marginTop:"1px"}}>{r.dest} · {r.dist}</div>
                  </div>
                  <svg width="5" height="9" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ))}
              <div style={{borderTop:"1px solid #1e1e1c",margin:"4px 0 2px"}}/>
              <button onMouseDown={()=>{setShowAbout(true);setShowNavDropdown(false);}} style={{
                display:"block",width:"100%",textAlign:"left",background:"none",border:"none",
                padding:"8px 10px",cursor:"pointer",borderRadius:"6px",
                fontFamily:"'DM Mono','Courier New',monospace",fontSize:"10px",color:"#7a7a74",
                letterSpacing:"0.5px",transition:"all 0.1s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="#ddd";}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="#7a7a74";}}
              >ℹ About this tool</button>
            </div>
          )}
        </div>

        {phase==="q"&&(
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontFamily:"'DM Mono','Courier New',monospace",fontSize:"11px",color:"#7a7a74"}}>Step {step} / {STEPS.length}</span>
            <div style={{width:"80px",height:"2px",background:"#222",borderRadius:"1px"}}>
              <div style={{width:`${(step/STEPS.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#c49a38,#e8b84b)",borderRadius:"1px",transition:"width 0.4s"}}/>
            </div>
          </div>
        )}

        {/* Language switcher */}
        <div style={{position:"relative"}}>
          <button
            onClick={()=>setShowLangMenu(v=>!v)}
            onBlur={()=>setTimeout(()=>setShowLangMenu(false),250)}
            style={{
              display:"flex",alignItems:"center",gap:"6px",
              background:"transparent",border:"1px solid #2a2a28",
              borderRadius:"6px",padding:"5px 11px",cursor:"pointer",
              fontFamily:"'DM Mono','Courier New',monospace",fontSize:"12px",
              color:"#7a7a74",transition:"all 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#555";e.currentTarget.style.color="#ddd";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a28";e.currentTarget.style.color="#7a7a74";}}
            title="Change language"
          >
            <span style={{fontSize:"15px",lineHeight:1}}>{LANGS.find(l=>l.code===lang)?.flag||"🌐"}</span>
            <span style={{letterSpacing:"0.5px",fontSize:"11px"}}>{LANGS.find(l=>l.code===lang)?.label.slice(0,3)||lang.toUpperCase()}</span>
            <svg width="7" height="5" viewBox="0 0 8 5" fill="none" style={{transition:"transform 0.2s",transform:showLangMenu?"rotate(180deg)":"rotate(0deg)"}}>
              <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showLangMenu&&(
            <div style={{
              position:"absolute",top:"calc(100% + 8px)",right:0,
              background:"#111110",border:"1px solid #2a2a28",borderRadius:"12px",
              padding:"6px",minWidth:"172px",zIndex:500,
              boxShadow:"0 12px 48px rgba(0,0,0,0.75)",
            }}>
              {LANGS.map(l=>(
                <button key={l.code}
                  onClick={()=>{setLang(l.code);try{localStorage.setItem('ctp_lang',l.code);}catch(e){}setShowLangMenu(false);}}
                  style={{
                    display:"flex",alignItems:"center",gap:"9px",width:"100%",
                    background:lang===l.code?"rgba(232,184,75,0.09)":"transparent",
                    border:"none",borderRadius:"7px",padding:"8px 11px",cursor:"pointer",
                    fontFamily:"'DM Mono','Courier New',monospace",fontSize:"11px",
                    color:lang===l.code?"#e8b84b":"#9a9a94",letterSpacing:"0.3px",
                    transition:"all 0.12s",textAlign:"left",
                  }}
                  onMouseEnter={e=>{if(lang!==l.code){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="#e8e4de";}}}
                  onMouseLeave={e=>{if(lang!==l.code){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#9a9a94";}}}
                >
                  <span style={{fontSize:"15px",lineHeight:1,flexShrink:0}}>{l.flag}</span>
                  <span style={{flex:1}}>{l.label}</span>
                  {lang===l.code&&<svg width="10" height="8" viewBox="0 0 12 10" fill="none"><polyline points="1,5 4.5,8.5 11,1" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
