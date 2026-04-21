import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'kn' | 'hi';

interface TranslationSructure {
  common: {
    dashboard: string;
    cropRec: string;
    pestDet: string;
    history: string;
    logout: string;
    loading: string;
    backToDashboard: string;
    farmerLevel: string;
  };
  auth: {
    title: string;
    subtitle: string;
    signIn: string;
    register: string;
    email: string;
    password: string;
    connectGoogle: string;
    neuralNet: string;
    enterLaboratory: string;
    createProfile: string;
    sustainable: string;
  };
  dashboard: {
    greeting: string;
    philosophyTitle: string;
    philosophyText: string;
    localConditions: string;
    temp: string;
    humidity: string;
    rainfall: string;
    soilPh: string;
    launchRecommendation: string;
    browseLogs: string;
    diagnosticTool: string;
    analyticalTool: string;
    startAnalysis: string;
    waitingData: string;
  };
  crop: {
    title: string;
    subtitle: string;
    soilAnalysis: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    ph: string;
    temp: string;
    humidity: string;
    rainfall: string;
    location: string;
    updateMetrics: string;
    analyzing: string;
    optimalSowing: string;
    farmingInsight: string;
    planAnother: string;
    waitMetrics: string;
  };
  pest: {
    title: string;
    subtitle: string;
    healthScanner: string;
    pathogenDetected: string;
    confidence: string;
    morphDetails: string;
    recommendedPesticides: string;
    initiateNewScan: string;
    uploadFile: string;
    launchCamera: string;
    processing: string;
    analyzePattern: string;
    noImage: string;
    scanPending: string;
    positionLens: string;
  };
  history: {
    title: string;
    subtitle: string;
    archivalRecords: string;
    all: string;
    crop: string;
    pest: string;
    empty: string;
    unearthing: string;
    recommendation: string;
    detection: string;
    recently: string;
    details: string;
    close: string;
  };
  market: {
    title: string;
    subtitle: string;
    fetchPrices: string;
    loadingPrices: string;
    commodity: string;
    price: string;
    marketName: string;
    lastUpdated: string;
    noData: string;
    searchHint: string;
  };
}

export const translations: Record<Language, TranslationSructure> = {
  en: {
    common: {
      dashboard: "Dashboard",
      cropRec: "Crop Recommendation",
      pestDet: "Pest Detection",
      history: "History Log",
      logout: "Logout",
      loading: "AgriZen",
      backToDashboard: "Back to Dashboard",
      farmerLevel: "Farmer Level",
    },
    auth: {
      title: "AgriZen",
      subtitle: "Est. MMXXIV • AI Precision",
      signIn: "Sign In",
      register: "Register",
      email: "Email Address",
      password: "Secret Key",
      connectGoogle: "Connect via Google",
      neuralNet: "Sync with Neural Net",
      enterLaboratory: "Enter Laboratory",
      createProfile: "Create Profile",
      sustainable: "Sustainable AI • Crafted for the Earth",
    },
    dashboard: {
      greeting: "Hello",
      philosophyTitle: "AgriZen Philosophy",
      philosophyText: "AgriZen combines ancestral wisdom with cutting-edge artificial intelligence. We believe that technology should empower farmers, not replace them. Our models are trained to understand the subtle language of the earth.",
      localConditions: "Local Conditions",
      temp: "Temp",
      humidity: "Humidity",
      rainfall: "Rainfall",
      soilPh: "Soil pH",
      launchRecommendation: "Launch Recommendation →",
      browseLogs: "Browse Logs →",
      diagnosticTool: "Diagnostic Tool",
      analyticalTool: "Analytical Tool",
      startAnalysis: "Start Analysis",
      waitingData: "Waiting for data",
    },
    crop: {
      title: "Crop Recommendation",
      subtitle: "Quantify your environment for AI-driven precision.",
      soilAnalysis: "Soil Analysis",
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      ph: "pH Level",
      temp: "Temp (°C)",
      humidity: "Humidity (%)",
      rainfall: "Rainfall (mm)",
      location: "Location",
      updateMetrics: "Update Soil Metrics",
      analyzing: "Analyzing Analytics...",
      optimalSowing: "Optimal Sowing",
      farmingInsight: "Farming Insight",
      planAnother: "Plan another crop",
      waitMetrics: "Submit soil metrics to begin",
    },
    pest: {
      title: "Pest Detection",
      subtitle: "Identifying floral pathogens using spatial neural networks.",
      healthScanner: "Health Scanner",
      pathogenDetected: "Pathogen Detected",
      confidence: "Confidence",
      morphDetails: "Morphological Details",
      recommendedPesticides: "Recommended Pesticides",
      initiateNewScan: "Initiate new scan",
      uploadFile: "Upload File",
      launchCamera: "Launch Camera",
      processing: "Processing Scan...",
      analyzePattern: "Analyze Pattern",
      noImage: "No image captured",
      scanPending: "Scan pending",
      positionLens: "Position lens over plant tissue",
    },
    history: {
      title: "Farming History",
      subtitle: "Reviewing established patterns and historical yields.",
      archivalRecords: "Archival Records",
      all: "All",
      crop: "Crop",
      pest: "Pest",
      empty: "The archives are currently empty.",
      unearthing: "Unearthing historical artifacts...",
      recommendation: "Recommendation",
      detection: "Detection",
      recently: "Recently",
      details: "Detailed Analytics",
      close: "Close Record",
    },
    market: {
      title: "Market Trends",
      subtitle: "Daily exchange rates for agricultural commodities.",
      fetchPrices: "Fetch Live Prices",
      loadingPrices: "Scanning Digital Mandis...",
      commodity: "Commodity",
      price: "Live Price",
      marketName: "Market/State",
      lastUpdated: "Intelligence Date",
      noData: "Select location to view rates.",
      searchHint: "Detecting local market nodes...",
    }
  },
  kn: {
    common: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      cropRec: "ಬೆಳೆ ಶಿಫಾರಸು",
      pestDet: "ಕೀಟ ಪತ್ತೆ",
      history: "ಇತಿಹಾಸ ಲಾಗ್",
      logout: "ಲಾಗ್ ಔಟ್",
      loading: "ಅಗ್ರಿಜೆನ್",
      backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
      farmerLevel: "ರೈತರ ಮಟ್ಟ",
    },
    auth: {
      title: "ಅಗ್ರಿಜೆನ್",
      subtitle: "ಸ್ಥಾಪನೆ MMXXIV • AI ನಿಖರತೆ",
      signIn: "ಸೈನ್ ಇನ್",
      register: "ನೋಂದಾಯಿಸಿ",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      password: "ರಹಸ್ಯ ಕೀ",
      connectGoogle: "ಗೂಗಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ",
      neuralNet: "ನರಮಂಡಲದೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಿ",
      enterLaboratory: "ಪ್ರಯೋಗಾಲಯವನ್ನು ಪ್ರವೇಶಿಸಿ",
      createProfile: "ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
      sustainable: "ಸುಸ್ಥಿರ AI • ಭೂಮಿಗಾಗಿ ರಚಿಸಲಾಗಿದೆ",
    },
    dashboard: {
      greeting: "ಹಲೋ",
      philosophyTitle: "ಅಗ್ರಿಜೆನ್ ತತ್ವಶಾಸ್ತ್ರ",
      philosophyText: "ಅಗ್ರಿಜೆನ್ ಪೂರ್ವಜರ ಜ್ಞಾನವನ್ನು ಅತ್ಯಾಧುನಿಕ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಸಂಯೋಜಿಸುತ್ತದೆ. ತಂತ್ರಜ್ಞಾನವು ರೈತರನ್ನು ಬದಲಿಸಬಾರದು, ಆದರೆ ಅವರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸಬೇಕು ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ. ನಮ್ಮ ಮಾದರಿಗಳು ಭೂಮಿಯ ಸೂಕ್ಷ್ಮ ಭಾಷೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ತರಬೇತಿ ಪಡೆದಿವೆ.",
      localConditions: "ಸ್ಥಳೀಯ ಪರಿಸ್ಥಿತಿಗಳು",
      temp: "ತಾಪಮಾನ",
      humidity: "ಆರ್ದ್ರತೆ",
      rainfall: "ಮಳೆ",
      soilPh: "ಮಣ್ಣಿನ pH",
      launchRecommendation: "ಶಿಫಾರಸು ಪ್ರಾರಂಭಿಸಿ →",
      browseLogs: "ಲಾಗ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ →",
      diagnosticTool: "ರೋಗನಿರ್ಣಯದ ಸಾಧನ",
      analyticalTool: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಸಾಧನ",
      startAnalysis: "ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ",
      waitingData: "ಡೇಟಾಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    },
    crop: {
      title: "ಬೆಳೆ ಶಿಫಾರಸು",
      subtitle: "AI-ಚಾಲಿತ ನಿಖರತೆಗಾಗಿ ನಿಮ್ಮ ಪರಿಸರವನ್ನು ಪ್ರಮಾಣೀಕರಿಸಿ.",
      soilAnalysis: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ",
      nitrogen: "ಸಾರಜನಕ (N)",
      phosphorus: "ರಂಜಕ (P)",
      potassium: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
      ph: "pH ಮಟ್ಟ",
      temp: "ತಾಪಮಾನ (°C)",
      humidity: "ಆರ್ದ್ರತೆ (%)",
      rainfall: "ಮಳೆ (mm)",
      location: "ಸ್ಥಳ",
      updateMetrics: "ಮಣ್ಣಿನ ಮಾಪನಗಳನ್ನು ನವೀಕರಿಸಿ",
      analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      optimalSowing: "ಸೂಕ್ತ ಬಿತ್ತನೆ",
      farmingInsight: "ಕೃಷಿ ಒಳನೋಟ",
      planAnother: "ಇನ್ನೊಂದು ಬೆಳೆ ಯೋಜಿಸಿ",
      waitMetrics: "ಪ್ರಾರಂಭಿಸಲು ಮಣ್ಣಿನ ಮಾಪನಗಳನ್ನು ಸಲ್ಲಿಸಿ",
    },
    pest: {
      title: "ಕೀಟ ಪತ್ತೆ",
      subtitle: "ಸ್ಪೇಷಿಯಲ್ ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳನ್ನು ಬಳಸಿ ಸಸ್ಯ ರೋಗಕಾರಕಗಳನ್ನು ಗುರುತಿಸುವುದು.",
      healthScanner: "ಆರೋಗ್ಯ ಸ್ಕ್ಯಾನರ್",
      pathogenDetected: "ರೋಗಕಾರಕ ಪತ್ತೆಯಾಗಿದೆ",
      confidence: "ನಂಬಿಕೆ",
      morphDetails: "ರೂಪವಿಜ್ಞಾನದ ವಿವರಗಳು",
      recommendedPesticides: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಕೀಟನಾಶಕಗಳು",
      initiateNewScan: "ಹೊಸ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ",
      uploadFile: "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      launchCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ",
      processing: "ಸ್ಕ್ಯಾನ್ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...",
      analyzePattern: "ಮಾದರಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
      noImage: "ಯಾವುದೇ ಚಿತ್ರ ಸೆರೆಹಿಡಿಯಲಾಗಿಲ್ಲ",
      scanPending: "ಸ್ಕ್ಯಾನ್ ಬಾಕಿ ಇದೆ",
      positionLens: "ಸಸ್ಯದ ಅಂಗಾಂಶದ ಮೇಲೆ ಲೆನ್ಸ್ ಇರಿಸಿ",
    },
    history: {
      title: "ಕೃಷಿ ಇತಿಹಾಸ",
      subtitle: "ಸ್ಥಾಪಿತ ಮಾದರಿಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ಇಳುವರಿಯನ್ನು ಪರಿಶೀಲಿಸುವುದು.",
      archivalRecords: "ದಾಖಲೆಗಳು",
      all: "ಎಲ್ಲಾ",
      crop: "ಬೆಳೆ",
      pest: "ಕೀಟ",
      empty: "ದಾಖಲೆಗಳು ಪ್ರಸ್ತುತ ಖಾಲಿ ಇವೆ.",
      unearthing: "ಐತಿಹಾಸಿಕ ಅಂಶಗಳನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...",
      recommendation: "ಶಿಫಾರಸು",
      detection: "ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ",
      recently: "ಇತ್ತೀಚೆಗೆ",
      details: "ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ",
      close: "ದಾಖಲೆ ಮುಚ್ಚಿ",
    },
    market: {
      title: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು",
      subtitle: "ಕೃಷಿ ಸರಕುಗಳಿಗೆ ದೈನಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು.",
      fetchPrices: "ಲೈವ್ ಬೆಲೆಗಳನ್ನು ಪಡೆಯಿರಿ",
      loadingPrices: "ಡಿಜಿಟಲ್ ಮಂಡಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      commodity: "ಸರಕು",
      price: "ಲೈವ್ ಬೆಲೆ",
      marketName: "ಮಾರುಕಟ್ಟೆ/ರಾಜ್ಯ",
      lastUpdated: "ಬುದ್ಧಿವಂತಿಕೆಯ ದಿನಾಂಕ",
      noData: "ದರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      searchHint: "ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಕೇಂದ್ರಗಳನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    }
  },
  hi: {
    common: {
      dashboard: "डैशबोर्ड",
      cropRec: "फसल सिफारिश",
      pestDet: "कीट पहचान",
      history: "इतिहास लॉग",
      logout: "लॉग आउट",
      loading: "एग्रीज़ेन",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      farmerLevel: "किसान स्तर",
    },
    auth: {
      title: "एग्रीज़ेन",
      subtitle: "स्थापना MMXXIV • AI सटीकता",
      signIn: "साइन इन",
      register: "पंजीकरण",
      email: "ईमेल पता",
      password: "गुप्त पासवर्ड",
      connectGoogle: "गूगल के साथ जुड़ें",
      neuralNet: "न्यूरल नेटवर्क के साथ सिंक करें",
      enterLaboratory: "प्रयोगशाला में प्रवेश करें",
      createProfile: "प्रोफ़ाइल बनाएं",
      sustainable: "टिकाऊ AI • पृथ्वी के लिए निर्मित",
    },
    dashboard: {
      greeting: "हेलो",
      philosophyTitle: "एग्रीज़ेन दर्शन",
      philosophyText: "एग्रीज़ेन पूर्वजों के ज्ञान को अत्याधुनिक कृत्रिम बुद्धिमत्ता के साथ जोड़ता है। हमारा मानना है कि तकनीक को किसानों को सशक्त बनाना चाहिए, न कि उन्हें बदलना चाहिए। हमारे मॉडल पृथ्वी की सूक्ष्म भाषा को समझने के लिए प्रशिक्षित हैं।",
      localConditions: "स्थानीय स्थितियां",
      temp: "तापमान",
      humidity: "नमी",
      rainfall: "वर्षा",
      soilPh: "मिट्टी का pH",
      launchRecommendation: "सिफारिश शुरू करें →",
      browseLogs: "लॉग देखें →",
      diagnosticTool: "नैदानिक उपकरण",
      analyticalTool: "विश्लेषणात्मक उपकरण",
      startAnalysis: "विश्लेषण शुरू करें",
      waitingData: "डेटा की प्रतीक्षा है",
    },
    crop: {
      title: "फसल सिफारिश",
      subtitle: "AI-संचालित सटीकता के लिए अपने पर्यावरण को मापें।",
      soilAnalysis: "मिट्टी विश्लेषण",
      nitrogen: "नाइट्रोजन (N)",
      phosphorus: "फास्फोरस (P)",
      potassium: "पोटेशियम (K)",
      ph: "pH स्तर",
      temp: "तापमान (°C)",
      humidity: "नमी (%)",
      rainfall: "वर्षा (mm)",
      location: "स्थान",
      updateMetrics: "मिट्टी मेट्रिक्स अपडेट करें",
      analyzing: "विश्लेषण कर रहा है...",
      optimalSowing: "इष्टतम बुवाई",
      farmingInsight: "कृषि अंतर्दृष्टि",
      planAnother: "एक और फसल की योजना बनाएं",
      waitMetrics: "शुरू करने के लिए मिट्टी मेट्रिक्स जमा करें",
    },
    pest: {
      title: "कीट पहचान",
      subtitle: "स्थानिक न्यूरल नेटवर्क का उपयोग करके पौधों के रोगजनकों की पहचान करना।",
      healthScanner: "स्वास्थ्य स्कैनर",
      pathogenDetected: "रोगजनक का पता चला",
      confidence: "विश्वास",
      morphDetails: "रूपात्मक विवरण",
      recommendedPesticides: "अनुशंसित कीटनाशक",
      initiateNewScan: "नया स्कैन शुरू करें",
      uploadFile: "फ़ाइल अपलोड करें",
      launchCamera: "कैमरा शुरू करें",
      processing: "स्कैन संसाधित हो रहा है...",
      analyzePattern: "पैटर्न का विश्लेषण करें",
      noImage: "कोई छवि नहीं ली गई",
      scanPending: "स्कैन लंबित",
      positionLens: "पौधे के ऊतक पर लेंस रखें",
    },
    history: {
      title: "कृषि इतिहास",
      subtitle: "स्थापित पैटर्न और ऐतिहासिक पैदावार की समीक्षा करना।",
      archivalRecords: "अभिलेखीय रिकॉर्ड",
      all: "सभी",
      crop: "फसल",
      pest: "कीट",
      empty: "अभिलेखागार वर्तमान में खाली हैं।",
      unearthing: "ऐतिहासिक दस्तावेजों की खोज...",
      recommendation: "अनुशंसा",
      detection: "पहचान",
      recently: "हाल ही में",
      details: "विस्तृत विश्लेषण",
      close: "रिकॉर्ड बंद करें",
    },
    market: {
      title: "बाज़ार के रुझान",
      subtitle: "कृषि वस्तुओं के लिए दैनिक विनिमय दर।",
      fetchPrices: "लाइव कीमतें प्राप्त करें",
      loadingPrices: "डिजिटल मंडियों को स्कैन किया जा रहा है...",
      commodity: "वस्तु",
      price: "लाइव कीमत",
      marketName: "बाज़ार/राज्य",
      lastUpdated: "इंटेलिजेंस तिथि",
      noData: "दरें देखने के लिए स्थान चुनें।",
      searchHint: "स्थानीय बाज़ार नोड्स का पता लगा रहा है...",
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSructure;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Simple persisted language logic could be added here
  
  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
