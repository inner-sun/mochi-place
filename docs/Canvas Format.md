- Pixels stored in [RLE](https://en.wikipedia.org/wiki/Run-length_encoding) with Coordinates
- Processed as `Uint8Array` on the client
- 16 colors palette (https://lospec.com/palette-list/pico-8)
## User payloads: PixelDiff
Each user payload sent over web socket contains an array of `PixelDiff`:
- pixel coordinates
- color index
`PixelDiff` will be in `Uint8Array` format to compress data as much as possible. The clients should do the compression/decompression.
