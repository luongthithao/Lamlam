import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<HeaderIcon />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Explore
        </ThemedText>
      </ThemedView>

      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      <RoutingSection />
      <PlatformSection />
      <ImagesSection />
      <ThemeSection />
      <AnimationSection />
    </ParallaxScrollView>
  );
}

/* ---------- Sub components ---------- */

function HeaderIcon() {
  return (
    <IconSymbol
      name="chevron.left.forwardslash.chevron.right"
      size={310}
      color="#808080"
      style={styles.headerImage}
    />
  );
}

function RoutingSection() {
  return (
    <Collapsible title="File-based routing">
      <ThemedText>
        This app has two screens:{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
      </ThemedText>

      <ThemedText>
        The layout file in{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
        sets up the tab navigator.
      </ThemedText>

      <ExternalLink href="https://docs.expo.dev/router/introduction">
        <ThemedText type="link">Learn more</ThemedText>
      </ExternalLink>
    </Collapsible>
  );
}

function PlatformSection() {
  return (
    <Collapsible title="Android, iOS, and web support">
      <ThemedText>
        You can run this project on Android, iOS, and the web. To open the web
        version, press{" "}
        <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal.
      </ThemedText>
    </Collapsible>
  );
}

function ImagesSection() {
  return (
    <Collapsible title="Images">
      <ThemedText>
        Use{" "}
        <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
        <ThemedText type="defaultSemiBold">@3x</ThemedText> image variants for
        different screen densities.
      </ThemedText>

      <Image
        source={require("@/assets/images/react-logo.png")}
        style={styles.image}
      />

      <ExternalLink href="https://reactnative.dev/docs/images">
        <ThemedText type="link">Learn more</ThemedText>
      </ExternalLink>
    </Collapsible>
  );
}

function ThemeSection() {
  return (
    <Collapsible title="Light and dark mode components">
      <ThemedText>
        This template supports light and dark mode. You can use{" "}
        <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> to adapt
        UI colors based on the user&apos;s preference.
      </ThemedText>

      <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
        <ThemedText type="link">Learn more</ThemedText>
      </ExternalLink>
    </Collapsible>
  );
}

function AnimationSection() {
  return (
    <Collapsible title="Animations">
      <ThemedText>
        The{" "}
        <ThemedText type="defaultSemiBold">
          components/HelloWave.tsx
        </ThemedText>{" "}
        file demonstrates animations using{" "}
        <ThemedText
          type="defaultSemiBold"
          style={{ fontFamily: Fonts.mono }}
        >
          react-native-reanimated
        </ThemedText>
        .
      </ThemedText>

      {Platform.OS === "ios" && (
        <ThemedText>
          The{" "}
          <ThemedText type="defaultSemiBold">
            ParallaxScrollView
          </ThemedText>{" "}
          component adds a parallax effect to the header.
        </ThemedText>
      )}
    </Collapsible>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  headerImage: {
    position: "absolute",
    bottom: -90,
    left: -35,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontFamily: Fonts.rounded,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
