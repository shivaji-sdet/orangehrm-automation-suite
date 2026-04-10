# OrangeHRM Automation Suite

Playwright test automation framework for [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/) — built as a replica of the LumberFi automation framework architecture.

## 🏗️ Framework Architecture

```
orangehrm-automation-suite/
├── tests/
│   ├── e2e/                          # End-to-end test specs
│   │   ├── auth/                     # Authentication tests
│   │   ├── dashboard/                # Dashboard tests
│   │   ├── pim/                      # PIM (Employee) tests
│   │   ├── leave/                    # Leave management tests
│   │   ├── recruitment/              # Recruitment tests
│   │   ├── admin/                    # Admin module tests
│   │   └── config/                   # Auth credentials config
│   ├── fixtures/                     # Test fixtures
│   │   ├── environments/             # Environment configuration
│   │   ├── global-setup.ts           # Global setup hook
│   │   └── global-teardown.ts        # Global teardown hook
│   └── utils/                        # Utilities
│       ├── base/                     # BaseTest class
│       ├── helpers/                  # Test helpers
│       ├── page-objects/             # Page Object Model
│       ├── test-data/                # Test data factories
│       ├── reporters/                # Custom reporters
│       └── performance/              # Performance utilities
├── scripts/                          # Utility scripts
├── screenshots/                      # Test screenshots
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── .env                              # Environment variables
└── .env.example                      # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd orangehrm-automation-suite

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run in headed mode (see the browser)
npm run test:headed

# Run specific module
npm run test:auth
npm run test:pim
npm run test:leave
npm run test:dashboard
npm run test:admin

# Run only Chrome
npm run test:chrome

# Run smoke tests
npm run test:ci:smoke

# Run with debug mode
npm run test:debug

# Run CI mode
npm run test:ci
```

### View Reports

```bash
npm run report
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Key variables:
- `NODE_ENV` - Environment (development/staging/production)
- `STAGING_ADMIN_USERNAME` - OrangeHRM username (default: Admin)
- `STAGING_ADMIN_PASSWORD` - OrangeHRM password (default: admin123)

### Multi-Environment Support

```bash
# Run against staging
npm run test:staging

# Run against development
npm run test:development

# Run against production
npm run test:production
```

## 📋 Test Modules

| Module       | Tests | Description                          |
|-------------|-------|--------------------------------------|
| Auth        | 3     | Login, invalid creds, empty creds    |
| Dashboard   | 4     | Load, widgets, quick launch, nav     |
| PIM         | 7     | Add employee, list, search, validate |
| Leave       | 4     | Navigation, list, apply, tabs        |
| Admin       | 4     | Load, search, sub-menu, add button   |
| Recruitment | 2     | Load, sub-menu tabs                  |

## 🏷️ Test Tags

- `@smoke` — Critical path tests for CI/CD
- `@daily` — Daily regression tests

```bash
# Run smoke tests only
npx playwright test --grep="@smoke"

# Run daily tests only
npx playwright test --grep="@daily"
```

## 🔑 Default Credentials

| Username | Password  |
|----------|-----------|
| Admin    | admin123  |

## 📊 CI/CD

Framework is CI/CD ready with:
- GitHub Actions reporter
- HTML, JSON, JUnit, Blob reporters
- Single worker in CI for stability
- Auto-retry on failure
- Custom Progress Reporter

## 🛠️ Framework Patterns

- **BaseTest Class** — Centralized test setup with Playwright fixtures
- **Page Object Model** — Encapsulated page interactions
- **Environment Manager** — Singleton for multi-env config
- **Test Data Factories** — Reusable test data generation
- **Custom Reporter** — Detailed console progress output
- **Helper Utilities** — Navigation, form, table helpers
