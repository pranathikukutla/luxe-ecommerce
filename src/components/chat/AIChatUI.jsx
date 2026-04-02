console.log("isGuest:", isGuest)
import api from '../../services/api'
const send = async (text) => {
  const content = text || input.trim()
  if (!content || loading) return
  setInput('')

  const userMsg = { role: 'user', content, timestamp: new Date() }
  setMessages(prev => [...prev, userMsg])

  // ✅ GUEST MODE (NO LOGIN)
  if (isGuest) {
    const guestReplies = [
      "🔍 You can search products like 'laptops under ₹50,000' in the shop section.",
      "💡 Try exploring our rental section for affordable short-term products.",
      "🛒 Add items to cart or wishlist after login for full experience.",
      "✨ Upgrade to Premium for smart AI recommendations.",
    ]

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: guestReplies[Math.floor(Math.random() * guestReplies.length)],
        timestamp: new Date(),
      },
    ])
    return
  }

  // ✅ REAL API (LOGGED IN USERS)
  setLoading(true)

  try {
    const history = messages
      .concat(userMsg)
      .map(({ role, content }) => ({ role, content }))

    // ✅ FIXED: using api instead of aiAPI
    const res = await api.post('/chat', { history })

    const reply =
      res.data?.message ||
      res.data?.content ||
      "Sorry, I couldn't process that."

    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: reply, timestamp: new Date() },
    ])
  } catch (error) {
    console.error("Chat error:", error)

    const fallbacks = [
      'I found several great options for you! Check out the Shop page.',
      'You can explore Premium membership for exclusive deals.',
      'Rental system supports flexible durations.',
      'Visit Dashboard to track your orders.',
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
export default AIChatUI