import { HandleSSOCallback } from '@clerk/react'
import { useNavigate } from 'react-router'

export const SSOCallback = () => {
  const navigate = useNavigate()

  return (
    <HandleSSOCallback
      navigateToApp={({ decorateUrl }) => {
        const destination = decorateUrl('/dashboard')
        if (destination.startsWith('http')) {
          window.location.href = destination
        } else {
          navigate(destination)
        }
      }}
      navigateToSignIn={() => navigate('/auth')}
      navigateToSignUp={() => navigate('/auth')}
    />
  )
}
