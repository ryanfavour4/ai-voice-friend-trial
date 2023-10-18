/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

export default function AiAssistant() {
    const {
        text,
        recognition,
        isListening,
        startListening,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    const { speak } = useSpeechSynthesis();
    const key = "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";
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
    };

    useEffect(() => {
        if (recognition) recognition.onend = () => sendToChatGPT();
    }, [recognition, text]);

    const systemMessage = {
        role: "system",
        content: "Explain all concepts like I am 10 years old.",
    };

    const sendToChatGPT = async () => {
        speak({ text });
        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [systemMessage, { role: "user", content: text }],
                },
                { headers }
            )
            .then((res) => {
                speak({ text: res.data });
                console.log(res.data);
            })
            .catch((err) => {
                speak({ text: err.message });
                console.log(err);
            });
    };

    return (
        <div>
            {hasRecognitionSupport ? (
                <div>
                    <button onClick={startListening}>Start Listening</button>
                    <div>
                        {isListening ? <p>Listening...</p> : null}

                        <p>{text}, Transcript</p>
                    </div>
                </div>
            ) : (
                <p>Your browser does not support speech recognition.</p>
            )}
        </div>
    );
}
