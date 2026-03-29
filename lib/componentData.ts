/**
 * Component-Specific Dummy Data & Usage Examples
 * Extended data structures for detailed component implementations
 */

import { dummyData, images } from './dummyData.js'

// ==================== NAVBAR DATA ====================
export const navigationData = {
  topNav: {
    logo: dummyData.branding.clinicalAtelier.name,
    menuItems: dummyData.navigation.mainMenu,
    actionButtons: [
      { id: "account", icon: "account_circle", label: "Account" },
      { id: "cart", icon: "shopping_bag", label: "Shopping Bag" }
    ]
  },

  sideNav: {
    title: dummyData.branding.clinicalAtelier.name,
    subtitle: "Pharmacy Admin",
    menuItems: dummyData.navigation.adminMenu,
    bottomSection: {
      user: dummyData.users.admin,
      helpLinks: [
        { icon: "help", label: "Help Center", href: "#" },
        { icon: "logout", label: "Log Out", href: "#" }
      ]
    }
  }
}

// ==================== PRODUCT CARD DATA ====================
export const productCardData = {
  card1: {
    image: images.productImages[0],
    category: "Cardiovascular",
    rating: 4.8,
    name: "Atorvastatin Calcium",
    description: "Used alongside a healthy diet to help lower 'bad' cholesterol and fats.",
    price: 24.50,
    prescriptionRequired: true,
    addToCartButton: {
      icon: "add_shopping_cart",
      label: "Add to Cart",
      action: "addToCart"
    }
  },

  card2: {
    image: images.productImages[1],
    category: "Gastrointestinal",
    rating: 4.9,
    name: "Omeprazole Magnesium",
    description: "Effective relief for frequent heartburn and acid reflux symptoms.",
    price: 18.25,
    prescriptionRequired: false,
    addToCartButton: {
      icon: "add_shopping_cart",
      label: "Add to Cart",
      action: "addToCart"
    }
  }
}

// ==================== RESEARCH ARTICLE CARDS ====================
export const articleCardData = dummyData.articles.latestResearch.map((article, index) => ({
  ...article,
  image: images.researchImages[index] || images.researchImages[0],
  action: {
    label: "Read Article",
    href: "#"
  }
}))

// ==================== CART ITEM DATA ====================
export const cartItemData = {
  items: dummyData.products.cartItems,
  summary: {
    subtotal: 101.00,
    shipping: 0,
    shippingLabel: "FREE",
    tax: 8.08,
    total: 109.08,
    currency: "USD"
  },
  actions: [
    { icon: "bookmark", label: "Save", type: "save" },
    { icon: "delete", label: "Remove", type: "remove" }
  ]
}

// ==================== HERO SECTION DATA ====================
export const heroSectionData = {
  contentSide: {
    badge: "Featured Research",
    readTime: "12 min read",
    title: "The Future of Precision Medicine in Cardiac Care",
    description: "Exploring how clinical genomics and personalized lifestyle data are reshaping our approach to cardiovascular health and long-term wellness.",
    author: {
      name: "Dr. Helena Vance",
      role: "Chief Medical Officer, Clinical Atelier",
      verified: true
    },
    cta: {
      label: "Read Full Analysis",
      style: "gradient"
    }
  },
  imageSide: {
    image: images.heroImages[0],
    gradient: "from-primary/20 to-transparent"
  }
}

// ==================== LIFESTYLE GUIDE CARD DATA ====================
export const lifestyleGuideCards = [
  {
    id: 1,
    size: "large",
    category: "Holistic Foundations",
    title: "The Circadian Blueprint: Optimizing Sleep Hygiene",
    description: "How light temperature and thermal regulation determine your cellular recovery cycles.",
    image: images.wellnessImages[0],
    cta: { label: "Start Guide", icon: "north_east" }
  },
  {
    id: 2,
    size: "medium",
    category: "Nutrition",
    title: "Anti-Inflammatory Kitchen Staples",
    description: "The essential pantry audit for long-term metabolic health and lowered systemic inflammation.",
    image: images.wellnessImages[1]
  },
  {
    id: 3,
    size: "small",
    category: "Mental Resilience",
    title: "Mental Resilience",
    description: "Micro-practices for cognitive decompression in high-stress clinical environments.",
    icon: "psychology"
  },
  {
    id: 4,
    size: "small",
    category: "Fitness",
    title: "Longevity Protocols",
    description: "High-intensity intervals vs. steady-state: What the latest longevity data suggests.",
    icon: "fitness_center"
  }
]

// ==================== LOGIN FORM DATA ====================
export const loginFormData = {
  layout: "split",
  leftSide: {
    branding: dummyData.branding.clinicalAtelier,
    images: {
      background: images.backgroundImages[0],
      profiles: [
        { image: images.profileImages[0] },
        { image: images.profileImages[1] }
      ]
    },
    stats: "Trusted by 50k+ patients"
  },
  rightSide: {
    heading: "Welcome Back",
    subheading: "Sign in to your clinical dashboard",
    form: dummyData.forms.loginForm,
    mobileLogoHidden: true
  }
}

// ==================== DASHBOARD GRID ====================
export const dashboardMetrics = [
  {
    id: "sales",
    title: "Total Sales (Daily)",
    value: "$14,280.00",
    change: "+12.5%",
    icon: "payments",
    trend: "up"
  },
  {
    id: "orders",
    title: "Pending Orders",
    value: "24 Items",
    change: "+8.2%",
    icon: "inventory_2",
    trend: "up"
  },
  {
    id: "customers",
    title: "Active Customers",
    value: "1,568",
    change: "+5.1%",
    icon: "groups",
    trend: "up"
  },
  {
    id: "uptime",
    title: "System Uptime",
    value: "99.82%",
    change: "Excellent",
    icon: "check_circle",
    trend: "stable"
  }
]

// ==================== ORDER TRACKING DATA ====================
export const orderTrackingData = {
  header: {
    badge: "Track Delivery",
    orderNumber: "Order #PH-9928341",
    estimatedDelivery: "October 24, 2024"
  },
  hero: {
    image: images.pharmacyImages[0],
    status: {
      badge: "Current Status",
      title: "Out for Delivery",
      description: "Our courier is en route to your residence."
    }
  },
  timeline: [
    {
      step: 1,
      status: "completed",
      title: "Order Placed",
      timestamp: "October 20, 09:12 AM",
      description: "Order confirmed and payment processed.",
      icon: "check_circle"
    },
    {
      step: 2,
      status: "completed",
      title: "Prescription Review",
      timestamp: "October 20, 10:45 AM",
      description: "Clinical review completed by licensed pharmacist.",
      icon: "medical_services"
    },
    {
      step: 3,
      status: "in-progress",
      title: "Preparing Order",
      timestamp: "October 21, 02:30 PM",
      description: "Items packaged and ready for shipment.",
      icon: "inventory_2"
    },
    {
      step: 4,
      status: "pending",
      title: "Out for Delivery",
      timestamp: "October 24",
      description: "Expected delivery today by 6:00 PM",
      icon: "local_shipping"
    }
  ]
}

// ==================== FILTER SIDEBAR DATA ====================
export const filterSidebarData = {
  heading: "Shop by Category",
  subheading: "Browse our curated selection",
  categories: dummyData.navigation.sidebarCategories,
  filters: {
    priceRange: dummyData.filters.priceRange,
    brands: dummyData.filters.brands
  },
  actionButton: {
    label: "Upload Prescription",
    style: "primary"
  },
  helpLinks: dummyData.footer.helpCenter
}

// ==================== NEWSLETTER SIGNUP ====================
export const newsletterData = {
  icon: "biotech",
  heading: dummyData.forms.newsletterForm.title,
  description: dummyData.forms.newsletterForm.description,
  form: {
    placeholder: dummyData.forms.newsletterForm.placeholder,
    button: dummyData.forms.newsletterForm.button,
    disclaimer: dummyData.forms.newsletterForm.disclaimer
  }
}

// ==================== FOOTER DATA ====================
export const footerData = {
  branding: dummyData.footer.branding,
  sections: [
    {
      title: "Resources",
      links: dummyData.footer.resources
    },
    {
      title: "Company",
      links: dummyData.footer.company
    }
  ],
  socialLinks: [
    { icon: "hub", href: "#" },
    { icon: "science", href: "#" },
    { icon: "health_and_safety", href: "#" }
  ]
}

// ==================== DOCTOR PORTAL DATA ====================
export const doctorPortalData = {
  greeting: "Clinical Oversight",
  welcomeMessage: "Welcome back, Dr. Julian Thorne. You have 4 pending requests from Weshopify Pharmacists.",
  cta: {
    icon: "add_notes",
    label: "Create Prescription"
  },
  priorityQueue: {
    heading: "Priority Review Queue",
    urgentCount: 4,
    items: [
      {
        id: 1,
        patientName: "Elena Rodriguez",
        medication: "Metformin 500mg",
        requestType: "Refill Request",
        icon: "medication"
      }
    ]
  }
}

// ==================== USAGE EXAMPLES ====================
export const usageExamples = {
  /**
   * Example 1: Rendering a Product Card
   * 
   * import { productCardData, images } from './componentData.js'
   * 
   * function ProductCard() {
   *   const { image, name, price, rating, prescriptionRequired } = productCardData.card1
   *   return (
   *     <div className="product-card">
   *       <img src={image.src} alt={image.alt} />
   *       <h3>{name}</h3>
   *       <p>${price}</p>
   *       <span className="rating">⭐ {rating}</span>
   *       {prescriptionRequired && <span className="badge">Prescription Required</span>}
   *     </div>
   *   )
   * }
   */

  /**
   * Example 2: Rendering Navigation
   * 
   * import { navigationData } from './componentData.js'
   * 
   * function TopNavBar() {
   *   return (
   *     <nav>
   *       <h1>{navigationData.topNav.logo}</h1>
   *       <ul>
   *         {navigationData.topNav.menuItems.map(item => (
   *           <li key={item.label}>
   *             <a href={item.href}>{item.label}</a>
   *           </li>
   *         ))}
   *       </ul>
   *     </nav>
   *   )
   * }
   */

  /**
   * Example 3: Rendering Dashboard Metrics
   * 
   * import { dashboardMetrics } from './componentData.js'
   * 
   * function MetricGrid() {
   *   return (
   *     <div className="metrics-grid">
   *       {dashboardMetrics.map(metric => (
   *         <div key={metric.id} className="metric-card">
   *           <span className="icon">{metric.icon}</span>
   *           <p className="label">{metric.title}</p>
   *           <h3 className="value">{metric.value}</h3>
   *           <span className={`trend ${metric.trend}`}>{metric.change}</span>
   *         </div>
   *       ))}
   *     </div>
   *   )
   * }
   */

  /**
   * Example 4: Rendering Timeline
   * 
   * import { orderTrackingData } from './componentData.js'
   * 
   * function OrderTimeline() {
   *   return (
   *     <div className="timeline">
   *       {orderTrackingData.timeline.map(step => (
   *         <div key={step.step} className={`timeline-item ${step.status}`}>
   *           <div className="step-indicator">{step.step}</div>
   *           <div className="step-content">
   *             <h4>{step.title}</h4>
   *             <p>{step.description}</p>
   *             <span className="timestamp">{step.timestamp}</span>
   *           </div>
   *         </div>
   *       ))}
   *     </div>
   *   )
   * }
   */
}

/**
 * Data Access Helper Functions
 */
export const dataHelpers = {
  /**
   * Get all images by category
   * @param {string} category - Image category (e.g., 'product', 'research', 'wellness')
   * @returns {Array} Array of image objects
   */
  getImagesByCategory: (category) => {
    const allImages = Object.values(images).flat()
    return allImages.filter(img => img.category === category)
  },

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Object} Product object
   */
  getProductById: (id) => {
    return dummyData.products.featured.find(p => p.id === id)
  },

  /**
   * Get article by ID
   * @param {number} id - Article ID
   * @returns {Object} Article object
   */
  getArticleById: (id) => {
    return dummyData.articles.latestResearch.find(a => a.id === id)
  },

  /**
   * Filter products by category
   * @param {string} category - Category name
   * @returns {Array} Filtered products
   */
  getProductsByCategory: (category) => {
    return dummyData.products.featured.filter(p => p.category === category)
  },

  /**
   * Get cart summary
   * @returns {Object} Cart summary with calculations
   */
  getCartSummary: () => ({
    items: dummyData.products.cartItems,
    itemCount: dummyData.products.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartItemData.summary.subtotal,
    tax: cartItemData.summary.tax,
    total: cartItemData.summary.total,
    currency: cartItemData.summary.currency
  }),

  /**
   * Get navigation menu by type
   * @param {string} type - Menu type (e.g., 'main', 'admin', 'doctor')
   * @returns {Array} Menu items
   */
  getMenuByType: (type) => {
    switch (type) {
      case 'main': return dummyData.navigation.mainMenu
      case 'admin': return dummyData.navigation.adminMenu
      case 'doctor': return dummyData.navigation.doctorMenu
      case 'categories': return dummyData.navigation.sidebarCategories
      default: return []
    }
  }
}

// ==================== EXPORT ALL DATA ====================
export default {
  navigationData,
  productCardData,
  articleCardData,
  cartItemData,
  heroSectionData,
  lifestyleGuideCards,
  loginFormData,
  dashboardMetrics,
  orderTrackingData,
  filterSidebarData,
  newsletterData,
  footerData,
  doctorPortalData,
  dataHelpers
}
