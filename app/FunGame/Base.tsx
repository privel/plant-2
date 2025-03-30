import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Image, StyleSheet, Alert } from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");
const ICON_COUNT = 5; 
const potSize = 80;
const iconSize = 40;  
const potY = height - 100;  

const db = getFirestore();
const auth = getAuth();

const iconImages = [
  require("../../assets/images/flower.png"),
  require("../../assets/images/flower2.png"),
  require("../../assets/images/flower3.png"),
];

type IconProps = { id: number; left: number; speed: number; image: any };

const FallingIcon: React.FC<{ icon: IconProps; potX: Animated.SharedValue<number>; onCatch: (id: number) => void; onMiss: (id: number) => void }> = ({
  icon,
  potX,
  onCatch,
  onMiss,
}) => {
  const position = useSharedValue(-50);
  const opacity = useSharedValue(1);  
  const isCaught = useSharedValue(false);

  useEffect(() => {
    position.value = withTiming(
      potY - iconSize,
      { duration: icon.speed, easing: Easing.linear },
      (finished) => {
        if (finished && !isCaught.value) {
          const potLeft = potX.value;
          const potRight = potLeft + potSize;
          const iconLeft = icon.left;
          const iconRight = icon.left + iconSize;
  
          if (iconRight > potLeft && iconLeft < potRight) {
            isCaught.value = true;
            opacity.value = withTiming(0, { duration: 200 }, () => {
              runOnJS(onCatch)(icon.id);
            });
          } else {
            runOnJS(onMiss)(icon.id);
          }
        }
      }
    );
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      const potLeft = potX.value;
      const potRight = potLeft + potSize;
      const iconLeft = icon.left;
      const iconRight = icon.left + iconSize;

      if (!isCaught.value && position.value >= potY - iconSize) {
        if (iconRight > potLeft && iconLeft < potRight) {
          isCaught.value = true;
          opacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(onCatch)(icon.id);
          });
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
    opacity: opacity.value,  
  }));

  return (
    <Animated.View style={[{ position: "absolute", top: 0, left: icon.left }, animatedStyle]}>
      <Image source={icon.image} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
    </Animated.View>
  );
};

export default function MovePotGame() {
  const potX = useSharedValue(width / 2 - potSize / 2);
  const [icons, setIcons] = useState<IconProps[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (icons.length < ICON_COUNT) {
        setIcons((prev) => [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * (width - iconSize),
            speed: 2000 + Math.random() * 2000,
            image: iconImages[Math.floor(Math.random() * iconImages.length)], 
          },
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [icons]);

  const saveSeedToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const currentSeeds = userData?.seeds ?? 0;
    await updateDoc(userRef, { seeds: currentSeeds + 1 });
    Alert.alert("Поздравляем!", "Вы заработали 1 семечко 🌱");
  };

  const onCatch = (id: number) => {
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore >= 5) {
        saveSeedToFirestore();
        return 0;
      }
      return newScore;
    }); 
    setIcons((prev) => prev.filter((icon) => icon.id !== id));  
  };

  const onMiss = (id: number) => {
    setScore((prev) => Math.max(0, prev - 1));  
    setIcons((prev) => prev.filter((icon) => icon.id !== id));  
  };

  const animatedPotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: potX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.scoreText}>Очки: {score}</Text>

      <PanGestureHandler
        onGestureEvent={(event) => {
          potX.value = withTiming(
            Math.max(0, Math.min(width - potSize, event.nativeEvent.translationX + width / 2 - potSize / 2)),
            { duration: 50 }
          );
        }}
      >
        <View style={{ flex: 1 }}>
          {icons.map((icon) => (
            <FallingIcon key={icon.id} icon={icon} potX={potX} onCatch={onCatch} onMiss={onMiss} />
          ))}

          <Animated.View style={[{ position: "absolute", bottom: 30, left: 0 }, animatedPotStyle]}>
            <Image source={require("../../assets/images/gorshok.png")} style={{ width: potSize, height: potSize }} resizeMode="contain" />
          </Animated.View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scoreText: {
    color: "black",
    fontSize: 24,
    position: "absolute",
    top: 50,
    left: 20,
  },
});
