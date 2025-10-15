# Resumate - AI-Powered Resume Builder

> **📖 SOURCE-AVAILABLE - FREE FOR NON-COMMERCIAL USE**
>
> Copyright © 2025 Resumate. All Rights Reserved.
>
> ✅ **FREE** for personal, educational, and non-commercial projects  
> 💰 **Commercial license required** for business/revenue-generating use
>
> 📧 Contact: etherjoon@gmail.com
>
> 🔗 GitHub: https://github.com/DecoderX108/resumate

---

A modern, professional CV/Resume builder application built with React, TypeScript, and Vite. Features AI-powered content generation using Ollama (Local LLM), beautiful templates, and multiple export formats.

## � LICENSE INFORMATION

### ✅ **FREE for Non-Commercial Use**

You can **freely use, view, and modify** this software for:

- 📚 **Personal projects** - Create your own resume
- 🎓 **Learning & education** - Study the code, learn React/TypeScript
- 💼 **Portfolio projects** - Showcase in your portfolio
- 🔬 **Research** - Academic and non-commercial research
- 🎨 **Experimentation** - Try new features and modifications

**Requirements:**

- Keep copyright notices intact
- Give credit to Resumate in your project
- Link back to this repository
- Don't use commercially without a license

### 💰 **Commercial License Required For:**

You **MUST purchase a license** if you want to:

- ❌ Sell resume building services to clients
- ❌ Charge users for CV creation
- ❌ Use in commercial products or services
- ❌ Offer as SaaS or subscription service
- ❌ White-label for clients or businesses
- ❌ Generate revenue from the software
- ❌ Use in freelance/client projects

### 📋 Commercial License Options:

1. **Freelancer License** - Independent contractors ($99/year)
2. **Business License** - Companies up to 10 users ($499/year)
3. **Enterprise License** - Unlimited users + priority support (Custom)
4. **White-Label/OEM** - Rebrand and resell rights (Custom)

**Get a commercial license:** etherjoon@gmail.com

---

## 🚀 Features

### 🎨 **Professional Templates**

- **Chicago Professional**: Clean, traditional layout
- **Modern Executive**: Contemporary design with accent colors
- **Creative Portfolio Pro**: Bold design for creative roles
- **Tech Specialist**: Technical-focused layout
- **Fresh Graduate**: Entry-level optimized template
- Print-friendly and ATS-optimized layouts
- Responsive design for all devices

### 🤖 **AI-Powered Content Generation**

- **Local LLM Integration**: Uses Ollama for privacy and cost benefits
- **Position-Specific Content**: Generates role-tailored professional content
- **Interactive Chat Interface**: Guided questions for personalized content
- **Industry-Aware**: Adapts language and focus for different industries
- **Experience-Level Appropriate**: Content for entry-level to executive roles
- **Fallback Support**: Template-based generation when Ollama unavailable

### 📝 **Comprehensive CV Sections**

- Personal Information with contact details
- Professional Summary with AI assistance
- Work Experience with achievement-focused descriptions
- Education with relevant coursework
- Skills (Technical, Soft, Languages, Tools, Frameworks)
- Awards & Achievements
- Custom sections for specialized content

### 🎨 **Modern UI/UX**

- Dark/Light theme support
- Real-time preview
- Responsive design
- Form validation
- Smooth animations

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon set

### AI Integration

- **Ollama** - Local LLM server for AI content generation
- **Axios** - HTTP client for API communication

### Export & PDF

- **jsPDF** - PDF generation from HTML
- **html2canvas** - HTML to canvas conversion
- **React-to-Print** - Print functionality

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd resumate
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5174`

## 🤖 AI Integration Setup (Ollama)

Resumate uses Ollama for local AI-powered content generation. This provides privacy and cost benefits compared to cloud-based APIs.

### Step 1: Install Ollama

1. Visit [ollama.com](https://ollama.com) and download Ollama for your operating system
2. Install Ollama following the platform-specific instructions

### Step 2: Start Ollama Service

```bash
ollama serve
```

The service will start on `http://localhost:11434`

### Step 3: Install a Language Model

Install a language model (we recommend Llama 3.1):

```bash
ollama pull llama3.1
```

You can also use other models:

```bash
ollama pull llama3.2
ollama pull mistral
ollama pull codellama
```

### Step 4: Verify Setup

1. Open Resumate in your browser
2. Click on any "AI Generate" button in the CV builder
3. The app will show an Ollama status indicator in the chat interface
4. If properly configured, you should see "AI Ready" status

### Troubleshooting AI Setup

**Ollama Not Available:**

- Ensure Ollama service is running: `ollama serve`
- Check if the service is accessible at `http://localhost:11434`

**No Models Installed:**

- Install at least one model: `ollama pull llama3.1`
- Check available models: `ollama list`

**Connection Issues:**

- Verify firewall settings allow localhost connections
- Restart Ollama service if needed

## 📝 How to Use

1. **Choose Your Mode**:

   - Analyze existing CV
   - Build from scratch

2. **Select Template**:

   - Browse professional templates
   - Preview designs before selection

3. **Fill Information**:

   - Add personal details
   - Enter work experience
   - Include education background
   - List skills and achievements

4. **AI Assistance**:

   - Use AI chat for position-specific content
   - Answer guided questions for personalized results
   - Generate professional summaries and descriptions

5. **Preview & Edit**:

   - Real-time preview updates
   - Switch between light/dark themes
   - Responsive design preview

6. **Export**:
   - Download as PDF
   - Export to Word document
   - Print-ready formatting

## 🎯 AI Content Generation Details

The AI system creates professional, position-specific content through:

### Smart Prompting

- Role-aware prompt engineering
- Industry-specific language adaptation
- Experience-level appropriate content
- Achievement-focused descriptions

### Interactive Chat Flow

1. **Role Identification**: What position are you targeting?
2. **Experience Assessment**: Years of experience in the field
3. **Skills Analysis**: Key technical and soft skills
4. **Achievement Capture**: Major accomplishments
5. **Goal Alignment**: Target company/role preferences

### Content Types Generated

- **Professional Summaries**: 2-3 compelling sentences
- **Experience Bullets**: Achievement-focused job descriptions
- **Skills Lists**: Role-relevant technical and soft skills
- **Education Details**: Relevant coursework and projects
- **Achievements**: Quantified accomplishments

## 🔥 Key Features Explained

### Template System

Each template is designed for specific use cases:

- **Traditional roles**: Chicago Professional
- **Leadership positions**: Modern Executive
- **Creative fields**: Creative Portfolio Pro
- **Tech roles**: Tech Specialist
- **New graduates**: Fresh Graduate

### Export Capabilities

- **High-quality PDFs**: Vector-based, print-ready
- **Word Documents**: Editable .docx format
- **Consistent Formatting**: Maintains design integrity
- **Multiple Formats**: Choose based on application requirements

### AI Fallback System

- **Primary**: Ollama local LLM for best results
- **Fallback**: Template-based generation ensures functionality
- **Error Handling**: Graceful degradation when AI unavailable
- **Performance**: Fast response times with local processing

## 🚧 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── OllamaStatusIndicator.tsx
├── context/            # React Context (CV state management)
├── pages/              # Main application pages
│   ├── HomePage.tsx
│   ├── TemplatesPage.tsx
│   └── CVBuilderPage.tsx
├── utils/              # Utility functions and services
│   ├── ollamaService.ts
│   ├── aiUtils.ts
│   └── exportUtils.ts
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

### Key Files

- **`src/utils/ollamaService.ts`** - Ollama integration service
- **`src/utils/aiUtils.ts`** - AI content generation utilities
- **`src/pages/CVBuilderPage.tsx`** - Main CV builder interface
- **`src/components/OllamaStatusIndicator.tsx`** - AI status component
- **`src/context/CVContext.tsx`** - Global state management

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Configuration

Create `.env.local` file for custom settings:

```env
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_DEFAULT_MODEL=llama3.1
```

---

## 📄 License

**SOURCE-AVAILABLE - NON-COMMERCIAL LICENSE**

Copyright © 2025 Resumate. All Rights Reserved.

### ✅ Non-Commercial Use (FREE)

You may **freely use, study, and modify** this software for:

- ✅ Personal projects and resume creation
- ✅ Learning and educational purposes
- ✅ Research and academic work
- ✅ Portfolio and demo projects
- ✅ Open source contributions (non-commercial)

**Requirements:**

- Maintain copyright notices
- Provide attribution to Resumate
- Include link to repository
- Do not use commercially without license

### � Commercial Use (License Required)

Commercial use requires a valid commercial license from Resumate.

**Prohibited without license:**

- ✗ Selling the software or services based on it
- ✗ Using in commercial/business revenue operations
- ✗ Offering as SaaS or paid service
- ✗ White-labeling or rebranding for profit
- ✗ Client projects or freelance commercial work

### 📋 Get a Commercial License

**Pricing:**

- Freelancer: $99/year
- Business (up to 10 users): $499/year
- Enterprise: Custom pricing

**Contact:**

- **Email**: etherjoon@gmail.com
- **GitHub**: https://github.com/DecoderX108/resumate

For full license terms, see [LICENSE.md](./LICENSE.md)

---

## 📞 Contact & Support

**Commercial Licensing:**

- 📧 etherjoon@gmail.com
- 💼 GitHub: https://github.com/DecoderX108/resumate

**Technical Support:**

- 📧 etherjoon@gmail.com
- 🐛 GitHub Issues: https://github.com/DecoderX108/resumate/issues

**General Inquiries:**

- 📧 etherjoon@gmail.com
- 🌐 GitHub: https://github.com/DecoderX108/resumate

---

## 🤝 Contributing

We welcome contributions from non-commercial users!

**For non-commercial users:**

- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features
- 📖 Improve documentation
- 🔧 Submit pull requests (for non-commercial improvements)

**For commercial improvements:**

- Contact etherjoon@gmail.com for contributor agreements

**Guidelines:**

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commits
4. Add tests if applicable
5. Submit a pull request with description

**Note:** By contributing, you agree that your contributions will be licensed under the same terms as this project.

---

## ⚖️ Legal Notice

**For Personal/Educational Users:**  
Enjoy the software freely! Just give credit and don't commercialize it.

**For Commercial Users:**  
Support development by purchasing a license. We offer fair pricing for individuals, startups, and enterprises.

**Everyone:**  
Built with ❤️ by the Resumate team. If you find it useful:

- ⭐ Star this repository
- 📢 Share with others
- 🐛 Report bugs
- 💰 Get a license if using commercially

---

**© 2025 Resumate. All Rights Reserved.**

**Free for non-commercial use | Commercial license required for business/revenue use**

## 📞 Support

If you encounter issues:

1. **Check Ollama Status**: Use the built-in status indicator
2. **Verify Setup**: Ensure Ollama service and models are installed
3. **Console Errors**: Check browser developer tools
4. **Documentation**: Refer to this README for troubleshooting

### Common Issues

**Template not loading**: Refresh browser cache
**AI generation fails**: Check Ollama service status
**Export issues**: Ensure popup blockers are disabled
**Responsive problems**: Clear browser cache and cookies

---

Built with ❤️ using React, TypeScript, and Ollama for local AI processing.
