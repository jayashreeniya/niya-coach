import React, { useState } from 'react';
import { synthesizeSpeech } from '../services/googleCloudTTS';

const TextToSpeechTest: React.FC = () => {
  const [text, setText] = useState('வணக்கம்! இது ஒரு சோதனை செய்தி.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      setError(null);
      
      // Test with Tamil text
      const audioBuffer = await synthesizeSpeech(text, 'ta');
      
      // Create audio context and play the buffer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioSource = audioContext.createBufferSource();
      
      // Decode the audio buffer
      const audioData = await audioContext.decodeAudioData(audioBuffer);
      audioSource.buffer = audioData;
      
      // Connect to speakers and play
      audioSource.connect(audioContext.destination);
      audioSource.start(0);
      
      // Clean up when done
      audioSource.onended = () => {
        setIsPlaying(false);
      };
    } catch (err) {
      console.error('Error in text-to-speech:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Text-to-Speech Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Text (Tamil):
        </label>
        <textarea
          className="w-full p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className={`px-4 py-2 rounded ${
          isPlaying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isPlaying ? 'Playing...' : 'Play'}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TextToSpeechTest; 