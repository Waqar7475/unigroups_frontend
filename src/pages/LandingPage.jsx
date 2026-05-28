import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

// ── ICONS ─────────────────────────────────────────────────────────────────────
const I = {
  grad:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  users:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="7" r="3.5"/><path d="M2 19c0-4 2.5-6 6-6s6 2 6 6"/><circle cx="16.5" cy="8" r="2.5"/><path d="M14 19c0-2.5 1.5-4 4-4s4 1.5 4 4"/></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3L4 6.5v5c0 4 3.5 7.5 8 8.5 4.5-1 8-4.5 8-8.5v-5L12 3z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bolt:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.5" cy="10.5" r="6"/><path d="M15.5 15.5L20 20" strokeLinecap="round"/></svg>,
  bell:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  lock:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round"/></svg>,
  arrow:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  check:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pdf:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  mail:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 4 12 13 22 4"/></svg>,
  key:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3" strokeLinecap="round"/></svg>,
  eye:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  crown:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17L6 7l6 5 6-5 3 10H3z"/><path d="M3 17h18" strokeLinecap="round"/></svg>,
}

const spring = { type:'spring', stiffness:400, damping:28, mass:0.8 }
const smooth = { type:'spring', stiffness:260, damping:28 }

// Floating orb background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { cx:'15%', cy:'20%', r:320, c1:'#4f46e5', c2:'#7c3aed', dur:8, delay:0 },
        { cx:'85%', cy:'15%', r:260, c1:'#0ea5e9', c2:'#6366f1', dur:10, delay:2 },
        { cx:'70%', cy:'80%', r:300, c1:'#8b5cf6', c2:'#ec4899', dur:9, delay:1 },
        { cx:'10%', cy:'75%', r:200, c1:'#06b6d4', c2:'#3b82f6', dur:11, delay:3 },
      ].map((o,i) => (
        <motion.div key={i}
          animate={{ x:[0,30,-20,0], y:[0,-25,15,0], scale:[1,1.08,0.95,1] }}
          transition={{ duration:o.dur, delay:o.delay, repeat:Infinity, ease:'easeInOut' }}
          style={{
            position:'absolute', left:o.cx, top:o.cy,
            width:o.r, height:o.r,
            transform:'translate(-50%,-50%)',
            borderRadius:'50%',
            background:`radial-gradient(circle, ${o.c1}22, ${o.c2}08, transparent 70%)`,
            filter:'blur(40px)',
          }}/>
      ))}
    </div>
  )
}

// Animated counter
function Counter({ to, suffix='' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting && !started) setStarted(true) }, { threshold:0.5 })
    if(ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if(!started) return
    let frame, start
    const step = ts => {
      if(!start) start = ts
      const progress = Math.min((ts-start)/1200, 1)
      const ease = 1 - Math.pow(1-progress, 3)
      setCount(Math.round(ease * to))
      if(progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [started, to])
  return <span ref={ref}>{count}{suffix}</span>
}

// Feature card
function FeatureCard({ icon, title, desc, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ ...smooth, delay }}
      whileHover={{ y:-6, transition:{ ...spring } }}
      style={{
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:20,
        padding:'28px 24px',
        backdropFilter:'blur(12px)',
        cursor:'default',
      }}>
      <motion.div whileHover={{ scale:1.1, rotate:5 }} transition={spring}
        style={{
          width:48, height:48, borderRadius:14,
          background:`linear-gradient(135deg, ${accent}22, ${accent}11)`,
          border:`1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:accent, marginBottom:16,
        }}>
        {icon}
      </motion.div>
      <h3 style={{ fontSize:16, fontWeight:700, color:'#eef0f8', marginBottom:8, fontFamily:'Outfit,sans-serif' }}>{title}</h3>
      <p style={{ fontSize:13.5, color:'#6b7a99', lineHeight:1.65, fontFamily:'Outfit,sans-serif' }}>{desc}</p>
    </motion.div>
  )
}

// Step card
function StepCard({ num, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-24 }}
      whileInView={{ opacity:1, x:0 }}
      viewport={{ once:true }}
      transition={{ ...smooth, delay }}
      style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
      <div style={{
        width:44, height:44, borderRadius:14, flexShrink:0,
        background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:16, fontWeight:800, color:'#fff',
        boxShadow:'0 8px 24px rgba(99,102,241,0.35)',
        fontFamily:'Outfit,sans-serif',
      }}>{num}</div>
      <div>
        <h3 style={{ fontSize:15, fontWeight:700, color:'#eef0f8', marginBottom:6, fontFamily:'Outfit,sans-serif' }}>{title}</h3>
        <p style={{ fontSize:13.5, color:'#6b7a99', lineHeight:1.6, fontFamily:'Outfit,sans-serif' }}>{desc}</p>
      </div>
    </motion.div>
  )
}

// Login / Register form
function AuthPanel({ onEnter }) {
  const [mode, setMode]     = useState('login')
  const [roll, setRoll]     = useState('')
  const [pass, setPass]     = useState('')
  const [showPass, setShow] = useState(false)

  return (
    <motion.div
      initial={{ opacity:0, y:30, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ ...smooth, delay:0.5 }}
      style={{
        background:'rgba(255,255,255,0.04)',
        backdropFilter:'blur(32px) saturate(150%)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:24,
        padding:32,
        boxShadow:'0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        width:'100%', maxWidth:380,
      }}>
      {/* Mode tabs */}
      <div style={{
        display:'flex', background:'rgba(0,0,0,0.3)',
        borderRadius:12, padding:4, marginBottom:28,
        border:'1px solid rgba(255,255,255,0.06)',
      }}>
        {['login','register'].map(m => (
          <motion.button key={m} onClick={()=>setMode(m)}
            style={{
              flex:1, padding:'8px 0', borderRadius:9, fontSize:13,
              fontWeight:600, fontFamily:'Outfit,sans-serif',
              cursor:'pointer', border:'none', position:'relative',
              background:'transparent',
              color: mode===m ? '#fff' : 'rgba(255,255,255,0.4)',
              transition:'color 0.2s',
            }}>
            {mode===m && (
              <motion.div layoutId="auth-tab"
                style={{
                  position:'absolute', inset:0, borderRadius:9,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  boxShadow:'0 4px 16px rgba(99,102,241,0.4)',
                }}
                transition={spring}/>
            )}
            <span style={{position:'relative', zIndex:1, textTransform:'capitalize'}}>{m}</span>
          </motion.button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Roll Number */}
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:7, fontFamily:'Outfit,sans-serif' }}>Roll Number</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>{I.key}</span>
            <input
              placeholder="SU72-BSSEM-F25-017"
              value={roll}
              onChange={e => setRoll(e.target.value.toUpperCase())}
              style={{
                width:'100%', padding:'11px 14px 11px 42px',
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, fontSize:13,
                color:'#eef0f8', outline:'none',
                fontFamily:'JetBrains Mono,monospace',
                letterSpacing:'0.05em', boxSizing:'border-box',
                transition:'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)' }}
              onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
            />
          </div>
        </div>

        {mode==='register' && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} transition={smooth}>
            <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:7, fontFamily:'Outfit,sans-serif' }}>Full Name</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>{I.grad}</span>
              <input placeholder="Ali Hassan" style={{
                width:'100%', padding:'11px 14px 11px 42px',
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, fontSize:13, color:'#eef0f8', outline:'none',
                fontFamily:'Outfit,sans-serif', boxSizing:'border-box',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)' }}
              onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}/>
            </div>
          </motion.div>
        )}

        {/* Password */}
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:7, fontFamily:'Outfit,sans-serif' }}>Password</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>{I.lock}</span>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{
                width:'100%', padding:'11px 42px 11px 42px',
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, fontSize:13, color:'#eef0f8', outline:'none',
                fontFamily:'Outfit,sans-serif', boxSizing:'border-box',
                transition:'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)' }}
              onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
            />
            <motion.button whileTap={{scale:0.85}} onClick={()=>setShow(p=>!p)}
              style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', padding:0 }}>
              {showPass ? I.eyeOff : I.eye}
            </motion.button>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale:1.02, boxShadow:'0 12px 36px rgba(99,102,241,0.45)' }}
          whileTap={{ scale:0.97 }}
          onClick={onEnter}
          style={{
            width:'100%', padding:'13px',
            background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
            border:'none', borderRadius:13, fontSize:14,
            fontWeight:700, color:'#fff', cursor:'pointer',
            fontFamily:'Outfit,sans-serif',
            boxShadow:'0 8px 28px rgba(99,102,241,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            marginTop:4,
          }}>
          {mode==='login' ? 'Sign In' : 'Create Account'} {I.arrow}
        </motion.button>
      </div>

      <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:20, fontFamily:'Outfit,sans-serif' }}>
        {mode==='login' ? "New here? " : "Have account? "}
        <button onClick={()=>setMode(mode==='login'?'register':'login')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#818cf8', fontWeight:600, fontFamily:'Outfit,sans-serif', fontSize:12 }}>
          {mode==='login' ? 'Create account' : 'Sign in'}
        </button>
      </p>
    </motion.div>
  )
}

// ── MAIN LANDING PAGE ─────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }) {
  const { scrollY } = useScroll()
  const heroY   = useTransform(scrollY, [0,500], [0,-80])
  const heroOp  = useTransform(scrollY, [0,400], [1,0])
  const navBg   = useTransform(scrollY, [0,80], ['rgba(6,6,8,0)', 'rgba(6,6,8,0.92)'])
  const navBlur = useTransform(scrollY, [0,80], [0, 20])

  const features = [
    { icon:I.users,  title:'Join Study Groups',        desc:'Browse and join project or study groups in your department. Connect with classmates who share your interests.', accent:'#6366f1', delay:0 },
    { icon:I.bolt,   title:'Create Your Own Group',    desc:'Start a group for any subject or project. Set your own name, description, and member limit.', accent:'#f59e0b', delay:0.08 },
    { icon:I.search, title:'Smart Browsing',           desc:'Filter groups by department, status, or search by name. Find the perfect group in seconds.', accent:'#10b981', delay:0.16 },
    { icon:I.bell,   title:'Real-time Notifications',  desc:'Get instant alerts when your join request is accepted, rejected, or when group status changes.', accent:'#ef4444', delay:0.24 },
    { icon:I.shield, title:'Request to Join',          desc:'Send a join request with a message. Group leaders approve or reject — full control for everyone.', accent:'#8b5cf6', delay:0.32 },
    { icon:I.pdf,    title:'PDF Reports (Admin)',       desc:'Admins can select groups and export professional PDF member lists with one click.', accent:'#06b6d4', delay:0.40 },
  ]

  const stats = [
    { n:2,   s:'',  label:'Departments' },
    { n:100, s:'+', label:'Max Groups'  },
    { n:20,  s,     label:'Per Group'   },
    { n:99,  s:'%', label:'Uptime'      },
  ]

  return (
    <div style={{ background:'#060608', minHeight:'100vh', color:'#eef0f8', overflowX:'hidden' }}>

      {/* ── NAVBAR ── */}
      <motion.nav style={{ background:navBg, backdropFilter:`blur(${navBlur}px)` }}
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y:-64, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ ...smooth, delay:0.2 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <motion.div whileHover={{scale:1.1,rotate:5}} transition={spring}
              style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(99,102,241,0.4)' }}>
              {I.grad}
            </motion.div>
            <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:17, letterSpacing:'-0.3px' }}>UniGroups</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.96}} onClick={onEnter}
              style={{ padding:'9px 22px', borderRadius:10, fontSize:13, fontWeight:700, fontFamily:'Outfit,sans-serif', cursor:'pointer', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.75)' }}>
              Sign In
            </motion.button>
            <motion.button whileHover={{scale:1.03, boxShadow:'0 8px 24px rgba(99,102,241,0.4)'}} whileTap={{scale:0.96}} onClick={onEnter}
              style={{ padding:'9px 22px', borderRadius:10, fontSize:13, fontWeight:700, fontFamily:'Outfit,sans-serif', cursor:'pointer', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none', color:'#fff', boxShadow:'0 4px 16px rgba(99,102,241,0.3)' }}>
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden' }}>
        <FloatingOrbs/>

        {/* Grid pattern */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize:'60px 60px',
          maskImage:'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}/>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'100px 24px 60px', width:'100%', display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'center' }}
          className="flex-col-reverse-mobile">

          {/* Left text */}
          <div>
            <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{...smooth,delay:0.3}}
              style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'6px 14px', borderRadius:99, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', marginBottom:28 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#818cf8', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'Outfit,sans-serif' }}>Superior University</span>
              <div style={{ display:'flex', gap:1 }}>{[0,1,2].map(i=><motion.span key={i} animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.4,delay:i*0.2,repeat:Infinity}} style={{color:'#fbbf24',fontSize:11}}>{I.star}</motion.span>)}</div>
            </motion.div>

            <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{...smooth,delay:0.4}}
              style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:900, lineHeight:1.08, letterSpacing:'-2px', marginBottom:24, fontFamily:'Outfit,sans-serif' }}>
              Your University<br/>
              <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Group Hub
              </span>
            </motion.h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{...smooth,delay:0.5}}
              style={{ fontSize:17, color:'#6b7a99', lineHeight:1.7, maxWidth:480, marginBottom:36, fontFamily:'Outfit,sans-serif' }}>
              Find study partners, create project teams, and manage your academic groups — all in one place built for Superior University students.
            </motion.p>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{...smooth,delay:0.6}}
              style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <motion.button whileHover={{scale:1.04,boxShadow:'0 16px 48px rgba(99,102,241,0.45)'}} whileTap={{scale:0.97}} onClick={onEnter}
                style={{ padding:'14px 32px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none', borderRadius:14, fontSize:15, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'Outfit,sans-serif', boxShadow:'0 8px 32px rgba(99,102,241,0.35)', display:'flex', alignItems:'center', gap:8 }}>
                Get Started Free {I.arrow}
              </motion.button>
              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}
                style={{ padding:'14px 28px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.7)', cursor:'pointer', fontFamily:'Outfit,sans-serif' }}>
                See Features
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}}
              style={{ display:'flex', gap:20, marginTop:36, flexWrap:'wrap' }}>
              {['Free for all students','No credit card','Instant access'].map((t,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:'rgba(255,255,255,0.4)', fontFamily:'Outfit,sans-serif' }}>
                  <span style={{color:'#4ade80'}}>{I.check}</span>{t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Auth panel */}
          <div style={{ display:'flex', justifyContent:'center' }}>
            <AuthPanel onEnter={onEnter}/>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ padding:'60px 24px', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}
          className="stats-grid">
          {stats.map(({n,s,label},i)=>(
            <motion.div key={label}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{...smooth,delay:i*0.08}}
              style={{ textAlign:'center', padding:'28px 16px', borderRadius:20, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize:40, fontWeight:900, fontFamily:'Outfit,sans-serif', background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>
                <Counter to={n} suffix={s}/>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:8, fontFamily:'Outfit,sans-serif', fontWeight:500 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div id="features" style={{ maxWidth:1100, margin:'0 auto', padding:'80px 24px' }}>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={smooth}
          style={{ textAlign:'center', marginBottom:56 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'Outfit,sans-serif' }}>Everything You Need</span>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginTop:12, letterSpacing:'-1px', fontFamily:'Outfit,sans-serif' }}>Built for Students,<br/>Powered by Simplicity</h2>
          <p style={{ fontSize:16, color:'#6b7a99', marginTop:14, maxWidth:480, margin:'14px auto 0', fontFamily:'Outfit,sans-serif', lineHeight:1.6 }}>Everything you need to collaborate with your classmates</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="features-grid">
          {features.map((f,i)=><FeatureCard key={i} {...f}/>)}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding:'80px 24px', background:'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={smooth}
            style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'Outfit,sans-serif' }}>How It Works</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, marginTop:12, letterSpacing:'-1px', fontFamily:'Outfit,sans-serif' }}>Start in 3 Simple Steps</h2>
          </motion.div>

          <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
            {[
              { num:1, title:'Register with your roll number', desc:'Sign up using your university roll number and get verified instantly via email. Your department is auto-detected.' },
              { num:2, title:'Browse or create a group',       desc:'Explore groups in your department or create your own. Set a name, description, and maximum member count.' },
              { num:3, title:'Request to join & collaborate',  desc:'Send a join request to any open group. Once accepted, start collaborating with your classmates.' },
            ].map((s,i)=><StepCard key={i} {...s} delay={i*0.1}/>)}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding:'80px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <FloatingOrbs/>
        <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={smooth}
          style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:16, fontFamily:'Outfit,sans-serif' }}>
            Ready to find your<br/>
            <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              study group?
            </span>
          </h2>
          <p style={{ fontSize:16, color:'#6b7a99', marginBottom:36, fontFamily:'Outfit,sans-serif' }}>Join hundreds of Superior University students already collaborating.</p>
          <motion.button whileHover={{scale:1.05,boxShadow:'0 20px 60px rgba(99,102,241,0.5)'}} whileTap={{scale:0.97}} onClick={onEnter}
            style={{ padding:'16px 44px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none', borderRadius:16, fontSize:16, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'Outfit,sans-serif', boxShadow:'0 8px 32px rgba(99,102,241,0.35)', display:'inline-flex', alignItems:'center', gap:10 }}>
            {I.grad} Get Started — It's Free
          </motion.button>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ padding:'28px 24px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>{I.grad}</div>
          <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:14, color:'rgba(255,255,255,0.6)' }}>UniGroups</span>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontFamily:'Outfit,sans-serif' }}>© 2025 UniGroups — Superior University GMS</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060608; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 768px) {
          .flex-col-reverse-mobile { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}
