require "azure/storage/blob"

module Azure
  module Storage
    module Core
      module Auth
        SharedAccessSignature = ::Azure::Storage::Blob::Core::Auth::SharedAccessSignature
      end
    end
  end
end

