<script setup lang="ts">
import VideoHoverCard from './VideoHoverCard.vue'

import cover1 from '@/images/video/image1.png'
import cover2 from '@/images/video/image2.png'
import cover3 from '@/images/video/image3.png'
import cover4 from '@/images/video/image4.png'
import video1 from '@/images/video/video1.mp4'
import video2 from '@/images/video/video2.mp4'
import video3 from '@/images/video/video3.mp4'
import video4 from '@/images/video/video4.mp4'

interface VideoItem {
  cover: string
  video: string
  title: string
}

const videoItems: VideoItem[] = [
  { cover: cover1, video: video1, title: '花境精灵 · 萤火流光' },
  { cover: cover2, video: video2, title: '砧板上的番茄切片' },
  { cover: cover3, video: video3, title: '花海漫步 · 粉色春日' },
  { cover: cover4, video: video4, title: '街巷边的写意少年' }
]
</script>

<template>
  <div class="video-gallery">
    <div class="grid-layout">
      <VideoHoverCard 
        v-for="(item, index) in videoItems" 
        :key="index"
        :cover="item.cover"
        :video="item.video"
        :title="item.title"
      />
    </div>
  </div>
</template>

<style scoped>
.video-gallery {
  width: 100%;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>
