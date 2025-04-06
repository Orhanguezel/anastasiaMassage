// styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    backgroundSecondary: string;
    backgroundAlt: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    primaryDark: string; // 💡 Bunu ekle
    buttonText: string;
    heroBackground: string;
    cardBackground: string;
    border?: string;
    inputBackground?: string;
    danger?: string;
    sectionBackground?: string;
  }
}

