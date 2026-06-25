import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FiSearch,
  FiSend,
  FiMoreVertical,
  FiMessageSquare,
  FiArrowLeft,
  FiShield,
  FiEdit,
  FiX,
  FiFlag,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { listConversations, sendMessage, markConversationRead } from '../api/conversations'
import { listContacts } from '../api/users'
import { reportMessage } from '../api/flag'
import { useFetch, errorMessage } from '../hooks/useFetch'
import './Messages.css'

export default function Messages() {
  const { user } = useAuth()
  const location = useLocation()
  const startWith = location.state?.to // { id, name, avatar } — start a thread
  const { data, loading, error } = useFetch(() => listConversations(user?.id), [user?.id])

  const [threads, setThreads] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState('')
  const [mobileThread, setMobileThread] = useState(false)
  const [convSearch, setConvSearch] = useState('')

  // New-message composer (contacts picker)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [contactSearch, setContactSearch] = useState('')

  // Sync local thread state once conversations load; inject a fresh thread when
  // arriving from a report's "Envoyer un message".
  useEffect(() => {
    if (!data) return
    let list = data
    if (startWith && !list.some((c) => String(c.id) === String(startWith.id))) {
      list = [makeThread(startWith), ...list]
    }
    setThreads(list)
    setActiveId((prev) => (startWith ? startWith.id : prev ?? list[0]?.id ?? null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const active = threads.find((c) => c.id === activeId)

  // Mark a thread read when it becomes active.
  useEffect(() => {
    if (!activeId) return
    const t = threads.find((c) => c.id === activeId)
    if (t && t.unread > 0) {
      markConversationRead(activeId)
      setThreads((prev) => prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  function makeThread(u) {
    return { id: u.id, name: u.name, avatar: u.avatar, messages: [], unread: 0, lastMessage: '', online: false, subject: '' }
  }

  const openPicker = async () => {
    setPickerOpen(true)
    setContactSearch('')
    setContactsLoading(true)
    try {
      setContacts(await listContacts())
    } catch {
      setContacts([])
    } finally {
      setContactsLoading(false)
    }
  }

  // Start (or open) a conversation with the chosen contact.
  const startConversation = (contact) => {
    setPickerOpen(false)
    setThreads((prev) => {
      if (prev.some((c) => String(c.id) === String(contact.id))) return prev
      return [makeThread(contact), ...prev]
    })
    setActiveId(contact.id)
    setMobileThread(true)
  }

  const send = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !active) return
    setDraft('')

    const optimistic = { id: `tmp-${Date.now()}`, from: 'me', text, time: "À l'instant" }
    setThreads((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, optimistic], lastMessage: text } : c
      )
    )

    try {
      const saved = await sendMessage(activeId, text, user?.id)
      setThreads((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.map((m) => (m.id === optimistic.id ? { ...optimistic, ...saved } : m)) }
            : c
        )
      )
    } catch (err) {
      // Surface the failure instead of silently keeping an unsent bubble.
      setThreads((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.map((m) => (m.id === optimistic.id ? { ...m, failed: true } : m)) }
            : c
        )
      )
      window.alert(errorMessage(err, "L'envoi du message a échoué."))
    }
  }

  const openThread = (id) => {
    setActiveId(id)
    setMobileThread(true)
  }

  const onReportMessage = async (m) => {
    if (typeof m.id !== 'number') return // optimistic/unsent message
    const reason = window.prompt('Signaler ce message — motif (optionnel) :', '')
    if (reason === null) return
    try {
      await reportMessage(m.id, reason)
      window.alert('Message signalé à la modération. Merci.')
    } catch (err) {
      window.alert(errorMessage(err, 'Le signalement a échoué.'))
    }
  }

  const visibleThreads = convSearch.trim()
    ? threads.filter((c) => c.name.toLowerCase().includes(convSearch.trim().toLowerCase()))
    : threads

  const filteredContacts = contactSearch.trim()
    ? contacts.filter((c) => c.name.toLowerCase().includes(contactSearch.trim().toLowerCase()))
    : contacts

  return (
    <div className="container page messages">
      {loading ? (
        <div className="messages__shell surface" style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
          <p className="muted">Chargement de la messagerie…</p>
        </div>
      ) : (
        <div className={`messages__shell surface ${mobileThread ? 'show-thread' : ''}`}>
          {/* Conversation list */}
          <div className="messages__list">
            <div className="messages__list-head">
              <h2>Messages</h2>
              <button className="messages__new" onClick={openPicker}>
                <FiEdit /> Nouveau
              </button>
            </div>
            <div className="messages__search">
              <FiSearch />
              <input
                placeholder="Rechercher une conversation…"
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
              />
            </div>

            {visibleThreads.length === 0 ? (
              <div className="messages__empty-list">
                <FiMessageSquare />
                <p className="muted">Aucune conversation.</p>
                <button className="messages__new messages__new--big" onClick={openPicker}>
                  <FiEdit /> Démarrer une conversation
                </button>
              </div>
            ) : (
              <ul>
                {visibleThreads.map((c) => (
                  <li key={c.id}>
                    <button
                      className={`conv ${c.id === activeId ? 'is-active' : ''}`}
                      onClick={() => openThread(c.id)}
                    >
                      <span className="conv__avatar">
                        <img className="avatar" src={c.avatar} alt={c.name} />
                        {c.online && <span className="conv__online" />}
                      </span>
                      <span className="conv__body">
                        <span className="conv__top">
                          <strong>{c.name}</strong>
                          <span className="conv__time">{c.time}</span>
                        </span>
                        <span className="conv__bottom">
                          <span className="conv__preview">{c.lastMessage || 'Nouvelle conversation'}</span>
                          {c.unread > 0 && <span className="conv__badge">{c.unread}</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chat thread */}
          <div className="messages__thread">
            {active ? (
              <>
                <header className="thread__head">
                  <button className="thread__back" onClick={() => setMobileThread(false)} aria-label="Retour">
                    <FiArrowLeft />
                  </button>
                  <span className="conv__avatar">
                    <img className="avatar" src={active.avatar} alt={active.name} width="42" height="42" />
                    {active.online && <span className="conv__online" />}
                  </span>
                  <div className="thread__head-info">
                    <strong>{active.name}</strong>
                    <span className={active.online ? 'thread__status is-online' : 'thread__status'}>
                      {active.online ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                  <button className="thread__more" aria-label="Options"><FiMoreVertical /></button>
                </header>

                <div className="thread__messages">
                  {active.messages.length === 0 && (
                    <p className="thread__hint muted">
                      Démarrez la conversation avec {active.name}.
                    </p>
                  )}
                  {active.messages.map((m) => (
                    <div key={m.id} className={`bubble bubble--${m.from === 'me' ? 'me' : 'them'} ${m.fromAdmin ? 'bubble--admin' : ''}`}>
                      {m.fromAdmin && <span className="bubble__admin"><FiShield /> Administration</span>}
                      <span>{m.text}</span>
                      <span className="bubble__time">{m.time}{m.failed ? ' · échec' : ''}</span>
                      {m.from === 'them' && typeof m.id === 'number' && (
                        <button
                          type="button"
                          className="bubble__report"
                          onClick={() => onReportMessage(m)}
                          title="Signaler ce message"
                          aria-label="Signaler ce message"
                        >
                          <FiFlag />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <form className="thread__composer" onSubmit={send}>
                  <input
                    placeholder="Écrire un message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" className="thread__send" aria-label="Envoyer" disabled={!draft.trim()}>
                    <FiSend />
                  </button>
                </form>
              </>
            ) : (
              <div className="thread__placeholder">
                <FiMessageSquare />
                <h3>Vos messages</h3>
                <p className="muted">Sélectionnez une conversation ou démarrez-en une nouvelle.</p>
                <button className="messages__new messages__new--big" onClick={openPicker}>
                  <FiEdit /> Nouveau message
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contacts picker (new message) */}
      {pickerOpen && (
        <div className="msg-picker__overlay" onMouseDown={() => setPickerOpen(false)}>
          <div className="msg-picker" onMouseDown={(e) => e.stopPropagation()}>
            <div className="msg-picker__head">
              <h3>Nouveau message</h3>
              <button onClick={() => setPickerOpen(false)} aria-label="Fermer"><FiX /></button>
            </div>
            <div className="messages__search">
              <FiSearch />
              <input
                autoFocus
                placeholder="Rechercher un utilisateur…"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>
            <div className="msg-picker__list">
              {contactsLoading ? (
                <p className="muted" style={{ padding: 16 }}>Chargement…</p>
              ) : filteredContacts.length === 0 ? (
                <p className="muted" style={{ padding: 16 }}>Aucun utilisateur trouvé.</p>
              ) : (
                filteredContacts.map((u) => (
                  <button key={u.id} className="msg-picker__item" onClick={() => startConversation(u)}>
                    <img className="avatar" src={u.avatar} alt="" width="40" height="40" />
                    <span>{u.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
