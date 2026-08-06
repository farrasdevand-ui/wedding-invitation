import { useState } from 'react'
import './Section8.css'
import section8Background from '../assets/section8/BG_4.png'

const MAX_GUESTS = 5

export default function Section8() {
  const [attendance, setAttendance] = useState('hadir')
  const [guestCount, setGuestCount] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleAttendanceChange = (value) => {
    setAttendance(value)

    if (value === 'tidak-hadir') {
      setGuestCount(0)
    } else if (guestCount === 0) {
      setGuestCount(1)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section
      id="section-8"
      className="invitation-section section8"
      style={{
        backgroundImage: `url(${section8Background})`,
      }}
    >
      <div className="section8__overlay" />

      <div className="section8__content">
        <header className="section8__header reveal-up">
          <p className="section8__eyebrow">
            KONFIRMASI KEHADIRAN
          </p>

          <h2 className="section8__title">
            Kehadiran Anda adalah
            <br />
            kebahagiaan bagi kami
          </h2>

          <p className="section8__subtitle">
            Mohon mengisi konfirmasi kehadiran
          </p>

          <div
            className="section8__ornament"
            aria-hidden="true"
          >
            <span />
            <b>◇</b>
            <span />
          </div>
        </header>

        {isSubmitted ? (
          <div className="section8__success reveal-up">
            <div className="section8__successIcon">
              ✓
            </div>

            <h3>Terima Kasih</h3>

            <p>
              Konfirmasi kehadiran Anda telah diterima
              pada tampilan ini.
            </p>

            <button
              type="button"
              className="section8__primaryButton"
              onClick={() => setIsSubmitted(false)}
            >
              Ubah Konfirmasi
            </button>
          </div>
        ) : (
          <form
            className="section8__form reveal-up"
            onSubmit={handleSubmit}
          >
            <div className="section8__field">
              <label htmlFor="rsvp-name">
                Nama Lengkap
              </label>

              <input
                id="rsvp-name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                required
              />
            </div>

            <div className="section8__field">
              <label htmlFor="rsvp-phone">
                Nomor HP
              </label>

              <input
                id="rsvp-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="Masukkan nomor HP"
                autoComplete="tel"
              />
            </div>

            <fieldset className="section8__field">
              <legend>Konfirmasi Kehadiran</legend>

              <div className="section8__attendance">
                <label
                  className={
                    attendance === 'hadir'
                      ? 'section8__choice is-active'
                      : 'section8__choice'
                  }
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="hadir"
                    checked={attendance === 'hadir'}
                    onChange={() =>
                      handleAttendanceChange('hadir')
                    }
                  />

                  <span>Hadir</span>
                </label>

                <label
                  className={
                    attendance === 'tidak-hadir'
                      ? 'section8__choice is-active'
                      : 'section8__choice'
                  }
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="tidak-hadir"
                    checked={attendance === 'tidak-hadir'}
                    onChange={() =>
                      handleAttendanceChange('tidak-hadir')
                    }
                  />

                  <span>Tidak Hadir</span>
                </label>
              </div>
            </fieldset>

            {attendance === 'hadir' && (
              <div className="section8__field">
                <label>Jumlah Tamu</label>

                <div className="section8__guestCounter">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                    disabled={guestCount <= 1}
                    aria-label="Kurangi jumlah tamu"
                  >
                    −
                  </button>

                  <output aria-live="polite">
                    {guestCount}
                  </output>

                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((current) =>
                        Math.min(MAX_GUESTS, current + 1),
                      )
                    }
                    disabled={guestCount >= MAX_GUESTS}
                    aria-label="Tambah jumlah tamu"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="section8__field">
              <label htmlFor="rsvp-message">
                Pesan untuk Pengantin
              </label>

              <textarea
                id="rsvp-message"
                name="message"
                rows="4"
                placeholder="Tuliskan doa dan pesan untuk kami"
              />
            </div>

            <button
              type="submit"
              className="section8__primaryButton"
            >
              Kirim Konfirmasi
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
