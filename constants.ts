import { AspectRatio, CameraAngle, Direction } from './types';

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: '16:9 (Ngang)' },
  { value: '9:16', label: '9:16 (Dọc)' },
  { value: '1:1', label: '1:1 (Vuông)' },
  { value: '4:3', label: '4:3 (Cổ điển)' },
  { value: '3:4', label: '3:4 (Cổ điển dọc)' },
];

export const CAMERA_ANGLE_OPTIONS: { value: CameraAngle; label: string; prompt: string }[] = [
  { value: 'Default', label: 'Mặc định', prompt: '' },
  { value: 'Front View', label: 'Góc chính diện', prompt: ', cinematic front view shot' },
  { value: 'Angled View', label: 'Góc nghiêng', prompt: ', cinematic 3/4 angle shot' },
  { value: 'High Angle', label: 'Góc cao', prompt: ', cinematic high-angle shot from above' },
  { value: 'Low Angle', label: 'Góc thấp', prompt: ', cinematic low-angle shot from below' },
  { value: 'OverShoulder', label: 'Góc qua vai', prompt: ', over-the-shoulder shot' },
  { value: 'ExtremeLow', label: 'Góc cực thấp', prompt: ', cinematic extreme low-angle shot' },
  { value: 'ExtremeHigh', label: 'Góc siêu cao', prompt: ', cinematic extreme high-angle shot, bird\'s-eye view' },
];

export const DIRECTION_OPTIONS: { value: Direction; label: string; prompt: string }[] = [
  { value: 'Default', label: 'Mặc định', prompt: '' },
  { value: 'Left45', label: 'Nghiêng trái 45 độ', prompt: ', dutch angle, tilted 45 degrees to the left' },
  { value: 'Right45', label: 'Nghiêng phải 45 độ', prompt: ', dutch angle, tilted 45 degrees to the right' },
  { value: 'Behind', label: 'Sau lưng nhân vật', prompt: ', view from behind the character' },
  { value: 'TopDown', label: 'Trên trời nhìn xuống', prompt: ', top-down bird\'s-eye view' },
  { value: 'GroundUp', label: 'Dưới đất nhìn lên', prompt: ', worm\'s-eye view from the ground looking up' },
];