import { useState }   from 'react'
import { Layers, CreditCard, KeyRound, ArrowRight } from 'lucide-react'
import { useAuth }    from '../context/AuthContext.jsx'
import { authAPI }    from '../api/auth.js'
import Button  from '../components/ui/Button.jsx'
import Input   from '../components/ui/Input.jsx'
import Alert   from '../components/ui/Alert.jsx'
import { extractError } from '../hooks/useApi.js'

export default function Login({ onSwitch }) {
  const { login }   = useAuth()
  const [roll,      setRoll]      = useState('')
  const [pass,      setPass]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [unverified,setUnverified]= useState(false)
  const [resending, setResending] = useState(false)
  const [okMsg,     setOkMsg]     = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setUnverified(false); setOkMsg('')
    if (!roll || !pass) { setError('All fields required.'); return }
    setLoading(true)
    try   { await login(roll.toUpperCase().trim(), pass) }
    catch (err) {
      if (err.response?.data?.unverified) { setUnverified(true); setError('Email not verified. Check your inbox.') }
      else setError(extractError(err))
    }
    finally { setLoading(false) }
  }

  const resend = async () => {
    setResending(true); setError(''); setOkMsg('')
    try   { await authAPI.resendOtp(roll.toUpperCase().trim()); setOkMsg('New code sent! Check your email.') }
    catch (err) { setError(extractError(err)) }
    finally { setResending(false) }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* ── LEFT PANEL — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-surface-900 border-r border-surface-600 p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center">
              <Layers size={18} className="text-white"/>
            </div>
            <span className="font-bold text-lg text-white">UniGroups</span>
          </div>
          <h1 className="text-6xl font-bold text-white leading-tight mb-4">
            Welcome<br/>back.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Superior University<br/>Group Management System
          </p>
        </div>
        <div className="space-y-3">
          {[{ dot:'bg-orange-400', label:'Software Engineering' },
            { dot:'bg-cyan-400',   label:'Computer Science'     }].map(d => (
            <div key={d.label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${d.dot}`}/>
              <span className="text-xs font-medium text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-slide-in" style={{ animationFillMode:'both' }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center">
              <Layers size={16} className="text-white"/>
            </div>
            <span className="font-bold text-white">UniGroups</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-400 mb-7">Use your university roll number</p>

          {okMsg && <Alert type="success" message={okMsg}/>}
          <Alert type="error" message={error} onClose={() => { setError(''); setUnverified(false) }}/>

          {/* Unverified nudge */}
          {unverified && (
            <div className="mt-3 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-400/8 border border-amber-400/20">
              <span className="text-xs text-amber-400 font-medium">Email not verified</span>
              <Button variant="ghost" size="sm" loading={resending} onClick={resend}
                className="!text-amber-400 hover:!bg-amber-400/10 text-xs">
                Resend code
              </Button>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4 mt-5">
            {/* Roll number — mono font */}
            <Input
              label="Roll Number"
              icon={<CreditCard size={15}/>}
              placeholder="SU72-BSSEM-F25-017"
              value={roll}
              onChange={e => setRoll(e.target.value.toUpperCase())}
              mono
              required
            />
            <Input
              label="Password"
              icon={<KeyRound size={15}/>}
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />

            <Button type="submit" size="lg" loading={loading} fullWidth className="mt-2">
              Sign In <ArrowRight size={16}/>
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-surface-600"/>
            <span className="text-xs text-slate-600">or</span>
            <div className="h-px flex-1 bg-surface-600"/>
          </div>

          <p className="text-center text-sm text-slate-400">
            New student?{' '}
            <button onClick={onSwitch}
              className="text-accent-400 font-semibold hover:text-accent-300 transition-colors">
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
