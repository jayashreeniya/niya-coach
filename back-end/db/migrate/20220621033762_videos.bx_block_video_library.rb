# This migration comes from bx_block_video_library (originally 20210314172108)
class Videos < ActiveRecord::Migration[6.0]
  def change
    create_table :videos do |t|
      t.references :account, null: false, foreign_key: true
      t.string :video
      t.text :write_a_brief_introduction

      t.timestamps
    end
  end
end

