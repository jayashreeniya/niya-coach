class BxBlockRoles::RolesController < ApplicationController

	def create
		role = BxBlockRolesPermissions::Role.new(role_params) 
		if role.save
			render json: role
		else
			render json: {error: "Invalid Parameters"}
		end
	end

	private
	def role_params
		params.require(:role).permit(:name)
	end
end
