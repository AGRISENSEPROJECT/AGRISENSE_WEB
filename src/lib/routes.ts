/**
 * Canonical app routes.
 * Keep path strings here so navigations stay consistent across the app.
 */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  blog: "/blog",
  contact: "/contact",

  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    forgotPassword: "/auth/forgot-password",
  },

  legal: {
    terms: "/legal/terms",
    privacy: "/legal/privacy",
  },

  app: {
    root: "/app",
    cropCare: "/app/crop-care",
    soil: "/app/soil",
    weather: "/app/weather",
    analytics: "/app/analytics",
    community: "/app/community",
    help: "/app/help",
    settings: "/app/settings",
  },

  supplier: {
    root: "/supplier",
    products: "/supplier/products",
    orders: "/supplier/orders",
    buyers: "/supplier/buyers",
    analytics: "/supplier/analytics",
    settings: "/supplier/settings",
  },

  admin: {
    root: "/admin",
    users: "/admin/users",
    suppliers: "/admin/suppliers",
    moderation: "/admin/moderation",
    analytics: "/admin/analytics",
    settings: "/admin/settings",
  },

  ngo: {
    root: "/ngo",
    programs: "/ngo/programs",
    regions: "/ngo/regions",
    farmers: "/ngo/farmers",
    reports: "/ngo/reports",
    settings: "/ngo/settings",
  },
} as const;
