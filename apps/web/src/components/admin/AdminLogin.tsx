import { LogIn } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { AdminCredentials } from '../../features/admin/admin-orders'

export function AdminLogin({ onLogin, message, busy }: { onLogin: (credentials: AdminCredentials) => void; message: string; busy: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); onLogin({ email, password }) }
  return <main className="min-h-screen bg-[#F7F4EF] px-4 py-10 sm:grid sm:place-items-center">
    <section className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#DDD4C9] bg-white shadow-[0_32px_90px_rgba(34,29,31,.12)]">
      <div className="border-b border-[#E7DED4] bg-[#302A2E] px-7 py-8 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#C4943D]">Casa de Perla</p>
        <h1 className="display mt-3 text-4xl font-semibold">Atelier privé</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">Gérez vos bijoux et vos commandes depuis un seul espace.</p>
      </div>
      <form onSubmit={submit} className="space-y-5 p-7">
        <label className="block text-[10px] font-bold uppercase tracking-[.16em]">Adresse administrateur<input className="field mt-2" type="email" autoComplete="username" placeholder="Adresse e-mail" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="block text-[10px] font-bold uppercase tracking-[.16em]">Mot de passe<input className="field mt-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {message && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
        <button disabled={busy} className="button-primary button-accent w-full disabled:opacity-60"><LogIn size={16} />{busy ? 'Connexion…' : 'Ouvrir l’atelier'}</button>
      </form>
    </section>
  </main>
}
