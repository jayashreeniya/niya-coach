class AddColorToAnixetyCutoffs < ActiveRecord::Migration[6.0]
  def change
    add_column :anixety_cutoffs, :color, :string
  end
end
