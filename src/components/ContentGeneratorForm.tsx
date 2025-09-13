"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const contentTypes = ["blog", "x", "facebook", "linkedin", "newsletter"] as const;

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  content_type: z.enum(contentTypes, {
    required_error: "You need to select a content type.",
  }),
});

type ContentGeneratorFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onReset: () => void; // Add onReset prop
  isLoading: boolean;
};

const ContentGeneratorForm: React.FC<ContentGeneratorFormProps> = ({
  onSubmit,
  onReset,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      content_type: undefined,
    },
  });

  const handleReset = () => {
    form.reset(); // Reset form fields
    onReset(); // Call the parent's reset handler
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Content Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {contentTypes.map((type) => (
                    <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">
                        {type}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Content"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentGeneratorForm;