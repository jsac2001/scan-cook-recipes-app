
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
			padding: '1rem',
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
				
				// Nouvelle palette de couleurs ScanCook
				primary: {
					DEFAULT: '#FF6B35', // Orange vif 
					light: '#FF8A5C',
					dark: '#E54E17',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#2EC4B6', // Turquoise
					light: '#48E5D7',
					dark: '#21A396',
					foreground: '#FFFFFF'
				},
				accent: {
					DEFAULT: '#4D21FC', // Violet
					light: '#7151FD',
					dark: '#3B0FE2',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#EF476F', // Rouge pour erreurs
					light: '#F57A97',
					dark: '#D42954',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#FFD166', // Jaune pour avertissements
					light: '#FFDE8C',
					dark: '#FFC23D',
					foreground: '#333333'
				},
				success: {
					DEFAULT: '#06D6A0', // Vert pour succès
					light: '#39E5B6',
					dark: '#05B285',
					foreground: '#FFFFFF'
				},
				info: {
					DEFAULT: '#118AB2', // Bleu pour infos
					light: '#19B3E6',
					dark: '#0D6B89',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#5B5F7B', // Gris bleuté pour texte secondaire
					light: '#787D9C',
					dark: '#484B61',
					foreground: '#FFFFFF'
				},
				neutral: {
					100: '#FFFFFF', // Blanc
					200: '#F5F7FA', // Gris très clair
					300: '#E4E7EF', // Gris clair
					400: '#CBD1E0', // Gris moyen-clair
					500: '#9AA1B9', // Gris moyen
					600: '#5B5F7B', // Gris bleuté (muted)
					700: '#4A4D63', // Gris foncé
					800: '#383A4C', // Gris très foncé
					900: '#333333', // Bleu foncé presque noir
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				heading: ['Montserrat', 'sans-serif'],
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-right': {
					from: {
						transform: 'translateX(100%)'
					},
					to: {
						transform: 'translateX(0)'
					}
				},
				'slide-out-right': {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
