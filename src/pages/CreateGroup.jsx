import { useState, useEffect }  from 'react'
import { PlusCircle, Hash, FileText, CheckCircle2 } from 'lucide-react'
import { useApp }       from '../context/AppContext.jsx'
import { useAuth }      from '../context/AuthContext.jsx'
import { groupsAPI }    from '../api/groups.js'
import { authAPI }      from '../api/auth.js'
import Button           from '../components/ui/Button.jsx'
import Input            from '../components/ui/Input.jsx'
import Alert            from '../components/ui/Alert.jsx'
import Card             from '../components/ui/Card.jsx'
import DeptSelector     from '../components/forms/DeptSelector.jsx'
import MemberPicker     from '../components/forms/MemberPicker.jsx'
import { extractError } from '../hooks/useApi.js'

function SuccessScreen({ groupName, memberCount, onReset, onGo }) {
  return (
    <div className="max-w-sm mx-auto text-center py-16 animate-slide-up" style={{ animationFillMode:'both' }}>
      <div className="w-20 h-20 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={36} className="text-green-400"/>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Group Created! 🎉</h2>
      <p className="text-slate-400 text-sm mb-1">
        <span className="text-white font-semibold">"{groupName}"</span> is now live.
      </p>
      {memberCount > 1 && (
        <p className="text-accent-400 text-sm font-medium">{memberCount} members added</p>
      )}
      <div className="flex gap-3 justify-center mt-8">
        <Button onClick={onGo}>View My Groups</Button>
        <Button variant="secondary" onClick={onReset}>Create Another</Button>
      </div>
    </div>
  )
}

export default function CreateGroup() {
  const { navigate }                = useApp()
  const { user, isAdmin }           = useAuth()
  const studentDept                 = !isAdmin ? user?.department : null

  const [form, setForm]             = useState({ name:'', department:studentDept||'', max_members:'', description:'' })
  const [people,      setPeople]    = useState([])
  const [selected,    setSelected]  = useState([])
  const [loadingPpl,  setLoadPpl]   = useState(false)
  const [loading,     setLoading]   = useState(false)
  const [done,        setDone]      = useState(false)
  const [createdGroup,setCreated]   = useState(null)
  const [error,       setError]     = useState('')

  const set = k => e => setForm(p => ({...p, [k]: e.target.value}))
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id])

  // Load people when dept is known
  useEffect(() => {
    const dept = form.department
    if (!dept) return
    setLoadPpl(true); setSelected([])
    const fn = isAdmin ? authAPI.getStudentsByDept(dept) : authAPI.classmates()
    fn.then(r => setPeople(isAdmin ? r.data.users||[] : r.data.classmates||[]))
      .catch(console.error)
      .finally(() => setLoadPpl(false))
  }, [form.department, isAdmin])

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.name.trim()) { setError('Group name is required.'); return }
    if (!form.department)  { setError('Please select a department.'); return }
    const max = parseInt(form.max_members)
    if (!max || max < 2 || max > 20) { setError('Max members must be between 2 and 20.'); return }
    setLoading(true)
    try {
      const r = await groupsAPI.create({ name:form.name.trim(), department:form.department, max_members:max, description:form.description.trim(), member_ids:selected })
      setCreated(r.data.group); setDone(true)
    } catch (err) { setError(extractError(err)) }
    finally { setLoading(false) }
  }

  const reset = () => { setForm({ name:'', department:studentDept||'', max_members:'', description:'' }); setSelected([]); setDone(false); setError(''); setCreated(null) }

  if (done) return <SuccessScreen groupName={form.name} memberCount={createdGroup?.member_count} onReset={reset} onGo={() => navigate('my-groups')}/>

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create a Group</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isAdmin ? 'Admin: choose any department and add students' : 'Pick classmates and start a team'}
        </p>
      </div>

      <Card>
        <Alert type="error" message={error} onClose={() => setError('')}/>

        <form onSubmit={submit} className={`space-y-5 ${error ? 'mt-4' : ''}`} noValidate>
          {/* Department selector */}
          <DeptSelector
            value={form.department}
            onChange={v => setForm(p => ({...p, department:v}))}
            locked={!isAdmin}
            lockedDept={studentDept}
          />

          {/* Name + Max members */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Group Name" placeholder="Alpha Dev Squad"
              value={form.name} onChange={set('name')} required className="col-span-2"/>
            <Input label="Max Members" type="number" placeholder="5" hint="2–20"
              value={form.max_members} onChange={set('max_members')} min={2} max={20} required/>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Description <span className="text-slate-600 font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <FileText size={14} className="absolute left-3.5 top-3.5 text-slate-600 pointer-events-none"/>
              <textarea rows={2} placeholder="What is this group working on?"
                value={form.description} onChange={set('description')}
                className="w-full pl-10 pr-4 py-3 text-sm bg-surface-900 border border-surface-600 text-slate-100 placeholder-slate-600 rounded-xl outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all resize-none"/>
            </div>
          </div>

          {/* Member picker */}
          {(form.department || studentDept) && (
            <MemberPicker people={people} selected={selected} onToggle={toggle}
              dept={form.department || studentDept} loading={loadingPpl}/>
          )}

          {/* Info note */}
          <div className="px-4 py-3 rounded-xl bg-accent-500/8 border border-accent-500/15">
            <p className="text-xs text-slate-400">
              {isAdmin
                ? '🛡️ Admin mode — you will be assigned as group leader'
                : '⭐ You will be the Group Leader · selected classmates join immediately'}
            </p>
          </div>

          <Button type="submit" size="lg" loading={loading}
            disabled={!form.name || !form.department || !form.max_members} fullWidth>
            <PlusCircle size={16}/> Create Group
          </Button>
        </form>
      </Card>
    </div>
  )
}
