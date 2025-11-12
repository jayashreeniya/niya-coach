module BxBlockAddress
	class FocusAreaSerializer
		include JSONAPI::Serializer

	    attributes :assesment_test_type_answers do |object|
	    	BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: object&.multiple_answers)
	    end
	end
end
