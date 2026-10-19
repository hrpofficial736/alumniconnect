import { useState } from 'react'
import { FaGoogle, FaUserGraduate, FaBriefcase, FaUserShield } from 'react-icons/fa'
import { useSignIn, useSignUp } from '@clerk/react'
import { useNavigate } from 'react-router'

type AuthMode = 'login' | 'signup'
type UserRole = 'student' | 'alumni' | 'admin'

const roles: {
  id: UserRole
  label: string
  icon: React.ReactNode
  placeholder: string
  tagline: string
}[] = [
    {
      id: 'student',
      label: 'Student',
      icon: <FaUserGraduate className="h-4 w-4" />,
      placeholder: 'student@college.edu',
      tagline: 'Log in or sign up as a current student.',
    },
    {
      id: 'alumni',
      label: 'Alumni',
      icon: <FaBriefcase className="h-4 w-4" />,
      placeholder: 'name@company.com',
      tagline: 'Log in or sign up as a graduated alumni.',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <FaUserShield className="h-4 w-4" />,
      placeholder: 'admin@institution.edu',
      tagline: 'Log in or sign up as institution staff.',
    },
  ]

const features = [
  'Verified alumni and student accounts',
  'Google or institutional email authentication',
  'Quick access to mentorship and directory tools',
]

export const AuthPage = () => {
  const [role, setRole] = useState<UserRole>('student')
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const navigate = useNavigate()

  const activeRole = roles.find((r) => r.id === role)!

  const resetForm = () => {
    setError(null)
    setVerifying(false)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setCode('')
  }

  const switchRole = (next: UserRole) => {
    setRole(next)
    resetForm()
    setMode('login')
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    resetForm()
  }

  const handleGoogleAuth = async () => {
    setError(null)
    try {
      if (mode === 'login') {
        const { error: err } = await signIn!.sso({
          strategy: 'oauth_google',
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectCallbackUrl: `${window.location.origin}/auth`,
        })
        if (err) setError(err.longMessage ?? err.message)
      } else {
        const { error: err } = await signUp!.sso({
          strategy: 'oauth_google',
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectCallbackUrl: `${window.location.origin}/auth`,
          unsafeMetadata: { role },
        })
        if (err) setError(err.longMessage ?? err.message)
      }
    } catch {
      setError('Google sign-in failed. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error: err } = await signIn!.password({ identifier: email, password })
        if (err) { setError(err.longMessage ?? err.message); return }
        if (signIn!.status === 'complete') {
          await signIn!.finalize()
          navigate('/dashboard')
        }
      } else {
        if (password !== confirmPassword) {
          setError("Passwords don't match.")
          return
        }
        const { error: signUpErr } = await signUp!.password({
          emailAddress: email,
          password,
          unsafeMetadata: { role },
        })
        if (signUpErr) { setError(signUpErr.longMessage ?? signUpErr.message); return }

        const { error: sendErr } = await signUp!.verifications.sendEmailCode()
        if (sendErr) { setError(sendErr.longMessage ?? sendErr.message); return }

        setVerifying(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await signUp!.verifications.verifyEmailCode({ code })
      if (err) { setError(err.longMessage ?? err.message); return }
      if (signUp!.status === 'complete') {
        await signUp!.finalize()
        navigate('/dashboard')
      }
    } catch {
      setError('Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#23392f]">
      <div className="mx-auto grid min-h-screen max-w-7xl overflow-hidden lg:grid-cols-[1fr_0.95fr]">

        {/* ── Left panel ── */}
        <section className="relative flex flex-col justify-between border-r border-[#e3eadf] px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(36,84,63,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(174,205,180,0.18),transparent_25%)]" />

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#24543f] text-white shadow-[0_12px_30px_rgba(36,84,63,0.18)]">
                <span className="text-base font-bold">A</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#23392f]">AlumniConnect</p>
                <p className="text-sm text-[#66746a]">Secure access for students, alumni, and staff</p>
              </div>
            </div>

            <div className="mt-16 max-w-xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#24543f]">Authentication</p>
              <h1 className="font-serif text-5xl leading-[1.05] text-[#23392f] sm:text-6xl">
                Sign in to a verified alumni network.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-[#5f6b61]">
                Use your college email or Google account to access a trusted alumni platform built for
                mentorship, directory search, and admin reporting.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {features.map((item) => (
                <div key={item} className="rounded-2xl border border-[#e3eadf] bg-white/75 p-4 shadow-[0_10px_24px_rgba(23,61,45,0.05)] backdrop-blur">
                  <p className="text-sm leading-6 text-[#3e4d43]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-[#e3eadf] bg-white p-6 shadow-[0_18px_50px_rgba(23,61,45,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24543f]">Why this works</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f4f7f2] p-4">
                <p className="text-sm font-semibold text-[#23392f]">One account</p>
                <p className="mt-2 text-sm leading-6 text-[#66746a]">
                  Reduce duplicate profiles and keep access tied to verified identities.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f4f7f2] p-4">
                <p className="text-sm font-semibold text-[#23392f]">Fast onboarding</p>
                <p className="mt-2 text-sm leading-6 text-[#66746a]">
                  Let alumni and staff enter the platform quickly with familiar sign-in methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Right panel ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md rounded-4xl border border-[#e3eadf] bg-white p-6 shadow-[0_24px_80px_rgba(23,61,45,0.08)] sm:p-8">

            {verifying ? (
              /* ── Email verification step ── */
              <>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-[#23392f]">Check your email</h2>
                  <p className="text-sm leading-6 text-[#66746a]">
                    We sent a verification code to{' '}
                    <span className="font-medium text-[#23392f]">{email}</span>.
                    Enter it below to complete sign-up.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#23392f]">Verification code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full rounded-2xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
                    />
                  </label>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !code}
                    className="w-full cursor-pointer rounded-2xl bg-[#24543f] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(36,84,63,0.2)] transition hover:bg-[#1d4332] disabled:opacity-50"
                  >
                    {loading ? 'Verifying…' : 'Verify email'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#66746a]">
                  Wrong email?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="cursor-pointer font-semibold text-[#24543f]"
                  >
                    Go back
                  </button>
                </p>
              </>
            ) : (
              /* ── Role tabs + Login / Sign-up form ── */
              <>
                {/* Role tabs */}
                <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-[#e3eadf] bg-[#f7faf5] p-1.5">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => switchRole(r.id)}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${role === r.id
                        ? 'bg-white text-[#24543f] shadow-[0_2px_8px_rgba(23,61,45,0.1)]'
                        : 'text-[#8fa68e] hover:text-[#3e5c42]'
                        }`}
                    >
                      {r.icon}
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Auth mode toggle */}
                <div className="mt-4 flex rounded-full bg-[#f0f4ec] p-1 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`flex-1 cursor-pointer rounded-full px-4 py-2 transition ${mode === 'login' ? 'bg-[#24543f] text-white shadow-sm' : 'text-[#66746a]'
                      }`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className={`flex-1 cursor-pointer rounded-full px-4 py-2 transition ${mode === 'signup' ? 'bg-[#24543f] text-white shadow-sm' : 'text-[#66746a]'
                      }`}
                  >
                    Sign up
                  </button>
                </div>

                {/* Heading */}
                <div className="mt-5 space-y-1">
                  <h2 className="text-2xl font-semibold text-[#23392f]">
                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-sm leading-6 text-[#66746a]">{activeRole.tagline}</p>
                </div>

                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="mt-5 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#dce5d8] bg-white px-4 py-3 text-sm font-semibold text-[#23392f] transition hover:bg-[#f8faf6] disabled:opacity-50"
                >
                  <FaGoogle className="h-4 w-4 text-black" aria-hidden="true" />
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#97a398]">
                  <span className="h-px flex-1 bg-[#e6ece0]" />
                  <span>or use email</span>
                  <span className="h-px flex-1 bg-[#e6ece0]" />
                </div>

                {/* Email / password form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#23392f]">Email address</span>
                    <input
                      type="email"
                      placeholder={activeRole.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#23392f]">Password</span>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
                    />
                  </label>

                  {mode === 'signup' && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#23392f]">Confirm password</span>
                      <input
                        type="password"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
                      />
                    </label>
                  )}

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-2xl bg-[#24543f] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(36,84,63,0.2)] transition hover:bg-[#1d4332] disabled:opacity-50"
                  >
                    {loading
                      ? mode === 'login' ? 'Logging in…' : 'Creating account…'
                      : mode === 'login'
                        ? `Log in as ${activeRole.label}`
                        : `Sign up as ${activeRole.label}`}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#66746a]">
                  {mode === 'login' ? 'Need an account? ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                    className="cursor-pointer font-semibold text-[#24543f]"
                  >
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
