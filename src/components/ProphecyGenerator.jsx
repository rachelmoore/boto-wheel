import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ProphecyService from '../services/prophecyService';

export default function ProphecyGenerator() {
  const [prophecy, setProphecy] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      category: 'general',
      question: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setProphecy(null);
    
    try {
      const result = await ProphecyService.generateProphecy(data.category, data.question);
      setProphecy(result.prophecy);
    } catch (error) {
      console.error('Error generating prophecy:', error);
      // Fallback prophecies if AI fails
      const fallbackProphecies = [
        "The waters whisper of transformation flowing through your life, dear seeker.",
        "Through the mystical fog of the river, we perceive your journey unfolding.",
        "The ancient stones of the Amazon speak of your inner strength, dear one."
      ];
      const fallbackProphecy = fallbackProphecies[Math.floor(Math.random() * fallbackProphecies.length)];
      setProphecy(fallbackProphecy);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['general', 'love', 'career', 'health', 'spiritual'];

  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
      border: '2px solid rgba(236, 72, 153, 0.3)'
    }}>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: '32px',
        fontFamily: 'Honk, cursive',
        color: '#ec4899',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Seek Wisdom from the Boto Dolphins
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#be185d',
            fontSize: '16px'
          }}>
            Choose Your Path:
          </label>
          <select 
            {...register('category')}
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '12px',
              border: '2px solid #fbb6ce',
              backgroundColor: 'white',
              fontSize: '16px',
              color: '#374151',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#be185d',
            fontSize: '16px'
          }}>
            Your Question (Optional):
          </label>
          <textarea
            {...register('question')}
            placeholder="Ask the ancient ones of the Amazon for guidance..."
            rows={4}
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '12px',
              border: '2px solid #fbb6ce',
              backgroundColor: 'white',
              fontSize: '16px',
              color: '#374151',
              resize: 'vertical',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.1)',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '16px 24px', 
            backgroundColor: loading ? '#fbb6ce' : '#ec4899', 
            color: 'white', 
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.3)';
            }
          }}
        >
          {loading ? "🐬 Channeling..." : "✨ Receive Your Prophecy"}
        </button>
      </form>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(251, 182, 206, 0.2)',
          borderRadius: '12px'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#be185d',
            fontStyle: 'italic',
            margin: 0
          }}>
            The Boto Dolphins are communing with the ancient waters...
          </p>
        </div>
      )}

      {prophecy && (
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'rgba(251, 182, 206, 0.1)', 
          borderRadius: '16px', 
          border: '2px solid #fbb6ce', 
          marginTop: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(236, 72, 153, 0.1)'
        }}>
          <p style={{ 
            fontSize: '18px', 
            fontStyle: 'italic', 
            color: '#374151', 
            marginBottom: '16px',
            lineHeight: '1.6'
          }}>
            "{prophecy}"
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#be185d',
            fontWeight: '600',
            margin: 0
          }}>
            — The Boto Dolphins of the Amazon
          </p>
        </div>
      )}
    </div>
  );
}