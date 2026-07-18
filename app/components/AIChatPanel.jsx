"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { assets } from "@/assets/assets";

const initialMessage = {
  role: "assistant",
  content:
    "Hi, I am JC's AI assistant. Ask me anything about my projects, skills, certifications, and experience.",
  createdAt: Date.now(),
};

function createChatMessage(role, content) {
  return {
    role,
    content,
    createdAt: Date.now(),
  };
}

function formatMessageTime(createdAt) {
  if (!createdAt) return "";

  try {
    return new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

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
        src={assets.profile_img_jc_ai_avatar}
        alt="JC assistant avatar"
        className="h-7 w-7 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
      />
      <motion.div
        initial={{ opacity: 0, x: -8, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-fit max-w-[78%] rounded-2xl border border-white/50 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-[0_8px_24px_rgba(75,90,150,0.14)] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-indigo-100"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">AI is typing</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300"
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

const markdownComponents = {
  h1: ({ ...props }) => <h1 className="mb-2 text-base font-semibold" {...props} />,
  h2: ({ ...props }) => <h2 className="mb-2 text-sm font-semibold" {...props} />,
  h3: ({ ...props }) => <h3 className="mb-2 text-sm font-semibold" {...props} />,
  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
  ul: ({ ...props }) => <ul className="mb-2 list-disc pl-5" {...props} />,
  ol: ({ ...props }) => <ol className="mb-2 list-decimal pl-5" {...props} />,
  li: ({ ...props }) => <li className="mb-1" {...props} />,
  a: ({ ...props }) => (
    <a
      className="underline decoration-indigo-400 underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code
          className="rounded bg-indigo-100 px-1 py-0.5 font-mono text-[0.84em] dark:bg-indigo-500/20"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`block overflow-x-auto rounded-lg bg-indigo-100/70 px-2.5 py-2 font-mono text-[0.84em] dark:bg-indigo-500/20 ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
};

const AIChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportOffsetTop, setViewportOffsetTop] = useState(0);
  const chatEndRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK;

  const canSend = useMemo(() => {
    return Boolean(input.trim()) && !isLoading && Boolean(webhookUrl);
  }, [input, isLoading, webhookUrl]);

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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const syncViewport = () => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      setIsMobileViewport(isMobile);

      if (!isMobile) {
        setViewportHeight(0);
        setViewportOffsetTop(0);
        return;
      }

      const visualViewport = window.visualViewport;
      setViewportHeight(Math.round(visualViewport?.height || window.innerHeight));
      setViewportOffsetTop(Math.round(visualViewport?.offsetTop || 0));
    };

    syncViewport();

    const visualViewport = window.visualViewport;
    window.addEventListener("resize", syncViewport);
    visualViewport?.addEventListener("resize", syncViewport);
    visualViewport?.addEventListener("scroll", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
      visualViewport?.removeEventListener("resize", syncViewport);
      visualViewport?.removeEventListener("scroll", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!isMobileViewport) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isMobileViewport]);

  useEffect(() => {
    const handleProjectOpenChat = () => {
      setIsOpen(true);
      setIsHighlightActive(true);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        setIsHighlightActive(false);
      }, 1700);
    };

    window.addEventListener("jc-ai-chat-open", handleProjectOpenChat);

    return () => {
      window.removeEventListener("jc-ai-chat-open", handleProjectOpenChat);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const mobileSheetStyle = isMobileViewport
    ? {
        height: viewportHeight ? `${Math.max(viewportHeight - 10, 0)}px` : "calc(100dvh - 10px)",
        top: `${viewportOffsetTop + 10}px`,
      }
    : undefined;

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!canSend) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, createChatMessage("user", userMessage)]);
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
        createChatMessage("assistant", assistantReply),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createChatMessage(
          "assistant",
          error?.message ||
            "Sorry, I cannot reply right now. Please try again in a moment."
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.aside
            key="chat-panel"
            initial={isMobileViewport ? { opacity: 0, y: 36 } : { opacity: 0, x: 30, scale: 0.98 }}
            animate={isMobileViewport ? { opacity: 1, y: 0 } : { opacity: 1, x: 0, scale: 1 }}
            exit={isMobileViewport ? { opacity: 0, y: 36 } : { opacity: 0, x: 28, scale: 0.98 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className={`fixed inset-x-0 bottom-0 z-50 h-[100dvh] w-screen overflow-hidden rounded-t-3xl border border-white/35 bg-gradient-to-b from-white/78 via-white/66 to-white/58 shadow-[0_24px_70px_rgba(46,61,128,0.24)] backdrop-blur-3xl dark:border-white/10 dark:from-[#131c4a]/82 dark:via-[#0c1231]/74 dark:to-[#070b1f]/72 dark:shadow-[0_24px_82px_rgba(8,13,38,0.62)] lg:inset-auto lg:right-6 lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:w-[360px] lg:rounded-3xl lg:border-white/40 lg:from-white/62 lg:via-white/52 lg:to-white/42 lg:dark:border-white/15 lg:dark:from-[#111a45]/66 lg:dark:to-[#070b1f]/56 ${
              isHighlightActive
                ? "ring-2 ring-indigo-400/70 shadow-[0_0_0_4px_rgba(129,140,248,0.22),0_24px_82px_rgba(8,13,38,0.62)]"
                : ""
            }`}
            style={mobileSheetStyle}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(149,173,255,0.18),transparent_60%)]" />
            <div className="pointer-events-none absolute -left-20 top-20 h-60 w-60 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-400/20" />
            <div className="pointer-events-none absolute -right-16 bottom-24 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl dark:bg-cyan-400/10" />
            <div className="flex h-full flex-col">
              <header className="border-b border-slate-300/50 bg-white/34 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={assets.profile_img_jc_ai_avatar}
                      alt="JC assistant avatar"
                      className="h-8 w-8 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                        JC Portfolio AI Assistant
                      </h3>
                      <p className="truncate text-xs text-slate-600 dark:text-slate-300/90">
                        Ask me anything about my background.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/70 bg-white/58 text-slate-700 shadow-[0_6px_16px_rgba(76,88,132,0.16)] transition-all hover:bg-white/80 hover:shadow-[0_8px_20px_rgba(76,88,132,0.2)] dark:border-white/15 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 lg:h-7 lg:w-7"
                    type="button"
                    aria-label="Close chat"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                      <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </header>

              <div className="chat-scrollbar flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white/14 to-transparent px-4 py-4 dark:from-white/[0.04]">
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
                        <div className="flex max-w-[82%] items-end gap-2">
                          <Image
                            src={assets.profile_img_jc_ai_avatar}
                            alt="JC assistant avatar"
                            className="h-7 w-7 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
                          />
                          <div className="min-w-0">
                            <div className="w-fit max-w-full rounded-2xl rounded-bl-md border border-white/45 bg-white/75 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-slate-800 shadow-[0_10px_22px_rgba(90,104,160,0.14)] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={markdownComponents}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            <p className="mt-1 pl-1 text-[11px] leading-none text-slate-500 dark:text-slate-400">
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[82%] min-w-0">
                          <div className="ml-auto w-fit max-w-full rounded-2xl rounded-br-md border border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-indigo-600 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-white shadow-[0_10px_26px_rgba(60,85,200,0.34)] dark:border-indigo-300/30 dark:from-indigo-500 dark:to-indigo-600">
                            {message.content}
                          </div>
                          <p className="mt-1 pr-1 text-right text-[11px] leading-none text-slate-500 dark:text-slate-400">
                            {formatMessageTime(message.createdAt)}
                          </p>
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
                className="border-t border-slate-300/45 bg-white/28 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]"
              >
                <div
                  className={`relative rounded-[2.15rem] border bg-white/65 shadow-[0_14px_30px_rgba(72,87,150,0.2)] backdrop-blur-md transition-all duration-200 dark:border-white/20 dark:bg-white/10 dark:shadow-[0_14px_36px_rgba(10,16,44,0.4)] ${
                    isInputFocused
                      ? "border-slate-400/80 px-4 py-2"
                      : "border-slate-300/70 px-4 py-1.5"
                  }`}
                >
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder={
                      webhookUrl
                        ? "Ask about my projects, skills, or experience"
                        : "Set NEXT_PUBLIC_N8N_CHAT_WEBHOOK in .env"
                    }
                    disabled={!webhookUrl}
                    className="w-full bg-transparent px-2 py-1 pr-14 text-base leading-6 text-slate-800 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_7px_14px_rgba(66,94,210,0.35)] transition-colors hover:from-indigo-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700"
                    aria-label="Send message"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                      <path d="M12 18V6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                      <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
            className={`fixed bottom-5 right-5 z-50 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/56 to-[#e8efff]/46 px-3.5 py-2.5 text-left shadow-[0_14px_34px_rgba(53,74,160,0.2)] backdrop-blur-xl transition-transform dark:border-white/18 dark:from-[#1a2661]/58 dark:to-[#0d163f]/52 dark:shadow-[0_18px_44px_rgba(26,42,128,0.42)] lg:bottom-auto lg:right-6 lg:top-1/2 lg:-translate-y-1/2 ${
              isHighlightActive ? "animate-pulse ring-2 ring-indigo-400/75" : ""
            }`}
            aria-label="Open AI assistant"
          >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.8),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(157,183,255,0.25),transparent_45%)]" />
            <div className="flex items-center gap-2.5">
              <div className="relative z-10 grid h-10 w-10 place-items-center rounded-xl border border-indigo-200/90 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-indigo-200/25 dark:from-indigo-300/25 dark:via-indigo-400/12 dark:to-indigo-500/8">
                <Image
                  src="/assistant-bot.svg"
                  alt="JC AI bot avatar"
                  className="h-6 w-6 object-contain"
                  width={24}
                  height={24}
                />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#101a44]" />
              </div>
              <div className="relative z-10 pr-0.5 leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-indigo-700 dark:text-indigo-200">
                  JC AI Assistant
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Let’s Talk
                </p>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatPanel;
