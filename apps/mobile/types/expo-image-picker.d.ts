// Stub type declarations for expo-image-picker.
// HUMAN_REQUIRED: Install expo-image-picker before building:
//   pnpm --filter mobile add expo-image-picker
// Also add permissions to app.json:
//   iOS: NSPhotoLibraryUsageDescription, NSCameraUsageDescription
//   Android: READ_EXTERNAL_STORAGE, READ_MEDIA_IMAGES (API 33+)

declare module "expo-image-picker" {
  export interface ImagePickerAsset {
    uri: string;
    width: number;
    height: number;
    type?: "image" | "video";
    fileName?: string | null;
    fileSize?: number | null;
    exif?: Record<string, unknown> | null;
    base64?: string | null;
  }

  export interface ImagePickerResult {
    canceled: boolean;
    assets: ImagePickerAsset[];
  }

  export interface ImagePickerOptions {
    mediaTypes?: MediaTypeOptions;
    allowsEditing?: boolean;
    quality?: number;
    base64?: boolean;
    exif?: boolean;
    allowsMultipleSelection?: boolean;
  }

  export interface PermissionResponse {
    granted: boolean;
    status: "granted" | "denied" | "undetermined";
    canAskAgain: boolean;
  }

  export enum MediaTypeOptions {
    All = "All",
    Videos = "Videos",
    Images = "Images",
  }

  export function launchImageLibraryAsync(
    options?: ImagePickerOptions
  ): Promise<ImagePickerResult>;

  export function launchCameraAsync(
    options?: ImagePickerOptions
  ): Promise<ImagePickerResult>;

  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function requestCameraPermissionsAsync(): Promise<PermissionResponse>;
  export function getMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function getCameraPermissionsAsync(): Promise<PermissionResponse>;
}
