# Clean Ruby on Rails Setup for Windows

## Option 1: RubyInstaller with DevKit (Recommended)

### Step 1: Download and Install
1. **Download RubyInstaller with DevKit:**
   - Go to: https://rubyinstaller.org/downloads/
   - Download: **Ruby+Devkit 3.0.6-1 (x64)** or **Ruby+Devkit 2.7.8-1 (x64)**
   - This includes both Ruby and the DevKit needed for compiling native gems

### Step 2: Install MySQL Connector
1. **Download MySQL Connector/C:**
   - Go to: https://dev.mysql.com/downloads/connector/c/
   - Download: **MySQL Connector/C 8.0.33** (Windows x64)
   - Extract to: `C:\mysql-connector-c-8.0.33-winx64`

### Step 3: Install Ruby and Gems
```bash
# Install mysql2 gem with proper paths
gem install mysql2 --platform=ruby -- --with-mysql-dir=C:\mysql-connector-c-8.0.33-winx64

# Install Rails
gem install rails

# Install bundler
gem install bundler
```

## Option 2: Use WSL2 (Windows Subsystem for Linux)

### Step 1: Install WSL2
```powershell
# Run in PowerShell as Administrator
wsl --install
```

### Step 2: Install Ruby in WSL2
```bash
# Update packages
sudo apt update

# Install Ruby and dependencies
sudo apt install ruby-full build-essential libmysqlclient-dev

# Install gems
gem install mysql2 rails bundler
```

## Option 3: Use Docker (Easiest)

### Step 1: Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Create Dockerfile
```dockerfile
FROM ruby:3.0-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Gemfile* ./
RUN bundle install

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
```

## Recommendation

**I recommend Option 1 (RubyInstaller with DevKit)** because:
- ✅ Native Windows performance
- ✅ Easy mysql2 compilation
- ✅ No virtualization overhead
- ✅ Direct access to your Azure database
- ✅ Works with your existing PowerShell environment

Would you like me to help you with any of these options?
