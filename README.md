# Tecaudex Cost Calculator

An AI-powered cost estimation tool for tech projects. This application helps users get accurate development cost estimates based on their project requirements.

## Features

- **Multi-step Form**: Intuitive 5-step process to gather project requirements
- **AI-Powered Analysis**: Uses Claude 3.5 Sonnet to analyze project descriptions and generate detailed feature lists
- **Application Type Selection**: Support for AI/ML, Blockchain, Mobile, and Web applications
- **Project Scale Options**: MVP, Mid-Level, and Enterprise options
- **Feature Customization**: Users can review and customize AI-generated features
- **Contact Verification**: Email and phone verification for security
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Modern UI**: Beautiful gradient-based design with smooth animations

## Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **AI**: Anthropic Claude 3.5 Sonnet API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-features/    # API route for Claude integration
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── Header.tsx                # App header with logo
│   ├── ProgressIndicator.tsx    # Step progress indicator
│   ├── ui/                       # shadcn UI components
│   └── steps/                    # Form step components
│       ├── Step1ApplicationType.tsx
│       ├── Step2ProjectScale.tsx
│       ├── Step3Description.tsx
│       ├── Step4Features.tsx
│       └── Step5Contact.tsx
├── hooks/
│   └── useFormState.ts           # Form state management hook
├── lib/
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Form Steps

### Step 1: Application Type
Users select one or more application types:
- AI/ML Solutions
- Blockchain
- Mobile Apps
- Web Applications

### Step 2: Project Scale
Choose the complexity level:
- **MVP**: Minimum Viable Product (2-4 months)
- **Mid-Level**: Feature-rich application (4-8 months)
- **Enterprise**: Full-scale solution (8+ months)

### Step 3: Project Description
Users provide a detailed description of their project (minimum 20 words). This description is used by the AI to generate relevant features.

### Step 4: AI-Generated Features
The system uses Claude to analyze the project and generate:
- Detailed feature list with descriptions
- Time estimates for each feature (in hours)
- Features organized by category
- Users can select/deselect features to customize their estimate

### Step 5: Contact Information
Users provide:
- Full name
- Email address (with verification)
- Phone number (with verification - currently simulated, needs Twilio integration)

## API Integration

### Generate Features API
**Endpoint**: `/api/generate-features`
**Method**: POST
**Body**:
```json
{
  "applicationTypes": ["ai", "web"],
  "projectScale": "mvp",
  "description": "Project description here..."
}
```

**Response**:
```json
{
  "features": [
    {
      "id": "feature-0",
      "name": "Feature Name",
      "description": "Feature description",
      "hours": 40,
      "category": "Category Name",
      "selected": true
    }
  ]
}
```

## Customization

### Color Scheme
The color scheme is defined in `globals.css` using CSS variables. The primary color is a purple gradient (`262 83% 58%`) which can be modified in the `:root` section.

### Email/Phone Verification
Currently, the verification is simulated. To integrate real verification:

1. **Email Verification**: Implement your email service in Step5Contact.tsx
2. **Phone Verification**: Integrate Twilio SDK and update the phone verification handlers

### Final Submission Endpoint
Update the `handleSubmit` function in `page.tsx` (line 112) to point to your actual backend endpoint.

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

## Notes

- The application uses Claude 3.5 Sonnet model for feature generation
- Cost estimates are calculated at $50/hour (configurable in page.tsx line 127)
- Email and phone verification are currently simulated and need real integration
- The final submission endpoint needs to be configured based on your backend

## Future Enhancements

- Real email verification integration
- Twilio phone verification integration
- Backend endpoint for storing estimates
- PDF export of cost estimates
- User dashboard to track submitted estimates
- Additional application types
- Multi-language support

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Support

For support, visit https://portfolio.tecaudex.com/
