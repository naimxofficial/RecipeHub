import NextLink from "next/link";
import { FaBan } from "react-icons/fa6";

export default function BlockedPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <FaBan className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
          Account suspended
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your account has been suspended by an administrator. If you believe
          this is a mistake, please contact us at{" "}
          <a
            href="mailto:support@recipehub.com"
            className="text-accent hover:underline"
          >
            support@recipehub.com
          </a>
          .
        </p>
        <NextLink
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          ← Back to home
        </NextLink>
      </div>
    </main>
  );
}