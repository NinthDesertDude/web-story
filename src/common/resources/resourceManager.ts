export enum IUriMediaType {
  text,
  imageJpg,
  imagePng,
  imageSvg,
  audioMpeg,
  audioOgg,
  fontOtf,
}

/** The status of a resource and its data. */
export interface IResourceResult {
  /** The content of the asset if defined, stored as a base64 encoded string. */
  base64Data: string | undefined;

  /**
   * Whether the asset is loading. True if loading (false if idle even if loaded). If a loading error occurred, this
   * will be a string containing a relevant message.
   */
  isLoading: boolean | string;

  /** The original location of the resource. */
  url: string | undefined;
}

/** Tracks all images, sounds, and other files. */
export interface IResourceDictionary {
  [url: string]: IResourceResult;
}

/** The resources. */
export const resources: IResourceDictionary = {};
