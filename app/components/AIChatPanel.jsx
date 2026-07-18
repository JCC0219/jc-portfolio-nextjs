"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
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
        src={assets.profile_img}
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
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportOffsetTop, setViewportOffsetTop] = useState(0);
  const chatEndRef = useRef(null);
  const dragControls = useDragControls();

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

  const mobileSheetStyle = isMobileViewport
    ? {
        height: viewportHeight ? `${viewportHeight}px` : "100dvh",
        top: `${viewportOffsetTop}px`,
      }
    : undefined;

  const handleSheetDragEnd = (_, info) => {
    if (!isMobileViewport) return;

    const draggedFarEnough = info.offset.y > 90;
    const draggedFastEnough = info.velocity.y > 500;

    if (draggedFarEnough || draggedFastEnough) {
      setIsOpen(false);
    }
  };

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
            drag={isMobileViewport ? "y" : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.18 }}
            dragMomentum={false}
            onDragEnd={handleSheetDragEnd}
            className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-gradient-to-b from-white/88 to-white/72 shadow-none backdrop-blur-2xl dark:from-[#0d1434]/88 dark:to-[#070b1f]/78 lg:inset-auto lg:right-6 lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:w-[360px] lg:rounded-3xl lg:border lg:border-white/40 lg:bg-gradient-to-b lg:from-white/62 lg:to-white/42 lg:shadow-[0_22px_70px_rgba(40,56,120,0.26)] lg:backdrop-blur-2xl lg:dark:border-white/15 lg:dark:from-[#111a45]/66 lg:dark:to-[#070b1f]/56 lg:dark:shadow-[0_24px_78px_rgba(15,24,70,0.55)]"
            style={mobileSheetStyle}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.52),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(149,173,255,0.14),transparent_60%)]" />
            <div className="flex h-full flex-col">
              <motion.div
                onPointerDown={(event) => dragControls.start(event)}
                className="flex cursor-grab touch-none justify-center pt-2 active:cursor-grabbing lg:hidden"
              >
                <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
              </motion.div>

              <header className="border-b border-slate-300/60 bg-white/38 px-4 py-3 backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={assets.profile_img}
                      alt="JC assistant avatar"
                      className="h-8 w-8 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                        JC AI Assistant
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

              <div className="chat-scrollbar flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white/8 to-transparent px-4 py-4 dark:from-white/[0.03]">
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
                            src={assets.profile_img}
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
                className="border-t border-slate-300/50 bg-white/22 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.03]"
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
            className="fixed bottom-5 right-5 z-50 rounded-full border border-indigo-200 bg-white/82 px-2.5 py-2 text-left shadow-[0_14px_35px_rgba(50,70,180,0.22)] backdrop-blur-md dark:border-indigo-300/40 dark:bg-[#111a43]/82 dark:shadow-[0_16px_50px_rgba(54,74,255,0.4)] lg:bottom-auto lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:px-2 lg:py-1.5"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/assistant-bot.svg"
                alt="JC AI bot avatar"
                className="h-8 w-8 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40 lg:h-7 lg:w-7"
                width={32}
                height={32}
              />
              <span className="hidden pr-1 text-xs font-semibold text-slate-800 dark:text-white/95 lg:inline">
                Ask JC
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatPanel;
