require 'swagger_helper'
require 'rails_helper'

RSpec.describe BxBlockAudiolibrary::AudiosController, type: :request do
  describe "GET #audio_list" do
    context "when JSON Web Token is valid" do
      let(:account) { Support::SharedHelper.new.current_user }
      let(:headers) { { "token" => BuilderJsonWebToken::JsonWebToken.encode(account.id) } }
    

      it "returns the audio files based on the focus areas" do
        get URI.encode("http://www.example.com/bx_block_audiolibrary/audio_list"), headers: headers
        expect(response).to have_http_status(200)   
      end
    end

    context "when JSON Web Token is invalid" do
      before { get URI.encode("http://www.example.com/bx_block_audiolibrary/audio_list"), headers: { 'Authorization': "Bearer invalid_token" } }

      it "returns unauthorized status" do
        expect(response).to have_http_status(400)
      end
    end
  end
end