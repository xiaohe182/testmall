<script setup lang="ts">
import LongImgCard from './LongImgCard.vue'
import img1 from '@/images/longImg/long_img1.png'
import img2 from '@/images/longImg/long_img2.png'
import img3 from '@/images/longImg/long_img3.png'
import img4 from '@/images/longImg/long_img4.png'

const longImages = [
  { src: img1, title: '电商详情页设计展示' },
  { src: img2, title: '移动端 UI 界面全景' },
  { src: img3, title: '品牌视觉手册概览' },
  { src: img4, title: '创意插画长卷' }
]
</script>

<template>
  <div class="long-gallery">
    <div class="grid-layout">
      <LongImgCard 
        v-for="(item, index) in longImages" 
        :key="index"
        :src="item.src"
        :title="item.title"
      />
    </div>
  </div>
</template>

<style scoped>
.long-gallery {
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
