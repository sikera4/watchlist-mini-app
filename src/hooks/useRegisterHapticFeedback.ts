import { useTelegramApp } from "@/components/providers/TelegramAppProvider"

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';

export const useRegisterHapticFeedback = () => {
  const tgWebApp = useTelegramApp();

  const registerHapticFeedback = (type: HapticFeedbackType) => {
    tgWebApp?.HapticFeedback?.impactOccurred(type);
  }
  return registerHapticFeedback;
}
