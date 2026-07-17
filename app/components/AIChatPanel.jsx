"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const initialMessage = {
  role: "assistant",
  content:
    "Hi, I am JC's AI assistant. Ask me anything about my projects, skills, certifications, and experience.",
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
        className="h-7 w-7 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
      />
      <motion.div
        initial={{ opacity: 0, x: -8, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-fit max-w-[78%] rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 dark:border-indigo-400/35 dark:bg-[#161f49]/95 dark:text-indigo-100"
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

const AIChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
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
            className="fixed inset-0 z-50 h-[100dvh] w-screen bg-white/98 shadow-none backdrop-blur dark:bg-[#070b1f]/98 lg:inset-auto lg:right-6 lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:w-[360px] lg:rounded-2xl lg:border lg:border-indigo-200/70 lg:bg-white/72 lg:shadow-[0_20px_70px_rgba(50,70,180,0.16)] lg:backdrop-blur-xl lg:dark:border-indigo-300/30 lg:dark:bg-[#0a1233]/72 lg:dark:shadow-[0_20px_80px_rgba(35,45,150,0.3)]"
            style={mobileSheetStyle}
          >
            <div className="flex h-full flex-col">
              <motion.div
                onPointerDown={(event) => dragControls.start(event)}
                className="flex cursor-grab touch-none justify-center pt-2 active:cursor-grabbing lg:hidden"
              >
                <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
              </motion.div>

              <header className="border-b border-indigo-200 px-4 py-3 dark:border-indigo-400/20">
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
                      <p className="truncate text-xs text-slate-500 dark:text-slate-300">
                        Ask me anything about my background.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full border border-indigo-200 text-sm text-slate-600 hover:bg-indigo-100 dark:border-indigo-300/30 dark:text-slate-200 dark:hover:bg-indigo-400/20 lg:h-7 lg:w-7"
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
                            className="h-7 w-7 rounded-full border border-indigo-300/60 object-cover dark:border-indigo-300/40"
                          />
                          <div className="w-fit max-w-[78%] rounded-2xl rounded-bl-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-slate-800 dark:border-indigo-400/35 dark:bg-[#161f49]/95 dark:text-slate-100">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div className="w-fit max-w-[78%] rounded-2xl rounded-br-md bg-indigo-600 px-3 py-2 text-sm leading-6 whitespace-pre-wrap break-words text-white dark:bg-indigo-500">
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
                className="border-t border-indigo-200 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 dark:border-indigo-400/20"
              >
                <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-slate-50 px-2 py-2 dark:border-indigo-300/30 dark:bg-[#0f1533]">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={
                      webhookUrl
                        ? "Ask anything about my experience, skills, or projects..."
                        : "Set NEXT_PUBLIC_N8N_CHAT_WEBHOOK in .env"
                    }
                    disabled={!webhookUrl}
                    className="w-full bg-transparent px-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-indigo-500 dark:disabled:bg-slate-600"
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
