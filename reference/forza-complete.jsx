const { useState, useEffect, useRef } = React;

const C = {
  accent:  "#C8FF00", accentD: "#8FB800",
  bg:      "#080810", s0: "#0E0E18", s1: "#141420", s2: "#1C1C2C", s3: "#242436",
  gray:    "#6868A0", grayL: "#9898C0", white: "#F0F0FF",
  red: "#FF4466", blue: "#4488FF", orange: "#FF8840",
};

const TIPO_COLORS = {
  fuerza:"#C8FF00", espalda:"#4488FF", piernas:"#FF8840",
  cardio:"#FF4466", descanso:"#6868A0", fullbody:"#A78BFA",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:${C.bg};font-family:'DM Sans',sans-serif;color:${C.white};overflow:hidden;}
input:focus{outline:none;}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:${C.s1};}
::-webkit-scrollbar-thumb{background:${C.s3};border-radius:2px;}
.bb{font-family:'Bebas Neue',sans-serif;}
.mono{font-family:'Space Mono',monospace;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(200,255,0,.5)}60%{box-shadow:0 0 0 10px rgba(200,255,0,0)}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(700px) rotate(720deg);opacity:0}}
@keyframes confettiSway{0%,100%{margin-left:0}50%{margin-left:30px}}
@keyframes quoteSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 6px ${C.accent}60)}50%{filter:drop-shadow(0 0 20px ${C.accent}90)}}

.fade-up{animation:fadeUp .35s ease both;}
.fade-in{animation:fadeIn .3s ease both;}
.scale-in{animation:scaleIn .28s ease both;}
.pulsing{animation:pulse 2s ease infinite;}
.pop-in{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both;}
.slide-up{animation:slideUp .4s ease both;}

.bk-sidebar{width:240px;background:${C.s0};height:100%;border-right:1px solid ${C.s2};display:flex;flex-direction:column;flex-shrink:0;}
.bk-nav{display:flex;align-items:center;gap:11px;padding:11px 16px;color:${C.gray};cursor:pointer;border-radius:10px;margin:2px 8px;transition:all .2s;font-size:14px;font-weight:500;border:none;background:transparent;font-family:'DM Sans',sans-serif;text-align:left;width:calc(100% - 16px);}
.bk-nav:hover{background:${C.s2};color:${C.white};}
.bk-nav.on{background:rgba(200,255,0,.1);color:${C.accent};}
.bk-th{text-align:left;padding:10px 14px;font-size:11px;font-weight:600;color:${C.gray};text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid ${C.s2};}
.bk-td{padding:13px 14px;font-size:13px;border-bottom:1px solid ${C.s1};}
.bk-tr:hover .bk-td{background:${C.s2};}
.tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const PRICING = {
  countries: [
    {id:"AR", flag:"🇦🇷", name:"Argentina", currency:"ARS", symbol:"$",
     pro: 4500, proLabel:"$4.500/mes",
     coachFloor:{starter:15900, pro:29900, elite:49900},
     coachRange:{starter:"$15.900–$35.000", pro:"$29.900–$55.000", elite:"$49.900–$85.000"},
     coachSub: 9900, coachSubLabel:"$9.900/mes",
     note:"Precio en ARS. Se revisa cada 90 días."},
    {id:"CL", flag:"🇨🇱", name:"Chile", currency:"CLP", symbol:"$",
     pro: 4990, proLabel:"$4.990/mes",
     coachFloor:{starter:19990, pro:39990, elite:65990},
     coachRange:{starter:"$19.990–$40.000", pro:"$39.990–$70.000", elite:"$65.990–$110.000"},
     coachSub: 14990, coachSubLabel:"$14.990/mes",
     note:"Precio en CLP."},
    {id:"GB", flag:"🇬🇧", name:"Reino Unido", currency:"GBP", symbol:"£",
     pro: 8.99, proLabel:"£8.99/mes",
     coachFloor:{starter:35, pro:60, elite:100},
     coachRange:{starter:"£35–£60", pro:"£60–£100", elite:"£100–£160"},
     coachSub: 19, coachSubLabel:"£19/mes",
     note:"Price in GBP."},
    {id:"BR", flag:"🇧🇷", name:"Brasil", currency:"BRL", symbol:"R$",
     pro: 14.90, proLabel:"R$14,90/mes",
     coachFloor:{starter:79, pro:149, elite:239},
     coachRange:{starter:"R$79–R$150", pro:"R$149–R$250", elite:"R$239–R$390"},
     coachSub: 39, coachSubLabel:"R$39/mes",
     note:"Preço em BRL."},
  ],
  plans: {
    free: {
      id:"free", label:"GRATIS", icon:"🆓", color:"#6868A0",
      features:[
        {ok:true,  text:"Registrar entrenos post-workout"},
        {ok:true,  text:"Tabata timer básico"},
        {ok:true,  text:"3 rutinas predefinidas (sin editar)"},
        {ok:true,  text:"Historial últimos 10 días"},
        {ok:true,  text:"Stats básicos (peso, racha, sesiones)"},
        {ok:true,  text:"Ver marketplace (sin contratar)"},
        {ok:false, text:"Publicidad en videos (10 seg)"},
        {ok:false, text:"Sin rutinas personalizadas"},
        {ok:false, text:"Sin gráficos de progreso"},
        {ok:false, text:"Sin coach"},
      ]
    },
    pro: {
      id:"pro", label:"PRO", icon:"⚡", color:"#C8FF00",
      features:[
        {ok:true, text:"Todo lo del plan Gratis"},
        {ok:true, text:"Rutinas ilimitadas + personalizadas"},
        {ok:true, text:"Plan semanal propio"},
        {ok:true, text:"Gráficos completos (peso, grasa, fuerza)"},
        {ok:true, text:"Fotos de progreso corporal (timeline)"},
        {ok:true, text:"Videos de técnica guardados"},
        {ok:true, text:"Tabata inteligente + timer con grupos musculares"},
        {ok:true, text:"Apple Health / Google Fit"},
        {ok:true, text:"Sin publicidad"},
        {ok:true, text:"Feedback y soporte prioritario"},
        {ok:false, text:"Sin coach asignado"},
      ]
    },
    coach: {
      id:"coach", label:"PRO + COACH", icon:"🏆", color:"#FF8840",
      packages:[
        {id:"starter", label:"Starter", icon:"🌱",
         features:["Chat directo con el coach","Rutinas armadas por el coach","Plan semanal personalizado","Check-in semanal estructurado","Grupos y comunidad del coach"]},
        {id:"pro", label:"Pro", icon:"⚡",
         features:["Todo Starter","Envío de videos al coach para feedback","Fotos de progreso visibles al coach","Análisis corporal comentado por el coach","Soporte prioritario 24h"]},
        {id:"elite", label:"Elite", icon:"🏆",
         features:["Todo Pro","Sesiones en vivo con el coach","Plan nutricional personalizado","Acceso a hasta 3 coaches especializados","Análisis IA semanal"]},
      ]
    }
  },
  commission: 0.15,
};
function PaymentCheckout(props) {
  const coach   = props.coach;
  const onBack  = props.onBack;
  const onConfirm = props.onConfirm;
  const [cards, setCards] = useState([
    { brand:'Visa', last4:'4242', expiry:'12/27', accent:'#4488FF' },
  ]);
  const [selCard, setSelCard]   = useState(0);
  const [showForm, setShowForm] = useState(cards.length === 0);
  const [form, setForm] = useState({ num:'', name:'', exp:'', cvv:'' });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  const formatNum = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExp = v => { const d=v.replace(/\D/g,''); return d.length>2?d.slice(0,2)+'/'+d.slice(2,4):d; };

  const addCard = () => {
    if (!form.num || !form.name || !form.exp) return;
    const last4 = form.num.replace(/\s/g,'').slice(-4);
    const brand = form.num.trim().startsWith('4') ? 'Visa' : 'Mastercard';
    const newCard = { brand, last4, expiry:form.exp, accent: brand==='Visa'?'#4488FF':C.orange };
    setCards(p => [...p, newCard]);
    setSelCard(cards.length);
    setShowForm(false);
    setForm({ num:'', name:'', exp:'', cvv:'' });
  };

  const [checkoutStep, setCheckoutStep] = useState("payment");
  const [fiscalData, setFiscalData] = useState({ dni:"", direccion:"", telefono:"" });
  const updFiscal = (k,v) => setFiscalData(p=>({...p,[k]:v}));
  const [ageConfirm, setAgeConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onConfirm(); }, 1800);
  };

  const card = cards[selCard];
  const _rd = new Date(); _rd.setMonth(_rd.getMonth()+1);
  const renewDate = _rd.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>


      <div style={{padding:'14px 20px 14px',background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={onBack} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:12}}>← Volver al perfil</button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <h2 className="bb" style={{fontSize:28,color:C.white,letterSpacing:.5,lineHeight:1,marginBottom:3}}>CONFIRMAR PAGO</h2>
            <p style={{fontSize:13,color:C.gray}}>Suscripción mensual al coach</p>
          </div>
          <div style={{textAlign:'right'}}>
            <p className="mono" style={{fontSize:28,color:coach.color,fontWeight:700,lineHeight:1}}>${coach.price}</p>
            <p style={{fontSize:10,color:C.gray}}>/mes</p>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>


        {checkoutStep==="fiscal" && (
          <div>
            <div style={{background:`${C.blue}08`,borderRadius:14,padding:"13px 16px",marginBottom:18,border:`1px solid ${C.blue}20`}}>
              <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:4}}>📋 Datos para la factura</p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>El coach necesita estos datos para emitirte la factura/boleta. Son obligatorios y quedan guardados de forma segura en tu perfil.</p>
            </div>
            {[
              {k:"dni",       l:"DNI / Pasaporte",      ph:"Número de documento"},
              {k:"direccion", l:"Dirección completa",    ph:"Calle, número, ciudad, país"},
              {k:"telefono",  l:"Teléfono / WhatsApp",   ph:"+54 9 11 1234-5678"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{f.l}</label>
                <input value={fiscalData[f.k]} onChange={e=>updFiscal(f.k,e.target.value)}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${fiscalData[f.k]?C.accent:C.s2}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:10,alignItems:"flex-start",background:`${C.orange}08`,borderRadius:12,padding:"11px 14px",marginBottom:16,cursor:"pointer"}} onClick={()=>setAgeConfirm(!ageConfirm)}>
              <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${ageConfirm?C.accent:C.gray}`,background:ageConfirm?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                {ageConfirm && <span style={{fontSize:11,color:C.bg,fontWeight:700}}>✓</span>}
              </div>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>Confirmo que soy mayor de 18 años, o que tengo autorización de mi tutor/responsable legal para contratar este servicio.</p>
            </div>
            <button
              onClick={()=>setCheckoutStep("payment")}
              disabled={!fiscalData.dni||!fiscalData.direccion||!fiscalData.telefono||!ageConfirm}
              style={{width:"100%",background:fiscalData.dni&&fiscalData.direccion&&fiscalData.telefono&&ageConfirm?C.accent:C.s2,color:fiscalData.dni&&fiscalData.direccion&&fiscalData.telefono&&ageConfirm?C.bg:C.gray,border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10,transition:"all .3s"}}>
              Continuar al pago →
            </button>
            <button onClick={onBack} style={{width:"100%",background:"transparent",border:`1px solid ${C.s3}`,borderRadius:12,padding:"11px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>Volver</button>
          </div>
        )}

        {checkoutStep==="payment" && (<>


        <div style={{background:`linear-gradient(135deg,${coach.color}12,${coach.color}05)`,border:`1.5px solid ${coach.color}35`,borderRadius:18,padding:'14px 16px',marginBottom:20,display:'flex',gap:14,alignItems:'center'}}>
          <div style={{width:50,height:50,borderRadius:'50%',background:`${coach.color}25`,border:`2px solid ${coach.color}50`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>👤</div>
          <div style={{flex:1}}>
            <p style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:2}}>{coach.name}</p>
            <p style={{fontSize:12,color:C.grayL}}>{coach.specialty}</p>
            <div style={{display:'flex',gap:6,marginTop:5}}>
              {coach.tags.slice(0,2).map(t=><Pill key={t} color={coach.color}>{t}</Pill>)}
            </div>
          </div>
        </div>


        {cards.length > 0 && (
          <div style={{marginBottom:20}}>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>Método de pago</p>
            {cards.map((c,i) => (
              <div key={i} onClick={()=>{setSelCard(i);setShowForm(false);}}
                style={{display:'flex',gap:14,alignItems:'center',background:i===selCard?`${c.accent}12`:C.s1,borderRadius:16,padding:'14px 16px',marginBottom:8,border:`1.5px solid ${i===selCard?c.accent:C.s2}`,cursor:'pointer',transition:'all .25s'}}>

                <div style={{width:52,height:34,borderRadius:8,background:`linear-gradient(135deg,${c.accent}30,${c.accent}15)`,border:`1px solid ${c.accent}40`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontSize:11,fontWeight:700,color:c.accent}}>{c.brand.slice(0,4).toUpperCase()}</span>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:700,color:i===selCard?C.white:C.grayL}}>
                    {c.brand} <span className="mono" style={{letterSpacing:2}}>···· {c.last4}</span>
                  </p>
                  <p style={{fontSize:11,color:C.gray,marginTop:2}}>Vence {c.expiry}</p>
                </div>

                <div style={{width:22,height:22,borderRadius:'50%',border:`2px solid ${i===selCard?c.accent:C.s3}`,background:i===selCard?c.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .25s'}}>
                  {i===selCard && <div style={{width:8,height:8,borderRadius:'50%',background:C.white}}/>}
                </div>
              </div>
            ))}

            <button onClick={()=>{setShowForm(!showForm);setSelCard(-1);}}
              style={{width:'100%',background:'transparent',border:`1.5px dashed ${showForm?C.accent:C.s3}`,borderRadius:13,padding:'11px',fontSize:12,fontWeight:600,color:showForm?C.accent:C.gray,cursor:'pointer',fontFamily:'inherit',marginTop:2,transition:'all .25s'}}>
              {showForm ? '✕ Cancelar nueva tarjeta' : '+ Agregar otra tarjeta'}
            </button>
          </div>
        )}


        {showForm && (
          <div style={{background:C.s1,borderRadius:18,padding:'16px 18px',marginBottom:20,border:`1px solid ${C.s2}`}} className="fade-in">
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:14}}>
              {cards.length===0 ? 'Agregá tu tarjeta para continuar' : 'Nueva tarjeta'}
            </p>

            <div style={{background:`linear-gradient(135deg,#141428,#0e0e1c)`,borderRadius:16,padding:'16px 18px',marginBottom:16,position:'relative',overflow:'hidden',border:`1px solid ${C.s3}`}}>
              <div style={{position:'absolute',top:-20,right:-20,width:90,height:90,borderRadius:'50%',background:'rgba(255,255,255,.03)'}}/>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                <div style={{width:32,height:22,borderRadius:5,background:`${C.accent}30`,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:24,height:16,borderRadius:3,background:C.accent,opacity:.6}}/></div>
                <p style={{fontSize:11,color:'rgba(255,255,255,.4)',fontWeight:700}}>{form.num&&form.num.trim().startsWith('4')?'VISA':'CARD'}</p>
              </div>
              <p className="mono" style={{fontSize:14,color:C.white,letterSpacing:3,marginBottom:14}}>{form.num||'•••• •••• •••• ••••'}</p>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div><p style={{fontSize:8,color:'rgba(255,255,255,.35)',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Titular</p><p style={{fontSize:11,color:C.white,letterSpacing:.5}}>{form.name||'NOMBRE APELLIDO'}</p></div>
                <div style={{textAlign:'right'}}><p style={{fontSize:8,color:'rgba(255,255,255,.35)',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Vence</p><p className="mono" style={{fontSize:11,color:C.white}}>{form.exp||'MM/AA'}</p></div>
              </div>
            </div>
            {[
              {k:'num',  label:'Número',    ph:'1234 5678 9012 3456', fmt:formatNum, max:19, mono:true},
              {k:'name', label:'Titular',   ph:'Como aparece en la tarjeta', fmt:v=>v.toUpperCase(), max:30, mono:false},
              {k:'exp',  label:'Vencimiento', ph:'MM/AA', fmt:formatExp, max:5, mono:true},
              {k:'cvv',  label:'CVV',       ph:'•••', fmt:v=>v.replace(/\D/g,'').slice(0,4), max:4, mono:true},
            ].map(f => (
              <div key={f.k} style={{marginBottom:11}}>
                <label style={{display:'block',fontSize:9,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:'uppercase',marginBottom:5}}>{f.label}</label>
                <input value={form[f.k]} onChange={e=>upd(f.k,f.fmt(e.target.value))} placeholder={f.ph} maxLength={f.max}
                  style={{width:'100%',padding:'12px 14px',background:C.s2,border:`1.5px solid ${form[f.k]?C.accent:C.s3}`,borderRadius:11,color:C.white,fontSize:13,fontFamily:f.mono?"'Space Mono',monospace":"'DM Sans',sans-serif",transition:'border-color .2s',letterSpacing:f.k==='num'?2:0}}/>
              </div>
            ))}
            <button onClick={addCard} disabled={!form.num||!form.name||!form.exp||!form.cvv}
              style={{width:'100%',background:form.num&&form.name&&form.exp&&form.cvv?C.accent:C.s2,color:form.num&&form.name&&form.exp&&form.cvv?C.bg:C.gray,border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:form.num&&form.name&&form.exp&&form.cvv?'pointer':'not-allowed',fontFamily:'inherit',marginTop:4,transition:'all .3s'}}>
              Agregar tarjeta
            </button>
          </div>
        )}


        <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}25`,borderRadius:16,padding:'14px 16px',marginBottom:20}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
            <span style={{fontSize:20,flexShrink:0}}>🔄</span>
            <div>
              <p style={{fontSize:13,color:C.blue,fontWeight:700,marginBottom:6}}>Renovación automática mensual</p>
              <p style={{fontSize:12,color:C.grayL,lineHeight:1.6,marginBottom:4}}>
                Se cobrarán <strong style={{color:C.white}}>${coach.price}</strong> automáticamente el{' '}
                <strong style={{color:C.white}}>{renewDate}</strong> y cada mes siguiente.
              </p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>
                Podés cancelar en cualquier momento desde tu perfil → Suscripción y pagos. El acceso se mantiene hasta el final del período ya pagado.
              </p>
            </div>
          </div>
        </div>


        <div style={{background:C.s1,borderRadius:16,padding:'14px 16px',border:`1px solid ${C.s2}`,marginBottom:4}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:'uppercase',marginBottom:10}}>Incluye en tu suscripción</p>
          {['Rutina personalizada semanal','Chat directo con el coach · respuesta en 24h','Revisión de videos y corrección de técnica','Acceso a grupos del coach','Ajuste de carga y progresión quincenal'].map((f,i) => (
            <div key={i} style={{display:'flex',gap:10,alignItems:'center',marginBottom:7}}>
              <div style={{width:18,height:18,borderRadius:5,background:`${coach.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span style={{fontSize:9,color:coach.color}}>✓</span>
              </div>
              <p style={{fontSize:12,color:C.grayL}}>{f}</p>
            </div>
          ))}
        </div>
        </>
      )}
      </div>


      <div style={{padding:'12px 20px 18px',borderTop:`1px solid ${C.s2}`,flexShrink:0,background:C.bg}}>

        {card && !showForm && (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,padding:'8px 12px',background:C.s1,borderRadius:11,border:`1px solid ${C.s2}`}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontSize:14}}>💳</span>
              <span style={{fontSize:12,color:C.grayL}}>{card.brand} ···· {card.last4}</span>
            </div>
            <span className="mono" style={{fontSize:14,color:coach.color,fontWeight:700}}>${coach.price}/mes</span>
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={processing || selCard < 0 || showForm}
          style={{
            width:'100%',
            background: processing ? C.s2 : (selCard>=0 && !showForm) ? `linear-gradient(135deg,${coach.color},${coach.color}AA)` : C.s2,
            color: (selCard>=0 && !showForm && !processing) ? C.bg : C.gray,
            border:'none', borderRadius:16, padding:'17px',
            fontSize:16, fontWeight:700, cursor:(selCard>=0&&!showForm&&!processing)?'pointer':'not-allowed',
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5,
            transition:'all .3s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          }}>
          {processing ? (<><span>⏳</span> PROCESANDO...</>) : (selCard>=0&&!showForm ? 'CONTRATAR · $'+coach.price+'/MES' : 'AGREGAR TARJETA')}
        </button>
        <p style={{fontSize:10,color:C.gray,textAlign:'center',marginTop:8}}>🔒 Pago seguro · Podés cancelar cuando quieras</p>
        </div>
    </div>
  );
};

function UpgradeModal(props) {
  const feature  = props.feature  || "esta función";
  const onClose  = props.onClose  || (()=>{});
  const navigate = props.navigate || (()=>{});
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",zIndex:200,display:"flex",alignItems:"flex-end",padding:0}}>
      <div style={{width:"100%",background:C.s0,borderRadius:"24px 24px 0 0",padding:"24px 24px 36px",border:`1px solid ${C.s2}`}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:56,height:56,borderRadius:18,background:`${C.accent}18`,border:`2px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>⚡</div>
          <p className="bb" style={{fontSize:26,color:C.white,letterSpacing:.5,marginBottom:6}}>FUNCIÓN PRO</p>
          <p style={{fontSize:13,color:C.gray,lineHeight:1.6}}><strong style={{color:C.white}}>{feature}</strong> está disponible en el plan PRO o superior.</p>
        </div>
        <div style={{background:`${C.accent}08`,border:`1px solid ${C.accent}20`,borderRadius:14,padding:"12px 16px",marginBottom:16}}>
          {["Rutinas ilimitadas + personalizadas","Historial y gráficos completos","Sin publicidad","Fotos y videos de progreso"].map(f=>(
            <div key={f} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <span style={{color:C.accent,fontSize:13,flexShrink:0}}>✓</span>
              <span style={{fontSize:12,color:C.grayL}}>{f}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>{ onClose(); navigate("mi-plan"); }}
          style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
          Ver planes · Activar PRO
        </button>
        <button onClick={onClose}
          style={{width:"100%",background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"12px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>
          Ahora no
        </button>
      </div>
    </div>
  );
};
function AdScreen(props) {
  const onDone   = props.onDone   || (()=>{});
  const navigate = props.navigate || (()=>{});
  const [sec, setSec] = useState(10);
  const [skippable, setSkippable] = useState(false);
  useEffect(()=>{
    const t = setInterval(()=>{
      setSec(s=>{
        if (s <= 1) {
          clearInterval(t);
          setSkippable(true);
          return 0;
        }
        if (s <= 4) setSkippable(true);
        return s-1;
      });
    }, 1000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{position:"absolute",inset:0,background:"#000",zIndex:150,display:"flex",flexDirection:"column"}}>

      <div style={{flex:1,background:`linear-gradient(135deg,#1a0a00,#0a0a1a)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:C.s2}}>
          <div style={{height:4,background:C.orange,transition:"width .1s linear",width:`${((10-sec)/10)*100}%`}}/>
        </div>
        <div style={{position:"absolute",top:12,left:14,background:"rgba(0,0,0,.6)",borderRadius:6,padding:"3px 8px"}}>
          <span style={{fontSize:10,color:"#fff",fontWeight:700}}>PUBLICIDAD</span>
        </div>
        <div style={{width:80,height:80,borderRadius:24,background:`${C.orange}20`,border:`2px solid ${C.orange}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:20}}>🏋</div>
        <p className="bb" style={{fontSize:22,color:C.white,letterSpacing:1,marginBottom:6,textAlign:"center"}}>FORZA PREMIUM</p>
        <p style={{fontSize:13,color:C.gray,textAlign:"center",padding:"0 30px",lineHeight:1.6}}>Entrená sin interrupciones. Actualizá a PRO y eliminá la publicidad para siempre.</p>
        <button onClick={()=>navigate("mi-plan")}
          style={{marginTop:18,background:C.orange,color:C.white,border:"none",borderRadius:12,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Ver planes
        </button>
      </div>

      <div style={{padding:"14px 20px 24px",background:"#000",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p style={{fontSize:11,color:C.gray}}>
          {sec > 0 ? `Podés saltear en ${sec} seg` : "Podés saltear el anuncio"}
        </p>
        <button
          onClick={()=>{ if(skippable) onDone(); }}
          style={{background:skippable?C.accent:C.s2,color:skippable?C.bg:C.gray,border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:skippable?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .3s"}}>
          {sec > 0 ? `${sec}` : "Saltear →"}
        </button>
      </div>
    </div>
  );
};

const QUOTES = [
  { text: "El dolor que sientes hoy es la fuerza que sentirás mañana.", author: "Arnold Schwarzenegger", sport: "Fisicoculturismo" },
  { text: "No cuentes los días. Haz que los días cuenten.", author: "Muhammad Ali", sport: "Boxeo" },
  { text: "Los campeones no se hacen en los gimnasios. Se hacen de cosas que llevan dentro: un deseo, un sueño, una visión.", author: "Muhammad Ali", sport: "Boxeo" },
  { text: "La diferencia entre lo imposible y lo posible reside en la determinación.", author: "Tommy Lasorda", sport: "Béisbol" },
  { text: "Si quieres algo que nunca has tenido, debes hacer algo que nunca has hecho.", author: "Ronnie Coleman", sport: "Fisicoculturismo" },
  { text: "El cuerpo logra lo que la mente cree.", author: "Jim Evans", sport: "Atletismo" },
  { text: "Cada rep, cada set, cada día. La consistencia construye imperios.", author: "Phil Heath", sport: "Fisicoculturismo" },
  { text: "Tu único límite eres tú.", author: "Usain Bolt", sport: "Atletismo" },
  { text: "Cuando crees que ya no puedes más, siempre tienes un 40% más en el tanque.", author: "David Goggins", sport: "Ultra Endurance" },
  { text: "La motivación te pone en marcha. El hábito te mantiene.", author: "Jim Ryun", sport: "Atletismo" },
  { text: "Los grandes campeones tienen increíble determinación, voluntad de ganar, e increíble nervio bajo presión.", author: "Roger Federer", sport: "Tenis" },
  { text: "No hay atajos hacia ningún lugar que valga la pena ir.", author: "Beverly Sills", sport: "Fitness" },
  { text: "Si no estás mejorando, estás retrocediendo.", author: "Greg LeMond", sport: "Ciclismo" },
  { text: "Trabaja duro en silencio. Deja que el éxito haga el ruido.", author: "Frank Ocean", sport: "Fitness" },
  { text: "El éxito no te llega. Tú vas a buscarlo.", author: "Marva Collins", sport: "Motivación" },
];

const WORKOUT_TIPS = [
  { icon: "💡", title: "Biserie", text: "En biserie trabajás músculos diferentes consecutivamente antes de descansar — máxima eficiencia y ahorro de tiempo." },
  { icon: "🔥", title: "Progresión de carga", text: "Cuando completes todas las series con buena técnica, subí 2.5kg la próxima semana. Esa es la clave del crecimiento." },
  { icon: "💧", title: "Hidratación", text: "Tomá agua entre cada set. La deshidratación del 2% ya reduce el rendimiento muscular significativamente." },
  { icon: "🧠", title: "Conexión mente-músculo", text: "Pensá en el músculo que estás trabajando durante cada rep. Los estudios muestran que mejora la activación hasta un 22%." },
  { icon: "⏱", title: "Descanso entre sets", text: "Para hipertrofia, 60-90 segundos. Para fuerza máxima, 3-5 minutos. Respetar el descanso es entrenar inteligente." },
  { icon: "📐", title: "Rango de movimiento", text: "Movimiento completo activa más fibras musculares que parciales con más peso. Priorizá la técnica siempre." },
  { icon: "😴", title: "El músculo crece al dormir", text: "Sin 7-9 horas de sueño, el 60% de tus adaptaciones musculares se pierden. El gym es el estímulo, el sueño la magia." },
  { icon: "🥩", title: "Proteína post-entreno", text: "Consumí 20-40g de proteína dentro de las 2 horas post-entreno para maximizar la síntesis muscular." },
];

function ExSVG({ id, size = 72, ac = C.accent }) {
  const d = {
    bench: <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="44" width="60" height="8" rx="4" fill={C.s3}/>
      <rect x="6" y="50" width="4" height="22" rx="2" fill={C.s3}/>
      <rect x="70" y="50" width="4" height="22" rx="2" fill={C.s3}/>
      <rect x="8" y="24" width="64" height="5" rx="2.5" fill={ac} opacity=".9"/>
      <rect x="4" y="20" width="12" height="13" rx="3" fill={ac} opacity=".55"/>
      <rect x="64" y="20" width="12" height="13" rx="3" fill={ac} opacity=".55"/>
      <ellipse cx="40" cy="38" rx="10" ry="6" fill={C.grayL} opacity=".65"/>
      <path d="M30 38 L18 27" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".8"/>
      <path d="M50 38 L62 27" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".8"/>
      <circle cx="40" cy="48" r="6" fill={C.grayL} opacity=".65"/>
    </svg>,
    legExt: <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="38" width="40" height="8" rx="4" fill={C.s3}/>
      <rect x="10" y="46" width="8" height="28" rx="4" fill={C.s3}/>
      <rect x="42" y="46" width="8" height="28" rx="4" fill={C.s3}/>
      <rect x="48" y="20" width="8" height="26" rx="4" fill={C.s3}/>
      <ellipse cx="30" cy="32" rx="9" ry="6" fill={C.grayL} opacity=".65"/>
      <circle cx="30" cy="22" r="6" fill={C.grayL} opacity=".65"/>
      <path d="M22 40 Q20 52 55 52" stroke={C.grayL} strokeWidth="5" strokeLinecap="round" fill="none" opacity=".8"/>
      <rect x="52" y="47" width="14" height="10" rx="3" fill={ac} opacity=".8"/>
    </svg>,
    facePull: <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="60" y="10" width="12" height="60" rx="4" fill={C.s3}/>
      <circle cx="66" cy="22" r="5" fill={C.s2} stroke={ac} strokeWidth="1.5" opacity=".8"/>
      <path d="M62 22 Q44 22 36 28" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity=".7"/>
      <path d="M62 22 Q44 22 36 36" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity=".7"/>
      <circle cx="26" cy="20" r="7" fill={C.grayL} opacity=".75"/>
      <rect x="20" y="28" width="12" height="18" rx="5" fill={C.grayL} opacity=".65"/>
      <path d="M30 32 L36 28" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".8"/>
      <path d="M30 36 L36 36" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".8"/>
      <path d="M22 46 L18 66" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".65"/>
      <path d="M30 46 L32 66" stroke={C.grayL} strokeWidth="4" strokeLinecap="round" opacity=".65"/>
    </svg>,
    adductor: <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="35" width="40" height="8" rx="4" fill={C.s3}/>
      <rect x="20" y="43" width="8" height="28" rx="4" fill={C.s3}/>
      <rect x="52" y="43" width="8" height="28" rx="4" fill={C.s3}/>
      <rect x="30" y="22" width="20" height="16" rx="6" fill={C.grayL} opacity=".65"/>
      <circle cx="40" cy="15" r="7" fill={C.grayL} opacity=".65"/>
      <path d="M34 38 L20 56" stroke={C.grayL} strokeWidth="5" strokeLinecap="round" opacity=".8"/>
      <path d="M46 38 L60 56" stroke={C.grayL} strokeWidth="5" strokeLinecap="round" opacity=".8"/>
      <rect x="14" y="52" width="10" height="8" rx="3" fill={ac} opacity=".8"/>
      <rect x="56" y="52" width="10" height="8" rx="3" fill={ac} opacity=".8"/>
    </svg>,
    hammerCurl: <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="14" r="7" fill={C.grayL} opacity=".75"/>
      <rect x="32" y="22" width="16" height="20" rx="6" fill={C.grayL} opacity=".65"/>
      <path d="M35 42 L32 70" stroke={C.grayL} strokeWidth="5" strokeLinecap="round" opacity=".65"/>
      <path d="M45 42 L48 70" stroke={C.grayL} strokeWidth="5" strokeLinecap="round" opacity=".65"/>
      <path d="M34 28 L20 34 L22 48" stroke={C.grayL} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".85"/>
      <rect x="14" y="45" width="14" height="6" rx="3" fill={ac} opacity=".9"/>
      <rect x="12" y="42" width="5" height="12" rx="2.5" fill={ac} opacity=".65"/>
      <rect x="23" y="42" width="5" height="12" rx="2.5" fill={ac} opacity=".65"/>
      <path d="M46 28 L58 38" stroke={C.grayL} strokeWidth="4.5" strokeLinecap="round" opacity=".55"/>
    </svg>,
  };
  return d[id] || d.bench;
};

const Pill = ({ children, color = C.accent }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:100, fontSize:10, fontWeight:700, letterSpacing:.7, textTransform:"uppercase", background:`${color}18`, color }}>
    {children}
  </span>
);

const NumInput = ({ value, onChange, min=0, max=999, label }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
    <span style={{fontSize:10,color:C.gray,letterSpacing:.8,textTransform:"uppercase",fontWeight:600}}>{label}</span>
    <div style={{ display:"flex", alignItems:"center", background:C.s2, borderRadius:12, overflow:"hidden", border:`1px solid ${C.s3}` }}>
      <button onClick={()=>onChange(Math.max(min,value-1))} style={{width:34,height:36,background:"transparent",border:"none",color:C.grayL,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>−</button>
      <span className="mono" style={{fontSize:14,color:C.white,fontWeight:700,minWidth:34,textAlign:"center"}}>{value}</span>
      <button onClick={()=>onChange(Math.min(max,value+1))} style={{width:34,height:36,background:"transparent",border:"none",color:C.grayL,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>+</button>
    </div>
  </div>
);

function WeightInput({ valueKg, onChange, weightUnit, onToggleUnit }) {
  var KG_TO_LB = 2.20462;
  var display = weightUnit === "lb"
    ? Math.round(valueKg * KG_TO_LB * 10) / 10
    : valueKg;
  function handleChange(v) {
    onChange(weightUnit === "lb" ? Math.round(v / KG_TO_LB * 10) / 10 : v);
  }
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <NumInput
        label={weightUnit === "kg" ? "Peso kg" : "Peso lb"}
        value={display}
        onChange={handleChange}
        min={0}
        max={weightUnit === "kg" ? 500 : 1100}
      />
      <button onClick={onToggleUnit} style={{
        background:`${C.accent}18`, border:`1.5px solid ${C.accent}50`,
        borderRadius:8, padding:"3px 10px", fontSize:10, fontWeight:700,
        color:C.accent, cursor:"pointer", fontFamily:"inherit", letterSpacing:.5
      }}>
        {weightUnit === "kg" ? "kg → lb" : "lb → kg"}
      </button>
    </div>
  );
}

function SvgIcon({ name, size=22, color="currentColor", sw=1.8 }) {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    dumbbell: "M6 12h12 M4 8h2v8H4z M18 8h2v8h-2z M2 10h2v4H2z M20 10h2v4h-2z",
    chart: "M22 12h-4l-3 9L9 3l-3 9H2",
    chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    play: "M5 3l14 9-14 9V3z",
    bell: "M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    send: "M22 2L11 13 M22 2L15 22 11 13 2 9 22 2",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14 M5 12h14",
    arrow: "M5 12h14 M12 5l7 7-7 7",
    back: "M19 12H5 M12 5l-7 7 7 7",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    calendar: "M3 4h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2z M16 2v4 M8 2v4 M3 10h18",
    video: "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1V5z",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    fire: "M12 2c0 0-5 5-5 10a5 5 0 0010 0c0-5-5-10-5-10z M12 12c0 0-2 2-2 4a2 2 0 004 0c0-2-2-4-2-4z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  };
  const p = paths[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {p.split(" M ").map((seg,i)=><path key={i} d={(i>0?"M ":"")+seg}/>)}
    </svg>
  );
};

function Confetti({ active }) {
  const pieces = active ? Array.from({length:60},(_,i)=>({
    id:i,
    color:["#C8FF00","#FF4466","#4488FF","#FF8840","#FFFFFF","#FFD700","#FF69B4","#00FFFF"][i%8],
    left: Math.random()*100,
    delay: Math.random()*1.2,
    dur: 1.8+Math.random()*1.4,
    size: 6+Math.random()*8,
    shape: i%3===0?"circle":i%3===1?"rect":"triangle",
  })) : [];

  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, top:-20,
          width:p.shape==="circle"?p.size:p.size*1.2,
          height:p.shape==="circle"?p.size:p.size*0.7,
          background:p.color,
          borderRadius:p.shape==="circle"?"50%":p.shape==="rect"?"3px":"0",
          clipPath:p.shape==="triangle"?"polygon(50% 0%,0% 100%,100% 100%)":"none",
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in both, confettiSway ${p.dur/2}s ${p.delay}s ease-in-out infinite`,
          opacity:.9,
        }}/>
      ))}
    </div>
  );
};

const TipCard = ({ tip }) => (
  <div style={{ background:`${C.accent}08`, borderRadius:16, padding:"13px 16px", border:`1px solid ${C.accent}22`, display:"flex", gap:12, alignItems:"flex-start" }}>
    <span style={{fontSize:20,flexShrink:0}}>{tip.icon}</span>
    <div>
      <p style={{fontSize:12,color:C.accent,fontWeight:700,marginBottom:3}}>{tip.title}</p>
      <p style={{fontSize:12,color:C.grayL,lineHeight:1.55}}>{tip.text}</p>
    </div>
  </div>
);

const QuoteCard = ({ quote, minimal=false }) => (
  <div style={{animation:"quoteSlide .5s ease both"}}>
    {minimal ? (
      <div style={{ background:C.s1, borderRadius:16, padding:"14px 18px", borderLeft:`3px solid ${C.accent}` }}>
        <p style={{fontSize:13,color:C.white,fontStyle:"italic",lineHeight:1.5,marginBottom:6}}>"{quote.text}"</p>
        <p style={{fontSize:11,color:C.accent,fontWeight:700}}>— {quote.author} · <span style={{color:C.gray,fontWeight:400}}>{quote.sport}</span></p>
      </div>
    ) : (
      <div style={{padding:"0 4px"}}>
        <p style={{fontSize:15,color:C.white,fontStyle:"italic",lineHeight:1.6,marginBottom:10,opacity:.9}}>"{quote.text}"</p>
        <p style={{fontSize:12,color:C.accent,fontWeight:700}}>— {quote.author}</p>
        <p style={{fontSize:11,color:C.gray}}>{quote.sport}</p>
      </div>
    )}
  </div>
);

const INIT_EXERCISES = [
  { id:1, name:"Pecho Plano",       muscle:"Pecho",      svgId:"bench",      sets:3, reps:12, weight:80, restSecs:180, supersetGroup:"A" },
  { id:2, name:"Sillón Cuadriceps", muscle:"Cuádriceps", svgId:"legExt",     sets:3, reps:12, weight:60, restSecs:180, supersetGroup:"A" },
  { id:3, name:"Face Pull",         muscle:"Hombros",    svgId:"facePull",   sets:3, reps:12, weight:25, restSecs:180, supersetGroup:null },
  { id:4, name:"Sillón Aductor",    muscle:"Aductores",  svgId:"adductor",   sets:3, reps:12, weight:45, restSecs:180, supersetGroup:"B" },
  { id:5, name:"Bíceps Martillo",   muscle:"Bíceps",     svgId:"hammerCurl", sets:3, reps:12, weight:16, restSecs:180, supersetGroup:"B" },
];

function buildBlocks(exs) {
  const blocks=[], seen=new Set();
  for(const ex of exs){
    if(ex.supersetGroup && !seen.has(ex.supersetGroup)){
      const g=exs.filter(e=>e.supersetGroup===ex.supersetGroup);
      blocks.push({type:"superset",label:ex.supersetGroup,exercises:g,sets:g[0].sets});
      seen.add(ex.supersetGroup);
    } else if(!ex.supersetGroup){
      blocks.push({type:"single",exercises:[ex],sets:ex.sets});
    }
  }
  return blocks;
}

function RestTimer({ totalSecs, onDone, nextName }) {
  const [rem,setRem]=useState(totalSecs);
  const ref=useRef(null);
  useEffect(()=>{
    ref.current=setInterval(()=>setRem(r=>{
      if(r<=1){clearInterval(ref.current);onDone();return 0;}
      return r-1;
    }),1000);
    return ()=>clearInterval(ref.current);
  },[]);
  const circ=2*Math.PI*52, pct=rem/totalSecs;
  const mm=Math.floor(rem/60), ss=rem%60;
  const tipIdx=Math.floor(Math.random()*WORKOUT_TIPS.length);

  return (
    <div className="scale-in" style={{padding:"28px 22px",display:"flex",flexDirection:"column",gap:22,alignItems:"center"}}>
      <Pill color={C.blue}>⏸ Descanso activo</Pill>
      <p style={{fontSize:13,color:C.gray,textAlign:"center"}}>Siguiente: <strong style={{color:C.white}}>{nextName}</strong></p>

      <div style={{position:"relative",width:130,height:130}}>
        <svg width="130" height="130" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="52" fill="none" stroke={C.s2} strokeWidth="7"/>
          <circle cx="56" cy="56" r="52" fill="none" stroke={C.accent} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
            strokeLinecap="round" transform="rotate(-90 56 56)"
            style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span className="mono" style={{fontSize:32,color:C.white,fontWeight:700,lineHeight:1}}>{mm}:{String(ss).padStart(2,"0")}</span>
          <span style={{fontSize:10,color:C.gray,marginTop:3}}>restantes</span>
        </div>
      </div>

      <TipCard tip={WORKOUT_TIPS[tipIdx]} />

      <button onClick={()=>{clearInterval(ref.current);onDone();}} style={{ background:"transparent",border:`1.5px solid ${C.s3}`,borderRadius:14,padding:"11px 26px",color:C.grayL,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
        Saltar descanso →
      </button>
    </div>
  );
};

function ActiveWorkout({ blocks, onFinish }) {
  const [bIdx,setBIdx]=useState(0);
  const [sIdx,setSIdx]=useState(0);
  const [eIdx,setEIdx]=useState(0);
  const [phase,setPhase]=useState("preview");
  const [done,setDone]=useState({});
  const [confetti,setConfetti]=useState(false);

  const totalSets=blocks.reduce((s,b)=>s+b.sets,0);
  const doneCnt=Object.keys(done).length;
  const block=blocks[bIdx];
  const ex=(block&&block.exercises[eIdx]);
  const isSuper=(block&&block.type==="superset");
  const lastExInBlock=eIdx===(block?block.exercises.length-1:0);
  const lastSet=sIdx===(block?block.sets-1:0);
  const lastBlock=bIdx===blocks.length-1;

  const nextName=()=>{
    if(!lastSet) return block.exercises[0].name+(isSuper?" (set "+(sIdx+2)+")":"");
    if(!lastBlock) return blocks[bIdx+1].exercises[0].name;
    return null;
  };

  const showConfetti=()=>{
    setConfetti(true);
    setTimeout(()=>setConfetti(false),2800);
  };

  const finishEx=()=>{
    if(isSuper && !lastExInBlock){ setEIdx(e=>e+1); setPhase("preview"); return; }
    const key=`${bIdx}-${sIdx}`;
    setDone(p=>({...p,[key]:true}));
    if(isSuper || (lastSet && lastBlock)) showConfetti();
    if(lastSet && lastBlock){ setPhase("done"); return; }
    setPhase("resting");
  };

  const restDone=()=>{
    setEIdx(0);
    if(lastSet){ setBIdx(b=>b+1); setSIdx(0); }
    else setSIdx(s=>s+1);
    setPhase("preview");
  };

  if(phase==="done"||!block) return (
    <div className="scale-in" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"28px 22px",textAlign:"center",gap:20}}>
      <Confetti active={true}/>
      <div style={{fontSize:72,animation:"popIn .5s .2s ease both",display:"block"}}>🏆</div>
      <div>
        <h2 className="bb" style={{fontSize:56,color:C.accent,letterSpacing:2}}>¡COMPLETADO!</h2>
        <p style={{color:C.grayL,fontSize:15,marginTop:4}}>Entrenamiento finalizado</p>
      </div>
      <QuoteCard quote={QUOTES[Math.floor(Math.random()*QUOTES.length)]} minimal />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,width:"100%"}}>
        {[["Sets",totalSets],["Ejercicios",blocks.reduce((s,b)=>s+b.exercises.length,0)],["Vol.",`${Math.round(blocks.reduce((s,b)=>s+b.exercises.reduce((ss,e)=>ss+e.sets*e.reps*e.weight,0),0)/1000*10)/10}t`]].map(([l,v])=>(
          <div key={l} style={{background:C.s1,borderRadius:14,padding:"14px 8px",textAlign:"center"}}>
            <p className="mono" style={{fontSize:20,color:C.accent,fontWeight:700}}>{v}</p>
            <p style={{fontSize:11,color:C.gray,marginTop:3}}>{l}</p>
          </div>
        ))}
      </div>
      <button onClick={onFinish} style={{background:C.accent,color:C.bg,border:"none",borderRadius:16,padding:"16px 44px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
        Finalizar sesión
      </button>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <Confetti active={confetti}/>

      <div style={{ padding:"14px 18px 12px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0 }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>
              {isSuper?`BISERIE ${block.label}`:"Ejercicio simple"}
            </p>
            <p className="bb" style={{fontSize:24,color:C.white,letterSpacing:.5}}>
              Set {sIdx+1} <span style={{color:C.gray}}>/ {block.sets}</span>
            </p>
          </div>
          <button onClick={onFinish} style={{background:C.s2,border:"none",borderRadius:10,padding:"6px 14px",color:C.grayL,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
        </div>
        <div style={{height:4,background:C.s2,borderRadius:2,overflow:"hidden"}}>
          <div style={{ height:"100%",width:`${(doneCnt/totalSets)*100}%`,background:`linear-gradient(90deg,${C.accent},#90FF40)`,borderRadius:2,transition:"width .5s ease" }}/>
        </div>
        <p style={{fontSize:10,color:C.gray,marginTop:3}}>{doneCnt}/{totalSets} sets completados</p>
      </div>


      <div style={{flex:1,overflowY:"auto"}}>
        {phase==="resting" ? (
          <RestTimer totalSecs={ex.restSecs} onDone={restDone} nextName={nextName()||"Finalizar"} />
        ):(
          <div className="fade-up" style={{padding:"18px 18px 24px"}}>

            {isSuper && (
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {block.exercises.map((e,i)=>(
                  <div key={e.id} style={{ flex:1,padding:"8px 10px",borderRadius:12,border:`1.5px solid ${i===eIdx?C.accent:C.s3}`,background:i===eIdx?`${C.accent}10`:C.s1,textAlign:"center",transition:"all .3s" }}>
                    <p style={{fontSize:9,color:i===eIdx?C.accent:C.gray,fontWeight:700,letterSpacing:.5}}>{i===eIdx?"● AHORA":i<eIdx?"✓":"○ NEXT"}</p>
                    <p style={{fontSize:11,color:i===eIdx?C.white:C.gray,fontWeight:600,marginTop:2}}>{e.name}</p>
                  </div>
                ))}
              </div>
            )}


            <div style={{ background:`linear-gradient(135deg,${C.s1} 0%,${C.s0} 100%)`,borderRadius:22,padding:20,border:`1px solid ${phase==="active"?C.accent+"50":C.s2}`,marginBottom:18,transition:"border-color .3s",position:"relative",overflow:"hidden" }}>
              {phase==="active" && <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${C.accent}08 0%,transparent 70%)`,pointerEvents:"none" }}/>}
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{ width:88,height:88,background:C.s2,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${C.s3}` }}>
                  <ExSVG id={ex.svgId} size={72} ac={phase==="active"?C.accent:C.accentD}/>
                </div>
                <div style={{flex:1}}>
                  <Pill color={C.blue}>{ex.muscle}</Pill>
                  <h2 className="bb" style={{fontSize:28,color:C.white,letterSpacing:.5,marginTop:5,lineHeight:1}}>{ex.name}</h2>
                  <div style={{display:"flex",gap:14,marginTop:10}}>
                    {[["Reps",ex.reps],["Series",ex.sets],["Peso",`${ex.weight}kg`]].map(([l,v])=>(
                      <div key={l}>
                        <span className="mono" style={{fontSize:18,color:C.accent,fontWeight:700}}>{v}</span>
                        <span style={{fontSize:10,color:C.gray,marginLeft:3}}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {phase==="active" && isSuper && !lastExInBlock && (
                <div style={{ marginTop:14,padding:"11px 14px",background:`${C.accent}10`,borderRadius:12,border:`1px solid ${C.accent}25` }}>
                  <p style={{fontSize:12,color:C.accent,fontWeight:600}}>Siguiente sin descanso → <span style={{color:C.white}}>{block.exercises[eIdx+1].name}</span></p>
                </div>
              )}
            </div>


            <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:18}}>
              {Array.from({length:block.sets}).map((_,i)=>(
                <div key={i} style={{ width:i===sIdx?28:10,height:10,borderRadius:5,background:i<sIdx?C.accent:i===sIdx?`${C.accent}70`:C.s3,transition:"all .3s" }}/>
              ))}
            </div>


            {phase==="preview" ? (
              <button className="pulsing" onClick={()=>setPhase("active")} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:18,padding:"17px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                ▶  INICIAR EJERCICIO
              </button>
            ):(
              <button onClick={finishEx} style={{ width:"100%",background:`linear-gradient(135deg,${C.accent},#90FF40)`,color:C.bg,border:"none",borderRadius:18,padding:"17px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5 }}>
                ✓  {isSuper&&!lastExInBlock?"SIGUIENTE EJERCICIO →":"FINALIZAR SET"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function EditRoutine({ exercises, onChange, onBack }) {
  const [exs,setExs]=useState(exercises.map(e=>({...e})));
  const [editId,setEditId]=useState(null);
  const [groupMode,setGroupMode]=useState(false);
  const [sel,setSel]=useState([]);
  const [msg,setMsg]=useState("");
  const LETTERS=["A","B","C","D","E"];
  const used=[...new Set(exs.filter(e=>e.supersetGroup).map(e=>e.supersetGroup))];
  const nextLetter=LETTERS.find(l=>!used.includes(l))||"X";

  const upd=(id,f,v)=>setExs(p=>p.map(e=>e.id===id?{...e,[f]:v}:e));
  const save=()=>{onChange(exs);onBack();};

  const createBiserie=()=>{
    if(sel.length<2){setMsg("Seleccioná al menos 2 ejercicios");return;}
    setExs(p=>p.map(e=>sel.includes(e.id)?{...e,supersetGroup:nextLetter}:e));
    setSel([]);setGroupMode(false);
    setMsg(`✓ Biserie ${nextLetter} creada`);setTimeout(()=>setMsg(""),2500);
  };

  const editEx=exs.find(e=>e.id===editId);
  const [weightUnit, setWeightUnit] = useState("kg");
  const toggleWeightUnit = () => setWeightUnit(u => u === "kg" ? "lb" : "kg");

  if(editId && editEx) return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{ padding:"14px 18px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0 }}>
        <button onClick={()=>setEditId(null)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:"4px 0",marginBottom:8}}>
          <SvgIcon name="back" size={17} color={C.grayL}/> Volver
        </button>
        <h2 className="bb" style={{fontSize:28,letterSpacing:.5}}>{editEx.name}</h2>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"18px"}}>
        <div style={{background:C.s1,borderRadius:20,padding:18,marginBottom:18,display:"flex",gap:16,alignItems:"center"}}>
          <div style={{width:88,height:88,background:C.s2,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <ExSVG id={editEx.svgId} size={72}/>
          </div>
          <div>
            <Pill color={C.blue}>{editEx.muscle}</Pill>
            <p style={{color:C.grayL,fontSize:12,marginTop:8,lineHeight:1.6}}>Progresión recomendada: +2.5kg cuando completes todas las series con buena técnica.</p>
          </div>
        </div>
        <div style={{background:C.s1,borderRadius:20,padding:20,marginBottom:14}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:.8,textTransform:"uppercase",marginBottom:18}}>Variables de carga</p>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            <NumInput label="Series" value={editEx.sets} onChange={v=>upd(editEx.id,"sets",v)} min={1} max={8}/>
            <NumInput label="Reps" value={editEx.reps} onChange={v=>upd(editEx.id,"reps",v)} min={1} max={30}/>
            <WeightInput valueKg={editEx.weight} onChange={v=>upd(editEx.id,"weight",v)} weightUnit={weightUnit} onToggleUnit={toggleWeightUnit}/>
          </div>
        </div>
        <div style={{background:C.s1,borderRadius:20,padding:18,marginBottom:14}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:.8,textTransform:"uppercase",marginBottom:14}}>Descanso entre sets</p>
          <div style={{display:"flex",gap:8}}>
            {[60,90,120,180,240].map(s=>(
              <button key={s} onClick={()=>upd(editEx.id,"restSecs",s)} style={{ flex:1,padding:"9px 0",borderRadius:11,border:`1.5px solid ${editEx.restSecs===s?C.accent:C.s3}`,background:editEx.restSecs===s?`${C.accent}18`:C.s2,color:editEx.restSecs===s?C.accent:C.grayL,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                {s===60?"1m":s===90?"1.5m":s===120?"2m":s===180?"3m":"4m"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background:`${C.accent}08`,borderRadius:14,padding:"12px 16px",border:`1px solid ${C.accent}20`,marginBottom:14 }}>
          <p style={{fontSize:12,color:C.accent,fontWeight:600}}>
            Volumen total: <span className="mono">{weightUnit === "lb" ? Math.round(editEx.sets*editEx.reps*editEx.weight*2.20462) : editEx.sets*editEx.reps*editEx.weight}{weightUnit}</span>
            <span style={{color:C.gray,marginLeft:8,fontWeight:400,fontSize:11}}>({editEx.sets}×{editEx.reps}×{editEx.weight}kg)</span>
          </p>
        </div>
        <TipCard tip={WORKOUT_TIPS[0]}/>
      </div>
      <div style={{ padding:"14px 18px",borderTop:`1px solid ${C.s2}`,flexShrink:0 }}>
        <button onClick={()=>setEditId(null)} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Guardar cambios</button>
      </div>
    </div>
  );
  const rendered=new Set(), rows=[];
  for(const ex of exs){
    if(ex.supersetGroup&&!rendered.has(ex.supersetGroup)){
      rows.push({type:"superset",group:ex.supersetGroup,items:exs.filter(e=>e.supersetGroup===ex.supersetGroup)});
      rendered.add(ex.supersetGroup);
    } else if(!ex.supersetGroup) rows.push({type:"single",items:[ex]});
  }

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{ padding:"14px 18px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0 }}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:"4px 0",marginBottom:8}}>
          <SvgIcon name="back" size={17} color={C.grayL}/> Volver
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 className="bb" style={{fontSize:30,letterSpacing:.5}}>ARMAR RUTINA</h2>
          <button onClick={()=>{setGroupMode(!groupMode);setSel([]);}} style={{ padding:"7px 12px",borderRadius:11,border:`1.5px solid ${groupMode?C.accent:C.s3}`,background:groupMode?`${C.accent}18`:C.s2,color:groupMode?C.accent:C.grayL,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            {groupMode?"✕ Cancelar":"⊕ Biserie"}
          </button>
        </div>
        {groupMode&&<p style={{fontSize:11,color:C.accent,marginTop:8}}>Seleccioná 2+ ejercicios para agrupar en biserie</p>}
        {msg&&<p style={{fontSize:11,color:C.accent,marginTop:5,fontWeight:700}}>{msg}</p>}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
        {rows.map((row,ri)=>(
          <div key={ri} style={{marginBottom:10}}>
            {row.type==="superset"&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,paddingLeft:4}}>
                <div style={{background:C.accent,borderRadius:7,padding:"2px 9px"}}>
                  <span className="bb" style={{fontSize:12,color:C.bg,letterSpacing:1}}>BISERIE {row.group}</span>
                </div>
                <div style={{ flex:1,height:1,background:`${C.accent}25` }}/>
                <span style={{fontSize:10,color:C.gray}}>sin descanso entre →</span>
              </div>
            )}
            {row.items.map((ex,ei)=>{
              const isSel=sel.includes(ex.id);
              return (
                <div key={ex.id} onClick={groupMode?()=>setSel(p=>p.includes(ex.id)?p.filter(x=>x!==ex.id):[...p,ex.id]):undefined}
                  style={{ display:"flex",gap:11,alignItems:"center",background:isSel?`${C.accent}15`:C.s1,borderRadius:15,padding:"11px 13px",marginBottom:row.type==="superset"&&ei<row.items.length-1?3:8,border:`1.5px solid ${isSel?C.accent:ex.supersetGroup?`${C.accent}22`:C.s2}`,cursor:groupMode?"pointer":"default",transition:"all .2s" }}>
                  {groupMode&&<div style={{ width:20,height:20,borderRadius:6,border:`2px solid ${isSel?C.accent:C.s3}`,background:isSel?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{isSel&&<span style={{fontSize:11,color:C.bg}}>✓</span>}</div>}
                  <div style={{width:52,height:52,background:C.s2,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ExSVG id={ex.svgId} size={42}/></div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:3}}>{ex.name}</p>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span className="mono" style={{fontSize:12,color:C.accent}}>{ex.sets}×{ex.reps}</span>
                      <span className="mono" style={{fontSize:12,color:C.grayL}}>{ex.weight}kg</span>
                      <Pill color={C.blue}>{ex.muscle}</Pill>
                    </div>
                  </div>
                  {!groupMode&&(
                    <div style={{display:"flex",gap:5}}>
                      {ex.supersetGroup&&<button onClick={()=>setExs(p=>p.map(e=>e.id===ex.id?{...e,supersetGroup:null}:e))} style={{ width:30,height:30,borderRadius:8,background:"transparent",border:`1px solid ${C.red}40`,color:C.red,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>✕</button>}
                      <button onClick={()=>setEditId(ex.id)} style={{ width:30,height:30,borderRadius:8,background:C.s2,border:`1px solid ${C.s3}`,color:C.grayL,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>✏</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ border:`1.5px dashed ${C.s3}`,borderRadius:14,padding:14,textAlign:"center",cursor:"pointer" }}>
          <p style={{color:C.gray,fontSize:13}}>+ Agregar ejercicio</p>
        </div>
      </div>

      <div style={{ padding:"13px 18px",borderTop:`1px solid ${C.s2}`,flexShrink:0 }}>
        {groupMode?(
          <button onClick={createBiserie} disabled={sel.length<2} style={{width:"100%",background:sel.length>=2?C.accent:C.s2,color:sel.length>=2?C.bg:C.gray,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:sel.length>=2?"pointer":"not-allowed",fontFamily:"inherit"}}>
            Crear biserie ({sel.length} seleccionados)
          </button>
        ):(
          <button onClick={save} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Guardar rutina
          </button>
        )}
      </div>
    </div>
  );
};

const EX_TIPS = {
  bench: {
    ejecucion: ["Espalda con leve arco natural apoyada en el banco","Agarre un poco más ancho que los hombros","Bajá la barra hasta rozar el pecho, controlando 2-3 seg","Empujá explosivamente hacia arriba sin despegar los glúteos"],
    errores:   ["No rebotar la barra en el pecho","No arquear la espalda de forma exagerada","No levantar los pies del suelo"],
    musculos:  ["Pectoral mayor (principal)","Deltoides anterior","Tríceps braquial"],
    consejo:   "Imaginá que intentás 'romper la barra' hacia afuera — activa mejor el pectoral y protege los codos.",
  },
  legExt: {
    ejecucion: ["Sentate bien al fondo del asiento, rodillas al borde","Apoyá los tobillos debajo del rodillo","Extendé completamente las piernas, apretá el cuádriceps arriba","Bajá controlado sin soltar el peso de golpe"],
    errores:   ["No usar impulso ni balancear el torso","No parar a mitad del recorrido","No bajar demasiado rápido"],
    musculos:  ["Cuádriceps (recto femoral, vasto)"],
    consejo:   "En el punto más alto, sostenés 1 segundo apretando el cuádriceps — eso maximiza la contracción.",
  },
  facePull: {
    ejecucion: ["Polea alta con cuerda, agarre neutro","Tirá hacia tu cara separando los codos hacia afuera","Llevá las manos a la altura de las orejas","Retracción escapular al final del movimiento"],
    errores:   ["No tirar hacia el cuello (lesión cervical)","No dejar los codos caer por debajo de los hombros","No usar demasiado peso — es un ejercicio de control"],
    musculos:  ["Deltoides posterior","Manguito rotador","Trapecio medio y romboides"],
    consejo:   "Es el ejercicio preventivo más importante para los hombros. Priorizá la técnica sobre el peso.",
  },
  adductor: {
    ejecucion: ["Sentate con la espalda recta y apoyada","Poné los rodillos sobre la cara interna de los muslos","Juntá las piernas contra la resistencia de forma controlada","Abrí lentamente sin soltar el control"],
    errores:   ["No usar rebote en el punto de cierre","No despegar la espalda del respaldo","No abrir más allá del rango cómodo"],
    musculos:  ["Aductores (largo, corto, mayor)","Grácil","Pectíneo"],
    consejo:   "Hacé el movimiento en 2 tiempos: 2 seg. cerrando, 3 seg. abriendo. Controlás más fibras así.",
  },
  hammerCurl: {
    ejecucion: ["Agarre neutro (palmas enfrentadas), codos pegados al torso","Subí el peso sin girar la muñeca","Bajá lentamente en 2-3 segundos","No balancees el cuerpo para ayudarte"],
    errores:   ["No mover los codos hacia adelante al subir","No soltar el peso hacia abajo — controlá siempre","No usar momentum del torso"],
    musculos:  ["Bíceps braquial (cabeza larga)","Braquial anterior","Braquiorradial"],
    consejo:   "El hammer curl trabaja más el braquial que el bíceps clásico — clave para el grosor del brazo.",
  },
};

function ExercisePreviewSheet({ exercise, onClose }) {
  const [tab, setTab] = useState("ejecucion");
  const tips = EX_TIPS[exercise.svgId] || EX_TIPS.bench;

  return (
    <div style={{position:"absolute",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>

      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(4px)"}}/>

      <div className="slide-up" style={{ position:"relative",background:C.s0,borderRadius:"28px 28px 0 0",border:`1px solid ${C.s2}`,borderBottom:"none",maxHeight:"88%",display:"flex",flexDirection:"column",overflow:"hidden" }}>

        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:C.s3}}/>
        </div>


        <div style={{ padding:"8px 20px 14px",borderBottom:`1px solid ${C.s2}`,flexShrink:0 }}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{ width:72,height:72,background:C.s2,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${C.s3}` }}>
              <ExSVG id={exercise.svgId} size={58} ac={C.accent}/>
            </div>
            <div style={{flex:1}}>
              <h3 className="bb" style={{fontSize:26,color:C.white,letterSpacing:.5,lineHeight:1,marginBottom:4}}>{exercise.name}</h3>
              <Pill color={C.blue}>{exercise.muscle}</Pill>
              <div style={{display:"flex",gap:12,marginTop:8}}>
                {[["Sets",exercise.sets],["Reps",exercise.reps],["Peso",`${exercise.weight}kg`]].map(([l,v])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <span className="mono" style={{fontSize:15,color:C.accent,fontWeight:700,display:"block"}}>{v}</span>
                    <span style={{fontSize:9,color:C.gray}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:10,background:C.s2,border:"none",color:C.grayL,fontSize:18,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
          </div>
        </div>


        <div style={{ display:"flex",gap:0,padding:"0 20px",borderBottom:`1px solid ${C.s2}`,flexShrink:0 }}>
          {[{id:"ejecucion",label:"▶ Ejecución"},{id:"errores",label:"⚠ Errores"},{id:"musculos",label:"💪 Músculos"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,padding:"11px 0",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:tab===t.id?C.accent:C.gray,borderBottom:tab===t.id?`2px solid ${C.accent}`:"2px solid transparent",transition:"all .2s",letterSpacing:.3 }}>
              {t.label}
            </button>
          ))}
        </div>


        <div style={{flex:1,overflowY:"auto",padding:"16px 20px 24px"}}>

          {tab==="ejecucion" && (
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
                {tips.ejecucion.map((step,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:26,height:26,borderRadius:8,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                      <span className="mono" style={{fontSize:11,color:C.bg,fontWeight:700}}>{i+1}</span>
                    </div>
                    <p style={{fontSize:14,color:C.white,lineHeight:1.55,flex:1}}>{step}</p>
                  </div>
                ))}
              </div>

              <div style={{ background:`${C.accent}10`,border:`1px solid ${C.accent}30`,borderRadius:16,padding:"13px 16px",display:"flex",gap:10 }}>
                <span style={{fontSize:18,flexShrink:0}}>🧠</span>
                <div>
                  <p style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:3}}>PRO TIP</p>
                  <p style={{fontSize:13,color:C.grayL,lineHeight:1.55}}>{tips.consejo}</p>
                </div>
              </div>
            </div>
          )}

          {tab==="errores" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{ background:`${C.red}08`,border:`1px solid ${C.red}25`,borderRadius:14,padding:"11px 14px",marginBottom:6 }}>
                <p style={{fontSize:12,color:C.red,fontWeight:600}}>Evitá estos errores comunes para prevenir lesiones y maximizar resultados.</p>
              </div>
              {tips.errores.map((err,i)=>(
                <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",background:C.s1,borderRadius:14,padding:"12px 14px",border:`1px solid ${C.s2}` }}>
                  <div style={{ width:26,height:26,borderRadius:8,background:`${C.red}15`,border:`1.5px solid ${C.red}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <span style={{fontSize:12}}>✕</span>
                  </div>
                  <p style={{fontSize:14,color:C.grayL,lineHeight:1.5,flex:1}}>{err}</p>
                </div>
              ))}
            </div>
          )}

          {tab==="musculos" && (
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
                {tips.musculos.map((m,i)=>(
                  <div key={i} style={{ display:"flex",gap:12,alignItems:"center",background:C.s1,borderRadius:13,padding:"12px 14px",border:`1px solid ${C.s2}` }}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:i===0?C.accent:i===1?C.blue:C.grayL,flexShrink:0}}/>
                    <p style={{fontSize:14,color:C.white,flex:1}}>{m}</p>
                    {i===0 && <Pill color={C.accent}>Principal</Pill>}
                  </div>
                ))}
              </div>
              <div style={{background:C.s2,borderRadius:18,padding:16,display:"flex",alignItems:"center",justifyContent:"center",height:130}}>
                <ExSVG id={exercise.svgId} size={100} ac={C.accent}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function RoutineSelector({ currentName, onSelect, onClose }) {
  const options = [
    { nombre:"Push Day A",  musculos:"Pecho · Cuádriceps · Hombros", exercises:INIT_EXERCISES,                 tipo:"fuerza"  },
    { nombre:"Pull Day",    musculos:"Espalda · Bíceps · Femorales",  exercises:INIT_EXERCISES.slice(2,5),     tipo:"espalda" },
    { nombre:"Leg Day",     musculos:"Cuádriceps · Glúteos",          exercises:INIT_EXERCISES.slice(0,2),     tipo:"piernas" },
    { nombre:"Upper Body",  musculos:"Pecho · Espalda · Hombros",     exercises:INIT_EXERCISES.slice(1,4),     tipo:"fuerza"  },
    { nombre:"Full Body A", musculos:"Cuerpo completo",               exercises:INIT_EXERCISES,                tipo:"fullbody"},
  ];
  return (
    <div style={{position:"absolute",inset:0,zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(3px)"}}/>
      <div className="slide-up" style={{ position:"relative",background:C.s0,borderRadius:"28px 28px 0 0",border:`1px solid ${C.s2}`,borderBottom:"none",maxHeight:"70%",display:"flex",flexDirection:"column" }}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px",flexShrink:0}}>
          <div style={{width:40,height:4,borderRadius:2,background:C.s3}}/>
        </div>
        <div style={{ padding:"8px 20px 14px",borderBottom:`1px solid ${C.s2}`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <h3 className="bb" style={{fontSize:24,color:C.white,letterSpacing:.5}}>CAMBIAR RUTINA</h3>
            <p style={{fontSize:12,color:C.gray,marginTop:2}}>Seleccioná el entrenamiento de hoy</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:10,background:C.s2,border:"none",color:C.grayL,fontSize:18,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 20px 24px"}}>
          {options.map((opt,i)=>{
            const isCurrent = opt.nombre === currentName;
            const col = TIPO_COLORS[opt.tipo] || C.accent;
            return (
              <div key={i} onClick={()=>{ onSelect(opt.exercises, opt.nombre); onClose(); }}
                style={{ display:"flex",gap:12,alignItems:"center",background:isCurrent?`${col}14`:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${isCurrent?col:C.s2}`,cursor:"pointer",transition:"all .2s" }}>
                <div style={{ width:44,height:44,borderRadius:13,background:`${col}18`,border:`1.5px solid ${col}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <span style={{fontSize:20}}>{["💪","🏋","🦵","⚡","💥"][i]}</span>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:15,color:isCurrent?col:C.white}}>{opt.nombre}</p>
                  <p style={{fontSize:12,color:C.gray,marginTop:2}}>{opt.musculos}</p>
                  <p style={{fontSize:11,color:C.gray,marginTop:2}}>{opt.exercises.length} ejercicios · {opt.exercises.reduce((s,e)=>s+e.sets,0)} sets</p>
                </div>
                {isCurrent ? <Pill color={col}>Actual</Pill> : <SvgIcon name="arrow" size={16} color={C.gray}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function RutinaDelDia(props) {
  const exercises = props.exercises;
  const routineName = props.routineName;
  const onStart = props.onStart;
  const onEdit = props.onEdit;
  const onChangeRoutine = props.onChangeRoutine;
  const onPreviewExercise = props.onPreviewExercise;
  const blocks    = buildBlocks(exercises);
  const totalSets = exercises.reduce((s,e)=>s+e.sets,0);
  const estMin    = Math.round(totalSets * 1.5 + blocks.length * 3);
  const supersetGroups = [...new Set(exercises.map(e=>e.supersetGroup).filter(Boolean))];
  const rendered  = new Set();
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadPDF = () => {
    setPdfLoading(true);
    var loadJsPDF = function(cb) {
      if (window.jspdf) { cb(); return; }
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = function() { cb(); };
      s.onerror = function() { setPdfLoading(false); alert("Error al cargar generador de PDF"); };
      document.head.appendChild(s);
    };
    loadJsPDF(function() {
      try {
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
        var W = 210; var H = 297;
        var accent = "#C8FF00"; var bg = "#080810"; var s1 = "#12121E"; var s2 = "#1C1C2E";
        var white = "#F0F0FF"; var gray = "#6868A0"; var blue = "#4488FF";
        var today = new Date();
        var days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
        var months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        var dateStr = days[today.getDay()] + " " + today.getDate() + " de " + months[today.getMonth()] + " " + today.getFullYear();

        // === BACKGROUND ===
        doc.setFillColor(8, 8, 16);
        doc.rect(0, 0, W, H, "F");

        // === TOP ACCENT BAR ===
        doc.setFillColor(200, 255, 0);
        doc.rect(0, 0, W, 3, "F");

        // === LOGO AREA ===
        doc.setFillColor(200, 255, 0);
        doc.roundedRect(14, 10, 14, 14, 3, 3, "F");
        doc.setTextColor(8, 8, 16);
        doc.setFontSize(18); doc.setFont("helvetica","bold");
        doc.text("Z", 21, 20.5, { align:"center" });

        doc.setTextColor(240, 240, 255);
        doc.setFontSize(28); doc.setFont("helvetica","bold");
        doc.text("FORZA", 32, 21);

        doc.setTextColor(104, 104, 160);
        doc.setFontSize(7); doc.setFont("helvetica","normal");
        doc.text("TRAIN SMART. LIVE STRONG.", 32, 26);

        // Date chip
        doc.setFillColor(28, 28, 46);
        doc.roundedRect(W - 70, 10, 56, 8, 2, 2, "F");
        doc.setTextColor(152, 152, 192);
        doc.setFontSize(7); doc.setFont("helvetica","normal");
        doc.text(dateStr, W - 42, 15, { align:"center" });

        // === DIVIDER ===
        doc.setDrawColor(200, 255, 0);
        doc.setLineWidth(0.5);
        doc.line(14, 30, W - 14, 30);

        // === ROUTINE TITLE ===
        doc.setTextColor(200, 255, 0);
        doc.setFontSize(9); doc.setFont("helvetica","bold");
        doc.text("RUTINA DEL DIA", 14, 40);

        doc.setTextColor(240, 240, 255);
        doc.setFontSize(22); doc.setFont("helvetica","bold");
        doc.text(routineName.toUpperCase(), 14, 50);

        // Muscles involved
        var muscles = exercises.map(function(e){ return e.muscle; }).filter(function(v,i,a){ return a.indexOf(v)===i; }).join("  ·  ");
        doc.setTextColor(104, 104, 160);
        doc.setFontSize(8); doc.setFont("helvetica","normal");
        doc.text(muscles, 14, 57);

        // === STATS ROW ===
        var stats = [
          { icon:"~"+estMin+" min", label:"DURACIÓN" },
          { icon:exercises.length+" ejerc.", label:"EJERCICIOS" },
          { icon:totalSets+" sets", label:"SETS TOTALES" },
        ];
        stats.forEach(function(st, si) {
          var bx = 14 + si * 61; var by = 62;
          doc.setFillColor(18, 18, 30);
          doc.roundedRect(bx, by, 57, 14, 2, 2, "F");
          doc.setTextColor(200, 255, 0);
          doc.setFontSize(10); doc.setFont("helvetica","bold");
          doc.text(st.icon, bx + 28.5, by + 7, { align:"center" });
          doc.setTextColor(104, 104, 160);
          doc.setFontSize(6); doc.setFont("helvetica","normal");
          doc.text(st.label, bx + 28.5, by + 11.5, { align:"center" });
        });

        // === SECTION TITLE ===
        var y = 85;
        doc.setTextColor(104, 104, 160);
        doc.setFontSize(7); doc.setFont("helvetica","bold");
        doc.text("EJERCICIOS", 14, y);
        doc.setDrawColor(28, 28, 46);
        doc.setLineWidth(0.3);
        doc.line(14, y + 2, W - 14, y + 2);
        y += 7;

        // === EXERCISES ===
        var groupColors = { A:"#C8FF00", B:"#4488FF", C:"#FF8840", D:"#A78BFA", E:"#FF4466" };

        exercises.forEach(function(ex, idx) {
          if (y > H - 50) {
            doc.addPage();
            doc.setFillColor(8, 8, 16);
            doc.rect(0, 0, W, H, "F");
            doc.setFillColor(200, 255, 0);
            doc.rect(0, 0, W, 2, "F");
            y = 14;
          }

          var cardH = 22;
          doc.setFillColor(18, 18, 30);
          doc.roundedRect(14, y, W - 28, cardH, 3, 3, "F");

          // Left accent line (superset or index)
          if (ex.supersetGroup) {
            var gc = groupColors[ex.supersetGroup] || "#C8FF00";
            var gcR = parseInt(gc.slice(1,3),16); var gcG = parseInt(gc.slice(3,5),16); var gcB = parseInt(gc.slice(5,7),16);
            doc.setFillColor(gcR, gcG, gcB);
            doc.roundedRect(14, y, 3, cardH, 1, 1, "F");
          } else {
            doc.setFillColor(28, 28, 46);
            doc.roundedRect(14, y, 3, cardH, 1, 1, "F");
          }

          // Exercise number
          doc.setFillColor(28, 28, 46);
          doc.roundedRect(20, y + 4, 8, 8, 1.5, 1.5, "F");
          doc.setTextColor(104, 104, 160);
          doc.setFontSize(7); doc.setFont("helvetica","bold");
          doc.text(String(idx + 1), 24, y + 9.5, { align:"center" });

          // Exercise name
          doc.setTextColor(240, 240, 255);
          doc.setFontSize(10); doc.setFont("helvetica","bold");
          doc.text(ex.name, 32, y + 9);

          // Muscle pill
          doc.setFillColor(68, 136, 255, 0.15);
          doc.setFillColor(20, 30, 50);
          doc.roundedRect(32, y + 11, ex.muscle.length * 1.8 + 4, 5.5, 1, 1, "F");
          doc.setTextColor(68, 136, 255);
          doc.setFontSize(6); doc.setFont("helvetica","bold");
          doc.text(ex.muscle.toUpperCase(), 34, y + 15);

          // Superset badge
          if (ex.supersetGroup) {
            var gc2 = groupColors[ex.supersetGroup] || "#C8FF00";
            var gc2R = parseInt(gc2.slice(1,3),16); var gc2G = parseInt(gc2.slice(3,5),16); var gc2B = parseInt(gc2.slice(5,7),16);
            doc.setTextColor(gc2R, gc2G, gc2B);
            doc.setFontSize(6); doc.setFont("helvetica","bold");
            doc.text("BISERIE " + ex.supersetGroup, 80, y + 9);
          }

          // Stats on the right
          var statsData = [
            { v: String(ex.sets), l:"SERIES" },
            { v: String(ex.reps), l:"REPS" },
            { v: ex.weight > 0 ? ex.weight+"kg" : "—", l:"PESO" },
            { v: ex.restSecs ? (ex.restSecs/60)+"m" : "3m", l:"DESCANSO" }
          ];
          statsData.forEach(function(sd, si) {
            var sx = W - 14 - (statsData.length - si) * 20 + 8;
            doc.setTextColor(200, 255, 0);
            doc.setFontSize(9); doc.setFont("helvetica","bold");
            doc.text(sd.v, sx, y + 9, { align:"center" });
            doc.setTextColor(104, 104, 160);
            doc.setFontSize(5.5); doc.setFont("helvetica","normal");
            doc.text(sd.l, sx, y + 14, { align:"center" });
          });

          y += cardH + 3;
        });

        // === NOTES AREA ===
        if (y < H - 50) {
          y += 4;
          doc.setDrawColor(28, 28, 46);
          doc.setLineWidth(0.3);
          doc.line(14, y, W - 14, y);
          y += 6;
          doc.setTextColor(104, 104, 160);
          doc.setFontSize(7); doc.setFont("helvetica","bold");
          doc.text("NOTAS", 14, y);
          y += 5;
          for (var ni = 0; ni < 3; ni++) {
            doc.setDrawColor(28, 28, 46);
            doc.setLineWidth(0.3);
            doc.line(14, y, W - 14, y);
            y += 7;
          }
        }

        // === FOOTER ===
        doc.setFillColor(18, 18, 30);
        doc.rect(0, H - 14, W, 14, "F");
        doc.setFillColor(200, 255, 0);
        doc.rect(0, H - 2, W, 2, "F");
        doc.setTextColor(200, 255, 0);
        doc.setFontSize(8); doc.setFont("helvetica","bold");
        doc.text("FORZA", 14, H - 6);
        doc.setTextColor(104, 104, 160);
        doc.setFontSize(7); doc.setFont("helvetica","normal");
        doc.text("TRAIN SMART. LIVE STRONG.", 38, H - 6);
        doc.text("forza.app", W - 14, H - 6, { align:"right" });

        var safeName = routineName.replace(/[^a-zA-Z0-9]/g, "_");
        doc.save("FORZA_" + safeName + ".pdf");
        setPdfLoading(false);
      } catch(err) {
        console.error(err);
        setPdfLoading(false);
        alert("Error al generar PDF: " + err.message);
      }
    });
  };

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      <div style={{ background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`, padding:"18px 18px 14px", flexShrink:0 }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <Pill color={C.accent}>HOY · MARTES</Pill>
            <h1 className="bb" style={{fontSize:38,letterSpacing:1,lineHeight:1,marginTop:7}}>{routineName}</h1>
            <p style={{color:C.gray,fontSize:12,marginTop:3}}>{exercises.map(e=>e.muscle).filter((v,i,a)=>a.indexOf(v)===i).join(" · ")}</p>
          </div>

          <button onClick={onChangeRoutine} style={{ background:C.s2, border:`1px solid ${C.s3}`, borderRadius:11, padding:"8px 12px", color:C.grayL, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", flexShrink:0, marginTop:4 }}>
            ⇄ Cambiar
          </button>
        </div>


        <div style={{display:"flex",gap:8,marginTop:12}}>
          {[[`⏱ ~${estMin}min`],[`🏋 ${exercises.length} ejerc.`],[`📊 ${totalSets} sets`]].map(([v])=>(
            <div key={v} style={{ flex:1, background:C.s1, borderRadius:10, padding:"8px 4px", textAlign:"center", border:`1px solid ${C.s2}` }}>
              <p style={{fontSize:11,color:C.grayL,fontWeight:500}}>{v}</p>
            </div>
          ))}
        </div>
      </div>


      {supersetGroups.length > 0 && (
        <div style={{ margin:"10px 18px 0", background:`linear-gradient(135deg,${C.accent}14,${C.accent}06)`, border:`1.5px solid ${C.accent}40`, borderRadius:16, padding:"12px 16px", flexShrink:0 }}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:22,flexShrink:0}}>⚡</span>
            <div>
              <p style={{fontSize:13,color:C.accent,fontWeight:700,marginBottom:3}}>
                {supersetGroups.length} biserie{supersetGroups.length>1?"s":""} · {supersetGroups.join(", ")} — máxima eficiencia
              </p>
              <p style={{fontSize:12,color:C.grayL,lineHeight:1.5}}>
                En biserie pasás de un ejercicio al otro <strong style={{color:C.white}}>sin descanso</strong>. Trabajás músculos distintos consecutivamente — más volumen, menos tiempo.
              </p>
            </div>
          </div>
        </div>
      )}


      <div style={{flex:1,padding:"10px 18px 14px",overflowY:"auto"}}>
        <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>
          Tocá un ejercicio para ver cómo hacerlo 👆
        </p>
        {exercises.map((ex, idx) => {
          const inSS = !!ex.supersetGroup;
          if (inSS && rendered.has(ex.supersetGroup)) return null;
          if (inSS) rendered.add(ex.supersetGroup);
          const group = inSS ? exercises.filter(e=>e.supersetGroup===ex.supersetGroup) : [ex];

          return (
            <div key={ex.id} style={{marginBottom:12}}>

              {inSS && (
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <div style={{background:C.accent,borderRadius:7,padding:"2px 10px"}}>
                    <span className="bb" style={{fontSize:12,color:C.bg,letterSpacing:1}}>BISERIE {ex.supersetGroup}</span>
                  </div>
                  <div style={{ flex:1, height:1, background:`${C.accent}30` }}/>
                  <span style={{fontSize:10,color:C.gray}}>sin descanso →</span>
                </div>
              )}


              <div style={{position:"relative"}}>
                {inSS && <div style={{ position:"absolute", left:24, top:0, bottom:0, width:2, background:`${C.accent}25`, zIndex:0, borderRadius:1 }}/>}
                {group.map((e, ei) => (
                  <div key={e.id} onClick={()=>onPreviewExercise(e)}
                    style={{ position:"relative", zIndex:1, background:C.s1, borderRadius:16, padding:"12px 14px", marginBottom: inSS && ei < group.length-1 ? 4 : 0, border:`1px solid ${inSS?C.accent+"28":C.s2}`, display:"flex", gap:12, alignItems:"center", cursor:"pointer", transition:"all .2s" }}>

                    <div style={{ width:26, height:26, borderRadius:8, background:inSS?`${C.accent}22`:C.s2, border:`1.5px solid ${inSS?C.accent+"50":C.s3}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span className="mono" style={{fontSize:10,color:inSS?C.accent:C.gray,fontWeight:700}}>{idx+1}</span>
                    </div>

                    <div style={{ width:56, height:56, background:C.s2, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${C.s3}` }}>
                      <ExSVG id={e.svgId} size={46}/>
                    </div>

                    <div style={{flex:1}}>
                      <p style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:3}}>{e.name}</p>
                      <Pill color={C.blue}>{e.muscle}</Pill>
                      <div style={{display:"flex",gap:12,marginTop:7}}>
                        {[["Series",e.sets],["Reps",e.reps],["Peso",`${e.weight}kg`],["⏱",`${e.restSecs/60}m`]].map(([l,v])=>(
                          <div key={l} style={{textAlign:"center"}}>
                            <span className="mono" style={{fontSize:13,color:l==="⏱"?C.grayL:C.accent,fontWeight:700,display:"block"}}>{v}</span>
                            <span style={{fontSize:9,color:C.gray}}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{ width:28, height:28, borderRadius:8, background:C.s2, border:`1px solid ${C.s3}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{fontSize:13}}>👁</span>
                      </div>
                      <span style={{fontSize:8,color:C.gray}}>ver</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>


      <div style={{ padding:"10px 18px 14px", flexShrink:0, background:C.bg, borderTop:`1px solid ${C.s2}` }}>
        <div style={{display:"flex", gap:8, marginBottom:8}}>
          <button onClick={onEdit} style={{ flex:.55, background:C.s2, color:C.grayL, border:`1.5px solid ${C.s3}`, borderRadius:14, padding:"12px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            ✏ Modificar
          </button>
          <button onClick={onStart} style={{ flex:1, background:`linear-gradient(135deg,${C.accent},#90FF40)`, color:C.bg, border:"none", borderRadius:14, padding:"14px", fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5 }}>
            ▶ INICIAR
          </button>
        </div>
        <button onClick={downloadPDF} disabled={pdfLoading} style={{ width:"100%", background:pdfLoading?C.s1:`${C.accent}12`, border:`1.5px solid ${pdfLoading?C.s2:C.accent}50`, borderRadius:13, padding:"10px", fontSize:13, fontWeight:700, color:pdfLoading?C.gray:C.accent, cursor:pdfLoading?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s" }}>
          {pdfLoading ? "Generando PDF..." : "⬇ Descargar rutina como PDF"}
        </button>
      </div>
    </div>
  );
};

function RutinasScreen(props) {
  const setSheets = props.setSheets || (()=>{});
  const userPlan  = props.userPlan  || "free";
  const navigate  = props.navigate  || (()=>{});
  const [showAd, setShowAd] = useState(false);
  const [sub, setSub]                 = useState("overview");
  const [exs, setExs]                 = useState(INIT_EXERCISES);
  const [routineName, setRoutineName] = useState("Push Day A");
  const blocks = buildBlocks(exs);

  const openPreview = (ex) => setSheets(
    <ExercisePreviewSheet exercise={ex} onClose={()=>setSheets(null)}/>
  );

  const openSelector = () => setSheets(
    <RoutineSelector
      currentName={routineName}
      onSelect={(newExs, newName)=>{
        setExs(newExs);
        setRoutineName(newName);
        setSheets(null);
      }}
      onClose={()=>setSheets(null)}
    />
  );

  return (
    <div style={{height:"100%",overflow:"hidden",position:"relative"}}>
      {showAd && <AdScreen onDone={()=>{ setShowAd(false); setSub("active"); }} navigate={navigate}/>}
      {sub==="overview" && (
        <RutinaDelDia
          exercises={exs}
          routineName={routineName}
          onStart={()=>{ if(userPlan==="free") setShowAd(true); else setSub("active"); }}
          onEdit={()=>setSub("edit")}
          onChangeRoutine={openSelector}
          onPreviewExercise={openPreview}
        />
      )}
      {sub==="edit"   && <EditRoutine exercises={exs} onChange={setExs} onBack={()=>setSub("overview")}/>}
      {sub==="active" && <ActiveWorkout blocks={blocks} onFinish={()=>{setSub("overview");setSheets(null);}}/>}
    </div>
  );
};

function SplashScreen({ onNext }) {
  const [qIdx,setQIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setQIdx(i=>(i+1)%QUOTES.length),4000);return()=>clearInterval(t);},[]);
  const q=QUOTES[qIdx];
  return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"60px 28px 44px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,rgba(200,255,0,.1) 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:120,left:-60,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,rgba(68,136,255,.07) 0%,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{textAlign:"center",marginTop:40}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:6}}>
          <div style={{width:48,height:48,background:C.accent,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:24}}>⚡</span>
          </div>
          <span className="bb" style={{fontSize:44,color:C.white,letterSpacing:3}}>FORZA</span>
        </div>
        <p style={{color:C.gray,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",fontWeight:500}}>Train · Track · Transform</p>
      </div>


      <div key={qIdx} style={{animation:"quoteSlide .5s ease both",padding:"0 4px",textAlign:"center"}}>
        <p style={{fontSize:15,color:C.white,fontStyle:"italic",lineHeight:1.65,marginBottom:10,opacity:.9}}>"{q.text}"</p>
        <p style={{fontSize:12,color:C.accent,fontWeight:700}}>— {q.author}</p>
        <p style={{fontSize:11,color:C.gray}}>{q.sport}</p>
      </div>

      <div style={{width:"100%"}}>
        <h1 className="bb" style={{fontSize:54,lineHeight:1,color:C.white,marginBottom:10,textAlign:"center"}}>
          TU MEJOR<br/><span style={{color:C.accent}}>VERSIÓN</span><br/>EMPIEZA HOY
        </h1>
        <button style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:16,padding:"17px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,marginBottom:12}} onClick={onNext}>
          COMENZAR AHORA
        </button>
        <button style={{ width:"100%",background:"transparent",color:C.white,border:`1.5px solid ${C.s3}`,borderRadius:16,padding:"16px",fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }} onClick={onNext}>
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
};

function OnboardingAlumno(props) {
  const onDone = props.onDone;
  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({
    email:"", password:"", nombre:"", apellido:"", edad:"",
    objetivo:"", nivel:"", sexo:"",
    dni:"", telefono:"", direccion:"", pais:"AR",
  });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const STEPS = [
    {id:"cuenta",   label:"Crear cuenta",   sub:"Datos de acceso"},
    {id:"personal", label:"¡Hola!",          sub:"Cuéntanos sobre vos"},
    {id:"fitness",  label:"Tu objetivo",     sub:"Para personalizar tu plan"},
  ];

  const OBJETIVOS = [
    {id:"bajar",  icon:"🔥", label:"Bajar de peso"},
    {id:"ganar",  icon:"💪", label:"Ganar músculo"},
    {id:"tono",   icon:"⚡", label:"Tonificarme"},
    {id:"salud",  icon:"❤️", label:"Mejorar mi salud"},
    {id:"deporte",icon:"🏃", label:"Rendimiento deportivo"},
  ];
  const NIVELES = [
    {id:"nuevo",   icon:"🌱", label:"Soy nuevo"},
    {id:"basico",  icon:"📚", label:"Tengo lo básico"},
    {id:"medio",   icon:"🏋", label:"Entreno seguido"},
    {id:"avanzado",icon:"🏆", label:"Avanzado"},
  ];

  const pct = ((step+1)/STEPS.length)*100;

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>

      <div style={{height:3,background:C.s2,flexShrink:0}}>
        <div style={{height:3,background:C.accent,borderRadius:100,width:`${pct}%`,transition:"width .4s"}}/>
      </div>

      <div style={{padding:"16px 24px 12px",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
        {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{background:"transparent",border:"none",color:C.gray,cursor:"pointer",fontSize:18}}>←</button>}
        <div>
          <p style={{fontSize:11,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>{STEPS[step].sub}</p>
          <h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:.5,lineHeight:1}}>{STEPS[step].label}</h2>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?20:6,height:6,borderRadius:100,background:i<=step?C.accent:C.s2,transition:"all .3s"}}/>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"8px 24px 24px"}}>


        {step===0 && (
          <div>
            <div style={{background:`${C.accent}06`,borderRadius:18,padding:"20px",marginBottom:16,textAlign:"center"}}>
              <p style={{fontSize:40,marginBottom:8}}>⚡</p>
              <p className="bb" style={{fontSize:22,color:C.accent,letterSpacing:1,marginBottom:4}}>BIENVENIDO A FORZA</p>
              <p style={{fontSize:13,color:C.gray}}>Creá tu cuenta en 2 minutos</p>
            </div>
            {[
              {k:"nombre",   l:"Nombre",       ph:"Tu nombre",        type:"text"},
              {k:"apellido", l:"Apellido",      ph:"Tu apellido",      type:"text"},
              {k:"email",    l:"Email",         ph:"tu@email.com",     type:"email"},
              {k:"password", l:"Contraseña",    ph:"Mínimo 8 caracteres",type:"password"},
              {k:"edad",     l:"Edad",          ph:"¿Cuántos años tenés?",type:"number"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{f.l}</label>
                <input type={f.type} value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form[f.k]?C.accent:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}/>
              </div>
            ))}
            {form.edad && parseInt(form.edad) < 18 && (
              <div style={{background:`${C.orange}12`,border:`1px solid ${C.orange}30`,borderRadius:12,padding:"10px 14px",marginBottom:12}}>
                <p style={{fontSize:12,color:C.orange}}>⚠️ Sos menor de edad. Se requerirá consentimiento de un adulto responsable para activar funcionalidades de pago.</p>
              </div>
            )}
            <p style={{fontSize:10,color:C.gray,marginBottom:16,lineHeight:1.6,textAlign:"center"}}>Al continuar aceptás nuestros <span style={{color:C.accent}}>Términos y condiciones</span> y <span style={{color:C.accent}}>Política de privacidad</span></p>
          </div>
        )}


        {step===1 && (
          <div>
            <p style={{fontSize:14,color:C.grayL,marginBottom:20,lineHeight:1.6}}>¡Hola <strong style={{color:C.accent}}>{form.nombre||"campeón/a"}</strong>! 💪 Contanos un poco más para personalizar tu experiencia.</p>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Sexo</p>
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {[{id:"M",label:"Hombre"},{id:"F",label:"Mujer"},{id:"O",label:"Prefiero no decir"}].map(s=>(
                <button key={s.id} onClick={()=>upd("sexo",s.id)}
                  style={{flex:1,padding:"10px 6px",borderRadius:12,border:`1.5px solid ${form.sexo===s.id?C.accent:C.s2}`,background:form.sexo===s.id?`${C.accent}15`:C.s1,color:form.sexo===s.id?C.accent:C.gray,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}18`,borderRadius:14,padding:"13px 16px",marginBottom:8}}>
              <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:4}}>📍 Datos para facturación</p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.6,marginBottom:12}}>Solo te pedimos estos datos cuando contrates un coach. Te los iremos pidiendo en el momento que los necesites.</p>
              <p style={{fontSize:11,color:C.grayL,fontStyle:"italic"}}>Próximamente te pediremos: DNI/Pasaporte · Dirección · Teléfono</p>
            </div>
          </div>
        )}


        {step===2 && (
          <div>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>¿Cuál es tu objetivo principal?</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {OBJETIVOS.map(o=>(
                <button key={o.id} onClick={()=>upd("objetivo",o.id)}
                  style={{display:"flex",gap:12,alignItems:"center",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${form.objetivo===o.id?C.accent:C.s2}`,background:form.objetivo===o.id?`${C.accent}12`:C.s1,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  <span style={{fontSize:20}}>{o.icon}</span>
                  <span style={{fontSize:14,color:form.objetivo===o.id?C.white:C.grayL,fontWeight:form.objetivo===o.id?700:400}}>{o.label}</span>
                  {form.objetivo===o.id && <span style={{marginLeft:"auto",color:C.accent}}>✓</span>}
                </button>
              ))}
            </div>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Tu nivel de experiencia</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {NIVELES.map(n=>(
                <button key={n.id} onClick={()=>upd("nivel",n.id)}
                  style={{padding:"14px 12px",borderRadius:14,border:`1.5px solid ${form.nivel===n.id?C.accent:C.s2}`,background:form.nivel===n.id?`${C.accent}12`:C.s1,cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .2s"}}>
                  <p style={{fontSize:24,marginBottom:6}}>{n.icon}</p>
                  <p style={{fontSize:12,color:form.nivel===n.id?C.white:C.grayL,fontWeight:form.nivel===n.id?700:400}}>{n.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>


      <div style={{padding:"12px 24px 20px",flexShrink:0,borderTop:`1px solid ${C.s2}`}}>
        <button
          onClick={()=>{ if(step<STEPS.length-1) setStep(s=>s+1); else onDone(); }}
          style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:.3}}>
          {step<STEPS.length-1 ? "Continuar →" : "¡Empezar en FORZA! ⚡"}
        </button>
        {step===0 && <p style={{textAlign:"center",fontSize:12,color:C.gray,marginTop:10}}>¿Ya tenés cuenta? <span style={{color:C.accent,cursor:"pointer"}} onClick={onDone}>Iniciar sesión</span></p>}
      </div>
    </div>
  );
};

function OnboardingCoach(props) {
  const onDone = props.onDone;
  const [step, setStep]  = useState(0);
  const [form, setForm]  = useState({
    nombre:"", apellido:"", email:"", password:"",
    pais:"AR", figuraFiscal:"", cuit:"",
    banco:"", alias:"", tipo:"Caja de ahorros",
    especialidad:"", bio:"", precio_starter:"",
  });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const FIGURAS = {
    AR:{label:"Monotributista",  field:"CUIT",  placeholder:"20-12345678-9", hint:"Podés ser Monotrib. categoría B o superior."},
    CL:{label:"Boleta de honor.", field:"RUT",   placeholder:"12.345.678-9",  hint:"Emitís boletas de honorarios electrónicas via SII."},
    GB:{label:"Self-employed",   field:"UTR",    placeholder:"1234567890",    hint:"Sole trader o Ltd. registrado en HMRC."},
    BR:{label:"MEI / Pessoa Jur.",field:"CNPJ",  placeholder:"12.345.678/0001-99",hint:"MEI cubre hasta R$81k/año. Podés usar PJ."},
  };

  const figura = FIGURAS[form.pais] || FIGURAS["AR"];

  const STEPS = [
    {id:"cuenta",  label:"Creá tu cuenta",    sub:"Coach · Paso 1 de 4"},
    {id:"fiscal",  label:"Datos fiscales",     sub:"Coach · Paso 2 de 4"},
    {id:"banco",   label:"Datos bancarios",    sub:"Coach · Paso 3 de 4"},
    {id:"perfil",  label:"Tu perfil público",  sub:"Coach · Paso 4 de 4"},
  ];

  const pct = ((step+1)/STEPS.length)*100;

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>
      <div style={{height:3,background:C.s2,flexShrink:0}}>
        <div style={{height:3,background:C.orange,borderRadius:100,width:`${pct}%`,transition:"width .4s"}}/>
      </div>
      <div style={{padding:"16px 24px 12px",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
        {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{background:"transparent",border:"none",color:C.gray,cursor:"pointer",fontSize:18}}>←</button>}
        <div>
          <p style={{fontSize:11,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>{STEPS[step].sub}</p>
          <h2 className="bb" style={{fontSize:24,color:C.white,letterSpacing:.5,lineHeight:1}}>{STEPS[step].label}</h2>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?20:6,height:6,borderRadius:100,background:i<=step?C.orange:C.s2,transition:"all .3s"}}/>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"8px 24px 24px"}}>


        {step===0 && (
          <div>
            <div style={{background:`${C.orange}08`,borderRadius:16,padding:"16px",marginBottom:18,textAlign:"center"}}>
              <p style={{fontSize:36,marginBottom:6}}>🏆</p>
              <p className="bb" style={{fontSize:20,color:C.orange,letterSpacing:1,marginBottom:3}}>REGISTRATE COMO COACH</p>
              <p style={{fontSize:12,color:C.gray}}>Monetizá tu conocimiento en FORZA</p>
            </div>
            {[
              {k:"nombre",   l:"Nombre",    ph:"Tu nombre"},
              {k:"apellido", l:"Apellido",  ph:"Tu apellido"},
              {k:"email",    l:"Email",     ph:"tu@email.com"},
              {k:"password", l:"Contraseña",ph:"Mínimo 8 caracteres",type:"password"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{f.l}</label>
                <input type={f.type||"text"} value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form[f.k]?C.orange:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
            ))}
          </div>
        )}


        {step===1 && (
          <div>
            <div style={{background:`${C.orange}08`,borderRadius:14,padding:"14px 16px",marginBottom:18}}>
              <p style={{fontSize:12,color:C.orange,fontWeight:700,marginBottom:4}}>¿Por qué pedimos esto?</p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>Vos facturás directo al alumno. FORZA retiene el pago completo y te transfiere el <strong style={{color:C.white}}>85%</strong> ni bien validemos tu factura. Necesitamos confirmar que podés emitir facturas válidas en tu país.</p>
            </div>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>País de residencia fiscal</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              {PRICING.countries.map(c=>(
                <button key={c.id} onClick={()=>upd("pais",c.id)}
                  style={{padding:"12px",borderRadius:13,border:`1.5px solid ${form.pais===c.id?C.orange:C.s2}`,background:form.pais===c.id?`${C.orange}12`:C.s1,cursor:"pointer",fontFamily:"inherit",display:"flex",gap:10,alignItems:"center",transition:"all .2s"}}>
                  <span style={{fontSize:22}}>{c.flag}</span>
                  <div style={{textAlign:"left"}}>
                    <p style={{fontSize:13,color:form.pais===c.id?C.white:C.grayL,fontWeight:600,marginBottom:1}}>{c.name}</p>
                    <p style={{fontSize:9,color:C.gray}}>{c.currency}</p>
                  </div>
                </button>
              ))}
            </div>
            <div style={{background:C.s1,borderRadius:14,padding:"14px 16px",marginBottom:14,border:`1px solid ${C.s2}`}}>
              <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>Figura requerida en {form.pais}</p>
              <p style={{fontSize:14,color:C.white,fontWeight:700,marginBottom:4}}>{figura.label}</p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>{figura.hint}</p>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{figura.field} / Número de contribuyente</label>
              <input value={form.cuit} onChange={e=>upd("cuit",e.target.value)}
                placeholder={figura.placeholder}
                style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form.cuit?C.orange:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{background:`${C.accent}08`,border:`2px dashed ${C.accent}30`,borderRadius:14,padding:"18px",textAlign:"center",cursor:"pointer"}}
              onClick={()=>upd("figuraFiscal","constancia_subida.pdf")}>
              {form.figuraFiscal ? (<><p style={{fontSize:24,marginBottom:6}}>✅</p><p style={{fontSize:13,color:C.accent,fontWeight:700}}>Constancia cargada</p></>) : (<><p style={{fontSize:24,marginBottom:6}}>📄</p><p style={{fontSize:13,color:C.accent,fontWeight:600}}>Subir constancia</p><p style={{fontSize:11,color:C.gray,marginTop:3}}>PDF Max. 5MB</p></>)}
            </div>
            <div style={{background:`${C.blue}06`,borderRadius:12,padding:"10px 14px",marginTop:14}}>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>⚠️ Tu cuenta quedará en estado <strong style={{color:C.orange}}>pendiente de validación</strong> hasta que revisemos tu constancia (máx. 48h hábiles). Podés configurar tu perfil mientras tanto.</p>
            </div>
          </div>
        )}


        {step===2 && (
          <div>
            <p style={{fontSize:13,color:C.grayL,marginBottom:18,lineHeight:1.6}}>Necesitamos tus datos bancarios para transferirte el <strong style={{color:C.white}}>85%</strong> de cada pago de alumno cuando subas la factura.</p>
            {[
              {k:"banco",  l:"Nombre del banco",         ph:"Ej: Brubank, Santander, Barclays"},
              {k:"alias",  l:"Alias / CBU / IBAN / Nro.", ph:"tu.alias o número de cuenta completo"},
              {k:"tipo",   l:"Tipo de cuenta",            ph:"Caja de ahorros / Corriente / Current"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{f.l}</label>
                <input value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form[f.k]?C.orange:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
            ))}
            <div style={{background:`${C.orange}08`,borderRadius:12,padding:"11px 14px"}}>
              <p style={{fontSize:11,color:C.orange,lineHeight:1.5}}>🔒 Tus datos bancarios están cifrados y solo se usan para transferirte tus ganancias. FORZA nunca debita de tu cuenta.</p>
            </div>
          </div>
        )}


        {step===3 && (
          <div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>Especialidad</label>
              <input value={form.especialidad} onChange={e=>upd("especialidad",e.target.value)}
                placeholder="Ej: Fuerza y Powerlifting, HIIT, Funcional..."
                style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form.especialidad?C.orange:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>Bio (visible en el marketplace)</label>
              <textarea value={form.bio} onChange={e=>upd("bio",e.target.value)}
                placeholder="Contale a los alumnos quién sos y cómo trabajás (máx. 300 caracteres)"
                rows={4}
                style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${form.bio?C.orange:C.s2}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none"}}/>
            </div>
            <div style={{background:C.s1,borderRadius:14,padding:"14px 16px",marginBottom:14,border:`1px solid ${C.s2}`}}>
              <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Precio paquete Starter (mínimo FORZA)</p>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input value={form.precio_starter} onChange={e=>upd("precio_starter",e.target.value)}
                  placeholder={`Mínimo ${PRICING.countries[0].symbol}${PRICING.countries[0].coachFloor.starter.toLocaleString()}`}
                  type="number"
                  style={{flex:1,padding:"11px 14px",background:C.s2,border:`1.5px solid ${form.precio_starter?C.orange:C.s3}`,borderRadius:11,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
                <span style={{fontSize:13,color:C.gray}}>/mes</span>
              </div>
              <p style={{fontSize:10,color:C.gray,marginTop:6}}>Podés modificarlo desde tu backoffice en cualquier momento.</p>
            </div>
            <div style={{background:`${C.accent}08`,borderRadius:14,padding:"14px 16px",border:`1px solid ${C.accent}20`}}>
              <p style={{fontSize:12,color:C.accent,fontWeight:700,marginBottom:4}}>¡Ya casi listo! 🎉</p>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>Tu perfil quedará visible en el marketplace ni bien validemos tu constancia fiscal. Los primeros 3 alumnos tienen suscripción fija. A partir del 4° FORZA solo cobra comisión del 15%.</p>
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"12px 24px 20px",flexShrink:0,borderTop:`1px solid ${C.s2}`}}>
        <button onClick={()=>{ if(step<STEPS.length-1) setStep(s=>s+1); else onDone(); }}
          style={{width:"100%",background:`linear-gradient(135deg,${C.orange},#FF4466)`,color:C.white,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:.3}}>
          {step<STEPS.length-1 ? "Continuar →" : "Crear mi cuenta de coach 🏆"}
        </button>
        {step===0 && <p style={{textAlign:"center",fontSize:12,color:C.gray,marginTop:10}}>¿Sos alumno? <span style={{color:C.accent,cursor:"pointer"}} onClick={onDone}>Registrate aquí</span></p>}
      </div>
    </div>
  );
};

function LoginScreen({ onNext }) {
  const [focused,setFocused]=useState("");
  return (
    <div style={{height:"100%",background:C.bg,padding:"70px 26px 36px",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:30}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <div style={{width:32,height:32,background:C.accent,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:16}}>⚡</span></div>
          <span className="bb" style={{fontSize:26,color:C.white,letterSpacing:2}}>FORZA</span>
        </div>
        <h2 className="bb" style={{fontSize:42,color:C.white,lineHeight:1,marginBottom:6}}>BIENVENIDO<br/><span style={{color:C.accent}}>DE VUELTA</span></h2>
        <p style={{color:C.gray,fontSize:14}}>Ingresá a tu cuenta para continuar</p>
      </div>
      <div style={{flex:1}}>
        {[{label:"Email",icon:"📧",type:"email",ph:"tu@email.com"},{label:"Contraseña",icon:"🔒",type:"password",ph:"••••••••"}].map(f=>(
          <div key={f.label} style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:C.gray,marginBottom:6,letterSpacing:.8,textTransform:"uppercase"}}>{f.label}</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>{f.icon}</span>
              <input type={f.type} placeholder={f.ph} onFocus={()=>setFocused(f.label)} onBlur={()=>setFocused("")} style={{ width:"100%",padding:"15px 15px 15px 44px",background:C.s1,border:`1.5px solid ${focused===f.label?C.accent:C.s2}`,borderRadius:13,color:C.white,fontSize:15,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s" }}/>
            </div>
          </div>
        ))}
        <div style={{textAlign:"right",marginBottom:24}}>
          <span style={{color:C.accent,fontSize:13,fontWeight:500,cursor:"pointer"}}>¿Olvidaste tu contraseña?</span>
        </div>
        <button style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:15,padding:"17px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,marginBottom:20}} onClick={onNext}>INICIAR SESIÓN</button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{flex:1,height:1,background:C.s2}}/><span style={{color:C.gray,fontSize:12}}>o continúa con</span><div style={{flex:1,height:1,background:C.s2}}/>
        </div>
        {["Google","Apple"].map(p=>(
          <button key={p} style={{ width:"100%",background:"transparent",color:C.white,border:`1.5px solid ${C.s2}`,borderRadius:13,padding:"14px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginBottom:10 }}>
            {p==="Google"?"🔵":"🍎"} Continuar con {p}
          </button>
        ))}
      </div>
      <p style={{textAlign:"center",color:C.gray,fontSize:13}}>¿Sin cuenta? <span style={{color:C.accent,fontWeight:600,cursor:"pointer"}}>Regístrate gratis</span></p>
    </div>
  );
};

function HomeScreen(props) {
  const navigate  = props.navigate  || (()=>{});
  const userPlan  = props.userPlan  || "free";
  const coachStatus = userPlan === "coach" ? "assigned" : userPlan === "pro" ? "none" : "none";
  const assignedCoach = { name:"Miguel Ramírez", pkg:"Pro", color:C.accent, since:"1 Mar" };
  const [qIdx]=useState(Math.floor(Math.random()*QUOTES.length));
  const days=["L","M","X","J","V","S","D"];
  const active=[0,1,3,5];
  return (
    <div style={{height:"100%",background:C.bg,paddingBottom:16,overflowY:"auto"}}>
      <div style={{ padding:"44px 22px 18px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)` }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <p style={{color:C.gray,fontSize:13,fontWeight:500,marginBottom:2}}>Buenos días 👋</p>
            <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>CARLOS MÉNDEZ</h2>
          </div>
          <div style={{ width:44,height:44,borderRadius:"50%",background:C.s1,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
            <SvgIcon name="user" size={20} color={C.gray}/>
            <div style={{ position:"absolute",top:0,right:0,width:12,height:12,background:C.accent,borderRadius:"50%",border:`2px solid ${C.bg}` }}/>
          </div>
        </div>

        <div style={{ background:C.s1,borderRadius:18,padding:"14px 16px",border:`1px solid ${C.s2}` }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:11,fontWeight:600,color:C.gray,letterSpacing:.8,textTransform:"uppercase"}}>Racha semanal</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>🔥</span><span className="mono" style={{fontSize:12,color:C.accent}}>5 días</span></span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {days.map((d,i)=>(
              <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:30,height:30,borderRadius:9,background:active.includes(i)?C.accent:C.s3,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {active.includes(i)&&<span style={{fontSize:13}}>✓</span>}
                </div>
                <span style={{fontSize:10,color:active.includes(i)?C.white:C.gray,fontWeight:600}}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"0 22px"}}>


        {userPlan === "coach" && (
          <div style={{background:`linear-gradient(135deg,${C.orange}15,${C.orange}06)`,border:`1.5px solid ${C.orange}40`,borderRadius:16,padding:"13px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`${assignedCoach.color}25`,border:`2px solid ${assignedCoach.color}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span className="bb" style={{fontSize:14,color:assignedCoach.color}}>MR</span>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:2}}>Tu coach · Paq. {assignedCoach.pkg}</p>
              <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:1}}>{assignedCoach.name}</p>
              <p style={{fontSize:11,color:C.gray}}>Activo desde {assignedCoach.since}</p>
            </div>
            <button onClick={()=>navigate("chat")} style={{background:C.orange,color:C.white,border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Chat</button>
          </div>
        )}
        {userPlan === "pro" && (
          <div onClick={()=>navigate("chat")} style={{background:`${C.blue}08`,border:`1.5px solid ${C.blue}30`,borderRadius:14,padding:"12px 16px",marginBottom:16,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${C.blue}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
              COACH
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:11,color:C.blue,fontWeight:700,marginBottom:1}}>Contratar un coach</p>
              <p style={{fontSize:11,color:C.gray}}>Activar plan PRO + Coach y acceder al marketplace</p>
            </div>
            <span style={{color:C.blue,fontSize:16}}>›</span>
          </div>
        )}
        {userPlan === "free" && (
          <div onClick={()=>navigate("mi-plan")} style={{background:`${C.accent}08`,border:`1px solid ${C.accent}20`,borderRadius:14,padding:"11px 16px",marginBottom:16,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:1}}>Actualizate a PRO</p>
              <p style={{fontSize:11,color:C.gray}}>Rutinas ilimitadas, graficos completos y mas</p>
            </div>
            <span style={{color:C.accent,fontSize:16}}>›</span>
          </div>
        )}


        <div style={{marginBottom:18}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Frase del día</p>
          <QuoteCard quote={QUOTES[qIdx]} minimal />
        </div>


        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:1}}>ENTRENAMIENTO HOY</h3>
            <span onClick={()=>navigate("plan")} style={{color:C.accent,fontSize:13,fontWeight:500,cursor:"pointer"}}>Ver todo →</span>
          </div>
          <div style={{ background:`linear-gradient(135deg,${C.s1} 0%,${C.s0} 100%)`,borderRadius:20,padding:18,border:`1px solid rgba(200,255,0,.14)`,position:"relative",overflow:"hidden" }}>
            <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:`rgba(200,255,0,.05)`}}/>
            <Pill color={C.accent}>FUERZA</Pill>
            <h3 className="bb" style={{fontSize:26,color:C.white,marginTop:8,marginBottom:3}}>PUSH DAY A</h3>
            <p style={{color:C.gray,fontSize:13,marginBottom:14}}>Pecho · Hombros · Tríceps · Cuádriceps</p>
            <div style={{display:"flex",gap:16,marginBottom:16}}>
              {[["5","Ejercicios"],["45","Min"],["320","Kcal"]].map(([v,l])=>(
                <div key={l}><span className="mono" style={{fontSize:20,color:C.accent,fontWeight:700}}>{v}</span><span style={{fontSize:11,color:C.gray,marginLeft:4}}>{l}</span></div>
              ))}
            </div>
            <button onClick={()=>navigate("rutinas")} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              ▶ Iniciar entrenamiento
            </button>
          </div>
        </div>


        <div style={{ background:C.s1,borderRadius:18,padding:18,border:`1px solid ${C.s2}`,marginBottom:18,display:"flex",alignItems:"center",gap:18 }}>
          <div style={{position:"relative",width:76,height:76,flexShrink:0}}>
            <svg width="76" height="76" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="30" fill="none" stroke={C.s3} strokeWidth="6"/>
              <circle cx="38" cy="38" r="30" fill="none" stroke={C.accent} strokeWidth="6" strokeDasharray={`${0.72*188} 188`} strokeLinecap="round" transform="rotate(-90 38 38)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span className="mono" style={{fontSize:14,color:C.white,fontWeight:700}}>72%</span>
            </div>
          </div>
          <div>
            <p style={{color:C.gray,fontSize:11,fontWeight:600,marginBottom:3,textTransform:"uppercase",letterSpacing:.8}}>Meta mensual</p>
            <p className="bb" style={{fontSize:22,color:C.white,letterSpacing:1}}>18/25 SESIONES</p>
            <p style={{color:C.gray,fontSize:13}}>¡Vas muy bien! 🔥</p>
          </div>
        </div>


        <div style={{marginBottom:18}}>
          <h3 className="bb" style={{fontSize:18,color:C.white,letterSpacing:.8,marginBottom:12}}>ACCIONES RÁPIDAS</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {id:"tabata",           icon:"⏱", label:"Tabata",           sub:"HIIT 20/10",        col:C.accent},
              {id:"registrar-entreno",icon:"📝", label:"Registrar entreno",sub:"Cargá lo que hiciste",col:C.blue},
              {id:"crear",            icon:"➕", label:"Nueva rutina",     sub:"Diseñá tu entrenamiento",col:C.orange},
              {id:"progreso",         icon:"📈", label:"Mi progreso",      sub:"Ver estadísticas",  col:"#A78BFA"},
            ].map(a=>(
              <div key={a.id} onClick={()=>navigate(a.id)}
                style={{background:C.s1,borderRadius:16,padding:"14px",border:`1px solid ${C.s2}`,cursor:"pointer",transition:"all .2s"}}>
                <div style={{width:38,height:38,borderRadius:12,background:`${a.col}18`,border:`1.5px solid ${a.col}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:9}}>{a.icon}</div>
                <p style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:2}}>{a.label}</p>
                <p style={{fontSize:10,color:C.gray}}>{a.sub}</p>
              </div>
            ))}
          </div>
        </div>


        <div style={{ background:C.s1,borderRadius:18,padding:16,border:`1px solid ${C.s2}` }}>
          <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
            <div style={{ width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <SvgIcon name="user" size={18} color={C.bg}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontWeight:600,fontSize:14,color:C.white}}>Coach Ramírez</span>
                <span style={{fontSize:11,color:C.gray}}>hace 2h</span>
              </div>
              <p style={{color:C.gray,fontSize:13,marginTop:4,lineHeight:1.5}}>Carlos, recordá aumentar el peso en press banca hoy. ¡Tú podés! 💪</p>
            </div>
          </div>
          <button style={{ marginTop:12,background:"transparent",border:`1px solid ${C.s3}`,borderRadius:10,padding:"8px 14px",color:C.accent,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Responder</button>
        </div>
      </div>
    </div>
  );
};

function LineChart({ data, color, label, unit, height=90, width=310 }) {
  const [hover, setHover] = useState(null);
  if (!data || data.length < 2) return (
    <div style={{height,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{color:C.gray,fontSize:12}}>Cargá más registros para ver el gráfico</p>
    </div>
  );
  const vals = data.map(d => d.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const pad = { t:12, r:8, b:24, l:30 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;

  const px = i => pad.l + (i / (data.length - 1)) * W;
  const py = v => pad.t + H - ((v - min) / range) * H;

  const polyline = data.map((d,i) => `${px(i)},${py(d.value)}`).join(" ");
  const area = `M${px(0)},${py(data[0].value)} ` +
    data.map((d,i)=>`L${px(i)},${py(d.value)}`).join(" ") +
    ` L${px(data.length-1)},${pad.t+H} L${px(0)},${pad.t+H} Z`;

  return (
    <div style={{position:"relative",userSelect:"none"}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        onMouseLeave={()=>setHover(null)}
        style={{overflow:"visible",display:"block"}}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
          </linearGradient>
        </defs>

        {[0,.5,1].map(t=>(
          <line key={t} x1={pad.l} x2={pad.l+W} y1={pad.t+H*(1-t)} y2={pad.t+H*(1-t)}
            stroke={C.s2} strokeWidth="1" strokeDasharray="3 3"/>
        ))}

        {[0,.5,1].map(t=>(
          <text key={t} x={pad.l-4} y={pad.t+H*(1-t)+4} textAnchor="end"
            fill={C.gray} fontSize="8" fontFamily="Space Mono,monospace">
            {(min + range*t).toFixed(1)}
          </text>
        ))}

        <path d={area} fill={`url(#grad-${label})`}/>

        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {data.map((d,i)=>(
          <g key={i} onMouseEnter={()=>setHover(i)}>
            <circle cx={px(i)} cy={py(d.value)} r="8" fill="transparent"/>
            <circle cx={px(i)} cy={py(d.value)} r={hover===i?5:3}
              fill={hover===i?color:C.bg} stroke={color} strokeWidth="2"
              style={{transition:"r .15s"}}/>

            <text x={px(i)} y={pad.t+H+14} textAnchor="middle"
              fill={hover===i?C.white:C.gray} fontSize="8" fontFamily="DM Sans,sans-serif">
              {d.label}
            </text>
          </g>
        ))}

        {hover !== null && (()=>{
          const x=px(hover), y=py(data[hover].value);
          const tx = x > W*0.75 ? x-58 : x+8;
          return (
            <g>
              <line x1={x} y1={pad.t} x2={x} y2={pad.t+H} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity=".5"/>
              <rect x={tx} y={y-18} width={52} height={22} rx="6" fill={C.s3}/>
              <text x={tx+26} y={y-3} textAnchor="middle" fill={C.white} fontSize="10"
                fontFamily="Space Mono,monospace" fontWeight="700">
                {data[hover].value}{unit}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

const SEED_DATA = [
  { date:"2025-10-01", label:"Oct",  weight:88, muscle:30, fat:24, pecho:100, cintura:90, brazos:36, piernas:56 },
  { date:"2025-11-01", label:"Nov",  weight:86, muscle:31, fat:23, pecho:101, cintura:89, brazos:37, piernas:57 },
  { date:"2025-12-01", label:"Dic",  weight:85, muscle:31, fat:22, pecho:101, cintura:88, brazos:37, piernas:57 },
  { date:"2026-01-01", label:"Ene",  weight:83, muscle:32, fat:21, pecho:102, cintura:87, brazos:38, piernas:58 },
  { date:"2026-02-01", label:"Feb",  weight:82, muscle:33, fat:20, pecho:102, cintura:86, brazos:38, piernas:58 },
  { date:"2026-03-01", label:"Mar",  weight:80, muscle:34, fat:18, pecho:103, cintura:85, brazos:39, piernas:59 },
];

function ProgresoScreen(props) {
  const userPlan = props.userPlan || "free";
  const navigate = props.navigate || (()=>{});
  const HISTORY_DAYS = userPlan === "free" ? 10 : 9999;
  const [showUpgChart, setShowUpgChart] = useState(false);
  const [tab, setTab]         = useState("graficos");
  const [entries, setEntries] = useState(SEED_DATA);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [activeChart, setActiveChart] = useState("weight");
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    date: today, weight:"", muscle:"", fat:"",
    pecho:"", cintura:"", brazos:"", piernas:""
  });

  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSave = () => {
    if (!form.weight) return;
    const mo = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const d = new Date(form.date);
    const newEntry = {
      date: form.date,
      label: mo[d.getMonth()]+"\n"+d.getDate(),
      weight:  parseFloat(form.weight)  || null,
      muscle:  parseFloat(form.muscle)  || null,
      fat:     parseFloat(form.fat)     || null,
      pecho:   parseFloat(form.pecho)   || null,
      cintura: parseFloat(form.cintura) || null,
      brazos:  parseFloat(form.brazos)  || null,
      piernas: parseFloat(form.piernas) || null,
    };
    setEntries(prev => {
      const idx = prev.findIndex(e=>e.date===form.date);
      if (idx>=0) { const n=[...prev]; n[idx]=newEntry; return n; }
      return [...prev, newEntry].sort((a,b)=>a.date.localeCompare(b.date));
    });
    setShowForm(false);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
    setForm({date:today,weight:"",muscle:"",fat:"",pecho:"",cintura:"",brazos:"",piernas:""});
  };
  const cutoffDate = userPlan === "free" ? new Date(Date.now() - HISTORY_DAYS * 86400000).toISOString().split("T")[0] : "2000-01-01";
  const visibleEntries = entries.filter(e => e.date >= cutoffDate);
  const latest  = visibleEntries[visibleEntries.length-1];
  const prev    = visibleEntries[visibleEntries.length-2];
  const diff    = (k, unit="") => {
    if (!latest||!prev||latest[k]==null||prev[k]==null) return null;
    const d = (latest[k]-prev[k]);
    return (d>0?"+":"")+d.toFixed(1)+unit;
  };
  const diffCol = (k, positiveGood=false) => {
    const d = latest&&prev ? latest[k]-prev[k] : 0;
    if (d===0) return C.gray;
    return (positiveGood ? d>0 : d<0) ? C.accent : C.red;
  };

  const displayEntries = (tab === "historial") ? visibleEntries : visibleEntries;
  const chartEntries   = visibleEntries;
  const chartConfigs = [
    { key:"weight",  label:"Peso",     unit:"kg", color:C.accent,  icon:"⚖️"  },
    { key:"muscle",  label:"Músculo",  unit:"%",  color:C.blue,    icon:"💪"  },
    { key:"fat",     label:"Grasa",    unit:"%",  color:C.orange,  icon:"🔥"  },
  ];
  const measConfigs = [
    { key:"pecho",   label:"Pecho",   color:"#A78BFA" },
    { key:"cintura", label:"Cintura", color:C.orange  },
    { key:"brazos",  label:"Brazos",  color:C.blue    },
    { key:"piernas", label:"Piernas", color:C.accent  },
  ];

  const getChartData = (key) =>
    entries.filter(e=>e[key]!=null).map(e=>({ label:e.label, value:e[key] }));
  if (showForm) return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{ padding:"18px 20px 14px", background:C.s0, borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
        <button onClick={()=>setShowForm(false)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>
          ← Volver
        </button>
        <h2 className="bb" style={{fontSize:30,letterSpacing:.5,color:C.white}}>CARGAR DÍA</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:2}}>Registrá tus métricas de hoy</p>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 20px"}}>

        <div style={{marginBottom:18}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:7}}>Fecha</label>
          <input type="date" value={form.date} onChange={e=>upd("date",e.target.value)}
            style={{ width:"100%",padding:"13px 16px",background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:13,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif",colorScheme:"dark" }}/>
        </div>


        <p style={{fontSize:10,fontWeight:700,color:C.grayL,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Composición corporal</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
          {[
            {k:"weight", label:"Peso", unit:"kg", color:C.accent,  ph:"80"},
            {k:"muscle",  label:"Músculo", unit:"%", color:C.blue,   ph:"34"},
            {k:"fat",     label:"Grasa",   unit:"%", color:C.orange, ph:"18"},
          ].map(f=>(
            <div key={f.k} style={{ background:C.s1, borderRadius:16, padding:"14px 12px", border:`1px solid ${C.s2}`, textAlign:"center" }}>
              <p style={{fontSize:10,color:f.color,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",marginBottom:8}}>{f.label}</p>
              <input type="number" value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}
                placeholder={f.ph} min="0" max="500" step="0.1"
                style={{ width:"100%", padding:"10px 6px", background:C.s2, border:`1.5px solid ${form[f.k]?f.color:C.s3}`, borderRadius:11, color:C.white, fontSize:16, fontWeight:700, fontFamily:"'Space Mono',monospace", textAlign:"center", transition:"border-color .2s" }}/>
              <p style={{fontSize:10,color:C.gray,marginTop:5}}>{f.unit}</p>
            </div>
          ))}
        </div>


        <p style={{fontSize:10,fontWeight:700,color:C.grayL,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Medidas corporales (cm)</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {k:"pecho",   label:"Pecho",   icon:"🫁", ph:"102"},
            {k:"cintura", label:"Cintura", icon:"📏", ph:"85"},
            {k:"brazos",  label:"Brazos",  icon:"💪", ph:"38"},
            {k:"piernas", label:"Piernas", icon:"🦵", ph:"58"},
          ].map(f=>(
            <div key={f.k} style={{ background:C.s1, borderRadius:14, padding:"12px 14px", border:`1px solid ${C.s2}`, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{fontSize:22}}>{f.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:11,color:C.gray,fontWeight:600,marginBottom:5}}>{f.label}</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <input type="number" value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}
                    placeholder={f.ph} min="0" max="200" step="0.5"
                    style={{ width:"100%", padding:"8px 10px", background:C.s2, border:`1.5px solid ${form[f.k]?C.accent:C.s3}`, borderRadius:9, color:C.white, fontSize:15, fontWeight:700, fontFamily:"'Space Mono',monospace", textAlign:"center", transition:"border-color .2s" }}/>
                  <span style={{fontSize:11,color:C.gray,flexShrink:0}}>cm</span>
                </div>
              </div>
            </div>
          ))}
        </div>


        {latest && (
          <div style={{ background:`${C.accent}08`, borderRadius:14, padding:"12px 16px", border:`1px solid ${C.accent}20`, marginBottom:4 }}>
            <p style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:4}}>Último registro ({latest.label})</p>
            <p style={{fontSize:12,color:C.grayL}}>
              Peso: <strong>{latest.weight}kg</strong> · Músculo: <strong>{latest.muscle}%</strong> · Grasa: <strong>{latest.fat}%</strong>
            </p>
          </div>
        )}
      </div>

      <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.s2}`, flexShrink:0, display:"flex", gap:10 }}>
        <button onClick={()=>setShowForm(false)} style={{ flex:.5, background:"transparent", border:`1.5px solid ${C.s2}`, borderRadius:14, padding:"15px", fontSize:14, fontWeight:600, color:C.grayL, cursor:"pointer", fontFamily:"inherit" }}>
          Cancelar
        </button>
        <button onClick={handleSave} disabled={!form.weight}
          style={{flex:1,background:form.weight?C.accent:C.s2,color:form.weight?C.bg:C.gray,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:form.weight?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .3s"}}>
          Guardar registro
        </button>
      </div>
    </div>
  );
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      <div style={{ padding:"18px 20px 14px", background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`, flexShrink:0 }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1,marginBottom:2}}>MI PROGRESO</h2>
            <p style={{color:C.gray,fontSize:13}}>{entries.length} registros · últimos {entries.length} meses</p>
          </div>
          <button onClick={()=>setShowForm(true)}
            style={{background:C.accent,color:C.bg,border:"none",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            + Cargar hoy
          </button>
        </div>


        {saved && (
          <div className="slide-up" style={{ marginTop:10, background:`${C.accent}20`, border:`1px solid ${C.accent}40`, borderRadius:10, padding:"8px 14px" }}>
            <p style={{fontSize:12,color:C.accent,fontWeight:600}}>✓ Registro guardado correctamente</p>
          </div>
        )}


        {latest && (
          <div style={{display:"flex",gap:8,marginTop:14,overflowX:"auto",paddingBottom:2}}>
            {[
              {l:"Peso",    v:`${latest.weight}kg`,  d:diff("weight","kg"), col:diffCol("weight",false)},
              {l:"Músculo", v:`${latest.muscle}%`,   d:diff("muscle","%"),  col:diffCol("muscle",true)},
              {l:"Grasa",   v:`${latest.fat}%`,      d:diff("fat","%"),     col:diffCol("fat",false)},
            ].map(s=>(
              <div key={s.l} style={{ flex:1, minWidth:88, background:C.s1, borderRadius:14, padding:"12px 10px", border:`1px solid ${C.s2}`, textAlign:"center" }}>
                <p style={{fontSize:9,color:C.gray,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:.8}}>{s.l}</p>
                <p className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,lineHeight:1}}>{s.v}</p>
                {s.d && <span className="mono" style={{fontSize:10,color:s.col,fontWeight:700}}>{s.d}</span>}
              </div>
            ))}
          </div>
        )}
      </div>


      <div style={{display:"flex",gap:6,padding:"10px 20px 0",background:C.bg,flexShrink:0}}>
        {[{id:"graficos",label:"Graficos"},{id:"medidas",label:"Medidas"},{id:"historial",label:"Historial"},{id:"fotos",label:"Fotos"}].map(t=>(
          <button key={t.id} onClick={()=>{if(t.id==="fotos"){navigate("fotos-progreso");}else setTab(t.id);}} style={{flex:1,padding:"9px 0",borderRadius:12,border:"none",cursor:"pointer",background:tab===t.id?C.accent:C.s1,color:tab===t.id?C.bg:C.gray,fontSize:11,fontWeight:600,fontFamily:"inherit",transition:"all .2s"}}>
            {t.label}
          </button>
        ))}
      </div>


      <div style={{flex:1,overflowY:"auto",padding:"14px 20px 16px"}}>


        {showUpgChart && <UpgradeModal feature="Gráficos completos de progreso" onClose={()=>setShowUpgChart(false)} navigate={navigate}/>}
        {tab==="graficos" && (
          <div>

            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {chartConfigs.map(cc=>(
                <button key={cc.key} onClick={()=>setActiveChart(cc.key)}
                  style={{ flex:1, padding:"8px 4px", borderRadius:11, border:`1.5px solid ${activeChart===cc.key?cc.color:C.s2}`, background:activeChart===cc.key?`${cc.color}18`:C.s1, color:activeChart===cc.key?cc.color:C.gray, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .2s" }}>
                  <span style={{fontSize:16}}>{cc.icon}</span>
                  {cc.label}
                </button>
              ))}
            </div>

            {chartConfigs.filter(cc=>cc.key===activeChart).map(cc=>{
              const data = getChartData(cc.key);
              const vals = data.map(d=>d.value);
              const first = vals[0], last = vals[vals.length-1];
              const totalDiff = last != null && first != null ? (last-first) : null;
              return (
                <div key={cc.key}>
                  <div style={{ background:C.s1, borderRadius:18, padding:"18px 16px", border:`1px solid ${C.s2}`, marginBottom:14 }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div>
                        <p style={{fontSize:10,color:cc.color,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:3}}>Evolución · {cc.label}</p>
                        {latest && latest[cc.key] != null && (
                          <p className="bb" style={{fontSize:32,color:C.white,letterSpacing:.5,lineHeight:1}}>
                            {latest[cc.key]}<span style={{fontSize:16,color:C.gray}}>{cc.unit}</span>
                          </p>
                        )}
                      </div>
                      {totalDiff != null && (
                        <div style={{textAlign:"right"}}>
                          <p style={{fontSize:11,color:C.gray,marginBottom:2}}>Total</p>
                          <p className="mono" style={{fontSize:16,fontWeight:700,color:totalDiff<0 === (cc.key!=="muscle") ? C.accent :C.red}}>
                            {totalDiff>0?"+":""}{totalDiff.toFixed(1)}{cc.unit}
                          </p>
                        </div>
                      )}
                    </div>
                    <LineChart data={data} color={cc.color} label={cc.label} unit={cc.unit} height={110} width={310}/>
                  </div>


                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {chartConfigs.filter(x=>x.key!==cc.key).map(oc=>{
                      const od = getChartData(oc.key);
                      const ov = od.map(d=>d.value);
                      return (
                        <div key={oc.key} onClick={()=>setActiveChart(oc.key)}
                          style={{ background:C.s1, borderRadius:14, padding:"14px", border:`1px solid ${C.s2}`, cursor:"pointer" }}>
                          <p style={{fontSize:10,color:oc.color,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",marginBottom:6}}>{oc.icon} {oc.label}</p>
                          <LineChart data={od} color={oc.color} label={oc.key} unit={oc.unit} height={55} width={136}/>
                          {ov.length>0 && <p className="mono" style={{fontSize:13,color:C.white,fontWeight:700,marginTop:4}}>{ov[ov.length-1]}{oc.unit}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {tab==="medidas" && (
          <div>
            {measConfigs.map(mc=>{
              const data = getChartData(mc.key);
              const vals = data.map(d=>d.value);
              const first = vals[0], last = vals[vals.length-1];
              const totalDiff = last != null && first != null ? (last-first) : null;
              return (
                <div key={mc.key} style={{ background:C.s1, borderRadius:18, padding:"16px", border:`1px solid ${C.s2}`, marginBottom:12 }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div>
                      <p style={{fontSize:10,color:mc.color,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:2}}>{mc.label}</p>
                      {last != null && <p className="bb" style={{fontSize:26,color:C.white,lineHeight:1}}>{last} <span style={{fontSize:14,color:C.gray}}>cm</span></p>}
                    </div>
                    {totalDiff != null && (
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:10,color:C.gray,marginBottom:2}}>Cambio total</p>
                        <p className="mono" style={{fontSize:15,fontWeight:700,color:totalDiff>=0?C.accent:C.red}}>
                          {totalDiff>0?"+":""}{totalDiff.toFixed(1)} cm
                        </p>
                      </div>
                    )}
                  </div>
                  <LineChart data={data} color={mc.color} label={mc.key} unit="cm" height={90} width={310}/>
                </div>
              );
            })}
          </div>
        )}


        {tab==="historial" && (
          <div>
            {[...entries].reverse().map((e,i)=>(
              <div key={e.date} style={{ background:C.s1, borderRadius:16, padding:"14px 16px", marginBottom:10, border:`1px solid ${C.s2}` }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div>
                    <p className="mono" style={{fontSize:12,color:C.accent,fontWeight:700}}>{e.date}</p>
                    {i===0 && <span style={{ fontSize:10, background:`${C.accent}20`, color:C.accent, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>ÚLTIMO</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[
                    {l:"Peso",    v:e.weight,  u:"kg", col:C.accent},
                    {l:"Músculo", v:e.muscle,  u:"%",  col:C.blue},
                    {l:"Grasa",   v:e.fat,     u:"%",  col:C.orange},
                  ].filter(x=>x.v!=null).map(x=>(
                    <div key={x.l} style={{background:C.s2,borderRadius:10,padding:"7px 12px",textAlign:"center"}}>
                      <p style={{fontSize:9,color:C.gray,fontWeight:600,textTransform:"uppercase",marginBottom:3}}>{x.l}</p>
                      <p className="mono" style={{fontSize:14,color:x.col,fontWeight:700}}>{x.v}{x.u}</p>
                    </div>
                  ))}
                </div>
                {(e.pecho||e.cintura||e.brazos||e.piernas) && (
                  <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[["Pecho",e.pecho],["Cintura",e.cintura],["Brazos",e.brazos],["Piernas",e.piernas]].filter(x=>x[1]!=null).map(([l,v])=>(
                      <span key={l} style={{fontSize:11,color:C.grayL,background:C.s3,padding:"3px 10px",borderRadius:8}}>
                        {l}: <strong>{v}cm</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

function NotificacionesScreen(props) {
  const navigate = props.navigate;
  const DIAS_L = ['D','L','M','X','J','V','S'];
  const [notifs, setNotifs] = useState({
    peso:     { enabled:true,  hour:8,  min:0,  days:[1,3,5], label:'Cargar métricas',    icon:'⚖️', color:C.accent,  desc:'Peso · grasa corporal · medidas' },
    foto:     { enabled:true,  hour:9,  min:0,  days:[1],     label:'Foto al coach',      icon:'📸', color:C.blue,    desc:'Enviar foto de progreso semanal' },
    entreno:  { enabled:true,  hour:7,  min:30, days:[1,2,3,4,5], label:'Hora de entrenar', icon:'💪', color:C.orange, desc:'Recordatorio antes de tu sesión' },
    descanso: { enabled:false, hour:22, min:0,  days:[0,1,2,3,4,5,6], label:'Hora de dormir', icon:'😴', color:'#A78BFA', desc:'Para respetar tus horas de sueño' },
    agua:     { enabled:false, hour:12, min:0,  days:[0,1,2,3,4,5,6], label:'Hidratación', icon:'💧', color:C.blue,   desc:'Recordatorio de ingesta de agua' },
  });
  const [editing, setEditing] = useState(null);
  const toggle = k => setNotifs(p=>({...p,[k]:{...p[k],enabled:!p[k].enabled}}));
  const toggleDay = (k,d) => setNotifs(p=>({...p,[k]:{...p[k],days:p[k].days.includes(d)?p[k].days.filter(x=>x!==d):[...p[k].days,d].sort()}}));
  const editN = editing ? notifs[editing] : null;

  if (editing) return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'14px 20px',background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>setEditing(null)} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:10}}>← Volver</button>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:48,height:48,borderRadius:15,background:`${editN.color}18`,border:`1.5px solid ${editN.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{editN.icon}</div>
          <div><h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:.5}}>{editN.label}</h2><p style={{color:C.gray,fontSize:12}}>{editN.desc}</p></div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
        <div style={{background:C.s1,borderRadius:18,padding:20,marginBottom:14}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:'uppercase',marginBottom:16}}>Horario</p>
          <div style={{display:'flex',justifyContent:'center',gap:8,alignItems:'center'}}>
            <NumInput label="Hora" value={editN.hour} onChange={v=>setNotifs(p=>({...p,[editing]:{...p[editing],hour:Math.max(0,Math.min(23,v))}}))} min={0} max={23}/>
            <span className="mono" style={{fontSize:28,color:C.white,fontWeight:700,marginTop:18}}>:</span>
            <NumInput label="Min" value={editN.min} onChange={v=>setNotifs(p=>({...p,[editing]:{...p[editing],min:Math.max(0,Math.min(55,Math.round(v/5)*5))}}))} min={0} max={55}/>
          </div>
          <p style={{textAlign:'center',marginTop:14}}><span className="mono" style={{fontSize:36,color:editN.color,fontWeight:700}}>{String(editN.hour).padStart(2,'0')}:{String(editN.min).padStart(2,'0')}</span></p>
        </div>
        <div style={{background:C.s1,borderRadius:18,padding:18,marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:'uppercase'}}>Días</p>
            <button onClick={()=>setNotifs(p=>({...p,[editing]:{...p[editing],days:[0,1,2,3,4,5,6]}}))} style={{background:'transparent',border:'none',color:editN.color,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Todos los días</button>
          </div>
          <div style={{display:'flex',gap:7,justifyContent:'center'}}>
            {DIAS_L.map((d,i) => {
              const on = editN.days.includes(i);
              return <div key={i} onClick={()=>toggleDay(editing,i)} style={{width:38,height:38,borderRadius:11,background:on?`${editN.color}20`:C.s2,border:`2px solid ${on?editN.color:C.s3}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .2s'}}><span style={{fontSize:12,fontWeight:700,color:on?editN.color:C.gray}}>{d}</span></div>;
            })}
          </div>
          <p style={{fontSize:11,color:C.gray,marginTop:12,textAlign:'center'}}>{editN.days.length===7?'Todos los días':editN.days.length===0?'Sin días activos':`${editN.days.length} día${editN.days.length>1?'s':''}/semana`}</p>
        </div>
      </div>
      <div style={{padding:'14px 20px',borderTop:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>setEditing(null)} style={{width:'100%',background:editN.color,color:C.bg,border:'none',borderRadius:14,padding:'15px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Guardar notificación</button>
      </div>
    </div>
  );

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'18px 20px 14px',background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate('perfil')} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>NOTIFICACIONES</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Programá tus recordatorios</p>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px 20px'}}>
        {Object.entries(notifs).map(([k,n]) => (
          <div key={k} style={{background:C.s1,borderRadius:18,padding:'14px 16px',marginBottom:10,border:`1px solid ${n.enabled?n.color+'25':C.s2}`,transition:'all .3s'}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:46,height:46,borderRadius:14,background:`${n.color}${n.enabled?'15':'08'}`,border:`1.5px solid ${n.color}${n.enabled?'40':'20'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0,transition:'all .3s'}}>{n.icon}</div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:14,color:n.enabled?C.white:C.gray,marginBottom:2}}>{n.label}</p>
                <p style={{fontSize:11,color:C.gray}}>{n.desc}</p>
                {n.enabled && <div style={{display:'flex',gap:8,marginTop:4}}><span className="mono" style={{fontSize:12,color:n.color,fontWeight:700}}>{String(n.hour).padStart(2,'0')}:{String(n.min).padStart(2,'0')}</span><span style={{fontSize:11,color:C.gray}}>{n.days.length===7?'· Todos los días':`· ${n.days.length}x/sem`}</span></div>}
              </div>
              <div onClick={()=>toggle(k)} style={{width:46,height:26,borderRadius:13,background:n.enabled?n.color:C.s3,cursor:'pointer',position:'relative',flexShrink:0,transition:'background .3s'}}>
                <div style={{width:20,height:20,borderRadius:10,background:C.white,position:'absolute',top:3,left:n.enabled?23:3,transition:'left .3s',boxShadow:'0 1px 4px rgba(0,0,0,.4)'}}/>
              </div>
            </div>
            {n.enabled && <button onClick={()=>setEditing(k)} style={{marginTop:10,width:'100%',background:C.s2,border:`1px solid ${C.s3}`,borderRadius:10,padding:'8px',fontSize:12,fontWeight:600,color:C.grayL,cursor:'pointer',fontFamily:'inherit'}}>✏ Editar horario y días</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

function MiPlanScreen(props) {
  const navigate     = props.navigate;
  const userPlan     = props.userPlan    || "free";
  const setUserPlan  = props.setUserPlan || (()=>{});
  const [country, setCountry]   = useState("AR");
  const [tab, setTab]           = useState("planes");
  const currentPlan             = userPlan;
  const [selPackage, setSelPackage] = useState("pro");

  const ctry = PRICING.countries.find(c=>c.id===country) || PRICING.countries[0];
  const sym  = ctry.symbol;

  const PLAN_ORDER = ["free","pro","coach"];

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>MI PLAN</h2>
            <p style={{color:C.gray,fontSize:13,marginTop:3}}>Gestión de suscripción</p>
          </div>

          <div style={{display:"flex",gap:5}}>
            {PRICING.countries.map(c=>(
              <button key={c.id} onClick={()=>setCountry(c.id)}
                style={{width:34,height:34,borderRadius:10,border:`1.5px solid ${country===c.id?C.accent:C.s3}`,background:country===c.id?`${C.accent}15`:C.s1,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                {c.flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>


        <div style={{background:`linear-gradient(135deg,#6868A020,#6868A008)`,border:`1.5px solid #6868A040`,borderRadius:16,padding:"14px 16px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:3}}>Plan actual</p>
            <p className="bb" style={{fontSize:24,color:"#9898C0",letterSpacing:1}}>GRATIS</p>
            <p style={{fontSize:12,color:C.gray,marginTop:2}}>Sin vencimiento</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p className="mono" style={{fontSize:28,color:"#9898C0",fontWeight:700}}>$0</p>
            <p style={{fontSize:10,color:C.gray}}>/mes</p>
          </div>
        </div>


        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Elegí tu plan · {ctry.flag} {ctry.name}</p>


        <div style={{background:(currentPlan==="free")?`${PRICING.plans.free.color}10`:C.s1,border:`1.5px solid ${(currentPlan==="free")?PRICING.plans.free.color:C.s2}`,borderRadius:18,padding:"16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${PRICING.plans.free.color}18`,border:`1.5px solid ${PRICING.plans.free.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{PRICING.plans.free.icon}</div>
              <div>
                <p className="bb" style={{fontSize:20,color:PRICING.plans.free.color,letterSpacing:1,lineHeight:1}}>{PRICING.plans.free.label}</p>
                {(currentPlan==="free") && <Pill color={PRICING.plans.free.color}>ACTIVO</Pill>}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <p className="mono" style={{fontSize:24,color:PRICING.plans.free.color,fontWeight:700}}>$0</p>
              <p style={{fontSize:10,color:C.gray}}>/mes</p>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:(currentPlan==="free")?0:12}}>
            {PRICING.plans.free.features.map(f=>(
              <div key={f.text} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:12,color:f.ok?C.accent:C.red,marginTop:1,flexShrink:0}}>{f.ok?"✓":"✗"}</span>
                <span style={{fontSize:12,color:f.ok?C.grayL:C.gray,lineHeight:1.4}}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>


        <div style={{background:(currentPlan==="pro")?`${PRICING.plans.pro.color}10`:C.s1,border:`1.5px solid ${(currentPlan==="pro")?PRICING.plans.pro.color:C.s2}`,borderRadius:18,padding:"16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${PRICING.plans.pro.color}18`,border:`1.5px solid ${PRICING.plans.pro.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{PRICING.plans.pro.icon}</div>
              <div>
                <p className="bb" style={{fontSize:20,color:PRICING.plans.pro.color,letterSpacing:1,lineHeight:1}}>{PRICING.plans.pro.label}</p>
                <p style={{fontSize:10,color:C.gray}}>Autodidacta · sin coach</p>
                {(currentPlan==="pro") && <Pill color={PRICING.plans.pro.color}>ACTIVO</Pill>}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <p className="mono" style={{fontSize:22,color:PRICING.plans.pro.color,fontWeight:700}}>{ctry.proLabel}</p>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
            {PRICING.plans.pro.features.map(f=>(
              <div key={f.text} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:12,color:f.ok?C.accent:C.gray,marginTop:1,flexShrink:0}}>{f.ok?"✓":"—"}</span>
                <span style={{fontSize:12,color:f.ok?C.grayL:C.gray,lineHeight:1.4}}>{f.text}</span>
              </div>
            ))}
          </div>
          {!(currentPlan==="pro") && (
            <button onClick={()=>setUserPlan("pro")}
              style={{width:"100%",background:`linear-gradient(135deg,${PRICING.plans.pro.color},#64FF80)`,color:C.bg,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              ⚡ Activar PRO · {ctry.proLabel}
            </button>
          )}
        </div>


        <div style={{background:(currentPlan==="coach")?`${PRICING.plans.coach.color}10`:C.s1,border:`1.5px solid ${(currentPlan==="coach")?PRICING.plans.coach.color:C.s2}`,borderRadius:18,padding:"16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${PRICING.plans.coach.color}18`,border:`1.5px solid ${PRICING.plans.coach.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{PRICING.plans.coach.icon}</div>
              <div>
                <p className="bb" style={{fontSize:20,color:PRICING.plans.coach.color,letterSpacing:1,lineHeight:1}}>{PRICING.plans.coach.label}</p>
                <p style={{fontSize:10,color:C.gray}}>PRO incluido automáticamente</p>
              </div>
            </div>
          </div>

          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {p.packages.map(pkg=>(
              <button key={pkg.id} onClick={()=>setSelPackage(pkg.id)}
                style={{flex:1,padding:"8px 4px",borderRadius:10,border:`1.5px solid ${selPackage===pkg.id?PRICING.plans.coach.color:C.s3}`,background:selPackage===pkg.id?`${PRICING.plans.coach.color}15`:C.s2,color:selPackage===pkg.id?PRICING.plans.coach.color:C.gray,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                {pkg.icon} {pkg.label}
              </button>
            ))}
          </div>

          {p.packages.filter(pkg=>pkg.id===selPackage).map(pkg=>(
            <div key={pkg.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <p style={{fontSize:11,color:C.gray}}>Precio del coach (mínimo FORZA)</p>
                <p className="mono" style={{fontSize:14,color:PRICING.plans.coach.color,fontWeight:700}}>{sym}{ctry.coachFloor[pkg.id].toLocaleString()}/mes</p>
              </div>
              <p style={{fontSize:9,color:C.gray,marginBottom:8,fontStyle:"italic"}}>Rango recomendado: {ctry.coachRange[pkg.id]}</p>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                {pkg.features.map(f=>(
                  <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{fontSize:12,color:PRICING.plans.coach.color,flexShrink:0,marginTop:1}}>✓</span>
                    <span style={{fontSize:12,color:C.grayL,lineHeight:1.4}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>navigate("chat")}
                style={{width:"100%",background:`linear-gradient(135deg,${PRICING.plans.coach.color},#FF4466)`,color:C.white,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                Buscar coach · {pkg.icon} {pkg.label}
              </button>
            </div>
          ))}
        </div>


        {currentPlan !== "free" && (
          <div style={{marginTop:8,background:`${C.red}08`,border:`1px solid ${C.red}25`,borderRadius:14,padding:"13px 16px"}}>
            <p style={{fontSize:12,color:C.red,fontWeight:600,marginBottom:4}}>Cancelar suscripción</p>
            <p style={{fontSize:12,color:C.gray,marginBottom:10}}>Podés cancelar en cualquier momento. Seguís con acceso hasta el fin del período.</p>
            <button style={{background:"transparent",border:`1px solid ${C.red}50`,borderRadius:10,padding:"8px 16px",color:C.red,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

function PagosScreen(props) {
  const navigate = props.navigate;
  const [cards] = useState([
    { brand:'Visa', last4:'4242', expiry:'12/27', color:`linear-gradient(135deg,#1a1a2e,#16213e)`, accent:'#4488FF' },
    { brand:'Mastercard', last4:'5391', expiry:'08/26', color:`linear-gradient(135deg,#1a0a00,#2d1600)`, accent:C.orange },
  ]);
  const [activeCard, setActiveCard] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ num:'', name:'', exp:'', cvv:'' });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const formatNum = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExp = v => { const d=v.replace(/\D/g,''); return d.length>2?d.slice(0,2)+'/'+d.slice(2,4):d; };

  const displayNum = form.num ? form.num : '•••• •••• •••• ••••';
  const displayName = form.name || 'NOMBRE APELLIDO';
  const displayExp = form.exp || 'MM/AA';

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'18px 20px 14px',background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate('perfil')} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>PAGOS</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Tus métodos de pago</p>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px 20px'}}>
        {!showForm ? (
          <>

            {cards.map((c,i) => (
              <div key={i} onClick={()=>setActiveCard(i)} style={{background:c.color,borderRadius:20,padding:'20px 22px',marginBottom:12,border:`2px solid ${i===activeCard?c.accent:'transparent'}`,cursor:'pointer',transition:'all .3s',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,.04)'}}/>
                <div style={{position:'absolute',bottom:-20,left:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,.04)'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
                  <div style={{width:36,height:26,borderRadius:6,background:`${c.accent}40`,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:28,height:18,borderRadius:3,background:c.accent,opacity:.7}}/></div>
                  <p style={{fontWeight:700,fontSize:15,color:'rgba(255,255,255,.7)',letterSpacing:.5}}>{c.brand}</p>
                </div>
                <p className="mono" style={{fontSize:17,color:C.white,letterSpacing:3,marginBottom:16}}>•••• •••• •••• {c.last4}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><p style={{fontSize:9,color:'rgba(255,255,255,.4)',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Vence</p><p className="mono" style={{fontSize:13,color:C.white}}>{c.expiry}</p></div>
                  {i===activeCard && <Pill color={c.accent}>Principal</Pill>}
                </div>
              </div>
            ))}
            <button onClick={()=>setShowForm(true)} style={{width:'100%',background:'transparent',border:`1.5px dashed ${C.s3}`,borderRadius:18,padding:'16px',fontSize:13,fontWeight:600,color:C.gray,cursor:'pointer',fontFamily:'inherit',marginBottom:18}}>+ Agregar nueva tarjeta</button>

            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>Historial de pagos</p>
            {[{d:'10 Mar 2026',plan:'Premium',m:'$25',ok:true},{d:'10 Feb 2026',plan:'Premium',m:'$25',ok:true},{d:'10 Ene 2026',plan:'Premium',m:'$25',ok:true}].map((t,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:C.s1,borderRadius:14,padding:'12px 16px',marginBottom:8,border:`1px solid ${C.s2}`}}>
                <div><p style={{fontSize:13,fontWeight:600,color:C.white}}>{t.plan}</p><p style={{fontSize:11,color:C.gray,marginTop:2}}>{t.d}</p></div>
                <div style={{textAlign:'right'}}><p className="mono" style={{fontSize:16,color:C.accent,fontWeight:700}}>{t.m}</p><span style={{fontSize:10,color:'#40FF80'}}>✓ Pagado</span></div>
              </div>
            ))}
          </>
        ) : (
          <>

            <div style={{background:`linear-gradient(135deg,${C.s1},${C.s0})`,borderRadius:20,padding:'20px 22px',marginBottom:20,border:`1px solid ${C.accent}30`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:`${C.accent}05`}}/>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
                <div style={{width:36,height:26,borderRadius:6,background:`${C.accent}20`,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:28,height:18,borderRadius:3,background:C.accent,opacity:.5}}/></div>
                <p style={{fontWeight:700,fontSize:14,color:C.grayL}}>Nueva tarjeta</p>
              </div>
              <p className="mono" style={{fontSize:16,color:C.white,letterSpacing:3,marginBottom:16}}>{displayNum}</p>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div><p style={{fontSize:9,color:C.gray,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Titular</p><p style={{fontSize:12,color:C.white}}>{displayName}</p></div>
                <div><p style={{fontSize:9,color:C.gray,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Vence</p><p className="mono" style={{fontSize:12,color:C.white}}>{displayExp}</p></div>
              </div>
            </div>

            {[
              {k:'num',label:'Número de tarjeta',ph:'1234 5678 9012 3456',fmt:formatNum,max:19},
              {k:'name',label:'Nombre del titular',ph:'Como aparece en la tarjeta',fmt:v=>v.toUpperCase(),max:30},
              {k:'exp',label:'Vencimiento',ph:'MM/AA',fmt:formatExp,max:5},
              {k:'cvv',label:'CVV',ph:'•••',fmt:v=>v.replace(/\D/g,'').slice(0,4),max:4},
            ].map(f => (
              <div key={f.k} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:'uppercase',marginBottom:7}}>{f.label}</label>
                <input value={form[f.k]} onChange={e=>upd(f.k,f.fmt(e.target.value))} placeholder={f.ph} maxLength={f.max}
                  style={{width:'100%',padding:'14px 16px',background:C.s1,border:`1.5px solid ${form[f.k]?C.accent:C.s2}`,borderRadius:13,color:C.white,fontSize:14,fontFamily:"'Space Mono',monospace",transition:'border-color .2s',letterSpacing:f.k==='num'?2:0}}/>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:4}}>
              <button onClick={()=>setShowForm(false)} style={{flex:.5,background:'transparent',border:`1.5px solid ${C.s2}`,borderRadius:14,padding:'14px',fontSize:14,fontWeight:600,color:C.grayL,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
              <button onClick={()=>setShowForm(false)} style={{flex:1,background:C.accent,color:C.bg,border:'none',borderRadius:14,padding:'15px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Agregar tarjeta</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function VideosScreen(props) {
  const navigate = props.navigate;
  const userPlan = props.userPlan || "free";
  const [tab, setTab] = useState('mios');
  const [shareId, setShareId] = useState(null);
  const [photoModal, setPhotoModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [cmpA, setCmpA] = useState(0);
  const [cmpB, setCmpB] = useState(2);
  const photosData = [
    {id:1, date:"1 Mar 2026", type:"Frontal", weight:"80 kg", fat:"18%", color:C.accent},
    {id:2, date:"1 Feb 2026", type:"Lateral", weight:"82 kg", fat:"19%", color:C.blue},
    {id:3, date:"1 Ene 2026", type:"Frontal", weight:"85 kg", fat:"21%", color:C.orange},
    {id:4, date:"1 Dic 2025", type:"Frontal", weight:"87 kg", fat:"23%", color:"#A78BFA"},
  ];
  const videos = [
    { id:1, ex:'Press Banca', date:'8 Mar', thumb:'bench', dur:'0:42', shared:true,  comment:'Revisá el arco de espalda en la bajada.' },
    { id:2, ex:'Sillón Cuádriceps', date:'6 Mar', thumb:'legExt', dur:'0:31', shared:false, comment:'' },
    { id:3, ex:'Face Pull', date:'4 Mar', thumb:'facePull', dur:'0:28', shared:true,  comment:'Buena técnica, aumentá 2.5kg la próxima.' },
    { id:4, ex:'Bíceps Martillo', date:'1 Mar', thumb:'hammerCurl', dur:'0:35', shared:false, comment:'' },
  ];
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'18px 20px 14px',background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate('perfil')} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>VIDEOS</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Grabate y compartí con tu coach</p>
      </div>

      <div style={{margin:'0 20px 14px',background:`linear-gradient(135deg,${C.accent}12,${C.blue}08)`,border:`1.5px solid ${C.accent}35`,borderRadius:18,padding:'16px',display:'flex',gap:14,alignItems:'center',flexShrink:0}}>
        <div style={{width:56,height:56,borderRadius:18,background:`${C.accent}18`,border:`2px solid ${C.accent}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>📹</div>
        <div style={{flex:1}}>
          <p style={{fontSize:14,color:C.white,fontWeight:700,marginBottom:3}}>Grabarte haciendo un ejercicio</p>
          <p style={{fontSize:12,color:C.grayL,lineHeight:1.5}}>Tu coach puede corregir tu técnica en tiempo real.</p>
        </div>
        <button style={{background:C.accent,color:C.bg,border:'none',borderRadius:12,padding:'10px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>Grabar</button>
      </div>

      <div style={{display:'flex',gap:0,padding:'0 20px',borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        {[{id:'mios',label:'📹 Videos'},{id:'fotos',label:'📸 Fotos'},{id:'feedback',label:'💬 Feedback'}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'10px 0',border:'none',background:'transparent',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,color:tab===t.id?C.accent:C.gray,borderBottom:tab===t.id?`2px solid ${C.accent}`:'2px solid transparent',transition:'all .2s'}}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px 20px'}}>
        {tab==='mios' && videos.map(v => (
          <div key={v.id} style={{background:C.s1,borderRadius:18,overflow:'hidden',marginBottom:12,border:`1px solid ${C.s2}`}}>
            <div style={{background:C.s2,height:100,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              <ExSVG id={v.thumb} size={72} ac={`${C.accent}60`}/>
              <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,.7)',borderRadius:8,padding:'3px 8px'}}>
                <span className="mono" style={{fontSize:10,color:C.white}}>{v.dur}</span>
              </div>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid rgba(255,255,255,.3)'}}>
                  <span style={{fontSize:16,marginLeft:2}}>▶</span>
                </div>
              </div>
            </div>
            <div style={{padding:'12px 14px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <p style={{fontWeight:700,fontSize:14,color:C.white}}>{v.ex}</p>
                <span style={{fontSize:11,color:C.gray}}>{v.date}</span>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {v.shared ? <Pill color={C.blue}>Enviado al coach</Pill> : <Pill color={C.gray}>Solo yo</Pill>}
                {!v.shared && <button onClick={()=>setShareId(v.id)} style={{background:C.blue,color:C.white,border:'none',borderRadius:8,padding:'4px 12px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>📤 Enviar al coach</button>}
              </div>
            </div>
          </div>
        ))}
        {tab==='feedback' && videos.filter(v=>v.shared && v.comment).map(v => (
          <div key={v.id} style={{background:C.s1,borderRadius:18,padding:'14px 16px',marginBottom:12,border:`1px solid ${C.accent}25`}}>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:10}}>
              <div style={{width:48,height:48,background:C.s2,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <ExSVG id={v.thumb} size={38}/>
              </div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:2}}>{v.ex}</p>
                <span style={{fontSize:10,color:C.gray}}>{v.date}</span>
              </div>
            </div>
            <div style={{background:`${C.accent}08`,border:`1px solid ${C.accent}20`,borderRadius:12,padding:'10px 13px',display:'flex',gap:10}}>
              <div style={{width:28,height:28,borderRadius:9,background:`linear-gradient(135deg,${C.accent},#64FF80)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><SvgIcon name="user" size={14} color={C.bg}/></div>
              <div><p style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:2}}>Coach Ramírez</p><p style={{fontSize:13,color:C.grayL,lineHeight:1.5}}>{v.comment}</p></div>
            </div>
          </div>
        ))}
      </div>
      {shareId && (
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'flex-end',zIndex:500}} onClick={()=>setShareId(null)}>
          <div className="slide-up" style={{width:'100%',background:C.s0,borderRadius:'24px 24px 0 0',padding:'24px 20px 32px'}} onClick={e=>e.stopPropagation()}>
            <h3 className="bb" style={{fontSize:22,color:C.white,marginBottom:4}}>ENVIAR AL COACH</h3>
            <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Coach Ramírez recibirá este video y podrá darte feedback.</p>
            <textarea placeholder="Mensaje adicional (opcional)..." style={{width:'100%',padding:'12px',background:C.s2,border:`1px solid ${C.s3}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:80,resize:'none',marginBottom:14}}/>
            <button onClick={()=>setShareId(null)} style={{width:'100%',background:C.accent,color:C.bg,border:'none',borderRadius:14,padding:'15px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>📤 Enviar video</button>
          </div>
        </div>
      )}
    </div>
  );
};

function ConfiguracionScreen(props) {
  const navigate = props.navigate || (()=>{});
  const [lang, setLang]     = useState('es');
  const [units, setUnits]   = useState('metric');
  const [dark, setDark]     = useState(true);
  const [health, setHealth] = useState({apple:false,google:false});
  const [connecting, setCon] = useState(null);
  const [saved, setSaved]   = useState(false);
  const connectHealth = (type) => {
    setCon(type);
    setTimeout(()=>{setHealth(p=>({...p,[type]:true}));setCon(null);},1800);
  };
  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const themes = [{color:'#C8FF00',name:'Lima'},{color:'#4488FF',name:'Azul'},{color:'#FF4466',name:'Rojo'},{color:'#FF8840',name:'Naranja'},{color:'#A78BFA',name:'Violeta'}];
  const langs = [{id:'es',flag:'🇦🇷',label:'Español'},{id:'en',flag:'🇺🇸',label:'English'},{id:'pt',flag:'🇧🇷',label:'Português'}];
  const unitOpts = [{id:'metric',label:'Métrico',sub:'kg, cm'},{id:'imperial',label:'Imperial',sub:'lb, in'}];
  const healthApps = [{id:'apple',name:'Apple Health',icon:'🍎',sub:'iOS 16+',color:'#FF3B30',hint:'Importa peso, pasos, frecuencia cardíaca'},{id:'google',name:'Google Health',icon:'🤖',sub:'Android 9+',color:'#4285F4',hint:'Importa peso, composición corporal, actividad'}];
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'18px 20px 14px',background:C.s0,flexShrink:0}}>
        <button onClick={()=>navigate('perfil')} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',color:C.grayL,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>CONFIGURACION</h2>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px 20px'}}>
        {saved && <div style={{background:C.accent+'18',border:'1px solid '+C.accent+'40',borderRadius:12,padding:'10px 14px',marginBottom:14}}><p style={{fontSize:12,color:C.accent,fontWeight:600}}>Configuración guardada</p></div>}
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Apariencia</p>
        <div style={{background:C.s1,borderRadius:18,padding:'4px 0',marginBottom:16,border:'1px solid '+C.s2}}>
          <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderBottom:'1px solid '+C.s2}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.s2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🌙</div>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:14,color:C.white}}>Modo oscuro</p><p style={{fontSize:11,color:C.gray}}>Activo por defecto</p></div>
            <div onClick={()=>setDark(!dark)} style={{width:46,height:26,borderRadius:13,background:dark?C.accent:C.s3,cursor:'pointer',position:'relative',transition:'background .3s'}}>
              <div style={{width:20,height:20,borderRadius:10,background:C.white,position:'absolute',top:3,left:dark?23:3,transition:'left .3s'}}/>
            </div>
          </div>
          <div style={{padding:'14px 16px'}}>
            <p style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:10}}>Tema de color</p>
            <div style={{display:'flex',gap:8}}>
              {themes.map(t=>(
                <div key={t.name} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer'}}>
                  <div style={{width:36,height:36,borderRadius:11,background:t.color,border:t.color===C.accent?'3px solid '+C.white:'3px solid transparent'}}/>
                  <span style={{fontSize:9,color:t.color===C.accent?C.white:C.gray,fontWeight:600}}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Idioma</p>
        <div style={{background:C.s1,borderRadius:18,padding:'4px 0',marginBottom:16,border:'1px solid '+C.s2}}>
          {langs.map(l=>(
            <div key={l.id} onClick={()=>setLang(l.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderBottom:'1px solid '+C.s2,cursor:'pointer'}}>
              <span style={{fontSize:22}}>{l.flag}</span>
              <p style={{flex:1,fontSize:14,fontWeight:lang===l.id?700:400,color:lang===l.id?C.white:C.gray}}>{l.label}</p>
              {lang===l.id&&<div style={{width:18,height:18,borderRadius:'50%',background:C.accent,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:10,color:C.bg,fontWeight:700}}>✓</span></div>}
            </div>
          ))}
        </div>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Unidades</p>
        <div style={{background:C.s1,borderRadius:18,padding:'4px 0',marginBottom:16,border:'1px solid '+C.s2}}>
          {unitOpts.map(u=>(
            <div key={u.id} onClick={()=>setUnits(u.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderBottom:'1px solid '+C.s2,cursor:'pointer'}}>
              <div style={{flex:1}}><p style={{fontSize:14,fontWeight:units===u.id?700:400,color:units===u.id?C.white:C.gray}}>{u.label}</p><p style={{fontSize:11,color:C.gray}}>{u.sub}</p></div>
              {units===u.id&&<div style={{width:18,height:18,borderRadius:'50%',background:C.accent,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:10,color:C.bg,fontWeight:700}}>✓</span></div>}
            </div>
          ))}
        </div>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Conexion con salud</p>
        {healthApps.map(h=>(
          <div key={h.id} style={{background:C.s1,borderRadius:18,padding:'14px 16px',marginBottom:10,border:'1px solid '+(health[h.id]?h.color+'40':C.s2)}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:44,height:44,borderRadius:14,background:h.color+'15',border:'1.5px solid '+h.color+'30',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{h.icon}</div>
              <div style={{flex:1}}><p style={{fontWeight:700,fontSize:14,color:health[h.id]?C.white:C.grayL}}>{h.name}</p><p style={{fontSize:11,color:C.gray}}>{h.sub}</p></div>
              {health[h.id] ? (<Pill color={h.color}>Conectado</Pill>) : (<button onClick={()=>connectHealth(h.id)} disabled={connecting===h.id} style={{background:h.color,color:C.white,border:'none',borderRadius:10,padding:'8px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:connecting===h.id?0.7:1}}>{connecting===h.id?'Conectando...':'Conectar'}</button>)}
            </div>
            {health[h.id]&&<div style={{background:h.color+'08',borderRadius:10,padding:'8px 12px',marginTop:10}}><p style={{fontSize:11,color:C.grayL}}>{h.hint}</p></div>}
          </div>
        ))}
        <div style={{height:16}}/>
      </div>
      <div style={{padding:'12px 20px',borderTop:'1px solid '+C.s2,flexShrink:0}}>
        <button onClick={handleSave} style={{width:'100%',background:C.accent,color:C.bg,border:'none',borderRadius:14,padding:'15px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Guardar cambios</button>
      </div>
    </div>
  );
};

function CoachMarketplace(props) {
  const onHire = props.onHire;
  const [selected, setSelected] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [country, setCountry]   = useState("AR");

  const ctry = PRICING.countries.find(c=>c.id===country) || PRICING.countries[0];
  const sym  = ctry.symbol;

  const coaches = [
    { id:1, name:"Miguel Ramírez", specialty:"Fuerza y Powerlifting", rating:4.9, students:42,
      color:C.accent, tags:["Fuerza","Hipertrofia","Powerlifting","Periodización"],
      bio:"8 años de experiencia. Especializado en progresión de fuerza y periodización. Múltiples alumnos con PRs históricos en sentadilla y peso muerto.",
      results:["Carlos M. bajó 20kg en 16 semanas","Ana G. pasó de 60 a 100kg en sentadilla","Pedro V. ganó 8kg de masa muscular en 6 meses"],
      prices:{AR:{starter:22000,pro:39900,elite:64900},CL:{starter:28990,pro:52990,elite:84990},GB:{starter:45,pro:80,elite:130},BR:{starter:109,pro:199,elite:319}},
      recommended:{starter:true, pro:true, elite:false} },
    { id:2, name:"Sofía López", specialty:"Funcional y HIIT", rating:4.8, students:38,
      color:C.blue, tags:["HIIT","Funcional","Pérdida de grasa","Resistencia"],
      bio:"Especialista en transformación corporal con métodos funcionales. 6 años acompañando a personas a cambiar su composición corporal de forma sostenible.",
      results:["María T. bajó 15kg en 3 meses","Roberto S. mejoró su VO2 max un 40%","Lucía M. completó su primera carrera de 10k"],
      prices:{AR:{starter:15900,pro:29900,elite:52900},CL:{starter:19990,pro:39990,elite:69990},GB:{starter:35,pro:62,elite:105},BR:{starter:79,pro:149,elite:249}},
      recommended:{starter:true, pro:true, elite:true} },
    { id:3, name:"Diego García", specialty:"Musculación y Volumen", rating:4.7, students:29,
      color:C.orange, tags:["Volumen","Hipertrofia","Nutrición","Avanzado"],
      bio:"Coach certificado NSCA con foco en hipertrofia y nutrición deportiva. Trabaja con atletas intermedios y avanzados que buscan maximizar masa muscular.",
      results:["Tomás K. ganó 12kg en 20 semanas","Santiago R. llegó a 120kg en press banca","Valentina P. redujo grasa 8% manteniendo músculo"],
      prices:{AR:{starter:19900,pro:34900,elite:55900},CL:{starter:24990,pro:44990,elite:74990},GB:{starter:42,pro:72,elite:118},BR:{starter:99,pro:179,elite:289}},
      recommended:{starter:false, pro:true, elite:true} },
  ];

  const coach = selected !== null ? coaches[selected] : null;

  const getPackagePrice = (c, pkgId) => {
    const prices = c.prices[country] || c.prices["AR"];
    return prices[pkgId];
  };

  const isRecommended = (c, pkgId) => c.recommended[pkgId];

  if (checkout) return (
    <PaymentCheckout coach={checkout} onBack={()=>setCheckout(null)} onConfirm={()=>{ onHire(checkout); setCheckout(null); }}/>
  );

  if (coach) return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 20px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>setSelected(null)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:12}}>← Coaches</button>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${coach.color}35,${coach.color}15)`,border:`2px solid ${coach.color}60`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span className="bb" style={{fontSize:20,color:coach.color}}>{coach.name.split(" ").map(w=>w[0]).join("")}</span>
          </div>
          <div style={{flex:1}}>
            <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,lineHeight:1,marginBottom:3}}>{coach.name}</h3>
            <p style={{fontSize:12,color:C.grayL}}>{coach.specialty}</p>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <span style={{fontSize:12,color:C.orange}}>★ {coach.rating}</span>
              <span style={{fontSize:12,color:C.gray}}>· {coach.students} alumnos</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {coach.tags.map(t=><Pill key={t} color={coach.color}>{t}</Pill>)}
        </div>
        <div style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:14,border:`1px solid ${C.s2}`}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Sobre mí</p>
          <p style={{fontSize:13,color:C.grayL,lineHeight:1.6}}>{coach.bio}</p>
        </div>
        <div style={{background:`${coach.color}08`,borderRadius:16,padding:"14px 16px",marginBottom:16,border:`1px solid ${coach.color}20`}}>
          <p style={{fontSize:10,color:coach.color,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Resultados de alumnos</p>
          {coach.results.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <div style={{width:22,height:22,borderRadius:7,background:`${coach.color}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:11,color:coach.color,fontWeight:700}}>✓</span>
              </div>
              <p style={{fontSize:12,color:C.grayL}}>{r}</p>
            </div>
          ))}
        </div>


        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Paquetes · {ctry.flag} {ctry.name}</p>
        {PRICING.plans.coach.packages.map(pkg=>{
          const price = getPackagePrice(coach, pkg.id);
          const floor = ctry.coachFloor[pkg.id];
          const rec   = isRecommended(coach, pkg.id);
          return (
            <div key={pkg.id} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1.5px solid ${rec?coach.color:C.s2}`,position:"relative"}}>
              {rec && (
                <div style={{position:"absolute",top:-10,right:14,background:coach.color,borderRadius:100,padding:"3px 10px"}}>
                  <span style={{fontSize:9,color:C.bg,fontWeight:700}}>✓ RECOMENDADO</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <p className="bb" style={{fontSize:18,color:rec?coach.color:C.white,letterSpacing:.5}}>{pkg.icon} {pkg.label.toUpperCase()}</p>
                <div style={{textAlign:"right"}}>
                  <p className="mono" style={{fontSize:18,color:rec?coach.color:C.grayL,fontWeight:700}}>{sym}{price.toLocaleString()}/mes</p>
                  {price > floor && <p style={{fontSize:9,color:C.gray}}>mín. {sym}{floor.toLocaleString()}</p>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                {pkg.features.map(f=>(
                  <div key={f} style={{display:"flex",gap:8}}>
                    <span style={{fontSize:11,color:rec?coach.color:C.gray,flexShrink:0}}>✓</span>
                    <span style={{fontSize:12,color:C.grayL}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setCheckout({...coach, selectedPackage:pkg.id, price})}
                style={{width:"100%",background:rec?`linear-gradient(135deg,${coach.color},${coach.color}90)`:C.s2,color:rec?C.bg:C.grayL,border:`1px solid ${rec?coach.color:C.s3}`,borderRadius:11,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                CONTRATAR {pkg.icon} {pkg.label.toUpperCase()} · {sym}{price.toLocaleString()}/mes
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1,lineHeight:1,marginBottom:3}}>COACHES</h2>
        <p style={{color:C.gray,fontSize:13}}>Encontrá tu entrenador ideal</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>

        <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center"}}>
          <span style={{fontSize:11,color:C.gray}}>Precios en:</span>
          {PRICING.countries.map(c=>(
            <button key={c.id} onClick={()=>setCountry(c.id)}
              style={{padding:"5px 10px",borderRadius:10,border:`1.5px solid ${country===c.id?C.accent:C.s3}`,background:country===c.id?`${C.accent}15`:C.s1,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
              {c.flag}
            </button>
          ))}
        </div>

        {coaches.map((c,i)=>{
          const prices = c.prices[country] || c.prices["AR"];
          const starterRec = c.recommended.starter;
          const proRec     = c.recommended.pro;
          return (
            <div key={c.id} style={{background:C.s1,borderRadius:20,padding:"16px",marginBottom:14,border:`1px solid ${C.s2}`,cursor:"pointer"}} onClick={()=>setSelected(i)}>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${c.color}35,${c.color}15)`,border:`2px solid ${c.color}60`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span className="bb" style={{fontSize:16,color:c.color}}>{c.name.split(" ").map(w=>w[0]).join("")}</span>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:2}}>{c.name}</p>
                  <p style={{fontSize:12,color:C.gray,marginBottom:4}}>{c.specialty}</p>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {c.tags.slice(0,3).map(t=><Pill key={t} color={c.color}>{t}</Pill>)}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginBottom:4}}>
                    <span style={{fontSize:12,color:C.orange}}>★</span>
                    <span className="mono" style={{fontSize:13,color:C.white,fontWeight:700}}>{c.rating}</span>
                  </div>
                  <p style={{fontSize:10,color:C.gray}}>{c.students} alumnos</p>
                </div>
              </div>


              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {PRICING.plans.coach.packages.map(pkg=>{
                  const price = (c.prices[country]||c.prices["AR"])[pkg.id];
                  const rec   = c.recommended[pkg.id];
                  return (
                    <div key={pkg.id} style={{background:rec?`${c.color}12`:C.s2,borderRadius:10,padding:"8px",border:`1px solid ${rec?c.color:C.s3}`,textAlign:"center",position:"relative"}}>
                      {rec && <div style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",background:c.color,borderRadius:100,padding:"1px 6px"}}><span style={{fontSize:7,color:C.bg,fontWeight:700}}>RECOM.</span></div>}
                      <p style={{fontSize:9,color:C.gray,marginBottom:3,marginTop:rec?2:0}}>{pkg.icon} {pkg.label}</p>
                      <p className="mono" style={{fontSize:12,color:rec?c.color:C.grayL,fontWeight:700}}>{sym}{price.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function TabataScreen(props) {
  const navigate = props.navigate;
  const userPlan = props.userPlan || "free";
  const [showAdTabata, setShowAdTabata] = useState(false);
  const [phase, setPhase] = useState("config");
  const [work, setWork]   = useState(20);
  const [rest, setRest]   = useState(10);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [running, setRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);

  const totalDuration = rounds * (work + rest);
  const elapsed = (currentRound - 1) * (work + rest) + (isWork ? work - timeLeft : work + rest - timeLeft);
  const overallPct = phase === "running" ? Math.min(100, (elapsed / totalDuration) * 100) : 0;

  const startTimer = () => {
    setPhase("running");
    setCurrentRound(1);
    setIsWork(true);
    setTimeLeft(work);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsWork(w => {
            const nextIsWork = !w;
            if (!nextIsWork) {
              setCurrentRound(r => {
                if (r >= rounds) {
                  setRunning(false);
                  setPhase("done");
                  clearInterval(intervalRef.current);
                  return r;
                }
                return r + 1;
              });
            }
            setTimeLeft(nextIsWork ? work : rest);
            return nextIsWork;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, work, rest, rounds]);

  const r = 80, circ = 2 * Math.PI * r;
  const maxTime = isWork ? work : rest;
  const pct = phase === "running" ? timeLeft / maxTime : 1;
  const phaseColor = isWork ? C.accent : C.blue;

  if (phase === "done") return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <Confetti active={true}/>
      <div style={{fontSize:64,marginBottom:16}}>🏆</div>
      <h2 className="bb" style={{fontSize:42,color:C.accent,letterSpacing:2,marginBottom:6}}>TABATA COMPLETO</h2>
      <p style={{color:C.gray,fontSize:15,marginBottom:24}}>{rounds} rondas · {Math.floor(totalDuration/60)}:{String(totalDuration%60).padStart(2,"0")} min</p>
      <button onClick={()=>{setPhase("config");setRunning(false);}}
        style={{background:C.accent,color:C.bg,border:"none",borderRadius:16,padding:"16px 40px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Repetir Tabata
      </button>
    </div>
  );

  return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      {showAdTabata && <AdScreen onDone={()=>{ setShowAdTabata(false); startTimer(); }} navigate={navigate}/>}
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>TABATA</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Entrenamiento de alta intensidad</p>
      </div>

      {phase === "config" && (
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{background:`${C.accent}08`,border:`1px solid ${C.accent}25`,borderRadius:14,padding:"12px 16px",marginBottom:18}}>
            <p style={{fontSize:12,color:C.accent,fontWeight:700,marginBottom:4}}>💡 ¿Qué es el Tabata?</p>
            <p style={{fontSize:12,color:C.grayL,lineHeight:1.55}}>Protocolo de 20 seg de trabajo máximo + 10 seg de descanso, repetido 8 veces. Total: 4 minutos de alta intensidad.</p>
          </div>
          <div style={{background:C.s1,borderRadius:18,padding:"18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:16}}>Configuración</p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {label:"Trabajo (seg)",   val:work,   set:setWork,  min:5,  max:60, col:C.accent},
                {label:"Descanso (seg)",  val:rest,   set:setRest,  min:5,  max:60, col:C.blue},
                {label:"Rondas",          val:rounds, set:setRounds,min:2,  max:20, col:C.orange},
              ].map(f => (
                <div key={f.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,color:C.white,fontWeight:600,marginBottom:3}}>{f.label}</p>
                    <p style={{fontSize:11,color:C.gray}}>Total: {f.label==="Rondas" ? `${f.val * (work+rest)}s` : `${f.val*rounds}s`}</p>
                  </div>
                  <div style={{display:"flex",gap:0,alignItems:"center",background:C.s2,borderRadius:12,overflow:"hidden"}}>
                    <button onClick={()=>f.set(v=>Math.max(f.min,v-5))} style={{width:40,height:40,background:"transparent",border:"none",color:C.grayL,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>−</button>
                    <span className="mono" style={{fontSize:18,color:f.col,fontWeight:700,minWidth:44,textAlign:"center"}}>{f.val}</span>
                    <button onClick={()=>f.set(v=>Math.min(f.max,v+5))} style={{width:40,height:40,background:"transparent",border:"none",color:C.grayL,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.s1,borderRadius:16,padding:"14px 18px",border:`1px solid ${C.s2}`,marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[
                {l:"Duración total",v:`${Math.floor(rounds*(work+rest)/60)}:${String(rounds*(work+rest)%60).padStart(2,"0")}`},
                {l:"Trabajo total",v:`${work*rounds}s`},
                {l:"Calorías est.",v:`~${Math.round(rounds*(work+rest)/60*10)} kcal`},
              ].map(s=>(
                <div key={s.l} style={{textAlign:"center"}}>
                  <p className="mono" style={{fontSize:18,color:C.accent,fontWeight:700}}>{s.v}</p>
                  <p style={{fontSize:9,color:C.gray,marginTop:3,textTransform:"uppercase",letterSpacing:.5}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={()=>{ if(userPlan==="free") setShowAdTabata(true); else startTimer(); }}
            style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:16,padding:"17px",fontSize:18,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2}}>
            ▶ INICIAR TABATA
          </button>
        </div>
      )}

      {phase === "running" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-around",padding:"20px"}}>

          <div style={{textAlign:"center"}}>
            <p className="bb" style={{fontSize:32,color:phaseColor,letterSpacing:2,lineHeight:1,marginBottom:4}}>
              {isWork ? "¡TRABAJÁ!" : "DESCANSO"}
            </p>
            <p style={{fontSize:14,color:C.gray}}>Ronda {currentRound} de {rounds}</p>
          </div>

          <div style={{position:"relative",width:220,height:220}}>
            <svg width={220} height={220} viewBox="0 0 220 220">
              <circle cx={110} cy={110} r={r} fill="none" stroke={C.s2} strokeWidth={14}/>
              <circle cx={110} cy={110} r={r} fill="none" stroke={phaseColor} strokeWidth={14}
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
                strokeLinecap="round" transform="rotate(-90 110 110)"
                style={{transition:"stroke-dashoffset .9s linear,stroke .3s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span className="mono" style={{fontSize:56,color:phaseColor,fontWeight:700,lineHeight:1}}>{timeLeft}</span>
              <span style={{fontSize:12,color:C.gray}}>seg</span>
            </div>
          </div>

          <div style={{width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:11,color:C.gray}}>Progreso general</span>
              <span className="mono" style={{fontSize:11,color:C.accent}}>{Math.round(overallPct)}%</span>
            </div>
            <div style={{height:8,background:C.s3,borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${overallPct}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},#64FF80)`,borderRadius:4,transition:"width .5s"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:12,width:"100%"}}>
            <button onClick={()=>setRunning(p=>!p)}
              style={{flex:1,background:running?C.s2:C.accent,color:running?C.grayL:C.bg,border:`1px solid ${C.s3}`,borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              {running?"⏸ Pausa":"▶ Continuar"}
            </button>
            <button onClick={()=>{setPhase("config");setRunning(false);clearInterval(intervalRef.current);}}
              style={{flex:.5,background:"transparent",border:`1px solid ${C.red}40`,borderRadius:14,padding:"14px",fontSize:13,fontWeight:600,color:C.red,cursor:"pointer",fontFamily:"inherit"}}>
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function RegistrarEntrenoScreen(props) {
  const navigate = props.navigate;
  const [step, setStep] = useState("select");
  const [selRoutine, setSelRoutine] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [entries, setEntries] = useState({});
  const [notes, setNotes] = useState("");
  const [feeling, setFeeling] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  const ROUTINES = [
    {id:"push",  name:"Push Day A",  exercises:[{n:"Press Banca",sets:3},{n:"Press Inclinado",sets:3},{n:"Fondos",sets:3},{n:"Tríceps Polea",sets:3}]},
    {id:"pull",  name:"Pull Day",    exercises:[{n:"Dominadas",sets:3},{n:"Remo con Barra",sets:3},{n:"Face Pull",sets:3},{n:"Curl Martillo",sets:3}]},
    {id:"legs",  name:"Leg Day",     exercises:[{n:"Sentadilla",sets:4},{n:"Prensa",sets:3},{n:"Extensiones",sets:3},{n:"Curl Femoral",sets:3}]},
    {id:"full",  name:"Full Body A", exercises:[{n:"Sentadilla",sets:3},{n:"Press Banca",sets:3},{n:"Remo",sets:3},{n:"Hombro",sets:3}]},
    {id:"custom",name:"Entrenamiento libre", exercises:[]},
  ];

  const routine = ROUTINES.find(r=>r.id===selRoutine);

  const updEntry = (exName, field, val) => {
    setEntries(p=>({...p,[exName]:{...(p[exName]||{}), [field]:val}}));
  };

  const handleSave = () => {
    setShowConfetti(true);
    setStep("done");
    setTimeout(()=>setShowConfetti(false), 3000);
  };

  if (step === "done") return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <Confetti active={showConfetti}/>
      <div style={{fontSize:56,marginBottom:16}}>💾</div>
      <h2 className="bb" style={{fontSize:36,color:C.accent,letterSpacing:1,marginBottom:8}}>ENTRENO GUARDADO</h2>
      <p style={{color:C.gray,fontSize:14,marginBottom:6}}>{(routine&&routine.name||"Entrenamiento libre")}</p>
      <p style={{color:C.gray,fontSize:13,marginBottom:28}}>{date}</p>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>{setStep("select");setSelRoutine(null);setEntries({});setNotes("");}}
          style={{background:C.s2,color:C.grayL,border:`1px solid ${C.s3}`,borderRadius:14,padding:"13px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          Registrar otro
        </button>
        <button onClick={()=>navigate("progreso")}
          style={{background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"13px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Ver mi progreso
        </button>
      </div>
    </div>
  );

  if (step === "select") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>REGISTRAR ENTRENO</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Cargá lo que hiciste hoy</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}25`,borderRadius:14,padding:"12px 16px",marginBottom:18}}>
          <p style={{fontSize:12,color:C.blue,fontWeight:600,marginBottom:3}}>📝 Sin presión de tiempo</p>
          <p style={{fontSize:12,color:C.grayL,lineHeight:1.55}}>Podés cargar tu entrenamiento después de hacerlo. Todo queda registrado en tu historial.</p>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:7}}>Fecha del entrenamiento</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{width:"100%",padding:"12px 14px",background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
        </div>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>¿Qué rutina hiciste?</p>
        {ROUTINES.map(r=>(
          <div key={r.id} onClick={()=>{setSelRoutine(r.id);setStep("log");}}
            style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${selRoutine===r.id?C.accent:C.s2}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .2s"}}>
            <div>
              <p style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:2}}>{r.name}</p>
              {r.exercises.length>0 && <p style={{fontSize:11,color:C.gray}}>{r.exercises.length} ejercicios</p>}
            </div>
            <SvgIcon name="arrow" size={16} color={C.gray}/>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 20px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>setStep("select")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Volver</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 className="bb" style={{fontSize:24,color:C.white,letterSpacing:.5,lineHeight:1,marginBottom:3}}>{(routine&&routine.name)}</h2>
            <p style={{fontSize:12,color:C.gray}}>{date}</p>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        {((routine&&routine.exercises||[])).map(ex=>(
          <div key={ex.n} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
            <p style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:10}}>{ex.n}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[{f:"sets",label:"Series",ph:ex.sets},{f:"reps",label:"Reps",ph:12},{f:"kg",label:"Peso (kg)",ph:"—"}].map(f=>(
                <div key={f.f}>
                  <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{f.label}</label>
                  <input value={(entries[ex.n]&&entries[ex.n][f.f])||""} onChange={e=>updEntry(ex.n,f.f,e.target.value)}
                    placeholder={String(f.ph)}
                    style={{width:"100%",padding:"10px",background:C.s2,border:`1.5px solid ${(entries[ex.n]&&entries[ex.n][f.f])?C.accent:C.s3}`,borderRadius:10,color:C.white,fontSize:13,fontFamily:"'Space Mono',monospace",textAlign:"center",transition:"border-color .2s"}}/>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
          <p style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:12}}>¿Cómo te sentiste?</p>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {[["💀","Destruído"],["😓","Cansado"],["😐","Normal"],["💪","Bien"],["🔥","Brutal"]].map(([e,l],i)=>(
              <div key={i} onClick={()=>setFeeling(i+1)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",opacity:feeling===i+1?1:.4,transition:"opacity .2s"}}>
                <div style={{width:42,height:42,borderRadius:13,background:feeling===i+1?`${C.accent}20`:C.s2,border:`2px solid ${feeling===i+1?C.accent:C.s3}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"all .2s"}}>{e}</div>
                <span style={{fontSize:8,color:feeling===i+1?C.accent:C.gray}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:7}}>Notas (opcional)</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="PR nuevo, cómo te sentiste, qué querés mejorar..."
            style={{width:"100%",padding:"12px",background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:80,resize:"none"}}/>
        </div>
      </div>
      <div style={{padding:"12px 20px",borderTop:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={handleSave}
          style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:16,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5}}>
          💾 GUARDAR ENTRENAMIENTO
        </button>
      </div>
    </div>
  );
};

function FotosProgresoScreen(props) {
  const navigate = props.navigate || (()=>{});
  const userPlan = props.userPlan || "free";
  const [selectedComp, setSelectedComp] = useState(null);
  const [compareA, setCompareA] = useState(0);
  const [compareB, setCompareB] = useState(2);
  const FOTOS_DEMO = [
    {date:"1 Ene 2026",  peso:"84kg", grasa:"22%", emoji:"😐", nota:"Inicio del programa"},
    {date:"1 Feb 2026",  peso:"81.5kg",grasa:"20%",emoji:"🙂", nota:"Primer mes completado"},
    {date:"1 Mar 2026",  peso:"79kg", grasa:"18%", emoji:"💪", nota:"Excelente progreso"},
  ];
  if (userPlan==="free") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("progreso")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Progreso</button>
          <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>FOTOS DE PROGRESO</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{width:68,height:68,borderRadius:20,background:`${C.accent}12`,border:`2px solid ${C.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,marginBottom:18}}>📸</div>
          <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>FUNCION PRO</p>
          <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:22}}>Guarda fotos frontales, laterales y dorsales. Compara tu cuerpo entre dos fechas con el modo split.</p>
          <button onClick={()=>navigate("mi-plan")} style={{background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"13px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Ver planes PRO</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("progreso")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Progreso</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>FOTOS</h2>
            <p style={{color:C.gray,fontSize:13,marginTop:2}}>{FOTOS_DEMO.length} registros</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSelectedComp(selectedComp?"none":"compare")} style={{padding:"8px 14px",borderRadius:10,border:`1.5px solid ${selectedComp?C.accent:C.s3}`,background:selectedComp?`${C.accent}15`:C.s1,color:selectedComp?C.accent:C.gray,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Comparar</button>
            <button style={{padding:"8px 14px",borderRadius:10,background:C.accent,border:"none",color:C.bg,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Foto</button>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        {selectedComp==="compare" && (
          <div style={{background:C.s1,borderRadius:18,padding:"16px",marginBottom:18,border:`1px solid ${C.accent}30`}}>
            <p style={{fontSize:11,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:12}}>Modo comparacion</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{label:"ANTES",sel:compareA,setSel:setCompareA},{label:"DESPUES",sel:compareB,setSel:setCompareB}].map(side=>(
                <div key={side.label}>
                  <p style={{fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6,textAlign:"center"}}>{side.label}</p>
                  <div style={{background:C.s2,borderRadius:14,aspectRatio:"3/4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",overflow:"hidden",border:`1px solid ${C.s3}`}}>
                    <span style={{fontSize:40}}>{FOTOS_DEMO[side.sel].emoji}</span>
                    <p style={{fontSize:12,color:C.white,fontWeight:700,marginTop:6}}>{FOTOS_DEMO[side.sel].peso}</p>
                    <p style={{fontSize:10,color:C.gray}}>{FOTOS_DEMO[side.sel].date}</p>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",gap:4,padding:"6px"}}>
                      {FOTOS_DEMO.map((_,i)=>(
                        <button key={i} onClick={e=>{e.stopPropagation();side.setSel(i);}} style={{flex:1,height:3,borderRadius:100,background:side.sel===i?C.accent:C.s3,border:"none",cursor:"pointer",padding:0}}/>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {FOTOS_DEMO[compareA] && FOTOS_DEMO[compareB] && (
              <div style={{marginTop:12,background:`${C.accent}08`,borderRadius:12,padding:"10px 14px"}}>
                <p style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:4}}>Cambio en el periodo</p>
                <p style={{fontSize:12,color:C.grayL}}>Peso: {FOTOS_DEMO[compareA].peso} → <strong style={{color:C.accent}}>{FOTOS_DEMO[compareB].peso}</strong></p>
                <p style={{fontSize:12,color:C.grayL}}>Grasa: {FOTOS_DEMO[compareA].grasa} → <strong style={{color:C.accent}}>{FOTOS_DEMO[compareB].grasa}</strong></p>
              </div>
            )}
          </div>
        )}
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Timeline</p>
        {FOTOS_DEMO.map((f,i)=>(
          <div key={i} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <div style={{width:80,flexShrink:0}}>
              <div style={{background:C.s1,borderRadius:14,aspectRatio:"3/4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`1px solid ${C.s2}`}}>
                <span style={{fontSize:32}}>{f.emoji}</span>
              </div>
            </div>
            <div style={{flex:1,paddingTop:4}}>
              <p className="mono" style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:2}}>{f.date}</p>
              <p style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:3}}>{f.peso} · {f.grasa} grasa</p>
              <p style={{fontSize:12,color:C.gray,lineHeight:1.5}}>{f.nota}</p>
            </div>
          </div>
        ))}
        <button style={{width:"100%",background:"transparent",border:`1.5px dashed ${C.s3}`,borderRadius:14,padding:"16px",fontSize:13,fontWeight:600,color:C.gray,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>+ Agregar foto de hoy</button>
      </div>
    </div>
  );
};

function GruposScreen(props) {
  const navigate = props.navigate || (()=>{});
  const userPlan = props.userPlan || "free";
  const [activeGrp, setActiveGrp] = useState(0);
  const GRUPOS_DEMO = [
    {nombre:"FORZA Team", coach:"Miguel Ramirez", miembros:24, color:C.accent, posts:[
      {autor:"Miguel Ramirez",rol:"Coach",ts:"Hace 2h",txt:"Excelente trabajo hoy en la sesion de piernas. Recuerden: descanso activo manana, nada de sentadillas. Foam roller y movilidad de cadera.",likes:14},
      {autor:"Carlos Mendez",rol:"Alumno",ts:"Hace 3h",txt:"Rompi mi PR en press banca: 100kg x 3. Nunca llegue a ese numero. Gracias por el programa Miguel!",likes:22},
      {autor:"Miguel Ramirez",rol:"Coach",ts:"Ayer",txt:"CHALLENGE SEMANAL: Quien complete 5 sesiones esta semana gana un mes de plan Pro gratis. Publiquen sus checkins aca. Ya!",likes:8},
    ]},
    {nombre:"Funcional Avanzado",coach:"Sofia Lopez",miembros:18,color:C.blue,posts:[
      {autor:"Sofia Lopez",rol:"Coach",ts:"Hace 1h",txt:"Nuevo video de movilidad de hombros disponible en la seccion de Videos. 15 minutos antes de entrenar, todos los dias.",likes:11},
      {autor:"Ana Garcia",rol:"Alumna",ts:"Hace 5h",txt:"Semana 8 completada. 8 sesiones consecutivas. La constancia es todo. Gracias Sofia por la motivacion diaria!",likes:19},
    ]},
  ];
  if (userPlan==="free") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
          <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>GRUPOS</h2>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          <div style={{background:`${C.blue}10`,border:`1px solid ${C.blue}20`,borderRadius:14,padding:"12px 16px",marginBottom:16}}>
            <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:2}}>Solo lectura — Plan Gratis</p>
            <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>Podes ver las publicaciones de los grupos publicos. Para participar y comentar, activa PRO + Coach.</p>
          </div>
          {GRUPOS_DEMO.map((g,i)=>(
            <div key={i} style={{background:C.s1,borderRadius:16,padding:"16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:`${g.color}20`,border:`1.5px solid ${g.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>G</div>
                <div>
                  <p style={{fontWeight:700,fontSize:14,color:C.white}}>{g.nombre}</p>
                  <p style={{fontSize:11,color:C.gray}}>Coach {g.coach} · {g.miembros} miembros</p>
                </div>
              </div>
              <div style={{background:C.s2,borderRadius:12,padding:"10px 12px",opacity:.6}}>
                <p style={{fontSize:12,color:C.grayL,lineHeight:1.5}}>{g.posts[0].txt.slice(0,100)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const grp = GRUPOS_DEMO[activeGrp];
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 10px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
        <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>GRUPOS</h2>
        <div style={{display:"flex",gap:8,marginTop:10,overflowX:"auto",paddingBottom:2}}>
          {GRUPOS_DEMO.map((g,i)=>(
            <button key={i} onClick={()=>setActiveGrp(i)} style={{flexShrink:0,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${activeGrp===i?g.color:C.s3}`,background:activeGrp===i?`${g.color}15`:C.s1,color:activeGrp===i?g.color:C.gray,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
              {g.nombre}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
          <div style={{width:42,height:42,borderRadius:12,background:`${grp.color}20`,border:`1.5px solid ${grp.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>G</div>
          <div>
            <p style={{fontWeight:700,fontSize:14,color:C.white}}>{grp.nombre}</p>
            <p style={{fontSize:11,color:C.gray}}>Coach {grp.coach} · {grp.miembros} miembros</p>
          </div>
        </div>
        {grp.posts.map((post,i)=>(
          <div key={i} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:post.rol==="Coach"?`${C.accent}25`:`${C.blue}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{post.autor[0]}</div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:13,color:C.white}}>{post.autor}</p>
                <p style={{fontSize:10,color:C.gray}}>{post.rol} · {post.ts}</p>
              </div>
              {post.rol==="Coach"&&<span style={{fontSize:9,background:`${C.accent}20`,color:C.accent,borderRadius:100,padding:"2px 7px",fontWeight:700}}>COACH</span>}
            </div>
            <p style={{fontSize:13,color:C.grayL,lineHeight:1.6,marginBottom:10}}>{post.txt}</p>
            <div style={{display:"flex",gap:14}}>
              <button style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:8,padding:"5px 12px",color:C.gray,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:14}}>♥</span> {post.likes}
              </button>
              <button style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:8,padding:"5px 12px",color:C.gray,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Comentar</button>
            </div>
          </div>
        ))}
        <div style={{background:C.s1,borderRadius:14,padding:"12px 16px",border:`1.5px dashed ${C.s3}`,marginTop:6}}>
          <input placeholder="Escribi algo en el grupo..." style={{width:"100%",background:"transparent",border:"none",color:C.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
        </div>
      </div>
    </div>
  );
};

function AnalisisCorporalScreen(props) {
  const navigate = props.navigate || (()=>{});
  const userPlan = props.userPlan || "free";
  const [tab, setTab] = useState("medidas");
  const [medidas, setMedidas] = useState({cuello:"",hombros:"",pecho:"",cintura:"",cadera:"",brazos:"",muslos:""});
  const [savedMedidas, setSavedMedidas] = useState(false);
  const COACH_COMMENTS = [
    {date:"5 Mar 2026",txt:"Excelente progreso en cintura. Bajaron 3cm este mes. Mantene el deficit calorico y el cardio LISS 3 veces por semana.",tipo:"positivo"},
    {date:"20 Feb 2026",txt:"Los hombros ganaron 2cm, señal de que el press militar esta funcionando. Seguimos con el mismo volumen.",tipo:"positivo"},
  ];
  if (userPlan!=="coach") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
          <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>ANALISIS CORPORAL</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{fontSize:48,marginBottom:16}}>📐</div>
          <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>FUNCION PRO + COACH</p>
          <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:22}}>Tu coach registra y comenta tus medidas corporales semanalmente. Disponible en el paquete Pro y Elite.</p>
          <button onClick={()=>navigate("mi-plan")} style={{background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"13px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Ver planes con Coach</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>ANALISIS CORPORAL</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:2}}>Actualizado por tu coach</p>
        <div style={{display:"flex",gap:6,marginTop:12}}>
          {[["medidas","Mis medidas"],["comentarios","Comentarios del coach"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"8px",borderRadius:10,border:"none",background:tab===id?C.accent:C.s1,color:tab===id?C.bg:C.gray,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        {tab==="medidas"&&(
          <div>
            {[["Cuello","cuello","cm"],["Hombros","hombros","cm"],["Pecho","pecho","cm"],["Cintura","cintura","cm"],["Cadera","cadera","cm"],["Brazos","brazos","cm"],["Muslos","muslos","cm"]].map(([label,key,unit])=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{label}</label>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="number" value={medidas[key]} onChange={e=>setMedidas(p=>({...p,[key]:e.target.value}))} placeholder="cm"
                    style={{flex:1,padding:"10px 12px",background:C.s1,border:`1.5px solid ${medidas[key]?C.accent:C.s2}`,borderRadius:10,color:C.white,fontSize:14,fontFamily:"inherit",transition:"border-color .2s"}}/>
                  <span style={{fontSize:12,color:C.gray,flexShrink:0,width:24}}>{unit}</span>
                </div>
              </div>
            ))}
            <button onClick={()=>{setSavedMedidas(true);setTimeout(()=>setSavedMedidas(false),2000);}}
              style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>
              {savedMedidas?"Guardado!":"Guardar medidas de hoy"}
            </button>
          </div>
        )}
        {tab==="comentarios"&&(
          <div>
            {COACH_COMMENTS.map((c,i)=>(
              <div key={i} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1px solid ${C.s2}`,borderLeft:`3px solid ${c.tipo==="positivo"?C.accent:C.orange}`}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>M</div>
                  <div><p style={{fontSize:12,fontWeight:700,color:C.white}}>Miguel Ramirez</p><p style={{fontSize:10,color:C.gray}}>{c.date}</p></div>
                </div>
                <p style={{fontSize:13,color:C.grayL,lineHeight:1.6}}>{c.txt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function SesionesEnVivoScreen(props) {
  const navigate = props.navigate || (()=>{});
  const userPlan = props.userPlan || "free";
  const [joined, setJoined] = useState(false);
  const PROXIMAS = [
    {titulo:"Piernas y gluteos",fecha:"Miercoles 13 Mar",hora:"18:00",duracion:"60 min",participantes:8,link:"zoom.us/j/xxxxx"},
    {titulo:"HIIT quemagrasa",fecha:"Viernes 15 Mar",hora:"07:30",duracion:"45 min",participantes:5,link:"zoom.us/j/yyyyy"},
  ];
  const PASADAS = [
    {titulo:"Fuerza full body",fecha:"Lunes 10 Mar",duracion:"60 min",participantes:9},
  ];
  if (userPlan!=="coach") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
          <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>SESIONES EN VIVO</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🎥</div>
          <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>FUNCION ELITE</p>
          <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:22}}>Sesiones en vivo con tu coach via videollamada. Disponible en el paquete Elite de PRO + Coach.</p>
          <button onClick={()=>navigate("mi-plan")} style={{background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"13px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Ver plan Elite</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
        <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>SESIONES EN VIVO</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:2}}>Con Miguel Ramirez</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        {joined&&(
          <div style={{background:`${C.red}15`,border:`2px solid ${C.red}40`,borderRadius:18,padding:"20px",marginBottom:16,textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:`${C.red}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 10px"}}>LIVE</div>
            <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:6}}>EN SESION</p>
            <p style={{fontSize:12,color:C.gray,marginBottom:14}}>Piernas y gluteos · Con Miguel Ramirez</p>
            <p style={{fontSize:11,color:C.gray,marginBottom:14}}>Conectate desde el link: <span style={{color:C.blue}}>zoom.us/j/xxxxx</span></p>
            <button onClick={()=>setJoined(false)} style={{background:C.red,color:C.white,border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Salir de la sesion</button>
          </div>
        )}
        <p style={{fontSize:10,color:C.accent,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Proximas sesiones</p>
        {PROXIMAS.map((s,i)=>(
          <div key={i} style={{background:C.s1,borderRadius:16,padding:"16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <p style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:3}}>{s.titulo}</p>
                <p style={{fontSize:12,color:C.gray}}>{s.fecha} · {s.hora} · {s.duracion}</p>
              </div>
              <span style={{fontSize:11,color:C.blue,background:`${C.blue}15`,borderRadius:8,padding:"3px 8px",fontWeight:700,flexShrink:0}}>{s.participantes} alumnos</span>
            </div>
            <button onClick={()=>setJoined(true)} style={{width:"100%",background:`${C.accent}15`,border:`1.5px solid ${C.accent}40`,borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,color:C.accent,cursor:"pointer",fontFamily:"inherit"}}>
              Unirse a la sesion
            </button>
          </div>
        ))}
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12,marginTop:8}}>Sesiones pasadas</p>
        {PASADAS.map((s,i)=>(
          <div key={i} style={{background:C.s1,borderRadius:14,padding:"14px 16px",marginBottom:8,border:`1px solid ${C.s2}`,opacity:.6}}>
            <p style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:2}}>{s.titulo}</p>
            <p style={{fontSize:11,color:C.gray}}>{s.fecha} · {s.duracion} · {s.participantes} asistentes</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function NutricionScreen(props) {
  const navigate = props.navigate || (()=>{});
  const userPlan = props.userPlan || "free";
  const [dayActive, setDayActive] = useState(0);
  const DIAS_SEMANA = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const PLAN_NUTRI = [
    {comidas:[
      {nombre:"Desayuno",hora:"08:00",items:["3 huevos revueltos","1 tostada de pan integral","1/2 palta","Cafe negro sin azucar"],kcal:420,prot:28,carbs:32,grasas:16},
      {nombre:"Almuerzo",hora:"13:00",items:["200g pollo grillado","1 taza arroz integral","Ensalada verde con aceite de oliva","1 fruta"],kcal:680,prot:48,carbs:65,grasas:14},
      {nombre:"Merienda",hora:"17:00",items:["Batido de proteinas (30g)","1 banana","Puñado de almendras"],kcal:360,prot:32,carbs:38,grasas:10},
      {nombre:"Cena",hora:"21:00",items:["200g salmon al horno","Verduras salteadas","1/2 taza quinoa"],kcal:520,prot:42,carbs:28,grasas:22},
    ]},
  ];
  const dayPlan = PLAN_NUTRI[0];
  const totalKcal = dayPlan.comidas.reduce((s,c)=>s+c.kcal,0);
  const totalProt = dayPlan.comidas.reduce((s,c)=>s+c.prot,0);
  const totalCarbs = dayPlan.comidas.reduce((s,c)=>s+c.carbs,0);
  const totalGrasas = dayPlan.comidas.reduce((s,c)=>s+c.grasas,0);
  if (userPlan!=="coach") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
          <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>NUTRICION</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🥗</div>
          <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>FUNCION ELITE</p>
          <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:22}}>Tu coach crea un plan nutricional personalizado para vos. Disponible en el paquete Elite.</p>
          <button onClick={()=>navigate("mi-plan")} style={{background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"13px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Ver plan Elite</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 10px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>NUTRICION</h2>
            <p style={{color:C.gray,fontSize:12,marginTop:2}}>Plan de Miguel Ramirez</p>
          </div>
          <span style={{fontSize:11,color:C.accent,fontWeight:700}}>Actualizado 8 Mar</span>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto"}}>
          {DIAS_SEMANA.map((d,i)=>(
            <button key={i} onClick={()=>setDayActive(i)} style={{flexShrink:0,width:38,height:48,borderRadius:12,border:`1.5px solid ${dayActive===i?C.accent:C.s3}`,background:dayActive===i?`${C.accent}15`:C.s1,color:dayActive===i?C.accent:C.gray,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,transition:"all .2s"}}>
              <span style={{fontSize:9,textTransform:"uppercase"}}>{d}</span><span>{i+1}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[{l:"Kcal",v:totalKcal,col:C.accent},{l:"Proteina",v:`${totalProt}g`,col:C.blue},{l:"Carbos",v:`${totalCarbs}g`,col:C.orange},{l:"Grasas",v:`${totalGrasas}g`,col:"#A78BFA"}].map(s=>(
            <div key={s.l} style={{background:C.s1,borderRadius:12,padding:"10px 8px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
              <p className="mono" style={{fontSize:16,color:s.col,fontWeight:700,marginBottom:2}}>{s.v}</p>
              <p style={{fontSize:9,color:C.gray,textTransform:"uppercase",letterSpacing:.6}}>{s.l}</p>
            </div>
          ))}
        </div>
        {dayPlan.comidas.map((comida,i)=>(
          <div key={i} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1px solid ${C.s2}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><p style={{fontSize:14,fontWeight:700,color:C.white}}>{comida.nombre}</p><p style={{fontSize:11,color:C.gray}}>{comida.hora}</p></div>
              <span className="mono" style={{fontSize:14,color:C.accent,fontWeight:700}}>{comida.kcal} kcal</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              {[["P",comida.prot,"g",C.blue],["C",comida.carbs,"g",C.orange],["G",comida.grasas,"g","#A78BFA"]].map(([l,v,u,col])=>(
                <span key={l} style={{fontSize:10,color:col,background:`${col}15`,borderRadius:8,padding:"3px 8px",fontWeight:700}}>{l}: {v}{u}</span>
              ))}
            </div>
            {comida.items.map((item,j)=>(
              <div key={j} style={{display:"flex",gap:8,alignItems:"center",paddingTop:5,borderTop:j===0?`1px solid ${C.s2}`:"none"}}>
                <span style={{color:C.accent,fontSize:12,flexShrink:0}}>•</span>
                <span style={{fontSize:12,color:C.grayL}}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function CheckoutCoachScreen(props) {
  const navigate = props.navigate || (()=>{});
  const setUserPlan = props.setUserPlan || (()=>{});
  const pkg = props.pkg || {label:"Pro",price:"$39.900/mes",coachName:"Miguel Ramirez"};
  const [step, setStep] = useState("fiscal");
  const [fiscal, setFiscal] = useState({dni:"",dir:"",tel:""});
  const [edad, setEdad] = useState(25);
  const [consent, setConsent] = useState(false);
  const [paidDone, setPaidDone] = useState(false);
  const upd = (k,v) => setFiscal(p=>({...p,[k]:v}));
  const needsConsent = edad < 18;
  const canProceed = fiscal.dni.trim() && fiscal.dir.trim() && fiscal.tel.trim() && (!needsConsent || consent);
  if (step==="done") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",background:C.bg}}>
        <div style={{width:80,height:80,borderRadius:24,background:`${C.accent}20`,border:`2px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:20}}>OK</div>
        <p className="bb" style={{fontSize:28,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>PAGO CONFIRMADO</p>
        <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:8}}>Tu solicitud fue enviada a <strong style={{color:C.white}}>{pkg.coachName}</strong>.</p>
        <div style={{background:`${C.blue}10`,border:`1px solid ${C.blue}20`,borderRadius:14,padding:"14px 18px",marginBottom:24,width:"100%"}}>
          <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:4}}>Estado: Pendiente de aceptacion</p>
          <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>El coach tiene 48hs para aceptar tu solicitud. Recibirás una notificación push cuando lo haga. Tu home se actualizara con sus datos de contacto.</p>
        </div>
        <button onClick={()=>{setUserPlan("coach");navigate("home");}} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Ir al inicio
        </button>
      </div>
    );
  }
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("chat")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Volver</button>
        <h2 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1}}>CONTRATAR COACH</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:2}}>Paquete {pkg.label} · {pkg.coachName}</p>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          {["fiscal","payment"].map((s,i)=>(
            <div key={s} style={{flex:1,height:3,borderRadius:100,background:step===s||step==="confirm"||step==="done"?C.accent:C.s2,transition:"background .3s"}}/>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        {step==="fiscal"&&(
          <div>
            <p style={{fontSize:13,color:C.grayL,lineHeight:1.6,marginBottom:20}}>Para emitir las facturas correctamente necesitamos tus datos fiscales. Solo se usan para tramites de facturacion.</p>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Tu edad</label>
              <input type="number" value={edad} onChange={e=>setEdad(parseInt(e.target.value)||0)} style={{width:"100%",padding:"10px 12px",background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:10,color:C.white,fontSize:14,fontFamily:"inherit"}}/>
            </div>
            {needsConsent&&(
              <div style={{background:`${C.orange}10`,border:`1.5px solid ${C.orange}30`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
                <p style={{fontSize:12,color:C.orange,fontWeight:700,marginBottom:6}}>Sos menor de edad</p>
                <p style={{fontSize:11,color:C.gray,lineHeight:1.6,marginBottom:10}}>Para contratar un coach necesitas el consentimiento de un padre o tutor. Al marcar esta casilla confirmas que un adulto responsable autorizo esta contratacion.</p>
                <div style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer"}} onClick={()=>setConsent(!consent)}>
                  <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${consent?C.accent:C.gray}`,background:consent?`${C.accent}30`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {consent&&<span style={{fontSize:12,color:C.accent}}>OK</span>}
                  </div>
                  <span style={{fontSize:12,color:C.grayL}}>Un adulto responsable autoriza esta contratacion</span>
                </div>
              </div>
            )}
            {[["DNI / RUT / UTR / CNPJ","dni","Tu numero de documento fiscal"],["Domicilio","dir","Calle, numero, ciudad"],["Telefono","tel","+54 11 xxxx-xxxx"]].map(([l,k,ph])=>(
              <div key={k} style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>{l}</label>
                <input value={fiscal[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph} style={{width:"100%",padding:"10px 12px",background:C.s1,border:`1.5px solid ${fiscal[k]?C.accent:C.s2}`,borderRadius:10,color:C.white,fontSize:13,fontFamily:"inherit",transition:"border-color .2s"}}/>
              </div>
            ))}
            <button onClick={()=>setStep("payment")} disabled={!canProceed} style={{width:"100%",background:canProceed?C.accent:C.s2,color:canProceed?C.bg:C.gray,border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:canProceed?"pointer":"not-allowed",fontFamily:"inherit",marginTop:8,transition:"all .3s"}}>
              Continuar al pago
            </button>
          </div>
        )}
        {step==="payment"&&(
          <div>
            <div style={{background:C.s1,borderRadius:16,padding:"16px",marginBottom:16,border:`1px solid ${C.s2}`}}>
              <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Resumen del pedido</p>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,color:C.grayL}}>Paquete {pkg.label}</span>
                <span className="mono" style={{fontSize:13,color:C.white,fontWeight:700}}>{pkg.price}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:C.gray}}>Comision plataforma (15%)</span>
                <span className="mono" style={{fontSize:12,color:C.gray}}>Incluida</span>
              </div>
              <div style={{height:1,background:C.s2,margin:"10px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:14,fontWeight:700,color:C.white}}>Total a pagar</span>
                <span className="mono" style={{fontSize:16,color:C.accent,fontWeight:700}}>{pkg.price}</span>
              </div>
            </div>
            <div style={{background:C.s1,borderRadius:16,padding:"16px",marginBottom:16,border:`1px solid ${C.accent}30`,display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:28,borderRadius:6,background:`${C.blue}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:C.blue,fontWeight:700}}>VISA</div>
              <div><p style={{fontSize:13,color:C.white,fontWeight:600}}>Visa terminada en 4242</p><p style={{fontSize:11,color:C.gray}}>Vence 12/27 · Tarjeta principal</p></div>
            </div>
            <button onClick={()=>{setPaidDone(true);setStep("done");}} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Confirmar y pagar {pkg.price}
            </button>
            <button onClick={()=>setStep("fiscal")} style={{width:"100%",background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"12px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function FeedbackScreen(props) {
  const navigate = props.navigate;
  const [type, setType]     = useState("mejora");
  const [text, setText]     = useState("");
  const [sent, setSent]     = useState(false);
  const [rating, setRating] = useState(0);
  const TYPES = [
    {id:"mejora",   label:"💡 Mejora",      color:C.accent},
    {id:"bug",      label:"🐛 Bug",         color:C.red},
    {id:"feature",  label:"✨ Nueva función",color:C.blue},
    {id:"contenido",label:"📚 Contenido",   color:C.orange},
  ];
  if (sent) return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <div style={{fontSize:56,marginBottom:16}}>🙏</div>
      <h2 className="bb" style={{fontSize:32,color:C.accent,letterSpacing:1,marginBottom:8}}>¡GRACIAS!</h2>
      <p style={{color:C.grayL,fontSize:14,textAlign:"center",lineHeight:1.6,marginBottom:28}}>Tu feedback nos ayuda a hacer FORZA mejor para todos.</p>
      <button onClick={()=>{setSent(false);setText("");setRating(0);navigate("perfil");}}
        style={{background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Volver al perfil
      </button>
    </div>
  );
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>FEEDBACK</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Ayudanos a mejorar FORZA</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>¿De qué se trata?</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          {TYPES.map(t=>(
            <button key={t.id} onClick={()=>setType(t.id)}
              style={{padding:"9px 16px",borderRadius:100,border:`1.5px solid ${type===t.id?t.color:C.s3}`,background:type===t.id?`${t.color}15`:C.s1,color:type===t.id?t.color:C.gray,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
              {t.label}
            </button>
          ))}
        </div>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Calificá tu experiencia</p>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} onClick={()=>setRating(n)}
              style={{flex:1,height:44,borderRadius:12,background:n<=rating?`${C.accent}20`:C.s1,border:`1.5px solid ${n<=rating?C.accent:C.s3}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,transition:"all .2s"}}>
              {n<=rating?"⭐":"☆"}
            </div>
          ))}
        </div>
        <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Tu mensaje</label>
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder={type==="bug"?"Describí el problema: ¿qué pasó, cuándo, en qué pantalla?":type==="mejora"?"¿Qué mejorarías? ¿Cómo lo harías mejor?":"Contanos tu idea..."}
          style={{width:"100%",padding:"14px",background:C.s1,border:`1.5px solid ${text?C.accent:C.s2}`,borderRadius:14,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:120,resize:"none",lineHeight:1.6,marginBottom:20,transition:"border-color .2s"}}/>
        <div style={{background:C.s1,borderRadius:14,padding:"13px 16px",marginBottom:20,border:`1px solid ${C.s2}`,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:18}}>🔒</span>
          <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>Tu feedback se envía de forma anónima. No incluyas datos personales sensibles.</p>
        </div>
      </div>
      <div style={{padding:"12px 20px",borderTop:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>text.trim()&&setSent(true)} disabled={!text.trim()}
          style={{width:"100%",background:text.trim()?C.accent:C.s2,color:text.trim()?C.bg:C.gray,border:"none",borderRadius:16,padding:"16px",fontSize:16,fontWeight:700,cursor:text.trim()?"pointer":"not-allowed",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,transition:"all .3s"}}>
          ENVIAR FEEDBACK
        </button>
      </div>
    </div>
  );
};

function SoporteScreen(props) {
  const navigate = props.navigate;
  const [step, setStep]   = useState("list");
  const [category, setCategory] = useState("cuenta");
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [priority, setPriority] = useState("normal");

  const tickets = [
    {id:"#2041", cat:"Pago",    subject:"No se procesó el cobro de Febrero", status:"resuelto",  date:"3 Mar", color:"#40FF80"},
    {id:"#2038", cat:"Técnico", subject:"La app se cierra al iniciar workout", status:"en revisión",date:"28 Feb",color:C.orange},
  ];

  const CATS = [
    {id:"cuenta",   label:"Cuenta y perfil", icon:"👤"},
    {id:"pago",     label:"Pagos y facturación", icon:"💳"},
    {id:"tecnico",  label:"Problema técnico", icon:"🔧"},
    {id:"contenido",label:"Contenido / Rutinas", icon:"🏋"},
    {id:"otro",     label:"Otro", icon:"📩"},
  ];

  if (step === "sent") return (
    <div style={{height:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <h2 className="bb" style={{fontSize:32,color:C.accent,letterSpacing:1,marginBottom:8}}>TICKET CREADO</h2>
      <p style={{color:C.grayL,fontSize:14,textAlign:"center",lineHeight:1.6,marginBottom:8}}>Ticket <strong style={{color:C.white}}>#2042</strong> abierto correctamente.</p>
      <p style={{color:C.gray,fontSize:13,textAlign:"center",marginBottom:28}}>Te responderemos en menos de 24h al email registrado.</p>
      <button onClick={()=>{setStep("list");setSubject("");setBody("");}}
        style={{background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Ver mis tickets
      </button>
    </div>
  );

  if (step === "new") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 20px",background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>setStep("list")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Tickets</button>
        <h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:.5,lineHeight:1}}>NUEVO TICKET</h2>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Categoría</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
          {CATS.map(c=>(
            <div key={c.id} onClick={()=>setCategory(c.id)}
              style={{display:"flex",alignItems:"center",gap:12,background:category===c.id?`${C.accent}10`:C.s1,border:`1.5px solid ${category===c.id?C.accent:C.s2}`,borderRadius:13,padding:"12px 16px",cursor:"pointer",transition:"all .2s"}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <p style={{fontSize:14,fontWeight:category===c.id?700:400,color:category===c.id?C.white:C.grayL}}>{c.label}</p>
              {category===c.id && <div style={{marginLeft:"auto",width:18,height:18,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:C.bg,fontWeight:700}}>✓</span></div>}
            </div>
          ))}
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:7}}>Asunto</label>
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Resumen breve del problema..."
            style={{width:"100%",padding:"13px 16px",background:C.s1,border:`1.5px solid ${subject?C.accent:C.s2}`,borderRadius:12,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:7}}>Descripción</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Describí el problema con el mayor detalle posible. Incluí pasos para reproducirlo si es un bug."
            style={{width:"100%",padding:"13px",background:C.s1,border:`1.5px solid ${body?C.accent:C.s2}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:110,resize:"none",lineHeight:1.6,transition:"border-color .2s"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Prioridad</p>
          <div style={{display:"flex",gap:8}}>
            {[{id:"baja",label:"Baja",col:C.gray},{id:"normal",label:"Normal",col:C.blue},{id:"urgente",label:"Urgente",col:C.red}].map(p=>(
              <button key={p.id} onClick={()=>setPriority(p.id)}
                style={{flex:1,padding:"10px",borderRadius:11,border:`1.5px solid ${priority===p.id?p.col:C.s3}`,background:priority===p.id?`${p.col}15`:C.s1,color:priority===p.id?p.col:C.gray,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"12px 20px",borderTop:`1px solid ${C.s2}`,flexShrink:0}}>
        <button onClick={()=>(subject.trim()&&body.trim())&&setStep("sent")} disabled={!subject.trim()||!body.trim()}
          style={{width:"100%",background:subject.trim()&&body.trim()?C.accent:C.s2,color:subject.trim()&&body.trim()?C.bg:C.gray,border:"none",borderRadius:16,padding:"16px",fontSize:16,fontWeight:700,cursor:subject.trim()&&body.trim()?"pointer":"not-allowed",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,transition:"all .3s"}}>
          ENVIAR TICKET
        </button>
      </div>
    </div>
  );

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
        <button onClick={()=>navigate("perfil")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Perfil</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>SOPORTE</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>Centro de ayuda y tickets</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
        <button onClick={()=>setStep("new")}
          style={{width:"100%",background:`linear-gradient(135deg,${C.accent}15,${C.blue}08)`,border:`1.5px solid ${C.accent}35`,borderRadius:18,padding:"16px",marginBottom:20,display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left"}}>
          <div style={{width:48,height:48,borderRadius:15,background:`${C.accent}18`,border:`2px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🎫</div>
          <div style={{flex:1}}>
            <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:3}}>Abrir nuevo ticket</p>
            <p style={{fontSize:12,color:C.grayL}}>Respuesta garantizada en menos de 24 horas</p>
          </div>
          <SvgIcon name="arrow" size={16} color={C.accent}/>
        </button>
        {tickets.length > 0 && (
          <>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Mis tickets</p>
            {tickets.map(t=>(
              <div key={t.id} style={{background:C.s1,borderRadius:16,padding:"14px 16px",marginBottom:10,border:`1px solid ${C.s2}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:2}}>{t.subject}</p>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.gray,background:C.s2,borderRadius:6,padding:"2px 7px"}}>{t.cat}</span>
                      <span style={{fontSize:10,color:C.gray}}>{t.date}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span className="mono" style={{fontSize:10,color:C.gray}}>{t.id}</span>
                    <div style={{marginTop:4,background:`${t.color}18`,border:`1px solid ${t.color}40`,borderRadius:8,padding:"3px 8px"}}>
                      <span style={{fontSize:10,color:t.color,fontWeight:700}}>{t.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}20`,borderRadius:14,padding:"13px 16px",marginTop:8}}>
          <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:4}}>📚 Centro de ayuda</p>
          <p style={{fontSize:12,color:C.gray,lineHeight:1.55}}>Antes de abrir un ticket, revisá nuestra base de conocimiento con las preguntas más frecuentes.</p>
          <button style={{marginTop:8,background:"transparent",border:`1px solid ${C.blue}40`,borderRadius:9,padding:"7px 14px",color:C.blue,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ver FAQ →</button>
        </div>
      </div>
    </div>
  );
};

function ChatScreen(props) {
  const setPhoneSheets = props.setSheets || (()=>{});
  const [hasCoach, setHasCoach] = useState(false);
  const [coach, setCoach]       = useState(null);
  const [tab, setTab]           = useState('chat');
  const [msg, setMsg]           = useState('');
  const [showHired, setShowHired] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const msgs=[
    {from:"coach",text:"¡Buenos días Carlos! ¿Cómo te sentís para el entreno de hoy?",time:"08:15"},
    {from:"user",text:"¡Hola Coach! Listo para darle duro 💪",time:"08:17"},
    {from:"coach",text:"Para hoy quiero que aumentes 5kg en press banca. La semana pasada las 5 reps se vieron sólidas.",time:"08:18"},
    {from:"user",text:"Entendido. ¿Y el volumen?",time:"08:20"},
    {from:"coach",text:"Mismo volumen. Foco en técnica. Mandame un video del primer set.",time:"08:21"},
  ];
  const groups=[
    {name:'Grupo Push · Marzo',members:12,lastMsg:'Coach: Nuevo PR de Carlos 🎉',time:'09:14',unread:3},
    {name:'Reto 30 días sin fallar',members:8,lastMsg:'Ana: ¡Día 18 completado!',time:'Ayer',unread:0},
  ];

  const handleHire = (c) => {
    setCoach(c);
    setHasCoach(true);
    setShowHired(true);
    setTimeout(()=>setShowHired(false), 3000);
  };

  if (!hasCoach) return <CoachMarketplace onHire={handleHire}/>;

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <Confetti active={showHired}/>

      <div style={{padding:'18px 18px 0',background:C.s0,borderBottom:`1px solid ${C.s2}`,flexShrink:0}}>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:`linear-gradient(135deg,${(coach&&coach.color||C.accent)},${(coach&&coach.color||C.accent)}80)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}>
            <p style={{fontWeight:700,fontSize:15,color:C.white}}>{(coach&&coach.name||'Coach')}</p>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#40FF80',animation:'blink 2s infinite'}}/>
              <span style={{fontSize:11,color:C.gray}}>En línea</span>
            </div>
          </div>
          <button onClick={()=>setHasCoach(false)} style={{background:'transparent',border:`1px solid ${C.s3}`,borderRadius:10,padding:'6px 12px',color:C.gray,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>Cambiar</button>
        </div>
        <div style={{display:'flex',gap:0}}>
          {[{id:'chat',label:'💬 Chat'},{id:'grupos',label:'👥 Grupos'}].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'9px 0',border:'none',background:'transparent',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,color:tab===t.id?C.accent:C.gray,borderBottom:tab===t.id?`2px solid ${C.accent}`:'2px solid transparent',transition:'all .2s'}}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab==='chat' && <>
        <div style={{flex:1,overflowY:'auto',padding:'14px 18px'}}>
          {msgs.map((m,i) => (
            <div key={i} style={{display:'flex',justifyContent:m.from==='user'?'flex-end':'flex-start',marginBottom:10}}>
              <div style={{maxWidth:'78%',padding:'11px 15px',borderRadius:m.from==='user'?'17px 17px 4px 17px':'17px 17px 17px 4px',background:m.from==='user'?C.accent:C.s2,color:m.from==='user'?C.bg:C.white}}>
                <p style={{fontSize:14,lineHeight:1.5,fontWeight:m.from==='user'?500:400}}>{m.text}</p>
                <p style={{fontSize:10,marginTop:3,opacity:.55,textAlign:'right'}}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'10px 16px 16px',background:C.s0,borderTop:`1px solid ${C.s2}`,flexShrink:0,display:'flex',gap:10,alignItems:'center'}}>

          <button onClick={()=>setAttachment(attachment==="video"?null:"video")} style={{width:38,height:38,borderRadius:'50%',background:attachment==="video"?`${C.orange}30`:C.s2,border:`1px solid ${attachment==="video"?C.orange:C.s2}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,flexShrink:0}} title="Adjuntar video">
            🎥
          </button>
          <button onClick={()=>setAttachment(attachment==="foto"?null:"foto")} style={{width:38,height:38,borderRadius:'50%',background:attachment==="foto"?`${C.blue}30`:C.s2,border:`1px solid ${attachment==="foto"?C.blue:C.s2}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,flexShrink:0}} title="Adjuntar foto">
            📸
          </button>
          <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder={attachment?"Agregar descripcion...":"Escribe un mensaje..."} style={{flex:1,padding:'12px 16px',background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:100,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}/>
          <button onClick={()=>{if(msg.trim()||attachment){setAttachment(null);setMsg('');} }} style={{width:42,height:42,borderRadius:'50%',background:C.accent,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <SvgIcon name="send" size={17} color={C.bg}/>
          </button>
        </div>
      </>}

      {tab==='grupos' && (
        <div style={{flex:1,overflowY:'auto',padding:'14px 18px'}}>
          {groups.map((g,i) => (
            <div key={i} style={{display:'flex',gap:12,alignItems:'center',background:C.s1,borderRadius:16,padding:'13px 15px',marginBottom:10,border:`1px solid ${C.s2}`,cursor:'pointer'}}>
              <div style={{width:44,height:44,borderRadius:14,background:`${C.accent}18`,border:`1.5px solid ${C.accent}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>👥</div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:2}}>{g.name}</p>
                <p style={{fontSize:11,color:C.gray,marginBottom:2}}>{g.lastMsg}</p>
                <span style={{fontSize:10,color:C.gray}}>{g.members} miembros</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                <span style={{fontSize:10,color:C.gray}}>{g.time}</span>
                {g.unread>0 && <div style={{width:20,height:20,borderRadius:'50%',background:C.accent,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:10,color:C.bg,fontWeight:700}}>{g.unread}</span></div>}
              </div>
            </div>
          ))}
          <div style={{border:`1.5px dashed ${C.s3}`,borderRadius:14,padding:'14px',textAlign:'center',cursor:'pointer'}}>
            <p style={{color:C.gray,fontSize:13}}>+ Crear grupo de entrenamiento</p>
          </div>
        </div>
      )}
    </div>
  );
};

function PerfilScreen(props) {
  const navigate = props.navigate || (()=>{});
  const [imgUrl, setImgUrl] = useState(null);
  const fileRef = useRef(null);
  const handleImg = (e) => {
    const f = e.target.files[0];
    if (f) setImgUrl(URL.createObjectURL(f));
  };
  const menuItems = [
    {id:'notificaciones',    icon:'bell',     label:'Notificaciones',       sub:'Recordatorios y alertas'},
    {id:'mi-plan',           icon:'star',     label:'Mi Plan',              sub:'PRO · Ver planes'},
    {id:'pagos',             icon:'dollar',   label:'Suscripcion y pagos',  sub:'Visa ····4242'},
    {id:'fotos-progreso',    icon:'check',    label:'Fotos de progreso',    sub:'Timeline corporal · PRO'},
    {id:'analisis-corporal', icon:'dumbbell', label:'Analisis corporal',    sub:'Medidas y comentarios del coach'},
    {id:'sesiones-en-vivo',  icon:'calendar', label:'Sesiones en vivo',     sub:'Videollamadas con tu coach · Elite'},
    {id:'nutricion',         icon:'check',    label:'Plan nutricional',     sub:'Plan personalizado del coach · Elite'},
    {id:'grupos',            icon:'users',    label:'Grupos y comunidad',   sub:'Posts y challenges del coach'},
    {id:'videos',            icon:'video',    label:'Videos guardados',     sub:'Graba tu tecnica y comparte con coach'},
    {id:'configuracion',     icon:'settings', label:'Configuracion',        sub:'Idioma - Tema - Salud'},
    {id:'feedback',          icon:'chat',     label:'Dar feedback',         sub:'Ayudanos a mejorar FORZA'},
    {id:'soporte',           icon:'bell',     label:'Soporte',              sub:'Tickets de ayuda - FAQ'},
  ];
  return (
    <div style={{height:'100%',background:C.bg,display:'flex',flexDirection:'column',overflow:'hidden'}}>

      <div style={{background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,padding:'44px 22px 20px',flexShrink:0}}>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>

          <div onClick={()=>fileRef.current.click()} style={{width:76,height:76,borderRadius:'50%',background:`linear-gradient(135deg,${C.accent}33,${C.blue}33)`,border:`2.5px solid ${C.accent}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',overflow:'hidden',flexShrink:0}}>
            {imgUrl ? <img src={imgUrl} alt="perfil" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <SvgIcon name="user" size={32} color={C.accent}/>}
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:26,background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:10,color:C.white,fontWeight:600}}>📷 Foto</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:'none'}}/>
          <div style={{flex:1}}>
            <h2 className="bb" style={{fontSize:28,color:C.white,letterSpacing:1,lineHeight:1,marginBottom:4}}>CARLOS MÉNDEZ</h2>
            <p style={{color:C.gray,fontSize:12,marginBottom:6}}>Plan Premium · 8 meses activo</p>
            <Pill color={C.accent}>ACTIVO</Pill>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginTop:14}}>
          {[['18','Sesiones'],['5','Racha'],['−8kg','Progreso']].map(([v,l]) => (
            <div key={l} style={{flex:1,background:C.s1,borderRadius:12,padding:'10px 6px',textAlign:'center',border:`1px solid ${C.s2}`}}>
              <p className="mono" style={{fontSize:16,color:C.accent,fontWeight:700}}>{v}</p>
              <p style={{fontSize:10,color:C.gray,marginTop:2}}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'10px 22px'}}>
        {menuItems.map(item => (
          <div key={item.id} onClick={()=>navigate(item.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 0',borderBottom:`1px solid ${C.s1}`,cursor:'pointer'}}>
            <div style={{width:42,height:42,borderRadius:13,background:C.s2,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <SvgIcon name={item.icon} size={19} color={C.gray}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:15,fontWeight:600,color:C.white,marginBottom:2}}>{item.label}</p>
              <p style={{fontSize:11,color:C.gray}}>{item.sub}</p>
            </div>
            <SvgIcon name="arrow" size={16} color={C.gray}/>
          </div>
        ))}
        <div onClick={()=>{}} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 0',cursor:'pointer'}}>
          <div style={{width:42,height:42,borderRadius:13,background:'rgba(255,68,102,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <SvgIcon name="logout" size={19} color={C.red}/>
          </div>
          <span style={{fontSize:15,fontWeight:600,color:C.red}}>Cerrar sesión</span>
        </div>
      </div>
    </div>
  );
};

function BottomNav({ active, onNav }) {
  const items=[{id:"home",icon:"home",label:"Inicio"},{id:"rutinas",icon:"dumbbell",label:"Rutinas"},{id:"progreso",icon:"chart",label:"Progreso"},{id:"chat",icon:"chat",label:"Chat"},{id:"perfil",icon:"user",label:"Perfil"}];
  return (
    <div style={{ flexShrink:0,height:82,background:"rgba(8,8,16,.97)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.s2}`,display:"flex",alignItems:"center",justifyContent:"space-around",padding:"0 6px 6px" }}>
      {items.map(item=>(
        <button key={item.id} onClick={()=>onNav(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 14px",borderRadius:12,cursor:"pointer",border:"none",background:"transparent",color:active===item.id?C.accent:C.gray,fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all .2s"}}>
          <SvgIcon name={item.icon} size={22} color={active===item.id?C.accent:C.gray}/>
          {item.label}
        </button>
      ))}
    </div>
  );
};

function BackofficeOwner() {
  const [page,setPage]=useState("dashboard");
  const nav=[
    {id:"dashboard",  icon:"home",     label:"Dashboard"},
    {id:"users",      icon:"users",    label:"Usuarios"},
    {id:"coaches",    icon:"star",     label:"Entrenadores"},
    {id:"finance",    icon:"dollar",   label:"Finanzas"},
    {id:"feedback",   icon:"chat",     label:"Feedback"},
    {id:"soporte",    icon:"bell",     label:"Soporte"},
    {id:"settings",   icon:"settings", label:"Configuración"},
  ];
  const FEEDBACK_DATA = [
    {id:1, type:"mejora",  text:"Sería genial poder ordenar los ejercicios dentro de una rutina arrastrando.",     rating:5, date:"9 Mar",  votes:14, status:"pendiente"},
    {id:2, type:"feature", text:"¿Podrían agregar un modo de entrenamiento en parejas tipo reto?",               rating:4, date:"8 Mar",  votes:9,  status:"evaluando"},
    {id:3, type:"bug",     text:"La app se cierra cuando intento iniciar el Tabata en iOS 17.4.",                 rating:2, date:"7 Mar",  votes:6,  status:"en revisión"},
    {id:4, type:"mejora",  text:"Me gustaría ver un histórico de mis PRs por ejercicio, no solo el peso actual.", rating:5, date:"6 Mar",  votes:22, status:"en revisión"},
    {id:5, type:"feature", text:"Modo oscuro ya existe, sería bueno que se active automáticamente de noche.",    rating:4, date:"5 Mar",  votes:11, status:"pendiente"},
    {id:6, type:"bug",     text:"Los gráficos de progreso no cargan bien cuando hay más de 6 meses de datos.",   rating:3, date:"4 Mar",  votes:4,  status:"resuelto"},
    {id:7, type:"mejora",  text:"Integración con Spotify para reproducir música durante el entreno.",             rating:5, date:"3 Mar",  votes:31, status:"evaluando"},
  ];
  const TICKETS_DATA = [
    {id:"#2042", user:"Carlos Méndez",  cat:"Técnico",  subject:"La app se cierra al iniciar workout",         priority:"urgente", status:"abierto",    date:"10 Mar", color:C.red},
    {id:"#2041", user:"Ana García",     cat:"Pago",     subject:"No se procesó el cobro de Febrero",           priority:"normal",  status:"en revisión",date:"8 Mar",  color:C.orange},
    {id:"#2040", user:"Pedro Gómez",    cat:"Cuenta",   subject:"No puedo cambiar mi foto de perfil",          priority:"baja",    status:"resuelto",   date:"5 Mar",  color:"#40FF80"},
    {id:"#2039", user:"Lucía Moreno",   cat:"Técnico",  subject:"Notificaciones no llegan en Android 14",      priority:"normal",  status:"resuelto",   date:"3 Mar",  color:"#40FF80"},
    {id:"#2038", user:"Roberto Silva",  cat:"Pago",     subject:"Quiero cambiar de plan Premium a Elite",      priority:"baja",    status:"resuelto",   date:"1 Mar",  color:"#40FF80"},
  ];

  const [fbFilter, setFbFilter] = useState("todos");
  const [fbSort,   setFbSort]   = useState("votos");
  const [tkFilter, setTkFilter] = useState("todos");
  const [fbDetail, setFbDetail] = useState(null);
  const [planFilter, setPlanFilter] = useState("todos");
  const [userDetail, setUserDetail] = useState(null);
  const [coachValidation, setCoachValidation] = useState({
    "Miguel Ramirez":"aprobado","Sofia Lopez":"aprobado","Diego Garcia":"en_revision",
    "Ana Beatriz Santos":"pendiente","Lucas Fernandez":"rechazado","Carla Vega":"pendiente"
  });
  const [coachDetail, setCoachDetail] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal]   = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [coachFilter, setCoachFilter]   = useState("todos");
  // Feature: cambio sub→comisión automático al 4° alumno
  const [coachModelos, setCoachModelos] = useState({
    "Miguel Ramírez":"comision","Sofía López":"comision","Diego García":"sub_fija",
    "Ana Beatriz Santos":"sin_alumnos","Lucas Fernández":"sin_alumnos","Carla Vega":"sin_alumnos"
  });
  const [modeloModal, setModeloModal] = useState(null);
  // Feature: aprobar/rechazar facturas de coach
  const [facturaStates, setFacturaStates] = useState({
    "0001-0012":"en_revision","0001-0013":"en_revision","B-000045":"en_revision",
    "NF-1890":"aprobado","B-000039":"aprobado"
  });
  const [facturaModal, setFacturaModal] = useState(null);
  const [facturaRechazarModal, setFacturaRechazarModal] = useState(null);
  const [facturaRechazarMotivo, setFacturaRechazarMotivo] = useState("");

  return (
    <div style={{display:"flex",height:"100%"}}>
      <div className="bk-sidebar">
        <div style={{ padding:"22px 18px 18px",borderBottom:`1px solid ${C.s2}` }}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:30,height:30,background:C.accent,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:15}}>⚡</span></div>
            <span className="bb" style={{fontSize:22,color:C.white,letterSpacing:2}}>FORZA</span>
          </div>
          <div style={{padding:"8px 11px",background:"rgba(200,255,0,.07)",borderRadius:10,border:"1px solid rgba(200,255,0,.14)"}}>
            <p style={{fontSize:10,color:C.gray,marginBottom:2}}>Rol actual</p>
            <p style={{fontSize:13,color:C.accent,fontWeight:700}}>👑 Dueño</p>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 0"}}>
          {nav.map(n=>(
            <button key={n.id} className={`bk-nav ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
              <SvgIcon name={n.icon} size={17} color={page===n.id?C.accent:C.gray}/> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:14,borderTop:`1px solid ${C.s2}` }}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:C.s2,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SvgIcon name="user" size={15} color={C.gray}/>
            </div>
            <div>
              <p style={{fontSize:12,fontWeight:600,color:C.white}}>Admin</p>
              <p style={{fontSize:10,color:C.gray}}>admin@forza.app</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",background:"#050508",padding:26}}>
        {page==="dashboard"&&(
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:3}}>DASHBOARD</h1>
            <p style={{color:C.gray,fontSize:13,marginBottom:22}}>Resumen · Marzo 2026</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
              {[{l:"Usuarios activos",v:"248",d:"+12%",ic:"users",col:C.accent},{l:"Ingresos del mes",v:"$4.960",d:"+8%",ic:"dollar",col:C.blue},{l:"Sesiones completadas",v:"1,847",d:"+23%",ic:"check",col:"#40FF80"},{l:"Entrenadores",v:"6",d:"+1",ic:"star",col:C.orange}].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.s2}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <p style={{fontSize:10,color:C.gray,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{s.l}</p>
                      <p className="bb" style={{fontSize:32,color:C.white,letterSpacing:.5}}>{s.v}</p>
                    </div>
                    <div style={{width:38,height:38,borderRadius:11,background:`${s.col}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <SvgIcon name={s.ic} size={19} color={s.col}/>
                    </div>
                  </div>
                  <span style={{fontSize:12,color:C.accent,fontWeight:600,marginTop:4,display:"block"}}>{s.d} vs mes anterior</span>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:C.s0,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.s2}`}}>
                <h3 style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>Últimos registros</h3>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr><th className="bk-th">Usuario</th><th className="bk-th">Plan</th><th className="bk-th">Estado</th></tr></thead>
                  <tbody>
                    {[{n:"Ana García",p:"Premium",a:true},{n:"Luis Pérez",p:"Básico",a:true},{n:"María Torres",p:"Premium",a:false}].map(u=>(
                      <tr key={u.n} className="bk-tr">
                        <td className="bk-td" style={{color:C.white,fontWeight:500}}>{u.n}</td>
                        <td className="bk-td"><span className="tag" style={{background:`${u.p==="Premium"?C.accent:C.gray}18`,color:u.p==="Premium"?C.accent:C.gray,fontSize:10}}>{u.p}</span></td>
                        <td className="bk-td"><span style={{color:u.a?"#40FF80":C.gray,fontSize:12}}>{u.a?"● Activo":"○ Pausado"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{background:C.s0,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.s2}`}}>
                <h3 style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>Ingresos 6 meses</h3>
                <div style={{display:"flex",alignItems:"flex-end",gap:8,height:110}}>
                  {[3200,3600,3900,4100,4600,4960].map((v,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:"100%",height:`${(v/5000)*100}%`,background:i===5?C.accent:`rgba(200,255,0,.2)`,borderRadius:"4px 4px 0 0"}}/>
                      <span style={{fontSize:9,color:C.gray}}>{"EFMAMJ"[i]}</span>
                    </div>
                  ))}
                </div>
                <p className="bb" style={{fontSize:28,color:C.accent,marginTop:12}}>$4.960 <span style={{fontSize:16,color:C.gray}}>este mes</span></p>
              </div>
            </div>
          </div>
        )}

        {page==="users"&&(()=>{
          const ALL_USERS = [
            {n:"Carlos Mendez",     c:"Ramirez",    p:"pro_coach",  plan_label:"PRO + Coach",   d:"15 Mar",a:true,  pais:"🇦🇷",edad:28,dni:"25.123.456",email:"carlos@mail.com"},
            {n:"Ana Garcia",        c:"Lopez",      p:"pro_coach",  plan_label:"PRO + Coach",   d:"20 Mar",a:true,  pais:"🇨🇱",edad:32,dni:"12.345.678-9",email:"ana@mail.cl"},
            {n:"Luis Perez",        c:"Ramirez",    p:"pro",        plan_label:"PRO",           d:"22 Mar",a:true,  pais:"🇦🇷",edad:25,dni:"30.456.789",email:"luis@mail.com"},
            {n:"Maria Torres",      c:"Garcia",     p:"pro_coach",  plan_label:"PRO + Coach",   d:"28 Mar",a:false, pais:"🇧🇷",edad:35,dni:"",email:"maria@mail.br"},
            {n:"Roberto Silva",     c:"-",          p:"free",       plan_label:"Gratis",        d:"-",     a:true,  pais:"🇬🇧",edad:22,dni:"",email:"roberto@mail.uk"},
            {n:"Valentina Morales", c:"Lopez",      p:"pro_coach",  plan_label:"PRO + Coach",   d:"5 Abr", a:true,  pais:"🇨🇱",edad:29,dni:"11.222.333-4",email:"vale@mail.cl"},
            {n:"Tomas Klein",       c:"-",          p:"pro",        plan_label:"PRO",           d:"8 Abr", a:true,  pais:"🇦🇷",edad:41,dni:"20.111.222",email:"tomas@mail.com"},
          ];
          const planColors = {pro_coach:C.orange, pro:C.accent, free:C.gray};
          const filtered = ALL_USERS.filter(u => planFilter==="todos" || u.p===planFilter);
          const counts = {todos:ALL_USERS.length, pro_coach:ALL_USERS.filter(u=>u.p==="pro_coach").length, pro:ALL_USERS.filter(u=>u.p==="pro").length, free:ALL_USERS.filter(u=>u.p==="free").length};
          return (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1}}>USUARIOS</h1>
                <p style={{color:C.gray,fontSize:13}}>{ALL_USERS.length} usuarios registrados</p>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[{id:"todos",l:"Total",col:C.accent},{id:"pro_coach",l:"PRO + Coach",col:C.orange},{id:"pro",l:"PRO",col:C.accent},{id:"free",l:"Gratis",col:C.gray}].map(s=>(
                <div key={s.id} onClick={()=>setPlanFilter(s.id)} style={{background:planFilter===s.id?`${s.col}15`:C.s0,borderRadius:12,padding:"12px 14px",border:`1.5px solid ${planFilter===s.id?s.col:C.s2}`,textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                  <p className="mono" style={{fontSize:22,color:s.col,fontWeight:700}}>{counts[s.id]}</p>
                  <p style={{fontSize:10,color:C.gray,marginTop:3,textTransform:"uppercase",letterSpacing:.7}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Usuario","Pais","Coach","Plan","Edad","Datos fiscales","Prox. pago","Estado",""].map(h=><th key={h} className="bk-th">{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map(u=>(
                    <tr key={u.n} className="bk-tr">
                      <td className="bk-td"><div><p style={{fontWeight:700,fontSize:13,color:C.white}}>{u.n}</p><p style={{fontSize:10,color:C.gray}}>{u.email}</p></div></td>
                      <td className="bk-td"><span style={{fontSize:14}}>{u.pais}</span></td>
                      <td className="bk-td" style={{color:C.gray,fontSize:12}}>{u.c}</td>
                      <td className="bk-td"><span style={{fontSize:10,fontWeight:700,background:`${planColors[u.p]}18`,color:planColors[u.p],borderRadius:8,padding:"3px 8px"}}>{u.plan_label}</span></td>
                      <td className="bk-td" style={{color:C.gray,fontSize:12}}>{u.edad} años</td>
                      <td className="bk-td">{u.dni?<span style={{fontSize:11,color:"#40FF80",fontFamily:"monospace"}}>{u.dni}</span>:<span style={{fontSize:10,color:C.gray}}>Sin completar</span>}</td>
                      <td className="bk-td" style={{color:C.gray,fontSize:12}}>{u.d}</td>
                      <td className="bk-td"><span style={{color:u.a?"#40FF80":C.gray,fontSize:12}}>{u.a?"Activo":"Pausado"}</span></td>
                      <td className="bk-td"><button onClick={()=>setUserDetail(u)} style={{background:"transparent",border:"none",color:C.accent,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {userDetail&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setUserDetail(null)}>
                <div style={{width:"100%",maxWidth:500,background:C.s0,borderRadius:"20px 20px 0 0",padding:"22px 24px 28px",border:`1px solid ${C.s2}`}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div><h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5}}>{userDetail.n}</h3><p style={{fontSize:12,color:C.gray}}>{userDetail.email} - {userDetail.pais}</p></div>
                    <button onClick={()=>setUserDetail(null)} style={{background:C.s2,border:"none",borderRadius:9,width:30,height:30,color:C.grayL,cursor:"pointer",fontSize:14}}>X</button>
                  </div>
                  <div style={{background:C.s1,borderRadius:12,padding:"14px",marginBottom:12,border:`1px solid ${C.s2}`}}>
                    <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Datos fiscales</p>
                    {userDetail.dni ? (<div style={{display:"flex",gap:16}}><div><p style={{fontSize:10,color:C.gray}}>DNI / RUT / UTR</p><p className="mono" style={{fontSize:14,color:C.white,fontWeight:700}}>{userDetail.dni}</p></div></div>) : (<div style={{background:C.orange+"10",borderRadius:10,padding:"10px 12px"}}><p style={{fontSize:12,color:C.orange}}>Sin datos fiscales completados.</p></div>)}
                  </div>
                  <button onClick={()=>setUserDetail(null)} style={{width:"100%",background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"11px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
          );
        })()}

        {page==="finance"&&(
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:2}}>FINANZAS</h1>
            <p style={{color:C.gray,fontSize:13,marginBottom:18}}>Comisiones y revenue · Q1 2026</p>


            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              {[
                {l:"Revenue total",    v:"$127.400",   sub:"Todos los países · Mar 2026", col:C.accent},
                {l:"Comisiones FORZA", v:"$19.110",    sub:"15% sobre pagos a coaches",  col:C.orange},
                {l:"Suscripciones PRO",v:"243 activas",sub:"+18% vs mes anterior",       col:C.blue},
              ].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:14,padding:"14px 16px",border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>{s.l}</p>
                  <p className="bb" style={{fontSize:24,color:s.col,letterSpacing:.5,lineHeight:1,marginBottom:3}}>{s.v}</p>
                  <p style={{fontSize:11,color:C.gray}}>{s.sub}</p>
                </div>
              ))}
            </div>


            <div style={{background:C.s0,borderRadius:16,border:`1px solid ${C.s2}`,marginBottom:20,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontSize:14,fontWeight:700,color:C.white}}>Revenue por país</h3>
                <span style={{fontSize:11,color:C.gray}}>Marzo 2026</span>
              </div>
              {[
                {flag:"🇦🇷",country:"Argentina", currency:"ARS", usuarios:89, coaches:14, revenueLocal:"$2.340.000", comisionLocal:"$351.000", revenueUSD:"$2.340", comisionUSD:"$351",  bar:0.55},
                {flag:"🇨🇱",country:"Chile",     currency:"CLP", usuarios:72, coaches:11, revenueLocal:"$719.280", comisionLocal:"$107.892", revenueUSD:"$3.840", comisionUSD:"$576",  bar:0.72},
                {flag:"🇬🇧",country:"UK",        currency:"GBP", usuarios:48, coaches:9,  revenueLocal:"£7.920",   comisionLocal:"£1.188",   revenueUSD:"$9.960", comisionUSD:"$1.494",bar:1.0},
                {flag:"🇧🇷",country:"Brasil",    currency:"BRL", usuarios:34, coaches:6,  revenueLocal:"R$9.020",  comisionLocal:"R$1.353",  revenueUSD:"$1.804", comisionUSD:"$270",  bar:0.34},
              ].map(r=>(
                <div key={r.country} style={{padding:"14px 18px",borderBottom:`1px solid ${C.s2}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:22}}>{r.flag}</span>
                      <div>
                        <p style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:2}}>{r.country} <span style={{fontSize:10,color:C.gray}}>({r.currency})</span></p>
                        <p style={{fontSize:11,color:C.gray}}>{r.usuarios} usuarios · {r.coaches} coaches</p>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p className="mono" style={{fontSize:13,color:C.white,fontWeight:700}}>{r.revenueLocal}</p>
                      <p style={{fontSize:10,color:C.orange}}>Comisión: {r.comisionLocal}</p>
                      <p style={{fontSize:9,color:C.gray}}>≈ {r.revenueUSD} USD</p>
                    </div>
                  </div>
                  <div style={{height:4,background:C.s2,borderRadius:100}}>
                    <div style={{height:4,background:`linear-gradient(90deg,${C.accent},${C.blue})`,borderRadius:100,width:`${r.bar*100}%`,transition:"width .6s"}}/>
                  </div>
                </div>
              ))}
            </div>


            <div style={{background:C.s0,borderRadius:16,border:`1px solid ${C.s2}`,marginBottom:20,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontSize:14,fontWeight:700,color:C.white}}>Comisiones pendientes de validar</h3>
                <span style={{fontSize:11,color:C.orange}}>3 facturas en revisión</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["Coach","País","Alumno","Paquete","Monto","Comisión","Factura","Estado"].map(h=>(
                    <th key={h} className="bk-th">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    {coach:"Miguel Ramírez",flag:"🇦🇷",alumno:"Carlos M.", pkg:"Pro",    monto:"$39.900",comision:"$5.985",factura:"0001-0012",estado:"en_revision"},
                    {coach:"Miguel Ramírez",flag:"🇦🇷",alumno:"Ana G.",    pkg:"Elite",  monto:"$64.900",comision:"$9.735",factura:"0001-0013",estado:"en_revision"},
                    {coach:"Sofía López",   flag:"🇨🇱",alumno:"Tomás K.",  pkg:"Starter",monto:"$19.990",comision:"$2.999",factura:"B-000045", estado:"en_revision"},
                    {coach:"Diego García",  flag:"🇧🇷",alumno:"Valentina P.",pkg:"Pro",  monto:"R$149",  comision:"R$22",  factura:"NF-1890",  estado:"aprobado"},
                    {coach:"Sofía López",   flag:"🇨🇱",alumno:"Lucas B.",  pkg:"Elite",  monto:"$74.990",comision:"$11.249",factura:"B-000039",estado:"aprobado"},
                  ].map((t,i)=>(
                    <tr key={i} className="bk-tr">
                      <td className="bk-td" style={{color:C.white,fontWeight:600}}>{t.coach} {t.flag}</td>
                      <td className="bk-td" style={{color:C.gray}}>{t.alumno}</td>
                      <td className="bk-td"><span className="tag" style={{background:`${C.accent}15`,color:C.accent}}>{t.pkg}</span></td>
                      <td className="bk-td"><span className="mono" style={{color:C.white}}>{t.monto}</span></td>
                      <td className="bk-td"><span className="mono" style={{color:C.orange,fontWeight:700}}>{t.comision}</span></td>
                      <td className="bk-td" style={{color:C.gray,fontSize:11}}>{t.factura}</td>
                      <td className="bk-td">
                        {(function(){
                           var st = facturaStates[t.factura] || t.estado;
                           if (st === "aprobado") return <span style={{fontSize:10,borderRadius:8,padding:"3px 9px",background:"#40FF8018",color:"#40FF80",fontWeight:700}}>✓ Aprobado</span>;
                           if (st === "rechazado") return <span style={{fontSize:10,borderRadius:8,padding:"3px 9px",background:`${C.red}18`,color:C.red,fontWeight:700}}>✗ Rechazado</span>;
                           return (
                             <div style={{display:"flex",gap:5}}>
                               <button onClick={function(){setFacturaModal(t);}} style={{fontSize:10,borderRadius:7,padding:"4px 9px",background:"#40FF8018",color:"#40FF80",border:"1px solid #40FF8030",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✓ Aprobar</button>
                               <button onClick={function(){setFacturaRechazarModal(t);}} style={{fontSize:10,borderRadius:7,padding:"4px 9px",background:`${C.red}15`,color:C.red,border:`1px solid ${C.red}30`,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✗ Rechazar</button>
                             </div>
                           );
                         })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              <div style={{background:C.s0,borderRadius:14,padding:"16px",border:`1px solid ${C.s2}`}}>
                <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:12}}>Distribucion de ingresos</p>
                {[
                  {l:"Suscripciones PRO",pct:52,col:C.accent},
                  {l:"Comisiones coaches",pct:38,col:C.orange},
                  {l:"Plan Gratis (ads)",  pct:10,col:C.blue},
                ].map(s=>(
                  <div key={s.l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:11,color:C.grayL}}>{s.l}</span>
                      <span className="mono" style={{fontSize:11,color:s.col,fontWeight:700}}>{s.pct}%</span>
                    </div>
                    <div style={{height:5,background:C.s2,borderRadius:100}}>
                      <div style={{height:5,background:s.col,borderRadius:100,width:`${s.pct}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:C.s0,borderRadius:14,padding:"16px",border:`1px solid ${C.s2}`}}>
                <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:12}}>Coaches por modelo</p>
                {[
                  {l:"0-3 alumnos (sub fija)", n:18, col:C.blue},
                  {l:"4+ alumnos (comision)",  n:22, col:C.accent},
                  {l:"Sin alumnos aun",         n:8,  col:C.gray},
                ].map(s=>(
                  <div key={s.l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:11,color:C.grayL}}>{s.l}</span>
                      <span className="mono" style={{fontSize:12,color:s.col,fontWeight:700}}>{s.n}</span>
                    </div>
                    <div style={{height:5,background:C.s2,borderRadius:100}}>
                      <div style={{height:5,background:s.col,borderRadius:100,width:`${(s.n/48)*100}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div style={{background:C.s0,borderRadius:16,border:`1px solid ${C.s2}`,marginBottom:20,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontSize:14,fontWeight:700,color:C.white}}>Proyeccion de ingresos</h3>
                <span style={{fontSize:11,color:C.accent}}>Abr-Jun 2026</span>
              </div>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
                  {[{m:"Abril",v:"$134.000",d:"+5%",col:C.accent},{m:"Mayo",v:"$141.000",d:"+5%",col:"#40FF80"},{m:"Junio",v:"$148.000",d:"+5%",col:"#40FF80"}].map(s=>(
                    <div key={s.m} style={{background:C.s1,borderRadius:12,padding:"12px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
                      <p style={{fontSize:10,color:C.gray,textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>{s.m}</p>
                      <p className="mono" style={{fontSize:18,color:s.col,fontWeight:700}}>{s.v}</p>
                      <p style={{fontSize:10,color:s.col,marginTop:2}}>{s.d} vs mes ant.</p>
                    </div>
                  ))}
                </div>
                <div style={{background:`${C.accent}08`,border:`1px solid ${C.accent}20`,borderRadius:10,padding:"10px 14px"}}>
                  <p style={{fontSize:11,color:C.grayL,lineHeight:1.6}}>Basado en crecimiento historico del 5% mensual. Incluye: +3 coaches proyectados · +15% suscripciones PRO · estabilidad en comisiones.</p>
                </div>
              </div>
            </div>


            <div style={{display:"flex",gap:10}}>
              <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:11,padding:"11px",fontSize:13,fontWeight:600,color:C.grayL,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>CSV</span> Exportar reporte
              </button>
              <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:11,padding:"11px",fontSize:13,fontWeight:600,color:C.grayL,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>PDF</span> Reporte PDF
              </button>
            </div>
          </div>
        )}

                {page==="coaches"&&(()=>{
          const COACHES_FULL = [
            {n:"Miguel Ramírez",   sp:"Fuerza y powerlifting", us:42, rt:4.9, flag:"🇦🇷", pais:"Argentina",   modelo:"comision",   ingresos:"$158.000", comision:"$23.700", constancia:"constancia_AR_001.pdf"},
            {n:"Sofía López",      sp:"Funcional y HIIT",      us:38, rt:4.8, flag:"🇨🇱", pais:"Chile",        modelo:"comision",   ingresos:"$284.000", comision:"$42.600", constancia:"boleta_CL_sofia.pdf"},
            {n:"Diego García",     sp:"Musculación clásica",   us:3,  rt:4.7, flag:"🇧🇷", pais:"Brasil",       modelo:"sub_fija",   ingresos:"R$117",    comision:"R$0",     constancia:"nf_BR_garcia.pdf"},
            {n:"Ana Beatriz Santos",sp:"Yoga y movilidad",     us:0,  rt:0,   flag:"🇬🇧", pais:"Reino Unido",  modelo:"sin_alumnos",ingresos:"£0",       comision:"£0",      constancia:"uk_utr_ana.pdf"},
            {n:"Lucas Fernández",  sp:"Crossfit e HIIT",       us:0,  rt:0,   flag:"🇦🇷", pais:"Argentina",   modelo:"sin_alumnos",ingresos:"$0",       comision:"$0",      constancia:"constancia_AR_002.pdf"},
            {n:"Carla Vega",       sp:"Pilates y funcional",   us:0,  rt:0,   flag:"🇨🇱", pais:"Chile",        modelo:"sin_alumnos",ingresos:"$0",       comision:"$0",      constancia:"boleta_CL_carla.pdf"},
          ];
          const stMap = {aprobado:{l:"Aprobado",col:"#40FF80"},en_revision:{l:"En revision",col:C.blue},pendiente:{l:"Pendiente",col:C.orange},rechazado:{l:"Rechazado",col:C.red}};
          const filteredCoaches = COACHES_FULL.filter(c => coachFilter==="todos" || coachValidation[c.n]===coachFilter);
          return (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1}}>ENTRENADORES</h1>
                <p style={{color:C.gray,fontSize:13}}>{COACHES_FULL.length} coaches registrados · {COACHES_FULL.filter(c=>coachValidation[c.n]==="aprobado").length} activos</p>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {["pendiente","en_revision"].map(k=>{
                  const cnt=COACHES_FULL.filter(c=>coachValidation[c.n]===k).length;
                  return cnt>0 ? <span key={k} style={{fontSize:11,background:`${stMap[k].col}18`,color:stMap[k].col,borderRadius:8,padding:"4px 10px",fontWeight:700}}>{cnt} {stMap[k].l}</span>:null;
                })}
              </div>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {[["todos","Todos"],["aprobado","Aprobados"],["en_revision","En revision"],["pendiente","Pendientes"],["rechazado","Rechazados"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setCoachFilter(id)} style={{padding:"6px 12px",borderRadius:100,border:`1px solid ${coachFilter===id?C.accent:C.s3}`,background:coachFilter===id?`${C.accent}15`:C.s1,color:coachFilter===id?C.accent:C.gray,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  {lbl}
                </button>
              ))}
            </div>
            <div style={{background:C.s0,borderRadius:16,border:`1px solid ${C.s2}`,overflow:"hidden",marginBottom:16}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Coach","Pais","Modelo","Alumnos","Ingresos","Comision FORZA","Estado","Acciones"].map(h=><th key={h} className="bk-th">{h}</th>)}</tr></thead>
                <tbody>
                  {filteredCoaches.map(c=>{
                    const st = coachValidation[c.n];
                    const stObj = stMap[st] || {l:st,col:C.gray};
                    return (
                      <tr key={c.n} className="bk-tr">
                        <td className="bk-td"><div style={{display:"flex",gap:9,alignItems:"center"}}><div style={{width:30,height:30,borderRadius:"50%",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><SvgIcon name="user" size={13} color={C.accent}/></div><div><p style={{fontWeight:700,fontSize:13,color:C.white}}>{c.n}</p><p style={{fontSize:10,color:C.gray}}>{c.sp}</p></div></div></td>
                        <td className="bk-td"><span style={{fontSize:14}}>{c.flag}</span> <span style={{fontSize:11,color:C.gray}}>{c.pais}</span></td>
                        <td className="bk-td">{(()=>{
                          var m = coachModelos[c.n] || c.modelo;
                          var autoSwitch = c.us >= 4 && m === "sub_fija";
                          if (autoSwitch) return (
                            <div style={{display:"flex",flexDirection:"column",gap:4,minWidth:110}}>
                              <span style={{fontSize:10,background:`${C.orange}15`,color:C.orange,borderRadius:7,padding:"3px 8px",fontWeight:700}}>⚡ Pendiente cambio</span>
                              <button onClick={()=>setModeloModal(c)} style={{fontSize:9,background:`${C.accent}18`,color:C.accent,border:`1px solid ${C.accent}40`,borderRadius:5,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Confirmar → Comisión</button>
                            </div>
                          );
                          if (m === "comision") return <span style={{fontSize:10,background:`${C.accent}15`,color:C.accent,borderRadius:8,padding:"3px 7px",fontWeight:700}}>Comisión 15%</span>;
                          if (m === "sub_fija") return <span style={{fontSize:10,background:`${C.blue}15`,color:C.blue,borderRadius:8,padding:"3px 7px",fontWeight:700}}>Sub. fija</span>;
                          return <span style={{fontSize:10,background:`${C.gray}15`,color:C.gray,borderRadius:8,padding:"3px 7px",fontWeight:700}}>Sin alumnos</span>;
                        })()}</td>
                        <td className="bk-td"><span className="mono" style={{fontSize:13,color:C.white}}>{c.us}</span></td>
                        <td className="bk-td"><span className="mono" style={{fontSize:12,color:C.accent,fontWeight:700}}>{c.ingresos}</span></td>
                        <td className="bk-td"><span className="mono" style={{fontSize:12,color:C.orange,fontWeight:700}}>{c.comision}</span></td>
                        <td className="bk-td"><span style={{fontSize:10,fontWeight:700,background:`${stObj.col}18`,color:stObj.col,borderRadius:8,padding:"3px 9px"}}>{stObj.l}</span></td>
                        <td className="bk-td"><div style={{display:"flex",gap:5}}>
                          <button onClick={()=>setCoachDetail(c)} style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:7,padding:"4px 8px",color:C.grayL,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Ver</button>
                          {(st==="pendiente"||st==="en_revision")&&<button onClick={()=>setApproveModal(c)} style={{background:"#40FF8018",border:"1px solid #40FF8030",borderRadius:7,padding:"4px 8px",color:"#40FF80",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>Aprobar</button>}
                          {(st==="pendiente"||st==="en_revision")&&<button onClick={()=>{setRejectModal(c);setRejectReason("");}} style={{background:`${C.red}15`,border:`1px solid ${C.red}30`,borderRadius:7,padding:"4px 8px",color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>Rechazar</button>}
                        </div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {approveModal&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setApproveModal(null)}>
                <div style={{background:C.s0,borderRadius:20,padding:"24px",border:"1px solid #40FF8030",width:"100%",maxWidth:440}} onClick={e=>e.stopPropagation()}>
                  <div style={{textAlign:"center",marginBottom:16}}>
                    <div style={{width:52,height:52,borderRadius:16,background:"#40FF8015",border:"2px solid #40FF8040",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 10px"}}>OK</div>
                    <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:6}}>APROBAR COACH</h3>
                    <p style={{fontSize:13,color:C.gray,lineHeight:1.6}}><strong style={{color:C.white}}>{approveModal.n}</strong> podra aparecer en el marketplace y recibir alumnos.</p>
                  </div>
                  <div style={{background:"#40FF8008",border:"1px solid #40FF8020",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
                    <p style={{fontSize:11,color:C.grayL}}>Constancia: <strong style={{color:"#40FF80"}}>{approveModal.constancia}</strong></p>
                    <p style={{fontSize:11,color:C.grayL,marginTop:4}}>El coach recibira notificacion por email y push.</p>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>{setCoachValidation(p=>({...p,[approveModal.n]:"aprobado"}));setApproveModal(null);}} style={{flex:1,background:"#40FF80",color:"#000",border:"none",borderRadius:11,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Confirmar aprobacion</button>
                    <button onClick={()=>setApproveModal(null)} style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"12px 16px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {rejectModal&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setRejectModal(null)}>
                <div style={{background:C.s0,borderRadius:20,padding:"24px",border:`1px solid ${C.red}30`,width:"100%",maxWidth:440}} onClick={e=>e.stopPropagation()}>
                  <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:4}}>RECHAZAR CONSTANCIA</h3>
                  <p style={{fontSize:13,color:C.gray,marginBottom:14}}>{rejectModal.n} - {rejectModal.constancia}</p>
                  <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Motivo del rechazo</label>
                  <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Ej: La constancia no es legible. Subi un PDF claro con tus datos fiscales vigentes." style={{width:"100%",padding:"12px",background:C.s2,border:`1.5px solid ${rejectReason?C.red:C.s3}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"inherit",height:80,resize:"none",marginBottom:14,transition:"border-color .2s"}}/>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>{if(rejectReason.trim()){setCoachValidation(p=>({...p,[rejectModal.n]:"rechazado"}));setRejectModal(null);}}} disabled={!rejectReason.trim()} style={{flex:1,background:rejectReason.trim()?C.red:C.s2,color:C.white,border:"none",borderRadius:11,padding:"12px",fontSize:13,fontWeight:700,cursor:rejectReason.trim()?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .3s"}}>Enviar rechazo</button>
                    <button onClick={()=>setRejectModal(null)} style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"12px 16px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {coachDetail&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setCoachDetail(null)}>
                <div style={{width:"100%",maxWidth:700,background:C.s0,borderRadius:"20px 20px 0 0",padding:"24px 28px 32px",border:`1px solid ${C.s2}`,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div><h3 className="bb" style={{fontSize:24,color:C.white,letterSpacing:.5}}>{coachDetail.n} {coachDetail.flag}</h3><p style={{fontSize:13,color:C.gray}}>{coachDetail.sp} - {coachDetail.pais}</p></div>
                    <button onClick={()=>setCoachDetail(null)} style={{background:C.s2,border:"none",borderRadius:9,width:32,height:32,color:C.grayL,cursor:"pointer",fontSize:16}}>X</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
                    {[{l:"Alumnos",v:coachDetail.us,col:C.accent},{l:"Rating",v:coachDetail.rt||"N/A",col:C.orange},{l:"Ingresos",v:coachDetail.ingresos,col:C.blue},{l:"Comision",v:coachDetail.comision,col:C.red}].map(s=>(
                      <div key={s.l} style={{background:C.s1,borderRadius:12,padding:"12px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
                        <p className="mono" style={{fontSize:18,color:s.col,fontWeight:700,marginBottom:2}}>{s.v}</p>
                        <p style={{fontSize:10,color:C.gray,textTransform:"uppercase",letterSpacing:.7}}>{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{background:C.s1,borderRadius:14,padding:"14px",border:`1px solid ${C.s2}`,marginBottom:12}}>
                    <p style={{fontSize:10,fontWeight:700,color:C.grayL,textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Alumnos activos</p>
                    {coachDetail.us>0
                      ?["Carlos Mendez - Pro - $39.900/mes","Ana Garcia - Elite - $64.900/mes","Luis Perez - Starter - $19.900/mes"].slice(0,coachDetail.us).map(a=>(
                          <div key={a} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.s2}`}}>
                            <span style={{fontSize:13,color:C.white}}>{a.split(" - ")[0]}</span>
                            <span style={{fontSize:12,color:C.accent,fontWeight:700}}>{a.split(" - ")[2]}</span>
                          </div>
                        ))
                      :<p style={{fontSize:12,color:C.gray,textAlign:"center",padding:"10px 0"}}>Sin alumnos activos aun</p>
                    }
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {(coachValidation[coachDetail.n]==="pendiente"||coachValidation[coachDetail.n]==="en_revision")&&(
                      <button onClick={()=>{setApproveModal(coachDetail);setCoachDetail(null);}} style={{flex:1,background:"#40FF80",color:"#000",border:"none",borderRadius:11,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Aprobar coach</button>
                    )}
                    <button onClick={()=>setCoachDetail(null)} style={{flex:1,background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"11px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cerrar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          );
        })()}

        {modeloModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{width:"100%",maxWidth:520,background:C.s0,borderRadius:"20px 20px 0 0",padding:28,border:`1px solid ${C.orange}40`}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{width:54,height:54,borderRadius:16,background:`${C.orange}15`,border:`2px solid ${C.orange}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>⚡</div>
                <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:6}}>CAMBIO DE MODELO</h3>
                <p style={{fontSize:13,color:C.gray,lineHeight:1.6}}>
                  <strong style={{color:C.white}}>{modeloModal.n}</strong> alcanzó <strong style={{color:C.orange}}>4+ alumnos</strong>. El sistema cambia automáticamente a <strong style={{color:C.accent}}>comisión 15%</strong>.
                </p>
              </div>
              <div style={{background:C.s1,borderRadius:12,padding:"12px 16px",marginBottom:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Modelo anterior","Sub. fija",C.blue],["Modelo nuevo","Comisión 15%",C.accent],["Alumnos activos",String(modeloModal.us),C.orange],["Efecto","Próximo pago",C.grayL]].map(function(row){
                  return (
                    <div key={row[0]}>
                      <p style={{fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:3}}>{row[0]}</p>
                      <span style={{fontSize:12,color:row[2],fontWeight:700}}>{row[1]}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:11,color:C.gray,lineHeight:1.6,marginBottom:18}}>El coach fue notificado por email. Desde el próximo ciclo no se descuenta la suscripción fija — FORZA retiene el 15% de cada pago.</p>
              <div style={{display:"flex",gap:10}}>
                <button onClick={function(){setCoachModelos(function(p){var n={};Object.keys(p).forEach(function(k){n[k]=p[k];});n[modeloModal.n]="comision";return n;});setModeloModal(null);}} style={{flex:1,background:`linear-gradient(135deg,${C.accent},#90FF40)`,color:C.bg,border:"none",borderRadius:13,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>✓ CONFIRMAR CAMBIO</button>
                <button onClick={function(){setModeloModal(null);}} style={{flex:.5,background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"13px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {facturaModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{width:"100%",maxWidth:520,background:C.s0,borderRadius:"20px 20px 0 0",padding:28,border:"1px solid #40FF8040"}}>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:16,background:"#40FF8015",border:"2px solid #40FF8040",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 10px"}}>📄</div>
                <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:4}}>APROBAR FACTURA</h3>
              </div>
              <div style={{background:C.s1,borderRadius:12,padding:"12px 16px",marginBottom:16}}>
                {[["Coach",facturaModal.coach+" "+facturaModal.flag],["Alumno",facturaModal.alumno],["Paquete",facturaModal.pkg],["Monto total",facturaModal.monto],["Comisión FORZA (15%)",facturaModal.comision],["N° Factura",facturaModal.factura]].map(function(row){
                  return (
                    <div key={row[0]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.s2}`}}>
                      <span style={{fontSize:11,color:C.gray}}>{row[0]}</span>
                      <span className="mono" style={{fontSize:12,color:C.white,fontWeight:700}}>{row[1]}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:11,color:C.gray,marginBottom:18,lineHeight:1.6}}>Al aprobar se libera la transferencia del <strong style={{color:"#40FF80"}}>85%</strong> al coach y se registra la comisión de FORZA.</p>
              <div style={{display:"flex",gap:10}}>
                <button onClick={function(){setFacturaStates(function(p){var n={};Object.keys(p).forEach(function(k){n[k]=p[k];});n[facturaModal.factura]="aprobado";return n;});setFacturaModal(null);}} style={{flex:1,background:"linear-gradient(135deg,#40FF80,#00CC60)",color:"#040A04",border:"none",borderRadius:13,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>✓ APROBAR Y TRANSFERIR</button>
                <button onClick={function(){setFacturaModal(null);}} style={{flex:.5,background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"13px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {facturaRechazarModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{width:"100%",maxWidth:520,background:C.s0,borderRadius:"20px 20px 0 0",padding:28,border:`1px solid ${C.red}40`}}>
              <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:4}}>RECHAZAR FACTURA</h3>
              <p style={{fontSize:13,color:C.gray,marginBottom:14}}>{facturaRechazarModal.coach} · Factura {facturaRechazarModal.factura} · {facturaRechazarModal.monto}</p>
              <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.9,marginBottom:6}}>Motivo del rechazo</label>
              <textarea value={facturaRechazarMotivo} onChange={function(e){setFacturaRechazarMotivo(e.target.value);}} placeholder="Ej: Número de factura incorrecto, monto no coincide..."
                style={{width:"100%",padding:"10px 12px",background:C.s2,border:`1.5px solid ${facturaRechazarMotivo?C.red:C.s3}`,borderRadius:11,color:C.white,fontSize:13,fontFamily:"inherit",resize:"none",height:80,marginBottom:16}}/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={function(){if(facturaRechazarMotivo.trim()){setFacturaStates(function(p){var n={};Object.keys(p).forEach(function(k){n[k]=p[k];});n[facturaRechazarModal.factura]="rechazado";return n;});setFacturaRechazarModal(null);setFacturaRechazarMotivo("");}}}
                  disabled={!facturaRechazarMotivo.trim()}
                  style={{flex:1,background:facturaRechazarMotivo.trim()?`${C.red}CC`:C.s2,color:facturaRechazarMotivo.trim()?C.white:C.gray,border:"none",borderRadius:13,padding:"13px",fontSize:14,fontWeight:700,cursor:facturaRechazarMotivo.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>
                  Rechazar
                </button>
                <button onClick={function(){setFacturaRechazarModal(null);setFacturaRechazarMotivo("");}} style={{flex:.5,background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"13px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}



        {page==="feedback"&&(
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:2}}>FEEDBACK</h1>
                <p style={{color:C.gray,fontSize:13}}>{FEEDBACK_DATA.length} sugerencias de usuarios</p>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              {[
                {l:"Total",       v:FEEDBACK_DATA.length,                                      col:C.accent},
                {l:"Bugs",        v:FEEDBACK_DATA.filter(f=>f.type==="bug").length,             col:C.red},
                {l:"En revisión", v:FEEDBACK_DATA.filter(f=>f.status==="en revisión").length,   col:C.orange},
                {l:"Resueltos",   v:FEEDBACK_DATA.filter(f=>f.status==="resuelto").length,     col:"#40FF80"},
              ].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
                  <p className="mono" style={{fontSize:22,color:s.col,fontWeight:700}}>{s.v}</p>
                  <p style={{fontSize:9,color:C.gray,marginTop:3,textTransform:"uppercase",letterSpacing:.7}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
              <div style={{display:"flex",gap:6}}>
                {["todos","mejora","feature","bug"].map(f=>(
                  <button key={f} onClick={()=>setFbFilter(f)}
                    style={{padding:"6px 12px",borderRadius:100,border:`1px solid ${fbFilter===f?C.accent:C.s3}`,background:fbFilter===f?`${C.accent}15`:C.s1,color:fbFilter===f?C.accent:C.gray,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                    {f==="todos"?"Todos":f==="mejora"?"💡 Mejoras":f==="feature"?"✨ Features":"🐛 Bugs"}
                  </button>
                ))}
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:11,color:C.gray}}>Ordenar:</span>
                {[{id:"votos",l:"Votos"},{id:"rating",l:"Rating"}].map(s=>(
                  <button key={s.id} onClick={()=>setFbSort(s.id)}
                    style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${fbSort===s.id?C.accent:C.s3}`,background:fbSort===s.id?`${C.accent}10`:"transparent",color:fbSort===s.id?C.accent:C.gray,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  <th className="bk-th" style={{width:36}}>Tipo</th>
                  <th className="bk-th">Sugerencia</th>
                  <th className="bk-th" style={{width:80}}>Rating</th>
                  <th className="bk-th" style={{width:70}}>Votos</th>
                  <th className="bk-th" style={{width:80}}>Fecha</th>
                  <th className="bk-th" style={{width:110}}>Estado</th>
                  <th className="bk-th" style={{width:100}}>Acción</th>
                </tr></thead>
                <tbody>
                  {FEEDBACK_DATA
                    .filter(f=>fbFilter==="todos"||f.type===fbFilter)
                    .sort((a,b)=>fbSort==="votos"?b.votes-a.votes:b.rating-a.rating)
                    .map(f=>{
                      const typeIcon=f.type==="bug"?"🐛":f.type==="mejora"?"💡":"✨";
                      const typeColor=f.type==="bug"?C.red:f.type==="mejora"?C.accent:C.blue;
                      const stColor=f.status==="resuelto"?"#40FF80":f.status==="en revisión"?C.orange:f.status==="evaluando"?C.blue:C.gray;
                      return (
                        <tr key={f.id} className="bk-tr" onClick={()=>setFbDetail(f)} style={{cursor:"pointer"}}>
                          <td className="bk-td"><div style={{width:28,height:28,borderRadius:8,background:`${typeColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{typeIcon}</div></td>
                          <td className="bk-td"><p style={{fontSize:12,color:C.grayL,lineHeight:1.4,maxWidth:380}}>{f.text}</p></td>
                          <td className="bk-td"><span style={{color:C.orange,fontSize:11}}>{"⭐".repeat(f.rating)}</span></td>
                          <td className="bk-td"><span className="mono" style={{fontSize:13,color:C.accent,fontWeight:700}}>↑{f.votes}</span></td>
                          <td className="bk-td"><span style={{fontSize:11,color:C.gray}}>{f.date}</span></td>
                          <td className="bk-td"><span style={{fontSize:10,fontWeight:700,color:stColor,background:`${stColor}15`,borderRadius:8,padding:"3px 8px"}}>{f.status}</span></td>
                          <td className="bk-td">
                            <select defaultValue={f.status} onClick={e=>e.stopPropagation()}
                              style={{background:C.s2,border:`1px solid ${C.s3}`,borderRadius:8,padding:"5px 8px",color:C.grayL,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                              <option>pendiente</option><option>evaluando</option><option>en revisión</option><option>resuelto</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
            {fbDetail&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:999,display:"flex",alignItems:"flex-end"}} onClick={()=>setFbDetail(null)}>
                <div style={{width:"100%",maxWidth:800,margin:"0 auto",background:C.s0,borderRadius:"20px 20px 0 0",padding:"24px 28px 32px",border:`1px solid ${C.s2}`}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
                    <p style={{flex:1,fontSize:15,color:C.white,fontWeight:600,lineHeight:1.5}}>{fbDetail.text}</p>
                    <button onClick={()=>setFbDetail(null)} style={{background:C.s2,border:"none",borderRadius:9,width:32,height:32,color:C.grayL,cursor:"pointer",fontSize:16,flexShrink:0}}>✕</button>
                  </div>
                  <div style={{display:"flex",gap:10,marginBottom:14}}>
                    <span style={{fontSize:12,color:C.orange}}>{"⭐".repeat(fbDetail.rating)}</span>
                    <span style={{fontSize:12,color:C.accent,fontWeight:700}}>↑ {fbDetail.votes} votos</span>
                    <span style={{fontSize:12,color:C.gray}}>{fbDetail.date}</span>
                  </div>
                  <textarea placeholder="Respuesta interna del equipo..." style={{width:"100%",padding:"12px",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:12,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:80,resize:"none",marginBottom:12}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setFbDetail(null)} style={{flex:1,background:C.accent,color:C.bg,border:"none",borderRadius:11,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Marcar resuelto</button>
                    <button onClick={()=>setFbDetail(null)} style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"11px 16px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cerrar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {page==="soporte"&&(
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:18}}>SOPORTE</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              {[
                {l:"Abiertos",    v:TICKETS_DATA.filter(t=>t.status==="abierto").length,      col:C.red},
                {l:"En revisión", v:TICKETS_DATA.filter(t=>t.status==="en revisión").length,  col:C.orange},
                {l:"Resueltos",   v:TICKETS_DATA.filter(t=>t.status==="resuelto").length,    col:"#40FF80"},
                {l:"SLA prom.",   v:"4.2h",                                                   col:C.blue},
              ].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
                  <p className="mono" style={{fontSize:22,color:s.col,fontWeight:700}}>{s.v}</p>
                  <p style={{fontSize:9,color:C.gray,marginTop:3,textTransform:"uppercase",letterSpacing:.7}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {["todos","abierto","en revisión","resuelto"].map(f=>(
                <button key={f} onClick={()=>setTkFilter(f)}
                  style={{padding:"6px 12px",borderRadius:100,border:`1px solid ${tkFilter===f?C.accent:C.s3}`,background:tkFilter===f?`${C.accent}15`:C.s1,color:tkFilter===f?C.accent:C.gray,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
                  {f==="todos"?"Todos":f}
                </button>
              ))}
            </div>
            <div style={{background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  <th className="bk-th">ID</th><th className="bk-th">Usuario</th><th className="bk-th">Cat.</th>
                  <th className="bk-th">Asunto</th><th className="bk-th">Prioridad</th>
                  <th className="bk-th">Estado</th><th className="bk-th">Fecha</th><th className="bk-th">Acción</th>
                </tr></thead>
                <tbody>
                  {TICKETS_DATA.filter(t=>tkFilter==="todos"||t.status===tkFilter).map(t=>{
                    const prCol=t.priority==="urgente"?C.red:t.priority==="normal"?C.blue:C.gray;
                    return (
                      <tr key={t.id} className="bk-tr">
                        <td className="bk-td"><span className="mono" style={{fontSize:11,color:C.gray}}>{t.id}</span></td>
                        <td className="bk-td" style={{color:C.white,fontWeight:500,fontSize:12}}>{t.user}</td>
                        <td className="bk-td"><span style={{fontSize:11,color:C.gray}}>{t.cat}</span></td>
                        <td className="bk-td"><p style={{fontSize:12,color:C.grayL,maxWidth:240}}>{t.subject}</p></td>
                        <td className="bk-td"><span style={{fontSize:10,fontWeight:700,color:prCol,background:`${prCol}15`,borderRadius:8,padding:"3px 8px"}}>{t.priority}</span></td>
                        <td className="bk-td"><span style={{fontSize:10,fontWeight:700,color:t.color,background:`${t.color}15`,borderRadius:8,padding:"3px 8px"}}>{t.status}</span></td>
                        <td className="bk-td"><span style={{fontSize:11,color:C.gray}}>{t.date}</span></td>
                        <td className="bk-td">
                          <div style={{display:"flex",gap:5}}>
                            <button style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:8,padding:"4px 10px",color:C.grayL,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Abrir</button>
                            {t.status!=="resuelto"&&<button style={{background:"transparent",border:"1px solid #40FF8040",borderRadius:8,padding:"4px 10px",color:"#40FF80",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✓</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page==="settings"&&(
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:22}}>CONFIGURACIÓN</h1>
            <div style={{maxWidth:480}}>
              {["Información del negocio","Planes y precios","Notificaciones","Integraciones de pago","API y webhooks"].map(s=>(
                <div key={s} style={{background:C.s0,borderRadius:13,padding:"16px 20px",marginBottom:10,border:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <span style={{fontWeight:500,color:C.white,fontSize:14}}>{s}</span>
                  <SvgIcon name="arrow" size={16} color={C.gray}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function BackofficeCoach() {
  const [page, setPage] = useState("dashboard");
  const [ciTab, setCiTab] = useState("respuestas");
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState(["Cuantas sesiones completaste esta semana?","Como fue tu energia en general?","Dormiste bien?","Algo que quieras comentar?"]);
  const nav=[
    {id:"dashboard",   icon:"home",     label:"Dashboard"},
    {id:"perfil-coach",icon:"user",     label:"Mi Perfil"},
    {id:"alumnos",     icon:"users",    label:"Mis Alumnos"},
    {id:"calendario",  icon:"calendar", label:"Calendario"},
    {id:"rutinas",     icon:"dumbbell", label:"Rutinas"},
    {id:"cobros",      icon:"dollar",   label:"Cobros"},
    {id:"chat",        icon:"chat",     label:"Mensajes"},
    {id:"grupos",      icon:"users",    label:"Grupos"},
  ];
  const [coachCountry, setCoachCountry] = useState("AR");
  const [cobrosTab, setCobrosTab] = useState("facturas");
  const [myPrices, setMyPrices] = useState({
    AR:{starter:22000, pro:39900, elite:64900},
    CL:{starter:28990, pro:52990, elite:84990},
    GB:{starter:45,    pro:80,    elite:130},
    BR:{starter:109,   pro:199,   elite:319},
  });
  const [priceErr, setPriceErr] = useState({});
  const updPrice = (country, pkg, val) => {
    const num = parseInt(val)||0;
    const floor = (PRICING.countries.find(c=>c.id===country)||PRICING.countries[0]).coachFloor[pkg];
    setPriceErr(p=>({...p,[country+pkg]: num < floor ? "Mínimo "+floor : null}));
    setMyPrices(p=>({...p,[country]:{...p[country],[pkg]:num}}));
  };
  const [invoiceStep, setInvoiceStep]   = useState("list");
  const [selPago, setSelPago]           = useState(null);
  const [invoiceFile, setInvoiceFile]   = useState(null);
  const [invoiceNum, setInvoiceNum]     = useState("");
  const [bankData, setBankData]         = useState({alias:"miguel.forza", cbu:"", banco:"Brubank", tipo:"Caja de ahorros"});

  const ctryC = PRICING.countries.find(c=>c.id===coachCountry) || PRICING.countries[0];
  const symC  = ctryC.symbol;

  const pagosData = [
    {id:"P001", alumno:"Carlos Méndez",  plan:"Pro",    monto:39900, estado:"pendiente_factura", fecha:"1 Mar", vencimiento:"15 Mar"},
    {id:"P002", alumno:"Ana García",     plan:"Elite",  monto:64900, estado:"pendiente_factura", fecha:"1 Mar", vencimiento:"15 Mar"},
    {id:"P003", alumno:"Pedro Gómez",    plan:"Starter",monto:22000, estado:"facturado",         fecha:"1 Feb", vencimiento:"—"},
    {id:"P004", alumno:"Marta López",    plan:"Pro",    monto:39900, estado:"transferido",       fecha:"1 Feb", vencimiento:"—"},
    {id:"P005", alumno:"Roberto Silva",  plan:"Starter",monto:22000, estado:"transferido",       fecha:"1 Ene", vencimiento:"—"},
  ];

  const pendientes     = pagosData.filter(p=>p.estado==="pendiente_factura");
  const facturados     = pagosData.filter(p=>p.estado==="facturado");
  const transferidos   = pagosData.filter(p=>p.estado==="transferido");
  const totalPendiente = pendientes.reduce((s,p)=>s+p.monto,0);
  const totalFacturado = facturados.reduce((s,p)=>s+p.monto,0);
  const comisionPendiente = Math.round(totalPendiente * PRICING.commission);
  const neto           = totalPendiente - comisionPendiente;
  const [coachProfile, setCoachProfile] = useState({
    name:"Miguel Ramírez", specialty:"Fuerza y Powerlifting",
    bio:"8 años de experiencia. Especializado en progresión de fuerza y periodización. Múltiples alumnos en competencias nacionales. Certificación NSCA-CPT y FMS Level 2.",
    price:30, rating:4.9, students:42,
    tags:["Fuerza","Hipertrofia","Powerlifting","Periodización"],
    results:[{before:"98kg',después:'72kg",client:"Carlos M.",weeks:16},{before:"Sin PR",después:"180kg squat",client:"Ana G.",weeks:20},{before:"30% grasa",después:"16% grasa",client:"Diego R.",weeks:24}],
  });
  const [calMonth, setCalMonth]   = useState(2);
  const [calYear]                 = useState(2026);
  const [calStudent, setCalStudent] = useState("Carlos Méndez");
  const [assignments, setAssignments] = useState({
    "2026-3-2":"Push Day A","2026-3-3":"Pull Day","2026-3-5":"Leg Day",
    "2026-3-7":"Descanso","2026-3-9":"Push Day B","2026-3-10":"Full Body",
    "2026-3-12":"Cardio","2026-3-14":"Descanso",
  });
  const [calPick, setCalPick] = useState(null);
  const ROUTINE_OPTIONS = ["Push Day A","Push Day B","Pull Day","Leg Day","Full Body","Cardio LISS","Descanso","Upper Body"];
  const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const getDaysInMonth = (m,y) => new Date(y,m+1,0).getDate();
  const getFirstDay    = (m,y) => new Date(y,m,1).getDay();

  const assignRoutine = (day, routine) => {
    const key = `${calYear}-${calMonth+1}-${day}`;
    setAssignments(p => routine ? {...p,[key]:routine} : Object.fromEntries(Object.entries(p).filter(([k])=>k!==key)));
    setCalPick(null);
  };
  const alumnosData = [
    { name:"Carlos Méndez",  avatar:"CM", plan:"Premium", joined:"Oct 2025",
      start_weight:92, curr_weight:80, start_fat:28, curr_fat:18,
      sessions:18, totalSessions:22, streak:5, lastSeen:0,
      goal:"Pérdida de grasa",
      weightHistory:[92,90,88,86,84,82,80], months:["Oct","Nov","Dic","Ene","Feb","Mar","Hoy"],
      fatHistory:[28,26,24,22,20,19,18],
      notes:"Aumentó 5kg en press banca este mes. Técnica muy limpia en sentadilla.",
      color:C.accent },
    { name:"Ana García",     avatar:"AG", plan:"Elite",    joined:"Sep 2025",
      start_weight:68, curr_weight:62, start_fat:26, curr_fat:19,
      sessions:22, totalSessions:24, streak:8, lastSeen:0,
      goal:"Recomposición corporal",
      weightHistory:[68,67,66,65,64,63,62], months:["Sep","Oct","Nov","Dic","Ene","Feb","Hoy"],
      fatHistory:[26,25,23,22,21,20,19],
      notes:"La mejor alumna del mes. Racha de 8 días sin fallar. Listo para subir carga.",
      color:C.blue   },
    { name:"Roberto Silva",  avatar:"RS", plan:"Premium", joined:"Nov 2025",
      start_weight:85, curr_weight:80, start_fat:24, curr_fat:20,
      sessions:14, totalSessions:20, streak:2, lastSeen:3,
      goal:"Fuerza",
      weightHistory:[85,84,83,82,81,80,80], months:["Nov","Dic","Ene","Feb","Mar","Mar","Hoy"],
      fatHistory:[24,23,22,21,21,20,20],
      notes:"Asistencia irregular. Charlar sobre motivación.",
      color:C.orange },
    { name:"Lucía Moreno",   avatar:"LM", plan:"Básico",  joined:"Ene 2026",
      start_weight:72, curr_weight:70, start_fat:30, curr_fat:26,
      sessions:9,  totalSessions:18, streak:0, lastSeen:9,
      goal:"Pérdida de peso",
      weightHistory:[72,72,71,71,70,70,70], months:["Ene","Ene","Feb","Feb","Mar","Mar","Hoy"],
      fatHistory:[30,29,28,27,27,26,26],
      notes:"No abre la app hace 9 días. Contactar urgente.",
      color:"#A78BFA"},
    { name:"Pedro Gómez",    avatar:"PG", plan:"Premium", joined:"Oct 2025",
      start_weight:78, curr_weight:71, start_fat:22, curr_fat:16,
      sessions:20, totalSessions:22, streak:6, lastSeen:1,
      goal:"Hipertrofia",
      weightHistory:[78,77,75,74,73,72,71], months:["Oct","Nov","Dic","Ene","Feb","Mar","Hoy"],
      fatHistory:[22,21,19,18,17,17,16],
      notes:"Excelente progreso. PR en curl de bíceps y remo esta semana.",
      color:C.accent },
    { name:"Marta López",    avatar:"ML", plan:"Elite",   joined:"Nov 2025",
      start_weight:65, curr_weight:61, start_fat:27, curr_fat:21,
      sessions:16, totalSessions:20, streak:4, lastSeen:2,
      goal:"Tonificación",
      weightHistory:[65,64,63,63,62,61,61], months:["Nov","Dic","Ene","Feb","Mar","Mar","Hoy"],
      fatHistory:[27,26,25,24,23,22,21],
      notes:"Constante y disciplinada. Planear aumento de volumen el mes que viene.",
      color:C.blue   },
  ];
  const [alumFilter, setAlumFilter] = useState("todos");
  const [alumDetail, setAlumDetail] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [bodyTab, setBodyTab] = useState("medidas");
  const [bodyComments, setBodyComments] = useState({});
  const [bodyCommentInput, setBodyCommentInput] = useState("");

  const FILTERS = [
    { id:"todos",        label:"Todos",              icon:"👥" },
    { id:"mejor_baja",   label:"Mayor bajada de peso", icon:"⚖️" },
    { id:"asistencia",   label:"Mejor asistencia",   icon:"🏆" },
    { id:"inactivos",    label:"Sin actividad",       icon:"😴" },
    { id:"racha",        label:"Mayor racha",         icon:"🔥" },
  ];

  const filteredAlumnos = (() => {
    let list = [...alumnosData];
    if (alumFilter === "mejor_baja")  list.sort((a,b)=>(b.start_weight-b.curr_weight)-(a.start_weight-a.curr_weight));
    if (alumFilter === "asistencia")  list.sort((a,b)=>(b.sessions/b.totalSessions)-(a.sessions/a.totalSessions));
    if (alumFilter === "inactivos")   list = list.filter(a=>a.lastSeen>5).sort((a,b)=>b.lastSeen-a.lastSeen);
    if (alumFilter === "racha")       list.sort((a,b)=>b.streak-a.streak);
    return list;
  })();

  return (
    <div style={{display:"flex",height:"100%"}}>

      <div className="bk-sidebar">
        <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${C.s2}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:30,height:30,background:C.accent,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:15}}>⚡</span></div>
            <span className="bb" style={{fontSize:22,color:C.white,letterSpacing:2}}>FORZA</span>
          </div>
          <div style={{padding:"8px 11px",background:"rgba(68,136,255,.08)",borderRadius:10,border:"1px solid rgba(68,136,255,.15)"}}>
            <p style={{fontSize:10,color:C.gray,marginBottom:2}}>Rol actual</p>
            <p style={{fontSize:13,color:C.blue,fontWeight:700}}>💪 Entrenador</p>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 0"}}>
          {nav.map(n=>(
            <button key={n.id} className={`bk-nav ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
              <SvgIcon name={n.icon} size={17} color={page===n.id?C.accent:C.gray}/> {n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:14,borderTop:`1px solid ${C.s2}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent}40,${C.blue}40)`,border:`1.5px solid ${C.accent}50`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SvgIcon name="user" size={15} color={C.accent}/>
            </div>
            <div>
              <p style={{fontSize:12,fontWeight:600,color:C.white}}>Coach Ramírez</p>
              <p style={{fontSize:10,color:C.gray}}>42 alumnos activos</p>
            </div>
          </div>
        </div>
      </div>


      <div style={{flex:1,overflowY:"auto",background:"#050508",padding:26}}>


        {page==="dashboard" && (
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:3}}>MI DASHBOARD</h1>
            <p style={{color:C.gray,fontSize:13,marginBottom:22}}>Coach Ramírez · 10 Marzo 2026</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
              {[{l:"Mis alumnos",v:"42",ic:"users",col:C.accent},{l:"Sesiones hoy",v:"8",ic:"calendar",col:C.blue},{l:"Mensajes sin leer",v:"5",ic:"chat",col:C.orange}].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.s2}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <p style={{fontSize:10,color:C.gray,fontWeight:600,textTransform:"uppercase",letterSpacing:.8}}>{s.l}</p>
                    <div style={{width:34,height:34,borderRadius:10,background:`${s.col}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <SvgIcon name={s.ic} size={17} color={s.col}/>
                    </div>
                  </div>
                  <p className="bb" style={{fontSize:40,color:C.white,letterSpacing:.5,marginTop:8}}>{s.v}</p>
                </div>
              ))}
            </div>

            <div style={{background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontSize:13,fontWeight:700,color:C.white}}>Alumnos · Resumen de progreso</h3>
                <button onClick={()=>setPage("alumnos")} style={{background:"transparent",border:"none",color:C.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Ver todos →</button>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr><th className="bk-th">Alumno</th><th className="bk-th">Peso</th><th className="bk-th">Grasa</th><th className="bk-th">Sesiones</th><th className="bk-th">Tendencia</th></tr></thead>
                <tbody>
                  {alumnosData.slice(0,4).map(a=>(
                    <tr key={a.name} className="bk-tr">
                      <td className="bk-td" style={{color:C.white,fontWeight:500}}>{a.name}</td>
                      <td className="bk-td"><span className="mono" style={{color:C.accent,fontWeight:700}}>{a.curr_weight}kg</span> <span style={{fontSize:10,color:C.accent}}>↓{a.start_weight-a.curr_weight}kg</span></td>
                      <td className="bk-td"><span className="mono" style={{color:C.orange}}>{a.curr_fat}%</span> <span style={{fontSize:10,color:C.accent}}>↓{a.start_fat-a.curr_fat}%</span></td>
                      <td className="bk-td" style={{color:C.gray}}>{a.sessions} sesiones</td>
                      <td className="bk-td">
                        <div style={{height:4,background:C.s3,borderRadius:2,width:80,overflow:"hidden"}}>
                          <div style={{width:`${Math.min(100,(a.sessions/25)*100)}%`,height:"100%",background:`linear-gradient(90deg,${a.color},${a.color}80)`,borderRadius:2}}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {page==="perfil-coach" && (
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:22}}>MI PERFIL DE COACH</h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:18}}>

              <div>
                <div style={{background:C.s0,borderRadius:14,padding:"20px",border:`1px solid ${C.s2}`,marginBottom:14,textAlign:"center"}}>
                  <div style={{width:90,height:90,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent}30,${C.blue}20)`,border:`3px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 12px"}}>👤</div>
                  <button style={{background:C.s2,border:`1px solid ${C.s3}`,borderRadius:10,padding:"7px 14px",color:C.grayL,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:14}}>📷 Cambiar foto</button>
                  <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:2}}>{coachProfile.name}</p>
                  <p style={{fontSize:12,color:C.gray,marginBottom:10}}>{coachProfile.specialty}</p>
                  <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                    <div style={{textAlign:"center"}}><p className="mono" style={{fontSize:20,color:C.accent,fontWeight:700}}>{coachProfile.rating}</p><p style={{fontSize:9,color:C.gray}}>Rating</p></div>
                    <div style={{textAlign:"center"}}><p className="mono" style={{fontSize:20,color:C.white,fontWeight:700}}>{coachProfile.students}</p><p style={{fontSize:9,color:C.gray}}>Alumnos</p></div>
                    <div style={{textAlign:"center"}}><p className="mono" style={{fontSize:20,color:C.blue,fontWeight:700}}>${coachProfile.price}</p><p style={{fontSize:9,color:C.gray}}>/mes</p></div>
                  </div>
                </div>

                <div style={{background:C.s0,borderRadius:14,padding:"16px 18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <p style={{fontSize:11,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Especialidades</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {coachProfile.tags.map(t=><span key={t} className="tag" style={{background:`${C.accent}18`,color:C.accent}}>{t}</span>)}
                  </div>
                  <button style={{marginTop:10,background:"transparent",border:`1px dashed ${C.s3}`,borderRadius:8,padding:"5px 10px",color:C.gray,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ Agregar</button>
                </div>
              </div>


              <div>
                <div style={{background:C.s0,borderRadius:14,padding:"16px 18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <p style={{fontSize:11,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Bio / Presentación</p>
                  <textarea defaultValue={coachProfile.bio} style={{width:"100%",padding:"12px",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:10,color:C.grayL,fontSize:13,fontFamily:"'DM Sans',sans-serif",height:100,resize:"vertical",lineHeight:1.6}}/>
                  <p style={{fontSize:10,color:C.gray,marginTop:6}}>Visible para potenciales alumnos en el marketplace</p>
                </div>

                <div style={{background:C.s0,borderRadius:14,padding:"16px 18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <p style={{fontSize:11,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Resultados de alumnos</p>
                    <button style={{background:C.accent,color:C.bg,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Agregar</button>
                  </div>
                  {alumnosData.slice(0,3).map((a,i)=>(
                    <div key={a.name} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${C.s2}`:"none"}}>
                      <div style={{width:42,height:42,borderRadius:11,background:`${a.color}15`,border:`1.5px solid ${a.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                        {["💪","🏆","🔥"][i]}
                      </div>
                      <div style={{flex:1}}>
                        <p style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:2}}>{a.name}</p>
                        <p style={{fontSize:11,color:C.gray}}>
                          Peso: <span style={{color:a.color}}>−{a.start_weight-a.curr_weight}kg</span> · Grasa: <span style={{color:a.color}}>−{a.start_fat-a.curr_fat}%</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Guardar perfil</button>
              </div>
            </div>
          </div>
        )}


        {page==="calendario" && (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1}}>CALENDARIO</h1>
                <p style={{color:C.gray,fontSize:13}}>Asigná rutinas a tus alumnos</p>
              </div>
            </div>

            <div style={{display:"flex",gap:12,marginBottom:18}}>
              <div style={{flex:1}}>
                <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:6}}>Alumno</p>
                <select value={calStudent} onChange={e=>setCalStudent(e.target.value)}
                  style={{width:"100%",padding:"10px 14px",background:C.s1,border:`1.5px solid ${C.s2}`,borderRadius:11,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
                  {alumnosData.map(a=><option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:6}}>Mes</p>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick={()=>setCalMonth(m=>Math.max(0,m-1))} style={{width:34,height:38,borderRadius:9,background:C.s1,border:`1px solid ${C.s2}`,color:C.grayL,cursor:"pointer",fontSize:16,fontFamily:"inherit"}}>‹</button>
                  <div style={{padding:"8px 16px",background:C.s1,border:`1px solid ${C.s2}`,borderRadius:9,minWidth:110,textAlign:"center"}}>
                    <p style={{fontSize:13,color:C.white,fontWeight:600}}>{MONTH_NAMES[calMonth]} {calYear}</p>
                  </div>
                  <button onClick={()=>setCalMonth(m=>Math.min(11,m+1))} style={{width:34,height:38,borderRadius:9,background:C.s1,border:`1px solid ${C.s2}`,color:C.grayL,cursor:"pointer",fontSize:16,fontFamily:"inherit"}}>›</button>
                </div>
              </div>
            </div>

            <div style={{background:C.s0,borderRadius:16,border:`1px solid ${C.s2}`,overflow:"hidden",marginBottom:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${C.s2}`}}>
                {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map(d=>(
                  <div key={d} style={{padding:"8px 4px",textAlign:"center",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.5}}>{d}</div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
                {Array.from({length: getFirstDay(calMonth,calYear)}).map((_,i)=>(
                  <div key={`empty-${i}`} style={{padding:"4px",minHeight:64,borderRight:`1px solid ${C.s2}`,borderBottom:`1px solid ${C.s2}`}}/>
                ))}
                {Array.from({length: getDaysInMonth(calMonth,calYear)}).map((_,i)=>{
                  const day = i+1;
                  const key = `${calYear}-${calMonth+1}-${day}`;
                  const assigned = assignments[key];
                  const isToday = day===10 && calMonth===2;
                  const col = assigned==="Descanso"?C.gray:assigned?C.accent:null;
                  return (
                    <div key={day} onClick={()=>setCalPick({day,key})}
                      style={{padding:"6px 5px",minHeight:64,borderRight:`1px solid ${C.s2}`,borderBottom:`1px solid ${C.s2}`,cursor:"pointer",background:isToday?`${C.accent}08`:"transparent",transition:"background .2s",position:"relative"}}>
                      {isToday && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:C.accent}}/>}
                      <p style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?C.accent:C.gray,marginBottom:4}}>{day}</p>
                      {assigned && (
                        <div style={{background:`${col}18`,borderRadius:5,padding:"3px 5px",border:`1px solid ${col}30`}}>
                          <p style={{fontSize:8,color:col,fontWeight:700,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{assigned}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {calPick && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"flex-end",zIndex:999}} onClick={()=>setCalPick(null)}>
                <div className="slide-up" style={{width:"100%",maxWidth:800,margin:"0 auto",background:C.s0,borderRadius:"20px 20px 0 0",padding:"20px 24px 28px",border:`1px solid ${C.s2}`}} onClick={e=>e.stopPropagation()}>
                  <h3 className="bb" style={{fontSize:22,color:C.white,marginBottom:4}}>Asignar rutina · día {calPick.day} de {MONTH_NAMES[calMonth]}</h3>
                  <p style={{color:C.gray,fontSize:13,marginBottom:14}}>Alumno: {calStudent}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {ROUTINE_OPTIONS.map(r => {
                      const isAssigned = assignments[calPick.key]===r;
                      const col = r==="Descanso"?C.gray:C.accent;
                      return (
                        <button key={r} onClick={()=>assignRoutine(calPick.day,r)}
                          style={{padding:"9px 16px",borderRadius:11,border:`1.5px solid ${isAssigned?col:C.s3}`,background:isAssigned?`${col}18`:C.s2,color:isAssigned?col:C.grayL,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                          {isAssigned?"✓ ":""}{r}
                        </button>
                      );
                    })}
                    <button onClick={()=>assignRoutine(calPick.day,null)}
                      style={{padding:"9px 16px",borderRadius:11,border:`1.5px solid ${C.red}40`,background:"transparent",color:C.red,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                      Borrar asignación
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {page==="alumnos" && !alumDetail && (
          <div className="fade-in">


            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:2}}>MIS ALUMNOS</h1>
                <p style={{color:C.gray,fontSize:13}}>{alumnosData.length} alumnos activos</p>
              </div>
            </div>


            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              {[
                {l:"Mayor bajada", v:`−${Math.max(...alumnosData.map(a=>a.start_weight-a.curr_weight))}kg`, sub:alumnosData.reduce((b,a)=>((a.start_weight-a.curr_weight)>(b.start_weight-b.curr_weight)?a:b)).name.split(" ")[0], col:C.accent},
                {l:"Mejor asistencia", v:`${Math.round(Math.max(...alumnosData.map(a=>a.sessions/a.totalSessions))*100)}%`, sub:alumnosData.reduce((b,a)=>((a.sessions/a.totalSessions)>(b.sessions/b.totalSessions)?a:b)).name.split(" ")[0], col:C.blue},
                {l:"Mayor racha", v:`🔥 ${Math.max(...alumnosData.map(a=>a.streak))}d`, sub:alumnosData.reduce((b,a)=>(a.streak>b.streak?a:b)).name.split(" ")[0], col:C.orange},
                {l:"Sin actividad", v:alumnosData.filter(a=>a.lastSeen>5).length, sub:`${alumnosData.filter(a=>a.lastSeen>5).length>0?"Contactar hoy":"Todos activos"}`, col:C.red},
              ].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:9,color:C.gray,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>{s.l}</p>
                  <p className="mono" style={{fontSize:20,color:s.col,fontWeight:700,lineHeight:1,marginBottom:3}}>{s.v}</p>
                  <p style={{fontSize:10,color:C.grayL}}>{s.sub}</p>
                </div>
              ))}
            </div>


            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {FILTERS.map(f=>(
                <button key={f.id} onClick={()=>setAlumFilter(f.id)}
                  style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${alumFilter===f.id?C.accent:C.s3}`,background:alumFilter===f.id?`${C.accent}15`:C.s1,color:alumFilter===f.id?C.accent:C.gray,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",display:"flex",alignItems:"center",gap:5}}>
                  <span>{f.icon}</span> {f.label}
                  {f.id==="inactivos" && alumnosData.filter(a=>a.lastSeen>5).length>0 && (
                    <span style={{background:C.red,color:C.white,borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>{alumnosData.filter(a=>a.lastSeen>5).length}</span>
                  )}
                </button>
              ))}
            </div>


            {alumFilter==="inactivos" && filteredAlumnos.length>0 && (
              <div style={{background:`${C.red}08`,border:`1px solid ${C.red}25`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:18}}>⚠️</span>
                <p style={{fontSize:12,color:C.red,lineHeight:1.5}}>
                  <strong>{filteredAlumnos.length} alumno{filteredAlumnos.length>1?"s":""}</strong> sin actividad hace más de 5 días. Contactalos antes de que pierdan el hábito.
                </p>
              </div>
            )}


            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
              {filteredAlumnos.map((a,rank) => {
                const wLoss = a.start_weight - a.curr_weight;
                const fLoss = a.start_fat   - a.curr_fat;
                const attPct = Math.round((a.sessions/a.totalSessions)*100);
                const isInactive = a.lastSeen > 5;
                return (
                  <div key={a.name}
                    onClick={()=>setAlumDetail(a)}
                    style={{background:C.s0,borderRadius:16,padding:"16px",border:`1.5px solid ${isInactive?C.red+"40":C.s2}`,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"}}>


                    {alumFilter!=="todos" && alumFilter!=="inactivos" && (
                      <div style={{position:"absolute",top:12,right:12,width:22,height:22,borderRadius:"50%",background:rank===0?C.accent:C.s3,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:10,fontWeight:700,color:rank===0?C.bg:C.gray}}>#{rank+1}</span>
                      </div>
                    )}


                    {isInactive && (
                      <div style={{position:"absolute",top:12,right:12,background:`${C.red}18`,border:`1px solid ${C.red}40`,borderRadius:8,padding:"2px 8px"}}>
                        <span style={{fontSize:9,color:C.red,fontWeight:700}}>😴 {a.lastSeen}d sin entrar</span>
                      </div>
                    )}


                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${a.color}35,${a.color}15)`,border:`2px solid ${a.color}60`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span className="bb" style={{fontSize:14,color:a.color,letterSpacing:.5}}>{a.avatar}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontWeight:700,fontSize:13,color:C.white,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name}</p>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <span style={{fontSize:9,color:C.gray,background:C.s2,borderRadius:6,padding:"2px 6px"}}>{a.plan}</span>
                          {a.streak>0 && <span style={{fontSize:9,color:C.orange}}>🔥 {a.streak}d</span>}
                        </div>
                      </div>
                    </div>


                    <div style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:9,color:C.gray,textTransform:"uppercase",letterSpacing:.5}}>Peso</span>
                        <span className="mono" style={{fontSize:9,color:a.color}}>−{wLoss}kg</span>
                      </div>
                      <svg width="100%" height="28" viewBox="0 0 160 28" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`sg-${a.avatar}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={a.color} stopOpacity=".35"/>
                            <stop offset="100%" stopColor={a.color} stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {(()=>{
                          const vals=a.weightHistory;
                          const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
                          const pts=vals.map((v,i)=>`${(i/(vals.length-1))*160},${28-((v-mn)/rng)*22}`).join(" ");
                          const apts=`0,28 ${pts} 160,28`;
                          return <>
                            <polyline points={pts} fill="none" stroke={a.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polygon points={apts} fill={`url(#sg-${a.avatar})`}/>
                          </>;
                        })()}
                      </svg>
                    </div>


                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                      {[
                        {l:"Grasa",  v:`−${fLoss}%`,    col:C.orange},
                        {l:"Asist.", v:`${attPct}%`,    col:C.blue},
                        {l:"Sesion.",v:a.sessions,      col:C.grayL},
                      ].map(m=>(
                        <div key={m.l} style={{background:C.s2,borderRadius:8,padding:"6px",textAlign:"center"}}>
                          <p style={{fontSize:8,color:C.gray,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>{m.l}</p>
                          <p className="mono" style={{fontSize:12,color:m.col,fontWeight:700}}>{m.v}</p>
                        </div>
                      ))}
                    </div>

                    <button style={{width:"100%",background:isInactive?`${C.red}12`:"transparent",border:`1px solid ${isInactive?C.red:C.s3}`,borderRadius:9,padding:"7px",fontSize:11,fontWeight:600,color:isInactive?C.red:C.grayL,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                      {isInactive?"📩 Contactar ahora":"Ver detalle →"}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredAlumnos.length===0 && (
              <div style={{textAlign:"center",padding:"48px 24px",color:C.gray}}>
                <p style={{fontSize:32,marginBottom:10}}>🎉</p>
                <p style={{fontSize:14,fontWeight:600,color:C.grayL,marginBottom:4}}>¡Todos tus alumnos están activos!</p>
                <p style={{fontSize:12}}>Ningún alumno lleva más de 5 días sin usar la app.</p>
              </div>
            )}
          </div>
        )}


        {page==="alumnos" && alumDetail && (
          <div className="fade-in">

            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
              <button onClick={()=>setAlumDetail(null)}
                style={{display:"flex",alignItems:"center",gap:6,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:10,padding:"8px 14px",color:C.grayL,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                ← Volver
              </button>
              <h1 className="bb" style={{fontSize:32,color:C.white,letterSpacing:1,flex:1,lineHeight:1}}>{alumDetail.name.toUpperCase()}</h1>
              <button style={{background:C.accent,color:C.bg,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                💬 Mensaje
              </button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:18}}>


              <div>

                <div style={{background:C.s0,borderRadius:16,padding:"20px",border:`1px solid ${C.s2}`,marginBottom:14,textAlign:"center"}}>
                  <div style={{width:70,height:70,borderRadius:"50%",background:`linear-gradient(135deg,${alumDetail.color}35,${alumDetail.color}15)`,border:`3px solid ${alumDetail.color}60`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                    <span className="bb" style={{fontSize:22,color:alumDetail.color,letterSpacing:1}}>{alumDetail.avatar}</span>
                  </div>
                  <p className="bb" style={{fontSize:20,color:C.white,letterSpacing:.5,marginBottom:2}}>{alumDetail.name}</p>
                  <p style={{fontSize:12,color:C.gray,marginBottom:8}}>{alumDetail.goal}</p>
                  <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
                    <span style={{fontSize:10,color:C.accent,background:`${C.accent}15`,borderRadius:6,padding:"3px 8px",fontWeight:600}}>{alumDetail.plan}</span>
                    {alumDetail.streak>0 && <span style={{fontSize:10,color:C.orange,background:`${C.orange}15`,borderRadius:6,padding:"3px 8px",fontWeight:600}}>🔥 {alumDetail.streak}d racha</span>}
                    {alumDetail.lastSeen>5 && <span style={{fontSize:10,color:C.red,background:`${C.red}15`,borderRadius:6,padding:"3px 8px",fontWeight:600}}>😴 Inactivo {alumDetail.lastSeen}d</span>}
                  </div>
                  <p style={{fontSize:10,color:C.gray}}>Desde {alumDetail.joined} · {alumDetail.totalSessions} sesiones totales</p>
                </div>


                <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Métricas clave</p>
                  {[
                    {l:"Peso inicial",  v:`${alumDetail.start_weight}kg`, col:C.gray},
                    {l:"Peso actual",   v:`${alumDetail.curr_weight}kg`,  col:alumDetail.color},
                    {l:"Bajó",         v:`−${alumDetail.start_weight-alumDetail.curr_weight}kg`, col:C.accent},
                    {l:"Grasa inicial",v:`${alumDetail.start_fat}%`,  col:C.gray},
                    {l:"Grasa actual", v:`${alumDetail.curr_fat}%`,   col:C.orange},
                    {l:"Bajó grasa",   v:`−${alumDetail.start_fat-alumDetail.curr_fat}%`, col:C.accent},
                    {l:"Asistencia",   v:`${Math.round((alumDetail.sessions/alumDetail.totalSessions)*100)}%`, col:C.blue},
                    {l:"Sesiones",     v:`${alumDetail.sessions}/${alumDetail.totalSessions}`, col:C.grayL},
                    {l:"Último acceso",v:alumDetail.lastSeen===0?"Hoy":alumDetail.lastSeen===1?"Ayer":`Hace ${alumDetail.lastSeen}d`, col:alumDetail.lastSeen>5?C.red:C.grayL},
                  ].map(m=>(
                    <div key={m.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.s2}`}}>
                      <span style={{fontSize:11,color:C.gray}}>{m.l}</span>
                      <span className="mono" style={{fontSize:12,color:m.col,fontWeight:700}}>{m.v}</span>
                    </div>
                  ))}
                </div>


                <div style={{background:C.s0,borderRadius:16,padding:"14px",border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Notas del coach</p>
                  <p style={{fontSize:12,color:C.grayL,lineHeight:1.6,marginBottom:10}}>{alumDetail.notes}</p>
                  <textarea placeholder="Agregar nota..." style={{width:"100%",padding:"10px",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:10,color:C.white,fontSize:12,fontFamily:"'DM Sans',sans-serif",height:68,resize:"none"}}/>
                </div>
              </div>


              <div>

                <div style={{background:C.s0,borderRadius:16,padding:"18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.white}}>Evolución de peso</p>
                    <span className="mono" style={{fontSize:13,color:alumDetail.color,fontWeight:700}}>
                      {alumDetail.start_weight}kg → {alumDetail.curr_weight}kg
                    </span>
                  </div>
                  {(()=>{
                    const vals = alumDetail.weightHistory;
                    const W=520, H=120, pad=8;
                    const mn=Math.min(...vals)-1, mx=Math.max(...vals)+1, rng=mx-mn;
                    const px=(i)=>(i/(vals.length-1))*(W-2*pad)+pad;
                    const py=(v)=>H-pad-((v-mn)/rng)*(H-2*pad);
                    const pts=vals.map((v,i)=>`${px(i)},${py(v)}`).join(" ");
                    const area=`${pad},${H} ${pts} ${W-pad},${H}`;
                    return (
                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
                        <defs>
                          <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={alumDetail.color} stopOpacity=".3"/>
                            <stop offset="100%" stopColor={alumDetail.color} stopOpacity="0"/>
                          </linearGradient>
                        </defs>

                        {[mn,Math.round((mn+mx)/2),mx].map(v=>(
                          <g key={v}>
                            <line x1={pad} x2={W-pad} y1={py(v)} y2={py(v)} stroke={C.s3} strokeWidth="1" strokeDasharray="4 4"/>
                            <text x={0} y={py(v)+4} fontSize={9} fill={C.gray}>{v}kg</text>
                          </g>
                        ))}
                        <polygon points={area} fill="url(#wg)"/>
                        <polyline points={pts} fill="none" stroke={alumDetail.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        {vals.map((v,i)=>(
                          <g key={i}>
                            <circle cx={px(i)} cy={py(v)} r="4" fill={alumDetail.color} stroke={C.bg} strokeWidth="2"/>
                            <text x={px(i)} y={py(v)-9} textAnchor="middle" fontSize={9} fill={alumDetail.color} fontWeight="700">{v}kg</text>
                          </g>
                        ))}

                        {alumDetail.months.map((m,i)=>(
                          <text key={i} x={px(i)} y={H+16} textAnchor="middle" fontSize={9} fill={C.gray}>{m}</text>
                        ))}
                      </svg>
                    );
                  })()}
                </div>


                <div style={{background:C.s0,borderRadius:16,padding:"18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.white}}>Grasa corporal</p>
                    <span className="mono" style={{fontSize:13,color:C.orange,fontWeight:700}}>
                      {alumDetail.start_fat}% → {alumDetail.curr_fat}%
                    </span>
                  </div>
                  {(()=>{
                    const vals = alumDetail.fatHistory;
                    const W=520, H=90, pad=8;
                    const mn=Math.min(...vals)-1, mx=Math.max(...vals)+1, rng=mx-mn;
                    const px=(i)=>(i/(vals.length-1))*(W-2*pad)+pad;
                    const py=(v)=>H-pad-((v-mn)/rng)*(H-2*pad);
                    const pts=vals.map((v,i)=>`${px(i)},${py(v)}`).join(" ");
                    const area=`${pad},${H} ${pts} ${W-pad},${H}`;
                    return (
                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
                        <defs>
                          <linearGradient id="fg" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={C.orange} stopOpacity=".25"/>
                            <stop offset="100%" stopColor={C.orange} stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <polygon points={area} fill="url(#fg)"/>
                        <polyline points={pts} fill="none" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        {vals.map((v,i)=>(
                          <circle key={i} cx={px(i)} cy={py(v)} r="3.5" fill={C.orange} stroke={C.bg} strokeWidth="2"/>
                        ))}
                      </svg>
                    );
                  })()}
                </div>


                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>

                  <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <p style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:12,alignSelf:"flex-start"}}>Asistencia</p>
                    {(()=>{
                      const pct=alumDetail.sessions/alumDetail.totalSessions;
                      const r=34,circ=2*Math.PI*r;
                      return (
                        <div style={{position:"relative",width:90,height:90,marginBottom:8}}>
                          <svg width={90} height={90} viewBox="0 0 90 90">
                            <circle cx={45} cy={45} r={r} fill="none" stroke={C.s3} strokeWidth={8}/>
                            <circle cx={45} cy={45} r={r} fill="none" stroke={C.blue} strokeWidth={8}
                              strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
                              strokeLinecap="round" transform="rotate(-90 45 45)"/>
                          </svg>
                          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <span className="mono" style={{fontSize:16,color:C.blue,fontWeight:700}}>{Math.round(pct*100)}%</span>
                          </div>
                        </div>
                      );
                    })()}
                    <p style={{fontSize:11,color:C.gray}}>{alumDetail.sessions} de {alumDetail.totalSessions} sesiones</p>
                  </div>

                  <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`}}>
                    <p style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:10}}>Racha actual</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                      {Array.from({length:14}).map((_,i)=>{
                        const active=i>=(14-alumDetail.streak)&&alumDetail.streak>0;
                        return <div key={i} style={{width:18,height:18,borderRadius:5,background:active?`${alumDetail.color}80`:C.s2,border:`1px solid ${active?alumDetail.color:C.s3}`,transition:"all .3s"}}/>;
                      })}
                    </div>
                    <p className="mono" style={{fontSize:22,color:alumDetail.streak>0?C.orange:C.gray,fontWeight:700}}>
                      {alumDetail.streak>0?`🔥 ${alumDetail.streak} días`:"0 días"}
                    </p>
                    <p style={{fontSize:10,color:C.gray}}>en racha</p>
                  </div>
                </div>


                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:12,padding:"12px",fontSize:13,fontWeight:600,color:C.grayL,cursor:"pointer",fontFamily:"inherit"}}>
                    Rutinas asignadas
                  </button>
                  <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:12,padding:"12px",fontSize:13,fontWeight:600,color:C.grayL,cursor:"pointer",fontFamily:"inherit"}}>
                    Calendario
                  </button>
                  {alumDetail.lastSeen>5 && (
                    <button style={{flex:1,background:`${C.red}15`,border:`1px solid ${C.red}40`,borderRadius:12,padding:"12px",fontSize:13,fontWeight:700,color:C.red,cursor:"pointer",fontFamily:"inherit"}}>
                      Contactar
                    </button>
                  )}
                </div>


                {(()=>{
                  const CI_RESPONSES = [
                    {semana:"Semana del 3-9 Mar",resp:["4 sesiones","Energia muy alta los primeros 3 dias, baje un poco al final","Si, bien. Promedio 7.5h","Quiero agregar mas volumen en hombros"]},
                    {semana:"Semana del 24 Feb - 2 Mar",resp:["3 sesiones","Normal, sin cambios grandes","Una noche mal, el resto bien","Sin novedades"]},
                  ];
                  return (
                    <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <p style={{fontSize:13,fontWeight:700,color:C.white}}>Check-ins semanales</p>
                        <span style={{fontSize:10,background:`${C.accent}18`,color:C.accent,borderRadius:8,padding:"3px 8px",fontWeight:700}}>{CI_RESPONSES.length} respuestas</span>
                      </div>
                      <div style={{display:"flex",gap:6,marginBottom:12}}>
                        {[["respuestas","Ver respuestas"],["plantilla","Editar plantilla"]].map(([id,l])=>(
                          <button key={id} onClick={()=>setCiTab(id)} style={{flex:1,padding:"7px",borderRadius:9,border:"none",background:ciTab===id?C.accent:C.s2,color:ciTab===id?C.bg:C.gray,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{l}</button>
                        ))}
                      </div>
                      {ciTab==="respuestas"&&CI_RESPONSES.map((ci,i)=>(
                        <div key={i} style={{background:C.s1,borderRadius:12,padding:"12px",marginBottom:8,border:`1px solid ${C.s2}`}}>
                          <p style={{fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>{ci.semana}</p>
                          {questions.map((q,j)=>(
                            <div key={j} style={{marginBottom:8,paddingBottom:8,borderBottom:j<questions.length-1?`1px solid ${C.s3}`:"none"}}>
                              <p style={{fontSize:10,color:C.gray,marginBottom:3}}>{q}</p>
                              <p style={{fontSize:12,color:C.white,fontWeight:500}}>{ci.resp[j]}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                      {ciTab==="plantilla"&&(
                        <div>
                          {questions.map((q,i)=>(
                            <div key={i} style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
                              <input value={q} onChange={e=>{const nq=[...questions];nq[i]=e.target.value;setQuestions(nq);}} style={{flex:1,padding:"8px 10px",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:9,color:C.white,fontSize:12,fontFamily:"inherit"}}/>
                              <button onClick={()=>setQuestions(questions.filter((_,idx)=>idx!==i))} style={{width:28,height:28,borderRadius:7,background:`${C.red}15`,border:`1px solid ${C.red}30`,color:C.red,cursor:"pointer",fontSize:14,fontFamily:"inherit",flexShrink:0}}>x</button>
                            </div>
                          ))}
                          <div style={{display:"flex",gap:6,marginTop:6}}>
                            <input value={newQuestion} onChange={e=>setNewQuestion(e.target.value)} placeholder="Nueva pregunta..." style={{flex:1,padding:"8px 10px",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:9,color:C.white,fontSize:12,fontFamily:"inherit"}}/>
                            <button onClick={()=>{if(newQuestion.trim()){setQuestions([...questions,newQuestion.trim()]);setNewQuestion("");}}} style={{padding:"8px 12px",background:C.accent,border:"none",borderRadius:9,color:C.bg,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}


                <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.white}}>Fotos de progreso</p>
                    <span style={{fontSize:10,color:C.gray}}>3 fotos cargadas</span>
                  </div>
                  <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
                    {[{e:"😐",d:"1 Ene",p:"84kg"},{e:"🙂",d:"1 Feb",p:"81.5kg"},{e:"💪",d:"1 Mar",p:"79kg"}].map((f,i)=>(
                      <div key={i} style={{flexShrink:0,background:C.s2,borderRadius:12,width:90,padding:"12px 10px",textAlign:"center",border:`1px solid ${C.s3}`,cursor:"pointer"}}>
                        <p style={{fontSize:30,marginBottom:4}}>{f.e}</p>
                        <p className="mono" style={{fontSize:11,color:C.accent,fontWeight:700}}>{f.p}</p>
                        <p style={{fontSize:10,color:C.gray}}>{f.d}</p>
                      </div>
                    ))}
                  </div>
                </div>


                <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.white}}>Videos de técnica</p>
                    <span style={{fontSize:10,color:C.gray}}>2 videos enviados</span>
                  </div>
                  {[{titulo:"Sentadilla frontal",fecha:"8 Mar",dur:"0:34",nota:"Rodillas adentro, trabajar apertura",thumb:"🏋️"},
                    {titulo:"Press banca 100kg",fecha:"10 Mar",dur:"0:22",nota:"Buena técnica, bajar más el codo",thumb:"💪"}].map(function(v,idx){
                    return (
                      <div key={idx} style={{display:"flex",gap:12,alignItems:"center",background:C.s1,borderRadius:12,padding:"10px 12px",marginBottom:8,border:`1px solid ${C.s2}`}}>
                        <div style={{width:56,height:42,borderRadius:10,background:`${C.accent}20`,border:`1px solid ${C.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,flexDirection:"column",gap:2}}>
                          <span style={{fontSize:20}}>{v.thumb}</span>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:2}}>{v.titulo}</p>
                          <p style={{fontSize:10,color:C.gray,marginBottom:3}}>{v.fecha} · {v.dur}</p>
                          <p style={{fontSize:10,color:C.grayL,fontStyle:"italic"}}>{v.nota}</p>
                        </div>
                        <button onClick={function(){setVideoModal(v);}} style={{background:`${C.accent}18`,border:`1px solid ${C.accent}40`,borderRadius:9,padding:"7px 12px",color:C.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                          ▶ Ver
                        </button>
                      </div>
                    );
                  })}
                </div>



                {/* Análisis corporal con comentarios del coach */}
                <div style={{background:C.s0,borderRadius:16,padding:"18px",border:`1px solid ${C.s2}`,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.white}}>Análisis corporal</p>
                    <div style={{display:"flex",gap:6}}>
                      {[["medidas","Medidas"],["comentarios","Comentarios"]].map(function(tab){
                        return (
                          <button key={tab[0]} onClick={function(){setBodyTab(tab[0]);}} style={{fontSize:10,padding:"4px 10px",borderRadius:8,border:`1px solid ${bodyTab===tab[0]?C.accent:C.s3}`,background:bodyTab===tab[0]?`${C.accent}18`:"transparent",color:bodyTab===tab[0]?C.accent:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                            {tab[1]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {bodyTab === "medidas" && (
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                        {[
                          {l:"Pecho",v:"102 cm",prev:"104 cm",col:C.accent},
                          {l:"Cintura",v:"82 cm",prev:"86 cm",col:"#40FF80"},
                          {l:"Cadera",v:"98 cm",prev:"100 cm",col:C.accent},
                          {l:"Brazo D",v:"38 cm",prev:"36 cm",col:C.orange},
                          {l:"Brazo I",v:"37 cm",prev:"35 cm",col:C.orange},
                          {l:"Muslo D",v:"58 cm",prev:"60 cm",col:C.accent},
                        ].map(function(m){
                          return (
                            <div key={m.l} style={{background:C.s1,borderRadius:10,padding:"10px",border:`1px solid ${C.s2}`}}>
                              <p style={{fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>{m.l}</p>
                              <p className="mono" style={{fontSize:16,color:m.col,fontWeight:700,marginBottom:2}}>{m.v}</p>
                              <p style={{fontSize:9,color:C.gray}}>ant: {m.prev}</p>
                            </div>
                          );
                        })}
                      </div>
                      <p style={{fontSize:10,color:C.gray,textAlign:"right"}}>Última medición: 1 Mar 2026</p>
                    </div>
                  )}
                  {bodyTab === "comentarios" && (
                    <div>
                      <div style={{marginBottom:12}}>
                        {(function(){
                          var key = alumDetail ? alumDetail.n : "default";
                          var comments = bodyComments[key] || [
                            {fecha:"1 Mar",texto:"Buena evolución de cintura, seguir con el déficit calórico moderado.",autor:"Coach"},
                            {fecha:"1 Feb",texto:"Aumento de masa en brazos notable. Subir peso en curl y press.",autor:"Coach"},
                          ];
                          return comments.map(function(c, idx){
                            return (
                              <div key={idx} style={{background:C.s1,borderRadius:11,padding:"10px 14px",marginBottom:8,border:`1px solid ${C.s2}`}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                                  <span style={{fontSize:10,color:C.accent,fontWeight:700}}>{c.autor}</span>
                                  <span style={{fontSize:9,color:C.gray}}>{c.fecha}</span>
                                </div>
                                <p style={{fontSize:12,color:C.white,lineHeight:1.5}}>{c.texto}</p>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                        <textarea value={bodyCommentInput} onChange={function(e){setBodyCommentInput(e.target.value);}} placeholder="Agregar comentario de análisis corporal..."
                          style={{flex:1,padding:"10px 12px",background:C.s2,border:`1.5px solid ${bodyCommentInput?C.accent:C.s3}`,borderRadius:11,color:C.white,fontSize:12,fontFamily:"inherit",resize:"none",height:64}}/>
                        <button onClick={function(){
                          if (!bodyCommentInput.trim()) return;
                          var key = alumDetail ? alumDetail.n : "default";
                          var existing = bodyComments[key] || [{fecha:"1 Mar",texto:"Buena evolución de cintura, seguir con el déficit calórico moderado.",autor:"Coach"},{fecha:"1 Feb",texto:"Aumento de masa en brazos notable. Subir peso en curl y press.",autor:"Coach"}];
                          var newC = {fecha:"Ahora",texto:bodyCommentInput.trim(),autor:"Coach"};
                          var next = {};
                          Object.keys(bodyComments).forEach(function(k){next[k]=bodyComments[k];});
                          next[key] = [newC].concat(existing);
                          setBodyComments(next);
                          setBodyCommentInput("");
                        }} style={{background:bodyCommentInput.trim()?C.accent:C.s2,color:bodyCommentInput.trim()?C.bg:C.gray,border:"none",borderRadius:11,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:bodyCommentInput.trim()?"pointer":"not-allowed",fontFamily:"inherit",height:64,whiteSpace:"nowrap"}}>
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}


        {videoModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setVideoModal(null);}}>
            <div style={{width:"100%",maxWidth:560,background:C.s0,borderRadius:20,padding:0,border:`1px solid ${C.accent}30`,overflow:"hidden"}} onClick={function(e){e.stopPropagation();}}>
              <div style={{background:`${C.accent}12`,borderBottom:`1px solid ${C.s2}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:2}}>{videoModal.titulo}</p>
                  <p style={{fontSize:11,color:C.gray}}>{videoModal.fecha} · {videoModal.dur}</p>
                </div>
                <button onClick={function(){setVideoModal(null);}} style={{background:C.s2,border:"none",borderRadius:9,width:32,height:32,color:C.grayL,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
              <div style={{background:"#000",display:"flex",alignItems:"center",justifyContent:"center",height:280,position:"relative"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                  <div style={{width:70,height:70,borderRadius:"50%",background:`${C.accent}20`,border:`2px solid ${C.accent}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>{videoModal.thumb}</div>
                  <div style={{width:68,height:68,borderRadius:"50%",border:`3px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:`${C.accent}15`}}>
                    <span style={{fontSize:28,color:C.accent,marginLeft:4}}>▶</span>
                  </div>
                  <p style={{fontSize:12,color:C.gray}}>Video del alumno · {videoModal.dur}</p>
                </div>
                <div style={{position:"absolute",bottom:12,right:12,display:"flex",gap:6}}>
                  <span style={{fontSize:10,background:"rgba(0,0,0,.6)",color:C.grayL,borderRadius:6,padding:"3px 8px"}}>{videoModal.dur}</span>
                </div>
              </div>
              <div style={{padding:"16px 20px"}}>
                <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Nota del coach</p>
                <p style={{fontSize:13,color:C.white,lineHeight:1.6,marginBottom:14}}>{videoModal.nota}</p>
                <button onClick={function(){setVideoModal(null);}} style={{width:"100%",background:`${C.accent}18`,border:`1px solid ${C.accent}40`,borderRadius:11,padding:"11px",fontSize:13,color:C.accent,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  Cerrar visor
                </button>
              </div>
            </div>
          </div>
        )}


        {page==="rutinas" && (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1}}>GESTIÓN DE RUTINAS</h1>
              <button style={{background:C.accent,color:C.bg,border:"none",borderRadius:11,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:7}}>
                <SvgIcon name="plus" size={15} color={C.bg} sw={2.5}/> Nueva rutina
              </button>
            </div>
            <div style={{background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr><th className="bk-th">Rutina</th><th className="bk-th">Alumno</th><th className="bk-th">Tipo</th><th className="bk-th">Días</th><th className="bk-th">Acciones</th></tr></thead>
                <tbody>
                  {[{r:"Push/Pull/Legs",a:"Carlos Méndez",t:"Fuerza",d:"L/M/X/J/V"},{r:"Full Body HIIT",a:"Ana García",t:"Funcional",d:"L/X/V"},{r:"Principiante A",a:"Lucía Moreno",t:"General",d:"L/M/J"}].map(r=>(
                    <tr key={r.r} className="bk-tr">
                      <td className="bk-td" style={{color:C.white,fontWeight:600}}>{r.r}</td>
                      <td className="bk-td" style={{color:C.gray}}>{r.a}</td>
                      <td className="bk-td"><span className="tag" style={{background:`${C.accent}18`,color:C.accent,fontSize:10}}>{r.t}</span></td>
                      <td className="bk-td"><span className="mono" style={{color:C.gray,fontSize:11}}>{r.d}</span></td>
                      <td className="bk-td" style={{display:"flex",gap:7}}>
                        <button style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:8,padding:"4px 11px",color:C.white,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Editar</button>
                        <button style={{background:"transparent",border:`1px solid ${C.red}40`,borderRadius:8,padding:"4px 11px",color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {page==="cobros" && (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:2}}>COBROS</h1>
                <p style={{color:C.gray,fontSize:13}}>Facturación y transferencias</p>
              </div>
              <div style={{display:"flex",gap:5}}>
                {PRICING.countries.map(c=>(
                  <button key={c.id} onClick={()=>setCoachCountry(c.id)}
                    style={{width:32,height:32,borderRadius:9,border:`1.5px solid ${coachCountry===c.id?C.accent:C.s3}`,background:coachCountry===c.id?`${C.accent}15`:C.s1,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {c.flag}
                  </button>
                ))}
              </div>
            </div>


            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[["facturas","💰 Facturas y cobros"],["precios","⚙️ Mis precios"]].map(([id,label])=>(
                <button key={id} onClick={()=>setCobrosTab(id)}
                  style={{flex:1,padding:"9px",borderRadius:11,border:`1.5px solid ${cobrosTab===id?C.accent:C.s3}`,background:cobrosTab===id?`${C.accent}12`:C.s1,color:cobrosTab===id?C.accent:C.gray,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  {label}
                </button>
              ))}
            </div>


            {cobrosTab==="precios" && (
              <div>
                <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}18`,borderRadius:14,padding:"12px 16px",marginBottom:18}}>
                  <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:3}}>Pisos definidos por FORZA</p>
                  <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>Podés cobrar por encima del mínimo. Los precios en rango recomendado aparecen con badge "Recomendado" en el marketplace.</p>
                </div>
                {PRICING.countries.map(ctryObj=>(
                  <div key={ctryObj.id} style={{background:C.s0,borderRadius:16,padding:"16px",marginBottom:14,border:`1px solid ${coachCountry===ctryObj.id?C.accent:C.s2}`,cursor:"pointer"}} onClick={()=>setCoachCountry(ctryObj.id)}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                      <span style={{fontSize:20}}>{ctryObj.flag}</span>
                      <p style={{fontSize:14,fontWeight:700,color:C.white}}>{ctryObj.name}</p>
                      <span className="mono" style={{fontSize:11,color:C.gray,marginLeft:"auto"}}>{ctryObj.currency}</span>
                    </div>
                    {PRICING.plans.coach.packages.map(pkg=>{
                      const floor = ctryObj.coachFloor[pkg.id];
                      const range = ctryObj.coachRange[pkg.id];
                      const myPrice = (myPrices[ctryObj.id]||{})[pkg.id] || floor;
                      const err = priceErr[ctryObj.id+pkg.id];
                      const isInRange = myPrice >= floor && myPrice <= floor*2.2;
                      return (
                        <div key={pkg.id} style={{marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                            <label style={{fontSize:11,color:C.grayL,fontWeight:600}}>{pkg.icon} {pkg.label}</label>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              {isInRange && !err && <span style={{fontSize:9,background:`${C.accent}18`,color:C.accent,borderRadius:100,padding:"2px 7px",fontWeight:700}}>✓ RECOM.</span>}
                              <span style={{fontSize:10,color:C.gray}}>Mín: {ctryObj.symbol}{floor.toLocaleString()}</span>
                            </div>
                          </div>
                          <div style={{position:"relative"}}>
                            <input
                              type="number"
                              value={myPrice}
                              onChange={e=>updPrice(ctryObj.id,pkg.id,e.target.value)}
                              style={{width:"100%",padding:"10px 80px 10px 14px",background:C.s1,border:`1.5px solid ${err?C.red:isInRange?C.accent:C.s2}`,borderRadius:11,color:C.white,fontSize:14,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}/>
                            <span className="mono" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:11,color:C.gray}}>
                              {ctryObj.symbol}/mes → neto: {ctryObj.symbol}{Math.round(myPrice*(1-PRICING.commission)).toLocaleString()}
                            </span>
                          </div>
                          {err && <p style={{fontSize:10,color:C.red,marginTop:3}}>{err}</p>}
                          <p style={{fontSize:9,color:C.gray,marginTop:2}}>Rango recomendado: {range}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <button
                  style={{width:"100%",background:Object.values(priceErr).every(v=>!v)?C.accent:C.s2,color:Object.values(priceErr).every(v=>!v)?C.bg:C.gray,border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
                  Guardar precios
                </button>
              </div>
            )}

            {cobrosTab==="facturas" && (<div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              {[
                {l:"Por facturar",   v:`${symC}${totalPendiente.toLocaleString()}`,    col:C.orange},
                {l:"Comisión FORZA", v:`${symC}${comisionPendiente.toLocaleString()}`, col:C.red},
                {l:"Neto a recibir", v:`${symC}${neto.toLocaleString()}`,              col:C.accent},
                {l:"Ya transferido", v:`${symC}${transferidos.reduce((s,p)=>s+p.monto,0).toLocaleString()}`, col:"#40FF80"},
              ].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:9,color:C.gray,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{s.l}</p>
                  <p className="mono" style={{fontSize:18,color:s.col,fontWeight:700}}>{s.v}</p>
                </div>
              ))}
            </div>


            <div style={{background:`${C.blue}08`,border:`1px solid ${C.blue}20`,borderRadius:14,padding:"13px 16px",marginBottom:18,display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20}}>ℹ️</span>
              <div>
                <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:3}}>¿Cómo funciona el cobro?</p>
                <p style={{fontSize:11,color:C.gray,lineHeight:1.6}}>
                  1. El alumno paga en la app → FORZA retiene el monto.<br/>
                  2. Vos emitís la factura/boleta al alumno (en tu sistema).<br/>
                  3. Cargás la factura acá → FORZA valida y transfiere el <strong style={{color:C.white}}>85%</strong> a tu cuenta.<br/>
                  4. FORZA emite su propia factura al alumno por el <strong style={{color:C.red}}>15%</strong> de comisión.
                </p>
              </div>
            </div>


            {pendientes.length > 0 && (
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <p style={{fontSize:10,color:C.orange,fontWeight:700,letterSpacing:.9,textTransform:"uppercase"}}>⚠️ Pendientes de factura ({pendientes.length})</p>
                  <p style={{fontSize:11,color:C.gray}}>Vencen el 15 Mar</p>
                </div>
                {pendientes.map(pago=>(
                  <div key={pago.id} style={{background:C.s0,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${C.orange}30`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:3}}>{pago.alumno}</p>
                        <div style={{display:"flex",gap:8}}>
                          <span style={{fontSize:10,color:C.gray,background:C.s2,borderRadius:6,padding:"2px 7px"}}>Paquete {pago.plan}</span>
                          <span style={{fontSize:10,color:C.gray}}>{pago.fecha}</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p className="mono" style={{fontSize:16,color:C.white,fontWeight:700}}>{symC}{pago.monto.toLocaleString()}</p>
                        <p style={{fontSize:10,color:C.orange}}>−{symC}{Math.round(pago.monto*PRICING.commission).toLocaleString()} comisión</p>
                        <p className="mono" style={{fontSize:13,color:C.accent,fontWeight:700}}>= {symC}{Math.round(pago.monto*(1-PRICING.commission)).toLocaleString()} neto</p>
                      </div>
                    </div>
                    <button onClick={()=>{setSelPago(pago); setInvoiceStep("upload");}}
                      style={{width:"100%",background:`${C.accent}15`,border:`1.5px solid ${C.accent}40`,borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,color:C.accent,cursor:"pointer",fontFamily:"inherit"}}>
                      📄 Cargar factura → liberar transferencia
                    </button>
                  </div>
                ))}
              </div>
            )}


            {facturados.length > 0 && (
              <div style={{marginBottom:18}}>
                <p style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>🕐 Facturado · en revisión FORZA</p>
                {facturados.map(pago=>(
                  <div key={pago.id} style={{background:C.s0,borderRadius:14,padding:"13px 16px",marginBottom:8,border:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:2}}>{pago.alumno}</p>
                      <p style={{fontSize:11,color:C.gray}}>Paquete {pago.plan} · {pago.fecha}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p className="mono" style={{fontSize:14,color:C.blue,fontWeight:700}}>{symC}{Math.round(pago.monto*(1-PRICING.commission)).toLocaleString()}</p>
                      <span style={{fontSize:10,color:C.blue,background:`${C.blue}15`,borderRadius:8,padding:"2px 7px"}}>En revisión</span>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {transferidos.length > 0 && (
              <div style={{marginBottom:18}}>
                <p style={{fontSize:10,color:"#40FF80",fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>✅ Transferidos</p>
                {transferidos.map(pago=>(
                  <div key={pago.id} style={{background:C.s0,borderRadius:14,padding:"13px 16px",marginBottom:8,border:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.7}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:2}}>{pago.alumno}</p>
                      <p style={{fontSize:11,color:C.gray}}>Paquete {pago.plan} · {pago.fecha}</p>
                    </div>
                    <p className="mono" style={{fontSize:14,color:"#40FF80",fontWeight:700}}>{symC}{Math.round(pago.monto*(1-PRICING.commission)).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}


            <div style={{background:C.s0,borderRadius:16,padding:"16px",border:`1px solid ${C.s2}`}}>
              <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:14}}>Datos bancarios para recibir transferencias</p>
              {[
                {l:"Banco",          k:"banco",  ph:"Nombre del banco"},
                {l:"Alias / CBU / IBAN", k:"alias", ph:"tu.alias o número de cuenta"},
                {l:"Tipo de cuenta", k:"tipo",   ph:"Caja de ahorros / Corriente"},
              ].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:5}}>{f.l}</label>
                  <input value={bankData[f.k]||""} onChange={e=>setBankData(p=>({...p,[f.k]:e.target.value}))}
                    placeholder={f.ph}
                    style={{width:"100%",padding:"10px 12px",background:C.s2,border:`1.5px solid ${bankData[f.k]?C.accent:C.s3}`,borderRadius:10,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}/>
                </div>
              ))}
              <button style={{background:C.accent,color:C.bg,border:"none",borderRadius:11,padding:"11px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                Guardar datos bancarios
              </button>
            </div>
            </div>)}


            {invoiceStep==="upload" && selPago && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div style={{background:C.s0,borderRadius:20,padding:"24px",border:`1px solid ${C.s2}`,width:"100%",maxWidth:500}}>
                  <h3 className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:4}}>CARGAR FACTURA</h3>
                  <p style={{fontSize:13,color:C.gray,marginBottom:16}}>{selPago.alumno} · {symC}{selPago.monto.toLocaleString()}</p>
                  <div style={{background:`${C.accent}08`,border:`2px dashed ${C.accent}40`,borderRadius:14,padding:"24px",textAlign:"center",marginBottom:14,cursor:"pointer"}}
                    onClick={()=>setInvoiceFile("factura_simulada.pdf")}>
                    {invoiceFile ? (<><p style={{fontSize:13,color:C.accent,fontWeight:700}}>{invoiceFile}</p><p style={{fontSize:11,color:C.gray}}>Archivo cargado</p></>) : (<><p style={{fontSize:24,marginBottom:4}}>⬆️</p><p style={{fontSize:13,color:C.accent,fontWeight:600}}>Clic para subir PDF</p></>)}
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:9,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Número de factura</label>
                    <input value={invoiceNum} onChange={e=>setInvoiceNum(e.target.value)} placeholder="Ej: 0001-00000123"
                      style={{width:"100%",padding:"10px 12px",background:C.s2,border:`1.5px solid ${invoiceNum?C.accent:C.s3}`,borderRadius:10,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
                  </div>
                  <div style={{background:`${C.blue}08`,borderRadius:12,padding:"10px 14px",marginBottom:14}}>
                    <p style={{fontSize:11,color:C.gray,lineHeight:1.5}}>
                      Neto a recibir: <strong className="mono" style={{color:C.accent}}>{symC}{Math.round(selPago.monto*(1-PRICING.commission)).toLocaleString()}</strong>
                      {" "}(85% del total · FORZA retiene {symC}{Math.round(selPago.monto*PRICING.commission).toLocaleString()} de comisión)
                    </p>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>{setInvoiceStep("done"); setTimeout(()=>{setInvoiceStep("list");setInvoiceFile(null);setInvoiceNum("");setSelPago(null);},2500);}}
                      disabled={!invoiceFile||!invoiceNum.trim()}
                      style={{flex:1,background:invoiceFile&&invoiceNum.trim()?C.accent:C.s2,color:invoiceFile&&invoiceNum.trim()?C.bg:C.gray,border:"none",borderRadius:11,padding:"12px",fontSize:13,fontWeight:700,cursor:invoiceFile&&invoiceNum.trim()?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .3s"}}>
                      Enviar y solicitar transferencia
                    </button>
                    <button onClick={()=>{setInvoiceStep("list");setInvoiceFile(null);setInvoiceNum("");setSelPago(null);}}
                      style={{background:"transparent",border:`1px solid ${C.s3}`,borderRadius:11,padding:"12px 16px",color:C.grayL,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                      Cancelar
                    </button>
                  </div>
                  {invoiceStep==="done" && (
                    <div style={{marginTop:14,background:`${C.accent}12`,borderRadius:12,padding:"12px",textAlign:"center"}}>
                      <p style={{fontSize:14,color:C.accent,fontWeight:700}}>✅ Factura enviada — FORZA la revisará en 24h</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {page==="grupos" && (
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:4}}>GRUPOS</h1>
            <p style={{color:C.gray,fontSize:13,marginBottom:18}}>Administra los grupos y publicaciones de tus alumnos</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              {[{l:"Grupos activos",v:"2",col:C.accent},{l:"Miembros totales",v:"42",col:C.blue},{l:"Posts esta semana",v:"8",col:C.orange}].map(s=>(
                <div key={s.l} style={{background:C.s0,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.s2}`,textAlign:"center"}}>
                  <p className="mono" style={{fontSize:22,color:s.col,fontWeight:700}}>{s.v}</p>
                  <p style={{fontSize:10,color:C.gray,marginTop:3,textTransform:"uppercase",letterSpacing:.7}}>{s.l}</p>
                </div>
              ))}
            </div>

            {[
              {nombre:"FORZA Team",descripcion:"Grupo principal. Todos los alumnos del mes.",miembros:24,posts:5,color:C.accent},
              {nombre:"HIIT Advanced",descripcion:"Alumnos con paquete Pro o Elite solamente.",miembros:18,posts:3,color:C.blue},
            ].map((g,i)=>(
              <div key={i} style={{background:C.s0,borderRadius:16,padding:"18px 20px",marginBottom:14,border:`1px solid ${C.s2}`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${g.color}20`,border:`1.5px solid ${g.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>G</div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:2}}>{g.nombre}</p>
                    <p style={{fontSize:12,color:C.gray}}>{g.descripcion}</p>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.blue,background:`${C.blue}15`,borderRadius:8,padding:"3px 8px"}}>{g.miembros} miembros</span>
                    <span style={{fontSize:11,color:C.orange,background:`${C.orange}15`,borderRadius:8,padding:"3px 8px"}}>{g.posts} posts</span>
                  </div>
                </div>

                <div style={{background:C.s1,borderRadius:12,padding:"12px 14px",marginBottom:12,border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:10,color:C.gray,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Ultima actividad</p>
                  <p style={{fontSize:12,color:C.grayL,lineHeight:1.5}}>Carlos Mendez: "Rompi mi PR en press banca: 100kg x 3..." <span style={{color:C.gray}}>hace 2h</span></p>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,background:`${g.color}15`,border:`1px solid ${g.color}30`,borderRadius:10,padding:"9px",fontSize:12,fontWeight:700,color:g.color,cursor:"pointer",fontFamily:"inherit"}}>Ver grupo</button>
                  <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:10,padding:"9px",fontSize:12,color:C.grayL,cursor:"pointer",fontFamily:"inherit"}}>Publicar</button>
                  <button style={{flex:1,background:C.s1,border:`1px solid ${C.s2}`,borderRadius:10,padding:"9px",fontSize:12,color:C.grayL,cursor:"pointer",fontFamily:"inherit"}}>Challenge</button>
                </div>
              </div>
            ))}
            <button style={{width:"100%",background:"transparent",border:`1.5px dashed ${C.s3}`,borderRadius:14,padding:"14px",fontSize:13,fontWeight:600,color:C.gray,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:18}}>+</span> Crear nuevo grupo
            </button>
          </div>
        )}

        {page==="chat" && (
          <div className="fade-in">
            <h1 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,marginBottom:22}}>MENSAJES</h1>
            <div style={{display:"flex",gap:14,height:380}}>
              <div style={{width:240,background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,overflow:"hidden",flexShrink:0}}>
                {["Carlos Méndez","Ana García","Roberto Silva"].map((n,i)=>(
                  <div key={n} style={{padding:"13px 14px",borderBottom:`1px solid ${C.s2}`,cursor:"pointer",background:i===0?C.s2:"transparent",display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:C.s3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                      <SvgIcon name="user" size={15} color={C.gray}/>
                      {i===0&&<div style={{position:"absolute",bottom:0,right:0,width:9,height:9,background:"#40FF80",borderRadius:"50%",border:`2px solid ${C.s0}`}}/>}
                    </div>
                    <div style={{flex:1,overflow:"hidden"}}>
                      <p style={{fontSize:12,fontWeight:600,color:C.white}}>{n}</p>
                      <p style={{fontSize:10,color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{["¿Cuánto peso hoy?","Gracias coach!","No pude ir ayer"][i]}</p>
                    </div>
                    {i===0&&<div style={{width:17,height:17,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:C.bg,fontWeight:700}}>2</span></div>}
                  </div>
                ))}
              </div>
              <div style={{flex:1,background:C.s0,borderRadius:14,border:`1px solid ${C.s2}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.s2}`}}><p style={{fontWeight:600,color:C.white,fontSize:14}}>Carlos Méndez</p></div>
                <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
                  {[{f:"user",t:"Coach, ¿cuánto peso debería usar hoy en press banca?"},{f:"me",t:"Sube a 85kg. La semana pasada las 5 reps estuvieron muy limpias."},{f:"user",t:"Dale, lo intento. ¿Y el volumen?"}].map((m,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:m.f==="me"?"flex-end":"flex-start",marginBottom:8}}>
                      <div style={{maxWidth:"70%",padding:"10px 13px",borderRadius:13,background:m.f==="me"?C.accent:C.s3,color:m.f==="me"?C.bg:C.white,fontSize:13}}>{m.t}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"10px 14px",borderTop:`1px solid ${C.s2}`,display:"flex",gap:8}}>
                  <input placeholder="Escribe..." style={{flex:1,padding:"9px 13px",background:C.s3,border:`1px solid ${C.s2}`,borderRadius:10,color:C.white,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
                  <button style={{width:36,height:36,borderRadius:10,background:C.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <SvgIcon name="send" size={15} color={C.bg}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StyleGuide = () => (
  <div style={{padding:"28px 32px",maxWidth:960,margin:"0 auto",overflowY:"auto",height:"100%",color:C.white}}>
    <h1 className="bb" style={{fontSize:48,letterSpacing:2,marginBottom:3,color:C.white}}>GUÍA DE ESTILO</h1>
    <p style={{color:C.gray,fontSize:16,marginBottom:40}}>FORZA — Brand Identity System</p>

    <section style={{marginBottom:40}}>
      <h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:1,marginBottom:18}}>PALETA DE COLORES</h2>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {[{n:"Accent / CTA",h:C.accent,d:"Acción principal, métricas, energía"},{n:"Background",h:C.bg,d:"Fondo principal app"},{n:"Surface 0",h:C.s0,d:"Headers, sidebar"},{n:"Surface 1",h:C.s1,d:"Cards, inputs"},{n:"Surface 2",h:C.s2,d:"Bordes, separadores"},{n:"Gray",h:C.gray,d:"Textos secundarios"},{n:"Blue Accent",h:C.blue,d:"Músculo pills, info"},{n:"Orange",h:C.orange,d:"Alertas, advertencias"}].map(c=>(
          <div key={c.n} style={{width:150}}>
            <div style={{width:"100%",height:72,borderRadius:13,background:c.h,marginBottom:8,border:`1px solid ${C.s3}`}}/>
            <p style={{fontWeight:600,fontSize:12,color:C.white,marginBottom:2}}>{c.n}</p>
            <p className="mono" style={{fontSize:10,color:C.accent}}>{c.h}</p>
            <p style={{fontSize:10,color:C.gray,marginTop:2}}>{c.d}</p>
          </div>
        ))}
      </div>
    </section>

    <section style={{marginBottom:40}}>
      <h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:1,marginBottom:18}}>TIPOGRAFÍA</h2>
      <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
        <div><p style={{fontSize:10,color:C.gray,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Display · Títulos</p><p className="bb" style={{fontSize:48,color:C.white,letterSpacing:2}}>BEBAS NEUE</p><p style={{color:C.gray,fontSize:12,marginTop:3}}>Títulos, métricas grandes, CTA buttons</p></div>
        <div><p style={{fontSize:10,color:C.gray,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Body · UI</p><p style={{fontSize:36,color:C.white,fontWeight:700}}>DM Sans</p><p style={{color:C.gray,fontSize:12,marginTop:3}}>Párrafos, labels, buttons, navegación</p></div>
        <div><p style={{fontSize:10,color:C.gray,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Datos · Números</p><p className="mono" style={{fontSize:36,color:C.accent}}>Space Mono</p><p style={{color:C.gray,fontSize:12,marginTop:3}}>Métricas, tiempos, precios, pesos</p></div>
      </div>
    </section>

    <section style={{marginBottom:40}}>
      <h2 className="bb" style={{fontSize:26,color:C.white,letterSpacing:1,marginBottom:18}}>TIPS MOTIVACIONALES</h2>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {WORKOUT_TIPS.slice(0,4).map(t=>(
          <div key={t.title} style={{width:300}}><TipCard tip={t}/></div>
        ))}
      </div>
    </section>
  </div>
);

const Phone = ({ children, nav, sheets }) => (
  <div style={{width:390,height:844,background:C.bg,borderRadius:52,overflow:"hidden",position:"relative",flexShrink:0,boxShadow:`0 0 0 2px #252535,0 0 0 4px #1a1a28,0 50px 120px rgba(0,0,0,.9),0 0 80px rgba(200,255,0,.05)`}}>

    <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:126,height:36,background:C.bg,borderRadius:"0 0 22px 22px",zIndex:100,pointerEvents:"none"}}/>

    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",paddingTop:36}}>
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",minHeight:0}}>
        {children}
      </div>
      {nav}
    </div>

    {sheets}
  </div>
);

const WEEK_PLAN = [
  { day:"Lunes",    short:"L", tipo:"fuerza",   nombre:"Push Day A",   musculos:"Pecho · Hombros · Tríceps",   exercises: INIT_EXERCISES, rest:false },
  { day:"Martes",   short:"M", tipo:"espalda",  nombre:"Pull Day",     musculos:"Espalda · Bíceps · Femorales", exercises: INIT_EXERCISES.slice(2,5), rest:false },
  { day:"Miércoles",short:"X", tipo:"descanso", nombre:"Descanso",     musculos:"Recuperación activa",          exercises:[], rest:true  },
  { day:"Jueves",   short:"J", tipo:"piernas",  nombre:"Leg Day",      musculos:"Cuádriceps · Glúteos · Femorales", exercises: INIT_EXERCISES.slice(1,3), rest:false },
  { day:"Viernes",  short:"V", tipo:"fuerza",   nombre:"Push Day B",   musculos:"Hombros · Pecho · Tríceps",   exercises: INIT_EXERCISES.slice(0,3), rest:false },
  { day:"Sábado",   short:"S", tipo:"cardio",   nombre:"Cardio LISS",  musculos:"Cardiovascular · Resistencia", exercises:[], rest:false },
  { day:"Domingo",  short:"D", tipo:"descanso", nombre:"Descanso",     musculos:"Recuperación completa",        exercises:[], rest:true  },
];

const EXERCISE_LIBRARY = [
  { id:"l1",  name:"Press Banca",         muscle:"Pecho",      svgId:"bench",      defaultSets:3, defaultReps:10, defaultWeight:80 },
  { id:"l2",  name:"Press Inclinado",     muscle:"Pecho",      svgId:"bench",      defaultSets:3, defaultReps:10, defaultWeight:70 },
  { id:"l3",  name:"Aperturas",           muscle:"Pecho",      svgId:"bench",      defaultSets:3, defaultReps:12, defaultWeight:20 },
  { id:"l4",  name:"Press Militar",       muscle:"Hombros",    svgId:"facePull",   defaultSets:4, defaultReps:10, defaultWeight:50 },
  { id:"l5",  name:"Elevaciones Lat.",    muscle:"Hombros",    svgId:"facePull",   defaultSets:3, defaultReps:15, defaultWeight:10 },
  { id:"l6",  name:"Face Pull",           muscle:"Hombros",    svgId:"facePull",   defaultSets:3, defaultReps:12, defaultWeight:25 },
  { id:"l7",  name:"Dominadas",           muscle:"Espalda",    svgId:"hammerCurl", defaultSets:4, defaultReps:8,  defaultWeight:0  },
  { id:"l8",  name:"Remo con Barra",      muscle:"Espalda",    svgId:"bench",      defaultSets:4, defaultReps:10, defaultWeight:80 },
  { id:"l9",  name:"Jalón al Pecho",      muscle:"Espalda",    svgId:"facePull",   defaultSets:3, defaultReps:12, defaultWeight:60 },
  { id:"l10", name:"Sentadilla",          muscle:"Piernas",    svgId:"legExt",     defaultSets:4, defaultReps:8,  defaultWeight:100},
  { id:"l11", name:"Prensa",              muscle:"Piernas",    svgId:"legExt",     defaultSets:4, defaultReps:10, defaultWeight:140},
  { id:"l12", name:"Sillón Cuádriceps",   muscle:"Piernas",    svgId:"legExt",     defaultSets:3, defaultReps:12, defaultWeight:60 },
  { id:"l13", name:"Sillón Femoral",      muscle:"Piernas",    svgId:"legExt",     defaultSets:3, defaultReps:12, defaultWeight:50 },
  { id:"l14", name:"Sillón Aductor",      muscle:"Aductores",  svgId:"adductor",   defaultSets:3, defaultReps:12, defaultWeight:45 },
  { id:"l15", name:"Bíceps Martillo",     muscle:"Bíceps",     svgId:"hammerCurl", defaultSets:3, defaultReps:12, defaultWeight:16 },
  { id:"l16", name:"Curl con Barra",      muscle:"Bíceps",     svgId:"hammerCurl", defaultSets:3, defaultReps:10, defaultWeight:30 },
  { id:"l17", name:"Extensión Tríceps",   muscle:"Tríceps",    svgId:"facePull",   defaultSets:3, defaultReps:12, defaultWeight:25 },
  { id:"l18", name:"Fondos",              muscle:"Tríceps",    svgId:"bench",      defaultSets:3, defaultReps:10, defaultWeight:0  },
];

const MUSCLE_GROUPS = [...new Set(EXERCISE_LIBRARY.map(e=>e.muscle))];

function PlanSemanalScreen({ navigate }) {
  const todayIdx = 1;
  const [selected, setSelected] = useState(null);
  if (selected !== null) {
    const day = WEEK_PLAN[selected];
    if (day.rest || day.exercises.length === 0) return (
      <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{ padding:"18px 20px 14px", background:C.s0, borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
          <button onClick={()=>setSelected(null)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Volver</button>
          <h2 className="bb" style={{fontSize:30,color:C.white,letterSpacing:.5}}>{day.day}</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32,textAlign:"center"}}>
          <span style={{fontSize:64}}>{day.tipo==="descanso"?"😴":"🏃"}</span>
          <h3 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1}}>{day.nombre}</h3>
          <p style={{color:C.gray,fontSize:14,lineHeight:1.6}}>{day.musculos}</p>
          {day.tipo==="descanso" && (
            <div style={{ background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:16, padding:"14px 20px", marginTop:8 }}>
              <p style={{fontSize:13,color:C.grayL,lineHeight:1.6}}>💡 El descanso es donde el músculo crece. Aprovechá para estirar y dormir bien.</p>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{ padding:"18px 20px 14px", background:C.s0, borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
          <button onClick={()=>setSelected(null)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Volver</button>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <span style={{fontSize:11,color:TIPO_COLORS[day.tipo]||C.accent,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{day.day}</span>
              <h2 className="bb" style={{fontSize:30,color:C.white,letterSpacing:.5,lineHeight:1}}>{day.nombre}</h2>
              <p style={{color:C.gray,fontSize:12,marginTop:2}}>{day.musculos}</p>
            </div>
            {selected===todayIdx && <Pill color={C.accent}>HOY</Pill>}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          {day.exercises.map((ex, i) => (
            <div key={ex.id} style={{ display:"flex", gap:12, alignItems:"center", background:C.s1, borderRadius:16, padding:"12px 14px", marginBottom:10, border:`1px solid ${C.s2}` }}>
              <div style={{width:54,height:54,background:C.s2,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <ExSVG id={ex.svgId} size={44}/>
              </div>
              <div style={{flex:1}}>
                <p style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:3}}>{ex.name}</p>
                <Pill color={C.blue}>{ex.muscle}</Pill>
                <div style={{display:"flex",gap:14,marginTop:7}}>
                  {[["Series",ex.sets],["Reps",ex.reps],["Peso",`${ex.weight}kg`]].map(([l,v])=>(
                    <div key={l}>
                      <span className="mono" style={{fontSize:14,color:C.accent,fontWeight:700}}>{v}</span>
                      <span style={{fontSize:9,color:C.gray,marginLeft:3}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.s2}`, flexShrink:0 }}>
          {selected===todayIdx ? (
            <button onClick={()=>navigate("rutinas")} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},#90FF40)`, color:C.bg, border:"none", borderRadius:15, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5 }}>
              ▶ INICIAR HOY
            </button>
          ) : (
            <button style={{ width:"100%", background:C.s2, color:C.grayL, border:`1.5px solid ${C.s2}`, borderRadius:15, padding:"16px", fontSize:14, fontWeight:600, cursor:"default", fontFamily:"inherit" }}>
              No es hoy · {day.day}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{ padding:"18px 20px 16px", background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`, flexShrink:0 }}>
        <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
        <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>PLAN SEMANAL</h2>
        <p style={{color:C.gray,fontSize:13,marginTop:3}}>5 entrenamientos · 2 descansos</p>

        <div style={{display:"flex",gap:6,marginTop:14}}>
          {WEEK_PLAN.map((d,i)=>(
            <div key={d.short} onClick={()=>setSelected(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
              <div style={{ width:36, height:36, borderRadius:12, background: i===todayIdx ? C.accent : d.rest ? C.s2 : `${TIPO_COLORS[d.tipo]}22`, border:`2px solid ${i===todayIdx?C.accent:d.rest?C.s3:TIPO_COLORS[d.tipo]+"55"}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
                <span style={{fontSize:i===todayIdx?11:10,fontWeight:700,color:i===todayIdx?C.bg :d.rest?C.gray :TIPO_COLORS[d.tipo]}}>{d.short}</span>
              </div>
              {i===todayIdx && <div style={{width:5,height:5,borderRadius:"50%",background:C.accent}}/>}
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"10px 20px 16px"}}>
        {WEEK_PLAN.map((day, i) => (
          <div key={day.day} onClick={()=>setSelected(i)}
            style={{ display:"flex", gap:14, alignItems:"center", background: i===todayIdx ? `linear-gradient(135deg,${C.s1},${C.s0})` : C.s1, borderRadius:18, padding:"14px 16px", marginBottom:10, border:`1.5px solid ${i===todayIdx ? C.accent+"40" : C.s2}`, cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden" }}>
            {i===todayIdx && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.accent},transparent)` }}/>}

            <div style={{ width:44, height:44, borderRadius:14, background: day.rest ? C.s2 : `${TIPO_COLORS[day.tipo]}18`, border:`1.5px solid ${day.rest?C.s3:TIPO_COLORS[day.tipo]+"50"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{fontSize:12,fontWeight:800,color:day.rest?C.gray:TIPO_COLORS[day.tipo]}}>{day.short}</span>
              <span style={{fontSize:8,color:C.gray,fontWeight:600}}>{["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"][i]}</span>
            </div>

            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <p style={{fontWeight:700,fontSize:15,color:day.rest?C.gray:C.white}}>{day.nombre}</p>
                {i===todayIdx && <Pill color={C.accent}>HOY</Pill>}
              </div>
              <p style={{fontSize:12,color:C.gray,marginTop:2}}>{day.musculos}</p>
              {!day.rest && day.exercises.length > 0 && (
                <div style={{display:"flex",gap:10,marginTop:7}}>
                  <span className="mono" style={{fontSize:11,color:TIPO_COLORS[day.tipo]||C.accent}}>{day.exercises.length} ejercicios</span>
                  <span style={{fontSize:11,color:C.gray}}>·</span>
                  <span style={{fontSize:11,color:C.gray}}>{day.exercises.reduce((s,e)=>s+e.sets,0)} sets</span>
                </div>
              )}
            </div>
            <SvgIcon name="arrow" size={16} color={C.gray}/>
          </div>
        ))}


        <div style={{ marginTop:4, background:`${C.blue}08`, border:`1px solid ${C.blue}25`, borderRadius:16, padding:"14px 16px" }}>
          <p style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:4}}>🏋 Sin coach asignado a un día?</p>
          <p style={{fontSize:12,color:C.grayL,marginBottom:10,lineHeight:1.5}}>Podés crear tus propios entrenamientos y asignarlos a cualquier día.</p>
          <button onClick={()=>navigate("crear")} style={{background:C.blue,color:C.white,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            + Crear entrenamiento
          </button>
        </div>
      </div>
    </div>
  );
};

function CrearRutinaScreen(props) {
  const navigate = props.navigate;
  const userPlan = props.userPlan || "free";
  const FREE_ROUTINE_LIMIT = 3;
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [step, setStep] = useState("config");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("fuerza");
  const [dia, setDia] = useState("Lunes");
  const [selected, setSelected] = useState([]);
  const [filterGroup, setFilterGroup] = useState("Todos");
  const [editExId, setEditExId] = useState(null);
  const [exConfig, setExConfig] = useState({});
  const [groupMode, setGroupMode] = useState(false);
  const [groupSel, setGroupSel] = useState([]);
  const [saved, setSaved] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanPreview, setScanPreview] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [weightUnit, setWeightUnit] = useState("kg");
  if (userPlan === "free") {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px 14px",background:`linear-gradient(180deg,${C.s0} 0%,${C.bg} 100%)`,flexShrink:0}}>
          <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Inicio</button>
          <h2 className="bb" style={{fontSize:36,color:C.white,letterSpacing:1,lineHeight:1}}>CREAR RUTINA</h2>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{width:72,height:72,borderRadius:22,background:`${C.accent}12`,border:`2px solid ${C.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:20}}>🔒</div>
          <p className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5,marginBottom:8,textAlign:"center"}}>LÍMITE ALCANZADO</p>
          <p style={{fontSize:13,color:C.gray,textAlign:"center",lineHeight:1.7,marginBottom:24}}>El plan Gratis incluye <strong style={{color:C.white}}>3 rutinas predefinidas</strong>. Para crear rutinas personalizadas e ilimitadas, actualizá a PRO.</p>
          <div style={{width:"100%",marginBottom:16}}>
            {["Rutinas ilimitadas y personalizadas","Cualquier ejercicio combinado","Biseries y supersets","Guardar como plantilla"].map(f=>(
              <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,background:C.s1,borderRadius:12,padding:"10px 14px"}}>
                <span style={{color:C.accent,fontWeight:700}}>✓</span>
                <span style={{fontSize:13,color:C.grayL}}>{f}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>navigate("mi-plan")}
            style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#64FF80)`,color:C.bg,border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
            Activar PRO · Ver planes
          </button>
          <button onClick={()=>navigate("rutinas")}
            style={{width:"100%",background:"transparent",border:`1px solid ${C.s3}`,borderRadius:13,padding:"12px",fontSize:13,color:C.gray,cursor:"pointer",fontFamily:"inherit"}}>
            Ver mis 3 rutinas disponibles
          </button>
        </div>
      </div>
    );
  }

  const toggleWeightUnit = () => setWeightUnit(u => u === "kg" ? "lb" : "kg");

  const LETTERS = ["A","B","C","D","E"];
  const usedGroups = [...new Set(Object.values(exConfig).map(e=>e.supersetGroup).filter(Boolean))];
  const nextLetter = LETTERS.find(l=>!usedGroups.includes(l)) || "X";

  const selectedExercises = selected.map(id => {
    const lib = EXERCISE_LIBRARY.find(e=>e.id===id);
    const cfg = exConfig[id] || { sets:lib.defaultSets, reps:lib.defaultReps, weight:lib.defaultWeight, restSecs:180, supersetGroup:null };
    return { ...lib, ...cfg, id };
  });

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
    if (!exConfig[id]) {
      const lib = EXERCISE_LIBRARY.find(e=>e.id===id);
      setExConfig(prev=>({...prev, [id]:{ sets:lib.defaultSets, reps:lib.defaultReps, weight:lib.defaultWeight, restSecs:180, supersetGroup:null }}));
    }
  };

  const updCfg = (id, field, val) => setExConfig(prev=>({...prev,[id]:{...prev[id],[field]:val}}));

  const createSuperset = () => {
    if (groupSel.length < 2) return;
    groupSel.forEach(id => updCfg(id, "supersetGroup", nextLetter));
    setGroupSel([]); setGroupMode(false);
  };
  const removeSuperset = (id) => updCfg(id, "supersetGroup", null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(()=>{ setSaved(false); navigate("plan"); }, 2000);
  };

  const handlePhotoScan = (file) => {
    if (!file) return;
    setScanLoading(true);
    setScanError(null);
    setScanResult(null);
    const reader = new FileReader();
    reader.onload = function(ev) {
      const b64 = ev.target.result.split(",")[1];
      setScanPreview(ev.target.result);
      const exNames = EXERCISE_LIBRARY.map(e => e.name).join(", ");
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: file.type || "image/jpeg", data: b64 }},
              { type: "text", text: "Analizá esta ficha de entrenamiento. Extraé los ejercicios y su configuración. Devolvé SOLO un JSON válido con este formato exacto, sin texto adicional ni markdown:\n{\"nombre\":\"nombre del entrenamiento o serie\",\"ejercicios\":[{\"nombre\":\"nombre ejercicio\",\"series\":3,\"reps\":10,\"peso\":0}]}\n\nLista de ejercicios disponibles en la app (preferí estos si coinciden): " + exNames + "\n\nSi no hay peso indicado usá 0. Si no hay series usá 3. Si no hay reps usá 10." }
            ]
          }]
        })
      })
      .then(r => r.json())
      .then(data => {
        const text = data.content && data.content[0] && data.content[0].text;
        if (!text) throw new Error("Sin respuesta");
        const clean = text.replace(/```json/g,"").replace(/```/g,"").trim();
        const parsed = JSON.parse(clean);
        setScanResult(parsed);
        setScanLoading(false);
      })
      .catch(err => {
        setScanError("No se pudo leer la ficha. Intentá con una foto más clara.");
        setScanLoading(false);
      });
    };
    reader.readAsDataURL(file);
  };

  const applyScanResult = () => {
    if (!scanResult) return;
    if (scanResult.nombre) setNombre(scanResult.nombre);
    const newSelected = [];
    const newCfg = {};
    (scanResult.ejercicios || []).forEach(scanned => {
      const nameLow = scanned.nombre.toLowerCase();
      const match = EXERCISE_LIBRARY.find(e =>
        e.name.toLowerCase().includes(nameLow) ||
        nameLow.includes(e.name.toLowerCase().split(" ")[0])
      );
      if (match) {
        newSelected.push(match.id);
        newCfg[match.id] = {
          sets: scanned.series || match.defaultSets,
          reps: scanned.reps || match.defaultReps,
          weight: scanned.peso || match.defaultWeight,
          restSecs: 180,
          supersetGroup: null
        };
      }
    });
    setSelected(newSelected);
    setExConfig(newCfg);
    setScanModal(false);
    setScanPreview(null);
    setScanResult(null);
    if (newSelected.length > 0) setStep("ejercicios");
  };

  const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const TIPOS = [
    {id:"fuerza",label:"💪 Fuerza",color:C.accent},
    {id:"espalda",label:"🏋 Espalda",color:C.blue},
    {id:"piernas",label:"🦵 Piernas",color:C.orange},
    {id:"cardio",label:"🏃 Cardio",color:C.red},
    {id:"fullbody",label:"⚡ Full Body",color:"#A78BFA"},
  ];

  const filteredLib = filterGroup==="Todos" ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter(e=>e.muscle===filterGroup);
  if (editExId) {
    const ex = selectedExercises.find(e=>e.id===editExId);
    const cfg = exConfig[editExId] || {};
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{ padding:"14px 20px", background:C.s0, borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
          <button onClick={()=>setEditExId(null)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Volver</button>
          <h2 className="bb" style={{fontSize:26,color:C.white}}>{ex.name}</h2>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{background:C.s1,borderRadius:18,padding:18,marginBottom:16,display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:80,height:80,background:C.s2,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}><ExSVG id={ex.svgId} size={66}/></div>
            <div><Pill color={C.blue}>{ex.muscle}</Pill><p style={{color:C.grayL,fontSize:13,marginTop:8,lineHeight:1.6}}>Ajustá las variables de carga. +2.5kg cuando domines todas las series.</p></div>
          </div>
          <div style={{background:C.s1,borderRadius:18,padding:20,marginBottom:14}}>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:18}}>Variables de carga</p>
            <div style={{display:"flex",justifyContent:"space-around"}}>
              <NumInput label="Series"  value={cfg.sets||3}   onChange={v=>updCfg(editExId,"sets",v)}   min={1} max={8}/>
              <NumInput label="Reps"    value={cfg.reps||10}  onChange={v=>updCfg(editExId,"reps",v)}   min={1} max={30}/>
              <WeightInput valueKg={cfg.weight||0} onChange={v=>updCfg(editExId,"weight",v)} weightUnit={weightUnit} onToggleUnit={toggleWeightUnit}/>
            </div>
          </div>
          <div style={{background:C.s1,borderRadius:18,padding:18,marginBottom:14}}>
            <p style={{fontSize:10,color:C.gray,fontWeight:700,letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Descanso entre sets</p>
            <div style={{display:"flex",gap:8}}>
              {[60,90,120,180,240].map(s=>(
                <button key={s} onClick={()=>updCfg(editExId,"restSecs",s)} style={{ flex:1,padding:"9px 0",borderRadius:11,border:`1.5px solid ${cfg.restSecs===s?C.accent:C.s3}`,background:cfg.restSecs===s?`${C.accent}18`:C.s2,color:cfg.restSecs===s?C.accent:C.grayL,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                  {s===60?"1m":s===90?"1.5":s===120?"2m":s===180?"3m":"4m"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.s2}`, flexShrink:0 }}>
          <button onClick={()=>setEditExId(null)} style={{width:"100%",background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Guardar</button>
        </div>
      </div>
    );
  }
  if (saved) {
    return (
      <div className="scale-in" style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center"}}>
        <Confetti active={true}/>
        <span style={{fontSize:64}}>🎉</span>
        <div>
          <h2 className="bb" style={{fontSize:44,color:C.accent,letterSpacing:2}}>CREADO</h2>
          <p style={{color:C.grayL,fontSize:15,marginTop:4}}>{nombre || "Mi rutina"} guardado en tu plan</p>
        </div>
        <div style={{background:C.s1,borderRadius:16,padding:"14px 20px",width:"100%",textAlign:"left"}}>
          <p style={{fontSize:13,color:C.white}}><strong>{selectedExercises.length}</strong> ejercicios · <strong>{dia}</strong> · <strong>{selectedExercises.reduce((s,e)=>s+(exConfig[e.id]&&exConfig[e.id].sets||e.sets),0)}</strong> sets totales</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      <div style={{ padding:"14px 20px 12px", background:C.s0, borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
        <button onClick={()=>navigate("plan")} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:C.grayL,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:10}}>← Plan semanal</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 className="bb" style={{fontSize:30,color:C.white,letterSpacing:.5}}>CREAR RUTINA</h2>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setScanModal(true)} style={{background:`${C.accent}18`,border:`1.5px solid ${C.accent}40`,borderRadius:11,padding:"6px 11px",color:C.accent,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
              📷 Escanear
            </button>
            <div style={{display:"flex",gap:5}}>
              {["config","ejercicios","supersets","resumen"].map((s,i)=>(
                <div key={s} style={{ width:8, height:8, borderRadius:"50%", background:step===s?C.accent: ["config","ejercicios","supersets","resumen"].indexOf(step) > i ? `${C.accent}60` : C.s3, transition:"all .3s" }}/>
              ))}
            </div>
          </div>
        </div>
        <p style={{color:C.gray,fontSize:12,marginTop:2}}>
          {step==="config"?"1/4 · Configuración básica":step==="ejercicios"?"2/4 · Seleccionar ejercicios":step==="supersets"?"3/4 · Agrupar en biseries":"4/4 · Resumen y guardar"}
        </p>
      </div>


      {step==="config" && (
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Nombre del entrenamiento</label>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Push Day C, Full Body..."
              style={{ width:"100%",padding:"14px 16px",background:C.s1,border:`1.5px solid ${nombre?C.accent:C.s2}`,borderRadius:14,color:C.white,fontSize:15,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s" }}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Tipo de entrenamiento</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {TIPOS.map(t=>(
                <button key={t.id} onClick={()=>setTipo(t.id)} style={{ padding:"12px 10px", borderRadius:13, border:`1.5px solid ${tipo===t.id?t.color:C.s2}`, background:tipo===t.id?`${t.color}15`:C.s1, color:tipo===t.id?t.color:C.gray, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textAlign:"center", transition:"all .2s" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:C.gray,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Asignar al día</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {DIAS.map(d=>(
                <button key={d} onClick={()=>setDia(d)} style={{ padding:"9px 12px", borderRadius:11, border:`1.5px solid ${dia===d?C.accent:C.s2}`, background:dia===d?`${C.accent}18`:C.s1, color:dia===d?C.accent:C.gray, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {step==="ejercicios" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          <div style={{ padding:"10px 20px", borderBottom:`1px solid ${C.s2}`, flexShrink:0 }}>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
              {["Todos",...MUSCLE_GROUPS].map(g=>(
                <button key={g} onClick={()=>setFilterGroup(g)} style={{padding:"7px 14px",borderRadius:100,border:"none",cursor:"pointer",whiteSpace:"nowrap",background:filterGroup===g?C.accent:C.s2,color:filterGroup===g?C.bg:C.gray,fontSize:11,fontWeight:600,fontFamily:"inherit",transition:"all .2s",flexShrink:0}}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 20px"}}>
            {filteredLib.map(ex=>{
              const isSel = selected.includes(ex.id);
              return (
                <div key={ex.id} onClick={()=>toggleSelect(ex.id)}
                  style={{ display:"flex",gap:12,alignItems:"center",background:isSel?`${C.accent}12`:C.s1,borderRadius:15,padding:"11px 13px",marginBottom:8,border:`1.5px solid ${isSel?C.accent:C.s2}`,cursor:"pointer",transition:"all .2s" }}>
                  <div style={{width:46,height:46,background:C.s2,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ExSVG id={ex.svgId} size={36}/></div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:600,fontSize:14,color:isSel?C.white:C.grayL}}>{ex.name}</p>
                    <div style={{display:"flex",gap:8,marginTop:3}}>
                      <Pill color={C.blue}>{ex.muscle}</Pill>
                      <span className="mono" style={{fontSize:11,color:C.gray}}>{ex.defaultSets}×{ex.defaultReps}</span>
                    </div>
                  </div>
                  <div style={{ width:28,height:28,borderRadius:8,border:`2px solid ${isSel?C.accent:C.s3}`,background:isSel?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s" }}>
                    {isSel && <span style={{fontSize:13,color:C.bg,fontWeight:700}}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div style={{ padding:"8px 20px 4px", background:C.bg, borderTop:`1px solid ${C.s2}`, flexShrink:0 }}>
              <p style={{fontSize:12,color:C.accent,fontWeight:600,textAlign:"center"}}>
                {selected.length} ejercicio{selected.length>1?"s":""} seleccionado{selected.length>1?"s":""}
              </p>
            </div>
          )}
        </div>
      )}


      {step==="supersets" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{ padding:"10px 20px", borderBottom:`1px solid ${C.s2}`, flexShrink:0, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p style={{fontSize:12,color:C.gray}}>Tocá ✏ para ajustar carga · ⊕ para crear biseries</p>
            <button onClick={()=>{setGroupMode(!groupMode);setGroupSel([]);}} style={{ padding:"7px 12px",borderRadius:11,border:`1.5px solid ${groupMode?C.accent:C.s3}`,background:groupMode?`${C.accent}18`:C.s2,color:groupMode?C.accent:C.grayL,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
              {groupMode?"✕ Cancelar":"⊕ Biserie"}
            </button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>

            {(() => {
              const rendered = new Set(), rows = [];
              for (const ex of selectedExercises) {
                const sg = (exConfig[ex.id]&&exConfig[ex.id].supersetGroup);
                if (sg && !rendered.has(sg)) {
                  const group = selectedExercises.filter(e=>(exConfig[e.id]&&exConfig[e.id].supersetGroup===sg));
                  rows.push({type:"superset",group:sg,items:group});
                  rendered.add(sg);
                } else if (!sg) rows.push({type:"single",items:[ex]});
              }
              return rows.map((row,ri)=>(
                <div key={ri} style={{marginBottom:10}}>
                  {row.type==="superset" && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <div style={{background:C.accent,borderRadius:7,padding:"2px 9px"}}><span className="bb" style={{fontSize:12,color:C.bg,letterSpacing:1}}>BISERIE {row.group}</span></div>
                      <div style={{flex:1,height:1,background:`${C.accent}25`}}/>
                      <span style={{fontSize:10,color:C.gray}}>sin descanso →</span>
                    </div>
                  )}
                  {row.items.map((ex,ei)=>{
                    const isSel2=groupSel.includes(ex.id);
                    const sg=(exConfig[ex.id]&&exConfig[ex.id].supersetGroup);
                    return (
                      <div key={ex.id} onClick={groupMode?()=>setGroupSel(p=>p.includes(ex.id)?p.filter(x=>x!==ex.id):[...p,ex.id]):undefined}
                        style={{display:"flex",gap:11,alignItems:"center",background:isSel2?`${C.accent}15`:C.s1,borderRadius:14,padding:"11px 12px",marginBottom:row.type==="superset"&&ei<row.items.length-1?3:8,border:`1.5px solid ${isSel2?C.accent:sg?`${C.accent}22`:C.s2}`,cursor:groupMode?"pointer":"default",transition:"all .2s"}}>
                        {groupMode && <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${isSel2?C.accent:C.s3}`,background:isSel2?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isSel2&&<span style={{fontSize:11,color:C.bg}}>✓</span>}</div>}
                        <div style={{width:46,height:46,background:C.s2,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ExSVG id={ex.svgId} size={36}/></div>
                        <div style={{flex:1}}>
                          <p style={{fontWeight:600,fontSize:13,color:C.white,marginBottom:3}}>{ex.name}</p>
                          <div style={{display:"flex",gap:8}}>
                            <span className="mono" style={{fontSize:11,color:C.accent}}>{(exConfig[ex.id]&&exConfig[ex.id].sets||ex.sets)}×{(exConfig[ex.id]&&exConfig[ex.id].reps||ex.reps)}</span>
                            <span className="mono" style={{fontSize:11,color:C.grayL}}>{weightUnit==="lb"?Math.round((exConfig[ex.id]&&exConfig[ex.id].weight||ex.weight)*2.20462*10)/10:(exConfig[ex.id]&&exConfig[ex.id].weight||ex.weight)}{weightUnit}</span>
                          </div>
                        </div>
                        {!groupMode && (
                          <div style={{display:"flex",gap:5}}>
                            {sg && <button onClick={()=>removeSuperset(ex.id)} style={{width:28,height:28,borderRadius:7,background:"transparent",border:`1px solid ${C.red}40`,color:C.red,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>}
                            <button onClick={()=>setEditExId(ex.id)} style={{width:28,height:28,borderRadius:7,background:C.s2,border:`1px solid ${C.s3}`,color:C.grayL,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✏</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>
      )}


      {step==="resumen" && (
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{ background:`linear-gradient(135deg,${C.s1},${C.s0})`, borderRadius:20, padding:20, border:`1px solid ${C.accent}30`, marginBottom:16 }}>
            <Pill color={TIPO_COLORS[tipo]||C.accent}>{tipo.toUpperCase()}</Pill>
            <h3 className="bb" style={{fontSize:32,color:C.white,letterSpacing:.5,marginTop:8,marginBottom:3}}>{nombre || "Mi rutina"}</h3>
            <p style={{color:C.gray,fontSize:13}}>📅 {dia}</p>
            <div style={{display:"flex",gap:16,marginTop:12}}>
              {[["Ejercicios",selectedExercises.length],["Sets totales",selectedExercises.reduce((s,e)=>s+(exConfig[e.id]&&exConfig[e.id].sets||e.sets),0)],["Biseries",[...new Set(Object.values(exConfig).map(e=>e.supersetGroup).filter(Boolean))].length]].map(([l,v])=>(
                <div key={l}><span className="mono" style={{fontSize:22,color:C.accent,fontWeight:700}}>{v}</span><span style={{fontSize:10,color:C.gray,marginLeft:4,display:"block"}}>{l}</span></div>
              ))}
            </div>
          </div>
          <h4 className="bb" style={{fontSize:18,color:C.white,letterSpacing:.5,marginBottom:12}}>EJERCICIOS</h4>
          {selectedExercises.map(ex=>(
            <div key={ex.id} style={{ display:"flex",gap:11,alignItems:"center",background:C.s1,borderRadius:13,padding:"10px 13px",marginBottom:8,border:`1px solid ${C.s2}` }}>
              <div style={{width:44,height:44,background:C.s2,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ExSVG id={ex.svgId} size={35}/></div>
              <div style={{flex:1}}>
                <p style={{fontWeight:600,fontSize:13,color:C.white,marginBottom:2}}>{ex.name}</p>
                <span className="mono" style={{fontSize:12,color:C.accent}}>{(exConfig[ex.id]&&exConfig[ex.id].sets||ex.sets)}×{(exConfig[ex.id]&&exConfig[ex.id].reps||ex.reps)}</span>
                <span className="mono" style={{fontSize:12,color:C.grayL,marginLeft:8}}>{weightUnit==="lb"?Math.round((exConfig[ex.id]&&exConfig[ex.id].weight||ex.weight)*2.20462*10)/10:(exConfig[ex.id]&&exConfig[ex.id].weight||ex.weight)}{weightUnit}</span>
                {(exConfig[ex.id]&&exConfig[ex.id].supersetGroup) && <Pill color={C.accent}>Biserie {exConfig[ex.id].supersetGroup}</Pill>}
              </div>
            </div>
          ))}
        </div>
      )}


      {scanModal && (
        <div style={{position:"absolute",inset:0,background:"rgba(8,8,16,.97)",zIndex:50,display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.s2}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div>
              <p className="bb" style={{fontSize:22,color:C.white,letterSpacing:.5}}>ESCANEAR FICHA</p>
              <p style={{fontSize:11,color:C.gray,marginTop:2}}>La IA lee tu rutina anotada y la carga automáticamente</p>
            </div>
            <button onClick={()=>{setScanModal(false);setScanPreview(null);setScanResult(null);setScanError(null);}} style={{background:C.s1,border:`1px solid ${C.s2}`,borderRadius:10,padding:"6px 12px",color:C.grayL,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕ Cerrar</button>
          </div>

          <div style={{flex:1,padding:"16px 20px"}}>
            {!scanPreview && !scanLoading && (
              <div>
                <label htmlFor="scan-upload" style={{display:"block",cursor:"pointer"}}>
                  <div style={{border:`2px dashed ${C.accent}50`,borderRadius:20,padding:"40px 20px",textAlign:"center",background:`${C.accent}05`}}>
                    <div style={{fontSize:48,marginBottom:12}}>📷</div>
                    <p style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:6}}>Tocá para subir una foto</p>
                    <p style={{fontSize:12,color:C.gray,lineHeight:1.6}}>Fotografiá tu ficha de papel, pizarra o cuaderno.<br/>La IA detecta los ejercicios, series y pesos.</p>
                    <div style={{marginTop:16,background:C.s1,borderRadius:12,padding:"10px 16px",display:"inline-block"}}>
                      <p style={{fontSize:11,color:C.accent,fontWeight:700}}>📷 Cámara  ·  🖼️ Galería  ·  📄 Archivo</p>
                    </div>
                  </div>
                </label>
                <input id="scan-upload" type="file" accept="image/*" capture="environment"
                  style={{display:"none"}}
                  onChange={e=>{const f=e.target.files&&e.target.files[0]; if(f) handlePhotoScan(f);}}
                />
                <div style={{marginTop:16,background:C.s1,borderRadius:14,padding:"14px 16px"}}>
                  <p style={{fontSize:11,color:C.gray,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",marginBottom:8}}>CONSEJOS PARA MEJOR RESULTADO</p>
                  {["Buena iluminación, sin sombras","Texto legible y derecho","Encuadrá toda la ficha","Letra clara o impresa funciona mejor"].map(t=>(
                    <div key={t} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                      <span style={{color:C.accent,fontWeight:700,fontSize:12}}>✓</span>
                      <span style={{fontSize:12,color:C.grayL}}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanLoading && (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:20}}>
                {scanPreview && <img src={scanPreview} alt="preview" style={{width:"100%",maxWidth:300,borderRadius:14,objectFit:"cover",maxHeight:200,border:`2px solid ${C.s2}`}}/>}
                <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${C.accent}30`,borderTopColor:C.accent,animation:"spin 1s linear infinite"}}/>
                <div style={{textAlign:"center"}}>
                  <p style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:4}}>Analizando tu ficha...</p>
                  <p style={{fontSize:12,color:C.gray}}>La IA está detectando los ejercicios</p>
                </div>
              </div>
            )}

            {scanError && !scanLoading && (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                {scanPreview && <img src={scanPreview} alt="preview" style={{width:"100%",maxWidth:300,borderRadius:14,objectFit:"cover",maxHeight:160,marginBottom:20,border:`2px solid ${C.s2}`}}/>}
                <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
                <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:8}}>No se pudo leer la ficha</p>
                <p style={{fontSize:12,color:C.gray,lineHeight:1.7,marginBottom:20}}>{scanError}</p>
                <button onClick={()=>{setScanPreview(null);setScanError(null);}} style={{background:C.accent,color:C.bg,border:"none",borderRadius:13,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Intentar de nuevo</button>
              </div>
            )}

            {scanResult && !scanLoading && (
              <div>
                {scanPreview && <img src={scanPreview} alt="preview" style={{width:"100%",borderRadius:14,objectFit:"cover",maxHeight:160,marginBottom:16,border:`2px solid ${C.accent}40`}}/>}
                <div style={{background:`${C.accent}10`,border:`1.5px solid ${C.accent}40`,borderRadius:14,padding:"12px 16px",marginBottom:14}}>
                  <p style={{fontSize:11,color:C.accent,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>✓ Rutina detectada</p>
                  {scanResult.nombre && <p style={{fontSize:14,fontWeight:700,color:C.white}}>{scanResult.nombre}</p>}
                </div>
                <p style={{fontSize:11,color:C.gray,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",marginBottom:10}}>EJERCICIOS DETECTADOS</p>
                {(scanResult.ejercicios||[]).map((ex,i)=>{
                  const match = EXERCISE_LIBRARY.find(e=>e.name.toLowerCase().includes(ex.nombre.toLowerCase())||ex.nombre.toLowerCase().includes(e.name.toLowerCase().split(" ")[0]));
                  return (
                    <div key={i} style={{background:C.s1,borderRadius:12,padding:"11px 14px",marginBottom:8,border:`1.5px solid ${match?C.accent+"40":C.s2}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <p style={{fontSize:13,fontWeight:700,color:match?C.white:C.gray,marginBottom:2}}>{ex.nombre}</p>
                          {match && <p style={{fontSize:11,color:C.accent}}>→ {match.name}</p>}
                          {!match && <p style={{fontSize:11,color:C.gray}}>No encontrado en biblioteca</p>}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <span className="mono" style={{fontSize:12,color:C.accent,fontWeight:700}}>{ex.series||3}×{ex.reps||10}</span>
                          {ex.peso>0 && <p className="mono" style={{fontSize:11,color:C.grayL,marginTop:2}}>{ex.peso}kg</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{marginTop:6,padding:"10px 14px",background:C.s1,borderRadius:12,border:`1px solid ${C.s2}`}}>
                  <p style={{fontSize:11,color:C.gray}}>
                    {(scanResult.ejercicios||[]).filter(ex=>EXERCISE_LIBRARY.find(e=>e.name.toLowerCase().includes(ex.nombre.toLowerCase())||ex.nombre.toLowerCase().includes(e.name.toLowerCase().split(" ")[0]))).length} de {(scanResult.ejercicios||[]).length} ejercicios coinciden con tu biblioteca
                  </p>
                </div>
              </div>
            )}
          </div>

          {scanResult && !scanLoading && (
            <div style={{padding:"12px 20px",borderTop:`1px solid ${C.s2}`,flexShrink:0}}>
              <button onClick={applyScanResult} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#90FF40)`,color:C.bg,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5}}>
                ✓ CARGAR RUTINA
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.s2}`, flexShrink:0, display:"flex", gap:10 }}>
        {step!=="config" && (
          <button onClick={()=>setStep(step==="ejercicios"?"config":step==="supersets"?"ejercicios":"supersets")} style={{ flex:.5, background:"transparent", border:`1.5px solid ${C.s2}`, borderRadius:14, padding:"14px", fontSize:14, fontWeight:600, color:C.grayL, cursor:"pointer", fontFamily:"inherit" }}>← Atrás</button>
        )}
        {step==="config" && (
          <button onClick={()=>setStep("ejercicios")} disabled={!nombre} style={{flex:1,background:nombre?C.accent:C.s2,color:nombre?C.bg:C.gray,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:nombre?"pointer":"not-allowed",fontFamily:"inherit"}}>
            Elegir ejercicios →
          </button>
        )}
        {step==="ejercicios" && (
          <button onClick={()=>setStep("supersets")} disabled={selected.length===0} style={{flex:1,background:selected.length>0?C.accent:C.s2,color:selected.length>0?C.bg:C.gray,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:selected.length>0?"pointer":"not-allowed",fontFamily:"inherit"}}>
            Configurar ({selected.length}) →
          </button>
        )}
        {step==="supersets" && (
          groupMode ? (
            <button onClick={createSuperset} disabled={groupSel.length<2} style={{flex:1,background:groupSel.length>=2?C.accent:C.s2,color:groupSel.length>=2?C.bg:C.gray,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:groupSel.length>=2?"pointer":"not-allowed",fontFamily:"inherit"}}>
              Crear biserie ({groupSel.length})
            </button>
          ) : (
            <button onClick={()=>setStep("resumen")} style={{flex:1,background:C.accent,color:C.bg,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Ver resumen →
            </button>
          )
        )}
        {step==="resumen" && (
          <button onClick={handleSave} style={{ flex:1, background:`linear-gradient(135deg,${C.accent},#90FF40)`, color:C.bg, border:"none", borderRadius:14, padding:"15px", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5 }}>
            💾 GUARDAR RUTINA
          </button>
        )}
      </div>

    </div>

  );
};
export default function App() {
  const [view,setView]     = useState("mobile");
  const [screen,setScreen] = useState("splash");
  const [phoneSheets, setPhoneSheets] = useState(null);
  const [userPlan, setUserPlan]       = useState("free");

  const navigate = (s) => { setScreen(s); setPhoneSheets(null); }

  const showNav = !["splash","login","onboarding-alumno","onboarding-coach"].includes(screen);

  const mobileScreens = {
    splash:              <SplashScreen        onNext={(dest)=>navigate(dest||"home")}/>,
    "onboarding-alumno": <OnboardingAlumno    onDone={()=>navigate("home")}/>,
    "onboarding-coach":  <OnboardingCoach     onDone={()=>navigate("home")}/>,
    login:               <LoginScreen         onNext={()=>navigate("home")}/>,
    home:                <HomeScreen          navigate={navigate} userPlan={userPlan}/>,
    plan:                <PlanSemanalScreen   navigate={navigate} userPlan={userPlan}/>,
    crear:               <CrearRutinaScreen   navigate={navigate} userPlan={userPlan}/>,
    rutinas:             <RutinasScreen       setSheets={setPhoneSheets} userPlan={userPlan} navigate={navigate}/>,
    progreso:            <ProgresoScreen      userPlan={userPlan} navigate={navigate}/>,
    chat:                <ChatScreen          setSheets={setPhoneSheets} userPlan={userPlan} navigate={navigate}/>,
    perfil:              <PerfilScreen        navigate={navigate} userPlan={userPlan}/>,
    notificaciones:      <NotificacionesScreen navigate={navigate}/>,
    "mi-plan":           <MiPlanScreen        navigate={navigate} userPlan={userPlan} setUserPlan={setUserPlan}/>,
    pagos:               <PagosScreen         navigate={navigate}/>,
    videos:              <VideosScreen        navigate={navigate} userPlan={userPlan}/>,
    configuracion:       <ConfiguracionScreen navigate={navigate}/>,
    feedback:            <FeedbackScreen      navigate={navigate}/>,
    soporte:             <SoporteScreen       navigate={navigate}/>,
    tabata:              <TabataScreen        navigate={navigate} userPlan={userPlan}/>,
    "registrar-entreno": <RegistrarEntrenoScreen navigate={navigate} userPlan={userPlan}/>,
    "fotos-progreso":    <FotosProgresoScreen navigate={navigate} userPlan={userPlan}/>,
    grupos:              <GruposScreen        navigate={navigate} userPlan={userPlan}/>,
    "analisis-corporal": <AnalisisCorporalScreen navigate={navigate} userPlan={userPlan}/>,
    "sesiones-en-vivo":  <SesionesEnVivoScreen   navigate={navigate} userPlan={userPlan}/>,
    nutricion:           <NutricionScreen     navigate={navigate} userPlan={userPlan}/>,
    "checkout-coach":    <CheckoutCoachScreen navigate={navigate} setUserPlan={setUserPlan} pkg={{label:"Pro",price:"$39.900/mes",coachName:"Miguel Ramirez"}}/>,
  };

  const TABS = [
    {id:"mobile",           label:"📱 App Móvil"},
    {id:"backoffice-owner", label:"👑 Dueño"},
    {id:"backoffice-coach", label:"💪 Entrenador"},
    {id:"styleguide",       label:"🎨 Guía de Estilo"},
  ];

  const MOB_SCREENS = [
    {id:"splash",  label:"Splash"},
    {id:"login",   label:"Login"},
    {id:"home",    label:"🏠 Inicio"},
    {id:"plan",    label:"📅 Plan Semanal"},
    {id:"crear",   label:"➕ Crear Rutina"},
    {id:"rutinas", label:"🏋 Rutina del Día"},
    {id:"progreso",label:"📈 Mi Progreso"},
    {id:"chat",    label:"💬 Coach / Chat"},
    {id:"perfil",  label:"👤 Perfil"},
    {id:"notificaciones",label:"🔔 Notificaciones"},
    {id:"mi-plan", label:"⭐ Mi Plan"},
    {id:"pagos",   label:"💳 Pagos"},
    {id:"videos",  label:"📹 Videos"},
    {id:"configuracion",label:"⚙️ Configuración"},
    {id:"feedback",label:"💡 Feedback"},
    {id:"soporte", label:"🎫 Soporte"},
    {id:"tabata",  label:"⏱ Tabata"},
    {id:"registrar-entreno",label:"📝 Registrar Entreno"},
    {id:"fotos-progreso",   label:"📸 Fotos Progreso"},
    {id:"grupos",           label:"👥 Grupos"},
    {id:"analisis-corporal",label:"📐 Analisis Corporal"},
    {id:"sesiones-en-vivo", label:"🎥 Sesiones en Vivo"},
    {id:"nutricion",        label:"🥗 Nutricion"},
    {id:"checkout-coach",   label:"💰 Contratar Coach"},
    {id:"onboarding-alumno",label:"👋 Onboarding Alumno"},
    {id:"onboarding-coach", label:"🏋 Onboarding Coach"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#040408"}}>


        <div style={{ background:C.s0, borderBottom:`1px solid ${C.s2}`, padding:"0 24px", height:50, display:"flex", alignItems:"center", flexShrink:0 }}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginRight:28}}>
            <div style={{width:26,height:26,background:C.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:14}}>⚡</span></div>
            <span className="bb" style={{fontSize:20,letterSpacing:2,color:C.white}}>FORZA</span>
          </div>

          {view==="mobile" && (
            <div style={{display:"flex",alignItems:"center",gap:4,marginRight:8,background:C.s1,borderRadius:10,padding:"3px 5px",border:`1px solid ${C.s2}`}}>
              <span style={{fontSize:9,color:C.gray,marginRight:2,fontWeight:700}}>PLAN:</span>
              {[["free","🆓"],["pro","⚡"],["coach","🏆"]].map(([p,icon])=>(
                <button key={p} onClick={()=>setUserPlan(p)}
                  style={{padding:"3px 8px",borderRadius:7,border:`1px solid ${userPlan===p?C.accent:C.s3}`,background:userPlan===p?`${C.accent}18`:C.s2,color:userPlan===p?C.accent:C.gray,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .2s"}}>
                  {icon} {p.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setView(t.id)} style={{ padding:"0 16px",height:50,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:"transparent",color:view===t.id?C.accent:C.gray,borderBottom:view===t.id?`2px solid ${C.accent}`:"2px solid transparent",fontFamily:"'DM Sans',sans-serif",transition:"all .2s" }}>
              {t.label}
            </button>
          ))}
        </div>


        <div style={{flex:1,overflow:"hidden",display:"flex"}}>
          {view==="mobile" && (
            <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"36px 24px",gap:36,overflowY:"auto",flexWrap:"wrap"}}>
              <Phone nav={showNav ? <BottomNav active={screen} onNav={navigate}/> : null} sheets={phoneSheets}>
                {mobileScreens[screen]}
              </Phone>

              <div style={{display:"flex",flexDirection:"column",gap:5,paddingTop:28,minWidth:200}}>
                <p style={{fontSize:10,color:C.gray,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Pantallas</p>
                {MOB_SCREENS.map(s=>(
                  <button key={s.id} onClick={()=>navigate(s.id)} style={{ padding:"9px 18px", borderRadius:11, border:"none", cursor:"pointer", textAlign:"left", background:screen===s.id?`rgba(200,255,0,.1)`:C.s1, color:screen===s.id?C.accent:C.gray, fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif", borderLeft:screen===s.id?`3px solid ${C.accent}`:"3px solid transparent", transition:"all .2s", minWidth:210 }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {view==="backoffice-owner"  && <BackofficeOwner/>}
          {view==="backoffice-coach"  && <BackofficeCoach/>}
          {view==="styleguide"        && <StyleGuide/>}
        </div>
      </div>
    </>
  );
}
