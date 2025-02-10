// Reexport the native module. On web, it will be resolved to ProtoBufferModule.web.ts
// and on native platforms to ProtoBufferModule.ts
export { default } from "./src/ProtoBufferModule"
export * from "./src/ProtoBuffer.types"
