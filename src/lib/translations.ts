export const translations = {
  // Navigation
  nav: {
    features: { fr: "Fonctionnalités", ar: "المميزات" },
    pricing: { fr: "Tarifs", ar: "الأسعار" },
    faq: { fr: "FAQ", ar: "الأسئلة الشائعة" },
    contact: { fr: "Contact", ar: "اتصل بنا" },
    login: { fr: "Connexion", ar: "تسجيل الدخول" },
    dashboard: { fr: "Tableau de bord", ar: "لوحة التحكم" },
    orders: { fr: "Commandes", ar: "الطلبات" },
    settings: { fr: "Paramètres", ar: "الإعدادات" },
    logout: { fr: "Déconnexion", ar: "تسجيل الخروج" },
    requestAccount: { fr: "Demander un compte", ar: "طلب حساب" },
  },

  // Hero
  hero: {
    title: {
      fr: "Réduisez les retours de commandes avec la confirmation automatique WhatsApp",
      ar: "قلّل المرتجعات وأكد الطلبات تلقائياً عبر واتساب",
    },
    subtitle: {
      fr: "Une plateforme intelligente qui aide les e-commerçants algériens à confirmer les commandes avant expédition et à réduire les annulations et les retours.",
      ar: "منصة ذكية تساعد التجار الجزائريين على تأكيد الطلبات قبل الشحن وتقليل الإلغاءات والمرتجعات.",
    },
    cta1: { fr: "Demander un compte", ar: "طلب حساب" },
    cta2: { fr: "Connexion", ar: "تسجيل الدخول" },
  },

  // Features
  features: {
    title: { fr: "Fonctionnalités", ar: "المميزات" },
    subtitle: {
      fr: "Tout ce dont vous avez besoin pour réduire les retours et augmenter vos ventes.",
      ar: "كل ما تحتاجه لتقليل المرتجعات وزيادة مبيعاتك.",
    },
    items: [
      {
        title: { fr: "Confirmation WhatsApp", ar: "تأكيد عبر واتساب" },
        desc: {
          fr: "Envoyez automatiquement des messages de confirmation à vos clients via WhatsApp.",
          ar: "أرسل رسائل تأكيد تلقائية لعملائك عبر واتساب.",
        },
      },
      {
        title: { fr: "Suivi Automatique", ar: "متابعة تلقائية" },
        desc: {
          fr: "Relances automatiques pour les clients qui n'ont pas encore répondu.",
          ar: "تذكير تلقائي للعملاء الذين لم يردوا بعد.",
        },
      },
      {
        title: { fr: "Réduction des Coûts", ar: "تقليل التكاليف" },
        desc: {
          fr: "Évitez les frais de livraison inutiles en confirmant les commandes avant expédition.",
          ar: "تجنب رسوم التوصيل غير الضرورية بتأكيد الطلبات قبل الشحن.",
        },
      },
      {
        title: { fr: "Tableau de Bord", ar: "لوحة تحكم" },
        desc: {
          fr: "Suivez vos performances avec des statistiques détaillées et des graphiques.",
          ar: "تابع أدائك مع إحصائيات مفصلة ورسوم بيانية.",
        },
      },
      {
        title: { fr: "Export Livreurs", ar: "تصدير لشركات التوصيل" },
        desc: {
          fr: "Exportez les commandes confirmées vers Yalidine, ZR Express, Ecotrans et Noest.",
          ar: "صدّر الطلبات المؤكدة إلى ياليدين و ZR Express و Ecotrans و Noest.",
        },
      },
      {
        title: { fr: "Support Arabe", ar: "دعم اللغة العربية" },
        desc: {
          fr: "Interface disponible en français et en arabe pour une expérience optimale.",
          ar: "الواجهة متوفرة بالفرنسية والعربية لتجربة مثالية.",
        },
      },
    ],
  },

  // How It Works
  howItWorks: {
    title: { fr: "Comment ça marche", ar: "كيف يعمل" },
    subtitle: {
      fr: "Configurez en quelques minutes et commencez à réduire vos retours.",
      ar: "قم بالإعداد في دقائق وابدأ في تقليل مرتجعاتك.",
    },
    steps: [
      {
        title: { fr: "Créez une commande", ar: "أنشئ طلباً" },
        desc: {
          fr: "Ajoutez les informations du client et du produit dans votre tableau de bord.",
          ar: "أضف معلومات العميل والمنتج في لوحة التحكم.",
        },
      },
      {
        title: { fr: "WhatsApp automatique", ar: "واتساب تلقائي" },
        desc: {
          fr: "Le client reçoit un message WhatsApp de confirmation automatique.",
          ar: "يتلقى العميل رسالة واتساب تأكيد تلقائية.",
        },
      },
      {
        title: { fr: "Le client répond", ar: "العميل يرد" },
        desc: {
          fr: "Le client confirme ou annule la commande en répondant 1 ou 2.",
          ar: "يؤكد العميل أو يلغي الطلب بالرد برقم 1 أو 2.",
        },
      },
      {
        title: { fr: "Statut mis à jour", ar: "تحديث الحالة" },
        desc: {
          fr: "Le statut de la commande est automatiquement mis à jour en temps réel.",
          ar: "يتم تحديث حالة الطلب تلقائياً في الوقت الفعلي.",
        },
      },
    ],
  },

  // Pricing
  pricing: {
    title: { fr: "Tarifs", ar: "الأسعار" },
    subtitle: {
      fr: "Choisissez le plan qui correspond à votre volume de commandes.",
      ar: "اختر الخطة التي تناسب حجم طلباتك.",
    },
    starter: {
      name: { fr: "Démarrage", ar: "البداية" },
      price: "3 500",
      orders: { fr: "Jusqu'à 100 commandes/mois", ar: "حتى 100 طلب/شهر" },
      features: [
        { fr: "Confirmation WhatsApp", ar: "تأكيد عبر واتساب" },
        { fr: "Tableau de bord", ar: "لوحة التحكم" },
        { fr: "Support email", ar: "دعم عبر البريد" },
      ],
    },
    professional: {
      name: { fr: "Professionnel", ar: "احترافي" },
      price: "7 000",
      orders: { fr: "Jusqu'à 500 commandes/mois", ar: "حتى 500 طلب/شهر" },
      features: [
        { fr: "Tout du plan Démarrage", ar: "كل شيء في خطة البداية" },
        { fr: "Relances automatiques", ar: "تذكير تلقائي" },
        { fr: "Export livreurs", ar: "تصدير لشركات التوصيل" },
        { fr: "Support prioritaire", ar: "دعم ذو أولوية" },
      ],
    },
    enterprise: {
      name: { fr: "Entreprise", ar: "مؤسسة" },
      price: "15 000",
      orders: { fr: "Commandes illimitées", ar: "طلبات غير محدودة" },
      features: [
        { fr: "Tout du plan Professionnel", ar: "كل شيء في خطة الاحترافي" },
        { fr: "API personnalisée", ar: "API مخصصة" },
        { fr: "Multi-utilisateurs", ar: "مستخدمين متعددين" },
        { fr: "Support dédié", ar: "دعم مخصص" },
      ],
    },
    cta: { fr: "Commencer", ar: "ابدأ الآن" },
    popular: { fr: "Populaire", ar: "الأكثر طلباً" },
  },

  // FAQ
  faq: {
    title: { fr: "Questions fréquentes", ar: "الأسئلة الشائعة" },
    items: [
      {
        q: {
          fr: "Comment fonctionne la confirmation WhatsApp ?",
          ar: "كيف يعمل تأكيد واتساب؟",
        },
        a: {
          fr: "Lorsque vous créez une commande, notre système envoie automatiquement un message WhatsApp au client. Il lui suffit de répondre 1 pour confirmer ou 2 pour annuler.",
          ar: "عند إنشاء طلب، يرسل نظامنا تلقائياً رسالة واتساب للعميل. كل ما عليه فعله هو الرد برقم 1 للتأكيد أو 2 للإلغاء.",
        },
      },
      {
        q: {
          fr: "Puis-je connecter ma société de livraison ?",
          ar: "هل يمكنني ربط شركة التوصيل الخاصة بي؟",
        },
        a: {
          fr: "Oui, nous supportons l'export CSV vers Yalidine, ZR Express, Ecotrans et Noest. Vous pouvez exporter les commandes confirmées en un clic.",
          ar: "نعم، ندعم تصدير CSV إلى ياليدين و ZR Express و Ecotrans و Noest. يمكنك تصدير الطلبات المؤكدة بنقرة واحدة.",
        },
      },
      {
        q: {
          fr: "Est-ce que ça fonctionne pour les commandes COD ?",
          ar: "هل يعمل هذا مع الطلبات عند الدفع عند الاستلام؟",
        },
        a: {
          fr: "Absolument ! C'est même l'utilisation principale. La confirmation WhatsApp réduit considérablement les retours COD.",
          ar: "بالتأكيد! هذا هو الاستخدام الرئيسي. تأكيد واتساب يقلل بشكل كبير من مرتجعات الدفع عند الاستلام.",
        },
      },
      {
        q: {
          fr: "Puis-je l'utiliser depuis mon téléphone ?",
          ar: "هل يمكنني استخدامه من هاتفي؟",
        },
        a: {
          fr: "Oui, notre plateforme est entièrement responsive et fonctionne parfaitement sur mobile et tablette.",
          ar: "نعم، منصتنا متجاوبة بالكامل وتعمل بشكل ممتاز على الهاتف والجهاز اللوحي.",
        },
      },
    ],
  },

  // Contact
  contact: {
    title: { fr: "Contactez-nous", ar: "اتصل بنا" },
    subtitle: {
      fr: "Une question ? Notre équipe est là pour vous aider.",
      ar: "لديك سؤال؟ فريقنا هنا لمساعدتك.",
    },
    name: { fr: "Nom complet", ar: "الاسم الكامل" },
    phone: { fr: "Numéro de téléphone", ar: "رقم الهاتف" },
    store: { fr: "Nom du magasin", ar: "اسم المتجر" },
    message: { fr: "Message", ar: "الرسالة" },
    submit: { fr: "Envoyer", ar: "إرسال" },
    success: {
      fr: "Message envoyé avec succès !",
      ar: "تم إرسال الرسالة بنجاح!",
    },
  },

  // Request Account
  requestAccount: {
    title: { fr: "Demander un compte", ar: "طلب حساب" },
    subtitle: {
      fr: "Remplissez le formulaire ci-dessous pour créer votre compte professionnel.",
      ar: "املأ النموذج أدناه لإنشاء حسابك المهني.",
    },
    name: { fr: "Nom complet", ar: "الاسم الكامل" },
    phone: { fr: "Numéro WhatsApp", ar: "رقم واتساب" },
    store: { fr: "Nom du magasin", ar: "اسم المتجر" },
    wilaya: { fr: "Wilaya", ar: "الولاية" },
    monthlyOrders: { fr: "Volume de commandes mensuel", ar: "حجم الطلبات الشهرية" },
    submit: { fr: "Envoyer la demande", ar: "إرسال الطلب" },
    success: {
      fr: "Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.",
      ar: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً.",
    },
    selectWilaya: { fr: "Sélectionnez votre wilaya", ar: "اختر ولايتك" },
  },

  // Login
  login: {
    title: { fr: "Connexion", ar: "تسجيل الدخول" },
    subtitle: {
      fr: "Connectez-vous à votre tableau de bord",
      ar: "سجل الدخول إلى لوحة التحكم",
    },
    email: { fr: "Email", ar: "البريد الإلكتروني" },
    password: { fr: "Mot de passe", ar: "كلمة المرور" },
    submit: { fr: "Se connecter", ar: "تسجيل الدخول" },
    forgot: { fr: "Mot de passe oublié ?", ar: "نسيت كلمة المرور؟" },
    noAccount: {
      fr: "Vous n'avez pas de compte ?",
      ar: "ليس لديك حساب؟",
    },
    requestOne: { fr: "Demander un compte", ar: "طلب حساب" },
  },

  // Dashboard
  dashboard: {
    title: { fr: "Tableau de bord", ar: "لوحة التحكم" },
    totalOrders: { fr: "Total commandes", ar: "إجمالي الطلبات" },
    confirmedOrders: { fr: "Commandes confirmées", ar: "الطلبات المؤكدة" },
    cancelledOrders: { fr: "Commandes annulées", ar: "الطلبات الملغية" },
    noResponse: { fr: "Sans réponse", ar: "بدون رد" },
    pendingOrders: { fr: "En attente", ar: "قيد الانتظار" },
    confirmationRate: { fr: "Taux de confirmation", ar: "معدل التأكيد" },
    revenue: { fr: "Revenu généré", ar: "الإيرادات المحققة" },
    deliverySavings: { fr: "Économies livraison", ar: "توفير التوصيل" },
    recentOrders: { fr: "Commandes récentes", ar: "الطلبات الأخيرة" },
    quickActions: { fr: "Actions rapides", ar: "إجراءات سريعة" },
    addOrder: { fr: "Ajouter commande", ar: "إضافة طلب" },
    viewReports: { fr: "Voir rapports", ar: "عرض التقارير" },
    ordersByDay: { fr: "Commandes par jour", ar: "الطلبات حسب اليوم" },
    statusDistribution: { fr: "Répartition des statuts", ar: "توزيع الحالات" },
    wilayaPerformance: { fr: "Performance par wilaya", ar: "الأداء حسب الولاية" },
    weeklyPerformance: { fr: "Performance hebdomadaire", ar: "الأداء الأسبوعي" },
  },

  // Orders
  orders: {
    title: { fr: "Commandes", ar: "الطلبات" },
    addOrder: { fr: "Ajouter une commande", ar: "إضافة طلب" },
    editOrder: { fr: "Modifier la commande", ar: "تعديل الطلب" },
    deleteOrder: { fr: "Supprimer la commande", ar: "حذف الطلب" },
    orderId: { fr: "ID commande", ar: "رقم الطلب" },
    customerName: { fr: "Client", ar: "العميل" },
    phone: { fr: "Téléphone", ar: "الهاتف" },
    product: { fr: "Produit", ar: "المنتج" },
    price: { fr: "Prix", ar: "السعر" },
    wilaya: { fr: "Wilaya", ar: "الولاية" },
    date: { fr: "Date", ar: "التاريخ" },
    status: { fr: "Statut", ar: "الحالة" },
    notes: { fr: "Notes", ar: "ملاحظات" },
    actions: { fr: "Actions", ar: "الإجراءات" },
    search: { fr: "Rechercher...", ar: "بحث..." },
    export: { fr: "Exporter", ar: "تصدير" },
    bulkConfirm: { fr: "Confirmer", ar: "تأكيد" },
    bulkCancel: { fr: "Annuler", ar: "إلغاء" },
    filterStatus: { fr: "Filtrer par statut", ar: "تصفية حسب الحالة" },
    filterWilaya: { fr: "Filtrer par wilaya", ar: "تصفية حسب الولاية" },
    allStatuses: { fr: "Tous les statuts", ar: "جميع الحالات" },
    allWilayas: { fr: "Toutes les wilayas", ar: "جميع الولايات" },
    confirmDelete: {
      fr: "Êtes-vous sûr de vouloir supprimer cette commande ?",
      ar: "هل أنت متأكد من حذف هذا الطلب؟",
    },
    noOrders: { fr: "Aucune commande trouvée", ar: "لم يتم العثور على طلبات" },
    commune: { fr: "Commune", ar: "البلدية" },
    save: { fr: "Enregistrer", ar: "حفظ" },
    cancel: { fr: "Annuler", ar: "إلغاء" },
    success: {
      fr: "Commande créée avec succès !",
      ar: "تم إنشاء الطلب بنجاح!",
    },
    updated: {
      fr: "Commande mise à jour avec succès !",
      ar: "تم تحديث الطلب بنجاح!",
    },
    deleted: {
      fr: "Commande supprimée avec succès !",
      ar: "تم حذف الطلب بنجاح!",
    },
  },

  // Order Details
  orderDetails: {
    title: { fr: "Détails de la commande", ar: "تفاصيل الطلب" },
    customerInfo: { fr: "Informations client", ar: "معلومات العميل" },
    productInfo: { fr: "Informations produit", ar: "معلومات المنتج" },
    orderStatus: { fr: "Statut de la commande", ar: "حالة الطلب" },
    activityTimeline: { fr: "Chronologie des activités", ar: "الجدول الزمني للنشاط" },
    back: { fr: "Retour aux commandes", ar: "العودة إلى الطلبات" },
    markConfirmed: { fr: "Marquer confirmée", ar: "تأكيد الطلب" },
    markCancelled: { fr: "Marquer annulée", ar: "إلغاء الطلب" },
    sendMessage: { fr: "Envoyer message WhatsApp", ar: "إرسال رسالة واتساب" },
  },

  // Settings
  settings: {
    title: { fr: "Paramètres", ar: "الإعدادات" },
    general: { fr: "Paramètres généraux", ar: "الإعدادات العامة" },
    storeName: { fr: "Nom du magasin", ar: "اسم المتجر" },
    wilaya: { fr: "Wilaya", ar: "الولاية" },
    language: { fr: "Langue", ar: "اللغة" },
    fr: { fr: "Français", ar: "الفرنسية" },
    ar: { fr: "Arabe", ar: "العربية" },
    whatsapp: { fr: "Paramètres WhatsApp", ar: "إعدادات واتساب" },
    whatsappNumber: { fr: "Numéro WhatsApp", ar: "رقم واتساب" },
    apiKey: { fr: "Clé API", ar: "مفتاح API" },
    webhookUrl: { fr: "URL Webhook", ar: "رابط Webhook" },
    testMode: { fr: "Mode test", ar: "وضع الاختبار" },
    templates: { fr: "Modèles de messages", ar: "قوالب الرسائل" },
    confirmationMsg: { fr: "Message de confirmation", ar: "رسالة التأكيد" },
    cancellationMsg: { fr: "Message d'annulation", ar: "رسالة الإلغاء" },
    reminderMsg: { fr: "Message de rappel", ar: "رسالة التذكير" },
    followUpMsg: { fr: "Message de suivi", ar: "رسالة المتابعة" },
    users: { fr: "Gestion des utilisateurs", ar: "إدارة المستخدمين" },
    addUser: { fr: "Ajouter un utilisateur", ar: "إضافة مستخدم" },
    security: { fr: "Sécurité", ar: "الأمان" },
    changePassword: { fr: "Changer le mot de passe", ar: "تغيير كلمة المرور" },
    twoFactor: { fr: "Authentification à deux facteurs", ar: "المصادقة الثنائية" },
    save: { fr: "Enregistrer", ar: "حفظ" },
    saved: { fr: "Paramètres enregistrés !", ar: "تم حفظ الإعدادات!" },
  },

  // Admin
  admin: {
    title: { fr: "Administration", ar: "الإدارة" },
    merchants: { fr: "Commerçants", ar: "التجار" },
    totalMerchants: { fr: "Total commerçants", ar: "إجمالي التجار" },
    totalOrders: { fr: "Total commandes", ar: "إجمالي الطلبات" },
    monthlyRevenue: { fr: "Revenu mensuel", ar: "الإيرادات الشهرية" },
    accountRequests: { fr: "Demandes de compte", ar: "طلبات الحساب" },
    pending: { fr: "En attente", ar: "قيد الانتظار" },
    approved: { fr: "Approuvé", ar: "مقبول" },
    rejected: { fr: "Rejeté", ar: "مرفوض" },
    approve: { fr: "Approuver", ar: "قبول" },
    reject: { fr: "Rejeter", ar: "رفض" },
    viewDetails: { fr: "Voir détails", ar: "عرض التفاصيل" },
    createMerchant: { fr: "Créer un compte", ar: "إنشاء حساب" },
    activate: { fr: "Activer", ar: "تفعيل" },
    deactivate: { fr: "Désactiver", ar: "إلغاء التفعيل" },
    subscription: { fr: "Abonnement", ar: "الاشتراك" },
    noRequests: { fr: "Aucune demande en attente", ar: "لا توجد طلبات معلقة" },
    customers: { fr: "Clients", ar: "العملاء" },
    totalCustomers: { fr: "Total clients", ar: "إجمالي العملاء" },
    deleteCustomer: { fr: "Supprimer le client", ar: "حذف العميل" },
    deleteCustomerConfirm: {
      fr: "Êtes-vous sûr de vouloir supprimer ce client ?",
      ar: "هل أنت متأكد من حذف هذا العميل؟",
    },
    deleteWarning: {
      fr: "Cette action ne peut pas être annulée.",
      ar: "لا يمكن التراجع عن هذا الإجراء.",
    },
    deleteSuccess: {
      fr: "Client supprimé avec succès !",
      ar: "تم حذف العميل بنجاح!",
    },
    deleteError: {
      fr: "Une erreur est survenue lors de la suppression.",
      ar: "حدث خطأ أثناء الحذف.",
    },
    customerName: { fr: "Nom du client", ar: "اسم العميل" },
    customerStore: { fr: "Magasin", ar: "المتجر" },
    customerWhatsapp: { fr: "WhatsApp", ar: "واتساب" },
    customerStatus: { fr: "Statut", ar: "الحالة" },
    noCustomers: { fr: "Aucun client trouvé", ar: "لم يتم العثور على عملاء" },
    active: { fr: "Actif", ar: "نشط" },
    inactive: { fr: "Inactif", ar: "غير نشط" },
  },

  // Common
  common: {
    loading: { fr: "Chargement...", ar: "جارٍ التحميل..." },
    error: { fr: "Une erreur est survenue", ar: "حدث خطأ" },
    retry: { fr: "Réessayer", ar: "إعادة المحاولة" },
    noData: { fr: "Aucune donnée", ar: "لا توجد بيانات" },
    search: { fr: "Rechercher", ar: "بحث" },
    filter: { fr: "Filtrer", ar: "تصفية" },
    all: { fr: "Tout", ar: "الكل" },
    export: { fr: "Exporter", ar: "تصدير" },
    import: { fr: "Importer", ar: "استيراد" },
    save: { fr: "Enregistrer", ar: "حفظ" },
    cancel: { fr: "Annuler", ar: "إلغاء" },
    delete: { fr: "Supprimer", ar: "حذف" },
    edit: { fr: "Modifier", ar: "تعديل" },
    view: { fr: "Voir", ar: "عرض" },
    close: { fr: "Fermer", ar: "إغلاق" },
    confirm: { fr: "Confirmer", ar: "تأكيد" },
    success: { fr: "Succès", ar: "نجاح" },
    da: { fr: "DA", ar: "دج" },
  },
};

export type TranslationKey = keyof typeof translations;
