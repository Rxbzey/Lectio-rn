import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface SplashScreenProps {
  isDark?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isDark = true }) => {
  const bg          = isDark ? '#080808' : '#ede3d4';
  const crossColor  = isDark ? 'rgba(236,231,219,0.72)' : 'rgba(0,0,0,0.72)';
  const crossShadow = isDark ? 'rgba(236,231,219,0.08)' : 'rgba(0,0,0,0.06)';
  const glowColor   = isDark ? '#c9a84c' : '#b8903a';
  const haloColor   = isDark ? 'rgba(201,168,76,0.12)' : 'rgba(184,144,58,0.10)';
  const haloShadow  = isDark ? '#c9a84c' : '#b8903a';
  // Entry fade
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryScale  = useRef(new Animated.Value(0.88)).current;

  // Cross outer glow pulse
  const glowPulse = useRef(new Animated.Value(0)).current;

  // Inner halo (mid glow ring)
  const haloPulse = useRef(new Animated.Value(0)).current;

  // Flame flicker – scale Y
  const flameScaleY = useRef(new Animated.Value(1)).current;
  const flameScaleX = useRef(new Animated.Value(1)).current;
  const flameOpacity = useRef(new Animated.Value(0.85)).current;

  // Flame rise
  const flameRise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entry animation
    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1, duration: 1100, useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(entryScale, {
        toValue: 1, duration: 1100, useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // 2. Cross glow – slow breathe
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1, duration: 2200, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(glowPulse, {
          toValue: 0, duration: 2200, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // 3. Inner halo – slightly offset from glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(haloPulse, {
          toValue: 1, duration: 1700, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(haloPulse, {
          toValue: 0, duration: 1700, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // 4. Flame flicker – fast organic Y scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameScaleY, {
          toValue: 1.18, duration: 320, useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(flameScaleY, {
          toValue: 0.88, duration: 280, useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(flameScaleY, {
          toValue: 1.10, duration: 350, useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(flameScaleY, {
          toValue: 0.94, duration: 300, useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();

    // 5. Flame X sway
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameScaleX, {
          toValue: 0.78, duration: 410, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(flameScaleX, {
          toValue: 1.06, duration: 390, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // 6. Flame opacity shimmer
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(flameOpacity, {
          toValue: 0.7, duration: 600, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // 7. Flame gentle rise loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameRise, {
          toValue: -5, duration: 700, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(flameRise, {
          toValue: 0, duration: 700, useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.55],
  });
  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });
  const haloOpacity = haloPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.10, 0.38],
  });
  const crossOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>

      {/* ── Outer ambient glow (large, soft) ── */}
      <Animated.View style={[
        styles.glowOuter,
        { opacity: glowOpacity, transform: [{ scale: glowScale }], shadowColor: glowColor },
      ]} />

      {/* ── Mid halo ring ── */}
      <Animated.View style={[styles.haloRing, { opacity: haloOpacity, backgroundColor: haloColor, shadowColor: haloShadow }]} />

      {/* ── Cross character ── */}
      <Animated.View style={[
        styles.crossWrap,
        {
          opacity: entryOpacity,
          transform: [{ scale: entryScale }],
        },
      ]}>
        <Animated.Text
          style={[
            styles.cross,
            { opacity: crossOpacity, color: crossColor, textShadowColor: crossShadow },
          ]}
        >
          ✝
        </Animated.Text>
      </Animated.View>

      {/* ── Flame group – positioned at cross intersection ── */}
      <Animated.View
        style={[
          styles.flameGroup,
          {
            opacity: entryOpacity,
            transform: [{ translateY: flameRise }],
          },
        ]}
      >
        {/* Outer flame glow */}
        <Animated.View style={[
          styles.flameGlowOuter,
          {
            opacity: flameOpacity,
            transform: [{ scaleX: flameScaleX }, { scaleY: flameScaleY }],
          },
        ]} />

        {/* Mid flame glow */}
        <Animated.View style={[
          styles.flameGlowMid,
          {
            opacity: flameOpacity,
            transform: [{ scaleX: flameScaleX }, { scaleY: flameScaleY }],
          },
        ]} />

        {/* Core flame – bright center */}
        <Animated.View style={[
          styles.flameCore,
          {
            opacity: flameOpacity,
            transform: [
              { scaleX: flameScaleX.interpolate({ inputRange: [0.78, 1.06], outputRange: [0.72, 1] }) },
              { scaleY: flameScaleY },
            ],
          },
        ]} />

        {/* Tip – tiny bright apex */}
        <Animated.View style={[
          styles.flameTip,
          { opacity: flameOpacity, transform: [{ translateY: flameRise }] },
        ]} />
      </Animated.View>

    </View>
  );
};

const CROSS_SIZE = 420;
// Cross intersection: roughly 38% from top of the glyph
const CROSS_CENTER_Y = -(CROSS_SIZE * 0.5) + (CROSS_SIZE * 0.38);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Outer ambient glow ── */
  glowOuter: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 110,
    elevation: 0,
    borderWidth: 0,
  },

  /* ── Mid halo ── */
  haloRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 55,
  },

  /* ── Cross wrapper ── */
  crossWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    fontSize: CROSS_SIZE,
    lineHeight: CROSS_SIZE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 38,
    fontFamily: 'serif',
  },

  /* ── Flame group – sits at cross center ── */
  flameGroup: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // shift up to cross intersection
    top: '50%',
    marginTop: CROSS_CENTER_Y + 60,
  },

  /* Outer flame glow – large orange */
  flameGlowOuter: {
    position: 'absolute',
    bottom: 0,
    width: 52,
    height: 74,
    borderRadius: 999,
    backgroundColor: 'rgba(201,100,20,0.22)',
    shadowColor: '#e07020',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.9,
    shadowRadius: 28,
  },

  /* Mid flame – amber */
  flameGlowMid: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(210,140,20,0.35)',
    shadowColor: '#f0a020',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },

  /* Core flame – bright gold/white */
  flameCore: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,220,120,0.85)',
    shadowColor: '#fff8d0',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  /* Tip – tiny apex dot */
  flameTip: {
    position: 'absolute',
    bottom: 32,
    width: 6,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,248,210,0.95)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
