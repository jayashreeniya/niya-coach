require 'rails_helper'

RSpec.describe BxBlockAudiolibrary::FileType, type: :model do
  it { should belong_to(:multiple_upload_file) }
  it { should have_one_attached(:multiple_file) }
end
