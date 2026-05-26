import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon    from '../components/ui/Icons.jsx'
import { useAuth }  from '../context/AuthContext.jsx'
import { authAPI }  from '../api/auth.js'
import Button  from '../components/ui/Button.jsx'
import Input   from '../components/ui/Input.jsx'
import Alert   from '../components/ui/Alert.jsx'
import { extractError } from '../hooks/useApi.js'
import { staggerContainer, fadeUp, scaleIn, spring } from '../utils/animations.js'

export default function Login({ onSwitch }) {
  const { login } = useAuth()
  const [roll, setRoll] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoad]       = useState(false)
  const [error, setError]        = useState('')
  const [unverified, setUnver]   = useState(false)
  const [resending, setResend]   = useState(false)
  const [ok, setOk]              = useState('')

  const submit = async e => {
    e.preventDefault(); setError(''); setUnver(false); setOk('')
    if (!roll||!pass) { setError('All fields required.'); return }
    setLoad(true)
    try { await login(roll.toUpperCase().trim(), pass) }
    catch (err) {
      if (err.response?.data?.unverified) { setUnver(true); setError('Email not verified. Check your inbox.') }
      else setError(extractError(err))
    } finally { setLoad(false) }
  }
  const resend = async () => {
    setResend(true); setError(''); setOk('')
    try { await authAPI.resendOtp(roll.toUpperCase().trim()); setOk('Code sent! Check your email.') }
    catch (err) { setError(extractError(err)) } finally { setResend(false) }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12" style={{background:"var(--bg-surface)",borderRight:"1px solid var(--border)",backdropFilter:"blur(24px)"}}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Icon name="graduationCap" size={18} className="text-white"/>
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">UniGroups</span>
          </div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{...spring.smooth,delay:0.2}} className="text-6xl font-bold text-[var(--text-primary)] leading-tight mb-4">Welcome<br/>back.</motion.h1>
          <p className="text-[var(--text-secondary)] text-sm">Superior University<br/>Group Management System</p>
        </div>
        <div className="space-y-3">
          {[{dot:'bg-orange-400',l:'Software Engineering'},{dot:'bg-cyan-400',l:'Computer Science'}].map(d=>(
            <div key={d.l} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${d.dot}`}/>
              <span className="text-xs text-[var(--text-muted)]">{d.l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{background:"var(--bg-base)"}}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Icon name="graduationCap" size={16} className="text-white"/>
            </div>
            <span className="font-bold text-[var(--text-primary)]">UniGroups</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Sign in</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-7">Use your university roll number</p>
          {ok && <div className="mb-3"><Alert type="success" message={ok}/></div>}
          <Alert type="error" message={error} onClose={()=>{setError('');setUnver(false)}}/>
          {unverified && (
            <div className="mt-3 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-400/8 border border-amber-200 dark:border-amber-400/20">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Email not verified</span>
              <Button variant="ghost" size="sm" loading={resending} onClick={resend} className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-400/10 text-xs">Resend code</Button>
            </div>
          )}
          <motion.form variants={staggerContainer} initial="initial" animate="animate" onSubmit={submit} className="space-y-4 mt-5">
            <Input label="Roll Number" icon={<Icon name="creditCard" size={15}/>} placeholder="SU72-BSSEM-F25-017" value={roll} onChange={e=>setRoll(e.target.value.toUpperCase())} mono required/>
            <Input label="Password" icon={<Icon name="keyRound" size={15}/>} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required/>
            <Button type="submit" size="lg" loading={loading} fullWidth>Sign In <Icon name="arrowRight" size={16}/></Button>
          </motion.form>
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[var(--border)]"/>
            <span className="text-xs text-[var(--text-faint)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]"/>
          </div>
          <p className="text-center text-sm text-[var(--text-secondary)]">New student?{' '}
            <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Create account</button>
          </p>
        </div>
      </div>
    </div>
  )
}
