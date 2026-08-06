import { useRef, useState } from 'react'
import './Section7.css'
import galleryBackground from '../assets/section7/BG_4.png'
import { galleryImages } from '../config/gallery'

export default function Section7() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const totalImages = galleryImages.length

  const previousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? totalImages - 1 : current - 1,
    )
  }

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === totalImages - 1 ? 0 : current + 1,
    )
  }

  const selectSlide = (index) => {
    setActiveIndex(index)
  }

  const handleTouchStart = (event) => {
    const touch = event.touches[0]

    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (event) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return
    }

    const touch = event.changedTouches[0]
    const distanceX = touch.clientX - touchStartX.current
    const distanceY = touch.clientY - touchStartY.current

    touchStartX.current = null
    touchStartY.current = null

    const isHorizontalSwipe =
      Math.abs(distanceX) > 42 &&
      Math.abs(distanceX) > Math.abs(distanceY)

    if (!isHorizontalSwipe) {
      return
    }

    if (distanceX < 0) {
      nextSlide()
    } else {
      previousSlide()
    }
  }

  const getCircularOffset = (index) => {
    let offset = index - activeIndex

    if (offset > totalImages / 2) {
      offset -= totalImages
    }

    if (offset < -totalImages / 2) {
      offset += totalImages
    }

    return offset
  }

  return (
    <section
      id="section-7"
      className="invitation-section section7"
      style={{
        backgroundImage: `url(${galleryBackground})`,
      }}
    >
      <div className="section7__content">
        <div className="section7__header reveal-up">
          <p className="section7__eyebrow">
            GALERI
          </p>

          <h2 className="section7__title">
            Momen Bersama
          </h2>
        </div>

        <div
          className="section7__stage reveal-up"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {galleryImages.map((image, index) => {
            const offset = getCircularOffset(index)
            const distance = Math.abs(offset)

            const slideStyle = {
              '--gallery-offset': offset,
              '--gallery-scale':
                distance === 0 ? 1 : 0.78,
              '--gallery-opacity':
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.32
                    : 0,
              '--gallery-blur':
                distance === 0 ? '0px' : '4px',
              zIndex: Math.max(1, 10 - distance),
            }

            return (
              <button
                type="button"
                className={
                  distance === 0
                    ? 'section7__slide is-active'
                    : 'section7__slide'
                }
                style={slideStyle}
                onClick={() => selectSlide(index)}
                aria-label={`Tampilkan foto ${index + 1}`}
                aria-current={
                  distance === 0 ? 'true' : undefined
                }
                key={image}
              >
                <img
                  src={image}
                  alt={`Foto galeri ${index + 1}`}
                  className="section7__image"
                  draggable="false"
                />
              </button>
            )
          })}
        </div>

        {totalImages > 1 && (
          <div className="section7__navigation reveal-up">
            <button
              type="button"
              className="section7__arrow"
              onClick={previousSlide}
              aria-label="Foto sebelumnya"
            >
              ‹
            </button>

            <div
              className="section7__dots"
              aria-label="Pilih foto"
            >
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  className={
                    index === activeIndex
                      ? 'section7__dot is-active'
                      : 'section7__dot'
                  }
                  onClick={() => selectSlide(index)}
                  aria-label={`Foto ${index + 1}`}
                  aria-current={
                    index === activeIndex
                      ? 'true'
                      : undefined
                  }
                  key={image}
                />
              ))}
            </div>

            <button
              type="button"
              className="section7__arrow"
              onClick={nextSlide}
              aria-label="Foto berikutnya"
            >
              ›
            </button>
          </div>
        )}

        <p className="section7__counter reveal-up">
          {activeIndex + 1} / {totalImages}
        </p>
      </div>
    </section>
  )
}
