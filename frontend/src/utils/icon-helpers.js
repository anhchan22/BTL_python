import * as Icons from 'lucide-react';

/**
 * Icon size constants for consistent sizing across the application
 */
export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48
};

/**
 * Get an icon component and props object
 * @param {string} name - The icon name from lucide-react
 * @param {string} size - Size key from IconSize (default: 'md')
 * @param {string} color - Icon color (default: 'currentColor')
 * @param {number} strokeWidth - Stroke width for the icon (default: 2)
 * @returns {Object|null} Object with component and props, or null if icon not found
 */
export const getIcon = (name, size = 'md', color = 'currentColor', strokeWidth = 2) => {
  const Icon = Icons[name];
  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  return {
    component: Icon,
    props: {
      size: IconSize[size] || size,
      strokeWidth,
      color
    }
  };
};

/**
 * Helper to render an icon with default props
 * @param {string} name - Icon name from lucide-react
 * @param {Object} props - Props to override defaults
 * @returns {JSX.Element|null}
 */
export const renderIcon = (name, props = {}) => {
  const iconData = getIcon(name, props.size || 'md', props.color || 'currentColor', props.strokeWidth || 2);
  if (!iconData) return null;

  const Icon = iconData.component;
  return <Icon {...iconData.props} {...props} />;
};

/**
 * Lucide icon export map for easy reference
 * This can be used as a registry for available icons
 */
export const IconRegistry = {
  // Navigation
  Building2: 'Building2',
  Building: 'Building',
  Factory: 'Factory',
  User: 'User',
  Users: 'Users',
  Crown: 'Crown',
  Settings: 'Settings',
  LogOut: 'LogOut',

  // Documents & Lists
  Clipboard: 'Clipboard',
  FileText: 'FileText',
  BarChart3: 'BarChart3',
  Zap: 'Zap',

  // Status & Actions
  Check: 'Check',
  CheckCircle2: 'CheckCircle2',
  X: 'X',
  XCircle: 'XCircle',
  Mail: 'Mail',
  Info: 'Info',

  // Location & Time
  MapPin: 'MapPin',
  Calendar: 'Calendar',
  HourglassIcon: 'HourglassIcon',
  Clock: 'Clock',

  // Form & Input
  Camera: 'Camera',
  Trash2: 'Trash2',
  Lock: 'Lock',
  RefreshCw: 'RefreshCw',

  // Navigation Arrows
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',

  // Other
  Lightbulb: 'Lightbulb',
  AlertTriangle: 'AlertTriangle',
  Hand: 'Hand',
  Wrench: 'Wrench',
  Bell: 'Bell',
  Edit: 'Edit',
  Plus: 'Plus',
  DollarSign: 'DollarSign',
  Phone: 'Phone'
};
