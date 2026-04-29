import { useState, useCallback } from 'react'

export function useApi(apiFn) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const execute = useCallback(async (...args) => {
    setLoading(true); setError(null)
    try { const r = await apiFn(...args); return r.data }
    catch (e) { setError(extractError(e)); throw e }
    finally { setLoading(false) }
  }, [apiFn])
  return { execute, loading, error, setError }
}

export function extractError(err) {
  if (!err.response) return 'Network error — is Django running on :8000?'
  const d = err.response.data
  if (!d) return `Error ${err.response.status}`
  if (d.errors) return Object.entries(d.errors).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join(' · ')
  if (d.message) return d.message
  if (d.detail)  return d.detail
  if (typeof d === 'string') return d
  return `Error ${err.response.status}`
}
