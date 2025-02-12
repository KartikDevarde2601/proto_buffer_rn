import { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, ActivityIndicator } from "react-native"
import { Text, Screen, Button } from "@/components"
import { isRTL } from "@/i18n"
import { AppStackScreenProps } from "../navigators"
import { $styles, type ThemedStyle } from "@/theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"
import ProtoBufferModule from "modules/proto-buffer"
import { EncodeData } from "modules/proto-buffer"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

interface PerformanceMetrics {
  averageTime: number
  minTime: number
  maxTime: number
  totalRuns: number
  bytesProcessed: number
  protobyteSize: number
}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const { themed, theme } = useAppTheme()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const [isLoading, setIsLoading] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  const generateRandomData = (num: number) => {
    const randomData = []
    for (let i = 0; i < num; i++) {
      randomData.push({
        value: (Math.random() * 10 + 20).toFixed(1),
        timestamp: Math.random() * 1000,
      })
    }
    return randomData
  }

  const data: EncodeData = {
    sensor: "temperature",
    config: "celsius",
    freq: 1000,
    data: generateRandomData(10),
  }

  const runPerformanceTest = () => {
    setIsLoading(true)
    const testRuns = 10
    const times: number[] = []
    const bytesProcessed = new TextEncoder().encode(JSON.stringify(data)).length

    const bytes = encodeData(data)

    // Warmup runs
    for (let i = 0; i < 3; i++) {
      encodeData(data)
    }

    // Test runs
    for (let i = 0; i < testRuns; i++) {
      const start = performance.now()
      encodeData(data)
      const end = performance.now()
      times.push(end - start)
    }

    setMetrics({
      averageTime: Number((times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)),
      minTime: Number(Math.min(...times).toFixed(2)),
      maxTime: Number(Math.max(...times).toFixed(2)),
      totalRuns: testRuns,
      bytesProcessed,
      protobyteSize: bytes.length,
    })

    setIsLoading(false)
  }

  const encodeData = (data: EncodeData): Uint8Array => {
    return ProtoBufferModule.encode(data)
  }

  const renderMetrics = () => {
    if (!metrics) return null

    return (
      <View style={themed($metricsContainer)}>
        <Text style={themed($metricsTitle)} preset="subheading" text="Performance Results Async" />
        <Text preset="default" text={`Average Time: ${metrics.averageTime}ms`} />
        <Text preset="default" text={`Min Time: ${metrics.minTime}ms`} />
        <Text preset="default" text={`Max Time: ${metrics.maxTime}ms`} />
        <Text preset="default" text={`Total Runs: ${metrics.totalRuns}`} />
        <Text preset="default" text={`Bytes Processed: ${metrics.bytesProcessed}`} />
        <Text preset="default" text={`Proto bytes: ${metrics.protobyteSize}`} />
      </View>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($topContainer)}>
        <Image style={themed($welcomeLogo)} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          tx="welcomeScreen:readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen:exciting" preset="subheading" />
        <Image
          style={$welcomeFace}
          source={welcomeFace}
          resizeMode="contain"
          tintColor={theme.isDark ? theme.colors.palette.neutral900 : undefined}
        />
      </View>

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
        ) : (
          renderMetrics()
        )}
        <Button
          text={isLoading ? "Running Tests..." : "Run Performance Test"}
          onPress={runPerformanceTest}
          disabled={isLoading}
        />
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $metricsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  borderRadius: 8,
  gap: spacing.xs,
})

const $metricsTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
