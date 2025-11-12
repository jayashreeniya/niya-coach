# This migration comes from bx_block_video_library (originally 20211209143147)
class FixVideosTableName < ActiveRecord::Migration[6.0]
  def change
    rename_table :videos, :video_library_videos
  end
end
