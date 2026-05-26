import { useState } from 'react'
import Icon from '../components/ui/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../api/auth.js'
import Button      from '../components/ui/Button.jsx'
import Input       from '../components/ui/Input.jsx'
import Alert       from '../components/ui/Alert.jsx'
import DeptSelector from '../components/forms/DeptSelector.jsx'
import { extractError } from '../hooks/useApi.js'

function Step1({ onDone }) {
  const { register } = useAuth()
  const [f, setF] = useState({ roll_number:'', name:'', email:'', department:'', password:'', password2:'' })
  const [loading, setLoad] = useState(false); const [error, setError] = useState('')
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))
  const submit = async e => {
    e.preventDefault(); setError('')
    if (!['roll_number','name','email','department','password','password2'].every(k=>f[k])) { setError('All fields required.'); return }
    if (f.password !== f.password2) { setError('Passwords do not match.'); return }
    if (f.password.length < 8) { setError('Password min 8 characters.'); return }
    setLoad(true)
    try { const d = await register(f); onDone({ roll_number:d.roll_number, email:f.email, dev_otp:d.dev_otp }) }
    catch (err) { setError(extractError(err)) } finally { setLoad(false) }
  }
  return <>
    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Create account</h2>
    <p className="text-sm text-[var(--text-secondary)] mb-7">Register with your university credentials</p>
    <Alert type="error" message={error} onClose={()=>setError('')}/>
    <form onSubmit={submit} className="space-y-4 mt-5">
      <Input label="Roll Number" icon={<Icon name="creditCard" size={15}/>} placeholder="SU72-BSSEM-F25-017" hint="Format: SU##-DEPT-X##-###" value={f.roll_number} onChange={e=>setF(p=>({...p,roll_number:e.target.value.toUpperCase()}))} mono required/>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Full Name" icon={<Icon name="user" size={15}/>} placeholder="Ali Hassan" value={f.name} onChange={set('name')} required/>
        <Input label="Email" icon={<Icon name="mail" size={15}/>} type="email" placeholder="ali@su.edu.pk" value={f.email} onChange={set('email')} required/>
      </div>
      <DeptSelector value={f.department} onChange={v=>setF(p=>({...p,department:v}))}/>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Password" icon={<Icon name="keyRound" size={15}/>} type="password" placeholder="Min. 8 chars" value={f.password} onChange={set('password')} required/>
        <Input label="Confirm"  icon={<Icon name="keyRound" size={15}/>} type="password" placeholder="Repeat" value={f.password2} onChange={set('password2')} required/>
      </div>
      <Button type="submit" size="lg" loading={loading} fullWidth>Create Account →</Button>
    </form>
  </>
}

function Step2({ rollNumber, email, devOtp }) {
  const { verifyEmail } = useAuth()
  const [otp, setOtp]             = useState(devOtp||'')
  const [loading, setLoad]        = useState(false)
  const [error, setError]         = useState('')
  const [resending, setResend]    = useState(false)
  const [ok, setOk]               = useState('')

  const submit = async e => {
    e.preventDefault(); setError('')
    if (otp.length!==6) { setError('Enter 6-digit code.'); return }
    setLoad(true)
    try { await verifyEmail(rollNumber, otp) } catch (err) { setError(extractError(err)) } finally { setLoad(false) }
  }
  const resend = async () => {
    setResend(true)
    try { await authAPI.resendOtp(rollNumber); setOk('New code sent!') } catch (err) { setError(extractError(err)) } finally { setResend(false) }
  }
  return <>
    <div className="text-center mb-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
        <Icon name="mail" size={28} className="text-indigo-600 dark:text-indigo-400"/>
      </div>
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Check your email</h2>
      <p className="text-sm text-[var(--text-secondary)] mt-1">Code sent to <span className="text-[var(--text-primary)] font-medium">{email}</span></p>
    </div>
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] mb-5">
      <Icon name="creditCard" size={14} className="text-indigo-500 shrink-0"/>
      <div>
        <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Roll Number</p>
        <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">{rollNumber}</p>
      </div>
    </div>
    {ok && <div className="mb-3"><Alert type="success" message={ok}/></div>}
    <Alert type="error" message={error} onClose={()=>setError('')}/>
    <form onSubmit={submit} className="space-y-4 mt-5">
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 text-center">6-Digit Code</label>
        <input type="text" inputMode="numeric" maxLength={6} placeholder="0  0  0  0  0  0"
          value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
          className="w-full py-4 px-4 text-center text-2xl font-mono font-bold tracking-[0.5em] bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"/>
        <p className="text-xs text-[var(--text-faint)] text-center mt-1.5">Expires in 10 minutes</p>
      </div>
      <Button type="submit" size="lg" loading={loading} disabled={otp.length!==6} fullWidth>
        <Icon name="checkCircle" size={16}/> Verify & Login
      </Button>
    </form>
    <p className="text-center text-sm text-[var(--text-secondary)] mt-5">Didn't receive it?{' '}
      <button onClick={resend} disabled={resending} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-50">
        {resending?'Sending…':'Resend code'}
      </button>
    </p>
    {devOtp && (
      <div className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-400/8 border border-amber-200 dark:border-amber-400/20 text-center">
        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">Dev Mode — OTP:</p>
        <p className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-300 tracking-[0.4em]">{devOtp}</p>
      </div>
    )}
  </>
}

export default function Signup({ onSwitch }) {
  const [step, setStep]     = useState(1)
  const [otpData, setOtpData] = useState(null)
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12" style={{background:"var(--bg-surface)",borderRight:"1px solid var(--border)",backdropFilter:"blur(24px)"}}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Icon name="graduationCap" size={18} className="text-white"/>
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">UniGroups</span>
          </div>
          <h1 className="text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6">Join your<br/>university<br/>groups.</h1>
          <div className="space-y-4 mt-8">
            {['Register','Verify Email'].map((label,i)=>{
              const done=step>i+1; const cur=step===i+1
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done?'bg-green-500 text-white':cur?'bg-indigo-600 dark:bg-indigo-500 text-white':'bg-[var(--bg-raised)] text-[var(--text-muted)]'}`}>
                    {done?<Icon name="check" size={10} strokeWidth={3}/>:i+1}
                  </div>
                  <span className={`text-sm font-medium ${cur?'text-[var(--text-primary)]':done?'text-green-600 dark:text-green-400':'text-[var(--text-muted)]'}`}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-[var(--text-faint)]">Superior University · GMS</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Icon name="graduationCap" size={16} className="text-white"/>
            </div>
            <span className="font-bold text-[var(--text-primary)]">UniGroups</span>
          </div>
          {step===1 ? <Step1 onDone={d=>{setOtpData(d);setStep(2)}}/> : <Step2 rollNumber={otpData.roll_number} email={otpData.email} devOtp={otpData.dev_otp}/>}
          {step===1 && <>
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-[var(--border)]"/>
              <span className="text-xs text-[var(--text-faint)]">or</span>
              <div className="h-px flex-1 bg-[var(--border)]"/>
            </div>
            <p className="text-center text-sm text-[var(--text-secondary)]">Have an account?{' '}
              <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Sign in</button>
            </p>
          </>}
        </div>
      </div>
    </div>
  )
}
