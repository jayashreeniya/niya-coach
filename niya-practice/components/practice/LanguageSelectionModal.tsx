'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { VOICES } from '@/types/tts';
import type { SupportedLanguage } from '@/types/database';
import { SUPPORTED_LANGUAGES } from '@/types/database';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: SupportedLanguage) => void;
  defaultLanguage?: SupportedLanguage;
}

const NATIVE_VOICES = new Set(['en', 'hi', 'ta', 'te']);

export function LanguageSelectionModal({
  isOpen,
  onClose,
  onSelect,
  defaultLanguage = 'en',
}: LanguageSelectionModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                <div className="mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-gray-900 mb-1"
                  >
                    Choose Your Language
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Select the language for your audio-guided practice
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1.5 mb-4 pr-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const voice = VOICES[lang];
                    if (!voice) return null;
                    const isDefault = lang === defaultLanguage;
                    const hasNativeVoice = NATIVE_VOICES.has(lang);

                    return (
                      <button
                        key={lang}
                        onClick={() => onSelect(lang)}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all group hover:scale-[1.01] active:scale-[0.99] ${
                          isDefault
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 group-hover:text-purple-700">
                              {voice.languageName}
                            </span>
                            {isDefault && (
                              <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                            {hasNativeVoice && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                Native voice
                              </span>
                            )}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
