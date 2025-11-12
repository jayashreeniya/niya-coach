require 'rails_helper'

RSpec.describe BxBlockUpload::FileType, type: :model do
  it { should belong_to(:multiple_upload_file) }
  it { should have_one_attached(:multiple_file) }
  it { should have_one_attached(:image) }
end
