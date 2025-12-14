-- Create or Update Admin User 'Satzz'
-- This script creates a user 'satzz@admin.com' with password 'Sathwik@2612'
-- and assigns them the 'admin' role.

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'satzz@admin.com';
  v_password TEXT := 'Sathwik@2612';
BEGIN
  -- Check if user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    -- Create new user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Satzz Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO v_user_id;
  ELSE
    -- Update existing user password
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf'))
    WHERE id = v_user_id;
  END IF;

  -- Ensure profile exists (Trigger might have handled it, but let's be safe)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (v_user_id, v_email, 'Satzz Admin')
  ON CONFLICT (id) DO NOTHING;

  -- Set role to admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

END $$;
