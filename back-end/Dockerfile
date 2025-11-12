FROM ruby:2.7.5-alpine3.13
ARG RAILS_ENV=production
ENV RAILS_ENV="${RAILS_ENV}"
ENV APP_VERSION=${TAG}
RUN apk update
RUN apk add bash build-base libxml2-dev libxslt-dev mysql-dev nodejs vim yarn libc6-compat curl git which wkhtmltopdf ttf-ubuntu-font-family imagemagick
RUN mkdir /app
WORKDIR /app
COPY Gemfile.deploy ./Gemfile
RUN gem install bundler -v 2.4.22
RUN bundle install
COPY . .
RUN rm -f Gemfile.lock
RUN bundle install --without development test
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
