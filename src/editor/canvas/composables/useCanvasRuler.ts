import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { debounce } from '@/utils'

export function useCanvasRuler({ canvasRootRef, moveableRef }) {
  const editorStore = UseEditorStore()

  const { canvas } = storeToRefs(editorStore)

  const canvasWidth = toRef(canvas.value, 'width')
  const canvasHeight = toRef(canvas.value, 'height')

  const canvasStyle = computed(() => {
    return {
      width: canvasWidth.value + 'px',
      height: canvasHeight.value + 'px',
      backgroundColor: canvas.value.backgroundColor,
    }
  })

  const rectWidth = ref(1000)
  const rectHeight = ref(800)
  const lines = ref({ h: [], v: [] })
  const scale = ref(1)

  const palette = {
    bgColor: '#212329',
    longfgColor: '#6b7280',
    fontColor: '#9ca3af',
    fontShadowColor: '#0e8da7',
    shadowColor: 'rgba(14, 141, 167, 0.14)',
    lineColor: '#22c55e',
    lineType: 'solid',
    lockLineColor: '#4b5563',
    borderColor: '#374151',
    hoverBg: '#111827',
    hoverColor: '#ffffff',
  }

  const onRootResize = debounce((rect) => {
    rectWidth.value = rect.width
    rectHeight.value = rect.height
  }, 3000)

  onMounted(() => {
    const { width, height } = canvasRootRef.value.getBoundingClientRect()
    rectWidth.value = width
    rectHeight.value = height

    const ob = new ResizeObserver((entires) => {
      const entry = entires[0]
      const rect = entry.contentRect
      onRootResize(rect)
    })

    ob.observe(canvasRootRef.value)

    onUnmounted(() => {
      ob.disconnect()
    })
  })

  function onZoomChange() {
    moveableRef.value.updateRect()
  }

  return {
    canvasWidth,
    canvasHeight,
    canvasStyle,
    rectHeight,
    rectWidth,
    lines,
    scale,
    palette,
    onZoomChange,
  }
}
