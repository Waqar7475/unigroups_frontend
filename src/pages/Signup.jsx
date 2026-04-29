import { useState }   from 'react'
import { Layers, CreditCard, KeyRound, User, Mail, CheckCircle2 } from 'lucide-react'
import { useAuth }    from '../context/AuthContext.jsx'
import { authAPI }    from '../api/auth.js'
import Button      from '../components/ui/Button.jsx'
import Input       from '../components/ui/Input.jsx'
import Alert       from '../components/ui/Alert.jsx'
import DeptSelector from '../components/forms/DeptSelector.jsx'
import { extractError } from '../hooks/useApi.js'

function Step1({ onDone }) {
  const { register } = useAuth()
  const [f, setF]    = useState({ roll_number:'', name:'', email:'', department:'', password:'', password2:'' })
  const [loading, setLoad] = useState(false)
  const [error,   setError]= useState('')
  const set = k => e => setF(p => ({...p, [k]: e.target.value}))

  const submit = async (e) => {
    e.preventDefault(); setError('')
    const missing = ['roll_number','name','email','department','password','password2'].find(k => !f[k])
    if (missing)               { setError('All fields are required.'); return }
    if (f.password !== f.password2) { setError('Passwords do not match.'); return }
    if (f.password.length < 8)      { setError('Password must be at least 8 characters.'); return }
    setLoad(true)
    try   { const d = await register(f); onDone({ roll_number:d.roll_number, email:f.email, dev_otp:d.dev_otp }) }
    catch (err) { setError(extractError(err)) }
    finally { setLoad(false) }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
      <p className="text-sm text-slate-400 mb-7">Register with your university credentials</p>

      <Alert type="error" message={error} onClose={() => setError('')}/>

      <form onSubmit={submit} className="space-y-4 mt-5">
        <Input label="Roll Number" icon={<CreditCard size={15}/>}
          placeholder="SU72-BSSEM-F25-017" hint="Format: SU##-DEPT-X##-###"
          value={f.roll_number} onChange={e => setF(p=>({...p,roll_number:e.target.value.toUpperCase()}))}
          mono required/>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Full Name"     icon={<User size={15}/>}  placeholder="Ali Hassan"       value={f.name}  onChange={set('name')}  required/>
          <Input label="Email Address" icon={<Mail size={15}/>}  type="email" placeholder="ali@su.edu.pk" value={f.email} onChange={set('email')} required/>
        </div>

        <DeptSelector value={f.department} onChange={v => setF(p=>({...p,department:v}))}/>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Password"         icon={<KeyRound size={15}/>} type="password" placeholder="Min. 8 chars" value={f.password}  onChange={set('password')}  required/>
          <Input label="Confirm Password" icon={<KeyRound size={15}/>} type="password" placeholder="Repeat"       value={f.password2} onChange={set('password2')} required/>
        </div>

        <Button type="submit" size="lg" loading={loading} fullWidth>
          Create Account →
        </Button>
      </form>
    </>
  )
}

function Step2({ rollNumber, email, devOtp }) {
  const { verifyEmail } = useAuth()
  const [otp,       setOtp]      = useState(devOtp || '')
  const [loading,   setLoad]     = useState(false)
  const [error,     setError]    = useState('')
  const [resending, setResend]   = useState(false)
  const [okMsg,     setOkMsg]    = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit code.'); return }
    setLoad(true)
    try   { await verifyEmail(rollNumber, otp) }
    catch (err) { setError(extractError(err)) }
    finally { setLoad(false) }
  }

  const resend = async () => {
    setResend(true)
    try   { await authAPI.resendOtp(rollNumber); setOkMsg('New code sent!') }
    catch (err) { setError(extractError(err)) }
    finally { setResend(false) }
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-accent-500/15 border border-accent-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-accent-400"/>
        </div>
        <h2 className="text-2xl font-bold text-white">Check your email</h2>
        <p className="text-sm text-slate-400 mt-1">Code sent to <span className="text-white font-medium">{email}</span></p>
      </div>

      {/* Roll number reminder */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 mb-5">
        <CreditCard size={14} className="text-accent-400 shrink-0"/>
        <div>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Roll Number</p>
          <p className="text-sm font-mono font-bold text-accent-400 tracking-wider">{rollNumber}</p>
        </div>
      </div>

      {okMsg && <Alert type="success" message={okMsg}/>}
      <Alert type="error" message={error} onClose={() => setError('')}/>

      <form onSubmit={submit} className="space-y-4 mt-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            6-Digit Code
          </label>
          <input
            type="text" inputMode="numeric" maxLength={6}
            placeholder="0  0  0  0  0  0"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
            className="w-full py-4 px-4 text-center text-2xl font-mono font-bold tracking-[0.5em] bg-surface-900 border border-surface-600 text-white rounded-xl outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
          />
          <p className="text-xs text-slate-600 text-center mt-1.5">Expires in 10 minutes</p>
        </div>

        <Button type="submit" size="lg" loading={loading} disabled={otp.length!==6} fullWidth>
          <CheckCircle2 size={16}/> Verify & Login
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Didn't receive it?{' '}
        <button onClick={resend} disabled={resending}
          className="text-accent-400 font-semibold hover:text-accent-300 transition-colors disabled:opacity-50">
          {resending ? 'Sending…' : 'Resend code'}
        </button>
      </p>

      {devOtp && (
        <div className="mt-5 p-4 rounded-xl bg-amber-400/8 border border-amber-400/20 text-center">
          <p className="text-xs text-amber-400 font-semibold mb-1">Dev Mode — OTP:</p>
          <p className="text-2xl font-mono font-bold text-amber-300 tracking-[0.4em]">{devOtp}</p>
        </div>
      )}
    </>
  )
}

export default function Signup({ onSwitch }) {
  const [step,    setStep]    = useState(1)
  const [otpData, setOtpData] = useState(null)

  const steps = ['Register', 'Verify Email']

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-surface-900 border-r border-surface-600 p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center">
              <Layers size={18} className="text-white"/>
            </div>
            <span className="font-bold text-lg text-white">UniGroups</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Join your<br/>university<br/>groups.
          </h1>
          {/* Step indicators */}
          <div className="space-y-4 mt-8">
            {steps.map((label, i) => {
              const done    = step > i + 1
              const current = step === i + 1
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                    done    ? 'bg-green-500 text-white' :
                    current ? 'bg-accent-500 text-white' :
                              'bg-surface-700 text-slate-500'
                  ].join(' ')}>
                    {done ? '✓' : i+1}
                  </div>
                  <span className={`text-sm font-medium ${current ? 'text-white' : done ? 'text-green-400' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-slate-600">Superior University · GMS</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-in" style={{ animationFillMode:'both' }}>
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center">
              <Layers size={16} className="text-white"/>
            </div>
            <span className="font-bold text-white">UniGroups</span>
          </div>

          {step === 1
            ? <Step1 onDone={d => { setOtpData(d); setStep(2) }}/>
            : <Step2 rollNumber={otpData.roll_number} email={otpData.email} devOtp={otpData.dev_otp}/>
          }

          {step === 1 && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-surface-600"/>
                <span className="text-xs text-slate-600">or</span>
                <div className="h-px flex-1 bg-surface-600"/>
              </div>
              <p className="text-center text-sm text-slate-400">
                Already registered?{' '}
                <button onClick={onSwitch}
                  className="text-accent-400 font-semibold hover:text-accent-300 transition-colors">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
