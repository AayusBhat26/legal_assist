'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebaseClient'
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && auth && !window.recaptchaVerifier) {
  //     console.log('Initializing RecaptchaVerifier', auth);
  //     auth.settings.appVerificationDisabledForTesting = true;
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       'recaptcha-container',
  //       {
  //         size: 'invisible',
  //         callback: (response) => {
  //           console.log('Recaptcha solved', response)
  //         },
  //         // Disable app verification for testing; remove this for production
  //         // : true
  //       },
  //       auth
  //     )
  //   }
  // }, [auth])

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  const handlePhoneSignIn = async () => {
    if (!phoneNumber) return
    try {
      const appVerifier = window.recaptchaVerifier
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      setConfirmationResult(result)
      console.log('OTP sent')
    } catch (error) {
      console.error('Phone sign-in error:', error)
    }
  }

  const verifyOtp = async () => {
    if (!otp || !confirmationResult) return
    try {
      await confirmationResult.confirm(otp)
      router.push('/')
    } catch (error) {
      console.error('OTP verification error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-slate-700 text-white p-2 rounded hover:bg-slate-800 mb-4 transition-colors"
        >
          Sign in with Google
        </button>
        <div className="text-center my-4">or</div>
        <div className="mb-4">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          onClick={handlePhoneSignIn}
          className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 mb-4 transition-colors"
        >
          Send OTP
        </button>
        {confirmationResult && (
          <div className="mb-4">
            <input 
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button 
              onClick={verifyOtp}
              className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700 mt-2 transition-colors"
            >
              Verify OTP
            </button>
          </div>
        )}
        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  )
}
