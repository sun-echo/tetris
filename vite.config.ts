import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * TODO:
 * 1. Настроить ресолв импортов
 * 2. Прикрутить css modules
 * 3. ...
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
