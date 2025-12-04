FROM ruby:2.7.5-alpine3.13
ARG RAILS_ENV=production
ENV RAILS_ENV="${RAILS_ENV}"
ENV APP_VERSION=${TAG}
RUN apk update
RUN apk add bash build-base libxml2-dev libxslt-dev mysql-dev nodejs vim yarn libc6-compat curl git which wkhtmltopdf ttf-ubuntu-font-family imagemagick tzdata
RUN mkdir /app
WORKDIR /app
COPY Gemfile.deploy ./Gemfile
RUN gem install bundler -v 2.4.22
# First install: Create temporary Gemfile without private gems to install public gems only
RUN sed -e '/^gem.*account_block/d' -e '/^gem.*bx_block_/d' -e '/^gem.*builder_base/d' Gemfile > Gemfile.tmp && mv Gemfile.tmp Gemfile
RUN bundle install
RUN bundle lock --add-platform x86_64-linux-musl
# Copy vendor/cache and all source code
COPY vendor/cache ./vendor/cache
COPY . .
# Restore Gemfile.deploy as Gemfile - it now includes all bx_block_* gems from vendor/cache
COPY Gemfile.deploy ./Gemfile
# Second install: Install private gems from vendor/cache (bundler will use cached gems when available)
# Note: We can't use --local here because it requires ALL dependencies in cache, but we'll use cached gems when possible
RUN bundle install --without development test
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
