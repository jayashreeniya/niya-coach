module BxBlockSettings
  class SettingSerializer < BaseSerializer
    attributes *[
        :name,
        :title
    ]
  end
end
