/**
 * Dummy Data & Images Extract from Stitch UI Components
 * This file contains all extracted data from HTML UI files
 * Organized by component and data type
 */

export const dummyData = {
  // ==================== NAVIGATION & BRANDING ====================
  branding: {
    clinicalAtelier: {
      name: "Clinical Atelier",
      tagline: "Precise care, tailored for your lifestyle",
      description: "Access your curated pharmacy experience. Secure, HIPAA-compliant, and designed for clinical excellence.",
      subtitle: "Licensed Pharmaceutical Practice"
    },
    weshopify: {
      name: "Weshopify",
      tagline: "The Clinical Atelier",
      description: "A specialized selection of evidence-based pharmacological solutions, curated for safety and efficacy by our resident clinical atelier."
    }
  },

  navigation: {
    mainMenu: [
      { label: "Heart Health", href: "#" },
      { label: "Mental Wellness", href: "#" },
      { label: "Nutrition", href: "#" },
      { label: "Expert Advice", href: "#", active: true },
      { label: "Pharmacy", href: "#" }
    ],
    shopMenu: [
      { label: "Orders", href: "#" },
      { label: "AI Assistant", href: "#" },
      { label: "Dashboard", href: "#" },
      { label: "Reviews", href: "#" }
    ],
    prescriptions: [
      { label: "Prescriptions", href: "#" },
      { label: "Wellness", href: "#" },
      { label: "Pharmacy", href: "#" },
      { label: "Deals", href: "#" }
    ],
    adminMenu: [
      { label: "Overview", href: "#", icon: "dashboard", active: true },
      { label: "Products", href: "#", icon: "inventory_2" },
      { label: "Categories", href: "#", icon: "category" },
      { label: "Orders", href: "#", icon: "receipt_long" },
      { label: "Analytics", href: "#", icon: "analytics" },
      { label: "Settings", href: "#", icon: "settings" }
    ],
    doctorMenu: [
      { label: "Dashboard", href: "#", icon: "dashboard", active: true },
      { label: "Patients", href: "#" },
      { label: "Analytics", href: "#" }
    ],
    sidebarCategories: [
      { label: "All Medicines", href: "#", icon: "medical_services", active: true },
      { label: "Wellness", href: "#", icon: "spa" },
      { label: "Personal Care", href: "#", icon: "person" },
      { label: "Baby Care", href: "#", icon: "child_care" },
      { label: "Health Devices", href: "#", icon: "monitor_heart" }
    ]
  },

  // ==================== PRODUCTS ====================
  products: {
    featured: [
      {
        id: 1,
        name: "Atorvastatin Calcium",
        category: "Cardiovascular",
        price: 24.50,
        currency: "USD",
        description: "Used alongside a healthy diet to help lower 'bad' cholesterol and fats.",
        dosage: "40mg",
        quantity: "30 Tablets",
        prescriptionRequired: true,
        rating: 4.8,
        verified: true
      },
      {
        id: 2,
        name: "Omeprazole Magnesium",
        category: "Gastrointestinal",
        price: 18.25,
        currency: "USD",
        description: "Effective relief for frequent heartburn and acid reflux symptoms.",
        dosage: "20mg",
        quantity: "28 Tablets",
        prescriptionRequired: false,
        rating: 4.9,
        verified: true
      },
      {
        id: 3,
        name: "Amoxicillin Forte",
        category: "Antibacterial",
        price: 32.00,
        currency: "USD",
        description: "Broad-spectrum penicillin antibiotic for systemic bacterial infections.",
        dosage: "500mg",
        quantity: "21 Capsules",
        prescriptionRequired: true,
        rating: 4.7,
        verified: true
      }
    ],

    cartItems: [
      {
        id: 1,
        name: "Atorvastatin",
        category: "Cholesterol Management",
        price: 24.00,
        currency: "USD",
        dosage: "40mg",
        quantity: 1,
        totalQuantity: "30 Tablets",
        prescriptionRequired: true,
        badge: "Prescription Required"
      },
      {
        id: 2,
        name: "Omega Complex",
        category: "High-Potency EPA/DHA",
        price: 38.50,
        currency: "USD",
        dosage: "1000mg",
        quantity: 2,
        totalQuantity: "60 Softgels",
        prescriptionRequired: false,
        badge: "Wellness Supplement"
      }
    ],

    relatedProducts: [
      {
        id: 1,
        name: "Vitamin D3 Gold",
        category: "Immune Support",
        price: 19.00,
        currency: "USD"
      },
      {
        id: 2,
        name: "Smart Case Pro",
        category: "Organizer",
        price: 15.00,
        currency: "USD"
      }
    ]
  },

  // ==================== ARTICLES & RESEARCH ====================
  articles: {
    featured: {
      id: 1,
      title: "The Future of Precision Medicine in Cardiac Care",
      description: "Exploring how clinical genomics and personalized lifestyle data are reshaping our approach to cardiovascular health and long-term wellness.",
      author: "Dr. Helena Vance",
      authorRole: "Chief Medical Officer, Clinical Atelier",
      readTime: "12 min read",
      badge: "Featured Research",
      verified: true,
      link: "#"
    },

    latestResearch: [
      {
        id: 1,
        title: "Advancements in Rapid Antigen Stability Testing",
        category: "Pharmacology",
        description: "New protocols for maintaining protein integrity during transport in variable climate conditions...",
        date: "June 24, 2024",
        readTime: "8 Min Read",
        verified: true,
        badge: "Verified Research"
      },
      {
        id: 2,
        title: "The Gut-Brain Axis: Emerging Clinical Evidence",
        category: "Bio-Tech",
        description: "How microbiome diversity directly correlates with cognitive neurotransmitter synthesis and mood regulation.",
        date: "June 20, 2024",
        readTime: "15 Min Read",
        verified: true,
        badge: "Verified Research"
      },
      {
        id: 3,
        title: "Managing Cortisol Through Targeted Nutrition",
        category: "Endocrinology",
        description: "Clinical studies show specific amino acid combinations can significantly dampen adrenal stress responses.",
        date: "June 18, 2024",
        readTime: "10 Min Read",
        verified: true,
        badge: "Verified Research"
      }
    ]
  },

  // ==================== LIFESTYLE GUIDES ====================
  lifestyleGuides: [
    {
      id: 1,
      title: "The Circadian Blueprint: Optimizing Sleep Hygiene",
      category: "Holistic Foundations",
      description: "How light temperature and thermal regulation determine your cellular recovery cycles.",
      link: "Start Guide"
    },
    {
      id: 2,
      title: "Anti-Inflammatory Kitchen Staples",
      category: "Nutrition",
      description: "The essential pantry audit for long-term metabolic health and lowered systemic inflammation."
    },
    {
      id: 3,
      title: "Mental Resilience",
      category: "Mental Resilience",
      description: "Micro-practices for cognitive decompression in high-stress clinical environments."
    },
    {
      id: 4,
      title: "Longevity Protocols",
      category: "Fitness",
      description: "High-intensity intervals vs. steady-state: What the latest longevity data suggests."
    }
  ],

  // ==================== AUTHENTICATION FORMS ====================
  forms: {
    loginForm: {
      fields: [
        {
          id: "email",
          label: "Email Address",
          type: "email",
          placeholder: "name@example.com",
          required: true
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          placeholder: "••••••••",
          required: true,
          forgotLink: "Forgot Password?"
        }
      ],
      remember: "Remember me on this device",
      submitButton: "Sign In",
      divider: "Or continue with",
      socialOptions: [
        { name: "Google", icon: "google" },
        { name: "Apple", icon: "apple" }
      ],
      signup: "New to Clinical Atelier?",
      signupLink: "Create an account",
      policyLinks: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "HIPAA Standards", href: "#" }
      ]
    },

    newsletterForm: {
      icon: "biotech",
      title: "Stay informed with Clinical Atelier",
      description: "Bi-weekly clinical digests, expert roundtables, and the latest in pharmaceutical innovations delivered directly to your inbox.",
      placeholder: "professional@medical.com",
      button: "Join Hub",
      disclaimer: "We respect your privacy. No marketing, only science."
    },

    searchForm: {
      placeholder: "Search curated catalog...",
      placeholderRecords: "Search medical records..."
    }
  },

  // ==================== DASHBOARD METRICS ====================
  metrics: {
    adminDashboard: {
      totalSalesDaily: {
        label: "Total Sales (Daily)",
        value: "$14,280.00",
        change: "+12.5%",
        icon: "payments"
      },
      pendingOrders: {
        label: "Pending Orders",
        value: "24 Items",
        change: "+8.2%",
        icon: "inventory_2"
      },
      activeCustomers: {
        label: "Active Customers",
        value: "1,568",
        change: "+5.1%",
        icon: "groups"
      },
      systemUptime: {
        label: "System Uptime",
        value: "99.82%",
        change: "Excellent",
        icon: "check_circle"
      }
    },

    doctorDashboard: {
      pendingRequests: 4,
      urgent: true,
      greeting: "Welcome back, Dr. Julian Thorne"
    }
  },

  // ==================== ORDER & DELIVERY ====================
  orderTracking: {
    order: {
      orderNumber: "PH-9928341",
      status: "Out for Delivery",
      estimatedDelivery: "October 24, 2024",
      currentStatus: {
        title: "Out for Delivery",
        description: "Our courier is en route to your residence."
      }
    },

    timeline: [
      {
        step: 1,
        title: "Order Placed",
        timestamp: "October 20, 09:12 AM",
        description: "Order confirmed and payment processed.",
        completed: true,
        icon: "check_circle"
      },
      {
        step: 2,
        title: "Prescription Review",
        timestamp: "October 20, 10:45 AM",
        description: "Clinical review completed by licensed pharmacist.",
        completed: true,
        icon: "medical_services"
      }
    ]
  },

  // ==================== USERS & TEAM ====================
  users: {
    admin: {
      name: "Dr. Aris Thorne",
      role: "Chief Pharmacist",
      status: "Active"
    },
    doctor: {
      name: "Dr. Julian Thorne",
      role: "Clinical Oversight Specialist"
    }
  },

  teamMembers: [
    {
      role: "Trusted by",
      count: "50k+",
      description: "patients"
    }
  ],

  // ==================== FOOTER ====================
  footer: {
    branding: {
      name: "Clinical Atelier",
      copyright: "© 2024 Clinical Atelier. Licensed Pharmaceutical Practice. All clinical data is verified by our board of experts."
    },
    resources: [
      { label: "Clinical Standards", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" }
    ],
    company: [
      { label: "Contact Medical Team", href: "#" },
      { label: "Careers", href: "#" }
    ],
    helpCenter: {
      help: { label: "Help Center", href: "#" },
      logout: { label: "Log Out", href: "#" }
    },
    support: { label: "Support", href: "#" }
  },

  // ==================== FILTERS & OPTIONS ====================
  filters: {
    priceRange: {
      min: 0,
      max: 500,
      label: "Price Range"
    },
    brands: [
      { label: "Pfizer Pharmaceuticals", checked: false },
      { label: "Novartis AG", checked: false },
      { label: "Roche Wellness", checked: false }
    ],
    sortOptions: [
      { label: "Popularity", value: "popularity" },
      { label: "Price: Low to High", value: "priceLowHigh" },
      { label: "Price: High to Low", value: "priceHighLow" },
      { label: "Newest Arrivals", value: "newest" }
    ]
  },

  // ==================== MISCELLANEOUS ====================
  misc: {
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Pharmacy", href: "#" },
      { label: "All Medicines", href: "#", active: true }
    ],
    orderSummary: {
      subtotal: 101.00,
      shippingEstimated: "FREE",
      taxEstimated: 8.08,
      totalAmount: 109.08,
      currency: "USD"
    },
    prescriptionUpload: "Upload Prescription",
    viewPres: "View Prescriptions"
  }
}

// ==================== IMAGES ====================
export const images = {
  heroImages: [
    {
      id: "weshopify-hero",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf3SiPsnivzkBCzEXMpwmkNzF0-jUbdH6CjcEyRbVRkPVt3F-En6WFgJWcpIIiC8aHqrD9EI4AFmGfNjAmDa3c-VWSVYnAW6oBRUKxUMEFPGH_h006TjLJZMDhm-yZNZJlGiYZTajtcDyH1AP2_-xtQTD_IM7nGk7QjzgQ-x57nQHzgSZN3evh3CRjnRHDC6Z0YVcEa_BOTye9KfaOfXgoD2jPHl1vzPFVfgIGvNuG5sPe-704YNjnDVY3tdQcraDGK9kUbEprPQw",
      alt: "Ultra high-definition close up of premium pharmaceutical packaging with minimalist labels and elegant blue typography on a white textured background",
      category: "hero"
    },
    {
      id: "lab-hero",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtYq71OoP7djnbjxEpY_1-iJ3wBpdhrDGJbGOeZBeqH8a-BE7QkzkrSsNGcdhkkxoXoq3_tuR_2MWy3tGqSqFog3CiD8VPuKdJ1AMwSm1uz1PS55m8nmrHvZ1bEOUxE_dqZOf3KuZvvHjdnK3fTXw-bwxPJ69nQbvAWwFKZgkLqWEKz2DK-5Vy9SPfPMYFuGVFTbr0C6pKph3IlE1EAu1X6H4npVoXVO-HcKRL1jGu-5dH_KgdXawtv3t2cG_ZFg5DF_UOfoe3fwo",
      alt: "Modern clinical laboratory setting with scientific glassware and soft blue ambient lighting reflecting editorial pharmaceutical photography style",
      category: "hero"
    }
  ],

  backgroundImages: [
    {
      id: "weshopify-background",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Z6PUVHl7uusGgGT_lgr-LyoYmuHTlBaRXE3EyciDDUxstfP7kdTmQpmoMhzXlLO8d7FWWmjYFX93Q462sb5Fb8YkKbjpBeEK7OfibRpOLdWap-z-LKetumCQSEmWwMtG_csDgt3dww3HUIOrBlSRKYtsO1FgFKtS7h1S14wOu6KlLiQ5ImpmaEpZgzjaQnupXE4jogXyQcGbE32abWUtqEj63hjzFUER0eHeJ8z0alxpKIeT4KzsZpcRQaSEZ-yBOMeYBGEQ6Yk",
      alt: "Close-up of high-end glass apothecary bottles and medical laboratory equipment in a bright, clean, minimalist studio setting with soft natural light",
      category: "background"
    },
    {
      id: "crystalline",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAq7TtMDQ1fqxQEzuMT_mkIC_PTyLmcntfNfBJQPKbW_6SRAwdC1tHLNV0kaOFZH_7skPJYwKq0jLWRbtgG6fIfODSYkf9I9AGs9bSNejna1-yA-2FcA4YD0JLRyyuVCs6HJDsi83x0LoejLYC7A-fglTYhL9wXfto2a1Dt7X8A8ZcOHXHDA30mxbTschjUx3kBaBwM-aWhMXuM7-xVEpo3Xp7uhTrrUneEQ6eB1os7aaz88NVXHjY4smZLLQP_-Jf-w_NENoB9sI",
      alt: "microscopic view of clean blue crystalline structures with soft focus and medical lighting",
      category: "background"
    }
  ],

  researchImages: [
    {
      id: "capsules",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwpUpak2RL8a8y7h_9oHGKgQnambZwKE_E6wPdOyzKd1ZU8xLKF9T0utBIyOzIpZsoTapBIKnbvhpYe8IxBTxHZOka1l79nGr8Hjs9AgjoQ-jPDYZ_RLjlVdRGtiCLefsyDJnyjRSbN9p5vwT1n83stv_Pfg9GGEk1RUawbo8sPwD-MX1154kL6dzxuLLaOgaHkG-FhgB0jnAHSezKqsCpSICvd893iV54-OKjskEO03qoCYrBI9i6JqAvWDf6TAlqwWifzqenNNQ",
      alt: "Macro photography of blue pharmaceutical capsules on a pristine white surface with soft clean shadows",
      category: "research"
    },
    {
      id: "molecular",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbHHi2W-ntcYp8Y1RxhQb1ffEeJK7zaNP50RxQt2gnUC25Q3eOjxQKr2tJLU1AxDxQMnrgLkjzb3QPCeBWkBQEIkNPFcrxf_zC-fGAPso5U5nyvCd7mnxcDHpHsHU7wMDTCjUeriy3DGoPYDTqka1h8uhts0cHtcynKkoF-NEDCLBBl5feeVVP5Bdn8CWPJw8qjhmmdHhRIzHIbkO4fnHoEju7idLlhVcEo0oIySU3EqlOtmHJ5L366g6-VbQVfInsu4S0AMYDTfk",
      alt: "Digital representation of complex molecular structures with blue and teal light patterns on a dark background",
      category: "research"
    },
    {
      id: "beaker",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9s0q5fCz6AQDNYFXGjEIYYe6WHHGkKc93bmS0Vl4Jh627WdNbeaq8qQjHdQNhFlOjmfGmkoAOphdWByJ6AXu5HcWUj9lf5EWXFbxrF4-MyKi9EQfBXVwVbqApXVi26sQUiK8Lj_ExjlmPEPW_olMkaUg6cDNlq6mOgO6J1EODn_FArrUSPaEdopPq3HLVre_LPrInXDT1eu5_uj6x5Gy2xtgh85Ca3Xrnf5F4UnEQ7FyPDejzka1BC0WOraXJP36068Kse1pRmbk",
      alt: "Minimalist laboratory beaker with clear liquid on a glass table against a soft grey background",
      category: "research"
    }
  ],

  productImages: [
    {
      id: "medicine-bottle",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNJldAbMpdkNKc5OG0yrIJkUeNjRlcv-hU0eUCZO6mSzyIWeUQt-uTRRq9zPgEQOSYdeB5zsQOnQj_dRfGN3l2lEHAIs_AA9zfMWBTr2DVWbXcuFb167zJmT9XXDdntLpPlyb1ukPKw2IPYVzBade-kdm1NcPUxQjUpKp5w07MOFbY4yeMDhazGmhSEFPRa2btJ6-bOgI01pnFzQ_QvmUrMQnem2k0DhDmFiz-FwtNiSyOD_H46NhBnDj5z799spcCimFHtz8DnS0",
      alt: "Close-up of clinical medicine bottle and scattered white pills on a clean white laboratory surface with soft medicinal lighting",
      category: "product"
    },
    {
      id: "medicine-box",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHnke7qZsqgtk2FM-U3VRk7mI5k_F26e8pEVEoFjzdNSzpaDWXw-iGVA95DS9BUWlYzvk_UZH_jXpoQl93-lrPaAZOjpJK5TNT4NEoiJwQy9LbBby-rLD0wk2QBeTVFhlg9u97pTfUtyqz5ri-GVL2nZfo5S_nKvISLyeQNf11bxeV3iDxtDF6favIF65ewEOXvItSb4nlCfGoqn_KenuxJKJbCy45ml41D5TyqidTQHEvPUEybDa5PzvdMkl9eL6e2Iz_fpR1bQ0",
      alt: "Sleek modern pharmaceutical packaging for a medicine box with minimalist design and professional clinical aesthetic",
      category: "product"
    },
    {
      id: "capsules-pouring",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvHzcXAW_Y-gnSukOwbELqIddyLhFo0lod4Q-HikxVBICqnVrUugPObcdMsWhK1XQ8MrkDHD7TjZKaFlVoHUvSOn2Ap1jVbdTSKhMZnaZAeJasqvPaeyaZZQDirEiz4K2ZB0FgGhinH7Tws1DPymckQN_xX5wqJI19-49M77lMWcsGbE-NxEgM884Kd0jT3SmgahJelryPxKFbehYUq7b0sPLKatkqXWMI5-m-8QQXXWUUkA7Z9-XMydNxJsXcVDOnveTwj4omND4",
      alt: "Professional medical capsules being poured into a transparent glass container in a high-end cleanroom environment",
      category: "product"
    },
    {
      id: "inhaler",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrKeCrctTdVM14rwscYbBKIUYpbhF7xtGgQ8K-t5fniY41uWu8MDwobGkfSpRiRNQzpy1GJktAL-3S97mHu9mzgeWqXtmtpZIpeSbpfPfIOk1qhOQAQAeToSvZ-rUp4P3RBh9zHW0PEDbVl-erB5tu9HOkjZyhoL5hlR6jqPJ0wHGakwmXU6NJDUzWZT6KbpvpKX_B8CqYjWgBkoXArwsIi1PRofEtyVSiZBxBfpZhEiEd1bdGQeG3-qWb5dzm0mSJWL6p0bbwzR8",
      alt: "Minimalist inhaler device for respiratory health sitting on a light blue silk cloth with soft focus background",
      category: "product"
    }
  ],

  wellnessImages: [
    {
      id: "yoga",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoc9LGO3aN3sb7yadgjttNKqTQ2pKCUOpC9zdYGH8NUAekRfkbrSG7lbNXsuSfNGFdeEsyMzzQzL2br6CJH3O2CE46hcMXg7FATgwKn-2ZuCR1tuhXyVQAf-wUPMO35pyEdGXgpXoHHwuux8TzLI4ohjIkMzdUqv2ojxndIRAydyU6pj1wawz-J8IQoqgkShkpqu6PT_pibWYRSpR6_DW3mMc0DGO59fDFDM2B3xmwlv4lySFs6FOH2RohaVbl-m-fwGEj0vPVUT0",
      alt: "Top view of person practicing yoga in a bright airy studio with warm morning sunlight",
      category: "wellness"
    },
    {
      id: "healthy-bowl",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWG71-oq8AgIlDZ_AQv3UWY_Fc-FGPozrzrP3WLwatU9qylyCZlLNeTMgL3NcDK7YeucZGkNOuKflKmCS-9gp-qxQHG5UsXQ_neuR_g7CoSKCRl6uCYjMHpUzNDXBsu_EERwSIgU3_ydhtQ4wJXFct2YAZBsEPeuXupBVxJ0JDBh0PzKzXlurs-pGu78kgwj0WfGBYtzWFs-nQvkoccB9afcza4kFNCWRJRt9zFCdt93esfcZP5ux3oIzmf93wUqNM82Jxd1xQpBg",
      alt: "Overhead shot of a colorful healthy grain bowl with fresh vegetables and seeds",
      category: "wellness"
    }
  ],

  supplementImages: [
    {
      id: "vitamin-d3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6zttf1-55pMpaKmwfNngxy91ODdCdA8UdZRWHJdqgoMUdSBPVoKWTOUibev8Er-gp4yE1VwfJFaBX2aoT3KibCrTlLXsHGltAKjQnwEj23wH8PSHBBsOi24bjgcuhLcF_sPfYTZc4FVkbz7X6CEouzVM26EfQ7YLVdgWEx3LGQ9T9aeuCsbuvEwsaHUsHMOJNcj_eHz6Nv_8e2roplZAjnYR55HcF8mLxHp4Nd-uVA4AphjIN7nEuLISL4DW1j0xHmUvPaSs56FY",
      alt: "Professional grade Vitamin D3 dropper bottle on a clean minimalist surface",
      category: "supplement"
    },
    {
      id: "pill-organizer",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnKRR4OpFsLya6PWGPAmoI4KWdiD3xwjB2MP6vrZUiEoMPXq_EU-kqkH0XQ2aO8qON2J-44DzRvwOKE47TX32EY7B3sQfBQ2tgu6tcyFgO9tPYftyhdMuBpFc0_PP26Ey94IqgVg3slIDdaowPdFsp1Igkv92w2lJSUO9eCDANSuw6pCHoN3-EH8CpFU7qBRz1rikQipwG2vtyfVG-e89MrTCYfZczZIkXRzeX8ADgorSD-n3_N6Im8UlNZmXxmyT4kRITW7Al66s",
      alt: "Modern high-tech daily pill organizer in soft white and matte blue finishes",
      category: "supplement"
    }
  ],

  profileImages: [
    {
      id: "female-professional",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQhSv0ukbz6CuE_WjwjNblXFMBPo6rVZ72nMRi43HLXQ8_mviQ3SWs8oZLDvAit68jWN_J5vXT4JFftj3IsttHIixkJrgXZ6T_ApxVSTdoGYF2efnSzQMrddgublNZHOs6IIRwua10Cx6zv8IxZP6Fff3WL0d4Tuc7y2l08u4KTOZUXeK5fuy9wrDhX6aIBdZ17o-qwgLus3TBTpWWYvdZQkfn0NTwPVDEE4t33bJFhkK-Oj9_aA8RAL2WnruSDn9SaGXqJP6SHLc",
      alt: "portrait of a female clinical professional in a clean white environment",
      category: "profile"
    },
    {
      id: "male-doctor",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJJ9S03VjK1p60uL4SNaebFuYZBN1pt9QUdmWEYadWVKM3rnZl8FRArPdXF6JOKMESK_CA27yYFlmwCCQO-dXTxQMJ4kFY9xWreMH19cvp3UAzC4n0raBYd5E6JqrKCLAW2h-L3AgwnjTiPdEY8hH_ghda4XktRPGysLJ4inAcswjeRLAnBn0LZbI3L55oGhbfsl1eG54h0U2_FnWANAL3S02lGIh3LgdyNa-ZPlebEpA78RH4_zOamLqgnLKUOwTAdt39sl5ImNc",
      alt: "portrait of a male doctor with glasses in a modern medical setting",
      category: "profile"
    },
    {
      id: "lab-professional",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB5bhLj-tV6i40-6HTolEs2jH0wMe7I2oQrTnR8GA5_VmVjnOH5YvQxr1CNZPa5uWfDmBN6gJwLY6FN5ea-yUR3HuY3F-HbgoR6cgpNHys_y3OMneK1wPVROuMz18hCHgTp4vNv2yYO4tIKh8Mmtp7qJFkVADNqnXqMWmFlMlg1c8bVf5nWufWwV2riziQ_I0jetEF6d_nEVrMaqOV7KzbUv2LyDj82Fpa5nlOnTI153DN__-aVk7mIXdie8texxViYL90Ytcr4vo",
      alt: "professional portrait of a medical professional in a white lab coat with a friendly expression",
      category: "profile"
    }
  ],

  pharmacyImages: [
    {
      id: "pharmacy-interior",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANpUIPAIXbpQvXwXvJUXf6-apPokJippOjDrJUoWI4GZJy5_iBLSfSuc2zXrW0XY0xmt5H42hgKyEP3ypkYprxiodwoI4Wc2e9KeAPD0udGxQ0iHrh0WgQuhUauuP4AsXP6pyAX295Bf5-1sdk9JxLn1XqTl6VNZoj1w6aAq4Yc9cHm2_STQpPXRC8O39AIa8H_esEy5lzjbVyqbg9wPNf-Bvvdau2Sz2h39JFTSead7u3Yx-ut4311CtX5KAKL_ZIzhibqWF6c_A",
      alt: "Modern clinical pharmacy interior with minimalist white shelves and organized glass apothecary bottles in soft daylight",
      category: "pharmacy"
    }
  ],

  prescriptionImages: [
    {
      id: "prescription-bottle",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ66Nz7F5W3Fx7SL_8YKWft_PXTIH-F8Twgq-a5R8NuToQ4oKjzhs7aAK4D4uao3m4TQc9-CKVrtOYFFFt88vocSOWEiotNCZkpWnf-tperQikOTA3HuWzjI2HifIUhHoryHS0ziBruSzkmHWOezBTU3elUWsTwUsh3W4SS3D8ItIgfcfouwLN3bcOp-MqqpnpLH2dfK15Nn8nXyeuL_ERjpgjC7V7YCxkutMJfw5AJfaNogbsK-vlc9E-9Ker_cVKJPVEwPQ0dmQ",
      alt: "Modern minimalist prescription pill bottle with elegant white label sitting on a reflective medical surface with soft blue lighting",
      category: "prescription"
    },
    {
      id: "omega-complex",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXZr4lB-uWkLsH1755JEwgeePPZCoGoIA_FyW0Hb3ATC1dWQH8W2pefkT59ufu1i-B6KbSQp1G-BjcYkSylTEl-IDEtjZC8nCcc7oAeD2W8rTLmOXaKMg1L5YAHZc-ve6eZymj8-xs2meV7ZiugXDTHJH1IgangIo6uSZ-KB-JJJs55l0LXXX_vtHP8dxplfAyCZXOdsFF9bzSt-EfC4YbCM7ubJub2X0vEj3uM7KyW6fDD-0Me74mXdw7pFwdpEmeb_gS9J-yPd8",
      alt: "Premium brown glass supplement bottle for Omega Complex capsules on a clean white countertop with artistic botanical shadows",
      category: "prescription"
    }
  ]
}

// ==================== COLOR SCHEME ====================
export const colorScheme = {
  primary: "#004182",
  primaryContainer: "#0058ac",
  primaryFixed: "#d6e3ff",
  secondary: "#006970",
  secondaryContainer: "#7af1fc",
  tertiary: "#004d10",
  tertiaryContainer: "#13671f",
  tertiaryFixed: "#a3f69c",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  
  onPrimary: "#ffffff",
  onSecondary: "#ffffff",
  onTertiary: "#ffffff",
  onError: "#ffffff",
  
  surface: "#f7f9fb",
  surfaceContainer: "#eceef0",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#424752",
  
  outline: "#727784",
  outlineVariant: "#c2c6d4"
}

// ==================== TYPOGRAPHY ====================
export const typography = {
  fonts: {
    headline: "Newsreader",
    body: "Inter",
    label: "Inter"
  },
  sizes: {
    h1: "text-6xl lg:text-7xl",
    h2: "text-4xl lg:text-5xl",
    h3: "text-3xl",
    h4: "text-2xl",
    h5: "text-xl",
    h6: "text-lg",
    body: "text-base",
    small: "text-sm",
    xsmall: "text-xs"
  }
}
