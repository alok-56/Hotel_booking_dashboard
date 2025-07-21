import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Palette, Save, RotateCcw } from 'lucide-react';

const SettingsScreen = () => {
  const { toast } = useToast();
  const [colorSettings, setColorSettings] = useState({
    primary: '#dc2626', // red-600
    primaryGlow: '#ef4444', // red-500
    secondary: '#374151', // gray-700
    accent: '#059669', // emerald-600
    background: '#f9fafb', // gray-50
    foreground: '#111827', // gray-900
    muted: '#f3f4f6', // gray-100
    border: '#e5e7eb', // gray-200
  });

  const [loading, setLoading] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('colorSettings');
    if (savedSettings) {
      try {
        setColorSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading color settings:', error);
      }
    }
  }, []);

  const handleColorChange = (colorKey: string, value: string) => {
    setColorSettings(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const applyColorSettings = () => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply CSS variables
    root.style.setProperty('--primary', hexToHsl(colorSettings.primary));
    root.style.setProperty('--primary-glow', hexToHsl(colorSettings.primaryGlow));
    root.style.setProperty('--secondary', hexToHsl(colorSettings.secondary));
    root.style.setProperty('--accent', hexToHsl(colorSettings.accent));
    root.style.setProperty('--background', hexToHsl(colorSettings.background));
    root.style.setProperty('--foreground', hexToHsl(colorSettings.foreground));
    root.style.setProperty('--muted', hexToHsl(colorSettings.muted));
    root.style.setProperty('--border', hexToHsl(colorSettings.border));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('colorSettings', JSON.stringify(colorSettings));
      
      // Apply the colors
      applyColorSettings();
      
      toast({
        title: "Settings Saved",
        description: "Color theme has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      primary: '#dc2626',
      primaryGlow: '#ef4444',
      secondary: '#374151',
      accent: '#059669',
      background: '#f9fafb',
      foreground: '#111827',
      muted: '#f3f4f6',
      border: '#e5e7eb',
    };
    
    setColorSettings(defaultSettings);
    localStorage.removeItem('colorSettings');
    
    // Reset CSS variables to default
    const root = document.documentElement;
    Object.keys(defaultSettings).forEach(key => {
      root.style.removeProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
    });
    
    toast({
      title: "Settings Reset",
      description: "Color theme has been reset to default.",
    });
  };

  // Apply colors on mount
  useEffect(() => {
    applyColorSettings();
  }, []);

  const colorOptions = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color used for buttons and accents' },
    { key: 'primaryGlow', label: 'Primary Glow', description: 'Lighter variant of primary color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary text and elements' },
    { key: 'accent', label: 'Accent Color', description: 'Success states and highlights' },
    { key: 'background', label: 'Background', description: 'Main background color' },
    { key: 'foreground', label: 'Foreground', description: 'Primary text color' },
    { key: 'muted', label: 'Muted Background', description: 'Subtle background for cards' },
    { key: 'border', label: 'Border Color', description: 'Border and divider color' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Customize your application theme and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Color Theme
          </CardTitle>
          <CardDescription>
            Customize the color scheme of your application. Changes will be applied immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <Label htmlFor={option.key}>{option.label}</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id={option.key}
                    type="color"
                    value={colorSettings[option.key as keyof typeof colorSettings]}
                    onChange={(e) => handleColorChange(option.key, e.target.value)}
                    className="w-16 h-10 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={colorSettings[option.key as keyof typeof colorSettings]}
                    onChange={(e) => handleColorChange(option.key, e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
          <CardDescription>
            Preview how your color changes will look in the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Preview buttons and elements */}
            <div className="flex space-x-4">
              <Button 
                style={{ 
                  backgroundColor: colorSettings.primary,
                  color: '#ffffff'
                }}
              >
                Primary Button
              </Button>
              <Button 
                variant="outline"
                style={{ 
                  borderColor: colorSettings.primary,
                  color: colorSettings.primary
                }}
              >
                Outline Button
              </Button>
              <Button 
                variant="secondary"
                style={{ 
                  backgroundColor: colorSettings.muted,
                  color: colorSettings.foreground
                }}
              >
                Secondary Button
              </Button>
            </div>
            
            {/* Preview card */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: colorSettings.background,
                borderColor: colorSettings.border,
                color: colorSettings.foreground
              }}
            >
              <h3 className="font-semibold mb-2">Sample Card</h3>
              <p style={{ color: colorSettings.secondary }}>
                This is how your content will look with the selected colors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Additional configuration options for your hotel management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode (Coming Soon)</Label>
                <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
              </div>
              <Button variant="outline" disabled>
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode (Coming Soon)</Label>
                <p className="text-sm text-gray-500">Reduce spacing and padding for more compact view</p>
              </div>
              <Button variant="outline" disabled>
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Multi-language Support (Coming Soon)</Label>
                <p className="text-sm text-gray-500">Support for multiple languages</p>
              </div>
              <Button variant="outline" disabled>
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsScreen;