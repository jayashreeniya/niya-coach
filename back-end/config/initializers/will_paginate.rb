##https://stackoverflow.com/questions/14958438/rails-activeadmin-undefined-method-per-for-activerecordrelation0x4d15ee

if defined?(WillPaginate)
  module WillPaginate
    module ActiveRecord
      module RelationMethods
        def per(value = nil) per_page(value) end
        def total_count() count end
      end
    end
    module CollectionMethods
      alias_method :num_pages, :total_pages
    end
  end
end
