// UAC Portal Color Palette
export const Colors = {
  primary: '#0D0702',        // Brun très foncé - textes, bordures, éléments d'accent
  secondary: '#F5F5F5',      // Gris très clair - arrière-plans et surfaces
  accent: '#8B4513',         // Brun moyen - éléments de carte et highlights
  success: '#228B22',        // Vert - états positifs
  warning: '#FF8C00',        // Orange - alertes
  error: '#DC143C',          // Rouge - erreurs
  white: '#FFFFFF',
  gray: {
    light: '#F8F8F8',
    medium: '#CCCCCC',
    dark: '#666666',
  },
  shadow: {
    color: '#0D0702',
    opacity: 0.1,
  },
};

// Legacy export for compatibility
export default {
  light: {
    text: Colors.primary,
    background: Colors.secondary,
    tint: Colors.accent,
    tabIconDefault: Colors.gray.medium,
    tabIconSelected: Colors.accent,
  },
};