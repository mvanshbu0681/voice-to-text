
import { useState, useCallback } from 'react';

interface TextOperationsHook {
  processText: (text: string, operation: 'grammar' | 'rephrase' | 'bullets' | 'paragraphs' | 'enhance') => string;
  isProcessing: boolean;
}

const useTextOperations = (): TextOperationsHook => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulated grammar correction
  const correctGrammar = (text: string): string => {
    // This is a simple simulation of grammar correction
    let corrected = text;
    
    // Common grammar fixes (very basic examples)
    corrected = corrected.replace(/\bi\b/g, 'I');
    corrected = corrected.replace(/\s{2,}/g, ' ');  // Remove extra spaces
    corrected = corrected.replace(/\bi'm\b/g, "I'm");
    corrected = corrected.replace(/\bdont\b/g, "don't");
    corrected = corrected.replace(/\bcant\b/g, "can't");
    corrected = corrected.replace(/\bwont\b/g, "won't");
    corrected = corrected.replace(/\bim\b/g, "I'm");
    
    // Ensure sentences start with capital letter
    corrected = corrected.replace(/(\.\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    // Fix the first letter of the text
    if (corrected.length > 0) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    
    return corrected;
  };

  // Simulated text rephrasing
  const rephraseText = (text: string): string => {
    // This is a simple simulation of text rephrasing
    // In a real application, this would use a more sophisticated NLP approach
    
    const phrases = [
      { from: /\bgood\b/gi, to: 'excellent' },
      { from: /\bnice\b/gi, to: 'pleasant' },
      { from: /\bbad\b/gi, to: 'unsatisfactory' },
      { from: /\bsaid\b/gi, to: 'stated' },
      { from: /\btold\b/gi, to: 'informed' },
      { from: /\bthink\b/gi, to: 'believe' },
      { from: /\bmake\b/gi, to: 'create' },
      { from: /\bget\b/gi, to: 'obtain' },
      { from: /\blot\b/gi, to: 'significant amount' },
      { from: /\bgreat\b/gi, to: 'exceptional' },
      { from: /\bbig\b/gi, to: 'substantial' }
    ];
    
    let rephrased = text;
    phrases.forEach(({ from, to }) => {
      rephrased = rephrased.replace(from, to);
    });
    
    return rephrased;
  };

  // Convert text to bullet points
  const textToBulletPoints = (text: string): string => {
    if (!text.trim()) return '';
    
    // Split by sentences and create bullet points
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map(sentence => `• ${sentence.trim()}`).join('\n');
  };

  // Convert text to paragraphs
  const textToParagraphs = (text: string): string => {
    if (!text.trim()) return '';
    
    // Split by double newlines or multiple periods to identify paragraph breaks
    const paragraphs = text
      .split(/(?:\n\n|\.\s*\.\s*\.)/)
      .filter(p => p.trim().length > 0)
      .map(p => p.trim());
    
    return paragraphs.join('\n\n');
  };

  // Enhance text (simulated)
  const enhanceText = (text: string): string => {
    // This combines several operations and adds some enhancements
    
    // First correct grammar
    let enhanced = correctGrammar(text);
    
    // Add some filler professional words
    const enhancementPhrases = [
      { from: /\bin conclusion\b/gi, to: 'to summarize the key points' },
      { from: /\boverall\b/gi, to: 'taking everything into account' },
      { from: /\balso\b/gi, to: 'additionally' },
      { from: /\buse\b/gi, to: 'utilize' },
      { from: /\bhowever\b/gi, to: 'nevertheless' },
      { from: /\bso\b/gi, to: 'therefore' },
      { from: /\bbut\b/gi, to: 'however' },
      { from: /\bin my opinion\b/gi, to: 'from my perspective' },
      { from: /\bi think\b/gi, to: 'I believe' }
    ];
    
    enhancementPhrases.forEach(({ from, to }) => {
      enhanced = enhanced.replace(from, to);
    });
    
    // Ensure proper spacing
    enhanced = enhanced.replace(/\s+/g, ' ').trim();
    
    // Ensure ending with punctuation
    if (!/[.!?]$/.test(enhanced)) {
      enhanced += '.';
    }
    
    return enhanced;
  };

  // Main processing function
  const processText = useCallback((text: string, operation: 'grammar' | 'rephrase' | 'bullets' | 'paragraphs' | 'enhance'): string => {
    setIsProcessing(true);
    
    try {
      let result = text;
      
      switch (operation) {
        case 'grammar':
          result = correctGrammar(text);
          break;
        case 'rephrase':
          result = rephraseText(text);
          break;
        case 'bullets':
          result = textToBulletPoints(text);
          break;
        case 'paragraphs':
          result = textToParagraphs(text);
          break;
        case 'enhance':
          result = enhanceText(text);
          break;
        default:
          break;
      }
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processText,
    isProcessing
  };
};

export default useTextOperations;
