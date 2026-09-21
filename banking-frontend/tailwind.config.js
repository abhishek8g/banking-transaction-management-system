/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Earthy Wellness Palette ──────────────────────────────
        beige:      { DEFAULT: '#F5F0E6', dark: '#EDE6D6', light: '#FAF7F2' },
        sage:       { DEFAULT: '#9CAF88', light: '#B5C4A4', dark: '#7A8F68', muted: '#D4DDCD' },
        terra:      { DEFAULT: '#A9714E', light: '#C4926D', dark: '#7D5239', muted: '#D4AC95' },
        olive:      { DEFAULT: '#3F4A3D', light: '#566154', dark: '#2B3329', muted: '#8A9688' },
        // Derived
        cream:      '#FBF8F3',
        sand:       '#E8E0D0',
        moss:       '#6B7A5E',
        clay:       '#C4926D',
        stone:      '#9A9285',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        // Organic glass
        'glass-warm':   'linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(245,240,230,0.35) 100%)',
        'glass-sage':   'linear-gradient(135deg, rgba(156,175,136,0.20) 0%, rgba(245,240,230,0.30) 100%)',
        'glass-olive':  'linear-gradient(135deg, rgba(63,74,61,0.15)  0%, rgba(245,240,230,0.25) 100%)',
        'glass-terra':  'linear-gradient(135deg, rgba(169,113,78,0.15) 0%, rgba(245,240,230,0.25) 100%)',
        // Buttons
        'btn-terra':    'linear-gradient(135deg, #A9714E 0%, #C4926D 100%)',
        'btn-sage':     'linear-gradient(135deg, #9CAF88 0%, #B5C4A4 100%)',
        'btn-olive':    'linear-gradient(135deg, #3F4A3D 0%, #566154 100%)',
        // Page backgrounds
        'page-earthy':  'radial-gradient(ellipse at 20% 20%, rgba(156,175,136,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(169,113,78,0.10) 0%, transparent 50%)',
        // Shimmer
        'shimmer-warm': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.50) 50%, transparent 100%)',
      },
      boxShadow: {
        'organic':       '0 8px 32px rgba(63,74,61,0.10), 0 2px 8px rgba(63,74,61,0.06)',
        'organic-hover': '0 16px 48px rgba(63,74,61,0.14), 0 4px 12px rgba(63,74,61,0.08)',
        'organic-card':  '0 4px 24px rgba(63,74,61,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
        'organic-deep':  '0 20px 60px rgba(63,74,61,0.15)',
        'terra-glow':    '0 4px 20px rgba(169,113,78,0.30)',
        'terra-hover':   '0 8px 32px rgba(169,113,78,0.40)',
        'sage-glow':     '0 4px 20px rgba(156,175,136,0.35)',
        'sage-hover':    '0 8px 32px rgba(156,175,136,0.45)',
        'olive-glow':    '0 4px 20px rgba(63,74,61,0.30)',
        'btn-terra':     '0 4px 16px rgba(169,113,78,0.35), 0 2px 4px rgba(63,74,61,0.15)',
        'btn-sage':      '0 4px 16px rgba(156,175,136,0.40), 0 2px 4px rgba(63,74,61,0.10)',
      },
      backdropBlur: {
        xs: '4px', sm: '8px', DEFAULT: '16px',
        md: '20px', lg: '28px', xl: '40px',
      },
      borderRadius: {
        'organic': '20px',
        'organic-lg': '28px',
        'organic-xl': '36px',
      },
      animation: {
        'float':         'floatOrganic 6s ease-in-out infinite',
        'float-slow':    'floatOrganic 9s ease-in-out infinite',
        'float-leaf':    'floatLeaf 7s ease-in-out infinite',
        'shimmer':       'shimmerWarm 2.8s linear infinite',
        'breathe':       'breathe 4s ease-in-out infinite',
        'dust':          'dustFloat 8s ease-in-out infinite',
        'ripple-terra':  'rippleTerra 0.6s ease-out forwards',
        'ripple-sage':   'rippleSage  0.6s ease-out forwards',
        'page-in':       'pageInEarthy 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards',
        'card-in':       'cardInEarthy 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards',
        'fade-up':       'fadeUpEarthy 0.4s ease-out forwards',
        'count-up':      'countUpEarthy 0.6s ease-out forwards',
        'spin-slow':     'spin 16s linear infinite',
      },
      keyframes: {
        floatOrganic: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':     { transform: 'translateY(-8px) rotate(0.5deg)' },
          '66%':     { transform: 'translateY(-4px) rotate(-0.5deg)' },
        },
        floatLeaf: {
          '0%,100%': { transform: 'translateY(0) rotate(-3deg) scale(1)' },
          '50%':     { transform: 'translateY(-12px) rotate(3deg) scale(1.04)' },
        },
        shimmerWarm: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)',    opacity: '0.7' },
          '50%':     { transform: 'scale(1.06)', opacity: '1' },
        },
        dustFloat: {
          '0%,100%': { transform: 'translateY(0) translateX(0)', opacity: '0.4' },
          '25%':     { transform: 'translateY(-15px) translateX(5px)', opacity: '0.7' },
          '75%':     { transform: 'translateY(-8px) translateX(-4px)', opacity: '0.5' },
        },
        rippleTerra: {
          '0%':   { transform: 'translate(-50%,-50%) scale(0)', opacity: '0.7', borderColor: '#A9714E' },
          '100%': { transform: 'translate(-50%,-50%) scale(3)', opacity: '0',   borderColor: 'rgba(169,113,78,0)' },
        },
        rippleSage: {
          '0%':   { transform: 'translate(-50%,-50%) scale(0)', opacity: '0.7', borderColor: '#9CAF88' },
          '100%': { transform: 'translate(-50%,-50%) scale(3)', opacity: '0',   borderColor: 'rgba(156,175,136,0)' },
        },
        pageInEarthy: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          to:   { opacity: '1', transform: 'none' },
        },
        cardInEarthy: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        fadeUpEarthy: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        countUpEarthy: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
