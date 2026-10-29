import React from 'react';
import { X, Github, ShieldCheck, HardDrive, FileDown, ExternalLink, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const githubUrl = 'https://github.com/auroraossoftware/BookMaker';

  const handleRedirectGithub = () => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">About BookMaker</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Zero Signup • Browser-Native • Open Source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Privacy & In-Browser Storage Policy
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              BookMaker was engineered from the ground up to eliminate signups, cloud servers, and account logins.
              Your manuscripts, outlines, and cover configurations are stored directly in your browser's local
              memory storage engine.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No tracking or telemetry
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Zero signup or passwords
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Works 100% offline
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Instant local PDF downloads
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Key Features
            </h4>
            <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Continuous Auto-Save:</strong> Keystroke debouncing seamlessly flushes your edits to local
                  browser storage with zero latency.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FileDown className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Local PDF Generation:</strong> Produce print-ready 6"×9" trade paperbacks, A4, or A5 volumes
                  complete with cover, half-title, copyright, TOC, and running headers.
                </span>
              </div>
            </div>
          </div>

          {/* GitHub Source Code Redirection Card */}
          <div className="p-4 rounded-xl bg-stone-900 text-white dark:bg-black border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <span className="text-sm font-bold">Open Source on GitHub</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                MIT License
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              BookMaker is 100% open source. You can view the complete source code, fork the repository, star the
              project, or report issues on GitHub.
            </p>
            <button
              onClick={handleRedirectGithub}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <span>Visit GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for storytellers & authors</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
