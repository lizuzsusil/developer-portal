import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { setLocale, getLocale } from "../lib/appearance";

const languages = [
    { code: "en", label: "English" },
    { code: "si", label: "සිංහල" },
    { code: "ta", label: "தமிழ்" },
] as const;

interface LanguageSwitcherProps {
    value?: string;
    onChange?: (language: string) => void;
}

export function LanguageSwitcher({
    value,
    onChange,
}: LanguageSwitcherProps) {
    // Local state fallback in case value is not controlled externally
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return value ?? getLocale().locale ?? "en";
    });

    useEffect(() => {
        if (value !== undefined) {
            setSelectedLanguage(value);
        }
    }, [value]);

    const currentValue = value ?? selectedLanguage;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;

        setSelectedLanguage(selectedCode);
        setLocale({
            locale: selectedCode,
            language: selectedCode,
        });

        onChange?.(selectedCode);
    };

    return (
        <div className="relative inline-flex items-center">
            <Globe2
                size={14}
                className="pointer-events-none absolute left-3 z-10 text-gray-500"
            />

            <select
                value={currentValue}
                onChange={handleChange}
                aria-label="Select language"
                className="
                appearance-none
            cursor-pointer
            rounded-full
            border border-neutral-700/70
            bg-neutral-900/60
            py-1.5
            pl-8
            pr-8
            text-xs
            font-medium
            text-neutral-300
            shadow-sm
            outline-none
            transition-colors
            hover:border-neutral-600
            hover:text-white
            focus:right-0
            focus:outline-none
            focus:border-neutral-500
            "
            >
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </select>

            <svg
                className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    d="m6 9 6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}