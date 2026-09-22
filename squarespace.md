🚀 Angular Deployment to GitHub Pages with Custom Domain

Automated CI/CD pipeline using GitHub Actions, Node 24, and npm 11 to build and deploy this Angular application directly to a custom Squarespace domain (davidsoftware.dev).
📋 Architectural Overview

Instead of hosting the application inside a GitHub repository subfolder (/davidsoftware-dev/), this setup points a custom apex domain natively using standard DNS records.

    The Angular application compiles with a clean root path (--base-href /).
    Deep routing refreshes (e.g., /dashboard) are natively supported on a static host via an automated 404.html fallback file strategy.

🛠️ Step 1: Local Environment Configuration

Ensure your local codebase mirrors the production runner layout:

    Verify your local runtimes:

node -v # Expected: v24.x.x npm -v # Expected: v11.x.x

    Confirm build target in package.json:

"scripts": { "build": "ng build" }
🤖 Step 2: Continuous Integration Workflow (deploy.yml)

Create or update the automated pipeline script at .github/workflows/deploy.yml:

name: Deploy Angular to GitHub Pages on: push: branches: - master permissions: contents: read pages: write id-token: write concurrency: group: "pages" cancel-in-progress: false jobs: build: runs-on: ubuntu-latest steps: - name: Checkout Repository uses: actions/checkout@v4

  - name: Setup Node.js (Matching Local Environment)
    uses: actions/setup-node@v4
    with:
      node-version: '24'
      cache: 'npm'

  - name: Update npm
    run: npm install -g npm@11.19.0

  - name: Install Dependencies
    run: npm ci

  - name: Build Angular App
    # 1. Compiles the app for the absolute root domain
    # 2. Generates the 404 fallback layout for deep-page routing refreshes
    # 3. Bundles the CNAME marker file targeting your custom domain
    run: |
      npm run build -- --configuration production --base-href /
      cp dist/my-angular-app/browser/index.html dist/my-angular-app/browser/404.html
      echo "davidsoftware.dev" > dist/my-angular-app/browser/CNAME
  - name: Upload Artifact
    uses: actions/upload-pages-artifact@v3
    with:
      path: 'dist/my-angular-app/browser/.'

deploy: needs: build runs-on: ubuntu-latest environment: name: github-pages url: ${{ steps.deployment.outputs.page_url }} steps: - name: Setup Pages uses: actions/configure-pages@v5

  - name: Deploy to GitHub Pages
    id: deployment
    uses: actions/deploy-pages@v4

🌐 Step 3: Squarespace DNS Settings Table

Log into your Squarespace Domains Dashboard, navigate to DNS Settings, delete any conflicting default placeholder records, and append the following 5 rows to the custom management panel:
Host / Name 	Type 	Data / Points To 	Purpose
www 	CNAME 	x86david.github.io 	Maps your canonical subdomain to GitHub
@ 	A 	185.199.108.153 	GitHub Anycast Routing IP 1
@ 	A 	185.199.109.153 	GitHub Anycast Routing IP 2
@ 	A 	185.199.110.153 	GitHub Anycast Routing IP 3
@ 	A 	185.199.111.153 	GitHub Anycast Routing IP 4
🔐 Step 4: Activating GitHub Pages Handshake

    Push your updated workflow configuration to your remote tracking tracking timeline:

git add .github/workflows/deploy.yml git commit -m "ci: optimize deployment for davidsoftware.dev" git push -u origin master

    Navigate to your repository page on GitHub.com.
    Go to Settings → Pages (under the "Code and automation" section).
    Under Build and deployment, ensure the source dropdown configuration is set to GitHub Actions.
    Scroll down to Custom Domain, input davidsoftware.dev, and click Save.
    Once the global DNS propagation finishes successfully, check the box labeled Enforce HTTPS to secure the connection with an automated, free SSL certificate.

⚠️ Maintenance & Quirks Checklist

    Propagation Wait: When changing the underlying DNS routing tables inside Squarespace, it can take anywhere from 5 minutes to 24 hours for your browser to resolve the new IP address mappings globally.
    Hard Refreshing: If your layout edits do not visibly show up right after a successful workflow run, use Ctrl + F5 (Windows) or Cmd + Shift + R (Mac) to bypass local browser caches.
