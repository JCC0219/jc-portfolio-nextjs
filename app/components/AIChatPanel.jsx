"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const initialMessage = {
  role: "assistant",
  content:
    "Hi, I am JC's AI assistant. Ask me anything about projects, cloud skills, certifications, and experience.",
};

function extractReplyText(payload) {
  if (!payload) return "I could not read the response. Please try again.";

  if (typeof payload === "string") return payload;

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const text = extractReplyText(item);
      if (text) return text;
    }
  }

  if (typeof payload === "object") {
    const directKeys = ["output", "text", "message", "response", "answer"];
    for (const key of directKeys) {
      if (typeof payload[key] === "string" && payload[key].trim()) {
        return payload[key];
      }
    }

    if (payload.data) {
      const nested = extractReplyText(payload.data);
      if (nested) return nested;
    }
  }

  return "I got your message, but the response format was unexpected.";
}

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2">
      <Image
        src={assets.profile_img}
        alt="JC assistant avatar"
        className="h-7 w-7 rounded-full border border-indigo-300/40 object-cover"
      />
      <motion.div
        initial={{ opacity: 0, x: -8, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-fit max-w-[78%] rounded-2xl border border-indigo-400/35 bg-[#161f49]/95 px-3 py-2 text-sm text-indigo-100"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">AI is typing</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-indigo-300"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: dot * 0.14,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AIChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotReachable, setIsBotReachable] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef = useRef(null);

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK;
  const healthCheckUrl = process.env.NEXT_PUBLIC_N8N_HEALTH_URL;

  const canSend = useMemo(() => {
    return (
      Boolean(input.trim()) &&
      !isLoading &&
      Boolean(webhookUrl) &&
      isBotReachable
    );
  }, [input, isLoading, webhookUrl, isBotReachable]);

  useEffect(() => {
    const storageKey = "jc-ai-session-id";
    const savedSession = sessionStorage.getItem(storageKey);
    const generatedSessionId =
      savedSession ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

    if (!savedSession) {
      sessionStorage.setItem(storageKey, generatedSessionId);
    }

    setSessionId(generatedSessionId);
  }, []);

  useEffect(() => {
    if (!webhookUrl || !healthCheckUrl) {
      setIsBotReachable(false);
      return;
    }

    let mounted = true;

    const checkBotStatus = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        const response = await fetch(healthCheckUrl, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (mounted) setIsBotReachable(response.ok);
      } catch {
        if (mounted) setIsBotReachable(false);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkBotStatus();
    const intervalId = setInterval(checkBotStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [webhookUrl, healthCheckUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!canSend) {
      if (!isBotReachable) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "JC Assistant Bot is currently offline. Please try again in a moment.",
          },
        ]);
      }
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId,
          chatInput: userMessage,
        }),
      });

      const rawText = await response.text();
      let payload;

      try {
        payload = rawText ? JSON.parse(rawText) : null;
      } catch {
        payload = rawText;
      }

      if (!response.ok) {
        throw new Error(extractReplyText(payload));
      }

      const assistantReply = extractReplyText(payload);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.message ||
            "Sorry, I cannot reply right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden lg:block">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.aside
            key="chat-panel"
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 28, scale: 0.98 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="fixed right-6 top-24 z-50 h-[calc(100vh-7.5rem)] w-[360px] rounded-2xl border border-indigo-400/30 bg-[#070b1f]/95 shadow-[0_20px_80px_rgba(53,63,255,0.35)] backdrop-blur"
          >
            <div className="flex h-full flex-col">
              <header className="border-b border-indigo-400/20 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative">
                      <Image
                        src={assets.profile_img}
                        alt="JC assistant avatar"
                        className="h-8 w-8 rounded-full border border-indigo-300/40 object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#070b1f] ${
                          isBotReachable ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                        aria-label={isBotReachable ? "Bot online" : "Bot offline"}
                        title={isBotReachable ? "Bot online" : "Bot offline"}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
                        JC AI Assistant
                      </h3>
                      <p className="truncate text-xs text-slate-300">
                        Ask me anything about my background.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 rounded-full border border-indigo-300/30 text-sm text-slate-200 hover:bg-indigo-400/20"
                    type="button"
                    aria-label="Close chat"
                  >
                    x
                  </button>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${message.role}-${index}`}
                      initial={
                        message.role === "user"
                          ? { opacity: 0, x: 14, y: 6, scale: 0.98 }
                          : { opacity: 0, x: -12, y: 10, scale: 0.96, filter: "blur(2px)" }
                      }
                      animate={
                        message.role === "user"
                          ? { opacity: 1, x: 0, y: 0, scale: 1 }
                          : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
                      }
                      transition={
                        message.role === "user"
                          ? { duration: 0.2, ease: "easeOut" }
                          : { duration: 0.32, ease: "easeOut" }
                      }
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" ? (
                        <div className="flex items-end gap-2">
                          <Image
                            src={assets.profile_img}
                            alt="JC assistant avatar"
                            className="h-7 w-7 rounded-full border border-indigo-300/40 object-cover"
                          />
                          <div className="w-fit max-w-[78%] rounded-2xl rounded-bl-md border border-indigo-400/35 bg-[#161f49]/95 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-slate-100">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div className="w-fit max-w-[78%] rounded-2xl rounded-br-md bg-indigo-500 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-white">
                          {message.content}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <TypingIndicator />
                    </div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={onSubmit}
                className="border-t border-indigo-400/20 px-4 py-3"
              >
                <div className="flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-[#0f1533] px-2 py-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={
                      !isBotReachable
                        ? "JC Assistant Bot is offline. Waiting for reconnection..."
                        : webhookUrl
                        ? "Ask anything about my experience, skills, or projects..."
                        : "Set NEXT_PUBLIC_N8N_CHAT_WEBHOOK and NEXT_PUBLIC_N8N_HEALTH_URL in .env"
                    }
                    disabled={!webhookUrl || !healthCheckUrl || !isBotReachable}
                    className="w-full bg-transparent px-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="chat-launcher"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            type="button"
            whileHover={{ x: -2, scale: 1.01 }}
            className="fixed right-6 top-1/2 z-50 -translate-y-1/2 rounded-full border border-indigo-300/40 bg-gradient-to-b from-[#111a43]/95 to-[#0c1230]/95 px-2.5 py-2 text-left shadow-[0_16px_50px_rgba(54,74,255,0.4)]"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/assistant-bot.svg"
                alt="JC AI bot avatar"
                className="h-8 w-8 rounded-full border border-indigo-300/40 object-cover"
                width={32}
                height={32}
              />
              <span className="pr-1 text-xs font-semibold text-white/95">JC AI Assistant</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatPanel;
