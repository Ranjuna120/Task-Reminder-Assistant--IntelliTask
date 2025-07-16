# 🤝 Contributing to IntelliTask

Thank you for your interest in contributing to IntelliTask! We welcome contributions from developers of all skill levels.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Basic knowledge of React and Node.js

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Task-Reminder-Assistant--IntelliTask.git
   cd Task-Reminder-Assistant--IntelliTask/ITPM-30-main
   ```
3. Install dependencies:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```
4. Set up environment variables (copy `.env.example` to `.env`)
5. Start development servers:
   ```bash
   # Backend (in one terminal)
   cd backend && npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm start
   ```

## 📝 How to Contribute

### 🐛 Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide system information
- Add screenshots if applicable

### 💡 Suggesting Features
- Open a GitHub issue with the `enhancement` label
- Describe the feature and its use case
- Provide mockups or examples if possible

### 🔧 Code Contributions

#### 1. Choose an Issue
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to let others know you're working on it

#### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

#### 3. Make Changes
- Follow the existing code style
- Write clear, meaningful commit messages
- Add comments for complex logic
- Update documentation if needed

#### 4. Test Your Changes
```bash
# Run frontend tests
cd frontend && npm test

# Test backend functionality
cd backend && npm test
```

#### 5. Submit a Pull Request
- Push your branch to your fork
- Create a pull request with a clear title and description
- Link to the related issue
- Wait for review and address feedback

## 📋 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable and function names
- Prefer functional components with hooks
- Use proper PropTypes or TypeScript

### CSS
- Use BEM methodology for class naming
- Prefer CSS Grid and Flexbox for layouts
- Use CSS custom properties for theming
- Keep styles modular and component-specific

### Git Commits
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when applicable

## 🏗️ Project Structure

```
ITPM-30-main/
├── backend/
│   ├── controllers/     # Business logic
│   ├── routers/        # API routes
│   ├── websocket.js    # WebSocket management
│   └── server.js       # Main server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   └── config/     # Configuration files
│   └── public/         # Static assets
└── database/           # SQL schemas
```

## 🧪 Testing

### Frontend Testing
- Write unit tests for components
- Use React Testing Library
- Test user interactions and accessibility

### Backend Testing
- Write API endpoint tests
- Test database operations
- Mock external services

### Integration Testing
- Test complete user workflows
- Verify WebSocket functionality
- Test email notifications

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Document API endpoints
- Include examples in pull requests

## 🎯 Areas for Contribution

### 🚀 High Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Test coverage increase

### 💡 Feature Ideas
- Task templates
- Team collaboration features
- Calendar integration
- Advanced analytics
- Mobile app (React Native)

### 🔧 Technical Improvements
- TypeScript migration
- PWA features
- Offline functionality
- Enhanced security

## 🌟 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to join the core team (for significant contributions)

## 📞 Getting Help

- Join our Discord community
- Open a discussion on GitHub
- Reach out to maintainers
- Check existing issues and PRs

## 📋 Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style guidelines
- [ ] Tests pass and new tests are added
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] PR description explains the changes
- [ ] No merge conflicts exist
- [ ] Screenshots included for UI changes

## 🚫 What NOT to Contribute

- Breaking changes without discussion
- Features that don't align with project goals
- Code that doesn't follow style guidelines
- Commits with sensitive information
- Large refactors without prior approval

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to IntelliTask! Together, we can build an amazing task management solution! 🚀
