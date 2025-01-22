import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Bot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchResponse = async (userPrompt: string) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API Key is missing!');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      return text;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "An error occurred while fetching the response.");
      } else {
        throw new Error("An error occurred while fetching the response.");
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear the input field

    try {
      const botResponse = await fetchResponse(input.trim());
      const botMessage = { sender: "Bot", text: botResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Oops! Something went wrong. Please try again later." },
      ]);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
<h1 className="text-3xl font-semibold text-center text-teal-200 p-4 glowing-text">
  J.A.R.V.I.S
</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-scroll p-6 mx-4 hide-scrollbar">
  <div className="space-y-4">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`p-3 rounded-lg max-w-[80%] border-2 border-teal-200 text-teal-200 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#2dd4bf,0_0_15px_#2dd4bf,0_0_30px_#2dd4bf]  bg-black bg-opacity-70 ${
          msg.sender === "User" ? "ml-auto" : ""
        }`}
      >
        <strong>{msg.sender === "Bot" ? "J.A.R.V.I.S" : msg.sender}:</strong> {msg.text}
      </div>
    ))}
  </div>
</div>


{/* Input and Send Button */}
<div className="pb-4 flex items-center space-x-4 mx-4">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type your message..."
    className="flex-grow p-3 border-1 border-teal-200 text-teal-200 rounded-md bg-black bg-opacity-70 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#2dd4bf,0_0_15px_#2dd4bf,0_0_30px_#2dd4bf] focus:outline-none focus:ring-2 focus:ring-teal-300 w-full sm:w-full md:w-4/5 lg:w-3/4"
    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
  />
  <button
    onClick={handleSendMessage}
    className="uppercase font-semibold px-6 py-3 text-teal-200 rounded-md bg-black bg-opacity-70 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#2dd4bf,0_0_15px_#2dd4bf,0_0_30px_#2dd4bf] hover:bg-teal-300 hover:text-slate-800 focus:outline-none focus:ring focus:ring-teal-300 w-1/3"
  >
    Send
  </button>
</div>


      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-2">{error}</p>
      )}
    </div>
  );
}

export default Bot;
