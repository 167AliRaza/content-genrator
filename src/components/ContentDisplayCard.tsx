"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

type ContentDisplayCardProps = {
  content: string;
  url: string;
  contentType: string;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
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
          <p className="text-sm text-muted-foreground">
            From: <a href={url} target="_blank" rel="noopener noreferrer" className="underline">{url}</a>
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            Type: {contentType}
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            readOnly
            className="min-h-[150px] resize-none"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentDisplayCard;