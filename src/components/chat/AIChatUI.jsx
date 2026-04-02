import { useState, useRef, useEffect } from 'react'
import { aiAPI } from '../../services/api'
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react'

export default function AIChatUI({ isGuest = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: isGuest
        ? "👋 Hi! I'm LUXE AI in guest mode. I can give you basic help — login for the full experience!"
        : "👋 Hi! I'm your LUXE AI Shopping Assistant. Ask me anything — products, orders, rentals, or deals!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])

    if (isGuest) {
      const guestReplies = [
        "🔍 You can search products like 'laptops under ₹50,000' in the shop section.",
        "💡 Try exploring our rental section for affordable short-term products.",
        "🛒 Add items to cart or wishlist after login for full experience.",
        "✨ Upgrade to Premium for smart AI recommendations.",
        "🔐 Login to get personalized product suggestions just for you!",
      ]
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: guestReplies[Math.floor(Math.random() * guestReplies.length)],
            timestamp: new Date(),
          },
        ])
      }, 600)
      return
    }

    setLoading(true)
    try {
      const history = messages.concat(userMsg).map(({ role, content }) => ({ role, content }))
      const res = await aiAPI.chat(history)
      const reply = res.data?.message || res.data?.content || "Sorry, I couldn't process that."
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }])
    } catch {
      const fallbacks = [
        'I found several great options for you! Check out the Shop page.',
        'You can explore Premium membership for exclusive deals.',
        'Rental system supports flexible durations — try the Rent page!',
        'Visit your Dashboard to track your orders.',
      ]
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: fallbacks[Math.floor(Math.random() * fallbacks.length)],
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const quickPrompts = [
    'Show me trending products',
    'How does renting work?',
    'Track my order',
    'What are Premium benefits?',
  ]

  return (
    <div className="flex flex-col h-[600px]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border bg-surface-card">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">LUXE AI Assistant</p>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            {isGuest ? 'Guest Mode' : 'Online'}
          </p>
        </div>
        {isGuest && (
          <span className="ml-auto text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">
            Guest
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-brand-500' : 'bg-gradient-to-br from-brand-500 to-accent'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-500 text-white rounded-tr-sm'
                : 'bg-surface-card border border-surface-border text-slate-300 rounded-tl-sm'
            }`}>
              {msg.content}
              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-brand-200' : 'text-slate-500'}`}>
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface-card border border-surface-border px-4 py-3 rounded-2xl rounded-tl-sm">
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts - only on first load */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-brand-500/50 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-surface-border bg-surface-card">
        <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-2 focus-within:border-brand-500/50 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGuest ? 'Ask a question (guest mode)...' : 'Ask me anything about LUXE...'}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-500"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-slate-600 text-center mt-2">
          {isGuest ? 'Login for full AI-powered responses' : 'Press Enter to send · AI may make mistakes'}
        </p>
      </div>

    </div>
  )
}