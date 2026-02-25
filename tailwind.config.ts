import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				russo: ['Russo One', 'sans-serif'],
				rubik: ['Rubik', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				neon: {
					green: '#39ff14',
					cyan: '#00f5ff',
					pink: '#ff2d78',
					yellow: '#ffe600',
				},
				iron: {
					light: '#d8dde8',
					mid: '#a8b0c0',
					dark: '#6b7280',
					shine: '#f0f4ff',
				},
				mine: {
					bg: '#050a0f',
					card: '#0a1520',
					border: '#1a2d3f',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)' },
					'50%': { boxShadow: '0 0 40px rgba(57, 255, 20, 0.8), 0 0 80px rgba(57, 255, 20, 0.3)' }
				},
				'iron-shine': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
					'50%': { transform: 'translateY(-12px) rotateY(5deg)' }
				},
				'rotate-slow': {
					from: { transform: 'rotateY(0deg)' },
					to: { transform: 'rotateY(360deg)' }
				},
				'slide-in': {
					from: { opacity: '0', transform: 'translateX(-30px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.8)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'particle': {
					'0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
					'100%': { transform: 'translateY(-100px) translateX(20px)', opacity: '0' }
				},
				'scan': {
					'0%': { top: '0%' },
					'100%': { top: '100%' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'iron-shine': 'iron-shine 3s linear infinite',
				'float': 'float 4s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 8s linear infinite',
				'slide-in': 'slide-in 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.4s ease-out forwards',
				'particle': 'particle 2s ease-out forwards',
				'scan': 'scan 2s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
