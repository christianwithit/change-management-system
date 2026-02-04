# VISION GROUP Change Management System (CMS)

A professional web-based Change Management System for VISIONGROUP Uganda, built with vanilla HTML, CSS, and JavaScript.

## 🎉 UI Refactoring Complete!

The system has been refactored with a **scalable, consistent, and accessible** dashboard architecture following Silicon Valley best practices.

### ✨ New Refactored Pages:
- 📊 **Dashboard**: `pages/dashboard-refactored.html`
- 📈 **Reports**: `pages/reports-refactored.html`
- 📋 **My Requests**: `pages/my-requests-refactored.html`

### 🎯 Key Improvements:
✅ **Unified Design System** - Consistent spacing (8px grid), colors, and components  
✅ **Reusable Table Component** - Clean three-dot action menus replace icon clutter  
✅ **Mobile-First Responsive** - Hamburger menu and touch-friendly interface  
✅ **WCAG AA Accessible** - High-contrast navigation and proper focus states  
✅ **No Orphaned Cards** - Auto-fit grid system prevents layout issues  
✅ **Reduced Cognitive Load** - Removed redundant Quick Actions  

### 📚 Documentation:
- 🚀 [**Quick Start Guide**](QUICK_START.md) - Get started in 5 minutes
- 🎨 [**Visual Improvements**](VISUAL_IMPROVEMENTS.md) - Before/after comparisons
- 📖 [**Component Reference**](COMPONENT_REFERENCE.md) - Copy-paste patterns
- 🏗️ [**Refactoring Guide**](REFACTORING_GUIDE.md) - Complete architecture
- 📋 [**Implementation Summary**](IMPLEMENTATION_SUMMARY.md) - What was delivered

---

## 🚀 Quick Start

1. Open `index.html` in your web browser
2. Login with any credentials and select a role:
   - **staff** - Submit and track requests
   - **hod** - Approve/reject requests
   - **it** - Review and implement changes
   - **admin** - Full system access

## 📁 Project Structure

```
CMS/
├── index.html              # Login page
├── css/
│   ├── main.css           # Core styles & variables
│   ├── layout.css         # ⭐ NEW: Grid system & MainLayout
│   ├── navigation.css     # ⭐ NEW: Enhanced sidebar
│   ├── components.css     # Buttons, cards, badges (updated)
│   ├── table.css          # ⭐ NEW: Reusable table component
│   ├── pages.css          # Page-specific styles (updated)
│   ├── icons.css          # Icon system
│   └── animations.css     # Animations & transitions
├── js/
│   ├── auth.js            # Authentication
│   ├── api.js             # Data management (mock)
│   ├── utils.js           # Helper functions
│   ├── mock-data.js       # Sample data
│   └── app.js             # Main app logic
└── pages/
    ├── dashboard.html            # Original dashboard
    ├── dashboard-refactored.html # ⭐ NEW: Refactored dashboard
    ├── reports.html              # Original reports
    ├── reports-refactored.html   # ⭐ NEW: Refactored reports
    ├── my-requests.html          # Original requests
    ├── my-requests-refactored.html # ⭐ NEW: Refactored requests
    ├── submit-request.html       # New request form
    ├── request-detail.html       # Single request view
    ├── approvals.html            # HOD approval queue
    └── it-review.html            # IT review & methodology
```

## ✨ Features

### Core Functionality
- ✅ Change request submission with detailed forms
- ✅ Multi-level approval workflow (HOD → IT)
- ✅ Request tracking and status monitoring
- ✅ IT methodology definition
- ✅ Comprehensive reporting and analytics
- ✅ Document management
- ✅ Timeline tracking
- ✅ Export to CSV

### Design
- 🎨 VISION GROUP official branding
- 🎨 Coral red (#E74C3C) and burgundy (#8B1538) color scheme
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- ♿ WCAG 2.1 AA accessible

## 🔄 Workflow Stages

The system follows a 4-lane workflow:

1. **REQUESTOR** → Submit → Clarify → Review → Acknowledge
2. **HEAD OF DEPARTMENT** → Review → Approve/Reject/Clarify
3. **IT TECHNICAL REVIEW** → Evaluate → Define Methodology
4. **IT DEVELOPMENT** → Develop → Document → Train → Complete

## 🎨 Color Palette

```css
/* Primary Colors */
--primary-color: #E74C3C;      /* Coral Red */
--secondary-color: #8B1538;    /* Burgundy */

/* Status Colors */
--success: #27AE60;            /* Green */
--warning: #F39C12;            /* Orange */
--danger: #E74C3C;             /* Red */
--info: #5DADE2;               /* Blue */
```

## 🔧 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables, animations, gradients
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **LocalStorage** - Client-side data (demo mode)

## 📊 Sample Data

The system includes 5 sample requests demonstrating different workflow stages:
- In Development
- Clarification Needed
- Technical Review
- Completed
- Rejected

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔌 Backend Integration

Currently uses mock data (localStorage). To connect to a real backend:

1. Replace API calls in `js/api.js`
2. Update authentication in `js/auth.js`
3. Add file upload functionality
4. Implement email notifications

Example:
```javascript
// In js/api.js
getRequests: async function(filters = {}) {
    const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
    });
    return await response.json();
}
```

## 📝 Customization

### Change Colors
Edit `css/main.css`:
```css
:root {
    --primary-color: #E74C3C;
    --secondary-color: #8B1538;
    /* ... */
}
```

### Add Logo Image
Replace the "V" logo in HTML files with:
```html
<img src="path/to/logo.png" alt="VISION GROUP">
```

## 🚀 Deployment

### For Testing
1. Open `index.html` directly in browser
2. No server required

### For Production
1. Upload all files to web server
2. Configure backend API endpoints
3. Set up SSL certificate
4. Configure authentication

## 📞 Support

For questions or issues, contact the IT Department at VISIONGROUP.

## 📄 License

© 2026 VISIONGROUP. All rights reserved.

---

**Version**: 2.0  
**Last Updated**: February 3, 2026  
**Status**: Production Ready (Frontend)
