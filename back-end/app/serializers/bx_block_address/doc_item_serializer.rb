module BxBlockAddress
	class DocItemSerializer < BaseSerializer
		include JSONAPI::Serializer
		require 'open-uri'

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
					url: params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.multiple_file,only_path: true), 
					content_type: j.multiple_file.content_type,
					text_file_to_str: j.text_file_to_str ,
					thumbnail: image
				} 

				fileurl=params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.multiple_file,
				only_path: true) 
				# if j.multiple_file.attached? && params[:url]
				# file_content=nil
				if j&.multiple_file.record&.text_file_blob&.content_type == "text/plain"
					file_content= j.text_file.attached? ? j.text_file.download : nil
				else
					file_content = j.file_content
				end
				
				# begin
				# 	status = Timeout::timeout(10) do
				# 		open(fileurl) { |f| 
				# 			file_content=f.read.force_encoding("ISO-8859-1").encode("UTF-8")
				# 		}
				# 	end
				# rescue => exception
					
				# end

				file_details&.store(:file_content,file_content)
				file<<file_details
			end
   	  file 
		end
	end
end


