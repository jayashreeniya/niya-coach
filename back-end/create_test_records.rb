# Create test HR record
hr_role = BxBlockRolesPermissions::Role.find_by_name("HR")
if hr_role
  # Check if test HR already exists
  test_hr = AccountBlock::Account.find_by(email: "testhr@niya.test")
  if test_hr.nil?
    test_hr = AccountBlock::Account.create!(
      full_name: "Test HR",
      email: "testhr@niya.test",
      full_phone_number: "919999999999",
      password: "Test@1234",
      access_code: "TESTHR001",
      role_id: hr_role.id
    )
    puts "Created HR test record: #{test_hr.id}"
  else
    puts "HR test record already exists: #{test_hr.id}"
  end
else
  puts "HR role not found"
end

# Create test Account record (any role)
test_account = AccountBlock::Account.find_by(email: "testaccount@niya.test")
if test_account.nil?
  test_account = AccountBlock::Account.create!(
    full_name: "Test Account",
    email: "testaccount@niya.test",
    full_phone_number: "919999999998",
    password: "Test@1234"
  )
  puts "Created Account test record: #{test_account.id}"
else
  puts "Account test record already exists: #{test_account.id}"
end

puts "Done creating test records"













