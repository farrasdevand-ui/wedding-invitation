import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./Section8.css";
import section8Background from "../assets/section8/BG_4.webp";

const MAX_GUESTS = 5;
const MAX_MESSAGES = 50;

function formatMessageDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function mergeMessages(currentMessages, incomingMessage) {
  const withoutDuplicate = currentMessages.filter(
    (message) => message.id !== incomingMessage.id,
  );

  return [incomingMessage, ...withoutDuplicate].slice(0, MAX_MESSAGES);
}

export default function Section8() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState("hadir");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");

  const [guestMessages, setGuestMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadMessages = useCallback(async () => {
    setMessagesError("");

    const { data, error } = await supabase
      .from("guest_messages")
      .select("id, full_name, message, created_at")
      .eq("is_visible", true)
      .order("created_at", {
        ascending: false,
      })
      .limit(MAX_MESSAGES);

    if (error) {
      console.error("Gagal mengambil ucapan:", error);
      setMessagesError("Ucapan belum dapat dimuat. Silakan coba lagi.");
      setIsLoadingMessages(false);
      return;
    }

    setGuestMessages(data ?? []);
    setIsLoadingMessages(false);
  }, []);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("public-guest-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_messages",
          filter: "is_visible=eq.true",
        },
        (payload) => {
          setGuestMessages((currentMessages) =>
            mergeMessages(currentMessages, payload.new),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages]);

  const handleAttendanceChange = (value) => {
    setAttendance(value);

    if (value === "tidak-hadir") {
      setGuestCount(0);
    } else if (guestCount === 0) {
      setGuestCount(1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();
    const normalizedMessage = message.trim();

    if (normalizedName.length < 2) {
      setSubmitError("Nama lengkap minimal terdiri dari 2 karakter.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    const { error } = await supabase.rpc("submit_rsvp", {
      p_full_name: normalizedName,
      p_phone: normalizedPhone,
      p_attendance: attendance,
      p_guest_count: attendance === "hadir" ? guestCount : 0,
      p_message: normalizedMessage,
    });

    if (error) {
      console.error("Gagal menyimpan RSVP:", error);
      setSubmitError(error.message || "Konfirmasi belum berhasil dikirim.");
      setIsSubmitting(false);
      return;
    }

    await loadMessages();

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleEditConfirmation = () => {
    setIsSubmitted(false);
    setSubmitError("");
  };

  return (
    <section
      id="section-8"
      className="invitation-section section8"
      style={{
        backgroundImage: `url(${section8Background})`,
      }}
    >
      <div className="section8__overlay" aria-hidden="true" />

      <div className="section8__content">
        <div className="section8__panel section8__panel--form">
          <div className="section8__panelScroller">
            <header className="section8__header reveal-up">
              <p className="section8__eyebrow">KONFIRMASI KEHADIRAN</p>

              <h2 className="section8__title">
                Kehadiran Anda adalah
                <br />
                kebahagiaan bagi kami
              </h2>

              <p className="section8__subtitle">
                Mohon mengisi konfirmasi kehadiran
              </p>

              <div className="section8__ornament" aria-hidden="true">
                <span />
                <b>◇</b>
                <span />
              </div>
            </header>

            {isSubmitted ? (
              <div className="section8__success reveal-up">
                <div className="section8__successIcon">✓</div>

                <h3>Terima Kasih</h3>

                <p>
                  Konfirmasi kehadiran Anda sudah tersimpan.
                  {message.trim()
                    ? " Ucapan Anda juga sudah ditampilkan di bawah."
                    : ""}
                </p>

                <button
                  type="button"
                  className="section8__primaryButton"
                  onClick={handleEditConfirmation}
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
                  <label htmlFor="rsvp-name">Nama Lengkap</label>

                  <input
                    id="rsvp-name"
                    name="name"
                    type="text"
                    value={fullName}
                    maxLength={80}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>

                <div className="section8__field">
                  <label htmlFor="rsvp-phone">Nomor HP</label>

                  <input
                    id="rsvp-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    maxLength={30}
                    placeholder="Masukkan nomor HP"
                    autoComplete="tel"
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>

                <fieldset className="section8__field">
                  <legend>Konfirmasi Kehadiran</legend>

                  <div className="section8__attendance">
                    <label
                      className={
                        attendance === "hadir"
                          ? "section8__choice is-active"
                          : "section8__choice"
                      }
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="hadir"
                        checked={attendance === "hadir"}
                        onChange={() => handleAttendanceChange("hadir")}
                      />

                      <span>Hadir</span>
                    </label>

                    <label
                      className={
                        attendance === "tidak-hadir"
                          ? "section8__choice is-active"
                          : "section8__choice"
                      }
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="tidak-hadir"
                        checked={attendance === "tidak-hadir"}
                        onChange={() => handleAttendanceChange("tidak-hadir")}
                      />

                      <span>Tidak Hadir</span>
                    </label>
                  </div>
                </fieldset>

                {attendance === "hadir" && (
                  <div className="section8__field">
                    <label>Jumlah Tamu</label>

                    <div className="section8__guestCounter">
                      <button
                        type="button"
                        onClick={() =>
                          setGuestCount((current) => Math.max(1, current - 1))
                        }
                        disabled={guestCount <= 1}
                        aria-label="Kurangi jumlah tamu"
                      >
                        −
                      </button>

                      <output aria-live="polite">{guestCount}</output>

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
                  <label htmlFor="rsvp-message">Pesan untuk Pengantin</label>

                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows="4"
                    value={message}
                    maxLength={500}
                    placeholder="Tuliskan doa dan pesan untuk kami"
                    onChange={(event) => setMessage(event.target.value)}
                  />

                  <span className="section8__characterCount">
                    {message.length}/500
                  </span>
                </div>

                {submitError && (
                  <p className="section8__error" role="alert">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  className="section8__primaryButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>
              </form>
            )}
          </div>
        </div>

        <section
          className="section8__panel section8__panel--messages section8__messages reveal-up"
          aria-labelledby="guest-messages-title"
        >
          <div className="section8__messagesHeader">
            <p>UCAPAN &amp; DOA</p>

            <h3 id="guest-messages-title">Pesan untuk Pengantin</h3>
          </div>

          {isLoadingMessages ? (
            <p className="section8__messagesStatus">Memuat ucapan...</p>
          ) : messagesError ? (
            <div className="section8__messagesStatus">
              <p>{messagesError}</p>

              <button type="button" onClick={loadMessages}>
                Coba Lagi
              </button>
            </div>
          ) : guestMessages.length === 0 ? (
            <p className="section8__messagesStatus">
              Belum ada ucapan. Jadilah yang pertama memberikan doa untuk
              pengantin.
            </p>
          ) : (
            <div className="section8__messageList">
              {guestMessages.map((guestMessage) => (
                <article
                  className="section8__messageCard"
                  key={guestMessage.id}
                >
                  <div className="section8__messageMeta">
                    <strong>{guestMessage.full_name}</strong>

                    <time dateTime={guestMessage.created_at}>
                      {formatMessageDate(guestMessage.created_at)}
                    </time>
                  </div>

                  <p>{guestMessage.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
