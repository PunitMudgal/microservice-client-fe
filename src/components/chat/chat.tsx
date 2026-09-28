"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        {isOpen ? "✕" : "💬"}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Nesta Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto px-4">
              <div className="flex flex-col gap-3 py-4">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Hi! I can help you with menu items, orders, and more. What would you like to know?
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[85%] text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      {msg.parts.map((part, i) =>
                        part.type === "text" ? (
                          <span key={i}>{part.text}</span>
                        ) : null,
                      )}
                    </div>
                  </div>
                ))}
                {status === "streaming" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm animate-pulse">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about menu, orders..."
                disabled={status === "streaming"}
              />
              <Button
                onClick={handleSend}
                disabled={status === "streaming" || !input.trim()}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
