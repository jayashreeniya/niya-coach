const NIYA_URL = process.env.NEXT_PUBLIC_NIYA_URL || 'https://niya.app';
const PRACTICE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://practice.niya.app';

export function AppFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white/60 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            Part of the NIYA Emotional Wellness Ecosystem
          </p>

          <nav className="flex items-center gap-4">
            <FooterLink href={NIYA_URL} label="Professional Coaching" />
            <Dot />
            <FooterLink href={PRACTICE_URL} label="Daily Practice" />
            <Dot />
            <FooterLink href={`${NIYA_URL}/about`} label="About NIYA" />
          </nav>
        </div>

        <p className="text-center text-[10px] text-gray-300 mt-4">
          &copy; {new Date().getFullYear()} NIYA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-xs text-gray-500 hover:text-niya-600 transition-colors"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  );
}

function Dot() {
  return <span className="text-gray-300 text-[8px]">&bull;</span>;
}
