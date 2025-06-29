
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for DeepCAL Industries
				deepcal: {
					'dark': '#0A0E17',
					'blue': '#0039e6',
					'light-blue': '#00a2ff',
					'cyan': '#00ffff',
					'purple': '#7e22ce',
					'magenta': '#f81ce5',
					'pink': '#ff00a0',
					'green': '#00ff9d',
					'yellow': '#ffca00',
					'oracle': '#a855f7',
				},
				// Neon accent colors for cyberpunk feel
				neon: {
					'blue': '#33a1ff',
					'cyan': '#00ffff',
					'purple': '#a855f7',
					'magenta': '#f81ce5',
					'green': '#00ff9d',
				},
				quantum: {
					100: '#e0e7ff',
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
				},
				neural: {
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'display': ['"Rajdhani"', 'sans-serif'],
				'body': ['"Inter"', 'sans-serif'],
				'mono': ['"JetBrains Mono"', 'monospace'],
			},
			boxShadow: {
				'neon-blue': '0 0 5px #33a1ff, 0 0 20px rgba(51, 161, 255, 0.3)',
				'neon-cyan': '0 0 5px #00ffff, 0 0 20px rgba(0, 255, 255, 0.3)',
				'neon-purple': '0 0 5px #a855f7, 0 0 20px rgba(168, 85, 247, 0.3)',
				'neon-magenta': '0 0 5px #f81ce5, 0 0 20px rgba(248, 28, 229, 0.3)',
				'neon-green': '0 0 5px #00ff9d, 0 0 20px rgba(0, 255, 157, 0.3)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'scroll-appear': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse': {
					'0%': { transform: 'scale(1)', opacity: '0.7' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '0.7' }
				},
				'pulse-slow': { 
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1)',
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(1.2)',
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'neon-glow': {
					'0%': { 'box-shadow': '0 0 5px rgba(99, 102, 241, 0.5)' },
					'100%': { 'box-shadow': '0 0 20px rgba(99, 102, 241, 0.8)' },
				},
				'wave': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(2deg)' },
					'75%': { transform: 'rotate(-2deg)' },
				},
				'particle-move': {
					'0%': { transform: 'translate(0, 0)', opacity: '1' },
					'100%': { transform: 'translate(var(--tx), var(--ty))', opacity: '0' },
				},
				'quantum-float': {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'25%': { transform: 'translate(10px, -5px)' },
					'50%': { transform: 'translate(5px, 10px)' },
					'75%': { transform: 'translate(-10px, 5px)' },
				},
				'data-flow': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'shine': {
					'0%': { transform: 'translateX(-100%) rotate(30deg)' },
					'100%': { transform: 'translateX(100%) rotate(30deg)' },
				},
				'blob': {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
				'scan-line': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100vh)' },
				},
				'fade-in-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-5px, 5px)' },
					'40%': { transform: 'translate(-5px, -5px)' },
					'60%': { transform: 'translate(5px, 5px)' },
					'80%': { transform: 'translate(5px, -5px)' },
					'100%': { transform: 'translate(0)' },
				},
				'text-gradient': {
					'0%': { 'background-position': '0% 50%' },
					'100%': { 'background-position': '100% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-in-out',
				'scroll-appear': 'scroll-appear 1.2s ease-out',
				'pulse': 'pulse 2s infinite',
				'pulse-slow': 'pulse-slow 3s infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'float-2': 'float 5s ease-in-out infinite 1s',
				'float-3': 'float 4s ease-in-out infinite 2s',
				'float-4': 'float 7s ease-in-out infinite 1.5s',
				'spin-slow': 'spin-slow 20s linear infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
				'wave': 'wave 8s ease-in-out infinite',
				'particle-move': 'particle-move 2s linear forwards',
				'quantum-float': 'quantum-float 4s ease-in-out infinite',
				'data-flow': 'data-flow 2s linear infinite',
				'shine': 'shine 3s infinite',
				'blob': 'blob 7s infinite',
				'scan-line': 'scan-line 6s linear infinite',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'glitch': 'glitch 0.8s ease-in-out',
				'text-gradient': 'text-gradient 8s ease infinite',
			},
			backgroundImage: {
				'grid-pattern': 'radial-gradient(circle, rgba(0, 162, 255, 0.1) 1px, transparent 1px)',
				'cyber-grid': 'linear-gradient(rgba(0, 162, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 162, 255, 0.07) 1px, transparent 1px)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'neon-glow': 'linear-gradient(180deg, rgba(0, 255, 255, 0) 0%, rgba(0, 255, 255, 0.1) 100%)',
				'blue-magenta-gradient': 'linear-gradient(90deg, #33a1ff, #f81ce5)',
				'cyan-green-gradient': 'linear-gradient(90deg, #00ffff, #00ff9d)',
				'purple-magenta-gradient': 'linear-gradient(90deg, #a855f7, #f81ce5)',
				'blue-green-gradient': 'linear-gradient(90deg, #0039e6, #00ff9d)',
				'deepcal-gradient': 'linear-gradient(90deg, #7e22ce, #a855f7)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.text-glow': {
					'text-shadow': '0 0 10px var(--tw-text-opacity)',
				},
				'.text-glow-blue': {
					'text-shadow': '0 0 10px rgba(51, 161, 255, 0.7)',
				},
				'.text-glow-cyan': {
					'text-shadow': '0 0 10px rgba(0, 255, 255, 0.7)',
				},
				'.text-glow-purple': {
					'text-shadow': '0 0 10px rgba(168, 85, 247, 0.7)',
				},
				'.text-glow-green': {
					'text-shadow': '0 0 10px rgba(0, 255, 157, 0.7)',
				},
				'.text-gradient': {
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'color': 'transparent',
					'background-size': '300% 300%',
					'animation': 'text-gradient 8s ease infinite',
				},
				'.glassmorphism': {
					'background': 'rgba(10, 14, 23, 0.6)',
					'backdrop-filter': 'blur(12px)',
					'border': '1px solid rgba(255, 255, 255, 0.1)',
				},
				'.clip-path-slant': {
					'clip-path': 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
				},
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;
