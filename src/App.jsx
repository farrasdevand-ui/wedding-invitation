import { useState } from 'react'
import CoverScreen from './components/CoverScreen'
import InvitationPage from './components/InvitationPage'
import './App.css'

function App() {
  const [isOpening, setIsOpening] = useState(false)
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)

  const handleOpenInvitation = () => {
    setIsOpening(true)

    window.setTimeout(() => {
      setIsInvitationOpen(true)
    }, 700)
  }

  if (!isInvitationOpen) {
    return (
      <div
        className={
          isOpening
            ? 'cover-wrapper is-opening'
            : 'cover-wrapper'
        }
      >
        <CoverScreen onOpen={handleOpenInvitation} />
      </div>
    )
  }

  return <InvitationPage />
}

export default App
