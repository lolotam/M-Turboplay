-- Create system_settings table for storing admin configurations securely
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON stringified value
  description TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings
-- Only admins can view settings
CREATE POLICY "Admins can view system settings" ON system_settings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Only admins can insert/update settings
CREATE POLICY "Admins can manage system settings" ON system_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Add trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial empty settings if not exist (optional, or handled by app)
-- keys will be: 'growgarden-admin-settings' matches the local storage key used currently
