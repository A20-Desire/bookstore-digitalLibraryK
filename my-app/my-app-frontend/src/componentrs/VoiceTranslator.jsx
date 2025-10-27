import { useState, useEffect } from 'react';

function VoiceTranslator() {
  const [isListening, setIsListening] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('fr-FR');
  const [isSupported, setIsSupported] = useState(false);

  // Available languages for translation
  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'fr-FR', name: 'French' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
  ];

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = sourceLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setSourceText(transcript);
      translateText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
    setIsListening(false);
  };

  const translateText = async (text) => {
    if (!text?.trim()) return;
    
    try {
      setTranslatedText('Translating...');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        body: JSON.stringify({
          text,
          sourceLang: sourceLang.split('-')[0],
          targetLang: targetLang.split('-')[0],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        throw new Error('No translation received');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation service unavailable — please try again later.');
      
      // If it's a connection error, we might want to notify the user specifically
      if (error.message === 'Failed to fetch') {
        setTranslatedText('Unable to connect to translation service. Please check your internet connection and try again.');
      }
    }
  };

  const speakTranslatedText = () => {
    if (!translatedText) return;

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {!isSupported ? (
          <div className="alert alert-error">
            Speech recognition is not supported in your browser. Please use Chrome.
          </div>
        ) : (
          <>
            <button
              className={`btn ${isListening ? 'btn-error' : 'btn-primary'} w-full`}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Original Text</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={sourceText}
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Translated Text</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={translatedText}
                  readOnly
                />
              </div>

              {translatedText && (
                <button
                  className="btn btn-secondary w-full"
                  onClick={speakTranslatedText}
                >
                  Speak Translation
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VoiceTranslator;