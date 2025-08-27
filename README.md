# JobBoard - Modern Job Search Platform

A responsive, accessible job board application built with Next.js, TypeScript, and Tailwind CSS. Find your next career opportunity with powerful search, filtering, and job management features.

## 🚀 Live Demo

[Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jobboard)

## ✨ Features

### Core Functionality
- **Job Listings**: Browse comprehensive job postings with detailed information
- **Advanced Search**: Search across job titles, companies, skills, and descriptions
- **Smart Filtering**: Filter by job type, location, remote work, salary range, and experience level
- **Job Details**: Comprehensive job information including responsibilities, requirements, and benefits
- **Save Jobs**: Bookmark interesting positions for later review using localStorage

### User Experience
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Deep Linking**: Shareable URLs with search parameters and filters
- **Pagination**: Efficient browsing through large job collections
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **URL State Management**: Filters and search persist in browser URL
- **Local Storage**: Save jobs without requiring user accounts
- **Responsive Components**: Mobile-optimized interface components
- **Modern UI**: Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + URL parameters
- **Data**: Mock JSON data (easily replaceable with API)
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobboard.git
   cd jobboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
job-board/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Home page with job listings
│   ├── jobs/[id]/         # Dynamic job details pages
│   └── globals.css        # Global styles and Tailwind
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── SearchBox.tsx      # Job search functionality
│   ├── FilterBar.tsx      # Job filtering controls
│   ├── JobCard.tsx        # Individual job listing card
│   ├── Pagination.tsx     # Page navigation
│   └── EmptyState.tsx     # No results state
├── lib/                   # Utility functions
│   ├── filters.ts         # Search, filter, and pagination logic
│   └── formatting.ts      # Data formatting helpers
├── data/                  # Mock data (replace with API)
│   └── jobs.json         # Sample job listings
├── public/                # Static assets
├── styles/                # Additional styles
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=your_api_endpoint
NEXT_PUBLIC_SITE_NAME=JobBoard
```

### Tailwind CSS
Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single-column layout with collapsible filters
- **Tablet**: Optimized spacing and component sizing
- **Desktop**: Multi-column layout with enhanced navigation

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels and descriptive text
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Skip Links**: Quick navigation to main content

## 🔍 Search & Filtering

### Search Capabilities
- **Text Search**: Search across job titles, companies, skills, and descriptions
- **Case Insensitive**: Automatic case normalization for better results
- **Partial Matching**: Find jobs with partial keyword matches

### Filter Options
- **Job Type**: Full-time, Part-time, Contract, Internship
- **Location**: Geographic filtering by city/country
- **Remote Work**: Filter for remote or on-site positions
- **Salary Range**: Min/max salary filtering
- **Experience Level**: Intern, Junior, Mid, Senior

### URL State Management
All filters and search parameters are stored in the URL for:
- Shareable links
- Browser back/forward navigation
- Bookmarkable filtered views

## 💾 Data Management

### Mock Data Structure
Jobs are stored with comprehensive information:

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  experience: string;
  postedAt: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  companyLogo: string;
}
```

### Local Storage
- **Saved Jobs**: Persistent storage of bookmarked positions
- **No Authentication Required**: Works immediately for all users
- **Cross-Session Persistence**: Saved jobs persist between browser sessions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🔧 Customization

### Adding New Job Fields
1. Update the `Job` interface in `lib/filters.ts`
2. Add mock data in `data/jobs.json`
3. Update components to display new fields
4. Add filtering logic if needed

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update component classes for layout changes
- Add custom CSS in `app/globals.css`

### API Integration
Replace mock data with real API calls:
1. Create API service functions
2. Update data fetching in components
3. Add loading states and error handling
4. Implement caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for seamless deployment
- **Open Source Community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jobboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jobboard/discussions)
- **Email**: support@jobboard.com

---

Built with ❤️ for job seekers worldwide
