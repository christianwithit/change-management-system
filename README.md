# Vision Group Change Management System

<div align="center">

![Vision Group CMS](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.1.18-38bdf8)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern, responsive web application for managing organizational change requests with role-based workflows and comprehensive tracking.

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [Screenshots](#screenshots)

</div>

---

## 🎯 Overview

The **Vision Group Change Management System (CMS)** is a full-featured web application designed to streamline the change request workflow within organizations. Built with modern web technologies and a mobile-first approach, it provides an intuitive interface for submitting, reviewing, approving, and tracking change requests across departments.

### Key Highlights

- ✅ **Role-Based Access Control**: Staff, HOD, IT, and Admin roles with tailored permissions
- ✅ **Mobile-Responsive**: Fully responsive sidebar and layouts optimized for all devices
- ✅ **Multi-Step Forms**: Wizard-style change request submission with validation
- ✅ **Real-Time Tracking**: Dashboard with visual analytics and status tracking
- ✅ **Department Workflows**: Automated routing through HOD approval and IT review
- ✅ **Comprehensive Reporting**: Export capabilities and visual data representations

---

## ✨ Features

### 🔐 Authentication & Authorization
- Multi-role login system (Staff, HOD, IT, Admin)
- Mock authentication for demonstration purposes
- Session-based access control
- Role-specific navigation and features

### 📋 Request Management
- **Submit Requests**: 3-step wizard for creating change requests
- **My Requests**: Personal dashboard for tracking submitted requests
- **Approvals**: HOD-specific interface for reviewing department requests
- **IT Review**: Technical assessment and implementation tracking

### 📊 Analytics & Reporting
- Visual dashboards with Chart.js integration
- Status distribution charts and trend analysis
- Exportable reports in CSV format
- Department-wise breakdown and metrics

### 📱 Mobile Experience
- Responsive sidebar with smooth slide-in animations
- Touch-friendly interface elements
- Optimized layouts for mobile, tablet, and desktop
- Hamburger menu with overlay for mobile navigation

### 🎨 User Interface
- Modern, clean design with Vision Group branding
- Tailwind CSS v4 utility-first styling
- Phosphor Icons for consistent iconography
- Smooth transitions and micro-animations
- Dark sidebar with glassmorphism effects

---

## 🛠️ Tech Stack

### Frontend Framework
- **HTML5**: Semantic markup and accessibility features
- **Tailwind CSS v4.1.18**: Latest version with custom configuration
  - Custom color palette (Vision Red, Vision Black, Vision Gray)
  - Responsive breakpoints and mobile-first design
  - JIT compilation for optimized builds
- **Vanilla JavaScript**: No framework dependencies, pure ES6+

### UI Components & Icons
- **Phosphor Icons**: Comprehensive icon library via CDN
- **Chart.js v4.4.0**: Interactive data visualizations
- **Google Fonts (Inter)**: Professional typography

### State Management & Data
- **Mock Data Layer**: Simulated backend with realistic data
- **LocalStorage**: Session persistence
- **API Abstraction**: Clean separation of concerns

### Development Tools
- **Tailwind CLI**: Build and watch modes
- **NPM Scripts**: Automated build processes
- **Git**: Version control

### Authentication
- **Mock Authentication System**: 
  - Client-side session management
  - Role-based routing and permissions
  - Demonstration-ready login flow

---

## 📂 Project Structure

```
CMS/
├── css/
│   └── output.css          # Compiled Tailwind CSS
├── images/
│   ├── favicon.png         # Browser favicon
│   └── vision-group-logo.png
├── js/
│   ├── api.js             # API abstraction layer
│   ├── app.js             # Main application logic
│   ├── auth.js            # Authentication utilities
│   ├── mock-data.js       # Mock backend data
│   └── utils.js           # Helper functions
├── pages/
│   ├── approvals.html     # HOD approval interface
│   ├── dashboard.html     # Main dashboard
│   ├── it-review.html     # IT review interface
│   ├── my-requests.html   # User's requests
│   ├── reports.html       # Analytics & reporting
│   ├── request-detail.html # Request details view
│   └── submit-request.html # New request wizard
├── src/
│   └── input.css          # Tailwind source file
├── index.html             # Login page
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind configuration
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vision-cms.git
   cd vision-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build Tailwind CSS**
   ```bash
   npm run build:css
   ```

4. **Start development server**
   ```bash
   npm run watch:css
   ```

5. **Open in browser**
   - Open `index.html` in your browser
   - Or use a local server (recommended):
     ```bash
     npx serve .
     ```

---

## 💻 Usage

### Login Credentials (Mock Auth)

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Staff | `staff` | `password` | Submit requests, view own requests |
| HOD | `hod` | `password` | Approve department requests |
| IT | `it` | `password` | Review technical implementations |
| Admin | `admin` | `password` | Full system access |

### Workflow

1. **Staff Member**:
   - Login with staff credentials
   - Navigate to "Submit Request"
   - Fill out the 3-step wizard
   - Track request status in "My Requests"

2. **Head of Department**:
   - Review pending requests in "Approvals"
   - Approve or reject with comments
   - View department analytics

3. **IT Department**:
   - Access "IT Review" for approved requests
   - Update implementation status
   - Manage technical assessments

4. **Admin**:
   - Access all features
   - View comprehensive reports
   - Export data for analysis

---

## 🎨 Customization

### Tailwind Configuration

The project uses custom Tailwind theme variables defined in `src/input.css`:

```css
@theme {
  --color-visionRed: #CF2E2E;
  --color-visionBlack: #0F172A;
  --color-visionGray: #F8FAFC;
}
```

### Build Commands

- **Development**: `npm run watch:css` - Watch mode with live reload
- **Production**: `npm run build:css` - Minified build for deployment

---

## 📱 Mobile Responsiveness

The application features a fully responsive design with:

- **Breakpoints**: Mobile-first approach with `md:` (768px) breakpoint
- **Sidebar**: Collapsible mobile menu with smooth animations
- **Touch Targets**: Minimum 48px for accessibility
- **Flexible Layouts**: Grid and flexbox for adaptive content
- **Viewport Optimization**: Proper meta tags and responsive images

---

## 🧪 Testing

The application has been audited for:
- ✅ HTML structure and semantic markup
- ✅ Asset linking and resource loading
- ✅ JavaScript code quality
- ✅ Mobile responsiveness
- ✅ Navigation consistency
- ✅ Accessibility compliance

---

## 🚢 Deployment

### Static Hosting

This is a static web application and can be deployed to:
- **GitHub Pages**: Perfect for portfolios
- **Netlify**: Continuous deployment
- **Vercel**: Zero-config deployment
- **AWS S3**: Scalable cloud hosting

### Deployment Steps (GitHub Pages)

1. Build the CSS:
   ```bash
   npm run build:css
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Production build"
   git push origin main
   ```

3. Enable GitHub Pages in repository settings

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Tailwind CSS**: Utility-first CSS framework
- **Phosphor Icons**: Beautiful icon family
- **Chart.js**: Simple yet flexible JavaScript charting
- **Google Fonts**: Inter font family
- **Vision Group**: Design inspiration and branding

---

## 📬 Contact

**Project Link**: [https://github.com/yourusername/vision-cms](https://github.com/yourusername/vision-cms)

**Portfolio**: [Your Portfolio URL]

---

<div align="center">

**Made with ❤️ using Tailwind CSS v4**

⭐ Star this repo if you find it helpful!

</div>
