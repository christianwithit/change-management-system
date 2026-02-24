# Vision Group Change Management System (CMS)

A modern, role-based web application for managing organizational change requests with comprehensive workflow tracking, digital handover system, and real-time analytics.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication System** - Staff, HOD, IT Admin, and System Admin roles
- **Change Request Management** - Submit, track, and manage change requests
- **Workflow Automation** - Automated routing through HOD approval → IT review → Development → Handover
- **Digital Handover System** - Multi-signature approval workflow for project deployment
- **Real-time Dashboard** - Role-specific dashboards with live statistics
- **Development Tracking** - Timeline view with Gantt-style visualization and milestone tracking
- **Comprehensive Reporting** - Analytics, charts, and exportable reports

### User Roles & Capabilities

#### 👤 Staff Member
- Submit new change requests
- Track personal request status
- View request history
- Receive notifications on request updates

#### 👔 Head of Department (HOD)
- Review department change requests
- Approve/reject/request clarification
- View department analytics
- Monitor team submissions

#### 🎯 Head of Technology
- Review technical feasibility of approved requests
- Assign projects to IT developers
- Provide technical guidance and notes
- Monitor overall IT development progress

#### 💻 IT Developer
- View assigned development tasks
- Accept tasks and set timelines
- Track project milestones
- Update development status
- Initiate handover process

#### 🔧 System Administrator
- Full system access
- User management
- System-wide reporting
- Configuration management

## 📋 System Workflow

```
1. Staff Submission
   ↓
2. HOD Review (Approve/Reject/Clarify)
   ↓
3. Head of Technology Review (Approve & Assign/Reject)
   ↓
4. IT Development (Assigned Developer)
   ↓
5. Handover & Deployment
   ↓
4. Development Phase (Timeline tracking)
   ↓
5. Digital Handover (Multi-signature approval)
   ↓
6. Deployment & Completion
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS v4.1.18
- **Icons**: Phosphor Icons
- **Charts**: Chart.js v4.4.0
- **Fonts**: Inter (Google Fonts)
- **Build Tools**: Tailwind CLI
- **Code Quality**: ESLint v10.0.0

## 📁 Project Structure

```
vision-group-cms/
├── css/                    # Compiled CSS
│   └── output.css         # Tailwind compiled output
├── images/                # Static assets
│   ├── favicon.png
│   └── vision-group-logo.png
├── js/                    # JavaScript modules
│   ├── api.js            # API & data management
│   ├── api-client.js     # HTTP client utilities
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Dashboard functionality
│   ├── submit-request.js # Request submission
│   ├── my-requests.js    # Personal requests view
│   ├── hod-review.js     # HOD approval workflow
│   ├── it-review.js      # IT technical review
│   ├── development.js    # Development tracking
│   ├── handover.js       # Handover management
│   ├── handover-detail.js # Handover details
│   ├── reports.js        # Analytics & reporting
│   ├── mock-data.js      # Sample data (146 requests)
│   └── utils.js          # Utility functions
├── pages/                 # Application pages
│   ├── dashboard.html
│   ├── submit-request.html
│   ├── my-requests.html
│   ├── request-detail.html
│   ├── hod-review.html
│   ├── it-review.html
│   ├── development.html
│   ├── handover.html
│   ├── handover-detail.html
│   ├── approvals.html
│   └── reports.html
├── src/                   # Source files
│   └── input.css         # Tailwind source
├── index.html            # Login page
├── package.json          # Dependencies
└── README.md            # Documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/christianwithit/change-management-system.git
   cd change-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS**
   ```bash
   npm run build:css
   ```

4. **Development mode (watch CSS changes)**
   ```bash
   npm run watch:css
   ```

5. **Open the application**
   - Open `index.html` in your browser
   - Or use a local server (recommended):
     ```bash
     npx serve .
     ```

### Demo Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Staff | `staff` | `staff123` | Submit & track requests |
| HOD | `hod` | `hod123` | Department approvals |
| Head of Technology | `headoftech` | `headoftech123` | Technical review & task assignment |
| IT Developer | `it` | `it123` | Development & implementation |
| System Admin | `admin` | `admin123` | Full system access |

## 📊 Key Features Breakdown

### 1. Request Submission (3-Step Form)
- **Step 1**: Request details (title, type, department, description)
- **Step 2**: Impact analysis (justification, benefits, priority)
- **Step 3**: Confirmation & document upload

### 2. HOD Review Dashboard
- Pending approvals queue
- Department statistics
- Bulk actions support
- Clarification request workflow
- Approval/rejection with comments

### 3. IT Review & Development
- Technical feasibility assessment
- Methodology documentation
- Cost & time estimation
- Risk analysis
- Development status tracking
- Timeline visualization (Gantt-style)
- Milestone management

### 4. Digital Handover System
- 6-stage signature workflow:
  1. Project Developer
  2. Project Manager
  3. Information Security
  4. Head of Technology
  5. End User (HR)
  6. End User (HOD)
- System specifications documentation
- Hosting & deployment details
- Conditional approvals
- Rejection with feedback loop

### 5. Timeline & Development Tracking
- Visual Gantt-style timeline
- Day/Week/Month views
- Status indicators (On Track, Due Soon, Overdue)
- Group by department/status/priority
- Interactive task management
- Milestone tracking

### 6. Reports & Analytics
- Overview statistics
- Department breakdown
- Status distribution charts
- Timeline analysis
- Exportable reports
- Custom date ranges
- Visual charts (Chart.js)

## 🎨 Design System

### Color Palette
- **Primary Red**: `#CF2E2E` (Vision Group brand)
- **Black**: `#1A1A1A` (Sidebar, headers)
- **Gray Scale**: Slate 50-900 (UI elements)
- **Status Colors**:
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Error: Red (#DC2626)
  - Info: Blue (#3B82F6)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## 📱 Responsive Design

- **Mobile-first approach**
- Collapsible sidebar for mobile devices
- Touch-friendly interface
- Responsive tables and charts
- Optimized for tablets and desktops

## 🔒 Security Features

- Role-based access control (RBAC)
- Session management via localStorage
- Protected routes with authentication checks
- Input validation
- XSS protection considerations

## 📈 Mock Data

The system includes comprehensive mock data:
- **146 sample change requests**
- Multiple departments (13 departments)
- Various request types (10 types)
- Complete workflow states
- Realistic timelines and dates
- Sample user data (25 requestors)

## 🛣️ Roadmap

### Phase 1 (Completed)
- ✅ Core request management
- ✅ Role-based authentication
- ✅ HOD approval workflow
- ✅ IT review system
- ✅ Digital handover

### Phase 2 (Completed)
- ✅ Development tracking
- ✅ Timeline visualization
- ✅ Milestone management
- ✅ Reports & analytics

### Phase 3 (Future)
- 🔄 Backend API integration
- 🔄 Real-time notifications
- 🔄 Email integration
- 🔄 Document management system
- 🔄 Advanced search & filters
- 🔄 Audit trail & logging
- 🔄 Mobile app (PWA)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Vision Group IT Team**
- Project maintained by the Change Management System team

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the IT Department
- Email: support@visiongroup.co.ug

## 🙏 Acknowledgments

- Vision Group for project sponsorship
- IT Department for requirements and testing
- All department HODs for feedback
- End users for continuous improvement suggestions

---

**Version**: 2.3.0  
**Last Updated**: February 2026  
**Status**: Production Ready

Made with ❤️ by Vision Group IT Team
