import { useState } from 'react'
import CoverScreen from './components/CoverScreen'
import { invitationConfig } from './config/invitation'
import './App.css'

function App() {
  const [isOpening, setIsOpening] = useState(false)
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)

  const handleOpenInvitation = () => {
    setIsOpening(true)

    window.setTimeout(() => {
      setIsInvitationOpen(true)
      window.scrollTo(0, 0)
    }, 700)
  }

  if (!isInvitationOpen) {
    return (
      <div className={isOpening ? 'cover-wrapper is-opening' : 'cover-wrapper'}>
        <CoverScreen onOpen={handleOpenInvitation} />
      </div>
    )
  }

  return (
    <main className="invitation-page invitation-enter">
      <section className="hero-section">
        <p className="hero-label">The Wedding Of</p>

        <h1>{invitationConfig.coupleNames}</h1>

        <p className="hero-description">
          Dengan penuh kebahagiaan, kami mengundang Anda untuk
          merayakan hari pernikahan kami.
        </p>
      </section>
    </main>
  )
}

export default App
