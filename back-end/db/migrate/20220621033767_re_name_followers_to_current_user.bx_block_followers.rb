# This migration comes from bx_block_followers (originally 20201120092137)
class ReNameFollowersToCurrentUser < ActiveRecord::Migration[6.0]
  def change
    rename_column :followers_follows, :followable_id, :current_user_id
  end
end
