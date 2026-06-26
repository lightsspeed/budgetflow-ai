"use client";

import { useRef, useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";

export default function AiChatPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
  } = useChatStore();

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const todayConvs = conversations.filter(
    (c) => Date.now() - c.createdAt < 86400000
  );
  const yesterdayConvs = conversations.filter(
    (c) =>
      Date.now() - c.createdAt >= 86400000 &&
      Date.now() - c.createdAt < 172800000
  );
  const earlierConvs = conversations.filter(
    (c) => Date.now() - c.createdAt >= 172800000
  );

  const hasMessages = activeConv && activeConv.messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 relative w-full">
      {/* TopNavBar (Desktop) */}
      <header className="hidden md:flex justify-between items-center w-full h-16 px-6 max-w-container-max mx-auto bg-surface/80 backdrop-blur-md shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4" />
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-label-md text-label-md font-bold border border-outline-variant/30">
            U
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar History */}
        <aside className="hidden lg:flex flex-col w-[260px] border-r border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
          <div className="p-4 border-b border-outline-variant/30">
            <button
              onClick={() => createConversation()}
              className="flex items-center justify-between w-full bg-surface-container-low hover:bg-surface-container-high transition-colors p-2 rounded-lg text-primary font-label-md"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                New Chat
              </span>
              <span className="material-symbols-outlined text-sm">
                edit_square
              </span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
            {todayConvs.length > 0 && (
              <>
                <h3 className="font-label-sm text-label-sm text-on-surface-variant px-2 py-2 mt-2">
                  Today
                </h3>
                {todayConvs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c.id)}
                    className={`block w-full text-left p-2 rounded-lg font-body-sm mb-1 truncate transition-colors ${
                      c.id === activeConversationId
                        ? "bg-surface-container-low text-on-surface"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </>
            )}
            {yesterdayConvs.length > 0 && (
              <>
                <h3 className="font-label-sm text-label-sm text-on-surface-variant px-2 py-2 mt-4">
                  Yesterday
                </h3>
                {yesterdayConvs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c.id)}
                    className={`block w-full text-left p-2 rounded-lg font-body-sm mb-1 truncate transition-colors ${
                      c.id === activeConversationId
                        ? "bg-surface-container-low text-on-surface"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </>
            )}
            {earlierConvs.length > 0 && (
              <>
                <h3 className="font-label-sm text-label-sm text-on-surface-variant px-2 py-2 mt-4">
                  Earlier
                </h3>
                {earlierConvs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c.id)}
                    className={`block w-full text-left p-2 rounded-lg font-body-sm mb-1 truncate transition-colors ${
                      c.id === activeConversationId
                        ? "bg-surface-container-low text-on-surface"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Chat Canvas */}
        <div className="flex-1 flex flex-col bg-surface-bright relative min-h-0">
          {/* Chat Header (Mobile) */}
          <div className="md:hidden flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 z-10 sticky top-0 flex-shrink-0">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
              AI Chat
            </h2>
            <button
              onClick={() => setMobileHistoryOpen(!mobileHistoryOpen)}
              className="text-on-surface-variant"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          {/* Mobile History Overlay */}
          {mobileHistoryOpen && (
            <div className="md:hidden absolute inset-0 z-50 bg-surface-container-lowest/95 backdrop-blur-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-md text-label-md font-semibold text-on-surface">
                  Conversations
                </h3>
                <button
                  onClick={() => setMobileHistoryOpen(false)}
                  className="text-on-surface-variant p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <button
                onClick={() => {
                  createConversation();
                  setMobileHistoryOpen(false);
                }}
                className="w-full bg-primary text-on-primary rounded-xl py-2.5 font-label-md text-label-md mb-4"
              >
                + New Chat
              </button>
              {[...todayConvs, ...yesterdayConvs, ...earlierConvs].map(
                (c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConversation(c.id);
                      setMobileHistoryOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-3 rounded-xl font-body-sm mb-1 ${
                      c.id === activeConversationId
                        ? "bg-surface-container text-on-surface font-medium"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {c.title}
                  </button>
                )
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-xl flex flex-col gap-6 hide-scrollbar relative">
            {/* Empty State */}
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center text-center mt-10 mb-8 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    smart_toy
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">
                  How can I help with your finances today?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Ask me to log expenses, analyze your spending, or suggest
                  saving strategies.
                </p>
              </div>
            )}

            {/* Messages */}
            {hasMessages &&
              activeConv.messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end w-full">
                    <div className="bg-surface-variant text-on-surface rounded-2xl rounded-tr-sm py-3 px-4 max-w-[85%] md:max-w-[70%] shadow-sm">
                      <p className="font-body-md text-body-md">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start w-full">
                    <div className="flex gap-3 max-w-[95%] md:max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                          smart_toy
                        </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {/* Typing indicator */}
                        {msg.typing && (
                          <div className="flex items-center gap-2 mb-2 text-primary font-label-sm">
                            <span className="material-symbols-outlined text-sm animate-spin">
                              sync
                            </span>
                            {msg.content}
                          </div>
                        )}
                        {/* Normal message */}
                        {!msg.typing && (
                          <div className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-2xl rounded-tl-sm py-3 px-4 shadow-sm">
                            <p className="font-body-md text-body-md mb-3">
                              {msg.content}
                            </p>
                            {msg.chartData && (
                              <div className="bg-surface-bright rounded-xl p-4 border border-outline-variant/20 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                  <span className="font-label-md text-label-md font-semibold">
                                    Monthly Progress
                                  </span>
                                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                                    {msg.chartData.progress}% Used
                                  </span>
                                </div>
                                <div className="w-full bg-surface-container-high rounded-full h-2.5 mb-2 overflow-hidden">
                                  <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{
                                      width: `${msg.chartData.progress}%`,
                                    }}
                                  />
                                </div>
                                {msg.chartData.categories && (
                                  <div className="grid grid-cols-2 gap-4 mt-6">
                                    {msg.chartData.categories.map(
                                      (cat, i) => (
                                        <div key={i}>
                                          <div className="flex items-center gap-2 mb-1">
                                            <div
                                              className="w-2 h-2 rounded-full"
                                              style={{
                                                backgroundColor: cat.color,
                                              }}
                                            />
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                              {cat.label}
                                            </span>
                                          </div>
                                          <span className="font-body-md text-body-md font-medium">
                                            ${cat.amount}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {msg.actions && (
                          <div className="flex gap-2">
                            {msg.actions.map((action) => (
                              <button
                                key={action.action}
                                className="font-label-sm bg-surface-container border border-outline-variant/30 px-3 py-1 rounded-full hover:bg-surface-container-high transition-colors"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}

            {/* Spacer for input area */}
            <div className="h-24 md:h-32" ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface-bright via-surface-bright to-transparent pt-10 pb-4 px-4 md:px-8 pointer-events-none">
            <div className="max-w-3xl mx-auto flex flex-col gap-3 pointer-events-auto">
              {/* Suggested Chips */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {[
                  "Why am I overspending?",
                  "How can I save $5,000 more?",
                  "Summarize this month",
                ].map((chip) => (
                  <button
                    key={chip}
                    className="whitespace-nowrap flex-shrink-0 bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-label-sm text-label-sm py-1.5 px-3 rounded-full shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              {/* Input Bar */}
              <div className="relative bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex items-end p-2">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors flex-shrink-0 self-end">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <textarea
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none font-body-md text-body-md py-2 px-2 text-on-surface placeholder:text-on-surface-variant max-h-32 hide-scrollbar outline-none"
                  placeholder="Message BudgetFlow AI..."
                  rows={1}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "0";
                    el.style.height = Math.min(el.scrollHeight, 128) + "px";
                  }}
                />
                <button className="p-2 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0 self-end shadow-sm">
                  <span className="material-symbols-outlined">
                    arrow_upward
                  </span>
                </button>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-on-surface-variant/70">
                  AI can make mistakes. Verify important financial data.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
