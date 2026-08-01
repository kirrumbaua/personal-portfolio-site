import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { getResumeContext } from '../data/resumeContext';
import { playSound } from '../utils/siteSounds';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.1-8b-instant';

// Lightweight Zero-Dependency Markdown Renderer for AI responses
function FormattedText({ text }) {
  if (!text) return null;

  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIndex) => {
        const lines = para.split('\n').filter(l => l.trim() !== '');
        
        // Check if lines are bullet list items (starting with * or -)
        const isList = lines.length > 0 && lines.some(line => /^\s*[*|-]\s+/.test(line.trim()));

        if (isList) {
          return (
            <ul key={pIndex} className="list-disc pl-4 space-y-1 my-1">
              {lines.map((line, lIndex) => {
                const cleanLine = line.replace(/^\s*[*|-]\s+/, '');
                return (
                  <li key={lIndex}>
                    {parseInlineFormatting(cleanLine)}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIndex} className="leading-relaxed">
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {lIndex > 0 && <br />}
                {parseInlineFormatting(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseInlineFormatting(str) {
  // Matches **bold**, *italic*, `code`
  const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className="px-1 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700/70 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Kurt's AI persona. Ask me anything about my current upskilling, thesis, university projects, or tech focus!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  
  const targetTextRef = useRef('');
  const displayedTextRef = useRef('');
  const messagesEndRef = useRef(null);
  const isStreamingFinishedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, displayedText, isOpen]);

  // Smooth Typewriter Loop (15ms tick)
  useEffect(() => {
    let timer = null;

    if (isLoading) {
      timer = setInterval(() => {
        if (displayedTextRef.current.length < targetTextRef.current.length) {
          const nextLength = Math.min(displayedTextRef.current.length + 2, targetTextRef.current.length);
          const nextText = targetTextRef.current.slice(0, nextLength);
          displayedTextRef.current = nextText;
          setDisplayedText(nextText);
        } else if (isStreamingFinishedRef.current && displayedTextRef.current.length === targetTextRef.current.length) {
          // Finished typing complete response
          clearInterval(timer);
          const finalContent = targetTextRef.current;
          setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
          setDisplayedText('');
          targetTextRef.current = '';
          displayedTextRef.current = '';
          setIsLoading(false);
          playSound('success');
        }
      }, 15);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const toggleOpen = (openState) => {
    setIsOpen(openState);
    if (openState) {
      playSound('bloom');
    } else {
      playSound('droplet');
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    playSound('press');
    const userMessage = input.trim();
    setInput('');
    
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);
    
    targetTextRef.current = '';
    displayedTextRef.current = '';
    setDisplayedText('');
    isStreamingFinishedRef.current = false;
    setIsLoading(true);

    try {
      const liveSystemPrompt = getResumeContext();
      const apiMessages = [
        { role: 'system', content: liveSystemPrompt },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 400,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                targetTextRef.current += content;
              }
            } catch (err) {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      // Mark network streaming as finished
      isStreamingFinishedRef.current = true;

    } catch (error) {
      console.error('Groq Chatbot Error:', error);
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Oops, I encountered an issue connecting to Groq API. Please try again!" }
      ]);
    }
  };

  return (
    <>
      {/* 1. Floating Trigger Capsule Button */}
      {!isOpen && (
        <button
          onClick={() => toggleOpen(true)}
          onMouseEnter={() => playSound('tick')}
          className={cn(
            "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-300 shadow-xl hover:scale-105 active:scale-95",
            "border-zinc-200/90 bg-white/90 text-zinc-800 hover:bg-white",
            "dark:border-zinc-800/90 dark:bg-[#0c0c0f]/90 dark:text-zinc-200 dark:hover:bg-zinc-900 backdrop-blur-md"
          )}
          aria-label="Open AI Chatbot"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
            <img src="/favicon.png" alt="Kurt AI" className="w-full h-full object-cover" />
          </div>
          <span className="font-mono text-xs font-medium">ask kurt</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      )}

      {/* 2. Floating Chat Modal Window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-[calc(100vw-2.5rem)] sm:w-[360px] h-[500px] max-h-[80vh] z-50 flex flex-col rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 animate-fade-up",
            "border-zinc-200/90 bg-white/95 text-zinc-900",
            "dark:border-zinc-800/90 dark:bg-[#0c0c0f]/95 dark:text-zinc-100 backdrop-blur-xl"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-pixel text-xs text-zinc-900 dark:text-zinc-100">Kurt AI</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">online · ask me anything</p>
            </div>

            <button
              onClick={() => toggleOpen(false)}
              onMouseEnter={() => playSound('tick')}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0 mt-0.5">
                    <img src="/favicon.png" alt="Kurt" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl leading-relaxed text-[12.5px]",
                    msg.role === 'user'
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs"
                      : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-700/50"
                  )}
                >
                  <FormattedText text={msg.content} />
                </div>
              </div>
            ))}

            {/* Streaming Message with Claude Typewriter Cursor */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0 mt-0.5">
                  <img src="/favicon.png" alt="Kurt" className="w-full h-full object-cover" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 leading-relaxed text-[12.5px]">
                  <FormattedText text={displayedText || "..."} />
                  {/* Claude Style Typewriter Pulse Cursor */}
                  <span className="inline-block w-1.5 h-3.5 bg-zinc-900 dark:bg-zinc-100 animate-pulse ml-0.5 align-middle" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my experience, skills..."
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 disabled:opacity-40 hover:opacity-90 transition-opacity"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
