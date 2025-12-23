"""
Check what format Phonelib expects for phone numbers.
According to the backend code, it uses: Phonelib.parse(phone).sanitized
This typically removes the + and formats it as just digits.
"""

# The phone number in database
db_phone = '+919876543210'

# Phonelib.sanitized typically returns just digits
sanitized_phone = '919876543210'

print("Phone number formats:")
print(f"  In database: {db_phone}")
print(f"  After Phonelib sanitization: {sanitized_phone}")
print()
print("Let's update the SQL to use the sanitized format...")













