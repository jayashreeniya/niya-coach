# Create a new admin user with known credentials
admin = AdminUser.create!(
  email: "test@admin.com",
  password: "password123",
  password_confirmation: "password123"
)
puts "Admin user created successfully: #{admin.email}"
puts "Password: password123"


