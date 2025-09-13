"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, Twitter, Facebook, Linkedin, Mail, Link } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Element } from 'hast'; // Re-import Element from hast

type ContentDisplayCardProps = {
  content: string;
  url: string;
  contentType: string;
};

// Define a specific interface for the props passed to custom markdown components
interface MarkdownComponentProps extends React.HTMLAttributes<HTMLElement> {
  node: Element;
  inline?: boolean;
}

// Define custom components for markdown rendering with Tailwind CSS
const markdownComponents: Components = {
  h1: ({ node, ...props }: MarkdownComponentProps) => <h1 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h2: ({ node, ...props }: MarkdownComponentProps) => <h2 className="text-2xl font-semibold mt-5 mb-2" {...props} />,
  h3: ({ node, ...props }: MarkdownComponentProps) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
  p: ({ node, ...props }: MarkdownComponentProps) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: ({ node, ...props }: MarkdownComponentProps) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: ({ node, ...props }: MarkdownComponentProps) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: ({ node, ...props }: MarkdownComponentProps) => <li className="mb-1" {...props} />,
  a: ({ node, ...props }: MarkdownComponentProps) => <a className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: ({ node, ...props }: MarkdownComponentProps) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400 my-4" {...props} />,
  code: ({ node, inline, ...props }: MarkdownComponentProps) => (
    <code className={`rounded-md px-1 py-0.5 text-sm ${inline ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : ""}`} {...props} />
  ),
  pre: ({ node, ...props }: MarkdownComponentProps) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4">
      <code {...props} />
    </pre>
  ),
};

const ContentDisplayCard: React.FC<ContentDisplayCardProps> = ({
  content,
  url,
  contentType,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const ContentTypeIcon = () => {
    switch (contentType) {
      case "blog":
        return <BookOpen className="h-4 w-4 mr-2" />;
      case "x":
        return <Twitter className="h-4 w-4 mr-2" />;
      case "facebook":
        return <Facebook className="h-4 w-4 mr-2" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 mr-2" />;
      case "newsletter":
        return <Mail className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Generated Content
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center">
            From:{" "}
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline flex items-center ml-1">
              {url} <Link className="h-3 w-3 ml-1" />
            </a>
          </p>
          <p className="text-sm text-muted-foreground capitalize flex items-center">
            <ContentTypeIcon />
            Type: {contentType}
          </p>
        </CardHeader>
        <CardContent className="text-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentDisplayCard;