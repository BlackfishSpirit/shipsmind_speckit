-- Database trigger to sync clerk_users to user_accounts table
-- This trigger automatically creates a user_accounts entry when a new clerk_users row is inserted

-- First, create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION sync_clerk_user_to_user_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_accounts table when a new clerk user is created
  INSERT INTO user_accounts (
    clerk_id,
    user_email,
    user_firstname,
    user_lastname,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.first_name,
    NEW.last_name,
    NEW.created_at
  )
  ON CONFLICT (clerk_id) DO UPDATE SET
    user_email = EXCLUDED.user_email,
    user_firstname = EXCLUDED.user_firstname,
    user_lastname = EXCLUDED.user_lastname;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires after insert on clerk_users
DROP TRIGGER IF EXISTS clerk_user_to_user_accounts_trigger ON clerk_users;

CREATE TRIGGER clerk_user_to_user_accounts_trigger
  AFTER INSERT ON clerk_users
  FOR EACH ROW
  EXECUTE FUNCTION sync_clerk_user_to_user_accounts();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION sync_clerk_user_to_user_accounts() TO service_role;
GRANT EXECUTE ON FUNCTION sync_clerk_user_to_user_accounts() TO authenticated;

COMMENT ON FUNCTION sync_clerk_user_to_user_accounts() IS
  'Automatically syncs new clerk_users entries to user_accounts table';

COMMENT ON TRIGGER clerk_user_to_user_accounts_trigger ON clerk_users IS
  'Trigger that calls sync_clerk_user_to_user_accounts() after clerk user insert';
