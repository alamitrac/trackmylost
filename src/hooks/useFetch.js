import { useEffect, useState } from 'react'

/**
 * Run an async fetcher and track { data, loading, error }.
 * Re-runs when `deps` change. Call `reload()` to refetch manually.
 *
 * @param {() => Promise<any>} fetcher
 * @param {Array} deps
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    Promise.resolve(fetcher())
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return {
    ...state,
    reload: () => setNonce((n) => n + 1),
    setData: (data) => setState((s) => ({ ...s, data })),
  }
}

/** Human-readable message from an Axios error (prefers Laravel's `message`). */
export function errorMessage(error, fallback = 'Une erreur est survenue. Réessayez.') {
  if (!error) return fallback
  const res = error.response
  if (res?.data?.message) return res.data.message
  if (res?.data?.errors) {
    const first = Object.values(res.data.errors)[0]
    if (Array.isArray(first) && first[0]) return first[0]
  }
  if (error.code === 'ERR_NETWORK') return "Impossible de joindre le serveur. Vérifiez que l'API est démarrée."
  return error.message || fallback
}
