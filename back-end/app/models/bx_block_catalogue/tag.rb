module BxBlockCatalogue
  class Tag < BxBlockCatalogue::ApplicationRecord
    self.table_name = :catalogue_tags

    has_and_belongs_to_many :catalogue, join_table: :catalogues_tags#,
                            #foreign_key: 'catalogue_tag_id'
  end
end
