<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { useI18nStore } from '@/stores/i18n.store'

const i18nStore = useI18nStore()
const { t } = i18nStore
const canvasRef = ref<HTMLCanvasElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
let animationFrameId: number
const particles: THREE.Mesh[] = []

const mouse = new THREE.Vector2()
const targetMouse = new THREE.Vector2()
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const onMouseMove = (event: MouseEvent) => {
  targetMouse.x = (event.clientX - windowHalfX) * 0.001
  targetMouse.y = (event.clientY - windowHalfY) * 0.001
}

const initThree = () => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 50

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const geometry = new THREE.IcosahedronGeometry(1, 0)
  
  // Mix of Acid Lime and Ember Orange
  const colors = [0xC8FF00, 0xFF5E1A]

  for (let i = 0; i < 200; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const material = new THREE.MeshBasicMaterial({ 
      color, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    
    mesh.position.x = (Math.random() - 0.5) * 100
    mesh.position.y = (Math.random() - 0.5) * 100
    mesh.position.z = (Math.random() - 0.5) * 100
    
    mesh.rotation.x = Math.random() * Math.PI
    mesh.rotation.y = Math.random() * Math.PI
    
    const scale = Math.random() * 2 + 0.5
    mesh.scale.set(scale, scale, scale)
    
    scene.add(mesh)
    particles.push(mesh)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onWindowResize)
  
  animate()
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  mouse.x += (targetMouse.x - mouse.x) * 0.05
  mouse.y += (targetMouse.y - mouse.y) * 0.05

  camera.position.x += (mouse.x * 20 - camera.position.x) * 0.05
  camera.position.y += (-mouse.y * 20 - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  particles.forEach((mesh) => {
    mesh.rotation.x += 0.002
    mesh.rotation.y += 0.002
  })

  renderer.render(scene, camera)
}

onMounted(() => {
  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initThree()
  }

  // GSAP Animations
  if (titleRef.value) {
    const chars = titleRef.value.querySelectorAll('span')
    gsap.from(chars, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.2
    })
  }

  if (ctaRef.value) {
    gsap.from(ctaRef.value, {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.9
    })
  }
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onWindowResize)
  
  particles.forEach(p => {
    p.geometry.dispose()
    if (Array.isArray(p.material)) p.material.forEach(m => m.dispose())
    else p.material.dispose()
  })
  renderer?.dispose()
})
</script>

<template>
  <section class="relative w-full h-screen overflow-hidden bg-[var(--color-bg-base)] flex items-center justify-center">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 z-0 pointer-events-none"></canvas>
    
    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
      <h1 ref="titleRef" class="font-display text-[clamp(60px,10vw,140px)] leading-none tracking-tight text-[var(--color-text-primary)] mb-6 overflow-hidden flex flex-wrap justify-center">
        <template v-for="(char, idx) in t('home.title').split('')" :key="idx">
          <span v-if="char === ' '" class="w-4 md:w-8"></span>
          <span v-else>{{ char }}</span>
        </template>
      </h1>
      
      <p class="font-body text-lg md:text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto">
        {{ t('home.subtitle') }}
      </p>
      
      <div ref="ctaRef" class="flex flex-col sm:flex-row items-center gap-4">
        <router-link to="/shop" class="px-8 py-4 bg-[var(--color-accent-primary)] text-black font-bold font-display tracking-widest text-xl rounded-[var(--radius-sm)] hover:brightness-110 shadow-[var(--shadow-glow-accent)] transition-all">
          {{ t('home.shopNow') }}
        </router-link>
        <router-link to="/about" class="px-8 py-4 bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold font-display tracking-widest text-xl rounded-[var(--radius-sm)] hover:border-[var(--color-border-hover)] transition-all">
          {{ t('home.explore') }}
        </router-link>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce opacity-70">
      <span class="text-[10px] font-mono tracking-widest uppercase text-[var(--color-text-secondary)]">{{ t('home.scroll') }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" class="text-[var(--color-text-secondary)]"><path fill="currentColor" d="M205.66 117.66a8 8 0 0 1-11.32 0L128 51.31L61.66 117.66a8 8 0 0 1-11.32-11.32l72-72a8 8 0 0 1 11.32 0l72 72a8 8 0 0 1 0 11.32Zm-144 32l72 72a8 8 0 0 0 11.32 0l72-72a8 8 0 0 0-11.32-11.32L128 204.69l-66.34-66.35a8 8 0 0 0-11.32 11.32Z"/></svg>
    </div>
  </section>
</template>
