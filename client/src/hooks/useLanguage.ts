import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '@/store';
import { completeOnboarding, resetOnboarding, setLanguage } from '@/store/prefsSlice';
import type { Lang } from '@/types';

const dict: Record<string, Record<Lang, string>> = {
  'languageSelection.title': {
    en: 'Choose Your Language',
    ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    hi: 'अपनी भाषा चुनें',
  },
  'languageSelection.subtitle': {
    en: 'Select your preferred language to continue',
    ml: 'തുടരാൻ നിങ്ങൾ തിരഞ്ഞെടുക്കുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക',
    hi: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
  },
  'languageSelection.english': { en: 'English', ml: 'English', hi: 'English' },
  'languageSelection.englishLabel': {
    en: 'Continue in English',
    ml: 'ഇംഗ്ലീഷിൽ തുടരുക',
    hi: 'अंग्रेज़ी में जारी रखें',
  },
  'languageSelection.malayalam': { en: 'മലയാളം', ml: 'മലയാളം', hi: 'മലയാളം' },
  'languageSelection.malayalamLabel': {
    en: 'Malayalam',
    ml: 'മലയാളം',
    hi: 'मलयालम',
  },
  'languageSelection.hindi': { en: 'हिन्दी', ml: 'हिन्दी', hi: 'हिन्दी' },
  'languageSelection.hindiLabel': { en: 'Hindi', ml: 'हिंदी', hi: 'हिंदी' },
  'languageSelection.continue': { en: 'Continue', ml: 'തുടരുക', hi: 'जारी रखें' },
  'languageSelection.back': { en: 'Back', ml: 'പിന്നോട്ട്', hi: 'वापस' },
};

export function useLanguage() {
  const dispatch = useDispatch();
  const language = useSelector((s: RootState) => s.prefs.language);

  return {
    language,
    setLanguage: (code: Lang) => {
      dispatch(setLanguage(code));
    },
    completeOnboarding: () => {
      dispatch(completeOnboarding());
    },
    resetOnboarding: () => {
      dispatch(resetOnboarding());
    },
    t: (key: string): string =>
      dict[key]?.[language] ?? dict[key]?.en ?? key,
  };
}