#!/bin/bash

# Azure App Service deployment script for Rails

echo "Starting Rails deployment..."

# Install dependencies
echo "Installing dependencies..."
bundle install --deployment --without development test

# Precompile assets
echo "Precompiling assets..."
RAILS_ENV=production bundle exec rails assets:precompile

# Run database migrations
echo "Running database migrations..."
RAILS_ENV=production bundle exec rails db:migrate

# Seed the database
echo "Seeding database..."
RAILS_ENV=production bundle exec rails db:seed

echo "Deployment completed successfully!"






