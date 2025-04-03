# Fuel Your Race

A modern web application for planning nutrition strategies during trail races. Built with Next.js, TypeScript, and Mantine UI.

## Features

- Create and manage race profiles with aid stations
- Track nutritional information for your favorite trail running foods
- Plan your nutrition strategy for upcoming races
- Calculate nutritional intake rates during races
- Manage your food pantry with predefined trail running items
- Dark/Light mode support
- Responsive design for all devices

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Mantine UI v7
- CSS Modules
- React Icons

## Prerequisites

- Node.js 18.17 or later
- pnpm 8.15.4 or later

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fuelyourrace.git
cd fuelyourrace
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm clean` - Clean build and dependency directories

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── styles/             # Global styles and CSS modules
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## TODO 
- Google spreadsheet for library of food + Collapsable "Select the food I have"
- Share with button (link to share the printed stickers) 


## Deployment

### Automated Deployment with GitHub Actions

The project is configured to automatically deploy to Vercel when changes are pushed to the `main` branch. To set this up:

1. Create a new project on [Vercel](https://vercel.com)
2. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel authentication token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID

You can find these values in your Vercel project settings.

### Manual Deployment

To deploy manually using the Vercel CLI:

1. Install the Vercel CLI:
```bash
pnpm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

### Environment Variables

Make sure to set up the following environment variables in your Vercel project:
- `NEXT_PUBLIC_API_URL`: Your API URL
- Add any other environment variables your application needs 