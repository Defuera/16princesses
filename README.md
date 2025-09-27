# 🏰 16Princesses Test

A fun interactive personality test that maps Disney and anime princess archetypes on a two-dimensional personality graph. Built with React, TypeScript, and Chart.js.

![16Princesses Test](https://via.placeholder.com/800x400/ff6b9d/ffffff?text=16Princesses+Test)

## ✨ Features

- **Interactive Princess Selection**: Browse through 21 princess characters from Disney and anime
- **Personality Graph**: Dynamic scatter plot showing princess positions on Feminist vs Sweet/Assertive axes
- **Personality Results**: Detailed archetype descriptions with personality messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Tech Stack**: Built with React 18, TypeScript, Vite, and Chart.js

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve built files
npm run serve
```

## 🌍 Deployment

### Option 1: Netlify (Recommended)
```bash
npm run deploy:netlify
```

### Option 2: GitHub Pages
```bash
npm run deploy:gh-pages
```

### Option 3: Manual Deployment
1. Run `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure your web server to serve `index.html` for all routes (SPA mode)

## 🎯 How It Works

1. **Choose Your Princess**: Select from 21 iconic princesses spanning Disney classics to Studio Ghibli masterpieces
2. **See Your Match**: View an interactive scatter plot showing where your chosen princess falls on two personality axes:
   - **X-Axis**: Patriarchal → Feminist (0-100%)
   - **Y-Axis**: Sweet → Assertive (0-100%)
3. **Get Your Result**: Receive a personalized message and detailed archetype description

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Visualization**: Chart.js + react-chartjs-2
- **Routing**: React Router DOM
- **Styling**: CSS3 with CSS Variables
- **Deployment**: Static files (works with any hosting)

## 📊 Princess Data

The personality data is based on character analysis across two dimensions:

- **Feminism Percentage**: Agency, independence, and progressive values
- **Assertiveness Percentage**: Boldness, attitude, and fierce spirit

Characters range from traditional sweet princesses like Snow White (5%, 5%) to fierce independent warriors like Raya (95%, 95%).

## 🎨 Design Philosophy

Built following constitutional principles established during spec-driven development:

1. **User Experience First**: Intuitive, delightful interactions
2. **Development Speed First**: Modern tooling for rapid iteration  
3. **Interactive & Engaging Design**: Smooth animations and responsive feedback
4. **Data Accuracy & Consistency**: Single source of truth for character data
5. **Accessibility & Inclusivity**: WCAG 2.1 AA compliant, keyboard navigation

## 🛠️ Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run build:analyze` - Analyze bundle size
- `npm run serve` - Serve built files with local server

## 📝 License

MIT License - feel free to use this project as inspiration for your own personality tests!

## 🙏 Acknowledgments

- Character data inspired by Disney and Studio Ghibli princesses
- Built using the GitHub Spec Kit spec-driven development methodology
- Personality framework inspired by 16Personalities testing approach

---

**Discover your princess archetype today!** 👑✨
