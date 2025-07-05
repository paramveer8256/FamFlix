import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800">
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose  text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/paramveer7267/"
            target="_blank"
            className="font-medium underline underline-offset-4"
            rel="noreferrer"
          >
            PvNation
          </a>
          . The Source code is available on{" "}
          <a
            href="https://github.com/paramveer7267/FAMFLIX"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Copyright className="size-4" />
          <span>2025 - Present, FamFlix.com, All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
