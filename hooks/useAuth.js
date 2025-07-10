// hooks/useAuth.js
import { useState, useEffect } from 'react'
import { auth } from '../lib/firebaseClient'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let unsubscribe = () => {}
    
    try {
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
          setError(null)
        }, (error) => {
          console.error('Auth state change error:', error)
          setError(error.message)
          setLoading(false)
        })
      } else {
        console.warn('Firebase auth not properly initialized')
        setLoading(false)
        setError('Firebase authentication not available')
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
      setError('Failed to initialize authentication')
      setLoading(false)
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      setError(getFirebaseErrorMessage(error))
      throw error
    }
  }

  const register = async (email, password) => {
    try {
      setError(null)
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      setError(getFirebaseErrorMessage(error))
      throw error
    }
  }

  const logout = async () => {
    try {
      setError(null)
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }
      await signOut(auth)
    } catch (error) {
      setError(getFirebaseErrorMessage(error))
      throw error
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }
}

function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Firebase configuration error. Please contact support.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    default:
      return error.message || 'An authentication error occurred.'
  }
}
