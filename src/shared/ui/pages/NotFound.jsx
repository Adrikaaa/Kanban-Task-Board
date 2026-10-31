import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Button from "../components/Button";
import { LogoMark } from "../components/Logo";

const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <LogoMark className="size-10" />
      <h1 className="text-xl font-semibold text-ink">This page doesn't exist</h1>
      <p className="max-w-sm text-ink-700">The link may be broken, or the page may have moved.</p>
      <Button to="/board" variant="primary">
        Go to board
      </Button>
    </main>
  );
};

export default NotFound;
