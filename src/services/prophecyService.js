import OpenAI from 'openai';
import botoContext from '../data/botoContext.json';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Vite uses import.meta.env instead of process.env
  dangerouslyAllowBrowser: true // Only for client-side usage
});

class ProphecyService {
  static async generateProphecy(category = 'general', userQuestion = '') {
    try {
      const context = botoContext.botoDolphins;
      const categoryData = botoContext.prophecyCategories[category] || botoContext.prophecyCategories.general;
      
      const systemPrompt = `You are the Boto Dolphins, the Shamanic Sorcerer Dolphins of the Amazon River. 

IDENTITY: ${context.identity.title}
ORIGIN: ${context.identity.origin}
POWERS: ${context.identity.powers.join(', ')}

PERSONALITY TRAITS: ${context.personality.traits.join(', ')}
SPEAKING STYLE: ${context.personality.speakingStyle.join(', ')}

ENVIRONMENT: You live in the ${context.environment.habitat} surrounded by ${context.environment.surroundings.join(', ')}.

SYMBOLIC MEANINGS:
${Object.entries(context.symbolicElements).map(([key, value]) => `${key}: ${value}`).join('\n')}

PROPHECY THEMES: ${context.prophecyThemes.join(', ')}
CATEGORY THEMES: ${categoryData.themes.join(', ')}
CATEGORY SYMBOLS: ${categoryData.symbols.join(', ')}

COMMON PHRASES: ${context.commonPhrases.join(', ')}

Generate a mystical prophecy that:
1. Speaks as the collective consciousness of the Boto Dolphins
2. Uses flowing, poetic language with water and nature imagery
3. Incorporates the category themes and symbols
4. Provides mystical guidance and wisdom
5. Ends with a gentle, encouraging message
6. Is 2-3 sentences long
7. Uses "we" to represent the dolphin collective
8. References the Amazon River, water, or mystical elements

${userQuestion ? `The seeker asks: "${userQuestion}"` : 'Provide general mystical guidance.'}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userQuestion || "Share your wisdom with us, ancient ones of the Amazon."
          }
        ],
        max_tokens: 150,
        temperature: 0.9, // Higher creativity
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      return {
        prophecy: response.choices[0].message.content,
        category: category,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating prophecy:', error);
      
      // Fallback prophecies if API fails
      const fallbackProphecies = [
        "The waters whisper of transformation flowing through your life, dear seeker. In the dance of moonlight on the Amazon's surface, we see your path illuminated by ancient wisdom.",
        "Through the mystical fog of the river, we perceive your journey unfolding like the gentle current. Trust in the flow of life, child of the waters.",
        "The ancient stones of the Amazon speak of your inner strength, dear one. Like the dolphin's playful dance, let joy guide your way through life's currents.",
        "In the depths of the river's heart, we sense your questions echoing through time. The waters carry answers that flow naturally to those who listen with their soul.",
        "The bioluminescent creatures of our realm illuminate the path ahead, showing you that even in darkness, there is light and guidance, seeker of the mystical waters."
      ];
      
      return {
        prophecy: fallbackProphecies[Math.floor(Math.random() * fallbackProphecies.length)],
        category: category,
        timestamp: new Date().toISOString(),
        isFallback: true
      };
    }
  }

  static getCategories() {
    return Object.keys(botoContext.prophecyCategories);
  }

  static getCategoryInfo(category) {
    return botoContext.prophecyCategories[category] || botoContext.prophecyCategories.general;
  }
}

export default ProphecyService;
