"use client";

import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ContentGeneratorForm from "@/components/ContentGeneratorForm";
import ContentDisplayCard from "@/components/ContentDisplayCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

type GeneratedContent = {
  url: string;
  content_type: string;
  content: {
    raw: string;
    pydantic: null;
    json_dict: null;
    tasks_output: any[];
    token_usage: any;
  };
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { url: string; content_type: string }) => {
    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);

    try {
      const response = await fetch("https://167aliraza-crewai.hf.space/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate content.");
      }

      const result: GeneratedContent = await response.json();
      setGeneratedContent(result);
      toast.success("Content generated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setError(null);
    // The form itself will reset its fields via form.reset() in ContentGeneratorForm
  };

  const mainClasses = `flex flex-col gap-8 items-center w-full p-6 sm:p-8 bg-card rounded-lg shadow-lg ${
    generatedContent ? "max-w-4xl" : "max-w-xl"
  }`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background text-foreground relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={mainClasses}
      >
        <h1 className="text-3xl font-bold text-center text-foreground">
          AI Content Generator
        </h1>
        <p className="text-center text-muted-foreground max-w-prose">
          Enter a URL and select a content type to generate engaging text for your blog, social media, or newsletter.
        </p>

        <ContentGeneratorForm onSubmit={handleSubmit} onReset={handleReset} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center p-4 bg-red-50 border border-red-200 rounded-md w-full max-w-md"
          >
            Error: {error}
          </motion.div>
        )}

        {generatedContent && generatedContent.content?.raw && (
          <ContentDisplayCard
            content={generatedContent.content.raw}
            url={generatedContent.url}
            contentType={generatedContent.content_type}
          />
        )}
        <MadeWithDyad />
      </motion.main>
    </div>
  );
}