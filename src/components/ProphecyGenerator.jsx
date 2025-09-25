import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack
} from '@chakra-ui/react';

export default function ProphecyGenerator() {
  const [prophecy, setProphecy] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateProphecy = async () => {
    setLoading(true);
    
    // Simple fallback prophecies
    const fallbackProphecies = [
      "The waters whisper of transformation flowing through your life, dear seeker.",
      "Through the mystical fog of the river, we perceive your journey unfolding.",
      "The ancient stones of the Amazon speak of your inner strength, dear one.",
      "In the depths of the river's heart, we sense your questions echoing through time.",
      "The bioluminescent creatures illuminate the path ahead, seeker of the mystical waters."
    ];
    
    setTimeout(() => {
      const result = {
        prophecy: fallbackProphecies[Math.floor(Math.random() * fallbackProphecies.length)],
        category: 'general',
        timestamp: new Date().toISOString(),
        isFallback: true
      };
      
      setProphecy(result);
      setLoading(false);
    }, 1500);
  };

  return (
    <VStack spacing={6} p={6} maxW="600px" mx="auto">
      <Text 
        fontSize="2xl" 
        fontWeight="bold" 
        textAlign="center"
        fontFamily="Honk"
      >
        Seek Wisdom from the Boto Dolphins
      </Text>

      <Button
        onClick={handleGenerateProphecy}
        isLoading={loading}
        loadingText="Consulting the Ancient Ones..."
        colorScheme="pink"
        size="lg"
        px={8}
        py={6}
        fontSize="lg"
        fontWeight="bold"
        borderRadius="full"
      >
        {loading ? "Channeling the River's Wisdom..." : "Receive Your Prophecy"}
      </Button>

      {prophecy && (
        <Box
          p={6}
          bg="rgba(255, 255, 255, 0.9)"
          borderRadius="xl"
          border="2px solid"
          borderColor="pink.200"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
          w="100%"
          textAlign="center"
        >
          <Text
            fontSize="lg"
            fontStyle="italic"
            lineHeight="1.6"
            color="gray.700"
            mb={4}
          >
            "{prophecy.prophecy}"
          </Text>
          
          <Text fontSize="sm" color="gray.500">
            — The Boto Dolphins of the Amazon
          </Text>
        </Box>
      )}

      <Text fontSize="sm" color="gray.500" textAlign="center" maxW="400px">
        The ancient Boto Dolphins of the Amazon River share their mystical wisdom through the sacred waters.
      </Text>
    </VStack>
  );
}