# Project Timeline AI

A complete SaaS web application that transforms architectural drawings into detailed, professional project timelines using AI vision technology.

![Project Timeline AI](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- 🎨 **AI Plan Reading**: Advanced GPT-4 Vision extracts rooms, dimensions, and structural elements from architectural drawings
- ⏱️ **Structured Timelines**: Detailed project phases with realistic min/max durations based on UK building standards
- 📄 **PDF Export**: Professional timeline reports ready to share with clients and contractors
- ⚠️ **Risk Analysis**: Identifies potential risks and dependencies before work begins
- 🎭 **Beautiful UI**: Clean, architectural design with smooth animations using Framer Motion
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Storage**: Supabase
- **AI**: OpenAI GPT-4 Vision API
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key with GPT-4 Vision access

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project-timeline
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)

2. Create the `jobs` table:

```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT NOT NULL,
  timeline_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

3. Create a storage bucket named `project-files`:

- Go to Storage in your Supabase dashboard
- Click "New bucket"
- Name: `project-files`
- Make it public
- Click "Create bucket"

4. Set up storage policies for the `project-files` bucket:

```sql
-- Allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'project-files');

-- Allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'project-files');
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project-timeline/
├── app/
│   ├── api/
│   │   └── analyse/          # OpenAI Vision API route
│   ├── upload/               # File upload page
│   ├── results/              # Timeline results page
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Button.tsx            # Reusable button component
│   ├── Card.tsx              # Reusable card component
│   ├── Container.tsx         # Container wrapper
│   └── Loading.tsx           # Loading animation
├── lib/
│   ├── supabase.ts           # Supabase client & utilities
│   ├── business-rules.ts     # Default business rules
│   └── pdf-export.ts         # PDF generation utility
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets
```

## How It Works

1. **Upload**: Users upload architectural drawings (PDF, JPG, PNG)
2. **Storage**: Files are stored in Supabase Storage
3. **Analysis**: The `/api/analyse` endpoint calls OpenAI GPT-4 Vision API with a structured prompt
4. **Processing**: AI extracts structural information and generates a timeline based on business rules
5. **Results**: Timeline is displayed with phases, durations, assumptions, and risk factors
6. **Export**: Users can download a professional PDF report

## Business Rules

The AI uses configurable business rules for timeline generation. Default rules are defined in `lib/business-rules.ts`:

```typescript
{
  phase_defaults: {
    demolition: [2, 5],
    first_fix: [3, 7],
    second_fix: [4, 8],
    plastering: [2, 5],
    flooring: [1, 3],
    painting: [2, 4],
    final_checks: [1, 2],
  },
  mapping_logic: "Match rooms and structural elements to relevant phases...",
  terminology: "Use UK building terms."
}
```

These can be customized per client or project type.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository to Vercel

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`

4. Deploy!

The app will automatically deploy when you push to your main branch.

### Environment Variables for Production

Make sure to update `next.config.mjs` with your Supabase domain:

```javascript
images: {
  domains: ['your-actual-supabase-project.supabase.co'],
}
```

## Customization

### Styling

The app uses an architectural theme with:
- Greys, charcoal, and deep blue accents
- Blueprint-inspired grid patterns
- Thin lines and clean typography

Customize colors in `tailwind.config.ts`:

```typescript
colors: {
  architectural: {
    grey: '#2a2a2a',
    charcoal: '#1a1a1a',
    blue: '#1e40af',
    // ... customize as needed
  }
}
```

### AI Prompt

Modify the AI analysis prompt in `app/api/analyse/route.ts` to adjust output format or add specific requirements.

### PDF Export

Customize the PDF layout and styling in `lib/pdf-export.ts`.

## Security Considerations

- API keys should never be exposed to the client (use server-side only)
- Implement rate limiting for the `/api/analyse` endpoint in production
- Add authentication for production use
- Validate file types and sizes on both client and server
- Set appropriate CORS policies in Supabase

## Troubleshooting

### Upload fails
- Check Supabase storage bucket is public
- Verify storage policies are set correctly

### Analysis fails
- Ensure OpenAI API key has GPT-4 Vision access
- Check API key is correctly set in `.env.local`
- Verify the image URL is publicly accessible

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14, TypeScript, and OpenAI GPT-4 Vision
