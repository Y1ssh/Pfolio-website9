# 🚀 Yash's Portfolio Website

A clean, modern portfolio website featuring an interactive 3D spaceship model built with Three.js.

## ✨ Features

- **Interactive 3D Spaceship**: GLB model with smooth rotation and mouse interaction
- **Dark/Light Theme Toggle**: Persistent theme preference with localStorage
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Clean & Minimal**: Focus on content and 3D functionality
- **Contact Form**: Simple email contact form with validation

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties for theming, Grid/Flexbox layout
- **JavaScript ES6+**: Modern vanilla JavaScript
- **Three.js r158**: 3D graphics and WebGL rendering
- **GLTFLoader**: 3D model loading

## 📁 Project Structure

```
Pfolio-website9/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All styles with theme variables
├── js/
│   └── main.js             # JavaScript functionality & 3D setup
├── assets/
│   └── models/
│       └── interstellar_endurance.glb  # 3D spaceship model
└── README.md               # This documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for live-server)

### Local Development

1. **Clone or download** the project files
2. **Navigate to project directory**:
   ```bash
   cd Pfolio-website9
   ```

3. **Start development server** (optional):
   ```bash
   npx live-server
   ```

4. **Open in browser**:
   - With live-server: http://localhost:8080
   - Direct file: Open `index.html` in browser

## 🎮 Usage

### 3D Model Interaction
- **Auto-rotation**: Spaceship continuously rotates
- **Mouse movement**: Move cursor over canvas to control rotation
- **Floating animation**: Gentle up/down movement
- **Loading indicator**: Progress bar during model load

### Theme Toggle
- Click the moon/sun button in top-right corner
- Theme preference saved in browser localStorage
- Smooth transition between light and dark themes

### Navigation
- Smooth scrolling between sections
- Mobile-responsive design
- Contact form with validation

## 🔧 Customization

### Colors & Themes
Edit CSS custom properties in `css/style.css`:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --accent-color: #0066cc;
}

[data-theme="dark"] {
  --bg-color: #000000;
  --text-color: #ffffff;
  --accent-color: #66aaff;
}
```

### 3D Model
- Replace `assets/models/interstellar_endurance.glb` with your model
- Update file path in `js/main.js` if needed
- Adjust scale and position in `loadSpaceshipModel()` function

### Content
- Update personal information in `index.html`
- Modify experience, education, and skills sections
- Change contact details and social links

## 📱 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

**Note**: WebGL support required for 3D model rendering.

## 🐛 Troubleshooting

### 3D Model Not Loading
- Check browser console for errors
- Verify GLB file path is correct
- Ensure WebGL is enabled in browser
- Check file size (large models may take time)

### Theme Toggle Issues
- Ensure JavaScript is enabled
- Check localStorage support
- Verify CSS custom properties support

### Mobile Issues
- Check viewport meta tag
- Test touch interactions
- Verify responsive breakpoints

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (main)
4. Your site: `https://username.github.io/repository-name`

### Other Hosting
- Upload all files to any web hosting service
- Ensure GLB file is accessible
- No server-side dependencies required

## 📊 Performance

- **Optimized 3D rendering**: 60fps target
- **Lazy loading**: Model loads on demand
- **Responsive images**: CSS-based scaling
- **Minimal dependencies**: Only Three.js from CDN

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test in multiple browsers
4. Ensure 3D model works correctly
5. Submit pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **3D Model**: Interstellar Endurance spaceship
- **Three.js**: Amazing 3D graphics library
- **GLTFLoader**: 3D model loading capabilities

---

**Made with ❤️ by Yash**

*Contact: yashdmadelwar@gmail.com*
*GitHub: [@Y1ssh](https://github.com/Y1ssh)* 