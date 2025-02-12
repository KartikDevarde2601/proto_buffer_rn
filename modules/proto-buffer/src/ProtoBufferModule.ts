import { NativeModule, requireNativeModule } from "expo"
import { ProtoBufferModuleEvents, EncodeData } from "./ProtoBuffer.types"

declare class ProtoBufferModule extends NativeModule<ProtoBufferModuleEvents> {
  PI: number
  hello(): string
  setValueAsync(value: string): Promise<void>
  encode(params: EncodeData): Uint8Array
  decode(data: Uint8Array): Promise<EncodeData>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ProtoBufferModule>("ProtoBuffer")
