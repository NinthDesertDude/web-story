/** Decodes a base-64 encoded string. */
export function fromBase64(input: string) {
  // TODO: implement
  return "";
}

/** Encodes a string to use base-64 encoding. */
export function toBase64(input: string): string {
  // TODO: implement
  return "";
}

export enum IUriMediaType {
  text,
  imageJpg,
  imagePng,
  imageSvg,

  /** The  */
  audioMpeg,

  /** The OGG audio format. Media type is: audio/ogg */
  audioOgg,

  /** An opentype font. Media type is: font/opentype */
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
