namespace :app do
  desc "Run db:seed and then seed default lookup data (languages, content types, categories)"
  task seed_defaults: :environment do
    # Run the standard seeds first
    Rake::Task['db:seed'].invoke

    puts "Seeding default languages..."
    BxBlockLanguageOptions::BuildLanguages.call

    puts "Seeding default content types..."
    BxBlockContentManagement::BuildContentType.call

    puts "Seeding default categories/subcategories..."
    BxBlockCategories::BuildCategories.call

    puts "Seed defaults completed."
  end
end


