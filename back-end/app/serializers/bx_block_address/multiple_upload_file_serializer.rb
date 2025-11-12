module BxBlockAddress
	class MultipleUploadFileSerializer < BaseSerializer
		include JSONAPI::Serializer
		attributes :count do|obj ,params|
			params[:count]
		end
		attributes :file_info do |j, params|
			file = []
			image = if j.image.present?
								params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.image, only_path: true)
							else
								nil
							end
			if j.multiple_file.attached? && params[:url]
				file_details={
					title: j.file_name,
					description: j.file_discription,
					focus_areas: j.focus_areas,
					url: params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.multiple_file,
					only_path: true), content_type: j.multiple_file.content_type ,
					thumbnail: params[:url] + j&.compressed_image_url
				} 
				file<<file_details
			end
   	  	file 
				
		end
	end
end


