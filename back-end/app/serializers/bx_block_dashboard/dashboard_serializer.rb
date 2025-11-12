module BxBlockDashboard
  class DashboardSerializer < BaseSerializer
    attributes :id, :title, :value, :created_at, :updated_at
  end
end
