namespace :app do
  desc "Verify seeded data by printing record counts"
  task verify_seed: :environment do
    begin
      puts "AdminUser count: #{AdminUser.count}"
    rescue => e
      puts "AdminUser check error: #{e.message}"
    end

    begin
      puts "Languages count: #{BxBlockLanguageOptions::Language.count}"
    rescue => e
      puts "Languages check error: #{e.message}"
    end

    begin
      puts "ContentTypes count: #{BxBlockContentManagement::ContentType.count}"
    rescue => e
      puts "ContentTypes check error: #{e.message}"
    end

    begin
      puts "Categories count: #{BxBlockCategories::Category.count}"
    rescue => e
      puts "Categories check error: #{e.message}"
    end

    begin
      puts "SubCategories count: #{BxBlockCategories::SubCategory.count}"
    rescue => e
      puts "SubCategories check error: #{e.message}"
    end
  end

  desc "Write seeded data counts to tmp/seed_counts.txt"
  task dump_seed_counts: :environment do
    begin
      counts = {
        admin_users: AdminUser.count,
        languages: (defined?(BxBlockLanguageOptions::Language) ? BxBlockLanguageOptions::Language.count : 'n/a'),
        content_types: (defined?(BxBlockContentManagement::ContentType) ? BxBlockContentManagement::ContentType.count : 'n/a'),
        categories: (defined?(BxBlockCategories::Category) ? BxBlockCategories::Category.count : 'n/a'),
        subcategories: (defined?(BxBlockCategories::SubCategory) ? BxBlockCategories::SubCategory.count : 'n/a')
      }
      FileUtils.mkdir_p(Rails.root.join('tmp'))
      File.write(Rails.root.join('tmp', 'seed_counts.txt'), counts.to_s)
      puts "Wrote tmp/seed_counts.txt"
    rescue => e
      puts "Error writing seed counts: #{e.message}"
    end
  end
end


