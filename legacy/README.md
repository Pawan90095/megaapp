# Professional Identity Platform

A modern, mobile-first Progressive Web App (PWA) for creating and sharing professional digital identities.

## 🎯 Features

- **Digital Resume**: Complete professional profile with experience, education, and skills
- **Share Anywhere**: QR codes and shareable links for easy distribution
- **Analytics Dashboard**: Track profile views and engagement
- **Mobile-First**: Optimized for mobile devices with native app feel
- **Offline Support**: PWA capabilities for offline access
- **Auto-Save**: All changes saved automatically to browser storage

## 🎨 Design Philosophy

This app follows **enterprise-grade mobile design standards**:

- Native mobile navigation (bottom tab bar)
- Thumb-friendly interactions
- Professional color palette
- Clean, card-based UI
- Smooth transitions
- Material design principles

## 🚀 Getting Started

### Installation

1. Simply open `index.html` in a modern web browser
2. Or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` in your mobile browser

### Install as PWA

On mobile devices:
- **iOS**: Tap Share button → "Add to Home Screen"
- **Android**: Tap menu → "Install app" or "Add to Home Screen"

## 📱 Screens

### Home Dashboard
- Profile completion progress
- Key stats (views, shares)
- Quick actions (QR code, edit profile)
- Share profile CTA

### Profile Editor
- Modular card-based editing
- Sections: About, Skills, Experience, Education
- Auto-save functionality
- Contact buttons

### Analytics
- Total profile views
- Views trend chart
- Recent activity list
- Share functionality

### Settings
- Account management
- Profile visibility toggle
- Custom profile link
- QR code download
- Support links

## 🛠️ Technology Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **PWA**: Manifest + Service Worker
- **LocalStorage**: Client-side data persistence

## 📂 Project Structure

```
resume app/
├── index.html              # Main application
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── css/
│   ├── design-system.css   # Design tokens and base styles
│   ├── components.css      # Reusable components
│   ├── navigation.css      # Navigation and modals
│   └── screens.css         # Screen-specific styles
└── js/
    └── app.js              # Application logic
```

## 🎨 Design System

### Colors
- **Primary**: #2563EB (Professional blue)
- **Background**: #F8FAFC (Light gray)
- **Text**: #0F172A, #475569, #94A3B8

### Typography
- **Font**: Inter (via Google Fonts)
- **Sizes**: 12px - 32px scale
- **Weights**: 400, 500, 600, 700

### Spacing
- **Base**: 4px grid system
- **Common**: 12px, 16px, 24px, 32px

## 📱 Mobile Optimization

- Viewport optimized for mobile devices
- Touch-friendly 44px minimum targets
- Bottom navigation for thumb reach
- Smooth modal transitions
- Pull-to-refresh support
- Haptic feedback (where supported)

## 🔒 Data Storage

All profile data is stored locally in the browser's `localStorage`:
- No server required
- Data persists across sessions
- Private and secure
- Export/import capability (future feature)

## 🌐 Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Samsung Internet 14+

## 📝 Customization

### Change Profile Data
Edit the initial state in `js/app.js`:

```javascript
const appState = {
  profile: {
    name: 'Your Name',
    headline: 'Your Title',
    about: 'Your bio...',
    // ... more fields
  }
};
```

### Modify Colors
Update CSS variables in `css/design-system.css`:

```css
:root {
  --color-primary: #2563EB;
  /* ... more variables */
}
```

## 🚧 Future Enhancements

- [ ] Photo upload functionality
- [ ] Export profile as PDF
- [ ] Import from LinkedIn
- [ ] Multiple themes (dark mode)
- [ ] Backend integration
- [ ] Real analytics tracking
- [ ] Social media integrations

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your own purposes!

---

Built with ❤️ using modern web standards
