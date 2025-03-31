# Portfolio - Franz Anhäupl

A modern portfolio website showcasing my work as an Interaction Designer & Creative Developer. The site features two versions: an interactive 3D experience (optimized for Chrome desktop) and a static version for all other browsers and devices.

---

## 🔍 Project Overview

This portfolio highlights my expertise in UI/UX design, web development, and creative coding. Key features include:

- **Interactive 3D Navigation**: Optimized for Chrome desktop with smooth transitions and animations.
- **Static Version**: A lightweight alternative for all devices and browsers.
- **Automatic Device Detection**: Redirects users to the optimal version based on their browser and device.
- **Responsive Design**: Ensures compatibility across all screen sizes.
- **Project Showcase**: Categorized projects with detailed descriptions.
- **Contact Form**: Direct email integration for easy communication.

---

## 🛠️ Technology Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/)
- **Scrolling**: [fullpage.js](https://alvarotrigo.com/fullPage/)
- **Animations**: Native Svelte transitions and CSS animations
- **Styling**: Component-based CSS, no external frameworks

---

## 📁 Project Structure

Portfolio-Franz/ ├── src/ │ ├── lib/ # Reusable components & utilities │ │ ├── components/ # UI components │ │ ├── utils/ # Helper functions │ │ └── Nav.svelte # Main navigation │ ├── routes/ # SvelteKit routing │ │ ├── +page.svelte # 3D main page │ │ ├── static/ # Static version of the site │ │ └── projectStatic/ # Static project pages ├── static/ # Static assets (images, fonts, 3D models) └── package.json # Project dependencies

---

## 📦 Main Imports and Dependencies

### Frameworks and Libraries
```javascript
// SvelteKit/Svelte
import { onMount, onDestroy } from 'svelte';
import { fade, fly } from 'svelte/transition';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// 3D and Scrolling
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import 'fullpage.js/dist/fullpage.min.css';
import fullpage from 'fullpage.js';


// Components for both versions
import HeaderHoverText from '$lib/components/HeaderHoverText.svelte';
import BurgerMenu from '$lib/components/BurgerMenu.svelte';
import ContactIcon from '$lib/components/ContactIcon.svelte';
import Messageform from '$lib/components/Messageform.svelte';
import HomeFooter from '$lib/components/HomeFooter.svelte';
import WelcomeOverlay from '$lib/components/WelcomeOverlay.svelte';
import FadeInSection from '$lib/components/FadeInSection.svelte';

// 3D version specific
import Stage from '$lib/Stage.svelte';
import Nav from '$lib/Nav.svelte';


# Clone repository
git clone https://github.com/your-username/Portfolio-Franz.git
cd Portfolio-Franz

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
