class ActiveAdminConstraint
  def matches?(request)
    request.path.start_with?('/admin')
  end
end 
