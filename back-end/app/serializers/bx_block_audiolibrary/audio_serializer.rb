module BxBlockAudiolibrary
	class AudioSerializer < BaseSerializer
		include JSONAPI::Serializer

		attributes :file_info do |j, params|
			file = []
			if j.multiple_file.attached? && params[:url]
				file_details={
					title: j.file_name,
					description: j.file_discription,
					focus_areas: j.focus_areas,
					url: params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.multiple_file,
					only_path: true), content_type: j.multiple_file.content_type
				} 
				file<<file_details
			end
   	  	file 
		end
	end
end
