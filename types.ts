// FIX: Removed extra file content markers from the original file.
export enum GenerationMode {
  New = 'new',
  Consistency = 'consistency',
  PoseReference = 'pose_reference',
  Setup = 'setup',
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export type CameraAngle = 'Default' | 'Front View' | 'Angled View' | 'High Angle' | 'Low Angle' | 'OverShoulder' | 'ExtremeLow' | 'ExtremeHigh';

export type Direction = 'Default' | 'Left45' | 'Right45' | 'Behind' | 'TopDown' | 'GroundUp';

export interface GenerationOptions {
  prompt: string;
  aspectRatio: AspectRatio;
  cameraAngle: CameraAngle;
  useGreenScreen: boolean;
  newReferenceImage?: {
    base64: string;
    mimeType: string;
  } | null;
  newReferenceImage2?: {
    base64: string;
    mimeType: string;
  } | null;
  direction?: Direction;
  // For Consistency/Pose
  referenceImage?: {
    base64: string;
    mimeType: string;
  } | null;
  characterReferenceImage?: {
    base64: string;
    mimeType: string;
  } | null;
  keepBackground?: boolean;
  // For Setup
  characterImages?: {
    base64: string;
    mimeType: string;
  }[];
  sceneImage?: {
    base64: string;
    mimeType: string;
  } | null;
}