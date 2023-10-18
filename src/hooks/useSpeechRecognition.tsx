/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

let recognition: SpeechRecognition | null = null;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!recognition) return;
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            recognition?.stop();
            setIsListening(false);
            setText(event.results[0][0].transcript);
        };
    }, []);

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition?.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognition?.stop();
    };

    return {
        text,
        isListening,
        recognition,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;
