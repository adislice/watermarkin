<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { debounce } from "lodash";

const originalImage = ref<File | null>(null);
const parsedImage = ref<HTMLImageElement>();
const canvas = ref<HTMLCanvasElement | null>(null);
const wmText = ref<string>('');
const wmPosX = ref(2);
const wmPosY = ref(96);
const wmFontSize = ref(16);
const wmFontColor = ref('#000000');


function onImageSelected(evt: Event) {
  const target = evt?.target as HTMLInputElement;
  if (target == null) return;
  if (target.files == null) return;
  const image = target.files[0];
  originalImage.value = image;

  const img = new Image();
  img.src = URL.createObjectURL(image);
  img.onload = () => {
    parsedImage.value = img;
    drawImageAndText();
  }

}

function drawImageAndText() {
  if (parsedImage.value) {
    const ctx = canvas.value?.getContext('2d');
    if (ctx && canvas.value) {
      canvas.value.width = parsedImage.value.width;
      canvas.value.height = parsedImage.value.height;
      ctx.drawImage(parsedImage.value, 0, 0);
      let multiplier = canvas.value.height / canvas.value.clientHeight;
      const posX = canvas.value.width * (wmPosX.value / 100);
      const posY = canvas.value.height * (wmPosY.value / 100);
      ctx.font = `${wmFontSize.value * multiplier}px Arial`;
      ctx.fillStyle = wmFontColor.value;
      ctx.textAlign = 'left';
      // stroke
      var widetext = wmText.value;
      if (wmFontColor.value.replace('#', '').toLowerCase() == 'ffffff') {
        // widetext = wmText.value.split('').join(String.fromCharCode(8202));
        ctx.strokeStyle = '#222';
        ctx.lineWidth = wmFontSize.value / 9 * multiplier;
        ctx.strokeText(widetext, posX, posY);
      } else {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = wmFontSize.value / 9 * multiplier;
        ctx.strokeText(widetext, posX, posY);
      }
      ctx.fillText(widetext, posX, posY)
    }
  }

}

function downloadCanvas() {
  if (originalImage.value == null || canvas.value == null) return;
  var filenameextension = originalImage.value.name.replace(/^.*[\\\/]/, '');
  var filename = filenameextension.substring(0, filenameextension.lastIndexOf('.'));
  var ext = filenameextension.split('.').pop();
  var mime = ext == 'jpg' ? 'image/jpeg' : 'image/png';

  var a = document.createElement('a');
  a.href = canvas.value?.toDataURL(mime);
  a.download = `${filename}-watermark.${ext}`;
  document.body.appendChild(a);
  a.click();
}

function onCustomColorChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  const sanitize = value.replace('#', '');
  wmFontColor.value = '#' + sanitize;
}

const debouncedWatch = debounce(() => {
  drawImageAndText();
}, 100);

watch([wmText, wmPosX, wmPosY, wmFontSize, wmFontColor], debouncedWatch);

onBeforeUnmount(() => {
  debouncedWatch.cancel();
})

function matchColor(color: string) {
  return wmFontColor.value.toLowerCase() == color.toLowerCase();
}

</script>

<template>
  <div class="flex flex-col p-6 mx-auto">
    <img src="/img-placeholder.png" class="block lg:hidden rounded-lg mb-5 w-full" alt="">
    <h1 class="text-xl font-bold mb-4 text-gray-700">Watermark Dokumen</h1>
    <div class="flex flex-col lg:flex-row gap-14 pb-5">
      <div class="w-full lg:w-2/5">
        <p class=" text-neutral-600 mb-4">
          Tambah Watermark ke dokumen seperti ID Card, KTP, SIM, dan kartu
          lainnya untuk mengurangi penyalahgunaan data pribadi oleh orang-orang yang tidak bertanggung jawab.
        </p>
        <p class="mb-4 text-neutral-600">
          Mulai dengan memilih foto yang ingin diberi watermark dengan menekan tombol di
          bawah ini.
        </p>
        <form class="w-full">
          <div class="w-full mb-3">
            <label for="file-input" class="font-medium text-sm">Pilih Gambar</label>
            <input type="file" name="file-input" id="file-input"
              class="block cursor-pointer w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
              @change="onImageSelected" accept="image/*">

          </div>
          <div class="w-full mb-3">
            <label for="wmtext" class="font-medium text-sm">Text</label>
            <input type="text" id="wmtext"
              class="py-3 px-4 border block w-full shadow-sm border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Cth. Melamar Kerja - 20/07/2024" v-model="wmText">
          </div>
          <div class="w-full mb-3">
            <label for="wmcolor" class="font-medium text-sm">Warna</label>
            <div type="text" id="wmcolor" class="flex gap-2 flex-wrap">
              <button type="button" class="size-10 bg-white border rounded"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': matchColor('#FFFFFF') }"
                @click="() => wmFontColor = '#FFFFFF'"></button>
              <button type="button" class="size-10 bg-gray-900 border border-black rounded"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': matchColor('#111827') }"
                @click="() => wmFontColor = '#111827'"></button>
              <button type="button" class="size-10 bg-red-500 border border-red-500 rounded"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': matchColor('#EF4444') }"
                @click="() => wmFontColor = '#EF4444'"></button>
              <button type="button" class="size-10 bg-green-500 border border-green-500 rounded"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': matchColor('#22C55E') }"
                @click="() => wmFontColor = '#22C55E'"></button>
              <button type="button" class="size-10 bg-blue-500 border border-blue-500 rounded"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': matchColor('#3B82F6') }"
                @click="() => wmFontColor = '#3B82F6'"></button>
              <input type="text"
                class="py-2 px-4 border block w-0 min-w-40 grow border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="#888888" @change="onCustomColorChange">
            </div>
          </div>
          <div class="w-full mb-3">
            <label for="wmposx" class="font-medium text-sm">Posisi di Sumbu Horizontal (X)</label>
            <input type="range" id="wmposx"
              class="custom-slider w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              aria-orientation="horizontal" min="0" max="100" v-model="wmPosX" step="1">
          </div>
          <div class="w-full mb-3">
            <label for="wmposy" class="font-medium text-sm">Posisi di Sumbu Vertikal (Y)</label>
            <input type="range" id="wmposy"
              class="custom-slider w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              aria-orientation="horizontal" min="0" max="100" v-model="wmPosY" step="1">
          </div>
          <div class="w-full mb-3">
            <label for="wmfontsize" class="font-medium text-sm">Ukuran Font</label>
            <div class="bg-white border shadow-sm border-gray-200 rounded-lg dark:bg-neutral-700 dark:border-neutral-700"
             >
              <div class="w-full flex justify-between items-center gap-x-1">
                <input
                    class="py-3 px-4 block w-full shadow-sm border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    type="number" aria-roledescription="Number field" v-model="wmFontSize">
                <div
                  class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
                  <button type="button"
                    class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    aria-label="Decrease" @click="() => wmFontSize = wmFontSize - 1">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M5 12h14"></path>
                    </svg>
                  </button>
                  <button type="button"
                    class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    aria-label="Increase" @click="() => wmFontSize = wmFontSize + 1">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="w-full lg:w-3/5 flex flex-col">
        <div v-if="originalImage" class="w-full rounded-lg border-2 border-dashed border-gray-400 p-2">
          <canvas id="cv" v-if="originalImage" ref="canvas" class="w-full h-auto border"></canvas>
        </div>
        <div v-else class="lg:w-4/5 mx-auto rounded-lg shadow-xl border hidden lg:block">
          <div class="w-full aspect-video  rounded relative">
            <img src="/img-placeholder.png" class="rounded w-full" alt="Hero Image">
          </div>
        </div>
        <button type="button" v-if="parsedImage" @click="downloadCanvas"
          class="ms-auto mt-4 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none">
          Unduh Gambar
        </button>

        <div class="mt-16 p-4 lg:mx-10 bg-green-100 border-green-200 rounded-lg">
          <h5 class="font-medium">Perhatian</h5>
          <p>Semua proses pengeditan dilakukan di sisi client tanpa mengunggah file apapun ke server.</p>
        </div>

      </div>

    </div>

  </div>
</template>