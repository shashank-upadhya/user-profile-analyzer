# GitHub Profile Analyzer
**Live Demo**-https://user-profile-analyzer-beta.vercel.app/

A modern React application that analyzes GitHub user profiles without requiring API tokens. Get insights into any GitHub user's repositories, programming languages, and activity patterns.
## ✨ Features

- No API Token Required - Works with GitHub's public API
- User Profile Analysis - View profile stats, bio, and follower count
- Repository Statistics - Total stars, forks, and most popular repos
- Language Insights - Visual breakdown of programming languages used
- Responsive Design - Works seamlessly on desktop and mobile

## 🚀 Demo
Enter any GitHub username to see detailed profile analytics including:

- Account overview and statistics
- Repository breakdown with stars and forks
- Programming language distribution
- Recent repository activity

## 🛠️ Technologies Used

- **React** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **GitHub REST API** for data fetching

## 📦 Installation
```
bash
# Clone the repository
git clone https://github.com/yourusername/github-profile-analyzer.git

# Navigate to project directory
cd github-profile-analyzer

# Install dependencies
npm install

# Start development server
npm run dev

```
## 🔧 Usage

1. Enter a GitHub username in the search field
2. Click "Analyze" to fetch profile data
3. View comprehensive analytics including:
   - Profile overview and statistics
   - Repository insights and trends
   - Programming language breakdown
   - Recent activity timeline



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
