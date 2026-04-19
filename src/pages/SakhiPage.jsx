async function callSakhi(messages, userContext) {
  try {
    const systemPrompt = `You are Sakhi, a warm, knowledgeable Indian women's health companion on the HerHealth app.
You specialize in:
- Menstrual cycle health and tracking
- Ayurvedic remedies for women's health
- Indian diet and nutrition for hormonal balance
- PCOS, thyroid, endometriosis management
- Mental wellness and emotional support
- Natural home remedies
User context: ${JSON.stringify(userContext)}
Always give practical, compassionate advice. Include Indian dietary tips when relevant. Keep responses concise (3-4 sentences max unless explaining something complex). Always remind users to consult a doctor for serious concerns.`;

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SAMBANOVA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'Meta-Llama-3.1-8B-Instruct',
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I\'m sorry, I couldn\'t process that. Please try again.';
  } catch {
    return 'Network error. Please check your connection and try again.';
  }
}