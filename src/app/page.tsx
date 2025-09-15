"use client";

import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ContentGeneratorForm from "@/components/ContentGeneratorForm";
import ContentDisplayCard from "@/components/ContentDisplayCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import * as z from "zod"; // Import z for schema inference

const contentTypes = ["blog", "x", "facebook", "linkedin", "newsletter"] as const;
const aspectRatios = ["16:9", "1:1", "4:5"] as const;

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  content_type: z.enum(contentTypes, {
    required_error: "You need to select a content type.",
  }),
  image_prompt_override: z.string().optional().nullable(),
  aspect_ratio: z.enum(aspectRatios, {
    required_error: "You need to select an aspect ratio for the image.",
  }).optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

type GeneratedContent = {
  url: string;
  content_type: string;
  image_url: string | null;
  content: string; // backend now returns final_with_image as plain string
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile(); // Keep the hook, but temporarily bypass its effect on rendering

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);

    try {
      const response = await fetch("https://167aliraza-crewai.hf.space//generate-content-with-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.url,
          content_type: data.content_type,
          image_prompt_override: data.image_prompt_override || null,
          aspect_ratio: data.aspect_ratio || "16:9",
        }),
      });

      console.log("API Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Data:", errorData);
        throw new Error(errorData.detail || "Failed to generate content.");
      }

      const rawResult = await response.json();
      console.log("Raw API Result:", rawResult);

      // Normalize result to our expected shape
      const result: GeneratedContent = {
        url: rawResult.url,
        content_type: rawResult.content_type,
        image_url: rawResult.image_url ?? null,
        content: typeof rawResult.content === "string" ? rawResult.content : (rawResult.content?.raw ?? ""),
      };

      // Prepend base URL if image_url is a local static path
      if (result.image_url && result.image_url.startsWith("/static/")) {
        result.image_url = `https://167aliraza-crewai.hf.space${result.image_url}`;
        console.log("Adjusted image_url:", result.image_url);
      }

      setGeneratedContent(result);
      console.log("Generated content state set:", result);
      toast.success("Content generated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      console.error("Caught error during content generation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background text-foreground relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full max-w-7xl flex flex-col items-center justify-center"
      >
        <div className="flex flex-col gap-8 items-center w-full p-6 sm:p-8 bg-card rounded-lg shadow-lg max-w-xl">
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

          {/* Simplified rendering: If generatedContent exists, show a placeholder and then the card */}
          {generatedContent && (
            <>
              <div className="text-green-500 text-center p-4 bg-green-50 border border-green-200 rounded-md w-full max-w-md">
                Content data received! Attempting to render...
              </div>
              {generatedContent.content && (
                <ContentDisplayCard
                  content={generatedContent.content}
                  url={generatedContent.url}
                  contentType={generatedContent.content_type}
                  image_url={generatedContent.image_url}
                />
              )}
            </>
          )}
        </div>
        <MadeWithDyad />
      </motion.main>
    </div>
  );
}