/** Canonical AgriSense public contact & social links. */
export const CONTACT = {
  email: "agrisense8@gmail.com",
  phoneDisplay: "+250 798 963 223",
  phoneTel: "+250798963223",
  location: "Nyabihu, Rwanda",
  social: {
    linkedin: "https://www.linkedin.com/in/agrisense-rwanda-634636428",
    youtube: "https://www.youtube.com/channel/UCk7CKXGaX2ZWAk_y3zVb6_w",
    instagram: "https://www.instagram.com/agrisense2026/",
  },
} as const;

export function mailtoAgriSense(subject?: string) {
  const base = `mailto:${CONTACT.email}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}
