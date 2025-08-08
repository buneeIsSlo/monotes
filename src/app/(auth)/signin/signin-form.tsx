"use client";

import { useForm } from "react-hook-form";
import type React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Notebook } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SigninValues = z.infer<typeof signinSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const { signIn } = useAuthActions();
  const router = useRouter();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninValues) => {
    try {
      await signIn("password", { ...values, flow: step });
      toast.success(
        step === "signIn"
          ? "Signed in Successfully"
          : "Account created Successfully"
      );
      router.push("/");
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        (error.message.includes("InvalidAccountId") ||
          error.message.includes("InvalidSecret"))
      ) {
        form.setError("root", {
          type: "manual",
          message: "Invalid credentials",
        });
      } else {
        toast.error("Oops, something went wrong. Please try again.");
      }
    } finally {
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Notebook className="size-6" />
              </div>
              <span className="sr-only">Monotes</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Monotes</h1>
            <div className="text-center text-sm">
              Enter your credentials to get started
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader className="animate-spin" />
              )}
              {step === "signIn" ? "Sign In" : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-muted-foreground text-center text-xs text-balance">
        <Button
          variant="link"
          type="button"
          className="w-full text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            setStep(step === "signIn" ? "signUp" : "signIn");
            form.reset();
          }}
        >
          {step === "signIn"
            ? "Don't have an account? Create one."
            : "Already have an account? Sign In."}
        </Button>
      </div>
    </div>
  );
}
