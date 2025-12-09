# Coach Specialization Issue - December 8, 2025

## Problem
Unable to add Coach Specialization through the admin panel. The form shows "can't be blank" error for focus_areas even when checkboxes are selected.

## Root Cause
ActiveAdmin checkboxes send an array with an empty string as the first element: `["", "28", "29"]`

This is Rails default behavior to handle unchecked checkboxes.

## What We Tried

### Attempt 1: Add array serialization
```ruby
serialize :focus_areas, Array
```
**Result:** Still failed - empty string was in the array

### Attempt 2: Clean up in before_save callback
```ruby
before_save :clean_up_focus_areas
def clean_up_focus_areas
  self.focus_areas = focus_areas.compact.reject(&:blank?)
end
```
**Result:** Validation ran BEFORE cleanup

### Attempt 3: Change to before_validation
```ruby
before_validation :clean_up_focus_areas
```
**Result:** Still failed

### Attempt 4: Override controller create/update methods
```ruby
controller do
  def create
    params[:coach_specialization][:focus_areas].reject!(&:blank?)
    super
  end
end
```
**Result:** Controller override didn't execute properly

### Attempt 5: Use before_action
```ruby
controller do
  before_action :clean_focus_areas_params, only: [:create, :update]
  
  def clean_focus_areas_params
    params[:coach_specialization][:focus_areas].reject!(&:blank?)
  end
end
```
**Result:** Still showing empty string in logs

## Current Code State

### Model: `back-end/app/models/coach_specialization.rb`
```ruby
class CoachSpecialization < ApplicationRecord
  serialize :focus_areas, Array
  validates :expertise, uniqueness: true
  before_validation :clean_up_focus_areas
  validate :focus_areas_must_have_values

  private

  def clean_up_focus_areas
    self.focus_areas = focus_areas.compact.reject(&:blank?) if focus_areas.is_a?(Array)
  end

  def focus_areas_must_have_values
    if focus_areas.blank? || focus_areas.compact.reject(&:blank?).empty?
      errors.add(:focus_areas, "can't be blank")
    end
  end
end
```

### ActiveAdmin: `back-end/app/admin/coach_specializations.rb`
```ruby
ActiveAdmin.register CoachSpecialization do
  permit_params :expertise, :focus_areas => []
  
  controller do
    before_action :clean_focus_areas_params, only: [:create, :update]

    def clean_focus_areas_params
      if params[:coach_specialization] && params[:coach_specialization][:focus_areas].is_a?(Array)
        params[:coach_specialization][:focus_areas].reject!(&:blank?)
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :expertise
      f.input :focus_areas, as: :check_boxes, 
              collection: BxBlockAssessmenttest::AssesmentTestTypeAnswer.all.map{|x| [x.answers, x.id]},
              label: 'Focus Areas'
    end
    f.actions
  end
end
```

## Logs Show
```
Parameters: {
  "coach_specialization" => {
    "expertise" => "Anxiety Depression",
    "focus_areas" => ["", "28", "29"]  # Empty string still present!
  }
}
```

The `before_action` is not removing the empty string as expected.

## Workarounds

### Option 1: Create via SQL
```sql
INSERT INTO coach_specializations (expertise, focus_areas, created_at, updated_at)
VALUES ('Anxiety Depression', '[28,29]', NOW(), NOW());
```

### Option 2: Use different input type
Change from `check_boxes` to `select` with `multiple: true`:
```ruby
f.input :focus_areas, as: :select, 
        input_html: { multiple: true },
        collection: BxBlockAssessmenttest::AssesmentTestTypeAnswer.all.map{|x| [x.answers, x.id]}
```

### Option 3: Custom JavaScript
Add JavaScript to remove empty values before form submission.

### Option 4: Accept the limitation
Document that Coach Specializations should be created via:
- Direct SQL
- Rails console
- API endpoint (if available)

## Recommendation

**Option 1 (Immediate):** Create coach specializations via SQL for now.

**Option 2 (Later):** Investigate why ActiveAdmin's `before_action` isn't working properly - might need to check:
- ActiveAdmin version compatibility
- Rails strong parameters interaction
- Custom deserializer needed

## Next Steps

1. If coaches are needed urgently, use SQL to create records
2. Test the rest of the booking functionality with manually created coach specializations
3. Come back to fix this admin panel issue after other priorities are done

## Current Deployment
- Latest code deployed: Build `ca61`
- Revision: `niya-admin-app-india--0000140` (if deployed)
- All fixes are in production but still not working


