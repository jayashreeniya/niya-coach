require "azure/storage/blob"
require "azure/storage/common"

module Azure
  module Storage
    module Core
      module Auth
        # For azure-storage-blob v1.1.0, SharedAccessSignature is in azure-storage-common
        # Try to find it in the correct namespace
        if defined?(::Azure::Storage::Core::Auth::SharedAccessSignature)
          SharedAccessSignature = ::Azure::Storage::Core::Auth::SharedAccessSignature
        elsif defined?(::Azure::Storage::Common::Core::Auth::SharedAccessSignature)
          SharedAccessSignature = ::Azure::Storage::Common::Core::Auth::SharedAccessSignature
        else
          # If neither exists, try to load it from the common gem's actual location
          # In azure-storage-common v1.x, it should be in Azure::Storage::Core::Auth
          # Let's try requiring the specific file
          begin
            require "azure/storage/common/core/auth/shared_access_signature"
            SharedAccessSignature = ::Azure::Storage::Common::Core::Auth::SharedAccessSignature
          rescue LoadError, NameError
            # Last resort: try the blob gem's location
            begin
              require "azure/storage/blob/core/auth/shared_access_signature"
              SharedAccessSignature = ::Azure::Storage::Blob::Core::Auth::SharedAccessSignature
            rescue LoadError, NameError
              raise LoadError, "Could not find SharedAccessSignature in azure-storage-blob v1.1.0. Please check the gem's namespace structure."
            end
          end
        end
      end
    end
  end
end


