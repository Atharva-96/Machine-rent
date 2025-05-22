"use client"

import { useState, useRef } from "react"
import { View, Image, StyleSheet, Dimensions, type FlatList, TouchableOpacity, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

type ImageCarouselProps = {
  images: string[]
  height?: number
}

export default function ImageCarousel({ images, height = 300 }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  // If no images provided, use a placeholder
  const displayImages = images.length > 0 ? images : ["https://placeholder.svg?height=300&width=300&text=No+Image"]

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    })
  }

  const renderItem = ({ item }: { item: string }) => (
    <View style={[styles.imageContainer, { height }]}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </View>
  )

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {displayImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>
    )
  }

  const renderArrows = () => {
    return (
      <>
        {activeIndex > 0 && (
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => handleDotPress(activeIndex - 1)}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        {activeIndex < displayImages.length - 1 && (
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => handleDotPress(activeIndex + 1)}>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </>
    )
  }

  return (
    <View style={[styles.container, { height }]}>
      <Animated.FlatList
        ref={flatListRef}
        data={displayImages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)
          setActiveIndex(newIndex)
        }}
      />

      {renderDots()}
      {renderArrows()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E88E5",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLeft: {
    left: 16,
  },
  arrowRight: {
    right: 16,
  },
})
