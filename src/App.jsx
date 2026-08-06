import { useRef, useState } from 'react'
import CoverScreen from './components/CoverScreen'
import InvitationPage from './components/InvitationPage'
import './App.css'

function App() {
  const audioRef = useRef(null)
  const [isOpening, setIsOpening] = useState(false)
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)

  const handleOpenInvitation = () => {
    const audio = audioRef.current

    if (audio) {
      audio.currentTime = 0
      audio.volume = 0.55

      audio.play().catch((error) => {
        console.warn('Musik belum bisa diputar:', error)
      })
    }

    setIsOpening(true)

    window.setTimeout(() => {
      setIsInvitationOpen(true)
    }, 700)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-song.mp3"
        preload="auto"
        loop
      />

      {!isInvitationOpen ? (
        <div
          className={
            isOpening
              ? 'cover-wrapper is-opening'
              : 'cover-wrapper'
          }
        >
          <CoverScreen onOpen={handleOpenInvitation} />
        </div>
      ) : (
        <InvitationPage />
      )}
    </>
  )
}

export default App
