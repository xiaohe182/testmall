<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  src: string
  title: string
}>()

const containerRef = ref<HTMLDivElement>()
const imgRef = ref<HTMLImageElement>()
const translateY = ref(0)
const transitionStyle = ref('')

const SPEED = 65

let isAutoScrolling = false

function startScroll() {
  if (!imgRef.value || !containerRef.value || isAutoScrolling) return
  isAutoScrolling = true
  
  const imgHeight = imgRef.value.naturalHeight ? 
    (imgRef.value.clientWidth / imgRef.value.naturalWidth) * imgRef.value.naturalHeight : 
    imgRef.value.offsetHeight
    
  const containerHeight = containerRef.value.offsetHeight
  const maxScroll = Math.max(0, imgHeight - containerHeight)
  
  if (maxScroll <= 0) {
    isAutoScrolling = false
    return
  }

  const style = window.getComputedStyle(imgRef.value)
  const matrix = new ((window as any).DOMMatrix || (window as any).WebKitCSSMatrix)(style.transform)
  const currentPos = Math.abs(matrix.m42)
  const remainingDist = maxScroll - currentPos
  const duration = remainingDist / SPEED

  transitionStyle.value = `transform ${duration}s linear`
  translateY.value = -maxScroll
}

function resetScroll() {
  if (!imgRef.value) return
  isAutoScrolling = false
  
  const style = window.getComputedStyle(imgRef.value)
  const matrix = new ((window as any).DOMMatrix || (window as any).WebKitCSSMatrix)(style.transform)
  translateY.value = matrix.m42

  imgRef.value.offsetHeight

  transitionStyle.value = 'transform 0.3s ease-out'
  translateY.value = 0
}

function handleTouchStart() {
  startScroll()
}

function handleTouchEnd() {
  resetScroll()
}
</script>

<template>
  <div 
    ref="containerRef" 
    class="long-img-card"
    @mouseenter="startScroll"
    @mouseleave="resetScroll"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="img-container">
      <img 
        ref="imgRef"
        :src="src" 
        alt="" 
        class="scrolling-img"
        :style="{ 
          transform: `translateY(${translateY}px)`,
          transition: transitionStyle
        }"
        loading="lazy"
      />
    </div>
    <div class="card-info">
      <span class="card-tag">长图展示</span>
      <h3 class="card-title">{{ title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.long-img-card {
  position: relative;
  background: var(--card-bg);
  border: none;
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  transition: background-color var(--transition-normal), transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow var(--transition-normal);
  backdrop-filter: blur(16px);
  height: 350px;
  display: flex;
  flex-direction: column;
}

.long-img-card:hover {
  background: rgba(255, 255, 255, 0.035);
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    var(--card-shadow-hover),
    var(--card-glow-hover);
}

.img-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #000;
}

.scrolling-img {
  width: 100%;
  height: auto;
  display: block;
  will-change: transform;
  transform-origin: top;
}

.card-info {
  padding: 16px;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.9), transparent);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.card-tag {
  font-size: 10px;
  color: #1496f3;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
  display: block;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@supports not (transform: translateY(0)) {
  .scrolling-img {
    height: 100%;
    object-fit: cover;
  }
}
</style>
