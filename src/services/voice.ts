// Text-to-speech voice assistant for SachBite Delivery Partner (Hindi/Hinglish/English)

class VoiceAssistantService {
  private isEnabled: boolean = true;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      const saved = localStorage.getItem('sachbite_voice_enabled');
      this.isEnabled = saved !== null ? saved === 'true' : true;
    }
  }

  isVoiceEnabled(): boolean {
    return this.isEnabled && this.isSupported;
  }

  setVoiceEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sachbite_voice_enabled', enabled ? 'true' : 'false');
    }
  }

  speak(text: string, priority = false) {
    if (!this.isEnabled || !this.isSupported) return;

    try {
      if (priority && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Find Hindi or Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
      );
      if (hiVoice) {
        utterance.voice = hiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Voice synthesis policy fallback
    }
  }

  announceNewOrder(orderId: string, grandTotal: number, isCOD: boolean) {
    const codText = isCOD ? `Cash on delivery ₹${grandTotal} collect karna hai.` : 'Online payment ho chuka hai.';
    this.speak(`Naya order ${orderId} aaya hai. ${codText} Jaldi accept karein!`, true);
  }

  announceStage(stageTitle: string) {
    this.speak(`Status update: ${stageTitle}`);
  }

  announceDeliverySuccess(earning: number) {
    this.speak(`Badhaai ho! Order deliver ho gaya. Aapke wallet me ₹${earning} add ho gaye.`);
  }

  announceBreak(onBreak: boolean) {
    if (onBreak) {
      this.speak('Break mode active. Abhi naye orders pause kar diye gaye hain.');
    } else {
      this.speak('Aap duty par wapas aa gaye hain. Naye orders lene ke liye taiyaar.');
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
