import { useEffect, useState } from 'react'
import { Search, RefreshCw, UserPlus, X, Check, Pencil, ShieldCheck, ShieldX } from 'lucide-react'
import { useAuth }      from '../context/AuthContext.jsx'
import { useApp }       from '../context/AppContext.jsx'
import { authAPI }      from '../api/auth.js'
import Button           from '../components/ui/Button.jsx'
import Input            from '../components/ui/Input.jsx'
import Alert            from '../components/ui/Alert.jsx'
import Badge            from '../components/ui/Badge.jsx'
import Avatar           from '../components/ui/Avatar.jsx'
import Skeleton         from '../components/ui/Skeleton.jsx'
import EmptyState       from '../components/ui/EmptyState.jsx'
import Card             from '../components/ui/Card.jsx'
import DeptSelector     from '../components/forms/DeptSelector.jsx'
import { extractError } from '../hooks/useApi.js'

/* ── Add Student Modal ─────────────────────────────────────────────────── */
function AddStudentModal({ onClose, onDone }) {
  const [f, setF]          = useState({ roll_number:'', name:'', email:'', department:'SE', password:'', password2:'' })
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')
  const set = k => e => setF(p => ({...p, [k]: e.target.value}))

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (f.password !== f.password2) { setError('Passwords do not match.'); return }
    setLoad(true)
    try {
      await authAPI.register({ ...f, roll_number: f.roll_number.toUpperCase().trim() })
      const list = await authAPI.listUsers({ role:'student' })
      const nu   = list.data.users.find(u => u.roll_number === f.roll_number.toUpperCase().trim())
      if (nu) await authAPI.updateUser(nu.id, { is_verified:true, department:f.department })
      onDone(); onClose()
    } catch (err) { setError(extractError(err)) }
    finally { setLoad(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      style={{ animationFillMode:'both' }}>
      <div className="w-full max-w-md bg-surface-900 border border-surface-600 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ animationFillMode:'both' }}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600">
          <div>
            <h2 className="font-bold text-lg text-white">Add New Student</h2>
            <p className="text-xs text-slate-500 mt-0.5">Account will be auto-verified</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-700 transition-all">
            <X size={18}/>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Alert type="error" message={error} onClose={() => setError('')}/>

          {/* Roll number */}
          <Input label="Roll Number" placeholder="SU72-BSSEM-F25-017"
            hint="Format: SU##-DEPT-X##-###"
            value={f.roll_number}
            onChange={e => setF(p => ({...p, roll_number:e.target.value.toUpperCase()}))}
            mono required/>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name"     placeholder="Ali Hassan"         value={f.name}  onChange={set('name')}  required/>
            <Input label="Email"         type="email" placeholder="ali@su.edu.pk" value={f.email} onChange={set('email')} required/>
          </div>

          <DeptSelector value={f.department} onChange={v => setF(p=>({...p,department:v}))}/>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Password"  type="password" placeholder="min 8" value={f.password}  onChange={set('password')}  required/>
            <Input label="Confirm"   type="password" placeholder="repeat" value={f.password2} onChange={set('password2')} required/>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" loading={loading} fullWidth onClick={submit}>
              <UserPlus size={14}/> Add Student
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="shrink-0">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Edit Department Modal ──────────────────────────────────────────────── */
function EditDeptModal({ user, onClose, onSaved }) {
  const [dept,    setDept]  = useState(user.department || 'SE')
  const [loading, setLoad]  = useState(false)
  const [error,   setError] = useState('')

  const save = async () => {
    setLoad(true); setError('')
    try { await authAPI.updateUser(user.id, { department:dept }); onSaved(); onClose() }
    catch (err) { setError(extractError(err)) }
    finally { setLoad(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      style={{ animationFillMode:'both' }}>
      <div className="w-full max-w-sm bg-surface-900 border border-surface-600 rounded-2xl shadow-2xl animate-slide-up"
        style={{ animationFillMode:'both' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600">
          <div>
            <h2 className="font-bold text-lg text-white">Edit Department</h2>
            <p className="text-xs font-mono text-accent-400 mt-0.5">{user.roll_number} — {user.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-700 transition-all">
            <X size={18}/>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Alert type="error" message={error} onClose={() => setError('')}/>
          <DeptSelector value={dept} onChange={setDept}/>
          <div className="flex gap-3">
            <Button loading={loading} onClick={save} fullWidth>Save Changes</Button>
            <Button variant="secondary" onClick={onClose} className="shrink-0">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main AdminUsers page ───────────────────────────────────────────────── */
const DEPT_TABS = [
  { k:'all', l:'All'                  },
  { k:'SE',  l:'SE',  dot:'bg-orange-400' },
  { k:'CS',  l:'CS',  dot:'bg-cyan-400'   },
  { k:'',    l:'None'                 },
]

export default function AdminUsers() {
  const { isAdmin }              = useAuth()
  const { navigate }             = useApp()
  const [users,    setUsers]     = useState([])
  const [loading,  setLoading]   = useState(true)
  const [deptTab,  setDeptTab]   = useState('all')
  const [query,    setQuery]     = useState('')
  const [error,    setError]     = useState('')
  const [ok,       setOk]        = useState('')
  const [showAdd,  setShowAdd]   = useState(false)
  const [editUser, setEditUser]  = useState(null)
  const [changing, setChanging]  = useState(null)
  const [deleting, setDeleting]  = useState(null)

  const fetchUsers = () => {
    setLoading(true)
    const p = {}
    if (deptTab !== 'all') p.dept = deptTab
    authAPI.listUsers(p)
      .then(r => setUsers(r.data.users || []))
      .catch(e => setError(extractError(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!isAdmin) { navigate('dashboard'); return }
    fetchUsers()
  }, [isAdmin, deptTab])

  const toggleRole = async (u) => {
    setChanging(u.id); setError(''); setOk('')
    try {
      await authAPI.updateUser(u.id, { role: u.role === 'admin' ? 'student' : 'admin' })
      setOk(`${u.name} role updated.`); fetchUsers()
    } catch (e) { setError(extractError(e)) }
    finally { setChanging(null) }
  }

  const del = async (u) => {
    if (!window.confirm(`Delete ${u.roll_number}? This cannot be undone.`)) return
    setDeleting(u.id)
    try { await authAPI.deleteUser(u.id); setOk(`${u.name} deleted.`); fetchUsers() }
    catch (e) { setError(extractError(e)) }
    finally { setDeleting(null) }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.roll_number.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  )

  const seCnt    = users.filter(u => u.department === 'SE').length
  const csCnt    = users.filter(u => u.department === 'CS').length
  const unCnt    = users.filter(u => !u.department).length
  const unverCnt = users.filter(u => !u.is_verified).length

  return (
    <div className="space-y-8">
      {showAdd  && <AddStudentModal onClose={() => setShowAdd(false)} onDone={fetchUsers}/>}
      {editUser && <EditDeptModal user={editUser} onClose={() => setEditUser(null)} onSaved={fetchUsers}/>}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">🛡️ Manage Students</h1>
          <p className="text-sm text-slate-400 mt-1">Add students, assign departments, manage roles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchUsers}><RefreshCw size={14}/></Button>
          <Button onClick={() => setShowAdd(true)}><UserPlus size={15}/> Add Student</Button>
        </div>
      </div>

      <Alert type="error"   message={error} onClose={() => setError('')}/>
      <Alert type="success" message={ok}/>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'SE Students',  count:seCnt,    color:'text-orange-400', bg:'bg-orange-400/10 border-orange-400/20' },
          { label:'CS Students',  count:csCnt,    color:'text-cyan-400',   bg:'bg-cyan-400/10 border-cyan-400/20'     },
          { label:'Unassigned',   count:unCnt,    color:'text-slate-400',  bg:'bg-surface-800 border-surface-600'     },
          { label:'Unverified',   count:unverCnt, color:'text-amber-400',  bg:'bg-amber-400/10 border-amber-400/20'   },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${count > 0 ? color : 'text-surface-600'}`}>{count}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Dept filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-800 border border-surface-600 w-fit">
        {DEPT_TABS.map(({ k, l, dot }) => (
          <button key={k} onClick={() => setDeptTab(k)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              deptTab === k
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/25'
                : 'text-slate-400 hover:text-white hover:bg-surface-700'
            }`}>
            {dot && <div className={`w-1.5 h-1.5 rounded-full ${dot}`}/>}
            {l}
          </button>
        ))}
      </div>

      {/* Search */}
      <Input icon={<Search size={14}/>}
        placeholder="Search by name, roll number, or email…"
        value={query} onChange={e => setQuery(e.target.value)}/>

      {!loading && (
        <p className="text-xs text-slate-500 font-medium">
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Student list */}
      {loading ? (
        <div className="space-y-2">{Array(5).fill(0).map((_,i) => <Skeleton key={i} className="h-24"/>)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👤" title="No students found"
          action={<Button size="sm" onClick={() => setShowAdd(true)}><UserPlus size={13}/> Add Student</Button>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(u => {
            const initials  = u.name.split(' ').map(w=>w[0]).join('').slice(0,2)
            const deptColor = u.department==='SE' ? 'text-orange-400' : u.department==='CS' ? 'text-cyan-400' : 'text-slate-500'
            const deptLabel = u.department==='SE' ? 'Software Engineering' : u.department==='CS' ? 'Computer Science' : null
            const deptStrip = u.department==='SE' ? 'border-l-2 border-orange-400' : u.department==='CS' ? 'border-l-2 border-cyan-400' : ''

            return (
              <Card key={u.id} className={`flex items-center gap-4 !py-3.5 ${deptStrip}`}>
                <Avatar initials={initials} dept={u.department} size="md"/>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-bold text-sm text-white">{u.name}</p>
                    {u.role === 'admin' && <Badge variant="admin">Admin</Badge>}
                    {u.is_verified
                      ? <Badge variant="success"><Check size={9}/> Verified</Badge>
                      : <Badge variant="warning">Unverified</Badge>
                    }
                  </div>
                  {/* Roll number — prominent */}
                  <p className="text-xs font-mono font-bold text-accent-400 tracking-wide">{u.roll_number}</p>
                  {deptLabel
                    ? <p className={`text-xs font-medium mt-0.5 ${deptColor}`}>{deptLabel}</p>
                    : <p className="text-xs text-slate-600 italic mt-0.5">No department assigned</p>
                  }
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setEditUser(u)}>
                    <Pencil size={12}/> Dept
                  </Button>
                  <Button
                    variant={u.role === 'admin' ? 'danger' : 'outline'} size="sm"
                    loading={changing === u.id}
                    onClick={() => toggleRole(u)}>
                    {u.role === 'admin'
                      ? <><ShieldX size={12}/> Revoke</>
                      : <><ShieldCheck size={12}/> Make Admin</>
                    }
                  </Button>
                  <Button variant="danger" size="sm" loading={deleting === u.id} onClick={() => del(u)}>
                    <X size={12}/>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
