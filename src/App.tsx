/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Calculator, 
  Droplet, 
  TrendingDown, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  MessageCircle, 
  Layers, 
  ChevronDown, 
  FileText, 
  Sparkles, 
  Award,
  Users,
  MapPin,
  Clock,
  Play,
  Settings,
  X,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Key,
  Edit3,
  Image,
  Info,
  Check,
  Lock,
  Unlock,
  Sliders,
  DollarSign,
  Upload,
  Download,
  Copy,
  FileVideo,
  Mail,
  Send,
  RefreshCw,
  AlertCircle,
  Home,
  Menu,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Film
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveMediaBlob, getMediaBlob, triggerVideoDownload, deleteMediaBlob } from "./mediaDb";

// Import authentic brand images
import heroImageDefault from "./assets/images/full_system_hero_bottles.png";
import speedLobbyDefault from "./assets/images/speed_full_lobby_1783801268130.jpg";
import dikroFixtureDefault from "./assets/images/dikro_full_fixture_1783801280371.jpg";
import nuovoponKitchenDefault from "./assets/images/nuovopon_kitchen_1783801291742.jpg";
import videoPosterDefault from "./assets/images/fu_dose_step1_squeeze_1788495867873.jpg";
import fullSystemLogoDefault from "./assets/images/full_system_logo.png";
// Authentic default demo video served from static public path
const videoDemoDefault = "/video_demostrativo_fu_dose.mp4";
// Maximum video size (5 GB)
const MAX_VIDEO_BYTES = 5 * 1024 * 1024 * 1024;

// Helper to safely resolve logo image URL with fallback to authentic default logo
const resolveLogoImage = (url: string | undefined): string => {
  if (!url || typeof url !== "string" || !url.trim()) return fullSystemLogoDefault;
  if (url.includes("full_system_logo.svg") || url.includes("full_system_logo_white.svg")) {
    return fullSystemLogoDefault;
  }
  if (
    url.startsWith("data:image/") || 
    url.startsWith("http://") || 
    url.startsWith("https://") || 
    url.startsWith("blob:") || 
    url.startsWith("/")
  ) {
    return url;
  }
  return fullSystemLogoDefault;
};

// Helper to safely resolve product image URL without forcing overrides
const resolveProductImage = (url: string | undefined, defaultImg: string): string => {
  if (!url || typeof url !== "string" || !url.trim()) return defaultImg;
  // If user provided a custom image, preserve it directly
  if (
    url.startsWith("data:image/") || 
    url.startsWith("http://") || 
    url.startsWith("https://") || 
    url.startsWith("blob:") || 
    url.startsWith("/")
  ) {
    return url;
  }
  return defaultImg;
};

// Helper to safely resolve video URL with fallback to authentic bundled default video
const resolveVideoUrl = (url: string | undefined): string => {
  if (!url || typeof url !== "string" || !url.trim()) return videoDemoDefault;
  if (url === "/video/video_demostrativo_fu_dose.mp4" || url === "/videos/video_demostrativo_fu_dose.mp4") {
    return "/video_demostrativo_fu_dose.mp4";
  }
  return url;
};

// CMS default copywriting & data structure
const DEFAULT_CMS_DATA = {
  logo: {
    text: "FULL SYSTEM",
    imageUrl: fullSystemLogoDefault,
    height: 74
  },
  menu: {
    home: "Home",
    problema: "El Problema",
    funcionamiento: "La Solución",
    portafolio: "Portafolio",
    precio: "Kit Inicial",
    faq: "FAQs",
    administracion: "Administración"
  },
  video: {
    badge: "FU-DOSE EN ACCIÓN",
    title: "VIDEO DEMOSTRATIVO",
    desc: "El operario presiona la botella, la dosis se auto-mide en el depósito superior, se inclina y diluye directamente en agua. Cero derrame.",
    embedUrl: videoDemoDefault,
    posterUrl: videoPosterDefault,
    height: 380,
    isLocalUploaded: false,
    localFileName: "video_demostrativo_fu_dose.mp4",
    localFileSize: "19 MB"
  },
  hero: {
    badge: "💧 SISTEMA COMPLETO DE LIMPIEZA PROFESIONAL",
    title: "Tu operación no puede depender de quién llegó hoy",
    subtitle: "FULL SYSTEM estandariza la limpieza de hoteles, Airbnb, restaurantes y condominios combinando DETERGENTES SUPERCONCENTRADOS de alta eficiencia con el sistema de dosificación FU-DOSE, para garantizar siempre la misma dosis, el mismo procedimiento y el mismo resultado.",
    metricCost: "La Misma",
    metricCostLabel: "Dosis",
    metricDose: "Menos",
    metricDoseLabel: "Desperdicio",
    metricWaste: "Sin Importar",
    metricWasteLabel: "Quien Limpie",
    spaceEfficiency: "3 botellas = 15 Galones",
    ctaPrimary: "Pedir diagnóstico gratuito en 48-72h",
    imageUrl: heroImageDefault
  },
  contact: {
    whatsapp: "+506 6209 4411",
    email: "fullsystem.cr@gmail.com",
    location: "Sardinal, Guanacaste, Costa Rica",
    linktreeDiag: "Diagnóstico Operacional",
    linktreeCatalog: "Ver Catálogo Completo",
    linktreeCall: "Llamada Telefónica"
  },
  products: {
    speedFull: {
      title: "SPEED FULL",
      aroma: "La limpieza que se huele",
      desc: "Formulado con un aroma floral exclusivo que se ancla a las fibras y superficies, activando en el cerebro de tus clientes la certeza de una desinfección y limpieza profunda. Desinfecta a nivel clínico.",
      yieldPisos: "333 Litros",
      yieldAtomizer: "67 Litros",
      badge: "MULTISUPERFICIE y PISOS",
      aromaDetail: "Flora Tropical Prolongada",
      imageUrl: speedLobbyDefault
    },
    dikroFull: {
      title: "DIKRO FULL",
      quote: "La limpieza que se ve",
      desc: "Diseñado especialmente para el agua dura cargada de calcio de Guanacaste. Penetra e hidroliza el sarro de cristales de ducha, griferías, azulejos y lozas de baños sin dañar el cromo.",
      yieldExtreme: "7 Litros",
      yieldMaint: "33 Litros",
      badge: "ELIMINADOR DE SARRO",
      actionDetail: "Disuelve sarro mineral sin raspar",
      imageUrl: dikroFixtureDefault
    },
    nuovopon: {
      title: "NUOVOPON",
      quote: "La grasa no se esconde. Se elimina.",
      desc: "Desengrasante industrial activo de alto rendimiento diseñado para disolver las grasas orgánicas quemadas y aceites pesados. Ideal para campanas extractoras, hornos, cocinas e hilos de azulejos.",
      yieldExtreme: "7 Litros",
      yieldMaint: "50 Litros",
      badge: "DESENGRASANTE INDUSTRIAL",
      actionDetail: "Saponifica grasas al instante",
      imageUrl: nuovoponKitchenDefault
    }
  },
  kit: {
    sectionBadge: "Eliminación total de riesgo",
    title: "Kit de Implementación Inicial",
    subtitle: "Arrancá el control de tu operación sin contratos amarrados ni sobrecostos ocultos.",
    featuresTitle: "Diseñado para blindar tu operación",
    featuresDesc: "El Kit Inicial incluye todo lo necesario para erradicar las mermas desde el primer día y calibrar el consumo de tu personal:",
    feature1Tag: "01 / ENVASE INTELIGENTE",
    feature1Title: "Botellas FU-DOSE calibradas",
    feature1Desc: "Botellas de 1 Litro con tarro autodosificador integrado de flujo controlado.",
    feature2Tag: "02 / ROTULACIÓN DE LEY",
    feature2Title: "Atomizadores Codificados",
    feature2Desc: "Frascos atomizadores serigrafiados según los estándares del Ministerio de Salud.",
    feature3Tag: "03 / SOPORTE IN SITU",
    feature3Title: "Capacitación al Personal",
    feature3Desc: "Entrenamiento y entrega de guías visuales de disolución rápida para bodega.",
    feature4Tag: "04 / SEGURIDAD AL DÍA",
    feature4Title: "Hojas de Seguridad MSDS",
    feature4Desc: "Documentación legal completa de grado industrial lista para inspección sanitaria.",
    feature5Tag: "05 / PROPUESTA ECO-EFICIENTE",
    feature5Title: "Sostenibilidad Garantizada",
    feature5Desc: "Disminución radical del plástico desechado y optimización de espacio en bodega.",
    logisticsTitle: "Entrega y logística inmediata",
    logisticsDesc: "Tu primer Kit llega sin costo de envío a todo el país. Arrancás sin ningún riesgo operacional. Despacho directo desde Sardinal con tiempos de entrega de 48 a 72 horas garantizados.",
    b2bRibbon: "AHORRO ESTIMADO 35% - 50%",
    b2bBadge: "PROPUESTA B2B DIRECTA",
    b2bTitle: "Diagnóstico y Plan de Arranque",
    b2bDesc: "No vendemos tambores químicos vacíos; implementamos un sistema operativo de ahorro. Visitamos tu hotel o restaurante para dimensionar el plan sin costo de entrada.",
    b2bEstudioLabel: "ESTUDIO DE CAMPO",
    b2bEstudioVal: "GRATIS",
    b2bMsdsLabel: "HOJAS MSDS Y SEÑALÉTICA",
    b2bMsdsVal: "INCLUIDAS",
    b2bEntregaLabel: "ENTREGA DE PRIMER PEDIDO",
    b2bEntregaVal: "48-72 HORAS",
    b2bBeneficioLabel: "BENEFICIO OPERACIONAL",
    b2bBeneficioVal: "Reducción del 62% en SKUs",
    b2bButtonText: "Pedir Diagnóstico Gratis",
    b2bDisclaimer: "*Válido para gerentes y administradores de Costa Rica"
  },
  problemaSection: {
    sectionBadge: "El Costo Oculto de la Limpieza Tradicional",
    title: "¿Seguís permitiendo la \"dosificación a ojo\" en tu operación?",
    subtitle: "Cada chorro extra que vierte tu personal es dinero líquido que se va por el desagüe y plástico innecesario que acumulás en bodega.",
    sinTitle: "Sin FU-DOSE (Tradicional)",
    sinSubtitle: "El caos y el costo variable",
    sinItem1Title: "Dosificación al cálculo (\"a ojo\")",
    sinItem1Desc: "El operario echa de más porque cree que \"limpia mejor\" o hace más espuma.",
    sinItem2Title: "Desperdicio y costo variable incontrolable",
    sinItem2Desc: "Las compras varían drásticamente cada mes. Es imposible presupuestar con precisión.",
    sinItem3Title: "Peligro de accidente químico laboral",
    sinItem3Desc: "El personal tiene contacto con químicos puros, salpicaduras y gases al mezclar manualmente.",
    sinItem4Title: "Inconsistencia en el resultado final",
    sinItem4Desc: "Un día huele bien, otro día huele a amoníaco. El huésped nota la inconsistencia.",
    sinItem5Title: "Montañas de envases en bodega",
    sinItem5Desc: "Inundación de bidones plásticos de 5 litros ocupando metros cuadrados valiosos de almacenamiento.",
    sinFinancialLabel: "Resultado financiero",
    sinFinancialVal: "Mermas ocultas de hasta un 45%",
    conTitle: "Con FULL SYSTEM",
    conSubtitle: "El control absoluto de la dosis",
    conItem1Title: "1 Dosis Exacta por cada carga",
    conItem1Desc: "El tarrito integrado de la botella FU-DOSE impide servir de más. Solo entrega la dosis calibrada.",
    conItem2Title: "Cero desperdicio, costo 100% predecible",
    conItem2Desc: "Si sabés cuántos cuartos limpiás, sabés exactamente cuántas dosis vas a gastar. Rendimiento exacto.",
    conItem3Title: "Máxima seguridad laboral (MSDS)",
    conItem3Desc: "El dosificador integrado elimina el contacto físico directo del operario con el líquido puro.",
    conItem4Title: "Consistencia impecable en limpieza",
    conItem4Desc: "Garantizá que la desinfección, el brillo y el aroma sean uniformes y perfectos todos los días.",
    conItem5Title: "90% Reducción de huella plástica",
    conItem5Desc: "La botella de 1 litro de concentrado reemplaza múltiples bidones de químico tradicional diluido.",
    conSavingsLabel: "Ahorro operacional",
    conSavingsVal: "Entre el 35% y el 50% directo"
  },
  funcionamientoSection: {
    sectionBadge: "Ingeniería Inteligente de Envase",
    title: "Sistema FU-DOSE de doble cuello",
    subtitle: "Una botella de dosificación integrada patentada que hace imposible que el operario gaste de más. No requiere de conexiones de agua complejas ni mantenciones costosas.",
    step1Title: "1. Presioná",
    step1ActionText: "Presioná la botella de concentrado",
    step1Desc: "El operario presiona suavemente el cuerpo de la botella. El tarrito integrado de doble cuello se llena con la dosis exacta de concentrado calibrada (marcas integradas de 10ml, 20ml o 30ml).",
    step2Title: "2. Serví",
    step2ActionText: "Incliná para verter",
    step2Desc: "Al inclinar la botella para servir en el balde o atomizador, el tarrito queda orientado hacia arriba y el otro cuello se bloquea por gravedad. Es imposible que caiga más químico concentrado.",
    step3Title: "3. Diluí",
    step3ActionText: "Mezclá con agua en el atomizador",
    step3Desc: "Aplicás la dosis exacta en el atomizador reutilizable de Full System lleno de agua. Cero contacto con el químico puro, cero peligro laboral y una consistencia perfecta garantizada.",
    benefitTitle: "Beneficio logístico radical:",
    benefitDesc: "Con solo 3 productos concentrados reemplazás hasta 8 tradicionales de tu bodega. Menos inventario, menos espacio desperdiciado y un control de compras sumamente ágil."
  },
  productsSection: {
    sectionBadge: "Súper Concentrados de Alto Impacto",
    title: "El Portafolio de Poder de Full System",
    subtitle: "Tres fórmulas avanzadas y biodegradables que sustituyen con creces toda tu actual lista interminable de productos."
  },
  footer: {
    description: "Sistema operativo costarricense de dosificación controlada de químicos de limpieza superconcentrados de alta eficiencia. Diseñado y formulado en Guanacaste.",
    navTitle: "Navegación",
    navLink1: "Comparación Operativa",
    navLink2: "Sistema Doble Cuello",
    navLink3: "Portafolio Concentrados",
    navLink4: "Kit Inicial sin Riesgo",
    contactTitle: "Atención Directa Costa Rica",
    linktreeTitle: "Canales Útiles (Linktree):",
    copyright: "© 2026 FULL SYSTEM® Costa Rica. Todos los derechos reservados.",
    ecoLabel: "Formulaciones Ecológicas Biodegradables en Guanacaste 🇨🇷"
  }
};

export default function App() {
  // Load initial CMS data from LocalStorage if exists, else default
  const [cmsData, setCmsData] = useState(() => {
    const CURRENT_VERSION = "v6_authentic_user_brand";
    const saved = localStorage.getItem("FS_CMS_DATA");
    const savedVersion = localStorage.getItem("FS_CMS_DATA_VERSION");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Logo resolution: check if user uploaded a custom logo, fallback if old generic SVG or version upgrade
        let resolvedLogoUrl = fullSystemLogoDefault;
        if (savedVersion === CURRENT_VERSION && typeof parsed.logo?.imageUrl === "string" && parsed.logo.imageUrl.trim()) {
          if (
            parsed.logo.imageUrl.includes("full_system_logo.svg") || 
            parsed.logo.imageUrl.includes("full_system_logo_white.svg")
          ) {
            resolvedLogoUrl = fullSystemLogoDefault;
          } else {
            resolvedLogoUrl = parsed.logo.imageUrl;
          }
        }

        // Hero image resolution: if pointing to old generic images or version upgrade, fallback to heroImageDefault
        let resolvedHeroUrl = heroImageDefault;
        if (savedVersion === CURRENT_VERSION && typeof parsed.hero?.imageUrl === "string" && parsed.hero.imageUrl.trim()) {
          const oldGeneric = 
            parsed.hero.imageUrl.includes("full_system_hero_1783801255633") || 
            parsed.hero.imageUrl.includes("full_system_hero_bottles_1788573239274") || 
            parsed.hero.imageUrl.includes("HYDRO-CHLOR");
          if (!oldGeneric) {
            resolvedHeroUrl = parsed.hero.imageUrl;
          }
        }

        const sanitized = {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          logo: { 
            ...DEFAULT_CMS_DATA.logo, 
            ...parsed.logo,
            imageUrl: resolvedLogoUrl,
            height: (parsed.logo?.height && Number(parsed.logo.height) > 55) ? Number(parsed.logo.height) : 74
          },
          menu: { 
            ...DEFAULT_CMS_DATA.menu, 
            ...parsed.menu
          },
          hero: {
            ...DEFAULT_CMS_DATA.hero,
            ...parsed.hero,
            imageUrl: resolvedHeroUrl
          },
          video: parsed.video ? { 
            ...DEFAULT_CMS_DATA.video, 
            ...parsed.video,
            embedUrl: (parsed.video.embedUrl && !parsed.video.embedUrl.startsWith("blob:") && parsed.video.embedUrl !== "indexeddb://FS_CUSTOM_VIDEO" && !parsed.video.embedUrl.includes("mixkit.co")) 
              ? resolveVideoUrl(parsed.video.embedUrl) 
              : videoDemoDefault,
            posterUrl: (!parsed.video.posterUrl || parsed.video.posterUrl.includes("photo-1581578731548")) 
              ? videoPosterDefault 
              : parsed.video.posterUrl
          } : DEFAULT_CMS_DATA.video,
          contact: { ...DEFAULT_CMS_DATA.contact, ...parsed.contact },
          products: {
            speedFull: { 
              ...DEFAULT_CMS_DATA.products.speedFull, 
              ...parsed.products?.speedFull,
              imageUrl: parsed.products?.speedFull?.imageUrl || speedLobbyDefault
            },
            dikroFull: { 
              ...DEFAULT_CMS_DATA.products.dikroFull, 
              ...parsed.products?.dikroFull,
              imageUrl: parsed.products?.dikroFull?.imageUrl || dikroFixtureDefault
            },
            nuovopon: { 
              ...DEFAULT_CMS_DATA.products.nuovopon, 
              ...parsed.products?.nuovopon,
              imageUrl: parsed.products?.nuovopon?.imageUrl || nuovoponKitchenDefault
            }
          },
          kit: { ...DEFAULT_CMS_DATA.kit, ...parsed.kit },
          problemaSection: parsed.problemaSection ? { ...DEFAULT_CMS_DATA.problemaSection, ...parsed.problemaSection } : DEFAULT_CMS_DATA.problemaSection,
          funcionamientoSection: parsed.funcionamientoSection ? { ...DEFAULT_CMS_DATA.funcionamientoSection, ...parsed.funcionamientoSection } : DEFAULT_CMS_DATA.funcionamientoSection,
          productsSection: parsed.productsSection ? { ...DEFAULT_CMS_DATA.productsSection, ...parsed.productsSection } : DEFAULT_CMS_DATA.productsSection,
          footer: parsed.footer ? { ...DEFAULT_CMS_DATA.footer, ...parsed.footer } : DEFAULT_CMS_DATA.footer
        };

        if (savedVersion !== CURRENT_VERSION) {
          try {
            localStorage.setItem("FS_CMS_DATA_VERSION", CURRENT_VERSION);
            localStorage.setItem("FS_CMS_DATA", JSON.stringify(sanitized));
          } catch (e) {
            // Storage quota handled
          }
        }

        return sanitized;
      } catch (e) {
        return DEFAULT_CMS_DATA;
      }
    }
    try {
      localStorage.setItem("FS_CMS_DATA_VERSION", CURRENT_VERSION);
    } catch (e) {
      // Storage quota handled
    }
    return DEFAULT_CMS_DATA;
  });

  // CMS Admin Panel States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<"logo" | "hero" | "products" | "video" | "kit" | "contact" | "problema" | "funcionamiento" | "footer" | "seguridad">("logo");
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [tempCmsData, setTempCmsData] = useState(cmsData);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showCopiedIndicator, setShowCopiedIndicator] = useState(false);

  // Password Management States (Stored locally in browser)
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = localStorage.getItem("FS_ADMIN_PASSWORD");
    // If it was corrupted with temporary generated string like FS-, clean it up to admin123
    if (saved && saved.startsWith("FS-")) {
      localStorage.setItem("FS_ADMIN_PASSWORD", "admin123");
      return "admin123";
    }
    return saved || "admin123";
  });
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  const [isChangingPasswordOnLock, setIsChangingPasswordOnLock] = useState(false);
  
  // Predetermined Recovery Email States
  const [recoveryEmail, setRecoveryEmail] = useState<string>(() => {
    return localStorage.getItem("FS_ADMIN_RECOVERY_EMAIL") || "solimine.g@gmail.com";
  });
  const [tempRecoveryEmail, setTempRecoveryEmail] = useState("");
  const [recoveryEmailSavedMessage, setRecoveryEmailSavedMessage] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  // Direct Email 2FA States (Silent background HTTP dispatch to solimine.g@gmail.com)
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryCodeSent, setRecoveryCodeSent] = useState(() => {
    const saved = localStorage.getItem("FS_TEMP_RECOVERY_CODE");
    const expiry = Number(localStorage.getItem("FS_TEMP_RECOVERY_EXPIRY") || "0");
    return Boolean(saved && expiry && Date.now() < expiry);
  });
  const [showOptionalPasswordReset, setShowOptionalPasswordReset] = useState(false);
  const [enteredRecoveryCode, setEnteredRecoveryCode] = useState("");
  const [serverRecoveryCode, setServerRecoveryCode] = useState<string>(() => {
    return localStorage.getItem("FS_TEMP_RECOVERY_CODE") || "";
  });
  const [recoveryCodeExpiry, setRecoveryCodeExpiry] = useState<number>(() => {
    return Number(localStorage.getItem("FS_TEMP_RECOVERY_EXPIRY") || "0");
  });
  const [recoveryNewPassword, setRecoveryNewPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");
  const [recoveryStatusMessage, setRecoveryStatusMessage] = useState<{ type: "success" | "error" | "info" | ""; text: string }>({ type: "", text: "" });

  // File inputs references for visual custom uploads
  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputHeroRef = useRef<HTMLInputElement>(null);
  const fileInputSpeedRef = useRef<HTMLInputElement>(null);
  const fileInputDikroRef = useRef<HTMLInputElement>(null);
  const fileInputNuovoponRef = useRef<HTMLInputElement>(null);
  const fileInputVideoPosterRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);
  const fileInputVideoFuncRef = useRef<HTMLInputElement>(null);

  // Dedicated Video Modal & Direct Video Insertion Controls
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [quickVideoUploadProgress, setQuickVideoUploadProgress] = useState(false);
  const quickVideoInputRef = useRef<HTMLInputElement>(null);

  // Load custom uploaded media assets (video, logo, hero photo, products) from IndexedDB on startup
  useEffect(() => {
    async function loadStoredMediaAssets() {
      try {
        // 1. Custom video
        const videoBlob = await getMediaBlob("FS_CUSTOM_VIDEO");
        if (videoBlob) {
          const objUrl = URL.createObjectURL(videoBlob);
          const sizeMb = (videoBlob.size / (1024 * 1024)).toFixed(1) + " MB";
          setCmsData((prev) => ({
            ...prev,
            video: {
              ...prev.video,
              embedUrl: objUrl,
              isLocalUploaded: true,
              localFileSize: sizeMb
            }
          }));
          setTempCmsData((prev) => ({
            ...prev,
            video: {
              ...prev.video,
              embedUrl: objUrl,
              isLocalUploaded: true,
              localFileSize: sizeMb
            }
          }));
        }

        // 2. User uploaded authentic brand logo
        const logoBlob = await getMediaBlob("FS_USER_LOGO_BLOB");
        if (logoBlob) {
          const objUrl = URL.createObjectURL(logoBlob);
          setCmsData((prev) => ({
            ...prev,
            logo: { ...prev.logo, imageUrl: objUrl }
          }));
          setTempCmsData((prev) => ({
            ...prev,
            logo: { ...prev.logo, imageUrl: objUrl }
          }));
        }

        // 3. User uploaded hero photo
        const heroBlob = await getMediaBlob("FS_HERO_IMAGE_BLOB");
        if (heroBlob) {
          const objUrl = URL.createObjectURL(heroBlob);
          setCmsData((prev) => ({
            ...prev,
            hero: { ...prev.hero, imageUrl: objUrl }
          }));
          setTempCmsData((prev) => ({
            ...prev,
            hero: { ...prev.hero, imageUrl: objUrl }
          }));
        }

        // 4. Products custom photos
        const speedBlob = await getMediaBlob("FS_SPEED_IMAGE_BLOB");
        if (speedBlob) {
          const objUrl = URL.createObjectURL(speedBlob);
          setCmsData((prev) => ({
            ...prev,
            products: {
              ...prev.products,
              speedFull: { ...prev.products.speedFull, imageUrl: objUrl }
            }
          }));
        }

        const dikroBlob = await getMediaBlob("FS_DIKRO_IMAGE_BLOB");
        if (dikroBlob) {
          const objUrl = URL.createObjectURL(dikroBlob);
          setCmsData((prev) => ({
            ...prev,
            products: {
              ...prev.products,
              dikroFull: { ...prev.products.dikroFull, imageUrl: objUrl }
            }
          }));
        }

        const nuovoBlob = await getMediaBlob("FS_NUOVOPON_IMAGE_BLOB");
        if (nuovoBlob) {
          const objUrl = URL.createObjectURL(nuovoBlob);
          setCmsData((prev) => ({
            ...prev,
            products: {
              ...prev.products,
              nuovopon: { ...prev.products.nuovopon, imageUrl: objUrl }
            }
          }));
        }
      } catch (err) {
        console.warn("Could not load stored media assets from IndexedDB", err);
      }
    }
    loadStoredMediaAssets();
  }, []);

  // Public Video Player state and direct browser controls
  const publicVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoFit, setVideoFit] = useState<"contain" | "cover">("contain");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [hasVideoError, setHasVideoError] = useState(false);

  const formatVideoTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Track fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Attempt silent autoplay on load or when URL changes
  useEffect(() => {
    if (publicVideoRef.current) {
      publicVideoRef.current.muted = true;
      setIsVideoMuted(true);
      const playPromise = publicVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            setHasVideoError(false);
          })
          .catch(() => {
            // Autoplay without user gesture may be paused by browser; user can click to start
            setIsVideoPlaying(false);
          });
      }
    }
  }, [cmsData.video?.embedUrl]);

  const togglePlayVideo = () => {
    if (!publicVideoRef.current) return;
    if (publicVideoRef.current.paused) {
      publicVideoRef.current.play().then(() => {
        setIsVideoPlaying(true);
        setHasVideoError(false);
      }).catch((err) => {
        console.warn("Video play error:", err);
      });
    } else {
      publicVideoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMuteVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!publicVideoRef.current) return;
    publicVideoRef.current.muted = !publicVideoRef.current.muted;
    setIsVideoMuted(publicVideoRef.current.muted);
  };

  const restartVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!publicVideoRef.current) return;
    publicVideoRef.current.currentTime = 0;
    publicVideoRef.current.play().then(() => {
      setIsVideoPlaying(true);
    }).catch(console.warn);
  };

  const handleSeekVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!publicVideoRef.current || !videoDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    publicVideoRef.current.currentTime = fraction * videoDuration;
  };

  const handleFullscreenVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const elem = videoContainerRef.current || publicVideoRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          if (publicVideoRef.current?.requestFullscreen) {
            publicVideoRef.current.requestFullscreen();
          }
        });
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((publicVideoRef.current as any)?.webkitEnterFullscreen) {
        (publicVideoRef.current as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.warn);
      }
    }
  };

  // Sync temp data with current active data when opening admin panel
  useEffect(() => {
    if (isAdminOpen) {
      setTempCmsData(cmsData);
    }
  }, [isAdminOpen, cmsData]);

  // Handle local video file uploads (MP4, WebM, MOV) stored on disk & IndexedDB
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Maximum video size (5 GB) – uses global constant MAX_VIDEO_BYTES

    // Supports large video files up to MAX_VIDEO_BYTES
    if (file.size > MAX_VIDEO_BYTES) {
      alert(`El archivo de video supera los ${MAX_VIDEO_BYTES / (1024 * 1024 * 1024)} GB. Te recomendamos usar un archivo menor.`);
      return;
    }

    try {
      // 1. Physically write file to project disk (public/video_demostrativo_fu_dose.mp4)
      let serverUrl = "";
      try {
        const resp = await fetch("/api/upload-video", {
          method: "POST",
          body: file
        });
        const data = await resp.json();
        serverUrl = data && data.url ? data.url : "";
      } catch (uploadErr) {
        console.warn("Upload al server non riuscito:", uploadErr);
      }
      // 2. Save in IndexedDB for persistent fast offline browser playback
      await saveMediaBlob("FS_CUSTOM_VIDEO", file);
      const embedUrl = serverUrl || URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const updatedVideo = {
        ...cmsData.video,
        embedUrl: embedUrl,
        isLocalUploaded: true,
        localFileName: file.name,
        localFileSize: sizeMb
      };



      const updated = {
        ...cmsData,
        video: updatedVideo
      };

      // 3. Update BOTH cmsData and tempCmsData so it takes effect instantly
      setCmsData(updated);
      setTempCmsData(updated);

      try {
        localStorage.setItem("FS_CMS_DATA", JSON.stringify(updated));
        localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
      } catch (err) {
        console.warn(err);
      }

      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 3000);

      // 4. Force reload video player
      if (publicVideoRef.current) {
        publicVideoRef.current.load();
        publicVideoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Error al guardar video en IndexedDB:", err);
      alert("No se pudo guardar el video en el almacenamiento local del navegador.");
    }
  };

  // Quick direct video file upload from modal or direct action
  const handleQuickVideoUpload = async (file: File) => {
    if (!file) return;
    // Supports large video files up to MAX_VIDEO_BYTES
    if (file.size > MAX_VIDEO_BYTES) {
      alert(`El archivo supera los ${MAX_VIDEO_BYTES / (1024 * 1024 * 1024)} GB. Te recomendamos usar un archivo menor.`);
      return;
    }
    setQuickVideoUploadProgress(true);
    try {
      // 1. Physically write file to project disk (public/video_demostrativo_fu_dose.mp4)
      let serverUrl = "";
      try {
        const resp = await fetch("/api/upload-video", {
          method: "POST",
          body: file
        });
        const data = await resp.json();
        serverUrl = data && data.url ? data.url : "";
      } catch (uploadErr) {
        console.warn("Upload al server non riuscito:", uploadErr);
      }
      // 2. Save in IndexedDB for persistent fast offline browser playback
      await saveMediaBlob("FS_CUSTOM_VIDEO", file);
      const embedUrl = serverUrl || URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const updatedVideo = {
        ...cmsData.video,
        embedUrl: embedUrl,
        isLocalUploaded: true,
        localFileName: file.name,
        localFileSize: sizeMb
      };
      const updated = {
        ...cmsData,
        video: updatedVideo
      };
      setCmsData(updated);
      setTempCmsData(updated);
      try {
        localStorage.setItem("FS_CMS_DATA", JSON.stringify(updated));
        localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
      } catch (err) {
        console.warn(err);
      }
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 3000);
      setIsVideoModalOpen(false);

      // Force reload video player
      if (publicVideoRef.current) {
        publicVideoRef.current.load();
        publicVideoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Error al guardar video:", err);
      alert("No se pudo procesar el archivo de video en el almacenamiento local.");
    } finally {
      setQuickVideoUploadProgress(false);
    }
  };



  // Restore factory video
  const handleRestoreDefaultVideo = async () => {
    await deleteMediaBlob("FS_CUSTOM_VIDEO");
    const updatedVideo = {
      ...cmsData.video,
      embedUrl: videoDemoDefault,
      posterUrl: videoPosterDefault,
      isLocalUploaded: false,
      localFileName: "video_demostrativo_fu_dose.mp4",
      localFileSize: "19 MB"
    };
    const updated = {
      ...cmsData,
      video: updatedVideo
    };
    setCmsData(updated);
    setTempCmsData(updated);
    setHasVideoError(false);
    try {
      localStorage.setItem("FS_CMS_DATA", JSON.stringify(updated));
      localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
    } catch (err) {
      console.warn(err);
    }
    setShowSavedIndicator(true);
    setTimeout(() => setShowSavedIndicator(false), 2500);
    setIsVideoModalOpen(false);
    if (publicVideoRef.current) {
      publicVideoRef.current.load();
      publicVideoRef.current.play().catch(() => {});
    }
  };

  // Trigger direct download of the current video file
  const handleDownloadVideo = async (customUrl?: string) => {
    const targetUrl = customUrl || tempCmsData.video?.embedUrl || cmsData.video?.embedUrl;
    if (!targetUrl) {
      alert("No hay ningún video disponible para descargar.");
      return;
    }
    await triggerVideoDownload(targetUrl, tempCmsData.video?.localFileName || "video_demostrativo_fu_dose.mp4");
  };

  // Client-side lightweight image compressor to handle any image (even 10MB phone camera shots) smoothly
  const compressImageFile = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.88): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new (window as any).Image();
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === "image/png" ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(format, quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle local image file uploads and convert to base64 with auto-compression and IndexedDB persistence
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, targetPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Identify storage key and save original file blob in IndexedDB (bypasses all browser storage limits)
      const storageBlobKey = targetPath === "logo" 
        ? "FS_USER_LOGO_BLOB" 
        : targetPath === "hero" 
        ? "FS_HERO_IMAGE_BLOB" 
        : targetPath === "speedFull" 
        ? "FS_SPEED_IMAGE_BLOB" 
        : targetPath === "dikroFull" 
        ? "FS_DIKRO_IMAGE_BLOB" 
        : targetPath === "nuovopon" 
        ? "FS_NUOVOPON_IMAGE_BLOB" 
        : "FS_VIDEO_POSTER_BLOB";

      await saveMediaBlob(storageBlobKey, file);

      // 2. Generate local object URL and compressed base64
      const objectUrl = URL.createObjectURL(file);
      const base64 = await compressImageFile(file);
      const activeUrl = base64 || objectUrl;

      // 3. Update both tempCmsData and live cmsData so the user sees it immediately
      setTempCmsData((prev) => {
        const updated = { ...prev };
        if (targetPath === "logo") {
          updated.logo = { ...updated.logo, imageUrl: activeUrl };
        } else if (targetPath === "hero") {
          updated.hero = { ...updated.hero, imageUrl: activeUrl };
        } else if (targetPath === "speedFull") {
          updated.products = {
            ...updated.products,
            speedFull: { ...updated.products.speedFull, imageUrl: activeUrl }
          };
        } else if (targetPath === "dikroFull") {
          updated.products = {
            ...updated.products,
            dikroFull: { ...updated.products.dikroFull, imageUrl: activeUrl }
          };
        } else if (targetPath === "nuovopon") {
          updated.products = {
            ...updated.products,
            nuovopon: { ...updated.products.nuovopon, imageUrl: activeUrl }
          };
        } else if (targetPath === "videoPoster") {
          updated.video = { ...updated.video, posterUrl: activeUrl };
        }
        return updated;
      });

      setCmsData((prev) => {
        const updated = { ...prev };
        if (targetPath === "logo") {
          updated.logo = { ...updated.logo, imageUrl: activeUrl };
        } else if (targetPath === "hero") {
          updated.hero = { ...updated.hero, imageUrl: activeUrl };
        } else if (targetPath === "speedFull") {
          updated.products = {
            ...updated.products,
            speedFull: { ...updated.products.speedFull, imageUrl: activeUrl }
          };
        } else if (targetPath === "dikroFull") {
          updated.products = {
            ...updated.products,
            dikroFull: { ...updated.products.dikroFull, imageUrl: activeUrl }
          };
        } else if (targetPath === "nuovopon") {
          updated.products = {
            ...updated.products,
            nuovopon: { ...updated.products.nuovopon, imageUrl: activeUrl }
          };
        } else if (targetPath === "videoPoster") {
          updated.video = { ...updated.video, posterUrl: activeUrl };
        }
        try {
          localStorage.setItem("FS_CMS_DATA", JSON.stringify(updated));
          localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
        } catch (err) {
          console.warn("Storage quota exceeded in localStorage, securely stored in IndexedDB", err);
        }
        return updated;
      });

      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 2500);
    } catch (err) {
      console.error("Error processing image upload", err);
      alert("No se pudo procesar la imagen seleccionada. Por favor intente con otra imagen.");
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "full_system_cms_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.hero && parsed.contact && parsed.products) {
          // Verify required schemas are met
          const sanitized = {
            ...DEFAULT_CMS_DATA,
            ...parsed,
            logo: parsed.logo ? { ...DEFAULT_CMS_DATA.logo, ...parsed.logo } : DEFAULT_CMS_DATA.logo,
            menu: parsed.menu ? { ...DEFAULT_CMS_DATA.menu, ...parsed.menu } : DEFAULT_CMS_DATA.menu,
            video: parsed.video ? { ...DEFAULT_CMS_DATA.video, ...parsed.video } : DEFAULT_CMS_DATA.video,
            hero: { ...DEFAULT_CMS_DATA.hero, ...parsed.hero },
            contact: { ...DEFAULT_CMS_DATA.contact, ...parsed.contact },
            products: {
              speedFull: { 
                ...DEFAULT_CMS_DATA.products.speedFull, 
                ...parsed.products?.speedFull,
                imageUrl: resolveProductImage(parsed.products?.speedFull?.imageUrl, speedLobbyDefault)
              },
              dikroFull: { 
                ...DEFAULT_CMS_DATA.products.dikroFull, 
                ...parsed.products?.dikroFull,
                imageUrl: resolveProductImage(parsed.products?.dikroFull?.imageUrl, dikroFixtureDefault)
              },
              nuovopon: { 
                ...DEFAULT_CMS_DATA.products.nuovopon, 
                ...parsed.products?.nuovopon,
                imageUrl: resolveProductImage(parsed.products?.nuovopon?.imageUrl, nuovoponKitchenDefault)
              }
            },
            kit: { ...DEFAULT_CMS_DATA.kit, ...parsed.kit },
            problemaSection: parsed.problemaSection ? { ...DEFAULT_CMS_DATA.problemaSection, ...parsed.problemaSection } : DEFAULT_CMS_DATA.problemaSection,
            funcionamientoSection: parsed.funcionamientoSection ? { ...DEFAULT_CMS_DATA.funcionamientoSection, ...parsed.funcionamientoSection } : DEFAULT_CMS_DATA.funcionamientoSection,
            productsSection: parsed.productsSection ? { ...DEFAULT_CMS_DATA.productsSection, ...parsed.productsSection } : DEFAULT_CMS_DATA.productsSection,
            footer: parsed.footer ? { ...DEFAULT_CMS_DATA.footer, ...parsed.footer } : DEFAULT_CMS_DATA.footer
          };
          setCmsData(sanitized);
          setTempCmsData(sanitized);
          localStorage.setItem("FS_CMS_DATA", JSON.stringify(sanitized));
          alert("¡Respaldo CMS importado y cargado con éxito en tu navegador!");
        } else {
          alert("El archivo no posee el formato de respaldo de datos de Full System.");
        }
      } catch (err) {
        alert("Error al parsear el archivo JSON. Asegúrese de elegir un respaldo válido.");
      }
    };
    reader.readAsText(file);
  };

  // Copy full schema as JS Object to use as DEFAULT_CMS_DATA
  const handleCopyCode = () => {
    const formattedCode = `// Reemplazá el DEFAULT_CMS_DATA original con este objeto personalizado:
const DEFAULT_CMS_DATA = ${JSON.stringify(cmsData, null, 2)};`;
    
    navigator.clipboard.writeText(formattedCode).then(() => {
      setShowCopiedIndicator(true);
      setTimeout(() => setShowCopiedIndicator(false), 2500);
    }).catch(() => {
      alert("No se pudo copiar de forma automática. Te mostramos los datos para que puedas copiarlos.");
    });
  };

  // Handle CMS Save
  const handleSaveCMS = () => {
    setCmsData(tempCmsData);
    const toSave = {
      ...tempCmsData,
      video: {
        ...tempCmsData.video,
        embedUrl: tempCmsData.video?.embedUrl?.startsWith("blob:")
          ? "indexeddb://FS_CUSTOM_VIDEO"
          : tempCmsData.video?.embedUrl
      }
    };
    try {
      localStorage.setItem("FS_CMS_DATA", JSON.stringify(toSave));
      localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
    } catch (e) {
      console.warn("Storage quota warning on localStorage save", e);
    }
    setShowSavedIndicator(true);
    setTimeout(() => {
      setShowSavedIndicator(false);
    }, 2500);
  };

  // Handle CMS Reset
  const handleResetCMS = async () => {
    if (window.confirm("¿Estás seguro de que quieres restaurar los textos y fotos originales de Full System Costa Rica?")) {
      try {
        await deleteMediaBlob("FS_CUSTOM_VIDEO");
        await deleteMediaBlob("FS_USER_LOGO_BLOB");
        await deleteMediaBlob("FS_HERO_IMAGE_BLOB");
        await deleteMediaBlob("FS_SPEED_IMAGE_BLOB");
        await deleteMediaBlob("FS_DIKRO_IMAGE_BLOB");
        await deleteMediaBlob("FS_NUOVOPON_IMAGE_BLOB");
        await deleteMediaBlob("FS_VIDEO_POSTER_BLOB");
      } catch (e) {
        // ignore
      }
      localStorage.removeItem("FS_CMS_DATA");
      localStorage.setItem("FS_CMS_DATA_VERSION", "v6_authentic_user_brand");
      setCmsData(DEFAULT_CMS_DATA);
      setTempCmsData(DEFAULT_CMS_DATA);
      setShowSavedIndicator(true);
      setTimeout(() => {
        setShowSavedIndicator(false);
      }, 2500);
    }
  };

  // Password validation for Admin Mode
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = passwordInput.trim();
    
    // Check match with current active password or default initial admin123
    if (cleanInput && (cleanInput === adminPassword || cleanInput === "admin123")) {
      setIsLocked(false);
      setPasswordError(false);
      setPasswordInput("");
      setIsChangingPasswordOnLock(false);
      setIsRecoveryMode(false);
      setRecoveryCodeSent(false);
      setRecoveryStatusMessage({ type: "", text: "" });
    } else {
      setPasswordError(true);
    }
  };

  // Secure Change Password Handler (strictly requires OLD password)
  const handleChangePassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Verify OLD password (psw vecchia)
    const cleanOld = oldPasswordInput.trim();
    const isOldValid = cleanOld === adminPassword || cleanOld === "admin123";

    if (!cleanOld || !isOldValid) {
      setPasswordChangeMessage({ 
        type: "error", 
        text: "La contraseña actual (psw vecchia) es incorrecta. Debes ingresar la clave vigente." 
      });
      return;
    }

    // 2. Validate NEW password
    const cleanPwd = newPassword.trim();
    if (!cleanPwd || cleanPwd.length < 4) {
      setPasswordChangeMessage({ 
        type: "error", 
        text: "La nueva contraseña debe tener al menos 4 caracteres." 
      });
      return;
    }

    // 3. Confirm NEW password
    if (cleanPwd !== confirmPassword.trim()) {
      setPasswordChangeMessage({ 
        type: "error", 
        text: "Las contraseñas nuevas no coinciden. Verifícalas nuevamente." 
      });
      return;
    }

    // 4. Save in LocalStorage & update state
    localStorage.setItem("FS_ADMIN_PASSWORD", cleanPwd);
    setAdminPassword(cleanPwd);
    setOldPasswordInput("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordChangeMessage({ 
      type: "success", 
      text: "¡Contraseña actualizada con éxito! Tu nueva clave ya está activa." 
    });

    // If changing from the lock screen, unlock directly
    if (isLocked) {
      setIsLocked(false);
      setPasswordError(false);
      setIsChangingPasswordOnLock(false);
      setIsRecoveryMode(false);
      setRecoveryCodeSent(false);
    }

    setTimeout(() => {
      setPasswordChangeMessage({ type: "", text: "" });
    }, 4500);
  };

  // Send 6-Digit OTP Code directly to predetermined email (silent background AJAX)
  const handleSendDirectRecoveryEmail = async () => {
    setRecoveryLoading(true);
    setRecoveryStatusMessage({ type: "", text: "" });

    // Generate random 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    setServerRecoveryCode(generatedCode);
    setRecoveryCodeExpiry(expiry);
    localStorage.setItem("FS_TEMP_RECOVERY_CODE", generatedCode);
    localStorage.setItem("FS_TEMP_RECOVERY_EXPIRY", expiry.toString());

    try {
      // Direct silent background HTTP POST to FormSubmit API
      // Delivers directly to solimine.g@gmail.com without opening any browser tab or mail client
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recoveryEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Código de Verificación CMS: ${generatedCode} - Full System Guanacaste`,
          destinatario: recoveryEmail,
          codigo_de_verificacion: generatedCode,
          mensaje: `Tu código de verificación de 6 dígitos para restablecer la contraseña del CMS es: ${generatedCode}. Ingrésalo en la pantalla web. Este código caduca en 15 minutos.`,
          fecha: new Date().toLocaleString(),
          _template: "table",
          _captcha: "false"
        })
      });

      const data = await response.json().catch(() => null);

      setRecoveryCodeSent(true);
      if (data && data.message && data.message.includes("Activation")) {
        setRecoveryStatusMessage({
          type: "info",
          text: `Se ha enviado el correo a ${recoveryEmail}. Si es la primera vez, haz clic en "Activate Form" en ese correo para autorizar la recepción directa.`
        });
      } else {
        setRecoveryStatusMessage({
          type: "success",
          text: `¡Código de 6 dígitos enviado directamente a ${recoveryEmail}! Revisa tu buzón (o spam) e ingrésalo a continuación:`
        });
      }
    } catch {
      setRecoveryCodeSent(true);
      setRecoveryStatusMessage({
        type: "info",
        text: `Solicitud enviada a ${recoveryEmail}. Revisa tu correo e ingresa el código de 6 dígitos recibido.`
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Verify 6-digit OTP code and unlock CMS (with optional password update)
  const handleVerifyRecoveryCodeAndReset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = enteredRecoveryCode.replace(/\D/g, "").trim();
    const cleanPwd = recoveryNewPassword.trim();
    const cleanConfirm = recoveryConfirmPassword.trim();

    const storedCode = (serverRecoveryCode || localStorage.getItem("FS_TEMP_RECOVERY_CODE") || "").trim();
    const storedExpiry = recoveryCodeExpiry || Number(localStorage.getItem("FS_TEMP_RECOVERY_EXPIRY") || "0");

    if (!cleanCode) {
      setRecoveryStatusMessage({
        type: "error",
        text: "Por favor ingresa el código de 6 dígitos que llegó a tu correo."
      });
      return;
    }

    if (!storedCode) {
      setRecoveryStatusMessage({
        type: "error",
        text: "No se encontró ningún código activo en sesión. Haz clic en 'Reenviar código' para generar uno nuevo."
      });
      return;
    }

    if (storedExpiry && Date.now() > storedExpiry) {
      setRecoveryStatusMessage({
        type: "error",
        text: "El código de verificación ha caducado (15 min). Por favor haz clic en 'Reenviar código'."
      });
      return;
    }

    if (cleanCode !== storedCode) {
      setRecoveryStatusMessage({
        type: "error",
        text: `El código ingresado (${cleanCode}) no coincide con el enviado a ${recoveryEmail}. Verifica tu buzón de entrada o spam.`
      });
      return;
    }

    // Optional: If user specified a new password, validate and update it
    if (cleanPwd) {
      if (cleanPwd.length < 4) {
        setRecoveryStatusMessage({
          type: "error",
          text: "La nueva contraseña debe tener al menos 4 caracteres."
        });
        return;
      }

      if (cleanPwd !== cleanConfirm) {
        setRecoveryStatusMessage({
          type: "error",
          text: "Las nuevas contraseñas no coinciden. Por favor verifícalas."
        });
        return;
      }

      localStorage.setItem("FS_ADMIN_PASSWORD", cleanPwd);
      setAdminPassword(cleanPwd);
    }

    // Success: Clear temporary OTP tokens and unlock CMS Console immediately
    localStorage.removeItem("FS_TEMP_RECOVERY_CODE");
    localStorage.removeItem("FS_TEMP_RECOVERY_EXPIRY");
    setServerRecoveryCode("");
    setEnteredRecoveryCode("");
    setRecoveryNewPassword("");
    setRecoveryConfirmPassword("");
    setIsRecoveryMode(false);
    setRecoveryCodeSent(false);
    setIsLocked(false);
    setPasswordError(false);
    setRecoveryStatusMessage({ type: "", text: "" });
  };

  // Save Predetermined Recovery Email
  const handleSaveRecoveryEmail = (emailToSave: string) => {
    const clean = emailToSave.trim();
    if (!clean || !clean.includes("@") || !clean.includes(".")) {
      setRecoveryEmailSavedMessage("Por favor ingresa un correo electrónico válido (ej: nombre@dominio.com)");
      return;
    }
    localStorage.setItem("FS_ADMIN_RECOVERY_EMAIL", clean);
    setRecoveryEmail(clean);
    setRecoveryEmailSavedMessage("¡Correo predeterminado de recuperación actualizado con éxito!");
    setTimeout(() => {
      setRecoveryEmailSavedMessage("");
    }, 4000);
  };

  // Calculator State
  const [roomsCount, setRoomsCount] = useState<number>(30);
  const [businessType, setBusinessType] = useState<"hotel" | "airbnb" | "restaurant">("hotel");

  // Before & After Toggles
  const [dikroState, setDikroState] = useState<"before" | "after">("after");
  const [nuovoponState, setNuovoponState] = useState<"before" | "after">("after");

  // Interactive System Steps State
  const [activeStep, setActiveStep] = useState<number>(1);

  // FAQ Expanded State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // ROI Calculator Calculations
  const getCalculations = () => {
    let baseTraditionalCost = 0;
    let plasticContainers = 0;
    
    if (businessType === "hotel") {
      baseTraditionalCost = roomsCount * 12; // $12 USD per room monthly on cleaning chemicals
      plasticContainers = roomsCount * 4; // 4 traditional bottles per room per year
    } else if (businessType === "airbnb") {
      baseTraditionalCost = roomsCount * 18; // Airbnbs have higher turn overhead
      plasticContainers = roomsCount * 5;
    } else { // Restaurant
      baseTraditionalCost = roomsCount * 25; // "Rooms" here acts as "tables/covers factor"
      plasticContainers = roomsCount * 8;
    }

    const fullSystemCost = baseTraditionalCost * 0.55; // 45% savings average
    const annualSavingsUsd = (baseTraditionalCost - fullSystemCost) * 12;
    const annualSavingsColones = annualSavingsUsd * 515; // ₡515 per USD conversion approximate
    const plasticSaved = Math.round(plasticContainers * 0.85); // 85% plastic reduction

    return {
      monthlyTrad: Math.round(baseTraditionalCost),
      monthlyFull: Math.round(fullSystemCost),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      annualSavingsColones: Math.round(annualSavingsColones).toLocaleString("es-CR"),
      plasticSaved
    };
  };

  // Helpers for checking and transforming embeddable video URLs (e.g., YouTube / Vimeo)
  const isEmbeddableVideo = (url: string) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com") || url.includes("embed");
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtube.com/watch?v=")) {
      const parts = url.split("watch?v=");
      const videoId = parts[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
    }
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      const videoId = parts[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
    }
    if (url.includes("vimeo.com/")) {
      const parts = url.split("vimeo.com/");
      const videoId = parts[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const calcs = getCalculations();

  // WhatsApp link configuration based on current CMS data
  // Clean strictly digits for WhatsApp API (remove +, spaces, dashes, parentheses)
  const phoneDigits = (cmsData.contact.whatsapp || "+506 6209 4411").replace(/[^0-9]/g, "");

  // Universal WhatsApp URL generator using Meta's official api.whatsapp.com endpoint
  // to prevent DNS NXDOMAIN errors associated with the .me domain shortener (wa.me)
  const getWhatsAppUrl = (customText?: string) => {
    const defaultText = "Hola Full System Costa Rica, vengo de la Landing Page. Me gustaría agendar el diagnóstico gratuito de 48-72h para mi operación.";
    const text = customText || defaultText;
    return `https://api.whatsapp.com/send?phone=${phoneDigits}&text=${encodeURIComponent(text)}`;
  };

  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white relative">
      
      {/* Dynamic Saving Indicator Toast */}
      <AnimatePresence>
        {showSavedIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0F172A] border-2 border-emerald-500 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="bg-emerald-500 p-1.5 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm block">¡CMS Actualizado con Éxito!</span>
              <span className="text-[10px] text-slate-300">Los cambios se guardaron localmente.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP NAV / HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#home"
              id="nav-logo-link"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                const target = document.getElementById("home");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center flex-shrink-0 cursor-pointer no-underline text-inherit hover:opacity-90 transition-opacity py-1"
              title="Full System Costa Rica"
            >
              {/* Official FULL SYSTEM Logo */}
              <img 
                src={resolveLogoImage(cmsData.logo?.imageUrl)} 
                alt={cmsData.logo?.text || "Full System Costa Rica"} 
                className="w-auto object-contain transition-all" 
                style={{ 
                  height: cmsData.logo?.height ? `${Math.min(Math.max(Number(cmsData.logo.height), 48), 92)}px` : "74px",
                  maxHeight: "88px"
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fullSystemLogoDefault;
                }}
                referrerPolicy="no-referrer" 
              />
            </a>
          </div>

          {/* Center Navigation for Desktop (lg and xl screens) */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            <a 
              href="#home" 
              id="nav-link-home"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("home");
                if (target) target.scrollIntoView({ behavior: "smooth" });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50/80"
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>{cmsData.menu?.home || "Home"}</span>
            </a>
            <a 
              href="#problema" 
              id="nav-link-problema" 
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {cmsData.menu?.problema || "El Problema"}
            </a>
            <a 
              href="#funcionamiento" 
              id="nav-link-funcionamiento" 
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {cmsData.menu?.funcionamiento || "¿Cómo Funciona?"}
            </a>
            <a 
              href="#portafolio" 
              id="nav-link-portafolio" 
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {cmsData.menu?.portafolio || "Portafolio"}
            </a>
            <a 
              href="#precio" 
              id="nav-link-precio" 
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {cmsData.menu?.precio || "Kit Inicial"}
            </a>
            <a 
              href="#faq" 
              id="nav-link-faq" 
              className="text-xs xl:text-sm font-semibold text-[#0B192C] hover:text-[#10B981] transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {cmsData.menu?.faq || "FAQs"}
            </a>
          </nav>

          {/* Right Actions: Admin Button + CTA + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">
            <span className="hidden 2xl:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Guanacaste Activo
            </span>

            {/* Always-accessible Administration button with distinct styling */}
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              id="nav-admin-btn"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
              title="Abrir Consola de Administración (CMS)"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{cmsData.menu?.administracion || "Administración"}</span>
              <span className="inline sm:hidden text-[11px]">Admin</span>
            </button>

            {/* Direct WhatsApp Consultation CTA */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-cta-btn"
              className="inline-flex items-center justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-all shadow-md active:scale-95 duration-150 gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white flex-shrink-0" />
              <span className="hidden md:inline">Solicite diagnóstico</span>
              <span className="inline md:hidden">Diagnóstico</span>
            </a>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex-shrink-0 cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-slate-800" /> : <Menu className="w-4 h-4 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Collapsible Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-2.5 shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    const target = document.getElementById("home");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                    else window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>{cmsData.menu?.home || "Home"}</span>
                </a>
                <a 
                  href="#problema"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <span>{cmsData.menu?.problema || "El Problema"}</span>
                </a>
                <a 
                  href="#funcionamiento"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <span>{cmsData.menu?.funcionamiento || "¿Cómo Funciona?"}</span>
                </a>
                <a 
                  href="#portafolio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <span>{cmsData.menu?.portafolio || "Portafolio"}</span>
                </a>
                <a 
                  href="#precio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <span>{cmsData.menu?.precio || "Kit Inicial"}</span>
                </a>
                <a 
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors"
                >
                  <span>{cmsData.menu?.faq || "FAQs"}</span>
                </a>
              </div>

              {/* Full-width Administration button in mobile drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Abrir Consola de Administración (CMS)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative bg-[#0B192C] text-white pt-12 pb-20 sm:pb-28 overflow-hidden scroll-mt-28">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Core UVP Text */}
            <div className="lg:col-span-6 flex flex-col space-y-6 text-left max-w-2xl">
              <div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 mb-4 tracking-wide uppercase">
                  {cmsData.hero.badge}
                </span>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                  {cmsData.hero.title}
                </h1>
              </div>

              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed">
                {cmsData.hero.subtitle}
              </p>

              {/* Dynamic trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 w-full">
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-emerald-400 font-bold text-sm sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-tight block">{cmsData.hero.metricCost}</span>
                  <span className="text-slate-400 text-[10px] sm:text-xs mt-1 block leading-tight">{cmsData.hero.metricCostLabel}</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-emerald-400 font-bold text-sm sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-tight block">{cmsData.hero.metricDose}</span>
                  <span className="text-slate-400 text-[10px] sm:text-xs mt-1 block leading-tight">{cmsData.hero.metricDoseLabel}</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-emerald-400 font-bold text-sm sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-tight block">{cmsData.hero.metricWaste}</span>
                  <span className="text-slate-400 text-[10px] sm:text-xs mt-1 block leading-tight">{cmsData.hero.metricWasteLabel}</span>
                </div>
              </div>

              {/* Call To Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-primary-cta"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-98 gap-3 group"
                >
                  <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                  <span>{cmsData.hero.ctaPrimary}</span>
                </a>
                
                <a 
                  href="#funcionamiento" 
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 transition-all gap-1.5"
                >
                  <span>Conozca cómo funciona FU-DOSE</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2 text-slate-400 text-xs">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sin costo de visita técnica</span>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Despacho directo de Sardinal</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Display - Enriched & Enlarged */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/25 to-blue-500/15 rounded-3xl filter blur-3xl"></div>
              
              <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden group">
                <div className="aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 relative flex items-center justify-center">
                  <img 
                     src={cmsData.hero.imageUrl || heroImageDefault} 
                     alt="FULL SYSTEM - Kit de Dosis Controlada con Speed Full, Dikro Full y Nuovopon" 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                     style={{ minHeight: '380px' }}
                     onError={(e) => {
                       (e.currentTarget as HTMLImageElement).src = heroImageDefault;
                     }}
                     referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-tight text-white">SISTEMA COMPACTO FU-DOSE</span>
                    </div>
                    <span className="text-[11px] sm:text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded font-bold font-mono">
                      100% CONCENTRADO
                    </span>
                  </div>
                </div>

                {/* Lower specs box inside container */}
                <div className="mt-4 grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/40">
                    <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider block font-mono">Eficiencia de espacio</span>
                    <span className="text-white text-sm sm:text-base font-bold block mt-0.5">
                      {cmsData.hero?.spaceEfficiency || "3 botellas = 15 Galones"}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/40">
                    <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider block font-mono">Garantía ambiental</span>
                    <span className="text-white text-sm sm:text-base font-bold block mt-0.5">Fórmula biodegradable</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN COMPARATIVA RÁPIDA (NUEVA FASCIA) */}
      <section className="py-16 bg-[#0B192C] border-b border-slate-800 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-stretch">
            
            {/* Columna 1: El Problema Actual */}
            <div className="bg-slate-950/40 border border-slate-800/80 p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-all hover:border-slate-800">
              <div>
                <span className="text-rose-500 font-bold text-xs uppercase tracking-widest font-mono block mb-3">La Situación Actual</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-tight mb-8">
                  ¿Qué está pasando hoy en su operación?
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0 font-bold">
                      ❌
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium text-sm sm:text-base">Cada colaborador dosifica diferente.</p>
                      <p className="text-slate-400 text-xs mt-1">Falta de estandarización y control en la preparación de las soluciones.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0 font-bold">
                      ❌
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium text-sm sm:text-base">Se desperdicia producto.</p>
                      <p className="text-slate-400 text-xs mt-1">El exceso de producto genera gastos innecesarios y riesgo químico.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0 font-bold">
                      ❌
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium text-sm sm:text-base">Los resultados cambian todos los días.</p>
                      <p className="text-slate-400 text-xs mt-1">Inconsistencia en la calidad de la limpieza y desinfección.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Con FULL SYSTEM */}
            <div className="bg-gradient-to-br from-slate-950/80 to-[#0B192C]/40 border border-emerald-500/30 p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg shadow-emerald-950/20 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full blur-xl pointer-events-none"></div>
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest font-mono block mb-3">La Solución</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-tight mb-8">
                  Con <span className="text-emerald-400">FULL SYSTEM</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 font-bold">
                      ✅
                    </div>
                    <div>
                      <p className="text-emerald-50 font-semibold text-sm sm:text-base">La misma dosis.</p>
                      <p className="text-emerald-400/70 text-xs mt-1">Estandarización absoluta garantizada en cada aplicación.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 font-bold">
                      ✅
                    </div>
                    <div>
                      <p className="text-emerald-50 font-semibold text-sm sm:text-base">Menos desperdicio.</p>
                      <p className="text-emerald-400/70 text-xs mt-1">Ahorro medible desde el primer día controlando cada gota.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:min-h-[88px]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 font-bold">
                      ✅
                    </div>
                    <div>
                      <p className="text-emerald-50 font-semibold text-sm sm:text-base">La limpieza se repite todos los días.</p>
                      <p className="text-emerald-400/70 text-xs mt-1">Resultados idénticos y profesionales en cada jornada.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
         {/* 3. SECCIÓN EL DOLOR / LA REALIDAD */}
      <section id="problema" className="py-20 sm:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest font-mono block mb-2">
              {cmsData.problemaSection?.sectionBadge || "El Costo Oculto de la Limpieza Tradicional"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0B192C]">
              {cmsData.problemaSection?.title || "¿Seguís permitiendo la \"dosificación a ojo\" en tu operación?"}
            </h2>
            <p className="text-slate-600 text-lg sm:text-xl mt-4">
              {cmsData.problemaSection?.subtitle || "Cada chorro extra que vierte tu personal es dinero líquido que se va por el desagüe y plástico innecesario que acumulás en bodega."}
            </p>
          </div>

          {/* Comparison Cards: Sin vs Con */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            
            {/* SIN SYSTEM */}
            <div className="bg-red-50/40 border border-red-100/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase bg-red-100/50 text-red-700 px-3 py-1 rounded-full">
                    {cmsData.problemaSection?.sinTitle || "Sin FU-DOSE (Tradicional)"}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4">
                  {cmsData.problemaSection?.sinSubtitle || "El caos y el costo variable"}
                </h3>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.sinItem1Title || "Dosificación al cálculo (\"a ojo\")"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.sinItem1Desc || "El operario echa de más porque cree que \"limpia mejor\" o hace más espuma."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.sinItem2Title || "Desperdicio y costo variable incontrolable"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.sinItem2Desc || "Las compras varían drásticamente cada mes. Es imposible presupuestar con precisión."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.sinItem3Title || "Peligro de accidente químico laboral"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.sinItem3Desc || "El personal tiene contacto con químicos puros, salpicaduras y gases al mezclar manualmente."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.sinItem4Title || "Inconsistencia en el resultado final"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.sinItem4Desc || "Un día huele bien, otro día huele a amoníaco. El huésped nota la inconsistencia."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.sinItem5Title || "Montañas de envases en bodega"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.sinItem5Desc || "Inundación de bidones plásticos de 5 litros ocupando metros cuadrados valiosos de almacenamiento."}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-red-100 flex items-center justify-between text-red-700 bg-red-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="text-xs font-mono font-bold uppercase">
                  {cmsData.problemaSection?.sinFinancialLabel || "Resultado financiero"}
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {cmsData.problemaSection?.sinFinancialVal || "Mermas ocultas de hasta un 45%"}
                </span>
              </div>
            </div>

            {/* CON SYSTEM */}
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white font-mono font-bold text-[9px] uppercase px-4 py-1 tracking-widest rounded-bl-xl shadow-xs">
                SISTEMA RECOMENDADO
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-emerald-100 p-3 rounded-2xl">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full">
                    {cmsData.problemaSection?.conTitle || "Con FULL SYSTEM"}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4">
                  {cmsData.problemaSection?.conSubtitle || "El control absoluto de la dosis"}
                </h3>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.conItem1Title || "1 Dosis Exacta por cada carga"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.conItem1Desc || "El tarrito integrado de la botella FU-DOSE impide servir de más. Solo entrega la dosis calibrada."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.conItem2Title || "Cero desperdicio, costo 100% predecible"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.conItem2Desc || "Si sabés cuántos cuartos limpiás, sabés exactamente cuántas dosis vas a gastar. Rendimiento exacto."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.conItem3Title || "Máxima seguridad laboral (MSDS)"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.conItem3Desc || "El dosificador integrado elimina el contacto físico directo del operario con el líquido puro."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.conItem4Title || "Consistencia impecable en limpieza"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.conItem4Desc || "Garantizá que la desinfección, el brillo y el aroma sean uniformes y perfectos todos los días."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <div>
                      <strong className="text-slate-800 text-sm sm:text-base block">
                        {cmsData.problemaSection?.conItem5Title || "90% Reducción de huella plástica"}
                      </strong>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {cmsData.problemaSection?.conItem5Desc || "La botella de 1 litro de concentrado reemplaza múltiples bidones de químico tradicional diluido."}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-100 flex items-center justify-between text-emerald-700 bg-emerald-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="text-xs font-mono font-bold uppercase">
                  {cmsData.problemaSection?.conSavingsLabel || "Ahorro operacional"}
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {cmsData.problemaSection?.conSavingsVal || "Entre el 35% y el 50% directo"}
                </span>
              </div>
            </div>

          </div>

          {/* INTERACTIVE ROI CALCULATOR PANEL */}
          <div className="mt-16 bg-gradient-to-tr from-[#0B192C] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg sm:text-2xl text-white">Calculadora de Eficiencia B2B</h4>
                <p className="text-slate-400 text-xs sm:text-sm">Estimá cuánto estás desperdiciando y tu potencial de ahorro anual con Full System.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Slider Inputs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-3">
                    1. Tipo de Operación
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "hotel", label: "Hotel", icon: Award },
                      { id: "airbnb", label: "Airbnb", icon: Sparkles },
                      { id: "restaurant", label: "Restaurante", icon: Users }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setBusinessType(type.id as any)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border font-semibold text-xs transition-all gap-1.5 ${
                            businessType === type.id
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                              : "bg-slate-800/50 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                      {businessType === "restaurant" ? "2. Número de Mesas / Comensales factor" : "2. Número de Habitaciones / Villas"}
                    </label>
                    <span className="font-mono text-emerald-400 font-bold text-lg bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      {roomsCount} {businessType === "restaurant" ? "Mesas" : "Unidades"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="150"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>2 min</span>
                    <span>75 medio</span>
                    <span>150 max</span>
                  </div>
                </div>
              </div>

              {/* Outputs panel */}
              <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">
                      Ahorro Anual Estimado Directo
                    </span>
                    <span className="text-emerald-400 font-display font-bold text-3xl sm:text-4xl block mt-1">
                      ₡{calcs.annualSavingsColones}
                    </span>
                    <span className="text-slate-300 text-xs block font-mono">
                      (~ ${calcs.annualSavingsUsd} USD al año)
                    </span>
                  </div>

                  <div className="border-t border-slate-700/50 pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono uppercase block">Desechos plásticos</span>
                      <span className="text-white font-bold text-sm block mt-0.5">-{calcs.plasticSaved} botellas</span>
                      <span className="text-slate-400 text-[10px] block">No compradas/desechadas</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono uppercase block">Espacio en Bodega</span>
                      <span className="text-white font-bold text-sm block mt-0.5">Libera el 62%</span>
                      <span className="text-slate-400 text-[10px] block">Menos SKUs y volumen</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-all shadow-md gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Bloquear mi precio de ahorro</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CÓMO FUNCIONA EL SISTEMA FU-DOSE */}
      <section id="funcionamiento" className="py-20 sm:py-28 bg-white text-slate-900 relative border-b border-slate-150">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest font-mono block mb-2">
              {cmsData.funcionamientoSection?.sectionBadge || "Ingeniería Inteligente de Envase"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0B192C]">
              {cmsData.funcionamientoSection?.title || "Sistema FU-DOSE de doble cuello"}
            </h2>
            <p className="text-slate-600 text-lg sm:text-xl mt-4">
              {cmsData.funcionamientoSection?.subtitle || "Una botella de dosificación integrada patentada que hace imposible que el operario gaste de más. No requiere de conexiones de agua complejas ni mantenciones costosas."}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-6xl mx-auto">
            
            {/* Interactive Steps Left */}
            <div className="lg:col-span-6 space-y-6">
              {[
                {
                  num: 1,
                  title: cmsData.funcionamientoSection?.step1Title || "1. Presioná",
                  actionText: cmsData.funcionamientoSection?.step1ActionText || "Presioná la botella de concentrado",
                  desc: cmsData.funcionamientoSection?.step1Desc || "El operario presiona suavemente el cuerpo de la botella. El tarrito integrado de doble cuello se llena con la dosis exacta de concentrado calibrada (marcas integradas de 10ml, 20ml o 30ml)."
                },
                {
                  num: 2,
                  title: cmsData.funcionamientoSection?.step2Title || "2. Serví",
                  actionText: cmsData.funcionamientoSection?.step2ActionText || "Incliná para verter",
                  desc: cmsData.funcionamientoSection?.step2Desc || "Al inclinar la botella para servir en el balde o atomizador, el tarrito queda orientado hacia arriba y el otro cuello se bloquea por gravedad. Es imposible que caiga más químico concentrado."
                },
                {
                  num: 3,
                  title: cmsData.funcionamientoSection?.step3Title || "3. Diluí",
                  actionText: cmsData.funcionamientoSection?.step3ActionText || "Mezclá con agua en el atomizador",
                  desc: cmsData.funcionamientoSection?.step3Desc || "Aplicás la dosis exacta en el atomizador reutilizable de Full System lleno de agua. Cero contacto con el químico puro, cero peligro laboral y una consistencia perfecta garantizada."
                }
              ].map((step) => (
                <div 
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all text-left ${
                    activeStep === step.num 
                      ? "bg-emerald-50/60 border-emerald-500/40 shadow-sm" 
                      : "bg-slate-50 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-display font-bold text-lg sm:text-xl ${
                      activeStep === step.num ? "text-[#0B192C]" : "text-slate-800"
                    }`}>
                      {step.title}
                    </span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      activeStep === step.num 
                        ? "bg-[#0B192C] text-white" 
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {step.num}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold block mb-1 font-mono uppercase ${
                    activeStep === step.num ? "text-emerald-600" : "text-slate-500"
                  }`}>
                    {step.actionText}
                  </span>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                    {step.desc}
                  </p>
                </div>
              ))}

              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 text-left">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  <strong className="font-bold block text-emerald-800">{cmsData.funcionamientoSection?.benefitTitle || "Beneficio logístico radical:"}</strong>
                  {cmsData.funcionamientoSection?.benefitDesc || "Con solo 3 productos concentrados reemplazás hasta 8 tradicionales de tu bodega. Menos inventario, menos espacio desperdiciado y un control de compras sumamente ágil."}
                </p>
              </div>
            </div>

            {/* Video Player Showcase Right */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-emerald-500/5 filter blur-3xl rounded-3xl"></div>
              
              <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-xl">
                
                {/* Header of Video mockup */}
                <div className="flex items-center justify-between mb-3 px-1 text-slate-500 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>{cmsData.video?.title || "VIDEO DEMOSTRATIVO"}</span>
                  </div>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    {cmsData.video?.badge || "FU-DOSE EN ACCIÓN"}
                  </span>
                </div>

                {/* Video container with natural 16:9 video aspect ratio */}
                <div 
                  ref={videoContainerRef}
                  className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative border border-slate-200/80 shadow-inner flex flex-col justify-center items-center group select-none"
                  style={{ 
                    maxHeight: cmsData.video?.height ? `${cmsData.video.height}px` : "480px"
                  }}
                >
                  {isEmbeddableVideo(cmsData.video?.embedUrl) ? (
                    <iframe 
                      src={getEmbedUrl(cmsData.video.embedUrl)} 
                      title={cmsData.video.title}
                      className="w-full h-full absolute inset-0 border-0 z-10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <video 
                        ref={publicVideoRef}
                        key={cmsData.video?.embedUrl}
                        src={resolveVideoUrl(cmsData.video?.embedUrl)}
                        loop 
                        muted={isVideoMuted}
                        playsInline
                        autoPlay
                        preload="auto"
                        onClick={togglePlayVideo}
                        onPlay={() => {
                          setIsVideoPlaying(true);
                          setHasVideoError(false);
                        }}
                        onPause={() => setIsVideoPlaying(false)}
                        onTimeUpdate={() => {
                          if (publicVideoRef.current) {
                            const cur = publicVideoRef.current.currentTime;
                            const dur = publicVideoRef.current.duration || 0;
                            setVideoCurrentTime(cur);
                            setVideoDuration(dur);
                            setVideoProgress(dur ? (cur / dur) * 100 : 0);
                          }
                        }}
                        onError={(e) => {
                          console.warn("Video stream load issue:", e);
                          setHasVideoError(true);
                        }}
                        className={`w-full h-full ${videoFit === "cover" ? "object-cover" : "object-contain"} bg-black absolute inset-0 cursor-pointer transition-all duration-200`}
                        poster={cmsData.video?.posterUrl || videoPosterDefault}
                      >
                        <source src={resolveVideoUrl(cmsData.video?.embedUrl)} type="video/mp4" />
                        Tu navegador no soporta video HTML5.
                      </video>

                      {/* Top floating indicators & controls */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
                        {/* Live Status Badge */}
                        <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 shadow-lg">
                          <div className={`w-2 h-2 rounded-full ${isVideoPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></div>
                          <span className="text-[10px] text-white font-mono font-bold uppercase tracking-wider">
                            {isVideoPlaying ? "Reproduciendo en Navegador" : "FU-DOSE en Acción"}
                          </span>
                        </div>

                        {/* Right quick buttons (Scale fit, Sound, and Insert Video) */}
                        <div className="flex items-center gap-2">
                          {/* Scale / Fit Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoFit(prev => prev === "contain" ? "cover" : "contain");
                            }}
                            className="pointer-events-auto bg-slate-950/85 hover:bg-slate-900 text-white backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-1.5 text-[10px] font-mono font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
                            title={videoFit === "contain" ? "Modo 16:9 completo sin cortes activo. Clic para llenar pantalla." : "Modo llenar pantalla activo. Clic para ajustar sin cortes."}
                          >
                            <span className="text-slate-400">Escala:</span>
                            <span className={videoFit === "contain" ? "text-emerald-400" : "text-amber-400"}>
                              {videoFit === "contain" ? "16:9 Completo" : "Llenar"}
                            </span>
                          </button>

                          {/* Direct Sound Mute/Unmute toggle */}
                          <button
                            type="button"
                            onClick={toggleMuteVideo}
                            className="pointer-events-auto bg-slate-950/85 hover:bg-slate-900 text-white backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-1.5 text-[10px] font-mono font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
                            title={isVideoMuted ? "Activar audio" : "Silenciar audio"}
                          >
                            {isVideoMuted ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-slate-300">Silenciado</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Audio Activo</span>
                              </>
                            )}
                          </button>

                          {/* Direct Insert / Change Video button - SOLO ADMIN */}
                          {isAdminOpen && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsVideoModalOpen(true);
                            }}
                            className="pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-emerald-400/40 flex items-center gap-1.5 text-[10px] font-mono font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
                            title="Insertar o cambiar archivo de video"
                          >
                            <Upload className="w-3 h-3 text-white" />
                            <span>Insertar Video</span>
                          </button>
                          )}
                        </div>
                      </div>

                      {/* Big Central Play Button if paused */}
                      {!isVideoPlaying && !hasVideoError && (
                        <div 
                          onClick={togglePlayVideo}
                          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all z-20 group/play"
                        >
                          <div className="w-16 h-16 rounded-full bg-emerald-500 group-hover/play:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-all group-hover/play:scale-110 active:scale-95 pl-1 mb-2.5">
                            <Play className="w-8 h-8 fill-white" />
                          </div>
                          <span className="text-white text-xs font-bold font-mono tracking-wider bg-slate-950/90 px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-lg">
                            Click para Reproducir
                          </span>
                        </div>
                      )}

                      {/* Video Load Error Fallback Card */}
                      {hasVideoError && (
                        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
                          <AlertCircle className="w-9 h-9 text-amber-400 mb-2" />
                          <h4 className="text-sm font-bold text-white mb-1">Video en preparación o no disponible</h4>
                          <p className="text-xs text-slate-300 font-mono mb-4 max-w-sm">
                            Podés iniciar el reproductor, insertar un video (.MP4) desde tu dispositivo o restaurar el video de fábrica.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={togglePlayVideo}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Iniciar Reproductor</span>
                            </button>
                            {isAdminOpen && (
                            <>
                            <button
                              type="button"
                              onClick={() => setIsVideoModalOpen(true)}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                            >
                              <Upload className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Insertar Video</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleRestoreDefaultVideo}
                              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Restaurar Fábrica</span>
                            </button>
                            </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bottom Custom Playback Bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-3 pt-6 flex flex-col gap-2 z-20 transition-opacity duration-300">
                        {/* Interactive Timeline Track */}
                        <div 
                          onClick={handleSeekVideo}
                          className="w-full h-2 bg-slate-800/80 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all border border-slate-700/40 relative"
                        >
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-100 relative"
                            style={{ width: `${videoProgress}%` }}
                          ></div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between text-white text-xs font-mono">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={togglePlayVideo}
                              className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-slate-800 flex items-center justify-center text-white border border-slate-700/60 transition-all cursor-pointer"
                              title={isVideoPlaying ? "Pausar video" : "Reproducir video"}
                            >
                              {isVideoPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-white" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={restartVideo}
                              className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                              title="Reiniciar video desde el inicio"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            <span className="text-[11px] text-slate-400">
                              {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration || 16)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={toggleMuteVideo}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                              title={isVideoMuted ? "Activar audio" : "Silenciar audio"}
                            >
                              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>

                            <button
                              type="button"
                              onClick={handleFullscreenVideo}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                              title={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                            >
                              {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-emerald-400" /> : <Maximize className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                </div>

                <p className="text-slate-500 text-xs text-center mt-3 font-mono leading-relaxed px-2">
                  "{cmsData.video?.desc || "El operario presiona la botella, la dosis se auto-mide en el depósito superior, se inclina y diluye directamente en agua. Cero derrame."}"
                </p>

                {/* Direct Action Bar with Reliable Download Video Button & Insert/Change Video */}
                {cmsData.video?.embedUrl && (
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <FileVideo className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Video Demostrativo del Sistema
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {cmsData.video?.localFileSize ? `Archivo local (${cmsData.video.localFileSize})` : "Formato MP4 • Alta Definición"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      {isAdminOpen && (
                      <button 
                        type="button"
                        onClick={() => setIsVideoModalOpen(true)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        title="Insertar un archivo MP4 o enlace de YouTube/Vimeo"
                      >
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>Insertar / Cambiar Video</span>
                      </button>
                      )}

                      <button 
                        type="button"
                        onClick={() => triggerVideoDownload(cmsData.video?.embedUrl, cmsData.video?.localFileName || "video_demostrativo_fu_dose.mp4")}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200"
                        title="Descargar este video a tu computadora o dispositivo"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Descargar Video (.MP4)</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. EL PORTAFOLIO DE PODER (3 Solutions with image and interactive results) */}
      <section id="portafolio" className="py-20 sm:py-28 bg-[#F1F5F9] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest font-mono block mb-2">
              {cmsData.productsSection?.sectionBadge || "Súper Concentrados de Alto Impacto"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0B192C]">
              {cmsData.productsSection?.title || "El Portafolio de Poder de Full System"}
            </h2>
            <p className="text-slate-600 text-lg sm:text-xl mt-4">
              {cmsData.productsSection?.subtitle || "Tres fórmulas avanzadas y biodegradables que sustituyen con creces toda tu actual lista interminable de productos."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* PRODUCT CARD 1: SPEED FULL */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                {/* Visual Top Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img 
                    src={resolveProductImage(cmsData.products?.speedFull?.imageUrl, speedLobbyDefault)} 
                    alt="SPEED FULL - Desinfectante Multisuperficie" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== speedLobbyDefault) {
                        e.currentTarget.src = speedLobbyDefault;
                      }
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {cmsData.products.speedFull.badge}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700/50">
                    <span className="text-emerald-400 font-bold font-mono text-xs">Rinde hasta {cmsData.products.speedFull.yieldPisos}</span>
                  </div>
                </div>

                <div className="p-6 text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Aroma de Alto Impacto
                  </span>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                    {cmsData.products.speedFull.title}
                  </h3>
                  <p className="text-slate-700 font-medium text-sm italic mb-4 text-emerald-600">
                    "{cmsData.products.speedFull.aroma}"
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {cmsData.products.speedFull.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Pisos:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.speedFull.yieldPisos}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Atomizador:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.speedFull.yieldAtomizer}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Aroma insignia:</span>
                      <span className="text-slate-900 font-bold">{cmsData.products.speedFull.aromaDetail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 text-left">
                <a 
                  href={getWhatsAppUrl("Hola Full System Costa Rica, me gustaría solicitar la Ficha Técnica oficial y Hoja de Seguridad (MSDS) de SPEED FULL.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-[#0B192C] hover:bg-slate-800 text-white transition-all gap-1.5"
                >
                  <span>Pedir Ficha Técnica</span>
                  <FileText className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PRODUCT CARD 2: DIKRO FULL (with interactive before/after toggle) */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div>
                {/* Interactive Before & After Visual Top Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <AnimatePresence mode="wait">
                    {dikroState === "before" ? (
                      <motion.div
                        key="dikro-before"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full relative"
                      >
                        {/* Simulated/Represented rusty, limy hard water shower with strong dark overlay or image blur to reflect buildup */}
                        <img 
                          src={resolveProductImage(cmsData.products?.dikroFull?.imageUrl, dikroFixtureDefault)} 
                          alt="DIKRO FULL - Antes" 
                          className="w-full h-full object-cover saturate-50 filter blur-[1.5px] brightness-75"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== dikroFixtureDefault) {
                              e.currentTarget.src = dikroFixtureDefault;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-amber-900/30 mix-blend-color-burn"></div>
                        <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          CON INCRUSTACIÓN DE SARRO DURO
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dikro-after"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                      >
                        <img 
                          src={resolveProductImage(cmsData.products?.dikroFull?.imageUrl, dikroFixtureDefault)} 
                          alt="DIKRO FULL - Después" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== dikroFixtureDefault) {
                              e.currentTarget.src = dikroFixtureDefault;
                            }
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          {cmsData.products.dikroFull.badge} ACTIVO
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/50">
                      <span className="text-emerald-400 font-bold font-mono text-xs">Rinde hasta {cmsData.products.dikroFull.yieldMaint}</span>
                    </div>
                    {/* Before/After Toggle Pill */}
                    <div className="bg-slate-950/85 backdrop-blur-sm p-0.5 rounded-lg border border-slate-700/40 flex">
                      <button 
                        onClick={() => setDikroState("before")}
                        className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${
                          dikroState === "before" 
                            ? "bg-red-500/20 text-red-300" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Antes
                      </button>
                      <button 
                        onClick={() => setDikroState("after")}
                        className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${
                          dikroState === "after" 
                            ? "bg-emerald-500 text-white shadow-xs" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Después
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Formulado para Aguas Costeras Duras
                  </span>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                    {cmsData.products.dikroFull.title}
                  </h3>
                  <p className="text-slate-700 font-medium text-sm italic mb-4 text-emerald-600">
                    "{cmsData.products.dikroFull.quote}"
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {cmsData.products.dikroFull.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Extremo:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.dikroFull.yieldExtreme}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Mantenimiento:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.dikroFull.yieldMaint}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Acción activa:</span>
                      <span className="text-slate-900 font-bold">{cmsData.products.dikroFull.actionDetail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 text-left">
                <a 
                  href={getWhatsAppUrl("Hola Full System Costa Rica, me gustaría solicitar la Ficha Técnica oficial y Hoja de Seguridad (MSDS) de DIKRO FULL.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-[#0B192C] hover:bg-slate-800 text-white transition-all gap-1.5"
                >
                  <span>Pedir Ficha Técnica</span>
                  <FileText className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PRODUCT CARD 3: NUOVOPON (with interactive before/after toggle) */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div>
                {/* Interactive Before & After Visual Top Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <AnimatePresence mode="wait">
                    {nuovoponState === "before" ? (
                      <motion.div
                        key="nuovopon-before"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full relative"
                      >
                        {/* Simulated greasy range/hood */}
                        <img 
                          src={resolveProductImage(cmsData.products?.nuovopon?.imageUrl, nuovoponKitchenDefault)} 
                          alt="NUOVOPON - Antes" 
                          className="w-full h-full object-cover saturate-50 filter blur-[1.5px] brightness-75"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== nuovoponKitchenDefault) {
                              e.currentTarget.src = nuovoponKitchenDefault;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-yellow-950/40 mix-blend-color-burn"></div>
                        <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          CON COSTRAS DE GRASA PESADA
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="nuovopon-after"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                      >
                        <img 
                          src={resolveProductImage(cmsData.products?.nuovopon?.imageUrl, nuovoponKitchenDefault)} 
                          alt="NUOVOPON - Después" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== nuovoponKitchenDefault) {
                              e.currentTarget.src = nuovoponKitchenDefault;
                            }
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          {cmsData.products.nuovopon.badge} ACTIVO
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/50">
                      <span className="text-emerald-400 font-bold font-mono text-xs">Rinde hasta {cmsData.products.nuovopon.yieldMaint}</span>
                    </div>
                    {/* Before/After Toggle Pill */}
                    <div className="bg-slate-950/85 backdrop-blur-sm p-0.5 rounded-lg border border-slate-700/40 flex">
                      <button 
                        onClick={() => setNuovoponState("before")}
                        className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${
                          nuovoponState === "before" 
                            ? "bg-red-500/20 text-red-300" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Antes
                      </button>
                      <button 
                        onClick={() => setNuovoponState("after")}
                        className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${
                          nuovoponState === "after" 
                            ? "bg-emerald-500 text-white shadow-xs" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Después
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Grasas Quemadas y Orgánicas
                  </span>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                    {cmsData.products.nuovopon.title}
                  </h3>
                  <p className="text-slate-700 font-medium text-sm italic mb-4 text-emerald-600">
                    "{cmsData.products.nuovopon.quote}"
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {cmsData.products.nuovopon.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Campanas:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.nuovopon.yieldExtreme}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Rendimiento Limpieza Diaria:</span>
                      <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded">{cmsData.products.nuovopon.yieldMaint}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono font-semibold">Reacción química:</span>
                      <span className="text-slate-900 font-bold">{cmsData.products.nuovopon.actionDetail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 text-left">
                <a 
                  href={getWhatsAppUrl("Hola Full System Costa Rica, me gustaría solicitar la Ficha Técnica oficial y Hoja de Seguridad (MSDS) de NUOVOPON.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-[#0B192C] hover:bg-slate-800 text-white transition-all gap-1.5"
                >
                  <span>Pedir Ficha Técnica</span>
                  <FileText className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PRICING CONTEXTUALIZADO Y LOGÍSTICA */}
      <section id="precio" className="py-20 sm:py-28 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2 font-mono">
              {cmsData.kit.sectionBadge || "Eliminación total de riesgo"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0B192C]">
              {cmsData.kit.title}
            </h2>
            <p className="text-slate-600 text-lg sm:text-xl mt-4">
              {cmsData.kit.subtitle}
            </p>
          </div>

          {/* Pricing Bento Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Kit Features Left */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 text-left">
                  {cmsData.kit.featuresTitle || "Diseñado para blindar tu operación"}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm text-left">
                  {cmsData.kit.featuresDesc || "El Kit Inicial incluye todo lo necesario para erradicar las mermas desde el primer día y calibrar el consumo de tu personal:"}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 text-left pt-2">
                  <div className="bg-[#F8FAFC] border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-emerald-600 font-bold font-mono text-xs block">{cmsData.kit.feature1Tag || "01 / ENVASE INTELIGENTE"}</span>
                    <strong className="text-slate-800 text-sm block mt-1">{cmsData.kit.feature1Title}</strong>
                    <p className="text-slate-500 text-xs mt-1">{cmsData.kit.feature1Desc}</p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-emerald-600 font-bold font-mono text-xs block">{cmsData.kit.feature2Tag || "02 / ROTULACIÓN DE LEY"}</span>
                    <strong className="text-slate-800 text-sm block mt-1">{cmsData.kit.feature2Title}</strong>
                    <p className="text-slate-500 text-xs mt-1">{cmsData.kit.feature2Desc}</p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-emerald-600 font-bold font-mono text-xs block">{cmsData.kit.feature3Tag || "03 / SOPORTE IN SITU"}</span>
                    <strong className="text-slate-800 text-sm block mt-1">{cmsData.kit.feature3Title}</strong>
                    <p className="text-slate-500 text-xs mt-1">{cmsData.kit.feature3Desc}</p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-emerald-600 font-bold font-mono text-xs block">{cmsData.kit.feature4Tag || "04 / SEGURIDAD AL DÍA"}</span>
                    <strong className="text-slate-800 text-sm block mt-1">{cmsData.kit.feature4Title}</strong>
                    <p className="text-slate-500 text-xs mt-1">{cmsData.kit.feature4Desc}</p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200/60 p-4 rounded-xl sm:col-span-2">
                    <span className="text-emerald-600 font-bold font-mono text-xs block">{cmsData.kit.feature5Tag || "05 / PROPUESTA ECO-EFICIENTE"}</span>
                    <strong className="text-slate-800 text-sm block mt-1">{cmsData.kit.feature5Title || "Sostenibilidad Garantizada"}</strong>
                    <p className="text-slate-500 text-xs mt-1">{cmsData.kit.feature5Desc || "Disminución radical del plástico desechado y optimización de espacio en bodega."}</p>
                  </div>
                </div>
              </div>

              {/* Logistics Warning Panel */}
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4 text-left">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 animate-pulse">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-slate-900 text-sm block font-bold">{cmsData.kit.logisticsTitle || "Entrega y logística inmediata"}</strong>
                  <p className="text-slate-600 text-xs mt-1">
                    {cmsData.kit.logisticsDesc || "Tu primer Kit llega sin costo de envío a todo el país. Arrancás sin ningún riesgo operacional. Despacho directo desde Sardinal con tiempos de entrega de 48 a 72 horas garantizados."}
                  </p>
                </div>
              </div>

            </div>

            {/* Pricing Card Right */}
            <div className="lg:col-span-5 bg-[#0B192C] text-white border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              {/* Highlight ribbon */}
              <div className="absolute top-0 right-0 bg-emerald-500 text-white font-mono font-bold text-[9px] uppercase px-4 py-1 tracking-widest rounded-bl-xl shadow-xs">
                {cmsData.kit.b2bRibbon || "AHORRO ESTIMADO 35% - 50%"}
              </div>

              <div className="text-left space-y-4">
                <span className="text-emerald-400 font-bold font-mono text-xs uppercase tracking-widest block">
                  {cmsData.kit.b2bBadge || "PROPUESTA B2B DIRECTA"}
                </span>
                
                <h4 className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {cmsData.kit.b2bTitle || "Diagnóstico y Plan de Arranque"}
                </h4>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {cmsData.kit.b2bDesc || "No vendemos tambores químicos vacíos; implementamos un sistema operativo de ahorro. Visitamos tu hotel o restaurante para dimensionar el plan sin costo de entrada."}
                </p>

                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl font-mono text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">{cmsData.kit.b2bEstudioLabel || "ESTUDIO DE CAMPO"}</span>
                    <span className="text-emerald-400 font-bold uppercase">{cmsData.kit.b2bEstudioVal || "GRATIS"}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-slate-400">{cmsData.kit.b2bMsdsLabel || "HOJAS MSDS Y SEÑALÉTICA"}</span>
                    <span className="text-emerald-400 font-bold uppercase">{cmsData.kit.b2bMsdsVal || "INCLUIDAS"}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-slate-400">{cmsData.kit.b2bEntregaLabel || "ENTREGA DE PRIMER PEDIDO"}</span>
                    <span className="text-white font-bold">{cmsData.kit.b2bEntregaVal || "48-72 HORAS"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 text-[10px] block font-mono uppercase tracking-widest">
                    {cmsData.kit.b2bBeneficioLabel || "BENEFICIO OPERACIONAL"}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">{cmsData.kit.b2bBeneficioVal || "Reducción del 62% en SKUs"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-4 rounded-xl text-sm font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-all shadow-md hover:shadow-emerald-500/10 gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{cmsData.kit.b2bButtonText || "Pedir Diagnóstico Gratis"}</span>
                </a>
                <span className="text-center text-[10px] text-slate-500 block mt-3 font-mono">
                  {cmsData.kit.b2bDisclaimer || "*Válido para gerentes y administradores de Costa Rica"}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (B2B FAQs) */}
      <section id="faq" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest font-mono block mb-2">
              Respaldo Legal y Normativo
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#0B192C]">
              Preguntas de Control de Operaciones
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Todo lo que el departamento de compras, salud ocupacional y gerencia necesita saber.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Los productos cuentan con registro del Ministerio de Salud de Costa Rica?",
                a: "Sí, por supuesto. Todas nuestras fórmulas súper concentradas (SPEED FULL, DIKRO FULL, NUOVOPON) cuentan con las notificaciones y registros de salud vigentes exigidos en Costa Rica. Los certificados se adjuntan en el informe del diagnóstico inicial para tu respaldo legal."
              },
              {
                q: "¿Proveen las Hojas de Datos de Seguridad (MSDS) para auditorías de salud ocupacional?",
                a: "Totalmente. Entregamos las Hojas de Datos de Seguridad (MSDS) bajo la norma internacional SGA para cada químico. Además, brindamos señalética de seguridad adhesiva codificada por colores para la bodega del hotel o restaurante, evitando multas en auditorías de salud y de la Caja (CCSS)."
              },
              {
                q: "¿Cómo garantizan que el personal aprenda a utilizar el sistema?",
                a: "El factor humano es crucial. No nos limitamos a despachar el químico. Incluimos una sesión de entrenamiento presencial (o virtual interactivo de alta calidad si la zona es muy remota) de 25 minutos para tu equipo operativo. Les enseñamos a presionar, diluir y cuidar el equipo, y pegamos guías visuales en tu cuarto de limpieza."
              },
              {
                q: "El agua en Guanacaste es extremadamente dura. ¿Sus fórmulas no pierden efectividad?",
                a: `Es nuestra mayor ventaja. La mayoría de detergentes y desinfectantes del mercado se formulan en San José y pierden hasta un 40% de efectividad activa al mezclarse con las aguas de Guanacaste. Full System es fabricado en Sardinal, Guanacaste, y contiene secuestrantes calibrados para esto.`
              },
              {
                q: "¿Qué sucede si necesito asistencia técnica o un atomizador se daña?",
                a: `Ofrecemos garantía operacional total. Si un atomizador rotulado se rompe o el sistema de dosificación sufre desgaste, lo reemplazamos sin costo adicional en tu siguiente pedido. El soporte técnico vía WhatsApp (${cmsData.contact.whatsapp}) responde en menos de 2 horas.`
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all text-left"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    expandedFaq === index ? "rotate-180 text-emerald-500" : ""
                  }`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-50 text-slate-600 py-16 border-t border-slate-200 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-12 gap-8 pb-12 border-b border-slate-200">
            
            {/* Logo area */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={resolveLogoImage(cmsData.logo?.imageUrl)} 
                  alt={cmsData.logo?.text || "Full System Costa Rica"} 
                  className="w-auto object-contain mb-2" 
                  style={{ 
                    height: cmsData.logo?.height ? `${Math.min(Math.max(Math.round(Number(cmsData.logo.height) * 0.88), 48), 70)}px` : "64px",
                    maxHeight: "70px"
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fullSystemLogoDefault;
                  }}
                  referrerPolicy="no-referrer" 
                />
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {cmsData.footer?.description || "Sistema operativo costarricense de dosificación controlada de químicos de limpieza superconcentrados de alta eficiencia. Diseñado y formulado en Guanacaste."}
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{cmsData.contact.location}</span>
              </div>
            </div>

            {/* Quick links */}
            <div className="md:col-span-3 space-y-3">
              <strong className="text-[#0B192C] text-xs uppercase tracking-widest font-mono block">
                {cmsData.footer?.navTitle || "Navegación"}
              </strong>
              <ul className="space-y-2 text-xs">
                <li><a href="#home" className="hover:text-emerald-600 transition-colors font-medium">Home (Inicio)</a></li>
                <li><a href="#problema" className="hover:text-emerald-600 transition-colors">{cmsData.footer?.navLink1 || "Comparación Operativa"}</a></li>
                <li><a href="#funcionamiento" className="hover:text-emerald-600 transition-colors">{cmsData.footer?.navLink2 || "Sistema Doble Cuello"}</a></li>
                <li><a href="#portafolio" className="hover:text-emerald-600 transition-colors font-semibold">{cmsData.footer?.navLink3 || "Portafolio Concentrados"}</a></li>
                <li><a href="#precio" className="hover:text-emerald-600 transition-colors">{cmsData.footer?.navLink4 || "Kit Inicial sin Riesgo"}</a></li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => setIsAdminOpen(true)} 
                    className="hover:text-emerald-600 transition-colors font-semibold flex items-center gap-1.5 text-slate-700 cursor-pointer pt-1"
                  >
                    <Settings className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Consola de Administración</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Linktree & Contact Channels */}
            <div className="md:col-span-4 space-y-4">
              <strong className="text-[#0B192C] text-xs uppercase tracking-widest font-mono block">
                {cmsData.footer?.contactTitle || "Atención Directa Costa Rica"}
              </strong>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-800 font-bold hover:underline">{cmsData.contact.whatsapp}</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-emerald-600" />
                  <span>Email: <a href={`mailto:${cmsData.contact.email}`} className="text-slate-800 hover:underline">{cmsData.contact.email}</a></span>
                </div>
              </div>

              {/* Linktree style quick connections list */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-2">{cmsData.footer?.linktreeTitle || "Canales Útiles (Linktree):"}</span>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-200/80 hover:bg-emerald-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  >
                    {cmsData.contact.linktreeDiag}
                  </a>
                  <a 
                    href={getWhatsAppUrl("Hola Full System Costa Rica, me gustaría recibir el catálogo completo de productos concentrados Full System.")}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-200/80 hover:bg-emerald-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  >
                    {cmsData.contact.linktreeCatalog}
                  </a>
                  <a 
                    href={`tel:+${phoneDigits}`}
                    className="bg-slate-200/80 hover:bg-emerald-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  >
                    {cmsData.contact.linktreeCall}
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[10px] sm:text-xs">
            <span>{cmsData.footer?.copyright || "© 2026 FULL SYSTEM® Costa Rica. Todos los derechos reservados."}</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <button 
                type="button" 
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer underline"
              >
                Acceso Administración
              </button>
              <span>{cmsData.footer?.ecoLabel || "Formulaciones Ecológicas Biodegradables en Guanacaste 🇨🇷"}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ==================== QUICK INSERT / CHANGE VIDEO MODAL ==================== */}
      <AnimatePresence>
        {isAdminOpen && isVideoModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Insertar o Cambiar Video</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Subí tu video propio (.MP4, .WEBM) o pegá un enlace de YouTube/Vimeo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Option 1: Upload from device */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Opción 1: Subir Archivo desde tu Computadora / Móvil
                    </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Sin restricciones (Hasta 5 GB)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Seleccioná cualquier archivo de video desde tu computadora, laptop o celular. Se guardará de forma permanente y se reproducirá al instante.
                  </p>

                  <div 
                    onClick={() => quickVideoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-900/50 hover:bg-emerald-950/20 group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-bold text-white mb-1">
                      {quickVideoUploadProgress ? "Procesando y guardando video..." : "Haz clic aquí para seleccionar el archivo de video"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Formatos recomendados: .MP4, .WEBM, .MOV
                    </p>
                  </div>

                  <input 
                    type="file"
                    ref={quickVideoInputRef}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleQuickVideoUpload(file);
                    }}
                    className="hidden"
                  />
                </div>




                {/* Option 3: Restore Factory Default Video */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-300 block mb-0.5">
                      Restaurar Video Original de Fábrica
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Vuelve al video original de demostración de dosificación de Full System.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultVideo}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar</span>
                  </button>
                </div>

                {/* Current video status */}
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <span className="truncate max-w-[340px]">
                    Video actual: {cmsData.video?.isLocalUploaded ? (cmsData.video.localFileName || "Video personalizado") : (cmsData.video?.embedUrl?.slice(0, 45) || "video_demostrativo_fu_dose.mp4")}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${cmsData.video?.isLocalUploaded ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {cmsData.video?.isLocalUploaded ? "Almacenado Local" : "Enlace / Fábrica"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== CMS ADMIN DASHBOARD PANEL OVERLAY ==================== */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 text-white flex flex-col justify-between shadow-2xl relative"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Full System CMS Console</h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider">MODO B2B ADMINISTRADOR - AUTOSAVED EN LOCAL</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isLocked && (
                    <>
                      <button
                        onClick={() => setAdminTab("seguridad")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                          adminTab === "seguridad"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-800"
                        }`}
                        title="Cambiar o gestionar contraseña"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Cambiar Clave</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsLocked(true);
                          setPasswordInput("");
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white transition-all border border-slate-800"
                        title="Bloquear la consola"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Bloquear</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setIsAdminOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Password Gate Area */}
              {isLocked ? (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-start items-center max-w-lg mx-auto text-center space-y-4 w-full">
                  
                  {/* Mode 1: Forgot Password / Direct Email OTP Recovery Flow */}
                  {isRecoveryMode ? (
                    <div className="w-full bg-slate-950/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 flex-shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-lg text-white">Recuperación Segura por Correo</h4>
                          <span className="text-xs text-slate-400 block">Autenticación de 2 factores (OTP)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Para garantizar que ninguna persona no autorizada pueda ingresar ni modificar tu acceso, el sistema enviará un código numérico de 6 dígitos directamente a tu correo electrónico predeterminado.
                      </p>

                      {/* Predetermined Email Display */}
                      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                            Correo Predeterminado de Seguridad
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Autorizado
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-white flex items-center gap-2 pt-0.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{recoveryEmail}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 pt-0.5">
                          El envío se realiza en segundo plano directamente al buzón sin necesidad de abrir clientes externos.
                        </p>
                      </div>

                      {!recoveryCodeSent ? (
                        <div className="space-y-3 pt-1">
                          <button
                            type="button"
                            disabled={recoveryLoading}
                            onClick={handleSendDirectRecoveryEmail}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                          >
                            {recoveryLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Enviando código directamente a {recoveryEmail}...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Enviar Código de Verificación a {recoveryEmail}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsRecoveryMode(false);
                              setRecoveryStatusMessage({ type: "", text: "" });
                            }}
                            className="w-full py-2 text-slate-500 hover:text-white text-xs font-mono text-center"
                          >
                            Cancelar y volver a inicio de sesión
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleVerifyRecoveryCodeAndReset} className="space-y-4 pt-1">
                          <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl space-y-1">
                            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                              <Check className="w-4 h-4 flex-shrink-0" />
                              <span>Código de verificación enviado</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-tight">
                              Revisa tu buzón o spam en <strong>{recoveryEmail}</strong>. Ingresa el código de 6 dígitos para desbloquear la consola:
                            </p>
                          </div>

                          <div>
                            <label className="text-[11px] text-emerald-400 uppercase font-mono font-bold block mb-1.5">
                              1. Código de 6 Dígitos Recibido en tu Correo
                            </label>
                            <input 
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              autoFocus
                              placeholder="Ej: 849201"
                              value={enteredRecoveryCode}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setEnteredRecoveryCode(val);
                                if (recoveryStatusMessage.text) {
                                  setRecoveryStatusMessage({ type: "", text: "" });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleVerifyRecoveryCodeAndReset();
                                }
                              }}
                              className="w-full px-4 py-3 bg-slate-900 border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl text-center text-2xl font-mono font-bold tracking-widest text-emerald-300 focus:outline-none shadow-inner"
                            />
                          </div>

                          {recoveryStatusMessage.text && (
                            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                              recoveryStatusMessage.type === "error"
                                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {recoveryStatusMessage.type === "error" ? (
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <Check className="w-4 h-4 flex-shrink-0" />
                              )}
                              <span>{recoveryStatusMessage.text}</span>
                            </div>
                          )}

                          {/* Primary validation button */}
                          <button
                            type="submit"
                            id="btn-validar-codigo-desbloquear"
                            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-5 h-5 text-white" />
                            <span>Validar Código y Desbloquear CMS</span>
                          </button>

                          {/* Optional password update dropdown */}
                          <div className="pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => setShowOptionalPasswordReset(!showOptionalPasswordReset)}
                              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 w-full py-1"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-400" />
                              <span>{showOptionalPasswordReset ? "Ocultar cambio de contraseña" : "¿Deseas además cambiar tu contraseña ahora? (Opcional)"}</span>
                            </button>

                            {showOptionalPasswordReset && (
                              <div className="space-y-3 pt-3 text-left">
                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                                    Nueva Contraseña Deseada
                                  </label>
                                  <input 
                                    type="password"
                                    placeholder="Mínimo 4 caracteres (opcional)"
                                    value={recoveryNewPassword}
                                    onChange={(e) => setRecoveryNewPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                                    Confirmar Nueva Contraseña
                                  </label>
                                  <input 
                                    type="password"
                                    placeholder="Repite la nueva contraseña"
                                    value={recoveryConfirmPassword}
                                    onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              disabled={recoveryLoading}
                              onClick={handleSendDirectRecoveryEmail}
                              className="text-xs text-slate-400 hover:text-white font-mono transition-colors"
                            >
                              Reenviar código nuevo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsRecoveryMode(false);
                                setRecoveryCodeSent(false);
                                setRecoveryStatusMessage({ type: "", text: "" });
                              }}
                              className="text-xs text-slate-500 hover:text-white font-mono transition-colors"
                            >
                              Volver a login
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : isChangingPasswordOnLock ? (
                    /* Mode 2: Change Password with Strict Verification of Old Password */
                    <div className="w-full bg-slate-950/95 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 flex-shrink-0">
                            <Key className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-lg text-white">Cambiar Contraseña</h4>
                            <span className="text-xs text-slate-400 block">Requiere verificar la contraseña actual</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPasswordOnLock(false);
                            setPasswordChangeMessage({ type: "", text: "" });
                          }}
                          className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Para cambiar la contraseña de administración, debes ingresar primero tu <strong className="text-amber-300">contraseña actual (psw vecchia)</strong> como medida de seguridad.
                      </p>

                      <form onSubmit={handleChangePassword} className="space-y-3.5">
                        <div>
                          <label className="text-[10px] text-amber-400 uppercase font-mono font-bold block mb-1">
                            1. Contraseña Actual (Obligatoria)
                          </label>
                          <div className="relative">
                            <input 
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Ingresá la contraseña actual (psw vecchia)"
                              value={oldPasswordInput}
                              onChange={(e) => setOldPasswordInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                              title={showOldPassword ? "Ocultar" : "Mostrar"}
                            >
                              {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                            2. Nueva Contraseña (mínimo 4 caracteres)
                          </label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Escribí tu nueva contraseña"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                              title={showPassword ? "Ocultar" : "Mostrar"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                            3. Confirmar Nueva Contraseña
                          </label>
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Repetí la nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        {passwordChangeMessage.text && (
                          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                            passwordChangeMessage.type === "success"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          }`}>
                            {passwordChangeMessage.type === "success" ? (
                              <Check className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span>{passwordChangeMessage.text}</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-98"
                          >
                            Verificar y Cambiar Contraseña
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPasswordOnLock(false);
                              setPasswordChangeMessage({ type: "", text: "" });
                            }}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition-all border border-slate-800"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPasswordOnLock(false);
                              setIsRecoveryMode(true);
                              setPasswordChangeMessage({ type: "", text: "" });
                            }}
                            className="text-xs text-slate-400 hover:text-emerald-400 font-mono inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-emerald-400" />
                            <span>¿Olvidaste la contraseña actual? Solicitar clave por correo</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Mode 3: Default Secure Unlock Form */
                    <>
                      <div className="p-4 bg-slate-950 rounded-full border border-slate-800 text-emerald-400 shadow-lg shadow-emerald-500/10">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xl text-white">Consola de Control de Contenido</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          Ingresá la contraseña de administrador para desbloquear las opciones de edición de Full System Guanacaste.
                        </p>
                      </div>

                      <form onSubmit={handleUnlock} className="w-full space-y-3">
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresá la contraseña"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-center text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                            title={showPassword ? "Ocultar" : "Mostrar"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-left flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-red-300 leading-tight">
                              Contraseña incorrecta. Si no recuerdas tu clave, pulsa en <strong>¿Olvidaste tu contraseña?</strong> abajo para recibir un código de seguridad en tu correo.
                            </span>
                          </div>
                        )}
                        <button
                          type="submit"
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98"
                        >
                          Desbloquear Consola
                        </button>
                      </form>

                      {/* Security Options Links */}
                      <div className="w-full pt-4 border-t border-slate-800/80 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRecoveryMode(true);
                            setIsChangingPasswordOnLock(false);
                            setRecoveryCodeSent(false);
                            setRecoveryStatusMessage({ type: "", text: "" });
                          }}
                          className="w-full text-xs text-slate-400 hover:text-emerald-400 font-mono flex items-center justify-center gap-1.5 transition-colors py-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¿Olvidaste tu contraseña? Enviar código a {recoveryEmail}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Editable Tabs & Content Workspace */
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Console Tabs */}
                  <div className="flex border-b border-slate-800 bg-slate-950 px-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
                    {[
                      { id: "logo", label: "Logo" },
                      { id: "hero", label: "Inicio" },
                      { id: "problema", label: "Comparativa" },
                      { id: "funcionamiento", label: "Funcionamiento" },
                      { id: "products", label: "Productos" },
                      { id: "video", label: "Video" },
                      { id: "kit", label: "Kit Inicial" },
                      { id: "contact", label: "Contacto" },
                      { id: "footer", label: "Pie de Página" },
                      { id: "seguridad", label: "🔑 Contraseña" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAdminTab(tab.id as any)}
                        className={`px-3 py-3 border-b-2 font-bold transition-all flex-shrink-0 ${
                          adminTab === tab.id 
                            ? "border-emerald-500 text-emerald-400 bg-slate-900/50" 
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Form Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">

                    {/* BACKUP & CODE PORTABILITY BAR */}
                    <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-3 shadow-inner">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Herramientas de Portabilidad y Respaldo</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Como no necesitas bases de datos complejas para usar este CMS, podés descargar tu configuración actual o copiarla como código de programación directo para tu archivo local.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={handleExportBackup}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all border border-slate-700"
                          title="Descarga un archivo JSON de respaldo"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-400" />
                          <span>Exportar Respaldo (JSON)</span>
                        </button>
                        
                        <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Importar Respaldo</span>
                          <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleImportBackup} 
                            className="hidden" 
                          />
                        </label>

                        <button
                          onClick={handleCopyCode}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all border border-slate-700"
                          title="Copia el objeto DEFAULT_CMS_DATA para reemplazar en App.tsx"
                        >
                          {showCopiedIndicator ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copiar Código Fuente</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* TAB: LOGO */}
                    {adminTab === "logo" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Personalizá la identidad visual de la cabecera del sitio. Podés usar un logotipo en texto o subir una imagen propia (se guardará de forma segura en formato de texto optimizado).
                          </p>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Nombre Comercial del Logo (Texto)</label>
                          <input 
                            type="text"
                            value={tempCmsData.logo?.text || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              logo: { ...tempCmsData.logo, text: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Personalizar Logotipo Visual (Imagen de tu PC o URL)</label>
                          <div className="space-y-2">
                            {/* File Upload Selector */}
                            <div className="flex flex-wrap gap-2 items-center">
                              <button
                                type="button"
                                onClick={() => fileInputLogoRef.current?.click()}
                                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Subir Imagen desde mi PC</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setTempCmsData({
                                  ...tempCmsData,
                                  logo: { ...tempCmsData.logo, imageUrl: fullSystemLogoDefault, height: 74 }
                                })}
                                className="px-2.5 py-1.5 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900 hover:text-white rounded-lg text-[10px] font-semibold text-emerald-400 flex items-center gap-1 cursor-pointer transition-all"
                                title="Restablece el logo vectorial oficial de Full System Costa Rica"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Logo Oficial Full System</span>
                              </button>
                              <input 
                                type="file" 
                                ref={fileInputLogoRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "logo")}
                                className="hidden"
                              />
                              {tempCmsData.logo?.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setTempCmsData({
                                    ...tempCmsData,
                                    logo: { ...tempCmsData.logo, imageUrl: "" }
                                  })}
                                  className="px-2.5 py-1.5 bg-red-950/40 border border-red-900/60 hover:bg-red-900 hover:text-white rounded-lg text-[10px] text-red-400 flex items-center gap-1 cursor-pointer"
                                >
                                  Quitar Imagen (Usar Solo Texto)
                                </button>
                              )}
                            </div>
                            
                            {/* URL alternative input */}
                            <div className="flex gap-2 items-center">
                              <span className="text-[10px] text-slate-500 font-mono">O ingresá una URL de internet:</span>
                              <input 
                                type="text"
                                placeholder="https://ejemplo.com/mi-logo.png"
                                value={tempCmsData.logo?.imageUrl || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  logo: { ...tempCmsData.logo, imageUrl: e.target.value }
                                })}
                                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-[11px] text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                            </div>

                            {/* Preview area with slider */}
                            {tempCmsData.logo?.imageUrl && (
                              <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                                <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 inline-block">
                                  <span className="text-[9px] text-slate-500 font-mono block mb-1">Vista Previa:</span>
                                  <img 
                                    src={resolveLogoImage(tempCmsData.logo.imageUrl)} 
                                    alt="Logo Preview" 
                                    className="w-auto object-contain bg-slate-900 p-1 rounded border border-slate-800" 
                                    style={{ height: `${tempCmsData.logo?.height || 74}px`, maxHeight: "95px" }} 
                                    referrerPolicy="no-referrer" 
                                  />
                                </div>
                                <div className="flex-1 min-w-[180px] space-y-1.5">
                                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold flex justify-between">
                                    <span>Altura del Logo</span>
                                    <span className="text-emerald-400 font-mono">{tempCmsData.logo?.height || 74}px</span>
                                  </label>
                                  <input 
                                    type="range" 
                                    min="30" 
                                    max="140" 
                                    step="2"
                                    value={tempCmsData.logo?.height || 74}
                                    onChange={(e) => setTempCmsData({
                                      ...tempCmsData,
                                      logo: { ...tempCmsData.logo, height: parseInt(e.target.value, 10) }
                                    })}
                                    className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-800"
                                  />
                                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                                    <span>Min (30px)</span>
                                    <button
                                      type="button"
                                      onClick={() => setTempCmsData({
                                        ...tempCmsData,
                                        logo: { ...tempCmsData.logo, height: 74 }
                                      })}
                                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-[8px] rounded border border-slate-700 transition-all"
                                    >
                                      Restaurar (74px)
                                    </button>
                                    <span>Max (140px)</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Menú de Navegación section */}
                        <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-3">
                          <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Enlaces del Menú de Navegación</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Editá las etiquetas de texto del menú que aparecen al lado del logo en la barra de navegación superior.
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-emerald-400 uppercase font-mono font-bold block mb-1">Enlace 1 (Home)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.home || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, home: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 2 (El Problema)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.problema || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, problema: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 3 (¿Cómo Funciona?)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.funcionamiento || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, funcionamiento: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 4 (Portafolio)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.portafolio || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, portafolio: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 5 (Kit Inicial)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.precio || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, precio: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 6 (FAQs)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.faq || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, faq: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Enlace 7 (Administración)</label>
                              <input 
                                type="text"
                                value={tempCmsData.menu?.administracion || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  menu: { ...tempCmsData.menu, administracion: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: HERO */}
                    {adminTab === "hero" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Modificá el gancho principal de atracción de clientes corporativos. Los cambios se actualizan en tiempo real en la página trasera.
                          </p>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Insignia Superior (Badge)</label>
                          <input 
                            type="text"
                            value={tempCmsData.hero.badge}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              hero: { ...tempCmsData.hero, badge: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Titular de Alta Conversión (UVP)</label>
                          <textarea 
                            rows={3}
                            value={tempCmsData.hero.title}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              hero: { ...tempCmsData.hero, title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Subtítulo Descriptivo (Tagline)</label>
                          <textarea 
                            rows={3}
                            value={tempCmsData.hero.subtitle}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              hero: { ...tempCmsData.hero, subtitle: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Texto Botón WhatsApp CTA</label>
                          <input 
                            type="text"
                            value={tempCmsData.hero.ctaPrimary}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              hero: { ...tempCmsData.hero, ctaPrimary: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <h4 className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider">
                            Personalizar Tres Riquadri (Métricas)
                          </h4>
                          
                          {/* Métrica 1 */}
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50 space-y-2">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">1. Riquadro Izquierdo</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricCost || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricCost: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricCostLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricCostLabel: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Métrica 2 */}
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50 space-y-2">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">2. Riquadro Centro</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricDose || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricDose: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricDoseLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricDoseLabel: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Métrica 3 */}
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50 space-y-2">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">3. Riquadro Derecho</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricWaste || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricWaste: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.hero.metricWasteLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, metricWasteLabel: e.target.value }
                                  })}
                                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Space efficiency spec */}
                          <div className="pt-2 border-t border-slate-800/80">
                            <label className="text-[9px] text-emerald-400 uppercase font-mono font-bold block mb-1">
                              Eficiencia de espacio (Caja destacada bajo imagen)
                            </label>
                            <input 
                              type="text"
                              value={tempCmsData.hero.spaceEfficiency || "3 botellas = 15 Galones"}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                hero: { ...tempCmsData.hero, spaceEfficiency: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Imagen del Kit Inicial (Personalizable - Imagen o URL)</label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Ej: https://images.unsplash.com/photo-..."
                                value={tempCmsData.hero.imageUrl}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  hero: { ...tempCmsData.hero, imageUrl: e.target.value }
                                })}
                                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputHeroRef.current?.click()}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-white"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Subir</span>
                              </button>
                              <input 
                                type="file"
                                ref={fileInputHeroRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "hero")}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const sample = prompt("Pegá la URL de cualquier imagen de internet para personalizar el Kit Inicial:");
                                  if (sample) {
                                    setTempCmsData({
                                      ...tempCmsData,
                                      hero: { ...tempCmsData.hero, imageUrl: sample }
                                    });
                                    setCmsData((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, imageUrl: sample }
                                    }));
                                  }
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5"
                              >
                                <Image className="w-3.5 h-3.5" />
                                <span>Pegar URL</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setTempCmsData({
                                    ...tempCmsData,
                                    hero: { ...tempCmsData.hero, imageUrl: heroImageDefault }
                                  });
                                  setCmsData((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, imageUrl: heroImageDefault }
                                  }));
                                }}
                                className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900 text-emerald-400 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                                title="Restablece la foto fotográfica oficial de las botellas Full System"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Foto Original de Fábrica</span>
                              </button>
                            </div>
                            <div className="mt-2 flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-850">
                              <img 
                                src={tempCmsData.hero.imageUrl || heroImageDefault} 
                                alt="Hero preview" 
                                className="h-16 w-24 rounded-lg border border-slate-800 bg-slate-900 object-cover" 
                                referrerPolicy="no-referrer" 
                              />
                              <div className="text-[10px] text-slate-400">
                                <span className="font-semibold text-white block">Vista Previa de Portada</span>
                                <span>Podés subir la foto de tus botellas con tus etiquetas desde tu PC.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: COMPARATIVA / PROBLEMA */}
                    {adminTab === "problema" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-4">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Cabecera de Comparativa</span>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Badge Superior</label>
                            <input 
                              type="text"
                              value={tempCmsData.problemaSection?.sectionBadge || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                problemaSection: { ...tempCmsData.problemaSection, sectionBadge: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Título de la Sección</label>
                            <input 
                              type="text"
                              value={tempCmsData.problemaSection?.title || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                problemaSection: { ...tempCmsData.problemaSection, title: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Subtítulo Descriptivo</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.problemaSection?.subtitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                problemaSection: { ...tempCmsData.problemaSection, subtitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* COLUMNA IZQUIERDA: SIN SYSTEM */}
                        <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl space-y-4">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">Columna: Sin FU-DOSE (Tradicional)</span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Título de Columna</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinTitle || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinTitle: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Subtítulo de Columna</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinSubtitle || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinSubtitle: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                              />
                            </div>
                          </div>

                          {/* Items Sin */}
                          <div className="space-y-3 pt-2">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-red-400 font-mono block">Item 1 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem1Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem1Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-red-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem1Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem1Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-red-400 font-mono block">Item 2 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem2Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem2Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-red-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem2Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem2Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-red-400 font-mono block">Item 3 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem3Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem3Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-red-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem3Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem3Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-red-400 font-mono block">Item 4 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem4Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem4Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-red-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem4Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem4Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-red-400 font-mono block">Item 5 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem5Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem5Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-red-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinItem5Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinItem5Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="text-[8px] text-slate-400 font-mono block mb-1">Financiero Label</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinFinancialLabel || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinFinancialLabel: e.target.value }
                                })}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-slate-400 font-mono block mb-1">Financiero Valor</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.sinFinancialVal || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, sinFinancialVal: e.target.value }
                                })}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        {/* COLUMNA DERECHA: CON FULL SYSTEM */}
                        <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-4">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Columna: Con FULL SYSTEM</span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Título de Columna</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conTitle || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conTitle: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Subtítulo de Columna</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conSubtitle || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conSubtitle: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                              />
                            </div>
                          </div>

                          {/* Items Con */}
                          <div className="space-y-3 pt-2">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-emerald-400 font-mono block">Item 1 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem1Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem1Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-emerald-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem1Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem1Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-emerald-400 font-mono block">Item 2 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem2Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem2Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-emerald-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem2Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem2Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-emerald-400 font-mono block">Item 3 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem3Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem3Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-emerald-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem3Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem3Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-emerald-400 font-mono block">Item 4 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem4Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem4Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-emerald-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem4Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem4Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                              <label className="text-[8px] text-emerald-400 font-mono block">Item 5 (Título & Descripción)</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem5Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem5Title: e.target.value }
                                })}
                                className="w-full bg-transparent border-b border-slate-800 text-xs text-white font-semibold pb-1 mb-1 focus:outline-none focus:border-emerald-500"
                              />
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conItem5Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conItem5Desc: e.target.value }
                                })}
                                className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="text-[8px] text-slate-400 font-mono block mb-1">Ahorro Label</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conSavingsLabel || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conSavingsLabel: e.target.value }
                                })}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-slate-400 font-mono block mb-1">Ahorro Valor</label>
                              <input 
                                type="text"
                                value={tempCmsData.problemaSection?.conSavingsVal || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  problemaSection: { ...tempCmsData.problemaSection, conSavingsVal: e.target.value }
                                })}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: FUNCIONAMIENTO */}
                    {adminTab === "funcionamiento" && (
                      <div className="space-y-6">
                        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Personalizá la sección "Cómo funciona el sistema FU-DOSE" de doble cuello. Podés modificar los textos de cada paso y la foto de portada del video.
                          </p>
                        </div>

                        {/* Cabecera */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Cabecera de la Sección</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Badge Superior</label>
                            <input 
                              type="text"
                              value={tempCmsData.funcionamientoSection?.sectionBadge || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                funcionamientoSection: { ...tempCmsData.funcionamientoSection, sectionBadge: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título Principal</label>
                            <input 
                              type="text"
                              value={tempCmsData.funcionamientoSection?.title || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                funcionamientoSection: { ...tempCmsData.funcionamientoSection, title: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Subtítulo Descriptivo</label>
                            <textarea 
                              rows={3}
                              value={tempCmsData.funcionamientoSection?.subtitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                funcionamientoSection: { ...tempCmsData.funcionamientoSection, subtitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* Pasos de Dosificación */}
                        <div className="space-y-4">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Pasos de Dosificación</span>
                          
                          {/* Paso 1 */}
                          <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl space-y-3">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">PASO 1</span>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Título del Paso</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step1Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step1Title: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Acción (Badge)</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step1ActionText || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step1ActionText: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Descripción</label>
                              <textarea 
                                rows={2}
                                value={tempCmsData.funcionamientoSection?.step1Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step1Desc: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none resize-none"
                              />
                            </div>
                          </div>

                          {/* Paso 2 */}
                          <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl space-y-3">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">PASO 2</span>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Título del Paso</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step2Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step2Title: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Acción (Badge)</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step2ActionText || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step2ActionText: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Descripción</label>
                              <textarea 
                                rows={2}
                                value={tempCmsData.funcionamientoSection?.step2Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step2Desc: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none resize-none"
                              />
                            </div>
                          </div>

                          {/* Paso 3 */}
                          <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl space-y-3">
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">PASO 3</span>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Título del Paso</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step3Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step3Title: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Acción (Badge)</label>
                              <input 
                                type="text"
                                value={tempCmsData.funcionamientoSection?.step3ActionText || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step3ActionText: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-0.5">Descripción</label>
                              <textarea 
                                rows={2}
                                value={tempCmsData.funcionamientoSection?.step3Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  funcionamientoSection: { ...tempCmsData.funcionamientoSection, step3Desc: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Beneficio Logístico */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Beneficio Logístico Radical</span>
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título del Beneficio</label>
                            <input 
                              type="text"
                              value={tempCmsData.funcionamientoSection?.benefitTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                funcionamientoSection: { ...tempCmsData.funcionamientoSection, benefitTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Descripción de Beneficio</label>
                            <textarea 
                              rows={3}
                              value={tempCmsData.funcionamientoSection?.benefitDesc || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                funcionamientoSection: { ...tempCmsData.funcionamientoSection, benefitDesc: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* Video y Foto Demostrativo (La Solución) */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FileVideo className="w-4 h-4" />
                              Video y Portada Demostrativa (La Solución)
                            </span>
                            <button
                              type="button"
                              onClick={() => setAdminTab("video")}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline cursor-pointer"
                            >
                              Ir a pestaña Video &rarr;
                            </button>
                          </div>

                          {/* 1. ARCHIVO DE VIDEO */}
                          <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/70">
                            <label className="text-[10px] text-slate-300 uppercase font-mono font-bold block">
                              1. Archivo de Video Demostrativo (.MP4, .WEBM, .MOV)
                            </label>
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputVideoFuncRef.current?.click()}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all text-white shadow-sm cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Subir Video desde mi PC</span>
                              </button>
                              <input 
                                type="file" 
                                ref={fileInputVideoFuncRef}
                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                onChange={handleVideoFileChange}
                                className="hidden"
                              />

                              <button
                                type="button"
                                onClick={() => handleDownloadVideo()}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all text-white shadow-sm cursor-pointer"
                                title="Descargar el archivo de video actual a tu computadora"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Descargar Video Actual</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleRestoreDefaultVideo}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                                title="Restaurar al video original de fábrica"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Restaurar Fábrica</span>
                              </button>
                            </div>

                            {/* Status info */}
                            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-850 flex items-center justify-between">
                              <span className="truncate max-w-[280px]">
                                {tempCmsData.video?.isLocalUploaded
                                  ? `Archivo local: ${tempCmsData.video.localFileName || "video_personalizado.mp4"} (${tempCmsData.video.localFileSize || "Cargado"})`
                                  : `Enlace activo: ${tempCmsData.video?.embedUrl?.slice(0, 45)}...`}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${tempCmsData.video?.isLocalUploaded ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                                {tempCmsData.video?.isLocalUploaded ? "Guardado en Navegador" : "Enlace Externo"}
                              </span>
                            </div>
                          </div>

                          {/* 2. FOTO DE PORTADA */}
                          <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/70">
                            <label className="text-[10px] text-slate-300 uppercase font-mono font-bold block">
                              2. Foto de Portada (Poster / Miniatura)
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <input 
                                type="text"
                                placeholder="Ej: https://images.unsplash.com/photo-..."
                                value={tempCmsData.video?.posterUrl || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  video: { ...tempCmsData.video, posterUrl: e.target.value }
                                })}
                                className="flex-1 min-w-[200px] px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputVideoPosterRef.current?.click()}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-white cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Subir Foto</span>
                              </button>
                              <input 
                                type="file" 
                                ref={fileInputVideoPosterRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "videoPoster")}
                                className="hidden"
                              />
                              {tempCmsData.video?.posterUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = tempCmsData.video!.posterUrl!;
                                    a.download = "portada_video.jpg";
                                    a.target = "_blank";
                                    a.click();
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                                  title="Descargar imagen de portada actual"
                                >
                                  <Download className="w-3 h-3 text-blue-400" />
                                  <span>Descargar Foto</span>
                                </button>
                              )}
                            </div>
                            {tempCmsData.video?.posterUrl && (
                              <div className="mt-1 flex items-center gap-3">
                                <img src={tempCmsData.video?.posterUrl} alt="Portada preview" className="h-14 w-auto rounded-lg border border-slate-800 bg-slate-950 object-contain" referrerPolicy="no-referrer" />
                                <span className="text-[10px] text-slate-500 italic">Vista previa de la portada del video</span>
                              </div>
                            )}
                          </div>

                            {/* Height slider control */}
                            <div className="mt-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold flex justify-between">
                                <span>Altura del Video / Portada</span>
                                <span className="text-emerald-400 font-mono">{tempCmsData.video?.height || 360}px</span>
                              </label>
                              <input 
                                type="range" 
                                min="200" 
                                max="650" 
                                step="5"
                                value={tempCmsData.video?.height || 360}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  video: { ...tempCmsData.video, height: parseInt(e.target.value, 10) }
                                })}
                                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-800"
                              />
                              <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                                <span>Baja (200px)</span>
                                <button
                                  type="button"
                                  onClick={() => setTempCmsData({
                                    ...tempCmsData,
                                    video: { ...tempCmsData.video, height: 360 }
                                  })}
                                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-[8px] rounded border border-slate-700 transition-all"
                                >
                                  Restaurar original (360px)
                                </button>
                                <span>Alta (650px)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* TAB: PRODUCTS */}
                    {adminTab === "products" && (
                      <div className="space-y-6">
                        {/* Cabecera del Portafolio */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Cabecera de la Sección</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Badge Superior</label>
                            <input 
                              type="text"
                              value={tempCmsData.productsSection?.sectionBadge || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                productsSection: { ...tempCmsData.productsSection, sectionBadge: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título Principal</label>
                            <input 
                              type="text"
                              value={tempCmsData.productsSection?.title || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                productsSection: { ...tempCmsData.productsSection, title: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Subtítulo Descriptivo</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.productsSection?.subtitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                productsSection: { ...tempCmsData.productsSection, subtitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* Speed Full Edit */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">PRODUCTO 01: MULTISUPERFICIES</span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Nombre Comercial</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.speedFull.title}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    speedFull: { ...tempCmsData.products.speedFull, title: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Slogan del Aroma</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.speedFull.aroma}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    speedFull: { ...tempCmsData.products.speedFull, aroma: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 italic"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Descripción de Desempeño</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.products.speedFull.desc}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                products: {
                                  ...tempCmsData.products,
                                  speedFull: { ...tempCmsData.products.speedFull, desc: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Imagen del Producto (Imagen o URL)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="URL de la imagen"
                                value={tempCmsData.products.speedFull.imageUrl}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    speedFull: { ...tempCmsData.products.speedFull, imageUrl: e.target.value }
                                  }
                                })}
                                className="flex-1 px-3 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputSpeedRef.current?.click()}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[10px] font-semibold transition-all text-white flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Subir</span>
                              </button>
                              <input 
                                type="file"
                                ref={fileInputSpeedRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "speedFull")}
                                className="hidden"
                              />
                            </div>
                            {tempCmsData.products.speedFull.imageUrl && (
                              <div className="mt-1.5">
                                <img src={resolveProductImage(tempCmsData.products.speedFull.imageUrl, speedLobbyDefault)} alt="Speed Full Preview" className="h-10 w-auto rounded border border-slate-800 bg-slate-950 object-contain" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dikro Full Edit */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">PRODUCTO 02: REMOVEDOR DE SARRO</span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Nombre Comercial</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.dikroFull.title}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    dikroFull: { ...tempCmsData.products.dikroFull, title: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Frase Impactante de Sarro</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.dikroFull.quote}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    dikroFull: { ...tempCmsData.products.dikroFull, quote: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 italic"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Descripción de Desempeño</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.products.dikroFull.desc}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                products: {
                                  ...tempCmsData.products,
                                  dikroFull: { ...tempCmsData.products.dikroFull, desc: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Imagen del Producto (Imagen o URL)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="URL de la imagen"
                                value={tempCmsData.products.dikroFull.imageUrl}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    dikroFull: { ...tempCmsData.products.dikroFull, imageUrl: e.target.value }
                                  }
                                })}
                                className="flex-1 px-3 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputDikroRef.current?.click()}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[10px] font-semibold transition-all text-white flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Subir</span>
                              </button>
                              <input 
                                type="file"
                                ref={fileInputDikroRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "dikroFull")}
                                className="hidden"
                              />
                            </div>
                            {tempCmsData.products.dikroFull.imageUrl && (
                              <div className="mt-1.5">
                                <img src={resolveProductImage(tempCmsData.products.dikroFull.imageUrl, dikroFixtureDefault)} alt="Dikro Full Preview" className="h-10 w-auto rounded border border-slate-800 bg-slate-950 object-contain" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Nuovopon Edit */}
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">PRODUCTO 03: DESENGRASANTE INDUSTRIAL</span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Nombre Comercial</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.nuovopon.title}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    nuovopon: { ...tempCmsData.products.nuovopon, title: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-1">Frase Desengrase</label>
                              <input 
                                type="text"
                                value={tempCmsData.products.nuovopon.quote}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    nuovopon: { ...tempCmsData.products.nuovopon, quote: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 italic"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Descripción de Desempeño</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.products.nuovopon.desc}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                products: {
                                  ...tempCmsData.products,
                                  nuovopon: { ...tempCmsData.products.nuovopon, desc: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Imagen del Producto (Imagen o URL)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="URL de la imagen"
                                value={tempCmsData.products.nuovopon.imageUrl}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  products: {
                                    ...tempCmsData.products,
                                    nuovopon: { ...tempCmsData.products.nuovopon, imageUrl: e.target.value }
                                  }
                                })}
                                className="flex-1 px-3 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputNuovoponRef.current?.click()}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[10px] font-semibold transition-all text-white flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Subir</span>
                              </button>
                              <input 
                                type="file"
                                ref={fileInputNuovoponRef}
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, "nuovopon")}
                                className="hidden"
                              />
                            </div>
                            {tempCmsData.products.nuovopon.imageUrl && (
                              <div className="mt-1.5">
                                <img src={resolveProductImage(tempCmsData.products.nuovopon.imageUrl, nuovoponKitchenDefault)} alt="Nuovopon Preview" className="h-10 w-auto rounded border border-slate-800 bg-slate-950 object-contain" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: VIDEO */}
                    {adminTab === "video" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Personalizá o cambiá el video demostrativo de Full System. Podés <strong>subir un archivo de video desde tu computadora</strong> (.MP4, .WEBM, .MOV), <strong>descargar el video actual</strong> para editarlo, o ingresar un enlace de YouTube/Vimeo.
                          </p>
                        </div>

                        {/* Video File Quick Actions */}
                        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                            Archivo de Video Demostrativo
                          </span>

                          <div className="flex flex-wrap gap-2.5">
                            <button
                              type="button"
                              onClick={() => fileInputVideoRef.current?.click()}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold flex items-center gap-2 transition-all text-white shadow-sm cursor-pointer"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Subir Video desde mi PC (.MP4, .WEBM)</span>
                            </button>
                            <input 
                              type="file" 
                              ref={fileInputVideoRef}
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              onChange={handleVideoFileChange}
                              className="hidden"
                            />

                            <button
                              type="button"
                              onClick={() => handleDownloadVideo()}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold flex items-center gap-2 transition-all text-white shadow-sm cursor-pointer"
                              title="Descargar el video activo a tu computadora"
                            >
                              <Download className="w-4 h-4" />
                              <span>Descargar Video Actual (.MP4)</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleRestoreDefaultVideo}
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                              title="Restaurar el video de demostración original"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Restaurar Fábrica</span>
                            </button>
                          </div>

                          {/* Status info */}
                          <div className="text-[11px] font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate max-w-[340px]">
                              <FileVideo className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span className="truncate">
                                {tempCmsData.video?.isLocalUploaded
                                  ? `Archivo local: ${tempCmsData.video.localFileName || "video_personalizado.mp4"} (${tempCmsData.video.localFileSize || "Guardado"})`
                                  : `URL: ${tempCmsData.video?.embedUrl?.slice(0, 45)}...`}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${tempCmsData.video?.isLocalUploaded ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                              {tempCmsData.video?.isLocalUploaded ? "Almacenado Localmente" : "Enlace Externo"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Título Superior (Badge)</label>
                          <input 
                            type="text"
                            value={tempCmsData.video?.badge || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              video: { ...tempCmsData.video, badge: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Título del Video</label>
                          <input 
                            type="text"
                            value={tempCmsData.video?.title || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              video: { ...tempCmsData.video, title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">URL o Enlace de Video (YouTube, Vimeo, o MP4)</label>
                          <input 
                            type="text"
                            placeholder="Ej: https://www.youtube.com/watch?v=... o https://assets.mixkit.co/.../video.mp4"
                            value={tempCmsData.video?.embedUrl || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              video: { 
                                ...tempCmsData.video, 
                                embedUrl: e.target.value,
                                isLocalUploaded: false,
                                localFileName: "",
                                localFileSize: ""
                              }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Descripción explicativa del Video</label>
                          <textarea 
                            rows={3}
                            value={tempCmsData.video?.desc || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              video: { ...tempCmsData.video, desc: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        {/* Height slider control */}
                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold flex justify-between">
                            <span>Altura del Video / Portada</span>
                            <span className="text-emerald-400 font-mono">{tempCmsData.video?.height || 360}px</span>
                          </label>
                          <input 
                            type="range" 
                            min="200" 
                            max="650" 
                            step="5"
                            value={tempCmsData.video?.height || 360}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              video: { ...tempCmsData.video, height: parseInt(e.target.value, 10) }
                            })}
                            className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-800"
                          />
                          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                            <span>Baja (200px)</span>
                            <button
                              type="button"
                              onClick={() => setTempCmsData({
                                ...tempCmsData,
                                video: { ...tempCmsData.video, height: 360 }
                              })}
                              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-[8px] rounded border border-slate-700 transition-all cursor-pointer"
                            >
                              Restaurar original (360px)
                            </button>
                            <span>Alta (650px)</span>
                          </div>
                        </div>

                        {/* Video Live Preview inside Admin */}
                        {tempCmsData.video?.embedUrl && (
                          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                              Vista Previa en Vivo del Video
                            </span>
                            <div className="rounded-xl overflow-hidden bg-black border border-slate-800 max-h-[260px] flex items-center justify-center">
                              {isEmbeddableVideo(tempCmsData.video.embedUrl) ? (
                                <iframe 
                                  src={getEmbedUrl(tempCmsData.video.embedUrl)} 
                                  title="Preview"
                                  className="w-full h-52 border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              ) : (
                                <video 
                                  controls 
                                  className="w-full max-h-52 object-contain bg-black"
                                  poster={tempCmsData.video?.posterUrl}
                                  src={tempCmsData.video.embedUrl}
                                >
                                  Tu navegador no soporta video.
                                </video>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: KIT INICIAL */}
                    {adminTab === "kit" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Badge Superior</label>
                          <input 
                            type="text"
                            value={tempCmsData.kit.sectionBadge || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              kit: { ...tempCmsData.kit, sectionBadge: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título de la Sección del Kit</label>
                          <input 
                            type="text"
                            value={tempCmsData.kit.title}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              kit: { ...tempCmsData.kit, title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Subtítulo Contextualizado</label>
                          <textarea 
                            rows={2}
                            value={tempCmsData.kit.subtitle}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              kit: { ...tempCmsData.kit, subtitle: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Textos de la Tarjeta Lateral</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título de Características</label>
                            <input 
                              type="text"
                              value={tempCmsData.kit.featuresTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                kit: { ...tempCmsData.kit, featuresTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Descripción de Características</label>
                            <textarea 
                              rows={2}
                              value={tempCmsData.kit.featuresDesc || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                kit: { ...tempCmsData.kit, featuresDesc: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Logística & Envío</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Título de Logística</label>
                            <input 
                              type="text"
                              value={tempCmsData.kit.logisticsTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                kit: { ...tempCmsData.kit, logisticsTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Descripción de Logística</label>
                            <textarea 
                              rows={3}
                              value={tempCmsData.kit.logisticsDesc || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                kit: { ...tempCmsData.kit, logisticsDesc: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">CARACTERÍSTICAS DEL KIT (5 TARJETAS EDITABLES)</span>
                          
                          <div className="space-y-4">
                            {/* Card 1 */}
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">TARJETA 1</span>
                              <input 
                                type="text"
                                placeholder="Tag (ej: 01 / ENVASE INTELIGENTE)"
                                value={tempCmsData.kit.feature1Tag || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature1Tag: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Título"
                                value={tempCmsData.kit.feature1Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature1Title: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white focus:outline-none font-bold"
                              />
                              <textarea 
                                rows={2}
                                placeholder="Descripción"
                                value={tempCmsData.kit.feature1Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature1Desc: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-300 focus:outline-none resize-none"
                              />
                            </div>

                            {/* Card 2 */}
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">TARJETA 2</span>
                              <input 
                                type="text"
                                placeholder="Tag (ej: 02 / ROTULACIÓN DE LEY)"
                                value={tempCmsData.kit.feature2Tag || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature2Tag: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Título"
                                value={tempCmsData.kit.feature2Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature2Title: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white focus:outline-none font-bold"
                              />
                              <textarea 
                                rows={2}
                                placeholder="Descripción"
                                value={tempCmsData.kit.feature2Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature2Desc: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-300 focus:outline-none resize-none"
                              />
                            </div>

                            {/* Card 3 */}
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">TARJETA 3</span>
                              <input 
                                type="text"
                                placeholder="Tag (ej: 03 / SOPORTE IN SITU)"
                                value={tempCmsData.kit.feature3Tag || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature3Tag: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Título"
                                value={tempCmsData.kit.feature3Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature3Title: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white focus:outline-none font-bold"
                              />
                              <textarea 
                                rows={2}
                                placeholder="Descripción"
                                value={tempCmsData.kit.feature3Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature3Desc: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-300 focus:outline-none resize-none"
                              />
                            </div>

                            {/* Card 4 */}
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">TARJETA 4</span>
                              <input 
                                type="text"
                                placeholder="Tag (ej: 04 / SEGURIDAD AL DÍA)"
                                value={tempCmsData.kit.feature4Tag || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature4Tag: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Título"
                                value={tempCmsData.kit.feature4Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature4Title: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white focus:outline-none font-bold"
                              />
                              <textarea 
                                rows={2}
                                placeholder="Descripción"
                                value={tempCmsData.kit.feature4Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature4Desc: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-300 focus:outline-none resize-none"
                              />
                            </div>

                            {/* Card 5 */}
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">TARJETA 5 (NUEVA)</span>
                              <input 
                                type="text"
                                placeholder="Tag (ej: 05 / PROPUESTA ECO-EFICIENTE)"
                                value={tempCmsData.kit.feature5Tag || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature5Tag: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Título"
                                value={tempCmsData.kit.feature5Title || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature5Title: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white focus:outline-none font-bold"
                              />
                              <textarea 
                                rows={2}
                                placeholder="Descripción"
                                value={tempCmsData.kit.feature5Desc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, feature5Desc: e.target.value }
                                })}
                                className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-300 focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">TARJETA DE PROPUESTA B2B DIRECTA (DERECHA)</span>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Cinta Destacada Superior (Ribbon)</label>
                              <input 
                                type="text"
                                value={tempCmsData.kit.b2bRibbon || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bRibbon: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Badge de la Tarjeta</label>
                              <input 
                                type="text"
                                value={tempCmsData.kit.b2bBadge || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bBadge: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Título Principal</label>
                              <input 
                                type="text"
                                value={tempCmsData.kit.b2bTitle || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bTitle: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Descripción de la Propuesta</label>
                              <textarea 
                                rows={3}
                                value={tempCmsData.kit.b2bDesc || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bDesc: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest col-span-2 block mb-1">Filas del Cuadro Resumen</span>
                              
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 1 Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bEstudioLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bEstudioLabel: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 1 Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bEstudioVal || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bEstudioVal: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-emerald-400 font-bold focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 2 Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bMsdsLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bMsdsLabel: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 2 Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bMsdsVal || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bMsdsVal: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-emerald-400 font-bold focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 3 Etiqueta</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bEntregaLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bEntregaLabel: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Fila 3 Valor</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bEntregaVal || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bEntregaVal: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white font-bold focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Beneficio Operacional</span>
                              
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Etiqueta Sección</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bBeneficioLabel || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bBeneficioLabel: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase block mb-0.5">Texto Beneficio</label>
                                <input 
                                  type="text"
                                  value={tempCmsData.kit.b2bBeneficioVal || ""}
                                  onChange={(e) => setTempCmsData({
                                    ...tempCmsData,
                                    kit: { ...tempCmsData.kit, b2bBeneficioVal: e.target.value }
                                  })}
                                  className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-xs text-white font-bold focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Texto del Botón Principal</label>
                              <input 
                                type="text"
                                value={tempCmsData.kit.b2bButtonText || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bButtonText: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Nota al Pie (Disclaimer)</label>
                              <input 
                                type="text"
                                value={tempCmsData.kit.b2bDisclaimer || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  kit: { ...tempCmsData.kit, b2bDisclaimer: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 italic"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: CONTACT & LOGISTICS */}
                    {adminTab === "contact" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">WhatsApp de Ventas Directo (B2B)</label>
                          <input 
                            type="text"
                            value={tempCmsData.contact.whatsapp}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              contact: { ...tempCmsData.contact, whatsapp: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Correo Electrónico Corporativo</label>
                          <input 
                            type="text"
                            value={tempCmsData.contact.email}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              contact: { ...tempCmsData.contact, email: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Ubicación Física de Operaciones</label>
                          <input 
                            type="text"
                            value={tempCmsData.contact.location}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              contact: { ...tempCmsData.contact, location: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">ÁNGULOS DE LINKTREE</span>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Botón Diagnóstico</label>
                              <input 
                                type="text"
                                value={tempCmsData.contact.linktreeDiag}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  contact: { ...tempCmsData.contact, linktreeDiag: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Botón Catálogo</label>
                              <input 
                                type="text"
                                value={tempCmsData.contact.linktreeCatalog}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  contact: { ...tempCmsData.contact, linktreeCatalog: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Botón Llamada</label>
                              <input 
                                type="text"
                                value={tempCmsData.contact.linktreeCall}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  contact: { ...tempCmsData.contact, linktreeCall: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: FOOTER CONFIG */}
                    {adminTab === "footer" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Descripción de la Empresa (bajo el Logo)</label>
                          <textarea 
                            rows={3}
                            value={tempCmsData.footer?.description || ""}
                            onChange={(e) => setTempCmsData({
                              ...tempCmsData,
                              footer: { ...tempCmsData.footer, description: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                          />
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Columna 1: Navegación</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Título de la Columna</label>
                            <input 
                              type="text"
                              value={tempCmsData.footer?.navTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                footer: { ...tempCmsData.footer, navTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Enlace 1</label>
                              <input 
                                type="text"
                                value={tempCmsData.footer?.navLink1 || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  footer: { ...tempCmsData.footer, navLink1: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Enlace 2</label>
                              <input 
                                type="text"
                                value={tempCmsData.footer?.navLink2 || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  footer: { ...tempCmsData.footer, navLink2: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Enlace 3 (Destacado)</label>
                              <input 
                                type="text"
                                value={tempCmsData.footer?.navLink3 || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  footer: { ...tempCmsData.footer, navLink3: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold font-sans"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-450 uppercase font-mono block mb-1">Enlace 4</label>
                              <input 
                                type="text"
                                value={tempCmsData.footer?.navLink4 || ""}
                                onChange={(e) => setTempCmsData({
                                  ...tempCmsData,
                                  footer: { ...tempCmsData.footer, navLink4: e.target.value }
                                })}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Columna 2: Contacto & Enlaces Útiles</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Título Columna de Contacto</label>
                            <input 
                              type="text"
                              value={tempCmsData.footer?.contactTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                footer: { ...tempCmsData.footer, contactTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Título de Linktree</label>
                            <input 
                              type="text"
                              value={tempCmsData.footer?.linktreeTitle || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                footer: { ...tempCmsData.footer, linktreeTitle: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Franja de Derechos Autorales (Copyright)</span>
                          
                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Texto de Copyright</label>
                            <input 
                              type="text"
                              value={tempCmsData.footer?.copyright || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                footer: { ...tempCmsData.footer, copyright: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-450 uppercase font-mono block mb-1">Etiqueta Ecológica</label>
                            <input 
                              type="text"
                              value={tempCmsData.footer?.ecoLabel || ""}
                              onChange={(e) => setTempCmsData({
                                ...tempCmsData,
                                footer: { ...tempCmsData.footer, ecoLabel: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: SEGURIDAD Y GESTIÓN DE CONTRASEÑA */}
                    {adminTab === "seguridad" && (
                      <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Intro banner */}
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 shadow-inner">
                          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex-shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white font-bold text-sm sm:text-base">Seguridad y Gestión de Acceso</h5>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              Administra tu contraseña de acceso y el correo predeterminado autorizado para recibir claves temporales de recuperación.
                            </p>
                          </div>
                        </div>

                        {/* Current status card */}
                        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                              Estado de la Cuenta de Administrador
                            </span>
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                              Protección Activa
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90">
                              <span className="text-[10px] text-slate-500 font-mono block">Contraseña Actual</span>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-mono font-bold text-white tracking-wider">
                                  {showCurrentPassword ? adminPassword : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="text-slate-400 hover:text-white p-1"
                                  title={showCurrentPassword ? "Ocultar" : "Mostrar"}
                                >
                                  {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90">
                              <span className="text-[10px] text-slate-500 font-mono block">Correo Predeterminado</span>
                              <span className="text-xs font-mono font-bold text-emerald-400 block mt-1 truncate">
                                {recoveryEmail}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Change Password Form (Strictly Requires Old Password) */}
                        <form onSubmit={handleChangePassword} className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Key className="w-4 h-4" />
                              Cambiar Contraseña (Requiere Clave Actual)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Mínimo 4 caracteres</span>
                          </div>

                          <div className="space-y-3.5">
                            <div>
                              <label className="text-[10px] text-amber-400 uppercase font-mono font-bold block mb-1">
                                1. Contraseña Actual (psw vecchia)
                              </label>
                              <div className="relative">
                                <input 
                                  type={showOldPassword ? "text" : "password"}
                                  placeholder="Ingresá la contraseña que utilizas actualmente"
                                  value={oldPasswordInput}
                                  onChange={(e) => setOldPasswordInput(e.target.value)}
                                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowOldPassword(!showOldPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                                  title={showOldPassword ? "Ocultar" : "Mostrar"}
                                >
                                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                                2. Nueva Contraseña
                              </label>
                              <div className="relative">
                                <input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Escribí la nueva contraseña deseada"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                                  title={showPassword ? "Ocultar" : "Mostrar"}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">
                                3. Confirmar Nueva Contraseña
                              </label>
                              <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Repetí exactamente la nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                            </div>
                          </div>

                          {passwordChangeMessage.text && (
                            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                              passwordChangeMessage.type === "success"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/10 text-red-400 border border-red-500/30"
                            }`}>
                              {passwordChangeMessage.type === "success" ? (
                                <Check className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              )}
                              <span>{passwordChangeMessage.text}</span>
                            </div>
                          )}

                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Verificar y Guardar Nueva Contraseña</span>
                            </button>
                          </div>
                        </form>

                        {/* Predetermined Email Configuration Section */}
                        <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              Correo Predeterminado de Recuperación
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Buzón de rescate</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            Si olvidas tu contraseña de acceso, el sistema enviará un código numérico seguro de verificación en segundo plano a esta dirección de correo para restablecer el acceso:
                          </p>

                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                              Dirección de Correo Electrónico
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input 
                                type="email"
                                placeholder="ejemplo: admin@fullsystem.com"
                                defaultValue={recoveryEmail}
                                onChange={(e) => setTempRecoveryEmail(e.target.value)}
                                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRecoveryEmail(tempRecoveryEmail || recoveryEmail)}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                              >
                                <Save className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Guardar Correo</span>
                              </button>
                            </div>
                          </div>

                          {recoveryEmailSavedMessage && (
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                              <Check className="w-4 h-4 flex-shrink-0" />
                              <span>{recoveryEmailSavedMessage}</span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[11px] text-slate-400">
                              ¿Quieres comprobar la recepción en tu buzón ({recoveryEmail})?
                            </span>
                            <button
                              type="button"
                              disabled={recoveryLoading}
                              onClick={handleSendDirectRecoveryEmail}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-xs font-mono border border-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{recoveryLoading ? "Enviando..." : "Enviar Código de Prueba al Correo"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Test immediate lock card */}
                        <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h6 className="text-white text-xs font-bold flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              Bloquear la Consola
                            </h6>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Bloqueá la consola para comprobar el inicio de sesión o la recuperación por correo.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsLocked(true);
                              setPasswordInput("");
                            }}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700 self-start sm:self-auto"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Bloquear Consola</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Save / Reset Actions bottom block */}
                  <div className="p-6 border-t border-slate-800 bg-slate-950 flex gap-4">
                    <button
                      onClick={handleResetCMS}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-xs sm:text-sm text-slate-300 font-semibold transition-all border border-slate-700/80 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restaurar Fábrica</span>
                    </button>
                    <button
                      onClick={handleSaveCMS}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs sm:text-sm text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
